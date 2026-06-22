// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Mic, Tag, ChevronDown, Send } from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

// In components/Sidebar.tsx
const navItems = [
    { name: "Cockpit", href: "/dashboard", icon: LayoutDashboard },
    { name: "Bewertungen", href: "/dashboard/reviews", icon: MessageSquare, badge: 6 },
    { name: "Markenstimme", href: "/dashboard/markenstimme", icon: Mic },
    { name: "Tarife", href: "/dashboard/tarife", icon: Tag },
  ];

  return (
    <aside className="w-64 h-screen bg-[#111827] text-slate-300 flex flex-col fixed left-0 top-0">
      {/* Logo Area */}
      <div className="p-6 flex items-center space-x-2 text-white">
        <div className="bg-[#FF5A36] p-1.5 rounded-full">
          <Send className="w-4 h-4 text-white -ml-0.5 mt-0.5 transform -rotate-45" />
        </div>
        <span className="text-xl font-bold tracking-tight">ReplyPilot</span>
      </div>

      {/* Location Selector (Trattoria Bella) */}
      <div className="px-4 mb-6">
        <div className="bg-[#1F2937] rounded-xl p-4 flex items-center justify-between cursor-pointer hover:bg-[#374151] transition-colors">
          <div>
            <h3 className="text-white font-medium text-sm">Trattoria Bella</h3>
            <p className="text-xs text-slate-400 mt-0.5">Hamburg-Eppendorf</p>
            <p className="text-xs text-slate-400 mt-0.5">3.8 ★</p>
          </div>
          <ChevronDown className="w-6 h-6 text-white" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                isActive 
                  ? "bg-[#FF5A36] text-white shadow-lg shadow-orange-500/20" 
                  : "hover:bg-[#1F2937] hover:text-white text-slate-400"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </div>
              {item.badge && (
                <span className="bg-[#1F2937] text-slate-300 text-[10px] px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-[#FF5A36] flex items-center justify-center text-white font-bold text-xs">
            J
          </div>
          <div>
            <p className="text-sm font-medium text-white">Jan Fischer</p>
            <p className="text-xs text-slate-500">jan@replypilot.de</p>
          </div>
        </div>
      </div>
    </aside>
  );
}