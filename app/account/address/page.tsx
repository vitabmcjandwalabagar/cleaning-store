"use client";

import { useEffect, useState } from "react";

type AddressForm = {
  full_name: string;
  phone: string;
  pincode: string;
  house_no: string;
  area: string;
  landmark: string;
  city: string;
  state: string;
};

const emptyAddress: AddressForm = {
  full_name: "",
  phone: "",
  pincode: "",
  house_no: "",
  area: "",
  landmark: "",
  city: "",
  state: "",
};

export default function AddressPage() {
  const [form, setForm] = useState<AddressForm>(emptyAddress);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    loadAddress();
  }, []);

  async function loadAddress() {
    try {
      const res = await fetch("/api/profile/address");
      const result = await res.json();

      if (res.ok && result.profile) {
        setForm({
          full_name: result.profile.full_name || "",
          phone: result.profile.phone || "",
          pincode: result.profile.pincode || "",
          house_no: result.profile.house_no || "",
          area: result.profile.area || "",
          landmark: result.profile.landmark || "",
          city: result.profile.city || "",
          state: result.profile.state || "",
        });
      }
    } catch {}
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/profile/address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await res.json();

      if (!res.ok) {
        setMessage(result.error || "Failed to save address.");
        return;
      }

      setMessage("Address saved successfully.");
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Your Addresses</h1>

      <form
        onSubmit={handleSave}
        className="bg-white border rounded-3xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Full name</label>
          <input
            name="full_name"
            value={form.full_name}
            onChange={handleChange}
            className="w-full border rounded-2xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Mobile number</label>
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-2xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Pincode</label>
          <input
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            className="w-full border rounded-2xl px-4 py-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Flat, House no., Building, Company, Apartment
          </label>
          <input
            name="house_no"
            value={form.house_no}
            onChange={handleChange}
            className="w-full border rounded-2xl px-4 py-3"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">
            Area, Street, Sector, Village
          </label>
          <textarea
            name="area"
            value={form.area}
            onChange={handleChange}
            className="w-full border rounded-2xl px-4 py-3 min-h-[110px]"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-2">Landmark</label>
          <input
            name="landmark"
            value={form.landmark}
            onChange={handleChange}
            className="w-full border rounded-2xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Town/City/District
          </label>
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            className="w-full border rounded-2xl px-4 py-3"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">State</label>
          <input
            name="state"
            value={form.state}
            onChange={handleChange}
            className="w-full border rounded-2xl px-4 py-3"
          />
        </div>

        {message && (
          <div className="md:col-span-2">
            <p className="text-sm text-red-600">{message}</p>
          </div>
        )}

        <div className="md:col-span-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white px-6 py-3 rounded-2xl font-medium"
          >
            {loading ? "Saving..." : "Save Address"}
          </button>
        </div>
      </form>
    </div>
  );
}