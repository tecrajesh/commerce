import Link from "next/link";
export default function NavBar() {
  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold">My Store</h1>
        <ul className="flex space-x-4">
          <li>
            <Link href="/products" className="text-gray-300 hover:text-black">
              Products
            </Link>
          </li>
          <li>
            <Link href="/cart" className="text-gray-300 hover:text-black">
              Cart
            </Link>
          </li>
          <li>
            <Link href="/checkout" className="text-gray-300 hover:text-black">
              Checkout
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
