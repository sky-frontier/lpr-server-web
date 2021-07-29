import React, { useState, useContext, useEffect } from "react";
import { Form, Row, Col, Button, Breadcrumb, Modal,Spinner } from "react-bootstrap";
import {TableFooter, TablePagination, TableContainer, TableCell, TableBody, Table, IconButton, TableHead, TableRow, Paper } from '@material-ui/core';
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { ConfirmModal, TablePaginationActions } from "../components/index.js";
import RefreshIcon from '@material-ui/icons/Refresh';
import {getProjects, 
  getSpecialPlate,
  delSpecialPlate,
  updateSpecialPlate,
  addSpecialPlate } from '../services/index.js';
  import {Helmet} from "react-helmet";

export function SpecialPlates({ match }) {
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
    projectID: NaN,
    actualPlate: ""
  });
  const [curState, setCurState] = useState({
    projectID: NaN,
    actualPlate: ""
  });
  const reset = () =>{
    setState({
      projectID: NaN,
      actualPlate: ""
    });
    setCurState({
      projectID: NaN,
      actualPlate: ""
    });
  }
  const [val, setVal] = useState({
    projectID: NaN,
    matchPlate: "",
    actualPlate: ""
  });
  const [dummy, setDummy] = useState(false);
  const [projects, setProjects] = useState([]);
  const [projectNames, setProjectNames] = useState({});
  const [loading,setLoading] = useState(false);
  const reload = () =>{
    setLoading(true);
    getSpecialPlate(["projectID", "matchPlate", "actualPlate"])
      .then(async (data) => {
        setLoading(false);
        console.log(data.content);
        setInitialRows(data.content);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
      setPage(0);
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
          (Number.isNaN(projectID) || row["projectID"] === projectID) &&
          String(row["actualPlate"]).toLowerCase().indexOf(actualPlate.toLowerCase()) >= 0
      )
    );
    setPage(0);
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
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

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
      <Helmet>
        <meta charSet="utf-8" />
        <title>Special Plates</title>
      </Helmet>
      <ConfirmModal
        hide={toggle.delete}
        success={() => {
          del(curID);
        }}
        toggleModal={() => {
          toggleModal("delete");
        }}
        title="Confirm Deletion"
        body="Delete this special plate?"
      />
      <Modal show={toggle.add} onHide={()=>toggleModal("add")}
      centered>
      <Modal.Header closeButton>
        <Modal.Title>Add Special Plate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={insert}>
        <Form.Group as={Row}>
          <Form.Label column sm={4} align="right">
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
            <Form.Label column sm={4} align="right">
                Plate Pattern
            </Form.Label>
            <Col
                sm={6}
            >
                <Form.Control
                required
                placeholder="Pattern"
                id="matchPlate"
                name="matchPlate"
                value={val.matchPlate}
                onChange={handleChangeVal}
                />
                <Form.Control.Feedback type="invalid">
                Plate Pattern is a required field.
                </Form.Control.Feedback>
                <Form.Text muted>
                '%' matches a single character
                </Form.Text>
                <Form.Text muted>
                '@' matches multiple characters
                </Form.Text>
            </Col>
            </Form.Group>
            <Form.Group as={Row}>
            <Form.Label column sm={4} align="right">
                Corrected Plate
            </Form.Label>
            <Col
                sm={6}
            >
                <Form.Control
                required
                placeholder="Plate Number"
                id="actualPlate"
                name="actualPlate"
                value={val.actualPlate}
                onChange={handleChangeVal}
                />
                <Form.Control.Feedback type="invalid">
                Corrected Plate is a required field.
                </Form.Control.Feedback>
                <Form.Text muted>
                The plate number to correct to
                </Form.Text>
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
        <Modal.Title>Edit Special Plate</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form noValidate validated={validated} onSubmit={edit}>
            <Form.Group as={Row}>
            <Form.Label column sm={4} align="right">
                Plate Pattern
            </Form.Label>
            <Col
                sm={6}
            >
                <Form.Control
                disabled
                required
                placeholder="Pattern"
                id="matchPlate"
                name="matchPlate"
                value={val.matchPlate}
                onChange={handleChangeVal}
                />
                <Form.Control.Feedback type="invalid">
                Plate Pattern is a required field.
                </Form.Control.Feedback>
                <Form.Text muted>
                '%' matches a single character
                </Form.Text>
                <Form.Text muted>
                '@' matches multiple characters
                </Form.Text>
            </Col>
            </Form.Group>
            <Form.Group as={Row}>
            <Form.Label column sm={4} align="right">
                Corrected Plate
            </Form.Label>
            <Col
                sm={6}
            >
                <Form.Control
                required
                placeholder="Plate Number"
                id="actualPlate"
                name="actualPlate"
                value={val.actualPlate}
                onChange={handleChangeVal}
                />
                <Form.Control.Feedback type="invalid">
                Corrected Plate is a required field.
                </Form.Control.Feedback>
                <Form.Text muted>
                The plate number to correct to
                </Form.Text>
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
        <Breadcrumb.Item active>Special Plate Correction</Breadcrumb.Item>
      </Breadcrumb>
        <Form onSubmit={(e)=>{e.preventDefault();}}>
          <Row className = "d-flex">
            <Col sm="auto">
              <Button
                className="btn btn-info align-items-center d-flex"
                type="button"
                onClick={reload}
              >
              <RefreshIcon/>
                &nbsp; Refresh 
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
            <div style={{"flex-grow":"1"}}></div>
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
                placeholder="Corrected Plate"
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
          </Row>
        </Form>
      </div>
      <div className="content">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left"><b>Project</b></TableCell>
                <TableCell align="center"><b>Plate Pattern</b></TableCell>
                <TableCell align="center"><b>Corrected Plate</b></TableCell>
                <TableCell align="right"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading?
              <TableRow>
              <TableCell align="center" colSpan={6}>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
              </TableCell>
            </TableRow>:
            rows.length > 0?
            (rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows).map((row) => (
                <TableRow key={row.matchPlate}>
                  <TableCell component="th" scope="row" align="left">
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
              ))
              :
              <TableRow>
                <TableCell align="center" colSpan={4}>
                  No Special Plates Found
                </TableCell>
              </TableRow>}
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

export default { SpecialPlates };
