import { NextResponse } from "next/server";
import { createClient } from "../../../../lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("full_name, phone, pincode, house_no, area, landmark, city, state")
      .eq("id", user.id)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: data || null });
  } catch {
    return NextResponse.json(
      { error: "Failed to load address." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const payload = {
      id: user.id,
      full_name: String(body.full_name || "").trim(),
      phone: String(body.phone || "").trim(),
      pincode: String(body.pincode || "").trim(),
      house_no: String(body.house_no || "").trim(),
      area: String(body.area || "").trim(),
      landmark: String(body.landmark || "").trim(),
      city: String(body.city || "").trim(),
      state: String(body.state || "").trim(),
      updated_at: new Date().toISOString(),
    };

    const { error } = await supabase.from("profiles").upsert(payload);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Failed to save address." },
      { status: 500 }
    );
  }
}