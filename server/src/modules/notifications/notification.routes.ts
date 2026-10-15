import {Router} from 'express'
import { and, eq, desc, count } from 'drizzle-orm'
import { db } from '../../db'
import { authenticateAccessToken, AuthenticateRequest } from '../../middleware/authenticateAccessToken'
import { applications, companies, companyJoinRequest, companyMembers, listings, notifications, users } from '../../db/schema'

const router = Router()

router.get('/applicationRequest', authenticateAccessToken, async (req:AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authorization required'})
        }

        const companyUser = await db.query.companyMembers.findFirst({where: eq(companyMembers.userId, req.user.userId)})

        if(!companyUser){
            return res.status(403).json({message: 'Permission needed'})
        }

        const applicationRequestNotofication = await db.select({
            notificationId: notifications.notificationId,
            type: notifications.type,
            isRead: notifications.isRead,
            createdAt: notifications.createdAt,
            actorId:notifications.actorId,
            actorFirstName: users.firstName,
            actorLastName: users.lastName,
            actorUserName: users.username,
            listingName: listings.name,
            applicationId: notifications.applicationId
        }).from(notifications)
        .innerJoin(
            users,
            eq(notifications.actorId, users.userId)
        )
        .innerJoin(
            applications,
            eq(notifications.applicationId, applications.applicationId)
        )
        .innerJoin(
            listings,
            eq(applications.listingId, listings.listingId)
        )
        .where(
            and(
                eq(notifications.recipientId, req.user.userId),
                eq(listings.companyId, companyUser.companyId)
            )
        )
        .orderBy(desc(notifications.createdAt))
        .limit(10)

        const formatedNotifications = 
            applicationRequestNotofication.map(notification => ({
                notificationId: notification.notificationId,
                type: notification.type,
                isRead: notification.isRead,
                createdAt: notification.createdAt,
                listingName: notification.listingName,
                actor: {
                    userId: notification.actorId,
                    firstName: notification.actorFirstName,
                    lastName: notification.actorLastName,
                    username: notification.actorUserName
                },
                applicationId: notification.applicationId
            }))

        return res.status(200).json({notifications: formatedNotifications})

    }catch (error) {
        console.error(error)

        return res.status(500).json({message: 'Failed to fetch application request notfications'})
    }
})

router.get('/joinRequest', authenticateAccessToken, async (req:AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authorization needed'})
        }

        const companyOwner = await db.query.companies.findFirst({where: eq(companies.ownerId, req.user.userId)})

        if(!companyOwner){
            return res.status(403).json({message: 'Permission needed'})
        }

        const joinRequestNotification = await db.select({
            notificationId: notifications.notificationId,
            type: notifications.type,
            isRead: notifications.isRead,
            createdAt: notifications.createdAt,
            actorId: notifications.actorId,
            actorFirstName: users.firstName,
            actorLastName: users.lastName,
            actorUserName: users.username,
            requestId: notifications.requestId
        }).from(notifications)
        .innerJoin(
            users,
            eq(notifications.actorId, users.userId)
        )
        .innerJoin(
            companyJoinRequest,
            eq(notifications.requestId, companyJoinRequest.requestId)
        )
        .where(
            and(
                eq(notifications.recipientId, req.user.userId),
                eq(companyJoinRequest.companyId, companyOwner.companyId)
            )
        )
        .orderBy(desc(notifications.createdAt))
        .limit(10)

        const formatedNotifications = 
            joinRequestNotification.map(notification => ({
                notificationId: notification.notificationId,
                type: notification.type,
                isRead: notification.isRead,
                createdAt: notification.createdAt,
                actor: {
                    userId: notification.actorId,
                    firstName: notification.actorFirstName,
                    lastName: notification.actorLastName,
                    username: notification.actorUserName
                },
                requestId: notification.requestId
            }))
        
        return res.status(200).json({notifications: formatedNotifications})
    }catch (error){
        console.error(error)

        return res.status(500).json({message:'Failed to fetch join request'})
    }
})

router.get('/applicationStatus', authenticateAccessToken, async (req: AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authorization required'})
        }

        const applicationStatusNotification = await db.select({
            notificationId: notifications.notificationId,
            type: notifications.type,
            isRead: notifications.isRead,
            createdAt: notifications.createdAt,
            actorId:notifications.actorId,
            companyName: companies.name,
            listingName: listings.name,
            applicationId: notifications.applicationId,
            
        }).from(notifications)
        .innerJoin(
            applications,
            eq(notifications.applicationId, applications.applicationId)
        )
        .innerJoin(
            listings,
            eq(applications.listingId, listings.listingId)
        )
        .innerJoin(
            companies,
            eq(listings.companyId, companies.companyId)
        )
        
        .where(
            eq(notifications.recipientId, req.user.userId)
        )
        .orderBy(desc(notifications.createdAt))
        .limit(10)

        const formatedNotifications =
            applicationStatusNotification.map(notification => ({
                notificationId: notification.notificationId,
                type: notification.type,
                isRead: notification.isRead,
                createdAt: notification.createdAt,
                listingName: notification.listingName,
                actor: {
                    userId: notification.actorId,
                },
                companyName: notification.companyName,
                applicationId: notification.applicationId
            }))
            
        return res.status(200).json({notifications: formatedNotifications})
    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to fetch application status notification'})
    }
})

router.get('/unread-count', authenticateAccessToken, async(req: AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authorization needed'})
        }

        const [result] = await db.select({
            unreadCount: count()
        })
        .from(notifications)
        .where(
            and(
                eq(notifications.recipientId, req.user.userId),
                eq(notifications.isRead, false)
            )
        )

        return res.status(200).json({unreadCount: result.unreadCount})
    }catch (error){
        console.log(error)
        
        return res.status(500).json({message: 'Failed to fetch unread'})
    }
})

router.patch('/:id/read', authenticateAccessToken, async (req:AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message:'Authentication needed'})
        }

        const notificationId = req.params.id as string
        
        const [updatedNotification] = await db.update(notifications).set({
            isRead: true
        })
        .where(
            and(
                eq(notifications.notificationId, notificationId),
                eq(notifications.recipientId, req.user.userId),
                eq(notifications.isRead, false)
            )
        )
        .returning({
            notificationId: notifications.notificationId,
            isRead: notifications.isRead
        })

        if(!updatedNotification){
            return res.status(404).json({message: 'Notification not found'})
        }

        return res.status(200).json({
            message: 'Notification marked as read',
            notification: updatedNotification
        })
    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to mark notification as read'})
    }
})

router.patch('/read-all', authenticateAccessToken, async (req: AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authorization needed'})
        }

        const updatedNotifications = await db.update(notifications).set({
            isRead: true
        })
        .where(
            and(
                eq(notifications.recipientId, req.user.userId),
                eq(notifications.isRead, false)
            )
        )
        .returning({
            notificationId: notifications.notificationId
        })

        return res.status(200).json({
            message: 'All notifications marked as read',
            updatedCount: updatedNotifications.length
        })
    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to mark all notifications as read'})
    }
})



export default router