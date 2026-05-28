// src/components/ShareButton.tsx
import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { buildShareUrl } from '../utils/shareUrl'
import type { PromptState } from '../types'

export function ShareButton({ promptState }: { promptState: PromptState }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    await navigator.clipboard.writeText(buildShareUrl(promptState))
    setCopied(true)
    setTimeout(() => setCopied(false), 2500)
  }

  return (
    <button
      type="button"
      onClick={share}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-gray-800 text-gray-400 hover:text-gray-200 border border-gray-700 transition-colors"
    >
      {copied ? <Check size={12} className="text-green-400" /> : <Share2 size={12} />}
      {copied ? 'Link copied!' : 'Share'}
    </button>
  )
}
