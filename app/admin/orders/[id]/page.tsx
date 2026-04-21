"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../supabase";

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

type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  product_name: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export default function AdminOrderDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const [order, setOrder] = useState<Order | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchOrder();
  }, []);

  async function fetchOrder() {
    setLoading(true);
    setMessage("");

    const orderId = Number(params.id);

    const { data: orderData, error: orderError } = await supabase
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (orderError) {
      setMessage(orderError.message);
      setLoading(false);
      return;
    }

    const { data: itemsData, error: itemsError } = await supabase
      .from("order_items")
      .select("*")
      .eq("order_id", orderId)
      .order("id", { ascending: true });

    if (itemsError) {
      setMessage(itemsError.message);
      setLoading(false);
      return;
    }

    setOrder(orderData as Order);
    setItems((itemsData || []) as OrderItem[]);
    setLoading(false);
  }

  function formatDate(date: string) {
    return new Date(date).toLocaleString();
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <p>Loading order...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <p>{message || "Order not found"}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
          <h1 className="text-3xl md:text-4xl font-bold">
            Order Details #{order.id}
          </h1>

          <Link
            href="/admin/orders"
            className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-xl font-medium"
          >
            Back
          </Link>
        </div>

        {message && (
          <div className="mb-4 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm">
            {message}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Items</h2>

            {items.length === 0 ? (
              <p className="text-gray-600">No items found.</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b bg-gray-50">
                      <th className="text-left p-3">Product</th>
                      <th className="text-left p-3">Price</th>
                      <th className="text-left p-3">Qty</th>
                      <th className="text-left p-3">Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item: OrderItem) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-3">{item.product_name}</td>
                        <td className="p-3">₹{item.price}</td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3 font-semibold">₹{item.subtotal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Customer Info</h2>

            <div className="space-y-3 text-sm">
              <div>
                <span className="font-semibold">Name:</span> {order.customer_name}
              </div>
              <div>
                <span className="font-semibold">Phone:</span>{" "}
                {order.customer_phone || "-"}
              </div>
              <div>
                <span className="font-semibold">Email:</span>{" "}
                {order.customer_email || "-"}
              </div>
              <div>
                <span className="font-semibold">Address:</span> {order.address || "-"}
              </div>
              <div>
                <span className="font-semibold">City:</span> {order.city || "-"}
              </div>
              <div>
                <span className="font-semibold">State:</span> {order.state || "-"}
              </div>
              <div>
                <span className="font-semibold">Pincode:</span> {order.pincode || "-"}
              </div>
              <div>
                <span className="font-semibold">Payment Method:</span>{" "}
                {order.payment_method || "cod"}
              </div>
              <div>
                <span className="font-semibold">Payment Status:</span>{" "}
                {order.payment_status || "pending"}
              </div>
              <div>
                <span className="font-semibold">Order Status:</span>{" "}
                {order.order_status || "pending"}
              </div>
              <div>
                <span className="font-semibold">Created At:</span>{" "}
                {formatDate(order.created_at)}
              </div>
              <div className="pt-3 text-lg font-bold">
                Total: ₹{order.total_amount}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}