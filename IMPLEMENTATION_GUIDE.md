# 📋 Rezensions-Management System - Implementation Guide

## ✅ Implementierte Features

### C. Rezensions-Management
- **Zentrale Liste**: Kartenbasierte Ansicht aller Rezensionen mit Status-Anzeige
- **Filter & Sortierung**: 
  - Nach Status (Beantwortet, Unbeantwortet, Generiert)
  - Nach Sternebewertung (1-5)
  - Sortierung (Neueste/Älteste, Höchste/Niedrigste Bewertung)
- **Synchronisation**: Webhook-Endpoint für automatische Google Review-Synchronisation

### D. KI-Antwort-Engine
- **Kontext-Analyse**: Automatische Analyse von Rezensionstext, Sternebewertung und Autor
- **3 Antwortvorschläge**: Generierung von 3 unterschiedlichen Antwortoptionen (empathisch, professionell, warm)
- **Auswahl & Editor**: Modal-Dialog zur Auswahl und Bearbeitung der Antworten
- **Manuelle Anpassung**: Vollständig editierbarer Textarea für persönliche Anpassungen
- **Publishing**: Direktes Veröffentlichen auf Google

### E. Unternehmenseinstellungen & KI-Personalisierung
- **Tonalität**: friendly, professional, casual, empathetic
- **Antwortlänge**: short, medium, long
- **Sprache**: Deutsch, Englisch, Französisch, Spanisch
- **Unternehmens-Kontext**: Custom-Feld für Firmeninformationen
- **Standard-Informationen**: Vorformulierte Texte (z.B. Kontaktdaten)
- **Persistent Storage**: Alle Settings werden in der Datenbank gespeichert

---

## 🚀 Neue Komponenten & Routes

### Komponenten
```
features/reviews/componenets/
├── AnswerSelector.tsx      # Modal für Antwort-Auswahl und Editor
├── ReviewFilter.tsx        # Filter & Sortierungs-Widget
└── KPIDashboard.tsx        # (bereits vorhanden)

features/settings/hooks/
└── useAISettings.ts        # Hook für Settings-Verwaltung
```

### API Routes
```
app/api/
├── reviews/
│   └── suggestions/route.ts    # POST: Generiert 3 Antwortvorschläge
├── settings/route.ts           # GET/POST: Settings laden und speichern
└── webhooks/
    └── sync-reviews/route.ts   # POST/GET: Webhook für Review-Synchronisation
```

---

## 🔄 Cronjob-Konfiguration

### Option 1: Externe Cronjob-Services (Empfohlen)

**EasyCron.com** (kostenlos):
1. Registrieren auf https://www.easycron.com
2. "Add Cron Job" klicken
3. URL eingeben:
   ```
   https://yourdomain.com/api/webhooks/sync-reviews?apiKey=YOUR_WEBHOOK_API_KEY&businessId=BUSINESS_ID
   ```
4. Cronjob Expression: `0 */6 * * *` (alle 6 Stunden)
5. Speichern

**Cron-job.org** (kostenlos):
- Ähnliches Interface wie EasyCron

### Option 2: AWS EventBridge (Für Enterprise)

```json
{
  "Name": "ReviewSyncSchedule",
  "ScheduleExpression": "rate(6 hours)",
  "State": "ENABLED",
  "Targets": [
    {
      "Arn": "arn:aws:lambda:...",
      "RoleArn": "arn:aws:iam::...",
      "HttpParameters": {
        "HeaderParameters": {
          "x-api-key": "YOUR_WEBHOOK_API_KEY"
        }
      }
    }
  ]
}
```

### Option 3: Google Cloud Scheduler

```bash
gcloud scheduler jobs create http review-sync \
  --schedule="0 */6 * * *" \
  --uri="https://yourdomain.com/api/webhooks/sync-reviews?apiKey=YOUR_WEBHOOK_API_KEY&businessId=BUSINESS_ID" \
  --http-method=GET
```

---

## 🔐 Sicherheit

### Umgebungsvariablen (.env.local)
```
WEBHOOK_API_KEY=your_secret_key_here
OPENAI_API_KEY=your_openai_key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
CLERK_SECRET_KEY=...
```

### API-Validierung
- Alle Endpoints verwenden Clerk-Authentifizierung
- Webhook-Endpoint nutzt zusätzlich `x-api-key` Header
- BusinessId-Validierung für Multi-Tenant-Sicherheit

---

## 📊 Datenbankänderungen

### Migrationscode (Prisma):
```bash
# Schema aktualisieren
npx prisma migrate dev --name add_ai_settings_extensions
```

Neue Felder in `AISettings`:
- `language`: String (Standard: 'de')
- `standardReplyText`: String (Optional)

---

## 🧪 Lokale Tests

### 1. Webhook testen:
```bash
curl -X POST http://localhost:3000/api/webhooks/sync-reviews \
  -H "Content-Type: application/json" \
  -H "x-api-key: test_key" \
  -d '{
    "businessId": "test-business-id",
    "reviews": [
      {
        "googleReviewId": "123",
        "authorName": "John Doe",
        "rating": 5,
        "comment": "Great service!",
        "avatarUrl": null
      }
    ]
  }'
```

### 2. AI-Vorschläge testen:
```bash
# In der Browser-Console
fetch('/api/reviews/suggestions', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ reviewId: 'your-review-id' })
}).then(r => r.json()).then(console.log)
```

### 3. Settings testen:
```bash
fetch('/api/settings', { method: 'GET' })
  .then(r => r.json())
  .then(console.log)
```

---

## 🎯 Nächste Schritte

1. **Google My Business API Integration**: Implementierung der echten Google API
2. **Mehrsprachige Antworten**: Auto-Detection der Review-Sprache
3. **Analytics Dashboard**: Tracking von beantworteten Reviews pro Zeitraum
4. **Batch-Publishing**: Mehrere Antworten auf einmal veröffentlichen
5. **Template-System**: Vordefinierte Antwort-Templates

---

## 📞 Support

Bei Fragen oder Problemen:
- Prüfe die .env Variablen
- Kontrolliere die Prisma-Migration
- Überprüfe die OpenAI API-Limits
