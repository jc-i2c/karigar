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

const AddServices = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(localStorage.getItem("karigar_token"));
  const [validated, setValidated] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [permissions, setPermissions] = useState([]);

  const [userroleName, setUserroleName] = useState("");
  const [systemModules, setSystemModules] = useState([]);

  const [userroleError, setUserroleError] = useState("");

  // Edit services code
  const [isEdit, setIsEdit] = useState(false);
  const [userroleId, setUserroleId] = useState("");

  // Error state empty.
  useEffect(() => {
    setUserroleError("");

    setValidated(false);
  }, [userroleName]);

  // Edit userrole.
  useEffect(() => {
    if (location.state) {
      setIsEdit(true);
      setUserroleId(location.state.serviceid);
      setUserroleName(location.state.servicename);
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
          setSystemModules(records);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }, []);

  let allData = [];
  let obj = {};
  let accessData = [];

  function arrayInSetPer(systemModulesId, permissionId, value) {
    if (allData.length > 0) {
      allData.map((item) => {
        if (item.systemmodulesid == systemModulesId) {
          if (!accessData.includes(permissionId)) {
            accessData.push(permissionId);
          } else {
            var index = accessData.indexOf(permissionId);
            if (index !== -1) {
              accessData.splice(index, 1);
            }
          }
          allData.push(obj);
        } else {
          obj.systemmodulesid = systemModulesId;
          if (!accessData.includes(permissionId)) {
            accessData.push(permissionId);
          } else {
            var index = accessData.indexOf(permissionId);
            if (index !== -1) {
              accessData.splice(index, 1);
            }
          }
          allData.push(obj);
        }
      });
    } else {
      obj.systemmodulesid = systemModulesId;
      accessData.push(permissionId);
      obj.access = accessData;
      allData.push(obj);
    }
    console.log(allData, "allData");
  }

  function addServices() {
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
                  navigate("/viewuserrole");
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
                  navigate("/viewuserrole");
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
                  onSubmit={addServices}
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
                    {systemModules.map((sysModule, index) => (
                      <CCol key={index}>
                        <CCard style={{ width: "8rem" }}>
                          <CCardHeader className="p-6 mb-1 bg-secondary text-black text-center">
                            {sysModule.modulesname}
                          </CCardHeader>
                          <div className="container">
                            {sysModule.modulespermission.map(
                              (permission, index) => {
                                return (
                                  <CFormCheck
                                    key={index}
                                    type="checkbox"
                                    color="primary"
                                    size="xl"
                                    label={permission.name}
                                    onClick={(e) => {
                                      arrayInSetPer(
                                        sysModule.id,
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
                          addServices();
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

export default AddServices;
