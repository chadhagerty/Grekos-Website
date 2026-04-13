import { MENU_CATEGORIES } from "./grekos-menu-data";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  category: string;
};

export type QuickExtra = {
  id: string;
  name: string;
  price: number;
};

export type BuildOrderCategory = {
  id: string;
  title: string;
  items: {
    id: string;
    name: string;
    price: number;
    description?: string;
    popular?: boolean;
    requiresWingSauce?: boolean;
  }[];
};

export const TAX_RATE = 0.13;

export const PIZZA_SIZES = ["Small", "Medium", "Large", "X-Large"] as const;
export type PizzaSize = (typeof PIZZA_SIZES)[number];

export const PIZZA_TOPPINGS = [
  "Pepperoni",
  "Mushrooms",
  "Onion",
  "Tomato",
  "Ham",
  "Bacon",
  "Sausage",
  "Ground Beef",
  "Hot Peppers",
  "Pineapple",
  "Green Olives",
  "Black Olives",
  "Feta Cheese",
  "Green Peppers",
];

export const WING_SAUCES = [
  "Mild",
  "Medium",
  "Hot",
  "Honey Garlic",
  "40 Creek",
  "Tangy Gold",
  "Road House",
  "Thai Chili",
];

export const QUICK_EXTRAS: {
  drinks: QuickExtra[];
  dips: QuickExtra[];
} = {
  drinks: [
    { id: "drink-can", name: "Canned Drink", price: 2.25 },
    { id: "drink-bottle", name: "Bottled Drink", price: 3.5 },
    { id: "drink-chocolate-milk", name: "Chocolate Milk", price: 3.75 },
  ],
  dips: [
    { id: "dip-ranch", name: "Ranch", price: 1.5 },
    { id: "dip-caesar", name: "Caesar", price: 1.5 },
    { id: "dip-mayo", name: "Mayo", price: 1.5 },
    { id: "dip-sub-sauce", name: "Sub Sauce", price: 1.5 },
    { id: "dip-mustard", name: "Mustard", price: 1.5 },
    { id: "dip-spicy-mayo", name: "Spicy Mayo", price: 1.5 },
    { id: "dip-bbq", name: "Barbecue Sauce", price: 1.5 },
    { id: "dip-ketchup", name: "Ketchup", price: 1.5 },
    { id: "dip-creamy-garlic", name: "Creamy Garlic", price: 1.5 },
    { id: "dip-chipotle-cheddar", name: "Chipotle Cheddar", price: 1.5 },
  ],
};

function parsePrice(price: string): number {
  const cleaned = price.replace(/[^0-9.]/g, "");
  const parsed = Number.parseFloat(cleaned);
  return Number.isFinite(parsed) ? parsed : 0;
}

export const ORDER_CATEGORIES: BuildOrderCategory[] = MENU_CATEGORIES.map((category) => ({
  id: category.title.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
  title: category.title,
  items: category.items.map((item, index) => ({
    id: `${category.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${index}`,
    name: item.name,
    price: parsePrice(item.price),
    description: item.description,
    popular: item.popular,
    requiresWingSauce:
      category.title === "Chicken Wings" &&
      item.name.toLowerCase().includes("wings"),
  })),
}));

export const PIZZA_BASE_PRICING: Record<string, Record<PizzaSize, number>> = {
  cheese: { Small: 13.75, Medium: 17.5, Large: 21.75, "X-Large": 26.25 },
  one: { Small: 14.25, Medium: 18.25, Large: 22.75, "X-Large": 27.25 },
  two: { Small: 14.75, Medium: 19.0, Large: 23.75, "X-Large": 28.25 },
  three: { Small: 15.25, Medium: 19.75, Large: 24.75, "X-Large": 29.25 },
  four: { Small: 15.75, Medium: 20.5, Large: 25.75, "X-Large": 30.25 },
};

export const ADDITIONAL_TOPPING_PRICE: Record<PizzaSize, number> = {
  Small: 3.25,
  Medium: 4.0,
  Large: 4.5,
  "X-Large": 5.5,
};

export const DOUBLE_CHEESE_PRICE: Record<PizzaSize, number> = {
  Small: 4.5,
  Medium: 5.25,
  Large: 6.5,
  "X-Large": 7.75,
};

export function formatMoney(value: number): string {
  return `$${value.toFixed(2)}`;
}

export function calculateSubtotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
}

export function calculateTax(subtotal: number): number {
  return subtotal * TAX_RATE;
}

export function calculateTotal(subtotal: number): number {
  return subtotal + calculateTax(subtotal);
}

export function buildOrderSummary(items: CartItem[], extraNotes?: string): string {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal);

  const notesBlock =
    extraNotes && extraNotes.trim().length > 0
      ? ["", "Notes / Extras to mention on call:", extraNotes.trim()]
      : [];

  return [
    "Your Grekos Order",
    "",
    ...items.map((item) => `${item.quantity} x ${item.name} — ${formatMoney(item.price * item.quantity)}`),
    "",
    `Subtotal: ${formatMoney(subtotal)}`,
    `Tax: ${formatMoney(tax)}`,
    `Estimated Total: ${formatMoney(total)}`,
    ...notesBlock,
    "",
    "Call Grekos to place this order.",
  ].join("\n");
}

export function calculatePizzaPrice(
  size: PizzaSize,
  toppingCount: number,
  extraToppings: number,
  doubleCheese: boolean
): number {
  let baseKey = "cheese";

  if (toppingCount === 1) baseKey = "one";
  else if (toppingCount === 2) baseKey = "two";
  else if (toppingCount === 3) baseKey = "three";
  else if (toppingCount >= 4) baseKey = "four";

  let price = PIZZA_BASE_PRICING[baseKey][size];

  if (extraToppings > 0) {
    price += ADDITIONAL_TOPPING_PRICE[size] * extraToppings;
  }

  if (doubleCheese) {
    price += DOUBLE_CHEESE_PRICE[size];
  }

  return price;
}
