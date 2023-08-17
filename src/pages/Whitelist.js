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
import { PencilSquare, Trash } from "react-bootstrap-icons";

import {
  ConfirmModal,
  WhitelistModal,
  TablePaginationActions,
  ExportWhitelistModal,
} from "../components/index.js";
import {
  alertService,
  getProjects,
  getAccessRule,
  getWhitelistEntry,
  delWhitelistEntryInfo,
  getUnit,
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

export function Whitelist() {
  const [initialRows, setInitialRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    plateNumber: "",
    tag: "",
  });
  const [curState, setCurState] = useState({
    plateNumber: "",
    tag: "",
  });
  const [rows, setRows] = useState([]);
  const [toggle, setToggle] = useState({
    delete: false,
    edit: false,
    export: false,
  });
  const [project, setProject] = useState("");
  const [curID, setCurID] = useState(null);
  const [accessRules, setAccessRules] = useState([]);
  const [accessRuleVals, setAccessRuleVals] = useState({});
  const [units, setUnits] = useState([]);
  const [unitNames, setUnitNames] = useState({});
  const [timeVar, setTimeVar] = useState("startDateTime");
  const [curTimeVar, setCurTimeVar] = useState("startDateTime");
  const [projectNames, setProjectNames] = useState({});
  const [projects, setProjects] = useState([]);
  const func = async (val, inputField, outputField) => {
    let temp = {};
    val.forEach(async (element) => {
      temp[element[inputField]] = element[outputField];
    });
    return await temp;
  };
  const [timeState, setTimeState] = useState({
    startTime: "",
    endTime: "",
  });
  const [curTimeState, setCurTimeState] = useState({
    startTime: "",
    endTime: "",
  });

  const reset = () => {
    console.log("reseting");
    setTimeState({
      startTime: "",
      endTime: "",
    });
    setCurTimeState({
      startTime: "",
      endTime: "",
    });
    setState({
      plateNumber: "",
      tag: "",
    });
    setCurState({
      plateNumber: "",
      tag: "",
    });
  };

  useEffect(() => {
    const reloadProjects = () => {
      getProjects(["projectID", "projectName"])
        .then(async (data) => {
          console.log(data.content);
          setProjects(data.content);
          func(data.content, "projectID", "projectName").then(async (list) => {
            setProjectNames(await list);
          });
        })
        .catch((error) => {
          console.error("Get Project, there was an error!", error);
        });
    };
    reloadProjects();
  }, []);

  const reloadAccessRules = () => {
    getAccessRule(project, ["accessRuleID", "accessRuleName", "projectID"])
      .then(async (data) => {
        setAccessRules(data.content);
        /*setAccessRules(data.content.map((rule)=>({
          value: rule.accessRuleID,
          label: rule.accessRuleName
        })));*/
        func(data.content, "accessRuleID", "accessRuleName").then(
          async (list) => {
            setAccessRuleVals(await list);
          }
        );
      })
      .catch((error) => {
        console.error("Get Access Rule, there was an error!", error);
      });
  };

  const reloadUnits = () => {
    getUnit(project, ["unitID", "unitName"])
      .then(async (data) => {
        setUnits(data.content);
        func(data.content, "unitID", "unitName").then(async (list) => {
          setUnitNames(await list);
        });
      })
      .catch((error) => {
        console.error("Get Unit, there was an error!", error);
      });
  };

  useEffect(() => {
    reloadAccessRules();
    reloadUnits();
    reset();
  }, [project]);

  const reload = () => {
    if (project === "") {
      setInitialRows([]);
    } else {
      setLoading(true);
      let filters =
        timeState.startTime === "" && timeState.endTime === ""
          ? {}
          : {
              [curTimeVar]: timeState.startTime + "|" + timeState.endTime,
            };
      filters["accessRuleID"] = Object.keys(accessRuleVals || {}).map(
        (x) => +x
      );
      filters["plateNumber"] =
        state.plateNumber === "" ? undefined : state.plateNumber;

      getWhitelistEntry(
        [
          "recordID",
          "plateNumber",
          "accessRuleID",
          "tag",
          "startDateTime",
          "endDateTime",
          "unitID",
        ],
        filters
      )
        .then(async (data) => {
          setInitialRows(
            data.content.filter(
              (entry) =>
                entry.accessRuleID !== null &&
                accessRuleVals[entry.accessRuleID] !== undefined
            )
          );
          setLoading(false);
        })
        .catch((error) => {
          console.error("Get entry, there was an error!", error);
        });
    }
    setPage(0);
  };

  useEffect(() => {
    if (Object.keys(accessRuleVals || {}).length === 0) return;
    reload();
  }, [accessRuleVals, unitNames, curTimeState, curTimeVar]);

  const filter = () => {
    let curRows = initialRows;
    let { plateNumber, tag } = curState;
    console.log(curRows);
    console.log(plateNumber, tag);
    setRows(
      curRows.filter(
        (row) =>
          row["plateNumber"].toLowerCase().indexOf(plateNumber.toLowerCase()) >=
            0 && row["tag"].toLowerCase().indexOf(tag.toLowerCase()) >= 0
      )
    );
    setPage(0);
  };

  useEffect(() => {
    filter();
  }, [initialRows, curState]);

  const toggleModal = (modal) => {
    let prevVal = toggle[modal];
    setToggle((prevState) => ({
      ...prevState,
      [modal]: !prevVal,
    }));
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };
  const handleTimeChange = (value, id) => {
    setTimeState((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const del = async (recordID) => {
    delWhitelistEntryInfo(recordID)
      .then(async (data) => {
        reload();
        toggleModal("delete");
        alertService.success("Entry Deleted");
      })
      .catch((error) => {
        console.error("Delete Entry, There was an error!", error);
      });
  };

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const emptyRows =
    rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

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
        <title>Whitelists</title>
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
        body="Delete this entry?"
      />
      {toggle.edit ? (
        <WhitelistModal
          hide={toggle.edit}
          projectName={projectNames[project]}
          ID={curID}
          accessRules={accessRules}
          units={units}
          success={() => {
            reload();
            toggleModal("edit");
          }}
          toggleModal={() => {
            toggleModal("edit");
          }}
        />
      ) : null}

      {toggle.export ? (
        <ExportWhitelistModal
          hide={toggle.export}
          projects={projects}
          projectNames={projectNames}
          toggleModal={() => {
            toggleModal("export");
          }}
        />
      ) : null}

      <div className="content">
        <Breadcrumb>
          <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
          <Breadcrumb.Item active>Whitelist Entries</Breadcrumb.Item>
        </Breadcrumb>
        <Form
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          <Row className="d-flex" style={{ padding: "10px 0px" }}>
            <Col sm="auto">
              <Form.Control
                custom
                as="select"
                id="projectID"
                onChange={(e) => {
                  setProject(e.target.value);
                }}
                value={project}
              >
                <option value="">--Select a Project--</option>
                {projects.map((val) => (
                  <option value={val.projectID} key={val.projectID}>
                    {val.projectName}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col sm="auto">
              <Button
                disabled={project === ""}
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
          <Row className="d-flex" style={{ padding: "10px 0px" }}>
            <Col sm="auto">
              <Form.Control
                placeholder="Plate No."
                id="plateNumber"
                onChange={handleChange}
                value={state.plateNumber}
              />
            </Col>
            <Col sm="auto">
              <Form.Control
                placeholder="Tag"
                id="tag"
                onChange={handleChange}
                value={state.tag}
              />
            </Col>
            <div style={{ flexGrow: "1" }}></div>
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
                className="btn btn-success align-items-center d-flex"
                type="button"
                onClick={() => toggleModal("export")}
              >
                <GetAppIcon />
                &nbsp; Export
              </Button>
            </Col>
          </Row>
          <Row className="d-flex" style={{ padding: "10px 0px" }}>
            <Col sm="auto">
              <Form.Control
                custom
                as="select"
                onChange={(e) => {
                  setTimeVar(e.target.value);
                }}
                value={timeVar}
              >
                <option value="startDateTime">Start Date</option>
                <option value="endDateTime">End Date</option>
              </Form.Control>
            </Col>
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
                className="btn btn-primary"
                type="button"
                onClick={() => {
                  setCurTimeState(timeState);
                  setCurState(state);
                  setCurTimeVar(timeVar);
                }}
              >
                Search
              </Button>
            </Col>
            <Col sm="auto">
              <Button type="button" variant="secondary" onClick={() => reset()}>
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
                <TableCell align="center">
                  <b>Plate Number</b>
                </TableCell>
                <TableCell align="center">
                  <b>Project</b>
                </TableCell>
                <TableCell align="center">
                  <b>Unit Name</b>
                </TableCell>
                <TableCell align="center">
                  <b>Access Rule</b>
                </TableCell>
                <TableCell align="center">
                  <b>Tag</b>
                </TableCell>
                <TableCell align="center">
                  <b>Start Date</b>
                </TableCell>
                <TableCell align="center">
                  <b>End Date</b>
                </TableCell>
                <TableCell align="right">
                  <b>Actions</b>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell align="center" colSpan={8}>
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
                    <TableCell align="center">
                      <div className="outerPlate">
                        <div className="innerPlate">
                          <u>{row.plateNumber}</u>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell align="center">
                      {projectNames[project]}
                    </TableCell>
                    <TableCell align="center">
                      {Number.isInteger(row.unitID)
                        ? unitNames[String(row.unitID)]
                        : "-"}
                    </TableCell>
                    <TableCell align="center">
                      {row.accessRuleID === null
                        ? null
                        : accessRuleVals[row.accessRuleID]}
                    </TableCell>
                    <TableCell align="center">{row.tag}</TableCell>
                    <TableCell align="center">{row.startDateTime}</TableCell>
                    <TableCell align="center">{row.endDateTime}</TableCell>
                    <TableCell align="right" style={{ padding: 0 }}>
                      <IconButton
                        onClick={() => {
                          setCurID(row.recordID);
                          toggleModal("edit");
                        }}
                      >
                        <PencilSquare size={21} color="royalblue" />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setCurID(row.recordID);
                          toggleModal("delete");
                        }}
                      >
                        <Trash color="red" size={21} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell align="center" colSpan={8}>
                    No Entries Found
                  </TableCell>
                </TableRow>
              )}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={8} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, { label: "All", value: -1 }]}
                  colSpan={8}
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

export default { Whitelist };
