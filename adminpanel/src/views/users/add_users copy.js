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

const AddUsers = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("karigar_token");
  const [isEdit, setIsEdit] = useState(false);
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
  const [userId, setUserId] = useState("");

  var validationError = [];

  // Get all userrole.
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
        if (data.data.data) {
          const records = [];
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

  // Error message empty.
  useEffect(() => {
    setSpinner(false);
    validationError = [];
  }, [
    emailAddress,
    name,
    password,
    confirmPassword,
    userrole,
    gender,
    mobileNumber,
  ]);

  // Add edit users.
  function addNewUsers() {
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailAddress)) {
      validationError.push("emailError");
    }

    if (name.trim() === "") {
      validationError.push("nameError");
    }

    if (password !== confirmPassword) {
      validationError.push("passwordMisMatch");
    }

    if (
      !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i.test(
        password,
      )
    ) {
      validationError.push("weakPassowrd");
    }

    if (!userrole) {
      validationError.push("userRoleError");
    }

    if (!/^[6789]\d{9}$/.test(mobileNumber) || mobileNumber == null) {
      validationError.push("mobileError");
    }

    if (!gender) {
      validationError.push("genderError");
    }

    if (validationError.length === 0) {
      setSpinner(false);

      if (isEdit) {
        // Admin edit users.
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

  return (
    <div>
      <CContainer>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardBody className="p-4">
                <CForm className="row g-3" noValidate>
                  <h3>Users</h3>
                  <hr />

                  <CCol md={6}>
                    <CFormLabel
                      htmlFor="emailaddress"
                      className="col-sm-12 col-form-label"
                    >
                      Email Address
                    </CFormLabel>
                    <CFormInput
                      type="email"
                      id="validationServer01"
                      placeholder="Email address"
                      required
                      disabled={isEdit ? true : false}
                      value={emailAddress}
                      onChange={(e) => {
                        setEmailAddress(e.target.value);
                      }}
                    />

                    {validationError.includes("emailError") && (
                      <p className="text-danger">Enter valid email address.</p>
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
                      placeholder="Enter Name"
                      required
                      value={name}
                      onChange={(e) => {
                        var nameReg = /^[A-Za-z\s]*$/;
                        if (nameReg.test(e.target.value)) {
                          setName(e.target.value);
                        }
                      }}
                    />
                    {validationError.includes("nameError") && (
                      <p className="text-danger">Name must be a string.</p>
                    )}
                  </CCol>

                  {!isEdit && (
                    <CCol md={6}>
                      <CFormLabel
                        htmlFor="password"
                        className="col-sm-12 col-form-label"
                      >
                        Password
                      </CFormLabel>
                      <CFormInput
                        type="password"
                        id="password"
                        placeholder="password"
                        required
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                      {validationError.includes("weakPassowrd") && (
                        <p className="text-danger">Enter Strong Password.</p>
                      )}
                      {validationError.includes("passwordMisMatch") && (
                        <p className="text-danger">Password does not match.</p>
                      )}
                    </CCol>
                  )}

                  {!isEdit && (
                    <CCol md={6}>
                      <CFormLabel
                        htmlFor="password"
                        className="col-sm-12 col-form-label"
                      >
                        Confirm Password
                      </CFormLabel>
                      <CFormInput
                        type="password"
                        id="confirmpassword"
                        placeholder="Confirm password"
                        required
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                        }}
                      />
                      {validationError.includes("weakPassowrd") && (
                        <p className="text-danger">Enter Strong Password.</p>
                      )}
                      {validationError.includes("passwordMisMatch") && (
                        <p className="text-danger">Password does not match.</p>
                      )}
                    </CCol>
                  )}

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="userrole"
                      className="col-sm-12 col-form-label"
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
                      <option value="" disabled>
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
                    {validationError.includes("userRoleError") && (
                      <p className="text-danger">Selecet userrole.</p>
                    )}
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="mobilenumber"
                      className="col-sm-12 col-form-label"
                    >
                      Mobile Number
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      required
                      id="mobilenumber"
                      maxLength="10"
                      minLength="10"
                      placeholder="Mobile Number"
                      value={mobileNumber}
                      onChange={(e) => {
                        var numberReg = /^[0-9]*$/;
                        if (numberReg.test(e.target.value)) {
                          setMobileNumber(e.target.value);
                        }
                      }}
                    />
                    {validationError.includes("mobileError") && (
                      <p className="text-danger">Enter valid mobile number.</p>
                    )}
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="userrole"
                      className="col-sm-12 col-form-label"
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
                      <option value="" disabled>
                        Gender
                      </option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                    </CFormSelect>

                    {validationError.includes("genderError") && (
                      <p className="text-danger">Select Gender</p>
                    )}
                  </CCol>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    {spinner ? (
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <CButton color="primary" onClick={addNewUsers()}>
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

export default AddUsers;
