export interface AISettings {
    tone: 'professional' | 'friendly' | 'casual' | 'empathetic';
    length: 'short' | 'medium' | 'long';
    includeBusinessName: boolean;
    customContext?: string;
  }
  
  export interface IAIService {
    generateResponse(reviewText: string, starRating: number, settings: AISettings): Promise<string>;
  }