import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'

import authRouter from './modules/auth/auth.routes.js'
import applicationRouter from './modules/applications/application.routes.js'

const app = express()

app.use(
    cors({
        origin: process.env.CLIENT_URL,
        credentials: true
    })
)

app.use(express.json())
app.use(cookieParser())

app.get('/api/health', (req, res) => {
    res.json({
        sucess: true,
        message: 'Joblet APIs is running'
    })
})

app.use('/api/auth', authRouter )
app.use('/api/application', applicationRouter)
export default app