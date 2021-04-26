import React, { useState, useContext } from "react";
import {Jumbotron, Row, Col, Card } from 'react-bootstrap';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';

export function Home() {
  const [rows, setRows] = useState([]);
  return (
  <div>
    <Jumbotron className="dashboard">
      <Row>
        <Col sm={3}>
          <Card>            
            <p className="cardHomeText">
            <div className="cardIconDiv successCardIcon">
              <span className="cardIcon">
              <InfoOutlinedIcon fontSize='large' style={{color:"white"}}/>
              </span>
            </div>
              Sample
              <h3 className="cardHomeNumber" >
                23
              </h3>
          </p>
          </Card>
        </Col>
        <Col sm={3}>
          <Card>            
            <p className="cardHomeText">
            <div className="cardIconDiv warningCardIcon">
              <span className="cardIcon">
              <InfoOutlinedIcon fontSize='large' style={{color:"white"}}/>
              </span>
            </div>
              Sample
              <h3 className="cardHomeNumber" >
                23
              </h3>
          </p>
          </Card>
        </Col>
        <Col sm={3}>
          <Card>            
            <p className="cardHomeText">
            <div className="cardIconDiv infoCardIcon">
              <span className="cardIcon">
              <InfoOutlinedIcon fontSize='large' style={{color:"white"}}/>
              </span>
            </div>
              Sample
              <h3 className="cardHomeNumber" >
                23
              </h3>
          </p>
          </Card>
        </Col>
        <Col sm={3}>
          <Card>            
            <p className="cardHomeText">
            <div className="cardIconDiv dangerCardIcon">
              <span className="cardIcon">
              <InfoOutlinedIcon fontSize='large' style={{color:"white"}}/>
              </span>
            </div>
              Disconnected Devices
              <h3 className="cardHomeNumber" style={{color:"#ef5350"}}>
                75
              </h3>
          </p>
          </Card>
        </Col>
      </Row>
    </Jumbotron>
    <div className="content">
    <Row>
        <Col sm={6}>
          <Card>
            <div 
            style={{padding:"100px 0px"}}
            className="d-flex justify-content-center align-items-center">
              Device Disconnection Table Here
            </div>
          </Card>
        </Col>
      </Row>
      </div>
  </div>
  );
}

export default { Home };
