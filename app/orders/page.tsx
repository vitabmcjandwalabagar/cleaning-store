"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase/client";
import { useAuth } from "../components/AuthProvider";

type OrderRow = {
  id: number;
  customer_name: string | null;
  phone: string | null;
  address: string | null;
  total_amount: number | null;
  payment_method: string | null;
  status: string | null;
  created_at: string | null;
  items: any[] | null;
};

export default function OrdersPage() {
  const router = useRouter();
  const { user, authReady } = useAuth();

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authReady && !user) {
      router.replace("/login");
      return;
    }

    if (authReady && user) {
      fetchOrders(user.id);
    }
  }, [authReady, user, router]);

  const fetchOrders = async (userId: string) => {
    setLoading(true);

    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("user_id", userId)
      .order("id", { ascending: false });

    if (error) {
      console.error(error.message);
      setOrders([]);
      setLoading(false);
      return;
    }

    setOrders((data as OrderRow[]) || []);
    setLoading(false);
  };

  if (!authReady) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          My Orders
        </h1>
        <p className="text-gray-500 mb-8">Aapke placed orders yahan dikhenge.</p>

        {loading ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-gray-500">
            Loading...
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-gray-500">
            No orders found.
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Order #{order.id}
                    </h2>
                    <p className="text-gray-500">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : "-"}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="font-semibold">₹{Number(order.total_amount || 0)}</p>
                    <p className="text-sm text-gray-500">{order.payment_method || "COD"}</p>
                    <p className="text-sm font-semibold text-blue-600">
                      {order.status || "pending"}
                    </p>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <p><strong>Name:</strong> {order.customer_name || "-"}</p>
                  <p><strong>Phone:</strong> {order.phone || "-"}</p>
                  <p><strong>Address:</strong> {order.address || "-"}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}