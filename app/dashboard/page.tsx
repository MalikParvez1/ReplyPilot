import { ReviewDashboard } from "@/features/reviews/components/ReviewDashboard";

export default function DashboardCockpitPage() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header für das Cockpit */}
      <div>
        <p className="text-sm text-slate-500 font-medium mb-1">Dein Überblick für heute</p>
        <h1 className="text-3xl font-bold text-slate-900">Cockpit</h1>
      </div>
      
      {/* 
        HIER DIE ÄNDERUNG: 
        Einfach nur noch <ReviewDashboard /> aufrufen! 
        Die Komponente lädt jetzt alles automatisch aus deiner PostgreSQL Datenbank.
      */}
      <ReviewDashboard />
    </div>
  );
}