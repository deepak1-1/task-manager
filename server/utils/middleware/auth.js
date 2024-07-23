import jwt from 'jsonwebtoken'

import { Session } from '../../models/index.js'

const accessTokenSecret = new TextEncoder().encode(
    process.env.ACCESS_TOKEN_SECRET
)

export const authMiddleware = async (req, res, next) => {
    const accessToken = req.cookies.access_token

    if (!accessToken)
        return res.status(401).json({ error: 'Unauthorized User' })

    try {
        const tokenData = jwt.verify(accessToken, accessTokenSecret)

        const session = await Session.findOne({
            token: accessToken,
            user_id: tokenData.userId,
            active: true,
        })

        if (!session) {
            res.clearCookie('access_token')
            return res.status(401).json({ error: 'Unauthorized User' })
        }

        req.user = { ...tokenData, accessToken }

        next()
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError)
            return res.status(400).json({ error: 'Invalid Token' })

        console.log(`[Error in auth middleware]: `, error)
        return res.status(400).json({
            error: 'Unauthorized User',
        })
    }
}
