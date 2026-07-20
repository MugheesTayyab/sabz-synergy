export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface OpenRouterOptions {
  model?: string;
  temperature?: number;
  max_tokens?: number;
  stream?: boolean;
}

const DEFAULT_MODELS = [
  'google/gemini-2.0-flash-001',
  'meta-llama/llama-3.3-70b-instruct',
  'openai/gpt-4o-mini',
  'deepseek/deepseek-chat'
];

export async function callOpenRouter(
  messages: Message[],
  options: OpenRouterOptions = {}
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is missing in environment variables.');
  }

  const modelsToTry = options.model ? [options.model, ...DEFAULT_MODELS] : DEFAULT_MODELS;
  let lastError = '';

  for (const model of modelsToTry) {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://sabz-synergy.vercel.app',
          'X-Title': 'Sabz Synergy Energy Intelligence Platform',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: options.temperature ?? 0.7,
          max_tokens: options.max_tokens ?? 1500,
          stream: false,
        }),
      });

      if (!response.ok) {
        const errText = await response.text();
        console.warn(`OpenRouter model ${model} failed (${response.status}): ${errText}`);
        lastError = errText;
        continue;
      }

      const data = await response.json();
      const text = data.choices?.[0]?.message?.content;
      if (text) return text;
    } catch (err: any) {
      console.warn(`OpenRouter model ${model} fetch exception:`, err);
      lastError = err?.message || String(err);
    }
  }

  throw new Error(`All OpenRouter AI models failed. Last error: ${lastError}`);
}

export async function streamOpenRouter(
  messages: Message[],
  options: OpenRouterOptions = {}
): Promise<Response> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is missing in environment variables.');
  }

  const model = options.model || DEFAULT_MODELS[0];

  return fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://sabz-synergy.vercel.app',
      'X-Title': 'Sabz Synergy Energy Intelligence Platform',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 1500,
      stream: true,
    }),
  });
}
