import {application, Router} from 'express'
import { db } from '../../db'
import { eq, and } from 'drizzle-orm'
import { applications, companies, users } from '../../db/schema'
import { listings } from '../../db/schema'
import { companyMembers } from '../../db/schema'
import { authenticateAccessToken , AuthenticateRequest} from '../../middleware/authenticateAccessToken'
import {z} from 'zod'



const router = Router()

const applicationSchema = z.object({
    coverLetter: z.string().min(100).max(1000),
    resume: z.string().min(100).max(100)
})

router.get('/', authenticateAccessToken,async (req: AuthenticateRequest, res) => {
    try{

        if(!req.user){
            return res.status(401).json({message: 'Authentication required'})
        }

        const currentUser = await db.query.users.findFirst({where: eq(users.userId, req.user.userId)})

        if(!currentUser){
            return res.status(404).json({message: 'User not found'})
        }

        if(currentUser?.role !== 'JOBPROVIDER'){
            return res.status(403).json({message: 'You do not have permission'})
        }

        const companyMember = await db.query.companyMembers.findFirst({where: eq(companyMembers.userId, currentUser.userId)})

        if(!companyMember) {
            return res.status(404).json({message: 'You are not a company member'})
        }

        const result = await db.select().from(applications).innerJoin(
                        listings,
                        eq(applications.listingId, listings.listingId)
                        )
                        .innerJoin(
                            companies,
                            eq(listings.companyId, companies.companyId)
                        )
                        .where(
                            eq(companies.companyId, companyMember.companyId)
                        )
        if(result.length === 0){
            return res.status(404).json({message: 'No applications found'})
        }

        return res.status(200).json({applications: result})
    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to fetch applications'})
    }
})


router.get('/:id', authenticateAccessToken, async (req: AuthenticateRequest, res) => {
    try{
        const applicationId = req.params.id as string

        if(!req.user){
            return res.status(401).json({message: 'Authentication Required'})
        }

        const currentUser = await db.query.users.findFirst({where: eq(users.userId, req.user.userId)})

        if(!currentUser){
            return res.status(404).json({message: 'User not found'})
        }

        const companyMember = await db.query.companies.findFirst({where: eq(companyMembers.userId, currentUser.userId)})

        if(!companyMember) {
            return res.status(404).json({message: 'Company mebership not found '})
        }

        const result = await db.select().from(applications).innerJoin(
            listings,
            eq(applications.listingId, listings.listingId)
        )
        .innerJoin(
            companies,
            eq(listings.companyId, companies.companyId)
        )
        .where(
            and(
                eq(companies.companyId, companyMember.companyId),
                eq(applications.applicationId, applicationId)
            )
        )

        if(result.length === 0) {
            return res.status(404).json({message: 'No application found'})
        }

        return res.status(200).json({applicaiton: result})
    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to fetch application'})
    }
})

router.post('/:id/apply', authenticateAccessToken, async (req:AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authentication Required'})
        }

        const listingId = req.params.id as string

        const listing = await db.query.listings.findFirst({where: eq(listings.listingId, listingId)})

        if(!listing){
            return res.status(404).json({message: 'Listing not found'})
        }

        const user = await db.query.users.findFirst({where: eq(users.userId, req.user.userId)})

        if(!user){
            return res.status(404).json({message: 'User not found'})
        }

        if(user.role !== 'JOBSEEKER'){
            return res.status(403).json({message: 'You cannot apply'})
        }

        const existingAplication = await db.query.applications.findFirst({where:
            and(
                eq(applications.applicantId, user.userId),
                eq(applications.listingId, listing.listingId)
            )
        })

        if(existingAplication){
            return res.status(409).json({message: 'User has already applied'})
        }

        const data = applicationSchema.parse(req.body)

        const [application] = await db.insert(applications).values({
            applicantId: user.userId,
            listingId: listing.listingId,
            coverLetter: data.coverLetter,
            resume: data.resume,
            status: 'PENDING'
        }).returning()

        return res.status(201).json({application})

    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to apply for listing'})
    }

})


router.patch('/:id/review', authenticateAccessToken, async (req:AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authentication Required'})
        }

        const user = await db.query.users.findFirst({where: eq(users.userId, req.user.userId)})

        if(!user){
            return res.status(404).json({message: 'User not found'})
        }

        if(user.role !== 'JOBPROVIDER'){
            return res.status(403).json({message: 'You are not allowed '})
        }

        const companyMember = await db.query.companyMembers.findFirst({where: eq(companyMembers.userId, user.userId)})

        if(!companyMember){
            return res.status(404).json({message: 'Company membership not found'})
        }

        const applicationId = req.params.id as string

        const [application] = await db.select().from(applications)
            .innerJoin(
                listings,
                eq(applications.listingId, listings.listingId)
            )
            .innerJoin(
                companies,
                eq(listings.companyId, companies.companyId)
            )
            .where(
                and(
                    eq(companies.companyId, companyMember.companyId),
                    eq(applications.applicationId, applicationId),
                    eq(applications.status, 'PENDING')
                )
                
            )
        
        if (!application) {
            return res.status(404).json({message: 'Application not found'})
        }

        const [reviewingApplication] = await db.update(applications).set({
            status: 'REVIEWING'
        }) 
        .where(
            eq(applications.applicationId, application.applications.applicationId)
        ).returning()
    
        

        return res.status(200).json({reviewingApplication})
    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to review application'})
    }

})


router.patch('/:id/approve', authenticateAccessToken, async (req:AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authentication Required'})
        }

        const user = await db.query.users.findFirst({where: eq(users.userId, req.user.userId)})

        if(!user){
            return res.status(404).json({message: 'User not found'})
        }

        if(user.role !== 'JOBPROVIDER'){
            return res.status(403).json({message: 'Not allowed'})
        }

        const companyMember = await db.query.companyMembers.findFirst({where: eq(companyMembers.userId, user.userId)})

        if(!companyMember){
            return res.status(404).json({message: 'Company Membership not found'})
        }

        const applicationId = req.params.id as string

        const [application] = await db.select().from(applications)
            .innerJoin(
                listings,
                eq(applications.listingId, listings.listingId)
            )
            .innerJoin(
                companies,
                eq(listings.companyId, companies.companyId)
            )
            .where(
                and(
                    eq(companies.companyId, companyMember.companyId),
                    eq(applications.applicationId, applicationId),
                    eq(applications.status, 'REVIEWING')
                )
            )
        
        if(!application){
            return res.status(404).json({message:'Application not found'})
        }

        const [approvedApplication] = await db.update(applications).set({
            status: 'APPROVED'
        }).where(eq(applications.applicationId, application.applications.applicationId)).returning()

        return res.status(200).json({approvedApplication})
    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to approve applicaiton'})
    }


})


router.patch('/:id/rejected', authenticateAccessToken, async (req:AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authentication Required'})
        }

        const user = await db.query.users.findFirst({where: eq(users.userId, req.user.userId)})

        if(!user){
            return res.status(404).json({message: 'User not found'})
        }

        if(user.role !== 'JOBPROVIDER'){
            return res.status(403).json({message: 'You do not have permission'})
        }

        const companyMember = await db.query.companyMembers.findFirst({where: eq(companyMembers.userId, user.userId)})

        if(!companyMember){
            return res.status(404).json({message: 'Company Membership not found'})
        }
        

        const applicationId = req.params.id as string

        const [application] = await db.select().from(applications)
            .innerJoin(
                listings,
                eq(applications.listingId, listings.listingId)
            )
            .innerJoin(
                companies,
                eq(listings.companyId, companies.companyId)
            )
            .where(
                and(
                    eq(applications.applicationId, applicationId),
                    eq(companies.companyId, companyMember.companyId),
                    eq(applications.status, 'REVIEWING')
                )
            )
        
        if(!application){
            return res.status(200).json({message: 'Application not found'})
        }

        const [rejectedApplication] = await db.update(applications).set({
            status: 'REJECTED'
        }).where(eq(applications.applicationId, application.applications.applicationId)).returning()

        return res.status(404).json({rejectedApplication})
    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to reject appliction'})
    }
})

export default router

