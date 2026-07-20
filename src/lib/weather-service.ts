import { PAKISTAN_CITIES } from './pakistan-data';

export interface WeatherData {
  city: string;
  province: string;
  temperatureC: number;
  weatherCode: number;
  weatherDescription: string;
  cloudCoverPct: number;
  windSpeedKmh: number;
  shortwaveRadiationWm2: number;
  sunrise: string;
  sunset: string;
  cloudFactor: number;
  forecast72h: Array<{
    time: string;
    temp: number;
    cloud: number;
    radiation: number;
    expectedSolarPct: number;
  }>;
}

const weatherCodeMap: Record<number, { desc: string; factor: number }> = {
  0: { desc: "Clear Sky ☀️", factor: 1.0 },
  1: { desc: "Mainly Clear 🌤️", factor: 0.95 },
  2: { desc: "Partly Cloudy ⛅", factor: 0.80 },
  3: { desc: "Overcast ☁️", factor: 0.55 },
  45: { desc: "Foggy 🌫️", factor: 0.50 },
  51: { desc: "Light Drizzle 🌧️", factor: 0.40 },
  61: { desc: "Slight Rain 🌧️", factor: 0.25 },
  63: { desc: "Moderate Rain 🌧️", factor: 0.18 },
  80: { desc: "Rain Showers 🌦️", factor: 0.20 },
  95: { desc: "Thunderstorm 🌩️", factor: 0.10 },
};

export async function fetchLiveWeather(cityName: string): Promise<WeatherData> {
  const city = PAKISTAN_CITIES[cityName] || PAKISTAN_CITIES["Multan"];
  
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,weather_code,cloud_cover,wind_speed_10m&hourly=temperature_2m,cloud_cover,shortwave_radiation&daily=sunrise,sunset&timezone=Asia/Karachi&forecast_days=3`;
    const res = await fetch(url, { next: { revalidate: 1800 } }); // Cache 30 mins
    if (!res.ok) throw new Error("Weather API failed");
    
    const data = await res.json();
    const currentCode = data.current?.weather_code ?? 0;
    const weatherMeta = weatherCodeMap[currentCode] || { desc: "Fair Weather 🌤️", factor: 0.85 };

    const hourlyTimes = data.hourly?.time || [];
    const hourlyTemps = data.hourly?.temperature_2m || [];
    const hourlyClouds = data.hourly?.cloud_cover || [];
    const hourlyRad = data.hourly?.shortwave_radiation || [];

    const forecast72h = [];
    for (let i = 0; i < Math.min(72, hourlyTimes.length); i += 3) {
      const rad = hourlyRad[i] || 0;
      // Solar percentage proxy based on irradiance radiation
      const solarPct = Math.min(100, Math.round((rad / 900) * 100 * weatherMeta.factor));
      forecast72h.push({
        time: hourlyTimes[i] ? new Date(hourlyTimes[i]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : `Hour ${i}`,
        temp: hourlyTemps[i] ?? 28,
        cloud: hourlyClouds[i] ?? 20,
        radiation: Math.round(rad),
        expectedSolarPct: Math.max(10, solarPct),
      });
    }

    return {
      city: city.name,
      province: city.province,
      temperatureC: Math.round(data.current?.temperature_2m ?? 32),
      weatherCode: currentCode,
      weatherDescription: weatherMeta.desc,
      cloudCoverPct: Math.round(data.current?.cloud_cover ?? 15),
      windSpeedKmh: Math.round(data.current?.wind_speed_10m ?? 12),
      shortwaveRadiationWm2: Math.round(hourlyRad[12] ?? 750),
      sunrise: data.daily?.sunrise?.[0] ? new Date(data.daily.sunrise[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "05:30 AM",
      sunset: data.daily?.sunset?.[0] ? new Date(data.daily.sunset[0]).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) : "07:15 PM",
      cloudFactor: weatherMeta.factor,
      forecast72h,
    };
  } catch (err) {
    console.warn("Falling back to local weather data for", cityName, err);
    return {
      city: city.name,
      province: city.province,
      temperatureC: 34,
      weatherCode: 0,
      weatherDescription: "Sunny & Warm ☀️",
      cloudCoverPct: 10,
      windSpeedKmh: 14,
      shortwaveRadiationWm2: 820,
      sunrise: "05:32 AM",
      sunset: "07:12 PM",
      cloudFactor: 1.0,
      forecast72h: Array.from({ length: 24 }, (_, i) => ({
        time: `${i * 3}:00`,
        temp: 30 + Math.sin(i) * 5,
        cloud: 15,
        radiation: Math.max(0, Math.sin((i / 8) * Math.PI) * 850),
        expectedSolarPct: Math.max(15, Math.round(Math.sin((i / 8) * Math.PI) * 90)),
      })),
    };
  }
}
