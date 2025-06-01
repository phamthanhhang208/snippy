import { updateTag, createTag, deleteTag } from "@/lib/api/tags";
import type { Tag } from "@/lib/types";

import useDataMutation from "../mutations";

export function useUpdateTag() {
    return useDataMutation<Tag, unknown>(updateTag, {
        mutationKey: ["tag", "update"],
        successMessage: "Updated Tag!",
        invalidateKey: ["tag"],
    });
}

export function useCreateTag() {
    return useDataMutation<Tag, unknown>(createTag, {
        mutationKey: ["tag", "create"],
        successMessage: "Created Tag!",
        invalidateKey: ["tag"],
    });
}

export function useDeleteTag() {
    return useDataMutation<string, unknown>(deleteTag, {
        mutationKey: ["tag", "delete"],
        successMessage: "Deleted Tag!",
        invalidateKey: ["tag"],
    });
}
