import { promiseResolver } from './promiseResolver.js'

export const reqErrorHandlerWrapper = (_function) => {
    return async (...args) => {
        const [response, error] = await promiseResolver(_function(...args))
        if (error) {
            if (args.length > 1) {
                if (error.message.includes('Cast to ObjectId failed'))
                    return args[1]
                        .status(400)
                        .json({ success: false, error: 'Invalid Id' })

                if (error.code === 11000) {
                    return args[1].status(400).json({
                        success: false,
                        error: 'Already Exists',
                    })
                }

                console.log(`[Error]: `, error)
                return args[1].status(500).json({
                    error: 'Something went wrong!',
                })
            }

            console.log(`[Error]: `, error)
        } else {
            return response
        }
    }
}
