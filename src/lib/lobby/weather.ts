/**
 * LOBBY OPERATIONAL SITE WEATHER SERVICE
 * =======================================
 * Fetches real-time UK weather conditions and 4-day outlook via Open-Meteo.
 * Default location: EntireFM Operational Hub (Midlands / Birmingham, Lat: 52.4862, Lng: -1.8904).
 * Focused on FM site-work planning: rooftop access, wind gusts, exterior inspections.
 * Free, non-commercial/commercial friendly, no API keys required, 100% real-time.
 */

export interface WeatherDayOutlook {
  date: string;
  dayName: string;
  maxTemp: number;
  minTemp: number;
  condition: string;
  precipitationProbability: number;
  windSpeedMax: number;
}

export interface LobbyWeatherData {
  locationName: string;
  region: string;
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  windSpeedMph: number;
  windGustsMph: number;
  condition: string;
  weatherCode: number;
  summary: string;
  isSafeForRoofAccess: boolean;
  roofAccessAdvisory: string;
  outlook: WeatherDayOutlook[];
  updatedAt: string;
}

/**
 * WMO Weather interpretation codes (WW)
 */
function interpretWmoCode(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1) return 'Mainly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';
  if (code === 45 || code === 48) return 'Foggy / Reduced Visibility';
  if (code >= 51 && code <= 55) return 'Light Drizzle';
  if (code >= 61 && code <= 65) return 'Rain Showers';
  if (code >= 71 && code <= 77) return 'Snow Flurries';
  if (code >= 80 && code <= 82) return 'Heavy Rain Showers';
  if (code >= 95 && code <= 99) return 'Thunderstorm Alert';
  return 'Variable Conditions';
}

const DAYS_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export async function getLobbyWeatherData(): Promise<LobbyWeatherData | null> {
  const latitude = 52.4862;
  const longitude = -1.8904;
  const locationName = 'Midlands Operational Hub';
  const region = 'West & East Midlands (UK Central)';

  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&wind_speed_unit=mph&timeformat=iso8601&timezone=Europe%2FLondon`;

    const res = await fetch(url, {
      next: { revalidate: 1800 }, // 30 minutes cache
      headers: { 'User-Agent': 'EntireFM-Lobby-Weather/1.0' },
    });

    if (!res.ok) {
      console.warn(`[Lobby Weather] Open-Meteo returned status ${res.status}`);
      return null;
    }

    const data = await res.json();
    const current = data.current;
    const daily = data.daily;

    if (!current) return null;

    const condition = interpretWmoCode(current.weather_code);
    const temp = Math.round(current.temperature_2m);
    const windSpeed = Math.round(current.wind_speed_10m);
    const windGusts = Math.round(current.wind_gusts_10m);

    // FM Safety Threshold: Rooftop plant access typically restricted when gusts exceed 23mph (Force 6)
    const isSafeForRoofAccess = windGusts < 24 && current.precipitation === 0;
    let roofAccessAdvisory = 'Normal rooftop plant access permitted';
    if (windGusts >= 24) {
      roofAccessAdvisory = `Caution: Wind gusts ${windGusts}mph exceed recommended ladder/roof boundary limits`;
    } else if (current.precipitation > 0) {
      roofAccessAdvisory = 'Slippery roof surface caution during active precipitation';
    }

    const summary = `${condition}, ${temp}°C, Wind ${windSpeed}mph (gusts ${windGusts}mph)`;

    // 4-day outlook (skipping index 0 which is today)
    const outlook: WeatherDayOutlook[] = [];
    if (daily && Array.isArray(daily.time)) {
      for (let i = 1; i <= 4 && i < daily.time.length; i++) {
        const dateStr = daily.time[i];
        const dayDate = new Date(dateStr);
        const dayName = DAYS_SHORT[dayDate.getDay()];
        outlook.push({
          date: dateStr,
          dayName,
          maxTemp: Math.round(daily.temperature_2m_max[i]),
          minTemp: Math.round(daily.temperature_2m_min[i]),
          condition: interpretWmoCode(daily.weather_code[i]),
          precipitationProbability: daily.precipitation_probability_max?.[i] ?? 0,
          windSpeedMax: Math.round(daily.wind_speed_10m_max?.[i] ?? 0),
        });
      }
    }

    return {
      locationName,
      region,
      temperature: temp,
      apparentTemperature: Math.round(current.apparent_temperature),
      humidity: current.relative_humidity_2m,
      windSpeedMph: windSpeed,
      windGustsMph: windGusts,
      condition,
      weatherCode: current.weather_code,
      summary,
      isSafeForRoofAccess,
      roofAccessAdvisory,
      outlook,
      updatedAt: new Date().toISOString(),
    };
  } catch (err: any) {
    console.warn('[Lobby Weather Error]:', err.message);
    return null;
  }
}
