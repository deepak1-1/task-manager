import { useEffect } from 'react'
import { If, Then, Else } from 'react-if'

import { Loader } from '../loader'

import classes from './styles.module.css'

export const Modal = ({
    loading = false,
    open,
    onClose,
    title = null,
    children,
}) => {
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                onClose()
            }
        }

        if (open) document.addEventListener('keydown', handleKeyDown)
        else document.removeEventListener('keydown', handleKeyDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
        }
    }, [open, onClose])

    const handleModalClick = (event) => event.stopPropagation()

    if (!open) return null

    return (
        <div className={classes['modal-backdrop']} onClick={onClose}>
            <div
                className={classes['modal-content']}
                onClick={handleModalClick}
            >
                <If condition={title}>
                    <Then>
                        <div className={classes['title']}>{title}</div>
                    </Then>
                </If>
                <If condition={loading}>
                    <Then>
                        <Loader />
                    </Then>
                    <Else>{children}</Else>
                </If>
            </div>
        </div>
    )
}
