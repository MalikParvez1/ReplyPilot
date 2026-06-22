import Link from "next/link";
import { Send, Star, Zap, MessageSquare, ArrowRight, ShieldCheck } from "lucide-react";
// Importiere unsere neue Client Component
import { HeaderAuth } from "@/components/HeaderAuth";

// Kein 'async' mehr nötig!
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] font-sans selection:bg-[#FF5A36] selection:text-white">
      
      {/* Öffentliche Navbar */}
      <header className="w-full h-20 flex items-center justify-between px-6 md:px-12 max-w-7xl mx-auto">
        <div className="flex items-center space-x-2 text-slate-900">
          <div className="bg-[#FF5A36] p-1.5 rounded-full">
            <Send className="w-5 h-5 text-white -ml-0.5 mt-0.5 transform -rotate-45" />
          </div>
          <span className="text-2xl font-bold tracking-tight">ReplyPilot</span>
        </div>
        
        <nav className="flex items-center space-x-4 md:space-x-6">
          {/* Hier rendert jetzt unsere saubere Client-Logik */}
          <HeaderAuth />
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="pt-24 pb-32 px-6 text-center max-w-5xl mx-auto flex flex-col items-center">
          <div className="inline-flex items-center space-x-2 bg-orange-100 text-[#FF5A36] px-4 py-1.5 rounded-full text-sm font-bold mb-8">
            <Star className="w-4 h-4 fill-current" />
            <span>Für Restaurants, Ärzte & lokale Geschäfte</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] mb-8">
            Deine Google-Bewertungen. <br className="hidden md:block" />
            <span className="text-[#FF5A36]">Automatisch beantwortet.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 mb-12 max-w-2xl leading-relaxed">
            ReplyPilot analysiert Kundenfeedback und generiert in Sekunden individuelle, professionelle Antworten in deiner perfekten Markenstimme. Spare Stunden an Zeit und maximiere deine Sterne-Bewertung.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link href="/dashboard" className="px-8 py-4 bg-[#FF5A36] hover:bg-[#e04a29] text-white text-lg font-bold rounded-full shadow-lg shadow-orange-500/30 transition-all flex items-center space-x-2">
              <span>Kostenlos starten</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#features" className="px-8 py-4 bg-white border border-slate-200 text-slate-700 text-lg font-bold rounded-full hover:border-slate-300 hover:bg-slate-50 transition-all">
              So funktioniert's
            </Link>
          </div>
        </section>

        {/* Features / Benefits Section */}
        <section id="features" className="py-24 bg-white border-t border-slate-100">
          <div className="max-w-7xl mx-auto px-6 md:px-12">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Warum Reputationsmanagement so wichtig ist</h2>
              <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                Kunden lesen Bewertungen, bevor sie dein Geschäft besuchen. Lass keine Rezension unbeantwortet stehen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* Feature 1 */}
              <div className="p-8 rounded-3xl bg-[#FDFBF7] border border-slate-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mb-6">
                  <Zap className="w-6 h-6 text-[#FF5A36]" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Blitzschnelle Antworten</h3>
                <p className="text-slate-600 leading-relaxed">
                  Verschwende keine Zeit mehr damit, dir Texte auszudenken. Unsere KI liefert dir sofort 3 passende Antwortmöglichkeiten.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="p-8 rounded-3xl bg-[#FDFBF7] border border-slate-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                  <MessageSquare className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Deine Markenstimme</h3>
                <p className="text-slate-600 leading-relaxed">
                  Egal ob locker, professionell oder herzlich. Die KI lernt deinen "Tone of Voice" und antwortet exakt in deinem Stil.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="p-8 rounded-3xl bg-[#FDFBF7] border border-slate-100 hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                  <ShieldCheck className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">Besseres Google Ranking</h3>
                <p className="text-slate-600 leading-relaxed">
                  Der Google-Algorithmus liebt aktive Profile. Durch regelmäßige Antworten steigerst du deine Sichtbarkeit enorm.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner Section */}
        <section className="py-20 px-6">
          <div className="max-w-5xl mx-auto bg-[#111827] rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FF5A36] rounded-full blur-[120px] opacity-20 transform translate-x-1/2 -translate-y-1/2"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-[120px] opacity-20 transform -translate-x-1/2 translate-y-1/2"></div>
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 relative z-10">
              Bereit für glücklichere Kunden?
            </h2>
            <p className="text-slate-300 text-lg mb-10 max-w-2xl mx-auto relative z-10">
              Verknüpfe jetzt dein Google Business Profil und lass ReplyPilot die schwere Arbeit übernehmen.
            </p>
            <Link href="/dashboard" className="inline-flex px-8 py-4 bg-[#FF5A36] hover:bg-[#e04a29] text-white text-lg font-bold rounded-full shadow-lg transition-all relative z-10">
              Jetzt Cockpit einrichten
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-10 text-center">
        <p className="text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} ReplyPilot. Alle Rechte vorbehalten.
        </p>
      </footer>
    </div>
  );
}