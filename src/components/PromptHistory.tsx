// src/components/PromptHistory.tsx
import { History, X } from 'lucide-react'
import type { SavedPrompt } from '../types'

interface Props {
  history: SavedPrompt[]
  onRestore: (p: SavedPrompt) => void
  onRemove: (id: string) => void
}

export function PromptHistory({ history, onRestore, onRemove }: Props) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-sm font-medium text-slate-500">
        <History size={14} />
        Saved Prompts
      </div>

      {history.length === 0 && (
        <p className="text-xs text-slate-300 italic">No saved prompts yet.</p>
      )}

      <ul className="space-y-1">
        {history.map((p) => (
          <li
            key={p.id}
            className="group flex items-center gap-2 rounded-lg px-3 py-2 bg-white border border-[#e4e8f5] hover:bg-[#f0f3ff]"
          >
            <span
              className="flex-1 text-xs text-slate-700 truncate cursor-pointer"
              onClick={() => onRestore(p)}
            >
              {p.title}
            </span>
            <button
              type="button"
              onClick={() => onRemove(p.id)}
              className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-red-500 transition-opacity"
              aria-label={`remove ${p.title}`}
            >
              <X size={12} />
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
