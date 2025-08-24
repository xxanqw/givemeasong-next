import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals-neobrutalist.css";
import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Prevent Font Awesome from adding its CSS automatically since it's being imported above
config.autoAddCss = false;

// Using Inter for secondary text, but primary will be Impact-based from CSS
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "600", "700", "900"]
});

export const metadata: Metadata = {
  title: "GiveMeASong - BRUTAL EDITION",
  description: "Знайди свою улюблену пісню на всіх платформах - BRUTALLY FAST!",
  authors: [{ name: "GiveMeASong Team" }],
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="uk">
      <body className={`${inter.variable} antialiased min-h-screen`}>
        {/* Harsh geometric background pattern */}
        <div className="fixed inset-0 z-[-1]">
          <div className="absolute inset-0 bg-white"></div>
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: `
                linear-gradient(0deg, #000 1px, transparent 1px),
                linear-gradient(90deg, #000 1px, transparent 1px)
              `,
              backgroundSize: '50px 50px'
            }}
          ></div>
          {/* Accent strips */}
          <div className="absolute top-0 left-0 w-full h-2 bg-red-500" style={{ backgroundColor: '#FF0040' }}></div>
          <div className="absolute bottom-0 left-0 w-full h-2 bg-red-500" style={{ backgroundColor: '#FF0040' }}></div>
        </div>

        {/* Main content area */}
        <div className="relative z-10">
          {children}
        </div>

        {/* Angular corner elements */}
        <div className="fixed top-0 right-0 w-16 h-16 bg-black border-4 border-black transform rotate-45 translate-x-8 -translate-y-8 z-20"></div>
        <div className="fixed bottom-0 left-0 w-12 h-12 bg-red-500 border-4 border-black transform rotate-45 -translate-x-6 translate-y-6 z-20" style={{ backgroundColor: '#FF0040' }}></div>
      </body>
    </html>
  );
}
