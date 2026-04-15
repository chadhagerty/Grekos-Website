import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "../../../../lib/supabase-server";
import { requireAdminUser } from "../../../../lib/admin-auth";

const BUCKET_NAME = "site-images";

function sanitizeFileName(name: string) {
  const lastDot = name.lastIndexOf(".");
  const base = lastDot >= 0 ? name.slice(0, lastDot) : name;
  const ext = lastDot >= 0 ? name.slice(lastDot + 1).toLowerCase() : "jpg";

  const safeBase = base
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

  const safeExt = ext.replace(/[^a-z0-9]/g, "") || "jpg";

  return `${safeBase || "image"}-${Date.now()}.${safeExt}`;
}

export async function POST(request: Request) {
  const { user } = await requireAdminUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = String(formData.get("folder") ?? "uploads").trim();

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded." }, { status: 400 });
    }

    const supabase = await createSupabaseServerClient();

    const safeFolder =
      folder
        .toLowerCase()
        .replace(/[^a-z0-9/-]/g, "")
        .replace(/\/+/g, "/")
        .replace(/^\/|\/$/g, "") || "uploads";

    const fileName = sanitizeFileName(file.name);
    const filePath = `${safeFolder}/${fileName}`;

    const { data: bucketList, error: bucketError } = await supabase.storage.listBuckets();

    if (bucketError) {
      return NextResponse.json(
        { error: `Could not read storage buckets: ${bucketError.message}` },
        { status: 500 }
      );
    }

    const bucketExists = (bucketList ?? []).some((bucket) => bucket.name === BUCKET_NAME);

    if (!bucketExists) {
      return NextResponse.json(
        {
          error: `Storage bucket "${BUCKET_NAME}" was not found. Check the exact bucket name in Supabase Storage.`,
        },
        { status: 500 }
      );
    }

    const { error: uploadError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file, {
        contentType: file.type || "image/jpeg",
        upsert: true,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Upload failed: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data: publicUrlData } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      publicUrl: publicUrlData.publicUrl,
      path: filePath,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not upload image.",
      },
      { status: 500 }
    );
  }
}
