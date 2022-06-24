import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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

const AddServices = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("karigar_token");

  const [validated, setValidated] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [conPassword, setConPassword] = useState("");

  const [oldPasswordError, setOldPasswordError] = useState("");
  const [newPasswordError, setNewPasswordError] = useState("");
  const [conPasswordError, setConPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");

  //   Error state null
  useEffect(() => {
    setValidated(false);
    setOldPasswordError("");
    setNewPasswordError("");
    setConPasswordError("");
    setPasswordMatchError("");
  }, [oldPassword, newPassword, conPassword]);

  //   Change password.
  function changePassword(e) {
    e.preventDefault();

    if (!oldPassword) {
      setValidated(true);
      setOldPasswordError("Please enter old password.");
    }
    if (!newPassword) {
      setValidated(true);
      setNewPasswordError("Please enter new password.");
    } else if (
      !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,}$/i.test(
        newPassword,
      )
    ) {
      setValidated(true);
      setNewPasswordError(
        "Required at least 8 characters including 1 uppercase, 1 lowercase, 1 special characters and 1 alphanumeric characters",
      );
    }
    if (!conPassword) {
      setPasswordMatchError("");
      setValidated(true);
      setConPasswordError("Please enter confirm password.");
    }
    if (conPassword) {
      if (newPassword !== conPassword) {
        setValidated(true);
        setPasswordMatchError("Password and confirm password does not match");
      } else if (oldPassword == newPassword) {
        toast.error("Old password and New password must be different.");
      } else {
        setSpinner(true);

        // Change password data.
        var data = new FormData();
        data.append("oldpassword", oldPassword);
        data.append("newpassword", newPassword);
        data.append("confirmpassword", conPassword);

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/user/changepassword`,
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
              if (data.data.message.confirmpassword) {
                toast.warning(data.data.message.confirmpassword);
              }
              if (data.data.message.oldpassword) {
                toast.warning(data.data.message.oldpassword);
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
                  onSubmit={changePassword}
                >
                  <h3>Change Password</h3>
                  <hr />

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="oldpassword"
                      className="col-sm-12 col-form-label"
                    >
                      Old Password
                    </CFormLabel>

                    <CFormInput
                      required
                      type="password"
                      id="oldpassword"
                      placeholder="Enter old password"
                      autoComplete="oldpassword"
                      onChange={(e) => {
                        setOldPassword(e.target.value);
                      }}
                    />
                    {oldPasswordError && (
                      <p className="text-danger">{oldPasswordError}</p>
                    )}
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="password"
                      className="col-sm-12 col-form-label"
                    >
                      New Password
                    </CFormLabel>
                    <CFormInput
                      required
                      type="password"
                      id="newpassword"
                      placeholder="Enter new password"
                      autoComplete="newpassword"
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                      }}
                    />
                    {newPasswordError && (
                      <p className="text-danger">{newPasswordError}</p>
                    )}
                    {passwordMatchError && (
                      <p className="text-danger">{passwordMatchError}</p>
                    )}
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="password"
                      className="col-sm-12 col-form-label"
                    >
                      Confirm Password
                    </CFormLabel>
                    <CFormInput
                      type="password"
                      id="conpassword"
                      placeholder="Enter confirm password"
                      autoComplete="conpassword"
                      required
                      onChange={(e) => {
                        setConPassword(e.target.value);
                      }}
                    />
                    {conPasswordError && (
                      <p className="text-danger">{conPasswordError}</p>
                    )}
                  </CCol>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    {spinner ? (
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <CButton type="submit" color="primary">
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
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default AddServices;
