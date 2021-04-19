import { useState, useEffect, useContext } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import TimeField from 'react-simple-timefield';
import { alertService, getGateInfo, updateGateInfo } from '../services/index.js';

export function GateModal(props) {
    let ID = parseInt(props.id);
    let toggleModel = props.toggleModal;
    const [validated, setValidated] = useState(false);
    const [state, setState] = useState({});
    const [dummy, setDummy] = useState(false);

  useEffect(() => {
    setValidated(false);
    getGateInfo(ID)
    .then(async (data) => {
      setState(data.message);
    })
    .catch((error) => {
      alertService.error("There was an error!");
      console.error("There was an error!", error);
    });
  }, [dummy, ID]);

  const handleChange = (e, filler, e2) => {
      console.log(e,filler,e2);
    let id, value;
    if (e2 === undefined) {
      id = e.target.id;
      value = e.target.value;
    } else {
      id = e2.id;
      value = e;
    }
    if (typeof state[id] === "boolean") {
        console.log("bool");
      setState((prevState) => ({
        ...prevState,
        [id]: !state[id]
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [id]: value
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    if (form.checkValidity()) update();
  };

  const update = () => {
    updateGateInfo(ID, state)
    .then(async (data) => {
        alertService.success("Update Successful!");
    })
    .catch((error) => {
      alertService.error("There was an error!");
        console.error("There was an error!", error);
    });
  };

  return (
    <div className ="posAbs">
      <div className = "modal-dialog modalDevice modal-dialog-scrollable">
        <div className = "modal-content">
            <Modal.Header
             onHide={toggleModel}
             closeButton>
                <Modal.Title>Gate Details</Modal.Title>
            </Modal.Header>
            <div className="modal-body">
            <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <div>
                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                        Gate ID
                    </Form.Label>
                    <Col
                        sm={6}
                        className="align-items-center d-flex justify-content-center"
                    >
                        <Form.Control type="text" placeholder={ID} readOnly />
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                        Gate Name
                    </Form.Label>
                    <Col
                        sm={6}
                    >
                        <Form.Control
                        required
                        placeholder="Name"
                        id="gateName"
                        name="gateName"
                        value={state.gateName}
                        onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                        Gate Name is a required field.
                        </Form.Control.Feedback>
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                        Gate Type
                    </Form.Label>
                    <Col
                        sm={6}
                    >
                        <Form.Control
                        custom
                        required
                        as="select"
                        id="gateType"
                        name="gateType"
                        value={state.gateType}
                        onChange={handleChange}
                        >
                        <option value={""}>--Select Type--</option>
                        <option>entry</option>
                        <option>exit</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                        Gate Type is a required field.
                        </Form.Control.Feedback>
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                        Open Gate for invalid/expired season pass holders
                    </Form.Label>
                    <Col
                        sm={6}
                        className="align-items-center d-flex justify-content-center"
                    >
                        <Form.Check
                        checked={state.isOpenForInvalid}
                        type="switch"
                        id="isOpenForInvalid"
                        onChange={handleChange}
                        />
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                        Open Gate for temporary vehicles
                    </Form.Label>
                    <Col
                        sm={6}
                        className="align-items-center d-flex justify-content-center"
                    >
                        <Form.Check
                        checked={state.isOpenForTemp}
                        type="switch"
                        id="isOpenForTemp"
                        onChange={handleChange}
                        />
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                        Charge fee for entry
                    </Form.Label>
                    <Col
                        sm={6}
                        className="align-items-center d-flex justify-content-center"
                    >
                        <Form.Check
                        checked={state.isChargeable}
                        type="switch"
                        id="isChargeable"
                        onChange={handleChange}
                        />
                    </Col>
                    </Form.Group>
                    
                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                    Time to turn on the LPR camera’s LED
                    </Form.Label>
                    <Form.Label
                        column
                        sm={6}
                        className="align-items-center d-flex"
                    >
                        <TimeField 
                        value={state.ledOnTime} 
                        onChange={handleChange}
                        showSeconds = {true}
                        input={
                            <Form.Control
                              required
                              id = "ledOnTime"
                              type="text"
                              name="ledOnTime"
                              placeholder="Time"
                            />
                        } />
                    </Form.Label>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                        Time to turn off the LPR
                    </Form.Label>
                    <Form.Label
                        column
                        className="align-items-center d-flex"
                        sm={6}
                    >
                        <TimeField 
                        value={state.ledOffTime} 
                        onChange={handleChange}
                        showSeconds = {true}
                        input={
                            <Form.Control
                              required
                              id = "ledOffTime"
                              type="text"
                              name="ledOffTime"
                              placeholder="Time"
                            />
                        } />
                    </Form.Label>
                    </Form.Group>

                </div>
                <Form.Group as={Row}>
                <Col sm={{ span: 1, offset: 9 }}>
                    <Button type="submit">Update</Button>
                </Col>
                </Form.Group>
            </Form>
            </div>
            </div>
        </div>
    </div>
  );
}

export default { GateModal };
