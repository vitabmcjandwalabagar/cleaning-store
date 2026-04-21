"use client";

import { useEffect, useState } from "react";
import { useCart } from "../components/CartProvider";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, cartTotal, clearCart } = useCart();

  const [user, setUser] = useState<any>(null);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [pincode, setPincode] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [landmark, setLandmark] = useState("");
  const [city, setCity] = useState("");
  const [stateName, setStateName] = useState("");
  const [addressType, setAddressType] = useState("Home");
  const [deliveryInstructions, setDeliveryInstructions] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const loadUser = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error || !data.user) {
        router.push("/login");
        return;
      }

      setUser(data.user);
    };

    loadUser();
  }, [router]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!fullName.trim()) newErrors.fullName = "Full name is required";
    if (!phone.trim()) newErrors.phone = "Mobile number is required";
    else if (!/^[0-9]{10}$/.test(phone.trim()))
      newErrors.phone = "Enter a valid 10 digit mobile number";

    if (!pincode.trim()) newErrors.pincode = "Pincode is required";
    else if (!/^[0-9]{6}$/.test(pincode.trim()))
      newErrors.pincode = "Enter a valid 6 digit pincode";

    if (!addressLine1.trim())
      newErrors.addressLine1 = "House / Flat / Building is required";

    if (!addressLine2.trim())
      newErrors.addressLine2 = "Area / Street / Locality is required";

    if (!city.trim()) newErrors.city = "City is required";
    if (!stateName.trim()) newErrors.stateName = "State is required";

    if (!paymentMethod.trim())
      newErrors.paymentMethod = "Please select a payment method";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      alert("Please login first.");
      router.push("/login");
      return;
    }

    if (cartItems.length === 0) {
      alert("Your cart is empty.");
      return;
    }

    if (!validateForm()) {
      return;
    }

    try {
      setPlacingOrder(true);

      const payload = {
        user_id: user.id,
        full_name: fullName,
        customer_email: user.email || "",
        phone: phone,
        pincode: pincode,
        address_line1: addressLine1,
        address_line2: addressLine2,
        landmark: landmark,
        city: city,
        state: stateName,
        address_type: addressType,
        delivery_instructions: deliveryInstructions,
        payment_method: paymentMethod,
        items: cartItems,
        total_amount: cartTotal,
        status: paymentMethod === "COD" ? "Pending" : "Payment Pending",
      };

      const { error } = await supabase.from("orders").insert([payload]);

      if (error) {
        console.error("Order insert error:", error);
        alert(error.message);
        return;
      }

      clearCart();
      alert("Order placed successfully.");
      router.push("/my-orders");
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Something went wrong while placing order.");
    } finally {
      setPlacingOrder(false);
    }
  };

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
          marginBottom: "28px",
          color: "#111827",
        }}
      >
        Checkout
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1.5fr 1fr",
          gap: "26px",
        }}
      >
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "22px",
            padding: "24px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
          }}
        >
          <h2 style={sectionTitle}>Shipping Address</h2>

          <div style={grid2}>
            <div>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Full Name *"
                style={input}
              />
              {errors.fullName && <p style={errorText}>{errors.fullName}</p>}
            </div>

            <div>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Mobile Number *"
                style={input}
              />
              {errors.phone && <p style={errorText}>{errors.phone}</p>}
            </div>
          </div>

          <div style={{ marginBottom: "14px" }}>
            <input
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              placeholder="Pincode *"
              style={input}
            />
            {errors.pincode && <p style={errorText}>{errors.pincode}</p>}
          </div>

          <div style={{ marginBottom: "14px" }}>
            <input
              value={addressLine1}
              onChange={(e) => setAddressLine1(e.target.value)}
              placeholder="Flat, House no., Building, Company, Apartment *"
              style={input}
            />
            {errors.addressLine1 && <p style={errorText}>{errors.addressLine1}</p>}
          </div>

          <div style={{ marginBottom: "14px" }}>
            <input
              value={addressLine2}
              onChange={(e) => setAddressLine2(e.target.value)}
              placeholder="Area, Street, Sector, Village *"
              style={input}
            />
            {errors.addressLine2 && <p style={errorText}>{errors.addressLine2}</p>}
          </div>

          <div style={{ marginBottom: "14px" }}>
            <input
              value={landmark}
              onChange={(e) => setLandmark(e.target.value)}
              placeholder="Landmark"
              style={input}
            />
          </div>

          <div style={grid2}>
            <div>
              <input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Town / City *"
                style={input}
              />
              {errors.city && <p style={errorText}>{errors.city}</p>}
            </div>

            <div>
              <input
                value={stateName}
                onChange={(e) => setStateName(e.target.value)}
                placeholder="State *"
                style={input}
              />
              {errors.stateName && <p style={errorText}>{errors.stateName}</p>}
            </div>
          </div>

          <div style={{ marginTop: "18px", marginBottom: "18px" }}>
            <h3 style={smallTitle}>Address Type</h3>

            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <button
                type="button"
                onClick={() => setAddressType("Home")}
                style={addressType === "Home" ? activeChip : chip}
              >
                Home
              </button>

              <button
                type="button"
                onClick={() => setAddressType("Work")}
                style={addressType === "Work" ? activeChip : chip}
              >
                Work
              </button>

              <button
                type="button"
                onClick={() => setAddressType("Other")}
                style={addressType === "Other" ? activeChip : chip}
              >
                Other
              </button>
            </div>
          </div>

          <div>
            <h3 style={smallTitle}>Delivery Instructions</h3>
            <textarea
              value={deliveryInstructions}
              onChange={(e) => setDeliveryInstructions(e.target.value)}
              placeholder="Any delivery notes for rider"
              style={textarea}
            />
          </div>

          <div style={{ marginTop: "24px" }}>
            <h2 style={sectionTitle}>Payment Method</h2>

            <div
              style={{
                display: "grid",
                gap: "12px",
              }}
            >
              <label style={paymentBox}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="COD"
                  checked={paymentMethod === "COD"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span style={{ marginLeft: "10px" }}>Cash on Delivery</span>
              </label>

              <label style={paymentBox}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="Online"
                  checked={paymentMethod === "Online"}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span style={{ marginLeft: "10px" }}>Online Payment</span>
              </label>
            </div>

            {errors.paymentMethod && (
              <p style={{ ...errorText, marginTop: "10px" }}>
                {errors.paymentMethod}
              </p>
            )}
          </div>
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
          <h2 style={sectionTitle}>Order Summary</h2>

          {cartItems.length === 0 ? (
            <p style={{ color: "#6b7280" }}>No items in cart.</p>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  marginBottom: "12px",
                  fontSize: "15px",
                  color: "#374151",
                }}
              >
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))
          )}

          <hr style={{ margin: "18px 0", borderColor: "#e5e7eb" }} />

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "18px",
            }}
          >
            <span style={{ fontSize: "18px", color: "#374151" }}>Total</span>
            <span style={{ fontSize: "28px", fontWeight: 800, color: "#111827" }}>
              ₹{cartTotal}
            </span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={placingOrder}
            style={{
              width: "100%",
              padding: "14px 16px",
              border: "none",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #2563eb, #1d4ed8)",
              color: "#fff",
              fontSize: "16px",
              fontWeight: 700,
              cursor: placingOrder ? "not-allowed" : "pointer",
              opacity: placingOrder ? 0.7 : 1,
            }}
          >
            {placingOrder ? "Placing Order..." : "Place Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

const sectionTitle: React.CSSProperties = {
  fontSize: "28px",
  color: "#111827",
  marginTop: 0,
  marginBottom: "18px",
};

const smallTitle: React.CSSProperties = {
  fontSize: "18px",
  color: "#111827",
  marginTop: 0,
  marginBottom: "10px",
};

const grid2: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "14px",
  marginBottom: "14px",
};

const input: React.CSSProperties = {
  width: "100%",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
};

const textarea: React.CSSProperties = {
  width: "100%",
  minHeight: "110px",
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  outline: "none",
  boxSizing: "border-box",
  resize: "vertical",
};

const chip: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: "999px",
  border: "1px solid #d1d5db",
  background: "#fff",
  cursor: "pointer",
  fontWeight: 600,
};

const activeChip: React.CSSProperties = {
  padding: "10px 16px",
  borderRadius: "999px",
  border: "1px solid #2563eb",
  background: "#eff6ff",
  color: "#2563eb",
  cursor: "pointer",
  fontWeight: 700,
};

const paymentBox: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  padding: "14px 16px",
  border: "1px solid #d1d5db",
  borderRadius: "14px",
  cursor: "pointer",
  fontSize: "15px",
  color: "#111827",
};

const errorText: React.CSSProperties = {
  color: "#dc2626",
  fontSize: "13px",
  marginTop: "6px",
  marginBottom: 0,
};