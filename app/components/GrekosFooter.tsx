"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const DEFAULT_CONTACT = {
  phone: "(613) 382-1515",
  phone_href: "tel:+16133821515",
  address_line_1: "87 King Street East",
  address_line_2: "Gananoque, Ontario",
};

export default function GrekosFooter() {
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
          address_line_1: payload.address_line_1 || DEFAULT_CONTACT.address_line_1,
          address_line_2: payload.address_line_2 || DEFAULT_CONTACT.address_line_2,
        });
      } catch (error) {
        console.error("Could not load footer contact:", error);
      }
    }

    loadContact();
  }, []);

  return (
    <footer className="border-t border-white/10 bg-black text-white">
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 md:grid-cols-3">
        <div>
          <div className="text-xl font-black text-blue-500">Grekos Pizzeria</div>
          <p className="mt-2 text-sm text-zinc-300">Serving Gananoque Since 1991</p>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
            Contact
          </h3>
          <p className="text-sm text-zinc-200">{contact.address_line_1}</p>
          <p className="text-sm text-zinc-200">{contact.address_line_2}</p>
          <a
            href={contact.phone_href}
            className="mt-2 block text-sm font-semibold text-white hover:text-blue-400"
          >
            {contact.phone}
          </a>
        </div>

        <div>
          <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-zinc-400">
            Explore
          </h3>
          <div className="flex flex-col gap-2 text-sm">
            <Link href="/history" className="text-zinc-200 hover:text-blue-400">
              Read Our Story
            </Link>
            <Link href="/menu" className="text-zinc-200 hover:text-blue-400">
              View Menu
            </Link>
            <Link href="/contact" className="text-zinc-200 hover:text-blue-400">
              Contact
            </Link>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 px-4 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-4 text-center">
          <p className="text-sm text-zinc-400">
            © {new Date().getFullYear()} Grekos Pizzeria
          </p>

          <div className="flex flex-col items-center">
            <div className="text-[11px] font-bold uppercase tracking-[0.32em] text-blue-400">
              Designed By
            </div>

            <div className="mt-3 flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-blue-400 bg-[#0f2347] text-4xl font-black text-white shadow-[0_0_24px_rgba(59,130,246,0.18)]">
              <span>
                H<span className="text-blue-300">B</span>
              </span>
            </div>

            <div className="mt-4 text-2xl font-black uppercase leading-none tracking-tight text-white">
              Hagerty
            </div>
            <div className="text-2xl font-black uppercase leading-none tracking-tight text-white">
              Built Co.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
