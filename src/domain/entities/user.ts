export interface UserCredentials {
  nickname: string
}

export enum UserType {
  SYSTEM = "SYSTEM",
  STUDENT = "STUDENT",
  TEACHER = "TEACHER",
}

export interface User {
  id: string
  nickname: string
  email: string
  userType: UserType
  avatarUrl?: string
  status?: string
}

export interface AuthState {
  user: User | null
  token: string | null
  lastActivity: Date | null
  isAuthenticated: boolean
}
