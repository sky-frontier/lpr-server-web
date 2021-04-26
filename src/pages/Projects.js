import React, { useState, useContext, useEffect } from "react";
import { Form, Row, Col, Button, Breadcrumb } from "react-bootstrap";
import {TableFooter, TablePagination, TableContainer, TableCell, TableBody, Table, IconButton, TableHead, TableRow, Paper } from '@material-ui/core';
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";
import { ConfirmModal, TablePaginationActions } from "../components/index.js";
import {getProjects, addProject, delProject, alertService } from '../services/index.js';

export function Projects({ match }) {
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
  const [curState, setCurState] = useState({
    projectName: "",
    location: "",
    projectType: ""
  });
  const reset = () =>{
    setState({
      projectName: "",
      location: "",
      projectType: ""
    });
    setCurState({
      projectName: "",
      location: "",
      projectType: ""
    });
  }
  const [dummy, setDummy] = useState(false);
  const reload = () =>{
    getProjects(["projectID", "projectName", "location", "projectType"])
      .then(async (data) => {
        console.log(data.content);
        setInitialRows(data.content);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }
  useEffect(() => {
    reload();
  }, [dummy]);

  useEffect(() => {
    filter();
  }, [initialRows, curState]);

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
    let { projectName, location, projectType } = curState;
    let curRows = initialRows;
    console.log(curRows);
    setRows(
      curRows.filter(
        (row) =>
          row["projectName"].toLowerCase().indexOf(projectName.toLowerCase()) >= 0 &&
          row["location"].toLowerCase().indexOf(location.toLowerCase()) >= 0 &&
          row["projectType"].toLowerCase().indexOf(projectType.toLowerCase()) >= 0
      )
    );
  };

  const insert = (e) => {
    addProject()
      .then(async (data) => {
        let ID = data.message.projectID;
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
    delProject(projectID)
    .then(async (data) => {
      reload();
      toggleModal("delete");
      alertService.success("Project Deleted");
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
  };

  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
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
      <Breadcrumb>
        <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Projects</Breadcrumb.Item>
      </Breadcrumb>
        <Form inline className="rightFlex" onSubmit={(e)=>{e.preventDefault();}}>
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
              <Button type="button" onClick={()=>{setCurState(state)}}>
                Search
              </Button>
            </Col>
            <Col sm="auto">
              <Button type="button" variant="secondary" onClick={reset}>
                Cancel
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
              {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows).map((row) => (
                <TableRow key={row.projectName}>
                  <TableCell component="th" scope="row">
                    {row.projectName}
                  </TableCell>
                  <TableCell align="left">{row.location}</TableCell>
                  <TableCell align="left">{row.projectType}</TableCell>
                  <TableCell align="right" style={{padding:0}}>
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
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, { label: 'All', value: -1 }]}
                colSpan={4}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default { Projects };
