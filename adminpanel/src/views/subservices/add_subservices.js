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

const AddSubServices = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(localStorage.getItem("karigar_token"));
  const [services, setServices] = useState([]);

  const [validated, setValidated] = useState(false);
  const [serviceId, setServiceId] = useState("");
  const [subServiceId, setSubServiceId] = useState("");
  const [subServicesName, setSubServicesName] = useState("");
  const [subServiceImage, setSubServiceImage] = useState("");
  const [isEdit, setIsEdit] = useState(false);

  const [serviceError, setServiceError] = useState("");
  const [serviceNameError, setServiceNameError] = useState("");
  const [serviceImageError, setServiceImageError] = useState("");
  const [spinner, setSpinner] = useState(false);

  const [imagePath, setImagePath] = useState("");
  const initialState = { alt: "", src: "" };

  // Get all services
  useEffect(() => {
    let unmounted = false;

    if (location.state) {
      setServiceId(location.state.servicesid);
    }

    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/services/all`,
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
              serviceid: record._id,
              servicename: record.servicename,
            });
          });
          setServices(records);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
    return () => {
      unmounted = true;
    };
  }, []);

  // Null error message.
  useEffect(() => {
    let unmounted = false;
    setServiceError("");
    setServiceNameError("");
    setServiceImageError("");
    setValidated(false);
    return () => {
      unmounted = true;
    };
  }, [serviceId, subServicesName, subServiceImage]);

  // Edit Sub services.
  useEffect(() => {
    let unmounted = false;

    if (location.state.subserviceid) {
      setIsEdit(true);
      setServiceId(location.state.servicesid);
      setSubServiceId(location.state.subserviceid);
      setSubServicesName(location.state.subservicename);
      setSubServiceImage(location.state.subserviceimage);
    }
    return () => {
      unmounted = true;
    };
  }, []);

  // Handle image.
  const fileHandle = (e) => {
    e.preventDefault();
    var subServiceImage = e.target.files[0];
    setSubServiceImage(subServiceImage);

    const { files } = e.target;
    const fileValue = files.length
      ? URL.createObjectURL(subServiceImage)
      : initialState;
    setImagePath(fileValue);
  };

  function addSubServices() {
    if (!serviceId) {
      setValidated(true);
      setServiceError("Please select services");
    }
    if (!/^[a-zA-Z]/i.test(subServicesName)) {
      setValidated(true);
      setServiceNameError("Please enter sub service title");
    }
    if (!subServiceImage) {
      setValidated(true);
      setServiceImageError("Please provide sub service image.");
    } else {
      setSpinner(true);
      if (isEdit) {
        // Edit sub services.
        var data = new FormData();
        data.append("servicesid", serviceId);
        data.append("subservicesid", subServiceId);
        data.append("subservicename", subServicesName);
        data.append("subserviceimage", subServiceImage);

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/subservices/edit`,
            data,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )
          .then((data) => {
            if (data.data.status) {
              toast.success(data.data.message, {
                onClose: () => {
                  navigate("/subservices", {
                    state: { serviceid: serviceId },
                  });
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
        // Add new sub services.
        var data = new FormData();
        data.append("servicesid", serviceId);
        data.append("subservicename", subServicesName);
        data.append("subserviceimage", subServiceImage);

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/subservices/create`,
            data,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )
          .then((data) => {
            if (data.data.status) {
              toast.success(data.data.message, {
                onClose: () => {
                  navigate("/subservices", {
                    state: { serviceid: serviceId },
                  });
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
                  onSubmit={addSubServices}
                >
                  <h3>Sub Services</h3>
                  <hr />

                  <CCol md={6}>
                    <CFormLabel
                      htmlFor="servicename"
                      className="col-sm-4 col-form-label"
                    >
                      Select Service
                    </CFormLabel>

                    <CFormSelect
                      required
                      id="servicesname"
                      name="servicesname"
                      value={serviceId}
                      onChange={(e) => {
                        setServiceId(e.target.value);
                      }}
                    >
                      <option defaultValue="select services">
                        Select Services
                      </option>

                      {services.map((servicesList) => (
                        <option
                          key={servicesList.serviceid}
                          value={servicesList.serviceid}
                        >
                          {servicesList.servicename}
                        </option>
                      ))}
                    </CFormSelect>

                    {serviceError && (
                      <p className="text-danger">{serviceError}</p>
                    )}
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel
                      htmlFor="Subservicename"
                      className="col-sm-6 col-form-label"
                    >
                      Sub Service Name
                    </CFormLabel>

                    <CFormInput
                      type="text"
                      placeholder="Sub Service Name"
                      autoComplete="subservicename"
                      id="subservicename"
                      required
                      value={subServicesName}
                      onChange={(e) => {
                        setSubServicesName(e.target.value);
                      }}
                    />

                    {serviceNameError && (
                      <p className="text-danger">{serviceNameError}</p>
                    )}
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel
                      htmlFor="email"
                      className="col-sm-4 col-form-label"
                    >
                      Sub Services Image
                    </CFormLabel>

                    <CFormInput
                      type="file"
                      autoComplete="subservicesimage"
                      id="subservicesimage"
                      required
                      onChange={(e) => {
                        fileHandle(e);
                      }}
                    />
                    {serviceImageError && (
                      <p className="text-danger">{serviceImageError}</p>
                    )}
                  </CCol>

                  <CCol md={6}>
                    {imagePath ? (
                      <img
                        src={imagePath}
                        alt={"Image not found"}
                        style={{
                          height: "80px",
                          width: "80px",
                        }}
                      />
                    ) : subServiceImage ? (
                      <img
                        src={
                          `${process.env.REACT_APP_PROFILEPIC}` +
                          subServiceImage
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
                          addSubServices();
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

export default AddSubServices;
