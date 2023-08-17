import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Breadcrumb, Spinner } from "react-bootstrap";
import {
  Tooltip,
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
import { PencilSquare, Trash, Cpu, Unlock } from "react-bootstrap-icons";

import { useHistory, useParams, useLocation } from "react-router-dom";
import {
  ConfirmModal,
  GateModal,
  TablePaginationActions,
} from "../../components/index.js";
import {
  getGate,
  alertService,
  delGate,
  getObjectTypes,
  openGate,
  getProjectInfo,
} from "../../services/index.js";
import RefreshIcon from "@material-ui/icons/Refresh";

export function Gates() {
  let { projectID } = useParams();
  let history = useHistory();
  let { pathname } = useLocation();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gateTypes, setGateTypes] = useState([]);
  const [gateTypeNames, setGateTypeNames] = useState([]);
  const [projectName, setProjectName] = useState("");
  const [toggle, setToggle] = useState({
    delete: false,
    edit: false,
  });
  const [modal, setModal] = useState(true);
  const [curID, setCurID] = useState("");
  const reload = () => {
    setLoading(true);
    getProjectInfo(projectID)
      .then(async (data) => {
        setProjectName(data.message.projectName);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Get Project Info, there was an error!", error);
      });
    getGate(projectID, ["gateID", "gateName", "gateType"])
      .then(async (data) => {
        setLoading(false);
        console.log(data.content);
        setRows(data.content);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Get Gate, there was an error!", error);
      });
    getObjectTypes("gate")
      .then(async (data) => {
        setGateTypeNames(data.message);
        setGateTypes(
          Object.entries(data.message).map((type) => ({
            id: type[0],
            name: type[1].name,
          }))
        );
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("There was an error Get Gate Types!", error);
      });
    setPage(0);
  };
  useEffect(() => {
    setLoading(true);
    getProjectInfo(projectID)
      .then(async (data) => {
        setProjectName(data.message.projectName);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Get Project Info, there was an error!", error);
      });
    getGate(projectID, ["gateID", "gateName", "gateType"])
      .then(async (data) => {
        setLoading(false);
        console.log(data.content);
        setRows(data.content);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Get Gate, there was an error!", error);
      });
    getObjectTypes("gate")
      .then(async (data) => {
        setGateTypeNames(data.message);
        setGateTypes(
          Object.entries(data.message).map((type) => ({
            id: type[0],
            name: type[1].name,
          }))
        );
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("There was an error Get Gate Types!", error);
      });
    setPage(0);
  }, [projectID]);

  const openGateFunc = (gateID, gateName) => {
    openGate(gateID)
      .then(async (data) => {
        alertService.success("Opened Gate " + gateName);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("There was an error Open Gate!", error);
      });
  };

  const toggleModal = (modal) => {
    let prevVal = toggle[modal];
    setToggle((prevState) => ({
      ...prevState,
      [modal]: !prevVal,
    }));
  };

  const devices = (gateID) => {
    history.push(pathname + "/" + String(gateID));
  };

  const del = async (gateID) => {
    delGate(gateID)
      .then(async (data) => {
        reload();
        toggleModal("delete");
        alertService.success("Gate Deleted");
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Delete Gate, There was an error!", error);
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
      <ConfirmModal
        hide={toggle.delete}
        success={() => {
          del(curID);
        }}
        toggleModal={() => {
          toggleModal("delete");
        }}
        title="Confirm Deletion"
        body="Delete this gate?"
      />
      <GateModal
        gateTypes={gateTypes}
        hide={toggle.edit}
        gateID={curID}
        newState={modal}
        projectID={projectID}
        success={() => {
          reload();
          toggleModal("edit");
        }}
        toggleModal={() => {
          toggleModal("edit");
        }}
      />

      <div className="content">
        <Breadcrumb>
          <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
          <Breadcrumb.Item href="/project">Projects</Breadcrumb.Item>
          <Breadcrumb.Item active>Gates</Breadcrumb.Item>
        </Breadcrumb>
        <div className="d-flex align-items-center">
          <h5 style={{ color: "#6c757d" }}>{projectName}</h5>
          <div style={{ flexGrow: "1" }}></div>
          <Form
            inline
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Row>
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
              <Col sm="auto">
                <Button
                  className="btn btn-success"
                  type="button"
                  onClick={() => {
                    setModal(true);
                    toggleModal("edit");
                  }}
                >
                  + Add
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
      </div>
      <div className="content">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">
                  <b>ID</b>
                </TableCell>
                <TableCell align="center">
                  <b>Name</b>
                </TableCell>
                <TableCell align="center">
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
                ).map((row, index) => (
                  <TableRow key={row.gateName}>
                    <TableCell align="left">{row.gateID}</TableCell>
                    <TableCell align="center">{row.gateName}</TableCell>
                    <TableCell align="center">
                      {row.gateType === null
                        ? null
                        : gateTypeNames[row.gateType] === undefined
                        ? null
                        : gateTypeNames[row.gateType].name}
                    </TableCell>
                    <TableCell align="right" style={{ padding: 0 }}>
                      <Tooltip title="Devices">
                        <IconButton
                          style={{ padding: "5px 10px" }}
                          onClick={() => {
                            devices(row.gateID);
                          }}
                        >
                          <Cpu size={21} color="royalblue" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton
                          style={{ padding: "5px 10px" }}
                          onClick={() => {
                            setCurID(row.gateID);
                            setModal(false);
                            toggleModal("edit");
                          }}
                        >
                          <PencilSquare size={21} color="royalblue" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Open Gate">
                        <IconButton
                          style={{ padding: "5px 10px" }}
                          onClick={() => {
                            openGateFunc(row.gateID, row.gateName);
                          }}
                        >
                          <Unlock size={21} color="green" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          style={{ padding: "5px 10px" }}
                          onClick={() => {
                            setCurID(row.gateID);
                            toggleModal("delete");
                          }}
                        >
                          <Trash color="red" size={21} />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={6}>
                    No Gates Found
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

export default { Gates };
