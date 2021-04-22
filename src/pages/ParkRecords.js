import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Breadcrumb } from "react-bootstrap";
import {TableFooter, TablePagination, TableContainer, TableCell, TableBody, Table, IconButton, TableHead, TableRow, Paper } from '@material-ui/core';
import { TablePaginationActions } from "../components/index.js";
import {getMovementLogs } from '../services/index.js';

export function ParkRecords({ match }) {
  const [initialRows, setInitialRows] = useState([]);
  const [validated, setValidated] = useState(false);
  const [rows, setRows] = useState([]);
  const [state, setState] = useState({
    curField: "projectName",
    val: ""
  });
  const [curState, setCurState] = useState({
    curField: "projectName",
    val: ""
  });
  const [dummy, setDummy] = useState(false);
  const [projects, setProjects] = useState([]);
  const reload = () =>{
    /*getMovementLogs(fields.concat("logID"), [])
      .then(async (data) => {
        setInitialRows(data.content);
      })
      .catch((error) => {
        console.error("There was an error!", error);
      });*/
  }
  useEffect(() => {
    reload();
    let res = [
      {

      }
    ];
  }, [dummy]);

  useEffect(() => {
    filter();
  }, [initialRows, curState]);

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
    let { curField, val } = curState;
    let curRows = initialRows;
    setRows(
      curRows.filter(
        (row) =>
          row[curField].toLowerCase().indexOf(val.toLowerCase()) >= 0
      )
    );
  };
  
  const reset = async (e) =>{
    setState({
      curField: "projectName",
      val: ""
    });
    setCurState({
      curField: "projectName",
      val: ""
    });
  }
  
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
        <Form inline className="rightFlex" onSubmit={(e)=>{e.preventDefault();}}>
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
              <Button type="button" onClick={()=>{setCurState(state)}}>
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
                  <TableCell className="padding-0" component="th" scope="row" align="center">
                    {row.projectName}
                  </TableCell>
                  <TableCell className="padding-0" component="th" scope="row" align="center">
                    {row.vehicleType}
                  </TableCell>
                 {/* <TableCell className="padding-0" component="th" scope="row" align="center">
                    {row.actionTaken}
            </TableCell>*/}
                  <TableCell className="padding-0" component="th" scope="row" align="center">
                    {row.gateName}
                  </TableCell>
                  <TableCell className="padding-0" component="th" scope="row" align="center">
                    {row.gateType}
                  </TableCell>
                  <TableCell className="padding-0" component="th" scope="row" align="center">
                    {row.detectionTime}
                  </TableCell>
                  <TableCell className="padding-0" component="th" scope="row" align="center">
                    {row.confirmedTime}
                  </TableCell>
                  <TableCell className="padding-0" align="center">
                    <div className="outerPlate" >
                      <div className="innerPlate">
                        <u>{row.originalPlate}</u>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="padding-0" align="center">
                    <div className="outerPlate" >
                      <div className="innerPlate">
                        <u>{row.confirmedPlate === null ?
                        "---------------":row.confirmedPlate
                        }</u>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="padding-0" align="center">
                    <img style={{"height":fieldHeight.image1}} src="https://s.blogcdn.com/slideshows/images/slides/501/681/4/S5016814/slug/l/img-8442-copy-1.jpg" />
                  </TableCell>
                  <TableCell className="padding-0" align="center">
                    <img style={{"height":fieldHeight.image2}} src="https://s.blogcdn.com/slideshows/images/slides/501/681/4/S5016814/slug/l/img-8442-copy-1.jpg" />
                  </TableCell>
                  <TableCell className="padding-0" align="center">
                    <img style={{"height":fieldHeight.image3}} src="https://s.blogcdn.com/slideshows/images/slides/501/681/4/S5016814/slug/l/img-8442-copy-1.jpg" />
                  </TableCell>
                  <TableCell className="padding-0" align="center">
                    <img style={{"height":fieldHeight.plateImage}} src="https://s.blogcdn.com/slideshows/images/slides/501/681/4/S5016814/slug/l/img-8442-copy-1.jpg" />
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
              rowsPerPageOptions={[5, 10, 50]}
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

export default { ParkRecords };
