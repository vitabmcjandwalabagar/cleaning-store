"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartCount } from "../lib/cart";

export default function CartIcon() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    function updateCount() {
      setCount(getCartCount());
    }

    updateCount();

    window.addEventListener("cartUpdated", updateCount);
    return () => {
      window.removeEventListener("cartUpdated", updateCount);
    };
  }, []);

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center justify-center px-4 py-2 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold"
    >
      Cart
      {count > 0 && (
        <span className="ml-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </Link>
  );
}