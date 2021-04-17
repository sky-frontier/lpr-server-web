import { Card, Button, CardDeck, ButtonGroup } from "react-bootstrap";
import { useState, useEffect, useContext } from "react";
import { DeviceModal, GateModal } from "../../components/index.js";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { store } from "../../store.js";

export function Devices(props) {
  const storeContext = useContext(store);
  const globalState = storeContext.state;
  const server_URL = globalState.server_URL;
  let ID = parseInt(props.ID);
  const [dummy, setDummy] = useState(false);
  const [gates, setGates] = useState([]);
  const [curGate, setCurGate] = useState(null);
  const [info, setInfo] = useState({
    type: "gate",
    id: 2
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
      this.setState({ errorMessage: error.toString() });
      console.error("There was an error!", error);
    });
  }, [dummy]);

  const handleAdd = () => {
    const newGateReq = {
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
    })
    .catch((error) => {
      this.setState({ errorMessage: error.toString() });
      console.error("There was an error!", error);
    });
  };

  const del = (id) => {};

  return (
    <div>
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
          null
      )}
      </div>
      <div className="deviceContainter">
        <div id="gateHeader">
          <h4>Gates</h4>
        </div>
        <div id="addGate">
          <IconButton aria-label="add" onClick={handleAdd}>
            <AddIcon style={{ color: "#4caf50" }} />
          </IconButton>
        </div>
        <div className="deviceTab cardDiv align-items-center d-flex">
          <CardDeck>
            {gates.map((gate) => (
              <Card style={{ width: "200px" }}>
                <div id="delGate">
                  <IconButton onClick={() => del(gates.gateID)}>
                    <HighlightOffIcon style={{ color: "#d32f2f" }} />
                  </IconButton>
                </div>
                <Card.Body>
                  <Card.Title>{gate.gateName}</Card.Title>
                  <Card.Img
                    variant="top"
                    src={
                      gate.gateType === "Entry"
                        ? "../../assets/entry.jpg"
                        : "../../assets/exit.png"
                    }
                  />
                </Card.Body>
                <ButtonGroup>
                  <Button
                    variant="primary"
                    onClick={() => {
                      setCurGate(gate.gateID);
                    }}
                  >
                    Devices
                  </Button>
                  <Button
                    variant="warning"
                    onClick={() => {
                      setInfo({
                        type: "gate",
                        id: gate.gateID
                      });
                    }}
                  >
                    Info
                  </Button>
                </ButtonGroup>
              </Card>
            ))}
          </CardDeck>
        </div>
      </div>
      {curGate === null ? <div></div> : <div></div>}
    </div>
  );
}

export default { Devices };
