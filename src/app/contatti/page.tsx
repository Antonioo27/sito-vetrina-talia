"use client";

import Link from "next/link";
import { useState } from "react";
import { api } from "~/trpc/react";

export default function Contatti() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const sendMutation = api.contact.sendMessage.useMutation({
    onSuccess: () => {
      setSuccessMessage("Messaggio inviato con successo! Ti contatteremo presto.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setTimeout(() => setSuccessMessage(""), 5000);
    },
    onError: (error) => {
      setErrorMessage(`Errore: ${error.message}`);
      setTimeout(() => setErrorMessage(""), 5000);
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMutation.mutate(formData);
  };

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

      {/* Contact Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {/* Google Maps Section - Full Width */}
          <div className="mb-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <h2 className="text-3xl font-black text-gray-900 mb-6">Dove Trovarci</h2>
            <div className="rounded-3xl overflow-hidden border-2 border-[#866f59] shadow-2xl h-96 w-full">
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

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Contact Form - Email */}
            <div className="animate-in fade-in slide-in-from-left-8 duration-700">
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-lg h-full">
                <h2 className="text-2xl font-black text-gray-900 mb-4">Invia una Mail</h2>
                <p className="text-gray-600 text-sm mb-6">Compila il form e ti risponderemo al più presto</p>

                {successMessage && (
                  <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-xl text-green-700 font-semibold text-sm">
                    {successMessage}
                  </div>
                )}

                {errorMessage && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-semibold text-sm">
                    {errorMessage}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Nome */}
                  <div>
                    <label htmlFor="name" className="block text-xs font-semibold text-gray-700 mb-1">
                      Nome *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#866f59] focus:border-transparent transition-all duration-300"
                      placeholder="Il tuo nome"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="email" className="block text-xs font-semibold text-gray-700 mb-1">
                      Email *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#866f59] focus:border-transparent transition-all duration-300"
                      placeholder="tua@email.com"
                    />
                  </div>

                  {/* Oggetto */}
                  <div>
                    <label htmlFor="subject" className="block text-xs font-semibold text-gray-700 mb-1">
                      Oggetto *
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#866f59] focus:border-transparent transition-all duration-300"
                      placeholder="Argomento del messaggio"
                    />
                  </div>

                  {/* Messaggio */}
                  <div>
                    <label htmlFor="message" className="block text-xs font-semibold text-gray-700 mb-1">
                      Messaggio *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={4}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#866f59] focus:border-transparent transition-all duration-300 resize-none"
                      placeholder="Il tuo messaggio..."
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={sendMutation.isPending}
                    className="w-full px-6 py-3 bg-gradient-to-r from-[#866f59] to-[#9d8273] hover:from-[#7a5d47] hover:to-[#8a6b58] disabled:from-gray-400 disabled:to-gray-500 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 transform text-sm group relative overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                    <span className="relative">
                      {sendMutation.isPending ? "Invio..." : "Invia Mail"}
                    </span>
                  </button>
                </form>
              </div>
            </div>

            {/* Contact WhatsApp - Direct Chat */}
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="bg-gradient-to-br from-green-50 to-gray-50 rounded-3xl border-2 border-green-400 p-8 shadow-lg h-full flex flex-col justify-between">
                <div>
                  <h2 className="text-2xl font-black text-gray-900 mb-4">Contatta su WhatsApp</h2>
                  <p className="text-gray-600 text-sm mb-6">Parla direttamente con il nostro venditore per ricevere risposte immediate</p>

                  <div className="space-y-3 mb-8">
                    <div className="flex items-start gap-3">
                      <span className="text-green-600 text-xl mt-1">•</span>
                      <p className="text-gray-700 text-sm"><span className="font-semibold">Risposta Rapida</span><br />Ricevi risposte in tempo reale</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-600 text-xl mt-1">•</span>
                      <p className="text-gray-700 text-sm"><span className="font-semibold">Supporto Diretto</span><br />Parla con il nostro team</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <span className="text-green-600 text-xl mt-1">•</span>
                      <p className="text-gray-700 text-sm"><span className="font-semibold">Condividi Foto</span><br />Mostra quello che desideri</p>
                    </div>
                  </div>
                </div>

                <a
                  href="https://wa.me/393203615767?text=Ciao%20Talia%20Materassi%2C%20avrei%20una%20domanda%20riguardante%20i%20vostri%20prodotti"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 transform text-center text-sm group relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                  <span className="relative">Apri WhatsApp</span>
                </a>
              </div>
            </div>

          </div>

          {/* Orari di Lavoro */}
          <div className="mt-12 max-w-md mx-auto">
            <div className="bg-gradient-to-br from-[#866f59]/10 to-gray-50 rounded-3xl border border-[#866f59] p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <p className="text-[#866f59] text-xs font-bold uppercase mb-6 tracking-widest">Orari di Lavoro</p>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Lunedì - Venerdì</span>
                  <span className="text-gray-900 font-bold">09:00 - 18:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Sabato</span>
                  <span className="text-gray-900 font-bold">10:00 - 16:00</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-700 font-semibold">Domenica</span>
                  <span className="text-gray-900 font-bold text-red-600">Chiuso</span>
                </div>
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
