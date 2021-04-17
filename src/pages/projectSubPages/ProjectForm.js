import { useState, useEffect, useContext } from "react";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import { store } from "../../store.js";
import "react-phone-input-2/lib/style.css";

export function ProjectForm(props) {
  const storeContext = useContext(store);
  const globalState = storeContext.state;
  const server_URL = globalState.server_URL;
  let ID = parseInt(props.ID);
  const [validated, setValidated] = useState(false);
  const [state, setState] = useState({
    projectName: "",
    projectType: "",
    location: "",
    contactNumber: "",
    maCompany: "",
    equipManu: ""
  });
  const [alert, setAlert] = useState(null);
  const [dummy, setDummy] = useState(false);

  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authID: "",
        serviceName: "getProject",
        content: {
          projectID: ID
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
        setState(data.message);
      })
      .catch((error) => {
        console.error("There was an error!", error);
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

  const onShowAlert = (val) => {
    setAlert(val);
    window.setTimeout(() => {
      setAlert(null);
    }, 2000);
  };

  const update = () => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authID: "",
        serviceName: "modifyProject",
        content: {
          projectID: ID,
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
    <div>
      {alert === null ? null:
        <Alert className="alert" variant={alert==="success"?"success":"danger"}>
          <p style={{margin:0}}>{alert==="success"?"Update Successful":"An Error Occured"}</p>
        </Alert>
      }
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Project ID
          </Form.Label>
          <Col
            sm={4}
          >
            <Form.Control type="text" placeholder={ID} readOnly />
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
              value={state.projectType}
              onChange={handleChange}
            >
              <option value={""}>--Select Type--</option>
              <option>condo</option>
              <option>hdb</option>
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
              value={state.contactNumber}
              onChange={(e)=>{
                setState((prevState) => ({
                  ...prevState,
                  ["contactNumber"]: e
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
          <Col sm={{ span: 8, offset: 7 }}>
            <Button type="submit">Update</Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
}

export default { ProjectForm };
