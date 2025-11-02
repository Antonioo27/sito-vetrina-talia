export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-gray-900 to-yellow-600 bg-clip-text text-transparent">
            Cookie Policy
          </h1>
          <p className="text-gray-600 mb-8">Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}</p>

          <div className="prose prose-lg max-w-none text-gray-700">
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">1. Cosa sono i Cookie?</h2>
            <p>
              I cookie sono piccoli file di testo memorizzati sul tuo dispositivo quando visiti un sito web. Vengono utilizzati per memorizzare preferenze, login, e informazioni di navigazione.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">2. Tipi di Cookie Utilizzati</h2>

            <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">Cookie Essenziali</h3>
            <p>
              Necessari per il funzionamento del sito. Includono:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Autenticazione utente</li>
              <li>Preferenze di sessione</li>
              <li>Sicurezza</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">Cookie di Analytics</h3>
            <p>
              Aiutano a comprendere come i visitatori utilizzano il sito per migliorare l'esperienza.
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">Cookie di Marketing</h3>
            <p>
              Utilizzati per personalizzare annunci e tracciare conversioni (solo con consenso).
            </p>

            <h3 className="text-xl font-semibold mt-6 mb-3 text-gray-900">Cookie di Terze Parti</h3>
            <p>
              Impostati da servizi esterni come Google Analytics, Facebook, ecc.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">3. Come Gestiamo i Cookie</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cookie essenziali: Always enabled (necessari per il funzionamento)</li>
              <li>Cookie di analytics: Abilitato con consenso</li>
              <li>Cookie di marketing: Abilitato con consenso</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">4. Come Controllare i Cookie</h2>
            <p>
              Puoi controllare i cookie nel tuo browser:
            </p>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Chrome:</strong> Impostazioni → Privacy e sicurezza → Cookie</li>
              <li><strong>Firefox:</strong> Impostazioni → Privacy e Sicurezza → Cookie</li>
              <li><strong>Safari:</strong> Preferenze → Privacy</li>
              <li><strong>Edge:</strong> Impostazioni → Privacy → Cookie</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">5. Servizi Utilizzati</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li><strong>Google Analytics:</strong> Analisi del traffico</li>
              <li><strong>Stripe/PayPal:</strong> Elaborazione pagamenti</li>
              <li><strong>NextAuth.js:</strong> Autenticazione utenti</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">6. Durata dei Cookie</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Cookie di sessione: Eliminati al chiudere il browser</li>
              <li>Cookie persistenti: Rimangono fino a scadenza o eliminazione manuale</li>
              <li>Cookie di analytics: Generalmente 24 mesi</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">7. Cookie-Free Experience</h2>
            <p>
              Puoi disabilitare tutti i cookie non essenziali attraverso le impostazioni del sito, ma ciò potrebbe limitare alcune funzionalità.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">8. Contatti</h2>
            <p>
              Per domande sui cookie, contattaci a: <strong>privacy@taliamatrassi.it</strong>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
