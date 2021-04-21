import React, { useState, useContext, useEffect } from "react";
import { Form, Row, Col, Button, Breadcrumb, Modal } from "react-bootstrap";
import {TableFooter, TablePagination, TableContainer, TableCell, TableBody, Table, IconButton, TableHead, TableRow, Paper } from '@material-ui/core';
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { useHistory } from "react-router-dom";
import { ConfirmModal, TablePaginationActions } from "../components/index.js";
import {getMovementLogs } from '../services/index.js';
import CarIcon from '../assets/car.png';

export function Records({ match }) {
  let history = useHistory();
  const [initialRows, setInitialRows] = useState([]);
  const [validated, setValidated] = useState(false);
  const [rows, setRows] = useState([]);
  const  queryFields = [
    "projectName",
    "vehicleType",
    "actionTaken",
    "gateName",
    "gateType",
    "originalPlate",
    "confirmedPlate"
  ];
  const fieldPlaceholder = {
    projectName: "Project Name",
    vehicleType: "Vehicle Type",
    actionTaken: "Action Taken",
    gateName: "Gate Name",
    gateType: "Gate Type",
    originalPlate: "Original Plate",
    confirmedPlate: "Actual Plate",
    detectionTime: "Detection Time",
    confirmedTime: "Confirmed Time",
    image1: "Image 1",
    image2: "Image 2",
    image3: "Image 3",
    plateImage: "Plate Image"
  };
  const fields = [
    "logID",
    "projectName",
    "vehicleType",
    "actionTaken",
    "gateName",
    "gateType",
    "originalPlate",
    "confirmedPlate",
    "detectionTime",
    "confirmedTime",
    "image1",
    "image2",
    "image3",
    "plateImage"
  ];
  const fieldLength = {
    projectName: "120px",
    vehicleType: "120px",
    actionTaken: "120px",
    gateName: "120px",
    gateType: "120px",
    originalPlate: "120px",
    confirmedPlate: "120px",
    detectionTime: "120px",
    confirmedTime: "120px",
    image1: "120px",
    image2: "120px",
    image3: "120px",
    plateImage: "120px"
  };
  const [state, setState] = useState({
    curField: "projectName",
    val: ""
  });
  const [dummy, setDummy] = useState(false);
  const [projects, setProjects] = useState([]);
  const reload = () =>{
    getMovementLogs(fields, [])
      .then(async (data) => {
        console.log(data.content);
        setInitialRows(data.content);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });
  }
  useEffect(() => {
    reload();
  }, [dummy]);

  useEffect(() => {
    filter();
  }, [initialRows]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if(id==="curField"){
      setState({
        curField: value,
        val: ""
      });
    }else{
      setState((prevState) => ({
        ...prevState,
        [id]: value
      }));
    }
  };

  const filter = (e) => {
    let { curField, val } = state;
    let curRows = initialRows;
    setRows(
      curRows.filter(
        (row) =>
          row[curField].indexOf(val) >= 0
      )
    );
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
      <div className="content">
      <Breadcrumb>
        <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Entry Exit Records</Breadcrumb.Item>
      </Breadcrumb>
        <Form inline className="rightFlex">
          <Row>
            <Col sm="auto">
              <Form.Control
                custom
                as = "select"
                id="curField"
                onChange={handleChange}
                value={state.curField}
              >
                  {queryFields.map((queryField)=>(
                      <option value={queryField}>{fieldPlaceholder[queryField]}</option>
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
              <Button type="button" onClick={filter}>
                Search
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="content greyBackground">
        <TableContainer component={Paper} className="overflowTable">
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                {fields.map((field) =>(
                  <TableCell align="center" style={{"min-width":fieldLength[field]}}>{fieldPlaceholder[field]}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows).map((row) => (
                <TableRow key={row.logID}>
                  <TableCell component="th" scope="row" align="center">
                    {row.projectName}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {row.vehicleType}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {row.actionTaken}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {row.gateName}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {row.gateType}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {row.detectionTime}
                  </TableCell>
                  <TableCell component="th" scope="row" align="center">
                    {row.confirmedTime}
                  </TableCell>
                  <TableCell align="center">
                    <div className="outerPlate" >
                      <div className="innerPlate">
                        <u>{row.originalPlate}</u>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <div className="outerPlate" >
                      <div className="innerPlate">
                        <u>{row.confirmedPlate}</u>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell align="center">
                    <img src="https://s.blogcdn.com/slideshows/images/slides/501/681/4/S5016814/slug/l/img-8442-copy-1.jpg" />
                  </TableCell>
                  <TableCell align="center">
                    <img src="https://s.blogcdn.com/slideshows/images/slides/501/681/4/S5016814/slug/l/img-8442-copy-1.jpg" />
                  </TableCell>
                  <TableCell align="center">
                    <img src="https://s.blogcdn.com/slideshows/images/slides/501/681/4/S5016814/slug/l/img-8442-copy-1.jpg" />
                  </TableCell>
                  <TableCell align="center">
                    <img src="https://s.blogcdn.com/slideshows/images/slides/501/681/4/S5016814/slug/l/img-8442-copy-1.jpg" />
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TableRow className="d-flex justify-content-center">
            <TablePagination
              rowsPerPageOptions={[5, 10, { label: 'All', value: -1 }]}
              colSpan={13}
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
      </div>
    </div>
  );
}

export default { Records };
