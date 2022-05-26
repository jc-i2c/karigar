import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { v4 as uuidv4 } from "uuid";

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
  CFormTextarea,
} from "@coreui/react";

const ServiceProvider = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("karigar_token");
  const [validated, setValidated] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [imagePath, setImagePath] = useState("");
  const initialState = { alt: "", src: "" };

  const [allServiceProvider, setAllServiceProvider] = useState([]);
  const [allServices, setAllServices] = useState([]);
  const [allSubServices, setAllSubServices] = useState([]);

  const [textBox, setTextBox] = useState([]);

  const [servicesProviderId, setServiceProviderId] = useState("");
  const [serProEditId, setSerProEditId] = useState("");
  const [servicesId, setServicesId] = useState("");
  const [subServicesId, setSubServicesId] = useState("");
  const [price, setPrice] = useState("");
  const [descripation, setDescripation] = useState("");
  const [name, setName] = useState("");
  const [uploadImage, setUploadImage] = useState("");

  // Error state
  const [serviceProviderError, setServiceProviderError] = useState("");
  const [servicesError, setServicesError] = useState("");
  const [subServiceError, setSubServiceError] = useState("");
  const [priceError, setPriceError] = useState("");
  const [descripationError, setDescripationError] = useState("");
  const [imageError, setImageError] = useState("");
  const [nameError, setNameError] = useState("");

  const [roleName, setRoleName] = useState("");

  useEffect(() => {
    if (location.state) {
      setServiceProviderId(location.state.userid);
    }
  }, []);

  useEffect(() => {
    // Identify user type.
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/userrole/getpermission`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((data) => {
        setRoleName(data.data.data.roletag);
      })
      .catch((error) => {
        console.log(error, "error");
      });

    // Gel all service provider API.
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/user/allserviceprovider`,
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
              serviceproviderid: record._id,
              name: record.name,
            });
          });
          setAllServiceProvider(records);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });

    // Gel all services.
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
          setAllServices(records);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }, []);

  // Get all sub services.
  useEffect(() => {
    if (servicesId) {
      var data = new FormData();
      data.append("servicesid", servicesId);

      axios
        .post(
          `${process.env.REACT_APP_APIURL}/karigar/subservices/allsubservices`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((data) => {
          if (data.data.data) {
            const records = [];
            data.data.data.map((record) => {
              records.push({
                subserviceid: record._id,
                subservicename: record.subservicename,
              });
            });
            setAllSubServices(records);
          } else {
            // toast.error(data.data.message);
          }
        })
        .catch((error) => {
          console.log(error, "error");
        });
    }
  }, [servicesId]);

  // Edit data.
  useEffect(() => {
    if (location.state.serviceproviderid) {
      setIsEdit(true);
      setSerProEditId(location.state.serviceproviderid);
      setServiceProviderId(location.state.userid);
      setName(location.state.name);
      setDescripation(location.state.description);
      setUploadImage(location.state.image);
      setSubServicesId(location.state.subserviceid);
      setServicesId(location.state.servicesid);
      setPrice(location.state.price);
      setTextBox(location.state.servicedetails || []);
    }
  }, [location.state]);

  // Handle file.
  const fileHandle = (e) => {
    e.preventDefault();
    var uploadImage = e.target.files[0];
    setUploadImage(uploadImage);

    const { files } = e.target;
    const fileValue = files.length
      ? URL.createObjectURL(uploadImage)
      : initialState;
    setImagePath(fileValue);
  };

  // Error state empty.
  useEffect(() => {
    setServiceProviderError("");
    setServicesError("");
    setSubServiceError("");
    setPriceError("");
    setDescripationError("");
    setNameError("");
    setImageError("");
    setValidated(false);
  }, [
    servicesProviderId,
    servicesId,
    subServicesId,
    price,
    descripation,
    name,
    uploadImage,
  ]);

  // Service provider create & edit.
  function serviceProvider() {
    if (!servicesProviderId) {
      setValidated(true);
      setServiceProviderError("Please select service provider");
    }
    if (!servicesId) {
      setValidated(true);
      setServicesError("Please select service");
    }
    if (!subServicesId) {
      setValidated(true);
      setSubServiceError("Please select sub service");
    }
    if (!/^[0-9]/i.test(price)) {
      setValidated(true);
      setPriceError("Enter valid price (Only Number)");
    }
    if (!/^[a-zA-Z]/i.test(descripation)) {
      setValidated(true);
      setDescripationError("Please enter valid descripation");
    }
    if (!/^[a-zA-Z]/i.test(name)) {
      setValidated(true);
      setNameError("Please enter valid name");
    }
    if (!uploadImage) {
      setValidated(true);
      setImageError("Please select image");
    } else {
      setSpinner(true);
      if (isEdit) {
        // Edit data
        var data = new FormData();
        data.append("serviceproviderid", serProEditId);
        data.append("userid", servicesProviderId);
        data.append("name", name);
        data.append("description", descripation);
        data.append("subserviceid", subServicesId);
        data.append("price", price);
        data.append("image", uploadImage);
        data.append("servicedetails", JSON.stringify(textBox));

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/serviceprovider/edit`,
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
        // Add new data
        var data = new FormData();
        data.append("name", name);
        data.append("description", descripation);
        data.append("userid", servicesProviderId);
        data.append("subserviceid", subServicesId);
        data.append("price", price);
        data.append("image", uploadImage);
        data.append("servicedetails", JSON.stringify(textBox));

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/serviceprovider/create`,
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

  function addTextControll() {
    if (textBox.length === 0) {
      setTextBox([{ id: uuidv4(), name: "", value: "" }]);
    } else {
      setTextBox([...textBox, { id: uuidv4(), name: "", value: "" }]);
    }
  }

  function delTextControll(selectedInputBoxId) {
    const filteredBoxes = textBox.filter(
      (item) => item.id !== selectedInputBoxId,
    );
    setTextBox(filteredBoxes);
  }

  const updateValue = (id, fieldName, value) => {
    const updatedState = textBox.map((item, index) => {
      if (item.id === id) {
        return {
          ...item,
          [fieldName]: value,
        };
      } else {
        return item;
      }
    });
    setTextBox(updatedState);
  };

  return (
    <div>
      <CContainer>
        <CRow>
          <CCol sm="12">
            <CCard>
              <CCardBody className="p-4">
                <CForm
                  className="row g-6"
                  noValidate
                  validated={validated}
                  onSubmit={serviceProvider}
                >
                  <h3>Service Provider</h3>
                  <hr />

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="serviceprovider"
                      className="col-sm-12 col-form-label"
                    >
                      Service Provider
                    </CFormLabel>

                    <CFormSelect
                      required
                      id="serviceprovider"
                      name="serviceprovider"
                      value={servicesProviderId}
                      disabled={roleName !== "ADMIN"}
                      onChange={(e) => {
                        setServiceProviderId(e.target.value);
                      }}
                    >
                      <option defaultValue="select services">
                        Service Provider
                      </option>

                      {allServiceProvider.map((item) => (
                        <option
                          key={item.serviceproviderid}
                          value={item.serviceproviderid}
                        >
                          {item.name}
                        </option>
                      ))}
                    </CFormSelect>

                    {serviceProviderError && (
                      <p className="text-danger">{serviceProviderError}</p>
                    )}
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="servicename"
                      className="col-sm-12 col-form-label"
                    >
                      Service
                    </CFormLabel>

                    <CFormSelect
                      required
                      id="servicesname"
                      name="servicesname"
                      value={servicesId}
                      onChange={(e) => {
                        setServicesId(e.target.value);
                      }}
                    >
                      <option defaultValue="select services">
                        Select Services
                      </option>

                      {allServices.map((servicesList) => (
                        <option
                          key={servicesList.serviceid}
                          value={servicesList.serviceid}
                        >
                          {servicesList.servicename}
                        </option>
                      ))}
                    </CFormSelect>

                    {servicesError && (
                      <p className="text-danger">{servicesError}</p>
                    )}
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="subservice"
                      className="col-sm-12 col-form-label"
                    >
                      Sub Service
                    </CFormLabel>
                    <CFormSelect
                      required
                      id="subservices"
                      name="subservices"
                      value={subServicesId}
                      onChange={(e) => {
                        setSubServicesId("");
                        setSubServicesId(e.target.value);
                      }}
                    >
                      <option value="" disabled>
                        Select Sub Services
                      </option>

                      {allSubServices.map((item) => (
                        <option
                          key={item.subserviceid}
                          value={item.subserviceid}
                        >
                          {item.subservicename}
                        </option>
                      ))}
                    </CFormSelect>

                    {subServiceError && (
                      <p className="text-danger">{subServiceError}</p>
                    )}
                  </CCol>

                  <CRow>
                    <CCol md={6}>
                      <CFormLabel
                        htmlFor="descripation"
                        className="col-sm-12 col-form-label"
                      >
                        Descripation
                      </CFormLabel>
                      <CFormTextarea
                        type="textarea"
                        rows="4"
                        id="descripation"
                        placeholder="Descripation"
                        autoComplete="descripation"
                        required
                        value={descripation ? descripation : ""}
                        onChange={(e) => {
                          setDescripation(e.target.value);
                        }}
                      />
                      {descripationError && (
                        <p className="text-danger">{descripationError}</p>
                      )}
                    </CCol>

                    <CCol md={6}>
                      <CRow>
                        <CCol md={6}>
                          <CFormLabel
                            htmlFor="price"
                            className="col-sm-12 col-form-label"
                          >
                            Service Price
                          </CFormLabel>
                          <CFormInput
                            type="text"
                            id="price"
                            placeholder="Service Price"
                            autoComplete="price"
                            required
                            value={price ? price : ""}
                            onChange={(e) => {
                              var priceReg = /^[0-9]*\.?[0-9]*$/;
                              if (priceReg.test(e.target.value)) {
                                setPrice(e.target.value);
                              }
                            }}
                          />
                          {priceError && (
                            <p className="text-danger">{priceError}</p>
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
                              var nameReg = /^[A-Za-z\s]*$/;
                              if (nameReg.test(e.target.value)) {
                                setName(e.target.value);
                              }
                            }}
                          />
                          {nameError && (
                            <p className="text-danger">{nameError}</p>
                          )}
                        </CCol>
                      </CRow>

                      <CRow>
                        <CCol md={9}>
                          <CFormLabel
                            htmlFor="Image"
                            className="col-sm-12 col-form-label"
                          >
                            Image
                          </CFormLabel>

                          <CFormInput
                            type="file"
                            placeholder="Image"
                            autoComplete="Image"
                            id="Image"
                            required
                            onChange={(e) => {
                              fileHandle(e);
                            }}
                          />
                          {imageError && (
                            <p className="text-danger">{imageError}</p>
                          )}
                        </CCol>

                        <CCol md={3}>
                          <br />
                          {imagePath ? (
                            <img
                              src={imagePath}
                              alt={imagePath}
                              style={{
                                height: "80px",
                                width: "80px",
                              }}
                            />
                          ) : uploadImage ? (
                            <img
                              src={
                                `${process.env.REACT_APP_PROFILEPIC}` +
                                uploadImage
                              }
                              alt={uploadImage}
                              style={{
                                height: "80px",
                                width: "80px",
                              }}
                            />
                          ) : (
                            <img
                              style={{
                                height: "80px",
                                width: "80px",
                              }}
                            />
                          )}
                        </CCol>
                      </CRow>
                    </CCol>
                  </CRow>

                  <br />
                  <br />
                  <br />
                  <br />
                  <div>
                    <CRow md={12}>
                      <CCol md={2}>
                        <CFormLabel
                          htmlFor="servicedetails"
                          className="col-sm-12 col-form-label"
                        >
                          Add Service Details
                        </CFormLabel>
                      </CCol>
                      <CCol md={4}>
                        <AddCircleOutline
                          onClick={() => {
                            addTextControll();
                          }}
                        />
                      </CCol>
                    </CRow>
                    {textBox &&
                      textBox.map((item, index) => {
                        return (
                          <CCol md={12} key={item.id}>
                            <CRow>
                              <CCol md={3}>
                                <CFormLabel
                                  htmlFor="keyname"
                                  className="col-sm-12 col-form-label"
                                >
                                  Key Name
                                </CFormLabel>
                                <CFormInput
                                  type="text"
                                  id="keyname"
                                  placeholder="Key Name"
                                  autoComplete="keyname"
                                  required
                                  value={item.name}
                                  onChange={(e) => {
                                    var nameReg = /^[A-Za-z\s]*$/;
                                    if (nameReg.test(e.target.value)) {
                                      updateValue(
                                        item.id,
                                        "name",
                                        e.target.value,
                                      );
                                    }
                                  }}
                                />
                              </CCol>
                              <CCol md={3}>
                                <CFormLabel
                                  htmlFor="keyvalue"
                                  className="col-sm-12 col-form-label"
                                >
                                  Key Value
                                </CFormLabel>
                                <CFormInput
                                  type="text"
                                  id="keyvalue"
                                  placeholder="key Value"
                                  autoComplete="keyvalue"
                                  required
                                  value={item.value}
                                  onChange={(e) => {
                                    updateValue(
                                      item.id,
                                      "value",
                                      e.target.value,
                                    );
                                  }}
                                />
                              </CCol>
                              <CCol md={3}>
                                <HighlightOffIcon
                                  onClick={() => {
                                    delTextControll(item.id);
                                  }}
                                />
                              </CCol>
                            </CRow>
                          </CCol>
                        );
                      })}
                  </div>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    {spinner ? (
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <CButton
                        color="primary"
                        onClick={() => {
                          serviceProvider();
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

export default ServiceProvider;
