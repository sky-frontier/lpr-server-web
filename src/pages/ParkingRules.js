import React, { useState, useContext, useEffect } from "react";
import { Form, Row, Col, Button, Breadcrumb, Modal } from "react-bootstrap";
import {TableFooter, TablePagination, TableContainer, TableCell, TableBody, Table, IconButton, TableHead, TableRow, Paper } from '@material-ui/core';
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { ConfirmModal, TablePaginationActions } from "../components/index.js";
import {getProjects, 
  getSpecialPlate,
  delSpecialPlate,
  updateSpecialPlate,
  addSpecialPlate } from '../services/index.js';

export function ParkingRules({ match }) {
  const [initialRows, setInitialRows] = useState([]);
  const [validated, setValidated] = useState(false);
  const [curID, setCurID] = useState("");
  const [rows, setRows] = useState([]);
  const [toggle, setToggle] = useState({
    delete: false,
    add: false,
    edit: false
  });
  const [state, setState] = useState({
    projectID: null,
    actualPlate: ""
  });
  const [curState, setCurState] = useState({
    projectID: null,
    actualPlate: ""
  });
  const reset = () =>{
    setState({
      projectID: null,
      actualPlate: ""
    });
    setCurState({
      projectID: null,
      actualPlate: ""
    });
  }
  const [val, setVal] = useState({
    projectID: null,
    matchPlate: "",
    actualPlate: ""
  });
  const [dummy, setDummy] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectNames, setProjectNames] = useState({});
  const reload = () =>{
    getSpecialPlate(["projectID", "matchPlate", "actualPlate"])
      .then(async (data) => {
        console.log(data.content);
        setInitialRows(data.content);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }
  const func = async (val) =>{
    let temp = {};
    val.forEach(async (element)=>{
      temp[element.projectID] = element.projectName;
    });
    return await temp;
  };
  useEffect(() => {
    getProjects(["projectID", "projectName"])
    .then(async (data) => {
      setProjects(data.content);
      func(data.content).then(async(list)=>{
        setProjectNames(await list);
      });
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
  }, [dummy]);

  useEffect(()=>{
    reload();
  },projectNames);

  useEffect(() => {
    filter();
  }, [initialRows, curState]);

  const handleChange = (e) => {
    let { id, value } = e.target;
    if(id==="projectID")value = parseInt(value);
    setState((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleChangeVal = (e) =>{
    let { id, value } = e.target;
    if(id==="projectID")value = parseInt(value);
    setVal((prevState) => ({
      ...prevState,
      [id]: value
    }));
  }

  const toggleModal = (modal) => {
    let prevVal = toggle[modal];
    setToggle((prevState) => ({
      ...prevState,
      [modal]: !prevVal
    }));
  };

  const activateModal = (values) => {
    let {projectID, matchPlate, actualPlate} = values;
    setValidated(false);
    setVal({
        projectID,
        matchPlate,
        actualPlate
      });
    toggleModal("edit");
  };

  const filter = (e) => {
    let { projectID, actualPlate } = curState;
    let curRows = initialRows;
    setRows(
      curRows.filter(
        (row) =>
          (projectID === null || row["projectID"] === projectID) &&
          row["actualPlate"].toLowerCase().indexOf(actualPlate.toLowerCase()) >= 0
      )
    );
  };

  const insert = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    console.log(form.checkValidity());
    if (form.checkValidity()){
      addSpecialPlate(val)
      .then(async (data) => {
        reload();
        toggleModal("add");
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
    }
  };

  const edit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.preventDefault();
      e.stopPropagation();
    }
    setValidated(true);
    console.log(form.checkValidity());
    if (form.checkValidity()){
        updateSpecialPlate(val)
        .then(async (data) => {
          reload();
          toggleModal("edit");
        })
        .catch((error) => {
          console.error("There was an error!", error);
        });
    }
  };

  const del = (id) => {
    delSpecialPlate(id)
    .then(async (data) => {
      reload();
      toggleModal("delete");
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
        body="Delete this rule?"
      />
      <Modal show={toggle.add} onHide={()=>toggleModal("add")}
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Plate Regex Record</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={insert}>
        <Form.Group as={Row}>
          <Form.Label column sm={5}>
            Project Name
          </Form.Label>
          <Col sm={6}>
              <Form.Control
                custom
                required
                as = "select"
                id="projectID"
                placeholder="Name"
                onChange={handleChangeVal}
                value={val.projectID}
              >
                  <option value={null}>--Select a Project--</option>
                  {projects.map((project)=>(
                      <option value={project.projectID}>{project.projectName}</option>
                  ))}
              </Form.Control>
              <Form.Control.Feedback type="invalid">
                Project Name is a required field.
                </Form.Control.Feedback>
            </Col>
        </Form.Group>
            <Form.Group as={Row}>
            <Form.Label column sm={5}>
                Regex for Plate
            </Form.Label>
            <Col
                sm={6}
            >
                <Form.Control
                required
                placeholder="Regex"
                id="matchPlate"
                name="matchPlate"
                value={val.matchPlate}
                onChange={handleChangeVal}
                />
                <Form.Control.Feedback type="invalid">
                Regex is a required field.
                </Form.Control.Feedback>
            </Col>
            </Form.Group>
            <Form.Group as={Row}>
            <Form.Label column sm={5}>
                Actual Plate
            </Form.Label>
            <Col
                sm={6}
            >
                <Form.Control
                required
                placeholder="Actual Plate"
                id="actualPlate"
                name="actualPlate"
                value={val.actualPlate}
                onChange={handleChangeVal}
                />
                <Form.Control.Feedback type="invalid">
                Actual Plate is a required field.
                </Form.Control.Feedback>
            </Col>
            </Form.Group>
            <Modal.Footer>
                <Button variant="secondary" onClick={()=>toggleModal("add")}>
                Cancel
                </Button>
                <Button variant="primary" type="submit">
                Confirm
                </Button>
            </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
    <Modal show={toggle.edit} onHide={()=>toggleModal("edit")}
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Plate Regex Record</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={edit}>
            <Form.Group as={Row}>
            <Form.Label column sm={5}>
                Regex for Plate
            </Form.Label>
            <Col
                sm={6}
            >
                <Form.Control
                required
                placeholder="Regex"
                id="matchPlate"
                name="matchPlate"
                value={val.matchPlate}
                onChange={handleChangeVal}
                />
                <Form.Control.Feedback type="invalid">
                Regex is a required field.
                </Form.Control.Feedback>
            </Col>
            </Form.Group>
            <Form.Group as={Row}>
            <Form.Label column sm={5}>
                Actual Plate
            </Form.Label>
            <Col
                sm={6}
            >
                <Form.Control
                required
                placeholder="Actual Plate"
                id="actualPlate"
                name="actualPlate"
                value={val.actualPlate}
                onChange={handleChangeVal}
                />
                <Form.Control.Feedback type="invalid">
                Actual Plate is a required field.
                </Form.Control.Feedback>
            </Col>
            </Form.Group>
            <Modal.Footer>
                <Button variant="secondary" onClick={()=>toggleModal("edit")}>
                Cancel
                </Button>
                <Button variant="primary" type="submit">
                Confirm
                </Button>
            </Modal.Footer>
        </Form>
      </Modal.Body>
    </Modal>
      <div className="content">
      <Breadcrumb>
        <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Plate Regex</Breadcrumb.Item>
      </Breadcrumb>
        <Form inline className="rightFlex" onSubmit={(e)=>{e.preventDefault();}}>
          <Row>
            <Col sm="auto">
              <Form.Control
                custom
                as = "select"
                id="projectID"
                placeholder="Name"
                onChange={handleChange}
                value={state.projectID}
              >
                  <option value={null}>All Projects</option>
                  {projects.map((project)=>(
                      <option value={project.projectID}>{project.projectName}</option>
                  ))}
              </Form.Control>
            </Col>
            <Col sm="auto">
              <Form.Control
                id="actualPlate"
                placeholder="Actual Plate"
                onChange={handleChange}
                value={state.actualPlate}
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
                setVal({
                    projectID: "",
                    matchPlate: "",
                    actualPlate: ""
                    });
                  setValidated(false);
                  toggleModal("add");
                }}
              >
                Add +
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="content greyBackground">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="center">Project</TableCell>
                <TableCell align="center">Regex of Plate</TableCell>
                <TableCell align="center">Actual Plate</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows).map((row) => (
                <TableRow key={row.matchPlate}>
                  <TableCell component="th" scope="row" align="center">
                    {projectNames[row.projectID]}
                  </TableCell>
                  <TableCell align="center">
                    <div className="outerPlate" >
                      <div className="innerPlate">
                        <u>{row.matchPlate}</u>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <div className="outerPlate" >
                      <div className="innerPlate">
                        <u>{row.actualPlate}</u>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="right" style={{padding:0}}>
                    <IconButton onClick={() => {activateModal(row)}}>
                      <PencilSquare
                        size={21}
                        color="royalblue"
                      />
                    </IconButton>
                    <IconButton onClick={() => {
                        setCurID(row.matchPlate);
                        toggleModal("delete");
                    }}>
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

export default { ParkingRules };
