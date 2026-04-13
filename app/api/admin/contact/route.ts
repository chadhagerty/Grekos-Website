import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase-server";
import { requireAdminUser } from "../../../../lib/admin-auth";
import { CONTACT_DEFAULTS } from "../../../../lib/grekos-defaults";

export async function GET() {
  const { user } = await requireAdminUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("contact_content")
    .select("*")
    .eq("id", 1)
    .single();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data ?? { id: 1, ...CONTACT_DEFAULTS });
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
    phone: String(body.phone ?? "").trim(),
    phone_href: String(body.phone_href ?? "").trim(),
    address_line_1: String(body.address_line_1 ?? "").trim(),
    address_line_2: String(body.address_line_2 ?? "").trim(),
    monday_hours: String(body.monday_hours ?? "").trim(),
    tuesday_hours: String(body.tuesday_hours ?? "").trim(),
    wednesday_hours: String(body.wednesday_hours ?? "").trim(),
    thursday_hours: String(body.thursday_hours ?? "").trim(),
    friday_hours: String(body.friday_hours ?? "").trim(),
    saturday_hours: String(body.saturday_hours ?? "").trim(),
    sunday_hours: String(body.sunday_hours ?? "").trim(),
    holiday_note: String(body.holiday_note ?? "").trim(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("contact_content")
    .upsert(payload, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
