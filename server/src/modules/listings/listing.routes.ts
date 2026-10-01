import {Router} from 'express'
import { db } from '../../db'
import { eq, and } from 'drizzle-orm'

import { companies, listings, companyMembers } from '../../db/schema'
import { users } from '../../db/schema'

import {z} from 'zod'

import { AuthenticateRequest, authenticateAccessToken } from '../../middleware/authenticateAccessToken'

const router = Router()


const listingSchema = z.object({
    name: z.string().min(3).max(30),
    description: z.string().min(100).max(1000)
})

const editListingSchema = z.object({
    name: z.string().min(3).max(30),
    description: z.string().min(100).max(1000)
})

router.get('/', async(req, res) => {
    try{
        const allListings = await db.select({
            listingId: listings.listingId,
            companyId: listings.companyId,
            companyName: companies.name,
            name: listings.name,
            description: listings.description
        }).from(listings)
        .innerJoin(
            companies,
            eq(listings.companyId, companies.companyId)
        )
        
        if(allListings.length === 0){
            return res.status(404).json({message:'No listings found'})
        }

        return res.status(200).json({listings:allListings})
    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to fetch listings'})
    }
})

router.get('/:id', async (req, res) => {
    try{
        const listingId = req.params.id as string

        const [listing] = await db.select({
            listingId: listings.listingId,
            companyId: listings.companyId,
            companyName: companies.name,
            name: listings.name,
            description: listings.description,
            createdAt: listings.createdAt

        }).from(listings)
            .innerJoin(
                companies,
                eq(listings.companyId, companies.companyId)
            )
            .where(
                eq(listings.listingId, listingId)
            )

        if(!listing) {
            return res.status(404).json({message: 'Listing not found'})
        }

        return res.status(200).json({listing})
    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to fetch listing'})
    }
})

router.post('/', authenticateAccessToken, async (req: AuthenticateRequest, res) => {
    try{
        if (!req.user){
            return res.status(401).json({message:'Authentication required'})
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

        const data = listingSchema.parse(req.body)

        const [newListing] = await db.insert(listings).values({
            companyId: companyMember.companyId,
            name: data.name,
            description: data.description
        }).returning()

        return res.status(201).json({listing: newListing})

    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to add new listing'})
    }
})


router.patch('/:id/edit', authenticateAccessToken, async (req:AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authorization Required'})
        }

        const user = await db.query.users.findFirst({where: eq(users.userId, req.user.userId)})

        if(!user){
            return res.status(404).json({message: 'User not found'})
        }

        const companyMember = await db.query.companyMembers.findFirst({where: eq(companyMembers.userId, user.userId)})

        if(!companyMember){
            return res.status(403).json({message: 'Not a member of a company'})
        }

        const company = await db.query.companies.findFirst({where: eq(companies.companyId, companyMember.companyId)})

        const data = editListingSchema.parse(req.body)
        const listingId = req.params.id as string

        const [result] = await db.update(listings).set({
            name: data.name,
            description: data.description,
            updatedAt: new Date()
        })
        .where(
            and(
                eq(listings.companyId, company?.companyId as string),
                eq(listings.listingId, listingId )
            )
        ).returning()

        return res.status(200).json({
            message: 'Successfully edited listing',
            listing: result
        })
    }catch (error){
        console.error(error)

        return res.status(500).json({message: ' Failed to edit listing'})
    }
})

router.patch('/:id/disable', authenticateAccessToken, async(req:AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authorization required'})
        }

        const companyMember = await db.query.companyMembers.findFirst({where: eq(companyMembers.userId, req.user.userId)})

        if(!companyMember){
            return res.status(403).json({message: 'No permission'})
        }

        const listingId = req.params.id as string

        const [result] = await db.update(listings).set({
            status: 'DISABLED'
        })
        .where(
            and(
                eq(listings.listingId, listingId),
                eq(listings.companyId, companyMember.companyId)
            )
        ).returning()

        return res.status(200).json({
            message: 'Successfully disabled listing',
            listing: result
        })

    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to disable listing'})
    }
})

export default router
