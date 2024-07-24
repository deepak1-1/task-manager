import { useState } from 'react'

export const useTheme = () => {
    const [colors] = useState({
        primary: '#096dd9',
        secondary: '#40a9ff',
        backdrop: '#bae0ff',
        red: '#ff4d4f',
        black: '#262626',
        white: '#f0f0f0',
    })

    return { colors }
}
