import type { Metadata } from "next";
import GrekosFooter from "../components/GrekosFooter";
import GrekosHeader from "../components/GrekosHeader";
import { createSupabaseServerClient } from "../../lib/supabase-server";
import { CONTACT_DEFAULTS } from "../../lib/grekos-defaults";
import { cinzel } from "../layout";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Call Grekos Pizzeria, get directions, and view restaurant hours for Grekos in Gananoque, Ontario.",
  alternates: {
    canonical: "/contact",
  },
};

export default async function ContactPage() {
  let contact = CONTACT_DEFAULTS;

  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("contact_content")
      .select("*")
      .eq("id", 1)
      .single();

    if (!error && data) {
      contact = {
        ...CONTACT_DEFAULTS,
        ...data,
      };
    }
  } catch (error) {
    console.error("Could not load contact content:", error);
  }

  const hours = [
    { day: "Monday", hours: contact.monday_hours },
    { day: "Tuesday", hours: contact.tuesday_hours },
    { day: "Wednesday", hours: contact.wednesday_hours },
    { day: "Thursday", hours: contact.thursday_hours },
    { day: "Friday", hours: contact.friday_hours },
    { day: "Saturday", hours: contact.saturday_hours },
    { day: "Sunday", hours: contact.sunday_hours },
  ];

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <GrekosHeader />

      <section className="border-b border-white/10 bg-black/40">
        <div className="mx-auto max-w-5xl px-4 py-16 md:py-20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Contact
          </p>
          <h1 className={`${cinzel.className} mt-3 text-4xl font-black uppercase md:text-5xl`}>
            Visit or Call Grekos
          </h1>
          <p className="mt-5 max-w-2xl text-lg text-zinc-200">
            Call ahead for takeout or delivery, or stop by and order in person.
            Grekos has been serving Gananoque since 1991.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-14 md:grid-cols-2">
        <div className="space-y-6">
          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20">
            <h2 className={`${cinzel.className} text-xl font-black text-blue-400`}>Phone</h2>
            <a
              href={contact.phone_href}
              className="mt-3 block text-2xl font-bold text-white hover:text-blue-400"
            >
              {contact.phone}
            </a>

            <div className="mt-4 flex gap-3">
              <a
                href={contact.phone_href}
                className="rounded-full bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-500"
              >
                Call Now
              </a>
            </div>
          </div>

          <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20">
            <h2 className={`${cinzel.className} text-xl font-black text-blue-400`}>Address</h2>
            <p className="mt-3 text-zinc-200">
              {contact.address_line_1}
              <br />
              {contact.address_line_2}
            </p>

            <a
              href="https://www.google.com/maps/search/?api=1&query=Grekos+Pizzeria+Gananoque+Ontario"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-block rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/15"
            >
              Get Directions
            </a>
          </div>
        </div>

        <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20">
          <h2 className={`${cinzel.className} text-xl font-black text-blue-400`}>Hours</h2>

          <div className="mt-6 space-y-3 text-zinc-200">
            {hours.map((item) => (
              <div key={item.day} className="flex justify-between gap-4">
                <span>{item.day}</span>
                <span>{item.hours}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 text-sm text-blue-100">
            {contact.holiday_note}
          </div>
        </div>
      </section>

      <GrekosFooter />
    </main>
  );
}
