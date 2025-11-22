import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "WFRP 4e Manager",
  description: "Character sheet manager for Warhammer Fantasy Roleplay 4th Edition",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans bg-[var(--bg-dark)] text-[var(--text-light)]`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
