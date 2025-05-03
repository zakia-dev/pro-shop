'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUpDefaultValues } from "@/lib/constants";
import Link from "next/link";
import { useActionState } from "react";

import { useFormStatus } from "react-dom";
import { signUpUser } from "@/lib/actions/user.actions";
import { useSearchParams } from "next/navigation";

const SignUpForm = () => {
    const [data, action] = useActionState(signUpUser,{
        success:false,
        message:''
    })
    const searchParams = useSearchParams();
    const callbackUrl=searchParams.get('callbackUrl')||'/'
    const SignOutButton = () =>{
        const {pending} = useFormStatus();

        return(
            <Button disabled={pending} className="w-full" variant='default'>
                { pending ? ' Submitting...':'SignUp'}

            </Button>
        )
    }
    return ( 
        <form action={action} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md space-y-6">
        <Input type="hidden" name="callbackUrl" value={callbackUrl} />
  
        <div className="space-y-2">
          <Label htmlFor="name" className="font-medium">
            Name
          </Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            autoComplete="name"
            defaultValue={signUpDefaultValues.name}
            placeholder="Enter your name"
            className="w-full"
          />
        </div>
  
        <div className="space-y-2">
          <Label htmlFor="email" className="font-medium">
            Email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            required
            autoComplete="email"
            defaultValue={signUpDefaultValues.email}
            placeholder="Enter your email"
            className="w-full"
          />
        </div>
  
        <div className="space-y-2">
          <Label htmlFor="password" className="font-medium">
            Password
          </Label>
          <Input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="new-password"
            defaultValue={signUpDefaultValues.password}
            placeholder="Enter your password"
            className="w-full"
          />
        </div>
  
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="font-medium">
            Confirm Password
          </Label>
          <Input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            required
            autoComplete="new-password"
            defaultValue={signUpDefaultValues.password}
            placeholder="Confirm your password"
            className="w-full"
          />
        </div>
  
        {data && !data.success && (
          <div className="text-center text-destructive mt-2">{data.message}</div>
        )}
  
        <div className="mt-6">
        <div className="w-full py-2 text-white rounded-lg  transition duration-150">
         <SignOutButton />
        </div>
       </div>
  
        <div className="text-sm text-center text-muted-foreground mt-4">
          already have an account?{' '}
          <Link href="/sign-in" target="_self" className="text-blue-600 underline hover:text-blue-800">
            Sign Up
          </Link>
        </div>
      </form>
     );
}
 
export default SignUpForm;