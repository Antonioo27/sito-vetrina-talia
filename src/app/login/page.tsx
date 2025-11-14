import { Suspense } from "react";
import { LoginForm } from "./login-form";

function LoginLoadingFallback() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gray-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      </div>

      <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="rounded-2xl bg-white border border-gray-200 shadow-xl p-8 backdrop-blur-sm">
          <div className="text-center">
            <p className="text-gray-600">Caricamento...</p>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
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

          <Suspense fallback={<p className="text-gray-600 text-center">Caricamento...</p>}>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
