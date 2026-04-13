"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/build-order", label: "Build Your Order" },
  { href: "/history", label: "History" },
  { href: "/gallery", label: "Gallery" },
  { href: "/specials", label: "Specials" },
  { href: "/contact", label: "Contact" },
];

const DEFAULT_CONTACT = {
  phone: "(613) 382-1515",
  phone_href: "tel:+16133821515",
};

export default function GrekosHeader() {
  const pathname = usePathname();
  const [contact, setContact] = useState(DEFAULT_CONTACT);

  useEffect(() => {
    async function loadContact() {
      try {
        const response = await fetch("/api/public/contact", {
          cache: "no-store",
        });
        const payload = await response.json();
        setContact({
          phone: payload.phone || DEFAULT_CONTACT.phone,
          phone_href: payload.phone_href || DEFAULT_CONTACT.phone_href,
        });
      } catch (error) {
        console.error("Could not load header contact:", error);
      }
    }

    loadContact();
  }, []);

  return (
    <header className="border-b border-white/10 bg-black/90 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center justify-between gap-4">
          <div>
            <Link href="/" className="text-2xl font-black tracking-wide text-blue-500">
              Grekos Pizzeria
            </Link>
            <div className="text-sm text-zinc-300">Serving Gananoque Since 1991</div>
          </div>

          <a
            href={contact.phone_href}
            className="hidden rounded-full bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-500 sm:inline-block lg:hidden"
          >
            Call Now
          </a>
        </div>

        <div className="flex flex-col gap-3 lg:items-end">
          <a
            href={contact.phone_href}
            className="hidden text-sm font-bold text-blue-400 hover:text-blue-300 lg:block"
          >
            {contact.phone}
          </a>

          <nav className="flex flex-wrap gap-2">
            {NAV_ITEMS.map((item) => {
              const active = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    active
                      ? "bg-blue-600 text-white"
                      : "bg-white/5 text-zinc-200 hover:bg-white/10"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
