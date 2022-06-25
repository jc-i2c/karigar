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
} from "@coreui/react";

const AddServices = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("karigar_token");
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

  function addServices(e) {
    e.preventDefault();

    if (!/^[a-zA-Z]/i.test(servicesName)) {
      setValidated(true);
      setServiceNameError("Please enter valid services name");
    }
    if (!serviceImage) {
      setValidated(true);
      setServiceImageError("Please provide service image");
    } else {
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
        // Add new data
        var data = new FormData();
        data.append("servicename", servicesName);
        data.append("serviceimage", serviceImage);

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/services/create`,
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
                  onSubmit={addServices}
                >
                  <h3>Services</h3>
                  <hr />

                  <CCol md={5}>
                    <CFormLabel
                      htmlFor="email"
                      className="col-sm-4 col-form-label"
                    >
                      Service Name
                    </CFormLabel>
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
                    {serviceNameError && (
                      <p className="text-danger">{serviceNameError}</p>
                    )}
                  </CCol>

                  <CCol md={5}>
                    <CFormLabel
                      htmlFor="email"
                      className="col-sm-4 col-form-label"
                    >
                      Services Image
                    </CFormLabel>

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

                    {serviceImageError && (
                      <p className="text-danger">{serviceImageError}</p>
                    )}
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
                    ) : serviceImage ? (
                      <img
                        src={
                          `${process.env.REACT_APP_PROFILEPIC}` + serviceImage
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
                      <CButton type="submit" color="primary">
                        Submit
                      </CButton>
                    )}

                    <CButton color="primary" onClick={() => navigate(-1)}>
                      Back
                    </CButton>
                  </div>
                </CForm>
                <ToastContainer
                  autoClose={`${process.env.REACT_APP_TOASTMESSAGETIME}`}
                />
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default AddServices;
