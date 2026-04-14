import Link from "next/link";

const ADMIN_SECTIONS = [
  {
    href: "/admin/homepage",
    title: "Homepage",
    text: "Update hero image, homepage text, featured items, and quotes.",
  },
  {
    href: "/admin/specials",
    title: "Specials",
    text: "Turn the Sunday special on or off and update the current special.",
  },
  {
    href: "/admin/gallery",
    title: "Gallery",
    text: "Upload and manage gallery photos.",
  },
  {
    href: "/admin/contact",
    title: "Contact",
    text: "Update phone number, address, hours, and holiday note.",
  },
  {
    href: "/admin/menu",
    title: "Menu",
    text: "Edit existing menu item names, prices, descriptions, and visibility.",
  },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Admin Dashboard
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase">
            Grekos Site Control
          </h1>
          <p className="mt-4 max-w-3xl text-zinc-300">
            Choose what you want to update. Keep it simple, save changes, and go.
          </p>
        </div>

        <Link
          href="/"
          className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/15"
        >
          Back to Site
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {ADMIN_SECTIONS.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20 transition hover:bg-white/15"
          >
            <h2 className="text-2xl font-black text-blue-400">{section.title}</h2>
            <p className="mt-3 leading-7 text-zinc-200">{section.text}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
