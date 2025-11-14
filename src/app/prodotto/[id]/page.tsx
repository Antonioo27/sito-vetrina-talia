"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { ProductGallery } from "~/app/_components/product-gallery";
import { api } from "~/trpc/react";

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  const [mounted, setMounted] = useState(false);
  const [localWishlistStatus, setLocalWishlistStatus] = useState(false);
  const [daysRemaining, setDaysRemaining] = useState<number | null>(null);
  const { data: session } = useSession();

  const utils = api.useUtils();

  const { data: product, isLoading } = api.product.getById.useQuery(
    { id: productId },
    { enabled: mounted && !!productId }
  );

  const { data: isInWishlist } = api.wishlist.isInWishlist.useQuery(
    { productId },
    { enabled: mounted && !!productId && !!session?.user }
  );

  // Sincronizza lo stato locale con il dato dal server
  useEffect(() => {
    if (isInWishlist !== undefined) {
      setLocalWishlistStatus(isInWishlist);
    }
  }, [isInWishlist]);

  const addToWishlist = api.wishlist.add.useMutation({
    onSuccess: () => {
      // Invalidate le query per aggiornare i dati
      utils.wishlist.isInWishlist.invalidate({ productId });
      utils.wishlist.getAll.invalidate();
    },
  });

  const removeFromWishlist = api.wishlist.remove.useMutation({
    onSuccess: () => {
      // Invalidate le query per aggiornare i dati
      utils.wishlist.isInWishlist.invalidate({ productId });
      utils.wishlist.getAll.invalidate();
    },
  });

  const handleWishlistToggle = async () => {
    if (!session?.user) {
      // Redirect to login
      window.location.href = "/login";
      return;
    }

    // Aggiorna immediatamente lo stato locale per feedback istantaneo
    setLocalWishlistStatus(!localWishlistStatus);

    try {
      if (localWishlistStatus) {
        await removeFromWishlist.mutateAsync({ productId });
      } else {
        await addToWishlist.mutateAsync({ productId });
      }
    } catch (error) {
      // Se c'è un errore, ripristina lo stato precedente
      setLocalWishlistStatus(localWishlistStatus);
      console.error("Errore nella gestione della wishlist:", error);
    }
  };

  // Calcola i giorni rimanenti per lo sconto
  useEffect(() => {
    if (product?.discountExpiryDate) {
      const expiryDate = new Date(product.discountExpiryDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      expiryDate.setHours(0, 0, 0, 0);

      const timeDiff = expiryDate.getTime() - today.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

      setDaysRemaining(daysDiff > 0 ? daysDiff : null);
    }
  }, [product?.discountExpiryDate]);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500 font-medium">Caricamento prodotto...</p>
        </div>
      </main>
    );
  }

  if (!product) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-500 font-medium">Prodotto non trovato</p>
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-gradient-to-r from-[#866f59] to-[#9d8273] text-white font-bold transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
          >
            ← Torna al Catalogo
          </Link>
        </div>
      </main>
    );
  }

  // Prepare gallery items from product media
  const galleryItems = product.media && product.media.length > 0
    ? product.media.map((m: any) => ({
      url: m.url,
      type: m.type,
      alt: m.alt || product.name
    }))
    : product.imageUrl
      ? [{ url: product.imageUrl, type: "image", alt: product.name }]
      : [];

  // Calculate discounted price
  const finalPrice = product.price && product.discount
    ? product.price * (1 - product.discount / 100)
    : product.price;

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Product Content */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 max-w-6xl mx-auto">
            {/* Media Gallery - Left Side - Takes 1.5 columns space */}
            <div className="lg:col-span-2 animate-in fade-in slide-in-from-left-8 duration-700 flex items-start">
              <div className="w-full sticky top-24">
                <ProductGallery
                  items={galleryItems}
                  productName={product.name}
                />
              </div>
            </div>

            {/* Product Info - Right Side - Takes 1 column */}
            <div className="animate-in fade-in slide-in-from-right-8 duration-700 flex flex-col justify-start">
              <div className="mb-4">
                <h1 className="text-2xl md:text-3xl font-black text-gray-900 mb-2 leading-tight">
                  {product.name}
                </h1>

                {product.typology && (
                  <div className="mb-3">
                    <span className="inline-block px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold">
                      {product.typology}
                    </span>
                  </div>
                )}

                {/* Price */}
                {product.price && (
                  <div className="mb-4 p-3 bg-gray-50 border border-gray-200">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-gray-900">€{finalPrice?.toFixed(2)}</span>
                      {product.discount && product.discount > 0 && (
                        <>
                          <span className="text-xs text-gray-500 line-through">€{product.price.toFixed(2)}</span>
                          <span className="inline-block px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold">
                            -{product.discount}%
                          </span>
                        </>
                      )}
                    </div>

                    {/* Discount Expiry Date */}
                    {product.discountExpiryDate && product.discount && product.discount > 0 && (
                      <div className="mt-3 pt-3 border-t border-gray-300">
                        <p className="text-xs text-gray-700 font-medium">
                          Valido fino al {new Date(product.discountExpiryDate).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Description */}
                {product.description && (
                  <div className="mb-4">
                    <h2 className="text-sm font-bold text-gray-900 mb-1">Descrizione</h2>
                    <p className="text-gray-600 leading-relaxed text-xs">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Specifications */}
                {((product as any).weight || (product as any).height || (product as any).width || (product as any).length) && (
                  <div className="mb-4 p-4 bg-gray-50 border border-gray-200">
                    <h2 className="text-sm font-bold text-gray-900 mb-4">Specifiche</h2>
                    <div className="flex flex-wrap gap-6">
                      {(product as any).weight && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-gray-600 font-semibold text-sm">Peso:</span>
                          <span className="text-gray-900 font-bold text-base">{(product as any).weight} kg</span>
                        </div>
                      )}
                      {(product as any).height && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-gray-600 font-semibold text-sm">Altezza:</span>
                          <span className="text-gray-900 font-bold text-base">{(product as any).height} cm</span>
                        </div>
                      )}
                      {(product as any).width && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-gray-600 font-semibold text-sm">Larghezza:</span>
                          <span className="text-gray-900 font-bold text-base">{(product as any).width} cm</span>
                        </div>
                      )}
                      {(product as any).length && (
                        <div className="flex items-baseline gap-2">
                          <span className="text-gray-600 font-semibold text-sm">Lunghezza:</span>
                          <span className="text-gray-900 font-bold text-base">{(product as any).length} cm</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={handleWishlistToggle}
                    disabled={addToWishlist.isPending || removeFromWishlist.isPending}
                    className={`px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm transition-all duration-300 disabled:opacity-50 hover:shadow-lg`}
                  >
                    {addToWishlist.isPending || removeFromWishlist.isPending
                      ? "..."
                      : localWishlistStatus
                        ? "❤️ Wishlist"
                        : "♡ Aggiungi"}
                  </button>

                  <a
                    href={`https://wa.me/393203615767?text=Ciao%20Talia%20Materassi%2C%20mi%20interessa%20il%20prodotto%20%22${encodeURIComponent(product.name)}%22%20e%20avrei%20bisogno%20di%20maggiori%20informazioni`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-5 py-3 bg-gray-900 hover:bg-gray-800 text-white font-bold text-sm transition-all duration-300 hover:shadow-lg"
                  >
                    📞 WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
