import { useState, useEffect, useContext } from "react";
import { Form, Row, Col, Button, Modal, Spinner } from "react-bootstrap";
import { alertService, createDevice, getDeviceInfo, updateDeviceInfo, getGate, getProjects } from '../services/index.js';

export function DeviceModal(props) {
    let {hide, gateID, toggleModal, success, deviceID, deviceTypes } = props;
    const [validated, setValidated] = useState(false);
    const [state, setState] = useState({});
    const [dummy, setDummy] = useState(false);
    const [projects, setProjects] = useState([]);
    const [curProject, setCurProject] = useState("");
    const [gates, setGates] = useState([]);
    const [loading, setLoading] = useState(false);

  useEffect(() => {
    setValidated(false);
    if(deviceID===null){
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
      setLoading(true);
      getDeviceInfo(deviceID)
      .then(async (data) => {
        setState(data.message);
        setLoading(false);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Get Device, There was an error!", error);
      });
      if(gateID===null){
        handleChange({
          target:{
            id: "gateID",
            value: ""
          }
        });
        getProjects(["projectID","projectName"])
        .then(async (data) => {
          setCurProject("");
          setProjects(data.content);
        })
        .catch((error) => {
          alertService.error("There was an error!");
          console.error("Get Projects, There was an error!", error);
        });
      }
    }
  }, [dummy,hide]);

  useEffect(()=>{
    handleChange({
      target:{
        id: "gateID",
        value: ""
      }
    });
    if(curProject === null)setGates([]);
    else{
      getGate(curProject,["gateID","gateName"])
      .then(async (data) => {
        setGates(data.content);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Get Gates, There was an error!", error);
      });
    }
  },[curProject])

  const handleChange = (e, filler, e2) => {
    let id, value;
    if (e2 === undefined) {
      id = e.target.id;
      value = e.target.value;
    } else {
      id = e2.id;
      value = e;
    }
    if (['isPrimaryDevice','isGateControl'].includes(id)) {
      let boolean = e.target.checked;
      setState((prevState) => ({
        ...prevState,
        [id]: boolean
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
      if(deviceID===null) create();
      else update();
    }
  };

  const update = () => {
    console.log(state);
    let tempState = state;
    delete tempState["deviceStatus"];
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
                <Modal.Title>{deviceID===null?"Add Device":"Edit Device"}</Modal.Title>
            </Modal.Header>
            <div className={"loadingModal"+(loading?"":" invisible")}>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
            <Modal.Body>
            <Form id ="deviceModal" noValidate validated={validated} onSubmit={handleSubmit}>
                <div>
                    <Form.Group as={Row}>
                    <Form.Label column sm={4}  align="right">
                        Device ID
                    </Form.Label>
                    <Col
                        sm={6}
                    >{deviceID===null?
                        <div><Form.Control
                        required
                        placeholder="ID"
                        id="deviceID"
                        name="deviceID"
                        type ="text"
                        value={state.deviceID}
                        onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                        Device ID is a required field.
                        </Form.Control.Feedback></div>:<Form.Control type="text" placeholder={state.deviceID} readOnly />}
                    </Col>
                    </Form.Group>
                    {gateID===null?
                    <div>
                      <Form.Group as={Row}>
                        <Form.Label column sm={4}  align="right">
                            Project
                        </Form.Label>
                        <Col
                            sm={6}
                        >
                          <Form.Control
                            custom
                            required
                            as="select"
                            id="project"
                            name="project"
                            value={curProject}
                            onChange={(e)=>{
                              setCurProject(e.target.value);
                            }}
                            >
                            <option value={""}>--Select Project--</option>
                            {projects.map((project)=>(
                              <option value={project.projectID}>{project.projectName}</option>
                            ))}
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            Project is a required field.
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>
                      <Form.Group as={Row}>
                        <Form.Label column sm={4}  align="right">
                            Gate
                        </Form.Label>
                        <Col
                            sm={6}
                        >
                          <Form.Control
                            disabled = {curProject===""}
                            custom
                            required
                            as="select"
                            id="gateID"
                            name="gateID"
                            value={state.gateID===null?"":state.gateID}
                            onChange={handleChange}
                            >
                            <option value={""}>--Select Project--</option>
                            {gates.map((gate)=>(
                              <option value={gate.gateID}>{gate.gateName}</option>
                            ))}
                          </Form.Control>
                          <Form.Control.Feedback type="invalid">
                            Gate is a required field.
                          </Form.Control.Feedback>
                        </Col>
                      </Form.Group>
                      </div>
                      :null
                    }
                    <Form.Group as={Row}>
                    <Form.Label column sm={4}  align="right">
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
                    <Form.Label column sm={4}  align="right">
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
                        value={state.deviceType===null?null:state.deviceType}
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
                    <Form.Label column sm={4}  align="right">
                        Carpark
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
                    <Form.Label column sm={4}  align="right">
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
                    <Form.Label column sm={4}  align="right">
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
                    <Form.Label column sm={4}  align="right">
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
                    <Form.Label column sm={4}  align="right">
                        Primary Device?
                    </Form.Label>
                    <Col
                        sm={6}
                        className="align-items-center d-flex justify-content-center"
                    >
                        <Form.Check
                        checked = {state.isPrimaryDevice}
                        type="switch"
                        id="isPrimaryDevice"
                        onChange={handleChange}
                        />
                    </Col>
                    </Form.Group>
                    <Form.Group as={Row}>
                    <Form.Label column sm={4}  align="right">
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
