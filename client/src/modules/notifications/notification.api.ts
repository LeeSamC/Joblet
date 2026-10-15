import { api } from "../../libs/api";

type ApplicationRequestNotification = {
    notificationId: string
    type: string
    isRead: string
    createdAt: string
    listingName: string
    actor: {
        userId: string
        firstName: string
        lastName: string
        username: string
    }
    applicationId: string
}

type CompanyJoinRequest = {
    notificationId: string
    type: string
    isRead: string
    createdAt: string
    actor: {
        userId: string
        firstName: string
        lastName: string
        username: string
    }
    requestId: string
}

type ApplicationStatusNotification = {
    notificationId: string
    type: string
    isRead: string
    createdAt: string
    listingName: string
    actor: {
        userId: string
    }
    companyName: string
    applicationId: string
}

type UpdatedNotification = {
    notificationId: string
    isRead: boolean
}

export async function getApplicationRequest() {
    return api<{
        notifications: ApplicationRequestNotification[]
    }>('/notification/applicationRequest')
}

export async function getJoinRequest(){
    return api<{
        notifications: CompanyJoinRequest[]
    }>('/notification/joinRequest')
}

export async function getApplicationStatus(){
    return api<{
        notifications: ApplicationStatusNotification[]
    }>('/notification/applicationStatus')
}

export async function getUnreadCount(){
    return api<{
        unreadCount: number
    }>('/notification/unread-count')
}

export async function readNotification(id: string){
    return api<{
        notification: UpdatedNotification
    }>(`/notification/${id}/read`, {
        method: 'PATCH'
    })
}

export async function readAllNotifications(){
    return api<{
        message: string
        updateCount: number
    }>('/notification/read-all', {
        method: 'PATCH'
    })
}