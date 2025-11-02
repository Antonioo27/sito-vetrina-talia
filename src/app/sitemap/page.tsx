import Link from "next/link";

export default function SitemapPage() {
  const pages = [
    { name: "Home", path: "/" },
    { name: "Prodotti", path: "/#products" },
    { name: "Login", path: "/login" },
    { name: "Registrati", path: "/register" },
    { name: "Admin Panel", path: "/admin" },
  ];

  const legalPages = [
    { name: "Privacy Policy", path: "/privacy" },
    { name: "Termini di Servizio", path: "/terms" },
    { name: "Cookie Policy", path: "/cookies" },
    { name: "Sitemap", path: "/sitemap" },
  ];

  const productCategories = [
    "Memory Foam",
    "Molle Insacchettate",
    "Ibridi",
    "Lattice Naturale",
    "Ortopedici",
  ];

  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black mb-8 bg-gradient-to-r from-gray-900 to-yellow-600 bg-clip-text text-transparent">
            Mappa del Sito
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Main Pages */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Pagine Principali</h2>
              <ul className="space-y-3">
                {pages.map((page) => (
                  <li key={page.path}>
                    <Link
                      href={page.path}
                      className="text-blue-600 hover:text-yellow-600 hover:underline transition-colors duration-300"
                    >
                      {page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Pages */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Legale & Informazioni</h2>
              <ul className="space-y-3">
                {legalPages.map((page) => (
                  <li key={page.path}>
                    <Link
                      href={page.path}
                      className="text-blue-600 hover:text-yellow-600 hover:underline transition-colors duration-300"
                    >
                      {page.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Product Categories */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Categorie Prodotti</h2>
              <ul className="space-y-3">
                {productCategories.map((category) => (
                  <li key={category} className="text-gray-600">
                    {category}
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Pages */}
            <div>
              <h2 className="text-2xl font-bold mb-6 text-gray-900">Supporto & Assistenza</h2>
              <ul className="space-y-3">
                <li>
                  <span className="text-gray-600">
                    📧 Email: <strong>info@taliamatrassi.it</strong>
                  </span>
                </li>
                <li>
                  <span className="text-gray-600">
                    📱 Telefono: <strong>+39 XXX XXX XXXX</strong>
                  </span>
                </li>
                <li>
                  <span className="text-gray-600">
                    📍 Indirizzo: <strong>Via Esempio, 123 - Italia</strong>
                  </span>
                </li>
                <li className="pt-2">
                  <span className="text-gray-600 block">
                    Orari: Lunedì - Venerdì 09:00 - 18:00
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* Additional Info */}
          <div className="mt-16 p-8 bg-gray-50 rounded-lg border border-gray-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">XML Sitemap</h2>
            <p className="text-gray-600 mb-4">
              Per accedere alla sitemap in formato XML per i motori di ricerca:
            </p>
            <code className="block bg-white p-4 rounded border border-gray-200 text-blue-600 overflow-auto">
              /sitemap.xml
            </code>
            <p className="text-sm text-gray-500 mt-4">
              Questa sitemap viene utilizzata dai motori di ricerca per indicizzare il sito.
            </p>
          </div>

          {/* SEO Info */}
          <div className="mt-8 p-8 bg-blue-50 rounded-lg border border-blue-200">
            <h2 className="text-2xl font-bold mb-4 text-gray-900">🔍 SEO & Indicizzazione</h2>
            <ul className="space-y-2 text-gray-700">
              <li>✓ Robots.txt configurato</li>
              <li>✓ Sitemap XML disponibile</li>
              <li>✓ Meta tag ottimizzati</li>
              <li>✓ Schema.org markup</li>
              <li>✓ Responsive design</li>
              <li>✓ HTTPS sicuro</li>
              <li>✓ Pagine con performance ottimale</li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
