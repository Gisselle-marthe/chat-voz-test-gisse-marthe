import { vi } from "vitest"
import { config } from "@vue/test-utils"

vi.mock("vuetify", () => ({
  default: {
    install: vi.fn(),
  },
}))

Object.defineProperty(window, "localStorage", {
  value: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  },
  writable: true,
})

Object.defineProperty(window, "MediaRecorder", {
  value: vi.fn().mockImplementation(() => ({
    start: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    ondataavailable: null,
    onstop: null,
    stream: {
      getTracks: () => [
        {
          stop: vi.fn(),
        },
      ],
    },
  })),
  writable: true,
})

Object.defineProperty(navigator, "mediaDevices", {
  value: {
    getUserMedia: vi.fn().mockResolvedValue({
      getTracks: () => [
        {
          stop: vi.fn(),
        },
      ],
    }),
  },
  writable: true,
})

Object.defineProperty(window, "BroadcastChannel", {
  value: vi.fn().mockImplementation(() => ({
    postMessage: vi.fn(),
    close: vi.fn(),
    onmessage: null,
  })),
  writable: true,
})

Object.defineProperty(window, "AudioContext", {
  value: vi.fn().mockImplementation(() => ({
    decodeAudioData: vi.fn().mockResolvedValue({
      getChannelData: () => new Float32Array([0.1, 0.2, 0.3, 0.4, 0.5]),
    }),
    createAnalyser: vi.fn().mockReturnValue({
      connect: vi.fn(),
      disconnect: vi.fn(),
    }),
    createGain: vi.fn().mockReturnValue({
      connect: vi.fn(),
      disconnect: vi.fn(),
    }),
    createBufferSource: vi.fn().mockReturnValue({
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    }),
  })),
  writable: true,
})

Object.defineProperty(URL, "createObjectURL", {
  value: vi.fn().mockReturnValue("mock-url"),
  writable: true,
})

Object.defineProperty(URL, "revokeObjectURL", {
  value: vi.fn(),
  writable: true,
})

config.global.mocks = {
  $vuetify: {
    theme: {
      current: "light",
    },
  },
}
