import styled from 'styled-components'

import { useTheme } from '../../hooks'

export const Loader = ({ fullScreen = false }) => {
    const { colors } = useTheme()

    if (fullScreen)
        return (
            <Container>
                <Loader_ color={colors?.secondary} size={'40px'}></Loader_>
            </Container>
        )
    return <Loader_ color={colors?.secondary} size={'20px'}></Loader_>
}

const Container = styled.div`
    box-sizing: border-box;
    height: 100vh;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f0f0f0;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
`

const Loader_ = styled.div`
    border: 4px solid #f3f3f3;
    border-top: 4px solid ${(props) => props.color};
    border-right: 4px solid ${(props) => props.color};
    border-radius: 50%;
    width: ${(props) => props.size};
    height: ${(props) => props.size};
    animation: spin 1s linear infinite;

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
`
