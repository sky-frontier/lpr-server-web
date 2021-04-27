import React, { useState, useContext, useEffect } from "react";
import {Jumbotron, Row, Col, Card } from 'react-bootstrap';
import {getAllDevice, getObjectTypes, alertService} from '../services/index.js';
import {Typography  , TableFooter, TablePagination, TableContainer, TableCell, TableBody, Table, TableHead, TableRow, Paper, CardActions } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { TablePaginationActions } from "../components/index.js";

export function Home() {
  const [rows, setRows] = useState([]);
  const [dummy, setDummy] = useState(null);
  const [devices, setDevices] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  useEffect(()=>{
    getAllDevice(["deviceID", "deviceName", "deviceType","deviceStatus"])
    .then(async (data) => {
      setDevices(data.content.filter((device)=>device.deviceType!=="online"));
    })
    .catch((error) => {
      alertService.error("There was an error!");
      console.error("Get All Device, there was an error!", error);
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

  return (
  <div>
    <Jumbotron className="dashboard">
      <Row>
        <Col sm={3}>
          <Card>            
            <p className="cardHomeText">
            <div className="cardIconDiv success">
              <span className="cardIcon">
              <InfoOutlinedIcon fontSize='large' style={{color:"white"}}/>
              </span>
            </div>
              Sample
              <h3 className="cardHomeNumber" >
                ~
              </h3>
          </p>
          </Card>
        </Col>
        <Col sm={3}>
          <Card>            
            <p className="cardHomeText">
            <div className="cardIconDiv warning">
              <span className="cardIcon">
              <InfoOutlinedIcon fontSize='large' style={{color:"white"}}/>
              </span>
            </div>
              Sample
              <h3 className="cardHomeNumber" >
              ~
              </h3>
          </p>
          </Card>
        </Col>
        <Col sm={3}>
          <Card>            
            <p className="cardHomeText">
            <div className="cardIconDiv info">
              <span className="cardIcon">
              <InfoOutlinedIcon fontSize='large' style={{color:"white"}}/>
              </span>
            </div>
              Sample
              <h3 className="cardHomeNumber" >
              ~
              </h3>
          </p>
          </Card>
        </Col>
        <Col sm={3}>
          <Card>            
            <p className="cardHomeText">
            <div className="cardIconDiv danger">
              <span className="cardIcon">
              <InfoOutlinedIcon fontSize='large' style={{color:"white"}}/>
              </span>
            </div>
              Disconnected Devices
              <h3 className="cardHomeNumber" style={{color:"#ef5350"}}>
                {devices.length}
              </h3>
          </p>
          </Card>
        </Col>
      </Row>
    </Jumbotron>
    <div className="content">
    <Row>
        <Col sm={8}>
          <Card>
          <Typography className="cardTitle" variant="h6" component="h2">
            Disconnected Devices
          </Typography>
          <TableContainer component={Paper}>
            <Table aria-label="simple table">
              <TableHead >
                <TableRow>
                  <TableCell align="left"><b>ID</b></TableCell>
                  <TableCell align="left"><b>Name</b></TableCell>
                  <TableCell align="left"><b>Type</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices.map((row, index) => (
                  <TableRow key={row.deviceID}>
                  <TableCell align="left">{row.deviceID}</TableCell>
                    <TableCell align="left">{row.deviceName}</TableCell>
                    <TableCell align="left">{deviceTypes[row.deviceType]===undefined ? row.deviceType : deviceTypes[row.deviceType].name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </Card>
        </Col>
      </Row>
      </div>
  </div>
  );
}

export default { Home };
