import { Card, Button, CardDeck, ButtonGroup, Modal, Breadcrumb } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { DeviceModal, GateModal } from "../../components/index.js";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { ConfirmModal, QueryModal } from "../../components/index.js";
import { alertService, getDevice, getGate, createGate, createDevice } from '../../services/index.js';


import entry from '../../assets/entry.jpg';
import exit from '../../assets/exit.png';
import sample from '../../assets/sample.svg';

function image(value){
  switch(value){
    case "entry":
      return entry;
    case "exit":
      return exit;
    default:
      return sample;
  }
  return entry;
}

export function Devices(props) {
  let ID = parseInt(props.ID);
  const [dummy, setDummy] = useState(false);
  const [gates, setGates] = useState([]);
  const [devices, setDevices] = useState([]);
  const [curGate, setCurGate] = useState(null);
  const [curID,setCurId] = useState(null);
  const [toggle, setToggle] = useState({
    addGate: false,
    delGate: false,
    addDevice: false,
    delDevice: false
  });
  const [info, setInfo] = useState({
    type: null,
    id: null
  });
  let cardMenu = [];

  const reloadGates = () =>{
    getGate(ID, ["gateID", "gateName", "gateType"])
    .then(async (data) => {
      setGates(data.content);
    })
    .catch((error) => {
      alertService.error("There was an error!" + error);
      console.error("There was an error!", error);
    });
  }

  useEffect(() => {
    reloadGates();
  }, [dummy]);

  const reloadDevices = () =>{
    getDevice(curGate,["deviceID", "deviceName", "deviceType", "deviceStatus"])
    .then(async (data) => {
      console.log(curGate);
      console.log(data.content);
      setDevices(data.content);
    })
    .catch((error) => {
      alertService.error("There was an error!" + error);
      console.error("There was an error!", error);
    });
  }

  useEffect(() => {
    reloadDevices();
  }, [curGate]);

  const handleAddGate = () => {    
    createGate(ID)
    .then(async (data) => {
      reloadGates();
      setCurGate(data.message.gateID);
      alertService.success("Gate Added");
    })
    .catch((error) => {
      alertService.error("There was an error!" + error);
      console.error("There was an error!", error);
    });
  };

  const handleAddDevice = (deviceID) => {
    console.log("adding",deviceID);
    /*    
    createDevice(curGate, deviceID)
    .then(async (data) => {
      reloadDevices();
      alertService.success("Device Added"");
    })
    .catch((error) => {
        alertService.error("There was an error!" + error);
      console.error("There was an error!", error);
    });*/
  };

  const delGate = (id) => {console.log("deleting",id)};

  const delDevice = (id) => {console.log("deleting",id)};

  const toggleModal = (modal) => {
    let prevVal = toggle[modal];
    setToggle((prevState) => ({
      ...prevState,
      [modal]: !prevVal
    }));
  };

  return (
    <div>
      <ConfirmModal
        hide={toggle.delGate}
        success={() => {
          delGate(curID);
        }}
        toggleModal={() => {
          toggleModal("delGate");
        }}
        title="Confirm Deletion"
        body="Delete this gate?"
      />
      <ConfirmModal
        hide={toggle.addGate}
        success={() => {
          handleAddGate();
        }}
        toggleModal={() => {
          toggleModal("addGate");
        }}
        title="Confirm Addition"
        body="Add a new gate?"
      />
      <ConfirmModal
        hide={toggle.delDevice}
        success={() => {
          delDevice(curID);
        }}
        toggleModal={() => {
          toggleModal("delDevice");
        }}
        title="Confirm Deletion"
        body="Delete this device?"
      />
      <QueryModal
        hide={toggle.addDevice}
        success={handleAddDevice}
        toggleModal={() => {
          toggleModal("addDevice");
        }}
        title="Confirm Addition"
        body="Enter Device ID"
      />
      
      <Breadcrumb>
        <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/project">Projects</Breadcrumb.Item>
        <Breadcrumb.Item active>Devices</Breadcrumb.Item>
      </Breadcrumb>
      <div>
      {info.type === null? null:(
        info.type === "gate"? 
        <GateModal 
        id={info.id}
        toggleModal={
          ()=>setInfo({
            type: null,
            id: null
          })}
          />
          :
          <DeviceModal 
        id={info.id}
        toggleModal={
          ()=>setInfo({
            type: null,
            id: null
          })}
          />
      )}
      </div>
      <div className="gateContainer">
        <div id="gateHeader">
          <div className = "navbar-brand">Gates</div>
        </div>
        <div id="addGate">
          <IconButton aria-label="add" onClick={()=> toggleModal("addGate")}>
            <AddIcon style={{ color: "#4caf50" }} />
          </IconButton>
        </div>
        <div className="deviceTab cardDiv scrollbar scrollbar-primary align-items-center d-flex">
          <CardDeck>
            {gates.map((gate) => (
              <Card className = "deviceCard">
                <div id="delGate">
                  <IconButton onClick={() => {
                    setCurId(gate.gateID);
                    toggleModal("delGate");
                  }}>
                    <HighlightOffIcon style={{ color: "#d32f2f" }} />
                  </IconButton>
                </div>
                <Card.Body>
                  <Card.Text>{gate.gateName}</Card.Text>
                  <Card.Img
                    className = "cardImg primary-transform"
                    variant="top"
                    src={image(gate.gateType)}
                  />
                  <Button
                    variant="primary"
                    className = "cardButton"
                    onClick={() => {
                      setInfo({
                        type: "gate",
                        id: gate.gateID
                      });
                      setCurGate(gate.gateID);
                    }}
                  >
                    Devices
                  </Button>
                </Card.Body>
              </Card>
            ))}
          </CardDeck>
        </div>
      </div>
      {curGate === null ? null : 
      <div className="deviceContainter">
        <div id="gateHeader">
        <div className = "navbar-brand">Devices</div>
        </div>
        <div id="addGate">
          <IconButton aria-label="add" onClick={()=>toggleModal("addDevice")}>
            <AddIcon style={{ color: "#4caf50" }} />
          </IconButton>
        </div>
        <div className="deviceTab cardDiv scrollbar scrollbar-primary align-items-center d-flex">
          <CardDeck>
            {devices.map((device) => (
              <Card className = "deviceCard">
                <div id="delGate">
                  <IconButton onClick={() => {
                    setCurId(device.deviceID);
                    toggleModal("delDevice");
                  }}>
                    <HighlightOffIcon style={{ color: "#d32f2f" }} />
                  </IconButton>
                </div>
                <Card.Body>
                  <Card.Text>{device.deviceName}</Card.Text>
                  <Card.Img
                    style = {{cursor: "pointer"}}
                    className = {"cardImg" + device.deviceStatus === "Offline"? " primary-transform": ""}
                    variant="top"
                    src={image(device.deviceType)}
                    onClick={() => {
                      setInfo({
                        type: "device",
                        id: device.deviceID
                      });
                    }}
                  />
                </Card.Body>
              </Card>
            ))}
          </CardDeck>
        </div>
      </div>
      }
    </div>
  );
}

export default { Devices };
