import React from "react";
import styled from "styled-components";
import Task from "./Task";
import { Droppable, Draggable } from "react-beautiful-dnd";
import AddModalPopUp from "./AddModalPopUp";
import { Button } from "react-bootstrap";
const Container = styled.div`
  margin: 1rem;
  border: 1px solid lightgrey;
  border-radius: 5px;
  width: 250px;
  display: flex;
  flex-direction: column;
  background-color: white;
`;
const Title = styled.h3`
  padding: 0 1rem;
  margin: 1rem 0;
`;
const TaskList = styled.div`
  padding: 1rem;
  font-size: 18px;
  background-color: ${(props) => (props.isDraggingOver ? "#d5f3ff" : "inherit")};
  min-height: 100px;
`;

function Column(props) {
  return (
    <Container>
      <Draggable draggableId={props.column.id} index={props.index}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.draggableProps}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                flexWrap: "wrap",
                width: "100%",
                justifyContent: "space-between",
              }}
            >
              <Title {...provided.dragHandleProps}>{props.column.title}</Title>
              <div style={{ display: "flex", width: "60px", justifyContent: "space-between" }}>
                <Button
                  size="sm"
                  variant="transperent"
                  onClick={() => {
                    props.handleListDelete(props.column.id);
                  }}
                >
                  <i type="button" className="fa fa-trash-o"></i>
                </Button>

                <span>
                  <AddModalPopUp
                    modalFn={props.updateTitle}
                    id={props.column.id}
                    oldData={props.column.title}
                    text={<i className="fa fa-pencil" aria-hidden="true"></i>}
                    buttonVariant="transperent"
                  />
                </span>
              </div>
            </div>
            <Droppable droppableId={props.column.id} type="task">
              {(provided, snapshot) => (
                <TaskList
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  isDraggingOver={snapshot.isDraggingOver}
                >
                  {props.tasks.map((task, index) => (
                    <Task
                      key={task.id}
                      task={task}
                      index={index}
                      handleDelete={props.handleDelete}
                      columnId={props.column.id}
                      handleUpdate={props.handleUpdate}
                    />
                  ))}
                  {provided.placeholder}
                </TaskList>
              )}
            </Droppable>
          </div>
        )}
      </Draggable>
      <div
        style={{ display: "flex", justifyContent: "end", paddingRight: "18px", margin: "5px 0px" }}
      >
        <AddModalPopUp
          modalFn={props.addToDo}
          id={props.column.id}
          text="+ Add Card"
          buttonVariant="primary"
        />
      </div>
    </Container>
  );
}

export default Column;
