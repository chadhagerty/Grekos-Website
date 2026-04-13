import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase-server";
import { requireAdminUser } from "../../../../lib/admin-auth";

type SpecialsPayload = {
  enabled: boolean;
  title: string;
  body: string;
  price_text: string;
  button_text: string;
  image_url: string;
};

export async function GET() {
  const { user } = await requireAdminUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("specials_content")
    .select("*")
    .eq("id", 1)
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: Request) {
  const { user } = await requireAdminUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createSupabaseServerClient();
  const body = (await request.json()) as Partial<SpecialsPayload>;

  const payload: SpecialsPayload = {
    enabled: Boolean(body.enabled),
    title: String(body.title ?? "").trim(),
    body: String(body.body ?? "").trim(),
    price_text: String(body.price_text ?? "").trim(),
    button_text: String(body.button_text ?? "").trim() || "View Full Menu",
    image_url: String(body.image_url ?? "").trim(),
  };

  if (!payload.title) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }

  if (!payload.body) {
    return NextResponse.json({ error: "Body is required." }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("specials_content")
    .upsert(
      {
        id: 1,
        ...payload,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "id" }
    )
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
