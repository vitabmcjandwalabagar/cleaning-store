"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();

  const menu = [
    { name: "Dashboard", href: "/admin" },
    { name: "Products", href: "/admin/products" },
    { name: "Orders", href: "/admin/orders" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("isAdmin");
    window.location.href = "/admin-login";
  };

  return (
    <aside className="w-full md:w-72 bg-white border-r border-gray-200 min-h-screen">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Admin Panel</h2>
        <p className="text-sm text-gray-500 mt-1">Store management</p>
      </div>

      <nav className="p-4 space-y-2">
        {menu.map((item) => {
          const active = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-4 py-3 font-medium transition ${
                active
                  ? "bg-black text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.name}
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="w-full mt-6 rounded-xl bg-red-500 text-white px-4 py-3 font-semibold hover:opacity-90 transition"
        >
          Logout
        </button>
      </nav>
    </aside>
  );
}