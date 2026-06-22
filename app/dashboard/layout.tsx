import { Navbar } from "@/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FDFBF7] flex flex-col">
      <Navbar />
      
      {/* pt-24 sorgt für Platz unter der fixierten Navbar. */}
      {/* max-w-7xl und mx-auto zentrieren den Inhalt auf großen Bildschirmen. */}
      <main className="flex-1 pt-24 p-8 overflow-auto">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}