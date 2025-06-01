// app/api/tags/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const body = await request.json();

    const { data, error } = await supabase
        .from("tags")
        .update({ ...body })
        .eq("id", params.id)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ tag: data });
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (!user)
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { error } = await supabase
        .from("tags")
        .delete()
        .eq("id", params.id)
        .eq("user_id", user.id);

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
