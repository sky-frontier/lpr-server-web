import React, { useState, useEffect } from "react";
import { Jumbotron, Row, Col, Card } from "react-bootstrap";
import {
  delDevice,
  getAllDevice,
  getObjectTypes,
  alertService,
  getGateInfo,
  getNewDevices,
} from "../services/index.js";
import {
  IconButton,
  Typography,
  TableContainer,
  TableCell,
  TableBody,
  Table,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import InfoOutlinedIcon from "@material-ui/icons/InfoOutlined";
import { DeviceModal, ConfirmModal } from "../components/index.js";
import OpenInNewIcon from "@material-ui/icons/OpenInNew";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import BuildIcon from "@material-ui/icons/Build";
import { Helmet } from "react-helmet";
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
    edit: false,
    delete: false,
  });
  let history = useHistory();

  const reload = () => {
    getAllDevice([
      "deviceID",
      "deviceName",
      "deviceType",
      "deviceStatus",
      "gateID",
      "deviceIP",
    ])
      .then(async (data) => {
        setDevices(
          data.content.filter(
            (device) =>
              device.deviceStatus !== "online" && device.gateID !== null
          )
        );
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
  };

  useEffect(() => {
    reload();
    getObjectTypes("device")
      .then(async (data) => {
        setDeviceTypeNames(data.message);
        setDeviceTypes(
          Object.entries(data.message).map((type) => ({
            id: type[0],
            name: type[1].name,
          }))
        );
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("There was an error Get Device Types!", error);
      });
  }, [dummy]);

  const direct = (gateID) => {
    getGateInfo(gateID)
      .then(async (data) => {
        let projectID = data.message.projectID;
        history.push(
          "/project/" + String(projectID) + "/gate/" + String(gateID)
        );
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Get Gate Info, there was an error!", error);
      });
  };

  const toggleModal = (modal) => {
    let prevVal = toggle[modal];
    setToggle((prevState) => ({
      ...prevState,
      [modal]: !prevVal,
    }));
  };

  const del = async (deviceID) => {
    delDevice(deviceID)
      .then(async (data) => {
        reload();
        toggleModal("delete");
        alertService.success("Device Deleted");
      })
      .catch((error) => {
        console.error("Delete Device, There was an error!", error);
      });
  };

  return (
    <div>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Home</title>
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
        body="Delete this device?"
      />
      <DeviceModal
        deviceTypes={deviceTypes}
        hide={toggle.edit}
        gateID={null}
        deviceID={curID}
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
              <div className="cardHomeText">
                <div className="cardIconDiv success">
                  <span className="cardIcon">
                    <InfoOutlinedIcon
                      fontSize="large"
                      style={{ color: "white" }}
                    />
                  </span>
                </div>
                Sample
                <h3 className="cardHomeNumber" style={{ color: "#66bb6a" }}>
                  ~
                </h3>
              </div>
            </Card>
          </Col>
          <Col sm={3}>
            <Card>
              <div className="cardHomeText">
                <div className="cardIconDiv warning">
                  <span className="cardIcon">
                    <InfoOutlinedIcon
                      fontSize="large"
                      style={{ color: "white" }}
                    />
                  </span>
                </div>
                Sample
                <h3 className="cardHomeNumber" style={{ color: "#ffa726" }}>
                  ~
                </h3>
              </div>
            </Card>
          </Col>
          <Col sm={3}>
            <Card>
              <div className="cardHomeText">
                <div className="cardIconDiv info">
                  <span className="cardIcon">
                    <InfoOutlinedIcon
                      fontSize="large"
                      style={{ color: "white" }}
                    />
                  </span>
                </div>
                New Devices
                <h3 className="cardHomeNumber" style={{ color: "#26c6da" }}>
                  {newDevices.length}
                </h3>
              </div>
            </Card>
          </Col>
          <Col sm={3}>
            <Card>
              <div className="cardHomeText">
                <div className="cardIconDiv danger">
                  <span className="cardIcon">
                    <InfoOutlinedIcon
                      fontSize="large"
                      style={{ color: "white" }}
                    />
                  </span>
                </div>
                Disconnected Devices
                <h3 className="cardHomeNumber" style={{ color: "#ef5350" }}>
                  {devices.length}
                </h3>
              </div>
            </Card>
          </Col>
        </Row>
      </Jumbotron>
      <div className="content">
        <Row>
          <Col sm={4}>
            <Card style={{ height: "465px" }}>
              <Typography className="cardTitle" variant="h6" component="h2">
                New Devices
              </Typography>
              <TableContainer
                component={Paper}
                className="scrollbar-grey"
                style={{ boxShadow: "none" }}
              >
                <Table stickyHeader aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">
                        <b>ID</b>
                      </TableCell>
                      <TableCell align="left">
                        <b>IP</b>
                      </TableCell>
                      <TableCell align="left"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {newDevices.length > 0 ? (
                      newDevices.map((row, index) => (
                        <TableRow key={row.deviceID}>
                          <TableCell align="left">{row.deviceID}</TableCell>
                          <TableCell align="left">
                            {row.deviceIP == "" || row.deviceIP == null
                              ? "-"
                              : row.deviceIP}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              style={{ padding: 0 }}
                              onClick={() => {
                                setCurID(row.deviceID);
                                toggleModal("edit");
                              }}
                            >
                              <BuildIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell align="center" colSpan={3}>
                          No New Devices
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </Card>
          </Col>
          <Col sm={8}>
            <Card style={{ height: "465px" }}>
              <Typography className="cardTitle" variant="h6" component="h2">
                Disconnected Devices
              </Typography>
              <TableContainer
                component={Paper}
                className="scrollbar-grey"
                style={{ boxShadow: "none" }}
              >
                <Table stickyHeader aria-label="simple table">
                  <TableHead>
                    <TableRow>
                      <TableCell align="left">
                        <b>ID</b>
                      </TableCell>
                      <TableCell align="left">
                        <b>Name</b>
                      </TableCell>
                      <TableCell align="left">
                        <b>Type</b>
                      </TableCell>
                      <TableCell align="left">
                        <b>IP</b>
                      </TableCell>
                      <TableCell align="left"></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {devices.length > 0 ? (
                      devices.map((row, index) => (
                        <TableRow key={row.deviceID}>
                          <TableCell align="left">{row.deviceID}</TableCell>
                          <TableCell align="left">{row.deviceName}</TableCell>
                          <TableCell align="left">
                            {row.deviceType === null
                              ? null
                              : deviceTypeNames[row.deviceType] === undefined
                              ? row.deviceType
                              : deviceTypeNames[row.deviceType].name}
                          </TableCell>
                          <TableCell align="left">
                            {row.deviceIP == "" || row.deviceIP == null
                              ? "-"
                              : row.deviceIP}
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              style={{ padding: 5 }}
                              onClick={() => {
                                direct(row.gateID);
                              }}
                            >
                              <OpenInNewIcon />
                            </IconButton>
                            <IconButton
                              style={{ padding: 5 }}
                              onClick={() => {
                                setCurID(row.deviceID);
                                toggleModal("delete");
                              }}
                            >
                              <DeleteOutlineIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell align="center" colSpan={5}>
                          No Disconnected Devices
                        </TableCell>
                      </TableRow>
                    )}
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
