import { streamOpenRouter } from '@/lib/openrouter';
import { PAKISTAN_CITIES, DISCO_TARIFFS, SOLAR_EQUIPMENT, SITE_LOAD_PROFILES } from '@/lib/pakistan-data';
import { fetchLiveWeather } from '@/lib/weather-service';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { messages, language = 'en', context } = await req.json();

    const activeCity = context?.city || 'Multan';
    const cityMeta = PAKISTAN_CITIES[activeCity] || PAKISTAN_CITIES['Multan'];
    const disco = DISCO_TARIFFS[cityMeta.disco] || DISCO_TARIFFS['LESCO'];

    // Pre-fetch live weather for active city to provide maximum AI context accuracy
    let liveWeatherDesc = "Sunny & Clear (6.2h Sun)";
    try {
      const weather = await fetchLiveWeather(activeCity);
      liveWeatherDesc = `${weather.weatherDescription}, Temp: ${weather.temperatureC}°C, Cloud: ${weather.cloudCoverPct}%, Wind: ${weather.windSpeedKmh}km/h`;
    } catch {
      // Fallback
    }

    const systemPrompt = `You are Sabz Saathi (سبز ساتھی), Pakistan's premier AI Energy Consultant built for the Sabz Synergy platform.

CRITICAL IDENTITY & EXPERTISE:
- You possess deep, accurate knowledge of Pakistan's energy sector, solar PV sizing, battery storage (Lithium LiFePO4 & Lead Acid), wind hybrid systems, NEPRA tariffs, and Islamic financing.
- You know all 10 DISCOs in Pakistan:
  * LESCO (Lahore): Peak ${DISCO_TARIFFS['LESCO'].peakRatePKR} PKR, Off-Peak ${DISCO_TARIFFS['LESCO'].offPeakRatePKR} PKR, Net Buyback ${DISCO_TARIFFS['LESCO'].netMeteringBuybackPKR} PKR
  * K-Electric (Karachi): Peak ${DISCO_TARIFFS['K-Electric'].peakRatePKR} PKR, Off-Peak ${DISCO_TARIFFS['K-Electric'].offPeakRatePKR} PKR, Net Buyback ${DISCO_TARIFFS['K-Electric'].netMeteringBuybackPKR} PKR
  * IESCO (Islamabad/Rawalpindi), MEPCO (Multan), PESCO (Peshawar), GEPCO (Gujranwala), FESCO (Faisalabad), HESCO (Hyderabad), SEPCO (Sukkur), QESCO (Quetta).
- You know Islamic Financing:
  * Meezan Bank Diminishing Musharakah (0% Riba, 20% down payment, co-ownership buyback).
  * Meezan Bank Ijarah (Lease-to-own with bank Takaful insurance).
  * State Bank of Pakistan (SBP) Renewable Energy Refinance Scheme (6% concessional fixed rate).
- You know equipment available in Pakistan:
  * Panels: Longi Hi-MO 6 (585W), JA Solar DeepBlue 4.0 (575W), Canadian Solar (690W), Jinko Tiger Neo (600W).
  * Inverters: Fronius Symo, Solis Hybrid, Huawei SUN2000, Growatt SPH.
  * Batteries: Pylontech US5000 4.8kWh LiFePO4, Dyness Tower 10.6kWh.

CURRENT REAL-TIME CONTEXT:
- Active User City: ${activeCity}, ${cityMeta.province} (${cityMeta.peakSunHours} peak sun hours/day)
- Local Grid DISCO: ${disco.name} (${disco.fullName})
- Current Live Weather: ${liveWeatherDesc}
${context?.sizingResult ? `- Current User Calculated System: ${context.sizingResult.systemKW} kW Solar, PKR ${context.sizingResult.estimatedBudgetLakh} Lakh cost, ${context.sizingResult.paybackYears} yr payback` : ''}

INSTRUCTIONS:
1. Respond in ${language === 'ur' ? 'Urdu (use Nastaliq script or Roman Urdu matching the user style)' : 'English with Pakistani domain terms (PKR, lakh, crore, load shedding, tubewell, marla, kanal, NEPRA)'}.
2. Use clean markdown formatting with bullet points, bold headers, and key numbers formatted in PKR.
3. Be direct, authoritative, encouraging, and highly specific to Pakistani conditions.
4. When asked for calculations, provide step-by-step numbers, equipment recommendations, and Islamic financing options.`;

    const formattedMessages = [
      { role: 'system' as const, content: systemPrompt },
      ...messages.slice(-10), // Send last 10 turns for deeper memory
    ];

    const openRouterRes = await streamOpenRouter(formattedMessages, {
      model: 'google/gemini-2.0-flash-001',
      temperature: 0.7,
      max_tokens: 1500,
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
