import { describe, it, expect, beforeEach, vi } from "vitest"
import { setActivePinia, createPinia } from "pinia"
import { useChatStore } from "@/stores/chat"
import type { ChatMessage, ChatRoom } from "@/domain/entities/chat"

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
  writable: true,
})

describe("useChatStore", () => {
  let store: ReturnType<typeof useChatStore>

  beforeEach(() => {
    setActivePinia(createPinia())
    store = useChatStore()
    vi.clearAllMocks()
  })

  describe("Estado inicial", () => {
    it("debe tener estado inicial correcto", () => {
      expect(store.messages).toEqual([])
      expect(store.currentRoom).toBe(null)
      expect(store.rooms).toEqual([])
      expect(store.isLoading).toBe(false)
      expect(store.error).toBe(null)
      expect(store.isInitialized).toBe(false)
    })
  })

  describe("Gestión de mensajes", () => {
    const mockMessage: ChatMessage = {
      id: "msg-1",
      transcript: "Hola mundo",
      audioBlob: new Blob(["audio data"], { type: "audio/webm" }),
      duration: 5000,
      user: {
        id: "user-1",
        nickname: "Usuario1",
        email: "user1@test.com",
        userType: "STUDENT" as any,
      },
      timestamp: new Date("2024-01-01T10:00:00Z"),
      roomId: "room-1",
    }

    it("debe agregar mensaje correctamente", () => {
      store.addMessage(mockMessage)

      expect(store.messages).toHaveLength(1)
      expect(store.messages[0]).toEqual(mockMessage)
      expect(localStorageMock.setItem).toHaveBeenCalledWith("chat_messages", expect.any(String))
    })

    it("debe eliminar mensaje correctamente", () => {
      store.addMessage(mockMessage)
      store.removeMessage("msg-1")

      expect(store.messages).toHaveLength(0)
      expect(localStorageMock.setItem).toHaveBeenCalledWith("chat_messages", expect.any(String))
    })

    it("debe limpiar todos los mensajes", () => {
      store.addMessage(mockMessage)
      store.clearMessages()

      expect(store.messages).toHaveLength(0)
    })
  })

  describe("Gestión de salas", () => {
    const mockRoom: ChatRoom = {
      id: "room-1",
      name: "Sala de Prueba",
      createdAt: new Date("2024-01-01T10:00:00Z"),
      lastActivity: new Date("2024-01-01T10:00:00Z"),
      participants: ["user-1"],
    }

    it("debe agregar sala correctamente", () => {
      store.addRoom(mockRoom)

      expect(store.rooms).toHaveLength(1)
      expect(store.rooms[0]).toEqual(mockRoom)
      expect(localStorageMock.setItem).toHaveBeenCalledWith("chat_rooms", expect.any(String))
    })

    it("debe establecer sala actual", () => {
      store.setCurrentRoom(mockRoom)

      expect(store.currentRoom).toEqual(mockRoom)
      expect(localStorageMock.setItem).toHaveBeenCalledWith("chat_current_room", expect.any(String))
    })
  })

  describe("Getters", () => {
    const mockRoom: ChatRoom = {
      id: "room-1",
      name: "Sala de Prueba",
      createdAt: new Date("2024-01-01T10:00:00Z"),
      lastActivity: new Date("2024-01-01T10:00:00Z"),
      participants: ["user-1"],
    }

    const mockMessage: ChatMessage = {
      id: "msg-1",
      transcript: "Hola mundo",
      audioBlob: new Blob(["audio data"], { type: "audio/webm" }),
      duration: 5000,
      user: {
        id: "user-1",
        nickname: "Usuario1",
        email: "user1@test.com",
        userType: "STUDENT" as any,
      },
      timestamp: new Date("2024-01-01T10:00:00Z"),
      roomId: "room-1",
    }

    it("debe obtener mensajes de la sala actual", () => {
      store.addRoom(mockRoom)
      store.setCurrentRoom(mockRoom)
      store.addMessage(mockMessage)

      expect(store.currentRoomMessages).toHaveLength(1)
      expect(store.currentRoomMessages[0]).toEqual(mockMessage)
    })

    it("debe contar total de mensajes", () => {
      store.addMessage(mockMessage)
      expect(store.totalMessages).toBe(1)
    })
  })

  describe("Estado de la aplicación", () => {
    it("debe establecer loading", () => {
      store.setLoading(true)
      expect(store.isLoading).toBe(true)

      store.setLoading(false)
      expect(store.isLoading).toBe(false)
    })

    it("debe establecer error", () => {
      store.setError("Error de prueba")
      expect(store.error).toBe("Error de prueba")

      store.setError(null)
      expect(store.error).toBe(null)
    })
  })
})
