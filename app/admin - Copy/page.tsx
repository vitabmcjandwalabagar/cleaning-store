import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const cookieStore = await cookies();
  const isLoggedIn = cookieStore.get("admin_auth")?.value === "true";

  if (!isLoggedIn) {
    redirect("/admin/login");
  }

  redirect("/admin/products");
}