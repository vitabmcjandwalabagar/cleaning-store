"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AddToCartButton from "../../components/AddToCartButton";
import { supabase } from "../../supabase";

type Product = {
  id: number;
  name: string;
  price: number;
  description?: string;
  image?: string;
};

export default function SingleProductPage() {
  const params = useParams();
  const router = useRouter();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchProduct();
  }, []);

  async function fetchProduct() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", Number(params.id))
      .single();

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setProduct(data as Product);
    setLoading(false);
  }

  function handleBuyNow() {
    if (!product) return;

    const cartItem = {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      quantity: 1,
    };

    const existing = JSON.parse(
      localStorage.getItem("cleaning_store_cart") || "[]"
    );

    const found = existing.find((item: { id: number; quantity: number }) => item.id === product.id);

    if (found) {
      found.quantity += 1;
    } else {
      existing.push(cartItem);
    }

    localStorage.setItem("cleaning_store_cart", JSON.stringify(existing));
    window.dispatchEvent(new Event("cartUpdated"));

    router.push("/checkout");
  }

  function handleWhatsApp() {
    if (!product) return;

    const messageText = `Hello, I want to order:

Product: ${product.name}
Price: ₹${product.price}`;

    const url = `https://wa.me/918199829557?text=${encodeURIComponent(messageText)}`;
    window.open(url, "_blank");
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
          Loading product...
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6">
          {message || "Product not found"}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-md p-6 md:p-10">
        <div className="grid md:grid-cols-2 gap-10 items-start">
          <div>
            {product.image ? (
              <img
                src={product.image}
                alt={product.name}
                className="w-full max-w-md rounded-2xl border border-gray-200 object-cover"
              />
            ) : (
              <div className="w-full max-w-md h-[350px] bg-gray-200 rounded-2xl flex items-center justify-center text-gray-500">
                No Image
              </div>
            )}
          </div>

          <div>
            <h1 className="text-4xl font-bold mb-3">{product.name}</h1>

            <p className="text-3xl font-semibold text-blue-700 mb-4">
              ₹{product.price}
            </p>

            <p className="text-gray-600 text-lg mb-8">
              {product.description || "No description available"}
            </p>

            <div className="flex flex-wrap gap-3">
              <AddToCartButton
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
              />

              <button
                onClick={handleBuyNow}
                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-semibold"
              >
                Buy Now
              </button>

              <button
                onClick={handleWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl font-semibold"
              >
                Order on WhatsApp
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}