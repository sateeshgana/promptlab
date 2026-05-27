import { buildMessages } from './run-prompt.mts'

describe('buildMessages', () => {
  it('includes system message when systemPrompt is provided', () => {
    const msgs = buildMessages('Hello', 'You are helpful')
    expect(msgs[0]).toEqual({ role: 'system', content: 'You are helpful' })
    expect(msgs[1]).toEqual({ role: 'user',   content: 'Hello' })
  })

  it('omits system message when systemPrompt is empty', () => {
    const msgs = buildMessages('Hello', '')
    expect(msgs).toHaveLength(1)
    expect(msgs[0].role).toBe('user')
  })
})
