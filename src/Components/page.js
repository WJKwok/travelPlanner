import React, { useContext } from 'react';
import { DragDropContext } from 'react-beautiful-dnd';

import DayBoard from './dayBoard';
import PlaceBoard from './placeBoard';
import Form from './form';

import { PlaceContext } from '../Store/PlaceContext';

function Page() {

    const { contextState, dispatch } = useContext(PlaceContext);

    const onDragEnd = result => {
        const { destination, source, draggableId } = result;

        if (!destination) {
            return;
        }

        if (
            destination.droppableId === source.droppableId &&
            destination.index === source.index
        ) {
            return;
        }

        const start = contextState.columns[source.droppableId];
        const finish = contextState.columns[destination.droppableId];

        //if moving within the same column
        if (start === finish) {
            const column = contextState.columns[source.droppableId];
            const newplaceIds = Array.from(column.placeIds);
            newplaceIds.splice(source.index, 1);
            newplaceIds.splice(destination.index, 0, draggableId);

            const newColumn = {
                ...column,
                placeIds: newplaceIds,
            };

            const newOrder = {
                ...contextState,
                columns: {
                    ...contextState.columns,
                    [newColumn.id]: newColumn,
                },
            };
            console.log(newOrder);
            dispatch({ type:'CHANGE_ORDER', order: {newOrder}});
            return;
        }

        //moving from one list to another
        const startplaceIds = Array.from(start.placeIds);
        startplaceIds.splice(source.index, 1);
        const newStart = {
            ...start,
            placeIds: startplaceIds,
        };

        const finishplaceIds = Array.from(finish.placeIds);
        finishplaceIds.splice(destination.index, 0, draggableId);
        const newFinish = {
            ...finish,
            placeIds: finishplaceIds,
        };


        const newOrder = {
            ...contextState,
            columns: {
                ...contextState.columns,
                [newStart.id]: newStart,
                [newFinish.id]: newFinish,
            },
        };

        console.log(newOrder);
        dispatch({ type:'CHANGE_ORDER', order: {newOrder}});
    };

    console.log(contextState);

    return (
        <div>
            <Form/>
            <DragDropContext onDragEnd={onDragEnd}>
                <div className='day-boards-container'>
                    {contextState.dayBoards.map(columnId => {
                        const column = contextState.columns[columnId];
                        const places = column.placeIds.map(placeId => 
                            contextState.places[placeId]
                        );

                        return <DayBoard key={column.id} column={column} places={places}/>
                    })}
                </div>
                <div className='place-boards-container'>
                    {contextState.placeBoards.map(columnId => {
                        const column = contextState.columns[columnId];
                        const places = column.placeIds.map(placeId => 
                            contextState.places[placeId]
                        );

                        return <PlaceBoard key={column.id} column={column} places={places}/>
                    })}
                </div>
            </DragDropContext>
        </div>
        
    );

}

export default Page;