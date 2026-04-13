"use client";

import { useState } from "react";
import { WING_SAUCES, formatMoney } from "../../lib/grekos-order-builder";

type WingSauceModalProps = {
  onClose: () => void;
  onAdd: (name: string, price: number) => void;
};

export default function WingSauceModal({
  onClose,
  onAdd,
}: WingSauceModalProps) {
  const [selectedSauce, setSelectedSauce] = useState("Mild");

  function handleAdd() {
    onAdd(`Chicken Wings, 1 pound (${selectedSauce})`, 17.5);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
      <div className="w-full max-w-2xl rounded-3xl border border-white/10 bg-zinc-950 p-6 text-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Wings
            </div>
            <h2 className="mt-2 text-3xl font-black">Choose Your Sauce</h2>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-white hover:bg-white/10"
          >
            Close
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          {WING_SAUCES.map((sauce) => (
            <button
              key={sauce}
              onClick={() => setSelectedSauce(sauce)}
              className={`rounded-2xl px-4 py-3 text-left font-semibold ${
                selectedSauce === sauce
                  ? "bg-blue-600 text-white"
                  : "border border-white/15 bg-white/5 text-white hover:bg-white/10"
              }`}
            >
              {sauce}
            </button>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-black/30 p-5">
          <div className="text-sm text-zinc-400">Selected</div>
          <div className="mt-2 text-lg font-bold text-white">
            Chicken Wings, 1 pound ({selectedSauce})
          </div>
          <div className="mt-3 text-2xl font-black text-blue-400">{formatMoney(17.5)}</div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button
            onClick={handleAdd}
            className="rounded-full bg-blue-600 px-5 py-3 font-bold text-white hover:bg-blue-500"
          >
            Add to Order
          </button>

          <button
            onClick={onClose}
            className="rounded-full border border-white/15 bg-white/5 px-5 py-3 font-bold text-white hover:bg-white/10"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
