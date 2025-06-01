import { useQueries } from "@tanstack/react-query";
import { fetchSnippets } from "@/lib/api/snippets";
import { fetchTags } from "@/lib/api/tags";
import { fetchFolders } from "@/lib/api/folders";
import type { User } from "@/lib/types";

export default function useListSnippetQuery(user: User | null) {
    return useQueries({
        queries: [
            {
                queryKey: ["snippet", "list"],
                queryFn: fetchSnippets,
                enabled: !!user,
            },
            {
                queryKey: ["tag", "list"],
                queryFn: fetchTags,
                enabled: !!user,
            },
            {
                queryKey: ["folder", "list"],
                queryFn: fetchFolders,
                enabled: !!user,
            },
        ],
        combine: (results) => {
            return {
                success: results.every((result) => result.isSuccess),
                loading: results.some((result) => result.isLoading),
                pending: results.some((result) => result.isPending),
                data: {
                    snippets: results[0].data?.snippets,
                    tags: results[1].data?.tags,
                    folders: results[2].data?.folders,
                },
            };
        },
    });
}
