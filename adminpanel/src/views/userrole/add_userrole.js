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
  CFormCheck,
} from "@coreui/react";

const AddUserroles = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("karigar_token");

  const [validated, setValidated] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const [userRoleName, setUserroleName] = useState("");
  const [allSystemModules, setAllSystemModules] = useState([]);
  const [rolePermission, setRolePermission] = useState([]);

  const [userRoleError, setUserroleError] = useState("");
  const [permissionError, setPermissionError] = useState("");

  // Edit services code
  const [isEdit, setIsEdit] = useState(false);
  const [userroleId, setUserroleId] = useState("");

  // Error state empty.
  useEffect(() => {
    setUserroleError("");
    setPermissionError("");
    setValidated(false);
  }, [userRoleName, rolePermission]);

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
              modulesid: record._id,
              modulesname: record.modulesname,
            });
          });
          setAllSystemModules(records);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }, []);

  useEffect(() => {
    if (location.state) {
      setIsEdit(true);
      setUserroleId(location.state.userroleid);
      setUserroleName(location.state.rolename);
      setRolePermission(location.state.rolepermission);
    }
  }, [userroleId]);

  function addUserrole() {
    if (!/^[a-zA-Z]/i.test(userRoleName)) {
      setValidated(true);
      setUserroleError("Please enter valid userrole name");
    }
    if (rolePermission.length === 0) {
      setValidated(true);
      setPermissionError("Please select permission");
    } else {
      // Add new userrole
      let insertData = {};
      insertData.rolename = userRoleName;
      insertData.systemmodulesid = rolePermission;

      axios
        .post(
          `${process.env.REACT_APP_APIURL}/karigar/userrole/create`,
          insertData,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((data) => {
          if (data.data.status) {
            toast.success(data.data.message, {
              onClose: () => {
                navigate(-1);
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

  function setPermission(modulesId) {
    if (rolePermission.includes(modulesId)) {
      const id = rolePermission.indexOf(modulesId);
      return rolePermission.splice(id, 1);
    } else {
      setRolePermission([...rolePermission, modulesId]);
    }
  }
  // console.log(rolePermission, "rolePermission");

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
                  <h3>Userrole</h3>
                  <hr />

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="rolename"
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
                      value={userRoleName ? userRoleName : ""}
                      onChange={(e) => {
                        setUserroleName(e.target.value);
                      }}
                    />
                    {userRoleError && (
                      <p className="text-danger">{userRoleError}</p>
                    )}
                  </CCol>

                  <br />
                  <br />
                  <br />
                  <br />
                  <div className="row">
                    <CCol md={6}>
                      <CFormLabel
                        htmlFor="rolename"
                        className="col-sm-4 col-form-label"
                      >
                        Select Permission
                      </CFormLabel>

                      <div className="container">
                        {allSystemModules &&
                          allSystemModules.map((item, index) => {
                            return (
                              <CFormCheck
                                key={index}
                                type="checkbox"
                                color="primary"
                                size="xl"
                                label={item.modulesname}
                                checked={(() => {
                                  let flag = false;
                                  rolePermission &&
                                    rolePermission.map((list) => {
                                      if (item.modulesid === list._id) {
                                        if (
                                          rolePermission.includes(
                                            item.modulesid,
                                          )
                                        ) {
                                          console.log("YES");
                                          flag = true;
                                        }
                                      }
                                    });
                                  return flag;
                                })()}
                                onChange={(e) => {
                                  console.log(item.modulesid, item.modulesname);
                                  setPermission(item.modulesid);
                                }}
                              />
                            );
                          })}
                        {permissionError && (
                          <p className="text-danger">{permissionError}</p>
                        )}
                      </div>
                    </CCol>
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
