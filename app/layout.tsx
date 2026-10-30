import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { clerkAppearance } from "@/lib/clerkAppearance";
import { SITE_URL } from "@/lib/community";
import "./globals.css";

const display = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrains = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BuildStation — La red de builders",
    template: "%s · BuildStation",
  },
  description:
    "Comunidad que aplica inteligencia artificial a construcción, minería, energía y real estate. Desde Lima, construyendo para LatAm.",
  applicationName: "BuildStation",
  icons: {
    icon: "/brand/favicon.png",
    apple: "/brand/favicon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={`${display.variable} ${jetbrains.variable} dark h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col bg-background font-sans text-foreground">
        <a
          href="#site-content"
          className="skip-link"
        >
          Saltar al contenido
        </a>
        <ClerkProvider appearance={clerkAppearance}>
          <Providers>
            <div className="relative z-10 flex min-h-full flex-1 flex-col">
              <Navbar />
              <main id="site-content" className="flex-1" tabIndex={-1}>
                {children}
              </main>
              <Footer />
            </div>
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}
