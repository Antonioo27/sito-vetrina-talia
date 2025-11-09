"use client";

import type { Product } from "@prisma/client";

interface ProductCardProps {
  product: Product & { typology?: string | null };
}

export function ProductCard({ product }: ProductCardProps) {

  return (
    <div className="group relative overflow-hidden bg-white border border-gray-300 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 h-48 w-full">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}

        {/* Typology Badge */}
        {(product as any).typology && (
          <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-gray-900 px-2.5 py-1 rounded-sm text-xs font-bold uppercase tracking-wider">
            {(product as any).typology}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3 flex flex-col flex-1 min-h-56">
        {/* Title */}
        <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Price & Discount - Nero su Bianco, ben formattato */}
        {product.price && (
          <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg">
            {(product as any).discount && (product as any).discount > 0 ? (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-600 line-through">
                    €{product.price.toFixed(2)}
                  </span>
                  <span className="text-xs font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded">
                    -{(product as any).discount}%
                  </span>
                </div>
                <p className="text-lg font-black text-gray-900">
                  €{(product.price * (1 - (product as any).discount / 100)).toFixed(2)}
                </p>
              </div>
            ) : (
              <p className="text-lg font-black text-gray-900">
                €{product.price.toFixed(2)}
              </p>
            )}
          </div>
        )}

        {/* Description - Fixed area */}
        <div className="mb-3 h-10 flex-1 min-h-10">
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
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-lg text-xs transition-all duration-300 hover:shadow-lg active:scale-95"
          >
            Scopri di più →
          </a>
        </div>
      </div>
    </div>
  );
}
