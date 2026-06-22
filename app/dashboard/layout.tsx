import { Sidebar } from "@/components/Sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    // Die weiche beige/creme Hintergrundfarbe aus dem Screenshot
    <div className="flex min-h-screen bg-[#FDFBF7]">
      <Sidebar />
      {/* 64 = 16rem = die Breite der Sidebar, damit der Inhalt nicht überlappt */}
      <main className="flex-1 ml-64 p-10 overflow-auto">
        {children}
      </main>
    </div>
  );
}