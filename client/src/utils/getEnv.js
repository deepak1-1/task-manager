export const getEnv = (title) => {
    switch (title) {
        case 'SERVER_BASE_URL':
            return process.env.REACT_APP_SERVER_BASE_URL
        case 'GOOGLE_AUTH_CLIENT_ID':
            return process.env.REACT_APP_GOOGLE_CLIENT_ID
        case 'GOOGLE_AUTH_CLIENT_SECRET':
            return process.env.REACT_APP_GOOGLE_CLIENT_SECRET
        default:
            return null
    }
}
