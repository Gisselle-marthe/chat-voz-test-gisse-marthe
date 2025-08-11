import { computed, ref, type Ref } from "vue"

export const useAvatar = (user?: Ref<{ nickname?: string } | null>) => {
  const makeAvatar = (seed: string, style = "adventurer") =>
    `https://api.dicebear.com/6.x/${style}/svg?seed=${encodeURIComponent(seed)}`

  const avatarUrl = computed(() => {
    const seed = user?.value?.nickname || "anonimo"
    return makeAvatar(seed)
  })

  const makeSeed = () => globalThis.crypto?.randomUUID?.() ?? Math.random().toString(36).slice(2)

  const randomAvatar = ref(makeAvatar(makeSeed()))

  const getPersistentAvatar = (key = "avatar-seed", style = "adventurer") => {
    const s =
      localStorage.getItem(key) ||
      (localStorage.setItem(key, makeSeed()), localStorage.getItem(key)!)
    return makeAvatar(s, style)
  }

  return { avatarUrl, makeAvatar, randomAvatar, getPersistentAvatar }
}
