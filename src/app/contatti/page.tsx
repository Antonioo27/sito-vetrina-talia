import Link from "next/link";

export default function Contatti() {

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <section className="relative w-full overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-yellow-900 py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
              Contattaci
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "100ms" }}>
              Hai domande o vuoi saperne di più? Scrivici!
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content - Logo & Info + Map Layout */}
      <section className="py-12 md:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-16 max-w-6xl mx-auto">
            {/* Left Side - Logo & Company Info */}
            <div className="animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="flex flex-col h-full">
                {/* Logo & Company Name */}
                <div className="mb-10">
                  <img src="/images/logo.png" alt="Talia Materassi" className="w-40 h-32 md:w-56 md:h-48 rounded-lg mb-6 object-contain" />
                  <h2 className="text-4xl font-black text-gray-900">CONTATTI</h2>
                  <p className="text-lg text-[#866f59] font-semibold mt-2">Talia Materassi</p>
                </div>

                {/* Company Information */}
                <div className="space-y-6">
                  {/* Address */}
                  <div>
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Indirizzo</p>
                    <p className="text-gray-900 font-medium">Via Michelangelo 23</p>
                    <p className="text-gray-900 font-medium">50028 Barberino Tavarnelle (FI)</p>
                  </div>

                  {/* Phone Numbers */}
                  <div>
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Telefono</p>
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-[#866f59]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.79l.291 2.058a1 1 0 01-.471 1.023l-1.097.582a2.972 2.972 0 001.735 5.195l1.097.582a1 1 0 01.471 1.023l-.291 2.058A1 1 0 015.153 17H3a1 1 0 01-1-1V3z" />
                      </svg>
                      <a href="tel:+39055807036" className="text-gray-900 font-medium hover:text-[#866f59] transition">+39 055 807036</a>
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#866f59]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.79l.291 2.058a1 1 0 01-.471 1.023l-1.097.582a2.972 2.972 0 001.735 5.195l1.097.582a1 1 0 01.471 1.023l-.291 2.058A1 1 0 015.153 17H3a1 1 0 01-1-1V3z" />
                      </svg>
                      <a href="tel:+39055807162" className="text-gray-900 font-medium hover:text-[#866f59] transition">+39 055 807162</a>
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-2">Email</p>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-[#866f59]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <a href="mailto:info@taliamaterassi.it" className="text-gray-900 font-medium hover:text-[#866f59] transition">info@taliamaterassi.it</a>
                    </div>
                  </div>

                  {/* Working Hours */}
                  <div className="pt-6 border-t border-gray-200">
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Orari di Lavoro</p>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 font-medium">Lunedì - Venerdì</span>
                        <span className="text-gray-900 font-bold">09:00 - 18:00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 font-medium">Sabato</span>
                        <span className="text-gray-900 font-bold">10:00 - 16:00</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-700 font-medium">Domenica</span>
                        <span className="text-red-600 font-bold">Chiuso</span>
                      </div>
                    </div>
                  </div>

                  {/* Social Links */}
                  <div className="pt-6 border-t border-gray-200">
                    <p className="text-sm font-bold text-gray-700 uppercase tracking-wide mb-4">Seguici su</p>
                    <div className="flex gap-4">
                      <a href="#" className="w-10 h-10 rounded-full bg-[#866f59] text-white flex items-center justify-center hover:bg-[#7a5d47] transition" title="Instagram">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.322a1.44 1.44 0 11-2.881 0 1.44 1.44 0 012.881 0z" />
                        </svg>
                      </a>
                      <a href="#" className="w-10 h-10 rounded-full bg-[#866f59] text-white flex items-center justify-center hover:bg-[#7a5d47] transition" title="Facebook">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                        </svg>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Google Maps */}
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="rounded-2xl overflow-hidden border-2 border-[#866f59] shadow-2xl h-96 lg:h-full lg:min-h-96">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2962.719477459478!2d14.727595875790527!3d42.04919537122344!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1330c3408d27db3f%3A0xba77e27180fc8bef!2sTalia%20Materassi!5e0!3m2!1sit!2sit!4v1762117506608!5m2!1sit!2sit"
                  width="100%"
                  height="100%"
                  style={{ border: 0, display: 'block' }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Back to Home */}
      <section className="py-12 border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#866f59] to-[#9d8273] text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
          >
            ← Torna alla Home
          </Link>
        </div>
      </section>
    </main>
  );
}
