import { promiseResolver } from './promiseResolver.js'

export const reqErrorHandlerWrapper = (_function) => {
    return async (...args) => {
        const [response, error] = await promiseResolver(_function(...args))
        if (error) {
            console.log(`[Error]: `, error)

            if (args.length > 1) {
                return args[1].status(500).json({
                    error: 'Something went wrong!',
                })
            }
        } else {
            return response
        }
    }
}
