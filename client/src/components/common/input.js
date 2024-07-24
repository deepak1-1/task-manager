import styled from 'styled-components'
import { useEffect } from 'react'
import { If, Else, Then } from 'react-if'

import { useTheme } from '../../hooks'

const validate = (required, regex, val) => {
    if (required && (!val || !val.trim()))
        return { isValid: false, error: 'Required' }
    if (regex && val) return { isValid: regex.test(val), error: 'Invalid' }
    return { isValid: true }
}

export const Input = ({
    data,
    setData,
    label,
    name,
    margin,
    required,
    regex = null,
}) => {
    const { colors } = useTheme()
    useEffect(() => {
        if (!required) {
            setData((prev) => ({
                ...prev,
                [name]: {
                    value: prev?.[name]?.value,
                    isValid: true,
                    isTouched: false,
                    error: null,
                },
            }))
        }
    }, [])

    const changeHandler = (e) =>
        setData((prev) => {
            const validateData = validate(required, regex, e.target.value)
            return {
                ...prev,
                [name]: {
                    isTouched: true,
                    value: !required && !e.target.value ? null : e.target.value,
                    isValid: validateData?.isValid,
                    error: validateData?.error,
                },
            }
        })

    return (
        <StyledInput
            active={
                data?.[name]?.isTouched && !data?.[name]?.isValid
                    ? colors?.red
                    : colors?.primary || 'blue'
            }
            margin={margin ? margin : '14px 0'}
            border={
                data?.[name]?.isTouched && !data?.[name]?.isValid
                    ? `1px solid ${colors?.red}`
                    : '1px solid #ccc'
            }
            white={colors.white}
            black={colors.black}
        >
            <input
                name={name}
                placeholder=" "
                value={data?.[name]?.value || ''}
                onChange={changeHandler}
            />
            <label htmlFor={name} className="input-label">
                {required ? (
                    <>
                        <span style={{ color: colors?.red }}>*</span>
                        {label}
                    </>
                ) : (
                    label
                )}
            </label>

            <If condition={!data?.[name]?.isValid}>
                <Then>
                    <div
                        style={{
                            color: colors?.red,
                            textAlign: 'left',
                            fontSize: '14px',
                        }}
                    >
                        {data?.[name]?.error}
                    </div>
                </Then>
            </If>
        </StyledInput>
    )
}

const StyledInput = styled.div`
    position: relative;
    width: 100%;
    box-sizing: border-box;
    margin: ${(props) => props.margin};
    z-index: 1;

    input {
        width: 100%;
        padding: 10px;
        font-size: 14px;
        border: ${(props) => props.border};
        border-radius: 4px;
        outline: none;
        color: #333;
        box-sizing: border-box;
        background-color: ${(props) => props.white};
    }
    .input-label {
        position: absolute;
        top: 50%;
        left: 10px;
        transform: translateY(-50%);
        background-color: #ffffff;
        padding: 0 5px;
        color: #a5a5a5;
        font-size: 14px;
        font-weight: 400;
        transition: all 0.4s ease;
        pointer-events: none;
        letter-spacing: 1.2px;
        background-color: ${(props) => props.white};
    }
    input:focus + .input-label,
    input:not(:placeholder-shown) + .input-label {
        top: 0px;
        left: 10px;
        font-size: 12px;
        color: #333;
        background-color: ${(props) => props.white};
    }
    input:focus {
        border-color: ${(props) => props.active};
    }
`
