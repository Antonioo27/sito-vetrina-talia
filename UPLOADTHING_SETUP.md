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
