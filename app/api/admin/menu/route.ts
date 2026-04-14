import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase-server";
import { requireAdminUser } from "../../../../lib/admin-auth";

type MenuItemPayload = {
  id: number;
  category_key: string;
  sort_order: number;
  name: string;
  price: string;
  description: string;
  popular: boolean;
  is_active: boolean;
};

type PizzaRowPayload = {
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

type SauceDipPayload = {
  id: number;
  sort_order: number;
  name: string;
  price: string;
  is_active: boolean;
};

export async function GET() {
  const { user } = await requireAdminUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();

  const [menuItemsRes, pizzaRowsRes, sauceDipsRes] = await Promise.all([
    supabase
      .from("menu_items")
      .select("*")
      .order("category_key", { ascending: true })
      .order("sort_order", { ascending: true }),
    supabase.from("pizza_price_rows").select("*").order("sort_order", { ascending: true }),
    supabase.from("sauce_dips").select("*").order("sort_order", { ascending: true }),
  ]);

  if (menuItemsRes.error) {
    return NextResponse.json({ error: menuItemsRes.error.message }, { status: 500 });
  }

  if (pizzaRowsRes.error) {
    return NextResponse.json({ error: pizzaRowsRes.error.message }, { status: 500 });
  }

  if (sauceDipsRes.error) {
    return NextResponse.json({ error: sauceDipsRes.error.message }, { status: 500 });
  }

  return NextResponse.json({
    menuItems: menuItemsRes.data ?? [],
    pizzaRows: pizzaRowsRes.data ?? [],
    sauceDips: sauceDipsRes.data ?? [],
  });
}

export async function POST(request: Request) {
  const { user } = await requireAdminUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();
  const body = await request.json();

  const menuItems = Array.isArray(body?.menuItems) ? (body.menuItems as Partial<MenuItemPayload>[]) : [];
  const pizzaRows = Array.isArray(body?.pizzaRows) ? (body.pizzaRows as Partial<PizzaRowPayload>[]) : [];
  const sauceDips = Array.isArray(body?.sauceDips) ? (body.sauceDips as Partial<SauceDipPayload>[]) : [];

  const menuPayload = menuItems.map((item) => ({
    id: Number(item.id),
    category_key: String(item.category_key ?? "").trim(),
    sort_order: Number(item.sort_order ?? 0),
    name: String(item.name ?? "").trim(),
    price: String(item.price ?? "").trim(),
    description: String(item.description ?? "").trim(),
    popular: Boolean(item.popular),
    is_active: Boolean(item.is_active),
  }));

  const pizzaPayload = pizzaRows.map((row) => ({
    id: Number(row.id),
    sort_order: Number(row.sort_order ?? 0),
    name: String(row.name ?? "").trim(),
    description: String(row.description ?? "").trim(),
    small: String(row.small ?? "").trim(),
    medium: String(row.medium ?? "").trim(),
    large: String(row.large ?? "").trim(),
    x_large: String(row.x_large ?? "").trim(),
    popular: Boolean(row.popular),
    is_active: Boolean(row.is_active),
  }));

  const dipPayload = sauceDips.map((dip) => ({
    id: Number(dip.id),
    sort_order: Number(dip.sort_order ?? 0),
    name: String(dip.name ?? "").trim(),
    price: String(dip.price ?? "").trim(),
    is_active: Boolean(dip.is_active),
  }));

  const [menuRes, pizzaRes, dipsRes] = await Promise.all([
    menuPayload.length
      ? supabase.from("menu_items").upsert(menuPayload, { onConflict: "id" }).select()
      : Promise.resolve({ data: [], error: null }),
    pizzaPayload.length
      ? supabase.from("pizza_price_rows").upsert(pizzaPayload, { onConflict: "id" }).select()
      : Promise.resolve({ data: [], error: null }),
    dipPayload.length
      ? supabase.from("sauce_dips").upsert(dipPayload, { onConflict: "id" }).select()
      : Promise.resolve({ data: [], error: null }),
  ]);

  if (menuRes.error) {
    return NextResponse.json({ error: menuRes.error.message }, { status: 500 });
  }

  if (pizzaRes.error) {
    return NextResponse.json({ error: pizzaRes.error.message }, { status: 500 });
  }

  if (dipsRes.error) {
    return NextResponse.json({ error: dipsRes.error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    menuItems: menuRes.data ?? [],
    pizzaRows: pizzaRes.data ?? [],
    sauceDips: dipsRes.data ?? [],
  });
}
