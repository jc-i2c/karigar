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
} from "@coreui/react";

const ViewSystemModules = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("karigar_token");
  const [validated, setValidated] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [systemModulesError, setSystemModulesError] = useState("");

  // Edit system modules
  const [systemModulesId, setSystemModulesId] = useState("");
  const [systemModulesName, setSystemModulesName] = useState("");

  useEffect(() => {
    setSystemModulesError("");
    setValidated(false);
  }, [systemModulesName]);

  useEffect(() => {
    if (location.state) {
      setIsEdit(true);
      setSystemModulesId(location.state.systemmodulesid);
      setSystemModulesName(location.state.modulesname);
    }
  }, [systemModulesId]);

  function systemModules() {
    if (!/^[a-zA-Z]/i.test(systemModulesName)) {
      setValidated(true);
      setSystemModulesError("Please enter valid system modules name.");
    } else {
      if (isEdit) {
        // Edit data

        setSpinner(true);
        var data = new FormData();
        data.append("systemmodulesid", systemModulesId);
        data.append("modulesname", systemModulesName);

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/systemmodules/update`,
            data,
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
      } else {
        // Add new data
        var data = new FormData();
        data.append("modulesname", systemModulesName);

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/systemmodules/create`,
            data,
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
  }

  return (
    <div>
      <CContainer>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardBody className="p-4">
                <CForm
                  className="row g-3"
                  noValidate
                  validated={validated}
                  onSubmit={systemModules}
                >
                  <h3>System Modules</h3>
                  <hr />

                  <CCol md={6}>
                    <CFormLabel
                      htmlFor="systemmodules"
                      className="col-sm-4 col-form-label"
                    >
                      System Modules Name
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="systemmodulesname"
                      placeholder="System Modules Name"
                      autoComplete="systemmodulesname"
                      required
                      value={systemModulesName ? systemModulesName : ""}
                      onChange={(e) => {
                        setSystemModulesName(e.target.value);
                      }}
                    />
                    {systemModulesError && (
                      <p className="text-danger">{systemModulesError}</p>
                    )}
                  </CCol>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    {spinner ? (
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <CButton
                        color="primary"
                        onClick={() => {
                          systemModules();
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

export default ViewSystemModules;
