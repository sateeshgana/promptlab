export type ModelId =
  | 'llama-3.3-70b-versatile'
  | 'deepseek-chat'
  | 'mixtral-8x7b-32768'

export interface ModelConfig {
  id: ModelId
  label: string
  provider: 'groq' | 'deepseek'
  color: string
}

export const MODELS: ModelConfig[] = [
  { id: 'llama-3.3-70b-versatile', label: 'Llama 3.3 70B', provider: 'groq',     color: 'bg-orange-600' },
  { id: 'deepseek-chat',           label: 'DeepSeek V3',   provider: 'deepseek', color: 'bg-blue-600'   },
  { id: 'mixtral-8x7b-32768',      label: 'Mixtral 8x7B',  provider: 'groq',     color: 'bg-purple-600' },
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
