import React, { useState, useContext, useEffect } from "react";
import { Form, Row, Col, Button, Breadcrumb, Modal } from "react-bootstrap";
import {TableFooter, TablePagination, TableContainer, TableCell, TableBody, Table, IconButton, TableHead, TableRow, Paper } from '@material-ui/core';
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";
import { ConfirmModal, TablePaginationActions } from "../components/index.js";
import {getProjects } from '../services/index.js';

export function PlateRegex({ match }) {
  let history = useHistory();
  const [initialRows, setInitialRows] = useState([]);
  const [validated, setValidated] = useState(false);
  const [rows, setRows] = useState([]);
  const [toggle, setToggle] = useState({
    delete: false,
    add: false,
    edit: false
  });
  const [curID, setCurID] = useState("");
  const [state, setState] = useState({
    projectName: "",
    plateNo: ""
  });
  const [val, setVal] = useState({
    projectName: "",
    plateRegex: "",
    plateNo: ""
  });
  const [dummy, setDummy] = useState(false);
  const [projects, setProjects] = useState([]);
  const reload = () =>{
    /*getProjects(["projectID", "projectName", "location", "projectType"])
      .then(async (data) => {
        console.log(data.content);
        setInitialRows(data.content);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });*/
  }
  useEffect(() => {
    //reload();
    getProjects(["projectID", "projectName"])
    .then(async (data) => {
      setProjects(data.content);
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });
    let res = [
        {
            id: 1,
            projectName: "Sample 1",
            plateRegex: "S%ample 1",
            plateNo: "Sample 1"
        },
        {
            id: 2,
            projectName: "Sample 2",
            plateRegex: "S%ample 2",
            plateNo: "Sample 2"
        },
        {
            id: 3,
            projectName: "Sample 3",
            plateRegex: "S%ample 3",
            plateNo: "Sample 3"
        },
        {
            id: 4,
            projectName: "Sample 4",
            plateRegex: "S%ample 4",
            plateNo: "Sample 4"
        },
        {
            id: 5,
            projectName: "Sample 5",
            plateRegex: "S%ample 5",
            plateNo: "Sample 5"
        },
        {
            id: 6,
            projectName: "Sample 6",
            plateRegex: "S%ample 6",
            plateNo: "Sample 6"
        }
    ];
    setInitialRows(res);
  }, [dummy]);

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

  const handleChangeVal = (e) =>{
    const { id, value } = e.target;
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
    let {id, plateRegex, plateNo} = values;
    setValidated(false);
    setVal({
        plateRegex,
        plateNo
        });
    setCurID(id);
    toggleModal("edit");
  };

  const filter = (e) => {
    let { projectName, plateNo } = state;
    let curRows = initialRows;
    setRows(
      curRows.filter(
        (row) =>
          row["projectName"].indexOf(projectName) >= 0 &&
          row["plateNo"].indexOf(plateNo) >= 0
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
        ///API for editing & reload
        toggleModal("add");
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
        ///API for editing & reload
        toggleModal("edit");
    }
  };

  const del = (id) => {
    /*
    API for removing 
    reload();
    filter();
    */
    console.log(id);
    toggleModal("delete");
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
        body="Delete this regex?"
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
                <Col
                    sm={6}
                >
                    <Form.Control
                        required
                        custom
                        as = "select"
                        id="projectName"
                        placeholder="Name"
                        onChange={handleChangeVal}
                        value={val.projectName}
                    >
                        <option value={""}>--Select Project--</option>
                        {projects.map((project)=>(
                            <option value={project.projectName}>{project.projectName}</option>
                        ))}
                    </Form.Control>
                    <Form.Control.Feedback type="invalid">
                    Regex is a required field.
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
                id="plateRegex"
                name="plateRegex"
                value={val.plateRegex}
                onChange={handleChangeVal}
                />
                <Form.Control.Feedback type="invalid">
                Regex is a required field.
                </Form.Control.Feedback>
            </Col>
            </Form.Group>
            <Form.Group as={Row}>
            <Form.Label column sm={5}>
                Plate No.
            </Form.Label>
            <Col
                sm={6}
            >
                <Form.Control
                required
                placeholder="Plate No."
                id="plateNo"
                name="plateNo"
                value={val.plateNo}
                onChange={handleChangeVal}
                />
                <Form.Control.Feedback type="invalid">
                Plate No. is a required field.
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
                id="plateRegex"
                name="plateRegex"
                value={val.plateRegex}
                onChange={handleChangeVal}
                />
                <Form.Control.Feedback type="invalid">
                Regex is a required field.
                </Form.Control.Feedback>
            </Col>
            </Form.Group>
            <Form.Group as={Row}>
            <Form.Label column sm={5}>
                Plate No.
            </Form.Label>
            <Col
                sm={6}
            >
                <Form.Control
                required
                placeholder="Plate No."
                id="plateNo"
                name="plateNo"
                value={val.plateNo}
                onChange={handleChangeVal}
                />
                <Form.Control.Feedback type="invalid">
                Plate No. is a required field.
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
        <Form inline className="rightFlex">
          <Row>
            <Col sm="auto">
              <Form.Control
                custom
                as = "select"
                id="projectName"
                placeholder="Name"
                onChange={handleChange}
                value={state.projectName}
              >
                  <option value={""}>All Projects</option>
                  {projects.map((project)=>(
                      <option value={project.projectName}>{project.projectName}</option>
                  ))}
              </Form.Control>
            </Col>
            <Col sm="auto">
              <Form.Control
                id="plateNo"
                placeholder="Plate No."
                onChange={handleChange}
                value={state.plateNo}
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
                setVal({
                    projectName: "",
                    plateRegex: "",
                    plateNo: ""
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
                <TableCell>Project</TableCell>
                <TableCell align="left">Regex of Plate</TableCell>
                <TableCell align="left">Actual Plate</TableCell>
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
                  <TableCell align="left">{row.plateRegex}</TableCell>
                  <TableCell align="left">{row.plateNo}</TableCell>
                  <TableCell align="right" style={{padding:0}}>
                    <IconButton onClick={() => activateModal(row)}>
                      <PencilSquare
                        size={21}
                        color="royalblue"
                      />
                    </IconButton>
                    <IconButton onClick={() => {
                        setCurID(row.id);
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

export default { PlateRegex };
