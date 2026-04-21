"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function AdminSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/admin-logout", {
      method: "POST",
    });

    router.push("/admin/login");
    router.refresh();
  }

  const menu = [
    { name: "Dashboard", href: "/admin/dashboard" },
    { name: "Products", href: "/admin/products" },
    { name: "Orders", href: "/admin/orders" },
    { name: "Categories", href: "/admin/categories" },
  ];

  return (
    <div style={styles.sidebar}>
      <div>
        <h2 style={styles.logo}>Admin Panel</h2>

        <div style={styles.menu}>
          {menu.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                ...styles.link,
                background: pathname === item.href ? "#1677ff" : "transparent",
                color: pathname === item.href ? "#fff" : "#111827",
              }}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>

      <button onClick={handleLogout} style={styles.logoutBtn}>
        Logout
      </button>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  sidebar: {
    width: "240px",
    minHeight: "100vh",
    background: "#ffffff",
    borderRight: "1px solid #e5e7eb",
    padding: "24px 16px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "24px",
    fontWeight: 700,
    marginBottom: "24px",
  },
  menu: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  link: {
    textDecoration: "none",
    padding: "12px 14px",
    borderRadius: "10px",
    fontWeight: 600,
  },
  logoutBtn: {
    marginTop: "20px",
    padding: "12px",
    border: "none",
    borderRadius: "10px",
    background: "#ef4444",
    color: "#fff",
    fontWeight: 600,
    cursor: "pointer",
  },
};