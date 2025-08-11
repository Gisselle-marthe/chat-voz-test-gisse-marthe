import { ref, onMounted, readonly, computed } from "vue"
import { useAuthStore } from "@/stores/auth"
import type { ChatMessage } from "@/domain/entities/chat"
import { fromWirePayloadToBlob, toWirePayload } from "../audio/use-audio"

export type BroadcastMessage = {
  type:
    | "NEW_MESSAGE"
    | "MESSAGE_RECEIVED"
    | "TYPING"
    | "ONLINE_STATUS"
    | "ROOM_JOINED"
    | "ROOM_LEFT"
    | "ROOM_CREATED"
    | "PRESENCE_REQUEST"
  data: any
  timestamp: number
  senderId: string
  sessionId: string
  roomId?: string
}

const CHANNEL_DEFAULT = "voice-chat"

const onlineUsersRef = ref<Map<string, Set<string>>>(new Map())
const lastMessageRef = ref<BroadcastMessage | null>(null)

let globalChannel: BroadcastChannel | null = null
let globalIsConnected = false
const globalHandlers = new Map<string, Set<(data: any) => void>>()
const globalOnlineUsers = new Map<string, Set<string>>()

export function useBroadcastChannel(channelName: string = CHANNEL_DEFAULT) {
  const authStore = useAuthStore()

  const isConnected = ref(false)
  const lastMessage = lastMessageRef
  const onlineUsers = onlineUsersRef

  const sessionId = ref(`session-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`)
  const currentRoomId = ref<string | null>(null)

  const currentUserId = computed(() => authStore.user?.id || `guest-${sessionId.value}`)

  const othersOnline = computed(() => {
    const me = currentUserId.value
    const map = new Map(onlineUsersRef.value)
    if (me) map.delete(me)
    return map
  })

  function dispatchLocal(type: BroadcastMessage["type"], data: any) {
    const handlers = globalHandlers.get(type)
    if (handlers)
      handlers.forEach(h => {
        try {
          h(data)
        } catch {}
      })
  }

  function post(
    type: BroadcastMessage["type"],
    data: any,
    roomId?: string,
    echoSelf: boolean = false,
  ) {
    const msg: BroadcastMessage = {
      type,
      data,
      timestamp: Date.now(),
      senderId: currentUserId.value,
      sessionId: sessionId.value,
      roomId: roomId || currentRoomId.value || undefined,
    }
    if (globalChannel && globalIsConnected) {
      try {
        globalChannel.postMessage(msg)
      } catch {}
    }
    if (echoSelf) dispatchLocal(type, data)
  }

  function connect() {
    if (globalChannel && globalIsConnected) {
      isConnected.value = true
      onlineUsers.value = new Map(globalOnlineUsers)
      return
    }
    try {
      globalChannel = new BroadcastChannel(channelName)
      globalIsConnected = true
      isConnected.value = true
      globalChannel.onmessage = ev => handle(ev.data as BroadcastMessage)

      post("ONLINE_STATUS", {
        status: "online",
        userId: currentUserId.value,
        sessionId: sessionId.value,
        roomId: currentRoomId.value,
        nickname: authStore.user?.nickname || "Usuario Anónimo",
      })

      if (!globalOnlineUsers.has(currentUserId.value)) {
        globalOnlineUsers.set(currentUserId.value, new Set())
      }
      globalOnlineUsers.get(currentUserId.value)!.add(sessionId.value)
      onlineUsers.value = new Map(globalOnlineUsers)
    } finally {
      post("PRESENCE_REQUEST", {
        requesterId: currentUserId.value,
        requesterSessionId: sessionId.value,
      })
    }
  }

  function disconnect() {
    if (!globalChannel || !globalIsConnected) return

    if (currentRoomId.value) {
      post(
        "ROOM_LEFT",
        {
          userId: currentUserId.value,
          sessionId: sessionId.value,
          roomId: currentRoomId.value,
          nickname: authStore.user?.nickname || "Usuario Anónimo",
        },
        currentRoomId.value,
        true,
      )
      currentRoomId.value = null
    }

    try {
      post("ONLINE_STATUS", {
        status: "offline",
        userId: currentUserId.value,
        sessionId: sessionId.value,
        roomId: currentRoomId.value,
      })
    } catch {}

    const mySessions = globalOnlineUsers.get(currentUserId.value)
    if (mySessions) {
      mySessions.delete(sessionId.value)
      if (mySessions.size === 0) globalOnlineUsers.delete(currentUserId.value)
    }
    onlineUsers.value = new Map(globalOnlineUsers)

    globalChannel.close()
    globalChannel = null
    globalIsConnected = false
    isConnected.value = false
  }

  function handle(message: BroadcastMessage) {
    if (message.sessionId === sessionId.value) return

    lastMessageRef.value = message

    if (message.type === "PRESENCE_REQUEST") {
      post("ONLINE_STATUS", {
        status: "online",
        userId: currentUserId.value,
        sessionId: sessionId.value,
        roomId: currentRoomId.value,
        nickname: authStore.user?.nickname || "Usuario Anónimo",
      })
      return
    }

    if (message.type === "ONLINE_STATUS") {
      if (message.data.status === "online") {
        if (!globalOnlineUsers.has(message.data.userId)) {
          globalOnlineUsers.set(message.data.userId, new Set())
        }
        globalOnlineUsers.get(message.data.userId)!.add(message.data.sessionId)
      } else {
        const userSessions = globalOnlineUsers.get(message.data.userId)
        if (userSessions) {
          userSessions.delete(message.data.sessionId)
          if (userSessions.size === 0) globalOnlineUsers.delete(message.data.userId)
        }
      }
      onlineUsers.value = new Map(globalOnlineUsers)
    }

    if (message.type === "NEW_MESSAGE" && message.data?.message) {
      const chatMessage = message.data.message as ChatMessage & { wire?: any }
      if (!chatMessage.audioBlob && message.data?.wire) {
        try {
          const blob = fromWirePayloadToBlob(message.data.wire)
          chatMessage.audioBlob = blob
        } catch {
          chatMessage.audioBlob = new Blob([], { type: "audio/wav" })
        }
      }
      if (!chatMessage.roomId && message.roomId) chatMessage.roomId = message.roomId
    }

    const handlers = globalHandlers.get(message.type)
    if (handlers)
      handlers.forEach(h => {
        try {
          h(message.data)
        } catch {}
      })
  }

  async function sendVoiceMessage(message: ChatMessage) {
    if (!globalChannel || !globalIsConnected) return false
    if (!authStore.user) return false
    try {
      const data: any = { message }
      if (!(message.audioBlob instanceof Blob)) {
        data.wire = await toWirePayload(message.audioBlob)
        data.message = { ...message, audioBlob: undefined }
      }
      post("NEW_MESSAGE", data, message.roomId)
      return true
    } catch {
      return false
    }
  }

  function joinRoom(roomId: string) {
    currentRoomId.value = roomId
    post(
      "ROOM_JOINED",
      {
        userId: currentUserId.value,
        sessionId: sessionId.value,
        roomId,
        nickname: authStore.user?.nickname || "Usuario Anónimo",
      },
      roomId,
      true,
    )
  }

  function leaveRoom(roomId: string) {
    post(
      "ROOM_LEFT",
      {
        userId: currentUserId.value,
        sessionId: sessionId.value,
        roomId,
        nickname: authStore.user?.nickname || "Usuario Anónimo",
      },
      roomId,
      true,
    )
    if (currentRoomId.value === roomId) currentRoomId.value = null
  }

  function createRoom(roomId: string, roomName: string) {
    post(
      "ROOM_CREATED",
      {
        userId: currentUserId.value,
        sessionId: sessionId.value,
        roomId,
        roomName,
        nickname: authStore.user?.nickname || "Usuario Anónimo",
      },
      roomId,
      true,
    )
  }

  function send(type: BroadcastMessage["type"], data: any, roomId?: string) {
    post(type, data, roomId)
  }

  function onMessage(type: BroadcastMessage["type"], handler: (data: any) => void) {
    if (!globalHandlers.has(type)) globalHandlers.set(type, new Set())
    globalHandlers.get(type)!.add(handler)
  }

  function offMessage(type: BroadcastMessage["type"], handler?: (data: any) => void) {
    if (!globalHandlers.has(type)) return
    if (handler) globalHandlers.get(type)!.delete(handler)
    else globalHandlers.get(type)!.clear()
  }

  function getOnlineUsersInRoom(_roomId: string): Map<string, Set<string>> {
    return new Map(globalOnlineUsers)
  }

  const totalOnlineUsers = computed(() => globalOnlineUsers.size)
  function isUserOnline(userId: string): boolean {
    return globalOnlineUsers.has(userId) && globalOnlineUsers.get(userId)!.size > 0
  }

  onMounted(() => {
    if (authStore.user) {
      connect()
    } else {
      const stop = authStore.$subscribe((_m, state) => {
        if (state.user) {
          connect()
          stop()
        }
      })
    }
    window.addEventListener(
      "beforeunload",
      () => {
        disconnect()
      },
      { once: true },
    )
  })

  return {
    isConnected,
    lastMessage,
    onlineUsers,
    othersOnline,
    currentUserId: readonly(currentUserId),
    sessionId: readonly(sessionId),
    currentRoomId: readonly(currentRoomId),
    totalOnlineUsers,
    connect,
    disconnect,
    send,
    sendVoiceMessage,
    onMessage,
    offMessage,
    joinRoom,
    leaveRoom,
    createRoom,
    getOnlineUsersInRoom,
    isUserOnline,
    post,
  }
}
