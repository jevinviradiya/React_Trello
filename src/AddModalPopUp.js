import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import "bootstrap/dist/css/bootstrap.min.css";

function AddModalPopUp(props) {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [data, setData] = useState(props.oldData);
  return (
    <>
      <Button variant={props.buttonVariant ?? "secondary"} size="sm" onClick={handleShow}>
        {props.text}
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          content:
          <input
            type="text"
            value={data}
            onChange={(e) => {
              setData(e.target.value);
            }}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={() => {
              props.modalFn(props.id, data);
              setData("");
              handleClose();
            }}
          >
            {props.text}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default AddModalPopUp;
