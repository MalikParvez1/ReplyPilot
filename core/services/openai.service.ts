import { OpenAI } from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export class OpenAIService {
  async generateReviewReplies(
    reviewText: string, 
    rating: number, 
    settings: { businessName?: string | null; businessType?: string | null; toneOfVoice: string; additionalContext?: string | null }
  ) {
    const prompt = `
      Du bist ein erfahrener KI-Assistent für das Online-Reputationsmanagement.
      Generiere genau 3 unterschiedliche, hochqualitative Antwortvorschläge für die folgende Google-Rezension.
      
      Unternehmenskontext:
      - Name: ${settings.businessName || "Unser Unternehmen"}
      - Branche/Typ: ${settings.businessType || "Lokales Geschäft"}
      - Gewünschte Tonalität: ${settings.toneOfVoice} (Passe Wortwahl und Ansprache wie 'Du' oder 'Sie' streng hieran an!)
      - Wichtige Zusatzinfos: ${settings.additionalContext || "Keine"}
      
      Rezension:
      - Sterne: ${rating} von 5 Sternen
      - Text: "${reviewText}"
      
      Richtlinien für die 3 Optionen:
      - Option 1 (Direkt & Lösungsorientiert): Kurz, präzise, bedankt sich direkt oder bietet bei Kritik sofort Support.
      - Option 2 (Herzlich & Emotional): Sehr freundlich, hebt die Freude über den Besuch hervor oder drückt tiefes Bedauern aus.
      - Option 3 (Kreativ & Individuell): Greift ein spezifisches Detail aus der Rezension auf (falls vorhanden), wirkt extrem menschlich.
      
      Wichtig bei schlechten Bewertungen (1-3 Sterne): Niemals defensiv oder beleidigt reagieren! Immer professionell entschuldigen und eine Deeskalation (z.B. E-Mail-Kontakt) anbieten.
      
      Gib das Ergebnis AUSSCHLIESSLICH als valides JSON-Objekt in folgendem Format zurück:
      {
        "suggestions": ["Antwortmöglichkeit 1", "Antwortmöglichkeit 2", "Antwortmöglichkeit 3"]
      }
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Kostengünstig, schnell und perfekt für Text-Strukturierung
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
    });

    const content = response.choices[0].message.content;
    if (!content) throw new Error("Keine Antwort von OpenAI generiert.");

    // Gibt ein Objekt mit { suggestions: [string, string, string] } zurück
    return JSON.parse(content) as { suggestions: string[] };
  }
}