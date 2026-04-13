import type { Metadata } from "next";
import GrekosFooter from "../components/GrekosFooter";
import GrekosHeader from "../components/GrekosHeader";

export const metadata: Metadata = {
  title: "History",
  description:
    "Learn the history of Grekos Pizzeria, proudly serving Gananoque since 1991.",
  alternates: {
    canonical: "/history",
  },
};

const HISTORY_SECTIONS = [
  {
    title: "Since 1991",
    body: "Grekos Pizzeria has been part of Gananoque since 1991. Built on a simple idea—serve good food, keep portions generous, and give people a place they can count on—it has become a familiar local name over decades of steady service.",
  },
  {
    title: "A Local Favourite in the Heart of Town",
    body: "Located on King Street East, Grekos became more than just a pizza spot. For many people, it turned into part of the weekly routine—an easy choice for takeout, a dependable stop for comfort food, and a place visitors and locals alike came to know.",
  },
  {
    title: "Known for Consistency",
    body: "Long-running businesses earn their reputation the hard way. Grekos built loyalty through consistency: hearty portions, familiar favourites, and the kind of dependable experience that keeps customers coming back.",
  },
  {
    title: "Part of the Community",
    body: "Small-town staples matter. Over the years, Grekos has become part of the texture of Gananoque life—something people remember, recommend, and return to. That kind of connection does not happen by accident.",
  },
  {
    title: "Still Serving Gananoque",
    body: "More than three decades after opening, Grekos still represents the same kind of straightforward value it was known for from the start: good food, real portions, and a commitment to the community it serves.",
  },
];

export default function HistoryPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <GrekosHeader />

      <section className="border-b border-white/10 bg-black/40">
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Our Story
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase md:text-5xl">
            The History of Grekos Pizzeria
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-zinc-200">
            Proudly serving Gananoque since 1991, Grekos Pizzeria has built its
            place in town through consistency, generous portions, and a reputation
            people know they can rely on.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14">
        <div className="mb-4 text-center">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Since 1991
          </p>
          <h2 className="mt-3 text-3xl font-black md:text-4xl">
            Built on tradition, crafted by hand
          </h2>
        </div>

        <div className="mb-3 overflow-hidden rounded-3xl border border-white/15 bg-white/10 shadow-lg shadow-black/20">
          <img
            src="/history.png"
            alt="Historic Grekos pizzaiolo tossing dough"
            className="w-full max-h-[720px] object-contain bg-black/20"
          />
        </div>

        <p className="mb-10 text-center text-sm text-zinc-400">
          Gerry Vavassis — Founder
        </p>

        <div className="space-y-6">
          {HISTORY_SECTIONS.map((section, index) => (
            <div
              key={section.title}
              className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20 md:p-8"
            >
              <div className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                Section {index + 1}
              </div>
              <h2 className="text-2xl font-black md:text-3xl">{section.title}</h2>
              <p className="mt-4 leading-8 text-zinc-200">{section.body}</p>
            </div>
          ))}
        </div>
      </section>

      <GrekosFooter />
    </main>
  );
}
