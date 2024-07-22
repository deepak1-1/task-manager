import { Router } from 'express'

import AuthRouter from './auth/index.js'

const serverPublicRouter = Router()
const serverProtectedRouter = Router()

serverPublicRouter.use('/api/auth', AuthRouter.authPublicRouter)
serverProtectedRouter.use('/api/auth', AuthRouter.authProtectedRouter)

export { serverPublicRouter, serverProtectedRouter }
