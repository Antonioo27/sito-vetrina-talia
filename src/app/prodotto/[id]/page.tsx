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
  const { data: session } = useSession();

  const { data: product, isLoading } = api.product.getById.useQuery(
    { id: productId },
    { enabled: mounted && !!productId }
  );

  const { data: isInWishlist } = api.wishlist.isInWishlist.useQuery(
    { productId },
    { enabled: mounted && !!productId && !!session?.user }
  );

  const addToWishlist = api.wishlist.add.useMutation();
  const removeFromWishlist = api.wishlist.remove.useMutation();

  const handleWishlistToggle = async () => {
    if (!session?.user) {
      // Redirect to login
      window.location.href = "/login";
      return;
    }

    if (isInWishlist) {
      await removeFromWishlist.mutateAsync({ productId });
    } else {
      await addToWishlist.mutateAsync({ productId });
    }
  };

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
            href="/prodotti"
            className="inline-flex items-center gap-2 px-6 py-3 mt-6 bg-gradient-to-r from-[#866f59] to-[#9d8273] text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
          >
            ← Torna ai Prodotti
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
      {/* Header */}
      <section className="relative w-full overflow-hidden bg-gradient-to-r from-gray-900 via-gray-800 to-yellow-900 py-12">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-400 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-500 rounded-full blur-3xl"></div>
        </div>

        <div className="relative container mx-auto px-4">
          <div className="flex items-center gap-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Link
              href="/prodotti"
              className="inline-flex items-center gap-2 text-yellow-400 hover:text-yellow-300 transition-colors duration-300"
            >
              ← Torna ai Prodotti
            </Link>
          </div>
        </div>
      </section>

      {/* Product Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Media Gallery - Left Side */}
            <div className="animate-in fade-in slide-in-from-left-8 duration-700">
              <ProductGallery
                items={galleryItems}
                productName={product.name}
              />
            </div>

            {/* Product Info - Right Side */}
            <div className="animate-in fade-in slide-in-from-right-8 duration-700">
              <div className="mb-6">
                <div className="inline-block mb-4 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold uppercase tracking-widest">
                  Dettagli Prodotto
                </div>

                <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 leading-tight">
                  {product.name}
                </h1>

                {product.typology && (
                  <div className="mb-4">
                    <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm font-semibold rounded-full">
                      {product.typology}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="w-5 h-5 text-yellow-400 fill-current"
                          viewBox="0 0 20 20"
                        >
                          <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-gray-600 ml-2">(0 recensioni)</span>
                  </div>
                </div>

                {/* Price */}
                {product.price && (
                  <div className="mb-8 p-6 bg-gradient-to-r from-yellow-50 to-gray-50 rounded-xl border border-yellow-200">
                    <p className="text-gray-600 text-sm mb-2">Prezzo</p>
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-black text-gray-900">€{finalPrice?.toFixed(2)}</span>
                      {product.discount && product.discount > 0 && (
                        <>
                          <span className="text-lg text-gray-500 line-through">€{product.price.toFixed(2)}</span>
                          <span className="inline-block px-3 py-1 bg-red-500 text-white rounded-full text-sm font-bold">
                            -{product.discount}%
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Description */}
                {product.description && (
                  <div className="mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Descrizione</h2>
                    <p className="text-gray-600 leading-relaxed text-lg">
                      {product.description}
                    </p>
                  </div>
                )}

                {/* Specifications */}
                {((product as any).weight || (product as any).height || (product as any).width || (product as any).length) && (
                  <div className="mb-8 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Specifiche Tecniche</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {(product as any).weight && (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600 font-semibold">Peso:</span>
                          <span className="text-gray-900 font-bold">{(product as any).weight} kg</span>
                        </div>
                      )}
                      {(product as any).height && (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600 font-semibold">Altezza:</span>
                          <span className="text-gray-900 font-bold">{(product as any).height} cm</span>
                        </div>
                      )}
                      {(product as any).width && (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600 font-semibold">Larghezza:</span>
                          <span className="text-gray-900 font-bold">{(product as any).width} cm</span>
                        </div>
                      )}
                      {(product as any).length && (
                        <div className="flex items-center gap-3">
                          <span className="text-gray-600 font-semibold">Lunghezza:</span>
                          <span className="text-gray-900 font-bold">{(product as any).length} cm</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Features */}
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Caratteristiche</h3>
                  <ul className="space-y-3">
                    {[
                      "Memory Foam di prima qualità",
                      "Supporto ortopedico avanzato",
                      "Traspirante e igienico",
                      "Tessuto premium antistatico",
                      "Garanzia 10 anni",
                      "Consegna gratuita",
                    ].map((feature, i) => (
                      <li
                        key={i}
                        className="flex items-center gap-3 text-gray-700"
                      >
                        <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-yellow-400 text-gray-900 font-bold text-sm">
                          ✓
                        </span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleWishlistToggle}
                    disabled={addToWishlist.isPending || removeFromWishlist.isPending}
                    className={`flex-1 px-8 py-4 border-2 font-black rounded-xl transition-all duration-300 hover:scale-105 transform text-lg disabled:opacity-50 ${isInWishlist
                      ? "border-red-500 bg-red-500 text-white hover:bg-red-600 hover:border-red-600"
                      : "border-[#866f59] text-[#866f59] hover:bg-[#866f59] hover:text-white"
                      }`}
                  >
                    {addToWishlist.isPending || removeFromWishlist.isPending
                      ? "Aggiornamento..."
                      : isInWishlist
                        ? "Aggiungi alla Wishlist"
                        : "Aggiungi alla Wishlist"}
                  </button>

                  <a
                    href={`https://wa.me/393203615767?text=Ciao%20Talia%20Materassi%2C%20mi%20interessa%20il%20prodotto%20%22${encodeURIComponent(product.name)}%22%20e%20avrei%20bisogno%20di%20maggiori%20informazioni`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-black rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 transform text-lg group relative overflow-hidden"
                  >
                    <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                    <span className="relative">Contatta su WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Back to Products */}
      <section className="py-12 border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/prodotti"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#866f59] to-[#9d8273] text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
          >
            ← Torna ai Prodotti
          </Link>
        </div>
      </section>
    </main>
  );
}
