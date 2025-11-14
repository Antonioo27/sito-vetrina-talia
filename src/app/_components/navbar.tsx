"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useEffect, useState } from "react";
import { api } from "~/trpc/react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [mounted, setMounted] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(true);

  const { data: wishlistCount = 0 } = api.wishlist.getCount.useQuery(undefined, {
    enabled: !!session?.user && !(session?.user as any)?.isAdmin,
  });

  const isAuthenticated = !!session?.user;

  useEffect(() => {
    if (status !== "loading") {
      setMounted(true);
    }
  }, [status]);

  // Check if screen is desktop or mobile
  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 768);
    };

    handleResize(); // Check on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm w-screen">
      <div className="w-full px-4 py-4 max-w-full">
        {/* Logo and Menu Container */}
        <div className="flex items-center justify-between w-full">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <img src="/images/logo.png" alt="Talia Materassi" className="h-14 w-auto" />
          </Link>

          {/* DESKTOP MENU - show only on desktop (>= 768px) */}
          {mounted && !session?.user?.isAdmin && isDesktop && (
            <div className="flex items-center gap-4 lg:gap-6">
              {/* Navigation links */}
              <Link
                href="/"
                className="text-base sm:text-lg md:text-xl text-gray-700 hover:text-[#866f59] font-medium transition-colors"
              >
                Home
              </Link>
              <Link
                href="/catalogo"
                className="text-base sm:text-lg md:text-xl text-gray-700 hover:text-[#866f59] font-medium transition-colors"
              >
                Catalogo
              </Link>
              <Link
                href="/contatti"
                className="text-base sm:text-lg md:text-xl text-gray-700 hover:text-[#866f59] font-medium transition-colors"
              >
                Contatti
              </Link>

              {/* Auth section */}
              {isAuthenticated ? (
                <>
                  {/* Wishlist link */}
                  {!session?.user?.isAdmin && (
                    <Link
                      href="/wishlist"
                      className="relative text-2xl text-gray-700 hover:text-[#866f59] transition-colors"
                      title="La mia Wishlist"
                    >
                      ♥
                      {wishlistCount > 0 && (
                        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                          {wishlistCount > 9 ? "9+" : wishlistCount}
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Logout button */}
                  <button
                    onClick={() => void signOut({ redirectTo: "/" })}
                    className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-base sm:text-lg md:text-xl text-white bg-gradient-to-r from-red-500 to-red-600 rounded hover:shadow-lg font-medium transition-all"
                  >
                    Esci
                  </button>
                </>
              ) : (
                <>
                  {/* Register and Login buttons */}
                  <Link
                    href="/register"
                    className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-base sm:text-lg md:text-xl text-gray-900 border-2 border-gray-900 rounded hover:bg-gray-50 font-medium transition-all"
                  >
                    Registrati
                  </Link>
                  <Link
                    href="/login"
                    className="px-2 sm:px-3 md:px-4 py-1 sm:py-2 text-base sm:text-lg md:text-xl text-white bg-gradient-to-r from-[#866f59] to-[#9d8273] rounded hover:shadow-lg font-medium transition-all"
                  >
                    Accedi
                  </Link>
                </>
              )}
            </div>
          )}

          {/* HAMBURGER BUTTON - show only on mobile (< 768px) */}
          {mounted && !session?.user?.isAdmin && !isDesktop && (
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="flex flex-col items-center justify-center w-10 h-10 gap-1.5 text-gray-700 hover:text-[#866f59] transition-colors"
              title="Menu"
            >
              <span
                className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? "rotate-45 translate-y-2" : ""
                }`}
              ></span>
              <span
                className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? "opacity-0" : ""
                }`}
              ></span>
              <span
                className={`w-6 h-0.5 bg-current transition-all duration-300 ${
                  isMenuOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              ></span>
            </button>
          )}
        </div>

        {/* MOBILE MENU - show only on mobile when opened */}
        {mounted && !session?.user?.isAdmin && !isDesktop && isMenuOpen && (
          <div className="mt-4 pt-4 border-t border-gray-100 animate-in slide-in-from-top-2 duration-300">
            <div className="flex flex-col gap-3">
              {/* Navigation links */}
              <Link
                href="/"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-base text-gray-700 hover:text-[#866f59] hover:bg-gray-50 font-medium transition-colors rounded"
              >
                Home
              </Link>
              <Link
                href="/catalogo"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-base text-gray-700 hover:text-[#866f59] hover:bg-gray-50 font-medium transition-colors rounded"
              >
                Catalogo
              </Link>
              <Link
                href="/contatti"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 text-base text-gray-700 hover:text-[#866f59] hover:bg-gray-50 font-medium transition-colors rounded"
              >
                Contatti
              </Link>

              {/* Auth section for mobile */}
              {isAuthenticated ? (
                <>
                  {/* Wishlist link */}
                  {!session?.user?.isAdmin && (
                    <Link
                      href="/wishlist"
                      onClick={() => setIsMenuOpen(false)}
                      className="px-4 py-2 text-base text-gray-700 hover:text-[#866f59] hover:bg-gray-50 font-medium transition-colors rounded flex items-center gap-2"
                    >
                      ♥ Wishlist
                      {wishlistCount > 0 && (
                        <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {wishlistCount > 9 ? "9+" : wishlistCount}
                        </span>
                      )}
                    </Link>
                  )}

                  {/* Logout button */}
                  <button
                    onClick={() => {
                      void signOut({ redirectTo: "/" });
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-2 text-base text-white bg-gradient-to-r from-red-500 to-red-600 rounded hover:shadow-lg font-medium transition-all text-left"
                  >
                    Esci
                  </button>
                </>
              ) : (
                <>
                  {/* Register and Login buttons */}
                  <Link
                    href="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 text-base text-gray-900 border-2 border-gray-900 rounded hover:bg-gray-50 font-medium transition-all text-center"
                  >
                    Registrati
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="px-4 py-2 text-base text-white bg-gradient-to-r from-[#866f59] to-[#9d8273] rounded hover:shadow-lg font-medium transition-all text-center"
                  >
                    Accedi
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
