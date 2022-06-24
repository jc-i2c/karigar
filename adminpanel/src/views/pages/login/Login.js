import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from "@coreui/react";

import CIcon from "@coreui/icons-react";

import { cilLockLocked, cilUser } from "@coreui/icons";

function Login() {
  const navigate = useNavigate();

  // local
  const [validated, setValidated] = useState(false);
  const [spinner, setSpinner] = useState(false);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("karigar_token");
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  useEffect(() => {
    setValidated(false);
    setEmailError("");
    setPasswordError("");
  }, [email, password]);

  const loginAPi = (e) => {
    e.preventDefault();

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email) || !email) {
      setValidated(true);
      setEmailError("Please enter valid emailaddress.");
    }
    if (!password || password == null) {
      setValidated(true);
      setPasswordError("Please enter valid password.");
    } else {
      if (validated === false) {
        setSpinner(true);
        let logiData = new FormData();

        logiData.append("emailaddress", email);
        logiData.append("password", password);

        axios
          .post(`${process.env.REACT_APP_APIURL}/karigar/user/signin`, logiData)
          .then((data) => {
            if (data.data.token) {
              localStorage.setItem("karigar_token", data.data.token);

              toast.success(data.data.message, {
                onClose: () => {
                  if (data.data.userdata.userrole === "ADMIN")
                    navigate("/dashboard");
                  else {
                    navigate("/services");
                  }
                },
              });
            } else {
              toast.error(data.data.message);
            }
            setSpinner(false);
          })
          .catch((error) => {
            console.log(error);
            // toast.error(error);
            setSpinner(false);
          });
      }
    }
  };

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
                    onSubmit={loginAPi}
                  >
                    <h1 className="text-center">SIGN IN</h1>
                    <hr />
                    <p className="text-medium text-center">
                      Sign In to your account
                    </p>

                    <CCol md={12}>
                      <CInputGroup className="mb-3">
                        <CInputGroupText>
                          <CIcon icon={cilUser} />
                        </CInputGroupText>
                        <CFormInput
                          type="email"
                          id="validationServer01"
                          placeholder="Email Address"
                          label="Email"
                          required
                          onChange={(e) => {
                            setEmail(e.target.value);
                          }}
                        />
                      </CInputGroup>
                      {emailError && (
                        <p className="text-danger">{emailError}</p>
                      )}
                    </CCol>

                    <CCol md={12}>
                      <CInputGroup className="mb-4">
                        <CInputGroupText>
                          <CIcon icon={cilLockLocked} />
                        </CInputGroupText>
                        <CFormInput
                          type="password"
                          placeholder="Password"
                          label="password"
                          required
                          onChange={(e) => {
                            setPassword(e.target.value);
                          }}
                        />
                      </CInputGroup>

                      {passwordError && (
                        <p className="text-danger">{passwordError}</p>
                      )}
                    </CCol>

                    <CRow>
                      {spinner ? (
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                      ) : (
                        <CCol xs={6}>
                          <CButton
                            color="primary"
                            className="px-4"
                            type="submit"
                          >
                            SIGN IN
                          </CButton>
                        </CCol>
                      )}
                      <CCol xs={6} className="text-right">
                        <CButton
                          color="link"
                          className="px-0"
                          onClick={() => {
                            navigate("/forgotpassword");
                          }}
                        >
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
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
}

export default Login;
