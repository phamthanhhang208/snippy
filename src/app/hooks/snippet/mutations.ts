import {
    createSnippet,
    updateSnippet,
    deleteSnippet,
} from "@/lib/api/snippets";
import type { Snippet } from "@/lib/types";

import useDataMutation from "../mutations";

export function useCreateSnippet() {
    return useDataMutation<Snippet, unknown>(createSnippet, {
        mutationKey: ["snippet", "create"],
        successMessage: "Created Snippet",
        invalidateKey: ["snippet"],
    });
}

export function useUpdateSnippet() {
    return useDataMutation<Snippet, unknown>(updateSnippet, {
        mutationKey: ["snippet", "update"],
        successMessage: "Upated Snippet",
        invalidateKey: ["snippet"],
    });
}

export function useDeleteSnippet() {
    return useDataMutation<string, unknown>(deleteSnippet, {
        mutationKey: ["snippet", "delete"],
        successMessage: "Deleted Snippet",
        invalidateKey: ["snippet"],
    });
}
