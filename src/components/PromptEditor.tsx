// src/components/PromptEditor.tsx
import { useState } from 'react'
import { Play, Settings } from 'lucide-react'
import { clsx } from 'clsx'

interface Props {
  userPrompt: string
  systemPrompt: string
  onUserPromptChange: (v: string) => void
  onSystemPromptChange: (v: string) => void
  onRun: () => void
  isRunning: boolean
}

export function PromptEditor({
  userPrompt, systemPrompt, onUserPromptChange, onSystemPromptChange, onRun, isRunning,
}: Props) {
  const [showSystem, setShowSystem] = useState(false)
  const canRun = userPrompt.trim().length > 0 && !isRunning

  return (
    <div className="flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <label className="text-sm font-medium text-gray-400">Prompt</label>
        <button
          type="button"
          onClick={() => setShowSystem((v) => !v)}
          className={clsx(
            'flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-colors',
            showSystem ? 'bg-gray-700 text-gray-200' : 'bg-gray-800 text-gray-400 hover:text-gray-200',
          )}
        >
          <Settings size={12} /> System prompt
        </button>
      </div>

      {showSystem && (
        <textarea
          value={systemPrompt}
          onChange={(e) => onSystemPromptChange(e.target.value)}
          placeholder="System prompt…"
          rows={3}
          className="w-full rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      )}

      <textarea
        value={userPrompt}
        onChange={(e) => onUserPromptChange(e.target.value)}
        placeholder="Write your prompt here…"
        rows={6}
        className="w-full rounded-lg bg-gray-800 border border-gray-700 text-gray-100 placeholder-gray-500 p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="flex justify-between items-center">
        <span className="text-xs text-gray-500">{userPrompt.length} chars</span>
        <button
          type="button"
          onClick={onRun}
          disabled={!canRun}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            canRun
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed',
          )}
        >
          <Play size={14} />
          {isRunning ? 'Running…' : 'Run'}
        </button>
      </div>
    </div>
  )
}
