# 🛏️ Talia Materassi - Sito Vetrina

Un moderno sito e-commerce per la vendita di materassi premium, costruito con le ultime tecnologie web.

## ✨ Caratteristiche

- **🔐 Autenticazione Sicura**: Gestione utenti con NextAuth.js e JWT
- **📦 Gestione Prodotti**: CRUD completo per amministratori
- **💳 Admin Dashboard**: Interfaccia intuitiva per gestire il catalogo
- **🎨 Design Moderno**: UI responsivo con Tailwind CSS
- **⚡ Performance Ottimale**: Next.js con Turbopack
- **🗄️ Database Robusto**: Prisma ORM con SQLite (facilmente migrabile)
- **📱 Mobile-First**: Completamente responsive
- **🔍 SEO Ottimizzato**: Meta tag, Open Graph, sitemap
- **📄 Pagine Legali**: Privacy Policy, Terms, Cookie Policy
- **🎯 Footer Completo**: Con social media, categororie e informazioni

## 🚀 Stack Tecnologico

- **Frontend**: Next.js 15, React, TypeScript
- **Styling**: Tailwind CSS
- **Backend**: Next.js API Routes, tRPC
- **Database**: Prisma ORM + SQLite
- **Auth**: NextAuth.js v5 (JWT Strategy)
- **Validation**: Zod
- **Deployment**: Vercel, Netlify, o Self-Hosted

## 🛠️ Installazione

### Prerequisiti
- Node.js 18+
- npm o yarn

### Setup Locale

1. **Clona il repository**:
   ```bash
   git clone https://github.com/tuoutente/sito-vetrina-talia.git
   cd sito-vetrina-talia
   ```

2. **Installa le dipendenze**:
   ```bash
   npm install
   ```

3. **Crea il file .env**:
   ```bash
   cp .env.example .env
   ```

4. **Genera un NEXTAUTH_SECRET**:
   ```bash
   npx auth secret
   ```

5. **Configura il database**:
   ```bash
   npx prisma migrate dev
   ```

6. **Avvia il server di sviluppo**:
   ```bash
   npm run dev
   ```

7. **Accedi a http://localhost:3000**

## 📚 Pagine Principali

- `/` - Home page con hero banner e catalogo prodotti
- `/login` - Pagina di login
- `/register` - Registrazione utenti
- `/admin` - Dashboard amministrativa
- `/privacy` - Privacy Policy
- `/terms` - Termini di Servizio
- `/cookies` - Cookie Policy
- `/sitemap` - Mappa del sito

## 👤 Utente Test Admin

Email: `admin@talia.it`
Password: `Admin123!`

(Personalizza questi dati prima del deployment in produzione)

## 📁 Struttura del Progetto

```
src/
├── app/
│   ├── _components/          # Componenti riutilizzabili
│   │   ├── navbar.tsx       # Navigazione
│   │   ├── footer.tsx       # Footer
│   │   ├── admin-dashboard.tsx
│   │   ├── product-list.tsx
│   │   └── session-provider.tsx
│   ├── admin/               # Pagina admin
│   ├── login/               # Pagina login
│   ├── register/            # Pagina registrazione
│   ├── privacy/             # Privacy policy
│   ├── terms/               # Terms of service
│   ├── cookies/             # Cookie policy
│   ├── sitemap/             # Mappa sito
│   └── page.tsx             # Home page
├── server/
│   ├── api/
│   │   ├── routers/         # tRPC routers
│   │   │   ├── product.ts
│   │   │   ├── typology.ts
│   │   │   └── auth.ts
│   │   └── root.ts
│   ├── auth/
│   │   ├── config.ts        # Configurazione NextAuth
│   │   └── password.ts      # Utility per password
│   └── db.ts                # Prisma client
└── styles/
    └── globals.css          # Stili globali
```

## 🔐 Configurazione della Sicurezza

1. **NEXTAUTH_SECRET**: Genera un nuovo valore per la produzione
2. **Database**: Usa PostgreSQL per la produzione (non SQLite)
3. **HTTPS**: Configura SSL/TLS
4. **Headers Sicuri**: Implementa CSP e X-Frame-Options

## 📦 Build per la Produzione

```bash
npm run build
npm start
```

## 🚀 Deployment

Vedi il file **[DEPLOYMENT.md](./DEPLOYMENT.md)** per istruzioni complete su come pubblicare il sito.

### Opzioni supportate:
- ✅ Vercel (consigliato)
- ✅ Netlify
- ✅ Self-Hosted (VPS, Docker)
- ✅ AWS, Google Cloud, Azure

## 📊 Features Dettagliate

### Gestione Prodotti
- ✅ Aggiungere, modificare, eliminare prodotti
- ✅ Caricare immagini (Base64)
- ✅ Gestire sconto percentuale
- ✅ Assegnare tipologie (Memory Foam, Molle, ecc.)

### Gestione Tipologie
- ✅ Aggiungere/rimuovere categorie
- ✅ Persistenza nel database
- ✅ Validazione duplicati

### Autenticazione
- ✅ Login/Logout
- ✅ Registrazione utenti
- ✅ Protezione pagine admin
- ✅ Hash password con scrypt

### Frontend
- ✅ Design moderno e responsivo
- ✅ Animazioni smooth
- ✅ Dark/Light ready
- ✅ SEO ottimizzato

## 🎨 Personalizzazione

### Colori
Modifica `tailwind.config.ts` per cambiare la palette colori

### Testi
Aggiorna i testi nel file `.env.example` e nelle componenti

### Email di Contatto
Aggiorna in:
- `src/app/_components/footer.tsx`
- `src/app/privacy/page.tsx`
- `src/app/terms/page.tsx`

## 📱 Responsive Design

Il sito è ottimizzato per:
- 📱 Mobile (320px+)
- 📱 Tablet (768px+)
- 💻 Desktop (1024px+)
- 🖥️ Large screens (1280px+)

## 🔍 SEO

✅ Meta tag ottimizzati
✅ Open Graph supportato
✅ Twitter Card supportato
✅ Robots.txt configurato
✅ Sitemap disponibile
✅ Schema.org markup ready

## 🐛 Troubleshooting

**Problema**: "Cannot find module"
```bash
rm -rf node_modules .next
npm install
npm run build
```

**Problema**: Errore database
```bash
npx prisma generate
npx prisma migrate dev
```

**Problema**: Errori di autenticazione
```bash
npx auth secret
# Copia il valore in .env
```

## 📞 Support

Per problemi o domande:
1. Controlla [DEPLOYMENT.md](./DEPLOYMENT.md)
2. Leggi la documentazione ufficiale dei pacchetti
3. Apri un issue nel repository

## 📄 Licenza

MIT License - vedi LICENSE file

## 🙏 Ringraziamenti

Costruito con:
- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

---

**Versione**: 1.0.0
**Ultimo aggiornamento**: Novembre 2024
**Status**: Ready for Production ✅
