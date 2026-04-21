"use client";

import { useEffect, useState } from "react";
import { supabase } from "../../supabase";

type Product = {
  id: number;
  name: string;
  price: number;
  description: string;
  image: string;
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setProducts((data || []) as Product[]);
    setLoading(false);
  }

  async function uploadImage(): Promise<string> {
    if (!imageFile) return "";

    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `products/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("product-images")
      .upload(filePath, imageFile);

    if (uploadError) {
      throw new Error(uploadError.message);
    }

    const { data } = supabase.storage
      .from("product-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage("");

    try {
      let imageUrl = "";

      if (imageFile) {
        imageUrl = await uploadImage();
      }

      if (editingId !== null) {
        const oldProduct = products.find((item) => item.id === editingId);

        const { error } = await supabase
          .from("products")
          .update({
            name: name.trim(),
            price: Number(price),
            description: description.trim(),
            image: imageUrl || oldProduct?.image || "",
          })
          .eq("id", editingId);

        if (error) {
          throw new Error(error.message);
        }

        setMessage("Product updated successfully");
      } else {
        const { error } = await supabase.from("products").insert([
          {
            name: name.trim(),
            price: Number(price),
            description: description.trim(),
            image: imageUrl,
          },
        ]);

        if (error) {
          throw new Error(error.message);
        }

        setMessage("Product added successfully");
      }

      resetForm();
      fetchProducts();
    } catch (error: unknown) {
      if (error instanceof Error) {
        setMessage(error.message);
      } else {
        setMessage("Something went wrong");
      }
    }
  }

  function handleEdit(product: Product) {
    setEditingId(product.id);
    setName(product.name);
    setPrice(String(product.price));
    setDescription(product.description || "");
    setImageFile(null);
    setMessage("");

    const fileInput = document.getElementById("image") as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleDelete(id: number) {
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    const { error } = await supabase.from("products").delete().eq("id", id);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Product deleted successfully");
    fetchProducts();
  }

  function resetForm() {
    setEditingId(null);
    setName("");
    setPrice("");
    setDescription("");
    setImageFile(null);

    const fileInput = document.getElementById("image") as HTMLInputElement | null;
    if (fileInput) {
      fileInput.value = "";
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Products Management</h1>

        <div className="bg-white rounded-2xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {editingId !== null ? "Edit Product" : "Add New Product"}
          </h2>

          <form onSubmit={handleSubmit} className="grid gap-4">
            <input
              type="text"
              placeholder="Product name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              type="number"
              placeholder="Price"
              value={price}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPrice(e.target.value)}
              required
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <textarea
              placeholder="Description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setDescription(e.target.value)
              }
              rows={4}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
            />

            <input
              id="image"
              type="file"
              accept="image/*"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                if (e.target.files && e.target.files[0]) {
                  setImageFile(e.target.files[0]);
                }
              }}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white"
            />

            <div className="flex gap-3 flex-wrap">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold"
              >
                {editingId !== null ? "Update Product" : "Add Product"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-3 rounded-xl font-semibold"
                >
                  Cancel
                </button>
              )}
            </div>

            {message && (
              <p className="text-sm font-medium text-gray-700 mt-2">{message}</p>
            )}
          </form>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">All Products</h2>
            <button
              onClick={fetchProducts}
              className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-xl font-medium"
            >
              Refresh
            </button>
          </div>

          {loading ? (
            <p className="text-gray-600">Loading products...</p>
          ) : products.length === 0 ? (
            <p className="text-gray-600">No products found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product: Product) => (
                <div
                  key={product.id}
                  className="border border-gray-200 rounded-2xl overflow-hidden bg-gray-50 shadow-sm"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-52 object-cover"
                    />
                  ) : (
                    <div className="w-full h-52 bg-gray-200 flex items-center justify-center text-gray-500">
                      No Image
                    </div>
                  )}

                  <div className="p-4">
                    <h3 className="text-xl font-bold mb-2">{product.name}</h3>
                    <p className="text-blue-700 font-semibold mb-2">₹{product.price}</p>
                    <p className="text-gray-600 text-sm min-h-[40px]">
                      {product.description}
                    </p>

                    <div className="flex gap-3 mt-4">
                      <button
                        onClick={() => handleEdit(product)}
                        className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-xl font-semibold"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(product.id)}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl font-semibold"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}