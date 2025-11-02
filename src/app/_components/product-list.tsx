"use client";

import { api } from "~/trpc/react";
import { useEffect, useState } from "react";

export function ProductList() {
  const { data: products, isLoading } = api.product.getAll.useQuery();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // During SSR and hydration, render nothing to avoid mismatch
  if (!mounted) {
    return null;
  }

  return (
    <div className="w-full">
      {/* Section Header */}
      <div className="mb-16 text-center">
        <div className="inline-block mb-4 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold uppercase tracking-widest animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "100ms" }}>
          Esclusiva Collezione
        </div>
        <h2 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-gray-900 via-gray-800 to-yellow-600 bg-clip-text text-transparent mb-4 animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "200ms" }}>
          Le Nostre Novità
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "300ms" }}>
          Scopri la nostra ultima selezione di materassi premium realizzati con i migliori materiali per garantire il tuo comfort notturno.
        </p>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-300 p-16 text-center bg-gray-50 animate-pulse">
          <p className="text-xl text-gray-500 font-medium">⏳ Caricamento prodotti...</p>
        </div>
      ) : !products || products.length === 0 ? (
        <div className="rounded-3xl border-2 border-dashed border-gray-300 p-16 text-center bg-gray-50">
          <p className="text-xl text-gray-500 font-medium">Catalogo vuoto</p>
          <p className="text-gray-400 mt-2">I prodotti verranno aggiunti presto</p>
        </div>
      ) : (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <div
              key={product.id}
              className="group relative rounded-3xl overflow-hidden bg-white border border-gray-200 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-105 animate-in fade-in slide-in-from-bottom-8"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              {/* Image Container */}
              <div className="relative overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 h-72">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-120"
                  />
                ) : (
                  <div className="h-full flex flex-col items-center justify-center gap-2">
                    <span className="text-5xl"></span>
                    <span className="text-gray-400">No image</span>
                  </div>
                )}

                {/* Typology Badge */}
                {(product as any).typology && (
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm text-gray-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-md">
                    {(product as any).typology}
                  </div>
                )}

                {/* Price Badge */}
                {product.price && (
                  <div className="absolute bottom-4 right-4 flex flex-col items-end gap-2">
                    {(product as any).discount && (product as any).discount > 0 ? (
                      <>
                        <div className="text-sm font-bold text-white bg-red-500 px-3 py-1 rounded-full shadow-md">
                          -{(product as any).discount}%
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs text-gray-600 line-through">
                            €{product.price.toFixed(2)}
                          </span>
                          <div className="bg-gradient-to-r from-[#866f59] to-[#9d8273] text-white px-4 py-2 rounded-lg font-black text-base shadow-lg">
                            €{(product.price * (1 - (product as any).discount / 100)).toFixed(2)}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="bg-gradient-to-r from-[#866f59] to-[#9d8273] text-white px-4 py-2 rounded-lg font-black text-base shadow-lg">
                        €{product.price.toFixed(2)}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="p-7">
                <h3 className="text-2xl font-black text-gray-900 mb-3 group-hover:text-yellow-600 transition-colors duration-300 line-clamp-2">
                  {product.name}
                </h3>

                {product.description && (
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 line-clamp-3 h-[3.75rem]">
                    {product.description}
                  </p>
                )}

                {/* CTA Button */}
                <a
                  href={`/prodotto/${product.id}`}
                  className="inline-block w-full px-6 py-3 bg-gradient-to-r from-[#866f59] to-[#9d8273] hover:from-[#7a5d47] hover:to-[#8a6b58] text-white font-bold rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-105 active:scale-95 transform text-lg text-center group relative overflow-hidden"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
                  <span className="relative">Scopri di più →</span>
                </a>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
