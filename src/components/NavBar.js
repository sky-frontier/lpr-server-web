import {
  SidebarContent,
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css";
import { List } from "react-bootstrap-icons";
import { Navbar, Nav, NavDropdown } from "react-bootstrap";
import { authActions } from "../store.js";
import InfoIcon from "@material-ui/icons/Info";
import HomeIcon from "@material-ui/icons/Home";
import StorageIcon from "@material-ui/icons/Storage";
import LocalParkingIcon from "@material-ui/icons/LocalParking";
import PaymentIcon from "@material-ui/icons/Payment";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import CachedIcon from "@material-ui/icons/Cached";
import ApartmentIcon from "@material-ui/icons/Apartment";
import FlipIcon from "@material-ui/icons/Flip";
import HistoryIcon from "@material-ui/icons/History";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { Button } from "@material-ui/core";
import { restartServer, alertService } from "../services/index.js";
import { getUniversalCookies } from "../services/cookies.js";
import { useDispatch, useSelector } from "react-redux/es/exports.js";
import { useHistory } from "react-router";

export function NavBar() {
  const dispatch = useDispatch();

  const user = getUniversalCookies().get("user").username;
  const toggled = useSelector((state) => state.auth.user.toggle);

  const history = useHistory();
  const logout = () => {
    getUniversalCookies().set(
      "user",
      { id: null, username: null, token: null },
      { path: "/", sameSite: "strict" }
    );
    dispatch(authActions.notAuthed());
    history.push("/");
  };
  const direct = (path) => {
    console.log("clicked", path);
    history.push(path);
  };
  const toggleSideBar = () => {
    dispatch(authActions.setToggled());
  };
  const restart = () => {
    restartServer()
      .then(async (data) => {
        alertService.success("Restarting Server...", { time: 5000 });
        setTimeout(() => {
          refreshPage();
        }, 5000);
      })
      .catch((error) => {
        alertService.error("There was an error!");
        console.error("Get Project, there was an error!", error);
      });
  };

  function refreshPage() {
    window.location.reload(false);
  }

  return (
    <div className="h-100 fixed-top clickThrough">
      <ProSidebar
        className="clickAble navbar-default navbar-static-top sideBar"
        collapsed={toggled}
        width="250px"
        //collapsedWidth="px"
      >
        <SidebarContent>
          <Menu iconShape="circle">
            <MenuItem
              style={{
                background: "#2c3b41",
                height: "60px",
                pointerEvents: "none",
              }}
              className="d-flex justify-content-center align-items-center"
            >
              <div style={{ paddingTop: "10px", color: "white" }}>
                <h5>Admin</h5>
              </div>
            </MenuItem>
            <MenuItem
              icon={<AccountCircleIcon fontSize="large" />}
              style={{
                pointerEvents: "none",
                borderBottom: "1px solid gray",
              }}
            >
              <div style={{ color: "white" }}>Welcome, {user}</div>
            </MenuItem>
            <MenuItem icon={<HomeIcon onClick={() => direct("/home")} />}>
              <div onClick={() => direct("/home")}>Home</div>
            </MenuItem>
            <MenuItem icon={<InfoIcon onClick={() => direct("/project")} />}>
              <div onClick={() => direct("/project")}>Project</div>
            </MenuItem>
            <SubMenu title="Plate Correction" icon={<FlipIcon />}>
              <MenuItem onClick={() => direct("/specialPlates")}>
                Special Plate Correction
              </MenuItem>
              <MenuItem onClick={() => direct("/regexPlates")}>
                Standard Plate Matching
              </MenuItem>
            </SubMenu>
            <MenuItem icon={<StorageIcon onClick={() => direct("/records")} />}>
              <div onClick={() => direct("/records")}>Exit/Entry Records</div>
            </MenuItem>
            <MenuItem
              icon={<LocalParkingIcon onClick={() => direct("/parking")} />}
            >
              <div onClick={() => direct("/parking")}>Parking Records</div>
            </MenuItem>
            <SubMenu title="Access" icon={<PaymentIcon />}>
              <MenuItem onClick={() => direct("/accessRules")}>
                Access Rules
              </MenuItem>
              <MenuItem onClick={() => direct("/whitelist")}>
                Whitelist Entries
              </MenuItem>
            </SubMenu>
            <MenuItem icon={<ApartmentIcon onClick={() => direct("/units")} />}>
              <div onClick={() => direct("/units")}>Units</div>
            </MenuItem>
            <MenuItem
              icon={<HistoryIcon onClick={() => direct("/DeviceHistory")} />}
            >
              <div onClick={() => direct("/DeviceHistory")}>Device History</div>
            </MenuItem>
          </Menu>
        </SidebarContent>
      </ProSidebar>
      <Navbar
        bg="light"
        variant="light"
        expand="lg"
        className={
          "clickAble navBar" +
          (toggled ? " navBar-collapsed" : " navBar-expand")
        }
      >
        <Navbar.Brand className="sideBar" onClick={toggleSideBar}>
          <List />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="nav-dropdown"
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto nav-dropdown">
            <Nav.Link>
              <div onClick={() => direct("/home")}>Home</div>
            </Nav.Link>
            <Nav.Link>
              <div onClick={() => direct("/project")}>Project</div>
            </Nav.Link>
            <Nav.Link>
              <div onClick={() => direct("/regex")}>Plate Regex</div>
            </Nav.Link>
            <Nav.Link>
              <div onClick={() => direct("/records")}>Exit/Entry Records</div>
            </Nav.Link>
            <Nav.Link>
              <div onClick={() => direct("/parking")}>Parking Records</div>
            </Nav.Link>
            <NavDropdown title="Access" id="basic-nav-dropdown">
              <NavDropdown.Item onClick={() => direct("/accessRules")}>
                Access Rules
              </NavDropdown.Item>
              <NavDropdown.Item onClick={() => direct("/whitelist")}>
                Whitelist Entries
              </NavDropdown.Item>
            </NavDropdown>
            <Nav.Link>
              <div onClick={() => direct("/units")}>Units</div>
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
        <Navbar.Collapse className="justify-content-end">
          <Button
            onClick={restart}
            style={{ marginRight: "10px" }}
            endIcon={<CachedIcon />}
          >
            Restart Server
          </Button>
          <Button
            onClick={logout}
            variant="outlined"
            endIcon={<ExitToAppIcon />}
          >
            Logout
          </Button>
        </Navbar.Collapse>
      </Navbar>
    </div>
  );
}

export default { NavBar };
