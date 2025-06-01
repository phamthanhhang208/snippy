// lib/api/folders.ts
import type { Folder } from "../types";
export async function fetchFolders() {
    const res = await fetch("/api/folders");
    if (!res.ok) throw new Error("Failed to fetch folders");
    return res.json();
}

export async function createFolder(folder: Omit<Folder, "id">) {
    const res = await fetch("/api/folders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(folder),
    });
    if (!res.ok)
        throw new Error((await res.json()).error || "Failed to create folder");
    return res.json();
}

export async function updateFolder(folder: Folder) {
    const { id, ...updates } = folder;
    const res = await fetch(`/api/folders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
    });
    if (!res.ok)
        throw new Error((await res.json()).error || "Failed to update folder");
    return res.json();
}

export async function deleteFolder(id: string) {
    const res = await fetch(`/api/folders/${id}`, { method: "DELETE" });
    if (!res.ok)
        throw new Error((await res.json()).error || "Failed to delete folder");
    return res.json();
}
