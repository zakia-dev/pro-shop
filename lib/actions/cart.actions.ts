'use server';

import { CartItem } from "@/types";
import { convertToPlainObject, formatError, round2 } from "../utils";
import { cookies } from "next/headers";
import { auth } from "@/auth";
import { prisma } from "@/db/prisma";
import { cartItemSchema, InsertcartSchema } from "../validators";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";


//calculated cart Price
const calcPrice = (items:CartItem[])=>{
    const ItemsPrice = round2(
        items.reduce((acc, items)=> acc + Number(items.price)* items.qty, 0)
    ),
    shippingPrice= round2(ItemsPrice>100?0 : 10),
    taxPrice = round2(0.15*ItemsPrice),
    totalPrice = round2(ItemsPrice + taxPrice+ shippingPrice);

    return{
        ItemsPrice:ItemsPrice.toFixed(2),
        taxPrice:taxPrice.toFixed(2),
        shippingPrice:shippingPrice.toFixed(2),
        totalPrice:totalPrice.toFixed(2),
    }


}

export async function addItemToCart(data:CartItem) {
    try {
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if(!sessionCartId) throw new Error ('Cart session not found')
            console.log('sessioncartid',sessionCartId);

            //get session and user id
            const session = await auth();
            const userId = session?. user?.id ? (session.user.id as string) : undefined;

            console.log('userId',userId);
            //get cart 
            const cart = await getMyCart();
            console.log('cart',cart);
            //parse and validate item
            const item = cartItemSchema.parse(data)
            console.log('item',item);

            //find product from db
            const product = await prisma.product.findFirst({
                where:{id: item.productId}
            });
            console.log('product',product);

            if(!product) throw new Error('no Product Found')

                const calculatedPrices = calcPrice([item]);
                console.log("Calculated Prices:", calculatedPrices); // Log all calculated prices
                console.log("Type of itemsPrice:", typeof calculatedPrices.ItemsPrice); // Check type

            
            if(!cart){
                const newCart = InsertcartSchema.parse({
                    ...(userId && { userId }),
                    sessionCartId,
                    items: [item],
                    ...calcPrice([item]),
                });

                await prisma.cart.create({
                    data:newCart
                });

                //revalidate productpage
                revalidatePath(`/product/${product.slug}`);

        
          

        return{
            success: true,
            message: `${product.name} added to cart` 
        }
            }else{
                //check if item is already in the cart
                const existItem = (cart.items as CartItem[]).find((x) => x.productId === item.productId );

                if(existItem){
                    //check stock
                    if(product.stock<existItem.qty +1){
                        throw new Error('Not Enough Stock')
                    }

                    //increase quantity
                    (cart.items as CartItem[]).find((x) => x.productId === item.productId )!.qty = existItem.qty+1
                }
                else{
                    //check stock
                    if(product.stock<1){
                        throw new Error('Not Enough Stock')
                    }

                    //add item to cart.items
                    cart.items.push(item)
                }

                //save to database 
                await prisma.cart.update(
                    {
                        where: {id: cart.id },
                        data:{
                            items: cart.items as Prisma.CartUpdateitemsInput[],
                            ...calcPrice(cart.items as CartItem[])
                        }
                    }
                );

                revalidatePath(`/product/${product.slug}`);
                return{
                    success:true,
                    message:`${product.name} ${existItem ? 'updated in': 'added to'} cart`
                }


            }
        
    } catch (error) {
        return{
            success:false,
            message:formatError(error)
        }
    }
   

    
}


export async function getMyCart() {
    const sessionCartId = (await cookies()).get('sessionCartId')?.value;
    if(!sessionCartId) throw new Error ('Cart session not found')

    //get session and user id
    const session = await auth();
    const userId = session?. user?.id ? (session.user.id as string) : undefined;

    //Get user cart from db
    const cart = await prisma.cart.findFirst({
        where:userId?{userId:userId}:{sessionCartId:sessionCartId}
    });

    if(!cart) return undefined

    // convert decimals and return
    return convertToPlainObject({
        ...cart,
        items:cart.items as CartItem[],
        ItemsPrice:cart.ItemsPrice.toString(),
        totalPrice:cart.totalPrice.toString(),
        shippingPrice:cart.shippingPrice.toString(),
        taxPrice:cart.taxPrice.toString(),




    })

    
}

export async function removeItemFromCart(productId: string) {
    try {
        const sessionCartId = (await cookies()).get('sessionCartId')?.value;
        if(!sessionCartId) throw new Error ('Cart session not found');

        //get Product
        const product = await prisma.product.findFirst({
            where:{id:productId}
        });
        if(!product) throw new Error('Product not found')

        //get user cart

        const cart = await getMyCart();
        if(!cart){
            throw new Error('cart not found')
        }

        //check for item
        const exist = (cart.items as CartItem[]).find((x)=> x.productId === productId);
        if(!exist) throw new Error('Item not found');

        if(exist.qty===1){
            //remove Item
            cart.items= (cart.items as CartItem[]).filter((x)=>x.productId !== exist.productId)

        } else{
            //Decrease qty
            (cart.items as CartItem[]).find((x)=>x.productId === productId)!.qty=exist.qty-1;
        }
        //update cart in database
        await prisma.cart.update({
            where:{id:cart.id},
            data:{
                items: cart.items as Prisma.CartUpdateitemsInput[],
                ...calcPrice(cart.items as CartItem[])

            }
        });
        revalidatePath(`/product/${product.slug}`)
        return{
            success:true,
            message:`${product.name} Removed from cart`
        }
        
    } catch (error) {
        return{
            success:false,
            message: formatError(error)
        }
    }
}