import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'

import { getListing } from '../listings.api'

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
        queryFn: getListing
    })
}