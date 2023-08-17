import React, { useState, useEffect, useCallback } from "react";
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
import { PencilSquare, Trash } from "react-bootstrap-icons";

import { useParams } from "react-router-dom";
import {
  ConfirmModal,
  DeviceModal,
  TablePaginationActions,
} from "../../components/index.js";
import {
  getDevice,
  alertService,
  delDevice,
  getObjectTypes,
  getProjectInfo,
  getGateInfo,
} from "../../services/index.js";
import SignalCellularAltIcon from "@material-ui/icons/SignalCellularAlt";
import SignalCellularConnectedNoInternet0BarIcon from "@material-ui/icons/SignalCellularConnectedNoInternet0Bar";
import RefreshIcon from "@material-ui/icons/Refresh";

export function Devices() {
  let { projectID, gateID } = useParams();
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toggle, setToggle] = useState({
    delete: false,
    edit: false,
  });
  const [projectName, setProjectName] = useState("");
  const [gateName, setGateName] = useState("");
  const [curID, setCurID] = useState(null);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [deviceTypeNames, setDeviceTypeNames] = useState([]);
  const reload = useCallback(() => {
    setLoading(true);
    getProjectInfo(projectID)
      .then(async (data) => {
        setProjectName(data.message.projectName);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Get Project Info, there was an error!", error);
      });
    getGateInfo(gateID)
      .then(async (data) => {
        setGateName(data.message.gateName);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Get Gate Info, there was an error!", error);
      });
    getDevice(gateID, [
      "deviceID",
      "deviceName",
      "deviceType",
      "deviceStatus",
      "deviceIP",
    ])
      .then(async (data) => {
        setLoading(false);
        console.log(data.content);
        setRows(data.content);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Get Device, there was an error!", error);
      });
    getObjectTypes("device")
      .then(async (data) => {
        setDeviceTypeNames(data.message);
        setDeviceTypes(
          Object.entries(data.message).map((type) => ({
            id: type[0],
            name: type[1].name,
          }))
        );
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("There was an error Get Device Types!", error);
      });
    setPage(0);
  }, [projectID, gateID]);
  useEffect(() => {
    reload();
  }, [reload]);

  const toggleModal = (modal) => {
    let prevVal = toggle[modal];
    setToggle((prevState) => ({
      ...prevState,
      [modal]: !prevVal,
    }));
  };

  const del = async (deviceID) => {
    delDevice(deviceID)
      .then(async (data) => {
        reload();
        toggleModal("delete");
        alertService.success("Device Deleted");
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Delete Device, There was an error!", error);
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
        body="Delete this device?"
      />
      <DeviceModal
        deviceTypes={deviceTypes}
        hide={toggle.edit}
        deviceID={curID}
        gateID={gateID}
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
          <Breadcrumb.Item href={"/project/" + projectID + "/gate"}>
            Gates
          </Breadcrumb.Item>
          <Breadcrumb.Item active>Devices</Breadcrumb.Item>
        </Breadcrumb>
        <div className="d-flex align-items-center">
          <h5 style={{ color: "#6c757d" }}>
            {projectName} / {gateName}
          </h5>
          <div style={{ flexGrow: "1" }}></div>
          <Form
            inline
            className="rightFlex"
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
                    setCurID(null);
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
                <TableCell align="center">
                  <b>IP</b>
                </TableCell>
                <TableCell align="center">
                  <b>Status</b>
                </TableCell>
                <TableCell align="right">
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell align="center" colSpan={6}>
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
                  <TableRow key={row.deviceID}>
                    <TableCell align="left">{row.deviceID}</TableCell>
                    <TableCell align="center">{row.deviceName}</TableCell>
                    <TableCell align="center">
                      {row.deviceType === null
                        ? null
                        : deviceTypeNames[row.deviceType] === undefined
                        ? null
                        : deviceTypeNames[row.deviceType].name}
                    </TableCell>
                    <TableCell align="center">
                      {row.deviceIP === "" || row.deviceIP == null
                        ? "-"
                        : row.deviceIP}
                    </TableCell>
                    <TableCell align="center">
                      {row.deviceStatus === "online" ? (
                        <Tooltip title="Online">
                          <SignalCellularAltIcon style={{ color: "#4caf50" }} />
                        </Tooltip>
                      ) : (
                        <Tooltip title="Offline">
                          <SignalCellularConnectedNoInternet0BarIcon
                            style={{ color: "#f44336" }}
                          />
                        </Tooltip>
                      )}
                    </TableCell>
                    <TableCell align="right" style={{ padding: 0 }}>
                      <Tooltip title="Edit">
                        <IconButton
                          onClick={() => {
                            setCurID(row.deviceID);
                            toggleModal("edit");
                          }}
                        >
                          <PencilSquare size={21} color="royalblue" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton
                          onClick={() => {
                            setCurID(row.deviceID);
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
                    No Devices Found
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
                  colSpan={6}
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

export default { Devices };
