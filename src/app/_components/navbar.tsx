"use client";

import Link from "next/link";

export function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <div className="w-full px-4 py-4">
        {/* Logo + Menu sulla stessa riga (Desktop) */}
        <div className="flex items-center justify-between gap-8 flex-wrap md:flex-nowrap">
          <Link href="/" className="flex items-center flex-shrink-0 order-1">
            <img src="/images/logo.png" alt="Talia Materassi" className="h-14 w-auto" />
          </Link>

          {/* Menu sempre visibile, ma sotto il logo su schermi piccoli */}
          <div className="order-3 md:order-2 w-full md:w-auto md:ml-auto pt-4 md:pt-0 border-t md:border-t-0 border-gray-100 md:border-gray-100">
            <div className="flex flex-wrap items-center justify-center md:justify-end gap-2 sm:gap-3 md:gap-4 lg:gap-6">
              <Link href="/" className="text-sm sm:text-base md:text-lg text-gray-700 hover:text-[#866f59] font-medium transition-colors">
                Home
              </Link>
              <Link href="/catalogo" className="text-sm sm:text-base md:text-lg text-gray-700 hover:text-[#866f59] font-medium transition-colors">
                Catalogo
              </Link>
              <Link href="/contatti" className="text-sm sm:text-base md:text-lg text-gray-700 hover:text-[#866f59] font-medium transition-colors">
                Contatti
              </Link>
              <Link
                href="/register"
                className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-sm sm:text-base md:text-lg text-gray-900 border-2 border-gray-900 rounded hover:bg-gray-50 font-medium transition-all"
              >
                Registrati
              </Link>
              <Link
                href="/login"
                className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-sm sm:text-base md:text-lg text-white bg-gradient-to-r from-[#866f59] to-[#9d8273] rounded hover:shadow-lg font-medium transition-all"
              >
                Accedi
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
