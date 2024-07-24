import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'

import { User, Session } from '../../models/index.js'
import { checkRegex } from '../../utils/index.js'

const CLIENT_ID = process.env.CLIENT_ID
const SALT_ROUNDS = 12
const accessTokenSecret = new TextEncoder().encode(
    process.env.ACCESS_TOKEN_SECRET
)

export const login = async (req, res) => {
    const { email = '', password = '' } = req.body

    if (!checkRegex('email', email) || !password || !password.trim())
        return res.status(400).json({ success: false, error: 'Invalid Data' })

    const user = await User.findOne({ email: email })
    if (!user)
        return res.status(400).json({ success: false, error: 'No Such User' })

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch)
        return res
            .status(400)
            .json({ success: false, error: 'Invalid password' })

    const accessToken = jwt.sign(
        {
            userId: user._id,
            name: `${user.name.first}${!user.name.last ? '' : user.name.last}`,
            email: user.email,
        },
        accessTokenSecret,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || '1d',
            algorithm: 'HS256',
        }
    )

    const session = new Session({ user_id: user._id, token: accessToken })

    await session.save()

    res.cookie('access_token', accessToken, {
        httpOnly: true,
        secure: req.protocol === 'https',
        sameSite: 'strict',
        expires: new Date(
            Date.now() +
                (Number(process.env.COOKIE_EXPIRATION_DURATION) ||
                    24 * 60 * 60 * 1000)
        ),
    })
    return res.status(200).json({ success: true, message: 'Login Successful' })
}

export const logout = async (req, res) => {
    await Session.updateOne(
        { token: req.user.accessToken, user_id: req.user.userId },
        { active: false, updatedAt: Date.now() }
    )

    res.clearCookie('access_token')

    res.status(200).json({ success: true, message: 'Logout Successfully' })
}

export const signup = async (req, res) => {
    const {
        firstName = '',
        lastName = '',
        email = '',
        password = '',
        confirmPassword = '',
    } = req.body

    if (
        !firstName ||
        !firstName.trim() ||
        !checkRegex('email', email) ||
        !password ||
        !password.trim()
    )
        return res.status(400).json({ success: false, message: 'Invalid Data' })

    if (password !== confirmPassword)
        return res
            .status(400)
            .json({
                success: false,
                message: 'Password and confirm password not matches',
            })

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS)

    const user = new User({
        name: { first: firstName, last: lastName },
        email: email,
        password: hashedPassword,
    })

    await user.save()

    return res
        .status(200)
        .json({ success: true, message: 'Account Created Successfully' })
}

export const googleLogin = async (req, res) => {
    const { token } = req.body
    const client = new OAuth2Client(CLIENT_ID)

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        })

        const payload = ticket.getPayload()
        const { sub, name, email } = payload

        const user = await User.findOne({ email: email })
        if (!user)
            return res
                .status(400)
                .json({ success: false, error: 'No Such User' })

        const accessToken = jwt.sign(
            {
                userId: user._id,
                name: `${user.name.first}${
                    !user.name.last ? '' : user.name.last
                }`,
                email: user.email,
            },
            accessTokenSecret,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRATION || '1d',
                algorithm: 'HS256',
            }
        )

        const session = new Session({ user_id: user._id, token: accessToken })

        await session.save()

        res.cookie('access_token', accessToken, {
            httpOnly: true,
            secure: req.protocol === 'https',
            sameSite: 'strict',
            expires: new Date(
                Date.now() +
                    (Number(process.env.COOKIE_EXPIRATION_DURATION) ||
                        24 * 60 * 60 * 1000)
            ),
        })
        return res
            .status(200)
            .json({ success: true, message: 'Login Successful' })
    } catch (error) {
        res.status(401).json({ success: false, error: 'Invalid google token.' })
    }
}

export const googleSignup = async (req, res) => {
    const { token } = req.body
    const client = new OAuth2Client(CLIENT_ID)

    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: CLIENT_ID,
        })

        const payload = ticket.getPayload()
        const { sub, name, email } = payload

        const hashedPassword = await bcrypt.hash(sub, SALT_ROUNDS)

        const user = new User({
            name: { first: name },
            email: email,
            password: hashedPassword,
        })

        await user.save()

        return res
            .status(200)
            .json({ success: true, message: 'Account Created Successfully' })
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                error: 'Email already linked with an Account',
            })
        }

        return res
            .status(401)
            .json({ success: false, error: 'Invalid google token.' })
    }
}
