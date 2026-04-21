import Link from "next/link";
import HeaderAuth from "./HeaderAuth";
import CartButton from "./CartButton";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-extrabold text-black">
            Cleaning Store
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-sm font-medium text-gray-700 hover:text-black">
              Home
            </Link>
            <Link href="/products" className="text-sm font-medium text-gray-700 hover:text-black">
              Products
            </Link>
            <Link href="/cart" className="text-sm font-medium text-gray-700 hover:text-black">
              Cart
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <CartButton />
          <HeaderAuth />
        </div>
      </div>
    </header>
  );
}