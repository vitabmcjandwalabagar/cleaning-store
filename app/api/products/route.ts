import { NextResponse } from "next/server";

export async function GET() {
  const products = [
    {
      id: 1,
      name: "Floor Cleaner",
      price: 120,
      image: "/floor.jpg",
    },
    {
      id: 2,
      name: "Toilet Cleaner",
      price: 90,
      image: "/toilet.jpg",
    },
    {
      id: 3,
      name: "Glass Cleaner",
      price: 150,
      image: "/glass.jpg",
    },
  ];

  return NextResponse.json(products);
}