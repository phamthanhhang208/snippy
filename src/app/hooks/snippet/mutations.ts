import {
    createSnippet,
    updateSnippet,
    deleteSnippet,
} from "@/lib/api/snippets";
import type { Snippet } from "@/lib/types";
import { toast } from "sonner";
import {
    favoriteSnippet,
    unfavoriteSnippet,
    setSnippetPublic,
    addTagsToSnippet,
    removeTagFromSnippet,
} from "@/lib/api/snippets";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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

const invalidateKeys = [["snippets"], ["snippet"]];

function useInvalidateSnippets() {
    const queryClient = useQueryClient();
    return () => {
        invalidateKeys.forEach((key) =>
            queryClient.invalidateQueries({ queryKey: key })
        );
    };
}

export function useFavoriteSnippet() {
    const invalidate = useInvalidateSnippets();
    return useMutation({
        mutationFn: favoriteSnippet,
        onSuccess: () => {
            invalidate();
            toast.success("Added to favorites!");
        },
        onError: (error) => {
            toast.error((error as Error).message);
        },
    });
}

export function useUnfavoriteSnippet() {
    const invalidate = useInvalidateSnippets();
    return useMutation({
        mutationFn: unfavoriteSnippet,
        onSuccess: () => {
            invalidate();
            toast.success("Removed from favorites!");
        },
        onError: (error) => {
            toast.error((error as Error).message);
        },
    });
}

export function useSetSnippetPublic() {
    const invalidate = useInvalidateSnippets();
    return useMutation({
        mutationFn: ({
            snippetId,
            isPublic,
        }: {
            snippetId: string;
            isPublic: boolean;
        }) => setSnippetPublic(snippetId, isPublic),
        onSuccess: () => {
            invalidate();
            toast.success("Snippet visibility updated!");
        },
        onError: (error) => {
            toast.error((error as Error).message);
        },
    });
}

export function useAddTagsToSnippet() {
    const invalidate = useInvalidateSnippets();
    return useMutation({
        mutationFn: ({
            snippetId,
            tagIds,
        }: {
            snippetId: string;
            tagIds: string[];
        }) => addTagsToSnippet(snippetId, tagIds),
        onSuccess: () => {
            invalidate();
            toast.success("Tags added!");
        },
        onError: (error) => {
            toast.error((error as Error).message);
        },
    });
}

export function useRemoveTagFromSnippet() {
    const invalidate = useInvalidateSnippets();
    return useMutation({
        mutationFn: ({
            snippetId,
            tagId,
        }: {
            snippetId: string;
            tagId: string;
        }) => removeTagFromSnippet(snippetId, tagId),
        onSuccess: () => {
            invalidate();
            toast.success("Tag removed!");
        },
        onError: (error) => {
            toast.error((error as Error).message);
        },
    });
}
