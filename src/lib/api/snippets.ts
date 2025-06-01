// lib/api/snippets.ts
import type { Snippet } from "../types";
export async function fetchSnippets() {
    const res = await fetch("/api/snippets");
    if (!res.ok) throw new Error("Failed to fetch snippets");
    return res.json();
}

export async function createSnippet(snippet: {
    title: string;
    code: string;
    language: string;
    notes?: string;
    readme?: string;
    description?: string;
    folderId?: string | null;
}) {
    const res = await fetch("/api/snippets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(snippet),
    });
    if (!res.ok)
        throw new Error((await res.json()).error || "Failed to create snippet");
    return res.json();
}

export async function updateSnippet(snippet: Snippet) {
    const { id, updatedAt, folderId, ...updates } = snippet;
    const res = await fetch(`/api/snippets/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...updates,
            updated_at: updatedAt,
            folder_id: folderId,
        }),
    });
    if (!res.ok)
        throw new Error((await res.json()).error || "Failed to update snippet");
    return res.json();
}

export async function deleteSnippet(id: string) {
    const res = await fetch(`/api/snippets/${id}`, { method: "DELETE" });
    if (!res.ok)
        throw new Error((await res.json()).error || "Failed to delete snippet");
    return res.json();
}

// favortie, tag, public

// lib/api/snippetActions.ts

export async function favoriteSnippet(snippetId: string) {
    const res = await fetch(`/api/snippets/${snippetId}/favorite`, {
        method: "POST",
    });
    if (!res.ok)
        throw new Error(
            (await res.json()).error || "Failed to favorite snippet"
        );
    return res.json();
}

export async function unfavoriteSnippet(snippetId: string) {
    const res = await fetch(`/api/snippets/${snippetId}/favorite`, {
        method: "DELETE",
    });
    if (!res.ok)
        throw new Error(
            (await res.json()).error || "Failed to unfavorite snippet"
        );
    return res.json();
}

export async function setSnippetPublic(snippetId: string, isPublic: boolean) {
    const res = await fetch(`/api/snippets/${snippetId}/public`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPublic }),
    });
    if (!res.ok)
        throw new Error(
            (await res.json()).error || "Failed to update snippet visibility"
        );
    return res.json();
}

export async function addTagsToSnippet(snippetId: string, tagIds: string[]) {
    const res = await fetch(`/api/snippets/${snippetId}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagIds }),
    });
    if (!res.ok)
        throw new Error((await res.json()).error || "Failed to add tags");
    return res.json();
}

export async function removeTagFromSnippet(snippetId: string, tagId: string) {
    const res = await fetch(`/api/snippets/${snippetId}/tags`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tagId }),
    });
    if (!res.ok)
        throw new Error((await res.json()).error || "Failed to remove tag");
    return res.json();
}
