# UploadThing Integration Guide

UploadThing è stato integrato nel progetto T3 per gestire il caricamento delle immagini in modo sicuro e scalabile.

## Setup Completato ✅

### File creati:
1. **`src/app/api/uploadthing/core.ts`** - Configurazione del file router
   - Definisce `imageUploader` che accetta solo file immagine (max 8MB)
   - Max 6 immagini per upload session
   - Middleware per la validazione (attualmente permette upload da chiunque)

2. **`src/app/api/uploadthing/route.ts`** - Route handler per Next.js
   - Esporta GET e POST routes

3. **`src/utils/uploadthing.ts`** - Helper per React
   - Esporta `UploadButton` e `UploadDropzone` typati per il tuo file router

4. **`src/app/_components/image-upload.tsx`** - Componente React di esempio
   - Wrapper attorno a `UploadButton`
   - Callback per `onUploadComplete` e `onUploadError`

5. **`.env.local`** - Credenziali API
   - Aggiunto `UPLOADTHING_TOKEN` (nascosto dal git)

6. **`src/app/layout.tsx`** - CSS UploadThing importato
   - Aggiunto `@uploadthing/react/styles.css`

## Come usare

### Opzione 1: Usare il componente ImageUpload (Consigliato)

```tsx
"use client";

import { ImageUpload } from "~/app/_components/image-upload";
import { useState } from "react";

export function AdminProductForm() {
  const [imageUrl, setImageUrl] = useState<string>("");

  return (
    <div>
      <ImageUpload
        onUploadComplete={(url) => {
          setImageUrl(url);
          console.log("Image uploaded:", url);
        }}
        onUploadError={(error) => {
          console.error("Upload failed:", error);
        }}
      />
      {imageUrl && <img src={imageUrl} alt="Uploaded" />}
    </div>
  );
}
```

### Opzione 2: Usare direttamente UploadButton

```tsx
"use client";

import { UploadButton } from "~/utils/uploadthing";

export function QuickUpload() {
  return (
    <UploadButton
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        if (res && res.length > 0) {
          console.log("Upload complete:", res[0].url);
        }
      }}
      onUploadError={(error: Error) => {
        console.error("Error:", error);
      }}
    />
  );
}
```

### Opzione 3: Usare UploadDropzone

```tsx
"use client";

import { UploadDropzone } from "~/utils/uploadthing";

export function DropzoneUpload() {
  return (
    <UploadDropzone
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        console.log("Upload complete:", res);
      }}
      onUploadError={(error: Error) => {
        console.error("Error:", error);
      }}
    />
  );
}
```

## Configurazione Avanzata

### Aggiungere autenticazione (Proteggere uploads a solo admin)

Modifica `src/app/api/uploadthing/core.ts`:

```typescript
.middleware(async ({ req }) => {
  // Aggiungi logica di autenticazione
  const session = await auth();

  if (!session?.user?.isAdmin) {
    throw new UploadThingError("Solo admin possono caricare immagini");
  }

  return { uploadedBy: session.user.id };
})
```

### Configurare limiti di file

In `core.ts`, modifica le opzioni:

```typescript
image: {
  maxFileSize: "16MB",      // Aumenta limite
  maxFileCount: 10,         // Aumenta numero immagini
}
```

### Gestire upload completati nel database

In `core.ts`, modifica `onUploadComplete`:

```typescript
.onUploadComplete(async ({ metadata, file }) => {
  // Salva nel database con tRPC
  await db.productMedia.create({
    data: {
      productId: metadata.productId,
      type: "image",
      url: file.url,
      alt: metadata.alt,
    },
  });

  return { uploadedBy: metadata.uploadedBy, url: file.url };
})
```

## Tipi TypeScript

Il tipo `OurFileRouter` è automaticamente generato dal file router e assicura type-safety:

```tsx
import type { OurFileRouter } from "~/app/api/uploadthing/core";

// Tutti i componenti UploadThing saranno tipati in base a OurFileRouter
// Errore TypeScript se usi endpoint che non esistono
```

## Customizzazione Styling

### Con Tailwind CSS

```tsx
<UploadButton
  endpoint="imageUploader"
  className="ut-button:bg-blue-600 ut-button:hover:bg-blue-700"
  content={{
    button({ ready }) {
      if (ready) return <div>Carica immagini</div>;
      return "Caricamento...";
    },
  }}
/>
```

### Con appearance prop

```tsx
<UploadButton
  endpoint="imageUploader"
  appearance={{
    button: {
      backgroundColor: "#3b82f6",
      color: "white",
    },
  }}
/>
```

## Documentazione ufficiale

- https://docs.uploadthing.com
- https://docs.uploadthing.com/nextjs/getting-started
- https://docs.uploadthing.com/api-reference/server#file-routes

## Variabili d'ambiente richieste

```env
UPLOADTHING_TOKEN=sk_live_YOUR_TOKEN_HERE
```

Ottieni il token da: https://uploadthing.com/dashboard

---

## Fase 3: Integrazione nel Form di Creazione Prodotto ✅

### Cosa è stato fatto:

1. **Frontend**: Sostituito il vecchio input file con `<UploadDropzone>` di UploadThing
   - File: `src/app/_components/admin-dashboard.tsx`
   - Dual-dropzone UI: uno per l'upload iniziale, uno per aggiungere altre immagini
   - Anteprima delle immagini caricate con possibilità di eliminazione
   - Badge "Principale" per la prima immagine

2. **Backend**: Utilizzo della mutazione tRPC existente
   - File: `src/server/api/routers/product.ts`
   - Mutazione `create` accetta `mediaUrls: string[]`
   - Crea il prodotto e i media in una singola transazione Prisma

3. **Flow Completo**:
   ```
   User selects images
   ↓
   UploadDropzone carica su UploadThing
   ↓
   onClientUploadComplete ritorna URLs
   ↓
   URLs salvati nello stato React
   ↓
   Form submission invia mediaUrls a tRPC
   ↓
   Backend crea Product + ProductMedia insieme
   ↓
   Success!
   ```

### Come funziona nel dettaglio:

#### Frontend (admin-dashboard.tsx):

```tsx
import { UploadDropzone } from "~/utils/uploadthing";

// Nello stato del form:
const [uploadedImages, setUploadedImages] = useState<Array<{ url: string; alt?: string }>>([]);
const [uploadingImages, setUploadingImages] = useState(false);

// Nel JSX:
<UploadDropzone
  endpoint="imageUploader"
  onClientUploadComplete={(res) => {
    if (res && res.length > 0) {
      const newImages = res.map((r, index) => ({
        url: r.url,
        alt: `Image ${index + 1}`,
      }));
      setUploadedImages((prev) => [...prev, ...newImages]);
      setUploadingImages(false);
    }
  }}
  onUploadError={(error: Error) => {
    console.error("Upload error:", error);
    alert(`Errore di upload: ${error.message}`);
    setUploadingImages(false);
  }}
  onUploadBegin={() => {
    setUploadingImages(true);
  }}
/>

// Al submit del form:
const input = {
  name: formData.name,
  // ... altri dati
  mediaUrls: uploadedImages.length > 0 ? uploadedImages.map(img => img.url) : undefined,
};

await createMutation.mutateAsync(input);
```

#### Backend (product.ts):

```typescript
create: protectedProcedure
  .input(productWithMediaSchema) // Include mediaUrls in schema
  .mutation(async ({ ctx, input }) => {
    if (!ctx.session.user.isAdmin) {
      throw new Error("Non autorizzato");
    }

    const { mediaUrls, ...productData } = input;

    // Single transaction: create product + media together
    return ctx.db.product.create({
      data: {
        ...productData,
        media: mediaUrls
          ? {
              create: mediaUrls.map((url, index) => ({
                type: "image",
                url,
                order: index,
              })),
            }
          : undefined,
      },
      include: {
        media: {
          orderBy: { order: "asc" },
        },
      },
    });
  }),
```

### Vantaggi:

✅ **Sicurezza**: Immagini caricate su UploadThing (non nel database)
✅ **Performance**: CDN globale per velocità di download
✅ **Scalabilità**: Infrastruttura enterprise-grade
✅ **UX**: Drag-and-drop intuitivo
✅ **Type-safe**: Full TypeScript support
✅ **Transaction**: Product + Media creati insieme (no inconsistencies)

### Prossimi step opzionali:

1. **Aggiungere autenticazione al middleware di UploadThing** per permettere solo ad admin di caricare
2. **Aggiungere validazione** per file size/type più stretti
3. **Implementare cropping/editing** delle immagini prima dell'upload
4. **Aggiungere immagini a pagina di dettaglio** per mostrare la galleria
