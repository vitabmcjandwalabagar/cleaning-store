import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body.email || "").trim();
    const password = String(body.password || "");

    const adminEmail = String(process.env.ADMIN_EMAIL || "").trim();
    const adminPassword = String(process.env.ADMIN_PASSWORD || "");

    if (!adminEmail || !adminPassword) {
      return NextResponse.json(
        { message: "Server admin credentials are not configured in .env.local" },
        { status: 500 }
      );
    }

    if (email === adminEmail && password === adminPassword) {
      const response = NextResponse.json({
        success: true,
        message: "Login successful",
      });

      response.cookies.set("admin_auth", "true", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7,
      });

      return response;
    }

    return NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}