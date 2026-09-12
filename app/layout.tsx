import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { Footer } from "@/components/Footer";
import { GooCursor } from "@/components/GooCursor";
import { Navbar } from "@/components/Navbar";
import { Providers } from "@/components/Providers";
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
  title: {
    default: "BuildStation",
    template: "%s · BuildStation",
  },
  description:
    "BuildStation — a network of builders shipping in public. Open-source portfolio, events, and GitHub login.",
  applicationName: "BuildStation",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${jetbrains.variable} dark h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-background font-sans text-foreground">
        <ClerkProvider
          appearance={{
            variables: {
              colorBackground: "#0a0a0a",
              colorForeground: "#f5f5f5",
              colorPrimary: "#f5f5f5",
              colorInputBackground: "#111111",
              borderRadius: "0.75rem",
            },
          }}
        >
          <Providers>
            <GooCursor />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </Providers>
        </ClerkProvider>
      </body>
    </html>
  );
}