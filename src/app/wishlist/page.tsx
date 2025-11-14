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
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {wishlistItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative overflow-hidden bg-white border border-gray-300 shadow-md hover:shadow-2xl transition-all duration-400 flex flex-col h-full hover:-translate-y-3 hover:scale-105 cursor-pointer animate-in fade-in slide-in-from-bottom-8"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Image */}
                  <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 h-72 w-full flex items-center justify-center transition-colors duration-400 group-hover:from-gray-100 group-hover:to-gray-150">
                    {item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain transition-transform duration-600 group-hover:scale-115 p-3 group-hover:p-2"
                      />
                    ) : item.product.media && item.product.media.length > 0 && item.product.media[0] ? (
                      <img
                        src={item.product.media[0]!.url}
                        alt={item.product.name}
                        loading="lazy"
                        decoding="async"
                        className="h-full w-full object-contain transition-transform duration-600 group-hover:scale-115 p-3 group-hover:p-2"
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-400">
                        No image
                      </div>
                    )}

                    {/* Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 -skew-x-12 group-hover:translate-x-full" style={{ animation: "none" }}></div>
                  </div>

                  {/* Content */}
                  <div className="p-3 flex flex-col flex-1 min-h-40">
                    {/* Title */}
                    <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 transition-all duration-400 group-hover:text-[#866f59] group-hover:translate-x-1">
                      {item.product.name}
                    </h3>

                    {/* Price & Discount - Spiglioso, senza arrotondamenti */}
                    {item.product.price && (
                      <div className="mb-2 p-2.5 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 transition-all duration-400 group-hover:from-[#866f59]/15 group-hover:to-[#9d8273]/15 group-hover:border-[#866f59]/40 group-hover:shadow-md">
                        {(item.product as any).discount && (item.product as any).discount > 0 ? (
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="text-xs text-gray-600 line-through">
                                €{item.product.price.toFixed(2)}
                              </span>
                              <span className="text-xs font-bold bg-red-100 text-red-700 px-1.5 py-0.5">
                                -{(item.product as any).discount}%
                              </span>
                            </div>
                            <p className="text-base font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                              €{(item.product.price * (1 - (item.product as any).discount / 100)).toFixed(2)}
                            </p>
                            {(item.product as any).discountExpiryDate && (
                              <p className="text-xs text-gray-700 font-medium">
                                Valido fino al {new Date((item.product as any).discountExpiryDate).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                              </p>
                            )}
                          </div>
                        ) : (
                          <p className="text-base font-black bg-gradient-to-r from-[#866f59] to-[#9d8273] bg-clip-text text-transparent">
                            €{item.product.price.toFixed(2)}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Description - Fixed area */}
                    <div className="mb-2 h-8 flex-1 min-h-8">
                      {item.product.description && (
                        <p className="text-gray-700 text-xs line-clamp-2">
                          {item.product.description}
                        </p>
                      )}
                    </div>

                    {/* CTA Button - Bottom Right, always at bottom */}
                    <div className="flex justify-between items-end gap-2 mt-auto">
                      <a
                        href={`/prodotto/${item.product.id}`}
                        className="flex-1 px-4 py-2 bg-gradient-to-r from-[#866f59] via-[#9d8273] to-[#866f59] text-white font-bold text-xs transition-all duration-400 hover:shadow-xl hover:shadow-[#866f59]/50 transform hover:scale-125 hover:-translate-y-1 active:scale-95 relative overflow-hidden group/btn"
                      >
                        <span className="relative z-10 flex items-center gap-1">
                          Scopri di più
                          <span className="transition-transform duration-400 group-hover/btn:translate-x-1">→</span>
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-400 translate-x-full group-hover/btn:translate-x-0"></div>
                      </a>
                      <button
                        onClick={() => removeFromWishlist.mutate({ productId: item.product.id })}
                        disabled={removeFromWishlist.isPending}
                        className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded text-xs transition-all duration-300 disabled:opacity-50"
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
            Scopri il Catalogo →
          </Link>
        </div>
      </section>
    </main>
  );
}
