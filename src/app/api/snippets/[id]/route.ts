// app/api/snippets/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { Tag } from "@/lib/types";

type UpdateSnippetBody = {
    title?: string;
    code?: string;
    language?: string;
    notes?: string;
    readme?: string;
    description?: string;
    folderId?: string;
    tags?: Tag[]; // Array of tag objects or just tag IDs
    isFavorite?: boolean;
    isPublic: boolean;
};

export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("snippets")
        .select("*")
        .eq("id", params.id)
        .single();

    if (error)
        return NextResponse.json({ error: error.message }, { status: 404 });
    return NextResponse.json({ snippet: data });
}

// export async function PATCH(
//     request: NextRequest,
//     { params }: { params: { id: string } }
// ) {
//     const supabase = await createClient();
//     const {
//         data: { user },
//     } = await supabase.auth.getUser();
//     if (!user)
//         return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//     const body = await request.json();

//     const { data, error } = await supabase
//         .from("snippets")
//         .update({ ...body, updated_at: new Date().toISOString() })
//         .eq("id", params.id)
//         .eq("user_id", user.id)
//         .select()
//         .single();

//     if (error)
//         return NextResponse.json({ error: error.message }, { status: 500 });
//     return NextResponse.json({ snippet: data });
// }

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
        .from("snippets")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}

export async function PATCH(request: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    // Extract id from the URL
    const url = new URL(request.url);
    const id = url.pathname.split("/").filter(Boolean).pop();

    const body: UpdateSnippetBody = await request.json();

    // 1. Update the snippet itself
    const snippetUpdate: Record<string, unknown> = {};
    if (body.title !== undefined) snippetUpdate.title = body.title;
    if (body.code !== undefined) snippetUpdate.code = body.code;
    if (body.language !== undefined) snippetUpdate.language = body.language;
    if (body.notes !== undefined) snippetUpdate.notes = body.notes;
    if (body.readme !== undefined) snippetUpdate.readme = body.readme;
    if (body.description !== undefined)
        snippetUpdate.description = body.description;
    if (body.folderId !== undefined) snippetUpdate.folder_id = body.folderId;
    snippetUpdate.is_public = body.isPublic;

    //let snippetData = null;
    if (Object.keys(snippetUpdate).length > 0) {
        const { error } = await supabase
            .from("snippets")
            .update({ ...snippetUpdate, updated_at: new Date().toISOString() })
            .eq("id", id)
            .eq("user_id", user.id)
            .select()
            .single();

        if (error)
            return NextResponse.json({ error: error.message }, { status: 500 });
        //snippetData = data;
    }

    // 2. Update tags (snippet_tags)
    if (body.tags) {
        // Remove all existing tags for this snippet
        const { error: delError } = await supabase
            .from("snippet_tags")
            .delete()
            .eq("snippet_id", id);

        if (delError)
            return NextResponse.json(
                { error: delError.message },
                { status: 500 }
            );

        // Insert new tags
        if (body.tags.length > 0) {
            const tagRows = body.tags.map((tag) => ({
                snippet_id: id,
                tag_id: typeof tag === "string" ? tag : tag.id,
            }));

            const { error: insError } = await supabase
                .from("snippet_tags")
                .insert(tagRows);

            if (insError)
                return NextResponse.json(
                    { error: insError.message },
                    { status: 500 }
                );
        }
    }

    // 3. Update favorite status
    if (body.isFavorite !== undefined) {
        if (body.isFavorite) {
            // Upsert favorite
            const { error: favError } = await supabase
                .from("favorite_snippets")
                .upsert({ user_id: user.id, snippet_id: id });

            if (favError)
                return NextResponse.json(
                    { error: favError.message },
                    { status: 500 }
                );
        } else {
            // Remove favorite
            const { error: delFavError } = await supabase
                .from("favorite_snippets")
                .delete()
                .eq("user_id", user.id)
                .eq("snippet_id", id);

            if (delFavError)
                return NextResponse.json(
                    { error: delFavError.message },
                    { status: 500 }
                );
        }
    }

    // 4. Return the updated snippet (optionally, with tags and isFavorite)
    // You may want to re-fetch the snippet with tags and isFavorite here
    // For brevity, just return success
    return NextResponse.json({
        success: true,
    });
}
