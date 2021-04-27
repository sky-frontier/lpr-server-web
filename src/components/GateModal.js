import { useState, useEffect, useContext } from "react";
import { Form, Row, Col, Button, Modal } from "react-bootstrap";
import TimeField from 'react-simple-timefield';
import { alertService, createGate, getGateInfo, updateGateInfo, getWhitelistTags } from '../services/index.js';

export function GateModal(props) {
    let {hide, gateID, toggleModal, success, newState, projectID, gateTypes } = props;
    const [validated, setValidated] = useState(false);
    const [state, setState] = useState({});
    const [dummy, setDummy] = useState(false);
    const [whiteListTags, setWhiteListTags] = useState([]);
    const newInitialState = {
      gateName: "",
      gateType: "",
      isChargeable: false,
      ledOnTime: "00:00:00",
      ledOffTime: "00:00:00",
      allowedTypes: []
    };

  useEffect(() => {
    setValidated(false);
    console.log("gateModal", gateID, projectID, newState);
    if(!hide){
      setState(newInitialState);
    }else if(newState){
      setState(newInitialState);
    }else{
      getGateInfo(gateID)
      .then(async (data) => {
        setState(data.message);
        console.log(data.message);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Get Gate, There was an error!", error);
      });
    }
    getWhitelistTags()
    .then(async (data) => {
      setWhiteListTags(data.message.whitelistTags);
    })
    .catch((error) => {
      alertService.error("There was an error!");
      console.error("Get WhiteList Tags, There was an error!", error);
    });
  }, [dummy,hide]);

  const handleTagChange = (e) =>{
    let {id, value} = e.target;
    let idx = state.allowedTypes.indexOf(id);
    if(idx==-1){
      setState((prevState) => ({
        ...prevState,
        allowedTypes: prevState.allowedTypes.concat([id])
      }));
    }else{
      let tempList = state.allowedTypes;
      tempList.splice(idx,1);
      setState((prevState) => ({
        ...prevState,
        allowedTypes: tempList
      }));
    }
  }

  const handleChange = (e, filler, e2) => {
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
    if (form.checkValidity()){
      if(newState) create();
      else update();
    }
  };

  const update = () => {
    updateGateInfo(gateID, state)
    .then(async (data) => {
      setValidated(false);
        alertService.success("Update Successful!");
        success();
    })
    .catch((error) => {
      alertService.error("There was an error!");
        console.error("Update Gate, There was an error!", error);
    });
  };

  const create = () =>{
    createGate(projectID, state)
    .then(async (data) => {
      setValidated(false);
      alertService.success("Addition Successful!");
      success();
    })
    .catch((error) => {
      alertService.error("There was an error!");
        console.error("Add Gate, There was an error!", error);
    });
  }

  return (
    <Modal show={hide} onHide={()=>{
      setValidated(false);
      toggleModal();}}>
            <Modal.Header
             closeButton>
                <Modal.Title>{newState?"Add Gate":"Edit Gate"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form id='gateModal' noValidate validated={validated} onSubmit={handleSubmit}>
                <div>
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
                        {gateTypes.map((type)=>(
                          <option value={type.id}>{type.name}</option>
                        ))}
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                        Gate Type is a required field.
                        </Form.Control.Feedback>
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
                    <Form.Group as={Row}>
                    <Form.Label column sm={6}>
                        Whitelist Tags
                    </Form.Label>
                    </Form.Group>
                    <Form.Group as={Row}>
                      <Col
                          sm={6}
                      >
                        {whiteListTags.map((tag, index)=>(
                            <div>{
                                index%2==0?
                            <Form.Check 
                                custom
                                type={'checkbox'}
                                id={tag}
                                checked={state.allowedTypes.includes(tag)}
                                onChange={handleTagChange}
                                label={tag}
                            />:null
                            }</div>
                        ))}
                      </Col>
                      <Col
                          sm={6}
                      >
                        {whiteListTags.map((tag, index)=>(
                            <div>{
                                index%2==1?
                            <Form.Check 
                                custom
                                type={'checkbox'}
                                id={tag}
                                checked={state.allowedTypes.includes(tag)}
                                onChange={handleTagChange}
                                label={tag}
                            />:null
                            }</div>
                        ))}
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
          <Button form ="gateModal" variant="primary" type="submit">
            Confirm
          </Button>
        </Modal.Footer>
    </Modal>
  );
}

export default { GateModal };
