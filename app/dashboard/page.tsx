import { ReviewDashboard } from "@/features/reviews/components/ReviewDashboard";
import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { PlanService } from '@/core/services/plan.service';
import Link from "next/link";

export default async function DashboardCockpitPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const dbUser = await prisma.user.findUnique({ where: { clerkId } });
  if (!dbUser) return null;

  const { usageCount, limit, hasReachedLimit } = await PlanService.checkReviewLimit(dbUser.id, dbUser.plan);
  const percent = Math.min(Math.round((usageCount / limit) * 100), 100);
  
  // NEU: Darf dieser User Analytics sehen? (Pro oder Business)
  const hasAnalyticsAccess = PlanService.hasAnalyticsAccess(dbUser.plan);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">Dein Überblick für heute</p>
          <h1 className="text-3xl font-bold text-slate-900">Cockpit</h1>
        </div>

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
      
      {/* NEU: Wir übergeben den Analytics-Zugriff an das ReviewDashboard */}
      <ReviewDashboard hasAnalyticsAccess={hasAnalyticsAccess} />
    </div>
  );
}