import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Measurements } from '@/lib/bodyShapeClassifier';
import { Sparkles } from 'lucide-react';

interface MeasurementFormProps {
  onSubmit: (measurements: Measurements) => void;
  isLoading: boolean;
}

export function MeasurementForm({ onSubmit, isLoading }: MeasurementFormProps) {
  const [formData, setFormData] = useState<Measurements>({
    gender: 'Female',
    shoulder: 0,
    bust: 0,
    waist: 0,
    hip: 0,
    height: 0,
  });

  const handleInputChange = (field: keyof Measurements, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'gender' ? value : Number(value) || 0,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isFormValid = formData.shoulder > 0 && formData.bust > 0 && 
                       formData.waist > 0 && formData.hip > 0 && formData.height > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Gender Selection */}
      <div className="space-y-3">
        <label className="fashion-label">Gender</label>
        <div className="flex gap-4">
          {(['Female', 'Male'] as const).map((gender) => (
            <button
              key={gender}
              type="button"
              onClick={() => handleInputChange('gender', gender)}
              className={`flex-1 py-3 px-6 rounded-lg border-2 transition-all duration-300 font-medium ${
                formData.gender === gender
                  ? 'border-primary bg-primary/10 text-foreground'
                  : 'border-border bg-background text-muted-foreground hover:border-primary/50'
              }`}
            >
              {gender}
            </button>
          ))}
        </div>
      </div>

      {/* Measurements Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[
          { key: 'shoulder', label: 'Shoulder Width', placeholder: 'e.g., 40' },
          { key: 'bust', label: 'Bust/Chest', placeholder: 'e.g., 90' },
          { key: 'waist', label: 'Waist', placeholder: 'e.g., 70' },
          { key: 'hip', label: 'Hip', placeholder: 'e.g., 95' },
          { key: 'height', label: 'Height (cm)', placeholder: 'e.g., 165' },
        ].map(({ key, label, placeholder }) => (
          <div key={key} className="space-y-2">
            <label htmlFor={key} className="fashion-label">
              {label}
            </label>
            <div className="relative">
              <input
                id={key}
                type="number"
                min="0"
                step="0.1"
                placeholder={placeholder}
                value={formData[key as keyof Measurements] || ''}
                onChange={(e) => handleInputChange(key as keyof Measurements, e.target.value)}
                className="fashion-input w-full pr-12"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                cm
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="fashion"
        size="xl"
        className="w-full"
        disabled={!isFormValid || isLoading}
      >
        {isLoading ? (
          <>
            <span className="animate-pulse">Analyzing...</span>
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Get Recommendation
          </>
        )}
      </Button>
    </form>
  );
}
