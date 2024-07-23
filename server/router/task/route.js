import { Router } from 'express'

import { getTasks, addTask, updateTask, deleteTask } from './controller.js'
import { reqErrorHandlerWrapper } from '../../utils/index.js'

const taskPublicRouter = Router()
const taskProtectedRouter = Router()

taskProtectedRouter.post('/add', reqErrorHandlerWrapper(addTask))

taskProtectedRouter.get('/get', reqErrorHandlerWrapper(getTasks))

taskProtectedRouter.put('/:id', reqErrorHandlerWrapper(updateTask))

taskProtectedRouter.delete('/:id', reqErrorHandlerWrapper(deleteTask))

export { taskProtectedRouter, taskPublicRouter }
