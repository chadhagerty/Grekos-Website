import type { Metadata } from "next";
import "./globals.css";
import { Cinzel, Inter } from "next/font/google";

export const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.grekos.ca"),
  title: {
    default: "Grekos Pizzeria",
    template: "%s | Grekos Pizzeria",
  },
  description:
    "Family-owned pizza, takeout, delivery, wings, burgers, poutine, and more in Gananoque, Ontario.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
