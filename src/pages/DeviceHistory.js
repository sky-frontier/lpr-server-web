import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Breadcrumb, Spinner } from "react-bootstrap";
import {
  TablePagination,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import {
  TablePaginationActions,
  ExportRecordModal,
} from "../components/index.js";
import {
  getDeviceHistory,
  getObjectTypes,
  alertService,
} from "../services/index.js";
import RefreshIcon from "@material-ui/icons/Refresh";
import GetAppIcon from "@material-ui/icons/GetApp";
import { Helmet } from "react-helmet";

import { InputGroup, DatePicker } from "rsuite";

function pad2(n) {
  return n < 10 ? "0" + n : n;
}
function dateToString(date) {
  if (date === null) return "";
  else
    return (
      date.getFullYear().toString() +
      "-" +
      pad2(date.getMonth() + 1) +
      "-" +
      pad2(date.getDate()) +
      " " +
      pad2(date.getHours()) +
      ":" +
      pad2(date.getMinutes()) +
      ":" +
      pad2(date.getSeconds())
    );
}

function minStr(str1, str2) {
  if (str1 === "") return str2;
  if (str2 === "") return "";
  if (str1 > str2) return str2;
  else return str1;
}
function maxStr(str1, str2) {
  if (str1 === "") return str2;
  if (str2 === "") return "";
  if (str1 < str2) return str2;
  else return str1;
}

export function DeviceHistory({ match }) {
  const [initialRows, setInitialRows] = useState([]);
  const [validated, setValidated] = useState(false);
  const [rows, setRows] = useState([]);
  const [gateTypes, setGateTypes] = useState({});
  const [deviceTypes, setDeviceTypes] = useState({});
  const [toggle, setToggle] = useState(false);
  const [loading, setLoading] = useState(false);
  const queryFields = [
    "deviceID",
    "deviceName",
    "deviceType",
    "deviceStatus",
    "projectName",
    "gateName",
    "gateType",
  ];
  const fieldPlaceholder = {
    logDateTime: "Timestamp",
    deviceID: "Device ID",
    deviceName: "Device Name",
    deviceType: "Device Type",
    deviceStatus: "Device Status",
    projectName: "Project",
    gateName: "Gate Name",
    gateType: "Gate Type",
  };
  const fields = [
    "logDateTime",
    "deviceID",
    "deviceName",
    "deviceType",
    "deviceStatus",
    "projectName",
    "gateName",
    "gateType",
  ];
  // const fieldLength = {
  //   logDateTime: "120px",
  //   deviceID: "90px",
  //   deviceName: "140px",
  //   deviceType: "140px",
  //   projectName: "120px",
  //   gateName: "120px",
  //   gateType: "100px",
  //   // actions: "90px",
  // };
  const [state, setState] = useState({
    curField: "deviceID",
    val: "",
    curField2: "projectName",
    val2: "",
  });
  const [timeState, setTimeState] = useState({
    startTime: "",
    endTime: "",
  });
  const [curTimeState, setCurTimeState] = useState({
    startTime: "",
    endTime: "",
  });
  const [curState, setCurState] = useState({
    curField: "deviceID",
    val: "",
    curField2: "projectName",
    val2: "",
  });
  const [dummy, setDummy] = useState(false);
  const reload = () => {
    let filters =
      timeState.startTime === "" && timeState.endTime === ""
        ? {}
        : {
            logDateTime: timeState.startTime + "|" + timeState.endTime,
          };
    if (state.val.length) filters[state.curField] = state.val;
    if (state.val2.length) filters[state.curField2] = state.val2;
    setLoading(true);
    getDeviceHistory(fields.concat("logID"), filters, 0, true)
      .then(async (data) => {
        setLoading(false);
        setInitialRows(data.content);
      })
      .catch((error) => {
        alertService.error("There was an error!");
      });
    setPage(0);
    // getMovementLogs(fields.concat("logID"), filters, 0, true)
    //   .then(async (data) => {
    //     setLoading(false);
    //     setInitialRows(data.content);
    //   })
    //   .catch((error) => {
    //     alertService.error("There was an error!");
    //     console.error("There was an error!", error);
    //   });
    //   setPage(0);
  };
  useEffect(() => {
    reload();
    getObjectTypes("gate")
      .then(async (data) => {
        setGateTypes(data.message);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("There was an error Get Gate Types!", error);
      });
    getObjectTypes("device")
      .then(async (data) => {
        setDeviceTypes(data.message);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("There was an error Get Device Types!", error);
      });
  }, [dummy]);

  useEffect(() => {
    filter();
  }, [initialRows]);

  useEffect(() => {
    reload();
  }, [curTimeState, curState]);

  useEffect(() => {
    !loading &&
      rows?.length &&
      alertService.info(`${rows.length} entries loaded`);
  }, [rows]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "curField") {
      setState((prevState) => ({
        ...prevState,
        curField: value,
        val: "",
      }));
    } else if (id === "curField2") {
      setState((prevState) => ({
        ...prevState,
        curField2: value,
        val2: "",
      }));
    } else {
      setState((prevState) => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const handleTimeChange = (value, id) => {
    setTimeState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const filter = (e) => {
    // let { curField, val,curField2, val2  } = curState;
    // let curRows = initialRows;
    // setRows(
    //   curRows.filter(
    //     (row) =>
    //       row[curField].toLowerCase().indexOf(val.toLowerCase()) >= 0 &&
    //       row[curField2].toLowerCase().indexOf(val2.toLowerCase()) >= 0
    //   ).sort(
    //     (a,b)=> (a.logDateTime < b.logDateTime) ? 1 : -1
    //   )
    // );
    let curRows = initialRows;
    setRows(curRows.sort((a, b) => (a.logDateTime < b.logDateTime ? 1 : -1)));
    setPage(0);
  };

  const reset = async (e) => {
    setState((prevState) => ({
      ...prevState,
      val: "",
      val2: "",
    }));
    setCurState((prevState) => ({
      ...prevState,
      val: "",
      val2: "",
    }));
    setCurTimeState({
      startTime: "",
      endTime: "",
    });
    setTimeState({
      startTime: "",
      endTime: "",
    });
  };

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  useEffect(() => {
    if (rows.length / rowsPerPage - 1 == page) {
      let filters =
        timeState.startTime === "" && timeState.endTime === ""
          ? {}
          : {
              logDateTime: timeState.startTime + "|" + timeState.endTime,
            };
      if (state.val.length) filters[state.curField] = state.val;
      if (state.val2.length) filters[state.curField2] = state.val2;
      setLoading(true);
      getDeviceHistory(fields.concat("logID"), filters, rows.length, true)
        .then(async (data) => {
          setLoading(false);
          setRows(
            rows.concat(
              data.content.sort((a, b) =>
                a.logDateTime < b.logDateTime ? 1 : -1
              )
            )
          );
        })
        .catch((error) => {
          alertService.error("There was an error!");
          console.error("There was an error!", error);
        });
    }
  }, [page]);

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Device History</title>
      </Helmet>
      {toggle ? (
        <ExportRecordModal
          hide={toggle}
          toggleModal={() => {
            setToggle(false);
          }}
        />
      ) : null}
      <div className="content">
        <Breadcrumb>
          <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Device History</Breadcrumb.Item>
        </Breadcrumb>
        <Row className="d-flex" style={{ padding: "10px 0px" }}>
          <Col sm="auto">
            <InputGroup style={{ backgroundColor: "white" }}>
              <InputGroup.Addon>From</InputGroup.Addon>
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                block
                appearance="subtle"
                value={timeState.startTime}
                onChange={(val) => {
                  handleTimeChange(dateToString(val), "startTime");
                  handleTimeChange(
                    maxStr(dateToString(val), timeState.endTime),
                    "endTime"
                  );
                }}
                ranges={[
                  {
                    label: "Now",
                    value: new Date(),
                  },
                ]}
                placeholder="YYYY-MM-DD HH:MM:SS"
              />
              <InputGroup.Addon>To</InputGroup.Addon>
              <DatePicker
                format="YYYY-MM-DD HH:mm:ss"
                block
                appearance="subtle"
                value={timeState.endTime}
                onChange={(val) => {
                  handleTimeChange(dateToString(val), "endTime");
                  handleTimeChange(
                    minStr(dateToString(val), timeState.startTime),
                    "startTime"
                  );
                }}
                ranges={[
                  {
                    label: "Now",
                    value: new Date(),
                  },
                ]}
                placeholder="YYYY-MM-DD HH:MM:SS"
              />
            </InputGroup>
          </Col>
          <div style={{ flexGrow: "1" }}></div>
          <Col sm="auto">
            <Button
              className="btn btn-info align-items-center d-flex"
              type="button"
              onClick={() => {
                setLoading(true);
                reload();
              }}
            >
              <RefreshIcon />
              &nbsp; Refresh
            </Button>
          </Col>
          <Col sm="auto">
            <Button
              className="btn btn-success align-items-center d-flex"
              type="button"
              onClick={() => setToggle(true)}
            >
              <GetAppIcon />
              &nbsp; Export
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
                custom
                as="select"
                id="curField"
                onChange={handleChange}
                value={state.curField}
              >
                {queryFields.map((queryField) => (
                  <option key={queryField} value={queryField}>
                    {fieldPlaceholder[queryField]}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col sm="auto">
              <Form.Control
                id="val"
                placeholder={fieldPlaceholder[state.curField]}
                onChange={handleChange}
                value={state.val}
              />
            </Col>
            <Col sm="auto">
              <Form.Control
                custom
                as="select"
                id="curField2"
                onChange={handleChange}
                value={state.curField2}
              >
                {queryFields.map((queryField) => (
                  <option key={queryField} value={queryField}>
                    {fieldPlaceholder[queryField]}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col sm="auto">
              <Form.Control
                id="val2"
                placeholder={fieldPlaceholder[state.curField2]}
                onChange={handleChange}
                value={state.val2}
              />
            </Col>
            <div style={{ flexGrow: "1" }}></div>
            <Col sm="auto">
              <Button
                type="button"
                onClick={() => {
                  setCurState(state);
                  setCurTimeState(timeState);
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
        <TableContainer
          component={Paper}
          className="overflowTable scrollbar-grey"
        >
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {fields.map((field) => (
                  <TableCell align="center" key={field}>
                    <b>{fieldPlaceholder[field]}</b>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            {loading ? (
              <TableBody>
                <div
                  className="loadingTable"
                  style={{ height: 53 * rowsPerPage }}
                >
                  <Spinner animation="border" role="status">
                    <span className="sr-only">Loading...</span>
                  </Spinner>
                </div>
                <TableRow style={{ height: 53 * rowsPerPage }}>
                  <TableCell colSpan={13} />
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>
                {rows.length > 0 ? (
                  (rowsPerPage > 0
                    ? rows.slice(
                        page * rowsPerPage,
                        page * rowsPerPage + rowsPerPage
                      )
                    : rows
                  ).map((row) => (
                    <TableRow key={row.logID}>
                      <TableCell align="center">{row.logDateTime}</TableCell>
                      <TableCell align="center">{row.deviceID}</TableCell>
                      <TableCell align="center">{row.deviceName}</TableCell>
                      <TableCell align="center">
                        {row.deviceType === null
                          ? null
                          : deviceTypes[row.deviceType] === undefined
                          ? row.deviceType
                          : deviceTypes[row.deviceType].name}
                      </TableCell>
                      <TableCell align="center">{row.deviceStatus}</TableCell>
                      <TableCell align="center">{row.projectName}</TableCell>
                      <TableCell align="center">{row.gateName}</TableCell>
                      <TableCell align="center">
                        {row.gateType === null
                          ? null
                          : gateTypes[row.gateType] === undefined
                          ? row.gateType
                          : gateTypes[row.gateType].name}
                      </TableCell>
                      {/* <TableCell className="padding-0" align="right">
                    <IconButton onClick={() => {
                        // setCurID(row.recordID);
                        // toggleModal("edit");
                    }}>
                      <OpenInNewIcon
                        size={21}
                        color="grey"
                      />
                    </IconButton>
                  </TableCell> */}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell align="center" colSpan={11}>
                      No Records Found
                    </TableCell>
                  </TableRow>
                )}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 50 * emptyRows }}>
                    <TableCell colSpan={11} />
                  </TableRow>
                )}
              </TableBody>
            )}
          </Table>
        </TableContainer>
        <TableRow className="d-flex justify-content-center">
          <TablePagination
            rowsPerPageOptions={[5, 10, 50]}
            colSpan={11}
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
      </div>
    </div>
  );
}

export default { DeviceHistory };
