import type { User } from "./user"

export enum SenderType {
  OWN = "OWN",
  OTHER = "OTHER",
  SYSTEM = "SYSTEM",
}

export interface ChatMessage {
  id: string
  transcript?: string
  audioBlob: Blob | ArrayBuffer | string
  duration: number

  timestamp: Date
  roomId: string
  user: User
  isPlaying?: boolean
  playbackRate?: number
}

export interface ChatRoom {
  id: string
  name: string
  createdAt: Date
  lastActivity: Date
  participants: string[]
}

export interface ChatState {
  messages: ChatMessage[]
  currentRoom: ChatRoom | null
  rooms: ChatRoom[]
  isLoading: boolean
  error: string | null
  isInitialized: boolean
}

export interface MessageMetadata {
  isPlaying: boolean
  isGeneratingTranscript: boolean
  playbackRate: number
}

export interface VoiceMessage {
  id: string
  sender: "own" | "other"
  audioBlob: Blob
  timestamp: Date
  duration: number
  transcript: string
  isPlaying: boolean
}

export interface RecordingState {
  isRecording: boolean
  recordingTime: number
  audioBlob: Blob | null
  error: string | null
}
