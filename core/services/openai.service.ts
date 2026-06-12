import { IAIService, AISettings } from '../interfaces/ai.interface';

export class OpenAIService implements IAIService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  async generateResponse(reviewText: string, starRating: number, settings: AISettings): Promise<string> {
    if (!this.apiKey) throw new Error('OpenAI API Key missing');

    const prompt = `
      Du bist ein professioneller KI-Assistent für ein lokales Unternehmen. 
      Schreibe eine Antwort auf folgende Google-Rezension.
      
      Rezension: "${reviewText}"
      Sternebewertung: ${starRating}/5
      
      Richtlinien für die Antwort:
      - Tonalität: ${settings.tone}
      - Länge: ${settings.length}
      - Firmenname einbeziehen: ${settings.includeBusinessName ? 'Ja' : 'Nein'}
      - Zusätzlicher Kontext zum Unternehmen: ${settings.customContext || 'Keiner'}
      
      Antworte nur mit dem fertigen Antworttext, ohne Formatierungen oder Einleitungen wie "Hier ist deine Antwort:".
    `;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      })
    });

    const data = await response.json();
    return data.choices[0].message.content.trim();
  }
}