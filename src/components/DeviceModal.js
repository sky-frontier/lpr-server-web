import { useState, useEffect, useContext } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import TimeField from 'react-simple-timefield';
import { alertService, getDeviceInfo, updateDeviceInfo } from '../services/index.js';

export function DeviceModal(props) {
    let ID = props.id;
    let toggleModel = props.toggleModal;
    const [validated, setValidated] = useState(false);
    const [state, setState] = useState({});

  useEffect(() => {
    getDeviceInfo(ID)
    .then(async (data) => {
      console.log(data.message);
      setState(data.message);
    })
    .catch((error) => {
      alertService.error("There was an error!");
      console.error("There was an error!", error);
    });
  }, [ID]);

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
    console.log(typeof state[id]);
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
    updateDeviceInfo(ID,state)
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
                <Modal.Title>Device Details</Modal.Title>
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
                        <Form.Control type="text" placeholder={state.gateID} readOnly />
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                        Device ID
                    </Form.Label>
                    <Col
                        sm={6}
                    >
                        <Form.Control
                        required
                        placeholder="ID"
                        id="deviceID"
                        name="deviceID"
                        value={state.deviceID}
                        onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                        Device ID is a required field.
                        </Form.Control.Feedback>
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                        Device Name
                    </Form.Label>
                    <Col
                        sm={6}
                    >
                        <Form.Control
                        required
                        placeholder="Name"
                        id="deviceName"
                        name="deviceName"
                        value={state.deviceName}
                        onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                        Device Name is a required field.
                        </Form.Control.Feedback>
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                        Device Type
                    </Form.Label>
                    <Col
                        sm={6}
                    >
                        <Form.Control
                        required
                        placeholder="Type"
                        id="deviceType"
                        name="deviceType"
                        value={state.deviceType}
                        onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                        Device Type is a required field.
                        </Form.Control.Feedback>
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                        Carpark which the device belongs to
                    </Form.Label>
                    <Col
                        sm={6}
                    >
                        <Form.Control
                        required
                        placeholder="Carpark"
                        id="deviceCarpark"
                        name="deviceCarpark"
                        value={state.deviceCarpark}
                        onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                        Capark is a required field.
                        </Form.Control.Feedback>
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                        Status
                    </Form.Label>
                    <Col
                        sm={6}
                        className="align-items-center d-flex justify-content-center"
                    >
                        <Form.Control type="text" placeholder={state.deviceStatus} readOnly />
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                         Manufacturer
                    </Form.Label>
                    <Col
                        sm={6}
                    >
                        <Form.Control
                        required
                        placeholder="Manufacturer"
                        id="manufacturer"
                        name="manufacturer"
                        value={state.manufacturer}
                        onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                        Manufacturer is a required field.
                        </Form.Control.Feedback>
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                         Manufacturer Code
                    </Form.Label>
                    <Col
                        sm={6}
                    >
                        <Form.Control
                        required
                        placeholder="Manufacturer Code"
                        id="manufacturerCode"
                        name="manufacturerCode"
                        value={state.manufacturer}
                        onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                        Manufacturer Code is a required field.
                        </Form.Control.Feedback>
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                         Direction
                    </Form.Label>
                    <Col
                        sm={6}
                    >
                        <Form.Control
                        required
                        placeholder="Direction"
                        id="direction"
                        name="direction"
                        value={state.manufacturer}
                        onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                        Direction is a required field.
                        </Form.Control.Feedback>
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                        Is Primary Device
                    </Form.Label>
                    <Col
                        sm={6}
                        className="align-items-center d-flex justify-content-center"
                    >
                        <Form.Check
                        checked={state.isPrimaryDevice}
                        type="switch"
                        id="isPrimaryDevice"
                        onChange={handleChange}
                        />
                    </Col>
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

export default { DeviceModal };
