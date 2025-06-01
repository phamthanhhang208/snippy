import { createFolder, updateFolder, deleteFolder } from "@/lib/api/folders";
import type { Folder } from "@/lib/types";

import useDataMutation from "../mutations";

export function useCreateFolder() {
    return useDataMutation<Folder, unknown>(createFolder, {
        mutationKey: ["folder", "create"],
        successMessage: "Created Folder",
        invalidateKey: ["folder"],
    });
}

export function useUpdateFolder() {
    return useDataMutation<Folder, unknown>(updateFolder, {
        mutationKey: ["folder", "update"],
        successMessage: "Updated Folder",
        invalidateKey: ["folder"],
    });
}

export function useDeleteFolder() {
    return useDataMutation<string, unknown>(deleteFolder, {
        mutationKey: ["folder", "delete"],
        successMessage: "Deleted Folder",
        invalidateKey: ["folder"],
    });
}
