import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'

import { getListings, getListing, addListing } from '../listings.api'

export const ListingKeys = {
    all: ['listings'] as const,

    lists: () =>
        [...ListingKeys.all, 'list'] as const,

    details: () =>
        [...ListingKeys.all, 'detail'] as const,

    detail: (id: string) =>
        [...ListingKeys.details(), id] as const
}

export function useListings() {
    return useQuery({
        queryKey: ListingKeys.lists(),
        queryFn: getListings
    })
}

export function useListing(id: string){
    return useQuery({
        queryKey:ListingKeys.detail(id),
        queryFn: () => getListing(id),
        enabled: Boolean(id)
    })
}

export function useAddListing(){
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: addListing,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ListingKeys.lists()
            })
        }
    })
}