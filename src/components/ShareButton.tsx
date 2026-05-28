// src/components/ShareButton.tsx
import { useState } from 'react'
import { Share2, Check } from 'lucide-react'
import { buildShareUrl } from '../utils/shareUrl'
import type { PromptState } from '../types'

export function ShareButton({ promptState }: { promptState: PromptState }) {
  const [copied, setCopied] = useState(false)

  const share = async () => {
    try {
      await navigator.clipboard.writeText(buildShareUrl(promptState))
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      // clipboard unavailable (non-HTTPS, permission denied) — silent fail
    }
  }

  return (
    <button
      type="button"
      onClick={share}
      className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-transparent text-[#e8890c] hover:bg-[#e8890c] hover:text-white border border-[#e8890c] transition-colors"
    >
      {copied ? <Check size={12} /> : <Share2 size={12} />}
      {copied ? 'Link copied!' : 'Share'}
    </button>
  )
}
