import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  return NextResponse.json({
    ok: true,
    hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    hasServiceRoleKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const orderId = Number(body.orderId);
    const status = String(body.status || "").trim();

    if (!orderId || !status) {
      return NextResponse.json(
        { ok: false, error: "orderId and status are required" },
        { status: 400 }
      );
    }

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Shipped",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return NextResponse.json(
        { ok: false, error: "Invalid status value" },
        { status: 400 }
      );
    }

    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL as string,
      process.env.SUPABASE_SERVICE_ROLE_KEY as string,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { data, error } = await supabaseAdmin
      .from("orders")
      .update({ status })
      .eq("id", orderId)
      .select("id, status");

    if (error) {
      console.error("Supabase update error:", error);
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { ok: false, error: "No order found with this ID" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Status updated successfully",
      data,
    });
  } catch (err) {
    console.error("Route error:", err);
    return NextResponse.json(
      { ok: false, error: "Server error while updating order status" },
      { status: 500 }
    );
  }
}