import { defineStore } from "pinia"
import type { ChatMessage, ChatRoom, ChatState } from "@/domain/entities/chat"

const STORAGE_KEYS = {
  MESSAGES: "chat_messages",
  ROOMS: "chat_rooms",
  CURRENT_ROOM: "chat_current_room",
} as const

export const useChatStore = defineStore("chat", {
  state: (): ChatState => ({
    messages: [],
    currentRoom: null,
    rooms: [],
    isLoading: false,
    error: null,
    isInitialized: false,
  }),

  getters: {
    currentRoomMessages: (state): ChatMessage[] => {
      if (!state.currentRoom) return []
      return state.messages.filter(m => m.roomId === state.currentRoom?.id)
    },

    totalMessages: (state): number => {
      return state.messages.length
    },

    currentRoomParticipants: (state): string[] => {
      return state.currentRoom?.participants || []
    },
  },

  actions: {
    addMessage(message: ChatMessage) {
      const existingIndex = this.messages.findIndex(m => m.id === message.id)
      if (existingIndex !== -1) {
        return
      }

      this.messages.push(message)
      this.persistMessages()
      this.updateRoomActivity(message.roomId)
    },

    removeMessage(messageId: string) {
      const index = this.messages.findIndex(m => m.id === messageId)
      if (index !== -1) {
        this.messages.splice(index, 1)
        this.persistMessages()
      }
    },

    clearMessages(roomId?: string) {
      if (roomId) {
        this.messages = this.messages.filter(m => m.roomId !== roomId)
      } else {
        this.messages = []
      }
      this.persistMessages()
    },

    setCurrentRoom(room: ChatRoom | null) {
      this.currentRoom = room
      this.persistCurrentRoom()
    },

    addRoom(room: ChatRoom) {
      const existingIndex = this.rooms.findIndex(r => r.id === room.id)
      if (existingIndex !== -1) {
        this.rooms[existingIndex] = room
      } else {
        this.rooms.push(room)
      }
      this.persistRooms()
    },

    removeRoom(roomId: string) {
      this.rooms = this.rooms.filter(r => r.id !== roomId)
      if (this.currentRoom?.id === roomId) {
        this.currentRoom = null
        this.persistCurrentRoom()
      }
      this.persistRooms()
    },

    updateRoomActivity(roomId: string) {
      const room = this.rooms.find(r => r.id === roomId)
      if (room) {
        room.lastActivity = new Date()
        this.persistRooms()
      }
    },

    joinRoom(roomId: string, userId: string) {
      const room = this.rooms.find(r => r.id === roomId)
      if (room && !room.participants.includes(userId)) {
        room.participants.push(userId)
        this.persistRooms()
      }
    },

    leaveRoom(roomId: string, userId: string) {
      const room = this.rooms.find(r => r.id === roomId)
      if (room) {
        room.participants = room.participants.filter(p => p !== userId)
        this.persistRooms()
      }
    },

    setLoading(loading: boolean) {
      this.isLoading = loading
    },

    setError(error: string | null) {
      this.error = error
    },

    setInitialized(initialized: boolean) {
      this.isInitialized = initialized
    },

    persistMessages() {
      try {
        const messagesToStore = this.messages.map(msg => ({
          ...msg,
          timestamp: msg.timestamp.toISOString(),
        }))
        localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messagesToStore))
      } catch (error) {}
    },

    persistRooms() {
      try {
        const roomsToStore = this.rooms.map(room => ({
          ...room,
          createdAt: room.createdAt.toISOString(),
          lastActivity: room.lastActivity.toISOString(),
        }))
        localStorage.setItem(STORAGE_KEYS.ROOMS, JSON.stringify(roomsToStore))
      } catch (error) {}
    },

    persistCurrentRoom() {
      try {
        if (this.currentRoom) {
          const roomToStore = {
            ...this.currentRoom,
            createdAt: this.currentRoom.createdAt.toISOString(),
            lastActivity: this.currentRoom.lastActivity.toISOString(),
          }
          localStorage.setItem(STORAGE_KEYS.CURRENT_ROOM, JSON.stringify(roomToStore))
        } else {
          localStorage.removeItem(STORAGE_KEYS.CURRENT_ROOM)
        }
      } catch (error) {}
    },

    async loadPersistedData() {
      try {
        const storedMessages = localStorage.getItem(STORAGE_KEYS.MESSAGES)
        if (storedMessages) {
          const parsedMessages = JSON.parse(storedMessages)
          this.messages = await Promise.all(
            parsedMessages.map(async (msg: any) => ({
              ...msg,
              timestamp: new Date(msg.timestamp),
              audioBlob: msg.audioBlob ? await this.base64ToBlob(msg.audioBlob) : new Blob(),
            })),
          )
        }

        const storedRooms = localStorage.getItem(STORAGE_KEYS.ROOMS)
        if (storedRooms) {
          const parsedRooms = JSON.parse(storedRooms)
          this.rooms = parsedRooms.map((room: any) => ({
            ...room,
            createdAt: new Date(room.createdAt),
            lastActivity: new Date(room.lastActivity),
          }))
        }

        const storedCurrentRoom = localStorage.getItem(STORAGE_KEYS.CURRENT_ROOM)
        if (storedCurrentRoom) {
          const parsedRoom = JSON.parse(storedCurrentRoom)
          this.currentRoom = {
            ...parsedRoom,
            createdAt: new Date(parsedRoom.createdAt),
            lastActivity: new Date(parsedRoom.lastActivity),
          }
        }
      } catch (error) {
        this.clearPersistedData()
      }
    },

    clearPersistedData() {
      localStorage.removeItem(STORAGE_KEYS.MESSAGES)
      localStorage.removeItem(STORAGE_KEYS.ROOMS)
      localStorage.removeItem(STORAGE_KEYS.CURRENT_ROOM)
    },

    async blobToBase64(blob: Blob): Promise<string> {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    },

    async base64ToBlob(base64: string): Promise<Blob> {
      const response = await fetch(base64)
      return response.blob()
    },
  },
})
