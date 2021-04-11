import { Card, Button, CardDeck } from "react-bootstrap";
import { useState, useEffect } from "react";
import { DevicesModal } from "../../components/index.js";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";

export function Devices(props) {
  let ID = props.ID;
  const [dummy, setDummy] = useState(false);
  const [gates, setGates] = useState([]);
  let cardMenu = [];
  useEffect(() => {
    /*
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: props.id
      })
    };
    
    fetch(server_URL + "/projectIdQuery", requestOptions)
    .then(async (response) => {
      const data = await response.json();
  
      // check for error response
      if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.message) || response.status;
        return Promise.reject(error);
      }
  
      initialRows = response.data;
    })
    .catch((error) => {
      this.setState({ errorMessage: error.toString() });
      console.error("There was an error!", error);
    });*/
    let res = [
      {
        id: "1",
        gateName: "Gate 1",
        gateType: "Entry"
      },
      {
        id: "2",
        gateName: "Gate 2",
        gateType: "Exit"
      },
      {
        id: "3",
        gateName: "Gate 3",
        gateType: "Entry"
      },
      {
        id: "4",
        gateName: "Gate 4",
        gateType: "Entry"
      },
      {
        id: "5",
        gateName: "Gate 5",
        gateType: "Entry"
      },
      {
        id: "6",
        gateName: "Gate 6",
        gateType: "Entry"
      },
      {
        id: "7",
        gateName: "Gate 7",
        gateType: "Entry"
      },
      {
        id: "8",
        gateName: "Gate 8",
        gateType: "Entry"
      }
    ];
    setGates(res);
  }, [dummy]);

  const handleAdd = () => {};

  const del = (id) => {};

  return (
    <div>
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
              <Card style={{ width: "1500px" }}>
                <div id="delGate">
                  <IconButton onClick={() => del(gates.id)}>
                    <HighlightOffIcon style={{ color: "#d32f2f" }} />
                  </IconButton>
                </div>
                <Card.Body>
                  <Card.Title>{gate.gateName}</Card.Title>
                  <Card.Img
                    variant="top"
                    src={
                      gate.gateType === "Entry"
                        ? require("../../assets/entry.jpg")
                        : require("../../assets/exit.png")
                    }
                  />
                </Card.Body>
                <Button variant="primary">Go somewhere</Button>
              </Card>
            ))}
          </CardDeck>
        </div>
      </div>
    </div>
  );
}

export default { Devices };
