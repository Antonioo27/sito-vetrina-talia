"use client";

import { api } from "~/trpc/react";

export function BannerSection() {
  const { data: banner } = api.banner.getActive.useQuery();

  // If no banner is active, don't render anything
  if (!banner) {
    return null;
  }

  return (
    <section className="relative w-screen overflow-hidden">
      {/* Background Image - Aspect ratio 820:461 = 1.78:1 */}
      <div className="relative w-full" style={{ aspectRatio: "820/461" }}>
        <img
          src={banner.imageUrl}
          alt={banner.altText || "Banner"}
          className="w-full h-full object-cover"
          loading="eager"
          decoding="async"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
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
