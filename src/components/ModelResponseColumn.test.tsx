// src/components/ModelResponseColumn.test.tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ModelResponseColumn } from './ModelResponseColumn'
import { vi } from 'vitest'
import type { ModelConfig, RunPromptResponse } from '../types'

const model: ModelConfig = {
  id: 'gemma2-9b-it',
  label: 'Gemma 2 9B',
  provider: 'groq',
  color: 'bg-[#1a73e8]',
}

describe('ModelResponseColumn', () => {
  it('shows loading skeleton when isLoading is true', () => {
    render(<ModelResponseColumn model={model} response={null} isLoading={true} error={null} />)
    expect(screen.getByTestId('skeleton')).toBeInTheDocument()
  })

  it('shows response content when response is provided', () => {
    const response: RunPromptResponse = {
      content: 'Hello from Llama!',
      model: 'x',
      inputTokens: 5,
      outputTokens: 12,
    }
    render(<ModelResponseColumn model={model} response={response} isLoading={false} error={null} />)
    expect(screen.getByText('Hello from Llama!')).toBeInTheDocument()
  })

  it('shows error message when error is provided', () => {
    render(<ModelResponseColumn model={model} response={null} isLoading={false} error="Rate limited" />)
    expect(screen.getByText(/rate limited/i)).toBeInTheDocument()
  })

  it('copies response to clipboard on copy button click', async () => {
    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    const response: RunPromptResponse = {
      content: 'Copy me',
      model: 'x',
      inputTokens: 2,
      outputTokens: 2,
    }
    render(<ModelResponseColumn model={model} response={response} isLoading={false} error={null} />)
    await userEvent.click(screen.getByRole('button', { name: /copy/i }))
    expect(writeText).toHaveBeenCalledWith('Copy me')
  })
})
