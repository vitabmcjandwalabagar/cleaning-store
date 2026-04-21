"use client";

import { useState } from "react";
import { addToCart } from "../../lib/cart";

type Props = {
  id: number | string;
  name: string;
  price: number;
  image?: string;
};

export default function AddToCartButton({
  id,
  name,
  price,
  image,
}: Props) {
  const [added, setAdded] = useState(false);

  function handleAdd() {
    addToCart({
      id,
      name,
      price,
      image,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      onClick={handleAdd}
      className={`w-full rounded-xl px-4 py-3 font-medium transition ${
        added ? "bg-green-600 text-white" : "bg-black text-white"
      }`}
    >
      {added ? "Added to Cart" : "Add to Cart"}
    </button>
  );
}