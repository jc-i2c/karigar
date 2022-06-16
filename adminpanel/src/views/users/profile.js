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
  CFormSelect,
} from "@coreui/react";

const UserProfile = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("karigar_token");

  const [validated, setValidated] = useState(false);

  const [spinner, setSpinner] = useState(false);

  // Edit user profile.
  const [emailAddress, setEmailAddress] = useState("");
  const [name, setName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [gender, setGender] = useState("");
  const [role, setRole] = useState("");

  // Error state
  const [emailAdressError, setEmailAdressError] = useState("");
  const [nameError, setNameError] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [genderError, setGenderError] = useState("");

  // Get user profile.
  useEffect(() => {
    let unmounted = false;

    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/user/profiledetails`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((data) => {
        setEmailAddress(data.data.data.emailaddress);
        setName(data.data.data.name);
        setMobileNumber(data.data.data.mobilenumber);
        setGender(data.data.data.gender);
        setRole(data.data.data.userroll.rolename);
      })
      .catch((error) => {
        console.log(error, "error");
      });
    return () => {
      unmounted = true;
    };
  }, []);

  useEffect(() => {
    setNameError("");
    setMobileNumberError("");
    setGenderError("");
  }, [name, mobileNumber, gender]);

  // Check validation.
  function validationCheck() {
    setNameError("");
    setEmailAdressError("");
    setMobileNumberError("");
    setGenderError("");

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailAddress)) {
      setValidated(true);
      setEmailAdressError("Please enter valid email address");
    } else if (!/^(?=.{1,40}$)[a-zA-Z]+(?:[\s][a-zA-Z]+)*$/i.test(name)) {
      setValidated(true);
      setNameError("Please enter valid name");
    } else if (!/^[6-9]\d{9}$/i.test(mobileNumber)) {
      setValidated(true);
      setMobileNumberError("Please enter valid mobile number");
    } else if (!gender) {
      setValidated(true);
      setGenderError("Please select gender");
    } else {
      return false;
    }
  }

  // User profile details.
  function userProfiledetails() {
    let getStatus = validationCheck();
    // console.log(getStatus, "getStatus");

    if (getStatus === false) {
      setSpinner(true);

      var data = new FormData();
      data.append("name", name);
      data.append("gender", gender);
      data.append("mobilenumber", mobileNumber);

      axios
        .post(
          `${process.env.REACT_APP_APIURL}/karigar/user/updateprofile`,
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
                  onSubmit={userProfiledetails}
                >
                  <h3> My Profile </h3> <hr />
                  <CCol md={6}>
                    <CFormLabel
                      htmlFor="emailaddress"
                      className="col-sm-12 col-form-label"
                    >
                      Email Address
                    </CFormLabel>
                    {
                      <CFormInput
                        type="emailaddress"
                        id="emailaddress"
                        placeholder="Email address"
                        autoComplete="emailaddress"
                        required
                        disabled
                        value={emailAddress && emailAddress}
                      />
                    }
                    {emailAdressError && (
                      <p className="text-danger"> {emailAdressError} </p>
                    )}
                  </CCol>
                  <CCol md={6}>
                    <CFormLabel
                      htmlFor="name"
                      className="col-sm-12 col-form-label"
                    >
                      Name
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="name"
                      placeholder="Name"
                      autoComplete="name"
                      required
                      value={name ? name : ""}
                      onChange={(e) => {
                        setName(e.target.value);
                      }}
                    />
                    {nameError && <p className="text-danger"> {nameError} </p>}
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="mobilenumber"
                      className="col-sm-12 col-form-label"
                    >
                      Mobile Number
                    </CFormLabel>
                    <CFormInput
                      required
                      type="text"
                      id="mobilenumber"
                      maxLength="10"
                      minLength="10"
                      placeholder="Enter mobile number"
                      value={mobileNumber ? mobileNumber : ""}
                      onChange={(e) => {
                        var numberReg = /^[0-9]*$/;
                        if (numberReg.test(e.target.value)) {
                          setMobileNumber(e.target.value);
                        }
                      }}
                    />

                    {mobileNumberError && (
                      <p className="text-danger">{mobileNumberError}</p>
                    )}
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="userrole"
                      className="col-sm-12 col-form-label"
                    >
                      Userrole
                    </CFormLabel>
                    <CFormSelect
                      required
                      id="gender"
                      name="gender"
                      value={gender}
                      onChange={(e) => {
                        setGender(e.target.value);
                      }}
                    >
                      <option value="" disabled>
                        Gender
                      </option>
                      <option value="1"> Male </option>
                      <option value="2"> Female </option>
                    </CFormSelect>
                    {genderError && (
                      <p className="text-danger"> {genderError} </p>
                    )}
                  </CCol>
                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="Role"
                      className="col-sm-12 col-form-label"
                    >
                      Role
                    </CFormLabel>
                    {
                      <CFormInput
                        type="Role"
                        id="Role"
                        placeholder="Role"
                        autoComplete="Role"
                        required
                        disabled
                        value={role && role}
                      />
                    }
                    {emailAdressError && (
                      <p className="text-danger"> {emailAdressError} </p>
                    )}
                  </CCol>
                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    {spinner ? (
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden"> Loading... </span>
                      </div>
                    ) : (
                      <CButton
                        color="primary"
                        onClick={() => {
                          userProfiledetails();
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

export default UserProfile;
