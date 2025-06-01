import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

type MutationFn<T, V> = (variables: V) => Promise<T>;

export default function useSnippetMutation<V, T>(
    mutationFn: MutationFn<T, V>,
    {
        mutationKey,
        successMessage,
        errorMessage = "Something went wrong",
        invalidateKey = ["snippets"],
    }: {
        mutationKey: string[];
        successMessage: string;
        errorMessage?: string;
        invalidateKey?: string[];
    }
) {
    const queryClient = useQueryClient();
    return useMutation({
        mutationKey,
        mutationFn,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: invalidateKey });
            toast.success(successMessage);
        },
        onError: (error) => {
            queryClient.invalidateQueries({ queryKey: invalidateKey });
            toast.error(errorMessage);
            console.error(error);
        },
    });
}
