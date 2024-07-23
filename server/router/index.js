import { Router } from 'express'

import AuthRouter from './auth/index.js'
import UserRouter from './user/index.js'
import TaskRouter from './task/index.js'

const serverPublicRouter = Router()
const serverProtectedRouter = Router()

serverPublicRouter.use('/api/auth', AuthRouter.authPublicRouter)
serverProtectedRouter.use('/api/auth', AuthRouter.authProtectedRouter)

serverPublicRouter.use('/api/user', UserRouter.userPublicRouter)
serverProtectedRouter.use('/api/user', UserRouter.userProtectedRouter)

serverPublicRouter.use('/api/task', TaskRouter.taskPublicRouter)
serverProtectedRouter.use('/api/task', TaskRouter.taskProtectedRouter)

export { serverPublicRouter, serverProtectedRouter }
