import { useQuery } from "@tanstack/react-query";
import type { User } from "@/lib/types";
import { fetchSnippets } from "@/lib/api/snippets";

export function useSnippets(user: User) {
    return useQuery({
        queryKey: ["snippet", "list"],
        queryFn: fetchSnippets,
        enabled: !!user,
    });
}

// export function useSnippet(id: string) {
//     return useQuery({
//         queryKey: ["snippet", id],
//         queryFn:
//     })
// }
