"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export async function login(email: string, password: string) {
    const supabase = await createClient();

    const data = {
        email: email,
        password: password,
    };

    const { error, data: supabaseData } =
        await supabase.auth.signInWithPassword(data);

    return { error, user: supabaseData.user };
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    // type-casting here for convenience
    // in practice, you should validate your inputs
    const data = {
        email: formData.get("email") as string,
        password: formData.get("password") as string,
    };

    const { error } = await supabase.auth.signUp(data);

    if (error) {
        redirect("/error");
    }

    revalidatePath("/", "layout");
    redirect("/");
}

export async function register(email: string, password: string, name: string) {
    const supabase = await createClient();

    const data = {
        email: email,
        password: password,
        option: {
            data: {
                name: name,
            },
        },
    };

    const { error, data: supabaseData } = await supabase.auth.signUp(data);
    return { error, user: supabaseData.user };
}

export async function logout() {
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    if (error) {
        redirect("/error");
    }
    revalidatePath("/", "layout");
    redirect("/");
}
