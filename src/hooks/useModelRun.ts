import { useState, useCallback } from 'react'
import { MODELS, type ModelId, type PromptState, type RunPromptResponse } from '../types'

type ResponseMap = { [K in ModelId]?: RunPromptResponse }
type BoolMap     = { [K in ModelId]?: boolean }
type StringMap   = { [K in ModelId]?: string }

export function useModelRun() {
  const [responses, setResponses] = useState<ResponseMap>({})
  const [loading,   setLoading]   = useState<BoolMap>({})
  const [errors,    setErrors]    = useState<StringMap>({})

  const run = useCallback(async (state: PromptState) => {
    const { userPrompt, systemPrompt, selectedModels } = state

    setResponses((p) => { const n = { ...p }; selectedModels.forEach((id) => delete n[id]); return n })
    setErrors((p)    => { const n = { ...p }; selectedModels.forEach((id) => delete n[id]); return n })
    setLoading(Object.fromEntries(selectedModels.map((id) => [id, true])))

    await Promise.all(
      MODELS.filter((m) => selectedModels.includes(m.id)).map(async (m) => {
        try {
          const res  = await fetch('/api/run-prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userPrompt, systemPrompt, model: m.id, provider: m.provider }),
          })
          const data = await res.json()
          if (!res.ok) setErrors((p)    => ({ ...p, [m.id]: data.error ?? 'Request failed' }))
          else         setResponses((p) => ({ ...p, [m.id]: data as RunPromptResponse }))
        } catch (err) {
          setErrors((p) => ({ ...p, [m.id]: err instanceof Error ? err.message : 'Network error' }))
        } finally {
          setLoading((p) => ({ ...p, [m.id]: false }))
        }
      })
    )
  }, [])

  const clear = useCallback(() => { setResponses({}); setLoading({}); setErrors({}) }, [])

  return { responses, loading, errors, run, clear }
}
