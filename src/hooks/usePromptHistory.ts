import { useState, useCallback, useEffect } from 'react'
import type { SavedPrompt, PromptState } from '../types'

const KEY = 'promptlab:history'

function load(): SavedPrompt[] {
  try { return JSON.parse(localStorage.getItem(KEY) ?? '[]') }
  catch { return [] }
}

export function usePromptHistory() {
  const [history, setHistory] = useState<SavedPrompt[]>(load)

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(history))
  }, [history])

  const save = useCallback((state: PromptState) => {
    setHistory((prev) => [{
      id: crypto.randomUUID(),
      title: state.userPrompt.slice(0, 50),
      userPrompt: state.userPrompt,
      systemPrompt: state.systemPrompt,
      savedAt: Date.now(),
    }, ...prev].slice(0, 50))
  }, [])

  const remove = useCallback((id: string) => {
    setHistory((prev) => prev.filter((p) => p.id !== id))
  }, [])

  return { history, save, remove }
}
