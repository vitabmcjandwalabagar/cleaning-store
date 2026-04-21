"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase/client";

type ProductRow = {
  id: number;
  name: string;
  stock: number | null;
  is_active: boolean | null;
};

type OrderRow = {
  id: number;
  customer_name: string | null;
  total_amount: number | null;
  status: string | null;
  created_at: string | null;
};

export default function AdminDashboardPage() {
  const [loading, setLoading] = useState<boolean>(true);

  const [stats, setStats] = useState({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState<OrderRow[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<ProductRow[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);

    const [{ data: products, error: productsError }, { data: orders, error: ordersError }] =
      await Promise.all([
        supabase
          .from("products")
          .select("id, name, stock, is_active")
          .order("id", { ascending: false }),
        supabase
          .from("orders")
          .select("id, customer_name, total_amount, status, created_at")
          .order("id", { ascending: false }),
      ]);

    if (productsError) {
      console.error("Products error:", productsError.message);
    }

    if (ordersError) {
      console.error("Orders error:", ordersError.message);
    }

    const safeProducts: ProductRow[] = (products as ProductRow[]) || [];
    const safeOrders: OrderRow[] = (orders as OrderRow[]) || [];

    const totalProducts = safeProducts.length;
    const activeProducts = safeProducts.filter((p) => p.is_active !== false).length;
    const totalOrders = safeOrders.length;
    const pendingOrders = safeOrders.filter(
      (o) => (o.status || "").toLowerCase() === "pending"
    ).length;
    const totalRevenue = safeOrders.reduce(
      (sum, order) => sum + Number(order.total_amount || 0),
      0
    );

    const lowStock = safeProducts
      .filter((p) => Number(p.stock || 0) <= 5)
      .slice(0, 5);

    setStats({
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      totalRevenue,
    });

    setLowStockProducts(lowStock);
    setRecentOrders(safeOrders.slice(0, 6));
    setLoading(false);
  };

  const cards = [
    { title: "Total Products", value: stats.totalProducts },
    { title: "Active Products", value: stats.activeProducts },
    { title: "Total Orders", value: stats.totalOrders },
    { title: "Pending Orders", value: stats.pendingOrders },
    { title: "Revenue", value: `₹${stats.totalRevenue}` },
  ];

  return (
    <div className="min-h-screen bg-[#f6f8fb]">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="mb-8 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="text-gray-500 mt-2">
              Orders, products aur store performance ka quick overview.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/admin/products"
              className="rounded-2xl bg-black text-white px-5 py-3 font-semibold hover:opacity-90"
            >
              Manage Products
            </Link>

            <Link
              href="/owner-orders"
              className="rounded-2xl bg-white border border-gray-200 text-gray-800 px-5 py-3 font-semibold hover:bg-gray-50"
            >
              Open Owner Orders
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 text-gray-500">
            Loading dashboard...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-5 mb-8">
              {cards.map((card) => (
                <div
                  key={card.title}
                  className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6"
                >
                  <p className="text-sm text-gray-500">{card.title}</p>
                  <h2 className="text-3xl font-bold text-gray-900 mt-2">
                    {card.value}
                  </h2>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
              <div className="xl:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Recent Orders
                  </h2>
                  <Link
                    href="/owner-orders"
                    className="text-sm font-semibold text-blue-600 hover:underline"
                  >
                    View all
                  </Link>
                </div>

                {recentOrders.length === 0 ? (
                  <div className="p-6 text-gray-500">No recent orders found.</div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[700px]">
                      <thead className="bg-gray-100">
                        <tr className="text-left text-gray-700">
                          <th className="px-6 py-4 font-semibold">Order ID</th>
                          <th className="px-6 py-4 font-semibold">Customer</th>
                          <th className="px-6 py-4 font-semibold">Amount</th>
                          <th className="px-6 py-4 font-semibold">Status</th>
                          <th className="px-6 py-4 font-semibold">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id} className="border-t border-gray-200">
                            <td className="px-6 py-4 font-semibold">#{order.id}</td>
                            <td className="px-6 py-4">
                              {order.customer_name || "Unknown"}
                            </td>
                            <td className="px-6 py-4">
                              ₹{Number(order.total_amount || 0)}
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                  (order.status || "").toLowerCase() === "pending"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : (order.status || "").toLowerCase() === "delivered"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-gray-100 text-gray-700"
                                }`}
                              >
                                {order.status || "pending"}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              {order.created_at
                                ? new Date(order.created_at).toLocaleString()
                                : "-"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div className="space-y-8">
                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Low Stock
                    </h2>
                  </div>

                  {lowStockProducts.length === 0 ? (
                    <div className="p-6 text-gray-500">
                      All products have enough stock.
                    </div>
                  ) : (
                    <div className="divide-y divide-gray-100">
                      {lowStockProducts.map((product) => (
                        <div
                          key={product.id}
                          className="p-5 flex items-center justify-between gap-4"
                        >
                          <div>
                            <p className="font-semibold text-gray-900">
                              {product.name}
                            </p>
                            <p className="text-sm text-gray-500">
                              Product ID: #{product.id}
                            </p>
                          </div>

                          <span className="inline-flex rounded-full bg-red-100 text-red-700 px-3 py-1 text-xs font-semibold">
                            Stock: {Number(product.stock || 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Quick Actions
                  </h2>

                  <div className="grid grid-cols-1 gap-3">
                    <Link
                      href="/admin/products"
                      className="rounded-2xl bg-black text-white px-5 py-3 font-semibold text-center hover:opacity-90"
                    >
                      Add / Edit Products
                    </Link>

                    <Link
                      href="/products"
                      className="rounded-2xl bg-gray-100 text-gray-800 px-5 py-3 font-semibold text-center hover:bg-gray-200"
                    >
                      View Public Products
                    </Link>

                    <Link
                      href="/cart"
                      className="rounded-2xl bg-gray-100 text-gray-800 px-5 py-3 font-semibold text-center hover:bg-gray-200"
                    >
                      Open Cart
                    </Link>

                    <Link
                      href="/owner-orders"
                      className="rounded-2xl bg-gray-100 text-gray-800 px-5 py-3 font-semibold text-center hover:bg-gray-200"
                    >
                      Manage Orders
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}