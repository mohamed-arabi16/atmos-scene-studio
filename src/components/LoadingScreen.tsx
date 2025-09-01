export const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center gradient-night">
      <div className="text-center space-y-8">
        {/* Animated Weather Icon */}
        <div className="text-8xl animate-float">
          🌤️
        </div>
        
        {/* Loading Text */}
        <div className="space-y-4">
          <h1 className="text-3xl font-light text-foreground/90 tracking-wide">
            AtmoSphere
          </h1>
          <p className="text-muted-foreground animate-pulse-soft">
            Gathering atmospheric data...
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center space-x-2">
          {Array.from({ length: 3 }, (_, i) => (
            <div
              key={i}
              className="w-2 h-2 bg-primary/60 rounded-full animate-pulse-soft"
              style={{
                animationDelay: `${i * 0.2}s`,
                animationDuration: '1.5s'
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};