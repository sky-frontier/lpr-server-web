import { useState, useEffect, useContext } from "react";
import { Form, Row, Col, Button, Breadcrumb } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { alertService, getProjectInfo, updateProjectInfo , getObjectTypes} from '../../services/index.js';
import {useParams} from "react-router-dom";

export function ProjectForm() {
  let { projectID }= useParams();
  const [validated, setValidated] = useState(false);
  const [state, setState] = useState({
    projectName: "",
    projectType: "",
    location: "",
    contactNumber: "",
    maCompany: "",
    equipManu: ""
  });
  const [dummy, setDummy] = useState(false);
  const [projectTypes, setProjectTypes] = useState([]);

  useEffect(() => {
    getProjectInfo(projectID)
      .then(async (data) => {
        setState(data.message);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("There was an error Get Project Info!", error);
      });
      getObjectTypes("project")
      .then(async (data) => {
        setProjectTypes(Object.entries(data.message).map((type)=>({
          id: type[0],
          name: type[1].name
        })));
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("There was an error Get Project Types!", error);
      });
  }, [dummy]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    console.log(form.checkValidity());
    if (form.checkValidity()) update();
  };

  const update = () => {
    updateProjectInfo(projectID, state)
      .then(async (data) => {
        alertService.success('Update Successful!');
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("There was an error!", error);
      });
  };

  return (
    <div>
      <Breadcrumb>
        <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/project">Projects</Breadcrumb.Item>
        <Breadcrumb.Item active>Project Info</Breadcrumb.Item>
      </Breadcrumb>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Project ID
          </Form.Label>
          <Col
            sm={4}
          >
            <Form.Control type="text" placeholder={projectID} readOnly />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Project Name
          </Form.Label>
          <Col
            sm={4}
          >
            <Form.Control
              required
              placeholder="Name"
              id="projectName"
              name="projectName"
              value={state.projectName}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Project Name is a required field.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Project Type
          </Form.Label>
          <Col
            sm={4}
          >
            <Form.Control
              custom
              required
              as="select"
              id="projectType"
              name="projectType"
              value={state.projectType===null? '':state.projectType}
              onChange={handleChange}
            >
              <option value={''}>--Select Type--</option>
              {
                projectTypes.map((type)=>(
                  <option value={type.id}>{type.name}</option>
                ))
              }
            </Form.Control>
            <Form.Control.Feedback type="invalid">
              Project Type is a required field.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Location
          </Form.Label>
          <Col
            sm={4}
          >
            <Form.Control
              required
              id="location"
              name="location"
              value={state.location}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Location is a required field.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Equipment Manufacturer
          </Form.Label>
          <Col
            sm={4}
          >
            <Form.Control
              required
              id="equipManu"
              name="equipManu"
              value={state.equipManu}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              Equipment Manufacturer is a required field.
            </Form.Control.Feedback>
          </Col>
      </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            MA Company
          </Form.Label>
          <Col
            sm={4}
          >
            <Form.Control
              required
              id="maCompany"
              name="maCompany"
              value={state.maCompany}
              onChange={handleChange}
            />
            <Form.Control.Feedback type="invalid">
              MA Company is a required field.
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Contact No.
          </Form.Label>
          <Form.Label
            column
            sm={4}
          >
            <PhoneInput
              inputProps={{
                required: true
              }}
              placeholder="+XX-XXXX-XXXX"
              id="contactNumber"
              name="contactNumber"
              country={"sg"}
              value={String(state.contactNumber)}
              onChange={(e)=>{
                setState((prevState) => ({
                  ...prevState,
                  ["contactNumber"]: parseInt(e)
                }));
              }}
              isValid={(value, country) => {
                if (value.length === 0) {
                  return false;
                } else {
                  return true;
                }
              }}
            />
          </Form.Label>
        </Form.Group>

        
        <Form.Group as={Row}>
          <Col sm={8}
           className="d-flex justify-content-end">
            <Button type="submit">Update</Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
}

export default { ProjectForm };
