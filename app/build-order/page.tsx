import type { Metadata } from "next";
import GrekosFooter from "../components/GrekosFooter";
import GrekosHeader from "../components/GrekosHeader";
import OrderBuilder from "../components/OrderBuilder";
import { createSupabaseServerClient } from "../../lib/supabase-server";

export const metadata: Metadata = {
  title: "Build Your Order",
  description:
    "Build your Grekos order online, review your total, and call to place your takeout or delivery order in Gananoque.",
  alternates: {
    canonical: "/build-order",
  },
};

export default async function BuildOrderPage() {
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
    console.error("Could not load special for build-order page:", error);
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <GrekosHeader />

      <section className="border-b border-white/10 bg-black/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Build Your Order
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase md:text-5xl">
            Pick your items, get your total, then call to order
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-zinc-200">
            Build your order here, review the estimated total, then call Grekos to place it.
            No online checkout. No payment headaches. Just a faster, easier phone order.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <div className="mb-8 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 text-sm text-blue-100 shadow-lg shadow-black/20">
          Prices shown here are estimates before any phone-call adjustments, special requests,
          or changing daily offers.
        </div>

        <OrderBuilder activeSpecial={activeSpecial} />
      </section>

      <GrekosFooter />
    </main>
  );
}
