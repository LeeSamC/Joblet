import {Router} from 'express'

import { db } from '../../db'
import { eq, and} from 'drizzle-orm'
import { companies, companyMembers } from '../../db/schema'
import { users } from '../../db/schema'

import {z} from 'zod'

import { AuthenticateRequest, authenticateAccessToken } from '../../middleware/authenticateAccessToken'

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

        return res.status(200).json({result})

    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to add new company'})
    }
})



router.post('/:id/addMember', authenticateAccessToken, async (req:AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message:'Authentication required'})
        }

        const user = await db.query.users.findFirst({where: eq(users.userId, req.user.userId)})

        if(!user){
            return res.status(404).json({message: 'User not found'})
        }

        if(user.role !== 'JOBPROVIDER'){
            return res.status(403).json({message: 'No permission'})
        }

        const companyOwner = await db.query.companies.findFirst({where: eq(companies.ownerId, user.userId)})

        if(!companyOwner){
            return res.status(403).json({message: 'Do not have permission to add'})
        }

        const companyId = req.params.id as string

        if(companyOwner.companyId !== companyId){
            return res.status(403).json({message: 'You do not own this company'})
        }

        const employeeId = req.body.userId

        if(!employeeId){
            return res.status(400).json({message: 'Employee Id is needed'})
        }

        const employee = await db.query.users.findFirst({where: eq(users.userId, employeeId)})

        if (!employee) {
            return res.status(404).json({
                message: 'Employee not found'
            })
        }

        if(employee.role !== 'JOBPROVIDER'){
            return res.status(404).json({message: 'Employee not found '})
        }

        const existingMember = await db.query.companyMembers.findFirst({where: eq(companyMembers.userId, employee.userId)})

        if(existingMember){
            return res.status(409).json({message: 'User already a member of a company'})
        }
       
        const [newMember] = await db.insert(companyMembers).values({
            companyId: companyId,
            userId: employeeId 
        }).returning()

        return res.status(201).json({member: newMember})


    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to add new member'})
    }
})

export default router