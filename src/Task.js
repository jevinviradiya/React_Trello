import React, { useState } from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { Button, InputGroup } from "react-bootstrap";
import AddModalPopUp from "./AddModalPopUp";
const Container = styled.div`
  border: 1px solid lightgrey;
  padding: 8px;
  margin-bottom: 8px;
  border-radius: 2px;
  background-color: ${(props) => (props.isDragging ? "#e0ffe0" : "white")};
`;
function Task(props) {
  const [textBox, setTextBox] = useState(false);
  const [inputDataChange, setInputDataChange] = useState(props.task.content);
  return (
    <Draggable draggableId={props.task.id} index={props.index}>
      {(provided, snapshot) => (
        <Container
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          isDragging={snapshot.isDragging}
        >
          {textBox ? (
            <span
              style={{ display: "flex", width: "200px" }}
              onBlur={() => {
                if (props.task.content !== inputDataChange) {
                  props.handleUpdate(props.task.id, inputDataChange);
                }
                setTextBox(false);
              }}
            >
              <input
                autoFocus
                type="text"
                style={{ width: "150px" }}
                value={inputDataChange}
                onChange={(e) => {
                  setInputDataChange(e.target.value);
                }}
              />
              <Button
                size="sm"
                onClick={() => {
                  props.handleUpdate(props.task.id, inputDataChange);
                  setTextBox(false);
                }}
              >
                <i className="fa fa-save"></i>
              </Button>
            </span>
          ) : (
            <span
              onDoubleClick={() => {
                console.log("here");
                setTextBox(true);
              }}
            >
              {props.task.content}
            </span>
          )}
          <span style={{ display: "flex", width: "100%", justifyContent: "end" }}>
            <Button
              variant="transperent"
              size="sm"
              onClick={() => {
                props.handleDelete(props.task.id, props.columnId);
              }}
            >
              <i className="fa fa-trash" aria-hidden="true"></i>
            </Button>
            <AddModalPopUp
              modalFn={props.handleUpdate}
              id={props.task.id}
              text={<i className="fa fa-pencil" aria-hidden="true"></i>}
              oldData={props.task.content}
              buttonVariant="transperent"
            />
          </span>
        </Container>
      )}
    </Draggable>
  );
}

export default Task;
