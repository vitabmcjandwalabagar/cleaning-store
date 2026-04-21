"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../../lib/supabase/client";

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

const STATUS_OPTIONS = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Out for Delivery",
  "Delivered",
  "Cancelled",
  "Pending Payment",
];

export default function OwnerOrdersPage() {

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchOrderId, setSearchOrderId] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [statusMap, setStatusMap] = useState<Record<number, string>>({});
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function fetchOrders() {
    setLoading(true);
    setErrorMessage("");
    setMessage("");

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    if (error) {
      console.error("Owner orders fetch error:", error);
      setErrorMessage(error.message);
      setLoading(false);
      return;
    }

    const safeOrders = (data || []) as Order[];
    setOrders(safeOrders);

    const initialStatusMap: Record<number, string> = {};
    safeOrders.forEach((order) => {
      initialStatusMap[order.id] = order.order_status || "Pending";
    });
    setStatusMap(initialStatusMap);

    setLoading(false);
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesOrderId = searchOrderId.trim()
        ? String(order.id).includes(searchOrderId.trim())
        : true;

      const emailToCheck = (
        order.customer_email ||
        order.user_email ||
        ""
      ).toLowerCase();

      const matchesEmail = searchEmail.trim()
        ? emailToCheck.includes(searchEmail.trim().toLowerCase())
        : true;

      const currentStatus = (order.order_status || "Pending").toLowerCase();

      const matchesStatus =
        statusFilter === "All"
          ? true
          : currentStatus === statusFilter.toLowerCase();

      return matchesOrderId && matchesEmail && matchesStatus;
    });
  }, [orders, searchOrderId, searchEmail, statusFilter]);

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

  async function updateOrderStatus(orderId: number) {
    const newStatus = statusMap[orderId];

    if (!newStatus) return;

    setUpdatingId(orderId);
    setErrorMessage("");
    setMessage("");

    const { error } = await supabase
      .from("orders")
      .update({ order_status: newStatus })
      .eq("id", orderId);

    if (error) {
      console.error("Order status update error:", error);
      setErrorMessage(error.message);
      setUpdatingId(null);
      return;
    }

    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, order_status: newStatus } : order
      )
    );

    setMessage(`Order #${orderId} status updated to ${newStatus}.`);
    setUpdatingId(null);
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <section className="border-b border-gray-200 bg-gradient-to-b from-white to-[#f6f8fb]">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-14">
          <div className="max-w-3xl">
            <div className="mb-3 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              Admin Order Control
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-5xl">
              Owner
              <span className="block text-blue-600">Orders Panel</span>
            </h1>

            <p className="mt-4 text-base leading-7 text-gray-600 md:text-lg">
              Sabhi placed orders yahan dekho, search karo, filter karo aur order
              status update karo.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 md:px-6 md:py-10">
        <div className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Filters & Search</h2>
              <p className="mt-1 text-sm text-gray-500">
                Order ID, customer email aur status ke basis par search karo.
              </p>
            </div>

            <button
              onClick={fetchOrders}
              className="rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:opacity-90"
            >
              Refresh Orders
            </button>
          </div>

          {errorMessage ? (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
              {errorMessage}
            </div>
          ) : null}

          {message ? (
            <div className="mt-5 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
              {message}
            </div>
          ) : null}

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Search by Order ID
              </label>
              <input
                type="text"
                value={searchOrderId}
                onChange={(e) => setSearchOrderId(e.target.value)}
                placeholder="Enter order id"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Search by Customer Email
              </label>
              <input
                type="text"
                value={searchEmail}
                onChange={(e) => setSearchEmail(e.target.value)}
                placeholder="Enter email"
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-gray-700">
                Filter by Status
              </label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
              >
                <option value="All">All</option>
                {STATUS_OPTIONS.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Total Orders
            </div>
            <div className="mt-1 text-2xl font-extrabold text-gray-900">
              {orders.length}
            </div>
          </div>

          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Filtered
            </div>
            <div className="mt-1 text-2xl font-extrabold text-gray-900">
              {filteredOrders.length}
            </div>
          </div>

          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Pending
            </div>
            <div className="mt-1 text-2xl font-extrabold text-yellow-600">
              {
                orders.filter(
                  (o) => (o.order_status || "Pending").toLowerCase() === "pending"
                ).length
              }
            </div>
          </div>

          <div className="rounded-2xl bg-white px-4 py-3 shadow-sm ring-1 ring-black/5">
            <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
              Delivered
            </div>
            <div className="mt-1 text-2xl font-extrabold text-green-600">
              {
                orders.filter(
                  (o) => (o.order_status || "").toLowerCase() === "delivered"
                ).length
              }
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-5">
          {loading ? (
            <div className="rounded-[28px] bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
              Loading orders...
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="rounded-[28px] bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
              <div className="text-5xl">📦</div>
              <h3 className="mt-4 text-2xl font-bold text-gray-900">No orders found</h3>
              <p className="mt-2 text-gray-500">
                Search ya filters change karke dubara try karo.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => {
              const selectedStatus = statusMap[order.id] || order.order_status || "Pending";
              const addressText = getOrderAddress(order);

              return (
                <div
                  key={order.id}
                  className="rounded-[28px] bg-white p-6 shadow-sm ring-1 ring-black/5"
                >
                  <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
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
                        {new Date(order.created_at).toLocaleString()}
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
                            Customer Email
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

                    <div className="w-full xl:max-w-[320px]">
                      <div className="rounded-[24px] border border-gray-200 p-5">
                        <h3 className="text-lg font-bold text-gray-900">Update Status</h3>
                        <p className="mt-1 text-sm text-gray-500">
                          Order status select karke update karo.
                        </p>

                        <div className="mt-4 space-y-3">
                          <select
                            value={selectedStatus}
                            onChange={(e) =>
                              setStatusMap((prev) => ({
                                ...prev,
                                [order.id]: e.target.value,
                              }))
                            }
                            className="w-full rounded-2xl border border-gray-200 px-4 py-3 outline-none focus:border-black"
                          >
                            {STATUS_OPTIONS.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>

                          <button
                            onClick={() => updateOrderStatus(order.id)}
                            disabled={updatingId === order.id}
                            className="flex w-full items-center justify-center rounded-2xl bg-black px-5 py-3 text-sm font-bold text-white transition hover:opacity-90 disabled:opacity-50"
                          >
                            {updatingId === order.id ? "Updating..." : "Update Status"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}