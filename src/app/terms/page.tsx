export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-black mb-2 bg-gradient-to-r from-gray-900 to-yellow-600 bg-clip-text text-transparent">
            Termini di Servizio
          </h1>
          <p className="text-gray-600 mb-8">Ultimo aggiornamento: {new Date().toLocaleDateString("it-IT")}</p>

          <div className="prose prose-lg max-w-none text-gray-700">
            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">1. Accettazione dei Termini</h2>
            <p>
              Utilizzando il sito web di Talia Materassi, accetti questi Termini di Servizio. Se non sei d'accordo, non utilizzare il sito.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">2. Licenza d'Uso</h2>
            <p>
              Talia Materassi ti concede una licenza limitata, non esclusiva e revocabile per accedere e utilizzare il sito per scopi personali e non commerciali.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">3. Limitazioni di Responsabilità</h2>
            <p>
              Talia Materassi non è responsabile per danni indiretti, incidentali, speciali o conseguenti derivanti dall'uso o dall'incapacità di utilizzo del sito.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">4. Prodotti e Prezzi</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Ci riserviamo il diritto di modificare i prezzi in qualsiasi momento</li>
              <li>Le descrizioni dei prodotti sono il più accurate possibile</li>
              <li>Non siamo responsabili per errori o omissioni nelle immagini dei prodotti</li>
              <li>I prodotti sono soggetti alla disponibilità</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">5. Ordini e Pagamenti</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Accetti di fornire informazioni accurate per gli ordini</li>
              <li>Talia Materassi si riserva il diritto di rifiutare ordini</li>
              <li>I pagamenti sono processati in modo sicuro</li>
              <li>Le ricevute verranno inviate per email</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">6. Spedizioni e Consegne</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Spediamo entro 2-5 giorni lavorativi</li>
              <li>La consegna dipende dal corriere e dalla posizione</li>
              <li>Garantiamo prodotti integri al ricevimento</li>
              <li>Contattaci entro 48 ore per eventuali danni</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">7. Resi e Rimborsi</h2>
            <ul className="list-disc pl-6 space-y-2">
              <li>Puoi reso entro 14 giorni dall'acquisto</li>
              <li>Il prodotto deve essere in condizioni originali</li>
              <li>Restituisci il prodotto a tue spese</li>
              <li>Rimborso entro 30 giorni dal ricevimento</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">8. Garanzia</h2>
            <p>
              Talia Materassi garantisce tutti i prodotti per 10 anni contro i difetti di fabbricazione. La garanzia non copre l'usura normale o i danni accidentali.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">9. Comportamento Utente</h2>
            <p>Non devi:</p>
            <ul className="list-disc pl-6 space-y-2">
              <li>Utilizzare il sito per scopi illegali</li>
              <li>Trasmettere contenuti nocivi o offensivi</li>
              <li>Interferire con la sicurezza del sito</li>
              <li>Raccogliere dati senza autorizzazione</li>
            </ul>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">10. Modifiche ai Termini</h2>
            <p>
              Ci riserviamo il diritto di modificare questi termini in qualsiasi momento. L'uso continuo del sito implica l'accettazione delle modifiche.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">11. Legge Applicabile</h2>
            <p>
              Questi Termini sono regolati dalle leggi italiane. Qualsiasi controversia sarà risolta nei tribunali competenti italiani.
            </p>

            <h2 className="text-2xl font-bold mt-8 mb-4 text-gray-900">12. Contatti</h2>
            <p>
              Per domande sui termini, contattaci a: <strong>info@taliamatrassi.it</strong>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
