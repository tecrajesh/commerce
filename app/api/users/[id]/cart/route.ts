import { NextRequest } from "next/server";
import {products} from "@/app/product-data";

import { connectToDb } from "@/app/api/db";

type ShoppingCart = Record<string, string[]>;

const carts: ShoppingCart = {
    '1': ["123", "234"],
    '2': ['123', '345', '234'],
    '3': [ '234'],

};

type Params = {
    id: string;
};

export async function GET(request: NextRequest, {params}: {params: Promise<Params>}) {

    const { db } = await connectToDb();

    const {id: userId} = await params;
    const carts = await db.collection("carts").find({}).toArray();
    console.log("All Carts:", carts);
    const userCart = await db.collection("carts").findOne({ userId: Number(userId) });
    console.log("User Cart:", userCart);
    if(!userCart) {
        return new Response(JSON.stringify({ message: 'Cart is empty' }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const cartIds = userCart.cartIds;
    const productDetails = await db.collection("products").find({ id: { $in: cartIds } }).toArray();
    return new Response(JSON.stringify(productDetails), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

type cartBody = {
   productId: string;
};

export async function POST(request: NextRequest, {params}: {params: Params}) {

    const { db } = await connectToDb();
    const {id: userId} = params;

    const body:cartBody = await request.json();

    
    const updatedCart = await db.collection("carts").findOneAndUpdate(
        { userId: Number(userId) },
        { $push : { cartIds: body.productId }},
        { upsert: true, returnDocument: "after" }
    );

    const productDetails = await db.collection("products").find({ id: { $in: updatedCart.cartIds || [] } }).toArray();

    return new Response(JSON.stringify(productDetails), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function DELETE(request: NextRequest, {params}: {params: Promise<Params>}) {

    const { db } = await connectToDb();
    const {id: userId} = await params;

    const body:cartBody = await request.json();

    const updatedCart = await db.collection("carts").updateOne(
        { userId: Number(userId) },
        { $pull: { cartIds: body.productId } },
        { returnDocument: "after" }
    );

    if(!updatedCart) {
        return new Response(JSON.stringify({ message: 'Cart is empty' }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    const userCart = await db.collection("carts").findOne({ userId: Number(userId) });
    const productDetails = await db.collection("products").find({ id: { $in: userCart.cartIds || [] } }).toArray();

    return new Response(JSON.stringify(productDetails), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
