interface WeatherData {
  location: string;
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  description: string;
  icon: string;
}

interface CurrentWeatherProps {
  data: WeatherData;
}

export const CurrentWeather = ({ data }: CurrentWeatherProps) => {
  const getWeatherIcon = (condition: string) => {
    const iconMap: Record<string, string> = {
      'clear': '☀️',
      'partly-cloudy': '⛅',
      'cloudy': '☁️',
      'rain': '🌧️',
      'snow': '❄️',
      'thunderstorm': '⛈️',
    };
    return iconMap[condition] || '☀️';
  };

  return (
    <div className="text-center space-y-8 animate-fade-in">
      {/* Location */}
      <div className="space-y-2">
        <h2 className="text-xl font-light text-muted-foreground tracking-wide">
          {data.location}
        </h2>
        <p className="text-sm text-muted-foreground/70 capitalize">
          {data.description}
        </p>
      </div>

      {/* Main Weather Display */}
      <div className="space-y-6">
        {/* Weather Icon */}
        <div className="flex justify-center">
          <div className="text-8xl animate-float">
            {getWeatherIcon(data.condition)}
          </div>
        </div>

        {/* Temperature */}
        <div className="space-y-2">
          <div className="temperature-display animate-slide-up">
            {data.temperature}°
          </div>
          <p className="text-lg text-muted-foreground capitalize">
            {data.condition.replace('-', ' ')}
          </p>
        </div>
      </div>

      {/* Weather Details */}
      <div className="grid grid-cols-2 gap-8 max-w-md mx-auto">
        <div className="weather-card p-6 space-y-2 animate-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="text-2xl">💧</div>
          <div className="text-sm text-muted-foreground">Humidity</div>
          <div className="text-xl font-light">{data.humidity}%</div>
        </div>
        
        <div className="weather-card p-6 space-y-2 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="text-2xl">💨</div>
          <div className="text-sm text-muted-foreground">Wind</div>
          <div className="text-xl font-light">{data.windSpeed} km/h</div>
        </div>
      </div>

      {/* Atmospheric Details */}
      <div className="mt-12 space-y-4">
        <div className="weather-card p-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.6s' }}>
          <h3 className="text-lg font-light mb-4 text-muted-foreground">Today's Atmosphere</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="space-y-2">
              <div className="text-3xl animate-pulse-soft">🌡️</div>
              <div className="text-sm text-muted-foreground">Feels like</div>
              <div className="text-lg font-light">{data.temperature + 2}°</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl animate-pulse-soft" style={{ animationDelay: '1s' }}>👁️</div>
              <div className="text-sm text-muted-foreground">Visibility</div>
              <div className="text-lg font-light">15 km</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl animate-pulse-soft" style={{ animationDelay: '2s' }}>📊</div>
              <div className="text-sm text-muted-foreground">Pressure</div>
              <div className="text-lg font-light">1013 hPa</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};