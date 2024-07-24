import { useEffect } from 'react'

import classes from './styles.module.css'

export const Modal = ({ open, onClose, children }) => {
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

    const handleModalBackdropClick = (event) => event.stopPropagation()

    if (!open) return null

    return (
        <div className={classes['modal-backdrop']} onClick={onClose}>
            <div
                className={classes['modal-content']}
                onClick={handleModalBackdropClick}
            >
                {children}
            </div>
        </div>
    )
}
