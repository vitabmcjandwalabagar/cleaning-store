"use client";

import Link from "next/link";
import { useCart } from "../components/CartProvider";

export default function CartPage() {
  const {
    cartItems,
    removeFromCart,
    increaseQuantity,
    decreaseQuantity,
    cartTotal,
  } = useCart();

  return (
    <div
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "40px 24px 70px",
      }}
    >
      <h1
        style={{
          fontSize: "42px",
          fontWeight: 800,
          color: "#111827",
          marginBottom: "28px",
        }}
      >
        My Cart
      </h1>

      {cartItems.length === 0 ? (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "22px",
            padding: "40px",
            textAlign: "center",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
          }}
        >
          <h2 style={{ fontSize: "28px", marginBottom: "10px", color: "#111827" }}>
            Your cart is empty
          </h2>
          <p style={{ color: "#6b7280", fontSize: "17px", marginBottom: "20px" }}>
            Add some products to continue shopping.
          </p>
          <Link href="/products" style={primaryLink}>
            Shop Now
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.7fr 1fr",
            gap: "26px",
          }}
        >
          <div>
            {cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  gap: "18px",
                  alignItems: "center",
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "22px",
                  padding: "18px",
                  marginBottom: "18px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                }}
              >
                <img
                  src={item.image}
                  alt={item.name}
                  style={{
                    width: "140px",
                    height: "140px",
                    objectFit: "cover",
                    borderRadius: "18px",
                    background: "#f3f4f6",
                  }}
                />

                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      fontSize: "24px",
                      margin: "0 0 10px 0",
                      color: "#111827",
                    }}
                  >
                    {item.name}
                  </h2>

                  <p style={{ fontSize: "17px", color: "#374151", margin: "0 0 8px 0" }}>
                    Price: ₹{item.price}
                  </p>

                  <p style={{ fontSize: "17px", color: "#374151", margin: 0 }}>
                    Subtotal: ₹{item.price * item.quantity}
                  </p>

                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginTop: "16px",
                      flexWrap: "wrap",
                    }}
                  >
                    <button onClick={() => decreaseQuantity(item.id)} style={qtyBtn}>
                      -
                    </button>

                    <span
                      style={{
                        minWidth: "44px",
                        textAlign: "center",
                        fontWeight: 700,
                        fontSize: "16px",
                      }}
                    >
                      {item.quantity}
                    </span>

                    <button onClick={() => increaseQuantity(item.id)} style={qtyBtn}>
                      +
                    </button>

                    <button onClick={() => removeFromCart(item.id)} style={removeBtn}>
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div
            style={{
              background: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "22px",
              padding: "24px",
              height: "fit-content",
              boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
            }}
          >
            <h2
              style={{
                fontSize: "28px",
                color: "#111827",
                marginTop: 0,
                marginBottom: "18px",
              }}
            >
              Order Summary
            </h2>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "12px",
                color: "#374151",
                fontSize: "17px",
              }}
            >
              <span>Items</span>
              <span>{cartItems.reduce((sum, item) => sum + item.quantity, 0)}</span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "18px",
                color: "#374151",
                fontSize: "17px",
              }}
            >
              <span>Total</span>
              <span style={{ fontWeight: 800, fontSize: "24px", color: "#111827" }}>
                ₹{cartTotal}
              </span>
            </div>

            <Link href="/checkout" style={checkoutBtn}>
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

const primaryLink: React.CSSProperties = {
  display: "inline-block",
  padding: "14px 22px",
  background: "#2563eb",
  color: "#fff",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 700,
};

const checkoutBtn: React.CSSProperties = {
  display: "block",
  width: "100%",
  textAlign: "center",
  padding: "14px 18px",
  background: "linear-gradient(135deg, #16a34a, #15803d)",
  color: "#fff",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 700,
  marginTop: "14px",
};

const qtyBtn: React.CSSProperties = {
  border: "none",
  background: "#2563eb",
  color: "#fff",
  width: "38px",
  height: "38px",
  borderRadius: "10px",
  cursor: "pointer",
  fontSize: "20px",
  fontWeight: 700,
};

const removeBtn: React.CSSProperties = {
  border: "none",
  background: "#ef4444",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: "10px",
  cursor: "pointer",
  fontWeight: 700,
  marginLeft: "8px",
};