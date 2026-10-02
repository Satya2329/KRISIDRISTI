export interface DiseaseSample {
  id: string;
  name: string;
  crop: string;
  condition: string;
  severity: 'Healthy' | 'Low' | 'Moderate' | 'Severe';
  confidence: number;
  cure: string;
  preventiveMeasure: string;
  imageUrl: string;
}