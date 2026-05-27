import Groq from 'groq-sdk'
import OpenAI from 'openai'

export function buildMessages(
  prompt: string,
  systemPrompt: string,
): { role: 'system' | 'user'; content: string }[] {
  const msgs: { role: 'system' | 'user'; content: string }[] = []
  if (systemPrompt.trim()) msgs.push({ role: 'system', content: systemPrompt })
  msgs.push({ role: 'user', content: prompt })
  return msgs
}

export default async (req: Request) => {
  if (req.method !== 'POST')
    return new Response('Method Not Allowed', { status: 405 })

  let body: { prompt?: string; systemPrompt?: string; model?: string; provider?: string }
  try { body = await req.json() }
  catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })
  }

  const { prompt, systemPrompt = '', model, provider } = body
  if (!prompt || !model || !provider)
    return new Response(JSON.stringify({ error: 'prompt, model, provider required' }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })

  const messages = buildMessages(prompt, systemPrompt)

  try {
    if (provider === 'groq') {
      const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })
      const c = await groq.chat.completions.create({ model, messages, max_tokens: 2048 })
      return new Response(JSON.stringify({
        content: c.choices[0]?.message?.content ?? '',
        model: c.model,
        inputTokens:  c.usage?.prompt_tokens     ?? 0,
        outputTokens: c.usage?.completion_tokens ?? 0,
      }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    if (provider === 'deepseek') {
      const ds = new OpenAI({ apiKey: process.env.DEEPSEEK_API_KEY, baseURL: 'https://api.deepseek.com' })
      const c = await ds.chat.completions.create({ model, messages, max_tokens: 2048 })
      return new Response(JSON.stringify({
        content: c.choices[0]?.message?.content ?? '',
        model: c.model,
        inputTokens:  c.usage?.prompt_tokens     ?? 0,
        outputTokens: c.usage?.completion_tokens ?? 0,
      }), { status: 200, headers: { 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ error: `Unknown provider: ${provider}` }), {
      status: 400, headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return new Response(JSON.stringify({ error: message }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    })
  }
}

export const config = { path: '/api/run-prompt' }
