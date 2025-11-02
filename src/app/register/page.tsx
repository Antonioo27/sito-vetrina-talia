"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "~/trpc/react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const registerMutation = api.auth.register.useMutation({
    onSuccess: () => {
      // Redirect to login after successful registration
      router.push("/login?registered=true");
    },
    onError: (error) => {
      setErrors({ general: error.message });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    // Validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "Nome è richiesto";
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Cognome è richiesto";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email è richiesta";
    }
    if (!formData.password) {
      newErrors.password = "Password è richiesta";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password deve avere almeno 8 caratteri";
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Le password non corrispondono";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    await registerMutation.mutateAsync({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
    });
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
              Registrati
            </h1>
            <p className="text-gray-600">Crea il tuo account</p>
          </div>

        {errors.general && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800 animate-in fade-in">
            <p className="font-semibold">✗ Errore di registrazione</p>
            <p className="text-sm mt-1">{errors.general}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
              Nome
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#866f59] focus:border-transparent ${
                errors.firstName ? "border-red-500 ring-2 ring-red-500" : "border-gray-300"
              }`}
              placeholder="Mario"
              disabled={registerMutation.isPending}
            />
            {errors.firstName && (
              <p className="mt-1 text-sm text-red-600 font-medium">{errors.firstName}</p>
            )}
          </div>

          <div>
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
              Cognome
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#866f59] focus:border-transparent ${
                errors.lastName ? "border-red-500 ring-2 ring-red-500" : "border-gray-300"
              }`}
              placeholder="Rossi"
              disabled={registerMutation.isPending}
            />
            {errors.lastName && (
              <p className="mt-1 text-sm text-red-600 font-medium">{errors.lastName}</p>
            )}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#866f59] focus:border-transparent ${
                errors.email ? "border-red-500 ring-2 ring-red-500" : "border-gray-300"
              }`}
              placeholder="mario@example.com"
              disabled={registerMutation.isPending}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 font-medium">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#866f59] focus:border-transparent ${
                errors.password ? "border-red-500 ring-2 ring-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
              disabled={registerMutation.isPending}
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 font-medium">{errors.password}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
              Conferma Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full rounded-lg border bg-gray-50 px-4 py-3 text-gray-900 placeholder-gray-400 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#866f59] focus:border-transparent ${
                errors.confirmPassword ? "border-red-500 ring-2 ring-red-500" : "border-gray-300"
              }`}
              placeholder="••••••••"
              disabled={registerMutation.isPending}
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 font-medium">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={registerMutation.isPending}
            className="mt-6 w-full rounded-lg bg-gradient-to-r from-[#866f59] to-[#9d8273] text-white font-bold py-3 transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {registerMutation.isPending ? "Registrazione in corso..." : "Registrati"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-gray-200 text-center">
          <p className="text-gray-600 text-sm">
            Hai già un account?{" "}
            <Link href="/login" className="font-semibold text-[#866f59] hover:text-[#7a5d47] transition-colors duration-300">
              Accedi qui
            </Link>
          </p>
        </div>
      </div>
      </div>
    </main>
  );
}
