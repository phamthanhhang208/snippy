import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { SnippetApi } from "@/lib/types";

export async function GET() {
    const supabase = await createClient();
    // Get current user (for isFavorite)
    const {
        data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id;

    // Fetch snippets with tags and isFavorite
    // 1. Fetch all snippets (customize query as needed)
    const { data: snippets, error } = await supabase
        .from("snippets")
        .select(
            `
      *,
      snippet_tags (
        tag:tags (
          id, name, color
        )
      ),
      favorite_snippets (
        user_id
      )
      `
        )
        .order("created_at", { ascending: false });

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });

    // 2. Transform data: flatten tags, compute isFavorite
    const result = (snippets ?? []).map((snippet: SnippetApi) => ({
        ...snippet,
        tags: (snippet.snippet_tags ?? []).map((st) => st.tag.id),
        isFavorite: !!(snippet.favorite_snippets ?? []).find(
            (fav) => fav.user_id === userId
        ),
        folderId: snippet.folder_id,
        isPublic: snippet.is_public,
    }));

    return NextResponse.json({ snippets: result });
}

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Validate required fields
    if (!body.title || !body.code || !body.language) {
        return NextResponse.json(
            { error: "Missing required fields" },
            { status: 400 }
        );
    }

    // Insert the snippet
    const { data, error } = await supabase
        .from("snippets")
        .insert({
            user_id: user.id,
            title: body.title,
            code: body.code,
            language: body.language,
            notes: body.notes ?? null,
            readme: body.readme ?? null,
            description: body.description ?? null,
            folder_id: body.folderId ?? null,
        })
        .select()
        .single();

    if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Optionally, handle tags association here

    return NextResponse.json({ snippet: data }, { status: 201 });
}
