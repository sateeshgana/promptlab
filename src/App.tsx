import { useState } from 'react'
import { BookmarkPlus, Zap } from 'lucide-react'
import { PromptEditor }        from './components/PromptEditor'
import { ModelSelector }       from './components/ModelSelector'
import { ModelResponseColumn } from './components/ModelResponseColumn'
import { PromptHistory }       from './components/PromptHistory'
import { ShareButton }         from './components/ShareButton'
import { useModelRun }         from './hooks/useModelRun'
import { usePromptHistory }    from './hooks/usePromptHistory'
import { readSharedStateFromUrl } from './utils/shareUrl'
import { MODELS, type ModelId, type PromptState } from './types'

const DEFAULT: PromptState = {
  userPrompt: '',
  systemPrompt: '',
  selectedModels: ['llama-3.3-70b-versatile', 'deepseek-chat', 'mixtral-8x7b-32768'],
}

export default function App() {
  const [state, setState] = useState<PromptState>(() => readSharedStateFromUrl() ?? DEFAULT)
  const { responses, loading, errors, run, clear } = useModelRun()
  const { history, save, remove } = usePromptHistory()
  const isRunning = Object.values(loading).some(Boolean)

  const handleRun = () => {
    if (!state.userPrompt.trim()) return
    clear()
    run(state)
  }

  return (
    <div className="min-h-screen bg-white text-[#1c1410]">
      {/* Header */}
      <header className="bg-[#1c1410] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Zap size={20} className="text-[#e8890c]" />
          <span className="font-bold text-lg text-white">PromptLab</span>
          <span className="text-xs text-[#a08060] ml-1">Compare LLMs side-by-side</span>
        </div>
        <ShareButton promptState={state} />
      </header>

      <div className="flex h-[calc(100vh-65px)]">
        {/* Sidebar */}
        <aside className="w-64 border-r border-[#ede5d8] bg-[#faf6f0] p-4 overflow-y-auto hidden lg:block">
          <PromptHistory
            history={history}
            onRestore={(p) =>
              setState((prev) => ({
                ...prev,
                userPrompt: p.userPrompt,
                systemPrompt: p.systemPrompt,
              }))
            }
            onRemove={remove}
          />
        </aside>

        {/* Main */}
        <main className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto">
          {/* Controls */}
          <div className="flex flex-col gap-4">
            <ModelSelector
              selectedModels={state.selectedModels}
              onChange={(selectedModels) =>
                setState((p) => ({ ...p, selectedModels }))
              }
            />
            <PromptEditor
              userPrompt={state.userPrompt}
              systemPrompt={state.systemPrompt}
              onUserPromptChange={(userPrompt) =>
                setState((p) => ({ ...p, userPrompt }))
              }
              onSystemPromptChange={(systemPrompt) =>
                setState((p) => ({ ...p, systemPrompt }))
              }
              onRun={handleRun}
              isRunning={isRunning}
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => save(state)}
                disabled={!state.userPrompt.trim()}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-[#faf6f0] text-[#7a6652] hover:text-[#1c1410] disabled:opacity-40 disabled:cursor-not-allowed border border-[#ede5d8] transition-colors"
              >
                <BookmarkPlus size={12} />
                Save prompt
              </button>
            </div>
          </div>

          {/* Response columns */}
          <div
            className="grid gap-4"
            style={{
              gridTemplateColumns: `repeat(${state.selectedModels.length}, minmax(0, 1fr))`,
            }}
          >
            {MODELS.filter((m) => state.selectedModels.includes(m.id as ModelId)).map(
              (m) => (
                <ModelResponseColumn
                  key={m.id}
                  model={m}
                  response={responses[m.id] ?? null}
                  isLoading={loading[m.id] ?? false}
                  error={errors[m.id] ?? null}
                />
              ),
            )}
          </div>
        </main>
      </div>
    </div>
  )
}
