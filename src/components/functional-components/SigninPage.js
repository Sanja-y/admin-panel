"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { doSocialLogin } from "@/app/actions/index"

const FormSchema = z.object({
    username: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

function SigninPage() {
    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    function onSubmit(data) {

        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">{JSON.stringify(data, null, 2)}</code>
                </pre>
            ),
        })
        console.log(data)
    }
    const [error, setError] = useState("");
    const handleSignIn = async () => {
        try {
            await signIn(JSON.stringify('github'));
        } catch (error) {
            setError(error);
            console.log(error)
        }
    };

    const Field = () => {
        return (
            <Form {...form}>
                <form onSubmit={(e) => { e.preventDefault(); onSubmit() }} className="flex flex-col items-center justify-center w-full h-full space-y-8">
                    <FormField
                        control={form.control}
                        name=""
                        render={({ field }) => (
                            <>
                                <FormItem>
                                    <FormLabel className="text-white text-[1.5rem]">Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="E-mail" {...field} />
                                    </FormControl>
                                    {/* <FormDescription>
                                    This is your public display name.
                                </FormDescription> */}
                                </FormItem>
                                <FormItem>
                                    <FormControl>
                                        <Input placeholder="Password" type="password" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </>
                        )}
                    />
                    <div className="flex flex-col items-center space-y-6 ">
                        <Button type="submit" className="bg-[#8952e0] text-white hover:bg-[#523a79] w-[10rem]  font-semibold" onClick={handleSignIn}>Sign-in</Button>
                        <div className="text-white opacity-60 text-[5px]"> ( or ) </div>
                        <Button type="submit" name="action" value="github" className="bg-[#8952e0] text-white hover:bg-[#523a79] w-[10rem] h-[3rem]  font-semibold" onClick={async () =>  await signIn('github', { redirectTo: "/" })}>Sign in with <br />Github</Button>

                    </div>
                </form>
            </Form>
        )
    }

    return (

        <div className="bg-[#171a1d] h-full w-full flex flex-col items-center justify-between py-9 ">
            <div className="text-white text-[2rem] font-bold">
                Admin Portal
            </div>
            <h1 className="text-white text-[2rem] font-bold">Log in</h1>

            {/* {error && <p className="text-red-500">{error}</p>} */}
            <Field />

        </div>

    )
}


export default SigninPage;