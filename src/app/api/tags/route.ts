// app/api/tags/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name", { ascending: true });

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ tags: data });
}

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, color } = body;

    if (!name)
        return NextResponse.json(
            { error: "Missing tag name" },
            { status: 400 }
        );

    const { data, error } = await supabase
        .from("tags")
        .insert({
            user_id: user.id,
            name,
            color: color ?? null,
        })
        .select()
        .single();

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ tag: data }, { status: 201 });
}
