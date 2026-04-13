"use client";

import {
  buildOrderSummary,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  formatMoney,
  type CartItem,
} from "../../lib/grekos-order-builder";

type OrderSummaryProps = {
  items: CartItem[];
  showFinalTotals: boolean;
  extraNotes: string;
  onExtraNotesChange: (value: string) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
  onRemove: (id: string) => void;
  onReviewAndTotal: () => void;
};

export default function OrderSummary({
  items,
  showFinalTotals,
  extraNotes,
  onExtraNotesChange,
  onIncrease,
  onDecrease,
  onRemove,
  onReviewAndTotal,
}: OrderSummaryProps) {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal);

  const callHref = `tel:+16133821515`;

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(buildOrderSummary(items, extraNotes));
      window.alert("Order summary copied.");
    } catch {
      window.alert("Could not copy order summary.");
    }
  }

  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 p-6 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-2xl font-black text-blue-400">Your Order</h2>
        <div className="text-sm font-bold text-zinc-400">{items.length} items</div>
      </div>

      {items.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5 text-sm text-zinc-400">
          Add items from the menu to start building your order.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 bg-black/30 p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-base font-bold text-white">{item.name}</div>
                  <div className="mt-1 text-sm text-zinc-400">
                    {formatMoney(item.price)} each
                  </div>
                </div>

                <div className="text-right text-base font-black text-white">
                  {formatMoney(item.price * item.quantity)}
                </div>
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => onDecrease(item.id)}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-bold text-white hover:bg-white/10"
                >
                  −
                </button>

                <div className="min-w-10 text-center text-sm font-bold text-white">
                  {item.quantity}
                </div>

                <button
                  onClick={() => onIncrease(item.id)}
                  className="rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-bold text-white hover:bg-white/10"
                >
                  +
                </button>

                <button
                  onClick={() => onRemove(item.id)}
                  className="ml-auto rounded-full border border-blue-500/30 bg-blue-500/10 px-4 py-2 text-sm font-bold text-blue-300 hover:bg-blue-500/20"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 ? (
        <>
          <div className="mt-6 rounded-2xl border border-white/10 bg-black/30 p-5">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-zinc-400">
              Notes / Extras to mention on call
            </label>
            <textarea
              value={extraNotes}
              onChange={(e) => onExtraNotesChange(e.target.value)}
              placeholder="Example: extra napkins, light sauce, pickup in 30 mins"
              rows={3}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
            />
          </div>

          <div className="mt-6 space-y-3 rounded-2xl border border-white/10 bg-black/30 p-5">
            <div className="flex justify-between text-sm text-zinc-300">
              <span>Subtotal</span>
              <span>{formatMoney(subtotal)}</span>
            </div>

            {showFinalTotals ? (
              <>
                <div className="flex justify-between text-sm text-zinc-300">
                  <span>Tax</span>
                  <span>{formatMoney(tax)}</span>
                </div>
                <div className="flex justify-between border-t border-white/10 pt-3 text-lg font-black text-white">
                  <span>Estimated Total</span>
                  <span>{formatMoney(total)}</span>
                </div>
              </>
            ) : (
              <div className="text-xs text-zinc-500">
                Final tax and total appear after you review the order.
              </div>
            )}
          </div>

          {!showFinalTotals ? (
            <button
              onClick={onReviewAndTotal}
              className="mt-6 w-full rounded-full bg-blue-600 px-5 py-4 text-center font-black text-white hover:bg-blue-500"
            >
              Review Order & Total
            </button>
          ) : (
            <div className="mt-6 space-y-3 pb-1">
              <a
                href={callHref}
                className="block w-full rounded-full bg-blue-600 px-5 py-4 text-center font-black text-white hover:bg-blue-500"
              >
                Call to Place This Order — {formatMoney(total)}
              </a>

              <button
                onClick={handleCopy}
                className="w-full rounded-full border border-white/15 bg-white/5 px-5 py-4 font-bold text-white hover:bg-white/10"
              >
                Copy Order Summary
              </button>

              <div className="rounded-2xl border border-blue-500/20 bg-blue-500/10 p-4 text-sm text-blue-100">
                Your summary includes item totals, HST estimate, and any notes you added for the call.
              </div>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
