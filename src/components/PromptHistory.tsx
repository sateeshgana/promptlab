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
      <div className="flex items-center gap-2 text-sm font-medium text-gray-400">
        <History size={14} />
        Saved Prompts
      </div>

      {history.length === 0 && (
        <p className="text-xs text-gray-600 italic">No saved prompts yet.</p>
      )}

      <ul className="space-y-1">
        {history.map((p) => (
          <li
            key={p.id}
            className="group flex items-center gap-2 rounded-lg px-3 py-2 bg-gray-800 hover:bg-gray-700"
          >
            <span
              className="flex-1 text-xs text-gray-300 truncate cursor-pointer"
              onClick={() => onRestore(p)}
            >
              {p.title}
            </span>
            <button
              type="button"
              onClick={() => onRemove(p.id)}
              className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity"
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
