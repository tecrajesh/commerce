import { NextRequest } from "next/server";

import { connectToDb } from "@/app/lib/db";

type ShoppingCart = Record<string, string[]>;

const carts: ShoppingCart = {
    '1': ["123", "234"],
    '2': ['123', '345', '234'],
    '3': [ '234'],

};


export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
    const { db } = await connectToDb();
    const userId = params.id;
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

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
    const { db } = await connectToDb();
    const userId = params.id;
    const body: cartBody = await request.json();
    const updatedCartResult = await db.collection("carts").findOneAndUpdate(
        { userId: Number(userId) },
        { $push : { cartIds: body.productId }},
        { upsert: true, returnDocument: "after" }
    );
    const updatedCart = updatedCartResult.value;
    const productDetails = await db.collection("products").find({ id: { $in: updatedCart?.cartIds || [] } }).toArray();
    return new Response(JSON.stringify(productDetails), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
    const { db } = await connectToDb();
    const userId = params.id;
    const body: cartBody = await request.json();
    await db.collection("carts").updateOne(
        { userId: Number(userId) },
        { $pull: { cartIds: body.productId } }
    );
    const userCart = await db.collection("carts").findOne({ userId: Number(userId) });
    if(!userCart) {
        return new Response(JSON.stringify({ message: 'Cart is empty' }), {
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    const productDetails = await db.collection("products").find({ id: { $in: userCart.cartIds || [] } }).toArray();
    return new Response(JSON.stringify(productDetails), {
        headers: {
            'Content-Type': 'application/json',
        },
    });
}
