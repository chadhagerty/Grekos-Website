import type { Metadata } from "next";
import GrekosFooter from "../components/GrekosFooter";
import GrekosHeader from "../components/GrekosHeader";
import { createSupabaseServerClient } from "../../lib/supabase-server";

export const metadata: Metadata = {
  title: "Gallery",
  description:
    "Browse photos of Grekos Pizzeria food, restaurant atmosphere, and local favourites in Gananoque.",
  alternates: {
    canonical: "/gallery",
  },
};

type GalleryImage = {
  id: string;
  image_url: string;
  caption: string;
};

export default async function GalleryPage() {
  let images: GalleryImage[] = [];

  try {
    const supabase = await createSupabaseServerClient();

    const { data, error } = await supabase
      .from("gallery_images")
      .select("id, image_url, caption")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });

    if (!error && data) {
      images = data;
    }
  } catch (error) {
    console.error("Could not load gallery images:", error);
  }

  return (
    <main className="min-h-screen bg-slate-900 text-white">
      <GrekosHeader />

      <section className="border-b border-white/10 bg-black/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Gallery
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase md:text-5xl">
            Real food. Real place. Real people.
          </h1>
          <p className="mt-5 max-w-3xl text-lg text-zinc-200">
            A look at Grekos favourites, the restaurant, and the food people come back for.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        {images.length === 0 ? (
          <div className="rounded-3xl border border-white/15 bg-white/10 p-8 text-zinc-200 shadow-lg shadow-black/20">
            Gallery photos will be added here soon.
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {images.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-2xl border border-white/15 bg-white/10 shadow-lg shadow-black/20"
              >
                <img
                  src={image.image_url}
                  alt={image.caption || "Grekos gallery image"}
                  className="aspect-square w-full object-cover"
                />
                {image.caption ? (
                  <div className="px-2 py-2 text-[11px] leading-4 text-zinc-200 sm:px-3 sm:text-xs">
                    {image.caption}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </section>

      <GrekosFooter />
    </main>
  );
}
