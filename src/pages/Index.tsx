import { useState } from 'react';
import { useWeatherData } from '@/hooks/useWeatherData';
import { WeatherBackground } from '@/components/WeatherBackground';
import { CurrentWeather } from '@/components/CurrentWeather';
import { WeeklyForecast } from '@/components/WeeklyForecast';
import { ViewToggle } from '@/components/ViewToggle';
import { LoadingScreen } from '@/components/LoadingScreen';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Terminal } from "lucide-react";

const Index = () => {
  const { weatherData, loading, error, locationError, refetch } = useWeatherData();
  const [viewMode, setViewMode] = useState<'current' | 'weekly'>('current');

  if (loading) {
    return <LoadingScreen />;
  }

  if (locationError && !weatherData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background p-4">
        <Alert variant="destructive" className="max-w-lg">
          <Terminal className="h-4 w-4" />
          <AlertTitle>Location Access Denied</AlertTitle>
          <AlertDescription>
            <p>This application requires access to your location to provide weather data. Please enable location services in your browser settings and refresh the page.</p>
            <button
              onClick={refetch}
              className="mt-4 px-4 py-2 bg-primary/20 hover:bg-primary/30 border border-primary/30 rounded-lg transition-all duration-300"
            >
              Retry
            </button>
          </AlertDescription>
        </Alert>
      </div>
    );
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