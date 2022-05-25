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
  CFormSelect,
} from "@coreui/react";

const AddServices = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("karigar_token");

  const [validated, setValidated] = useState(false);

  const [spinner, setSpinner] = useState(false);

  // Edit services code
  const [emailAddress, setEmailAddress] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userrole, setUserrole] = useState("");
  const [gender, setGender] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [allUserRole, setAllUserRole] = useState([]);
  const [isEdit, setIsEdit] = useState(false);
  const [userId, setUserId] = useState("");

  // Error state
  const [nameError, setNameError] = useState("");
  const [emailAdressError, setEmailAdressError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [userroleError, setUSerroleError] = useState("");

  // Gel all userroel.
  useEffect(() => {
    let unmounted = false;

    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/userrole/getall`,
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
              userroleid: record._id,
              userrolename: record.rolename,
            });
          });
          setAllUserRole(records);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
    return () => {
      unmounted = true;
    };
  }, []);

  // Error state empty.
  useEffect(() => {
    setNameError("");
    setEmailAdressError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setPasswordMatchError("");
    setUSerroleError("");
    setMobileNumberError("");
    setGenderError("");
    setValidated(false);
  }, [
    name,
    emailAddress,
    password,
    confirmPassword,
    userrole,
    mobileNumber,
    gender,
  ]);

  // Props data set.
  useEffect(() => {
    if (location.state) {
      setIsEdit(true);
      setUserId(location.state.userid);
      setEmailAddress(location.state.emailaddress);
      setName(location.state.name);
      setUserrole(location.state.userroll);
      setMobileNumber(location.state.mobilenumber);
      setGender(location.state.gender);
    }
  }, []);

  // Add edit users.
  function addNewUsers() {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailAddress)) {
      setValidated(false);
      setEmailAdressError("Please enter valid email address");
    }
    if (!/^[A-Za-z\s]+$/i.test(name)) {
      setValidated(false);
      setNameError("Please enter valid name");
    }
    if (
      !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i.test(
        password,
      )
    ) {
      setValidated(false);
      setPasswordError("Please enter strong password");
    }
    if (
      !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i.test(
        confirmPassword,
      )
    ) {
      setValidated(false);
      setConfirmPasswordError("Please enter strong password");
    }
    if (!password === confirmPassword) {
      setValidated(false);
      setPasswordMatchError("Password and confirm password does not match");
    }
    if (!userrole) {
      setValidated(false);
      setUSerroleError("Please select userrole");
    }
    if (!/^[6-9]\d{9}$/i.test(mobileNumber)) {
      setValidated(false);
      setMobileNumberError("Please enter valid mobile number");
    }
    if (!gender) {
      setValidated(false);
      setGenderError("Please select gender");
    } else {
      if (validated == true) {
        if (isEdit) {
          // Admin edit userdata.
          var data = new FormData();
          data.append("emailaddress", emailAddress);
          data.append("name", name);
          data.append("userroll", userrole);
          data.append("mobilenumber", mobileNumber);
          data.append("gender", gender);
          data.append("userid", userId);

          axios
            .post(
              `${process.env.REACT_APP_APIURL}/karigar/user/edituserdata`,
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
          // Add new users.
          var data = new FormData();
          data.append("name", name);
          data.append("emailaddress", emailAddress);
          data.append("password", password);
          data.append("confirmpassword", confirmPassword);
          data.append("userroll", userrole);
          data.append("isadmin", true);
          data.append("mobilenumber", mobileNumber);
          data.append("gender", gender);

          axios
            .post(`${process.env.REACT_APP_APIURL}/karigar/user/signup`, data, {
              headers: { Authorization: `Bearer ${token}` },
            })
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
              if (data.data.status == false) {
                toast.error(data.data.message.confirmpassword);
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
                  validated={validated && validated}
                  onSubmit={addNewUsers}
                >
                  <h3>Users</h3>
                  <hr />

                  <CCol md={6}>
                    <CFormLabel
                      htmlFor="emailaddress"
                      className="col-sm-4 col-form-label"
                    >
                      Email Address
                    </CFormLabel>
                    {isEdit ? (
                      <CFormInput
                        type="email"
                        id="validationServer01"
                        placeholder="Email address"
                        autoComplete="emailaddress"
                        required
                        disabled
                        value={emailAddress ? emailAddress : ""}
                        onChange={(e) => {
                          setEmailAddress(e.target.value);
                        }}
                      />
                    ) : (
                      <CFormInput
                        type="email"
                        id="validationServer01"
                        placeholder="Email address"
                        autoComplete="emailaddress"
                        required
                        value={emailAddress ? emailAddress : ""}
                        onChange={(e) => {
                          setEmailAddress(e.target.value);
                        }}
                      />
                    )}

                    {emailAdressError && (
                      <p className="text-danger">{emailAdressError}</p>
                    )}
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel
                      htmlFor="name"
                      className="col-sm-6 col-form-label"
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
                        var nameReg = /^[A-Za-z\s]+$/i;
                        if (nameReg.test(e.target.value)) {
                          setName(e.target.value);
                        }
                      }}
                    />
                    {nameError && <p className="text-danger">{nameError}</p>}
                  </CCol>

                  {!isEdit && (
                    <CCol md={6}>
                      <CFormLabel
                        htmlFor="password"
                        className="col-sm-6 col-form-label"
                      >
                        Password
                      </CFormLabel>
                      <CFormInput
                        type="password"
                        id="password"
                        placeholder="password"
                        autoComplete="password"
                        required
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                      {passwordError && (
                        <p className="text-danger">{passwordError}</p>
                      )}
                    </CCol>
                  )}

                  {!isEdit && (
                    <CCol md={6}>
                      <CFormLabel
                        htmlFor="password"
                        className="col-sm-6 col-form-label"
                      >
                        Confirm Password
                      </CFormLabel>
                      <CFormInput
                        type="password"
                        id="confirmpassword"
                        placeholder="Confirm password"
                        autoComplete="Confirm password"
                        required
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                        }}
                      />
                      {confirmPasswordError && (
                        <p className="text-danger">{confirmPasswordError}</p>
                      )}
                    </CCol>
                  )}
                  {passwordMatchError && (
                    <p className="text-danger">{passwordMatchError}</p>
                  )}

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="userrole"
                      className="col-sm-6 col-form-label"
                    >
                      Userrole
                    </CFormLabel>

                    <CFormSelect
                      required
                      id="userrole"
                      name="userrole"
                      value={userrole}
                      onChange={(e) => {
                        setUserrole(e.target.value);
                      }}
                    >
                      <option value="" selected>
                        Selecet Userrole
                      </option>

                      {allUserRole.map((roleList) => (
                        <option
                          key={roleList.userroleid}
                          value={roleList.userroleid}
                        >
                          {roleList.userrolename}
                        </option>
                      ))}
                    </CFormSelect>

                    {userroleError && (
                      <p className="text-danger">{userroleError}</p>
                    )}
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="mobilenumber"
                      className="col-sm-6 col-form-label"
                    >
                      Mobile Number
                    </CFormLabel>
                    <CFormInput
                      required
                      type="text"
                      id="mobilenumber"
                      maxLength="10"
                      placeholder="Mobile Number"
                      autoComplete="mobilenumber"
                      value={mobileNumber ? mobileNumber : ""}
                      onChange={(e) => {
                        setMobileNumber(+e.target.value);
                      }}
                    />
                    {mobileNumberError && (
                      <p className="text-danger">{mobileNumberError}</p>
                    )}
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="userrole"
                      className="col-sm-6 col-form-label"
                    >
                      Select Gender
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
                      <option value="" selected>
                        Gender
                      </option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                    </CFormSelect>

                    {genderError && (
                      <p className="text-danger">{genderError}</p>
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
                          addNewUsers();
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
