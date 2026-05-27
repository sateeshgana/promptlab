import type { PromptState } from '../types'
import { MODELS } from '../types'

const VALID_IDS = new Set(MODELS.map((m) => m.id))

export function encodePromptState(state: PromptState): string {
  return btoa(encodeURIComponent(JSON.stringify(state)))
}

export function decodePromptState(encoded: string): PromptState | null {
  if (!encoded) return null
  try {
    const parsed = JSON.parse(decodeURIComponent(atob(encoded)))
    if (
      typeof parsed.userPrompt !== 'string' ||
      typeof parsed.systemPrompt !== 'string' ||
      !Array.isArray(parsed.selectedModels) ||
      !parsed.selectedModels.every((id: unknown) => typeof id === 'string' && VALID_IDS.has(id as any))
    ) return null
    return parsed as PromptState
  } catch { return null }
}

export function readSharedStateFromUrl(): PromptState | null {
  const p = new URLSearchParams(window.location.search).get('p')
  return p ? decodePromptState(p) : null
}

export function buildShareUrl(state: PromptState): string {
  const url = new URL(window.location.href)
  url.search = `?p=${encodePromptState(state)}`
  return url.toString()
}
