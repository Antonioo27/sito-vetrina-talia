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
        <section className="relative w-full overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-yellow-900 py-16">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500 rounded-full blur-3xl"></div>
          </div>

          <div className="relative container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
              La Mia Wishlist
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "100ms" }}>
              Accedi per visualizzare la tua wishlist
            </p>
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
      <section className="relative w-full overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-yellow-900 py-16">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700">
              La Mia Wishlist
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "100ms" }}>
              I tuoi prodotti preferiti in un unico posto
            </p>
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
                href="/prodotti"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#866f59] to-[#9d8273] hover:from-[#7a5d47] hover:to-[#8a6b58] text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
              >
                Scopri i Prodotti →
              </Link>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {wishlistItems.map((item, index) => (
                <div
                  key={item.id}
                  className="group relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 animate-in fade-in slide-in-from-bottom-8"
                  style={{ animationDelay: `${index * 150}ms` }}
                >
                  {/* Image Container */}
                  <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-72">
                    {item.product.media && item.product.media.length > 0 ? (
                      <img
                        src={item.product.media[0].url}
                        alt={item.product.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-120"
                      />
                    ) : item.product.imageUrl ? (
                      <img
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-120"
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center gap-2">
                        <span className="text-5xl"></span>
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}

                    {/* Typology Badge */}
                    {item.product.typology && (
                      <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                        {item.product.typology}
                      </div>
                    )}

                    {/* Price Badge */}
                    {item.product.price && (
                      <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
                        {item.product.discount && item.product.discount > 0 ? (
                          <>
                            <div className="text-sm font-bold text-white bg-red-500 px-3 py-1 rounded-full shadow-md">
                              -{item.product.discount}%
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-xs text-gray-600 line-through">
                                €{item.product.price.toFixed(2)}
                              </span>
                              <div className="bg-gradient-to-r from-[#866f59] to-[#9d8273] text-white px-4 py-2 rounded-lg font-black text-base shadow-lg">
                                €{(item.product.price * (1 - item.product.discount / 100)).toFixed(2)}
                              </div>
                            </div>
                          </>
                        ) : (
                          <div className="bg-gradient-to-r from-[#866f59] to-[#9d8273] text-white px-4 py-2 rounded-lg font-black text-base shadow-lg">
                            €{item.product.price.toFixed(2)}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-7">
                    <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors duration-300 line-clamp-2">
                      {item.product.name}
                    </h3>

                    {item.product.description && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 h-[3.75rem]">
                        {item.product.description}
                      </p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      <Link
                        href={`/prodotto/${item.product.id}`}
                        className="flex-1 inline-block px-6 py-3 bg-gradient-to-r from-[#866f59] to-[#9d8273] hover:from-[#7a5d47] hover:to-[#8a6b58] text-white font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 transform text-lg text-center group relative overflow-hidden"
                      >
                        <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                        <span className="relative">Dettagli</span>
                      </Link>
                      <button
                        onClick={() => removeFromWishlist.mutate({ productId: item.product.id })}
                        disabled={removeFromWishlist.isPending}
                        className="px-4 py-3 bg-red-100 hover:bg-red-200 text-red-600 font-bold rounded-xl transition-all duration-300 disabled:opacity-50"
                        title="Rimuovi dalla wishlist"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Back to Products */}
      <section className="py-12 border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/prodotti"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#866f59] to-[#9d8273] text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
          >
            ← Continua lo Shopping
          </Link>
        </div>
      </section>
    </main>
  );
}
