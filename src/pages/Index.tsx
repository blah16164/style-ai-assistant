import { useState } from 'react';
import { Sparkles, Ruler, Palette, Shirt } from 'lucide-react';
import { MeasurementForm } from '@/components/MeasurementForm';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { LoadingState } from '@/components/LoadingState';
import { classifyBodyShape, Measurements, BodyShape } from '@/lib/bodyShapeClassifier';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface RecommendationResult {
  bodyShape: BodyShape;
  recommendation: string;
  images: string[];
}

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState<'analyzing' | 'generating-text' | 'generating-images'>('analyzing');
  const [result, setResult] = useState<RecommendationResult | null>(null);

  const handleSubmit = async (measurements: Measurements) => {
    setIsLoading(true);
    setResult(null);

    try {
      // Stage 1: Analyze body shape
      setLoadingStage('analyzing');
      await new Promise(resolve => setTimeout(resolve, 800)); // Brief delay for UX
      const bodyShape = classifyBodyShape(measurements);
      console.log('Classified body shape:', bodyShape);

      // Stage 2: Generate recommendations
      setLoadingStage('generating-text');
      
      const { data, error } = await supabase.functions.invoke('generate-outfit', {
        body: {
          bodyShape,
          gender: measurements.gender,
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to generate recommendations');
      }

      if (data.error) {
        throw new Error(data.error);
      }

      // Stage 3: Images are already generated in the function
      setLoadingStage('generating-images');
      await new Promise(resolve => setTimeout(resolve, 500)); // Brief delay for UX

      setResult({
        bodyShape,
        recommendation: data.recommendation,
        images: data.images || [],
      });

      toast.success('Your personalized style guide is ready!');

    } catch (error) {
      console.error('Error:', error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Hero Section */}
      <header className="container mx-auto px-4 pt-12 pb-8">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            AI-Powered Fashion
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-foreground leading-tight">
            Smart Outfit
            <span className="block gradient-text">Recommendation</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover your perfect style based on your unique body shape. 
            Our AI analyzes your measurements to curate personalized outfit recommendations.
          </p>
        </div>
      </header>

      {/* Features */}
      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          {[
            { icon: Ruler, title: 'Body Analysis', desc: 'Smart shape detection' },
            { icon: Palette, title: 'Color Matching', desc: 'Perfect palette for you' },
            { icon: Shirt, title: 'AI Styling', desc: 'Personalized outfits' },
          ].map(({ icon: Icon, title, desc }, index) => (
            <div 
              key={title}
              className="flex items-center gap-4 p-4 glass-card rounded-xl animate-slide-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">{title}</h3>
                <p className="text-sm text-muted-foreground">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 pb-16">
        <div className="max-w-4xl mx-auto">
          {/* Input Form Card */}
          {!result && !isLoading && (
            <div className="glass-card rounded-3xl p-8 md:p-12 animate-fade-in">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
                  Enter Your Measurements
                </h2>
                <p className="text-muted-foreground mt-2">
                  All measurements in centimeters for the most accurate results
                </p>
              </div>
              <MeasurementForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="glass-card rounded-3xl p-8 md:p-12">
              <LoadingState stage={loadingStage} />
            </div>
          )}

          {/* Results */}
          {result && !isLoading && (
            <div className="space-y-8">
              <ResultsDisplay result={result} />
              
              {/* Try Again Button */}
              <div className="text-center">
                <button
                  onClick={() => setResult(null)}
                  className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline transition-colors"
                >
                  Try with different measurements
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-border/50">
        <div className="text-center text-sm text-muted-foreground">
          <p>Powered by AI • Personalized fashion recommendations tailored just for you</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
