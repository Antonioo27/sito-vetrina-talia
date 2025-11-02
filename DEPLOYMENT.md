# 📋 Guida al Deployment - Talia Materassi

Questo documento contiene tutte le informazioni necessarie per pubblicare il sito Talia Materassi in produzione.

---

## 📌 Checklist Pre-Deployment

Prima di pubblicare, assicurati che:

- [ ] Aggiorna `NEXTAUTH_SECRET` in `.env`
- [ ] Cambia `NEXTAUTH_URL` con il tuo dominio
- [ ] Aggiorna `NEXT_PUBLIC_SITE_URL` con il tuo dominio
- [ ] Configura il database (SQLite o altra soluzione)
- [ ] Testa la build localmente: `npm run build`
- [ ] Testa il sito: `npm start`
- [ ] Verifica i link nel footer
- [ ] Aggiorna le informazioni di contatto in footer e pagine legali
- [ ] Controlla la privacy policy e i termini di servizio
- [ ] Genera un nuovo `NEXTAUTH_SECRET`: `npx auth secret`

---

## 🚀 Opzioni di Deployment

### Option 1: **Vercel (Consigliato)**

Vercel è la piattaforma ufficiale per Next.js ed è la più semplice da usare.

**Passaggi:**

1. **Crea un account Vercel**: https://vercel.com/signup
2. **Connetti il tuo repository GitHub**
3. **Importa il progetto**
4. **Configura le variabili d'ambiente**:
   ```
   DATABASE_URL=file:./db.sqlite
   NEXTAUTH_SECRET=(usa: npx auth secret)
   NEXTAUTH_URL=https://tuodominio.it
   ```
5. **Deploy**: Vercel farà il deploy automaticamente

**Vantaggi:**
- ✅ Deploy automatico da Git
- ✅ SSL/HTTPS gratuito
- ✅ CDN globale
- ✅ Ottimizzazioni Next.js native
- ✅ Scaling automatico

**Costi:** Gratuito (con limiti) o a pagamento per risorse maggiori

---

### Option 2: **Netlify**

**Passaggi:**

1. **Crea un account Netlify**: https://netlify.com
2. **Connetti GitHub**
3. **Configura il build command**:
   ```
   Build command: npm run build
   Publish directory: .next
   ```
4. **Imposta le variabili d'ambiente**
5. **Deploy**

---

### Option 3: **Self-Hosted (VPS/Server)**

Se usi un server proprio (DigitalOcean, Linode, AWS EC2, ecc.):

**Requisiti:**
- Node.js 18+ installato
- PM2 o simile per gestire il processo
- Nginx/Apache come reverse proxy
- SSL certificate (Let's Encrypt gratuito)

**Passaggi:**

1. **Clona il repository**:
   ```bash
   git clone https://github.com/tuoutente/sito-vetrina-talia.git
   cd sito-vetrina-talia
   ```

2. **Installa dipendenze**:
   ```bash
   npm install
   ```

3. **Crea il file .env**:
   ```bash
   cp .env.example .env
   # Modifica .env con i tuoi valori
   ```

4. **Compila il progetto**:
   ```bash
   npm run build
   ```

5. **Installa PM2**:
   ```bash
   npm install -g pm2
   ```

6. **Avvia il server**:
   ```bash
   pm2 start npm --name "talia-materassi" -- start
   pm2 save
   pm2 startup
   ```

7. **Configura Nginx** (reverse proxy):
   ```nginx
   server {
       listen 80;
       server_name tuodominio.it www.tuodominio.it;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

8. **Configura SSL** (Let's Encrypt):
   ```bash
   sudo apt install certbot python3-certbot-nginx
   sudo certbot --nginx -d tuodominio.it -d www.tuodominio.it
   ```

---

## 🗄️ Database in Produzione

### SQLite (Attuale - Non Consigliato per Produzione)

SQLite funziona ma non è ideale per siti con molto traffico.

### PostgreSQL (Consigliato)

1. **Installa PostgreSQL** sul server o usa un servizio gestito (AWS RDS, Railway, Supabase)

2. **Aggiorna `prisma/schema.prisma`**:
   ```prisma
   datasource db {
       provider = "postgresql"
       url      = env("DATABASE_URL")
   }
   ```

3. **Aggiorna il file .env**:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/talia_materassi"
   ```

4. **Esegui le migrazioni**:
   ```bash
   npx prisma migrate deploy
   ```

---

## 🔐 Sicurezza in Produzione

### Checklist Sicurezza:

1. **HTTPS**: Configura SSL/TLS (Let's Encrypt o certificato)
2. **Headers Sicuri**: Aggiungi next.config.js:
   ```js
   async headers() {
       return [
           {
               source: "/(.*)",
               headers: [
                   { key: "X-Content-Type-Options", value: "nosniff" },
                   { key: "X-Frame-Options", value: "DENY" },
                   { key: "X-XSS-Protection", value: "1; mode=block" },
               ],
           },
       ];
   }
   ```
3. **NEXTAUTH_SECRET**: Usa un valore sicuro e casuale
4. **Rate Limiting**: Implementa rate limiting su API endpoints
5. **CORS**: Configura CORS appropriatamente
6. **Validazione Input**: Tutti gli input sono già validati con Zod
7. **Database**: Usa credenziali sicure e backup regolari

---

## 📊 Monitoraggio e Logging

### Configura il Monitoraggio:

- **Vercel Analytics**: Automatico su Vercel
- **Sentry**: Per error tracking
  ```bash
  npm install @sentry/nextjs
  ```

- **Datadog, New Relic**: Per monitoring completo

---

## 🚨 Troubleshooting

### "Cannot find module" error

```bash
rm -rf node_modules
npm install
npm run build
```

### Database connection error

- Verifica `DATABASE_URL` nel .env
- Assicurati che il database sia accessibile
- Per PostgreSQL: controlla firewall e credenziali

### Errore di autenticazione

- Rigenera `NEXTAUTH_SECRET`: `npx auth secret`
- Verifica che `NEXTAUTH_URL` corrisponda al dominio

### Pagine bianche / 500 error

- Controlla i log: `pm2 logs talia-materassi`
- Verifica `next.config.js`
- Esegui build locale e testa

---

## 🔄 Aggiornamenti e Manutenzione

### Aggiorna il Codice:

```bash
git pull origin main
npm install
npm run build
pm2 restart talia-materassi
```

### Backup Database:

```bash
# Per SQLite
cp db.sqlite db.sqlite.backup.$(date +%Y%m%d)

# Per PostgreSQL
pg_dump database_name > backup.sql
```

### Cleanup Periodico:

```bash
npm cache clean --force
pm2 logrotate
```

---

## 📱 URL Importanti da Aggiornare

Prima di pubblicare, aggiorna questi URL nel codice:

1. **`.env`**: `NEXTAUTH_URL` e `NEXT_PUBLIC_SITE_URL`
2. **`src/app/_components/footer.tsx`**: Email e contatti
3. **`src/app/privacy/page.tsx`**: Email privacy
4. **`src/app/terms/page.tsx`**: Informazioni legali
5. **`src/app/sitemap/page.tsx`**: Informazioni di contatto
6. **`public/robots.txt`**: Dominio nella sitemap

---

## ✅ Verifica Post-Deployment

Dopo il deployment:

- [ ] Visita il sito con HTTPS
- [ ] Controlla che il logo carichi
- [ ] Prova il login/logout
- [ ] Prova ad aggiungere un prodotto (admin)
- [ ] Verifica i link del footer
- [ ] Controlla che il footer sia visibile
- [ ] Testa su mobile
- [ ] Verifica Google Search Console
- [ ] Configura Google Analytics

---

## 📞 Supporto e Risorse

- **Next.js Docs**: https://nextjs.org/docs
- **Vercel Docs**: https://vercel.com/docs
- **Prisma Docs**: https://www.prisma.io/docs
- **NextAuth.js Docs**: https://next-auth.js.org

---

## 🎉 Congratulazioni!

Il sito è pronto per la pubblicazione. Contatta il tuo hosting provider se hai domande specifiche sulla loro piattaforma.

Buona fortuna! 🚀
