export class OpenAIService {
  async generateReviewReplies(
    reviewText: string, 
    rating: number, 
    settings: { businessName?: string | null; businessType?: string | null; toneOfVoice: string; additionalContext?: string | null }
  ) {
    // 1. Der optimierte Prompt (angepasst für kleine, lokale Modelle)
    const prompt = `Du bist ein professioneller KI-Assistent für das Online-Reputationsmanagement.
Generiere exakt 3 unterschiedliche, hochqualitative Antwortvorschläge für die folgende Google-Rezension.

Unternehmenskontext:
- Name: ${settings.businessName || "Unser Unternehmen"}
- Branche/Typ: ${settings.businessType || "Lokales Geschäft"}
- Gewünschte Tonalität: ${settings.toneOfVoice} (Passe Wortwahl und Ansprache zwingend hieran an!)
- Wichtige Zusatzinfos: ${settings.additionalContext || "Keine"}

Rezension:
- Sterne: ${rating} von 5 Sternen
- Text: "${reviewText}"

Richtlinien für die 3 Optionen:
1. Direkt & Lösungsorientiert: Kurz, präzise, bedankt sich direkt oder bietet bei Kritik sofort Support.
2. Herzlich & Emotional: Sehr freundlich, hebt die Freude hervor oder drückt tiefes Bedauern aus.
3. Kreativ & Individuell: Greift ein spezifisches Detail aus der Rezension auf.

WICHTIG: Bei 1-3 Sternen niemals defensiv reagieren, immer professionell entschuldigen und Kontakt anbieten.

Gib das Ergebnis AUSSCHLIESSLICH als valides JSON-Objekt zurück. Schreibe keinen Text vor oder nach dem JSON. Nutze exakt dieses Format:
{
  "suggestions": ["Antwort 1", "Antwort 2", "Antwort 3"]
}`;

    try {
      // 2. Aufruf an dein lokales Ollama auf dem Mac Mini
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "qwen2.5:3b", // Hier ggf. auf "qwen2.5:1.5b" ändern, falls der M2 RAM knapp wird
          prompt: prompt,
          stream: false,       // Wir wollen die Antwort am Stück
          format: "json"       // WICHTIG: Zwingt Ollama, ein sauberes JSON-Objekt zu generieren!
        }),
      });

      if (!response.ok) {
        throw new Error(`Fehler bei der Verbindung zu Ollama: ${response.statusText}`);
      }

      const data = await response.json();
      const content = data.response;

      if (!content) throw new Error("Keine Antwort von der lokalen KI generiert.");

      // 3. Den Text von Qwen in ein JavaScript-Objekt umwandeln
      const parsed = JSON.parse(content);

      // 4. Sicherheitscheck: Hat Qwen das Format verstanden?
      if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
        console.warn("Qwen hat das Format leicht abgeändert. Fallback greift.");
        return { suggestions: [content] };
      }

      return parsed as { suggestions: string[] };

    } catch (error) {
      console.error("Lokaler KI Fehler:", error);
      
      // 5. Fallback, damit deine App bei einem Fehler nicht komplett abstürzt
      return { 
        suggestions: [
          "Vielen Dank für Ihre Bewertung! Wir freuen uns sehr über das Feedback.",
          "Danke für Ihre Rückmeldung. Wir schätzen das sehr.",
          "Herzlichen Dank für Ihre ehrlichen Worte und die Bewertung."
        ] 
      };
    }
  }
}