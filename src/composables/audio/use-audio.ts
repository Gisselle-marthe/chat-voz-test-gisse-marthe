export const isBlob = (v: unknown): v is Blob => typeof Blob !== "undefined" && v instanceof Blob

export const isArrayBuffer = (v: unknown): v is ArrayBuffer =>
  typeof ArrayBuffer !== "undefined" && v instanceof ArrayBuffer

export const isDataUrlString = (v: unknown): v is string =>
  typeof v === "string" && /^data:audio\/[a-z0-9.+-]+;base64,/i.test(v)

export function dataUrlToBlob(dataUrl: string): Blob {
  const [head, b64] = dataUrl.split(",")
  const mime = head.match(/data:(.*?);base64/)?.[1] ?? "audio/webm"
  const bin = atob(b64)
  const len = bin.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) bytes[i] = bin.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

export function guessExtFromMime(m: string) {
  if (m.includes("ogg")) return "ogg"
  if (m.includes("mp4") || m.includes("m4a")) return "m4a"
  if (m.includes("webm")) return "webm"
  return "audio"
}

export function normalizeToBlob(input: Blob | ArrayBuffer | string, mimeHint = "audio/webm"): Blob {
  if (isBlob(input)) return input
  if (isArrayBuffer(input)) return new Blob([input], { type: mimeHint })
  if (isDataUrlString(input)) return dataUrlToBlob(input)
  throw new Error("Formato de audioBlob no soportado")
}

export async function toWirePayload(
  audio: Blob | ArrayBuffer | string,
): Promise<
  | { kind: "blob"; blob: Blob }
  | { kind: "buffer"; buffer: ArrayBuffer; mimeType: string }
  | { kind: "data"; dataUrl: string }
> {
  if (isBlob(audio)) return { kind: "blob", blob: audio }
  if (isArrayBuffer(audio)) return { kind: "buffer", buffer: audio, mimeType: "audio/webm" }
  if (isDataUrlString(audio)) return { kind: "data", dataUrl: audio }

  const blob = normalizeToBlob(audio)
  return { kind: "blob", blob }
}

export function fromWirePayloadToBlob(payload: any): Blob {
  if (payload?.kind === "blob" && isBlob(payload.blob)) return payload.blob
  if (payload?.kind === "buffer" && payload.buffer) {
    return new Blob([payload.buffer], { type: payload.mimeType || "audio/webm" })
  }
  if (payload?.kind === "data" && typeof payload.dataUrl === "string") {
    return dataUrlToBlob(payload.dataUrl)
  }

  if (isBlob(payload)) return payload
  if (isArrayBuffer(payload)) return new Blob([payload], { type: "audio/webm" })
  throw new Error("Payload de audio no reconocido")
}

export async function getAudioDuration(blob: Blob): Promise<number> {
  const ab = await blob.arrayBuffer()
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  const buf = await ctx.decodeAudioData(ab.slice(0) as ArrayBuffer)
  const d = buf.duration
  await ctx.close()
  return d
}

export async function isSilent(blob: Blob, threshold = 0.01): Promise<boolean> {
  const ab = await blob.arrayBuffer()
  const ctx = new (window.AudioContext || (window as any).webkitAudioContext)()
  const buf = await ctx.decodeAudioData(ab.slice(0) as ArrayBuffer)
  const ch = buf.getChannelData(0)
  let sum = 0
  for (let i = 0; i < ch.length; i++) sum += ch[i] * ch[i]
  const rms = Math.sqrt(sum / ch.length)
  await ctx.close()
  return rms < threshold
}
