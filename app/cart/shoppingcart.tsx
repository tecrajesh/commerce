"use client";
import { useState } from "react";
import { Product } from "../product-data";
import Link from "next/link";  


export default function ShoppingCart({initialProducts}:{initialProducts:Product[]}) {
    

 const [cartItems, setCartItems] = useState(initialProducts);
 const removeFromCart = async (productId:string) => {

       const updatedResponse =  await fetch(process.env.NEXT_PUBLIC_URL + "/api/users/2/cart", {
           "method": "DELETE",
           "body": JSON.stringify({productId}),
           "Content-Type":"application/json",
       });
       const updatedProduct = await updatedResponse.json()
       setCartItems(updatedProduct)

  }

 return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Shopping Cart</h1>
      <div className="grid gap-6">
        {cartItems.map(item => (
          <Link 
            key={item.id} 
            href={`/products/${item.id}`} 
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border border-gray-200 hover:border-gray-300"
          >
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 hover:text-blue-600 transition-colors">
                {item.name}
              </h2>
              <span className="text-2xl font-bold text-green-600">
                ${item.price}
              </span>
              <div className="flex justify-end">
              <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={(e)=> { e.preventDefault();removeFromCart(item.id)}}>Remove from Cart</button>:
            </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}