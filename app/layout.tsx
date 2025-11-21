import type { Metadata } from "next";
import { Cinzel, Crimson_Text, Lato } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

const cinzel = Cinzel({ subsets: ["latin"], variable: "--font-cinzel" });
const crimson = Crimson_Text({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-crimson",
});
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-lato",
});

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
      <body className={`${cinzel.variable} ${crimson.variable} ${lato.variable} font-serif`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
