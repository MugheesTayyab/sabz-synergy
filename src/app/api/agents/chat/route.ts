import { NextResponse } from 'next/server';
import { streamOpenRouter, callOpenRouter } from '@/lib/openrouter';
import { PAKISTAN_CITIES, DISCO_TARIFFS } from '@/lib/pakistan-data';
import { fetchLiveWeather } from '@/lib/weather-service';

export async function POST(req: Request) {
  try {
    const { messages, language = 'en', context } = await req.json();

    const activeCity = context?.city || 'Multan';
    const cityMeta = PAKISTAN_CITIES[activeCity] || PAKISTAN_CITIES['Multan'];
    const disco = DISCO_TARIFFS[cityMeta.disco] || DISCO_TARIFFS['LESCO'];

    let liveWeatherDesc = "Sunny & Clear (6.2h Sun)";
    try {
      const weather = await fetchLiveWeather(activeCity);
      liveWeatherDesc = `${weather.weatherDescription}, Temp: ${weather.temperatureC}°C, Cloud: ${weather.cloudCoverPct}%, Wind: ${weather.windSpeedKmh}km/h`;
    } catch {
      // Weather fallback
    }

    const systemPrompt = `You are Sabz Saathi (سبز ساتھی), Pakistan's premier AI Energy Consultant built for Sabz Synergy.

CRITICAL IDENTITY & EXPERTISE:
- You possess deep, accurate knowledge of Pakistan's energy sector, solar PV sizing, battery storage (Lithium LiFePO4 & Lead Acid), wind hybrid systems, NEPRA tariffs, and Islamic financing.
- You know all 10 DISCOs in Pakistan (LESCO, K-Electric, IESCO, MEPCO, PESCO, GEPCO, FESCO, HESCO, SEPCO, QESCO).
- You know Meezan Bank Islamic Financing (Diminishing Musharakah 0% Riba & Ijarah lease) and SBP 6% concessional scheme.
- You know equipment available in Pakistan: Longi 585W, JA Solar 575W, Canadian Solar 690W, Fronius, Solis, Huawei, Growatt, Pylontech US5000.

CURRENT REAL-TIME CONTEXT:
- Active User City: ${activeCity}, ${cityMeta.province} (${cityMeta.peakSunHours} peak sun hours/day)
- Local Grid DISCO: ${disco.name} (${disco.fullName})
- Current Live Weather: ${liveWeatherDesc}
${context?.sizingResult ? `- Current User Sizing: ${context.sizingResult.systemKW} kW Solar, PKR ${context.sizingResult.estimatedBudgetLakh} Lakh cost, ${context.sizingResult.paybackYears} yr payback` : ''}

INSTRUCTIONS:
1. Respond in ${language === 'ur' ? 'Urdu (use Nastaliq script or Roman Urdu matching the user style)' : 'English with Pakistani domain terms (PKR, lakh, crore, load shedding, tubewell, marla, kanal, NEPRA)'}.
2. Use clean markdown formatting with bullet points, bold headers, and key numbers formatted in PKR.
3. Be direct, authoritative, encouraging, and highly specific to Pakistani conditions.`;

    const formattedMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.slice(-8),
    ];

    // Try streaming response first
    try {
      const openRouterRes = await streamOpenRouter(formattedMessages, {
        model: 'google/gemini-2.0-flash-001',
        temperature: 0.7,
        max_tokens: 1500,
      });

      if (openRouterRes.ok && openRouterRes.body) {
        return new Response(openRouterRes.body, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
          },
        });
      }
    } catch (streamErr) {
      console.warn("Streaming failed, falling back to non-streaming AI completion:", streamErr);
    }

    // Fallback to non-streaming response
    const replyText = await callOpenRouter(formattedMessages, { max_tokens: 1500 });
    return NextResponse.json({ reply: replyText });
  } catch (error: any) {
    console.error('Chat API Error:', error);
    return NextResponse.json({
      reply: `Assalam-o-Alaikum! For solar in Pakistan, a 10 Marla home typically needs an **8 kW to 10 kW** solar system costing **PKR 18 Lakh to 22 Lakh** (with 10 kWh battery backup) yielding **PKR 4.5 Lakh/year** in savings with a **4-year payback period** under NEPRA net metering.`
    });
  }
}
