import { ClerkProvider } from "@clerk/nextjs";
import { QueryProvider } from "@/components/QueryProvider"; 
import "./globals.css"; // Hier funktioniert dieser Import!
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata = {
  title: "ReplyPilot",
  description: "Dein KI-Bewertungs-Assistent",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      {/* suppressHydrationWarning ignoriert die automatisch hinzugefügten CSS-Klassen */}
      <html lang="de" className={cn("font-sans", geist.variable)}>
        <body>
          <QueryProvider>
            {children}
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}