export interface AISettings {
    tone: 'professional' | 'friendly' | 'casual' | 'empathetic';
    length: 'short' | 'medium' | 'long';
    includeBusinessName: boolean;
    customContext?: string;
    language?: string;
    standardReplyText?: string;
  }
  
  export interface IAIService {
    generateResponse(reviewText: string, starRating: number, settings: AISettings): Promise<string>;
    generateMultipleResponses(reviewText: string, starRating: number, authorName: string, settings: AISettings): Promise<string[]>;
  }