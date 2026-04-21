"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { signOut } from "@/lib/auth";
import { useCart } from "./CartProvider";

export default function Navbar() {
  const [user, setUser] = useState<any>(null);
  const { cartCount } = useCart();

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      setUser(data.user ?? null);
    };

    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/";
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 1000,
        background: "rgba(255,255,255,0.94)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid #e5e7eb",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "18px",
          flexWrap: "wrap",
        }}
      >
        <Link
          href="/"
          style={{
            textDecoration: "none",
            color: "#111827",
            fontSize: "28px",
            fontWeight: 800,
          }}
        >
          Cleaning Store
        </Link>

        <nav
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <Link href="/" style={navLink}>
            Home
          </Link>

          <Link href="/products" style={navLink}>
            Products
          </Link>

          <Link href="/cart" style={{ ...navLink, position: "relative" }}>
            Cart
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-8px",
                  right: "-10px",
                  minWidth: "20px",
                  height: "20px",
                  borderRadius: "999px",
                  background: "#2563eb",
                  color: "#fff",
                  fontSize: "12px",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 6px",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {user && (
            <Link href="/my-orders" style={navLink}>
              My Orders
            </Link>
          )}

          {user ? (
            <>
              <span
                style={{
                  padding: "10px 14px",
                  background: "#f3f4f6",
                  borderRadius: "999px",
                  fontSize: "14px",
                  color: "#374151",
                  fontWeight: 600,
                }}
              >
                {user.email}
              </span>

              <button onClick={handleLogout} style={logoutBtn}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" style={navBtnLight}>
                Login
              </Link>
              <Link href="/signup" style={navBtnBlue}>
                Signup
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

const navLink: React.CSSProperties = {
  textDecoration: "none",
  color: "#111827",
  fontWeight: 600,
  fontSize: "15px",
  padding: "10px 14px",
  borderRadius: "12px",
};

const navBtnLight: React.CSSProperties = {
  textDecoration: "none",
  color: "#111827",
  fontWeight: 700,
  fontSize: "15px",
  padding: "10px 16px",
  borderRadius: "12px",
  background: "#f3f4f6",
};

const navBtnBlue: React.CSSProperties = {
  textDecoration: "none",
  color: "#fff",
  fontWeight: 700,
  fontSize: "15px",
  padding: "10px 16px",
  borderRadius: "12px",
  background: "#2563eb",
};

const logoutBtn: React.CSSProperties = {
  border: "none",
  background: "#b91c1c",
  color: "#fff",
  padding: "10px 16px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: "14px",
};