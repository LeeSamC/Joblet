import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getApplications } from "../applications.api";
import { CompanyKeys, useGetUserCompany } from "../../companies/hooks/useCompanies";
import { useAuthStore } from "../../../stores/auth.store";

export const ApplicationKeys = {
    all: ['application'] as const,

    applications: (companyId: string) =>
        [...CompanyKeys.all, 'applications', companyId] as const
}

export function useGetApplications(){
    const user = useAuthStore(state => state.user)
    const {data: userCompany} = useGetUserCompany()
    const companyId = userCompany?.company?.companyId

    return useQuery({
        queryKey: ApplicationKeys.applications(companyId ?? ''),
        queryFn: getApplications,
        enabled: !!user?.userId && !!companyId
    })
}