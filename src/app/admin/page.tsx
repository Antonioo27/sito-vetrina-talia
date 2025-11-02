import { auth } from "~/server/auth";
import { redirect } from "next/navigation";
import { api, HydrateClient } from "~/trpc/server";
import { AdminDashboard } from "~/app/_components/admin-dashboard";

export default async function AdminPage() {
  const session = await auth();

  // Explicit admin verification (defense in depth)
  if (!session?.user) {
    console.log("[ADMIN] ❌ Access denied: Not authenticated");
    redirect("/login");
  }

  if (!session.user.isAdmin) {
    console.log(`[ADMIN] ❌ Access denied: User ${session.user.email} is not admin`);
    redirect("/");
  }

  console.log(`[ADMIN] ✅ Access granted to ${session.user.email}`);

  // Prefetch products for hydration
  void api.product.getAll.prefetch();

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center bg-white">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden -z-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container flex flex-col gap-8 px-4 py-16">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center animate-in fade-in slide-in-from-top-4 duration-700">
            <div>
              <h1 className="text-5xl font-black bg-gradient-to-r from-gray-900 via-yellow-600 to-gray-900 bg-clip-text text-transparent sm:text-[5rem]">
                Admin Panel
              </h1>
              <p className="text-gray-600 mt-2">Gestisci il tuo catalogo di prodotti</p>
            </div>
            <div className="px-6 py-3 bg-gradient-to-r from-gray-900/10 to-yellow-600/10 rounded-lg border border-gray-200">
              <p className="text-sm font-medium text-gray-700">
                Benvenuto <span className="font-bold text-gray-900">{session.user.firstName || session.user.email}</span>
              </p>
            </div>
          </div>

          <AdminDashboard />
        </div>
      </main>
    </HydrateClient>
  );
}
