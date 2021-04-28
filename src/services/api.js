import { alertService } from './index.js';

const server_URL = "http://34.87.50.188:8000/api/router";

const returnFunc = async (response) => {
    const data = await response.json();
    if (!response.ok) {
        // get error message from body or default to response status
        const error = (data && data.content) || response.status;
        return Promise.reject(error);
    }
    return data;
}

const getProjects = (columns) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authID: "",
          serviceName: "getTable",
          content: {
            objName: "project",
            columns
          }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const getMovementLogs = (columns, filters) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authID: "",
          serviceName: "getTable",
          content: {
            objName: "movementLog",
            columns,
            filters
          }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const getSpecialPlate = (columns, filters) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authID: "",
          serviceName: "getTable",
          content: {
            objName: "specialPlate",
            columns,
            filters
          }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const getAccessRule = (projectID, columns) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authID: "",
          serviceName: "getTable",
          content: {
            objName: "accessRule",
            columns,
            filters:{
                projectID
            }
          }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const addSpecialPlate = (state) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authID: "",
          serviceName: "createSpecialPlate",
          content: state
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const delSpecialPlate = (matchPlate) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            authID: "",
            serviceName: "deleteSpecialPlate",
            content: {
                matchPlate
            }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const updateSpecialPlate = (state) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            authID: "",
            serviceName: "modifySpecialPlate",
            content: {
            matchPlate: state.matchPlate,
            modifyParams: state
            }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const addProject = () =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authID: "",
          serviceName: "createProject",
          content: {
            projectName: "",
            projectType: "",
            location: "",
            contactNumber: "",
            maCompany: "",
            equipManu: ""
          }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const getGate = (ID, columns) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            authID: "",
            serviceName: "getTable",
            content: {
            objName: "gate",
            columns,
            filters:{
                projectID: ID
            }
            }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const getDevice = (ID, columns) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authID: "",
          serviceName: "getTable",
          content: {
            objName: "device",
            columns,
            filters:{
              gateID: ID
            }
          }
        })
      };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const getAllDevice = (columns) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authID: "",
          serviceName: "getTable",
          content: {
            objName: "device",
            columns
          }
        })
      };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const createGate = (projectID,values) =>{
    const newGateReq = {
        ...values,
        projectID
    };
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            authID: "",
            serviceName: "createGate",
            content: newGateReq
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const createDevice = (gateID, values) =>{
    const newDeviceReq = {
        ...values,
        gateID
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
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const getProjectInfo = (ID) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            authID: "",
            serviceName: "getProject",
            content: {
            projectID: ID
            }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const delProject = (ID) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            authID: "",
            serviceName: "deleteProject",
            content: {
                projectID: ID
            }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const updateProjectInfo = (ID, state) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            authID: "",
            serviceName: "modifyProject",
            content: {
            projectID: ID,
            modifyParams: state
            }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const getBusinessInfo = (ID) =>{
    //Pending Function
    const requestOptions = {
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const updateBusinessInfo = (ID, state) =>{
    //Pending function
    const requestOptions = {
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const getGateInfo = (ID) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            authID: "",
            serviceName: "getGate",
            content: {
                gateID: ID
            }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const delGate = (ID) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            authID: "",
            serviceName: "deleteGate",
            content: {
                gateID: ID
            }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const updateGateInfo = (ID, state) =>{
    console.log(state);
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            authID: "",
            serviceName: "modifyGate",
            content: {
                gateID: ID,
                modifyParams: state
            }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const getDeviceInfo = (ID) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authID: "",
          serviceName: "getDevice",
          content: {
              deviceID: ID
          }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const delDevice = (ID) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authID: "",
          serviceName: "deleteDevice",
          content: {
              deviceID: ID
          }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const updateDeviceInfo = (ID, state) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            authID: "",
            serviceName: "modifyDevice",
            content: {
                deviceID: ID,
                modifyParams: state
            }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const createAccessRule = (values) =>{
    const newDeviceReq = {
        ...values
    }
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            authID: "",
            serviceName: "createAccessRule",
            content: newDeviceReq
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const getAccessRuleInfo = (ID) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authID: "",
          serviceName: "getAccessRule",
          content: {
            accessRuleID: ID
          }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const updateAccessRuleInfo = (ID, state) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            authID: "",
            serviceName: "modifyAccessRule",
            content: {
                accessRuleID: ID,
                modifyParams: state
            }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const getObjectTypes = (obj) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            authID: "",
            serviceName: "getObjectTypes",
            content: {
                objName: obj
            }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const getWhitelistTags = () =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            authID: "",
            serviceName: "getWhitelistTags"
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

const openGate = (gateID) =>{
    const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            authID: "",
            serviceName: "openGate",
            content:{
                gateID
            }
        })
    };
    return fetch(server_URL, requestOptions)
    .then(returnFunc)
}

export {
    getGate,
    getDevice,
    createGate,
    createDevice,
    getProjectInfo,
    updateProjectInfo,
    getBusinessInfo,
    updateBusinessInfo,
    getGateInfo,
    updateGateInfo,
    getDeviceInfo,
    updateDeviceInfo,
    getProjects,
    addProject,
    delProject,
    delGate,
    delDevice,
    getMovementLogs,
    getSpecialPlate,
    delSpecialPlate,
    updateSpecialPlate,
    addSpecialPlate,
    getAccessRule,
    createAccessRule,
    getAccessRuleInfo,
    updateAccessRuleInfo,
    getObjectTypes,
    getWhitelistTags,
    openGate,
    getAllDevice
};