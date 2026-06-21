import { IAIService, AISettings } from '../interfaces/ai.interface';

export class OpenAIService implements IAIService {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || '';
  }

  async generateResponse(reviewText: string, starRating: number, settings: AISettings): Promise<string> {
    if (!this.apiKey) throw new Error('OpenAI API Key missing');

    const prompt = this.buildPrompt(reviewText, starRating, settings, 'single');

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

  async generateMultipleResponses(reviewText: string, starRating: number, authorName: string, settings: AISettings): Promise<string[]> {
    if (!this.apiKey) throw new Error('OpenAI API Key missing');

    const prompt = `
      Du bist ein professioneller KI-Assistent für ein lokales Unternehmen. 
      Der Kunde "${authorName}" hat folgende Google-Rezension hinterlassen:
      
      Rezension: "${reviewText}"
      Sternebewertung: ${starRating}/5
      
      Richtlinien für die Antworten:
      - Tonalität: ${settings.tone}
      - Länge: ${settings.length}
      - Firmenname einbeziehen: ${settings.includeBusinessName ? 'Ja' : 'Nein'}
      - Sprache: ${settings.language || 'Deutsch'}
      - Zusätzlicher Kontext zum Unternehmen: ${settings.customContext || 'Keiner'}
      ${settings.standardReplyText ? `- Bitte integriere diese Standard-Information: ${settings.standardReplyText}` : ''}
      
      Generiere 3 unterschiedliche, hochwertige Antwortvorschläge. Jeder Vorschlag sollte eine andere Herangehensweise haben:
      1. Ein Vorschlag sollte sehr empathisch und persönlich sein
      2. Ein Vorschlag sollte professionell und lösungsorientiert sein
      3. Ein Vorschlag sollte warm und einladend sein
      
      Antworte im folgenden JSON-Format (nur JSON, keine zusätzlichen Erklärungen):
      {
        "suggestions": [
          "Vorschlag 1",
          "Vorschlag 2",
          "Vorschlag 3"
        ]
      }
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
        temperature: 0.8,
      })
    });

    const data = await response.json();
    const content = data.choices[0].message.content.trim();
    
    try {
      const parsed = JSON.parse(content);
      return parsed.suggestions || [];
    } catch {
      // Fallback bei JSON-Parse-Fehler
      return [content, content, content];
    }
  }

  private buildPrompt(reviewText: string, starRating: number, settings: AISettings, mode: 'single' | 'multiple'): string {
    return `
      Du bist ein professioneller KI-Assistent für ein lokales Unternehmen. 
      Schreibe eine Antwort auf folgende Google-Rezension.
      
      Rezension: "${reviewText}"
      Sternebewertung: ${starRating}/5
      
      Richtlinien für die Antwort:
      - Tonalität: ${settings.tone}
      - Länge: ${settings.length}
      - Firmenname einbeziehen: ${settings.includeBusinessName ? 'Ja' : 'Nein'}
      - Sprache: ${settings.language || 'Deutsch'}
      - Zusätzlicher Kontext zum Unternehmen: ${settings.customContext || 'Keiner'}
      ${settings.standardReplyText ? `- Bitte integriere diese Standard-Information: ${settings.standardReplyText}` : ''}
      
      Antworte nur mit dem fertigen Antworttext, ohne Formatierungen oder Einleitungen wie "Hier ist deine Antwort:".
    `;
  }
}