// lib/api/tags.ts
import type { Tag } from "../types";
export async function fetchTags() {
    const res = await fetch("/api/tags");
    if (!res.ok) throw new Error("Failed to fetch tags");
    return res.json();
}

export async function createTag(tag: { name: string; color?: string }) {
    const res = await fetch("/api/tags", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tag),
    });
    if (!res.ok)
        throw new Error((await res.json()).error || "Failed to create tag");
    return res.json();
}

export async function updateTag(
    // id: string,
    // updates: { name?: string; color?: string }
    tag: Tag
) {
    const { id, ...updates } = tag;
    const res = await fetch(`/api/tags/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });
    if (!res.ok)
        throw new Error((await res.json()).error || "Failed to update tag");
    return res.json();
}

export async function deleteTag(id: string) {
    const res = await fetch(`/api/tags/${id}`, { method: "DELETE" });
    if (!res.ok)
        throw new Error((await res.json()).error || "Failed to delete tag");
    return res.json();
}
