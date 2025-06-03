import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRouteParam } from "@/app/api/getRouteParams";

// Add to favorites
export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const snippetId = getRouteParam(request, "snippets");
    if (!snippetId) {
        return NextResponse.json(
            { error: "Missing snippet id" },
            { status: 400 }
        );
    }

    const { error } = await supabase
        .from("favorite_snippets")
        .insert({ user_id: user.id, snippet_id: snippetId });

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
    const snippetId = getRouteParam(request, "snippets");
    if (!snippetId) {
        return NextResponse.json(
            { error: "Missing snippet id" },
            { status: 400 }
        );
    }

    const { error } = await supabase
        .from("favorite_snippets")
        .delete()
        .eq("user_id", user.id)
        .eq("snippet_id", snippetId);

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
