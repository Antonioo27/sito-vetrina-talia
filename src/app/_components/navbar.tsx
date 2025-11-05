"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export function Navbar() {
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isLoading = status === "loading";
  const isAuthenticated = !!session?.user;

  return (
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 max-w-full mx-auto">
        {/* Logo/Brand */}
        <Link
          href="/"
          className="flex items-center gap-4 transition-transform hover:scale-105"
        >
          <img
            src="/images/logo.png"
            alt="Talia Materassi"
            className="h-16 w-auto"
          />
          <div className="hidden sm:flex flex-col">
            <span className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-none">
              Talìa
            </span>
            <span className="text-2xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent leading-none">
              Materassi
            </span>
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex md:items-center md:gap-8">
          {/* Main Navigation Links - Hidden for Admin */}
          {!isAuthenticated || !session?.user?.isAdmin ? (
            <>
              <div className="flex items-center gap-6">
                <Link
                  href="/"
                  className="relative inline-block px-4 py-2 font-medium text-gray-900 transition-all duration-300 group"
                >
                  <span className="absolute inset-0 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                  Home
                </Link>
                <Link
                  href="/contatti"
                  className="relative inline-block px-4 py-2 font-medium text-gray-900 transition-all duration-300 group"
                >
                  <span className="absolute inset-0 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                  Contatti
                </Link>
                <Link
                  href="/prodotti"
                  className="relative inline-block px-4 py-2 font-medium text-gray-900 transition-all duration-300 group"
                >
                  <span className="absolute inset-0 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                  Prodotti
                </Link>
              </div>

              {/* Separator */}
              <div className="w-px h-6 bg-gray-300"></div>
            </>
          ) : null}

          {/* Auth & Admin Section */}
          <div className="flex items-center gap-4">
            {isLoading ? (
              <div className="text-sm font-medium text-gray-700">Caricamento...</div>
            ) : isAuthenticated ? (
              <>
                {/* Wishlist Link - Hidden for Admin */}
                {!session?.user?.isAdmin && (
                  <Link
                    href="/wishlist"
                    className="relative inline-block px-4 py-2 font-medium text-gray-900 transition-all duration-300 group"
                    title="La mia Wishlist"
                  >
                    <span className="absolute inset-0 bg-gray-100 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </Link>
                )}

                <button
                  onClick={() => void signOut({ redirectTo: "/" })}
                  className="relative inline-block px-4 py-2 font-medium text-gray-900 transition-all duration-300 group"
                >
                  <span className="absolute inset-0 bg-red-200 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></span>
                  Esci
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="px-4 py-2 font-medium text-gray-900 border-2 border-gray-900 rounded-lg transition-all duration-300 hover:bg-gray-100"
                >
                  Registrati
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 font-medium text-white bg-gradient-to-r from-[#866f59] to-[#9d8273] rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
                >
                  Accedi
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden text-gray-900 transition-transform duration-300"
        >
          <svg
            className={`h-6 w-6 transition-transform duration-300 ${
              isMenuOpen ? "rotate-90" : ""
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="border-t border-gray-200 bg-white animate-in slide-in-from-top-2 duration-300 md:hidden">
          <div className="flex flex-col gap-2 px-4 py-4">
            {/* Navigation Links - Hidden for Admin */}
            {!isAuthenticated || !session?.user?.isAdmin ? (
              <>
                <Link
                  href="/"
                  className="px-4 py-3 rounded-lg text-gray-900 font-medium hover:bg-gray-100 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Home
                </Link>
                <Link
                  href="/contatti"
                  className="px-4 py-3 rounded-lg text-gray-900 font-medium hover:bg-gray-100 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Contatti
                </Link>
                <Link
                  href="/prodotti"
                  className="px-4 py-3 rounded-lg text-gray-900 font-medium hover:bg-gray-100 transition-colors duration-300"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Prodotti
                </Link>
              </>
            ) : null}

            <div className="border-t border-gray-200 my-2 pt-2">
              {isLoading ? (
                <div className="px-4 py-3 text-sm font-medium text-gray-700">
                  Caricamento...
                </div>
              ) : isAuthenticated ? (
                <>
                  {/* Wishlist Link - Hidden for Admin */}
                  {!session?.user?.isAdmin && (
                    <Link
                      href="/wishlist"
                      className="px-4 py-3 rounded-lg text-gray-900 font-medium hover:bg-gray-100 transition-colors duration-300 flex items-center gap-2"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      La mia Wishlist
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      void signOut({ redirectTo: "/" });
                      setIsMenuOpen(false);
                    }}
                    className="px-4 py-3 rounded-lg text-gray-900 font-medium hover:bg-red-100 transition-colors duration-300 text-left w-full"
                  >
                    Esci
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/register"
                    className="px-4 py-3 rounded-lg text-gray-900 font-medium hover:bg-gray-100 transition-colors duration-300"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Registrati
                  </Link>
                  <Link
                    href="/login"
                    className="px-4 py-3 rounded-lg text-white bg-gradient-to-r from-[#866f59] to-[#9d8273] font-medium transition-all duration-300 hover:shadow-md"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Accedi
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
