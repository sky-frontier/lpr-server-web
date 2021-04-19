import React, { useState, useEffect } from "react";
import { Breadcrumb } from "react-bootstrap";
import {Input , TableFooter, TablePagination, TableContainer, TableCell, TableBody, Table, IconButton, TableHead, TableRow, Paper } from '@material-ui/core';
import { TablePaginationActions } from "../../components/index.js";

import { PencilSquare } from "react-bootstrap-icons";
import SaveIcon from '@material-ui/icons/Save';
import CloseIcon from '@material-ui/icons/Close';


export function LedConfig(props) {
  let ID = parseInt(props.ID);
  const [rows, setRows] = useState([]);
  const [curID, setCurID] = useState(null);
  const [state, setState] = useState({
    trigger: "",
    voiceMsg: "",
    textMsg: ""
  });
  const [dummy, setDummy] = useState(false);
  const reload = () =>{
    /*getProjects(["projectID", "projectName", "location", "projectType"])
    .then(async (data) => {
      console.log(data.content);
      setInitialRows(data.content);
    })
    .catch((error) => {
      console.error("There was an error!", error);
    });*/
  }
  useEffect(() => {
    //reload();
    let res = [
        {
            id: 1,
            trigger: "Trigger 1",
            voiceMsg: "Sample 1",
            textMsg: "Sample 01"
        },
        {
            id: 2,
            trigger: "Trigger 2",
            voiceMsg: "Sample 2",
            textMsg: "Sample 02"
        },
        {
            id: 3,
            trigger: "Trigger 3",
            voiceMsg: "Sample 3",
            textMsg: "Sample 03"
        },
        {
            id: 4,
            trigger: "Trigger 4",
            voiceMsg: "Sample 4",
            textMsg: "Sample 04"
        },
        {
            id: 5,
            trigger: "Trigger 5",
            voiceMsg: "Sample 5",
            textMsg: "Sample 05"
        },
        {
            id: 6,
            trigger: "Trigger 6",
            voiceMsg: "Sample 6",
            textMsg: "Sample 06"
        }
    ];
    setRows(res);
  }, [dummy]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [id]: value
    }));
  };

  const save = () =>{

  }

  const edit = (vals) =>{
    const {id, trigger, voiceMsg, textMsg} = vals;
    setState({
        trigger, 
        voiceMsg, 
        textMsg});
    setCurID(id);
  }
  
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, rows.length - page * rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setCurID(null);
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <div>
      <div className="content">
      <Breadcrumb>
        <Breadcrumb.Item href="/home">Home</Breadcrumb.Item>
        <Breadcrumb.Item href="/project">Projects</Breadcrumb.Item>
        <Breadcrumb.Item active>LED Configuration</Breadcrumb.Item>
      </Breadcrumb>
      </div>
      <div className="content">
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Trigger</TableCell>
                <TableCell align="left">Voice Message</TableCell>
                <TableCell align="left">Text Message</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(rowsPerPage > 0
            ? rows.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
            : rows).map((row) => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.trigger}
                  </TableCell>
                  <TableCell align="left">
                    {curID === row.id?
                    <Input 
                        id="voiceMsg" 
                        label="Standard"
                        value = {state.voiceMsg}
                        onChange = {handleChange} />
                    :row.voiceMsg
                    }
                  </TableCell>
                  <TableCell align="left">
                    {curID === row.id?
                    <Input 
                        id="textMsg" 
                        label="Standard"
                        value = {state.textMsg}
                        onChange = {handleChange} />
                    :row.textMsg
                    }
                  </TableCell>
                  <TableCell align="right"  style={{padding:0}}>
                    {curID === null?
                        (<IconButton onClick={() => edit(row)}>
                            <PencilSquare
                            size={21}
                            color="royalblue"
                            />
                        </IconButton>)
                        :(
                        curID === row.id?
                        <div>
                            <IconButton onClick={() => save()}>
                                <SaveIcon
                                size={21}
                                color="primary"
                                />
                            </IconButton>
                            <IconButton onClick={() => setCurID(null)}>
                                <CloseIcon
                                size={21}
                                color="error"
                                />
                            </IconButton>
                        </div>
                        :
                        (<IconButton disabled = {true}>
                            <PencilSquare
                            size={21}
                            />
                        </IconButton>)
                    )}
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

export default { LedConfig };
