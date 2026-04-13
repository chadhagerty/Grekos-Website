import type { Metadata } from "next";
import GrekosFooter from "../components/GrekosFooter";
import GrekosHeader from "../components/GrekosHeader";
import { createSupabaseServerClient } from "../../lib/supabase-server";

export const metadata: Metadata = {
  title: "Sunday Special",
  description:
    "Check the latest Sunday special at Grekos Pizzeria in Gananoque, Ontario.",
  alternates: {
    canonical: "/specials",
  },
};

const FALLBACK_SPECIAL = {
  enabled: false,
  title: "No Sunday special posted right now",
  body: "Keep checking back for the next Sunday special. If Grekos is running one, it will be posted here.",
  price_text: "",
  button_text: "View Full Menu",
  image_url: "",
};

export default async function SpecialsPage() {
  let special = FALLBACK_SPECIAL;

  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("specials_content")
      .select("*")
      .eq("id", 1)
      .single();

    if (!error && data) {
      special = {
        enabled: Boolean(data.enabled),
        title: data.title || FALLBACK_SPECIAL.title,
        body: data.body || FALLBACK_SPECIAL.body,
        price_text: data.price_text || "",
        button_text: data.button_text || FALLBACK_SPECIAL.button_text,
        image_url: data.image_url || "",
      };
    }
  } catch (error) {
    console.error("Could not load specials content:", error);
  }

  const heading = special.enabled
    ? "Current Sunday Special"
    : "Check back for the next one";

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <GrekosHeader />

      <section className="border-b border-white/10 bg-black/40">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Sunday Special
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase md:text-5xl">
            {heading}
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-zinc-200">
            Grekos does not run constant combo deals or everyday meal specials.
            When there is something worth posting, this is where it will be.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="rounded-3xl border border-blue-400/20 bg-blue-500/10 p-8 shadow-lg shadow-black/20">
          <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Current Status
          </div>

          <div className="mt-3 text-3xl font-black">{special.title}</div>

          {special.price_text ? (
            <div className="mt-3 text-xl font-black text-white">
              {special.price_text}
            </div>
          ) : null}

          <p className="mt-5 max-w-3xl text-zinc-200">{special.body}</p>

          {special.image_url ? (
  <div className="mt-4 overflow-hidden rounded-2xl border border-white/15 bg-black/20">
    <img
      src={special.image_url}
      alt={special.title}
      className="h-[180px] w-full object-cover"
    />
  </div>
) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="tel:+16133821515"
              className="rounded-full bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500"
            >
              Call Grekos
            </a>

            <a
              href="/menu"
              className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/15"
            >
              {special.button_text || "View Full Menu"}
            </a>
          </div>
        </div>
      </section>

      <GrekosFooter />
    </main>
  );
}
