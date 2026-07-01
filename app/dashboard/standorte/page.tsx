import { auth } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';
import { PlanService } from '@/core/services/plan.service';
import Link from 'next/link';

export default async function LocationsPage() {
  const { userId: clerkId } = await auth();
  if (!clerkId) return null;

  const user = await prisma.user.findUnique({ 
    where: { clerkId },
    include: { locations: true } 
  });
  
  if (!user) return null;

  const { limit, canAddMore, locationCount } = await PlanService.checkLocationLimit(user.id, user.plan);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      
      {/* Header Bereich */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <p className="text-sm text-slate-500 font-medium mb-1">Verwalte deine Geschäfte</p>
          <h1 className="text-3xl font-bold text-slate-900">Standorte</h1>
        </div>
        
        {/* PAYWALL LOGIK FÜR DEN BUTTON */}
        {canAddMore ? (
          <button className="bg-slate-900 hover:bg-slate-800 transition-colors text-white text-sm px-5 py-2.5 rounded-lg font-medium shadow-sm">
            + Neuen Standort hinzufügen
          </button>
        ) : (
          <Link 
            href="/dashboard/tarife" 
            className="bg-[#FF5A36] hover:bg-[#e04a29] transition-colors text-white text-sm px-5 py-2.5 rounded-lg font-bold shadow-md"
          >
            Upgrade für mehr Standorte
          </Link>
        )}
      </div>

      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <span className="font-semibold text-slate-700">Genutzte Standorte</span>
        <span className={`${!canAddMore ? 'text-red-600 font-bold' : 'text-slate-500'}`}>
          {locationCount} / {limit}
        </span>
      </div>

      {/* Grid Liste der Standorte */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {user.locations.map(location => (
          <div key={location.id} className="border border-slate-200 p-6 rounded-2xl bg-white shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
            <div>
              <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
                📍
              </div>
              <h2 className="text-xl font-bold text-slate-900 mb-1">{location.name}</h2>
              <p className="text-sm text-slate-500 mb-6">
                ID: {location.id.slice(-6).toUpperCase()}
              </p>
            </div>
            
            <Link 
              href={`/dashboard?locationId=${location.id}`} 
              className="text-blue-600 font-semibold hover:text-blue-800 transition-colors text-sm flex items-center gap-1"
            >
              Zum Dashboard <span aria-hidden="true">&rarr;</span>
            </Link>
          </div>
        ))}
        
        {/* Placeholder falls keine vorhanden sind */}
        {user.locations.length === 0 && (
          <div className="col-span-full border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center text-slate-500">
            Du hast noch keine Standorte angelegt.
          </div>
        )}
      </div>

      {/* Info-Banner für Starter-User */}
      {!canAddMore && user.plan === 'starter' && (
        <div className="bg-orange-50 border border-orange-200 p-5 rounded-xl text-orange-800 text-sm mt-8 shadow-sm">
          <strong>Hinweis:</strong> Du nutzt derzeit den Starter-Tarif, der auf 1 Standort limitiert ist. 
          Wechsle in den Pro-Tarif, um bis zu 3 Standorte (mit eigenen Google-Verknüpfungen und Markenstimmen) zu verwalten.
        </div>
      )}
    </div>
  );
}