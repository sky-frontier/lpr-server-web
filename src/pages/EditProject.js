import {
  ProjectForm,
  BusinessDetails,
  Devices
} from "./projectSubPages/index.js";
import { Row, Col } from "react-bootstrap";
import Nav from "react-bootstrap/Nav";
import Tab from "react-bootstrap/Tab";
export function EditProject(props) {
  return (
    <div className="tabModal">
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row>
          <Col xs="auto">
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="first">Infomation</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Business</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="third">Devices</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="fourth">LED Config</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <ProjectForm ID={props.params.projectId} />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <BusinessDetails ID={props.params.projectId} />
              </Tab.Pane>
              <Tab.Pane eventKey="third">
                <Devices ID={props.params.projectId} />
              </Tab.Pane>
              <Tab.Pane eventKey="fourth">
                <div>Fourth</div>
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default { EditProject };
