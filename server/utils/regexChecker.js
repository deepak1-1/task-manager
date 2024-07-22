export const checkRegex = (type = 'email', val = null) => {
    switch (type) {
        case 'email':
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(val)
    }
}
