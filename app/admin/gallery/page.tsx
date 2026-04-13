"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type GalleryImage = {
  id: string;
  image_url: string;
  caption: string;
  sort_order: number;
};

export default function AdminGalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [imageUrl, setImageUrl] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [errorText, setErrorText] = useState("");

  async function loadImages() {
    try {
      const response = await fetch("/api/admin/gallery", {
        method: "GET",
        cache: "no-store",
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Could not load gallery.");
      }

      setImages(payload ?? []);
    } catch (error) {
      console.error(error);
      setErrorText(error instanceof Error ? error.message : "Could not load gallery.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadImages();
  }, []);

  async function handleUpload(file: File) {
    setUploading(true);
    setStatusText("");
    setErrorText("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "gallery");

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Could not upload gallery image.");
      }

      setImageUrl(payload.publicUrl);
      setStatusText("Image uploaded. Click Add Image to publish it.");
    } catch (error) {
      console.error(error);
      setErrorText(
        error instanceof Error ? error.message : "Could not upload gallery image."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleAddImage() {
    setSaving(true);
    setStatusText("");
    setErrorText("");

    try {
      const response = await fetch("/api/admin/gallery", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          image_url: imageUrl,
          caption,
          sort_order: images.length,
        }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Could not add image.");
      }

      setImageUrl("");
      setCaption("");
      setStatusText("Gallery image added.");
      await loadImages();
    } catch (error) {
      console.error(error);
      setErrorText(error instanceof Error ? error.message : "Could not add image.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    const confirmed = window.confirm("Delete this gallery image?");
    if (!confirmed) return;

    setStatusText("");
    setErrorText("");

    try {
      const response = await fetch("/api/admin/gallery", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Could not delete image.");
      }

      setStatusText("Gallery image deleted.");
      await loadImages();
    } catch (error) {
      console.error(error);
      setErrorText(error instanceof Error ? error.message : "Could not delete image.");
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Admin
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase">Gallery</h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/dashboard"
            className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/15"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/gallery"
            className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/15"
          >
            View Live Page
          </Link>
        </div>
      </div>

      <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20">
        <div className="grid gap-4">
          <div className="rounded-2xl border border-white/15 bg-black/20 p-4">
            <label className="mb-2 block text-sm font-bold text-zinc-200">
              Upload gallery image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleUpload(file);
                }
              }}
              className="block w-full text-sm text-zinc-200"
            />
            <p className="mt-2 text-sm text-zinc-400">
              {uploading ? "Uploading..." : "Or paste an image URL below."}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-[1fr_1fr_auto]">
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image URL"
              className="rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
            />
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Caption (optional)"
              className="rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
            />
            <button
              onClick={handleAddImage}
              disabled={saving}
              className="rounded-full bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500 disabled:opacity-60"
            >
              {saving ? "Adding..." : "Add Image"}
            </button>
          </div>
        </div>

        {statusText ? (
          <div className="mt-4 rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
            {statusText}
          </div>
        ) : null}

        {errorText ? (
          <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {errorText}
          </div>
        ) : null}
      </div>

      <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
          Current Gallery
        </p>

        {loading ? (
          <div className="mt-6 text-zinc-300">Loading gallery...</div>
        ) : images.length === 0 ? (
          <div className="mt-6 text-zinc-300">No gallery images yet.</div>
        ) : (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((image) => (
              <div
                key={image.id}
                className="overflow-hidden rounded-3xl border border-white/15 bg-black/20"
              >
                <img
                  src={image.image_url}
                  alt={image.caption || "Gallery image"}
                  className="aspect-square w-full object-cover"
                />
                <div className="p-4">
                  <div className="text-sm text-zinc-200">
                    {image.caption || "No caption"}
                  </div>
                  <button
                    onClick={() => handleDelete(image.id)}
                    className="mt-3 rounded-full border border-red-500/20 bg-red-500/10 px-4 py-2 text-sm font-bold text-red-200 hover:bg-red-500/20"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
