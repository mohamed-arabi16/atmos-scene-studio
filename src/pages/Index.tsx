import { useState } from 'react';
import { useWeatherData } from '@/hooks/useWeatherData';
import { WeatherBackground } from '@/components/WeatherBackground';
import { CurrentWeather } from '@/components/CurrentWeather';
import { WeeklyForecast } from '@/components/WeeklyForecast';
import { ViewToggle } from '@/components/ViewToggle';
import { LoadingScreen } from '@/components/LoadingScreen';

const Index = () => {
  const { weatherData, loading, error, refetch } = useWeatherData();
  const [viewMode, setViewMode] = useState<'current' | 'weekly'>('current');

  if (loading) {
    return <LoadingScreen />;
  }

  if (!weatherData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-light text-muted-foreground">Unable to load weather</h1>
          <button 
            onClick={refetch}
            className="px-6 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg transition-all duration-300"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Dynamic Weather Background */}
      <WeatherBackground condition={weatherData.condition} />
      
      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="flex justify-between items-center p-6 lg:p-8">
          <div className="animate-fade-in">
            <h1 className="text-2xl font-light text-foreground/90 tracking-wide">
              AtmoSphere
            </h1>
          </div>
          <ViewToggle viewMode={viewMode} onViewChange={setViewMode} />
        </header>

        {/* Weather Content */}
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-4xl">
            {viewMode === 'current' ? (
              <CurrentWeather data={weatherData} />
            ) : (
              <WeeklyForecast data={weatherData} />
            )}
          </div>
        </main>

        {/* Footer */}
        <footer className="p-6 text-center">
          <p className="text-sm text-muted-foreground animate-fade-in">
            {error ? 'Using demo data' : 'Live weather data'}
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;