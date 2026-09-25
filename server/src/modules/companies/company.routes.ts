import {Router} from 'express'

import { db } from '../../db'
import { eq, and} from 'drizzle-orm'
import { companies, companyMembers, companyJoinRequest} from '../../db/schema'
import { users } from '../../db/schema'

import { z} from 'zod'

import { AuthenticateRequest, authenticateAccessToken } from '../../middleware/authenticateAccessToken'
import { es } from 'zod/v4/locales'

const router = Router()

const companySchema = z.object({
    name: z.string().min(10).max(50),
    description: z.string().min(100).max(500)
})


router.get('/', async (req, res) =>{
    try{
        const allCompanies = await db.select().from(companies)

        if(allCompanies.length === 0){
            return res.status(404).json({message: 'No companies found'})
        }

        return res.status(200).json({companies: allCompanies})
    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to fetch companies'})
    }
})

router.get('/companyMembers', authenticateAccessToken, async (req:AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authentication required'})
        }

        const user = await db.query.users.findFirst({where: eq(users.userId, req.user.userId)})

        if(!user){
            return res.status(404).json({message: 'User not found '})
        }

        if(user.role !== 'JOBPROVIDER'){
            return res.status(403).json({message: 'No permission'})
        }

        const companyMember = await db.query.companyMembers.findFirst({where: eq(companyMembers.userId, user.userId)})

        if(!companyMember){
            return res.status(403).json({message: 'No permission '})
        }

        const members = await db.select().from(companyMembers)
            .innerJoin(
                users,
                eq(companyMembers.userId, users.userId)
            )
            .innerJoin(
                companies,
                eq(companyMembers.companyId, companies.companyId)
            )
            .where(
                eq(companies.companyId, companyMember.companyId)
            )
        
        if(members.length === 0){
            return res.status(404).json({message: 'No members found'})
        }

        return res.status(200).json({companyMembers: members})
    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to fetch company members'})
    }
})

router.get('/userCompany', authenticateAccessToken, async (req:AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authentication required'})
        }

        const user = await db.query.users.findFirst({where: eq(users.userId, req.user.userId)})

        if(!user) {
            return res.status(404).json({message: 'User not found'})
        }

        if(user.role !== 'JOBPROVIDER'){
            return res.status(403).json({message:'No permission'})
        }

        const companyMember = await db.query.companyMembers.findFirst({where:eq(companyMembers.userId, user.userId)})

        if(!companyMember){
            return res.status(404).json({message: 'Company membership not found'})
        }

        const company = await db.query.companies.findFirst({where: eq(companies.companyId, companyMember.companyId)})

        if(!company){
            return res.status(404).json({message: 'Company not found'})
        }

        return res.status(200).json({company})
    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to fetch user company'})
    }
})

router.post('/', authenticateAccessToken, async (req: AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authentication required'})
        }

        const user = await db.query.users.findFirst({where: eq(users.userId, req.user.userId)})

        if(!user) {
            return res.status(404).json({message: 'User not found'})
        }

        if(user.role !== 'JOBPROVIDER'){
            return res.status(403).json({message: 'No permssion'})
        }

        const companyMember = await db.query.companyMembers.findFirst({where: eq(companyMembers.userId, user.userId)})

        if(companyMember){
            return res.status(409).json({message: 'User is already a member of a company'})
        }

        const data = companySchema.parse(req.body)

        const result = await db.transaction(async tx => {
            const [company] = await tx.insert(companies).values({
                ownerId: user.userId,
                name: data.name,
                description: data.description
            }).returning()

            const [member] = await tx.insert(companyMembers).values({
                companyId: company.companyId,
                userId: user.userId
            }).returning()

            return {company, member}

        })

        return res.status(200).json({newCompany:result})

    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to add new company'})
    }
})


router.post('/:id/request', authenticateAccessToken, async(req: AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authorization needed'})
        }

        const user = await db.query.users.findFirst({where: eq(users.userId, req.user.userId)})

        if(!user){
            return res.status(404).json({message: 'User not found'})
        }

        if(user.role !== 'JOBSEEKER'){
            return res.status(403).json({message: 'You do not have permissions'})
        }

        const companyId = req.params.id as string

        const company = await db.query.companies.findFirst({where: eq(companies.companyId, companyId)})

        if(!company){
            return res.status(404).json({message: 'Company not found'})
        }

        const existingMember = await db.query.companyMembers.findFirst({where: eq(companyMembers.userId, user.userId)})

        if(existingMember){
            return res.status(409).json({message: 'Already a member of a company'})
        }

        const existingRequest = await db.query.companyJoinRequest.findFirst({where: 
            and(
                eq(companyJoinRequest.userId, user.userId),
                eq(companyJoinRequest.companyId, companyId),
                eq(companyJoinRequest.status, 'PENDING')
            )
        })

        if(existingRequest){
            return res.status(409).json({message: 'Already requested to join'})
        }

        const [request] = await db.insert(companyJoinRequest).values({
            userId: user.userId,
            companyId: companyId
        }).returning()

        return res.status(201).json({request})
    }catch (error) {
        console.error(error)

        return res.status(500).json({message: 'Failed to send request'})
    }
})

router.get('/:id/joinRequest', authenticateAccessToken, async (req: AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authentication required'})
        }

        const user = await db.query.users.findFirst({where: eq(users.userId, req.user.userId)})

        if(!user){
            return res.status(404).json({message: 'User not found'})
        }

        const companyId = req.params.id as string

        const company = await db.query.companies.findFirst({where: 
            and(
                eq(companies.companyId, companyId),
                eq(companies.ownerId, user.userId)
            )
        })

        if(!company){
            return res.status(403).json({message: 'Company not found or user is not owner'})
        }

        const requests = await db.select().from(companyJoinRequest).innerJoin(
            users,
            eq(companyJoinRequest.userId, users.userId)
        )
        .where(
            and(
                eq(companyJoinRequest.companyId, companyId),
                eq(companyJoinRequest.status, 'PENDING')
            )
        )

        return res.status(200).json({requests})
    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to fetch request'})
    }
})

router.post('/:id/joinRequest/:requestId/approve', authenticateAccessToken, async (req: AuthenticateRequest, res) =>{
    try{
        if(!req.user){
            return res.status(401).json({message: 'Not Authorized'})
        }

        const companyId = req.params.id as string
        const requestId = req.params.requestId as string

        const company = await db.query.companies.findFirst({where:
            and(
                eq(companies.companyId, companyId),
                eq(companies.ownerId, req.user.userId)
            )
        })

        if(!company){
            return res.status(403).json({message: 'You are not the owner'})
        }

        const request = await db.query.companyJoinRequest.findFirst({where:
            and(
                eq(companyJoinRequest.requestId, requestId),
                eq(companyJoinRequest.companyId, companyId),
                eq(companyJoinRequest.status, 'PENDING')
            )
        })

        if(!request){
            return res.status(404).json({message: 'Request not found'})
        }

        const result = await db.transaction(async tx => {
            const [member] = await tx.insert(companyMembers).values({
                companyId,
                userId: request.userId
            }).returning()

            const [updatedRequest] = await tx.update(companyJoinRequest).set({
                status: 'APPROVED',
                updatedAt: new Date()
            })
            .where(
                eq(companyJoinRequest.requestId, requestId)
            ).returning()

            return {member, request: updatedRequest}
        })

        return res.status(200).json(result)
        
    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to approve request'})
    }
})




export default router