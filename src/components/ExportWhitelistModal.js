import React from 'react'
import { func } from "prop-types";
import { useState, useEffect, useContext } from "react";
import { Form, Row, Col, Button, Modal, Spinner } from "react-bootstrap";
import { alertService, getAccessRule,  getWhitelistEntry } from '../services/index.js';
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";

const fileType = "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
const fileExtension = ".xlsx";
const exportToCSV = (apiData, fileName) => {
    console.log(apiData);
    const headers = [
        "Record ID",
        "Plate Number",
        "Project",
        "Access Rule",
        "Tag",
        "Start DateTime",
        "End DateTime"
    ];
    const ws = XLSX.utils.aoa_to_sheet([headers]);
    XLSX.utils.sheet_add_json(ws, apiData, {skipHeader: true,origin:1});
    const wscols = [
        {wch:10},  // recordID
        {wch:15},  //plateNumber
        {wch:15}, //project
        {wch:15}, //accessRule
        {wch:10}, //tag
        {wch:20}, //startDateTime
        {wch:20}  //endDateTime
    ];
    ws['!cols'] = wscols;
    let wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, "Whitelist");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: fileType });
    FileSaver.saveAs(data, fileName + fileExtension);
};

export function ExportWhitelistModal(props) {
    let {hide, projects, toggleModal, projectNames } = props;
    const [project, setProject] = useState(null);
    const [dummy, setDummy] = useState(false);
    const [accessRules, setAccessRules] = useState(null);
    const [loading, setLoading] = useState(false);

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

    const reloadAccessRules = () =>{
      getAccessRule(project,["accessRuleID","accessRuleName","projectID"])
      .then(async (data) => {
        func(data.content).then(async(list)=>{
            setAccessRules(await list);
          });
      })
      .catch((error) => {
        console.error("Get Access Rule, there was an error!", error);
      });
    }

    useEffect(()=>{
        reloadAccessRules();
    },[project]);

    const fetchData = () =>{
        setLoading(true);
        getWhitelistEntry(["recordID","plateNumber", "accessRuleID", "tag", "startDateTime","endDateTime"])
        .then(async (data) => {
            exportToCSV(
                data.content.filter((entry)=>
                    entry.accessRuleID !== null &&
                    accessRules[entry.accessRuleID] !== undefined
                ).map((entry)=>({
                    recordID: entry.recordID,
                    plateNumber: entry.plateNumber,
                    project: projectNames[accessRules[entry.accessRuleID].projectID],
                    accessRule: accessRules[entry.accessRuleID].accessRuleName,
                    tag: entry.tag,
                    startDateTime: entry.startDateTime,
                    endDateTime: entry.endDateTime
                }))
            ,"Whitelist");
            setLoading(false);
            toggleModal();
        })
        .catch((error) => {
        console.error("Get entry, there was an error!", error);
        });
      }

  return (
    <Modal show={hide} onHide={()=>{
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
                <Form.Label column sm={4}  align="right">
                    Project Name
                </Form.Label>
                <Col
                    sm={6}
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
                            <option value={row.projectID}>{row.projectName}</option>
                        ))}
                    </Form.Control>
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

export default { ExportWhitelistModal };
