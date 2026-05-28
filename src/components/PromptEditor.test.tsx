// src/components/PromptEditor.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { PromptEditor } from './PromptEditor'
import { vi } from 'vitest'

const base = {
  userPrompt: '',
  systemPrompt: '',
  onUserPromptChange: vi.fn(),
  onSystemPromptChange: vi.fn(),
  onRun: vi.fn(),
  isRunning: false,
}

describe('PromptEditor', () => {
  it('disables Run when prompt is empty', () => {
    render(<PromptEditor {...base} />)
    expect(screen.getByRole('button', { name: /run/i })).toBeDisabled()
  })

  it('enables Run when prompt has content', () => {
    render(<PromptEditor {...base} userPrompt="Hello" />)
    expect(screen.getByRole('button', { name: /run/i })).not.toBeDisabled()
  })

  it('calls onRun on click', async () => {
    const onRun = vi.fn()
    render(<PromptEditor {...base} userPrompt="Hello" onRun={onRun} />)
    await userEvent.click(screen.getByRole('button', { name: /run/i }))
    expect(onRun).toHaveBeenCalled()
  })
})
