"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type ContactForm = {
  phone: string;
  phone_href: string;
  address_line_1: string;
  address_line_2: string;
  monday_hours: string;
  tuesday_hours: string;
  wednesday_hours: string;
  thursday_hours: string;
  friday_hours: string;
  saturday_hours: string;
  sunday_hours: string;
  holiday_note: string;
};

const DEFAULT_FORM: ContactForm = {
  phone: "(613) 382-1515",
  phone_href: "tel:+16133821515",
  address_line_1: "87 King Street East",
  address_line_2: "Gananoque, Ontario",
  monday_hours: "11:00 AM – 9:00 PM",
  tuesday_hours: "11:00 AM – 9:00 PM",
  wednesday_hours: "11:00 AM – 9:00 PM",
  thursday_hours: "11:00 AM – 9:00 PM",
  friday_hours: "11:00 AM – 10:00 PM",
  saturday_hours: "11:00 AM – 10:00 PM",
  sunday_hours: "12:00 PM – 8:00 PM",
  holiday_note: "Hours may vary on holidays — call ahead to confirm.",
};

export default function AdminContactPage() {
  const [form, setForm] = useState<ContactForm>(DEFAULT_FORM);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [statusText, setStatusText] = useState("");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    async function loadContact() {
      try {
        const response = await fetch("/api/admin/contact", {
          method: "GET",
          cache: "no-store",
        });

        const payload = await response.json();

        if (!response.ok) {
          throw new Error(payload?.error || "Could not load contact content.");
        }

        setForm({
          phone: payload.phone || DEFAULT_FORM.phone,
          phone_href: payload.phone_href || DEFAULT_FORM.phone_href,
          address_line_1: payload.address_line_1 || DEFAULT_FORM.address_line_1,
          address_line_2: payload.address_line_2 || DEFAULT_FORM.address_line_2,
          monday_hours: payload.monday_hours || DEFAULT_FORM.monday_hours,
          tuesday_hours: payload.tuesday_hours || DEFAULT_FORM.tuesday_hours,
          wednesday_hours: payload.wednesday_hours || DEFAULT_FORM.wednesday_hours,
          thursday_hours: payload.thursday_hours || DEFAULT_FORM.thursday_hours,
          friday_hours: payload.friday_hours || DEFAULT_FORM.friday_hours,
          saturday_hours: payload.saturday_hours || DEFAULT_FORM.saturday_hours,
          sunday_hours: payload.sunday_hours || DEFAULT_FORM.sunday_hours,
          holiday_note: payload.holiday_note || DEFAULT_FORM.holiday_note,
        });
      } catch (error) {
        console.error(error);
        setErrorText(
          error instanceof Error ? error.message : "Could not load contact content."
        );
      } finally {
        setLoading(false);
      }
    }

    loadContact();
  }, []);

  function updateField<K extends keyof ContactForm>(key: K, value: ContactForm[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setStatusText("");
    setErrorText("");
  }

  async function handleSave() {
    setSaving(true);
    setStatusText("");
    setErrorText("");

    try {
      const response = await fetch("/api/admin/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Could not save contact content.");
      }

      setStatusText("Contact page updated successfully.");
    } catch (error) {
      console.error(error);
      setErrorText(
        error instanceof Error ? error.message : "Could not save contact content."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-3xl border border-white/15 bg-white/10 p-8 text-zinc-200">
        Loading contact editor...
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
          <h1 className="mt-3 text-4xl font-black uppercase">Contact & Hours</h1>
        </div>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/dashboard"
            className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/15"
          >
            Back to Dashboard
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-white/20 bg-white/10 px-5 py-3 font-bold text-white hover:bg-white/15"
          >
            View Live Page
          </Link>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-3xl border border-white/15 bg-white/10 p-6 shadow-lg shadow-black/20">
          <div className="space-y-6">
            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-200">
                Display phone number
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => updateField("phone", e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-200">
                Phone link
              </label>
              <input
                type="text"
                value={form.phone_href}
                onChange={(e) => updateField("phone_href", e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                placeholder="tel:+16133821515"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-200">
                Address line 1
              </label>
              <input
                type="text"
                value={form.address_line_1}
                onChange={(e) => updateField("address_line_1", e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-200">
                Address line 2
              </label>
              <input
                type="text"
                value={form.address_line_2}
                onChange={(e) => updateField("address_line_2", e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
              />
            </div>

            {[
              ["monday_hours", "Monday"],
              ["tuesday_hours", "Tuesday"],
              ["wednesday_hours", "Wednesday"],
              ["thursday_hours", "Thursday"],
              ["friday_hours", "Friday"],
              ["saturday_hours", "Saturday"],
              ["sunday_hours", "Sunday"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-bold text-zinc-200">
                  {label} hours
                </label>
                <input
                  type="text"
                  value={form[key as keyof ContactForm] as string}
                  onChange={(e) =>
                    updateField(
                      key as keyof ContactForm,
                      e.target.value as ContactForm[keyof ContactForm]
                    )
                  }
                  className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
                />
              </div>
            ))}

            <div>
              <label className="mb-2 block text-sm font-bold text-zinc-200">
                Holiday note
              </label>
              <textarea
                rows={3}
                value={form.holiday_note}
                onChange={(e) => updateField("holiday_note", e.target.value)}
                className="w-full rounded-2xl border border-white/15 bg-black/30 px-4 py-3 text-white outline-none"
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

          <div className="mt-6 space-y-6">
            <div className="rounded-3xl border border-white/15 bg-black/20 p-6">
              <h2 className="text-xl font-black text-blue-400">Phone</h2>
              <div className="mt-3 text-2xl font-bold text-white">{form.phone}</div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-black/20 p-6">
              <h2 className="text-xl font-black text-blue-400">Address</h2>
              <div className="mt-3 text-zinc-200">
                <div>{form.address_line_1}</div>
                <div>{form.address_line_2}</div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/15 bg-black/20 p-6">
              <h2 className="text-xl font-black text-blue-400">Hours</h2>
              <div className="mt-4 space-y-2 text-zinc-200">
                <div className="flex justify-between"><span>Monday</span><span>{form.monday_hours}</span></div>
                <div className="flex justify-between"><span>Tuesday</span><span>{form.tuesday_hours}</span></div>
                <div className="flex justify-between"><span>Wednesday</span><span>{form.wednesday_hours}</span></div>
                <div className="flex justify-between"><span>Thursday</span><span>{form.thursday_hours}</span></div>
                <div className="flex justify-between"><span>Friday</span><span>{form.friday_hours}</span></div>
                <div className="flex justify-between"><span>Saturday</span><span>{form.saturday_hours}</span></div>
                <div className="flex justify-between"><span>Sunday</span><span>{form.sunday_hours}</span></div>
              </div>

              <div className="mt-6 rounded-2xl border border-blue-400/20 bg-blue-500/10 p-4 text-sm text-blue-100">
                {form.holiday_note}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
