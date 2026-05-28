import { renderHook, act } from '@testing-library/react'
import { useModelRun } from './useModelRun'
import { vi } from 'vitest'

const mockFetch = vi.fn()
global.fetch = mockFetch

beforeEach(() => mockFetch.mockReset())

describe('useModelRun', () => {
  it('starts with empty state', () => {
    const { result } = renderHook(() => useModelRun())
    expect(result.current.responses).toEqual({})
    expect(result.current.loading).toEqual({})
  })

  it('sets loading true during fetch', async () => {
    // Use a deferred promise so we can check loading=true before resolve,
    // then resolve it at the end so React 19 act cleanup can flush cleanly.
    // A never-resolving Promise causes @testing-library/react's auto-cleanup
    // to deadlock in React 19 (act() returns a thenable that never settles).
    let resolveFetch!: () => void
    mockFetch.mockReturnValue(
      new Promise<Response>((resolve) => {
        resolveFetch = () => resolve(
          new Response(JSON.stringify({ content: 'ok', model: 'test', inputTokens: 1, outputTokens: 1 }))
        )
      })
    )
    const { result } = renderHook(() => useModelRun())
    act(() => { result.current.run({ userPrompt: 'Hi', systemPrompt: '', selectedModels: ['llama-3.3-70b-versatile'] }) })
    expect(result.current.loading['llama-3.3-70b-versatile']).toBe(true)
    // Resolve to let async work complete before cleanup
    await act(async () => { resolveFetch() })
  })

  it('stores response on success', async () => {
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ content: 'Hello!', model: 'test', inputTokens: 5, outputTokens: 10 }),
    })
    const { result } = renderHook(() => useModelRun())
    await act(async () => {
      await result.current.run({ userPrompt: 'Hi', systemPrompt: '', selectedModels: ['llama-3.3-70b-versatile'] })
    })
    expect(result.current.responses['llama-3.3-70b-versatile']?.content).toBe('Hello!')
    expect(result.current.loading['llama-3.3-70b-versatile']).toBe(false)
  })

  it('stores error on failure', async () => {
    mockFetch.mockResolvedValue({ ok: false, json: async () => ({ error: 'Rate limited' }) })
    const { result } = renderHook(() => useModelRun())
    await act(async () => {
      await result.current.run({ userPrompt: 'Hi', systemPrompt: '', selectedModels: ['llama-3.3-70b-versatile'] })
    })
    expect(result.current.errors['llama-3.3-70b-versatile']).toBe('Rate limited')
  })
})
