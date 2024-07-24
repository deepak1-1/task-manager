import styled from 'styled-components'

import { useTheme } from '../../hooks'

export const Button = ({
    type = 'primary',
    danger = false,
    children,
    ...props
}) => {
    const { colors } = useTheme()

    if (type === 'secondary')
        return (
            <FilledButton color={colors.secondary} {...props}>
                {children}
            </FilledButton>
        )

    if (type === 'primary' && danger)
        return (
            <FilledButton color={colors.red} {...props}>
                {children}
            </FilledButton>
        )

    return (
        <FilledButton color={colors.primary} {...props}>
            {children}
        </FilledButton>
    )
}

const FilledButton = styled.button`
    background-color: ${(props) => props.color};
    color: white;
    padding: 10px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
`
const OutlineButton = styled.button``
