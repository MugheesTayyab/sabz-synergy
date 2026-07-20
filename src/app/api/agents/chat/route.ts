import { streamOpenRouter } from '@/lib/openrouter';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, language = 'en', context } = await req.json();

    const systemPrompt = `You are Sabz Saathi (سبز ساتھی), Pakistan's premier AI Energy Consultant built for Sabz Synergy.

YOUR PERSONALITY & KNOWLEDGE:
- Expert in Pakistan solar energy, battery backup, wind hybrid systems, NEPRA tariffs, DISCOs (LESCO, K-Electric, IESCO, MEPCO, PESCO, GEPCO, FESCO, HESCO, SEPCO, QESCO), and Meezan Bank Islamic Financing (Diminishing Musharakah & Ijarah).
- Speak fluent ${language === 'ur' ? 'Urdu (use Nastaliq or Roman Urdu matching user style)' : 'English with Pakistani terms like load shedding, tube well, lakh, crore, PKR'}.
- Provide direct, accurate, data-backed advice in PKR.
- Always encourage clean green energy while focusing on practical financial savings for Pakistani households, farms, schools, and factories.

${context ? `USER UI CONTEXT: ${JSON.stringify(context)}` : ''}`;

    const formattedMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.slice(-8), // Send last 8 turns
    ];

    const openRouterRes = await streamOpenRouter(formattedMessages, {
      model: 'google/gemini-2.0-flash-001',
      temperature: 0.7,
      max_tokens: 1024,
    });

    if (!openRouterRes.ok) {
      const errorText = await openRouterRes.text();
      return new Response(JSON.stringify({ error: `AI stream failed: ${errorText}` }), { status: 500 });
    }

    return new Response(openRouterRes.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ error: error.message || 'Chat service error' }), { status: 500 });
  }
}
