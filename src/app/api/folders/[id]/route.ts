// app/api/folders/[id]/route.ts
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
        .from("folders")
        .update({ ...body })
        .eq("id", params.id)
        .eq("user_id", user.id)
        .select()
        .single();

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ folder: data });
}

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

//     const { error } = await supabase
//         .from("folders")
//         .delete()
//         .eq("id", params.id)
//         .eq("user_id", user.id);

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

    // Extract id from the URL
    const url = new URL(request.url);
    const id = url.pathname.split("/").filter(Boolean).pop();

    if (!id)
        return NextResponse.json(
            { error: "Missing folder id" },
            { status: 400 }
        );

    const { error } = await supabase
        .from("folders")
        .delete()
        .eq("id", id)
        .eq("user_id", user.id);

    if (error)
        return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
}
