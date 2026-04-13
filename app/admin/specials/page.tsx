"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SpecialsFormState = {
  enabled: boolean;
  title: string;
  body: string;
  price_text: string;
  button_text: string;
  image_url: string;
};

const DEFAULT_STATE: SpecialsFormState = {
  enabled: false,
  title: "No Sunday special posted right now",
  body: "Keep checking back for the next Sunday special. If Grekos is running one, it will be posted here.",
  price_text: "",
  button_text: "View Full Menu",
  image_url: "",
};

export default function AdminSpecialsPage() {
  const [form, setForm] = useState<SpecialsFormState>(DEFAULT_STATE);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    async function loadSpecial() {
      try {
        const response = await fetch("/api/admin/specials", {
          method: "GET",
          cache: "no-store",
        });

        if (!response.ok) {
          const payload = await response.json().catch(() => null);
          throw new Error(payload?.error || "Could not load specials content.");
        }

        const data = (await response.json()) as Partial<SpecialsFormState>;

        setForm({
          enabled: Boolean(data.enabled),
          title: data.title || DEFAULT_STATE.title,
          body: data.body || DEFAULT_STATE.body,
          price_text: data.price_text || "",
          button_text: data.button_text || DEFAULT_STATE.button_text,
          image_url: data.image_url || "",
        });
      } catch (error) {
        console.error(error);
        setErrorText(
          error instanceof Error ? error.message : "Could not load specials content."
        );
      } finally {
        setLoading(false);
      }
    }

    loadSpecial();
  }, []);

  function updateField<K extends keyof SpecialsFormState>(
    key: K,
    value: SpecialsFormState[K]
  ) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
    setStatusText("");
    setErrorText("");
  }

  async function handleUpload(file: File) {
    setUploading(true);
    setStatusText("");
    setErrorText("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "specials");

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Could not upload special image.");
      }

      updateField("image_url", payload.publicUrl);
      setStatusText("Special image uploaded. Save changes to publish it.");
    } catch (error) {
      console.error(error);
      setErrorText(
        error instanceof Error ? error.message : "Could not upload special image."
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setStatusText("");
    setErrorText("");

    try {
      const response = await fetch("/api/admin/specials", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.error || "Could not save specials content.");
      }

      setStatusText("Specials page updated successfully.");
    } catch (error) {
      console.error(error);
      setErrorText(
        error instanceof Error ? error.message : "Could not save specials content."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/15 bg-white/10 p-8 text-zinc-200 shadow-lg shadow-black/20">
        Loading specials editor...
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Admin
          </p>
          <h1 className="mt-3 text-4xl font-black uppercase">Sunday Special</h1>
          <p className="mt-4 max-w-3xl text-zinc-300">
            Turn the special on or off, update the message, and preview how it will look.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/dashboard"
            className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/15"
          >
            Back to Dashboard
          </Link>

          <Link
            href="/specials"
            className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/15"
          >
            View Live Page
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20">
          <div className="space-y-6">
            <div className="rounded-2xl border border-white/15 bg-black/20 p-4">
              <label className="flex items-center gap-3 text-white">
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(e) => updateField("enabled", e.target.checked)}
                />
                <span className="font-bold">Sunday special is active</span>
              </label>
              <p className="mt-2 text-sm text-zinc-400">
                Turn this off to show the normal “check back later” style message.
              </p>
            </div>

            <div className="rounded-2xl border border-white/15 bg-black/20 p-4">
              <label className="mb-2 block text-sm font-bold text-zinc-200">
                Upload special image
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
                {uploading ? "Uploading..." : "On phone, this should open your photos."}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-200">
                Title
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => updateField("title", e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                placeholder="Sunday Special"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-200">
                Description
              </label>
              <textarea
                value={form.body}
                onChange={(e) => updateField("body", e.target.value)}
                rows={5}
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                placeholder="Describe the current Sunday special here"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-200">
                Optional price text
              </label>
              <input
                type="text"
                value={form.price_text}
                onChange={(e) => updateField("price_text", e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                placeholder="$24.99"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-200">
                Button text
              </label>
              <input
                type="text"
                value={form.button_text}
                onChange={(e) => updateField("button_text", e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                placeholder="View Full Menu"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-200">
                Image URL
              </label>
              <input
                type="text"
                value={form.image_url}
                onChange={(e) => updateField("image_url", e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                placeholder="https://..."
              />
            </div>

            {statusText ? (
              <div className="rounded-2xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-200">
                {statusText}
              </div>
            ) : null}

            {errorText ? (
              <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                {errorText}
              </div>
            ) : null}

            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-full bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Live Preview
          </p>
          <h2 className="mt-3 text-2xl font-black">
            {form.enabled ? "Special Active" : "Special Inactive"}
          </h2>

          <div className="mt-6 rounded-3xl border border-blue-400/20 bg-blue-500/10 p-8">
            <div className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
              Current Status
            </div>

            <div className="mt-3 text-3xl font-black">
              {form.title || DEFAULT_STATE.title}
            </div>

            {form.price_text ? (
              <div className="mt-3 text-xl font-black text-white">{form.price_text}</div>
            ) : null}

            <p className="mt-5 max-w-3xl text-zinc-200">
              {form.body || DEFAULT_STATE.body}
            </p>

            {form.image_url ? (
              <div className="mt-6 overflow-hidden rounded-2xl border border-white/15 bg-black/20">
                <img
                  src={form.image_url}
                  alt="Sunday special preview"
                  className="max-h-[280px] w-full object-cover"
                />
              </div>
            ) : null}

            <div className="mt-8">
              <button
                type="button"
                className="rounded-full bg-blue-600 px-6 py-3 font-bold text-white"
              >
                {form.button_text || DEFAULT_STATE.button_text}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
