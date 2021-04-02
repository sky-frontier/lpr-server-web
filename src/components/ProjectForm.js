import { useContext, useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

export function ProjectForm(props) {
  let ID = props.ID;
  const [state, setState] = useState({
    name: "",
    type: "",
    location: "",
    contact: "",
    MACoy: "",
    equipManu: ""
  });
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
      name: "Project 1",
      type: "Sample",
      location: "Bukit Batok",
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

  const update = (e) => {};

  return (
    <div>
      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Project ID
          </Form.Label>
          <Form.Label column sm={4}>
            {ID}
          </Form.Label>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Project Name
          </Form.Label>
          <Col sm={4}>
            <Form.Control
              placeholder="Name"
              id="name"
              value={state.name}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Project Type
          </Form.Label>
          <Col sm={4}>
            <Form.Control
              placeholder="Type"
              id="type"
              value={state.type}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Location
          </Form.Label>
          <Col sm={4}>
            <Form.Control
              placeholder="Location"
              id="location"
              value={state.location}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Equipment Manufacturer
          </Form.Label>
          <Col sm={4}>
            <Form.Control
              placeholder="Equipment Manufacturer"
              id="equipManu"
              value={state.equipManu}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            MA Company
          </Form.Label>
          <Col sm={4}>
            <Form.Control
              placeholder="MA Company"
              id="MACoy"
              value={state.MACoy}
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Contact No.
          </Form.Label>
          <Col sm={4}>
            <PhoneInput
              id="contactInput"
              country={"sg"}
              value={state.contact}
              onChange={() => {}}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Col sm={{ span: 8, offset: 7 }}>
            <Button type="button" onClick={update}>
              Update
            </Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
}

export default { ProjectForm };
