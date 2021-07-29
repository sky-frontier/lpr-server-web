import React, { useState, useContext, useEffect } from "react";
import { Form, Row, Col, Button, Breadcrumb, Spinner } from "react-bootstrap";
import {Tooltip, TableFooter, TablePagination, TableContainer, TableCell, TableBody, Table, IconButton, TableHead, TableRow, Paper } from '@material-ui/core';
import { PencilSquare, Trash, Cpu, ClipboardX } from "react-bootstrap-icons";

import { useHistory, useParams, useLocation } from "react-router-dom";
import { ConfirmModal, UnitsModal, TablePaginationActions } from "../components/index.js";
import {getGate, alertService, delGate, getProjects, getUnit, delUnit, updateUnitInfo} from '../services/index.js';
import RefreshIcon from '@material-ui/icons/Refresh';
import {Helmet} from "react-helmet";

export function Units (){
  const [rows, setRows] = useState([]);
  const [toggle, setToggle] = useState({
    delete: false,
    edit: false
  });
  const [project,setProject] = useState("");
  const [curID, setCurID] = useState("");
  const [dummy, setDummy] = useState(false);
  const [projectNames, setProjectNames] = useState({});
  const [gateNames, setGateNames] = useState({});
  const [loading,setLoading] = useState(false);
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

  const reload = () =>{
    if(project===""){
      setRows([]);
    }else{
      setLoading(true);
      getUnit(project, ["unitID", "unitName", "entryGates", "exitGates", "maxPlates", "currentPlates"])
      .then(async (data) => {
          setLoading(false);
          setRows(data.content);
      })
      .catch((error) => {
          console.error("Get Unit, there was an error!", error);
      });
    }
    setPage(0);
  }

  const reloadGates = () =>{
    getGate(project,["gateID","gateName"])
      .then(async (data) => {
        func(data.content, "gateID", "gateName").then(async(list)=>{
          setGateNames(await list);
        });
      })
      .catch((error) => {
        console.error("Get Gate, there was an error!", error);
      });
  }

  useEffect(()=>{
    reload();
    reloadGates();
  },[project]);

  const resetCurrentPlates = (unitID) => {
    updateUnitInfo(unitID, {currentPlates: []})
    .then(async (data) => {
      alertService.success("Current Vehicles Reset Successful!");
      reload();
    })
    .catch((error) => {
      alertService.error("There was an error!");
      console.error("Reset Current Plate, There was an error!", error);
    });
  };

  const toggleModal = (modal) => {
    let prevVal = toggle[modal];
    setToggle((prevState) => ({
      ...prevState,
      [modal]: !prevVal
    }));
  };

  const del = async (unitID) => {
    delUnit(unitID)
    .then(async (data) => {
      reload();
      toggleModal("delete");
      alertService.success("Unit Deleted");
    })
    .catch((error) => {
      alertService.error("There was an error!");
      console.error("Delete Unit, There was an error!", error);
    });
  };
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const emptyRows = (rows.length > 0? rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage) : rowsPerPage - 1);

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
        <title>Units</title>
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
        body="Delete this unit?"
      />
      {toggle.edit?
      <UnitsModal
        hide={toggle.edit}
        projectID={project}
        projectName={projectNames[project]}
        unitID={curID}
        success={() => {
            reload();
            toggleModal("edit");
        }}
        toggleModal={() => {
            toggleModal("edit");
        }}
      /> : null}

      <div className="content">
      <Breadcrumb>
        <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Units</Breadcrumb.Item>
      </Breadcrumb>
        <Form onSubmit={(e)=>{e.preventDefault();}}>
          <Row className = "d-flex">
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
              <Button
                className="btn btn-info align-items-center d-flex"
                type="button"
                onClick={reload}
              >
              <RefreshIcon/>
                &nbsp; Refresh 
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
                <TableCell align="left"><b>Project</b></TableCell>
                <TableCell align="center"><b>Name</b></TableCell>
                <TableCell align="center"><b>Entry Gates</b></TableCell>
                <TableCell align="center"><b>Exit Gates</b></TableCell>
                <TableCell align="center"><b>Maximum Vehicles</b></TableCell>
                <TableCell align="center"><b>Current Vehicles</b></TableCell>
                <TableCell align="right"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading?
              <TableRow>
              <TableCell align="center" colSpan={5}>
              <Spinner animation="border" role="status">
                <span className="sr-only">Loading...</span>
              </Spinner>
              </TableCell>
            </TableRow>:
            rows.length > 0 ?
            (rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows).map((row, index) => (
                <TableRow key={row.unitID}>
                  <TableCell align="left">{projectNames[project]}</TableCell>
                  <TableCell align="center">{row.unitName}</TableCell>
                  <TableCell align="center">{row.entryGates===null?null:((row.entryGates).map((gate)=>(
                      <div>{gate===null?null:gateNames[gate]} <br/></div> 
                      )))}</TableCell>
                  <TableCell align="center">{row.exitGates===null?null:((row.exitGates).map((gate)=>(
                      <div>{gate===null?null:gateNames[gate]} <br/></div> 
                      )))}</TableCell>
                  <TableCell align="center">{row.maxPlates}</TableCell>
                  <TableCell align="center">{!Array.isArray(row.currentPlates)?null:((row.currentPlates).map((plateNumber)=>(
                      <div>{plateNumber} <br/></div> 
                      )))}</TableCell>
                  <TableCell align="right" style={{padding:0}}>
                    <IconButton onClick={() => {
                        resetCurrentPlates(row.unitID);
                    }}>
                      <ClipboardX
                        size={21}
                        color="grey"
                      />
                    </IconButton>
                    <IconButton onClick={() => {
                        setCurID(row.unitID);
                        toggleModal("edit");
                    }}>
                      <PencilSquare
                        size={21}
                        color="royalblue"
                      />
                    </IconButton>
                    <IconButton onClick={() => {
                        setCurID(row.unitID);
                        toggleModal("delete");
                    }}>
                      <Trash color="red" size={21} />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
              :
              <TableRow>
                <TableCell align="center" colSpan={7}>
                  No Units Found
                </TableCell>
              </TableRow>}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={7} />
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

export default { Units };