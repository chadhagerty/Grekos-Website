import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.grekospizzeria.ca"),

  title: {
    default: "Grekos Pizzeria | Gananoque, Ontario",
    template: "%s | Grekos Pizzeria",
  },

  description:
    "Grekos Pizzeria has been serving Gananoque since 1991. View the menu, build your order, get directions, and call Grekos for takeout or delivery.",

  authors: [{ name: "Hagerty Built Co." }],

  keywords: [
    "Grekos Pizzeria",
    "Grekos",
    "Gananoque pizza",
    "pizza Gananoque",
    "Gananoque restaurant",
    "takeout Gananoque",
    "delivery Gananoque",
    "wings Gananoque",
    "poutine Gananoque",
  ],

  applicationName: "Grekos Pizzeria",
  creator: "Grekos Pizzeria",
  publisher: "Grekos Pizzeria",

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "en_CA",
    url: "https://www.grekospizzeria.ca",
    siteName: "Grekos Pizzeria",
    title: "Grekos Pizzeria | Gananoque, Ontario",
    description:
      "Serving Gananoque since 1991. View the menu, build your order, and call Grekos for takeout or delivery.",
    images: [
      {
        url: "/hero.jpg",
        width: 1200,
        height: 630,
        alt: "Grekos Pizzeria food spread",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Grekos Pizzeria | Gananoque, Ontario",
    description:
      "Serving Gananoque since 1991. View the menu, build your order, and call Grekos for takeout or delivery.",
    images: ["/hero.jpg"],
  },

  robots: {
    index: true,
    follow: true,
  },

  category: "restaurant",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
