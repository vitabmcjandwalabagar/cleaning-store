import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "../../lib/supabase/server";
import LogoutButton from "./LogoutButton";

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">My Account</h1>

      <div className="border rounded-3xl p-6 bg-white shadow-sm">
        <div className="space-y-3">
          <p className="text-lg">
            <span className="font-semibold">Name:</span>{" "}
            {user.user_metadata?.full_name || "User"}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Email:</span> {user.email}
          </p>
          <p className="text-sm text-gray-500 break-all">
            <span className="font-semibold">User ID:</span> {user.id}
          </p>
        </div>

        <div className="mt-6 flex gap-3 flex-wrap">
          <Link
            href="/account/orders"
            className="bg-black text-white px-5 py-3 rounded-2xl font-medium hover:opacity-90 transition"
          >
            My Orders
          </Link>

          <Link
            href="/account/address"
            className="border border-gray-300 px-5 py-3 rounded-2xl font-medium hover:bg-gray-100 transition"
          >
            Your Addresses
          </Link>

          <LogoutButton />
        </div>
      </div>
    </div>
  );
}