import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { UserButton } from "@clerk/nextjs";
import { AdminService } from "@/core/services/admin.service";

export default async function AdminDashboard() {
  const { userId } = await auth();

  // 1. Sicherheits-Check: Ist der Nutzer bei Clerk eingeloggt?
  if (!userId) redirect("/sign-in");

  const dbUser = await prisma.user.findUnique({ where: { id: userId } });

  // 2. Rollen-Check: Ist der Nutzer ein ADMIN in unserer Datenbank?
  if (!dbUser || dbUser.role !== "ADMIN") {
    redirect("/"); 
  }

  // 3. Daten über den Service laden
  const adminService = new AdminService();
  const businesses = await adminService.getAllBusinesses();

  return (
    <div className="max-w-7xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Superadmin Dashboard</h1>
        <div className="flex items-center gap-4">
          <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold">
            Admin: {dbUser.email}
          </span>
          {/* Das Clerk Profil-Widget */}
          <UserButton />
        </div>
      </div>
      
      {/* Die Tabelle mit allen Kunden/Betrieben */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 border-b border-gray-200 text-gray-600">
            <tr>
              <th className="p-4 font-semibold">Betrieb (SaaS Mandant)</th>
              <th className="p-4 font-semibold">Zugehörige Nutzer</th>
              <th className="p-4 font-semibold">Anzahl Reviews</th>
              <th className="p-4 font-semibold">Registriert am</th>
              <th className="p-4 font-semibold">Aktionen</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {businesses.map((business) => (
              <tr key={business.id} className="hover:bg-gray-50 transition">
                <td className="p-4 font-medium text-gray-900">{business.name}</td>
                <td className="p-4">
                  {business.users.map(u => (
                    <div key={u.id} className="text-gray-600">{u.email}</div>
                  ))}
                </td>
                <td className="p-4">
                  <span className="bg-gray-100 text-gray-700 py-1 px-2 rounded-md">
                    {business._count.reviews} Reviews
                  </span>
                </td>
                <td className="p-4 text-gray-500">
                  {new Date(business.createdAt).toLocaleDateString('de-DE')}
                </td>
                <td className="p-4">
                  <button className="text-red-600 hover:text-red-800 font-medium">
                    Sperren
                  </button>
                </td>
              </tr>
            ))}
            {businesses.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">
                  Noch keine Betriebe registriert.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}