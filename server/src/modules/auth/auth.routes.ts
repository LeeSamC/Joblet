import {Router} from 'express'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import { db } from '../../db'
import { users } from '../../db/schema'
import { refreshTokens } from '../../db/schema'
import { eq } from 'drizzle-orm'

import {z} from 'zod'
import { authenticateRefreshToken } from '../../middleware/authenticateRefreshToken'
import { authenticateAccessToken, AuthenticateRequest } from '../../middleware/authenticateAccessToken'
import { ref } from 'process'
import { clear } from 'console'

const router = Router()

const loginSchema = z.object({
    username: z.string().min(3).max(100),
    password: z.string().min(8)
})

const registerSchema = z.object({
    firstName: z.string().min(3).max(100),
    lastName: z.string().min(3).max(100),
    username: z.string().min(3).max(100),
    password: z.string().min(8),
    confirmPassword: z.string(),
    role: z.enum(['JOBSEEKER', 'JOBPROVIDER'])
}).refine(
    data => data.password === data.confirmPassword, {
        message: 'Passwords dont match'
    }
)

function issueAccessToken(userId: string){
    if(!process.env.ACCESS_TOKEN_SECRET){
        throw new Error('ACCESS_TOKEN_SECRET is not configured')
    }

    return jwt.sign({userId}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '30m'})
}

function issueRefreshToken(userId: string) {
    if(!process.env.REFRESH_TOKEN_SECRET){
        throw new Error('REFRESH_TOKEN_SECRET is not configured')
    }

    return jwt.sign({userId}, process.env.REFRESH_TOKEN_SECRET, {expiresIn: '7d'})
}

function setAuthCookies(res: any, accessToken: string, refreshToken: string){
    const isProduction = process.env.NODE_ENV === 'production'

    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax' as const,
        path: '/'
    }

    res.cookie('accessToken', accessToken, {
        ...cookieOptions,
        maxAge: 30 * 60 * 1000
    })

    res.cookie('refreshToken', refreshToken, {
        ...cookieOptions,
        maxAge: 7 * 24 * 60* 60 * 1000
    })
}

function clearAuthCookies(res: any){
    const isProduction = process.env.NODE_ENV === 'production'

    const cookieOptions = {
        httpOnly: true,
        secure: isProduction,
        sameSite: 'lax' as const,
        path: '/'
    }

    res.clearCookie('accessToken', cookieOptions)
    res.clearCookie('refreshToken', cookieOptions)
}

router.post('/login', async (req, res) => {
    try{
        const data = loginSchema.parse(req.body)

        const user = await db.query.users.findFirst({where: eq(users.username, data.username)})

        if(!user){
            return res.status(401).json({message: 'Username or password is invalid'})
        }

        const validPassword = await bcrypt.compare(data.password, user.passwordHash)

        if(!validPassword){
            return res.status(401).json({message: 'Username or password is invalid'})
        }

        await db.delete(refreshTokens).where(eq(refreshTokens.userId, user.userId))

        const accessToken = issueAccessToken(user.userId)
        const refreshToken = issueRefreshToken(user.userId)

        setAuthCookies(res, accessToken, refreshToken)

        await db.insert(refreshTokens).values({
            token: refreshToken,
            userId: user.userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            revoked: false
        })
        
        return res.json({
            message: 'Successfully logged in',
            user: {
                userId: user.userId,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username
            }
        })
    }catch (error){

        if(error instanceof z.ZodError){
            return res.status(400).json({message: 'Invalid input', error: error.issues})
        }
        console.error(error)

        return res.status(500).json({message: 'Failed to login user'})
    }
})


router.post('/register', async (req, res) => {
    try{
        const data = registerSchema.parse(req.body)

        const existingUser = await db.query.users.findFirst({where: eq(users.username, data.username)})

        if(existingUser){
            return res.status(409).json({message: 'Username already exist'})
        }

        const passwordHash = await bcrypt.hash(data.password, 12)

        const [newUser] = await db.insert(users).values({
            firstName: data.firstName,
            lastName: data.lastName,
            username: data.username,
            passwordHash: passwordHash,
            role: data.role
        }).returning({
            userId: users.userId,
            firstName: users.firstName,
            lastName: users.lastName,
            username: users.username,
            role: users.role
        })

        const accessToken = issueAccessToken(newUser.userId)
        const refreshToken = issueRefreshToken(newUser.userId)

        setAuthCookies(res, accessToken, refreshToken)

        await db.insert(refreshTokens).values({
            token: refreshToken,
            userId: newUser.userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            revoked: false
        })

        return res.status(201).json({
            message: 'Successfully registered a new user',
            user: newUser
        })
    }catch (error) {

        if(error instanceof z.ZodError){
            return res.status(400).json({message: 'Invalid input', error: error.issues})
        }

        console.error(error)

        return res.status(500).json({message: 'Failed to register user'})
    }
})

router.post('/refresh', authenticateRefreshToken, async (req: AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authentication required'})
        }

       const oldRefreshToken = req.cookies.refreshToken

        if(!oldRefreshToken){
            return res.status(401).json({message: 'Refresh token required'})
        }

        const user = await db.query.users.findFirst({where: eq(users.userId, req.user.userId)})

        if(!user){
            clearAuthCookies(res)

            return res.status(404).json({message: 'User not found'})
        }


        await db.update(refreshTokens).set({revoked:true}).where(eq(refreshTokens.token, oldRefreshToken))


        const accessToken = issueAccessToken(user.userId)
        const refreshToken = issueRefreshToken(user.userId)

        await db.insert(refreshTokens).values({
            token: refreshToken,
            userId: user.userId,
            expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            revoked: false
        })

        setAuthCookies(res, accessToken, refreshToken)

        return res.json({
            message: 'Successfully refresh tokens',
            user: {userId: user.userId}
        })
        
    }catch (error){
        console.log(error)

        return res.status(500).json({message: 'Failed to refresh tokens'})
    }
})

router.post('/logout', async (req, res) => {
    try{
        const refreshToken = req.cookies.refreshToken

        if(refreshToken) {
            await db.update(refreshTokens).set({revoked: true}).where(eq(refreshTokens.token, refreshToken))
        }

        clearAuthCookies(res)

        return res.status(200).json({message: 'Successfully logged out'})
    }catch (error){
        console.log(error)

        return res.status(500).json({message: 'Failed to log out'})
    }
})

router.get('/me', authenticateAccessToken, async (req: AuthenticateRequest, res) => {
    try{
        if(!req.user){
            return res.status(401).json({message: 'Authenticaton required'})
        }

        const result = await db.select({
            userId: users.userId,
            firstName: users.firstName,
            lastName: users.lastName,
            username: users.username
        }).from(users)
        .where(eq(users.userId, req.user.userId))
        .limit(1)

        const user = result[0]

        if(!user){
            return res.status(404).json({message: 'User not found'})
        }

        return res.status(200).json({user})
    }catch (error){
        console.error(error)

        return res.status(500).json({message: 'Failed to fetch user info'})
    }
})




export default router