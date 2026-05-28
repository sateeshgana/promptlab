# ⚡ PromptLab

> Compare LLM responses side-by-side. Free, open-source, no signup required.

**[✨ Try it live →](https://prompt-lab-ai.netlify.app)**

## Features

- 🔀 Run one prompt across **Llama 3.3 70B**, **DeepSeek V3**, and **Mixtral 8x7B** simultaneously
- 💾 Save prompts locally — no account needed (stored in your browser)
- 🔗 Share any prompt via URL — one click copies a shareable link
- 🔒 API keys never reach your browser — proxied server-side via Netlify Functions
- 🆓 Powered by Groq's free tier + DeepSeek

## Local development

```bash
git clone https://github.com/sateeshgana/promptlab
cd promptlab
npm install
cp .env.example .env
# Fill in your API keys in .env
npm install -g netlify-cli
netlify dev        # starts at http://localhost:8888
```

**Get free API keys:**
- Groq → [console.groq.com](https://console.groq.com) (free tier, very fast)
- DeepSeek → [platform.deepseek.com](https://platform.deepseek.com) (cheap)

## Deploy your own

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sateeshgana/promptlab)

Set environment variables in the Netlify dashboard:
- `GROQ_API_KEY`
- `DEEPSEEK_API_KEY`

## Tech stack

React 18 · TypeScript · Vite · Tailwind CSS v4 · Netlify Functions · Groq SDK

## License

MIT
