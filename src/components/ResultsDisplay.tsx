import { BodyShape, getBodyShapeDescription } from '@/lib/bodyShapeClassifier';

interface RecommendationResult {
  bodyShape: BodyShape;
  recommendation: string;
  images: string[];
}

interface ResultsDisplayProps {
  result: RecommendationResult;
}

export function ResultsDisplay({ result }: ResultsDisplayProps) {
  const { bodyShape, recommendation, images } = result;

  // Parse the recommendation text into sections
  const parseRecommendation = (text: string) => {
    const sections: { title: string; items: string[] }[] = [];
    const lines = text.split('\n');
    let currentSection: { title: string; items: string[] } | null = null;

    lines.forEach(line => {
      const trimmed = line.trim();
      if (!trimmed) return;

      // Check if it's a section header
      if (trimmed.endsWith(':') && !trimmed.startsWith('•') && !trimmed.startsWith('-')) {
        if (currentSection) {
          sections.push(currentSection);
        }
        currentSection = { title: trimmed.replace(':', ''), items: [] };
      } else if (trimmed.startsWith('•') || trimmed.startsWith('-') || trimmed.startsWith('*')) {
        if (currentSection) {
          currentSection.items.push(trimmed.replace(/^[•\-*]\s*/, ''));
        }
      } else if (currentSection && trimmed) {
        currentSection.items.push(trimmed);
      }
    });

    if (currentSection) {
      sections.push(currentSection);
    }

    return sections;
  };

  const sections = parseRecommendation(recommendation);

  return (
    <div className="space-y-10 animate-fade-in">
      {/* Body Shape Result */}
      <div className="text-center space-y-4">
        <div className="inline-block">
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">
            Your Body Shape
          </span>
          <h2 className="text-4xl md:text-5xl font-serif font-semibold gradient-text mt-2">
            {bodyShape}
          </h2>
        </div>
        <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {getBodyShapeDescription(bodyShape)}
        </p>
      </div>

      {/* Outfit Recommendations */}
      <div className="glass-card rounded-2xl p-8 space-y-6">
        <h3 className="text-2xl font-serif font-semibold text-foreground">
          Personalized Outfit Recommendations
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sections.map((section, index) => (
            <div 
              key={index} 
              className="space-y-4 animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm">
                  {index + 1}
                </span>
                {section.title}
              </h4>
              <ul className="space-y-2">
                {section.items.map((item, itemIndex) => (
                  <li 
                    key={itemIndex}
                    className="flex items-start gap-2 text-muted-foreground"
                  >
                    <span className="text-primary mt-1.5">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* AI Generated Images */}
      {images.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-2xl font-serif font-semibold text-foreground text-center">
            AI-Generated Outfit Inspiration
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map((image, index) => (
              <div 
                key={index} 
                className="group relative overflow-hidden rounded-2xl shadow-lg animate-scale-in"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <div className="aspect-[3/4] bg-muted">
                  <img
                    src={image}
                    alt={`Outfit suggestion ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                    }}
                  />
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-primary-foreground font-medium">
                      Look {index + 1}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
