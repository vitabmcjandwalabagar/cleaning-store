import Link from "next/link";

type SearchParams = Promise<{
  orderId?: string;
}>;

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const orderId = params.orderId || "";

  return (
    <div className="max-w-3xl mx-auto px-4 py-14">
      <div className="bg-white border rounded-3xl shadow-sm p-8 md:p-10 text-center">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
          <span className="text-4xl">✓</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-black">
          Order Placed Successfully
        </h1>

        <p className="mt-3 text-gray-600 text-lg">
          Thank you for your order. Your order has been placed successfully.
        </p>

        {orderId && (
          <div className="mt-6 rounded-2xl border bg-gray-50 px-5 py-4 inline-block">
            <p className="text-sm text-gray-500">Order ID</p>
            <p className="text-xl font-bold text-black">#{orderId}</p>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/products"
            className="w-full sm:w-auto rounded-2xl bg-black px-6 py-3 text-white font-medium hover:opacity-90 transition"
          >
            Continue Shopping
          </Link>

          <Link
            href="/account/orders"
            className="w-full sm:w-auto rounded-2xl border border-gray-300 px-6 py-3 font-medium hover:bg-gray-100 transition"
          >
            View My Orders
          </Link>
        </div>
      </div>
    </div>
  );
}