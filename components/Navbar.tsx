"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Mic, Tag, ChevronDown, Send } from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";

export function Navbar() {
  const pathname = usePathname();
  // Clerk Hook, um die Daten des aktuell angemeldeten Nutzers zu holen
  const { user, isLoaded } = useUser();

  const navItems = [
    { name: "Cockpit", href: "/dashboard", icon: LayoutDashboard },
    { name: "Bewertungen", href: "/dashboard/reviews", icon: MessageSquare, badge: 6 },
    { name: "Markenstimme", href: "/dashboard/markenstimme", icon: Mic },
    { name: "Tarife", href: "/dashboard/tarife", icon: Tag },
  ];

  return (
    <header className="w-full bg-[#111827] text-slate-300 h-16 fixed top-0 left-0 z-50 flex items-center justify-between px-6 shadow-md">
      
      {/* Linke Seite: Logo & Navigation */}
      <div className="flex items-center space-x-10">
        <div className="flex items-center space-x-2 text-white">
          <div className="bg-[#FF5A36] p-1.5 rounded-full">
            <Send className="w-4 h-4 text-white -ml-0.5 mt-0.5 transform -rotate-45" />
          </div>
          <span className="text-xl font-bold tracking-tight">ReplyPilot</span>
        </div>

        <nav className="hidden md:flex space-x-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-[#FF5A36] text-white shadow-lg shadow-orange-500/20" 
                    : "hover:bg-[#1F2937] hover:text-white text-slate-400"
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
                {item.badge && (
                  <span className="bg-[#1F2937] text-slate-300 text-[10px] px-2 py-0.5 rounded-full ml-1.5">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Rechte Seite: Standort & User Profil */}
      <div className="flex items-center space-x-6">
        
        <div className="flex items-center space-x-3 cursor-pointer hover:text-white transition-colors">
          <div className="text-right hidden sm:block">
            <h3 className="text-white font-medium text-sm leading-tight">Trattoria Bella</h3>
            <p className="text-[10px] text-slate-400">Hamburg-Eppendorf • 3.8 ★</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>

        {/* Clerk Profilbereich */}
        <div className="flex items-center space-x-3 border-l border-slate-700 pl-6">
          {/* Zeigt das Profilbild des Nutzers und öffnet das Menü bei Klick */}
          <UserButton />
          
          <div className="hidden sm:block text-left">
            <p className="text-sm font-medium text-white leading-tight">
              {/* Zeigt den Vornamen an, wenn geladen, ansonsten Fallback */}
              {isLoaded && user ? user.firstName || "Nutzer" : "..."}
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}