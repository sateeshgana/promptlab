// src/components/ModelResponseColumn.tsx
import { useState } from 'react'
import { Copy, Check, AlertCircle } from 'lucide-react'
import type { ModelConfig, RunPromptResponse } from '../types'

interface Props {
  model: ModelConfig
  response: RunPromptResponse | null
  isLoading: boolean
  error: string | null
}

export function ModelResponseColumn({ model, response, isLoading, error }: Props) {
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    if (!response?.content) return
    await navigator.clipboard.writeText(response.content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-col rounded-xl border border-gray-700 bg-gray-900 overflow-hidden min-h-48">
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-2.5 ${model.color}`}>
        <span className="text-sm font-semibold text-white">{model.label}</span>
        {response && (
          <button
            type="button"
            onClick={copy}
            aria-label="copy response"
            className="flex items-center gap-1 text-xs text-white/80 hover:text-white transition-colors"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 p-4 text-sm text-gray-200">
        {isLoading && (
          <div data-testid="skeleton" className="space-y-2 animate-pulse">
            <div className="h-3 bg-gray-700 rounded w-3/4" />
            <div className="h-3 bg-gray-700 rounded w-full" />
            <div className="h-3 bg-gray-700 rounded w-5/6" />
            <div className="h-3 bg-gray-700 rounded w-2/3" />
          </div>
        )}

        {error && (
          <div className="flex gap-2 text-red-400">
            <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {response && !isLoading && (
          <div>
            <pre className="whitespace-pre-wrap font-sans leading-relaxed">{response.content}</pre>
            <p className="mt-3 text-xs text-gray-500">
              {response.outputTokens} tokens out · {response.inputTokens} in
            </p>
          </div>
        )}

        {!isLoading && !error && !response && (
          <p className="text-gray-600 italic text-xs">Response will appear here…</p>
        )}
      </div>
    </div>
  )
}
