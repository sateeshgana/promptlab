// src/components/ModelSelector.tsx
import { MODELS, type ModelId } from '../types'
import { clsx } from 'clsx'

interface Props {
  selectedModels: ModelId[]
  onChange: (s: ModelId[]) => void
}

export function ModelSelector({ selectedModels, onChange }: Props) {
  const toggle = (id: ModelId) => {
    if (selectedModels.includes(id)) {
      if (selectedModels.length === 1) return // always keep at least one selected
      onChange(selectedModels.filter((m) => m !== id))
    } else {
      onChange([...selectedModels, id])
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {MODELS.map((m) => (
        <button
          key={m.id}
          type="button"
          onClick={() => toggle(m.id)}
          className={clsx(
            'px-3 py-1.5 rounded-full text-xs font-medium border transition-all',
            selectedModels.includes(m.id)
              ? `${m.color} border-transparent text-white`
              : 'bg-transparent border-gray-600 text-gray-400 hover:border-gray-400',
          )}
        >
          {m.label}
        </button>
      ))}
    </div>
  )
}
