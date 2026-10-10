import {Router} from 'express'
import { and, eq, desc } from 'drizzle-orm'
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
            companies,
            eq(listings.companyId, companies.companyId)
        )
        .innerJoin(
            listings,
            eq(applications.listingId, listings.listingId)
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

export default router