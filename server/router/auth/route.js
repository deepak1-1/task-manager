import { Router } from 'express'

import { login, logout, register } from './controller.js'
import { reqErrorHandlerWrapper } from '../../utils/index.js'

const authPublicRouter = Router()
const authProtectedRouter = Router()

authPublicRouter.post('/login', reqErrorHandlerWrapper(login))

authPublicRouter.post('/register', reqErrorHandlerWrapper(register))

authProtectedRouter.post('/logout', reqErrorHandlerWrapper(logout))

export { authProtectedRouter, authPublicRouter }
