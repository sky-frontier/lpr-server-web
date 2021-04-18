import { Card, Button, CardDeck, ButtonGroup, Modal } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { DeviceModal, GateModal } from "../../components/index.js";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { ConfirmModal, QueryModal } from "../../components/index.js";
import { store } from "../../store.js";
import { alertService } from '../../services/index.js';


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
  const storeContext = useContext(store);
  const globalState = storeContext.state;
  const server_URL = globalState.server_URL;
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
  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authID: "",
        serviceName: "getTable",
        content: {
          objName: "gate",
          columns: ["gateID", "gateName", "gateType"],
          filters:{
            projectID: ID
          }
        }
      })
    };
    
    fetch(server_URL, requestOptions)
    .then(async (response) => {
      const data = await response.json();
  
      // check for error response
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.content) || response.status;
        return Promise.reject(error);
      }
      setGates(data.content);
    })
    .catch((error) => {
      alertService.error("There was an error!" + error);
      console.error("There was an error!", error);
    });
  }, [dummy]);

  useEffect(() => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authID: "",
        serviceName: "getTable",
        content: {
          objName: "device",
          columns: ["deviceID", "deviceName", "deviceType", "deviceStatus"],
          filters:{
            gateID: curGate
          }
        }
      })
    };
    
    fetch(server_URL, requestOptions)
    .then(async (response) => {
      const data = await response.json();
  
      // check for error response
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.content) || response.status;
        return Promise.reject(error);
      }
      console.log(curGate);
      console.log(data.content);
      setDevices(data.content);
    })
    .catch((error) => {
      alertService.error("There was an error!" + error);
      console.error("There was an error!", error);
    });
  }, [curGate]);

  const handleAddGate = () => {
    const newGateReq = {
      projectID: ID,
      gateName: "Gate",
      gateType: "entry",
      isOpenForInvalid: false,
      isOpenForTemp: false,
      isChargeable: false,
      ledOnTime: "00:00:00",
      ledOffTime: "00:00:00"
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authID: "",
        serviceName: "createGate",
        content: newGateReq
      })
    };
    
    fetch(server_URL, requestOptions)
    .then(async (response) => {
      const data = await response.json();
  
      // check for error response
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      let newGate = {
        ...newGateReq,
        gateID: data.message.gateID
      }
      setGates((prevGates) => 
        prevGates.concat(newGate)
      );
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
    const newDeviceReq = {
      deviceID,
      gateID: 1
      deviceName: "Front Entry Camera",
      deviceType: "LPR camera",
      deviceCarpark: "Trevista Car Park",
      deviceStatus: "online",
      manufacturer: "example manufacturer",
      manufacturerCode: "xyz123",
      direction: "entry",
      isPrimaryDevice: true

    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        authID: "",
        serviceName: "createDevice",
        content: newDeviceReq
      })
    };
    
    fetch(server_URL, requestOptions)
    .then(async (response) => {
      const data = await response.json();
  
      // check for error response
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
      let newDevice = {
        ...newDeviceReq,
        gateID: data.message.gateID
      }
      setDevices((prevDevices) => 
        prevDevices.concat(newDevice)
      );
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
