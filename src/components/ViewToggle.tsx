interface ViewToggleProps {
  viewMode: 'current' | 'weekly';
  onViewChange: (mode: 'current' | 'weekly') => void;
}

export const ViewToggle = ({ viewMode, onViewChange }: ViewToggleProps) => {
  return (
    <div className="weather-card p-1 animate-fade-in">
      <div className="flex rounded-lg overflow-hidden">
        <button
          onClick={() => onViewChange('current')}
          className={`px-4 py-2 text-sm font-light transition-all duration-300 ${
            viewMode === 'current'
              ? 'bg-primary/20 text-primary border-primary/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
          }`}
        >
          Current
        </button>
        <button
          onClick={() => onViewChange('weekly')}
          className={`px-4 py-2 text-sm font-light transition-all duration-300 ${
            viewMode === 'weekly'
              ? 'bg-primary/20 text-primary border-primary/30'
              : 'text-muted-foreground hover:text-foreground hover:bg-muted/20'
          }`}
        >
          Weekly
        </button>
      </div>
    </div>
  );
};