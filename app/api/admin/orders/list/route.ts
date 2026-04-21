import { NextResponse } from "next/server";
import { createClient } from "../../../../../lib/supabase/server";
import { createAdminClient } from "../../../../../lib/supabase/admin";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
    const currentUserEmail = (user.email || "").trim().toLowerCase();

    if (!adminEmail || currentUserEmail !== adminEmail) {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    const adminSupabase = createAdminClient();

    const { data, error } = await adminSupabase
      .from("orders")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      orders: data || [],
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to load orders." },
      { status: 500 }
    );
  }
}