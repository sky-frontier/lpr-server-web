import React, { useState, useContext, useEffect } from "react";
import { Form, Row, Col, Button, Breadcrumb } from "react-bootstrap";
import {Tooltip, TableFooter, TablePagination, TableContainer, TableCell, TableBody, Table, IconButton, TableHead, TableRow, Paper } from '@material-ui/core';
import { PencilSquare, Trash, Cpu } from "react-bootstrap-icons";

import { useHistory, useParams, useLocation } from "react-router-dom";
import { ConfirmModal, GateModal, TablePaginationActions } from "../../components/index.js";
import {getGate, alertService, delGate} from '../../services/index.js';
import { Directions } from "@material-ui/icons";

export function Gates (){
    let { projectID }= useParams();
    let history = useHistory();
    let {pathname} = useLocation();
  const [rows, setRows] = useState([]);
  const [toggle, setToggle] = useState({
    delete: false,
    edit: false
  });
  const [modal, setModal] = useState(true);
  const [curID, setCurID] = useState("");
  const [dummy, setDummy] = useState(false);
  const reload = () =>{
    getGate(projectID, ["gateID", "gateName", "gateType"])
      .then(async (data) => {
        console.log(data.content);
        setRows(data.content);
      })
      .catch((error) => {
        console.error("Get Gate, there was an error!", error);
      });
  }
  useEffect(() => {
    reload();
  }, [dummy]);

  const toggleModal = (modal) => {
    let prevVal = toggle[modal];
    setToggle((prevState) => ({
      ...prevState,
      [modal]: !prevVal
    }));
  };

  const devices = (gateID) => {
    history.push(pathname +"/"+ String(gateID));
  };

  const del = async (gateID) => {
    delGate(gateID)
    .then(async (data) => {
      reload();
      toggleModal("delete");
      alertService.success("Gate Deleted");
    })
    .catch((error) => {
      console.error("Delete Gate, There was an error!", error);
    });
  };

  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <ConfirmModal
        hide={toggle.delete}
        success={() => {
          del(curID);
        }}
        toggleModal={() => {
          toggleModal("delete");
        }}
        title="Confirm Deletion"
        body="Delete this gate?"
      />
      <GateModal
        hide={toggle.edit}
        gateID = {curID}
        newState = {modal}
        projectID = {projectID}
        success={() => {
            reload();
            toggleModal("edit");
        }}
        toggleModal={() => {
          toggleModal("edit");
        }}
      />

      <div className="content">
      <Breadcrumb>
        <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/project">Projects</Breadcrumb.Item>
        <Breadcrumb.Item active>Gates</Breadcrumb.Item>
      </Breadcrumb>
        <Form inline className="rightFlex" onSubmit={(e)=>{e.preventDefault();}}>
          <Row>
            <Col sm="auto">
              <Button
                className="btn btn-success"
                type="button"
                onClick={() => {
                    setModal(true);
                  toggleModal("edit");
                }}
              >
                + Add
              </Button>
            </Col>
          </Row>
        </Form>
      </div>
      <div className="content">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead >
              <TableRow>
                <TableCell align="left"><b>ID</b></TableCell>
                <TableCell align="center"><b>Name</b></TableCell>
                <TableCell align="center"><b>Type</b></TableCell>
                <TableCell align="right"><b>Actions</b></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows).map((row, index) => (
                <TableRow key={row.gateName}>
                <TableCell align="left">{row.gateID}</TableCell>
                  <TableCell align="center">{row.gateName}</TableCell>
                  <TableCell align="center">{row.gateType}</TableCell>
                  <TableCell align="right" style={{padding:0}}>
                  <Tooltip title="Devices">
                    <IconButton onClick={() => {
                        devices(row.gateID);
                    }}>
                      <Cpu
                        size={21}
                        color="royalblue"
                      />
                    </IconButton>
                    </Tooltip>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => {
                        setCurID(row.gateID);
                        setModal(false);
                        toggleModal("edit");
                    }}>
                      <PencilSquare
                        size={21}
                        color="gold"
                      />
                    </IconButton>
                    </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => {
                        setCurID(row.gateID);
                        toggleModal("delete");
                    }}>
                      <Trash color="red" size={21} />
                    </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {emptyRows > 0 && (
                <TableRow style={{ height: 53 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[5, 10, { label: 'All', value: -1 }]}
                colSpan={4}
                count={rows.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: { 'aria-label': 'rows per page' },
                  native: true,
                }}
                onChangePage={handleChangePage}
                onChangeRowsPerPage={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default { Gates };