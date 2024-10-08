"use server";

import * as z from "zod"
import { AuthError } from "next-auth";

import { signIn } from "@/auth"
import { LoginSchema } from "@/lib/schemas";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

export const login = async (
    data: z.infer<typeof LoginSchema>,
    callbackUrl?: string | null,
) => {
    const validatedFields = LoginSchema.safeParse(data)
    if (!validatedFields.success) {
        return { error: "Invalid fields" }
    }

    const { email, password } = validatedFields.data
    try {
        await signIn("credentials", {
            email,
            password,
            redirectTo: callbackUrl || DEFAULT_LOGIN_REDIRECT,
        })
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case "CredentialsSignin":
                    return { error: "Invalid credentials!" }
                default:
                    return { error: "Something went wrong" }
            }
        }
        throw error;
    }
    return { success: "Successfully login" }
}