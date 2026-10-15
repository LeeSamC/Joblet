import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { Bell, Check, CheckCheck, LoaderCircle } from "lucide-react";

import { useAuthStore } from "../../../stores/auth.store";
import { useGetApplicationRequest, useGetApplicationStatus, useGetJoinRequest, useGetUnreadCount, useReadAllNotification, useReadNotifications } from "../hooks/useNotifications";
import { useGetUserCompany } from "../../companies/hooks/useCompanies";

type NotificationItem = {
    notificationId: string
    type: string
    isRead: string
    createdAt: string
    listingName?: string
    companyName?: string
    actor: {
        userId: string
        firstName?: string
        lastName?: string
        username?: string
    } 
    applicationId?: string
    requestId?: string
}

function getNotificationMessage(notification: NotificationItem) {
    const actorName = 
        `${notification.actor.firstName ?? ""} ${
            notification.actor.lastName ?? ""
        }`.trim() ||
        notification.actor.username ||
        "Someone"

    switch (notification.type){
        case 'APPLICATION_RECEIVED':
            return {
                title: 'New application',
                message: `${actorName} applied for ${
                    notification.listingName ?? "your listing"
                }.`,
            }
        case "JOIN_REQUEST_RECEIVED":
        case "JOIN_REQUEST":
            return {
                title: "Company join request",
                message: `${actorName} requested to join your company`,
            }
        case "APPLICATION_APPROVED":
            return {
                title: "Application approved",
                message: `Your application for ${
                    notification.listingName ?? "a job"
                } was approved ${
                    notification.companyName
                        ? ` by ${notification.companyName}`
                        : ""
                }.`,
            }
        case 'APPLICATION_REJECTED':
            return {
                title: "Application rejected",
                message: `Your application for ${
                    notification.listingName ?? "a job"
                } was rejected${
                    notification.companyName
                        ? `by ${notification.companyName}`
                        : ""
                }.`,
            }
        default:
            return {
                title: "Notification",
                message: "You have a new notification"
            }
    }
}

function formatNotificationDate(date: string) {
    const parsedDate = new Date(date)

    if(Number.isNaN(parsedDate.getTime())) {
        return "";
    }

    return parsedDate.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "numeric",
        minute: "2-digit",
    });
}

export default function NotificationBell() {
    const [isOpen, setIsOpen] = useState(false)
    
    const user = useAuthStore(state => state.user)
    const navigate = useNavigate()

    const {data: userCompany} = useGetUserCompany()

    const applicationRequests = useGetApplicationRequest()
    const joinRequests = useGetJoinRequest()
    const applicationStatuses = useGetApplicationStatus()
    const unreadCount = useGetUnreadCount()

    const readOne = useReadNotifications()
    const readAll = useReadAllNotification()

    if(!user){
        return null
    }

    const isCompanyOwner = userCompany?.company?.ownerId === user.userId

    const role = user.role

    const applicationRequestItems: NotificationItem[] =
        applicationRequests.data?.notifications ?? []

    const joinRequestItems: NotificationItem[] = 
        joinRequests.data?.notifications ?? []
    
    const applicationStatusItems: NotificationItem[] = 
        applicationStatuses.data?.notifications ?? []

    
    const notifications: NotificationItem[] =
        role === 'JOBPROVIDER'
            ? [...applicationRequestItems,
                ...(isCompanyOwner ? joinRequestItems : []),
                
            ]
            : role === 'JOBSEEKER'
                ? applicationStatusItems
                : []

    const sortedNotifications = [...notifications].sort(
        (a, b) =>
            new Date(b.createdAt).getTime() -
            new Date(a.createdAt).getTime()
    )

    const unread = unreadCount.data?.unreadCount ?? 0

    function getDestination(notification: NotificationItem) {
        switch (notification.type) {
            case 'APPLICATION_RECEIVED':
                return "/company/applications"

            case "JOIN_REQUEST_RECEIVED":
            case "JOIN_REQUEST":
                return "/company/requests"
            
            case "APPLICATION_APPROVED":
            case "APPLICATION_REJECTED":
                return "/applications"

            default:
                return undefined
        }
    }

    function handleNotificationClick(notification: NotificationItem) {
        if(!notification.isRead){
            readOne.mutate({
                notificationId: notification.notificationId
            })
        }

        setIsOpen(false)

        const destination = getDestination(notification)

        if(destination){
            navigate(destination)
        }
    }

    function handleReadAll() {
        if(unread > 0 && !readAll.isPending) {
            readAll.mutate()
        }
    }

    const isLoading =
        (role === 'JOBPROVIDER' &&
            (applicationRequests.isLoading || joinRequests.isLoading)) ||
        (role === 'JOBSEEKER' && applicationStatuses.isLoading)

    const hasError = 
        (role === 'JOBPROVIDER' &&
            (applicationRequests.isError || joinRequests.isError)) ||
        (role === 'JOBSEEKER' && applicationStatuses.isError)
    
    return (
        <div className="relative">
            <button
                type="button"
                aria-label={`Notifications, ${unread} unread`}
                aria-expanded={isOpen}
                onClick={() => setIsOpen((previous) => !previous)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-gray-600 transition hover:bg-gray-100 hover:text-black"
            >
                <Bell size={21} />

                {unread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                        {unread > 99 ? "99+" : unread}
                    </span>
                )}
            </button>

            {isOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Close notifications"
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 z-40 cursor-default"
                    />

                    <div className="absolute right-0 z-50 mt-3 w-[min(24rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
                        <div className="flex items-center justify-between border-b px-4 py-3">
                            <div>
                                <h2 className="font-semibold text-gray-900">
                                    Notifications
                                </h2>

                                <p className="text-xs text-gray-500">
                                    {unread} unread
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={handleReadAll}
                                disabled={unread === 0 || readAll.isPending}
                                className="flex items-center gap-1.5 text-xs font-medium text-gray-600 hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                {readAll.isPending ? (
                                    <LoaderCircle 
                                        size={14}
                                        className="animate-spin"
                                    />
                                ): (
                                    <CheckCheck size={14} />
                                )}
                                Mark all read
                            </button>
                        </div>

                        <div className="max-h-104 overflow-y-auto">
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2 px-4 py-10 text-sm text-gray-500">
                                    <LoaderCircle
                                        size={18}
                                        className="animate-spin" 
                                    />
                                    Loading notifications...
                                </div>
                            ): hasError ? (
                                <div className="px-4 py-8 text-center text-sm text-red-600">
                                    Could not load notifications. Please try again
                                </div>
                            ): sortedNotifications.length === 0 ? (
                                <div className="px-4 py-10 text-center">
                                    <Bell
                                        size={28}
                                        className="mx-auto mb-2 text-gray-300"
                                    />
                                    <p className="text-sm font-medium text-gray-700">
                                        You are all caught up
                                    </p>
                                    <p className="mt-1 text-xs text-gray-500"> 
                                        New notifications will appear here
                                    </p>
                                </div>
                            ): (
                                sortedNotifications.map((notification) => {
                                    const content = getNotificationMessage(notification)

                                    return(
                                        <div
                                            key={notification.notificationId}
                                            className={`flex gap-3 border-b border-gray-100 px-4 py-3 transition hover:bg-gray-50 ${
                                                !notification.isRead
                                                    ? "bg-blue-50/60"
                                                    : ""
                                            }`}
                                        >
                                            <button
                                                type="button"
                                                onClick={() => 
                                                    handleNotificationClick(notification)
                                                }
                                                className="flex min-w-0 flex-1 gap-3 text-left"
                                            >
                                                <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-700">
                                                    <Bell size={17} />
                                                </div>

                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                        {content.title}
                                                    </p>

                                                    <p className="mt-0.5 wrap-break-words text-sm text-gray-600">
                                                        {content.message}
                                                    </p>

                                                    <p className="mt-1.5 text-xs text-gray-400">
                                                        {formatNotificationDate(
                                                            notification.createdAt
                                                        )}
                                                    </p>
                                                </div>

                                            </button>

                                            {!notification.isRead && (
                                                <button
                                                    type="button"
                                                    aria-label="Mark notification as read"
                                                    title='Mark as read'
                                                    disabled={readOne.isPending}
                                                    onClick={() =>
                                                        readOne.mutate({
                                                            notificationId: notification.notificationId
                                                        })
                                                    }
                                                    className="mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-500 hover:bg-gray-200 hover:text-black disabled:opacity-50"
                                                >
                                                    <Check size={16} />
                                                </button>
                                            )}

                                        </div>
                                    )
                                })
                            )}

                        </div>

                        <div className="border-t bg-gray-50 px-4 py-2">
                            <button
                                type="button"
                                onClick={() => setIsOpen(false)}
                                className="w-full py-1 text-center text-xs font-medium text-gray-500 hover:text-black"
                            >
                                Close
                            </button>

                        </div>
                    </div>
                </>
            )}
        </div>
    )
}