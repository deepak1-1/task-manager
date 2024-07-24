import styled from 'styled-components'
import { If, Else, Then } from 'react-if'
import { Droppable } from 'react-beautiful-dnd'

import { TaskCard } from './card'
import { Button } from '../common'

export const DraggableTaskColumn = ({
    taskList = [],
    refetchEverything = () => {},
    title = 'TO DO',
}) => {
    return (
        <Container>
            <Button type="secondary" className="heading">
                {title}
            </Button>

            <Droppable droppableId={title}>
                {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps}>
                        <If condition={taskList?.length === 0}>
                            <Then>
                                <div className="no-data">No Task</div>
                            </Then>
                            <Else>
                                {taskList?.map((task, index) => (
                                    <TaskCard
                                        task={task}
                                        refetchEverything={refetchEverything}
                                        key={task?._id}
                                        index={index}
                                    />
                                ))}
                            </Else>
                        </If>
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </Container>
    )
}

const Container = styled.div`
    padding: 10px;
    border: 1px solid rgba(0, 0, 0, 0.3);
    box-shadow: 0px 6px 8px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
    height: 100%;

    .heading {
        width: 100%;
        text-align: left;
        font-size: 16px;
        font-weight: bolder;
    }
    .no-data {
        text-align: center;
        margin-top: 20px;
    }
`
