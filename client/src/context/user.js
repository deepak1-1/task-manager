import {
    useState,
    useEffect,
    useReducer,
    createContext,
    useContext,
} from 'react'
import { toast } from 'react-toastify'

import { authorizedAxios } from '../lib'
import { getEnv, promiseResolver } from '../utils'
import { Loader } from '../components'

const INITIAL_USER_STATE = {
    isAuthenticated: false,
    user: {},
}
const UNPROTECTED_PATHS = ['/login', '/signup']

const UserContext = createContext()

const reducers = (state, { type, payload }) => {
    switch (type) {
        case 'SET_USER': {
            return {
                ...state,
                isAuthenticated: true,
                user: { ...state.user, ...payload },
            }
        }
        case 'CLEAR_USER':
            return {
                ...state,
                isAuthenticated: false,
                user: {},
            }
    }
}

export const UserProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true)
    const [state, dispatch] = useReducer(reducers, INITIAL_USER_STATE)
    const pathname = window.location.pathname

    const serverBaseURL = getEnv('SERVER_BASE_URL')

    useEffect(() => {
        setIsLoading(true)
        loadUser()
    }, [pathname])

    const loadUser = async () => {
        setIsLoading(true)

        const [response, error] = await promiseResolver(
            authorizedAxios({
                url: `${serverBaseURL}/api/user/get`,
                method: 'GET',
            })
        )

        if (error) {
            dispatch({ type: 'CLEAR_USER' })
            if (!UNPROTECTED_PATHS.includes(pathname)) {
                window.location.href = '/login'
            }
            setIsLoading(false)
            return false
        }

        const data = response?.data
        if (data?.user) {
            dispatch({
                type: 'SET_USER',
                payload: data?.user,
            })
            if (pathname === '/login' || pathname === '/signup') {
                setIsLoading(false)
                window.location.href = '/'
            }
        } else {
            console.log(`[Error in user check request]: `, response)
            dispatch({
                type: 'CLEAR_USER',
            })
            if (!UNPROTECTED_PATHS.includes(pathname)) {
                setIsLoading(false)
                window.location.href = '/login'
            }
            setIsLoading(false)
        }
        setIsLoading(false)
        return false
    }

    const login = async ({ email, password }) => {
        setIsLoading(true)

        const [response, error] = await promiseResolver(
            authorizedAxios({
                url: `${serverBaseURL}/api/auth/login`,
                method: 'POST',
                data: { email, password },
            })
        )

        if (error) {
            console.log(`[Error in login request]: `, error)
            toast.error(error?.response?.data?.error)
            setIsLoading(false)
            return false
        }

        const data = response.data

        if (data?.success) {
            await loadUser()
            setIsLoading(false)
            return true
        }
        setIsLoading(false)
        return false
    }

    const logout = async () => {
        setIsLoading(true)

        const [response, error] = await promiseResolver(
            authorizedAxios({
                url: `${serverBaseURL}/api/auth/logout`,
                method: 'POST',
            })
        )

        if (error) {
            console.log(`[Error in logout request]: `, error)
            setIsLoading(false)
            toast.warning('Something went wrong. redirecting to login')
            setTimeout(() => {
                window.location.href = '/login'
            }, 2000)
            return false
        }

        dispatch({
            type: 'CLEAR_USER',
        })

        setIsLoading(false)
        toast.info('Logout Successful. Redirecting to login')
        setTimeout(() => {
            window.location.href = '/login'
        }, 2000)
    }

    const google = async (credentialResponse, type = 'login') => {
        setIsLoading(true)
        const [response, error] = await promiseResolver(
            authorizedAxios({
                url:
                    type === 'login'
                        ? `${serverBaseURL}/api/auth/login-google`
                        : `${serverBaseURL}/api/auth/signup-google`,
                method: 'POST',
                data: { token: credentialResponse.credential },
            })
        )

        if (error) {
            setIsLoading(false)
            toast.error(error?.response?.data?.error)
            return
        }
        if (type === 'login') {
            toast.success('Login Successful')
            loadUser()
        } else {
            toast.success('Signup Successful. Redirecting to login')
            setTimeout(() => {
                window.location.href = '/login'
            }, 2000)
        }
    }

    const signup = async ({
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
    }) => {
        setIsLoading(true)
        const [response, error] = await promiseResolver(
            authorizedAxios({
                url: `${serverBaseURL}/api/auth/signup`,
                method: 'POST',
                data: { firstName, lastName, email, password, confirmPassword },
            })
        )
        if (error) {
            setIsLoading(false)
            toast.error(error?.response?.data?.error)
            return
        }

        setIsLoading(false)
        toast.success('Signup Successful. Redirecting to login')
        setTimeout(() => {
            window.location.href = '/login'
        }, 2000)
    }

    if (isLoading) return <Loader fullScreen />

    return (
        <UserContext.Provider
            value={{
                isAuthenticated: state.isAuthenticated,
                user: state.user,
                login,
                logout,
                loadUser,
                google,
                signup,
                UNPROTECTED_PATHS,
            }}
        >
            {children}
        </UserContext.Provider>
    )
}

export const useUser = () => useContext(UserContext)
