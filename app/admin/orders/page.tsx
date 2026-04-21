"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

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
  full_name?: string;
  customer_name?: string;
  customer_email?: string;
  phone?: string;
  pincode?: string;
  address?: string;
  address_line1?: string;
  address_line2?: string;
  landmark?: string;
  city?: string;
  state?: string;
  address_type?: string;
  delivery_instructions?: string;
  payment_method?: string;
  items: OrderItem[];
  total_amount: number;
  status: string;
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [routeStatus, setRouteStatus] = useState<string>("");

  const fetchOrders = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Fetch orders error:", error);
      alert("Orders load failed: " + error.message);
      setLoading(false);
      return;
    }

    setOrders((data as Order[]) || []);
    setLoading(false);
  };

  const checkRoute = async () => {
    try {
      const res = await fetch("/api/admin/orders/update-status");
      const result = await res.json();
      setRouteStatus(JSON.stringify(result));
      console.log("Route check:", result);
    } catch (error) {
      console.error("Route check failed:", error);
      setRouteStatus("Route check failed");
    }
  };

  useEffect(() => {
    fetchOrders();
    checkRoute();
  }, []);

  const handleStatusUpdate = async (orderId: number, newStatus: string) => {
    try {
      setUpdatingId(orderId);

      const response = await fetch("/api/admin/orders/update-status", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          status: newStatus,
        }),
      });

      const result = await response.json();
      console.log("Update API result:", result);

      if (!response.ok || !result.ok) {
        alert(result.error || "Status update failed");
        setUpdatingId(null);
        return;
      }

      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );

      alert("Order status updated successfully");
    } catch (error) {
      console.error("Status update error:", error);
      alert("Something went wrong while updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusStyle = (status: string): React.CSSProperties => {
    const s = (status || "").toLowerCase();

    if (s === "pending") return { background: "#fef3c7", color: "#92400e" };
    if (s === "confirmed") return { background: "#dbeafe", color: "#1d4ed8" };
    if (s === "shipped") return { background: "#e0e7ff", color: "#4338ca" };
    if (s === "delivered") return { background: "#dcfce7", color: "#166534" };
    if (s === "cancelled") return { background: "#fee2e2", color: "#b91c1c" };

    return { background: "#f3f4f6", color: "#374151" };
  };

  if (loading) {
    return <div style={{ padding: "30px" }}>Loading admin orders...</div>;
  }

  return (
    <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "30px 24px 60px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "24px",
          flexWrap: "wrap",
          gap: "12px",
        }}
      >
        <h1 style={{ fontSize: "38px", fontWeight: 800, margin: 0 }}>
          Admin Orders
        </h1>

        <div style={{ display: "flex", gap: "10px" }}>
          <button onClick={checkRoute} style={refreshBtn}>
            Check Route
          </button>
          <button onClick={fetchOrders} style={refreshBtn}>
            Refresh Orders
          </button>
        </div>
      </div>

      <div
        style={{
          marginBottom: "20px",
          padding: "12px 14px",
          background: "#f9fafb",
          border: "1px solid #e5e7eb",
          borderRadius: "12px",
          fontSize: "14px",
          color: "#374151",
          wordBreak: "break-word",
        }}
      >
        <strong>Route Status:</strong> {routeStatus || "Checking..."}
      </div>

      {orders.length === 0 ? (
        <div style={emptyBox}>No orders found.</div>
      ) : (
        <div style={{ display: "grid", gap: "18px" }}>
          {orders.map((order) => {
            const statusStyle = getStatusStyle(order.status);

            return (
              <div key={order.id} style={card}>
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
                    <h2 style={{ margin: 0, fontSize: "24px", color: "#111827" }}>
                      Order #{order.id}
                    </h2>
                    <p style={{ margin: "8px 0 0", color: "#6b7280" }}>
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

                    <div style={{ fontSize: "26px", fontWeight: 800, color: "#111827" }}>
                      ₹{order.total_amount}
                    </div>
                  </div>
                </div>

                <div style={section}>
                  <h3 style={sectionTitle}>Customer Details</h3>
                  <div style={infoGrid}>
                    <div><strong>Name:</strong> {order.full_name || order.customer_name || "-"}</div>
                    <div><strong>Email:</strong> {order.customer_email || "-"}</div>
                    <div><strong>Phone:</strong> {order.phone || "-"}</div>
                    <div><strong>Payment:</strong> {order.payment_method || "-"}</div>
                    <div><strong>Address Type:</strong> {order.address_type || "-"}</div>
                    <div><strong>Pincode:</strong> {order.pincode || "-"}</div>
                  </div>
                </div>

                <div style={section}>
                  <h3 style={sectionTitle}>Update Status</h3>

                  <select
                    value={order.status || "Pending"}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    disabled={updatingId === order.id}
                    style={selectStyle}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Confirmed">Confirmed</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>

                  {updatingId === order.id && (
                    <p style={{ marginTop: "10px", color: "#2563eb" }}>
                      Updating status...
                    </p>
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

const card: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "22px",
  padding: "22px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
};

const section: React.CSSProperties = {
  marginTop: "18px",
};

const sectionTitle: React.CSSProperties = {
  margin: "0 0 10px 0",
  color: "#111827",
  fontSize: "20px",
};

const infoGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "10px",
  color: "#374151",
};

const selectStyle: React.CSSProperties = {
  padding: "12px 14px",
  borderRadius: "12px",
  border: "1px solid #d1d5db",
  fontSize: "15px",
  minWidth: "220px",
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

const emptyBox: React.CSSProperties = {
  background: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "18px",
  padding: "30px",
  color: "#6b7280",
  fontSize: "18px",
};