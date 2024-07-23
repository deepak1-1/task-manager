import { Router } from 'express'

import { getUser } from './controller.js'
import { reqErrorHandlerWrapper } from '../../utils/index.js'

const userPublicRouter = Router()
const userProtectedRouter = Router()

userProtectedRouter.get('/get', reqErrorHandlerWrapper(getUser))

export { userProtectedRouter, userPublicRouter }
