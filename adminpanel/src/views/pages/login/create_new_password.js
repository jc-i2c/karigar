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
  CCardGroup,
} from "@coreui/react";

const AddServices = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [validated, setValidated] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const [emailAddress, setEmailAddress] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [conPassword, setConPassword] = useState("");

  const [newPasswordError, setNewPasswordError] = useState("");
  const [conPasswordError, setConPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  useEffect(() => {
    if (location.state !== null) {
      setEmailAddress(location.state.emailaddress);
    } else {
      navigate("/forgotpassword");
    }
  }, []);

  //   Error state null
  useEffect(() => {
    setValidated(false);
    setNewPasswordError("");
    setConPasswordError("");
    setPasswordMatchError("");
  }, [newPassword, conPassword]);

  //   Create new password.
  function createNewPassword() {
    if (
      !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i.test(
        newPassword,
      )
    ) {
      setValidated(true);
      setNewPasswordError(
        "Required at least 8 characters including 1 uppercase, 1 lowercase, 1 special characters and 1 alphanumeric characters",
      );
    }
    if (
      !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i.test(
        conPassword,
      )
    ) {
      setValidated(true);
      setConPasswordError(
        "Required at least 8 characters including 1 uppercase, 1 lowercase, 1 special characters and 1 alphanumeric characters",
      );
    }
    if (newPassword !== conPassword) {
      setValidated(true);
      setPasswordMatchError("Password and confirm password does not match");
    } else {
      setSpinner(true);
      if (validated === false) {
        // Create new password.
        var data = new FormData();
        data.append("emailaddress", emailAddress);
        data.append("newpassword", newPassword);
        data.append("confirmpassword", conPassword);

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/user/createnewpassword`,
            data,
          )
          .then((data) => {
            if (data.data.status) {
              toast.success(data.data.message, {
                onClose: () => {
                  navigate("/login");
                },
              });
            } else {
              if (data.data.message.confirmpassword) {
                toast.warning(data.data.message.confirmpassword);
              } else {
                toast.warning(data.data.message);
              }
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
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            <CCardGroup>
              <CCard className="p-8">
                <CCardBody>
                  <CForm
                    className="row g-3"
                    noValidate
                    validated={validated && validated}
                    onSubmit={createNewPassword}
                  >
                    <h3 className="text-center">Create New Password</h3>
                    <hr />

                    <CCol md={12}>
                      <CFormLabel
                        htmlFor="password"
                        className="col-sm-12 col-form-label"
                      >
                        New Password
                      </CFormLabel>
                      <CFormInput
                        type="password"
                        id="newpassword"
                        placeholder="New Password"
                        autoComplete="newpassword"
                        required
                        onChange={(e) => {
                          setNewPassword(e.target.value);
                        }}
                      />
                      {newPasswordError && (
                        <p className="text-danger">{newPasswordError}</p>
                      )}
                    </CCol>

                    <CCol md={12}>
                      <CFormLabel
                        htmlFor="password"
                        className="col-sm-12 col-form-label"
                      >
                        Confirm password
                      </CFormLabel>
                      <CFormInput
                        type="password"
                        id="conpassword"
                        placeholder="Confirm password"
                        autoComplete="conpassword"
                        required
                        onChange={(e) => {
                          setConPassword(e.target.value);
                        }}
                      />
                      {conPasswordError && (
                        <p className="text-danger">{conPasswordError}</p>
                      )}
                      {passwordMatchError && (
                        <p className="text-danger">{passwordMatchError}</p>
                      )}
                    </CCol>

                    <div className="d-grid gap-2 d-md-flex justify">
                      {spinner ? (
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <CButton
                          color="primary"
                          onClick={() => {
                            createNewPassword();
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
                  <ToastContainer
                    autoClose={`${process.env.REACT_APP_TOASTMESSAGETIME}`}
                  />
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default AddServices;
