import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Better Scrabble - Jeu de Scrabble en ligne",
  description: "Jouez au Scrabble en ligne avec vos amis ou contre l'IA. Interface épurée et intuitive.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.variable} antialiased bg-gray-50`}>
        <div className="min-h-screen pb-16">
          {children}
        </div>
      </body>
    </html>
  );
}
