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

  const [token, setToken] = useState(localStorage.getItem("karigar_token"));
  const [validated, setValidated] = useState(false);

  const [spinner, setSpinner] = useState(false);

  // Edit services code
  const [isEdit, setIsEdit] = useState(false);
  const [servicesId, setServicesId] = useState("");
  const [allServices, setAllServices] = useState([]);
  const [allSubServices, setAllSubServices] = useState([]);

  // Error state
  const [servicesError, setServicesError] = useState("");

  // Gel all services.
  useEffect(() => {
    let unmounted = false;

    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/services/all`,
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
              serviceid: record._id,
              servicename: record.servicename,
            });
          });
          setAllServices(records);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }, []);

  // Get sub services
  useEffect(() => {
    let unmounted = false;

    var data = new FormData();
    data.append("servicesid", servicesId);

    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/subservices/allsubservices`,
        { data },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((data) => {
        const records = [];
        if (data.data.data) {
          data.data.data.map((record) => {
            records.push({
              subserviceid: record._id,
              subservicename: record.servicename,
            });
          });
          setAllSubServices(records);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }, [servicesId]);

  useEffect(() => {
    setServicesError("");
    setValidated(false);
  }, [servicesId]);

  useEffect(() => {
    if (location.state) {
      setIsEdit(true);
    }
  }, []);

  function addNewUsers() {
    if (!servicesId) {
      setValidated(true);
      setServicesError("Please select services");
    } else {
      if (isEdit) {
        // // Admin edit userdata.
        // var data = new FormData();
        // data.append("emailaddress", emailAddress);
        // data.append("name", name);
        // data.append("mobilenumber", mobileNumber);
        // data.append("gender", gender);
        // data.append("userid", userId);
        // axios
        //   .post(
        //     `${process.env.REACT_APP_APIURL}/karigar/user/edituserdata`,
        //     data,
        //     {
        //       headers: { Authorization: `Bearer ${token}` },
        //     },
        //   )
        //   .then((data) => {
        //     console.log(data, "data.data");
        //     if (data.data.status) {
        //       toast.success(data.data.message, {
        //         onClose: () => {
        //           navigate("/users");
        //         },
        //       });
        //     } else {
        //       toast.error(data.data.message);
        //     }
        //     setSpinner(false);
        //   })
        //   .catch((error) => {
        //     console.log(error, "error");
        //     setSpinner(false);
        //   });
      } else {
        // Add new users.
        var data = new FormData();
        data.append("serviceid", servicesId);

        axios
          .post(`${process.env.REACT_APP_APIURL}/karigar/user/signup`, data, {
            headers: { Authorization: `Bearer ${token}` },
          })
          .then((data) => {
            if (data.data.status) {
              toast.success(data.data.message, {
                onClose: () => {
                  navigate("/users");
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
                  onSubmit={addNewUsers}
                >
                  <h2>Service Offers</h2>
                  <hr />

                  <CCol md={3}>
                    <CFormSelect
                      required
                      id="services"
                      name="services"
                      value={servicesId}
                      onChange={(e) => {
                        setServicesId(e.target.value);
                      }}
                    >
                      <option value="" selected>
                        Selecet Services
                      </option>

                      {allServices.map((item) => (
                        <option key={item.serviceid} value={item.serviceid}>
                          {item.servicename}
                        </option>
                      ))}
                    </CFormSelect>

                    {servicesError && (
                      <p className="text-danger">{servicesError}</p>
                    )}
                  </CCol>

                  {/* <CCol md={6}>
                    <CFormLabel
                      htmlFor="emailaddress"
                      className="col-sm-4 col-form-label"
                    >
                      Email Address
                    </CFormLabel>
                    <CFormInput
                      type="emailaddress"
                      id="emailaddress"
                      placeholder="Email address"
                      autoComplete="emailaddress"
                      required
                      disabled
                      value={emailAddress ? emailAddress : ""}
                      onChange={(e) => {
                        setEmailAddress(e.target.value);
                      }}
                    />

                    {emailAdressError && (
                      <p className="text-danger">{emailAdressError}</p>
                    )}
                  </CCol> */}

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

                    <CButton
                      color="primary"
                      onClick={() => {
                        navigate("/users");
                      }}
                    >
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
