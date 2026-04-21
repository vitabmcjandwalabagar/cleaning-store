"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabase/client";

const initialForm = {
  name: "",
  description: "",
  price: "",
  category: "",
  stock: "",
  is_active: true,
  image: "",
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [message, setMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("FETCH ERROR:", error);
      setMessage("Products load nahi hue: " + error.message);
      setProducts([]);
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0] ? e.target.files[0] : null;
    setSelectedFile(file);
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setSelectedFile(null);
    setMessage("");
  };

 const uploadImageToSupabase = async (file) => {
  const fileExt = file.name.split(".").pop();
  const fileName = `product-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2)}.${fileExt}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from("product-images")
    .upload(fileName, file, {
      cacheControl: "3600",
      upsert: false,
    });

  console.log("UPLOAD DATA:", uploadData);
  console.log("UPLOAD ERROR:", uploadError);

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data: publicUrlData } = supabase.storage
    .from("product-images")
    .getPublicUrl(uploadData.path);

  console.log("PUBLIC URL DATA:", publicUrlData);

  if (!publicUrlData || !publicUrlData.publicUrl) {
    throw new Error("Public URL generate nahi hui.");
  }

  return publicUrlData.publicUrl;
};
  const removeImageByUrl = async (imageUrl) => {
    try {
      if (!imageUrl) return;

      const marker = "/storage/v1/object/public/product-images/";
      const index = imageUrl.indexOf(marker);

      if (index === -1) return;

      const filePath = imageUrl.substring(index + marker.length);

      if (!filePath) return;

      const { error } = await supabase.storage
        .from("product-images")
        .remove([filePath]);

      if (error) {
        console.warn("Old image delete warning:", error.message);
      }
    } catch (err) {
      console.warn("Old image delete skipped:", err);
    }
  };

  const handleEdit = (product) => {
    setEditingId(product.id);
    setSelectedFile(null);

    setForm({
      name: product.name || "",
      description: product.description || "",
      price: product.price != null ? String(product.price) : "",
      category: product.category || "",
      stock: product.stock != null ? String(product.stock) : "",
      is_active: product.is_active !== false,
      image: product.image || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (product) => {
    const ok = window.confirm(`"${product.name}" ko delete karna hai?`);
    if (!ok) return;

    setMessage("");

    const { data, error } = await supabase
      .from("products")
      .delete()
      .eq("id", product.id)
      .select();

    if (error) {
      console.error("DELETE ERROR:", error);
      setMessage("Delete nahi hua: " + error.message);
      return;
    }

    if (!data || data.length === 0) {
      setMessage("Delete command chali but koi row delete nahi hui.");
      return;
    }

    if (product.image) {
      await removeImageByUrl(product.image);
    }

    setMessage("Product deleted successfully.");
    fetchProducts();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.name.trim()) {
      setMessage("Product name required hai.");
      return;
    }

    if (!form.price.trim()) {
      setMessage("Price required hai.");
      return;
    }

    const numericPrice = Number(form.price);
    const numericStock = Number(form.stock || 0);

    if (Number.isNaN(numericPrice)) {
      setMessage("Price valid number hona chahiye.");
      return;
    }

    if (Number.isNaN(numericStock)) {
      setMessage("Stock valid number hona chahiye.");
      return;
    }

    setSaving(true);

    try {
      let imageUrl = form.image;

      if (selectedFile) {
        setUploading(true);
        imageUrl = await uploadImageToSupabase(selectedFile);
        setUploading(false);
      }

      if (editingId) {
        const oldProduct = products.find((p) => p.id === editingId);

        const { data, error } = await supabase
          .from("products")
          .update({
            name: form.name.trim(),
            description: form.description.trim(),
            price: numericPrice,
            category: form.category.trim(),
            stock: numericStock,
            is_active: form.is_active,
            image: imageUrl || null,
          })
          .eq("id", editingId)
          .select();

        if (error) {
          throw new Error(error.message);
        }

        if (!data || data.length === 0) {
          throw new Error("Update command chali but koi row update nahi hui.");
        }

        if (selectedFile && oldProduct && oldProduct.image && oldProduct.image !== imageUrl) {
          await removeImageByUrl(oldProduct.image);
        }

        setMessage("Product updated successfully.");
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert([
            {
              name: form.name.trim(),
              description: form.description.trim(),
              price: numericPrice,
              category: form.category.trim(),
              stock: numericStock,
              is_active: form.is_active,
              image: imageUrl || null,
            },
          ])
          .select();

        if (error) {
          throw new Error(error.message);
        }

        if (!data || data.length === 0) {
          throw new Error("Insert command chali but row return nahi hui.");
        }

        setMessage("Product added successfully.");
      }

      resetForm();
      await fetchProducts();
    } catch (err) {
      console.error("SAVE ERROR:", err);
      setMessage(err && err.message ? err.message : "Save failed.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const getPreviewImage = () => {
    if (selectedFile) {
      return URL.createObjectURL(selectedFile);
    }
    if (form.image) {
      return form.image;
    }
    return "";
  };

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Admin Products
          </h1>
          <p className="text-gray-500 mt-2">
            Product add, edit, delete aur image upload yahin se manage karo.
          </p>
        </div>

        {message && (
          <div className="mb-6 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700 shadow-sm">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="xl:col-span-1">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 md:p-8 sticky top-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingId ? "Edit Product" : "Add Product"}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Product Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Enter product name"
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    placeholder="Enter description"
                    rows={4}
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Price
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="Enter price"
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Category
                  </label>
                  <input
                    type="text"
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Example: Cleaner"
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={form.stock}
                    onChange={handleChange}
                    placeholder="Enter stock"
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Upload Image
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Or Image URL
                  </label>
                  <input
                    type="text"
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="Paste image URL if needed"
                    className="w-full rounded-2xl border border-gray-300 px-4 py-3 outline-none focus:ring-2 focus:ring-black"
                  />
                </div>

                {getPreviewImage() && (
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      Preview
                    </label>
                    <img
                      src={getPreviewImage()}
                      alt="Preview"
                      className="w-full h-52 object-cover rounded-2xl border"
                      onError={(e) => {
                        e.currentTarget.src =
                          "https://placehold.co/600x400?text=No+Preview";
                      }}
                    />
                  </div>
                )}

                <label className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    name="is_active"
                    checked={form.is_active}
                    onChange={handleChange}
                    className="h-4 w-4"
                  />
                  <span className="text-sm font-medium">Active Product</span>
                </label>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    type="submit"
                    disabled={saving || uploading}
                    className="flex-1 rounded-2xl bg-black text-white px-6 py-3 font-semibold hover:opacity-90 disabled:opacity-60"
                  >
                    {saving
                      ? uploading
                        ? "Uploading..."
                        : "Saving..."
                      : editingId
                      ? "Update Product"
                      : "Add Product"}
                  </button>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 rounded-2xl bg-gray-200 text-gray-800 px-6 py-3 font-semibold hover:bg-gray-300"
                  >
                    Reset
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="xl:col-span-2">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-6 py-5 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  All Products
                </h2>
              </div>

              {loading ? (
                <div className="p-6 text-gray-500">Loading products...</div>
              ) : products.length === 0 ? (
                <div className="p-6 text-gray-500">Abhi koi product nahi hai.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1000px]">
                    <thead className="bg-gray-100">
                      <tr className="text-left text-gray-700">
                        <th className="px-6 py-4 font-semibold">Image</th>
                        <th className="px-6 py-4 font-semibold">Name</th>
                        <th className="px-6 py-4 font-semibold">Category</th>
                        <th className="px-6 py-4 font-semibold">Price</th>
                        <th className="px-6 py-4 font-semibold">Stock</th>
                        <th className="px-6 py-4 font-semibold">Status</th>
                        <th className="px-6 py-4 font-semibold">Description</th>
                        <th className="px-6 py-4 font-semibold text-center">
                          Actions
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {products.map((product) => (
                        <tr
                          key={product.id}
                          className="border-t border-gray-200 hover:bg-gray-50"
                        >
                          <td className="px-6 py-4">
                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-16 h-16 rounded-xl object-cover border"
                                onError={(e) => {
                                  e.currentTarget.src =
                                    "https://placehold.co/200x200?text=No+Image";
                                }}
                              />
                            ) : (
                              <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center text-xs text-gray-400 border">
                                No Image
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-4 font-semibold text-gray-900">
                            {product.name}
                          </td>

                          <td className="px-6 py-4 text-gray-700">
                            {product.category || "General"}
                          </td>

                          <td className="px-6 py-4 text-gray-700">
                            ₹{Number(product.price || 0)}
                          </td>

                          <td className="px-6 py-4 text-gray-700">
                            {Number(product.stock || 0)}
                          </td>

                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                product.is_active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {product.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-gray-600 max-w-xs">
                            <div className="line-clamp-2">
                              {product.description || "No description"}
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center justify-center gap-3">
                              <button
                                onClick={() => handleEdit(product)}
                                className="rounded-xl bg-blue-500 text-white px-4 py-2 font-medium hover:opacity-90"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => handleDelete(product)}
                                className="rounded-xl bg-red-500 text-white px-4 py-2 font-medium hover:opacity-90"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}