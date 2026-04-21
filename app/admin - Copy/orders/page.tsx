"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../supabase";

type Order = {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  order_status: string;
  created_at: string;
};

const orderStatuses = [
  "pending",
  "confirmed",
  "packed",
  "shipped",
  "delivered",
  "cancelled",
];

const paymentStatuses = ["pending", "paid", "failed", "refunded"];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("id", { ascending: false });

    console.log("ORDERS DATA:", data);
    console.log("ORDERS ERROR:", error);

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    setOrders((data || []) as Order[]);
    setLoading(false);
  }

  async function updateOrderStatus(id: number, value: string) {
    const { error } = await supabase
      .from("orders")
      .update({ order_status: value })
      .eq("id", id);

    console.log("UPDATE ORDER STATUS ERROR:", error);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Order status updated");
    fetchOrders();
  }

  async function updatePaymentStatus(id: number, value: string) {
    const { error } = await supabase
      .from("orders")
      .update({ payment_status: value })
      .eq("id", id);

    console.log("UPDATE PAYMENT STATUS ERROR:", error);

    if (error) {
      setMessage(error.message);
      return;
    }

    setMessage("Payment status updated");
    fetchOrders();
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <h1 className="text-3xl md:text-4xl font-bold">Orders Management</h1>

          <button
            onClick={fetchOrders}
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-xl font-medium"
          >
            Refresh
          </button>
        </div>

        {message && (
          <div className="mb-4 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-red-600">
            {message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-md p-6">
          {loading ? (
            <p className="text-gray-600">Loading orders...</p>
          ) : orders.length === 0 ? (
            <p className="text-gray-600">No orders found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse min-w-[1100px]">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="text-left p-3">Order ID</th>
                    <th className="text-left p-3">Customer</th>
                    <th className="text-left p-3">Phone</th>
                    <th className="text-left p-3">Amount</th>
                    <th className="text-left p-3">Payment</th>
                    <th className="text-left p-3">Order Status</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order: Order) => (
                    <tr key={order.id} className="border-b align-top">
                      <td className="p-3 font-semibold">#{order.id}</td>
                      <td className="p-3">
                        <div className="font-semibold">{order.customer_name}</div>
                        <div className="text-sm text-gray-500">
                          {order.customer_email || "-"}
                        </div>
                      </td>
                      <td className="p-3">{order.customer_phone || "-"}</td>
                      <td className="p-3 font-semibold">₹{order.total_amount}</td>

                      <td className="p-3">
                        <div className="text-sm mb-2">
                          Method: {order.payment_method || "cod"}
                        </div>
                        <select
                          value={order.payment_status || "pending"}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            updatePaymentStatus(order.id, e.target.value)
                          }
                          className="border border-gray-300 rounded-lg px-3 py-2"
                        >
                          {paymentStatuses.map((status: string) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-3">
                        <select
                          value={order.order_status || "pending"}
                          onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                            updateOrderStatus(order.id, e.target.value)
                          }
                          className="border border-gray-300 rounded-lg px-3 py-2"
                        >
                          {orderStatuses.map((status: string) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="p-3 text-sm text-gray-600">
                        {formatDate(order.created_at)}
                      </td>

                      <td className="p-3">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-semibold"
                        >
                          View
                        </Link>
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