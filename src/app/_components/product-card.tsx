"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import type { Product } from "@prisma/client";
import { api } from "~/trpc/react";

interface ProductCardProps {
  product: Product & { typology?: string | null };
  hideWishlist?: boolean;
}

export function ProductCard({ product, hideWishlist = false }: ProductCardProps) {
  const { data: session } = useSession();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Determine if we should show wishlist (not admin, not hideWishlist flag)
  const shouldShowWishlist = !hideWishlist && !(session?.user as any)?.isAdmin;

  const utils = api.useUtils();

  const wishlistAddMutation = api.wishlist.add.useMutation({
    onSuccess: () => {
      // Invalidate the wishlist status query for this product
      utils.wishlist.isInWishlist.invalidate({ productId: product.id });
      // Also invalidate the getAll wishlist query
      utils.wishlist.getAll.invalidate();
    },
  });

  const wishlistRemoveMutation = api.wishlist.remove.useMutation({
    onSuccess: () => {
      // Invalidate the wishlist status query for this product
      utils.wishlist.isInWishlist.invalidate({ productId: product.id });
      // Also invalidate the getAll wishlist query
      utils.wishlist.getAll.invalidate();
    },
  });

  const { data: wishlistStatus } = api.wishlist.isInWishlist.useQuery(
    { productId: product.id },
    { enabled: !!session?.user && shouldShowWishlist }
  );

  useEffect(() => {
    if (wishlistStatus !== undefined) {
      setIsInWishlist(wishlistStatus);
    }
  }, [wishlistStatus]);

  // Reset wishlist status when user logs out
  useEffect(() => {
    if (!session?.user) {
      setIsInWishlist(false);
    }
  }, [session?.user]);

  const handleWishlistToggle = async () => {
    if (!session?.user) {
      // Redirect to login
      window.location.href = "/login";
      return;
    }

    setIsLoading(true);
    try {
      if (isInWishlist) {
        await wishlistRemoveMutation.mutateAsync({ productId: product.id });
        setIsInWishlist(false);
      } else {
        await wishlistAddMutation.mutateAsync({ productId: product.id });
        setIsInWishlist(true);
      }
    } catch (error) {
      console.error("Errore nella gestione della wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="group relative rounded-xl overflow-hidden bg-white border border-gray-300 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Image */}
      <div className="relative overflow-hidden bg-gray-100 h-48 w-full">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-400">
            No image
          </div>
        )}

        {/* Wishlist Button - Top Right (only show if not admin) */}
        {shouldShowWishlist && (
          <button
            onClick={handleWishlistToggle}
            disabled={isLoading}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 backdrop-blur-sm hover:bg-white transition-all duration-300 shadow-md hover:shadow-lg disabled:opacity-50"
            aria-label={isInWishlist ? "Rimuovi dalla wishlist" : "Aggiungi alla wishlist"}
          >
            <svg
              className={`w-5 h-5 transition-all duration-300 ${
                isInWishlist ? "fill-red-500 text-red-500" : "text-gray-700"
              }`}
              fill={isInWishlist ? "currentColor" : "none"}
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              />
            </svg>
          </button>
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
