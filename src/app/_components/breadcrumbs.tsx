"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { api } from "~/trpc/react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const [productName, setProductName] = useState<string | null>(null);
  const isProductPage = pathname.startsWith("/prodotto/");
  const productId = isProductPage ? pathname.split("/").pop() : null;

  // Use TRPC to fetch product name
  const { data: product } = api.product.getById.useQuery(
    { id: productId || "" },
    { enabled: isProductPage && !!productId }
  );

  useEffect(() => {
    if (product) {
      setProductName(product.name);
    }
  }, [product]);

  // Define breadcrumbs based on the current path
  const getBreadcrumbs = (): BreadcrumbItem[] => {
    if (pathname === "/") {
      return [{ label: "Home" }];
    }

    if (pathname === "/prodotti") {
      return [
        { label: "Home", href: "/" },
        { label: "Prodotti" },
      ];
    }

    if (pathname === "/contatti") {
      return [
        { label: "Home", href: "/" },
        { label: "Contatti" },
      ];
    }

    if (pathname === "/login") {
      return [
        { label: "Home", href: "/" },
        { label: "Accedi" },
      ];
    }

    if (pathname === "/wishlist") {
      return [
        { label: "Home", href: "/" },
        { label: "La mia Wishlist" },
      ];
    }

    if (isProductPage && productId) {
      return [
        { label: "Home", href: "/" },
        { label: "Prodotti", href: "/prodotti" },
        { label: productName || "Caricamento..." },
      ];
    }

    return [{ label: "Home", href: "/" }];
  };

  const breadcrumbs = getBreadcrumbs();

  // Don't show breadcrumbs on home page
  if (pathname === "/") {
    return null;
  }

  return (
    <nav aria-label="Breadcrumbs" className="bg-gray-50 border-b border-gray-200">
      <div className="container mx-auto px-4 py-3">
        <ol className="flex items-center gap-2 text-sm">
          {breadcrumbs.map((crumb, index) => (
            <li key={index} className="flex items-center gap-2">
              {crumb.href ? (
                <>
                  <Link
                    href={crumb.href}
                    className="text-[#866f59] hover:text-[#7a5d47] font-medium transition-colors duration-300"
                  >
                    {crumb.label}
                  </Link>
                  {index < breadcrumbs.length - 1 && (
                    <span className="text-gray-400">/</span>
                  )}
                </>
              ) : (
                <>
                  <span className="text-gray-700 font-medium">{crumb.label}</span>
                </>
              )}
            </li>
          ))}
        </ol>
      </div>
    </nav>
  );
}
