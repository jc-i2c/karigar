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
  const [otp, setOtp] = useState("");

  const [otpError, setOtpError] = useState("");

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
    setOtpError("");
  }, [otp]);

  //   Forgot password.
  function forgotPassword() {
    setSpinner(true);
    if (!/^[0-9]{6}$/i.test(otp)) {
      setValidated(true);
      setSpinner(false);
      setOtpError("Please enter valid otp");
    } else {
      // Forgot password data.
      var data = new FormData();
      data.append("emailaddress", emailAddress);
      data.append("otp", otp);

      axios
        .post(`${process.env.REACT_APP_APIURL}/karigar/user/verifyopt`, data)
        .then((data) => {
          if (data.data.status) {
            toast.success(data.data.message, {
              onClose: () => {
                navigate("/createnewpassword", {
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
                    validated={validated}
                    onSubmit={forgotPassword}
                  >
                    <h3 className="text-center">OTP Verification</h3>
                    <hr />

                    <CCol md={12}>
                      <CFormLabel
                        htmlFor="name"
                        className="col-sm-12 col-form-label"
                      >
                        Enter OTP
                      </CFormLabel>
                      <CFormInput
                        type="text"
                        id="otp"
                        placeholder="OTP"
                        autoComplete="otp"
                        required
                        maxLength="6"
                        value={otp ? otp : ""}
                        onChange={(e) => {
                          var otpReg = /^[0-9]*$/;
                          if (otpReg.test(e.target.value)) {
                            setOtp(+e.target.value);
                          }
                        }}
                      />
                      {otpError && <p className="text-danger">{otpError}</p>}
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

                      <CButton color="primary" onClick={() => navigate(-1)}>
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
