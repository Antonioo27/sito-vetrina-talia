"use client";

import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import { ProductCard } from "./product-card";

export function ProductList() {
  const { data: products, isLoading } = api.product.getFeatured.useQuery();
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
        <div className="w-full overflow-x-auto pb-4">
          <div className="flex gap-6 justify-center px-4 min-w-min">
            {products.map((product, index) => (
              <div
                key={product.id}
                className="flex-shrink-0 w-64 animate-in fade-in slide-in-from-bottom-8"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
