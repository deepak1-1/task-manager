import { Router } from 'express'

import {
    login,
    logout,
    signup,
    googleLogin,
    googleSignup,
} from './controller.js'
import { reqErrorHandlerWrapper } from '../../utils/index.js'

const authPublicRouter = Router()
const authProtectedRouter = Router()

authPublicRouter.post('/login', reqErrorHandlerWrapper(login))

authPublicRouter.post('/login-google', reqErrorHandlerWrapper(googleLogin))

authPublicRouter.post('/signup', reqErrorHandlerWrapper(signup))

authPublicRouter.post('/signup-google', reqErrorHandlerWrapper(googleSignup))

authProtectedRouter.post('/logout', reqErrorHandlerWrapper(logout))

export { authProtectedRouter, authPublicRouter }
