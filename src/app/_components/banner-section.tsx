"use client";

import { api } from "~/trpc/react";

export function BannerSection() {
  const { data: banner } = api.banner.getActive.useQuery();

  const bannerImage = banner?.imageUrl || "/images/banner.jpg";
  const bannerAlt = banner?.altText || "Talia Materassi - Materassi Premium";

  return (
    <section className="relative w-full h-56 sm:h-80 md:h-screen flex items-end justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={bannerImage}
          alt={bannerAlt}
          className="w-full h-full object-cover"
        />
        {/* Smart Overlay - Gradient + Blur for text area */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent"></div>
      </div>

      {/* Banner Text - Bottom Center */}
      <div className="relative z-10 container mx-auto px-4 pb-6 sm:pb-12 md:pb-16 text-center">
        <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <h1 className="text-2xl sm:text-4xl md:text-7xl font-black text-white mb-1 sm:mb-3 leading-tight">
            Talia Materassi
          </h1>
          <p className="text-sm sm:text-base md:text-xl text-gray-100">
            Scopri il comfort del lusso
          </p>
        </div>
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
