import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Mark as public/private
export async function PATCH(request: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { isPublic } = await request.json(); // expects { isPublic: boolean }
    if (typeof isPublic !== "boolean")
        return NextResponse.json(
            { error: "Missing isPublic boolean" },
            { status: 400 }
        );
    // Extract id from the URL
    const url = new URL(request.url);
    const id = url.pathname.split("/").filter(Boolean).pop();

    const { data, error } = await supabase
        .from("snippets")
        .update({ is_public: isPublic })
        .eq("id", id)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ snippet: data });
}
