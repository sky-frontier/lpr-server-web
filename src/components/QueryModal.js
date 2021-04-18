import { Button, Modal, Form } from "react-bootstrap";
import {useState} from 'react';

export function QueryModal(props) {
    let toggleModal = props.toggleModal;
    let success = props.success;
    let hide = props.hide;
    let body = props.body;
    let title = props.title;
    const [value,setValue] = useState("");
    const handleChange = (e) =>{
      setValue(e.target.value);
    }
    return (
      <Modal show={hide} onHide={toggleModal}>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Label>{body}</Form.Label>
            <Form.Control 
            value={value}
            onChange={handleChange}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={toggleModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={()=>{
              success(value);
              toggleModal();
              }}>
            Confirm
          </Button>
        </Modal.Footer>
      </Modal>
    );
}

export default {QueryModal};