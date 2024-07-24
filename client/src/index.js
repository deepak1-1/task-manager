import React from 'react'
import ReactDOM from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ToastContainer } from 'react-toastify'

import App from './App'
import { getEnv } from './utils'
import { UserProvider } from './context'

import 'react-toastify/dist/ReactToastify.css'
import './index.css'

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
    <UserProvider>
        <GoogleOAuthProvider clientId={getEnv('GOOGLE_AUTH_CLIENT_ID')}>
            <ToastContainer
                position="bottom-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <App />
        </GoogleOAuthProvider>
    </UserProvider>
)
