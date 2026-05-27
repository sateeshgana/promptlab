import { renderHook, act } from '@testing-library/react'
import { usePromptHistory } from './usePromptHistory'

beforeEach(() => localStorage.clear())

describe('usePromptHistory', () => {
  it('starts empty', () => {
    const { result } = renderHook(() => usePromptHistory())
    expect(result.current.history).toEqual([])
  })

  it('saves and retrieves a prompt', () => {
    const { result } = renderHook(() => usePromptHistory())
    act(() => result.current.save({ userPrompt: 'Hello', systemPrompt: '', selectedModels: [] }))
    expect(result.current.history[0].userPrompt).toBe('Hello')
    expect(result.current.history[0].title).toBe('Hello')
  })

  it('truncates title to 50 chars', () => {
    const { result } = renderHook(() => usePromptHistory())
    act(() => result.current.save({ userPrompt: 'A'.repeat(100), systemPrompt: '', selectedModels: [] }))
    expect(result.current.history[0].title).toHaveLength(50)
  })

  it('removes by id', () => {
    const { result } = renderHook(() => usePromptHistory())
    act(() => result.current.save({ userPrompt: 'Test', systemPrompt: '', selectedModels: [] }))
    act(() => result.current.remove(result.current.history[0].id))
    expect(result.current.history).toHaveLength(0)
  })

  it('persists across re-mounts', () => {
    const { result: r1 } = renderHook(() => usePromptHistory())
    act(() => r1.current.save({ userPrompt: 'Persisted', systemPrompt: '', selectedModels: [] }))
    const { result: r2 } = renderHook(() => usePromptHistory())
    expect(r2.current.history[0].userPrompt).toBe('Persisted')
  })
})
