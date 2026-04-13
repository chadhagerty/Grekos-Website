import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase-server";
import { requireAdminUser } from "../../../../lib/admin-auth";
import { HOMEPAGE_DEFAULTS } from "../../../../lib/grekos-defaults";

export async function GET() {
  const { user } = await requireAdminUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("homepage_content")
    .select("*")
    .eq("id", 1)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? { id: 1, ...HOMEPAGE_DEFAULTS });
}

export async function POST(request: Request) {
  const { user } = await requireAdminUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();
  const body = await request.json();

  const payload = {
    id: 1,
    hero_image_url: String(body.hero_image_url ?? "").trim(),
    hero_headline: String(body.hero_headline ?? "").trim(),
    hero_subtext: String(body.hero_subtext ?? "").trim(),
    featured_item_1_title: String(body.featured_item_1_title ?? "").trim(),
    featured_item_1_text: String(body.featured_item_1_text ?? "").trim(),
    featured_item_2_title: String(body.featured_item_2_title ?? "").trim(),
    featured_item_2_text: String(body.featured_item_2_text ?? "").trim(),
    featured_item_3_title: String(body.featured_item_3_title ?? "").trim(),
    featured_item_3_text: String(body.featured_item_3_text ?? "").trim(),
    featured_item_4_title: String(body.featured_item_4_title ?? "").trim(),
    featured_item_4_text: String(body.featured_item_4_text ?? "").trim(),
    quote_1: String(body.quote_1 ?? "").trim(),
    quote_2: String(body.quote_2 ?? "").trim(),
    quote_3: String(body.quote_3 ?? "").trim(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("homepage_content")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
