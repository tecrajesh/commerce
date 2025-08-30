import ShoppingCart from "./shoppingcart";

export const dynamic = 'force-dynamic';

export default async function CartPage() {
  
  const productsResponse = await fetch(process.env.NEXT_PUBLIC_URL + "/api/users/2/cart",{cache: 'no-cache'});
  const products = await productsResponse.json();
  return (
    <ShoppingCart initialProducts={products}/>
  )

}