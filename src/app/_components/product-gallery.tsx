"use client";

import { useState } from "react";

interface GalleryItem {
  type: "image" | "video";
  url: string;
  alt?: string;
}

interface ProductGalleryProps {
  items?: GalleryItem[];
  productName?: string;
}

export function ProductGallery({ items = [], productName = "Prodotto" }: ProductGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  // If no items, show placeholder
  if (items.length === 0) {
    return (
      <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
        {/* Main Image */}
        <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <div className="text-center">
            <span className="text-6xl mb-4 block">🛏️</span>
            <p className="text-gray-500 font-medium">Gallery non disponibile</p>
            <p className="text-gray-400 text-sm mt-2">
              Le foto del prodotto appariranno qui
            </p>
          </div>
        </div>

        {/* Placeholder Thumbnails */}
        <div className="p-4 grid grid-cols-4 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div
              key={i}
              className="aspect-square bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg flex items-center justify-center text-gray-400 hover:from-gray-300 hover:to-gray-400 transition-all duration-300 cursor-pointer"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m0 0h6m-6-6h6m0 0v6" />
              </svg>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const selectedItem = items[selectedIndex];
  if (!selectedItem) return null;
  const isVideo = selectedItem.type === "video";

  return (
    <div className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-200">
      {/* Main Display */}
      <div className="aspect-square bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden relative group">
        {isVideo ? (
          <video
            src={selectedItem.url}
            className="w-full h-full object-cover"
            controls
          />
        ) : (
          <img
            src={selectedItem.url}
            alt={selectedItem.alt || productName}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        )}

        {/* Video Badge */}
        {isVideo && (
          <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1 text-sm font-bold text-gray-900">
            🎥 Video
          </div>
        )}

        {/* Navigation Arrows */}
        {items.length > 1 && (
          <>
            <button
              onClick={() =>
                setSelectedIndex((i) => (i - 1 + items.length) % items.length)
              }
              className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3 transition-all duration-300 shadow-lg hover:scale-110"
            >
              <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={() =>
                setSelectedIndex((i) => (i + 1) % items.length)
              }
              className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white rounded-full p-3 transition-all duration-300 shadow-lg hover:scale-110"
            >
              <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}
      </div>

      {/* Thumbnails - Puzzle Style Grid */}
      {items.length > 1 && (
        <div className="p-4">
          <div className="grid gap-2" style={{
            gridTemplateColumns: `repeat(auto-fill, minmax(80px, 1fr))`,
          }}>
            {items.map((item, i) => (
              <button
                key={i}
                onClick={() => setSelectedIndex(i)}
                className={`aspect-square rounded-lg overflow-hidden border-2 transition-all duration-300 hover:scale-110 ${
                  selectedIndex === i
                    ? "border-yellow-500 shadow-lg"
                    : "border-gray-300 hover:border-yellow-300"
                }`}
              >
                <div className="w-full h-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center relative overflow-hidden group">
                  {item.type === "video" ? (
                    <>
                      <span className="text-2xl">🎥</span>
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all duration-300"></div>
                    </>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.alt}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  )}
                </div>
              </button>
            ))}
          </div>
          <div className="mt-4 text-center text-sm text-gray-600">
            <span className="font-semibold text-gray-900">{selectedIndex + 1}</span>/{items.length} media
          </div>
        </div>
      )}
    </div>
  );
}
