import { useContext, useState, useEffect } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";

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
      contact: "123456789",
      MACoy: "Sample",
      equipManu: "Sample"
    };
    setState(res);
  }, [dummy]);

  return (
    <div>
      <Form>
        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Project Name
          </Form.Label>
          <Col sm={4}>
            <Form.Control placeholder="Email" />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Password
          </Form.Label>
          <Col sm={4}>
            <Form.Control placeholder="Password" />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Col sm={{ span: 8, offset: 7 }}>
            <Button type="button">Update</Button>
          </Col>
        </Form.Group>
      </Form>
    </div>
  );
}

export default { ProjectForm };
