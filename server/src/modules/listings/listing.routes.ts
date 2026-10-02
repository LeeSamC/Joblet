import {Router} from 'express'
import { db } from '../../db'
import { eq, and, isNull, or, gt } from 'drizzle-orm'

import { companies, listings, companyMembers } from '../../db/schema'
import { users } from '../../db/schema'

import {z} from 'zod'

import { AuthenticateRequest, authenticateAccessToken } from '../../middleware/authenticateAccessToken'

const router = Router()


const listingSchema = z.object({
    name: z.string().min(3).max(30),
    description: z.string().min(100).max(1000),
    expiresAt: z.iso.datetime().nullable()
})
.refine(
    (data) => {
        if(!data.expiresAt) return true

        return new Date(data.expiresAt) > new Date()
    },
    {
        message: 'Expiration date must be in the future',
        path: ["expiresAt"]
    }
)

const editListingSchema = z.object({
    name: z.string().min(3).max(30),
    description: z.string().min(100).max(1000)
})

router.get('/', async(req, res) => {
    try{
        const now = new Date()

        const allListings = await db.select({
            listingId: listings.listingId,
            companyId: listings.companyId,
            companyName: companies.name,
            name: listings.name,
            description: listings.description,
            expiresAt: listings.expiresAt,
            createdAt: listings.createdAt,
        }).from(listings)
        .innerJoin(
            companies,
            eq(listings.companyId, companies.companyId)
        )
        .where(
            and(
                eq(listings.status, 'ACTIVE'),
                or(
                    isNull(listings.expiresAt),
                    gt(listings.expiresAt, now)
                )
            )
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
        const now = new Date()
        const listingId = req.params.id as string

        const [listing] = await db.select({
            listingId: listings.listingId,
            companyId: listings.companyId,
            companyName: companies.name,
            name: listings.name,
            description: listings.description,
            expiresAt: listings.expiresAt,
            createdAt: listings.createdAt

        }).from(listings)
            .innerJoin(
                companies,
                eq(listings.companyId, companies.companyId)
            )
            .where(
                and(
                    eq(listings.listingId, listingId),
                    eq(listings.status, 'ACTIVE'),
                    or(
                        isNull(listings.expiresAt),
                        gt(listings.expiresAt, now)
                    )
                )
                
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
            description: data.description,
            expiresAt: data.expiresAt
                ? new Date(data.expiresAt)
                : null
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

        const [listing] = await db.update(listings).set({
            status: 'DISABLED',
            updatedAt: new Date()
        })
        .where(
            and(
                eq(listings.listingId, listingId),
                eq(listings.companyId, companyMember.companyId),
                eq(listings.status, 'ACTIVE')
            )
        ).returning()

        if(!listing){
            return res.status(404).json({message: 'Listing not found'})
        }

        return res.status(200).json({
            message: 'Successfully disabled listing',
            listing
        })

    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to disable listing'})
    }
})

router.patch('/:id/enable', authenticateAccessToken, async (req: AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authorization required'})
        }

        const companyMember = await db.query.companyMembers.findFirst({where: eq(companyMembers.userId, req.user.userId)})

        if(!companyMember){
            return res.status(403).json({message: 'Permission required'})
        }

        const listingId = req.params.id as string

        const [listing] = await db.update(listings).set({
            status: 'ACTIVE',
            updatedAt: new Date()
        })
        .where(
            and(
                eq(listings.listingId, listingId),
                eq(listings.status, 'DISABLED'),
                eq(listings.companyId, companyMember.companyId)
            )
        ).returning()

        if(!listing){
            return res.status(404).json({message: 'Listing now found'})
        }

        return res.status(200).json({
            message: 'Successfully set listing to active',
            listing
        })
    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to set listing to active'})
    }
})

export default router
