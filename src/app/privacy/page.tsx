export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-gray-900 to-yellow-600 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
          <p className="text-gray-600 mb-8">Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}</p>

          <div className="prose prose-lg max-w-none text-gray-700">
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">1. Introduzione</h2>
            <p>
              Talia Materassi ("Società", "noi", "nostro") è impegnata nel proteggere la tua privacy. Questa Privacy Policy spiega come raccogliamo, utilizziamo, divulghiamo e conserviamo i tuoi dati.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">2. Dati che Raccogliamo</h2>
            <p>Raccogliamo i seguenti tipi di dati:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Dati Personali:</strong> Nome, cognome, email, telefono, indirizzo</li>
              <li><strong>Dati di Pagamento:</strong> Informazioni della carta di credito (elaborate in modo sicuro)</li>
              <li><strong>Dati di Utilizzo:</strong> IP, tipo di browser, pagine visitate, tempo trascorso</li>
              <li><strong>Dati dei Cookie:</strong> Preferenze utente, sessione, analytics</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">3. Come Utilizziamo i Tuoi Dati</h2>
            <p>Utilizziamo i tuoi dati per:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Elaborare ordini e spedizioni</li>
              <li>Fornire assistenza clienti</li>
              <li>Analizzare l'utilizzo del sito</li>
              <li>Personalizzare la tua esperienza</li>
              <li>Inviare aggiornamenti e promozioni (con tuo consenso)</li>
              <li>Conformarsi agli obblighi legali</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">4. Base Legale</h2>
            <p>
              Elaboriamo i tuoi dati sulla base del tuo consenso, dell'esecuzione di un contratto, dell'obbligo legale o dei nostri legittimi interessi.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">5. Sicurezza dei Dati</h2>
            <p>
              Implementiamo misure di sicurezza tecniche e organizzative per proteggere i tuoi dati personali da accesso non autorizzato, alterazione, divulgazione o distruzione.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">6. I Tuoi Diritti</h2>
            <p>Hai il diritto di:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Accedere ai tuoi dati personali</li>
              <li>Correggere dati inesatti</li>
              <li>Richiedere l'eliminazione dei dati</li>
              <li>Limitare il trattamento</li>
              <li>Portabilità dei dati</li>
              <li>Opporti al trattamento</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">7. Cookie</h2>
            <p>
              Utilizziamo cookie per migliorare la tua esperienza. Puoi configurare il tuo browser per rifiutare i cookie, ma potrebbe influire su alcune funzionalità del sito.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">8. Contatti</h2>
            <p>
              Se hai domande sulla privacy, contattaci a: <strong>privacy@taliamatrassi.it</strong>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
