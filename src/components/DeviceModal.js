import { useState, useEffect, useContext } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import { alertService, createDevice, getDeviceInfo, updateDeviceInfo } from '../services/index.js';

export function DeviceModal(props) {
    let {hide, gateID, toggleModal, success, newState, deviceID, deviceTypes } = props;
    const [validated, setValidated] = useState(false);
    const [state, setState] = useState({});
    const [dummy, setDummy] = useState(false);

  useEffect(() => {
    setValidated(false);
    if(newState){
      setState({
        gateID,
        deviceID: "",
        deviceName: "",
        deviceType: "",
        deviceCarpark: "",
        manufacturer: "",
        manufacturerCode: "",
        direction: "",
        isPrimaryDevice: false,
        isGateControl: false
      });
    }else{
      getDeviceInfo(deviceID)
      .then(async (data) => {
        console.log(data.message);
        setState(data.message);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Get Device, There was an error!", error);
      });
    }
  }, [dummy,newState,gateID]);

  const handleChange = (e, filler, e2) => {
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
    if (form.checkValidity()){
      if(newState) create();
      else update();
    }
  };

  const update = () => {
    let tempState = state;
    delete tempState["deviceStatus"];
    console.log(tempState);
    updateDeviceInfo(deviceID, tempState)
    .then(async (data) => {
        setValidated(false);
        alertService.success("Update Successful!");
        success();
    })
    .catch((error) => {
      alertService.error("There was an error!");
        console.error("Update Device, There was an error!", error);
    });
  };

  const create = () =>{
    createDevice(gateID, state)
    .then(async (data) => {
        setValidated(false);
      alertService.success("Addition Successful!");
      success();
    })
    .catch((error) => {
      alertService.error("There was an error!");
        console.error("Add Device, There was an error!", error);
    });
  }

  return (
    <Modal show={hide} onHide={()=>{
    setValidated(false);
    toggleModal();}}>
            <Modal.Header
             closeButton>
                <Modal.Title>{newState?"Add Device":"Edit Device"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form id ="deviceModal" noValidate validated={validated} onSubmit={handleSubmit}>
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
                    >{newState?
                        <div><Form.Control
                        required
                        placeholder="ID"
                        id="deviceID"
                        name="deviceID"
                        value={state.deviceID}
                        onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                        Device ID is a required field.
                        </Form.Control.Feedback></div>:<Form.Control type="text" placeholder={state.deviceID} readOnly />}
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
                        custom
                        required
                        as="select"
                        id="deviceType"
                        name="deviceType"
                        value={state.deviceType}
                        onChange={handleChange}
                        >
                        <option value={""}>--Select Type--</option>
                        {deviceTypes.map((type)=>(
                          <option value={type.id}>{type.name}</option>
                        ))}
                        </Form.Control>
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
                    {newState?null:
                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                        Status
                    </Form.Label>
                    <Col
                        sm={6}
                        className="align-items-center d-flex justify-content-center"
                    >
                        <Form.Control type="text" placeholder={state.deviceStatus === "online"?"Online":"Offline"} readOnly />
                    </Col>
                    </Form.Group>}

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
                        value={state.manufacturerCode}
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
                        value={state.direction}
                        onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                        Direction is a required field.
                        </Form.Control.Feedback>
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                        Primary Device?
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
                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                        Control Gate?
                    </Form.Label>
                    <Col
                        sm={6}
                        className="align-items-center d-flex justify-content-center"
                    >
                        <Form.Check
                        checked={state.isGateControl}
                        type="switch"
                        id="isGateControl"
                        onChange={handleChange}
                        />
                    </Col>
                    </Form.Group>

                </div>
            </Form>
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{
    setValidated(false);
    toggleModal();}}>
            Cancel
          </Button>
          <Button form ="deviceModal" variant="primary" type="submit">
            Confirm
          </Button>
        </Modal.Footer>
    </Modal>
  );
}

export default { DeviceModal };
