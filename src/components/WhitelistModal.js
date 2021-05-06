import { func } from "prop-types";
import { useState, useEffect, useContext } from "react";
import { Form, Row, Col, Button, Modal, Spinner } from "react-bootstrap";
import { alertService, getWhitelistEntryInfo, updateWhitelistEntryInfo, createWhitelistEntry, getWhitelistTags, getPlates } from '../services/index.js';
import {DatePicker, SelectPicker} from 'rsuite';

function pad2(n) { return n < 10 ? '0' + n : n }
function dateToString(date){
  if(date===null)return "";
  else return date.getFullYear().toString() +'-'+ pad2(date.getMonth() + 1) +'-'+ pad2( date.getDate()) +' '+ pad2( date.getHours() ) +':'+ pad2( date.getMinutes() ) +':'+ pad2( date.getSeconds() );
}

function minStr(str1, str2){
  if(str1==="")return str2;
  if(str2==="")return "";
  if(str1 > str2)return str2;
  else return str1;
}
function maxStr(str1, str2){
  if(str1==="")return str2;
  if(str2==="")return "";
  if(str1 < str2)return str2;
  else return str1;
}

export function WhitelistModal(props) {
    let {hide, ID, success, projectName, accessRules, toggleModal } = props;
    let cnt = 0;
    const [validated, setValidated] = useState(false);
    const [state, setState] = useState({});
    const [dummy, setDummy] = useState(false);
    const [whitelistTags, setWhitelistTags] = useState([]);
    const [plates,setPlates] = useState([]);
    const [loading, setLoading] = useState(false);


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

  const reloadPlate = ()=>{
    getPlates(["plateNumber"])
    .then(async (data) => {
      setPlates(data.content.map((plate)=>plate.plateNumber));
    })
    .catch((error) => {
      alertService.error("There was an error!");
      console.error("Get Plate Number, There was an error!", error);
    });
  }

  useEffect(() => {
    setValidated(false);
    reloadTags();
    reloadPlate();
    if(ID===null){
      setState({
        plateNumber: "",
        accessRuleID: "",
        tag: "",
        startDateTime: "",
        endDateTime: ""
      });
    }else{
      setLoading(true);
      getWhitelistEntryInfo(ID)
      .then(async (data) => {
          console.log(data.message);
        setState(data.message);
        setLoading(false);
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
    setLoading(true);
    console.log(state);
    updateWhitelistEntryInfo(state)
    .then(async (data) => {
        setValidated(false);
        setLoading(false);
        alertService.success("Update Successful!");
        success();
    })
    .catch((error) => {
      setLoading(false);
      alertService.error("There was an error!");
        console.error("Update Whitelist Entry, There was an error!", error);
    });
  };

  const create = () =>{
    setLoading(true);
    createWhitelistEntry(state)
    .then(async (data) => {
      setLoading(false);
        setValidated(false);
      alertService.success("Addition Successful!");
      success();
    })
    .catch((error) => {
      setLoading(false);
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
          <div className={"loadingModal"+(loading?"":" invisible")}>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        <Modal.Body>
        <Form id ="whitelistModal" noValidate validated={validated} onSubmit={handleSubmit}>
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
                        isValid={plates.includes(state.plateNumber)}
                        isInvalid={!plates.includes(state.plateNumber)&&validated}
                        />
                        <Form.Control.Feedback type="invalid">
                        Please enter a registered plate no.
                        </Form.Control.Feedback>
                    </div>
                    :<Form.Control type="text" placeholder={state.plateNumber} readOnly />
                }
                </Col>
                </Form.Group>

                <Form.Group as={Row}>
                <Form.Label column sm={4}  align="right">
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
                <Form.Label column sm={4} align="right">
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
                <Form.Label column sm={4}  align="right">
                    Start Date Time
                </Form.Label>
                <Col
                    sm={6}
                >
                    <DatePicker
                className="width-100"
                    value={state.startDateTime}
                    onChange={(val)=>{
                      handleChange({
                        target:{
                          id: "startDateTime",
                          value: dateToString(val)
                        }
                      });
                      handleChange({
                        target:{
                          id: "endDateTime",
                          value: maxStr(dateToString(val),state.endDateTime)
                        }
                      });
                    }}
                      format="YYYY-MM-DD HH:mm:ss"
                      ranges={[
                        {
                          label: 'Now',
                          value: new Date()
                        }
                      ]}
                      placeholder="Start DateTime"
                    />
                </Col>
                </Form.Group>

                <Form.Group as={Row}>
                <Form.Label column sm={4}  align="right">
                    End Date Time
                </Form.Label>
                <Col
                    sm={6}
                >
                <DatePicker
                className="width-100"
                    value={state.endDateTime}
                    onChange={(val)=>{
                      handleChange({
                        target:{
                          id: "endDateTime",
                          value: dateToString(val)
                        }
                      });
                      handleChange({
                        target:{
                          id: "startDateTime",
                          value: minStr(dateToString(val),state.startDateTime)
                        }
                      });
                    }}
                  format="YYYY-MM-DD HH:mm:ss"
                  ranges={[
                    {
                      label: 'Now',
                      value: new Date()
                    }
                  ]}
                  placeholder="End DateTime"
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
