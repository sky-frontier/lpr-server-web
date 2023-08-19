import {
  ProjectForm,
  BusinessDetails,
  Devices,
  LedConfig,
  Gates,
} from "./projectSubPages/index.js";
import { Row, Col } from "react-bootstrap";
import { Nav, Tab } from "react-bootstrap";
import {
  BrowserRouter as Router,
  Route,
  useHistory,
  useLocation,
  Redirect,
  Switch,
  useRouteMatch,
} from "react-router-dom";
import { Helmet } from "react-helmet";
export function EditProject(props) {
  let history = useHistory();
  let { path, url } = useRouteMatch();
  let { pathname } = useLocation();
  let page = pathname.split("/")[3];
  const direct = (path) => {
    history.push(url + path);
  };
  return (
    <div className="tabModal" style={{ background: "transparent" }}>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Projects</title>
      </Helmet>
      <Tab.Container id="left-tabs-example">
        <Row>
          <Col xs="auto">
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link
                  onClick={() => {
                    direct("/info");
                  }}
                  active={page === "info"}
                >
                  Infomation
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  onClick={() => {
                    direct("/business");
                  }}
                  active={page === "business"}
                >
                  Business
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  onClick={() => {
                    direct("/gate");
                  }}
                  active={page === "gate"}
                >
                  Gates
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link
                  onClick={() => {
                    direct("/ledconfig");
                  }}
                  active={page === "ledconfig"}
                >
                  LED Config
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={9}>
            <Switch>
              <Route exact path={`${path}/info`}>
                <ProjectForm />
              </Route>
              <Route exact path={`${path}/business`}>
                <BusinessDetails />
              </Route>
              <Route exact path={`${path}/gate/:gateID`}>
                <Devices />
              </Route>
              <Route exact path={`${path}/gate`}>
                <Gates />
              </Route>
              <Route exact path={`${path}/ledconfig`}>
                <LedConfig />
              </Route>
              <Route path={path}>
                <Redirect to={`${url}/info`} />
              </Route>
            </Switch>
          </Col>
        </Row>
      </Tab.Container>
    </div>
  );
}

export default { EditProject };
