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

interface WeeklyForecastProps {
  data: WeatherData;
}

export const WeeklyForecast = ({ data }: WeeklyForecastProps) => {
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

  if (!data.forecast) {
    return (
      <div className="text-center space-y-4 animate-fade-in">
        <h2 className="text-2xl font-light text-muted-foreground">
          Weekly forecast unavailable
        </h2>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-light text-foreground/90 tracking-wide">
          Weekly Forecast
        </h2>
        <p className="text-sm text-muted-foreground">
          {data.location}
        </p>
      </div>

      {/* Forecast Cards */}
      <div className="space-y-4 max-w-2xl mx-auto">
        {data.forecast.map((day, index) => (
          <div
            key={day.day}
            className="weather-card p-6 animate-slide-up hover:bg-card/30 transition-all duration-300"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-center justify-between">
              {/* Day and Icon */}
              <div className="flex items-center space-x-4">
                <div className="text-3xl animate-float" style={{ animationDelay: `${index * 0.5}s` }}>
                  {getWeatherIcon(day.condition)}
                </div>
                <div className="space-y-1">
                  <div className="text-lg font-light text-foreground">
                    {day.day}
                  </div>
                  <div className="text-sm text-muted-foreground capitalize">
                    {day.condition.replace('-', ' ')}
                  </div>
                </div>
              </div>

              {/* Temperature Range */}
              <div className="flex items-center space-x-4">
                <div className="text-right space-y-1">
                  <div className="text-xl font-light text-foreground">
                    {day.high}°
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {day.low}°
                  </div>
                </div>
                
                {/* Temperature Bar */}
                <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary/60 to-accent/60 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${((day.high - Math.min(...data.forecast!.map(f => f.low))) / 
                        (Math.max(...data.forecast!.map(f => f.high)) - Math.min(...data.forecast!.map(f => f.low)))) * 100}%`,
                      animationDelay: `${index * 0.2}s`
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Weekly Summary */}
      <div className="weather-card p-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.8s' }}>
        <h3 className="text-lg font-light mb-6 text-center text-muted-foreground">
          This Week's Overview
        </h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-2">
            <div className="text-2xl animate-pulse-soft">🌡️</div>
            <div className="text-xs text-muted-foreground">High</div>
            <div className="text-lg font-light">
              {Math.max(...data.forecast.map(f => f.high))}°
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl animate-pulse-soft" style={{ animationDelay: '0.5s' }}>❄️</div>
            <div className="text-xs text-muted-foreground">Low</div>
            <div className="text-lg font-light">
              {Math.min(...data.forecast.map(f => f.low))}°
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl animate-pulse-soft" style={{ animationDelay: '1s' }}>☀️</div>
            <div className="text-xs text-muted-foreground">Clear Days</div>
            <div className="text-lg font-light">
              {data.forecast.filter(f => f.condition === 'clear').length}
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="text-2xl animate-pulse-soft" style={{ animationDelay: '1.5s' }}>🌧️</div>
            <div className="text-xs text-muted-foreground">Rain Days</div>
            <div className="text-lg font-light">
              {data.forecast.filter(f => f.condition === 'rain').length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};