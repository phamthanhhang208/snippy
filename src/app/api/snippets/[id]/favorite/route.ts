import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Add to favorites
export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL(request.url);
    const id = url.pathname.split("/").filter(Boolean).pop();

    const { error } = await supabase
        .from("favorite_snippets")
        .insert({ user_id: user.id, snippet_id: id });

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}

// Remove from favorites
export async function DELETE(request: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // Extract id from the URL
    const url = new URL(request.url);
    const id = url.pathname.split("/").filter(Boolean).pop();

    const { error } = await supabase
        .from("favorite_snippets")
        .delete()
        .eq("user_id", user.id)
        .eq("snippet_id", id);

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
