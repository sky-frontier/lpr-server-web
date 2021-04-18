import React, { useState, useContext, useEffect } from "react";
import { store } from "../store.js";
import { Form, Row, Col, Button } from "react-bootstrap";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import IconButton from "@material-ui/core/IconButton";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";
import { ConfirmModal } from "../components/index.js";

export function Projects({ match }) {
  const storeContext = useContext(store);
  const globalState = storeContext.state;
  const server_URL = globalState.server_URL;
  let history = useHistory();
  const [initialRows, setInitialRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [toggle, setToggle] = useState({
    delete: false,
    add: false
  });
  const [curID, setCurID] = useState("");
  const [state, setState] = useState({
    projectName: "",
    location: "",
    projectType: ""
  });
  const [dummy, setDummy] = useState(false);
  useEffect(() => {
    console.log("hi");
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authID: "",
        serviceName: "getTable",
        content: {
          objName: "project",
          columns: ["projectID", "projectName", "location", "projectType"]
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
        console.log(data.content);
        setInitialRows(data.content);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }, [dummy, server_URL]);

  useEffect(() => {
    filter();
  }, [initialRows]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  const toggleModal = (modal) => {
    let prevVal = toggle[modal];
    setToggle((prevState) => ({
      ...prevState,
      [modal]: !prevVal
    }));
  };

  const activateModal = (projectID) => {
    setCurID(projectID);
    toggleModal("delete");
  };

  const filter = (e) => {
    let { projectName, location, projectType } = state;
    let curRows = initialRows;
    setRows(
      curRows.filter(
        (row) =>
          row["projectName"].indexOf(projectName) >= 0 &&
          row["location"].indexOf(location) >= 0 &&
          row["projectType"].indexOf(projectType) >= 0
      )
    );
  };

  const insert = (e) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authID: "",
        serviceName: "createProject",
        content: {
          projectName: "",
          projectType: "",
          location: "",
          contactNumber: "",
          maCompany: "",
          equipManu: ""
        }
      })
    };
    fetch(server_URL, requestOptions)
      .then(async (response) => {
        const data = await response.json();
        // check for error response
        if (data.status !== "success") {
          // get error message from body or default to response status
          const error = (data && data.content) || response.status;
          return Promise.reject(error);
        }
        let ID = data.content.projectID;
        history.push("/project/" + ID);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  };

  const edit = (projectID) => {
    history.push("/project/" + projectID);
  };

  const del = async (projectID) => {
    /*
    API for removing 
    */
    console.log(projectID);
    let curRows = initialRows;
    console.log(curRows.filter((row) => projectID !== row["id"]));
    setInitialRows(curRows.filter((row) => projectID !== row["id"]));
    toggleModal("delete");
  };

  return (
    <div>
      <ConfirmModal
        hide={toggle.delete}
        success={() => {
          del(curID);
        }}
        toggleModal={() => {
          toggleModal("delete");
        }}
        title="Confirm Deletion"
        body="Delete this project?"
      />
      <ConfirmModal
        hide={toggle.add}
        success={() => {
          insert();
        }}
        toggleModal={() => {
          toggleModal("add");
        }}
        title="Confirm Addition"
        body="Add a new project?"
      />
      <div className="content">
        <Form inline className="rightFlex">
          <Row>
            <Col sm="auto">
              <Form.Control
                id="projectName"
                placeholder="Name"
                onChange={handleChange}
                value={state.projectName}
              />
            </Col>
            <Col sm="auto">
              <Form.Control
                id="location"
                placeholder="Location"
                onChange={handleChange}
                value={state.location}
              />
            </Col>
            <Col sm="auto">
              <Form.Control
                id="projectType"
                placeholder="Type"
                onChange={handleChange}
                value={state.projectType}
              />
            </Col>
            <Col sm="auto">
              <Button type="button" onClick={filter}>
                Search
              </Button>
            </Col>
            <Col sm="auto">
              <Button
                className="btn btn-success"
                type="button"
                onClick={() => {
                  toggleModal("add");
                }}
              >
                Add +
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="content">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Project</TableCell>
                <TableCell align="left">Location</TableCell>
                <TableCell align="left">Type</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.projectName}>
                  <TableCell component="th" scope="row">
                    {row.projectName}
                  </TableCell>
                  <TableCell align="left">{row.location}</TableCell>
                  <TableCell align="left">{row.projectType}</TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => edit(row.projectID)}>
                      <PencilSquare
                        data-value={row.projectID}
                        size={21}
                        color="royalblue"
                      />
                    </IconButton>
                    <IconButton onClick={() => activateModal(row.projectID)}>
                      <Trash color="red" size={21} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default { Projects };
