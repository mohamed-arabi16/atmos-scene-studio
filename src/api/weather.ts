// This is a server-side API route for fetching weather data
// Note: In a real Vite/React app, this would typically be handled by a backend
// For now, we'll create a mock API that can be replaced with actual server implementation

interface WeatherApiResponse {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
  forecast?: Array<{
    day: string;
    high: number;
    low: number;
    condition: string;
    icon: string;
  }>;
}

// Mock weather data generator based on location
export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherApiResponse> => {
  // In a real implementation, this would use the OPENWEATHER_API_KEY secret
  // and make actual API calls to OpenWeatherMap
  
  // For demo purposes, we'll generate realistic mock data
  const conditions = ['clear', 'partly-cloudy', 'cloudy', 'rain', 'snow'];
  const currentCondition = conditions[Math.floor(Math.random() * conditions.length)];
  
  const cities = [
    'New York, NY',
    'Los Angeles, CA',
    'Chicago, IL',
    'Houston, TX',
    'Phoenix, AZ',
    'Philadelphia, PA',
    'San Antonio, TX',
    'San Diego, CA',
    'Dallas, TX',
    'San Jose, CA'
  ];
  
  const baseTemp = 15 + Math.random() * 20; // 15-35°C
  const humidity = 40 + Math.random() * 40; // 40-80%
  const windSpeed = 5 + Math.random() * 25; // 5-30 km/h
  
  const descriptions = {
    'clear': 'Clear skies with gentle breeze',
    'partly-cloudy': 'Partly cloudy with mild conditions', 
    'cloudy': 'Overcast with cool temperatures',
    'rain': 'Light showers throughout the day',
    'snow': 'Snow flurries and cold conditions'
  };

  // Generate 5-day forecast
  const days = ['Today', 'Tomorrow', 'Wednesday', 'Thursday', 'Friday'];
  const forecast = days.map((day, index) => {
    const dayCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const variation = (Math.random() - 0.5) * 10; // ±5°C variation
    
    return {
      day,
      high: Math.round(baseTemp + variation + Math.random() * 5),
      low: Math.round(baseTemp + variation - Math.random() * 8),
      condition: dayCondition,
      icon: '01d' // Simplified for demo
    };
  });

  return {
    location: cities[Math.floor(Math.random() * cities.length)],
    temperature: Math.round(baseTemp),
    condition: currentCondition,
    humidity: Math.round(humidity),
    windSpeed: Math.round(windSpeed),
    description: descriptions[currentCondition as keyof typeof descriptions],
    icon: '01d',
    forecast
  };
};

// For actual implementation with OpenWeatherMap API:
/*
export const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherApiResponse> => {
  const API_KEY = process.env.OPENWEATHER_API_KEY;
  
  try {
    // Current weather
    const currentResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const currentData = await currentResponse.json();
    
    // 5-day forecast
    const forecastResponse = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );
    const forecastData = await forecastResponse.json();
    
    // Process and return formatted data
    return {
      location: `${currentData.name}, ${currentData.sys.country}`,
      temperature: Math.round(currentData.main.temp),
      condition: mapWeatherCondition(currentData.weather[0].main.toLowerCase()),
      humidity: currentData.main.humidity,
      windSpeed: Math.round(currentData.wind.speed * 3.6), // m/s to km/h
      description: currentData.weather[0].description,
      icon: currentData.weather[0].icon,
      forecast: processForecastData(forecastData.list)
    };
  } catch (error) {
    console.error('Weather API error:', error);
    throw error;
  }
};

const mapWeatherCondition = (condition: string): string => {
  const conditionMap: Record<string, string> = {
    'clear': 'clear',
    'clouds': 'cloudy',
    'rain': 'rain',
    'drizzle': 'rain',
    'thunderstorm': 'thunderstorm',
    'snow': 'snow',
    'mist': 'cloudy',
    'fog': 'cloudy'
  };
  return conditionMap[condition] || 'clear';
};
*/