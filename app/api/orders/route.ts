import { NextResponse } from "next/server";
import { createClient } from "../../../lib/supabase/server";

type OrderItem = {
  id: number | string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

export async function POST(request: Request) {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json(
        { error: "Please login first." },
        { status: 401 }
      );
    }

    const body = await request.json();
    const address = String(body.address || "").trim();
    const paymentMethod = String(body.paymentMethod || "").trim();
    const items = Array.isArray(body.items) ? (body.items as OrderItem[]) : [];

    if (!address) {
      return NextResponse.json(
        { error: "Address is required." },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { error: "Payment method is required." },
        { status: 400 }
      );
    }

    if (!items.length) {
      return NextResponse.json(
        { error: "Cart is empty." },
        { status: 400 }
      );
    }

    const totalAmount = items.reduce((sum, item) => {
      const price = Number(item.price || 0);
      const qty = Number(item.quantity || 0);
      return sum + price * qty;
    }, 0);

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          user_id: user.id,
          user_email: user.email ?? "",
          address,
          payment_method: paymentMethod,
          total_amount: totalAmount,
          status: "Pending",
          items,
        },
      ])
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      order: data,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Something went wrong while placing the order." },
      { status: 500 }
    );
  }
}