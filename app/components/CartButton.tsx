"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartCount } from "../../lib/cart";

export default function CartButton() {
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
      className="relative rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-800 hover:bg-gray-100"
    >
      Cart
      {count > 0 && (
        <span className="ml-2 inline-flex min-w-[22px] items-center justify-center rounded-full bg-black px-2 py-0.5 text-xs text-white">
          {count}
        </span>
      )}
    </Link>
  );
}