import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRouteParam } from "@/app/api/getRouteParams";

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

    const snippetId = getRouteParam(request, "snippets");
    if (!snippetId) {
        return NextResponse.json(
            { error: "Missing snippet id" },
            { status: 400 }
        );
    }

    const { data, error } = await supabase
        .from("snippets")
        .update({ is_public: isPublic })
        .eq("id", snippetId)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ snippet: data });
}
