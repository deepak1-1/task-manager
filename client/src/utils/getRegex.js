export const getRegex = (type) => {
    switch (type) {
        case 'PHONE_NUMBER':
            return /^\+?\d{6,15}$/
        case 'EMAIL':
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
        default:
            return /./
    }
}
