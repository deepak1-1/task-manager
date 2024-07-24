export const promiseResolver = async (promise) => {
    try {
        const response = await promise
        return [response, null]
    } catch (error) {
        return [null, error]
    }
}
