import React from 'react'
import { func } from "prop-types";
import { useState, useEffect, useContext } from "react";
import { Form, Row, Col, Button, Modal, Spinner } from "react-bootstrap";
import { alertService,  getMovementLogs,getProjects } from '../services/index.js';

import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

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

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";
const exportToCSV = (apiData, fileName) => {
    console.log(apiData);
    const headers = [
        "Project",
        "Vehicle Type",
        "Open",
        "Gate Name",
        "Gate Type",
        "Detection Time",
        "Confirmed Time",
        "Original Plate",
        "Actual Plate",
        "Image",
        "Plate Image"
    ];
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    XLSX.utils.sheet_add_json(ws, apiData, {skipHeader: true,origin:1});
    const wscols = [
        {wch:15},  // Project
        {wch:15},  //Vehicle Type
        {wch:10}, //Open
        {wch:15}, //Gate Name
        {wch:10}, //Gate Type
        {wch:20}, //Detection Time
        {wch:20}, //Confirmed Time
        {wch:15}, //Original Plate
        {wch:15}, //Actual Plate
        {wch:15}, //Image
        {wch:15} //Plate Image
    ];
    ws['!cols'] = wscols;
    let wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Records");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
};

export function ExportRecordModal(props) {
    let {hide, toggleModal } = props;
    const [project, setProject] = useState(null);
    const [dummy, setDummy] = useState(false);
    const [loading, setLoading] = useState(false);
    const [timeState, setTimeState] = useState({
      startTime: "",
      endTime: ""
    });
    const [projects,setProjects] = useState([]);

    useEffect(()=>{
        getProjects(["projectName"])
        .then(async (data) => {
            setProjects(data.content);
        })
        .catch((error) => {
            console.error("There was an error!", error);
        });
    });
    
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
        "plateImage"
    ];

    const func = async (val) =>{
        let temp = {};
        val.forEach(async (element)=>{
            temp[element["accessRuleID"]] = {
                accessRuleName: element["accessRuleName"],
                projectID: element["projectID"]
            };
        });
        return await temp;
    };

    const fetchData = () =>{
        setLoading(true);
        let filters = (timeState.startTime===""&&timeState.endTime==="")?
        {}:{
            detectionTime : timeState.startTime+'|'+timeState.endTime
        };
        if (project!==null)filters["projectName"] = project;
        getMovementLogs(fields, filters)
        .then(async (data) => {
            setLoading(false);
            exportToCSV(data.content,"Records");
            toggleModal();
        })
        .catch((error) => {
            alertService.error("There was an error!");
            console.error("There was an error!", error);
        });
    }
      
  const handleTimeChange = (value, id) => {
    setTimeState((prevState)=>({
      ...prevState,
      [id]:value
    }));
  };

  return (
    <Modal show={hide} size="lg" onHide={()=>{
    toggleModal();}}>
        <Modal.Header
            closeButton>
            <Modal.Title>Export Whitelist Entries</Modal.Title>
        </Modal.Header>
          <div className={"loadingModal"+(loading?"":" invisible")}>
            <Spinner animation="border" role="status">
              <span className="sr-only">Loading...</span>
            </Spinner>
          </div>
        <Modal.Body>
        <Form>
            <div>
                <Form.Group as={Row}>
                <Form.Label column sm={3}  align="right">
                    Project Name
                </Form.Label>
                <Col
                    sm={8}
                    className="align-items-center d-flex justify-content-center"
                >
                    <Form.Control
                        custom
                        required
                        as="select"
                        id="project"
                        name="project"
                        value={project}
                        onChange={(e)=>{
                            setProject(e.target.value);
                        }}
                        >
                        <option value={null}>All Projects</option>
                        {projects.map((row)=>(
                            <option value={row.projectName}>{row.projectName}</option>
                        ))}
                    </Form.Control>
                </Col>
                </Form.Group>
                <Form.Group as={Row}>
                <Form.Label column sm={3}  align="right">
                    Detection Time
                </Form.Label>
                <Col sm={8}
                    className="align-items-center d-flex justify-content-center">
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
                </Form.Group>
            </div>
        </Form>
        </Modal.Body>
    <Modal.Footer>
        <Button variant="secondary" onClick={()=>{
    toggleModal();}}>
        Cancel
        </Button>
        <Button 
        onClick={()=>{
            fetchData();
        }} 
        variant="primary">
        Download
        </Button>
    </Modal.Footer>
    </Modal>
  );
}

export default { ExportRecordModal };
