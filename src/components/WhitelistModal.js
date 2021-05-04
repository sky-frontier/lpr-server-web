import { func } from "prop-types";
import { useState, useEffect, useContext } from "react";
import { Form, Row, Col, Button, Modal, Spinner } from "react-bootstrap";
import { alertService, getWhitelistEntryInfo, updateWhitelistEntryInfo, createWhitelistEntry, getWhitelistTags } from '../services/index.js';

import DatePicker from 'react-datepicker';

export function WhitelistModal(props) {
    let {hide, ID, success, projectName, accessRules, toggleModal } = props;
    let cnt = 0;
    const [validated, setValidated] = useState(false);
    const [state, setState] = useState({});
    const [dummy, setDummy] = useState(false);
    const [whitelistTags, setWhitelistTags] = useState([]);


  const reloadTags = ()=>{
    getWhitelistTags()
    .then(async (data) => {
      setWhitelistTags(data.message.whitelistTags);
    })
    .catch((error) => {
      alertService.error("There was an error!");
      console.error("Get WhiteList Tags, There was an error!", error);
    });
  }

  useEffect(() => {
    setValidated(false);
    reloadTags();
    if(ID===null){
      setState({
        plateNumber: "",
        accessRuleID: "",
        tag: "",
        startDateTime: "",
        endDateTime: ""
      });
    }else{
      getWhitelistEntryInfo(ID.plateNumber, ID.accessRuleID)
      .then(async (data) => {
        setState(data.message);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Get Whitelist entry info, There was an error!", error);
      });
    }
  }, [dummy]);

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
      if(ID===null) create();
      else update();
    }
  };

  const update = () => {
    updateWhitelistEntryInfo(ID.plateNumber, ID.accessRuleID, state)
    .then(async (data) => {
        setValidated(false);
        alertService.success("Update Successful!");
        success();
    })
    .catch((error) => {
      alertService.error("There was an error!");
        console.error("Update Whitelist Entry, There was an error!", error);
    });
  };

  const create = () =>{
      console.log(state);
    createWhitelistEntry(state)
    .then(async (data) => {
        setValidated(false);
      alertService.success("Addition Successful!");
      success();
    })
    .catch((error) => {
      alertService.error("There was an error!");
        console.error("Add Whitelist Entry, There was an error!", error);
    });
  }

  return (
    <Modal show={hide} onHide={()=>{
    setValidated(false);
    toggleModal();}}>
        <Modal.Header
            closeButton>
            <Modal.Title>{ID===null?"Add Entry":"Edit Entry"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form id ="whitelistModal" noValidate validated={validated} onSubmit={handleSubmit}>
            <div>
                <Form.Group as={Row}>
                <Form.Label column sm={6}>
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
                <Form.Label column sm={6}>
                    Plate Number
                </Form.Label>
                <Col
                    sm={6}
                >  
                {ID===null?
                    <div>
                        <Form.Control
                        required
                        placeholder="Name"
                        id="plateNumber"
                        name="plateNumber"
                        value={state.plateNumber}
                        onChange={handleChange}
                        />
                        <Form.Control.Feedback type="invalid">
                        Plate Number is a required field.
                        </Form.Control.Feedback>
                    </div>
                    :<Form.Control type="text" placeholder={state.plateNumber} readOnly />
                }
                </Col>
                </Form.Group>

                <Form.Group as={Row}>
                <Form.Label column sm={6}>
                    Access Rule
                </Form.Label>
                <Col
                    sm={6}
                >
                    <Form.Control
                        custom
                        required
                        as="select"
                        id="accessRuleID"
                        name="accessRuleID"
                        value={state.accessRuleID===null?"":state.accessRuleID}
                        onChange={handleChange}
                        >
                        <option value={""}>--Select Access Rule--</option>
                        {accessRules.map((rule)=>(
                            <option value={rule.accessRuleID}>{rule.accessRuleName}</option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                    Access Rule is a required field.
                    </Form.Control.Feedback>
                </Col>
                </Form.Group>

                <Form.Group as={Row}>
                <Form.Label column sm={6}>
                    Tag
                </Form.Label>
                <Col
                    sm={6}
                >
                    <Form.Control
                        custom
                        as="select"
                        id="tag"
                        name="tag"
                        value={state.tag===null?"":state.tag}
                        onChange={handleChange}
                        >
                        <option value={""}>None</option>
                        {whitelistTags.map((whitelistTag)=>(
                            <option value={whitelistTag}>{whitelistTag}</option>
                        ))}
                    </Form.Control>
                </Col>
                </Form.Group>

                <Form.Group as={Row}>
                <Form.Label column sm={6}>
                    Start Date Time
                </Form.Label>
                <Col
                    sm={6}
                >
                    <DatePicker
                        isClearable
                        className="dateRecord"
                        wrapperClassName="form-control"
                        selected={state.startDateTime}
                        maxDate={state.endDateTime}
                        popperClassName="dateTimePopper"
                        className="form-control"
                        placeholderText="YYYY-MM-DD HH:MM:SS"
                        onChange={date => handleChange({
                            target:{
                            value:date,
                            id: "startDateTime"
                            }
                        })}
                        showTimeSelect
                        dateFormat="yyyy-MM-dd"
                        timeFormat="HH:mm:ss"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="yyyy-MM-dd HH:mm:ss"
                        title="Start Date Time"
                        clearButtonClassName="dateTimeClear"
                    />
                </Col>
                </Form.Group>

                <Form.Group as={Row}>
                <Form.Label column sm={6}>
                    End Date Time
                </Form.Label>
                <Col
                    sm={6}
                >
                    <DatePicker
                        isClearable
                        className="dateRecord"
                        wrapperClassName="form-control"
                        selected={state.endDateTime}
                        minDate={state.startDateTime}
                        popperClassName="dateTimePopper"
                        className="form-control"
                        placeholderText="YYYY-MM-DD HH:MM:SS"
                        onChange={date => handleChange({
                            target:{
                            value:date,
                            id: "endDateTime"
                            }
                        })}
                        showTimeSelect
                        dateFormat="yyyy-MM-dd"
                        timeFormat="HH:mm:ss"
                        timeIntervals={15}
                        timeCaption="time"
                        dateFormat="yyyy-MM-dd HH:mm:ss"
                        title="End Date Time"
                        clearButtonClassName="dateTimeClear"
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
        <Button form ="whitelistModal" variant="primary" type="submit">
        Confirm
        </Button>
    </Modal.Footer>
    </Modal>
  );
}

export default { WhitelistModal };
