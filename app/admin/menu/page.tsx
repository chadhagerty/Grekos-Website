"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type MenuAdminItem = {
  id: number;
  category_key: string;
  sort_order: number;
  name: string;
  price: string;
  description: string;
  popular: boolean;
  is_active: boolean;
};

type PizzaAdminRow = {
  id: number;
  sort_order: number;
  name: string;
  description: string;
  small: string;
  medium: string;
  large: string;
  x_large: string;
  popular: boolean;
  is_active: boolean;
};

type SauceDipAdminRow = {
  id: number;
  sort_order: number;
  name: string;
  price: string;
  is_active: boolean;
};

const CATEGORY_LABELS: Record<string, string> = {
  "grekos-burgers": "Grekos Burgers",
  "the-roadhouse-burgers": "The Roadhouse Burgers",
  "deep-fried": "Deep Fried",
  "baked-dishes": "Baked Dishes",
  "grekos-wraps": "Grekos Wraps",
  "grekos-pitas": "Grekos Pitas",
  "submarine-sandwiches": "Submarine Sandwiches",
  salads: "Salads",
  "chicken-wings": "Chicken Wings",
  beverages: "Beverages",
};

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<MenuAdminItem[]>([]);
  const [pizzaRows, setPizzaRows] = useState<PizzaAdminRow[]>([]);
  const [sauceDips, setSauceDips] = useState<SauceDipAdminRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [errorText, setErrorText] = useState("");
  const [openSection, setOpenSection] = useState<string>("pizza");

  useEffect(() => {
    async function loadMenu() {
      try {
        const response = await fetch("/api/admin/menu", {
          method: "GET",
          cache: "no-store",
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error || "Could not load menu editor.");
        }

        setMenuItems(payload.menuItems ?? []);
        setPizzaRows(payload.pizzaRows ?? []);
        setSauceDips(payload.sauceDips ?? []);
      } catch (error) {
        console.error(error);
        setErrorText(error instanceof Error ? error.message : "Could not load menu editor.");
      } finally {
        setLoading(false);
      }
    }

    loadMenu();
  }, []);

  const groupedItems = useMemo(() => {
    const groups = new Map<string, MenuAdminItem[]>();

    for (const item of menuItems) {
      if (!groups.has(item.category_key)) {
        groups.set(item.category_key, []);
      }
      groups.get(item.category_key)!.push(item);
    }

    return Array.from(groups.entries()).map(([categoryKey, items]) => ({
      categoryKey,
      label: CATEGORY_LABELS[categoryKey] ?? categoryKey,
      items: [...items].sort((a, b) => a.sort_order - b.sort_order),
    }));
  }, [menuItems]);

  function updateMenuItem(id: number, patch: Partial<MenuAdminItem>) {
    setMenuItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...patch } : item)));
    setStatusText("");
    setErrorText("");
  }

  function updatePizzaRow(id: number, patch: Partial<PizzaAdminRow>) {
    setPizzaRows((prev) => prev.map((row) => (row.id === id ? { ...row, ...patch } : row)));
    setStatusText("");
    setErrorText("");
  }

  function updateSauceDip(id: number, patch: Partial<SauceDipAdminRow>) {
    setSauceDips((prev) => prev.map((dip) => (dip.id === id ? { ...dip, ...patch } : dip)));
    setStatusText("");
    setErrorText("");
  }

  async function handleSave() {
    setSaving(true);
    setStatusText("");
    setErrorText("");

    try {
      const response = await fetch("/api/admin/menu", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          menuItems,
          pizzaRows,
          sauceDips,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Could not save menu changes.");
      }

      setMenuItems(payload.menuItems ?? menuItems);
      setPizzaRows(payload.pizzaRows ?? pizzaRows);
      setSauceDips(payload.sauceDips ?? sauceDips);
      setStatusText("Menu updated successfully.");
    } catch (error) {
      console.error(error);
      setErrorText(error instanceof Error ? error.message : "Could not save menu changes.");
    } finally {
      setSaving(false);
    }
  }

  function toggleSection(key: string) {
    setOpenSection((prev) => (prev === key ? "" : key));
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/15 bg-white/10 p-8 text-zinc-200 shadow-lg shadow-black/20">
        Loading menu editor...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Admin
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase">Menu</h1>
          <p className="mt-4 max-w-3xl text-zinc-300">
            Edit pizza pricing, regular menu items, and sauces/dips in one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/dashboard"
            className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/15"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/menu"
            className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/15"
          >
            View Live Page
          </Link>
        </div>
      </div>

      {statusText ? (
        <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
          {statusText}
        </div>
      ) : null}

      {errorText ? (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
          {errorText}
        </div>
      ) : null}

      <section className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20">
        <button
          onClick={() => toggleSection("pizza")}
          className="flex w-full items-center justify-between gap-4 text-left"
        >
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Pizza Pricing
            </div>
            <div className="mt-2 text-sm text-zinc-300">{pizzaRows.length} rows</div>
          </div>
          <div className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm font-bold text-white">
            {openSection === "pizza" ? "Hide" : "Show"}
          </div>
        </button>

        {openSection === "pizza" ? (
          <div className="mt-6 space-y-5">
            {pizzaRows
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((row) => (
                <div
                  key={row.id}
                  className="rounded-2xl border border-white/15 bg-black/30 p-4"
                >
                  <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-zinc-200">Name</label>
                      <input
                        type="text"
                        value={row.name}
                        onChange={(e) => updatePizzaRow(row.id, { name: e.target.value })}
                        className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-zinc-200">
                        Description
                      </label>
                      <input
                        type="text"
                        value={row.description}
                        onChange={(e) =>
                          updatePizzaRow(row.id, { description: e.target.value })
                        }
                        className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-zinc-200">Small</label>
                      <input
                        type="text"
                        value={row.small}
                        onChange={(e) => updatePizzaRow(row.id, { small: e.target.value })}
                        className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-zinc-200">Medium</label>
                      <input
                        type="text"
                        value={row.medium}
                        onChange={(e) => updatePizzaRow(row.id, { medium: e.target.value })}
                        className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-zinc-200">Large</label>
                      <input
                        type="text"
                        value={row.large}
                        onChange={(e) => updatePizzaRow(row.id, { large: e.target.value })}
                        className="w-full rounded-2xl border borderwhite/15 bg-black/30 px-4 py-3 text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-zinc-200">
                        X-Large
                      </label>
                      <input
                        type="text"
                        value={row.x_large}
                        onChange={(e) => updatePizzaRow(row.id, { x_large: e.target.value })}
                        className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-6">
                    <label className="flex items-center gap-3 text-white">
                      <input
                        type="checkbox"
                        checked={row.popular}
                        onChange={(e) =>
                          updatePizzaRow(row.id, { popular: e.target.checked })
                        }
                      />
                      <span className="font-bold">Popular</span>
                    </label>

                    <label className="flex items-center gap-3 text-white">
                      <input
                        type="checkbox"
                        checked={row.is_active}
                        onChange={(e) =>
                          updatePizzaRow(row.id, { is_active: e.target.checked })
                        }
                      />
                      <span className="font-bold">Visible on site</span>
                    </label>
                  </div>
                </div>
              ))}
          </div>
        ) : null}
      </section>

      {groupedItems.map((group) => (
        <section
          key={group.categoryKey}
          className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20"
        >
          <button
            onClick={() => toggleSection(group.categoryKey)}
            className="flex w-full items-center justify-between gap-4 text-left"
          >
            <div>
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                {group.label}
              </div>
              <div className="mt-2 text-sm text-zinc-300">{group.items.length} items</div>
            </div>
            <div className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm font-bold text-white">
              {openSection === group.categoryKey ? "Hide" : "Show"}
            </div>
          </button>

          {openSection === group.categoryKey ? (
            <div className="mt-6 space-y-5">
              {group.items.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-white/15 bg-black/30 p-4"
                >
                  <div className="grid gap-4 lg:grid-cols-[1fr_160px]">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-zinc-200">
                        Item name
                      </label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updateMenuItem(item.id, { name: e.target.value })}
                        className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-zinc-200">Price</label>
                      <input
                        type="text"
                        value={item.price}
                        onChange={(e) => updateMenuItem(item.id, { price: e.target.value })}
                        className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="mb-2 block text-sm font-bold text-zinc-200">
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={item.description}
                      onChange={(e) =>
                        updateMenuItem(item.id, { description: e.target.value })
                      }
                      className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-6">
                    <label className="flex items-center gap-3 text-white">
                      <input
                        type="checkbox"
                        checked={item.popular}
                        onChange={(e) =>
                          updateMenuItem(item.id, { popular: e.target.checked })
                        }
                      />
                      <span className="font-bold">Popular</span>
                    </label>

                    <label className="flex items-center gap-3 text-white">
                      <input
                        type="checkbox"
                        checked={item.is_active}
                        onChange={(e) =>
                          updateMenuItem(item.id, { is_active: e.target.checked })
                        }
                      />
                      <span className="font-bold">Visible on site</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ))}

      <section className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20">
        <button
          onClick={() => toggleSection("dips")}
          className="flex w-full items-center justify-between gap-4 text-left"
        >
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Sauces & Dips
            </div>
            <div className="mt-2 text-sm text-zinc-300">{sauceDips.length} items</div>
          </div>
          <div className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm font-bold text-white">
            {openSection === "dips" ? "Hide" : "Show"}
          </div>
        </button>

        {openSection === "dips" ? (
          <div className="mt-6 space-y-4">
            {sauceDips
              .sort((a, b) => a.sort_order - b.sort_order)
              .map((dip) => (
                <div
                  key={dip.id}
                  className="rounded-2xl border border-white/15 bg-black/30 p-4"
                >
                  <div className="grid gap-4 lg:grid-cols-[1fr_160px_auto] lg:items-center">
                    <div>
                      <label className="mb-2 block text-sm font-bold text-zinc-200">Name</label>
                      <input
                        type="text"
                        value={dip.name}
                        onChange={(e) => updateSauceDip(dip.id, { name: e.target.value })}
                        className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-bold text-zinc-200">Price</label>
                      <input
                        type="text"
                        value={dip.price}
                        onChange={(e) => updateSauceDip(dip.id, { price: e.target.value })}
                        className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                      />
                    </div>

                    <label className="flex items-center gap-3 text-white lg:mt-7">
                      <input
                        type="checkbox"
                        checked={dip.is_active}
                        onChange={(e) =>
                          updateSauceDip(dip.id, { is_active: e.target.checked })
                        }
                      />
                      <span className="font-bold">Visible on site</span>
                    </label>
                  </div>
                </div>
              ))}
          </div>
        ) : null}
      </section>

      <div className="sticky bottom-4 z-20">
        <div className="rounded-3xl border border-white/15 bg-slate-950/95 p-4 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="text-sm text-zinc-300">Save all menu changes when ready.</div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save All Changes"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
