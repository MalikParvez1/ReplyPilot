import { ReviewDashboard } from "@/features/reviews/components/ReviewDashboard";
import { auth, currentUser } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { PlanService } from '@/core/services/plan.service';
import Link from "next/link";

export default async function DashboardCockpitPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  // 1. Versuche den Nutzer aus der Datenbank zu laden
  let dbUser = await prisma.user.findUnique({ where: { clerkId } });

  // 2. AUTO-SYNC FALLBACK (Mit Schutz vor Race Conditions)
  if (!dbUser) {
    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return <div>Fehler: Clerk-Nutzerdaten konnten nicht geladen werden.</div>;
    }

    try {
      // Wir versuchen, den Nutzer anzulegen...
      dbUser = await prisma.user.create({
        data: {
          clerkId: clerkId,
          email: clerkUser.emailAddresses[0]?.emailAddress || "keine-email@hinterlegt.de",
          firstName: clerkUser.firstName,
          lastName: clerkUser.lastName,
          plan: "starter",
          locations: {
            create: {
              name: "Hauptstandort" 
            }
          }
        }
      });
    } catch (error: any) {
      // Wenn Fehler P2002 auftritt, war der Webhook einfach ein paar Millisekunden schneller!
      if (error.code === 'P2002') {
        // Dann laden wir ihn einfach nochmal frisch aus der Datenbank
        dbUser = await prisma.user.findUnique({ where: { clerkId } });
      } else {
        // Ein anderer, echter Fehler -> den werfen wir weiter
        throw error;
      }
    }
  }

  // Ein letzter Sicherheitscheck
  if (!dbUser) {
    return <div>Fehler beim Laden des Profils aus der Datenbank.</div>;
  }

  // 3. Limits über unseren PlanService checken
  const { usageCount, limit, hasReachedLimit } = await PlanService.checkReviewLimit(dbUser.id, dbUser.plan);
  const percent = Math.min(Math.round((usageCount / limit) * 100), 100);
  const hasAnalyticsAccess = PlanService.hasAnalyticsAccess(dbUser.plan);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header für das Cockpit */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">Dein Überblick für heute</p>
          <h1 className="text-3xl font-bold text-slate-900">Cockpit</h1>
        </div>

        {/* --- FORTSCHRITTSBALKEN --- */}
        <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm min-w-[280px]">
          <div className="flex justify-between text-sm mb-2">
            <span className="font-semibold text-slate-700">KI-Antworten (Diesen Monat)</span>
            <span className={`${hasReachedLimit ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
              {usageCount} / {limit}
            </span>
          </div>
          
          <div className="w-full bg-slate-100 rounded-full h-2.5 mb-3">
            <div 
              className={`h-2.5 rounded-full transition-all duration-500 ${hasReachedLimit ? 'bg-red-500' : 'bg-emerald-500'}`} 
              style={{ width: `${percent}%` }}
            ></div>
          </div>

          {(hasReachedLimit || percent >= 90) && (
            <Link 
              href="/dashboard/tarife" 
              className="block w-full text-center bg-[#FF5A36] text-white text-xs font-bold py-2 rounded-lg hover:bg-[#e04a29] transition shadow-sm"
            >
              Jetzt auf Pro upgraden
            </Link>
          )}
        </div>
      </div>
      
      {/* Interaktives Review-Dashboard */}
      <ReviewDashboard hasAnalyticsAccess={hasAnalyticsAccess} />
    </div>
  );
}