import { useEffect, useState } from 'react'
import { Else, If, Then } from 'react-if'
import { toast } from 'react-toastify'
import styled from 'styled-components'
import { DragDropContext } from 'react-beautiful-dnd'

import {
    Button,
    Loader,
    ActionTaskModal,
    DraggableTaskColumn,
} from '../components'
import { getEnv, promiseResolver } from '../utils'
import { authorizedAxios } from '../lib'
import { useTheme } from '../hooks'

const SERVER_BASE_URL = getEnv('SERVER_BASE_URL')

const Home = () => {
    const [tasks, setTasks] = useState([])
    const [isLoading, setLoading] = useState(false)
    const [isAddTaskModalVisible, setAddTaskModalVisible] = useState(false)
    const [search, setSearch] = useState('')
    const [sortOrder, setSortOrder] = useState('desc')

    const { colors } = useTheme()

    useEffect(() => {
        fetchTask()
    }, [])
    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchTask()
        }, 700)
        return () => clearTimeout(timeout)
    }, [search, sortOrder])

    const handleAddTaskClick = () => {
        setAddTaskModalVisible(true)
    }

    const fetchTask = async () => {
        setLoading(true)
        const [response, error] = await promiseResolver(
            authorizedAxios({
                url: `${SERVER_BASE_URL}/api/task/get?${
                    sortOrder !== 'desc' ? 'sort=1' : ''
                }${search && search.trim() ? `&search=${search}` : ''}`,
                method: 'GET',
            })
        )
        if (error) {
            if (error?.response?.data?.error === 'Unauthorized User') {
                setLoading(false)
                window.location.href = '/login'
                return
            }

            toast.error(error?.response?.data?.error)
            setLoading(false)
            return
        }
        setTasks(response?.data?.data)
        setLoading(false)
    }
    const handleSearchInputChange = (e) => setSearch(e?.target?.value)
    const handleSortOrderChange = (e) => setSortOrder(e?.target?.value)
    const handleDragEnd = async (val) => {
        const { source, destination, draggableId } = val
        if (
            !destination?.droppableId ||
            source?.droppableId === destination?.droppableId
        )
            return

        const [response, error] = await promiseResolver(
            authorizedAxios({
                url: `${SERVER_BASE_URL}/api/task/${draggableId}`,
                method: 'PUT',
                data: {
                    status: destination?.droppableId,
                },
            })
        )

        if (error) {
            toast.error(error?.response?.data?.error)
            return
        }
        fetchTask()
    }

    return (
        <>
            <If condition={isAddTaskModalVisible}>
                <Then>
                    <ActionTaskModal
                        isModalVisible={isAddTaskModalVisible}
                        setModalVisible={setAddTaskModalVisible}
                        refetchEverything={fetchTask}
                    />
                </Then>
            </If>
            <Button onClick={handleAddTaskClick}>Add Task</Button>

            <FilterBar white={colors?.white}>
                <div className="form-container">
                    <label htmlFor="search">Search: </label>
                    <input
                        id="search"
                        name="search"
                        placeholder="search"
                        value={search}
                        onChange={handleSearchInputChange}
                    />
                </div>
                <div className="form-container">
                    <label htmlFor="sortOrder">Sort By:</label>
                    <select
                        id="sortOrder"
                        onChange={handleSortOrderChange}
                        value={sortOrder}
                    >
                        <option value="asc">Old</option>
                        <option value="desc">Recent</option>
                    </select>
                </div>
            </FilterBar>

            <If condition={isLoading}>
                <Then>
                    <Loader />
                </Then>
                <Else>
                    <DragDropContext onDragEnd={handleDragEnd}>
                        <TaskColumnContainer>
                            <DraggableTaskColumn
                                title="TO DO"
                                taskList={tasks?.toDo}
                                refetchEverything={fetchTask}
                            />
                            <DraggableTaskColumn
                                title="IN PROGRESS"
                                taskList={tasks?.inProgress}
                                refetchEverything={fetchTask}
                            />
                            <DraggableTaskColumn
                                title="DONE"
                                taskList={tasks?.done}
                                refetchEverything={fetchTask}
                            />
                        </TaskColumnContainer>
                    </DragDropContext>
                </Else>
            </If>
        </>
    )
}

export default Home

const FilterBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    margin: 20px 0;
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.3);

    .form-container > label {
        font-size: 14px;
        margin-right: 6px;
    }
    .form-container > input {
        padding: 4px 10px;
        min-width: 200px;
        border-radius: 4px;
        border: 1px solid rgba(0, 0, 0, 0.3);
    }
`

const TaskColumnContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
`
