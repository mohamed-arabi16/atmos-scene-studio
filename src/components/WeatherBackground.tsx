import { useEffect, useState } from 'react';

interface WeatherBackgroundProps {
  condition: string;
}

export const WeatherBackground = ({ condition }: WeatherBackgroundProps) => {
  const [particles, setParticles] = useState<Array<{ id: number; delay: number; duration: number }>>([]);

  useEffect(() => {
    // Generate particles for rain/snow effects
    if (condition === 'rain' || condition === 'snow') {
      const newParticles = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        delay: Math.random() * 2,
        duration: 0.5 + Math.random() * 1.5
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [condition]);

  const getBackgroundStyle = () => {
    switch (condition) {
      case 'clear':
        return 'gradient-sky';
      case 'partly-cloudy':
        return 'gradient-sky';
      case 'cloudy':
        return 'gradient-storm';
      case 'rain':
        return 'gradient-storm';
      case 'snow':
        return 'gradient-night';
      case 'thunderstorm':
        return 'gradient-storm';
      default:
        return 'gradient-sky';
    }
  };

  const renderClouds = () => {
    if (!['partly-cloudy', 'cloudy', 'rain'].includes(condition)) return null;
    
    return (
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }, (_, i) => (
          <div
            key={i}
            className="absolute bg-cloud/10 rounded-full animate-drift"
            style={{
              width: `${100 + Math.random() * 200}px`,
              height: `${60 + Math.random() * 100}px`,
              top: `${Math.random() * 70}%`,
              left: `-200px`,
              animationDelay: `${Math.random() * 20}s`,
              animationDuration: `${30 + Math.random() * 40}s`,
            }}
          />
        ))}
      </div>
    );
  };

  const renderRain = () => {
    if (condition !== 'rain') return null;
    
    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-0.5 bg-rain/60 animate-rain"
            style={{
              height: `${20 + Math.random() * 30}px`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${particle.delay}s`,
              animationDuration: `${particle.duration}s`,
            }}
          />
        ))}
      </div>
    );
  };

  const renderStars = () => {
    if (condition !== 'clear') return null;
    
    return (
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 50 }, (_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-foreground/30 rounded-full animate-pulse-soft"
            style={{
              top: `${Math.random() * 60}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 transition-all duration-1000 ${getBackgroundStyle()}`}>
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/5 to-background/20" />
      
      {/* Weather effects */}
      {renderClouds()}
      {renderRain()}
      {renderStars()}
      
      {/* Subtle overlay for readability */}
      <div className="absolute inset-0 bg-background/10" />
    </div>
  );
};