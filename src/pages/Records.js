import React, { useState, useEffect } from "react";
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
import {
  ImageModal,
  TablePaginationActions,
  ExportRecordModal,
} from "../components/index.js";
import {
  getMovementLogs,
  getObjectTypes,
  alertService,
} from "../services/index.js";
import { LockFill, UnlockFill } from "react-bootstrap-icons";
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

export function Records({ match }) {
  const [initialRows, setInitialRows] = useState([]);
  const [validated, setValidated] = useState(false);
  const [rows, setRows] = useState([]);
  const [gateTypes, setGateTypes] = useState({});
  const [toggle, setToggle] = useState(false);
  const [imageSrc, setImageSrc] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadImage, setLoadImage] = useState({});
  const queryFields = [
    "projectName",
    "vehicleType",
    "gateName",
    "gateType",
    "originalPlate",
    "confirmedPlate",
  ];
  const fieldPlaceholder = {
    projectName: "Project",
    vehicleType: "Vehicle Type",
    isOpened: "Opened?",
    gateName: "Gate Name",
    gateType: "Gate Type",
    originalPlate: "Original Plate",
    confirmedPlate: "Actual Plate",
    detectionTime: "Detection Time",
    confirmedTime: "Confirmed Time",
    image1: "Image",
    plateImage: "Plate Image",
  };
  const fields = [
    "projectName",
    "vehicleType",
    "isOpened",
    "gateName",
    "gateType",
    "detectionTime",
    "confirmedTime",
    "originalPlate",
    "confirmedPlate",
  ];
  const fieldLength = {
    projectName: "120px",
    vehicleType: "120px",
    isOpened: "0px",
    gateName: "120px",
    gateType: "100px",
    originalPlate: "140px",
    confirmedPlate: "140px",
    detectionTime: "160px",
    confirmedTime: "160px",
    image1: "90px",
    plateImage: "90px",
  };
  const fieldHeight = {
    image1: "50px",
    plateImage: "50px",
    isOpened: "30px",
  };
  const [state, setState] = useState({
    curField: "projectName",
    val: "",
    curField2: "gateName",
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
    curField: "projectName",
    val: "",
    curField2: "gateName",
    val2: "",
  });
  const [dummy, setDummy] = useState(false);
  const [projects, setProjects] = useState([]);
  const reload = () => {
    let filters =
      timeState.startTime === "" && timeState.endTime === ""
        ? {}
        : {
            detectionTime: timeState.startTime + "|" + timeState.endTime,
          };
    if (state.val.length) filters[state.curField] = state.val;
    if (state.val2.length) filters[state.curField2] = state.val2;
    setLoading(true);
    getMovementLogs(fields.concat("logID"), filters, 0, true)
      .then(async (data) => {
        setLoading(false);
        setInitialRows(data.content);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("There was an error!", error);
      });
    setPage(0);
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
    //     (a,b)=> (a.detectionTime < b.detectionTime) ? 1 : -1
    //   )
    // );
    let curRows = initialRows;
    setRows(
      curRows.sort((a, b) => (a.detectionTime < b.detectionTime ? 1 : -1))
    );
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

  const addImages = (logID) => {
    getMovementLogs(["image1", "plateImage"], { logID })
      .then(async (data) => {
        setLoadImage((prevState) => ({
          ...prevState,
          [logID]: data.content[0],
        }));
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("There was an error!", error);
      });
    console.log(loadImage);
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
              detectionTime: timeState.startTime + "|" + timeState.endTime,
            };
      if (state.val.length) filters[state.curField] = state.val;
      if (state.val2.length) filters[state.curField2] = state.val2;
      setLoading(true);
      getMovementLogs(fields.concat("logID"), filters, rows.length, true)
        .then(async (data) => {
          setLoading(false);
          setRows(
            rows.concat(
              data.content.sort((a, b) =>
                a.detectionTime < b.detectionTime ? 1 : -1
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
        <title>Records</title>
      </Helmet>
      <ImageModal
        src={imageSrc}
        toggleModal={() => {
          setImageSrc(null);
        }}
      />
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
          <Breadcrumb.Item active>Entry Exit Records</Breadcrumb.Item>
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
                  <option value={queryField}>
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
                  <option value={queryField}>
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
                  <TableCell
                    align="center"
                    style={{ minWidth: fieldLength[field] }}
                  >
                    <b>{fieldPlaceholder[field]}</b>
                  </TableCell>
                ))}
                <TableCell
                  align="center"
                  style={{ minWidth: fieldLength["image1"] }}
                >
                  <b>{fieldPlaceholder["image1"]}</b>
                </TableCell>
                <TableCell
                  align="center"
                  style={{ minWidth: fieldLength["plateImage"] }}
                >
                  <b>{fieldPlaceholder["plateImage"]}</b>
                </TableCell>
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
                      <TableCell className="padding-0" align="center">
                        {row.projectName}
                      </TableCell>
                      <TableCell className="padding-0" align="center">
                        {row.vehicleType}
                      </TableCell>
                      <TableCell className="padding-0" align="center">
                        {row.isOpened === true ? (
                          <UnlockFill color="#64D381" size={25} />
                        ) : (
                          <LockFill color="red" size={25} />
                        )}
                      </TableCell>
                      <TableCell className="padding-0" align="center">
                        {row.gateName}
                      </TableCell>
                      <TableCell className="padding-0" align="center">
                        {row.gateType === null
                          ? null
                          : gateTypes[row.gateType] === undefined
                          ? null
                          : gateTypes[row.gateType].name}
                      </TableCell>
                      <TableCell className="padding-0" align="center">
                        {row.detectionTime}
                      </TableCell>
                      <TableCell className="padding-0" align="center">
                        {row.confirmedTime}
                      </TableCell>
                      <TableCell className="padding-0" align="center">
                        <div className="outerPlate">
                          <div className="innerPlate">
                            <u>{row.originalPlate}</u>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="padding-0" align="center">
                        {row.confirmedPlate === null ||
                        row.confirmedPlate == "" ? null : (
                          <div className="outerPlate">
                            <div className="innerPlate">
                              <u>{row.confirmedPlate}</u>
                            </div>
                          </div>
                        )}
                      </TableCell>
                      <TableCell style={{ padding: "0 10px" }} align="center">
                        {loadImage[row.logID] === undefined ? (
                          <IconButton onClick={() => addImages(row.logID)}>
                            <GetAppIcon />
                          </IconButton>
                        ) : (
                          <img
                            className="imageClick"
                            onClick={() =>
                              setImageSrc(loadImage[row.logID].image1)
                            }
                            style={{ height: fieldHeight.image1 }}
                            src={loadImage[row.logID].image1}
                          />
                        )}
                      </TableCell>
                      <TableCell style={{ padding: "0 10px" }} align="center">
                        {loadImage[row.logID] === undefined ? (
                          <IconButton onClick={() => addImages(row.logID)}>
                            <GetAppIcon />
                          </IconButton>
                        ) : (
                          <img
                            className="imageClick"
                            onClick={() =>
                              setImageSrc(loadImage[row.logID].plateImage)
                            }
                            style={{ height: fieldHeight.plateImage }}
                            src={loadImage[row.logID].plateImage}
                          />
                        )}
                      </TableCell>
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
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
            ActionsComponent={TablePaginationActions}
          />
        </TableRow>
      </div>
    </div>
  );
}

export default { Records };
