import { useState, useEffect } from "react";
import { Form, Row, Col, Button, InputGroup } from "react-bootstrap";
import NumericInput from "react-numeric-input";
import { alertService } from '../../services/index.js';

export function BusinessDetails(props) {
  let ID = props.ID;
  const [state, setState] = useState({
    barrierDelay: 5,
    networkWarningDuration: 5,
    instantImgUpload: false,
    vehicleColorDetect: false,
    localImgStore: false
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
      alertService.error("There was an error!");
      console.error("There was an error!", error);
    });*/
    let res = {
      barrierDelay: 5,
      networkWarningDuration: 5,
      instantImgUpload: false,
      vehicleColorDetect: false,
      localImgStore: false
    };
    setState(res);
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
    update();
  };

  const update = () => {
    /* Pending API for project details update*/
  };

  function myFormat(num) {
    return num + " mins";
  }

  return (
    <div>
      <Form onSubmit={handleSubmit}>
        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Barrier Opening Delay
          </Form.Label>
          <Col
            sm={4}
            className="align-items-center d-flex justify-content-center"
          >
            <InputGroup>
              <NumericInput
                strict
                id="barrierDelay"
                format={myFormat}
                className="form-control"
                value={state.barrierDelay}
                min={0}
                max={100}
                onChange={handleChange}
              />
            </InputGroup>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Duration before issuing network down warning
          </Form.Label>
          <Col
            sm={4}
            className="align-items-center d-flex justify-content-center"
          >
            <InputGroup>
              <NumericInput
                strict
                id="networkWarningDuration"
                format={myFormat}
                className="form-control"
                value={state.networkWarningDuration}
                min={0}
                max={100}
                onChange={handleChange}
              />
            </InputGroup>
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Enable Instant Image Upload to Server
          </Form.Label>
          <Col
            sm={4}
            className="align-items-center d-flex justify-content-center"
          >
            <Form.Check
              checked={state.instantImgUpload}
              type="switch"
              id="instantImgUpload"
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Enable Local Storage of images after uploading
          </Form.Label>
          <Col
            sm={4}
            className=" align-items-center d-flex justify-content-center"
          >
            <Form.Check
              checked={state.localImgStore}
              type="switch"
              id="localImgStore"
              onChange={handleChange}
            />
          </Col>
        </Form.Group>

        <Form.Group as={Row}>
          <Form.Label column sm={4}>
            Enable Vehicle Colour Detection
          </Form.Label>
          <Col
            sm={4}
            className=" align-items-center d-flex justify-content-center"
          >
            <Form.Check
              checked={state.vehicleColorDetect}
              type="switch"
              id="vehicleColorDetect"
              onChange={handleChange}
            />
          </Col>
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

export default { BusinessDetails };
