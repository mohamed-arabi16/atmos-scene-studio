// src/api/weather.ts
// Real implementation using OpenWeatherMap

export interface WeatherApiResponse {
  location: string;
  temperature: number;    // °C
  condition: string;      // 'clear' | 'cloudy' | 'rain' | ...
  humidity: number;       // %
  windSpeed: number;      // km/h
  description: string;    // e.g., 'light rain'
  icon: string;           // openweather icon code
  forecast?: Array<{
    day: string;          // e.g., 'Today', 'Tomorrow', 'Wednesday'
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
}

type OWCurrent = {
  name: string;
  sys: { country: string };
  main: { temp: number; humidity: number };
  weather: { main: string; description: string; icon: string }[];
  wind: { speed: number }; // m/s
};

type OWForecastListItem = {
  dt_txt: string; // "YYYY-MM-DD HH:mm:ss"
  main: { temp_min: number; temp_max: number };
  weather: { main: string; icon: string }[];
};

type OWForecast = { list: OWForecastListItem[] };

const mapWeatherCondition = (condition: string): string => {
  const c = condition.toLowerCase();
  const map: Record<string, string> = {
    clear: 'clear',
    clouds: 'cloudy',
    rain: 'rain',
    drizzle: 'rain',
    thunderstorm: 'thunderstorm',
    snow: 'snow',
    mist: 'cloudy',
    fog: 'cloudy',
    haze: 'cloudy',
    smoke: 'cloudy',
    dust: 'cloudy',
    sand: 'cloudy',
    ash: 'cloudy',
    squall: 'rain',
    tornado: 'thunderstorm',
  };
  return map[c] || 'clear';
};

const dayLabel = (index: number, dateStr: string): string => {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const d = new Date(dateStr);
  return d.toLocaleDateString(undefined, { weekday: 'long' });
};

// Aggregate OpenWeather 3-hour forecast into daily highs/lows and a representative condition/icon
const processForecast = (ow: OWForecast): WeatherApiResponse['forecast'] => {
  const byDate: Record<
    string,
    { highs: number[]; lows: number[]; icons: string[]; mains: string[]; firstDt: string }
  > = {};

  for (const item of ow.list) {
    const date = item.dt_txt.split(' ')[0]; // YYYY-MM-DD
    byDate[date] ??= { highs: [], lows: [], icons: [], mains: [], firstDt: item.dt_txt };
    byDate[date].highs.push(item.main.temp_max);
    byDate[date].lows.push(item.main.temp_min);
    byDate[date].icons.push(item.weather[0]?.icon || '01d');
    byDate[date].mains.push(item.weather[0]?.main || 'Clear');
  }

  const dates = Object.keys(byDate).sort();
  const next5 = dates.slice(0, 5);

  return next5.map((dateStr, i) => {
    const bucket = byDate[dateStr];
    const high = Math.round(Math.max(...bucket.highs));
    const low = Math.round(Math.min(...bucket.lows));
    // pick approx midday (fallback to first)
    const icon = bucket.icons[Math.floor(bucket.icons.length / 2)] || bucket.icons[0] || '01d';
    const main = bucket.mains[Math.floor(bucket.mains.length / 2)] || bucket.mains[0] || 'Clear';

    return {
      day: dayLabel(i, bucket.firstDt),
      high,
      low,
      condition: mapWeatherCondition(main),
      icon,
    };
  });
};

export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherApiResponse> => {
  const API_KEY = import.meta.env.VITE_OPENWEATHER_API_KEY as string;
  if (!API_KEY) throw new Error('Missing VITE_OPENWEATHER_API_KEY');

  const base = 'https://api.openweathermap.org/data/2.5';

  // Current weather
  const currentRes = await fetch(
    `${base}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  if (!currentRes.ok) throw new Error(`OpenWeather current failed: ${currentRes.status}`);
  const current = (await currentRes.json()) as OWCurrent;

  // 5-day / 3-hour forecast
  const forecastRes = await fetch(
    `${base}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
  );
  if (!forecastRes.ok) throw new Error(`OpenWeather forecast failed: ${forecastRes.status}`);
  const forecast = (await forecastRes.json()) as OWForecast;

  const mainCond = current.weather[0]?.main || 'Clear';
  const condition = mapWeatherCondition(mainCond);
  const city = current.name || `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
  const country = current.sys?.country ? `, ${current.sys.country}` : '';

  return {
    location: `${city}${country}`,
    temperature: Math.round(current.main.temp),
    condition,
    humidity: current.main.humidity,
    windSpeed: Math.round((current.wind?.speed || 0) * 3.6), // m/s → km/h
    description: current.weather[0]?.description || condition,
    icon: current.weather[0]?.icon || '01d',
    forecast: processForecast(forecast),
  };
};