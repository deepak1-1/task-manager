import styled from 'styled-components'
import { Outlet } from 'react-router-dom'

import { Header } from './header'

export const RootLayout = () => {
    return (
        <Container>
            <Header />
            <Main>
                <Outlet />
            </Main>
        </Container>
    )
}

const Container = styled.div`
    width: 100%;
`
const Main = styled.main`
    margin-top: 60px;
    padding: 40px 20px;
    overflow-y: auto;
`
