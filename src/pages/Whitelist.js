import React, { useState, useContext, useEffect } from "react";
import { Form, Row, Col, Button, Breadcrumb } from "react-bootstrap";
import {Tooltip, TableFooter, TablePagination, TableContainer, TableCell, TableBody, Table, IconButton, TableHead, TableRow, Paper } from '@material-ui/core';
import { PencilSquare, Trash } from "react-bootstrap-icons";

import { useHistory, useParams, useLocation } from "react-router-dom";
import { ConfirmModal, WhitelistModal, TablePaginationActions } from "../components/index.js";
import {alertService, getProjects, getAccessRule, 
    getWhitelistEntry,
    delWhitelistEntryInfo} from '../services/index.js';
import { Directions } from "@material-ui/icons";

export function Whitelist (){
  const [initialRows, setInitialRows] = useState([]);
  const [pNumber, setPNumber] = useState("");
  const [curPNo, setCurPNo] = useState("");
  const [rows, setRows] = useState([]);
  const [toggle, setToggle] = useState({
    delete: false,
    edit: false
  });
  const [project,setProject] = useState("");
  const [curID, setCurID] = useState(null);
  const [dummy, setDummy] = useState(false);
  const [accessRules, setAccessRules] = useState([]);
  const [accessRuleVals, setAccessRuleVals] = useState({});
  const [projectNames, setProjectNames] = useState({});
  const [projects,setProjects] = useState([]);
  const func = async (val, inputField, outputField) =>{
    let temp = {};
    val.forEach(async (element)=>{
      temp[element[inputField]] = element[outputField];
    });
    return await temp;
  };

  const reloadProjects = () =>{
    getProjects(["projectID", "projectName"])
      .then(async (data) => {
        console.log(data.content);
        setProjects(data.content);
        func(data.content, "projectID", "projectName").then(async(list)=>{
          setProjectNames(await list);
        });
      })
      .catch((error) => {
        console.error("Get Project, there was an error!", error);
      });
  }

  useEffect(() => {
    reloadProjects();
  }, [dummy]);

  
  const reloadAccessRules = () =>{
    getAccessRule(project,["accessRuleID","accessRuleName","projectID"])
      .then(async (data) => {
        setAccessRules(data.content);
        /*setAccessRules(data.content.map((rule)=>({
          value: rule.accessRuleID,
          label: rule.accessRuleName
        })));*/
        func(data.content,"accessRuleID", "accessRuleName").then(async(list)=>{
          setAccessRuleVals(await list);
        });
      })
      .catch((error) => {
        console.error("Get Access Rule, there was an error!", error);
      });
  }

  useEffect(()=>{
    reloadAccessRules();
    setPNumber("");
    setCurPNo("");
  },[project]);


  const reload = () =>{
    getWhitelistEntry(["recordID","plateNumber", "accessRuleID", "tag", "startDateTime","endDateTime"])
    .then(async (data) => {
        setInitialRows(
            data.content.filter((entry)=>
                entry.accessRuleID !== null &&
                accessRuleVals[entry.accessRuleID] !== undefined
            )
        );
    })
    .catch((error) => {
      console.error("Get entry, there was an error!", error);
    });
  }

  useEffect(()=>{
    reload();
  },[accessRuleVals]);

  const filter = () => {
    let curRows = initialRows;
    console.log(curRows);
    setRows(
      curRows.filter(
        (row) =>
          row["plateNumber"].toLowerCase().indexOf(pNumber.toLowerCase()) >= 0
      )
    );
  };

  useEffect(()=>{
    filter();
  },[initialRows, pNumber]);

  const toggleModal = (modal) => {
    let prevVal = toggle[modal];
    setToggle((prevState) => ({
      ...prevState,
      [modal]: !prevVal
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
        body="Delete this entry?"
      />
      {toggle.edit?
      <WhitelistModal
        hide={toggle.edit}
        projectName = {projectNames[project]}
        ID = {curID}
        accessRules = {accessRules}
        success={() => {
            reload();
            toggleModal("edit");
        }}
        toggleModal={() => {
          toggleModal("edit");
        }}
      />:null}

      <div className="content">
      <Breadcrumb>
        <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Whitelist Entries</Breadcrumb.Item>
      </Breadcrumb>
        <Form onSubmit={(e)=>{e.preventDefault();}}>
          <Row className="d-flex">
            <Col sm="auto">
              <Form.Control
                custom
                as = "select"
                id="projectID"
                onChange={(e)=>{
                  setProject(e.target.value);
                }}
                value={project}
              >
                <option value="">--Select a Project--</option>
                  {projects.map((val)=>(
                      <option value={val.projectID}>{val.projectName}</option>
                  ))}
              </Form.Control>
            </Col>
            <Col sm="auto">
              <Button
              disabled={project===""}
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
            <div style={{"flex-grow":"1"}}></div>
            <Col sm="auto">
              <Form.Control
                placeholder="Plate No."
                onChange={(e)=>{
                    setCurPNo(e.target.value);
                }}
                value={curPNo}
              />
            </Col>
            <Col sm="auto">
              <Button
                className="btn btn-primary"
                type="button"
                onClick={() => {
                    setPNumber(curPNo);
                }}
              >
                Search
              </Button>
            </Col>
            <Col sm="auto">
            <Button type="button" variant="secondary" onClick={()=>{
                setCurPNo("");
                setPNumber("");
            }}>
                Cancel
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="content">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead >
              <TableRow>
                <TableCell align="center"><b>Plate Number</b></TableCell>
                <TableCell align="center"><b>Project</b></TableCell>
                <TableCell align="center"><b>Access Rule</b></TableCell>
                <TableCell align="center"><b>Tag</b></TableCell>
                <TableCell align="center"><b>Start Date</b></TableCell>
                <TableCell align="center"><b>End Date</b></TableCell>
                <TableCell align="right"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows).map((row, index) => (
                <TableRow key={row.gateName}>
                <TableCell align="center">
                    <div className="outerPlate" >
                      <div className="innerPlate">
                        <u>{row.plateNumber}</u>
                      </div>
                    </div>
                </TableCell>
                  <TableCell align="center">{projectNames[project]}</TableCell>
                  <TableCell align="center">{row.accessRuleID === null? null: accessRuleVals[row.accessRuleID]}</TableCell>
                  <TableCell align="center">{row.tag}</TableCell>
                  <TableCell align="center">{row.startDateTime}</TableCell>
                  <TableCell align="center">{row.endDateTime}</TableCell>
                  <TableCell align="right" style={{padding:0}}>
                  <IconButton onClick={() => {
                        setCurID(row.recordID);
                        toggleModal("edit");
                    }}>
                      <PencilSquare
                        size={21}
                        color="royalblue"
                      />
                    </IconButton>
                    <IconButton onClick={() => {
                        setCurID(row.recordID);
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
                colSpan={7}
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

export default { Whitelist };