"use client";

import Link from "next/link";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex flex-col">
                <h3 className="text-2xl font-black bg-gradient-to-r from-[#866f59] to-[#9d8273] bg-clip-text text-transparent leading-none">
                  Talìa
                </h3>
                <h3 className="text-2xl font-black bg-gradient-to-r from-[#866f59] to-[#9d8273] bg-clip-text text-transparent leading-none">
                  Materassi
                </h3>
              </div>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Scopri la collezione premium di materassi realizzati con i migliori materiali per trasformare le tue notti in momenti di puro comfort e benessere.
            </p>
            <div className="flex gap-4">
              <a
                href="https://www.facebook.com/TaliaMaterassi/?locale=it_IT"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-700 hover:bg-[#866f59] transition-all duration-300 hover:scale-110"
                aria-label="Facebook"
                title="Seguici su Facebook"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/taliamaterassi_/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-700 hover:bg-[#866f59] transition-all duration-300 hover:scale-110"
                aria-label="Instagram"
                title="Seguici su Instagram"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.6c-.588.147-1.079.355-1.556.832-.477.477-.685.968-.832 1.556-.266.788-.467 1.658-.527 2.936C.015 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.527 2.936.147.588.355 1.079.832 1.556.477.477.968.685 1.556.832.788.266 1.658.467 2.936.527C8.333 23.985 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.261 2.936-.527.588-.147 1.079-.355 1.556-.832.477-.477.685-.968.832-1.556.266-.788.467-1.658.527-2.936.058-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.261-2.148-.527-2.936-.147-.588-.355-1.079-.832-1.556-.477-.477-.968-.685-1.556-.832-.788-.266-1.658-.467-2.936-.527C15.667.015 15.26 0 12 0zm0 2.16c3.203 0 3.585.009 4.849.07 1.171.053 1.805.245 2.227.408.562.217.96.477 1.382.896.419.42.679.819.896 1.381.163.422.355 1.056.408 2.227.061 1.264.07 1.645.07 4.849 0 3.203-.009 3.585-.07 4.849-.053 1.171-.245 1.805-.408 2.227-.217.562-.477.96-.896 1.382-.42.419-.819.679-1.381.896-.422.163-1.056.355-2.227.408-1.264.061-1.645.07-4.849.07-3.203 0-3.585-.009-4.849-.07-1.171-.053-1.805-.245-2.227-.408-.562-.217-.96-.477-1.382-.896-.419-.42-.679-.819-.896-1.381-.163-.422-.355-1.056-.408-2.227-.061-1.264-.07-1.645-.07-4.849 0-3.203.009-3.585.07-4.849.053-1.171.245-1.805.408-2.227.217-.562.477-.96.896-1.382.42-.419.819-.679 1.381-.896.422-.163 1.056-.355 2.227-.408 1.264-.061 1.645-.07 4.849-.07zM5.838 12a6.162 6.162 0 1 1 12.324 0 6.162 6.162 0 0 1-12.324 0zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm4.965-10.322a1.44 1.44 0 1 1 2.881.001 1.44 1.44 0 0 1-2.881-.001z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-[#866f59]">Prodotti</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#866f59] transition-colors duration-300">
                  Memory Foam
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#866f59] transition-colors duration-300">
                  Molle Insacchettate
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#866f59] transition-colors duration-300">
                  Ibridi
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#866f59] transition-colors duration-300">
                  Lattice Naturale
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#866f59] transition-colors duration-300">
                  Ortopedici
                </a>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 text-[#866f59]">Azienda</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="text-gray-400 hover:text-[#866f59] transition-colors duration-300">
                  Chi Siamo
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#866f59] transition-colors duration-300">
                  Contattaci
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#866f59] transition-colors duration-300">
                  Showroom
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#866f59] transition-colors duration-300">
                  Blog
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-[#866f59] transition-colors duration-300">
                  Carriere
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-700 my-8"></div>

        {/* Legal and Copyright */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <div className="text-gray-400 text-sm">
            <p className="mb-2">
              © {currentYear} <span className="font-bold text-[#866f59]">Talìa Materassi</span>. Tutti i diritti riservati.
            </p>
            <p className="text-xs text-gray-500">
              Sviluppato con passione per il tuo comfort
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-4 md:justify-end">
            <Link
              href="/privacy"
              className="text-gray-400 hover:text-[#866f59] transition-colors duration-300 text-sm"
            >
              Privacy Policy
            </Link>
            <span className="text-gray-600 hidden md:inline">|</span>
            <Link
              href="/cookies"
              className="text-gray-400 hover:text-[#866f59] transition-colors duration-300 text-sm"
            >
              Cookie Policy
            </Link>
            <span className="text-gray-600 hidden md:inline">|</span>
            <Link
              href="/terms"
              className="text-gray-400 hover:text-[#866f59] transition-colors duration-300 text-sm"
            >
              Termini di Servizio
            </Link>
            <span className="text-gray-600 hidden md:inline">|</span>
            <Link
              href="/sitemap"
              className="text-gray-400 hover:text-[#866f59] transition-colors duration-300 text-sm"
            >
              Mappa del Sito
            </Link>
          </div>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="border-t border-gray-700 bg-gray-900/50">
        <div className="container mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="text-sm">
              <p className="text-[#866f59] font-bold">🛡️ Sicuro</p>
              <p className="text-gray-500 text-xs">Pagamenti Protetti</p>
            </div>
            <div className="text-sm">
              <p className="text-[#866f59] font-bold">🚚 Veloce</p>
              <p className="text-gray-500 text-xs">Spedizione Rapida</p>
            </div>
            <div className="text-sm">
              <p className="text-[#866f59] font-bold">⭐ Qualità</p>
              <p className="text-gray-500 text-xs">Certificato</p>
            </div>
            <div className="text-sm">
              <p className="text-[#866f59] font-bold">✓ Garantito</p>
              <p className="text-gray-500 text-xs">10 Anni</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
