import "~/styles/globals.css";
import "@uploadthing/react/styles.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { Footer } from "~/app/_components/footer";
import { Navbar } from "~/app/_components/navbar";
import { Providers } from "~/app/providers";
import { Breadcrumbs } from "~/app/_components/breadcrumbs";

export const metadata: Metadata = {
  title: "Talia Materassi | Materassi Premium di Qualità",
  description: "Scopri la collezione esclusiva di materassi Talia Materassi. Qualità premium, garanzia 10 anni e consegna gratuita. Memory Foam, Molle, Ibridi e molto altro.",
  keywords: ["materassi", "materassi premium", "memory foam", "molle", "lattice", "ortopedici", "garanzia 10 anni"],
  icons: [{ rel: "icon", url: "/favicon.ico" }],
  openGraph: {
    title: "Talia Materassi | Materassi Premium di Qualità",
    description: "Scopri la collezione esclusiva di materassi Talia Materassi. Qualità premium, garanzia 10 anni e consegna gratuita.",
    images: [
      {
        url: "/images/banner.jpg",
        width: 1200,
        height: 630,
        alt: "Talia Materassi - Materassi Premium",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Talia Materassi | Materassi Premium di Qualità",
    description: "Scopri la collezione esclusiva di materassi Talia Materassi.",
    images: ["/images/banner.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },
  metadataBase: new URL("https://www.taliamatrassi.it"),
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="it" className={`${geist.variable} scroll-smooth overflow-x-hidden`}>
      <body className="bg-white text-gray-900 flex flex-col min-h-screen overflow-x-hidden">
        <Providers>
          <Navbar />
          <Breadcrumbs />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
