import { func } from "prop-types";
import { useState, useEffect, useContext } from "react";
import { Form, Row, Col, Button, Modal, Spinner } from "react-bootstrap";
import { alertService, createAccessRule, getAccessRuleInfo, updateAccessRuleInfo, getGate } from '../services/index.js';

import { CheckPicker } from 'rsuite';

export function RulesModal(props) {
    let {hide, accessRuleID, projectID, success, projectName, toggleModal } = props;
    let cnt = 0;
    const [validated, setValidated] = useState(false);
    const [state, setState] = useState({});
    const [dummy, setDummy] = useState(false);
    const [gates, setGates] = useState([]);
    const [curGates, setCurGates] = useState({});
    const [initialGates, setInitialGates] = useState([]);
    const [loading, setLoading] = useState(true);

    const func = async (val) =>{
        let temp = {};
        val.forEach(async (element)=>{
            temp[element["gateID"]] = false;
        });
        initialGates.forEach(async (element)=>{
            temp[element] = true;
        });
        return await temp;
    };
    const loadGates = () =>{
        getGate(projectID, ["gateID", "gateName"])
        .then(async (data) => {
            setGates(data.content.map((gate)=>({
              value: String(gate.gateID),
              label: gate.gateName
            })));
            func(data.content).then(async(list)=>{
                setCurGates(await list);
            });
        })
        .catch((error) => {
            alertService.error("There was an error!");
            console.error("Get Gate Rule, There was an error!", error);
        });
    }
  useEffect(() => {
    setValidated(false);
    if(accessRuleID===null){
      setLoading(false);
      setState({
        projectID,
        accessRuleName: "",
        isChargeable: false,
        gates: []
      });
      setInitialGates([]);
    }else{
      setTimeout(()=>setLoading(false), 600);
      getAccessRuleInfo(accessRuleID)
      .then(async (data) => {
        setState(data.message);
        setInitialGates(data.message.gates);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Get Access Rule, There was an error!", error);
      });
    }
  }, [dummy]);

  useEffect(()=>{
    setState((prevState)=>({
        ...prevState,
        gates: (Object.keys(curGates)).filter((gate)=>curGates[gate])
      }));
  },[curGates]);

  useEffect(()=>{
    loadGates();
  },[initialGates]);

  const handleChange = (e, filler, e2) => {
    let id, value;
    if (e2 === undefined) {
      id = e.target.id;
      value = e.target.value;
    } else {
      id = e2.id;
      value = e;
    }
    if (['isChargeable'].includes(id)) {
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

  const handleGateChange = (e) =>{
    let id = e.target.id;
    setCurGates((prevState) => ({
      ...prevState,
      [id]: !prevState[id]
    }));
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    if (form.checkValidity()){
      if(accessRuleID===null) create();
      else update();
    }
  };

  const update = () => {
    updateAccessRuleInfo(accessRuleID, {
      ...state,
      gates: state.gates.map((gate)=>(parseInt(gate)))
    })
    .then(async (data) => {
        setValidated(false);
        alertService.success("Update Successful!");
        success();
    })
    .catch((error) => {
      alertService.error("There was an error!");
        console.error("Update Access Rule, There was an error!", error);
    });
  };

  const create = () =>{
    createAccessRule({
      ...state,
      gates: state.gates.map((gate)=>(parseInt(gate)))
    })
    .then(async (data) => {
        setValidated(false);
      alertService.success("Addition Successful!");
      success();
    })
    .catch((error) => {
      alertService.error("There was an error!");
        console.error("Add Access Rule, There was an error!", error);
    });
  }

  return (
    <Modal show={hide} onHide={()=>{
    setValidated(false);
    toggleModal();}}>
      {loading?
      <Row className="d-flex justify-content-center" style={{margin:"200px"}}>
      <Spinner size="lg" animation="border" role="status">
      <span className="sr-only">Loading...</span>
    </Spinner>
    </Row>:
        <div>
            <Modal.Header
             closeButton>
                <Modal.Title>{accessRuleID===null?"Add Rule":"Edit Rule"}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Form id ="ruleModal" noValidate validated={validated} onSubmit={handleSubmit}>
                <div>
                    <Form.Group as={Row}>
                    <Form.Label column sm={4}  align="right">
                        Project Name
                    </Form.Label>
                    <Col
                        sm={6}
                        className="align-items-center d-flex justify-content-center"
                    >
                        <Form.Control type="text" placeholder={projectName} readOnly />
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={4}  align="right">
                        Access Rule Name
                    </Form.Label>
                    <Col
                        sm={6}
                    >
                        <Form.Control
                        required
                        placeholder="Name"
                        id="accessRuleName"
                        name="accessRuleName"
                        value={state.accessRuleName}
                        onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                        Rule Name is a required field.
                        </Form.Control.Feedback>
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={4}  align="right">
                        Gates
                    </Form.Label>
                    <Col
                        sm={6}
                    >
                        <CheckPicker
                          sticky
                          searchable={false}
                          data={gates}
                          defaultValue={[]}
                          style={{ width: "100%" }}
                          value={state.gates}
                          onChange={(value)=>{
                            handleChange({
                              target:{
                                id: "gates",
                                value
                              }
                            });
                          }}
                        />
                    </Col>
                    </Form.Group>

                    <Form.Group as={Row}>
                    <Form.Label column sm={4}  align="right">
                        Is Chargeable
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

                </div>
            </Form>
          </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={()=>{
          setValidated(false);
          toggleModal();}}>
            Cancel
          </Button>
          <Button form ="ruleModal" variant="primary" type="submit">
            Confirm
          </Button>
        </Modal.Footer>
        </div>
      }
    </Modal>
  );
}

export default { RulesModal };
