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
  const [error, setError] = useState({});

  const [validated, setValidated] = useState(false);
  // const [spinner, setSpinner] = useState(false);

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

  // Error state empty.
  useEffect(() => {
    setError({});
  }, [
    emailAddress,
    name,
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

  // // Add edit users.
  // const addNewUsers = (e) => {
  //   e.preventDefault();
  //   setError({});
  //   if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailAddress)) {
  //     // setError((prevState) => {
  //     //   return { ...prevState, emailAdressError: true };
  //     // });
  //     setFlag(true);
  //     // console.log(error);
  //   }
  //   if (flag) {
  //     console.log("returninng");
  //     return;
  //   }
  //   if (!name) {
  //     setError({ ...error, data: "First" });
  //     return;
  //   }
  //   console.log(error);
  //   if (
  //     !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i.test(
  //       password,
  //     )
  //   ) {
  //     setError({ ...error, passwordError: true });
  //   }
  //   if (
  //     !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i.test(
  //       confirmPassword,
  //     )
  //   ) {
  //     setError({ ...error, confirmPasswordError: true });
  //   }
  //   if (password !== confirmPassword) {
  //     // setPasswordMatchError("Password and confirm password does not match");
  //     setError({ ...error, passwordMisMatch: true });
  //   }
  //   if (!userrole) {
  //     // setUserRoleError("Please select userrole");
  //     setError({ ...error, notUserRole: true });
  //   }
  //   // if (!/^[6-9]\d{10}$/.test(mobileNumber)) {
  //   if (!/^[6789]\d{9}$/.test(mobileNumber)) {
  //     // setMobileNumberError("Please enter valid mobile number");
  //     setError({ ...error, noMobileNo: true });
  //   }
  //   if (!gender) {
  //     // setGenderError("Please select gender");
  //     setError({ ...error, noGenderSelected: true });
  //   }
  //   console.log(error);
  //   if (Object.keys(error).length > 0) {
  //     return;
  //   }
  //   console.log("code reached here");
  //   // if (isEdit) {
  //   //   // Admin edit userdata.
  //   //   var data = new FormData();
  //   //   data.append("emailaddress", emailAddress);
  //   //   data.append("name", name);
  //   //   data.append("userroll", userrole);
  //   //   data.append("mobilenumber", mobileNumber);
  //   //   data.append("gender", gender);
  //   //   data.append("userid", userId);
  //   //   axios
  //   //     .post(
  //   //       `${process.env.REACT_APP_APIURL}/karigar/user/edituserdata`,
  //   //       data,
  //   //       {
  //   //         headers: { Authorization: `Bearer ${token}` },
  //   //       },
  //   //     )
  //   //     .then((data) => {
  //   //       if (data.data.status) {
  //   //         toast.success(data.data.message, {
  //   //           onClose: () => {
  //   //             navigate(-1);
  //   //           },
  //   //         });
  //   //       } else {
  //   //         toast.error(data.data.message);
  //   //       }
  //   //       setSpinner(false);
  //   //     })
  //   //     .catch((error) => {
  //   //       console.log(error, "error");
  //   //       setSpinner(false);
  //   //     });
  //   // } else {
  //   //   // Add new users.
  //   //   var data = new FormData();
  //   //   data.append("name", name);
  //   //   data.append("emailaddress", emailAddress);
  //   //   data.append("password", password);
  //   //   data.append("confirmpassword", confirmPassword);
  //   //   data.append("userroll", userrole);
  //   //   data.append("isadmin", true);
  //   //   data.append("mobilenumber", mobileNumber);
  //   //   data.append("gender", gender);
  //   //   axios
  //   //     .post(`${process.env.REACT_APP_APIURL}/karigar/user/signup`, data, {
  //   //       headers: { Authorization: `Bearer ${token}` },
  //   //     })
  //   //     .then((data) => {
  //   //       if (data.data.status) {
  //   //         toast.success(data.data.message, {
  //   //           onClose: () => {
  //   //             navigate(-1);
  //   //           },
  //   //         });
  //   //       } else {
  //   //         toast.error(data.data.message);
  //   //       }
  //   //       if (data.data.status == false) {
  //   //         toast.error(data.data.message.confirmpassword);
  //   //       }
  //   //       setSpinner(false);
  //   //     })
  //   //     .catch((error) => {
  //   //       console.log(error, "error");
  //   //       setSpinner(false);
  //   //     });
  //   // }
  // };

  const handleFormSubmission = (e) => {
    setError({});
    console.log(e, "e");
    e.preventDefault();
    console.log(
      emailAddress,
      name,
      password,
      confirmPassword,
      userrole,
      mobileNumber,
      gender,
    );

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(emailAddress)) {
      setError({ ...error, emailAdressError: true });
    }
    if (!name) {
      setError({ ...error, nameError: true });
    }
    if (
      !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i.test(
        password,
      )
    ) {
      setError({ ...error, passwordError: true });
    }
    if (
      !/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/i.test(
        confirmPassword,
      )
    ) {
      setError({ ...error, confirmPasswordError: true });
    }
    if (password !== confirmPassword) {
      // setPasswordMatchError("Password and confirm password does not match");
      setError({ ...error, passwordMisMatch: true });
    }
    if (!userrole) {
      // setUserRoleError("Please select userrole");
      setError({ ...error, notUserRole: true });
    }
    // if (!/^[6-9]\d{10}$/.test(mobileNumber)) {
    if (!/^[6789]\d{9}$/.test(mobileNumber)) {
      // setMobileNumberError("Please enter valid mobile number");
      setError({ ...error, noMobileNo: true });
    }
    if (!gender) {
      // setGenderError("Please select gender");
      setError({ ...error, noGenderSelected: true });
    }
    console.log(error);
    if (Object.keys(error).length > 0) {
      return;
    }
  };

  return (
    <div>
      <CContainer>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardBody className="p-4">
                <CForm className="row g-3" onSubmit={handleFormSubmission}>
                  <h3>Users</h3>
                  <hr />

                  <CCol md={6}>
                    <CFormLabel
                      htmlFor="emailaddress"
                      className="col-sm-12 col-form-label"
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
                    <p className="text-danger">
                      {error.emailAdressError &&
                        "Please enter valid email address"}
                    </p>
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
                        var nameReg = /^[A-Za-z\s]*$/;
                        if (nameReg.test(e.target.value)) {
                          setName(e.target.value);
                        }
                      }}
                    />
                    <p className="text-danger">
                      {error.nameError && "Please enter valid name"}
                    </p>
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
                        autoComplete="password"
                        required
                        onChange={(e) => {
                          setPassword(e.target.value);
                        }}
                      />
                      {error.passwordError && (
                        <p className="text-danger">
                          {"Please enter strong password"}
                        </p>
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
                        autoComplete="Confirm password"
                        required
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                        }}
                      />
                      <p className="text-danger">
                        {error.confirmPasswordError &&
                          "Please enter strong password"}
                      </p>
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
                      placeholder="Mobile Number"
                      autoComplete="mobilenumber"
                      value={mobileNumber ? mobileNumber : ""}
                      onChange={(e) => {
                        var numberReg = /^[0-9]*$/;
                        if (numberReg.test(e.target.value)) {
                          setMobileNumber(e.target.value);
                        }
                      }}
                    />
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
                  </CCol>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    <button color="primary" type="submit">
                      Submit
                    </button>
                    {/* {spinner ? (
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                     
                    )} */}

                    <button color="primary" onClick={() => navigate(-1)}>
                      Back
                    </button>
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
