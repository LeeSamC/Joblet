import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'

import { getListings, getListing, addListing, getListingApplicationStatus } from '../listings.api'
import { useAuthStore } from '../../../stores/auth.store'

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

export function useGetListingApplicationStatus(listingId: string) {
    const user = useAuthStore(state => state.user)
    return useQuery({
        queryKey: ['application-status', user?.userId, listingId],
        queryFn: () => getListingApplicationStatus(listingId),
        enabled: !!user?.userId && !!listingId
    })
}

