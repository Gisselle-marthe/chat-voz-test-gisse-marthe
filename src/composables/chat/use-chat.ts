import { computed, onMounted, readonly, type DeepReadonly, type Ref } from "vue"
import { useChatStore } from "@/stores/chat"
import { useBroadcastChannel } from "@/composables/core/use-broadcast-channel"
import { useToast } from "@/composables/core/use-toast"
import { type ChatMessage, type ChatRoom } from "@/domain/entities/chat"
import { generateUUID } from "../common/use-common"
import { UserType } from "@/domain/entities/user"
import { useAuth } from "../auth/use-auth"

const DEFAULT_ROOM_ID = "general-room"
const DEFAULT_ROOM_NAME = "Sala General"

export interface ChatComposable {
  messages: DeepReadonly<Ref<ChatMessage[]>>
  currentRoom: DeepReadonly<Ref<ChatRoom | null>>
  rooms: DeepReadonly<Ref<ChatRoom[]>>
  isLoading: Readonly<Ref<boolean>>
  error: Readonly<Ref<string | null>>
  isConnected: Readonly<Ref<boolean>>
  currentRoomMessages: DeepReadonly<Ref<ChatMessage[]>>
  totalMessages: Readonly<Ref<number>>
  sendMessage: (transcript: string, audioBlob: Blob, duration: number) => Promise<boolean>
  deleteMessage: (messageId: string) => Promise<void>
  clearChat: () => Promise<void>
  joinRoom: (roomId: string) => Promise<void>
  createRoom: (name: string) => Promise<ChatRoom>
  leaveRoom: () => Promise<void>
  switchRoom: (roomId: string) => Promise<void>
}

let handlersBound = false
let initOnce = false
let onNewMessageRef: ((data: { message: ChatMessage }) => void) | null = null
let onRoomJoinedRef: ((d: { roomId: string; userId: string; nickname?: string }) => void) | null =
  null
let onRoomLeftRef: ((d: { roomId: string; userId: string; nickname?: string }) => void) | null =
  null
let onRoomCreatedRef: ((d: { roomId: string; roomName: string; userId: string }) => void) | null =
  null

export const useChat = (): ChatComposable => {
  const chatStore = useChatStore()
  const toast = useToast()
  const { user } = useAuth()
  const bc = useBroadcastChannel("voice-chat")

  const meId = computed(() => user.value?.id ?? null)

  const messages = readonly(computed(() => chatStore.messages))
  const currentRoom = readonly(computed(() => chatStore.currentRoom))
  const rooms = readonly(computed(() => chatStore.rooms))
  const isLoading = readonly(computed(() => chatStore.isLoading))
  const error = readonly(computed(() => chatStore.error))
  const isConnected = readonly(computed(() => bc.isConnected.value))
  const totalMessages = readonly(computed(() => chatStore.totalMessages))
  const currentRoomMessages = readonly(computed(() => chatStore.currentRoomMessages))

  const addSystemMessage = (roomId: string, text: string) => {
    const msg: ChatMessage = {
      id: generateUUID(),
      transcript: text,
      audioBlob: new Blob([], { type: "audio/wav" }),
      duration: 0,
      user: { id: "system", nickname: "Sistema", email: "system@local", userType: UserType.SYSTEM },
      timestamp: new Date(),
      roomId,
    }
    chatStore.addMessage(msg)
  }

  const createWelcomeMessage = () => {
    if (!chatStore.currentRoom) return
    addSystemMessage(chatStore.currentRoom.id, `¡Bienvenido a ${chatStore.currentRoom.name}!`)
  }

  const ensureDefaultRoom = async () => {
    const exists = chatStore.rooms.find(r => r.id === DEFAULT_ROOM_ID)
    if (!exists) {
      chatStore.addRoom({
        id: DEFAULT_ROOM_ID,
        name: DEFAULT_ROOM_NAME,
        createdAt: new Date(),
        lastActivity: new Date(),
        participants: [],
      })
    }
  }

  function ensureHandlerRefs() {
    if (onNewMessageRef) return

    onNewMessageRef = data => {
      if (!data?.message) return
      if (data.message.roomId !== chatStore.currentRoom?.id) return
      const received = {
        ...data.message,
        sender: data.message.user.id === meId.value ? "own" : "other",
      } as ChatMessage & { sender?: "own" | "other" }
      chatStore.addMessage(received)
      if (data.message.user.id !== meId.value && chatStore.currentRoom) {
        toast.info(`💬 Nuevo mensaje en ${chatStore.currentRoom.name}`)
      }
    }

    onRoomJoinedRef = d => {
      if (!d?.roomId) return
      if (d.roomId !== chatStore.currentRoom?.id) return
      if (d.userId === meId.value) return
      addSystemMessage(d.roomId, `${d.nickname || "Un usuario"} se unió a la sala.`)
    }

    onRoomLeftRef = d => {
      if (!d?.roomId) return
      if (d.roomId !== chatStore.currentRoom?.id) return
      if (d.userId === meId.value) return
      addSystemMessage(d.roomId, `${d.nickname || "Un usuario"} salió de la sala.`)
    }

    onRoomCreatedRef = d => {
      if (!d?.roomId) return
      const room: ChatRoom = {
        id: d.roomId,
        name: d.roomName,
        createdAt: new Date(),
        lastActivity: new Date(),
        participants: [d.userId],
      }
      chatStore.addRoom(room)
      toast.info(`🏠 Nueva sala: ${d.roomName}`)
    }
  }

  function setupChannelHandlers() {
    if (handlersBound) return
    ensureHandlerRefs()

    bc.onMessage("NEW_MESSAGE", onNewMessageRef!)
    bc.onMessage("ROOM_JOINED", onRoomJoinedRef!)
    bc.onMessage("ROOM_LEFT", onRoomLeftRef!)
    bc.onMessage("ROOM_CREATED", onRoomCreatedRef!)

    handlersBound = true
  }

  const waitForConnected = () =>
    new Promise<void>(resolve => {
      if (bc.isConnected.value) return resolve()
      let tries = 0
      const id = setInterval(() => {
        if (bc.isConnected.value || ++tries > 50) {
          clearInterval(id)
          resolve()
        }
      }, 40)
    })

  const initialize = async () => {
    if (initOnce) return
    initOnce = true

    chatStore.setLoading(true)
    try {
      await chatStore.loadPersistedData()
      await ensureDefaultRoom()

      setupChannelHandlers()

      await waitForConnected()
      if (chatStore.currentRoom) {
        bc.joinRoom(chatStore.currentRoom.id)
      } else {
        const room = chatStore.rooms.find(r => r.id === DEFAULT_ROOM_ID)!
        chatStore.setCurrentRoom(room)
        await joinRoom(DEFAULT_ROOM_ID)
      }

      if (chatStore.currentRoomMessages.length === 0) createWelcomeMessage()
      chatStore.setInitialized(true)
    } catch {
      chatStore.setError("Error al inicializar el chat")
      toast.error("Error al inicializar el chat")
    } finally {
      chatStore.setLoading(false)
    }
  }

  const sendMessage = async (transcript: string, audioBlob: Blob, duration: number) => {
    if (!chatStore.currentRoom || !user.value) {
      toast.error("No hay sala activa o usuario no autenticado")
      return false
    }
    try {
      const message: ChatMessage = {
        id: generateUUID(),
        transcript,
        audioBlob,
        duration,
        user: {
          id: user.value.id,
          nickname: user.value.nickname,
          email: user.value.email,
          userType: user.value.userType,
        },
        timestamp: new Date(),
        roomId: chatStore.currentRoom.id,
      }
      chatStore.addMessage(message)
      if (isConnected.value) {
        const ok = await bc.sendVoiceMessage(message)
        if (!ok) toast.warning("Mensaje local; no se pudo enviar")
      } else {
        toast.warning("Sin BroadcastChannel; mensaje solo local")
      }
      return true
    } catch {
      toast.error("Error al enviar mensaje")
      return false
    }
  }

  const deleteMessage = async (messageId: string) => {
    try {
      chatStore.removeMessage(messageId)
      toast.success("Mensaje eliminado")
    } catch {
      toast.error("Error al eliminar mensaje")
    }
  }

  const clearChat = async () => {
    try {
      if (chatStore.currentRoom) {
        chatStore.clearMessages(chatStore.currentRoom.id)
        toast.success("Chat limpiado")
      }
    } catch {
      toast.error("Error al limpiar chat")
    }
  }

  const joinRoom = async (roomId: string) => {
    if (!user.value) return
    const room = chatStore.rooms.find(r => r.id === roomId)
    if (!room) {
      toast.error("Sala no encontrada")
      return
    }

    if (chatStore.currentRoom && isConnected.value) {
      bc.leaveRoom(chatStore.currentRoom.id)
      chatStore.leaveRoom(chatStore.currentRoom.id, user.value.id)
    }

    chatStore.joinRoom(roomId, user.value.id)
    chatStore.setCurrentRoom(room)
    if (isConnected.value) bc.joinRoom(roomId)
    toast.success(`Te uniste a ${room.name}`)
  }

  const createRoom = async (name: string): Promise<ChatRoom> => {
    const room: ChatRoom = {
      id: `room-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      name,
      createdAt: new Date(),
      lastActivity: new Date(),
      participants: [],
    }
    chatStore.addRoom(room)
    toast.success(`Sala "${name}" creada`)
    return room
  }

  const leaveRoom = async () => {
    if (!chatStore.currentRoom || !user.value) return
    const roomId = chatStore.currentRoom.id
    chatStore.leaveRoom(roomId, user.value.id)
    chatStore.setCurrentRoom(null)
    if (isConnected.value) bc.leaveRoom(roomId)
    toast.info("Saliste de la sala")
  }

  const switchRoom = async (roomId: string) => {
    await joinRoom(roomId)
  }

  onMounted(() => {
    initialize()
  })

  return {
    messages,
    currentRoom,
    rooms,
    isLoading,
    error,
    isConnected,
    currentRoomMessages,
    totalMessages,
    sendMessage,
    deleteMessage,
    clearChat,
    joinRoom,
    createRoom,
    leaveRoom,
    switchRoom,
  }
}
