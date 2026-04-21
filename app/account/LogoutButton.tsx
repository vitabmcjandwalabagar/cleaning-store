"use client";

import { createClient } from "../../lib/supabase/client";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-5 py-3 rounded-xl font-medium hover:opacity-90 transition"
    >
      Logout
    </button>
  );
}