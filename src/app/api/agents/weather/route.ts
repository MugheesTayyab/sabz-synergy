import { NextResponse } from 'next/server';
import { fetchLiveWeather } from '@/lib/weather-service';
import { PAKISTAN_CITIES } from '@/lib/pakistan-data';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const city = searchParams.get('city') || 'Multan';

    const weather = await fetchLiveWeather(city);
    const cityMeta = PAKISTAN_CITIES[city] || PAKISTAN_CITIES['Multan'];

    const loadSheddingBaseHours = cityMeta.baseLoadSheddingHours;
    const nowHour = new Date().getHours();

    // 24-hour load shedding prediction schedule
    const hourlyPrediction = Array.from({ length: 24 }, (_, i) => {
      const hour = (nowHour + i) % 24;
      const isPeakHour = (hour >= 13 && hour <= 16) || (hour >= 20 && hour <= 22);
      const isNight = hour >= 0 && hour <= 5;
      
      let outageProbability = isPeakHour ? 0.85 : isNight ? 0.20 : 0.45;
      if (cityMeta.province === 'Balochistan' || cityMeta.province === 'Sindh') {
        outageProbability = Math.min(0.95, outageProbability + 0.15);
      }

      return {
        hour: `${hour.toString().padStart(2, '0')}:00`,
        status: outageProbability > 0.6 ? 'HIGH_OUTAGE_RISK' : outageProbability > 0.35 ? 'MODERATE_RISK' : 'GRID_STABLE',
        outageProbabilityPct: Math.round(outageProbability * 100),
      };
    });

    return NextResponse.json({
      city: cityMeta.name,
      province: cityMeta.province,
      baseLoadSheddingHours: loadSheddingBaseHours,
      currentWeather: {
        temp: weather.temperatureC,
        desc: weather.weatherDescription,
        cloudCoverPct: weather.cloudCoverPct,
        windSpeedKmh: weather.windSpeedKmh,
        sunrise: weather.sunrise,
        sunset: weather.sunset,
        shortwaveRadiation: weather.shortwaveRadiationWm2,
      },
      forecast72h: weather.forecast72h,
      loadSheddingPrediction: hourlyPrediction,
      aiAdvice: `Weather in ${cityMeta.name} is ${weather.weatherDescription.toLowerCase()}. Expect around ~${loadSheddingBaseHours} hours load-shedding today. Solar generation is predicted at ${Math.round(weather.cloudFactor * 100)}% efficiency.`,
    });
  } catch (error: any) {
    console.error('Weather API Error:', error);
    return NextResponse.json({ error: error.message || 'Weather prediction error' }, { status: 500 });
  }
}
