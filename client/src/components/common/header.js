import { If, Then, Else } from 'react-if'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

import { useUser } from '../../context'
import { useTheme } from '../../hooks'

import { Button } from './button'

export const Header = () => {
    const { isAuthenticated, logout, user } = useUser()
    const { colors } = useTheme()
    const navigate = useNavigate()

    const handleLoginClick = () => navigate('/login')
    const handleSignupClick = () => navigate('/signup')

    return (
        <Container color={colors.primary}>
            <If condition={isAuthenticated}>
                <Then>
                    <Title>Hi, {user?.name}</Title>
                </Then>
                <Else>
                    <Title>Task Manager</Title>
                </Else>
            </If>
            <Flex>
                <If condition={isAuthenticated}>
                    <Then>
                        <Button danger onClick={logout}>
                            Logout
                        </Button>
                    </Then>
                    <Else>
                        <Button onClick={handleLoginClick} type="secondary">
                            Login
                        </Button>
                        <Button onClick={handleSignupClick}>Signup</Button>
                    </Else>
                </If>
            </Flex>
        </Container>
    )
}

const Flex = styled.div`
    display: flex;
    flex-direction: row;
    gap: 10px;
`

const Title = styled.div`
    flex: 1;
`

const Container = styled.div`
    padding: 12px 40px;
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    background-color: ${(props) => props.color};
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: white;
    box-sizing: border-box;
    z-index: 9999;
`
