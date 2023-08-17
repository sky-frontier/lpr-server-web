import React, { useState, useContext, useEffect } from "react";
import { Form, Row, Col, Button, Breadcrumb, Spinner } from "react-bootstrap";
import {
  TableFooter,
  TablePagination,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  IconButton,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import { PencilSquare, Trash, SignpostSplitFill } from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";
import { ConfirmModal, TablePaginationActions } from "../components/index.js";
import {
  getProjects,
  addProject,
  delProject,
  alertService,
} from "../services/index.js";
import RefreshIcon from "@material-ui/icons/Refresh";
import { Helmet } from "react-helmet";

export function Projects({ match }) {
  let history = useHistory();
  const [initialRows, setInitialRows] = useState([]);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState({
    delete: false,
    add: false,
  });
  const [curID, setCurID] = useState("");
  const [state, setState] = useState({
    projectName: "",
    location: "",
    projectType: "",
  });
  const [curState, setCurState] = useState({
    projectName: "",
    location: "",
    projectType: "",
  });
  const reset = () => {
    setState({
      projectName: "",
      location: "",
      projectType: "",
    });
    setCurState({
      projectName: "",
      location: "",
      projectType: "",
    });
  };
  const [dummy, setDummy] = useState(false);
  const reload = () => {
    setLoading(true);
    getProjects(["projectID", "projectName", "location", "projectType"])
      .then(async (data) => {
        console.log(data.content);
        setInitialRows(data.content);
        setLoading(false);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
    setPage(0);
  };
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
      [id]: value,
    }));
  };

  const toggleModal = (modal) => {
    let prevVal = toggle[modal];
    setToggle((prevState) => ({
      ...prevState,
      [modal]: !prevVal,
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
          row["projectName"].toLowerCase().indexOf(projectName.toLowerCase()) >=
            0 &&
          row["location"].toLowerCase().indexOf(location.toLowerCase()) >= 0 &&
          row["projectType"].toLowerCase().indexOf(projectType.toLowerCase()) >=
            0
      )
    );
    setPage(0);
  };

  const insert = (e) => {
    addProject()
      .then(async (data) => {
        let ID = data.message.projectID;
        history.push("/project/" + ID);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("There was an error!", error);
      });
  };

  const edit = (projectID) => {
    history.push("/project/" + projectID);
  };

  const gate = (projectID) => {
    history.push("/project/" + projectID + "/gate");
  };

  const del = async (projectID) => {
    delProject(projectID)
      .then(async (data) => {
        reload();
        toggleModal("delete");
        alertService.success("Project Deleted");
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("There was an error!", error);
      });
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const emptyRows =
    rows.length > 0 && !loading
      ? rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage)
      : rowsPerPage - 1;

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
        <title>Projects</title>
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
        <Row className="d-flex" style={{ padding: "10px 0px" }}>
          <Col sm="auto">
            <Button
              className="btn btn-info align-items-center d-flex"
              type="button"
              onClick={reload}
            >
              <RefreshIcon />
              &nbsp; Refresh
            </Button>
          </Col>
          <div style={{ flexGrow: "1" }}></div>
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
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Row className="d-flex">
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

            <div style={{ flexGrow: "1" }}></div>
            <Col sm="auto">
              <Button
                type="button"
                onClick={() => {
                  setCurState(state);
                }}
              >
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
                <TableCell>
                  <b>Project</b>
                </TableCell>
                <TableCell align="left">
                  <b>Location</b>
                </TableCell>
                <TableCell align="left">
                  <b>Type</b>
                </TableCell>
                <TableCell align="right">
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell align="center" colSpan={4}>
                    <Spinner animation="border" role="status">
                      <span className="sr-only">Loading...</span>
                    </Spinner>
                  </TableCell>
                </TableRow>
              ) : rows.length > 0 ? (
                (rowsPerPage > 0
                  ? rows.slice(
                      page * rowsPerPage,
                      page * rowsPerPage + rowsPerPage
                    )
                  : rows
                ).map((row) => (
                  <TableRow key={row.projectName}>
                    <TableCell component="th" scope="row">
                      {row.projectName}
                    </TableCell>
                    <TableCell align="left">{row.location}</TableCell>
                    <TableCell align="left">{row.projectType}</TableCell>
                    <TableCell align="right" style={{ padding: 0 }}>
                      <IconButton onClick={() => gate(row.projectID)}>
                        <SignpostSplitFill
                          data-value={row.projectID}
                          size={21}
                          color="royalblue"
                        />
                      </IconButton>
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
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={4}>
                    No Projects Found
                  </TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, { label: "All", value: -1 }]}
                  colSpan={4}
                  count={rows.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { "aria-label": "rows per page" },
                    native: true,
                  }}
                  onPageChange={handleChangePage}
                  onRowsPerPageChange={handleChangeRowsPerPage}
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
