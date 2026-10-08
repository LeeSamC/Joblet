import {useMutation, useQuery, useQueryClient} from '@tanstack/react-query'

import { getCompanies, getCompanyMembers, getUserCompany, addCompany, addRequest, getRequest, approveRequest, declineRequest, getCompanyListings, getCompanyApplications, getCompanyApplication, approveApplication, rejectApplication } from '../companies.api'
import { useAuthStore } from '../../../stores/auth.store'

export const CompanyKeys = {
    all: ['company'] as const,

    lists: () => 
        [...CompanyKeys.all, 'list'] as const,

    members: (companyId: string) =>
        [...CompanyKeys.all, 'members', companyId] as const,

    listings: (companyId: string) =>
        [...CompanyKeys.all, 'listings', companyId] as const,

    applications: (companyId: string) =>
        [...CompanyKeys.all, 'applications', companyId] as const,

    application: (companyId: string, applicationId: string) =>
        [...CompanyKeys.all, 'application', companyId, applicationId] as const,

    userCompany: (userId: string) => 
        [...CompanyKeys.all, 'user', userId] as const,

    requests: (companyId: string) => 
        [...CompanyKeys.all, 'requests', companyId] as const,

    request: (companyId: string, requestId: string) =>
        [...CompanyKeys.all, 'request',companyId, requestId] as const
    
}

export function useGetCompanies() {
    return useQuery({
        queryKey: CompanyKeys.lists(),
        queryFn: getCompanies
    })
}

export function useGetCompanyListings(){
    const user = useAuthStore(state => state.user)
    const {data: userCompany} = useGetUserCompany()
    const companyId = userCompany?.company?.companyId

    return useQuery({
        queryKey: CompanyKeys.listings(companyId ?? ''),
        queryFn: getCompanyListings,
        enabled: !!user?.userId && !!companyId
    })
}

export function useGetCompanyApplications(){
    const user = useAuthStore(state => state.user)
    const {data: userCompany} = useGetUserCompany()
    const companyId = userCompany?.company?.companyId

    return useQuery({
        queryKey: CompanyKeys.applications(companyId ?? ''),
        queryFn: getCompanyApplications,
        enabled: !!user?.userId && !!companyId
    })
}

export function useGetCompanyApplication(applicationId: string){
    const user = useAuthStore(state => state.user)
    const {data: userCompany} = useGetUserCompany()
    const companyId = userCompany?.company?.companyId

    return useQuery({
        queryKey: CompanyKeys.application(companyId!, applicationId),
        queryFn: () => getCompanyApplication(applicationId),
        enabled: !!user?.userId && !!companyId && !!applicationId
    })
}

export function useGetCompanyMembers() {
    const user = useAuthStore(state => state.user)

    const {data: userCompany} = useGetUserCompany()

    const companyId = userCompany?.company?.companyId


    return useQuery({
        queryKey: CompanyKeys.members(companyId ?? ''),
        queryFn: getCompanyMembers,
        enabled: !!user?.userId && !!companyId
    })
}

export function useGetUserCompany() {
    const user = useAuthStore(state => state.user)
    
    return useQuery({
        queryKey: CompanyKeys.userCompany(user?.userId ?? ''),
        queryFn: getUserCompany,
        enabled: !!user?.userId
    })
}

export function useAddCompany() {
    const queryClient = useQueryClient()
    const user = useAuthStore(state => state.user)

    return useMutation({
        mutationFn: addCompany,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: CompanyKeys.userCompany(user?.userId ?? '')
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

        onSuccess: (_, companyId) => {
            queryClient.invalidateQueries({
                queryKey: CompanyKeys.requests(companyId)
            })

        }
    })
}

export function useGetRequest() {
    const {data: userCompany} = useGetUserCompany()
    const companyId = userCompany?.company?.companyId

    return useQuery({
        queryKey: CompanyKeys.requests(companyId ?? ''),
        queryFn: getRequest,
        enabled: !!companyId
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
                queryKey: CompanyKeys.requests(variables.companyId)
            })

            queryClient.invalidateQueries({
                queryKey:CompanyKeys.members(variables.companyId)
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
                queryKey: CompanyKeys.requests(variables.companyId)
            })
        }
    })
}

export function useApproveApplication() {
    const queryClient = useQueryClient()

    const {data: userCompany} = useGetUserCompany()
    const companyId = userCompany?.company?.companyId as string

    return useMutation({
        mutationFn: ({
            applicationId
        }: {
            applicationId: string
        }) => approveApplication(applicationId),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: CompanyKeys.applications(companyId)
            })

            queryClient.invalidateQueries({
                queryKey: CompanyKeys.application(companyId, variables.applicationId)
            })
        }

    
    })

}

export function useRejectApplication() {
    const queryClient = useQueryClient()
    const {data: userCompany} = useGetUserCompany()
    const comnpanyId = userCompany?.company?.companyId as string

    return useMutation({
        mutationFn: ({
            applicationId
        }:{ 
            applicationId: string
        }) => rejectApplication(applicationId),

        onSuccess: (_, variables) => {
            queryClient.invalidateQueries({
                queryKey: CompanyKeys.applications(comnpanyId)
            })

            queryClient.invalidateQueries({
                queryKey: CompanyKeys.application(comnpanyId, variables.applicationId)
            })
        }
    })
}