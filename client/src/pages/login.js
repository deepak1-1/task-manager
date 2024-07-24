import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import styled from 'styled-components'
import { GoogleLogin } from '@react-oauth/google'
import { toast } from 'react-toastify'

import { useUser } from '../context'
import { useTheme } from '../hooks'
import { Button, Input } from '../components'
import { getRegex } from '../utils'
import { Loader } from '../components'

const Login = () => {
    const [isLoading, setLoading] = useState(false)
    const [form, setForm] = useState({})

    const { isAuthenticated, login, google } = useUser()
    const navigate = useNavigate()
    const { colors } = useTheme()

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/')
        }
    }, [])

    const googleAuthenticateError = () => {
        toast.error('Unable to get google Credentials')
    }
    const handleLoginClick = async () => {
        if (!form?.email?.isValid || !form?.password?.isValid) {
            toast.warning('Input is required')
            return
        }
        setLoading(true)

        await login({
            email: form?.email?.value,
            password: form?.password?.value,
        })
        setLoading(false)
    }

    if (isLoading) return <Loader fullScreen />

    return (
        <Main>
            <Container>
                <h1 style={{ color: colors?.primary }}>Login</h1>

                <FormContainer primary={colors?.primary}>
                    <Input
                        data={form}
                        setData={setForm}
                        label={'Email'}
                        name={'email'}
                        regex={getRegex('EMAIL')}
                        required
                    />
                    <Input
                        data={form}
                        setData={setForm}
                        label={'Password'}
                        name={'password'}
                        required
                    />
                    <Button
                        style={{
                            width: '100%',
                            fontSize: '16px',
                            padding: '6px',
                            marginBottom: '16px',
                        }}
                        onClick={handleLoginClick}
                    >
                        Login
                    </Button>

                    <div className="signup-div">
                        Don't have an account?{' '}
                        <Link to={'/signup'}>signup</Link>
                    </div>

                    <p className="or-text">Or</p>

                    <GoogleButtonContainer>
                        <GoogleLogin
                            onSuccess={google}
                            onError={googleAuthenticateError}
                        />
                    </GoogleButtonContainer>
                </FormContainer>
            </Container>
        </Main>
    )
}

export default Login

const Main = styled.div`
    display: flex;
    margin-top: 40px;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
`
const Container = styled.div`
    padding: 20px 0;
`
const FormContainer = styled.div`
    margin-top: 10px;
    padding: 40px 20px;
    border: 2px solid ${(props) => props.primary};
    min-width: 400px;
    border-radius: 4px;
    text-align: center;
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.3);

    .signup-div {
        font-size: 14px;
        font-weight: 400;
    }
    .signup-div > a {
        font-size: 16px;
        color: ${(props) => props.primary};
        text-decoration: none;
        font-weight: 600;
    }

    .or-text {
        margin: 20px 0;
        font-size: 12px;
    }

    @media (max-width: 768px) {
        min-width: 250px;
    }
`
const GoogleButtonContainer = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
`
