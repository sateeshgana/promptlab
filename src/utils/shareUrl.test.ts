import { encodePromptState, decodePromptState } from './shareUrl'
import type { PromptState } from '../types'

const state: PromptState = {
  userPrompt: 'Explain quantum computing',
  systemPrompt: 'You are a physics teacher',
  selectedModels: ['llama-3.3-70b-versatile', 'deepseek-chat'],
}

describe('shareUrl', () => {
  it('round-trips encode → decode', () => {
    expect(decodePromptState(encodePromptState(state))).toEqual(state)
  })

  it('returns null for empty string', () => {
    expect(decodePromptState('')).toBeNull()
  })

  it('returns null for invalid base64', () => {
    expect(decodePromptState('!!!not-base64###')).toBeNull()
  })
})
