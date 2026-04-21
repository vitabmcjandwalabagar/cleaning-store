import Link from "next/link";

export default function HomePage() {
  const categories = [
    {
      title: "Home Cleaning",
      desc: "Premium products for daily home care and hygiene.",
      icon: "🧴",
    },
    {
      title: "Kitchen Care",
      desc: "Smart cleaning essentials for modern kitchens.",
      icon: "🍽️",
    },
    {
      title: "Bathroom Care",
      desc: "Powerful products for freshness and shine.",
      icon: "🚿",
    },
    {
      title: "Premium Essentials",
      desc: "Top-quality store picks for every need.",
      icon: "✨",
    },
  ];

  const features = [
    {
      title: "Premium Quality",
      desc: "Carefully selected products with better quality and presentation.",
    },
    {
      title: "Fast Order Flow",
      desc: "Simple add to cart, checkout and order tracking system.",
    },
    {
      title: "Clean Shopping Experience",
      desc: "Modern layout, smooth browsing and professional store design.",
    },
  ];

  const highlights = [
    "Trusted premium store experience",
    "Clean product browsing interface",
    "Easy checkout and order tracking",
    "Built for smooth and modern shopping",
  ];

  return (
    <div className="min-h-screen bg-[#f7f8fc]">
      <section className="border-b border-gray-200 bg-gradient-to-b from-white via-[#fbfcff] to-[#f7f8fc]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-12 md:px-6 md:py-20 lg:grid-cols-2">
          <div>
            <div className="mb-4 inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-700">
              Premium Shopping Experience
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 md:text-6xl">
              Smart Shopping
              <span className="block text-blue-600">Starts Here</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-gray-600 md:text-lg">
              Discover premium products, smooth browsing, clean checkout flow and
              a modern shopping experience designed to feel simple, fast and
              reliable.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-full bg-black px-6 py-3 text-sm font-bold text-white transition hover:opacity-90"
              >
                Shop Now
              </Link>

              <Link
                href="/cart"
                className="rounded-full border border-gray-200 bg-white px-6 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-50"
              >
                View Cart
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {highlights.map((item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-gray-200 bg-white px-4 py-4 text-sm font-semibold text-gray-700 shadow-sm"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[36px] bg-white p-5 shadow-[0_30px_80px_rgba(0,0,0,0.08)] ring-1 ring-black/5">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-[28px] bg-gradient-to-br from-blue-50 to-white p-4">
                  <div className="mb-4 flex h-40 items-center justify-center rounded-[24px] bg-white text-6xl shadow-sm">
                    🧴
                  </div>
                  <div className="text-base font-bold text-gray-900">Floor Cleaner</div>
                  <div className="mt-1 text-sm text-gray-500">Premium cleaning range</div>
                </div>

                <div className="rounded-[28px] bg-gradient-to-br from-gray-50 to-white p-4">
                  <div className="mb-4 flex h-40 items-center justify-center rounded-[24px] bg-white text-6xl shadow-sm">
                    ✨
                  </div>
                  <div className="text-base font-bold text-gray-900">Glass Cleaner</div>
                  <div className="mt-1 text-sm text-gray-500">Sparkling finish care</div>
                </div>

                <div className="rounded-[28px] bg-gradient-to-br from-green-50 to-white p-4">
                  <div className="mb-4 flex h-40 items-center justify-center rounded-[24px] bg-white text-6xl shadow-sm">
                    🚿
                  </div>
                  <div className="text-base font-bold text-gray-900">Bathroom Care</div>
                  <div className="mt-1 text-sm text-gray-500">Fresh and clean hygiene</div>
                </div>

                <div className="rounded-[28px] bg-gradient-to-br from-purple-50 to-white p-4">
                  <div className="mb-4 flex h-40 items-center justify-center rounded-[24px] bg-white text-6xl shadow-sm">
                    🛒
                  </div>
                  <div className="text-base font-bold text-gray-900">Easy Ordering</div>
                  <div className="mt-1 text-sm text-gray-500">Smooth cart to checkout</div>
                </div>
              </div>
            </div>

            <div className="absolute -left-4 top-8 hidden rounded-2xl bg-white px-4 py-3 shadow-lg ring-1 ring-black/5 md:block">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                Experience
              </div>
              <div className="mt-1 text-lg font-extrabold text-gray-900">
                Premium UI
              </div>
            </div>

            <div className="absolute -bottom-4 right-4 hidden rounded-2xl bg-black px-5 py-3 text-white shadow-lg md:block">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-300">
                Fast Flow
              </div>
              <div className="mt-1 text-lg font-extrabold">Cart → Checkout</div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Featured Categories
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">
              Shop by Category
            </h2>
          </div>

          <Link
            href="/products"
            className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
          >
            View All Products
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {categories.map((category) => (
            <div
              key={category.title}
              className="rounded-[30px] bg-white p-6 shadow-sm ring-1 ring-black/5 transition duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-3xl">
                {category.icon}
              </div>

              <h3 className="mt-5 text-xl font-bold text-gray-900">{category.title}</h3>
              <p className="mt-3 text-sm leading-7 text-gray-500">{category.desc}</p>

              <Link
                href="/products"
                className="mt-5 inline-flex text-sm font-bold text-blue-600"
              >
                Explore →
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="border-y border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-10 md:px-6 md:py-16">
          <div className="mb-8 max-w-2xl">
            <div className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Why Choose Us
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-gray-900">
              A Better Store Experience
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="rounded-[30px] bg-[#f8faff] p-6 ring-1 ring-black/5"
              >
                <h3 className="text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6 md:py-18">
        <div className="rounded-[36px] bg-gradient-to-r from-black to-gray-900 px-6 py-10 text-white shadow-[0_25px_60px_rgba(0,0,0,0.18)] md:px-10 md:py-14">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <div className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-300">
                Ready to Start Shopping
              </div>
              <h2 className="mt-3 text-3xl font-extrabold tracking-tight md:text-4xl">
                Discover products with a clean and premium experience
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-gray-300">
                Browse products, add to cart, place orders and track them through
                your account with a fast and modern shopping flow.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/products"
                className="rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition hover:opacity-90"
              >
                Browse Products
              </Link>

              <Link
                href="/account/orders"
                className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white transition hover:bg-white/20"
              >
                Track Orders
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}