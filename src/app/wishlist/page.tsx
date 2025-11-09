"use client";

import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function WishlistPage() {
  const { data: session, status } = useSession();
  const { data: wishlistItems, isLoading, refetch } = api.wishlist.getAll.useQuery(undefined, {
    enabled: !!session?.user,
  });
  const [mounted, setMounted] = useState(false);

  const removeFromWishlist = api.wishlist.remove.useMutation({
    onSuccess: () => {
      void refetch();
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  // Redirect to login if not authenticated
  if (status === "unauthenticated") {
    return (
      <main className="min-h-screen bg-white overflow-hidden">
        <section className="w-full bg-white py-8 border-b border-gray-200">
          <div className="container mx-auto px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
                La Mia Wishlist
              </h1>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <p className="text-gray-600 mb-8 text-lg">Devi essere loggato per visualizzare la tua wishlist</p>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#866f59] to-[#9d8273] hover:from-[#7a5d47] hover:to-[#8a6b58] text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
            >
              Accedi alla Wishlist
            </Link>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <section className="w-full bg-white py-8 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-black text-gray-900 mb-2">
              La Mia Wishlist
            </h1>
          </div>
        </div>
      </section>

      {/* Wishlist Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="rounded-3xl border-2 border-dashed border-gray-300 p-16 text-center bg-gray-50 animate-pulse">
              <p className="text-xl text-gray-500 font-medium">⏳ Caricamento wishlist...</p>
            </div>
          ) : !wishlistItems || wishlistItems.length === 0 ? (
            <div className="text-center">
              <div className="rounded-3xl border-2 border-dashed border-gray-300 p-16 bg-gray-50 mb-8">
                <p className="text-4xl mb-4"></p>
                <p className="text-xl text-gray-500 font-medium mb-2">La tua wishlist è vuota</p>
                <p className="text-gray-400">Scopri i nostri prodotti e aggiungili ai tuoi preferiti!</p>
              </div>
              <Link
                href="/catalogo"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#866f59] to-[#9d8273] hover:from-[#7a5d47] hover:to-[#8a6b58] text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
              >
                Scopri il Catalogo →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {wishlistItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden bg-white border border-gray-300 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full animate-in fade-in slide-in-from-bottom-8"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gray-100 h-48 w-full">
                    {item.product.media && item.product.media.length > 0 ? (
                      <img
                        src={item.product.media[0].url}
                        alt={item.product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}

                    {/* Typology Badge */}
                    {item.product.typology && (
                      <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider">
                        {item.product.typology}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-3 flex flex-col flex-1 min-h-56">
                    {/* Title */}
                    <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
                      {item.product.name}
                    </h3>

                    {/* Price & Discount */}
                    {item.product.price && (
                      <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                        {item.product.discount && item.product.discount > 0 ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-xs text-gray-600 line-through">
                                €{item.product.price.toFixed(2)}
                              </span>
                              <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                -{item.product.discount}%
                              </span>
                            </div>
                            <p className="text-lg font-black text-gray-900">
                              €{(item.product.price * (1 - item.product.discount / 100)).toFixed(2)}
                            </p>
                          </div>
                        ) : (
                          <p className="text-lg font-black text-gray-900">
                            €{item.product.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Description */}
                    <div className="mb-3 h-10 flex-1 min-h-10">
                      {item.product.description && (
                        <p className="text-gray-700 text-xs line-clamp-2">
                          {item.product.description}
                        </p>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto">
                      <Link
                        href={`/prodotto/${item.product.id}`}
                        className="flex-1 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg text-xs transition-all duration-300 hover:shadow-lg active:scale-95"
                      >
                        Scopri di più →
                      </Link>
                      <button
                        onClick={() => removeFromWishlist.mutate({ productId: item.product.id })}
                        disabled={removeFromWishlist.isPending}
                        className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-lg text-xs transition-all duration-300 disabled:opacity-50"
                        title="Rimuovi dalla wishlist"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Back to Catalog */}
      <section className="py-12 border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/catalogo"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#866f59] to-[#9d8273] text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
          >
            ← Continua lo Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
