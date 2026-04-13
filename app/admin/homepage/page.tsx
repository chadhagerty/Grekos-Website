"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type HomepageForm = {
  hero_image_url: string;
  hero_headline: string;
  hero_subtext: string;
  featured_item_1_title: string;
  featured_item_1_text: string;
  featured_item_2_title: string;
  featured_item_2_text: string;
  featured_item_3_title: string;
  featured_item_3_text: string;
  featured_item_4_title: string;
  featured_item_4_text: string;
  quote_1: string;
  quote_2: string;
  quote_3: string;
};

const DEFAULT_FORM: HomepageForm = {
  hero_image_url: "/hero.jpg",
  hero_headline: "Serving Gananoque Since 1991",
  hero_subtext:
    "Family-owned. Big portions. Real pizza. A local staple for takeout, delivery, and comfort food that keeps people coming back.",
  featured_item_1_title: "House Special Pizza",
  featured_item_1_text: "Loaded, satisfying, and built the way regulars love it.",
  featured_item_2_title: "Wings",
  featured_item_2_text: "A go-to add-on for game night, family dinner, or late cravings.",
  featured_item_3_title: "Greek Salad",
  featured_item_3_text: "Fresh, simple, and a perfect balance beside pizza and wings.",
  featured_item_4_title: "Poutine",
  featured_item_4_text: "Classic comfort food and a local favourite for a reason.",
  quote_1: "Best pizza in Gananoque.",
  quote_2: "Big portions and always hits the spot.",
  quote_3: "A local staple we keep coming back to.",
};

export default function AdminHomepagePage() {
  const [form, setForm] = useState<HomepageForm>(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    async function loadHomepage() {
      try {
        const response = await fetch("/api/admin/homepage", {
          method: "GET",
          cache: "no-store",
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error || "Could not load homepage content.");
        }

        setForm({
          hero_image_url: payload.hero_image_url || DEFAULT_FORM.hero_image_url,
          hero_headline: payload.hero_headline || DEFAULT_FORM.hero_headline,
          hero_subtext: payload.hero_subtext || DEFAULT_FORM.hero_subtext,
          featured_item_1_title:
            payload.featured_item_1_title || DEFAULT_FORM.featured_item_1_title,
          featured_item_1_text:
            payload.featured_item_1_text || DEFAULT_FORM.featured_item_1_text,
          featured_item_2_title:
            payload.featured_item_2_title || DEFAULT_FORM.featured_item_2_title,
          featured_item_2_text:
            payload.featured_item_2_text || DEFAULT_FORM.featured_item_2_text,
          featured_item_3_title:
            payload.featured_item_3_title || DEFAULT_FORM.featured_item_3_title,
          featured_item_3_text:
            payload.featured_item_3_text || DEFAULT_FORM.featured_item_3_text,
          featured_item_4_title:
            payload.featured_item_4_title || DEFAULT_FORM.featured_item_4_title,
          featured_item_4_text:
            payload.featured_item_4_text || DEFAULT_FORM.featured_item_4_text,
          quote_1: payload.quote_1 || DEFAULT_FORM.quote_1,
          quote_2: payload.quote_2 || DEFAULT_FORM.quote_2,
          quote_3: payload.quote_3 || DEFAULT_FORM.quote_3,
        });
      } catch (error) {
        console.error(error);
        setErrorText(
          error instanceof Error ? error.message : "Could not load homepage content."
        );
      } finally {
        setLoading(false);
      }
    }

    loadHomepage();
  }, []);

  function updateField<K extends keyof HomepageForm>(key: K, value: HomepageForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setStatusText("");
    setErrorText("");
  }

  async function handleHeroUpload(file: File) {
    setUploadingHero(true);
    setStatusText("");
    setErrorText("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", "homepage");

      const response = await fetch("/api/admin/upload-image", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Could not upload hero image.");
      }

      updateField("hero_image_url", payload.publicUrl);
      setStatusText("Hero image uploaded. Save changes to publish it.");
    } catch (error) {
      console.error(error);
      setErrorText(
        error instanceof Error ? error.message : "Could not upload hero image."
      );
    } finally {
      setUploadingHero(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setStatusText("");
    setErrorText("");

    try {
      const response = await fetch("/api/admin/homepage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Could not save homepage content.");
      }

      setStatusText("Homepage updated successfully.");
    } catch (error) {
      console.error(error);
      setErrorText(
        error instanceof Error ? error.message : "Could not save homepage content."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/15 bg-white/10 p-8 text-zinc-200">
        Loading homepage editor...
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
          <h1 className="mt-3 text-4xl font-black uppercase">Homepage</h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/dashboard"
            className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/15"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/"
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
              <label className="mb-2 block text-sm font-bold text-zinc-200">
                Upload hero image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    handleHeroUpload(file);
                  }
                }}
                className="block w-full text-sm text-zinc-200"
              />
              <p className="mt-2 text-sm text-zinc-400">
                {uploadingHero ? "Uploading..." : "Or paste an image URL below."}
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-200">
                Hero image URL
              </label>
              <input
                type="text"
                value={form.hero_image_url}
                onChange={(e) => updateField("hero_image_url", e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-200">
                Hero headline
              </label>
              <input
                type="text"
                value={form.hero_headline}
                onChange={(e) => updateField("hero_headline", e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-200">
                Hero subtext
              </label>
              <textarea
                rows={4}
                value={form.hero_subtext}
                onChange={(e) => updateField("hero_subtext", e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
              />
            </div>

            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className="rounded-2xl border border-white/15 bg-black/20 p-4"
              >
                <div className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
                  Featured Item {num}
                </div>
                <div className="space-y-3">
                  <input
                    type="text"
                    value={form[`featured_item_${num}_title` as keyof HomepageForm] as string}
                    onChange={(e) =>
                      updateField(
                        `featured_item_${num}_title` as keyof HomepageForm,
                        e.target.value as HomepageForm[keyof HomepageForm]
                      )
                    }
                    className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                    placeholder="Title"
                  />
                  <textarea
                    rows={2}
                    value={form[`featured_item_${num}_text` as keyof HomepageForm] as string}
                    onChange={(e) =>
                      updateField(
                        `featured_item_${num}_text` as keyof HomepageForm,
                        e.target.value as HomepageForm[keyof HomepageForm]
                      )
                    }
                    className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                    placeholder="Description"
                  />
                </div>
              </div>
            ))}

            {[1, 2, 3].map((num) => (
              <div key={num}>
                <label className="mb-2 block text-sm font-bold text-zinc-200">
                  Quote {num}
                </label>
                <input
                  type="text"
                  value={form[`quote_${num}` as keyof HomepageForm] as string}
                  onChange={(e) =>
                    updateField(
                      `quote_${num}` as keyof HomepageForm,
                      e.target.value as HomepageForm[keyof HomepageForm]
                    )
                  }
                  className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                />
              </div>
            ))}

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

            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-full bg-blue-600 px-6 py-3 font-bold text-white hover:bg-blue-500 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-blue-400">
            Preview
          </p>
          <div className="mt-6 overflow-hidden rounded-3xl border border-white/15 bg-black/20">
            <img
              src={form.hero_image_url || "/hero.jpg"}
              alt="Homepage hero preview"
              className="h-[220px] w-full object-cover"
            />
          </div>
          <h2 className="mt-6 text-3xl font-black">{form.hero_headline}</h2>
          <p className="mt-4 text-zinc-200">{form.hero_subtext}</p>
        </div>
      </div>
    </div>
  );
}
