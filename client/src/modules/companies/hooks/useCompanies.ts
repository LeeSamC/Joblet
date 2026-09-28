import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'

import { getCompanies, getCompanyMembers, getUserCompany, addCompany, addRequest, getRequest, approveRequest, declineRequest } from '../companies.api'

export const CompanyKeys = {
    all: ['company'] as const,

    lists: () => 
        [...CompanyKeys.all, 'list'] as const,

    members: () =>
        [...CompanyKeys.all, 'members'] as const,

    userCompany: () => 
        [...CompanyKeys.all, 'user'] as const,

    requests: () => 
        [...CompanyKeys.all, 'requests'] as const,

    request: (companyId: string) =>
        [...CompanyKeys.requests(), companyId] as const
    
}

export function useGetCompanies() {
    return useQuery({
        queryKey: CompanyKeys.lists(),
        queryFn: getCompanies
    })
}

export function useGetCompanyMembers() {
    return useQuery({
        queryKey: CompanyKeys.members(),
        queryFn: getCompanyMembers
    })
}

export function useGetUserCompany() {
    return useQuery({
        queryKey: CompanyKeys.userCompany(),
        queryFn: getUserCompany,
        retry: false
    })
}

export function useAddCompany() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: addCompany,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: CompanyKeys.userCompany()
            })

            queryClient.invalidateQueries({
                queryKey: CompanyKeys.lists()
            })
        }
    })
}

export function useAddRequest() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: addRequest,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: CompanyKeys.requests()
            })
        }
    })
}

export function useGetRequest(id: string) {
    return useQuery({
        queryKey: CompanyKeys.request(id),
        queryFn: () => getRequest(id),
        enabled: Boolean(id)
    })
}

export function useApproveRequest() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            companyId,
            requestId
        }: {
            companyId: string
            requestId: string
        }) => approveRequest(companyId, requestId),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: CompanyKeys.request(variables.companyId)
            })

            queryClient.invalidateQueries({
                queryKey:CompanyKeys.members()
            })
        }
    })
}

export function useDeclineRequest() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            companyId,
            requestId
        }: {
            companyId: string
            requestId: string
        }) => declineRequest(companyId, requestId),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: CompanyKeys.request(variables.companyId)
            })
        }
    })
}