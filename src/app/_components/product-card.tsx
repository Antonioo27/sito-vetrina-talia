"use client";

import type { Product } from "@prisma/client";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {

  return (
    <div className="group relative overflow-hidden bg-white border border-gray-300 shadow-md hover:shadow-2xl transition-all duration-400 flex flex-col h-full hover:-translate-y-3 hover:scale-105 cursor-pointer">
      {/* Image */}
      <div className="relative overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 h-72 w-full flex items-center justify-center transition-colors duration-400 group-hover:from-gray-100 group-hover:to-gray-150">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
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
          {product.name}
        </h3>

        {/* Price & Discount - Spiglioso, senza arrotondamenti */}
        {product.price && (
          <div className="mb-2 p-2.5 bg-gradient-to-r from-gray-50 to-gray-100 border border-gray-200 transition-all duration-400 group-hover:from-[#866f59]/15 group-hover:to-[#9d8273]/15 group-hover:border-[#866f59]/40 group-hover:shadow-md">
            {(product as any).discount && (product as any).discount > 0 ? (
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs text-gray-600 line-through">
                    €{product.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold bg-red-100 text-red-700 px-1.5 py-0.5">
                    -{(product as any).discount}%
                  </span>
                </div>
                <p className="text-base font-black bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
                  €{(product.price * (1 - (product as any).discount / 100)).toFixed(2)}
                </p>
                {(product as any).discountExpiryDate && (
                  <p className="text-xs text-gray-700 font-medium">
                    Valido fino al {new Date((product as any).discountExpiryDate).toLocaleDateString('it-IT', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </p>
                )}
              </div>
            ) : (
              <p className="text-base font-black bg-gradient-to-r from-[#866f59] to-[#9d8273] bg-clip-text text-transparent">
                €{product.price.toFixed(2)}
              </p>
            )}
          </div>
        )}

        {/* Description - Fixed area */}
        <div className="mb-2 h-8 flex-1 min-h-8">
          {product.description && (
            <p className="text-gray-700 text-xs line-clamp-2">
              {product.description}
            </p>
          )}
        </div>

        {/* CTA Button - Bottom Right, always at bottom */}
        <div className="flex justify-end mt-auto">
          <a
            href={`/prodotto/${product.id}`}
            className="px-4 py-2 bg-gradient-to-r from-[#866f59] via-[#9d8273] to-[#866f59] text-white font-bold text-xs transition-all duration-400 hover:shadow-xl hover:shadow-[#866f59]/50 transform hover:scale-125 hover:-translate-y-1 active:scale-95 relative overflow-hidden group/btn"
          >
            <span className="relative z-10 flex items-center gap-1">
              Scopri di più
              <span className="transition-transform duration-400 group-hover/btn:translate-x-1">→</span>
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-400 translate-x-full group-hover/btn:translate-x-0"></div>
          </a>
        </div>
      </div>
    </div>
  );
}
