import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CRow,
  CButton,
  CFormLabel,
  CCardHeader,
  CFormCheck,
} from "@coreui/react";

const AddUserroles = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("karigar_token");
  const [validated, setValidated] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const [userroleName, setUserroleName] = useState("");
  const [allSystemModules, setAllSystemModules] = useState([]);
  const [tempPermission, setTempPermission] = useState([]);

  const [userroleError, setUserroleError] = useState("");

  // Edit services code
  const [isEdit, setIsEdit] = useState(false);
  const [userroleId, setUserroleId] = useState("");
  const [editPermission, setEditPermission] = useState("");

  // Error state empty.
  useEffect(() => {
    setUserroleError("");

    setValidated(false);
  }, [userroleName]);

  // Edit userrole.
  useEffect(() => {
    if (location.state) {
      setIsEdit(true);
      setUserroleId(location.state.userroleid);
      setUserroleName(location.state.rolename);
      setTempPermission(location.state.permissions);
    }
  }, [userroleId]);

  // Get all system modules list.
  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/systemmodules/getall`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((data) => {
        const records = [];
        if (data.data.data) {
          data.data.data.map((record) => {
            records.push({
              id: record._id,
              modulesname: record.modulesname,
              modulespermission: record.modulespermission,
              createdAt: record.createdAt,
              updatedAt: record.updatedAt,
            });
          });
          setAllSystemModules(records);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }, []);

  const checkModuleExitance = (prevPermissions, systemModulesId) => {
    let currentModule = {};
    prevPermissions.map((item) => {
      if (item.systemmodulesid === systemModulesId) {
        currentModule = item;
      }
    });

    return currentModule;
  };

  const updateIfserviceAlreadyExist = (
    prevPermissions,
    currentModule,
    permissionId,
  ) => {
    const latestPermission = [];
    prevPermissions.map((module) => {
      if (module.systemmodulesid === currentModule.systemmodulesid) {
        if (module.access.length === 1 && module.access[0] === permissionId) {
          // console.log("meet the condition");
        } else {
          if (module.access.includes(permissionId)) {
            latestPermission.push({
              ...module,
              access: module.access.filter((per) => per !== permissionId),
            });
          } else {
            latestPermission.push({
              ...module,
              access: [...module.access, permissionId],
            });
          }
        }
      } else {
        latestPermission.push({ ...module });
      }
    });
    return latestPermission;
  };

  function arrayInSetPer(systemModulesId, permissionId) {
    console.log(systemModulesId, permissionId);
    setTempPermission((prevPermissions) => {
      if (prevPermissions.length === 0) {
        return [
          {
            systemmodulesid: systemModulesId,
            access: [permissionId],
          },
        ];
      } else {
        const currentModule = checkModuleExitance(
          prevPermissions,
          systemModulesId,
        );
        // console.log(currentModule, "module");
        if (Object.keys(currentModule).length > 0) {
          return updateIfserviceAlreadyExist(
            prevPermissions,
            currentModule,
            permissionId,
          );
        } else {
          return [
            ...prevPermissions,
            {
              systemmodulesid: systemModulesId,
              access: [permissionId],
            },
          ];
        }
      }
    });
  }

  function addUserrole() {
    if (!/^[a-zA-Z]/i.test(userroleName)) {
      setValidated(true);
      setUserroleError("Please enter valid userrole name");
    } else {
      if (isEdit) {
        // Edit data
        setSpinner(true);
        var data = new FormData();
        data.append("servicesid", userroleId);
        data.append("servicename", userroleName);

        axios
          .post(`${process.env.REACT_APP_APIURL}/karigar/services/edit`, data, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((data) => {
            if (data.data.status) {
              toast.success(data.data.message, {
                onClose: () => {
                  navigate("/userrole");
                },
              });
            } else {
              toast.error(data.data.message);
            }
            setSpinner(false);
          })
          .catch((error) => {
            console.log(error, "error");
            setSpinner(false);
          });
      } else {
        // Add new data
        var data = new FormData();
        data.append("servicename", userroleName);

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/services/create`,
            data,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )
          .then((data) => {
            if (data.data.status) {
              toast.success(data.data.message, {
                onClose: () => {
                  navigate("/userrole");
                },
              });
            } else {
              toast.error(data.data.message);
            }
            setSpinner(false);
          })
          .catch((error) => {
            console.log(error, "error");
            setSpinner(false);
          });
      }
    }
  }

  return (
    <div>
      <CContainer>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardBody className="p-6">
                <CForm
                  className="row g-6"
                  noValidate
                  validated={validated}
                  onSubmit={addUserrole}
                >
                  <h2>Userrole</h2>
                  <hr />
                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="email"
                      className="col-sm-4 col-form-label"
                    >
                      Userrole Name
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="userrolename"
                      placeholder="Userrole Name"
                      autoComplete="userrolename"
                      required
                      value={userroleName ? userroleName : ""}
                      onChange={(e) => {
                        setUserroleName(e.target.value);
                      }}
                    />
                    {userroleError && (
                      <p className="text-danger">{userroleError}</p>
                    )}
                  </CCol>

                  {/* Systemmodules Cards */}
                  <br />
                  <br />
                  <br />
                  <br />
                  <br />
                  <div className="row">
                    {allSystemModules &&
                      allSystemModules.map((systemModules, index) => (
                        <CCol key={index}>
                          <CCard style={{ width: "8rem" }}>
                            <CCardHeader className="p-6 mb-1 bg-secondary text-black text-center">
                              {systemModules.modulesname}
                            </CCardHeader>
                            <div className="container">
                              {systemModules.modulespermission.map(
                                (permission, index) => {
                                  return (
                                    <CFormCheck
                                      key={index}
                                      type="checkbox"
                                      color="primary"
                                      size="xl"
                                      label={permission.name}
                                      checked={(() => {
                                        let flag = false;
                                        tempPermission &&
                                          tempPermission.map((list) => {
                                            if (
                                              systemModules.id ==
                                              list.systemmodulesid._id
                                            ) {
                                              if (
                                                list.access.includes(
                                                  permission.id,
                                                )
                                              )
                                                flag = true;
                                            }
                                          });
                                        return flag;
                                      })()}
                                      onChange={(e) => {
                                        arrayInSetPer(
                                          systemModules.id,
                                          permission.id,
                                          e.target.value,
                                        );
                                      }}
                                    />
                                  );
                                },
                              )}
                            </div>
                          </CCard>
                          <br />
                        </CCol>
                      ))}
                  </div>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    {spinner ? (
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <CButton
                        color="primary"
                        onClick={() => {
                          addUserrole();
                        }}
                      >
                        Submit
                      </CButton>
                    )}

                    <CButton color="primary" onClick={() => navigate(-1)}>
                      Back
                    </CButton>
                  </div>
                </CForm>
                <ToastContainer />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default AddUserroles;
