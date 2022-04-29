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
  CInputGroup,
  CInputGroupText,
  CRow,
  CButton,
} from "@coreui/react";

const AddServices = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(localStorage.getItem("karigar_token"));
  const [validated, setValidated] = useState(false);
  const [servicesName, setServicesName] = useState("");
  const [serviceImage, setServiceImage] = useState("");
  const [serviceNameError, setServiceNameError] = useState("");
  const [serviceImageError, setServiceImageError] = useState("");
  const [spinner, setSpinner] = useState(false);

  // Edit services code
  const [servicesId, setServicesId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const initialState = { alt: "", src: "" };

  useEffect(() => {
    setServiceNameError("");
    setServiceImageError("");
    setValidated(false);
  }, [servicesName, serviceImage]);

  useEffect(() => {
    if (location.state) {
      setIsEdit(true);
      setServicesId(location.state.serviceid);
      setServicesName(location.state.servicename);
      setServiceImage(location.state.serviceimage);
    }
  }, [servicesId]);

  // Handle image.
  const fileHandle = (e) => {
    e.preventDefault();
    var serviceImage = e.target.files[0];
    setServiceImage(serviceImage);

    const { files } = e.target;
    const fileValue = files.length
      ? URL.createObjectURL(serviceImage)
      : initialState;
    setImagePath(fileValue);
  };

  function AddServices() {
    if (!/^[a-zA-Z]+$/i.test(servicesName)) {
      setValidated(true);
      setServiceNameError("Please enter valid services name");
    }
    if (!serviceImage) {
      setValidated(true);
      setServiceImageError("Please provide service image");
    }
    setSpinner(true);
    if (isEdit) {
      // Edit data

      var data = new FormData();
      data.append("servicesid", servicesId);
      data.append("servicename", servicesName);
      data.append("serviceimage", serviceImage);

      axios
        .post(`${process.env.REACT_APP_APIURL}/karigar/services/edit`, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((data) => {
          if (data.data.status) {
            toast.success(data.data.message, {
              onClose: () => {
                navigate("/services");
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
      // Add new data
      var data = new FormData();
      data.append("servicename", servicesName);
      data.append("serviceimage", serviceImage);

      axios
        .post(`${process.env.REACT_APP_APIURL}/karigar/services/create`, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((data) => {
          if (data.data.status) {
            toast.success(data.data.message, {
              onClose: () => {
                navigate("/services");
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
                  className="row g-3 needs-validation"
                  noValidate
                  validated={validated}
                  onSubmit={AddServices}
                >
                  <h2>Services</h2>
                  <hr />

                  <CInputGroup className="mb-3">
                    <CInputGroupText>Services name</CInputGroupText>
                    <CFormInput
                      type="text"
                      id="servicesname"
                      placeholder="Service Name"
                      autoComplete="servicesname"
                      required
                      value={servicesName ? servicesName : ""}
                      onChange={(e) => {
                        setServicesName(e.target.value);
                      }}
                    />
                  </CInputGroup>
                  {serviceNameError && (
                    <p className="text-danger">{serviceNameError}</p>
                  )}

                  <CInputGroup className="mb-3">
                    {imagePath ? (
                      <img
                        src={imagePath}
                        alt={imagePath}
                        style={{
                          height: "80px",
                          width: "80px",
                        }}
                      />
                    ) : serviceImage ? (
                      <img
                        src={
                          `${process.env.REACT_APP_PROFILEPIC}` + serviceImage
                        }
                        alt={serviceImage}
                        style={{
                          height: "80px",
                          width: "80px",
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </CInputGroup>

                  <CInputGroup className="mb-3">
                    <CInputGroupText>Services Image</CInputGroupText>
                    <CFormInput
                      type="file"
                      placeholder="Service Name"
                      autoComplete="servicesimage"
                      id="servicesimage"
                      required
                      onChange={(e) => {
                        fileHandle(e);
                      }}
                    />
                  </CInputGroup>

                  {serviceImageError && (
                    <p className="text-danger">{serviceImageError}</p>
                  )}

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    {spinner ? (
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <CButton
                        color="primary"
                        onClick={() => {
                          AddServices();
                        }}
                      >
                        Submit
                      </CButton>
                    )}

                    <CButton
                      color="primary"
                      onClick={() => {
                        navigate("/services");
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
