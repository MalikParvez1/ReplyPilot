export class OpenAIService {
  async generateReviewReplies(
    reviewText: string, 
    rating: number, 
    settings: { 
      businessName?: string | null; 
      businessType?: string | null; 
      toneOfVoice: string; 
      additionalContext?: string | null;
      closingWord?: string | null;
      forbiddenWords?: string | null;
    }
  ) {
    // 1. Viel simplerer und aggressiverer Prompt für Gemma
    const prompt = `Du bist der Kundenservice für "${settings.businessName || "unser Unternehmen"}" (${settings.businessType || "Geschäft"}).
Schreibe genau 3 kurze Antwortvorschläge (max. 2 Sätze) auf diese ${rating}-Sterne Bewertung: "${reviewText}"

WICHTIGE REGELN:
1. SPRACHE: Zwingend Deutsch!
2. TONFALL: ${settings.toneOfVoice || "Freundlich"}. WICHTIG: Wenn hier "Du" steht, verwende zwingend "Du", "Dein", "Dir", "Euch". Verwende NIEMALS "Sie" oder "Ihnen"!
3. VERBOTENE WÖRTER: Du darfst diese Wörter NIEMALS benutzen: ${settings.forbiddenWords || "Keine"}.
${settings.additionalContext ? `4. ZUSATZREGEL: ${settings.additionalContext}` : ""}

Gib NUR ein JSON-Objekt zurück. Schreibe KEINEN Markdown-Code (wie \`\`\`json) und keinen Text davor oder danach. 
EXAKTES FORMAT:
{
  "suggestions": ["Antwort 1", "Antwort 2", "Antwort 3"]
}`;

    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "gemma3:4b", // <-- HIER auf Gemma 3 geändert
          // Der System-Prompt ist nun spezifischer gegen Markdown-Blöcke
          system: "Du bist ein strikter JSON-Bot. Du hältst dich exakt an die Vorgaben, besonders ob geduzt oder gesiezt wird. Du formatierst deine Antwort niemals mit Markdown.",
          prompt: prompt,
          stream: false,
          format: "json", 
          options: { 
            temperature: 0.2 // <-- Leicht kühler für mehr JSON-Stabilität bei Gemma
          }
        }),
      });

      if (!response.ok) throw new Error(`Ollama Fehler: ${response.statusText}`);
      
      const data = await response.json();
      const content = data.response;
      
      if (!content) throw new Error("Keine Antwort generiert.");
      
      const parsed = JSON.parse(content);
      
      // Sicherheits-Fallback, falls JSON falsch ist
      if (!parsed.suggestions || !Array.isArray(parsed.suggestions)) {
        return { suggestions: [content] };
      }

      // 2. DER KUGELSICHERE TRICK FÜRS SCHLUSSWORT
      let finalSuggestions = parsed.suggestions;
            
      if (settings.closingWord && settings.closingWord.trim() !== "") {
        finalSuggestions = finalSuggestions.map((reply: string) => {
          const cleanReply = reply.trim();
          
          // \n = Erster Zeilenumbruch
          // \n = Zweiter Zeilenumbruch (erzeugt die leere Zeile)
          return `${cleanReply}\n\n${settings.closingWord}`;
        });
      }

      return { suggestions: finalSuggestions };

    } catch (error) {
      console.error("Lokaler KI Fehler:", error);
      return { 
        suggestions: [
          "Vielen Dank für das tolle Feedback!", 
          "Wir freuen uns über die Bewertung.", 
          "Herzlichen Dank für den Besuch."
        ] 
      };
    }
  }
}