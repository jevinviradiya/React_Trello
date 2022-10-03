import React, { useState, useEffect } from "react";
import styled from "styled-components";
import dataset from "./dataset";
import Column from "./Column";
import { DragDropContext, Droppable } from "react-beautiful-dnd";
import AddModalPopUp from "./AddModalPopUp";
import { useDispatch } from "react-redux";
import { getTrelloData, updateToDo } from "./redux/actions/toDoActions";
import { useSelector } from "react-redux";

const Container = styled.div`
  display: flex;
`;

const App = () => {
  const [data, setData] = useState();
  const dispatch = useDispatch();
  const state = useSelector((state) => state.todoData);

  const onDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;
    //If there is no destination
    if (!destination) {
      return;
    }

    //If source and destination is the same
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    //If you're dragging columns
    if (type === "column") {
      const newColumnOrder = Array.from(data.columnOrder);
      newColumnOrder.splice(source.index, 1);
      newColumnOrder.splice(destination.index, 0, draggableId);
      const newState = {
        ...data,
        columnOrder: newColumnOrder,
      };
      setData(newState);
      return;
    }

    //Anything below this happens if you're dragging tasks
    const start = data.columns[source.droppableId];
    const finish = data.columns[destination.droppableId];

    //If dropped inside the same column
    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);
      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };
      const newState = {
        ...data,
        columns: {
          ...data.columns,
          [newColumn.id]: newColumn,
        },
      };
      setData(newState);
      return;
    }

    //If dropped in a different column
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    const newState = {
      ...data,
      columns: {
        ...data.columns,
        [newStart.id]: newStart,
        [newFinish.id]: newFinish,
      },
    };

    setData(newState);
  };

  useEffect(() => {
    if (data) {
      dispatch(updateToDo(data));
    }
  }, [data]);

  useEffect(() => {
    dispatch(getTrelloData());
  }, []);

  useEffect(() => {
    if (!state.loading) {
      setData(state.data.data[0] ?? dataset);
    }
  }, [state]);

  const addToDo = (columnId, inputData) => {
    const id = "task-" + Math.floor(Math.random() * 1000);
    setData({
      ...data,
      tasks: { ...data.tasks, [id]: { id: id, content: inputData } },
      columns: {
        ...data.columns,
        [columnId]: {
          ...data.columns[columnId],

          taskIds: [...data.columns[columnId].taskIds, id],
        },
      },
    });
  };

  const handleDelete = (taskId, columnId) => {
    console.log(taskId, columnId);
    const tasks = data.tasks;
    const columns = data.columns[columnId].taskIds.filter((el) => {
      return el !== taskId;
    });
    delete tasks[taskId];
    // delete columns[columns.indexOf(taskId)];
    setData({
      ...data,
      tasks: tasks,
      columns: {
        ...data.columns,
        [columnId]: { ...data.columns[columnId], taskIds: columns },
      },
    });
  };

  const handleUpdate = (taskId, inputData) => {
    console.log(taskId, data);
    setData({
      ...data,
      tasks: { ...data.tasks, [taskId]: { id: taskId, content: inputData } },
    });
  };

  const handleListAdd = (id, inputData) => {
    console.log("new list", inputData);
    const cid = "column-" + Math.floor(Math.random() * 1000);
    const columnOrder = data.columnOrder;
    columnOrder.push(cid);
    const columns = data.columns;
    console.log("columns======", columns);
    columns[cid] = { id: cid, title: inputData, taskIds: [] };
    setData({ ...data, columnOrder: columnOrder, columns: columns });
  };

  const handleListDelete = (listId) => {
    console.log(listId);
    const columnOrder = data.columnOrder.filter((el) => el !== listId);
    const column = data.columns;
    delete column[listId];
    console.log(columnOrder, column);
    setData({ ...data, columnOrder: columnOrder, columns: column });
  };

  const updateTitle = (columnId, inputData) => {
    console.log(columnId, inputData);

    setData({
      ...data,
      columns: { ...data.columns, [columnId]: { ...data.columns[columnId], title: inputData } },
    });
  };

  return (
    <div style={{ position: "absolute", top: "0", left: "0" }}>
      {!state.loading && data && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="all-columns" direction="horizontal" type="column">
            {(provided) => (
              <Container
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{ flexWrap: "wrap" }}
              >
                {data.columnOrder.map((id, index) => {
                  const column = data.columns[id];
                  const tasks = column.taskIds.map((taskId) => data.tasks[taskId]);

                  return (
                    <Column
                      key={column.id}
                      column={column}
                      tasks={tasks}
                      index={index}
                      addToDo={addToDo}
                      nextLength={Object.keys(data.tasks).length}
                      handleDelete={handleDelete}
                      handleUpdate={handleUpdate}
                      handleListDelete={handleListDelete}
                      updateTitle={updateTitle}
                    />
                  );
                })}
                {provided.placeholder}
                <div>
                  <AddModalPopUp modalFn={handleListAdd} text="+ New List" />
                </div>
              </Container>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};

export default App;
