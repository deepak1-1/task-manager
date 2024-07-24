import { useEffect, useMemo, useState } from 'react'
import { isEmpty, isEqual } from 'lodash'
import { Switch, Case, If, Then } from 'react-if'
import dayjs from 'dayjs'
import { toast } from 'react-toastify'

import { Modal, Button } from '../../common'
import { promiseResolver, getEnv } from '../../../utils'
import { authorizedAxios } from '../../../lib'

import classes from './styles.module.css'

const SERVER_BASE_URL = getEnv('SERVER_BASE_URL')

export const ActionTaskModal = ({
    isModalVisible,
    setModalVisible,
    refetchEverything = () => {},
    task = null,
    edit = false,
}) => {
    const [form, setForm] = useState({
        title: '',
        description: '',
        dueDate: '',
    })
    const [isLoading, setLoading] = useState(false)

    useEffect(() => {
        if (!isEmpty(task)) {
            setForm({
                title: task?.title,
                description: task?.description,
                dueDate: dayjs(task?.dueDate).format('YYYY-MM-DD'),
            })
        }
    }, [])

    const onClose = (refetch = false) => {
        if (refetch && typeof refetch === 'boolean') refetchEverything()
        setModalVisible(false)
    }
    const handleChange = (event) => {
        setForm((prev) => ({
            ...prev,
            [event?.target?.name]: event?.target?.value,
        }))
    }

    const handleAddTaskClick = async () => {
        if (
            !form?.title ||
            !form.title?.trim() ||
            !form?.dueDate ||
            !form.dueDate?.trim()
        ) {
            toast.error("Empty values. Form can't be submitted")
            return
        }

        setLoading(true)
        const [response, error] = await promiseResolver(
            authorizedAxios({
                url: `${SERVER_BASE_URL}/api/task/add`,
                method: 'POST',
                data: {
                    title: form?.title,
                    description: form?.description,
                    dueDate: form?.dueDate,
                },
            })
        )

        if (error) {
            toast.error(error?.response?.data?.error)
            return
        }

        toast.success('Task Created Successfully')
        onClose(true)
        setLoading(false)
    }
    const handleSaveClick = async () => {
        if (
            !form?.title ||
            !form.title?.trim() ||
            !form?.dueDate ||
            !form.dueDate?.trim()
        ) {
            toast.error("Empty values. Form can't be Updated")
            return
        }

        if (
            isEqual(
                { ...task, dueDate: dayjs(task?.dueDate).format('YYYY-MM-DD') },
                { ...task, ...form }
            )
        ) {
            toast.info('Nothing to update')
            onClose()
            return
        }
        setLoading(true)
        const [response, error] = await promiseResolver(
            authorizedAxios({
                url: `${SERVER_BASE_URL}/api/task/${task?._id}`,
                method: 'PUT',
                data: {
                    title: form?.title,
                    description: form?.description,
                    dueDate: form?.dueDate,
                },
            })
        )

        if (error) {
            toast.error(error?.response?.data?.error)
            return
        }

        toast.success('Task Updated Successfully')
        onClose(true)
        setLoading(false)
    }

    const title = useMemo(() => {
        if (edit) return 'Edit Task'
        if (!isEmpty(task)) return 'Task'
        return 'Add Task'
    }, [task, edit])

    return (
        <Modal title={title} open={isModalVisible} onClose={onClose}>
            <label htmlFor="title" className={classes['label']}>
                *Title
            </label>
            <input
                name="title"
                onChange={handleChange}
                className={classes['input']}
                placeholder="write title"
                value={form?.title}
                readOnly={!edit && !isEmpty(task)}
            />

            <label htmlFor="description" className={classes['label']}>
                Description
            </label>
            <textarea
                name="description"
                rows={4}
                onChange={handleChange}
                className={classes['input']}
                placeholder="write description..."
                value={form?.description}
                readOnly={!edit && !isEmpty(task)}
            />

            <label htmlFor="dueDate" className={classes['label']}>
                *Due Date
            </label>
            <input
                type="date"
                name="dueDate"
                onChange={handleChange}
                className={classes['input']}
                placeholder="Due Date"
                value={form?.dueDate}
                min={dayjs().format('YYYY-MM-DD')}
                readOnly={!edit && !isEmpty(task)}
            />
            <If condition={!edit && !isEmpty(task)}>
                <Then>
                    <label htmlFor="title" className={classes['label']}>
                        Created At
                    </label>
                    <input
                        className={classes['input']}
                        value={dayjs(task?.createdAt).format(
                            'MMM DD, YYYY | HH:mm A'
                        )}
                        readOnly
                    />
                </Then>
            </If>
            <div className={classes['footer']}>
                <Switch>
                    <Case condition={edit}>
                        <Button danger onClick={onClose}>
                            Cancel
                        </Button>
                        <Button onClick={handleSaveClick}>Save</Button>
                    </Case>
                    <Case condition={!edit && isEmpty(task)}>
                        <Button onClick={onClose} danger>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAddTaskClick}
                            disabled={isLoading}
                        >
                            Add Task
                        </Button>
                    </Case>
                    <Case condition={!edit && !isEmpty(task)}>
                        <Button onClick={onClose} danger>
                            Close
                        </Button>
                    </Case>
                </Switch>
            </div>
        </Modal>
    )
}
