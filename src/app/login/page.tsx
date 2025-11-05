"use client";

import { useState, useEffect } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [registered, setRegistered] = useState(false);

  useEffect(() => {
    // Check if user just registered
    if (searchParams.get("registered") === "true") {
      setRegistered(true);
      setTimeout(() => setRegistered(false), 5000);
    }

    // Check for NextAuth error parameter
    const errorParam = searchParams.get("error");
    if (errorParam) {
      console.log("[LOGIN] Error from NextAuth:", errorParam);
      setError("Email o password non valide");
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("[LOGIN] Attempting login with:", { email });

      // Validate inputs
      if (!email || !password) {
        setError("Email e password sono obbligatori");
        setIsLoading(false);
        return;
      }

      // Use signIn with redirect: false so we can manually handle the redirect
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log("[LOGIN] SignIn result:", result);

      if (!result?.ok || result?.error) {
        console.error("[LOGIN] SignIn failed:", result?.error);
        setError("Email o password non valide");
        setIsLoading(false);
        return;
      }

      if (result?.status !== 200) {
        console.error("[LOGIN] Unexpected status:", result?.status);
        setError("Errore durante il login");
        setIsLoading(false);
        return;
      }

      console.log("[LOGIN] SignIn successful, waiting for cookie then redirecting");

      // Wait a moment for the cookie to be set
      await new Promise(resolve => setTimeout(resolve, 100));

      // Use window.location.href for a hard navigation that includes cookies
      window.location.href = "/";
    } catch (err) {
      console.error("[LOGIN] Catch error:", err);
      setError("Errore durante il login");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="rounded-2xl bg-white border border-gray-200 shadow-xl p-8 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-[#866f59] to-gray-900 bg-clip-text text-transparent mb-2">
              Accedi
            </h1>
            <p className="text-gray-600">Talia Materassi</p>
          </div>

          {registered && (
            <div className="mb-4 rounded-lg border border-green-200 bg-green-50 p-4 text-green-800 animate-in fade-in slide-in-from-top-2 duration-500">
              <p className="font-semibold">✓ Registrazione completata!</p>
              <p className="text-sm mt-1">Puoi accedere con le tue credenziali</p>
            </div>
          )}

          {error && (
            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 animate-in fade-in slide-in-from-top-2 duration-500">
              <p className="font-semibold">✗ Errore di accesso</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#866f59] focus:border-transparent"
                placeholder="mario@example.com"
                disabled={isLoading}
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#866f59] focus:border-transparent"
                placeholder="••••••••"
                disabled={isLoading}
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-6 rounded-lg bg-gradient-to-r from-[#866f59] to-[#9d8273] text-white font-bold py-3 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin mr-2">⏳</span>
                  Accesso in corso...
                </span>
              ) : (
                "Accedi"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600 text-sm">
              Non hai un account?{" "}
              <Link href="/register" className="font-semibold text-[#866f59] hover:text-[#7a5d47] transition-colors duration-300">
                Registrati qui
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
