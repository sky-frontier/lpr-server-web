import { useContext, useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

export default function ProjectForm(props) {
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
      contact: "123456789",
      MACoy: "Sample",
      equipManu: "Sample"
    };
    setState(res);
  }, [dummy]);

  return (
    <Form>
      <Form.Group as={Row} controlId="formHorizontalEmail">
        <Form.Label column sm={2}>
          Email
        </Form.Label>
        <Col xs="auto">
          <Form.Control type="email" placeholder="Email" />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="formHorizontalPassword">
        <Form.Label column sm={2}>
          Password
        </Form.Label>
        <Col xs="auto">
          <Form.Control type="password" placeholder="Password" />
        </Col>
      </Form.Group>

      <Form.Group as={Row}>
        <Col sm={{ span: 10, offset: 2 }}>
          <Button type="button">Update</Button>
        </Col>
      </Form.Group>
    </Form>
  );
}
