"use client";

import { api } from "~/trpc/react";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function ProdottiPage() {
  const { data: products, isLoading } = api.product.getAll.useQuery();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTypology, setSelectedTypology] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<typeof products>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Extract unique typologies from products
  const typologies = products
    ? Array.from(new Set(
        products
          .map((p) => (p as any).typology)
          .filter((t) => t !== null && t !== undefined)
      ))
    : [];

  // Filter products based on search term and selected typology
  useEffect(() => {
    if (!products) return;

    let result = products;

    // Filter by search term
    if (searchTerm.trim()) {
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by typology
    if (selectedTypology) {
      result = result.filter(
        (product) => (product as any).typology === selectedTypology
      );
    }

    setFilteredProducts(result);
  }, [products, searchTerm, selectedTypology]);

  // During SSR and hydration, render nothing to avoid mismatch
  if (!mounted) {
    return null;
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
            <h1 className="text-5xl md:text-6xl font-black text-white mb-4 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "100ms" }}>
              I Nostri Prodotti
            </h1>
            <p className="text-xl text-gray-200 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "200ms" }}>
              Scopri la nostra esclusiva collezione di materassi premium realizzati con i migliori materiali.
            </p>
          </div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="relative w-full py-12 border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-6">
            {/* Search Bar */}
            <div className="w-full">
              <div className="relative">
                <svg
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Cerca per nome o descrizione..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* Typology Filter */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setSelectedTypology(null)}
                className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
                  selectedTypology === null
                    ? "bg-gradient-to-r from-[#866f59] to-[#9d8273] text-white shadow-lg"
                    : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                }`}
              >
                Tutti
              </button>

              {typologies.map((typology) => (
                <button
                  key={typology}
                  onClick={() =>
                    setSelectedTypology(
                      selectedTypology === typology ? null : typology
                    )
                  }
                  className={`px-5 py-2 rounded-full font-semibold transition-all duration-300 ${
                    selectedTypology === typology
                      ? "bg-gradient-to-r from-[#866f59] to-[#9d8273] text-white shadow-lg"
                      : "bg-gray-100 text-gray-900 hover:bg-gray-200"
                  }`}
                >
                  {typology}
                </button>
              ))}
            </div>

            {/* Results Count */}
            <div className="text-sm text-gray-600">
              Mostrando {filteredProducts?.length || 0} prodotto
              {filteredProducts?.length !== 1 ? "i" : ""} di{" "}
              {products?.length || 0}
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="rounded-3xl border-2 border-dashed border-gray-300 p-16 text-center bg-gray-50 animate-pulse">
              <p className="text-xl text-gray-500 font-medium">⏳ Caricamento prodotti...</p>
            </div>
          ) : !filteredProducts || filteredProducts.length === 0 ? (
            <div className="rounded-3xl border-2 border-dashed border-gray-300 p-16 text-center bg-gray-50">
              <p className="text-xl text-gray-500 font-medium">
                {products?.length === 0
                  ? "Catalogo vuoto"
                  : "Nessun prodotto trovato"}
              </p>
              <p className="text-gray-400 mt-2">
                {products?.length === 0
                  ? "I prodotti verranno aggiunti presto"
                  : "Prova a modificare i filtri di ricerca"}
              </p>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product, index) => (
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
      </section>

      {/* Back to Home Link */}
      <section className="py-12 border-t border-gray-200 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-[#866f59] to-[#9d8273] text-white font-bold rounded-lg transition-all duration-300 hover:shadow-lg hover:scale-105 transform"
          >
            ← Torna alla Home
          </Link>
        </div>
      </section>
    </main>
  );
}
