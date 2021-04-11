import { useState, useEffect } from "react";
import { Form, Row, Col, Button, Alert } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export function ProjectForm(props) {
  let ID = props.ID;
  const [validated, setValidated] = useState(false);
  const [state, setState] = useState({
    name: "",
    type: "",
    location: "",
    contact: "",
    MACoy: "",
    equipManu: ""
  });
  const [alert, setAlert] = useState(false);
  const [dummy, setDummy] = useState(false);

  useEffect(() => {
    /*
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: props.id
      })
    };
    
    fetch(server_URL + "/projectIdQuery", requestOptions)
    .then(async (response) => {
      const data = await response.json();
  
      // check for error response
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
  
      initialRows = response.data;
    })
    .catch((error) => {
      this.setState({ errorMessage: error.toString() });
      console.error("There was an error!", error);
    });*/
    let res = {
      name: "Project",
      type: "Sample",
      location: "Sample",
      contact: "65987654321",
      MACoy: "Sample",
      equipManu: "Sample"
    };
    setState(res);
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
    if (form.checkValidity()) update();
  };

  const onShowAlert = () => {
    setAlert(true);
    window.setTimeout(() => {
      setAlert(false);
    }, 2000);
  };

  const update = () => {
    /* Pending API for project details update*/
    onShowAlert();
  };

  return (
    <div>
      {alert ? (
        <Alert className="alert" variant="success">
          <p>Update Successful</p>
        </Alert>
      ) : null}
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Project ID
          </Form.Label>
          <Col
            sm={4}
            className="align-items-center d-flex justify-content-center"
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
            className="align-items-center d-flex justify-content-center"
          >
            <Form.Control
              required
              placeholder="Name"
              id="name"
              name="name"
              value={state.name}
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
            className="align-items-center d-flex justify-content-center"
          >
            <Form.Control
              custom
              required
              as="select"
              id="type"
              name="type"
              value={state.type}
              onChange={handleChange}
            >
              <option value={""}>--Select Type--</option>
              <option>Sample</option>
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
            className="align-items-center d-flex justify-content-center"
          >
            <Form.Control
              required
              placeholder="Location"
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
            className="align-items-center d-flex justify-content-center"
          >
            <Form.Control
              required
              placeholder="Equipment Manufacturer"
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
            className="align-items-center d-flex justify-content-center"
          >
            <Form.Control
              required
              placeholder="MA Company"
              id="MACoy"
              name="MACoy"
              value={state.MACoy}
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
            className="align-items-center d-flex justify-content-center"
          >
            <PhoneInput
              inputProps={{
                required: true
              }}
              id="contactInput"
              name="contact"
              country={"sg"}
              value={state.contact}
              onChange={() => {}}
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
