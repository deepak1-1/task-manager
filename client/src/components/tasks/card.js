import { useState } from 'react'
import styled from 'styled-components'
import dayjs from 'dayjs'
import { If, Then } from 'react-if'
import { toast } from 'react-toastify'
import { Draggable } from 'react-beautiful-dnd'

import { useTheme } from '../../hooks'

import { ActionTaskModal } from './actionModal'
import { Button } from '../common'
import { getEnv, promiseResolver } from '../../utils'
import { authorizedAxios } from '../../lib'

const SERVER_BASE_URL = getEnv('SERVER_BASE_URL')

export const TaskCard = ({ task, refetchEverything, index }) => {
    const [isModalVisible, setModalVisible] = useState(false)
    const [isEditMode, setEditMode] = useState(false)

    const { colors } = useTheme()

    const handleEditClick = () => {
        setEditMode(true)
        setModalVisible(true)
    }
    const handleViewDetailsClick = () => {
        setEditMode(false)
        setModalVisible(true)
    }
    const handleTaskDelete = async () => {
        if (
            window.confirm(
                "Are you sure? Task will be permanently deleted (can't undo)"
            ) == true
        ) {
            const [response, error] = await promiseResolver(
                authorizedAxios({
                    url: `${SERVER_BASE_URL}/api/task/${task?._id}`,
                    method: 'DELETE',
                })
            )

            if (error) {
                toast.error(error?.response?.data?.error)
                return
            }

            toast.success('Task Deleted Successfully')
            refetchEverything()
        }
    }

    return (
        <>
            <If condition={isModalVisible}>
                <Then>
                    <ActionTaskModal
                        isModalVisible={isModalVisible}
                        edit={isEditMode}
                        setModalVisible={setModalVisible}
                        task={task}
                        refetchEverything={refetchEverything}
                    />
                </Then>
            </If>

            <Draggable draggableId={task?._id} index={index}>
                {(provided) => (
                    <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                    >
                        <Container background={colors?.backdrop}>
                            <div className="title">
                                {task?.title?.toUpperCase()}
                            </div>
                            <div className="description">
                                {task?.description}
                            </div>
                            <div className="due-date">
                                Due Date:{' '}
                                <strong>
                                    {dayjs(task?.dueDate).format(
                                        'MMM DD, YYYY'
                                    )}
                                </strong>
                            </div>
                            <div className="created-at">
                                Created At:{' '}
                                <strong>
                                    {dayjs(task?.dueDate).format(
                                        'MMM DD, YYYY | HH:mm A'
                                    )}
                                </strong>
                            </div>
                            <div className="footer">
                                <Button
                                    danger
                                    onClick={handleTaskDelete}
                                    className="button"
                                >
                                    Delete
                                </Button>
                                <Button
                                    type="secondary"
                                    onClick={handleEditClick}
                                    className="button"
                                >
                                    Edit
                                </Button>
                                <Button
                                    onClick={handleViewDetailsClick}
                                    className="button"
                                >
                                    View Details
                                </Button>
                            </div>
                        </Container>
                    </div>
                )}
            </Draggable>
        </>
    )
}

const Container = styled.div`
    padding: 16px;
    background-color: ${(props) => props?.background};
    margin: 20px 10px;
    border-radius: 4px;

    .title {
        font-size: 16px;
        font-weight: 600;
    }
    .description {
        font-size: 14px;
        font-weight: 400;
        margin-top: 6px;
    }
    .due-date {
        opacity: 0.6;
        font-size: 12px;
        margin-top: 8px;
    }
    .created-at {
        opacity: 0.6;
        font-size: 12px;
        margin: 30px 0 10px 0;
    }
    .button {
        padding: 8px 18px;
    }
    .footer {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
    }
`
