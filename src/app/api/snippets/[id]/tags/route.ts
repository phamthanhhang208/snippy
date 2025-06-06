import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getRouteParam } from "@/app/api/getRouteParams";

// Add tags to a snippet
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

    const { tagIds } = await request.json(); // expects { tagIds: string[] }
    if (!Array.isArray(tagIds) || tagIds.length === 0)
        return NextResponse.json(
            { error: "tagIds must be a non-empty array" },
            { status: 400 }
        );

    // Prepare insert data
    const rows = tagIds.map((tagId: string) => ({
        snippet_id: snippetId,
        tag_id: tagId,
    }));

    const { error } = await supabase
        .from("snippet_tags")
        .upsert(rows, { onConflict: "snippet_id,tag_id" });

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}

// Remove a tag from a snippet
// export async function DELETE(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     const supabase = await createClient();
//     const {
//         data: { user },
//     } = await supabase.auth.getUser();
//     if (!user)
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const { tagId } = await request.json(); // expects { tagId: string }
//     if (!tagId)
//         return NextResponse.json(
//             { error: "tagId is required" },
//             { status: 400 }
//         );

//     const { error } = await supabase
//         .from("snippet_tags")
//         .delete()
//         .eq("snippet_id", params.id)
//         .eq("tag_id", tagId);

//     if (error)
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     return NextResponse.json({ success: true });
// }

export async function DELETE(request: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Extract snippet id from the URL
    const snippetId = getRouteParam(request, "snippets");
    if (!snippetId) {
        return NextResponse.json(
            { error: "Missing snippet id" },
            { status: 400 }
        );
    }

    const { tagId } = await request.json(); // expects { tagId: string }
    if (!tagId)
        return NextResponse.json(
            { error: "tagId is required" },
            { status: 400 }
        );

    if (!snippetId)
        return NextResponse.json(
            { error: "Missing snippet id" },
            { status: 400 }
        );

    const { error } = await supabase
        .from("snippet_tags")
        .delete()
        .eq("snippet_id", snippetId)
        .eq("tag_id", tagId);

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
