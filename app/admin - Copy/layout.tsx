import { cookies } from "next/headers";
import AdminSidebar from "../components/AdminSidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("admin_auth")?.value === "true";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f9fafb" }}>
      {isLoggedIn ? <AdminSidebar /> : null}
      <div style={{ flex: 1 }}>{children}</div>
    </div>
  );
}