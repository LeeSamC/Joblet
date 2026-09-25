import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'

import { getCompanies, getUserCompany, addCompany } from '../companies.api'


export const CompanyKeys = {
    all: ['company'] as const,

    lists: () =>
        [...CompanyKeys.all, 'list'] as const,

    details: () =>
        [...CompanyKeys.all, 'detail'] as const,

    detail: (id: string) =>
        [...CompanyKeys.details(), id] as const 
    
}

export function useCompanies() {
    return useQuery({
        queryKey: CompanyKeys.lists(),

        queryFn: getCompanies
    })
}

export function useGetUserCompany() {
    return useQuery({
        queryKey: CompanyKeys.details(),

        queryFn: getUserCompany
    })
}


export function useAddCompany() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: addCompany,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: CompanyKeys.lists()
            })
        }
    })
}