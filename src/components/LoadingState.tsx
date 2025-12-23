import { Sparkles } from 'lucide-react';

interface LoadingStateProps {
  stage: 'analyzing' | 'generating-text' | 'generating-images';
}

export function LoadingState({ stage }: LoadingStateProps) {
  const stages = {
    'analyzing': {
      title: 'Analyzing Your Measurements',
      description: 'Determining your unique body shape...',
    },
    'generating-text': {
      title: 'Crafting Your Style Guide',
      description: 'Our AI stylist is curating personalized recommendations...',
    },
    'generating-images': {
      title: 'Visualizing Your Looks',
      description: 'Creating stunning outfit visualizations just for you...',
    },
  };

  const current = stages[stage];

  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-8 animate-fade-in">
      {/* Animated Icon */}
      <div className="relative">
        <div className="w-20 h-20 rounded-full bg-gradient-primary flex items-center justify-center animate-pulse">
          <Sparkles className="w-10 h-10 text-primary-foreground" />
        </div>
        <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
      </div>

      {/* Text */}
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-serif font-semibold text-foreground">
          {current.title}
        </h3>
        <p className="text-muted-foreground">
          {current.description}
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-64 h-2 bg-muted rounded-full overflow-hidden">
        <div className="h-full bg-gradient-primary shimmer-bg animate-shimmer rounded-full" />
      </div>

      {/* Stage Indicators */}
      <div className="flex items-center gap-4">
        {Object.keys(stages).map((key, index) => (
          <div key={key} className="flex items-center gap-2">
            <div
              className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                Object.keys(stages).indexOf(stage) >= index
                  ? 'bg-primary'
                  : 'bg-muted'
              }`}
            />
            {index < Object.keys(stages).length - 1 && (
              <div
                className={`w-8 h-0.5 transition-colors duration-300 ${
                  Object.keys(stages).indexOf(stage) > index
                    ? 'bg-primary'
                    : 'bg-muted'
                }`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
