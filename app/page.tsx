import type { Metadata } from "next";
import Link from "next/link";
import GrekosHeader from "./components/GrekosHeader";
import GrekosFooter from "./components/GrekosFooter";
import { createSupabaseServerClient } from "../lib/supabase-server";
import { CONTACT_DEFAULTS, HOMEPAGE_DEFAULTS } from "../lib/grekos-defaults";

export const metadata: Metadata = {
  title: "Gananoque Pizza, Takeout & Delivery",
  description:
    "Serving Gananoque since 1991. Family-owned pizza, wings, poutine, salads, takeout, and delivery from Grekos Pizzeria.",
  alternates: {
    canonical: "/",
  },
};

const FALLBACK_FEATURED_ITEMS = [
  {
    title: HOMEPAGE_DEFAULTS.featured_item_1_title,
    text: HOMEPAGE_DEFAULTS.featured_item_1_text,
  },
  {
    title: HOMEPAGE_DEFAULTS.featured_item_2_title,
    text: HOMEPAGE_DEFAULTS.featured_item_2_text,
  },
  {
    title: HOMEPAGE_DEFAULTS.featured_item_3_title,
    text: HOMEPAGE_DEFAULTS.featured_item_3_text,
  },
  {
    title: HOMEPAGE_DEFAULTS.featured_item_4_title,
    text: HOMEPAGE_DEFAULTS.featured_item_4_text,
  },
];

const FALLBACK_REVIEWS = [
  HOMEPAGE_DEFAULTS.quote_1,
  HOMEPAGE_DEFAULTS.quote_2,
  HOMEPAGE_DEFAULTS.quote_3,
];

export default async function HomePage() {
  let homepage = HOMEPAGE_DEFAULTS;
  let contact = CONTACT_DEFAULTS;
  let activeSpecial: {
    title: string;
    body: string;
    price_text: string;
    image_url: string;
  } | null = null;

  try {
    const supabase = await createSupabaseServerClient();

    const [{ data: homepageData }, { data: contactData }, { data: specialsData }] =
      await Promise.all([
        supabase.from("homepage_content").select("*").eq("id", 1).single(),
        supabase.from("contact_content").select("*").eq("id", 1).single(),
        supabase.from("specials_content").select("*").eq("id", 1).single(),
      ]);

    if (homepageData) {
      homepage = {
        ...HOMEPAGE_DEFAULTS,
        ...homepageData,
      };
    }

    if (contactData) {
      contact = {
        ...CONTACT_DEFAULTS,
        ...contactData,
      };
    }

    if (specialsData?.enabled) {
      activeSpecial = {
        title: specialsData.title || "Sunday Special",
        body: specialsData.body || "",
        price_text: specialsData.price_text || "",
        image_url: specialsData.image_url || "",
      };
    }
  } catch (error) {
    console.error("Could not load homepage/contact/specials content:", error);
  }

  const featuredItems = [
    {
      title: homepage.featured_item_1_title,
      text: homepage.featured_item_1_text,
    },
    {
      title: homepage.featured_item_2_title,
      text: homepage.featured_item_2_text,
    },
    {
      title: homepage.featured_item_3_title,
      text: homepage.featured_item_3_text,
    },
    {
      title: homepage.featured_item_4_title,
      text: homepage.featured_item_4_text,
    },
  ].filter((item) => item.title && item.text);

  const reviews = [homepage.quote_1, homepage.quote_2, homepage.quote_3].filter(Boolean);

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <GrekosHeader />

      <section className="relative overflow-hidden border-b border-white/10 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-800">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:items-center md:py-24">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.25em] text-blue-400">
              Gananoque • Ontario
            </p>
            <h1 className="text-4xl font-black uppercase leading-tight md:text-6xl">
              {homepage.hero_headline}
            </h1>
            <p className="mt-5 max-w-xl text-lg text-zinc-200">
              {homepage.hero_subtext}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/menu"
                className="rounded-full bg-blue-600 px-6 py-3 font-bold text-white transition hover:bg-blue-500"
              >
                View Menu
              </Link>

              <a
                href={contact.phone_href}
                className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/15"
              >
                Call Now
              </a>

              <a
                href="https://www.google.com/maps/search/?api=1&query=Grekos+Pizzeria+Gananoque+Ontario"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-bold text-white transition hover:bg-white/15"
              >
                Get Directions
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-4 shadow-2xl shadow-black/30">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={homepage.hero_image_url || "/hero.jpg"}
                alt="Grekos Pizza food spread"
                className="h-[260px] w-full object-cover md:h-[360px]"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Customer Favourites
            </p>
            <h2 className="text-3xl font-black">What people come back for</h2>
          </div>
          <Link href="/menu" className="text-sm font-bold text-blue-400 hover:text-blue-300">
            Full Menu →
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {(featuredItems.length ? featuredItems : FALLBACK_FEATURED_ITEMS).map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-white/15 bg-white/10 p-5 shadow-lg shadow-black/20"
            >
              <h3 className="text-xl font-bold text-white">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-200">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-white/10 bg-white/5">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Our Story
            </p>
            <h2 className="mt-2 text-3xl font-black">A Gananoque staple since 1991</h2>
            <p className="mt-4 max-w-2xl text-zinc-200">
              For over 30 years, Grekos Pizzeria has been serving Gananoque with
              generous portions, dependable takeout and delivery, and the kind of
              food people know they can count on.
            </p>
            <p className="mt-4 max-w-2xl text-zinc-200">
              Proudly local and rooted in the heart of downtown, Grekos has earned
              its reputation through consistency, familiarity, and community loyalty.
            </p>
            <Link
              href="/history"
              className="mt-6 inline-block rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/15"
            >
              Read the History
            </Link>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20">
            <h3 className="text-lg font-bold">Hours & Contact</h3>
            <div className="mt-4 space-y-2 text-sm text-zinc-200">
              <p>{contact.address_line_1}</p>
              <p>{contact.address_line_2}</p>
              <a href={contact.phone_href} className="block font-bold text-white hover:text-blue-400">
                {contact.phone}
              </a>
            </div>

            <div className="mt-6 space-y-2">
              {[
                { day: "Monday", hours: contact.monday_hours },
                { day: "Tuesday", hours: contact.tuesday_hours },
                { day: "Wednesday", hours: contact.wednesday_hours },
              ].map((item) => (
                <div key={item.day} className="flex justify-between text-sm text-zinc-200">
                  <span>{item.day}</span>
                  <span>{item.hours}</span>
                </div>
              ))}
            </div>

            <Link
              href="/contact"
              className="mt-6 inline-block text-sm font-bold text-blue-400 hover:text-blue-300"
            >
              View full hours & contact →
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
          Sunday Special
        </p>
        <h2 className="mt-2 text-3xl font-black">
          {activeSpecial ? "This Week’s Sunday Special" : "Keep checking for the next Sunday special"}
        </h2>

        <div className="mt-8 rounded-3xl border border-blue-400/20 bg-blue-500/10 p-6 shadow-lg shadow-black/20">
          <div className="text-xl font-black text-white">
            {activeSpecial ? activeSpecial.title : "No regular meal deals"}
          </div>

          {activeSpecial?.price_text ? (
            <div className="mt-2 text-lg font-black text-white">{activeSpecial.price_text}</div>
          ) : null}

          <p className="mt-3 max-w-3xl text-zinc-200">
            {activeSpecial
              ? activeSpecial.body
              : "Grekos keeps it simple. No standing combo menu, no constant discounts — just watch for the occasional Sunday special."}
          </p>

          {activeSpecial?.image_url ? (
            <div className="mt-5 overflow-hidden rounded-2xl border border-white/15 bg-black/20">
              <img
                src={activeSpecial.image_url}
                alt={activeSpecial.title}
                className="h-[180px] w-full object-cover"
              />
            </div>
          ) : null}

          <Link
            href="/specials"
            className="mt-5 inline-block rounded-full bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-500"
          >
            Check Sunday Special Page
          </Link>
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/5">
        <div className="mx-auto max-w-6xl px-4 py-14">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            What People Say
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {(reviews.length ? reviews : FALLBACK_REVIEWS).map((quote) => (
              <div
                key={quote}
                className="rounded-2xl border border-white/15 bg-white/10 p-5 text-zinc-100 shadow-lg shadow-black/20"
              >
                “{quote}”
              </div>
            ))}
          </div>
        </div>
      </section>

      <GrekosFooter />
    </main>
  );
}
