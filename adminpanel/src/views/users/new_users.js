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
  CRow,
  CButton,
  CFormInput,
  CFormLabel,
  CFormSelect,
} from "@coreui/react";

const Offers = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("karigar_token");
  const [isEdit, setIsEdit] = useState(false);
  const [validated, setValidated] = useState(false);
  const [spinner, setSpinner] = useState(false);

  // Form state
  const [emailAddress, setEmailAddress] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [conPassword, setConPassword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [allUserRole, setAllUserRole] = useState([]);
  const [gender, setGender] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [userId, setUserId] = useState("");

  const [profilePicture, setProfilePicture] = useState("");
  const [imagePath, setImagePath] = useState("");
  const initialState = { alt: "", src: "" };

  // Error state
  const [emailError, setEmailError] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [conPasswordError, setConPasswordError] = useState("");
  const [passwordMitchError, setPasswordMitchError] = useState("");
  const [userRoleError, setUserRoleError] = useState("");
  const [genderError, setGenderError] = useState("");
  const [mobileNumberError, setMobileNumberError] = useState("");

  const [roleName, setRoleName] = useState("");

  // Identify user type.
  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/userrole/getpermission`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((data) => {
        if (data.data.data.roletag) {
          setRoleName(data.data.data.roletag);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });

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
  }, []);

  // Edit data set.
  useEffect(() => {
    if (location.state) {
      setIsEdit(true);
      setUserId(location.state.userid);
      setEmailAddress(location.state.emailaddress);
      setName(location.state.name);
      setUserRole(location.state.userroll);
      setMobileNumber(location.state.mobilenumber);
      setGender(location.state.gender);
      setProfilePicture(location.state.profile_picture);
    }
  }, []);

  // Handle image.
  const fileHandle = (e) => {
    e.preventDefault();
    var profilePicture = e.target.files[0];
    setProfilePicture(profilePicture);

    const { files } = e.target;
    const fileValue = files.length
      ? URL.createObjectURL(profilePicture)
      : initialState;
    setImagePath(fileValue);
  };

  // Form validation
  function validationCheck() {
    setEmailError("");
    setNameError("");
    setPasswordError("");
    setConPasswordError("");
    setPasswordMitchError("");
    setUserRoleError("");
    setGenderError("");
    setMobileNumberError("");

    if (isEdit) {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailAddress)) {
        setValidated(true);
        setEmailError("Email Invalid.");
      } else if (!name) {
        setValidated(true);
        setNameError("Name Invalid.");
      } else if (!userRole) {
        setValidated(true);
        setUserRoleError("Select Userrole.");
      } else if (!gender) {
        setValidated(true);
        setGenderError("Select Gender.");
      } else if (!/^[6789]\d{9}$/.test(mobileNumber) || mobileNumber === null) {
        setValidated(true);
        setMobileNumberError("Mobile number Invalid.");
      } else {
        return false;
      }
    } else {
      if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailAddress)) {
        setValidated(true);
        setEmailError("Email Invalid.");
      } else if (!name) {
        setValidated(true);
        setNameError("Name Invalid.");
      } else if (
        !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          password,
        )
      ) {
        setValidated(true);
        setPasswordError(
          "Required at least 8 characters including 1 uppercase, 1 lowercase, 1 special characters and 1 alphanumeric characters",
        );
      } else if (password !== conPassword) {
        setValidated(true);
        setPasswordMitchError("Password and Confirm password does not match.");
      } else if (!userRole) {
        setValidated(true);
        setUserRoleError("Select Userrole.");
      } else if (!gender) {
        setValidated(true);
        setGenderError("Select Gender.");
      } else if (!/^[6789]\d{9}$/.test(mobileNumber) || mobileNumber === null) {
        setValidated(true);
        setMobileNumberError("Mobile number Invalid.");
      } else {
        return false;
      }
    }
  }

  // Add new users and edit users.
  function addNewUsers() {
    let getStatus = validationCheck();

    if (getStatus === false) {
      setSpinner(true);
      if (isEdit) {
        console.log(profilePicture, "profilePicture");
        var data = new FormData();
        data.append("emailaddress", emailAddress);
        data.append("name", name);
        data.append("userroll", userRole);
        data.append("mobilenumber", mobileNumber);
        data.append("gender", gender);
        data.append("userid", userId);
        data.append("profile_picture", profilePicture);

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
        var data = new FormData();
        data.append("emailaddress", emailAddress);
        data.append("name", name);
        data.append("password", password);
        data.append("confirmpassword", conPassword);
        data.append("userroll", userRole);
        data.append("mobilenumber", mobileNumber);
        data.append("gender", gender);
        data.append("isadmin", true);

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
            if (data.data.status === false) {
              if (data.data.message.emailaddress)
                toast.error("Please enter a valid email");
            }
            if (data.data.status === false) {
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
                      className="col-sm-12 col-form-label"
                    >
                      Email Address
                    </CFormLabel>
                    <CFormInput
                      required
                      type="email"
                      id="emailaddress"
                      placeholder="Enter email address"
                      disabled={isEdit ? true : false}
                      value={emailAddress}
                      onChange={(e) => {
                        setEmailAddress(e.target.value);
                      }}
                    />

                    {emailError && <p className="text-danger">{emailError}</p>}
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
                      placeholder="Enter name"
                      required
                      value={name}
                      onChange={(e) => {
                        var nameReg = /^[A-Za-z\s]*$/;
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
                        className="col-sm-12 col-form-label"
                      >
                        Password
                      </CFormLabel>
                      <CFormInput
                        type="password"
                        id="password"
                        placeholder="Enter password"
                        required
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />

                      {passwordError && (
                        <p className="text-danger">{passwordError}</p>
                      )}

                      {passwordMitchError && (
                        <p className="text-danger">{passwordMitchError}</p>
                      )}
                    </CCol>
                  )}

                  {!isEdit && (
                    <CCol md={6}>
                      <CFormLabel
                        htmlFor="conPassword"
                        className="col-sm-12 col-form-label"
                      >
                        Confirm Password
                      </CFormLabel>
                      <CFormInput
                        type="password"
                        id="conPassword"
                        placeholder="Enter confirm password"
                        required
                        value={conPassword}
                        onChange={(e) => {
                          setConPassword(e.target.value);
                        }}
                      />

                      {conPasswordError && (
                        <p className="text-danger">{conPasswordError}</p>
                      )}

                      {passwordMitchError && (
                        <p className="text-danger">{passwordMitchError}</p>
                      )}
                    </CCol>
                  )}

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="userrole"
                      className="col-sm-12 col-form-label"
                    >
                      Select Userrole
                    </CFormLabel>
                    <CFormSelect
                      required
                      id="userrole"
                      name="userrole"
                      value={userRole}
                      onChange={(e) => {
                        setUserRole(e.target.value);
                      }}
                    >
                      <option value="" disabled>
                        Select Userrole
                      </option>

                      {allUserRole.map((item, index) => (
                        <option key={index} value={item.userroleid}>
                          {item.userrolename}
                        </option>
                      ))}
                    </CFormSelect>

                    {userRoleError && (
                      <p className="text-danger">{userRoleError}</p>
                    )}
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="gender"
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
                        Select Gender
                      </option>
                      <option value="1">Male</option>
                      <option value="2">Female</option>
                    </CFormSelect>

                    {genderError && (
                      <p className="text-danger">{genderError}</p>
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
                      placeholder="Enter mobile number"
                      value={mobileNumber}
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
                      htmlFor="Profile picture"
                      className="col-sm-4 col-form-label"
                    >
                      Profile picture
                    </CFormLabel>

                    <CFormInput
                      type="file"
                      placeholder="Profile picture"
                      autoComplete="profilepicture"
                      id="profilepicture"
                      required
                      onChange={(e) => {
                        fileHandle(e);
                      }}
                    />
                  </CCol>

                  <CCol className="mb-3">
                    {imagePath ? (
                      <img
                        src={imagePath}
                        alt={"Image not found"}
                        style={{
                          height: "80px",
                          width: "80px",
                        }}
                      />
                    ) : profilePicture ? (
                      <img
                        src={
                          `${process.env.REACT_APP_PROFILEPIC}` + profilePicture
                        }
                        alt={"Image not found"}
                        style={{
                          height: "80px",
                          width: "80px",
                        }}
                      />
                    ) : (
                      ""
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

export default Offers;
