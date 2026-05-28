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
        <label className="text-sm font-medium text-[#7a6652]">Prompt</label>
        <button
          type="button"
          onClick={() => setShowSystem((v) => !v)}
          className={clsx(
            'flex items-center gap-1.5 text-xs px-2 py-1 rounded-md transition-colors border',
            showSystem ? 'bg-[#ede5d8] border-[#ede5d8] text-[#1c1410]' : 'bg-[#faf6f0] border-[#ede5d8] text-[#7a6652] hover:text-[#1c1410]',
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
          className="w-full rounded-lg bg-[#faf6f0] border border-[#ede5d8] text-[#1c1410] placeholder-[#c4b49e] p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#e8890c]"
        />
      )}

      <textarea
        value={userPrompt}
        onChange={(e) => onUserPromptChange(e.target.value)}
        placeholder="Write your prompt here…"
        rows={6}
        className="w-full rounded-lg bg-[#faf6f0] border border-[#ede5d8] text-[#1c1410] placeholder-[#c4b49e] p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-[#e8890c]"
      />

      <div className="flex justify-between items-center">
        <span className="text-xs text-[#c4b49e]">{userPrompt.length} chars</span>
        <button
          type="button"
          onClick={onRun}
          disabled={!canRun}
          className={clsx(
            'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
            canRun
              ? 'bg-[#e8890c] hover:bg-[#d07800] text-white'
              : 'bg-[#f5efe6] text-[#d4bfa8] cursor-not-allowed',
          )}
        >
          <Play size={14} />
          {isRunning ? 'Running…' : 'Run'}
        </button>
      </div>
    </div>
  )
}
