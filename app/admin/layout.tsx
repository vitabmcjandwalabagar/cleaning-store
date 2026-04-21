"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import AdminSidebar from "../components/admin/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [checking, setChecking] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const isAdmin = localStorage.getItem("isAdmin");

    if (!isAdmin) {
      router.replace("/admin-login");
      return;
    }

    setChecking(false);
  }, [pathname, router]);

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f6f8fb] text-gray-600">
        Checking admin access...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f6f8fb] md:flex">
      <AdminSidebar />
      <main className="flex-1">{children}</main>
    </div>
  );
}