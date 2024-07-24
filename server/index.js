import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'

import connectDatabase from './lib/database.js'
import { serverProtectedRouter, serverPublicRouter } from './router/index.js'
import { authMiddleware } from './utils/index.js'

dotenv.config()

const PORT = process.env.PORT || '4000'
const app = express()

const allowedOrigins = ['http://localhost:3000', 'http://localhost'] // to restrict user of different origins to send request

app.use('/server/static', express.static('public'))
app.use(
    cors({
        origin: '*',
        credentials: true,
    })
)
app.use(cookieParser())
app.use(express.json())

app.post('/test', (req, res) => {
    res.status(200).json({ success: true, message: 'Test Successful' })
})

app.use('/server', serverPublicRouter)
app.use('/server', authMiddleware, serverProtectedRouter)

connectDatabase(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on PORT: ${PORT}`)
    })
})
