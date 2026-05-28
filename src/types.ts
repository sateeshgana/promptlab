export type ModelId =
  | 'llama-3.3-70b-versatile'
  | 'gemma2-9b-it'
  | 'deepseek-r1-distill-llama-70b'

export interface ModelConfig {
  id: ModelId
  label: string
  provider: 'groq'
  color: string
}

export const MODELS: ModelConfig[] = [
  { id: 'llama-3.3-70b-versatile',       label: 'Llama 3.3 70B',  provider: 'groq', color: 'bg-[#e8890c]'  },
  { id: 'gemma2-9b-it',                  label: 'Gemma 2 9B',     provider: 'groq', color: 'bg-[#1a73e8]'  },
  { id: 'deepseek-r1-distill-llama-70b', label: 'DeepSeek R1 70B',provider: 'groq', color: 'bg-violet-500' },
]

export interface PromptState {
  userPrompt: string
  systemPrompt: string
  selectedModels: ModelId[]
}

export interface SavedPrompt {
  id: string
  title: string
  userPrompt: string
  systemPrompt: string
  savedAt: number
}

export interface RunPromptRequest {
  prompt: string
  systemPrompt?: string
  model: ModelId
  provider: 'groq' | 'deepseek'
}

export interface RunPromptResponse {
  content: string
  model: string
  inputTokens: number
  outputTokens: number
}
