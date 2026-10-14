import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../../../stores/auth.store";
import { useGetUserCompany } from "../../companies/hooks/useCompanies";
import { getApplicationRequest, getApplicationStatus, getJoinRequest, getUnreadCount, readAllNotifications, readNotification } from "../notification.api";

export const NotificationKeys = {
    all: ['Notification'] as const,

    applicationReqest: (companyId: string) => 
        [...NotificationKeys.all, 'applicationRequest', companyId] as const,

    joinRequest: (userId: string) => 
        [...NotificationKeys.all, 'joinRequest', userId] as const,

    applicationStatus: (userId: string) =>
        [...NotificationKeys.all, 'applicationStatus', userId] as const,
    
    unreadCount: (userId: string) => 
        [...NotificationKeys.all, 'unreadCount', userId] as const
}

export function useGetApplicationRequest(){
    const user = useAuthStore(state => state.user)
    const {data: userCompany} = useGetUserCompany()
    const companyId = userCompany?.company?.companyId

    return useQuery({
        queryKey: NotificationKeys.applicationReqest(companyId ?? ''),
        queryFn: getApplicationRequest,
        enabled: !!user?.userId && !!companyId
    })
}

export function useGetJoinRequest() {
    const user = useAuthStore(state => state.user)
    const userId = user?.userId

    return useQuery({
        queryKey: NotificationKeys.joinRequest(userId ?? ''),
        queryFn: getJoinRequest,
        enabled: !!user?.userId && !!userId
    })
}

export function useGetApplicationStatus() {
    const user = useAuthStore(state => state.user)
    const userId = user?.userId
    return useQuery({
        queryKey: NotificationKeys.applicationStatus(userId ?? ''),
        queryFn: getApplicationStatus,
        enabled: !!userId
    })
}

export function useGetUnreadCount() {
    const user = useAuthStore(state => state.user)
    const userId = user?.userId
    return useQuery({
        queryKey: NotificationKeys.unreadCount(userId ?? ''),
        queryFn: getUnreadCount,
        enabled: !!userId
    })
}

export function useReadAllNotification() {
    const queryClient = useQueryClient()
    
    return useMutation({
        mutationFn: readAllNotifications,

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: NotificationKeys.all
            })
        }
    })
}

export function useReadNotifications() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            notificationId
        }:{
            notificationId: string
        }) => readNotification(notificationId),

        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: NotificationKeys.all
            })
        }
    })
}