export type BodyShape = 'Hourglass' | 'Pear' | 'Apple' | 'Rectangle' | 'Inverted Triangle';

export interface Measurements {
  gender: 'Female' | 'Male';
  shoulder: number;
  bust: number;
  waist: number;
  hip: number;
  height: number;
}

export function classifyBodyShape(measurements: Measurements): BodyShape {
  const { shoulder, bust, waist, hip } = measurements;
  
  // Calculate ratios
  const waistToHipRatio = waist / hip;
  const bustToHipRatio = bust / hip;
  const shoulderToHipRatio = shoulder / hip;
  const waistToBustRatio = waist / bust;
  
  // Classification logic based on body proportions
  
  // Hourglass: Well-defined waist, bust and hips are similar
  if (waistToHipRatio <= 0.75 && Math.abs(bustToHipRatio - 1) <= 0.1) {
    return 'Hourglass';
  }
  
  // Pear: Hips wider than shoulders and bust
  if (hip > shoulder * 1.05 && hip > bust * 1.05) {
    return 'Pear';
  }
  
  // Apple: Waist is larger relative to hips, fuller midsection
  if (waistToHipRatio > 0.85 || waist > bust * 0.95) {
    return 'Apple';
  }
  
  // Inverted Triangle: Shoulders/bust wider than hips
  if (shoulderToHipRatio > 1.1 || bustToHipRatio > 1.1) {
    return 'Inverted Triangle';
  }
  
  // Rectangle: Minimal waist definition, measurements are similar
  if (waistToHipRatio > 0.75 && Math.abs(bustToHipRatio - 1) <= 0.15) {
    return 'Rectangle';
  }
  
  // Default to Rectangle if no clear match
  return 'Rectangle';
}

export function getBodyShapeDescription(shape: BodyShape): string {
  const descriptions: Record<BodyShape, string> = {
    'Hourglass': 'Your shoulders and hips are well-balanced with a beautifully defined waist. This classic silhouette suits structured pieces that highlight your natural curves.',
    'Pear': 'Your hips are wider than your shoulders, creating an elegant lower-body curve. Balance your proportions with attention-drawing tops and flowing bottoms.',
    'Apple': 'You carry weight around your midsection with slimmer legs. Empire waists and V-necklines work beautifully to elongate your silhouette.',
    'Rectangle': 'Your shoulders, waist, and hips are similar in width, creating a streamlined look. Create curves with belted pieces and layered textures.',
    'Inverted Triangle': 'Your shoulders are broader than your hips with a strong upper body. Balance your proportions with volume in the lower half and simple necklines.',
  };
  
  return descriptions[shape];
}
