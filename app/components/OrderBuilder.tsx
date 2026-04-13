"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import OrderSummary from "./OrderSummary";
import PizzaBuilderModal from "./PizzaBuilderModal";
import WingSauceModal from "./WingSauceModal";
import {
  ORDER_CATEGORIES,
  QUICK_EXTRAS,
  calculateSubtotal,
  formatMoney,
  type CartItem,
} from "../../lib/grekos-order-builder";
import { PIZZA_PRICE_ROWS } from "../../lib/grekos-menu-data";

type ActiveSpecial = {
  title: string;
  body: string;
  price_text: string;
  image_url: string;
} | null;

type OrderBuilderProps = {
  activeSpecial?: ActiveSpecial;
};

function makeCartId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function parseSpecialPrice(priceText: string): number | null {
  const match = priceText.match(/(\d+(\.\d{1,2})?)/);
  if (!match) return null;

  const parsed = Number.parseFloat(match[1]);
  return Number.isFinite(parsed) ? parsed : null;
}



export default function OrderBuilder({ activeSpecial = null }: OrderBuilderProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showExtrasModal, setShowExtrasModal] = useState(false);
  const [showFinalTotals, setShowFinalTotals] = useState(false);
  const [showPizzaModal, setShowPizzaModal] = useState(false);
  const [showWingModal, setShowWingModal] = useState(false);
  const [extraNotes, setExtraNotes] = useState("");
  const [openSectionId, setOpenSectionId] = useState<string | null>(null);
  const [showCartModal, setShowCartModal] = useState(false);
  const [lastAddedKey, setLastAddedKey] = useState<string | null>(null);

  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});

  const categories = useMemo(() => ORDER_CATEGORIES, []);
  const subtotal = calculateSubtotal(cartItems);
  const specialPrice = activeSpecial?.price_text ? parseSpecialPrice(activeSpecial.price_text) : null;

 
    const prebuiltPizzas = useMemo(() => PIZZA_PRICE_ROWS.slice(5), []);



  useEffect(() => {
    if (!lastAddedKey) return;

    const timeout = window.setTimeout(() => {
      setLastAddedKey(null);
    }, 900);

    return () => window.clearTimeout(timeout);
  }, [lastAddedKey]);

  function addCartItem(name: string, price: number, category: string, feedbackKey?: string) {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.name === name);

      if (existing) {
        return prev.map((item) =>
          item.name === name ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      return [
        ...prev,
        {
          id: makeCartId(),
          name,
          price,
          quantity: 1,
          category,
        },
      ];
    });

    setLastAddedKey(feedbackKey ?? name);
    setShowFinalTotals(false);
  }

  function increaseQuantity(id: string) {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
    setShowFinalTotals(false);
  }

  function decreaseQuantity(id: string) {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
    setShowFinalTotals(false);
  }

  function removeItem(id: string) {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    setShowFinalTotals(false);
  }

  function openReviewModal() {
    if (cartItems.length === 0) {
      window.alert("Add at least one item first.");
      return;
    }

    setShowExtrasModal(true);
  }

  function finishReview() {
    setShowExtrasModal(false);
    setShowFinalTotals(true);
  }

  function toggleSection(id: string) {
    const nextOpenId = openSectionId === id ? null : id;
    setOpenSectionId(nextOpenId);

    if (nextOpenId) {
      window.setTimeout(() => {
        const el = sectionRefs.current[nextOpenId];
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 90;
          window.scrollTo({ top: y, behavior: "auto" });
        }
      }, 0);
    }
  }

  return (
    <>
      <div className="sticky top-0 z-30 -mx-4 mb-6 border-b border-white/10 bg-slate-900/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.18em] text-blue-400">
              Build Your Order
            </div>
            <div className="text-xs text-zinc-400">
              {cartItems.length} item{cartItems.length === 1 ? "" : "s"}
            </div>
          </div>

          <button
            onClick={() => setShowCartModal(true)}
            className="rounded-full bg-blue-600 px-4 py-2 text-sm font-black text-white hover:bg-blue-500"
          >
            Cart ({cartItems.length})
          </button>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-8">
          {activeSpecial ? (
            <section className="rounded-3xl border border-blue-400/20 bg-blue-500/10 p-6 shadow-lg shadow-black/20">
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

              {specialPrice !== null ? (
                <button
                  onClick={() =>
                    addCartItem(
                      activeSpecial.title,
                      specialPrice,
                      "Sunday Special",
                      "special"
                    )
                  }
                  className={`mt-5 w-full rounded-full px-5 py-3 font-bold text-white transition ${
                    lastAddedKey === "special"
                      ? "bg-green-600"
                      : "bg-blue-600 hover:bg-blue-500"
                  }`}
                >
                  {lastAddedKey === "special" ? "Added ✓" : "Add Sunday Special"}
                </button>
              ) : null}
            </section>
          ) : null}

          <section className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20">
            <div className="mb-4">
              <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                Pizza Favourites
              </div>
              <h2 className="mt-2 text-2xl font-black text-white">Pre-Built Pizzas</h2>
            </div>

            <div className="space-y-4">
              {prebuiltPizzas.map((pizza) => (
                <div
                  key={pizza.name}
                  className="rounded-2xl border border-white/15 bg-black/30 p-4"
                >
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-bold text-white">{pizza.name}</h3>
                    {pizza.popular ? (
                      <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                        Popular
                      </span>
                    ) : null}
                  </div>

                  {pizza.description ? (
                    <p className="mt-2 text-sm leading-6 text-zinc-200">{pizza.description}</p>
                  ) : null}

                  <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                    {[
                      { label: "Small", price: pizza.small },
                      { label: "Medium", price: pizza.medium },
                      { label: "Large", price: pizza.large },
                      { label: "X-Large", price: pizza.xLarge },
                    ].map((sizeOption) => {
                      const numericPrice = Number.parseFloat(
                        String(sizeOption.price).replace(/[^0-9.]/g, "")
                      );
                      const buttonKey = `${pizza.name}-${sizeOption.label}`;

                      return (
                        <button
                          key={buttonKey}
                          onClick={() =>
                            addCartItem(
                              `${sizeOption.label} ${pizza.name}`,
                              numericPrice,
                              "Pizza",
                              buttonKey
                            )
                          }
                          className={`rounded-2xl border px-3 py-3 text-left transition ${
                            lastAddedKey === buttonKey
                              ? "border-green-500/30 bg-green-600 text-white"
                              : "border-white/15 bg-white/10 text-white hover:bg-white/15"
                          }`}
                        >
                          <div className="text-xs uppercase tracking-wide text-zinc-300">
                            {sizeOption.label}
                          </div>
                          <div className="mt-1 text-lg font-black">
                            {lastAddedKey === buttonKey ? "Added ✓" : sizeOption.price}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20">
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowPizzaModal(true)}
                className="rounded-full bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-500"
              >
                Build Your Own Pizza
              </button>

              <button
                onClick={() => setShowWingModal(true)}
                className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/15"
              >
                Add Wings with Sauce
              </button>
            </div>
          </section>

          {categories.map((category) => {
            const isOpen = openSectionId === category.id;

            return (
              <section
                key={category.id}
                ref={(el) => {
                  sectionRefs.current[category.id] = el;
                }}
                className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20"
              >
                <button
                  onClick={() => toggleSection(category.id)}
                  className="flex w-full items-center justify-between gap-4 text-left"
                >
                  <div>
                    <h2 className="text-2xl font-black text-blue-400">{category.title}</h2>
                    <div className="mt-1 text-sm text-zinc-300">
                      {category.items.length} item{category.items.length === 1 ? "" : "s"}
                    </div>
                  </div>

                  <div className="rounded-full border border-white/15 bg-black/30 px-4 py-2 text-sm font-bold text-white">
                    {isOpen ? "Hide" : "Show"}
                  </div>
                </button>

                {isOpen ? (
                  <div className="mt-5 space-y-4">
                    {category.items.map((item) => {
                      const buttonKey = item.id;

                      return (
                        <div
                          key={item.id}
                          className="rounded-2xl border border-white/15 bg-black/30 p-4"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="flex flex-wrap items-center gap-2">
                                <h3 className="text-lg font-bold text-white">{item.name}</h3>
                                {item.popular ? (
                                  <span className="rounded-full bg-blue-600 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                                    Popular
                                  </span>
                                ) : null}
                              </div>

                              {item.description ? (
                                <p className="mt-2 text-sm leading-6 text-zinc-200">
                                  {item.description}
                                </p>
                              ) : null}
                            </div>

                            <div className="text-lg font-black text-white">
                              {formatMoney(item.price)}
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              if (item.requiresWingSauce) {
                                setShowWingModal(true);
                                return;
                              }

                              addCartItem(item.name, item.price, category.title, buttonKey);
                            }}
                            className={`mt-4 w-full rounded-full px-4 py-3 font-bold text-white transition ${
                              lastAddedKey === buttonKey
                                ? "bg-green-600"
                                : "bg-blue-600 hover:bg-blue-500"
                            }`}
                          >
                            {lastAddedKey === buttonKey ? "Added ✓" : "Add to Order"}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                ) : null}
              </section>
            );
          })}
        </div>

        <div className="hidden lg:sticky lg:top-6 lg:block lg:self-start">
          <OrderSummary
            items={cartItems}
            showFinalTotals={showFinalTotals}
            extraNotes={extraNotes}
            onExtraNotesChange={setExtraNotes}
            onIncrease={increaseQuantity}
            onDecrease={decreaseQuantity}
            onRemove={removeItem}
            onReviewAndTotal={openReviewModal}
          />
        </div>
      </div>

      {showCartModal ? (
        <div className="fixed inset-0 z-50 flex items-end bg-black/70 p-0 lg:hidden">
          <div className="max-h-[90vh] w-full overflow-hidden rounded-t-3xl border border-white/15 bg-slate-900 shadow-2xl shadow-black/40">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <div>
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                  Your Order
                </div>
                <div className="text-sm text-zinc-300">
                  {cartItems.length} item{cartItems.length === 1 ? "" : "s"} • {formatMoney(subtotal)}
                </div>
              </div>

              <button
                onClick={() => setShowCartModal(false)}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/15"
              >
                Close
              </button>
            </div>

            <div className="max-h-[calc(90vh-73px)] overflow-y-auto p-4">
              <OrderSummary
                items={cartItems}
                showFinalTotals={showFinalTotals}
                extraNotes={extraNotes}
                onExtraNotesChange={setExtraNotes}
                onIncrease={increaseQuantity}
                onDecrease={decreaseQuantity}
                onRemove={removeItem}
                onReviewAndTotal={openReviewModal}
              />
            </div>
          </div>
        </div>
      ) : null}

      {showExtrasModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-white/15 bg-slate-900 p-6 text-white shadow-2xl shadow-black/40">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                  Almost Done
                </div>
                <h2 className="mt-2 text-3xl font-black">Add a drink or dip?</h2>
                <p className="mt-3 text-zinc-200">
                  Before we total it up, here are a few quick extras.
                </p>
              </div>

              <button
                onClick={() => setShowExtrasModal(false)}
                className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/15"
              >
                Close
              </button>
            </div>

            <div className="mt-8 grid gap-8 md:grid-cols-2">
              <div>
                <h3 className="text-xl font-black text-blue-400">Drinks</h3>
                <div className="mt-4 space-y-3">
                  {QUICK_EXTRAS.drinks.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/15 bg-white/10 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-white">{item.name}</div>
                          <div className="text-sm text-zinc-300">
                            {formatMoney(item.price)}
                          </div>
                        </div>

                        <button
                          onClick={() => addCartItem(item.name, item.price, "Drinks", item.id)}
                          className={`rounded-full px-4 py-2 text-sm font-bold text-white transition ${
                            lastAddedKey === item.id
                              ? "bg-green-600"
                              : "bg-blue-600 hover:bg-blue-500"
                          }`}
                        >
                          {lastAddedKey === item.id ? "Added ✓" : "Add"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xl font-black text-blue-400">Dips</h3>
                <div className="mt-4 space-y-3">
                  {QUICK_EXTRAS.dips.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/15 bg-white/10 p-4"
                    >
                      <div className="flex items-center justify-between gap-4">
                        <div>
                          <div className="font-bold text-white">{item.name}</div>
                          <div className="text-sm text-zinc-300">
                            {formatMoney(item.price)}
                          </div>
                        </div>

                        <button
                          onClick={() => addCartItem(item.name, item.price, "Dips", item.id)}
                          className={`rounded-full px-4 py-2 text-sm font-bold text-white transition ${
                            lastAddedKey === item.id
                              ? "bg-green-600"
                              : "bg-blue-600 hover:bg-blue-500"
                          }`}
                        >
                          {lastAddedKey === item.id ? "Added ✓" : "Add"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={finishReview}
                className="rounded-full bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-500"
              >
                Show Total
              </button>

              <button
                onClick={finishReview}
                className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/15"
              >
                No Thanks, Show Total
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {showPizzaModal ? (
        <PizzaBuilderModal
          mode="create"
          onClose={() => setShowPizzaModal(false)}
          onAdd={(name: string, price: number) => addCartItem(name, price, "Pizza", name)}
        />
      ) : null}

      {showWingModal ? (
        <WingSauceModal
          onClose={() => setShowWingModal(false)}
          onAdd={(name: string, price: number) => addCartItem(name, price, "Wings", name)}
        />
      ) : null}
    </>
  );
}
