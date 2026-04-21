"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useCart } from "../components/CartProvider";

type Product = {
  id: number;
  name: string;
  price: number;
  image: string;
  description?: string;
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from("products").select("*");

      if (error) {
        console.error("Supabase fetch error:", error.message);
      } else {
        setProducts(data || []);
      }

      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          padding: "60px 24px",
          maxWidth: "1400px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: "42px", marginBottom: "20px", color: "#111827" }}>
          Our Products
        </h1>
        <p style={{ color: "#6b7280", fontSize: "18px" }}>Loading products...</p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "48px 24px 70px",
      }}
    >
      <div style={{ marginBottom: "30px" }}>
        <h1
          style={{
            fontSize: "44px",
            fontWeight: 800,
            color: "#111827",
            margin: 0,
          }}
        >
          Our Products
        </h1>

        <p
          style={{
            marginTop: "10px",
            fontSize: "17px",
            color: "#6b7280",
          }}
        >
          Premium household cleaning products for everyday use.
        </p>
      </div>

      {products.length === 0 ? (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "20px",
            padding: "30px",
            color: "#6b7280",
            fontSize: "18px",
          }}
        >
          No products found.
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "26px",
          }}
        >
          {products.map((product) => (
            <div
              key={product.id}
              style={{
                background: "#ffffff",
                border: "1px solid #e5e7eb",
                borderRadius: "22px",
                padding: "16px",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                transition: "0.2s",
              }}
            >
              <div
                style={{
                  width: "100%",
                  height: "240px",
                  borderRadius: "18px",
                  overflow: "hidden",
                  background: "#f3f4f6",
                  marginBottom: "16px",
                }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>

              <h2
                style={{
                  fontSize: "24px",
                  fontWeight: 700,
                  color: "#111827",
                  margin: "0 0 8px 0",
                }}
              >
                {product.name}
              </h2>

              <p
                style={{
                  color: "#6b7280",
                  fontSize: "15px",
                  lineHeight: 1.5,
                  minHeight: "42px",
                  marginBottom: "14px",
                }}
              >
                {product.description || "High-quality cleaning product for daily use."}
              </p>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    fontSize: "30px",
                    fontWeight: 800,
                    color: "#111827",
                  }}
                >
                  ₹{product.price}
                </div>

                <button
                  onClick={() => addToCart(product)}
                  style={{
                    border: "none",
                    borderRadius: "14px",
                    background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
                    color: "#fff",
                    padding: "13px 18px",
                    fontSize: "15px",
                    fontWeight: 700,
                    cursor: "pointer",
                    boxShadow: "0 10px 20px rgba(37,99,235,0.25)",
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}