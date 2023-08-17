import { func } from "prop-types";
import { useState, useEffect, useContext, useCallback } from "react";
import { Form, Row, Col, Button, Modal, Spinner } from "react-bootstrap";
import {
  alertService,
  createUnit,
  getUnitInfo,
  updateUnitInfo,
  getGate,
} from "../services/index.js";

import { CheckPicker } from "rsuite";

export function UnitsModal(props) {
  let { hide, unitID, projectID, success, projectName, toggleModal } = props;
  const [validated, setValidated] = useState(false);
  const [state, setState] = useState({});
  const [entryGates, setEntryGates] = useState([]);
  const [exitGates, setExitGates] = useState([]);
  const [curEntryGates, setCurEntryGates] = useState({});
  const [curExitGates, setCurExitGates] = useState({});

  const [initEntryGates, setInitEntryGates] = useState([]);
  const [initExitGates, setInitExitGates] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadGates = useCallback(() => {
    const funcEntry = async (val) => {
      let temp = {};
      val.forEach(async (element) => {
        temp[element["gateID"]] = false;
      });
      initEntryGates.forEach(async (element) => {
        temp[element] = true;
      });
      return await temp;
    };
    const funcExit = async (val) => {
      let temp = {};
      val.forEach(async (element) => {
        temp[element["gateID"]] = false;
      });
      initExitGates.forEach(async (element) => {
        temp[element] = true;
      });
      return await temp;
    };

    getGate(projectID, ["gateID", "gateName", "gateType"])
      .then(async (data) => {
        let filterEntry = data.content.filter(
          (gate) => gate.gateType == "entry"
        );
        let filterExit = data.content.filter((gate) => gate.gateType == "exit");
        setEntryGates(
          filterEntry.map((gate) => ({
            value: String(gate.gateID),
            label: gate.gateName,
          }))
        );
        setExitGates(
          filterExit.map((gate) => ({
            value: String(gate.gateID),
            label: gate.gateName,
          }))
        );
        funcEntry(filterEntry).then(async (list) => {
          setCurEntryGates(await list);
        });
        funcExit(filterExit).then(async (list) => {
          setCurExitGates(await list);
        });
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Get Unit Gates, There was an error!", error);
      });
  }, [initEntryGates, initExitGates, projectID]);
  useEffect(() => {
    setValidated(false);
    if (unitID === null) {
      setLoading(false);
      setState({
        projectID,
        unitName: "",
        entryGates: [],
        exitGates: [],
        maxPlates: 0,
      });
      setInitEntryGates([]);
      setInitExitGates([]);
    } else {
      setTimeout(() => setLoading(false), 600);
      getUnitInfo(unitID)
        .then(async (data) => {
          setState(data.message);
          setInitEntryGates(data.message.entryGates);
          setInitExitGates(data.message.exitGates);
        })
        .catch((error) => {
          alertService.error("There was an error!");
          console.error("Get Unit, There was an error!", error);
        });
    }
  }, [projectID, unitID]);

  useEffect(() => {
    setState((prevState) => ({
      ...prevState,
      entryGates: Object.keys(curEntryGates).filter(
        (gate) => curEntryGates[gate]
      ),
      exitGates: Object.keys(curExitGates).filter((gate) => curExitGates[gate]),
    }));
  }, [curEntryGates, curExitGates]);

  useEffect(() => {
    loadGates();
  }, [loadGates]);

  const handleChange = (e, filler, e2) => {
    let id, value;
    if (e2 === undefined) {
      id = e.target.id;
      value = e.target.value;
    } else {
      id = e2.id;
      value = e;
    }
    if (["isChargeable"].includes(id)) {
      let boolean = e.target.checked;
      setState((prevState) => ({
        ...prevState,
        [id]: boolean,
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [id]: value,
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
    if (form.checkValidity()) {
      if (unitID === null) create();
      else update();
    }
  };

  const update = () => {
    updateUnitInfo(unitID, {
      ...state,
      entryGates: state.entryGates.map((gate) => parseInt(gate)),
      exitGates: state.exitGates.map((gate) => parseInt(gate)),
    })
      .then(async (data) => {
        setValidated(false);
        alertService.success("Update Successful!");
        success();
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Update Unit, There was an error!", error);
      });
  };

  const create = () => {
    createUnit({
      ...state,
      entryGates: state.entryGates.map((gate) => parseInt(gate)),
      exitGates: state.exitGates.map((gate) => parseInt(gate)),
    })
      .then(async (data) => {
        setValidated(false);
        alertService.success("Addition Successful!");
        success();
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Add Unit, There was an error!", error);
      });
  };

  return (
    <Modal
      show={hide}
      onHide={() => {
        setValidated(false);
        toggleModal();
      }}
    >
      {loading ? (
        <Row
          className="d-flex justify-content-center"
          style={{ margin: "200px" }}
        >
          <Spinner size="lg" animation="border" role="status">
            <span className="sr-only">Loading...</span>
          </Spinner>
        </Row>
      ) : (
        <div>
          <Modal.Header closeButton>
            <Modal.Title>
              {unitID === null ? "Add Unit" : "Edit Unit"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form
              id="unitModal"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              <div>
                <Form.Group as={Row}>
                  <Form.Label column sm={4} align="right">
                    Project Name
                  </Form.Label>
                  <Col
                    sm={6}
                    className="align-items-center d-flex justify-content-center"
                  >
                    <Form.Control
                      type="text"
                      placeholder={projectName}
                      readOnly
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={4} align="right">
                    Unit Name
                  </Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      required
                      placeholder="Name"
                      id="unitName"
                      name="unitName"
                      value={state.unitName}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Unit Name is a required field.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={4} align="right">
                    Entry Gates
                  </Form.Label>
                  <Col sm={6}>
                    <CheckPicker
                      sticky
                      searchable={false}
                      data={entryGates}
                      defaultValue={[]}
                      style={{ width: "100%" }}
                      value={state.entryGates}
                      onChange={(value) => {
                        handleChange({
                          target: {
                            id: "entryGates",
                            value,
                          },
                        });
                      }}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={4} align="right">
                    Exit Gates
                  </Form.Label>
                  <Col sm={6}>
                    <CheckPicker
                      sticky
                      searchable={false}
                      data={exitGates}
                      defaultValue={[]}
                      style={{ width: "100%" }}
                      value={state.exitGates}
                      onChange={(value) => {
                        handleChange({
                          target: {
                            id: "exitGates",
                            value,
                          },
                        });
                      }}
                    />
                  </Col>
                </Form.Group>

                <Form.Group as={Row}>
                  <Form.Label column sm={4} align="right">
                    Maximum Vehicles
                  </Form.Label>
                  <Col sm={6}>
                    <Form.Control
                      required
                      placeholder="Number of vehicles"
                      id="maxPlates"
                      name="maxPlates"
                      type="number"
                      value={state.maxPlates}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Maximum Vehicles is a required field.
                    </Form.Control.Feedback>
                  </Col>
                </Form.Group>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              onClick={() => {
                setValidated(false);
                toggleModal();
              }}
            >
              Cancel
            </Button>
            <Button form="unitModal" variant="primary" type="submit">
              Confirm
            </Button>
          </Modal.Footer>
        </div>
      )}
    </Modal>
  );
}

export default { UnitsModal };
