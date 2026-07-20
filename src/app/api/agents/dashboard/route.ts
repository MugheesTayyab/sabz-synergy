import { NextResponse } from 'next/server';
import { fetchLiveWeather } from '@/lib/weather-service';
import { PAKISTAN_CITIES, DISCO_TARIFFS } from '@/lib/pakistan-data';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city') || 'Sheikhupura';
    const siteType = searchParams.get('siteType') || 'Farm';
    const systemKW = parseFloat(searchParams.get('systemKW') || '18');

    const weather = await fetchLiveWeather(city);
    const cityMeta = PAKISTAN_CITIES[city] || PAKISTAN_CITIES['Sheikhupura'];
    const disco = DISCO_TARIFFS[cityMeta.disco] || DISCO_TARIFFS['LESCO'];

    const now = new Date();
    const currentHour = now.getHours();

    // Solar production calculation based on time of day and cloud factor
    let solarMultiplier = 0;
    if (currentHour >= 6 && currentHour <= 19) {
      const sunAngle = Math.sin(((currentHour - 6) / 13) * Math.PI);
      solarMultiplier = Math.max(0, sunAngle * weather.cloudFactor);
    }
    const currentSolarProductionKW = Math.round(systemKW * solarMultiplier * 10) / 10;

    // Load estimation based on site type & hour
    let loadBaseKW = systemKW * 0.45;
    if (siteType === 'Farm') {
      loadBaseKW = (currentHour >= 7 && currentHour <= 17) ? systemKW * 0.8 : systemKW * 0.2;
    } else if (siteType === 'School') {
      loadBaseKW = (currentHour >= 8 && currentHour <= 15) ? systemKW * 0.9 : systemKW * 0.05;
    }
    const currentLoadKW = Math.round(loadBaseKW * (0.85 + Math.random() * 0.3) * 10) / 10;

    // Battery SOC simulation
    let batterySOC = 78;
    if (currentSolarProductionKW > currentLoadKW) {
      batterySOC = Math.min(100, Math.round(75 + (currentSolarProductionKW - currentLoadKW) * 2));
    } else {
      batterySOC = Math.max(20, Math.round(75 - (currentLoadKW - currentSolarProductionKW) * 3));
    }

    // Grid status simulation (load shedding windows)
    const isLoadSheddingHour = (currentHour >= 14 && currentHour <= 16) || (currentHour >= 21 && currentHour <= 22);
    const gridStatus = isLoadSheddingHour ? 'OFFLINE' : 'ONLINE';

    // Daily cumulative totals (kWh)
    const todaysSolarKWh = Math.round(systemKW * cityMeta.peakSunHours * 0.85 * (currentHour / 24));
    const todaysUsageKWh = Math.round(currentLoadKW * 12);
    const monthSavingsPKR = Math.round(todaysSolarKWh * 30 * disco.offPeakRatePKR);

    // AI Insight Ticker Generation
    let aiInsight = `Solar production is at ${Math.round(solarMultiplier * 100)}% capacity under ${weather.weatherDescription.toLowerCase()} in ${city}.`;
    if (gridStatus === 'OFFLINE') {
      aiInsight = `⚡ Grid is OFFLINE in ${city}. Battery powering load at ${batterySOC}% state of charge. Estimated backup: 4.5 hours remaining.`;
    } else if (weather.cloudCoverPct > 40) {
      aiInsight = `☁️ Overcast skies in ${city} (-${weather.cloudCoverPct}% solar yield). Battery will automatically cushion peak tubewell loads.`;
    } else if (solarMultiplier > 0.7) {
      aiInsight = `☀️ Peak solar window active! System producing +${currentSolarProductionKW} kW surplus. Optimal time to run heavy motor machinery.`;
    }

    // 7-Day History + Forecast Bar Chart Data
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun', 'Mon (Fcst)', 'Tue (Fcst)', 'Wed (Fcst)'];
    const chartData = days.map((day, i) => {
      const isForecast = i >= 7;
      const baseSolar = Math.round(systemKW * cityMeta.peakSunHours * (0.75 + (Math.sin(i) * 0.15)));
      const baseUsage = Math.round(todaysUsageKWh * (0.8 + (Math.cos(i) * 0.1)));
      return {
        label: day,
        solar: baseSolar,
        usage: baseUsage,
        forecast: isForecast,
      };
    });

    return NextResponse.json({
      city: cityMeta.name,
      province: cityMeta.province,
      disco: disco.name,
      siteType,
      systemKW,
      currentSolarProductionKW,
      currentLoadKW,
      todaysSolarKWh,
      todaysUsageKWh,
      batterySOC,
      gridStatus,
      monthSavingsPKR,
      weather: {
        temp: weather.temperatureC,
        desc: weather.weatherDescription,
        cloud: weather.cloudCoverPct,
        wind: weather.windSpeedKmh,
      },
      aiInsight,
      chartData,
      lastUpdated: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    });
  } catch (error: any) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json({ error: error.message || 'Dashboard service error' }, { status: 500 });
  }
}
