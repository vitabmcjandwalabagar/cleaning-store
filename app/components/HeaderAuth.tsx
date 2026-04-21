import Link from "next/link";
import { createClient } from "../../lib/supabase/server";

export default async function HeaderAuth() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return (
      <Link
        href="/account"
        className="rounded-xl border border-black bg-black px-4 py-2 text-sm font-medium text-white"
      >
        My Account
      </Link>
    );
  }

  return (
    <Link
      href="/login"
      className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800"
    >
      Login
    </Link>
  );
}