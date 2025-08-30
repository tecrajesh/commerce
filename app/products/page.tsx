
import Products from "./Products";

export const dynamic = 'force-dynamic';

export default async function Page() {

  const productsResponse = await fetch(process.env.NEXT_PUBLIC_URL + "/api/products", {
    cache: 'no-cache'
  })
  const products = await productsResponse.json()

  const cartResponse = await fetch(process.env.NEXT_PUBLIC_URL + "/api/users/2/cart");
  const cartProducts = await cartResponse.json();
  return (
    <>
    <div className="container mx-auto">
        <h1 className="text-3xl font-bold mb-6">Products</h1>
        <div className="grid grid-cols-1 md:auto lg:grid-cols-3 xl:grid-cols-4 gap-6">
            <Products products={products} initialCartProducts={cartProducts}/>
        </div>
    </div>
      
    </>
  );
}
