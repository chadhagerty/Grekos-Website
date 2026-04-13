import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase-server";
import { CONTACT_DEFAULTS } from "../../../../lib/grekos-defaults";

export async function GET() {
  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("contact_content")
      .select("*")
      .eq("id", 1)
      .single();

    if (error || !data) {
      return NextResponse.json(CONTACT_DEFAULTS);
    }

    return NextResponse.json({
      ...CONTACT_DEFAULTS,
      ...data,
    });
  } catch (error) {
    console.error("Could not load public contact content:", error);
    return NextResponse.json(CONTACT_DEFAULTS);
  }
}
