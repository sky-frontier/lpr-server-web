import React, { useState, useEffect } from "react";
import { Form, Row, Col, Button, Breadcrumb } from "react-bootstrap";
import {TableFooter, TablePagination, TableContainer, TableCell, TableBody, Table, IconButton, TableHead, TableRow, Paper } from '@material-ui/core';
import { ImageModal, TablePaginationActions } from "../components/index.js";
import {getMovementLogs, getObjectTypes, alertService } from '../services/index.js';
import { LockFill, UnlockFill } from "react-bootstrap-icons";

import { InputGroup, DatePicker } from 'rsuite';

function pad2(n) { return n < 10 ? '0' + n : n }
function dateToString(date){
  if(date===null)return "";
  else return date.getFullYear().toString() +'-'+ pad2(date.getMonth() + 1) +'-'+ pad2( date.getDate()) +' '+ pad2( date.getHours() ) +':'+ pad2( date.getMinutes() ) +':'+ pad2( date.getSeconds() );
}

function minStr(str1, str2){
  if(str1==="")return str2;
  if(str2==="")return "";
  if(str1 > str2)return str2;
  else return str1;
}
function maxStr(str1, str2){
  if(str1==="")return str2;
  if(str2==="")return "";
  if(str1 < str2)return str2;
  else return str1;
}

export function Records({ match }) {
  const [initialRows, setInitialRows] = useState([]);
  const [validated, setValidated] = useState(false);
  const [rows, setRows] = useState([]);
  const [gateTypes, setGateTypes] = useState({});
  const [imageSrc, setImageSrc] = useState(null);
  const  queryFields = [
    "projectName",
    "vehicleType",
    "gateName",
    "gateType",
    "originalPlate",
    "confirmedPlate"
  ];
  const fieldPlaceholder = {
    projectName: "Project Name",
    vehicleType: "Vehicle Type",
    isOpened: "Is Opened",
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
    "projectName",
    "vehicleType",
    "isOpened",
    "gateName",
    "gateType",
    "detectionTime",
    "confirmedTime",
    "originalPlate",
    "confirmedPlate",
    "image1",
    "image2",
    "image3",
    "plateImage"
  ];
  const fieldLength = {
    projectName: "120px",
    vehicleType: "120px",
    isOpened: "120px",
    gateName: "120px",
    gateType: "120px",
    originalPlate: "120px",
    confirmedPlate: "120px",
    detectionTime: "230px",
    confirmedTime: "230px",
    image1: "90px",
    image2: "90px",
    image3: "90px",
    plateImage: "90px"
  };
  const fieldHeight = {
    image1: "50px",
    image2: "50px",
    image3: "50px",
    plateImage: "50px",
    isOpened: "30px"
  }
  const [state, setState] = useState({
    curField: "projectName",
    val: ""
  });
  const [timeState, setTimeState] = useState({
    startTime: "",
    endTime: ""
  })
  const [curTimeState, setCurTimeState] = useState({
    startTime: "",
    endTime: ""
  })
  const [curState, setCurState] = useState({
    curField: "projectName",
    val: ""
  });
  const [dummy, setDummy] = useState(false);
  const [projects, setProjects] = useState([]);
  const reload = () =>{
    let filters = (timeState.startTime===""&&timeState.endTime==="")?{}:{
      detectionTime : timeState.startTime+'|'+timeState.endTime
    };
    console.log(filters);
    getMovementLogs(fields.concat("logID"), filters)
      .then(async (data) => {
        console.log(data.content.slice(0,6));
        setInitialRows(data.content);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("There was an error!", error);
      });
  }
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
  }, [initialRows, curState]);

  useEffect(()=>{
    reload();
  },[curTimeState]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    if(id==="curField"){
      setState((prevState) => ({
        curField: value,
        val: ""
      }));
    }else{
      setState((prevState) => ({
        ...prevState,
        [id]: value
      }));
    }
  };

  const handleTimeChange = (value, id) => {
    setTimeState((prevState)=>({
      ...prevState,
      [id]:value
    }));
  };

  const filter = (e) => {
    let { curField, val } = curState;
    let curRows = initialRows;
    setRows(
      curRows.filter(
        (row) =>
          row[curField].toLowerCase().indexOf(val.toLowerCase()) >= 0 
      ).sort(
        (a,b)=> (a.detectionTime < b.detectionTime) ? 1 : -1
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
    setCurTimeState({
      startTime: "",
      endTime: ""
    });
    setTimeState({
      startTime: "",
      endTime: ""
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
      <ImageModal
      src = {imageSrc}
      toggleModal={()=>{
        setImageSrc(null);
      }}
      />
      <div className="content">
      <Breadcrumb>
        <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
        <Breadcrumb.Item active>Entry Exit Records</Breadcrumb.Item>
      </Breadcrumb>
        <Form onSubmit={(e)=>{e.preventDefault();}}>
          <Row className="d-flex">
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
            <InputGroup style={{"background-color":"white"}}>
              <InputGroup.Addon>From</InputGroup.Addon>
              <DatePicker 
              format="YYYY-MM-DD HH:mm:ss" 
              block appearance="subtle"
              value={timeState.startTime}
              onChange={(val)=>{
                handleTimeChange(dateToString(val), "startTime");
                handleTimeChange(maxStr(dateToString(val),timeState.endTime), "endTime");
              }}
              ranges={[
                {
                  label: 'Now',
                  value: new Date()
                }
              ]}
              placeholder="YYYY-MM-DD HH:MM:SS"/>
              <InputGroup.Addon>To</InputGroup.Addon>
              <DatePicker 
              format="YYYY-MM-DD HH:mm:ss" 
              block appearance="subtle"
              value={timeState.endTime}
              onChange={(val)=>{
                handleTimeChange(dateToString(val), "endTime");
                handleTimeChange(minStr(dateToString(val),timeState.startTime), "startTime");
              }} 
              ranges={[
                {
                  label: 'Now',
                  value: new Date()
                }
              ]}
              placeholder="YYYY-MM-DD HH:MM:SS"/>
            </InputGroup>
            </Col>
            <div style={{"flex-grow":"1"}}></div>
            <Col sm="auto">
              <Button type="button" onClick={()=>{setCurState(state);setCurTimeState(timeState)}}>
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
        <TableContainer component={Paper} className="overflowTable scrollbar-grey">
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
                  <TableCell className="padding-0" component="th" scope="row" align="center">
                    {row.isOpened === true?
                    <UnlockFill color="#64D381" size={25} />:
                    <LockFill color="red" size={25} />}
            </TableCell>
                  <TableCell className="padding-0" component="th" scope="row" align="center">
                    {row.gateName}
                  </TableCell>
                  <TableCell className="padding-0" component="th" scope="row" align="center">
                    {row.gateType===null?null: (gateTypes[row.gateType]===undefined? null: gateTypes[row.gateType].name)}
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
                    {row.confirmedPlate===null?null:
                    <div className="outerPlate" >
                      <div className="innerPlate">
                        <u>{row.confirmedPlate}</u>
                      </div>
                    </div>}
                  </TableCell>
                  <TableCell className="padding-0" align="center">
                    <img 
                    className="imageClick"
                    onClick = {()=>setImageSrc(row.image1)} 
                    style={{"height":fieldHeight.image1}} 
                    src={row.image1}/>
                  </TableCell>
                  <TableCell className="padding-0" align="center">
                    <img 
                    className="imageClick"
                    onClick = {()=>setImageSrc(row.image2)} 
                    style={{"height":fieldHeight.image2}} 
                    src={row.image2} />
                  </TableCell>
                  <TableCell className="padding-0" align="center">
                    <img 
                    className="imageClick"
                    onClick = {()=>setImageSrc(row.image3)} 
                    style={{"height":fieldHeight.image3}} 
                    src={row.image3} />
                  </TableCell>
                  <TableCell className="padding-0" align="center">
                    <img 
                    className="imageClick"
                    onClick = {()=>setImageSrc(row.plateImage)} 
                    style={{"height":fieldHeight.plateImage}} 
                    src={row.plateImage} />
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

export default { Records };
