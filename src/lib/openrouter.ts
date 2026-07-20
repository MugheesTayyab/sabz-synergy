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

const DEFAULT_MODEL = 'google/gemini-2.0-flash-001';

export async function callOpenRouter(
  messages: Message[],
  options: OpenRouterOptions = {}
): Promise<string> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set in environment variables.');
  }

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://sabz-synergy.vercel.app',
      'X-Title': 'Sabz Synergy Energy Intelligence Platform',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model || DEFAULT_MODEL,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 2048,
      stream: false,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error('OpenRouter Error:', errorText);
    throw new Error(`OpenRouter API Error (${response.status}): ${errorText}`);
  }

  const data = await response.json();
  return data.choices?.[0]?.message?.content || '';
}

export async function streamOpenRouter(
  messages: Message[],
  options: OpenRouterOptions = {}
): Promise<Response> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set in environment variables.');
  }

  return fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'HTTP-Referer': 'https://sabz-synergy.vercel.app',
      'X-Title': 'Sabz Synergy Energy Intelligence Platform',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: options.model || DEFAULT_MODEL,
      messages,
      temperature: options.temperature ?? 0.7,
      max_tokens: options.max_tokens ?? 2048,
      stream: true,
    }),
  });
}
