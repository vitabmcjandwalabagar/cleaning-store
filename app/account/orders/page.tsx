"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/app/lib/supabase/client";

type OrderItem = {
  id?: number;
  name: string;
  quantity: number;
  price: number;
};

type Order = {
  id: number;
  customer_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;

  user_email?: string | null;

  address?: string | null;
  address_line1?: string | null;
  address_line2?: string | null;
  city?: string | null;
  state?: string | null;
  pincode?: string | null;

  payment_method: string | null;
  order_status: string | null;
  subtotal: number | null;
  total_amount: number | null;
  created_at: string;
  items: OrderItem[] | null;
};

export default function AccountOrdersPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const lastOrder = localStorage.getItem("lastOrder");

    if (lastOrder) {
      try {
        const parsed = JSON.parse(lastOrder);
        if (parsed?.email) {
          setEmail(parsed.email);
          fetchOrders(parsed.email);
        }
      } catch (error) {
        console.error("lastOrder parse error:", error);
      }
    }
  }, []);

  async function fetchOrders(targetEmail: string) {
    if (!targetEmail.trim()) {
      setErrorMessage("Please enter your email.");
      setMessage("");
      return;
    }

    setLoading(true);
    setErrorMessage("");
    setMessage("");

    const safeEmail = targetEmail.trim();

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .or(`customer_email.eq.${safeEmail},user_email.eq.${safeEmail}`)
      .order("id", { ascending: false });

    if (error) {
      console.error("Fetch account orders error:", error);
      setErrorMessage(error.message);
      setOrders([]);
      setLoading(false);
      return;
    }

    const safeOrders = (data || []) as Order[];
    setOrders(safeOrders);

    if (safeOrders.length === 0) {
      setMessage("No orders found for this email.");
    }

    setLoading(false);
  }

  function getOrderAddress(order: Order) {
    if (order.address && order.address.trim()) return order.address;

    return [
      order.address_line1 || "",
      order.address_line2 || "",
      order.city || "",
      order.state || "",
      order.pincode || "",
    ]
      .filter((part) => part && String(part).trim().length > 0)
      .join(", ");
  }

  function getEmail(order: Order) {
    return order.customer_email || order.user_email || "-";
  }

  function getStatusBadgeClass(status: string | null) {
    const value = (status || "Pending").toLowerCase();

    if (value === "delivered") return "bg-green-100 text-green-700";
    if (value === "cancelled") return "bg-red-100 text-red-700";
    if (value === "pending payment") return "bg-orange-100 text-orange-700";
    if (value === "processing" || value === "confirmed" || value === "shipped")
      return "bg-blue-100 text-blue-700";

    return "bg-yellow-100 text-yellow-700";
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <section className="border-b border-gray-200 bg-gradient-to-b from-white to-[#f6f8fb]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              Customer Order Tracking
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
              My
              <span className="block text-blue-600">Orders</span>
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg">
              Apne email ke through orders dekho, status track karo aur order details check karo.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Find Your Orders</h2>
              <p className="mt-1 text-sm text-gray-500">
                Checkout me use ki hui email enter karke orders dekho.
              </p>
            </div>

            <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-black md:w-[320px]"
              />

              <button
                onClick={() => fetchOrders(email)}
                className="rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
              >
                Check Orders
              </button>
            </div>
          </div>

          {errorMessage ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {message ? (
            <div className="mt-5 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-medium text-blue-700">
              {message}
            </div>
          ) : null}
        </div>

        <div className="mt-6">
          {loading ? (
            <div className="rounded-[28px] bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
              Loading orders...
            </div>
          ) : orders.length === 0 ? (
            <div className="rounded-[28px] bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
              <div className="text-5xl">📦</div>
              <h3 className="mt-4 text-2xl font-bold text-gray-900">No orders to show</h3>
              <p className="mt-2 text-gray-500">
                Email enter karke apne orders check karo.
              </p>
            </div>
          ) : (
            <div className="space-y-5">
              {orders.map((order) => {
                const addressText = getOrderAddress(order);

                return (
                  <div
                    key={order.id}
                    className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-2xl font-bold text-gray-900">
                            Order #{order.id}
                          </h2>

                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusBadgeClass(
                              order.order_status
                            )}`}
                          >
                            {order.order_status || "Pending"}
                          </span>

                          <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700">
                            {order.payment_method || "COD"}
                          </span>
                        </div>

                        <div className="mt-2 text-sm text-gray-500">
                          Ordered on {new Date(order.created_at).toLocaleString()}
                        </div>

                        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                          <div className="rounded-2xl bg-gray-50 p-4">
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Customer Name
                            </div>
                            <div className="mt-2 text-base font-bold text-gray-900">
                              {order.customer_name || "Guest Customer"}
                            </div>
                          </div>

                          <div className="rounded-2xl bg-gray-50 p-4">
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Email
                            </div>
                            <div className="mt-2 break-all text-base font-bold text-gray-900">
                              {getEmail(order)}
                            </div>
                          </div>

                          <div className="rounded-2xl bg-gray-50 p-4">
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Phone
                            </div>
                            <div className="mt-2 text-base font-bold text-gray-900">
                              {order.customer_phone || "-"}
                            </div>
                          </div>

                          <div className="rounded-2xl bg-gray-50 p-4 md:col-span-2 xl:col-span-2">
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Delivery Address
                            </div>
                            <div className="mt-2 text-base font-bold leading-7 text-gray-900">
                              {addressText || "-"}
                            </div>
                          </div>

                          <div className="rounded-2xl bg-gray-50 p-4">
                            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                              Total Amount
                            </div>
                            <div className="mt-2 text-2xl font-extrabold text-gray-900">
                              ₹{Number(order.total_amount || order.subtotal || 0).toFixed(2)}
                            </div>
                          </div>
                        </div>

                        <div className="mt-6 rounded-[24px] border border-gray-200 p-4">
                          <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-lg font-bold text-gray-900">Ordered Items</h3>
                            <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-bold text-gray-700">
                              {order.items?.length || 0} items
                            </span>
                          </div>

                          <div className="space-y-3">
                            {order.items && order.items.length > 0 ? (
                              order.items.map((item, index) => (
                                <div
                                  key={index}
                                  className="flex flex-col gap-2 rounded-2xl bg-gray-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                                >
                                  <div>
                                    <div className="text-base font-bold text-gray-900">
                                      {item.name}
                                    </div>
                                    <div className="mt-1 text-sm text-gray-500">
                                      Qty: {item.quantity} × ₹{Number(item.price).toFixed(2)}
                                    </div>
                                  </div>

                                  <div className="text-lg font-extrabold text-blue-600">
                                    ₹{(Number(item.quantity) * Number(item.price)).toFixed(2)}
                                  </div>
                                </div>
                              ))
                            ) : (
                              <div className="rounded-2xl bg-gray-50 px-4 py-4 text-sm text-gray-500">
                                No item details found.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="w-full lg:max-w-[260px]">
                        <div className="rounded-[24px] border border-gray-200 p-5">
                          <h3 className="text-lg font-bold text-gray-900">Order Summary</h3>

                          <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>Payment Method</span>
                              <span className="font-semibold text-gray-900">
                                {order.payment_method || "COD"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>Status</span>
                              <span className="font-semibold text-gray-900">
                                {order.order_status || "Pending"}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-sm text-gray-600">
                              <span>Total Items</span>
                              <span className="font-semibold text-gray-900">
                                {order.items?.reduce(
                                  (sum, item) => sum + Number(item.quantity || 0),
                                  0
                                ) || 0}
                              </span>
                            </div>

                            <div className="border-t border-dashed border-gray-200 pt-3">
                              <div className="flex items-center justify-between">
                                <span className="text-base font-semibold text-gray-900">
                                  Grand Total
                                </span>
                                <span className="text-2xl font-extrabold text-gray-900">
                                  ₹{Number(order.total_amount || order.subtotal || 0).toFixed(2)}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}