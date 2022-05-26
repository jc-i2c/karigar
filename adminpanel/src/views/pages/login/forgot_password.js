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
  CCardGroup,
} from "@coreui/react";

const AddServices = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("karigar_token"));

  const [validated, setValidated] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const [emailAddress, setEmailAddress] = useState("");
  const [emailAddressError, setEmailAddressError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("karigar_token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  //   Error state null
  useEffect(() => {
    setValidated(false);
    setEmailAddressError("");
  }, [emailAddress]);

  //   Reset password.
  function forgotPassword() {
    setSpinner(true);
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailAddress)) {
      setSpinner(false);
      setValidated(true);
      setEmailAddressError("Please enter valid email address");
    } else {
      if (validated == false) {
        // Reset password data.
        var data = new FormData();
        data.append("emailaddress", emailAddress);

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/user/resetpassword`,
            data,
            {},
          )
          .then((data) => {
            if (data.data.status) {
              toast.success(data.data.message, {
                onClose: () => {
                  navigate("/verifyotp", {
                    state: { emailaddress: emailAddress },
                  });
                },
              });
            } else {
              if (data.data.message) {
                toast.error(data.data.message);
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
              <CCard className="p-4">
                <CCardBody>
                  <CForm
                    className="row g-3 needs-validation"
                    noValidate
                    validated={validated && validated}
                    onSubmit={forgotPassword}
                  >
                    <h3 className="text-center">Forgot Password</h3>
                    <hr />

                    <CCol md={12}>
                      <CFormLabel
                        htmlFor="emailaddress"
                        className="col-sm-12 col-form-label"
                      >
                        Email Address
                      </CFormLabel>
                      <CFormInput
                        type="email"
                        id="emailaddress"
                        placeholder="Email Address"
                        autoComplete="emailaddress"
                        required
                        value={emailAddress ? emailAddress : ""}
                        onChange={(e) => {
                          setEmailAddress(e.target.value);
                        }}
                      />
                      {emailAddressError && (
                        <p className="text-danger">{emailAddressError}</p>
                      )}
                    </CCol>
                    <br />

                    <div className="d-grid gap-2 d-md-flex justify">
                      {spinner ? (
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <CButton
                          color="primary"
                          onClick={() => {
                            forgotPassword();
                          }}
                        >
                          Submit
                        </CButton>
                      )}

                      <CButton
                        color="primary"
                        onClick={() => navigate("/login")}
                      >
                        Back
                      </CButton>
                    </div>
                  </CForm>
                  <ToastContainer />
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
