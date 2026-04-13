"use client";

import { useMemo, useState } from "react";
import {
  PIZZA_SIZES,
  PIZZA_TOPPINGS,
  type PizzaSize,
  calculatePizzaPrice,
} from "../../lib/grekos-order-builder";

type PizzaBuilderModalProps = {
  mode: "create";
  onClose: () => void;
  onAdd: (name: string, price: number) => void;
};

export default function PizzaBuilderModal({
  mode,
  onClose,
  onAdd,
}: PizzaBuilderModalProps) {
  const [size, setSize] = useState<PizzaSize>("Medium");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [doubleCheese, setDoubleCheese] = useState(false);

  const toppingCount = selectedToppings.length;
  const extraToppings = Math.max(0, toppingCount - 4);

  const price = useMemo(() => {
    return calculatePizzaPrice(size, toppingCount, extraToppings, doubleCheese);
  }, [size, toppingCount, extraToppings, doubleCheese]);

  function toggleTopping(topping: string) {
    setSelectedToppings((prev) =>
      prev.includes(topping)
        ? prev.filter((item) => item !== topping)
        : [...prev, topping]
    );
  }

  function handleAdd() {
    const toppingLabel =
      selectedToppings.length > 0 ? selectedToppings.join(", ") : "Cheese";

    const name = `${size} Pizza (${toppingLabel}${doubleCheese ? ", Double Cheese" : ""})`;

    onAdd(name, price);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 md:p-6">
      <div className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl border border-white/15 bg-slate-900 text-white shadow-2xl shadow-black/40">
        <div className="border-b border-white/10 px-5 py-4 md:px-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                {mode === "create" ? "Build Your Pizza" : "Edit Pizza"}
              </p>
              <h2 className="mt-2 text-2xl font-black md:text-3xl">
                Custom Pizza
              </h2>
            </div>

            <button
              onClick={onClose}
              className="rounded-full border border-white/20 bg-white/10 px-4 py-2 text-sm font-bold text-white hover:bg-white/15"
            >
              Close
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-5 md:px-6">
          <div>
            <div className="mb-3 text-lg font-black">Size</div>
            <div className="flex flex-wrap gap-3">
              {PIZZA_SIZES.map((pizzaSize) => {
                const active = size === pizzaSize;

                return (
                  <button
                    key={pizzaSize}
                    onClick={() => setSize(pizzaSize)}
                    className={`rounded-xl px-5 py-3 font-bold transition ${
                      active
                        ? "bg-blue-600 text-white"
                        : "border border-white/15 bg-black/30 text-zinc-200 hover:bg-white/10"
                    }`}
                  >
                    {pizzaSize}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8">
            <div className="mb-3 text-lg font-black">Toppings</div>
            <div className="grid gap-3 sm:grid-cols-2">
              {PIZZA_TOPPINGS.map((topping) => {
                const active = selectedToppings.includes(topping);

                return (
                  <button
                    key={topping}
                    onClick={() => toggleTopping(topping)}
                    className={`rounded-xl px-4 py-3 text-left font-bold transition ${
                      active
                        ? "bg-blue-600 text-white"
                        : "border border-white/15 bg-black/30 text-zinc-200 hover:bg-white/10"
                    }`}
                  >
                    {topping}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-8 rounded-2xl border border-white/15 bg-black/20 p-4">
            <label className="flex items-center gap-3 text-white">
              <input
                type="checkbox"
                checked={doubleCheese}
                onChange={(e) => setDoubleCheese(e.target.checked)}
              />
              <span className="font-bold">Double Cheese</span>
            </label>

            <div className="mt-4 text-sm text-zinc-300">
              Included toppings selected: {Math.min(toppingCount, 4)}
            </div>
            {extraToppings > 0 ? (
              <div className="mt-1 text-sm text-zinc-300">
                Extra toppings added beyond 4: {extraToppings}
              </div>
            ) : null}
          </div>
        </div>

        <div className="border-t border-white/10 bg-slate-900 px-5 py-4 md:px-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-3xl font-black text-blue-300">
              ${price.toFixed(2)}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleAdd}
                className="rounded-full bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500"
              >
                Add to Order
              </button>
              <button
                onClick={onClose}
                className="rounded-full border border-white/20 bg-white/10 px-6 py-3 font-bold text-white hover:bg-white/15"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
