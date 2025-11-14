import { redirect } from "next/navigation";
import { ProductList } from "~/app/_components/product-list";
import { BannerSection } from "~/app/_components/banner-section";
import { auth } from "~/server/auth";
import { db } from "~/server/db";
import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  // Check if user is logged in and is admin
  const session = await auth();

  console.log("[HOME] Session check:", {
    hasSession: !!session,
    hasUser: !!session?.user,
    email: session?.user?.email,
  });

  if (session?.user?.email) {
    // User is logged in, check if admin
    console.log("[HOME] User logged in, checking admin status for:", session.user.email);

    const user = await db.user.findUnique({
      where: { email: session.user.email },
      select: { isAdmin: true },
    });

    console.log("[HOME] Database query result:", { email: session.user.email, isAdmin: user?.isAdmin });

    if (user?.isAdmin) {
      console.log("[HOME] Admin detected, redirecting to /admin");
      redirect("/admin");
    } else {
      console.log("[HOME] User is not admin, showing home page");
    }
  } else {
    console.log("[HOME] No session, showing home page for anonymous user");
  }

  // Prefetch products only (banner should always be fresh)
  void api.product.getAll.prefetch();

  return (
    <HydrateClient>
      <BannerSection />
      <main className="flex flex-col bg-white overflow-hidden">

        {/* Hero Section */}
        <section id="esclusiva-collezione" className="relative w-full overflow-hidden pt-12 pb-16 md:pt-40 md:pb-32">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-yellow-50/30 -z-10"></div>

          {/* Animated Background Blobs - Hidden on mobile */}
          <div className="hidden sm:block absolute top-20 left-10 w-64 h-64 sm:w-80 sm:h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
          <div className="hidden sm:block absolute top-40 right-10 w-64 h-64 sm:w-80 sm:h-80 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
          <div className="hidden sm:block absolute -bottom-20 left-1/4 w-72 h-72 sm:w-96 sm:h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

          <div className="w-full flex flex-col items-center justify-center gap-8 md:gap-16 px-4">
            {/* Hero Header */}
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-4xl">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-black tracking-tighter mb-4 md:mb-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
                Il Tuo Riposo Perfetto
              </h1>

              <p className="text-sm sm:text-base md:text-lg lg:text-2xl text-gray-600 font-light leading-relaxed mb-8 md:mb-12">
                Scopri la nostra esclusiva collezione di materassi premium realizzati con i migliori materiali per trasformare le tue notti in momenti di puro comfort e benessere.
              </p>

              {/* Features Grid - I Nostri Punti di Forza */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 mb-6 md:mb-8 max-w-4xl mx-auto">
                <div className="flex flex-col items-center gap-2 p-3 md:p-6 bg-white border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <span className="text-3xl md:text-5xl">🚚</span>
                  <span className="font-bold text-gray-900 text-sm md:text-lg">Consegna a Casa</span>
                  <span className="text-xs md:text-sm text-gray-600 text-center">Spedizione gratuita direttamente a casa tua, con imballaggio sicuro e tracciamento</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 md:p-6 bg-white border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <span className="text-3xl md:text-5xl">🛏️</span>
                  <span className="font-bold text-gray-900 text-sm md:text-lg">Montaggio Incluso</span>
                  <span className="text-xs md:text-sm text-gray-600 text-center">I nostri esperti montano il materasso e il letto a casa tua senza costi aggiuntivi</span>
                </div>
                <div className="flex flex-col items-center gap-2 p-3 md:p-6 bg-white border border-gray-200 hover:shadow-lg transition-all duration-300">
                  <span className="text-3xl md:text-5xl">♻️</span>
                  <span className="font-bold text-gray-900 text-sm md:text-lg">Smaltimento Gratuito</span>
                  <span className="text-xs md:text-sm text-gray-600 text-center">Rimuoviamo e smaltiremo correttamente il tuo vecchio materasso</span>
                </div>
              </div>
            </div>

            <ProductList />
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
