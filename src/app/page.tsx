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

  // Prefetch products and active banner
  void api.product.getAll.prefetch();
  void api.banner.getActive.prefetch();

  return (
    <HydrateClient>
      <BannerSection />
      <main className="flex flex-col bg-white overflow-hidden">

        {/* Hero Content Section - Below Banner */}
        <section className="relative w-full overflow-hidden py-20 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              {/* Badge with scroll animation */}
              <div className="inline-block mb-6 px-6 py-3 rounded-full bg-[#866f59]/10 border border-[#866f59] text-[#866f59] text-sm font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "100ms" }}>
                Esclusiva Collezione
              </div>

              {/* Main Heading with scroll animation */}
              <h2 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent mb-6 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "200ms" }}>
                Dormi come in un Lusso 5 Stelle
              </h2>

              {/* Description with scroll animation */}
              <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed max-w-2xl font-medium animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "300ms" }}>
                Scopri i nostri materassi premium, realizzati con la tecnologia più avanzata per garantire il massimo comfort e supporto alla tua schiena.
              </p>

              {/* Features with scroll animation */}
              <div className="flex flex-col sm:flex-row gap-6 mb-10 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "400ms" }}>
                <span className="inline-flex items-center gap-3 text-gray-700 font-semibold text-base">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#866f59] text-white font-bold text-sm">•</span>
                  Certificati internazionali
                </span>
                <span className="inline-flex items-center gap-3 text-gray-700 font-semibold text-base">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#866f59] text-white font-bold text-sm">•</span>
                  Garanzia 10 anni
                </span>
              </div>

              {/* CTA Button with scroll animation */}
              <a
                href="#esclusiva-collezione"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#866f59] to-[#9d8273] hover:from-[#7a5d47] hover:to-[#8a6b58] text-white font-black rounded-xl transition-all duration-300 hover:shadow-2xl hover:scale-105 transform text-lg shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-700 group relative overflow-hidden" style={{ animationDelay: "500ms" }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                <span className="relative">Scopri la Collezione →</span>
              </a>
            </div>
          </div>
        </section>

        {/* Hero Section */}
        <section id="esclusiva-collezione" className="relative w-full overflow-hidden pt-20 pb-24 md:pt-40 md:pb-32">
          <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-50 to-yellow-50/30 -z-10"></div>

          {/* Animated Background Blobs */}
          <div className="absolute top-20 left-10 w-80 h-80 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob"></div>
          <div className="absolute top-40 right-10 w-80 h-80 bg-gray-300 rounded-full mix-blend-multiply filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-20 left-1/4 w-96 h-96 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

          <div className="container flex flex-col items-center justify-center gap-16 px-4">
            {/* Hero Header */}
            <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-1000 max-w-4xl">
              <div className="inline-block mb-6 px-5 py-2 rounded-full bg-[#866f59]/10 border border-[#866f59] text-[#866f59] text-sm font-bold uppercase tracking-widest">
                Esclusiva Collezione
              </div>

              <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-tight">
                Il Tuo Riposo Perfetto
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed mb-10">
                Scopri la nostra esclusiva collezione di materassi premium realizzati con i migliori materiali per trasformare le tue notti in momenti di puro comfort e benessere.
              </p>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4 max-w-2xl mx-auto">
                <div className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-200/50 hover:bg-white/80 transition-all duration-300">
                  <span className="text-4xl">⭐</span>
                  <span className="font-bold text-gray-900">100% Qualità</span>
                  <span className="text-sm text-gray-600">Materiali premium selezionati</span>
                </div>
                <div className="flex flex-col items-center gap-3 p-5 rounded-2xl bg-white/50 backdrop-blur-sm border border-gray-200/50 hover:bg-white/80 transition-all duration-300">
                  <span className="text-4xl">🛡️</span>
                  <span className="font-bold text-gray-900">Garanzia 10 Anni</span>
                  <span className="text-sm text-gray-600">Protezione garantita</span>
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
