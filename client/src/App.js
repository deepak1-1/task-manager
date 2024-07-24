import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

import { Loader, RootLayout } from './components'

const Login = lazy(() => import('./pages/login'))
const Signup = lazy(() => import('./pages/signup'))
const Home = lazy(() => import('./pages/home'))
const PageNotFound = lazy(() => import('./pages/pageNotFound'))

const App = () => {
    // for hiding content while doing display website inside another page using iframe
    if (window.self !== window.top) {
        return null
    }

    const router = createBrowserRouter([
        {
            path: '',
            element: <RootLayout />,
            children: [
                {
                    path: '',
                    element: (
                        <Suspense fallback={<Loader fullScreen />}>
                            <Home />
                        </Suspense>
                    ),
                },
                {
                    path: 'login',
                    element: (
                        <Suspense fallback={<Loader fullScreen />}>
                            <Login />
                        </Suspense>
                    ),
                },
                {
                    path: 'signup',
                    element: (
                        <Suspense fallback={<Loader fullScreen />}>
                            <Signup />
                        </Suspense>
                    ),
                },
                {
                    path: '*',
                    element: (
                        <Suspense fallback={<Loader fullScreen />}>
                            <PageNotFound />
                        </Suspense>
                    ),
                },
            ],
        },
    ])
    return <RouterProvider router={router} />
}

export default App
