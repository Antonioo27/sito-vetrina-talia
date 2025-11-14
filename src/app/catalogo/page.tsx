"use client";

import { api } from "~/trpc/react";
import { useEffect, useState, useCallback, useMemo } from "react";
import Link from "next/link";
import { ProductCard } from "~/app/_components/product-card";

export default function ProdottiPage() {
  const { data: products, isLoading } = api.product.getAll.useQuery();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [selectedTypology, setSelectedTypology] = useState<string | null>(null);
  const [filteredProducts, setFilteredProducts] = useState<typeof products>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Debounce search term (300ms delay)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Memoizzare typologies per evitare ricalcoli
  const typologies = useMemo(() => {
    return products
      ? Array.from(new Set(
          products
            .map((p) => (p as any).typology)
            .filter((t) => t !== null && t !== undefined)
        ))
      : [];
  }, [products]);

  // Filter products based on debounced search term and selected typology
  useEffect(() => {
    if (!products) return;

    let result = products;

    // Filter by search term (con debounce)
    if (debouncedSearchTerm.trim()) {
      const searchLower = debouncedSearchTerm.toLowerCase();
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(searchLower) ||
          product.description?.toLowerCase().includes(searchLower)
      );
    }

    // Filter by typology
    if (selectedTypology) {
      result = result.filter(
        (product) => (product as any).typology === selectedTypology
      );
    }

    setFilteredProducts(result);
  }, [products, debouncedSearchTerm, selectedTypology]);

  // During SSR and hydration, render nothing to avoid mismatch
  if (!mounted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-white overflow-hidden">
      {/* Header */}
      <section className="w-full py-8 bg-white border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-black text-gray-900 mb-2 leading-tight animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "100ms" }}>
              I Nostri Prodotti
            </h1>
            <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700" style={{ animationDelay: "200ms" }}>
              Scopri la nostra esclusiva collezione di materassi premium realizzati con i migliori materiali.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-12">
        <div className="mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters */}
            <aside className="lg:col-span-1 lg:sticky lg:top-24 h-fit">
              {/* Search Bar */}
              <div className="mb-8">
                <div className="relative">
                  <svg
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400"
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
                    placeholder="Cerca..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#866f59] focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              {/* Typology Filter */}
              <div className="bg-white border border-gray-200 rounded-lg p-5">
                <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wide">Categoria</h3>
                <div className="space-y-2.5">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="typology"
                      checked={selectedTypology === null}
                      onChange={() => setSelectedTypology(null)}
                      className="w-4 h-4 text-[#866f59] rounded-full border-gray-300 focus:ring-[#866f59]"
                    />
                    <span className="text-sm text-gray-700 font-medium">Tutti</span>
                    <span className="ml-auto text-xs text-gray-500">({products?.length || 0})</span>
                  </label>

                  {typologies.map((typology) => (
                    <label key={typology} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="typology"
                        checked={selectedTypology === typology}
                        onChange={() => setSelectedTypology(selectedTypology === typology ? null : typology)}
                        className="w-4 h-4 text-[#866f59] rounded-full border-gray-300 focus:ring-[#866f59]"
                      />
                      <span className="text-sm text-gray-700 font-medium">{typology}</span>
                      <span className="ml-auto text-xs text-gray-500">
                        ({products?.filter((p) => (p as any).typology === typology).length || 0})
                      </span>
                    </label>
                  ))}
                </div>
              </div>

            </aside>

            {/* Products Grid */}
            <div className="lg:col-span-3">
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
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map((product, index) => (
                  <div
                    key={product.id}
                    className="animate-in fade-in slide-in-from-bottom-8"
                    style={{ animationDelay: `${index * 150}ms` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            )}
            </div>
          </div>
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
