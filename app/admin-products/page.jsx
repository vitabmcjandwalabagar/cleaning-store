"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");

    if (!isAdmin) {
      window.location.href = "/admin-login";
      return;
    }

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error(error.message);
      alert("Products load nahi hue");
    } else {
      setProducts(data || []);
    }

    setLoading(false);
  };

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: "",
      image: "",
      description: "",
    });
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.price) {
      alert("Name aur price required hai");
      return;
    }

    if (editingId) {
      const { error } = await supabase
        .from("products")
        .update({
          name: form.name,
          price: Number(form.price),
          image: form.image,
          description: form.description,
        })
        .eq("id", editingId);

      if (error) {
        console.error(error.message);
        alert("Product update nahi hua");
        return;
      }

      alert("Product updated successfully");
    } else {
      const { error } = await supabase.from("products").insert([
        {
          name: form.name,
          price: Number(form.price),
          image: form.image,
          description: form.description,
        },
      ]);

      if (error) {
        console.error(error.message);
        alert("Product add nahi hua");
        return;
      }

      alert("Product added successfully");
    }

    resetForm();
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm({
      name: product.name || "",
      price: product.price || "",
      image: product.image || "",
      description: product.description || "",
    });
    setEditingId(product.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    const ok = window.confirm("Kya aap pakka is product ko delete karna chahte ho?");
    if (!ok) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      console.error(error.message);
      alert("Delete nahi hua");
      return;
    }

    alert("Product deleted successfully");
    fetchProducts();
  };

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = "/admin-login";
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 md:px-8 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Admin Products
            </h1>
            <p className="text-gray-500 mt-2">
              Add, edit aur delete products yahan se manage karo
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-5 py-3 rounded-xl font-semibold hover:opacity-90 transition"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingId ? "Edit Product" : "Add Product"}
          </h2>

          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="name"
              placeholder="Product Name"
              value={form.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={form.price}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
              required
            />

            <input
              type="text"
              name="image"
              placeholder="Image URL"
              value={form.image}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />

            <textarea
              name="description"
              placeholder="Description"
              value={form.description}
              onChange={handleChange}
              rows="4"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-black"
            />

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 transition"
              >
                {editingId ? "Update Product" : "Add Product"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-800 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 transition"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h2 className="text-2xl font-bold">All Products</h2>
          </div>

          {loading ? (
            <div className="p-6 text-gray-500">Loading products...</div>
          ) : products.length === 0 ? (
            <div className="p-6 text-gray-500">Abhi koi product nahi hai.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead className="bg-gray-100">
                  <tr className="text-left text-gray-700">
                    <th className="px-6 py-4 font-semibold">Image</th>
                    <th className="px-6 py-4 font-semibold">Name</th>
                    <th className="px-6 py-4 font-semibold">Price</th>
                    <th className="px-6 py-4 font-semibold">Description</th>
                    <th className="px-6 py-4 font-semibold text-center">Actions</th>
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
                            className="w-16 h-16 object-cover rounded-xl border"
                          />
                        ) : (
                          <div className="w-16 h-16 rounded-xl bg-gray-200 flex items-center justify-center text-xs text-gray-500">
                            No Image
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {product.name}
                      </td>

                      <td className="px-6 py-4 text-gray-700">₹{product.price}</td>

                      <td className="px-6 py-4 text-gray-600 max-w-md">
                        {product.description || "No description"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(product.id)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg font-medium hover:opacity-90 transition"
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
  );
}