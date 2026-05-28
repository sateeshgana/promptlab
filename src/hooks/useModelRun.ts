import { useState, useCallback } from 'react'
import { MODELS, type ModelId, type PromptState, type RunPromptResponse } from '../types'

type ResponseMap = { [K in ModelId]?: RunPromptResponse }
type BoolMap     = { [K in ModelId]?: boolean }
type StringMap   = { [K in ModelId]?: string }

function friendlyError(raw: string): string {
  const msg = raw.toLowerCase()
  if (msg.includes('402') || msg.includes('insufficient balance') || msg.includes('insufficient_balance'))
    return 'Insufficient API balance — please top up your account to continue.'
  if (msg.includes('429') || msg.includes('rate limit') || msg.includes('rate_limit'))
    return 'Rate limit reached — please wait a moment and try again.'
  if (msg.includes('401') || msg.includes('invalid api key') || msg.includes('authentication'))
    return 'Invalid API key — please check the server configuration.'
  if (msg.includes('decommission') || msg.includes('no longer supported') || msg.includes('model_decommissioned'))
    return 'This model has been discontinued. Please select a different model.'
  if (msg.includes('model_not_found') || msg.includes('model not found') || msg.includes('does not exist'))
    return 'Model not available — please try a different model.'
  if (msg.includes('context_length') || msg.includes('too long') || msg.includes('maximum context'))
    return 'Your prompt is too long for this model — try shortening it.'
  if (msg.includes('timeout') || msg.includes('timed out'))
    return 'Request timed out — please try again.'
  if (msg.includes('network') || msg.includes('failed to fetch') || msg.includes('load failed'))
    return 'Connection failed — please check your internet connection.'
  if (msg.includes('500') || msg.includes('internal server'))
    return 'Server error — please try again in a moment.'
  return 'Something went wrong — please try again.'
}

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
          if (!res.ok) setErrors((p)    => ({ ...p, [m.id]: friendlyError(data.error ?? '') }))
          else         setResponses((p) => ({ ...p, [m.id]: data as RunPromptResponse }))
        } catch {
          setErrors((p) => ({ ...p, [m.id]: 'Connection failed — please check your internet connection.' }))
        } finally {
          setLoading((p) => ({ ...p, [m.id]: false }))
        }
      })
    )
  }, [])

  const clear = useCallback(() => { setResponses({}); setLoading({}); setErrors({}) }, [])

  return { responses, loading, errors, run, clear }
}
