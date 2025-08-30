
'use client'
import {useState} from 'react'
import { Product } from "../product-data";
import Image from "next/image";
import Link from "next/link";
export default function Products({products, initialCartProducts=[]}: {products: Product[], initialCartProducts: Product[]}) {
    
  
  const [cartProducts, setCartProducts] = useState(initialCartProducts);

  const addToCart = async (productId:string) => {

       const updatedResponse =  await fetch(process.env.NEXT_PUBLIC_URL + "/api/users/2/cart", {
           "method": "POST",
           "body": JSON.stringify({productId}),
           "Content-Type":"application/json",
       });
       const updatedProduct = await updatedResponse.json()
       setCartProducts(updatedProduct)

  }

  const removeFromCart = async (productId:string) => {

       const updatedResponse =  await fetch(process.env.NEXT_PUBLIC_URL + "/api/users/2/cart", {
           "method": "DELETE",
           "body": JSON.stringify({productId}),
           "Content-Type":"application/json",
       });
       const updatedProduct = await updatedResponse.json()
       setCartProducts(updatedProduct)

  }

  const productIsInCart = (productId) =>{
     
    return cartProducts.some(cp=> cp.id == productId);
  }
  return ( <div className="grid grid-cols-4 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4 gap-6 p-6">
    {products.map(product => (
      <div className="border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden bg-white" key={product.id}>
        <Link href={`/products/${product.id}`} className="block">
          <div className="aspect-square relative overflow-hidden">
            <Image
              src={`/${product.imageUrl}`}
              alt={product.name}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
          <div className="p-4 text-center">
            <h2 className="font-semibold text-lg text-gray-800 mb-2 truncate">{product.name}</h2>
            <p className="text-xl font-bold text-green-600">${product.price}</p>
            {
              productIsInCart(product.id) ?
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-full" onClick={(e)=> { e.preventDefault();removeFromCart(product.id)}}>Remove from Cart</button>:
             <button className="bg-blue-500 hover:bg-blue-700  text-white font-bold py-2 px-4 rounded w-full"  onClick={(e)=> { e.preventDefault();addToCart(product.id)}}>Add to Cart</button>
         }
          </div>
        </Link>
      </div>
    ))}
  </div>)
}