import { useState, useEffect, useContext } from "react";
import { Form, Row, Col, Button, Alert, Modal } from "react-bootstrap";
import TimeField from 'react-simple-timefield';
import { store } from "../store.js";

export function DeviceModal(props) {
    const storeContext = useContext(store);
    const globalState = storeContext.state;
    const server_URL = globalState.server_URL;
    let ID = parseInt(props.id);
    let toggleModel = props.toggleModal;
    const [validated, setValidated] = useState(false);
    const [state, setState] = useState({});
    const [alert, setAlert] = useState(null);
    const [dummy, setDummy] = useState(false);

  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authID: "",
        serviceName: "getGate",
        content: {
            gateID: ID
        }
      })
    };
    
    fetch(server_URL, requestOptions)
    .then(async (response) => {
      const data = await response.json();
  
      // check for error response
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      console.log(data.message);
      setState(data.message);
    })
    .catch((error) => {
      this.setState({ errorMessage: error.toString() });
      console.error("There was an error!", error);
    });
  }, [dummy]);

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

  const onShowAlert = () => {
    setAlert(true);
    window.setTimeout(() => {
      setAlert(false);
    }, 2000);
  };

  const update = () => {
    const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
        authID: "",
        serviceName: "modifyGate",
        content: {
            gateID: ID,
            modifyParams: state
        }
    })
    };
    fetch(server_URL, requestOptions)
    .then(async (response) => {
        const data = await response.json();
        // check for error response
        if (data.status !== "success") {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
        }
        onShowAlert("success");
    })
    .catch((error) => {
        onShowAlert("error");
        console.error("There was an error!", error);
    });
  };

  return (
    <div className ="posAbs">
      {alert === null ? null:
        <Alert className="alert" variant={alert==="success"?"success":"danger"}>
          <p style={{margin:0}}>{alert==="success"?"Update Successful":"An Error Occured"}</p>
        </Alert>
      }
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
                        Project ID
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
                        Project Name
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
                        Project Type
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
                        input={
                            <input
                              id = "ledOnTime"
                              type="text"
                              name="ledOnTime"
                              placeholder="Time"
                              className="form-control"
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
                        input={
                            <input
                              id = "ledOffTime"
                              type="text"
                              name="ledOffTime"
                              placeholder="Time"
                              className="form-control"
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

export default { DeviceModal };
