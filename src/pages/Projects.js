import React, { useState, useContext, useEffect } from "react";
import { store } from "../store.js";
import { Form, Row, Col, Button } from "react-bootstrap";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";

function createData(projectName, location, infomation) {
  return { projectName, location, infomation };
}

export default function Projects({ match }) {
  const storeContext = useContext(store);
  const globalState = storeContext.state;
  let history = useHistory();
  const [initialRows, setInitialRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [state, setState] = useState({
    name: "",
    location: ""
  });
  const [dummy, setDummy] = useState(false);
  useEffect(() => {
    /*
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({})
    };
    
    fetch(server_URL + "/projectQuery", requestOptions)
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
    let res = [
      createData("Project 1", "Bukit Gombak", "gate"),
      createData("Project 2", "Bukit Batok", "gate"),
      createData("Project 3", "Chua Chu Kang", "gate"),
      createData("Project 4", "Lim Chu Batok", "gate")
    ];
    setInitialRows(res);
    setRows(res);
  }, [dummy]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  const filter = (e) => {
    let { name, location } = state;
    let curRows = initialRows;
    setRows(
      curRows.filter(
        (row) =>
          row["projectName"].indexOf(name) >= 0 &&
          row["location"].indexOf(location) >= 0
      )
    );
    console.log(rows);
  };

  const insert = (e) => {
    /*
    API for inserting empty state into DB while returning generated ID
    */
    let ID = "8f88a3c0a1d7c25";
    history.push("/project/" + ID);
  };

  return (
    <div>
      <div className="content">
        <Form inline className="rightFlex">
          <Row>
            <Col xs="auto">
              <Form.Control
                id="name"
                placeholder="Name"
                onChange={handleChange}
                value={state.name}
              />
            </Col>
            <Col xs="auto">
              <Form.Control
                id="location"
                placeholder="Location"
                onChange={handleChange}
                value={state.location}
              />
            </Col>
            <Col xs="auto">
              <Button type="button" onClick={filter}>
                Search
              </Button>
            </Col>
            <Col xs="auto">
              <Button class="btn btn-success" type="button" onClick={insert}>
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
                <TableCell align="left">Infomation</TableCell>
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
                  <TableCell align="left">{row.infomation}</TableCell>
                  <TableCell align="right">
                    <PencilSquare size={21} color="royalblue" />
                    &nbsp;
                    <Trash color="red" size={21} />
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
