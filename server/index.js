import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'

import connectDatabase from './lib/database.js'

dotenv.config()

const PORT = process.env.PORT || '4000'
const app = express()

const allowedOrigins = ['http://localhost:3000'] // to restrict user of different origins to send request

app.use('/server/static', express.static('public'))
app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    })
)
app.use(cookieParser())
app.use(express.json())

app.use((req, res, next) => {
    console.log(`${req.method} - ${req.url}`)
    next()
}) // for check in dev environment

app.post('/test', (req, res) => {
    console.log()
    res.status(200).json({ success: true, message: 'Test Successful' })
})

connectDatabase(() => {
    app.listen(PORT, () => {
        console.log(`Server listening on PORT: ${PORT}`)
    })
})
