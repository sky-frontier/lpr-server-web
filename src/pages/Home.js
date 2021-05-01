import React, { useState, useContext, useEffect } from "react";
import {Jumbotron, Row, Col, Card } from 'react-bootstrap';
import {getAllDevice, getObjectTypes, alertService, getGateInfo, getNewDevices} from '../services/index.js';
import {IconButton, Typography  , TableFooter, TablePagination, TableContainer, TableCell, TableBody, Table, TableHead, TableRow, Paper, CardActions } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import { TablePaginationActions , DeviceModal} from "../components/index.js";
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import BuildIcon from '@material-ui/icons/Build';
import { Directions } from "@material-ui/icons";
import { useHistory } from "react-router";


export function Home() {
  const [rows, setRows] = useState([]);
  const [dummy, setDummy] = useState(null);
  const [devices, setDevices] = useState([]);
  const [newDevices, setNewDevices] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [deviceTypeNames, setDeviceTypeNames] = useState({});
  const [curID, setCurID] = useState(null);
  const [toggle, setToggle] = useState({
    edit: false
  });
  let history = useHistory();

  const reload = () =>{
    getAllDevice(["deviceID", "deviceName", "deviceType","deviceStatus", "gateID"])
    .then(async (data) => {
      setDevices(data.content.filter((device)=>device.deviceStatus!=="online"&&device.gateID !== null));
    })
    .catch((error) => {
      alertService.error("There was an error!");
      console.error("Get All Device, there was an error!", error);
    });
    getNewDevices()
    .then(async (data) => {
      setNewDevices(data.message);
    })
    .catch((error) => {
      alertService.error("There was an error!");
      console.error("Get All Device, there was an error!", error);
    });
  }

  useEffect(()=>{
    reload();
    getObjectTypes("device")
    .then(async (data) => {
      setDeviceTypeNames(data.message);
      setDeviceTypes(Object.entries(data.message).map((type)=>({
        id: type[0],
        name: type[1].name
      })));
    })
    .catch((error) => {
      alertService.error("There was an error!");
      console.error("There was an error Get Device Types!", error);
    });
  }, [dummy]);

  const direct = (gateID) =>{
    getGateInfo(gateID)
    .then(async (data) => {
      let projectID = data.message.projectID;
      history.push('/project/'+String(projectID)+'/gate/'+String(gateID));
    })
    .catch((error) => {
      alertService.error("There was an error!");
      console.error("Get Gate Info, there was an error!", error);
    });
  }

  const toggleModal = (modal) => {
    let prevVal = toggle[modal];
    setToggle((prevState) => ({
      ...prevState,
      [modal]: !prevVal
    }));
  };

  return (
  <div>
    <DeviceModal
      deviceTypes = {deviceTypes}
      hide={toggle.edit}
      gateID = {null}
      deviceID = {curID}
      success={() => {
          reload();
          toggleModal("edit");
      }}
      toggleModal={() => {
        toggleModal("edit");
      }}
    />
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
    <Col sm={4}>
          <Card style={{height:"465px"}}>
          <Typography className="cardTitle" variant="h6" component="h2">
            New Devices
          </Typography>
          <TableContainer component={Paper} className="scrollbar-grey" style={{"box-shadow":"none"}}>
            <Table aria-label="simple table">
              <TableHead >
                <TableRow>
                  <TableCell align="left"><b>ID</b></TableCell>
                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {newDevices.map((row, index) => (
                  <TableRow key={row.deviceID}>
                  <TableCell align="left">{row.deviceID}</TableCell>
                  <TableCell align="right">
                      <IconButton style={{padding:0}}
                      onClick={() => {
                          setCurID(row.deviceID);
                          toggleModal("edit");
                      }}>
                        <BuildIcon
                        />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </Card>
        </Col>
        <Col sm={8}>
          <Card style={{height:"465px"}} >
          <Typography className="cardTitle" variant="h6" component="h2">
             Disconnected Devices
          </Typography>
          <TableContainer component={Paper} className="scrollbar-grey" style={{"box-shadow":"none"}}>
            <Table stickyHeader aria-label="simple table">
              <TableHead >
                <TableRow>
                  <TableCell align="left"><b>ID</b></TableCell>
                  <TableCell align="left"><b>Name</b></TableCell>
                  <TableCell align="left"><b>Type</b></TableCell>
                  <TableCell align="left"></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {devices.map((row, index) => (
                  <TableRow key={row.deviceID}>
                  <TableCell align="left">{row.deviceID}</TableCell>
                    <TableCell align="left">{row.deviceName}</TableCell>
                    <TableCell align="left">{deviceTypeNames[row.deviceType]===undefined ? row.deviceType : deviceTypeNames[row.deviceType].name}</TableCell>
                    <TableCell align="right">
                      <IconButton style={{padding:0}}
                      onClick={() => {
                          direct(row.gateID);
                      }}>
                        <OpenInNewIcon
                        />
                      </IconButton>
                    </TableCell>
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
