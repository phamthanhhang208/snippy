// app/api/folders/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("folders")
        .select("*")
        .order("created_at", { ascending: false });

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    const result = data.map((d) => ({
        ...d,
        parentId: d.parent_folder_id,
    }));
    return NextResponse.json({ folders: result });
}

export async function POST(request: NextRequest) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();
    const { name, parentId, color } = body;

    if (!name)
        return NextResponse.json(
            { error: "Missing folder name" },
            { status: 400 }
        );

    const { data, error } = await supabase
        .from("folders")
        .insert({
            user_id: user.id,
            name,
            parent_folder_id: parentId ?? null,
            color: color ?? null,
        })
        .select()
        .single();

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ folder: data }, { status: 201 });
}
