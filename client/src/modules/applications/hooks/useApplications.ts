import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { sendApplication } from "../applications.api";

export const ApplicationKeys = {
    all: ['application'] as const,

    applications: () =>
        [...ApplicationKeys.all, 'applications'] as const
}


export function useSendApplication(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: sendApplication,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ApplicationKeys.applications()
            })
        }
    }) 
}