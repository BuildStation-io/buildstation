import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/Footer";
import { WaterSurface } from "@/components/WaterSurface";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
import { clerkAppearance } from "@/lib/clerkAppearance";
import { SITE_URL } from "@/lib/community";
import "./globals.css";

const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "BuildStation",
    template: "%s · BuildStation",
  },
  description:
    "BuildStation: a community applying AI to AEC-Energy. Team, builders, projects, and a WhatsApp group.",
  applicationName: "BuildStation",
  icons: {
    icon: "/buildstation-mark.png",
    apple: "/buildstation-mark.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${jetbrains.variable} dark h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col bg-background font-sans text-foreground">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-full focus:bg-foreground focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-background"
        >
          Skip to content
        </a>
        <ClerkProvider appearance={clerkAppearance}>
          <Providers>
            <WaterSurface />
            <div className="relative z-10 flex min-h-full flex-1 flex-col">
              <Navbar />
              <main id="content" className="flex-1">
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