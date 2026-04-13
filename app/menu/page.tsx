import type { Metadata } from "next";
import GrekosFooter from "../components/GrekosFooter";
import GrekosHeader from "../components/GrekosHeader";
import {
  MENU_CATEGORIES,
  PIZZA_NOTES,
  PIZZA_PRICE_ROWS,
  SAUCE_DIPS,
} from "../../lib/grekos-menu-data";
import { createSupabaseServerClient } from "../../lib/supabase-server";

export const metadata: Metadata = {
  title: "Menu",
  description:
    "View the Grekos Pizzeria menu including pizza, wings, burgers, poutine, wraps, subs, salads, and drinks in Gananoque, Ontario.",
  alternates: {
    canonical: "/menu",
  },
};

export default async function MenuPage() {
  let activeSpecial: {
    title: string;
    body: string;
    price_text: string;
    image_url: string;
  } | null = null;

  try {
    const supabase = await createSupabaseServerClient();

    const { data } = await supabase
      .from("specials_content")
      .select("*")
      .eq("id", 1)
      .single();

    if (data?.enabled) {
      activeSpecial = {
        title: data.title || "Sunday Special",
        body: data.body || "",
        price_text: data.price_text || "",
        image_url: data.image_url || "",
      };
    }
  } catch (error) {
    console.error("Could not load special for menu page:", error);
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <GrekosHeader />

      <section className="border-b border-white/10 bg-black/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Menu
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase md:text-5xl">
            Our Menu
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-zinc-200">
            Original recipes and customer favorites
          </p>
        </div>
      </section>

      {activeSpecial ? (
        <section className="mx-auto max-w-6xl px-4 pt-14">
          <div className="rounded-3xl border border-blue-400/20 bg-blue-500/10 p-6 shadow-lg shadow-black/20">
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Sunday Special
            </div>
            <h2 className="mt-2 text-2xl font-black text-white">{activeSpecial.title}</h2>

            {activeSpecial.price_text ? (
              <div className="mt-2 text-lg font-black text-white">{activeSpecial.price_text}</div>
            ) : null}

            <p className="mt-4 text-zinc-100">{activeSpecial.body}</p>

            {activeSpecial.image_url ? (
              <div className="mt-5 overflow-hidden rounded-2xl border border-white/15 bg-black/20">
                <img
                  src={activeSpecial.image_url}
                  alt={activeSpecial.title}
                  className="max-h-[280px] w-full object-cover"
                />
              </div>
            ) : null}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                Grekos Famous Pizza
              </p>
              <h2 className="mt-2 text-3xl font-black">Pizza Pricing</h2>
            </div>
            <div className="text-sm text-zinc-300">
              Small • Medium • Large • X-Large
            </div>
          </div>

          {/* MOBILE PIZZA CARDS */}
          <div className="space-y-4 md:hidden">
            {PIZZA_PRICE_ROWS.map((row) => (
              <div
                key={row.name}
                className="rounded-2xl border border-white/15 bg-black/30 p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <div className="text-lg font-bold text-white">{row.name}</div>
                  {row.popular ? (
                    <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                      Popular
                    </span>
                  ) : null}
                </div>

                {row.description ? (
                  <div className="mt-2 text-sm text-zinc-300">{row.description}</div>
                ) : null}

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs uppercase tracking-wider text-zinc-400">Small</div>
                    <div className="mt-1 text-lg font-black text-white">{row.small}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs uppercase tracking-wider text-zinc-400">Medium</div>
                    <div className="mt-1 text-lg font-black text-white">{row.medium}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs uppercase tracking-wider text-zinc-400">Large</div>
                    <div className="mt-1 text-lg font-black text-white">{row.large}</div>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-xs uppercase tracking-wider text-zinc-400">X-Large</div>
                    <div className="mt-1 text-lg font-black text-white">{row.xLarge}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* DESKTOP TABLE */}
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-full border-separate border-spacing-y-3">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider text-zinc-400">
                  <th className="px-4 py-2">Pizza</th>
                  <th className="px-4 py-2">Small</th>
                  <th className="px-4 py-2">Medium</th>
                  <th className="px-4 py-2">Large</th>
                  <th className="px-4 py-2">X-Large</th>
                </tr>
              </thead>
              <tbody>
                {PIZZA_PRICE_ROWS.map((row) => (
                  <tr key={row.name} className="rounded-2xl bg-black/30">
                    <td className="rounded-l-2xl px-4 py-4 align-top">
                      <div className="flex flex-wrap items-center gap-2">
                        <div className="font-bold text-white">{row.name}</div>
                        {row.popular ? (
                          <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                            Popular
                          </span>
                        ) : null}
                      </div>
                      {row.description ? (
                        <div className="mt-1 text-sm text-zinc-300">{row.description}</div>
                      ) : null}
                    </td>
                    <td className="px-4 py-4 font-black text-white">{row.small}</td>
                    <td className="px-4 py-4 font-black text-white">{row.medium}</td>
                    <td className="px-4 py-4 font-black text-white">{row.large}</td>
                    <td className="rounded-r-2xl px-4 py-4 font-black text-white">
                      {row.xLarge}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-2 rounded-2xl border border-white/15 bg-black/30 p-5">
            {PIZZA_NOTES.map((note) => (
              <p key={note} className="text-sm text-zinc-200">
                {note}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="space-y-6">
          {MENU_CATEGORIES.map((category) => (
            <div
              key={category.title}
              className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20"
            >
              <h2 className="text-2xl font-black text-blue-400">{category.title}</h2>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                {category.items.map((item, index) => (
                  <div
                    key={`${category.title}-${item.name}-${item.price}-${index}`}
                    className="rounded-2xl border border-white/15 bg-black/30 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-lg font-bold">{item.name}</h3>
                          {item.popular ? (
                            <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                              Popular
                            </span>
                          ) : null}
                        </div>
                        {item.description ? (
                          <p className="mt-2 text-sm text-zinc-200">{item.description}</p>
                        ) : null}
                      </div>

                      <div className="text-lg font-black text-white">{item.price}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-14">
        <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Sauces & Dips
          </p>
          <h2 className="mt-2 text-2xl font-black">Available Extras</h2>
          <div className="mt-5 flex flex-wrap gap-3">
            {SAUCE_DIPS.map((dip) => (
              <span
                key={dip}
                className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm text-zinc-100"
              >
                {dip}
              </span>
            ))}
          </div>
        </div>
      </section>

      <GrekosFooter />
    </main>
  );
}
