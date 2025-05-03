'use server';
import { shippingAddressSchema, signInFormSchema } from "../validators";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { signUpFormSchema } from "../validators";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { shippingAddress } from "@/types";

// sign in user with credentials
export async function signInWithCredentials(prevState:unknown,
    formData: FormData){
        try{
            const user = signInFormSchema.parse({
                email:formData.get('email'),
                password:formData.get('password')
            })
            await signIn('credentials', user);
            return{success:true, message:'signed in successfully'}

        }catch(error){
            if(isRedirectError(error)){
                throw error;
            }
            return{success:false, message:'invalid email or password'}

        }

}

//signout user function
export async function signOutUser() {
    await signOut();
    
}

//signup user function
export async function signUpUser(prevState:unknown, formData:FormData) {

    try{
        const user = signUpFormSchema.parse({
            name:formData.get('name'),
            email:formData.get('email'),
            password:formData.get('password'),
            confirmPassword:formData.get('confirmPassword')
        })
        const plainpassword = user.password;

        user.password = hashSync(user.password, 10)
        await prisma.user.create({
            data:{
                name:user.name,
                email:user.email,
                password:user.password
            },
        });

        await signIn('credentials',{
            email:user.email,
            password: plainpassword,
        })

        return {success:true, message:'user registered successflly'}

    }catch(error){
        if(isRedirectError(error)){
            throw error;
        }
        return{success:false, message: formatError(error)}


    }
    
}

//get user by id

export async function getUserById(userId:string) {

    const user = await prisma.user.findFirst({
        where :{id:userId}
    });
    if(!user) throw new Error ('User Not Found');
    return user;
    
}

export async function updateUserAddress(data:shippingAddress) {
    try{
        const session = await auth();
        const currentUser = await prisma.user.findFirst({
            where:{id: session?.user?.id}
        });
        if(!currentUser) throw new Error ('user not Found');

        const address = shippingAddressSchema.parse(data)

        await prisma.user.update({
            where: { id: currentUser.id},
            data:{address}
        });

        return {
            success:true,
            message:"user updated successfully"
        }

    }catch(error){
        return { success: false, message:formatError(error)}
    }
    
}