import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'

import { Button } from '../components'

const PageNotFound = () => {
    const navigate = useNavigate()

    const handleHomeClick = () => {
        navigate('/')
    }

    return (
        <Container>
            <div className="heading">
                Page You Are looking For doesn't Exists
            </div>
            <Button onClick={handleHomeClick}>Go Back To Home</Button>
        </Container>
    )
}

export default PageNotFound

const Container = styled.div`
    margin-top: 60px;
    text-align: center;

    .heading {
        font-size: 30px;
        font-weight: 600;
        margin-bottom: 20px;
    }
`
