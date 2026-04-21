"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";
import { useRouter } from "next/navigation";

type OrderItem = {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

type Order = {
  id: number;
  created_at: string;
  status: string;
  total_amount: number;
  items: OrderItem[];
  full_name?: string;
  phone?: string;
  pincode?: string;
  address_line1?: string;
  address_line2?: string;
  landmark?: string;
  city?: string;
  state?: string;
  address_type?: string;
  delivery_instructions?: string;
  payment_method?: string;
};

export default function MyOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = useCallback(async () => {
    const { data: userData, error: userError } = await supabase.auth.getUser();

    if (userError || !userData.user) {
      router.push("/login");
      return;
    }

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userData.user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Orders fetch error:", error.message);
    } else {
      setOrders((data as Order[]) || []);
    }

    setLoading(false);
  }, [router]);

  useEffect(() => {
    fetchOrders();

    const channel = supabase
      .channel("my-orders-live")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        async () => {
          await fetchOrders();
        }
      )
      .subscribe();

    const interval = setInterval(() => {
      fetchOrders();
    }, 5000);

    return () => {
      supabase.removeChannel(channel);
      clearInterval(interval);
    };
  }, [fetchOrders]);

  const getStatusStyle = (status: string) => {
    const value = (status || "").toLowerCase();

    if (value === "pending") {
      return {
        background: "#fef3c7",
        color: "#92400e",
      };
    }

    if (value === "confirmed") {
      return {
        background: "#dbeafe",
        color: "#1d4ed8",
      };
    }

    if (value === "shipped") {
      return {
        background: "#e0e7ff",
        color: "#4338ca",
      };
    }

    if (value === "delivered") {
      return {
        background: "#dcfce7",
        color: "#166534",
      };
    }

    if (value === "cancelled") {
      return {
        background: "#fee2e2",
        color: "#b91c1c",
      };
    }

    return {
      background: "#f3f4f6",
      color: "#374151",
    };
  };

  return (
    <div
      style={{
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "40px 24px 70px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "14px",
          flexWrap: "wrap",
          marginBottom: "28px",
        }}
      >
        <h1
          style={{
            fontSize: "42px",
            fontWeight: 800,
            color: "#111827",
            margin: 0,
          }}
        >
          My Orders
        </h1>

        <button onClick={fetchOrders} style={refreshBtn}>
          Refresh
        </button>
      </div>

      {loading ? (
        <p style={{ color: "#6b7280", fontSize: "17px" }}>Loading orders...</p>
      ) : orders.length === 0 ? (
        <div
          style={{
            background: "#fff",
            border: "1px solid #e5e7eb",
            borderRadius: "22px",
            padding: "36px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
          }}
        >
          <h2 style={{ fontSize: "28px", marginBottom: "10px", color: "#111827" }}>
            No orders yet
          </h2>
          <p style={{ color: "#6b7280", marginBottom: "20px" }}>
            You have not placed any order yet.
          </p>
          <Link href="/products" style={shopBtn}>
            Start Shopping
          </Link>
        </div>
      ) : (
        <div style={{ display: "grid", gap: "20px" }}>
          {orders.map((order) => {
            const statusStyle = getStatusStyle(order.status);

            return (
              <div
                key={order.id}
                style={{
                  background: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "22px",
                  padding: "22px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "16px",
                    flexWrap: "wrap",
                    marginBottom: "18px",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        margin: 0,
                        fontSize: "24px",
                        color: "#111827",
                      }}
                    >
                      Order #{order.id}
                    </h2>
                    <p style={{ margin: "8px 0 0 0", color: "#6b7280" }}>
                      {new Date(order.created_at).toLocaleString()}
                    </p>
                  </div>

                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        display: "inline-block",
                        padding: "8px 14px",
                        borderRadius: "999px",
                        fontWeight: 700,
                        fontSize: "14px",
                        marginBottom: "8px",
                        ...statusStyle,
                      }}
                    >
                      {order.status || "Pending"}
                    </div>

                    <div
                      style={{
                        fontSize: "26px",
                        fontWeight: 800,
                        color: "#111827",
                      }}
                    >
                      ₹{order.total_amount}
                    </div>
                  </div>
                </div>

                <div style={{ marginBottom: "16px" }}>
                  <h3 style={{ marginBottom: "10px", color: "#111827" }}>Items</h3>

                  <div style={{ display: "grid", gap: "12px" }}>
                    {order.items?.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          gap: "12px",
                          padding: "12px 14px",
                          background: "#f9fafb",
                          borderRadius: "14px",
                        }}
                      >
                        <span style={{ color: "#374151" }}>
                          {item.name} x {item.quantity}
                        </span>
                        <span style={{ fontWeight: 700, color: "#111827" }}>
                          ₹{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: "12px",
                  }}
                >
                  <div
                    style={{
                      background: "#f9fafb",
                      borderRadius: "14px",
                      padding: "14px",
                      color: "#374151",
                    }}
                  >
                    <strong>Delivery Address:</strong>{" "}
                    {order.address_line1 || ""}
                    {order.address_line2 ? `, ${order.address_line2}` : ""}
                    {order.landmark ? `, ${order.landmark}` : ""}
                    {order.city ? `, ${order.city}` : ""}
                    {order.state ? `, ${order.state}` : ""}
                    {order.pincode ? ` - ${order.pincode}` : ""}
                  </div>

                  <div
                    style={{
                      background: "#f9fafb",
                      borderRadius: "14px",
                      padding: "14px",
                      color: "#374151",
                    }}
                  >
                    <strong>Payment:</strong> {order.payment_method || "Not set"} |{" "}
                    <strong>Address Type:</strong> {order.address_type || "Not set"}
                  </div>

                  {order.delivery_instructions && (
                    <div
                      style={{
                        background: "#f9fafb",
                        borderRadius: "14px",
                        padding: "14px",
                        color: "#374151",
                      }}
                    >
                      <strong>Delivery Instructions:</strong>{" "}
                      {order.delivery_instructions}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

const shopBtn: React.CSSProperties = {
  display: "inline-block",
  padding: "14px 22px",
  background: "#2563eb",
  color: "#fff",
  borderRadius: "14px",
  textDecoration: "none",
  fontWeight: 700,
};

const refreshBtn: React.CSSProperties = {
  border: "none",
  background: "#111827",
  color: "#fff",
  padding: "12px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 700,
};