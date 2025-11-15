"use client";

import { api } from "~/trpc/react";
import { useState } from "react";

export function BannerSection() {
  const { data: banner, isLoading } = api.banner.getActive.useQuery();
  const [imageLoaded, setImageLoaded] = useState(false);

  // If no banner is active, don't render anything
  if (!banner) {
    return null;
  }

  return (
    <section className="relative w-screen overflow-hidden">
      {/* Background Image - Aspect ratio 820:461 = 1.78:1 */}
      <div className="relative w-full" style={{ aspectRatio: "820/461" }}>
        {/* Loading Placeholder - Always show until image loads */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-300 via-gray-200 to-gray-300 flex items-center justify-center z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="relative w-20 h-20">
                <svg
                  className="w-20 h-20 text-gray-500 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              </div>
              <p className="text-gray-600 text-base font-semibold">Caricamento banner...</p>
            </div>
          </div>
        )}

        <img
          src={banner.imageUrl}
          alt={banner.altText || "Banner"}
          className="w-full h-full object-cover"
          loading="lazy"
          decoding="async"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          onLoad={() => setImageLoaded(true)}
          style={{
            imageRendering: "crisp-edges",
            WebkitFontSmoothing: "antialiased",
          }}
        />
        {/* Shadow Gradient from Left - Sfumato ombra da sinistra */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent"></div>
      </div>

      {/* Scroll Indicator - Hidden on mobile */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 animate-bounce hidden sm:block">
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white drop-shadow-lg" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}
