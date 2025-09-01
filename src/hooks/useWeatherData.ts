import { useState, useEffect, useCallback } from 'react';
import { fetchWeatherData } from '@/api/weather';

interface WeatherData {
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

interface UseWeatherDataReturn {
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  locationError: boolean;
  refetch: () => Promise<void>;
}

export const useWeatherData = (): UseWeatherDataReturn => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locationError, setLocationError] = useState(false);

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation not supported'));
        return;
      }
      
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 300000, // 5 minutes
      });
    });
  };

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setLocationError(false);
      
      // Get user's location
      const position = await getCurrentPosition();
      const { latitude, longitude } = position.coords;
      
      // Fetch weather data using our API
      const data = await fetchWeatherData(latitude, longitude);
      setWeatherData(data);
    } catch (err: any) {
      console.error('Weather fetch error:', err);

      if (err.message.includes('Geolocation')) {
        setError('Unable to retrieve location. Please enable location services in your browser.');
        setLocationError(true);
      } else {
        setError('Unable to load weather data');
      }
      
      // Fallback to demo data
      setWeatherData({
        location: 'San Francisco, CA',
        temperature: 22,
        condition: 'clear',
        humidity: 65,
        windSpeed: 12,
        description: 'Clear skies with gentle breeze',
        icon: '01d',
        forecast: [
          { day: 'Today', high: 24, low: 18, condition: 'clear', icon: '01d' },
          { day: 'Tomorrow', high: 26, low: 19, condition: 'partly-cloudy', icon: '02d' },
          { day: 'Wednesday', high: 23, low: 17, condition: 'cloudy', icon: '03d' },
          { day: 'Thursday', high: 21, low: 16, condition: 'rain', icon: '09d' },
          { day: 'Friday', high: 25, low: 20, condition: 'clear', icon: '01d' },
        ]
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    weatherData,
    loading,
    error,
    locationError,
    refetch: fetchData
  };
};