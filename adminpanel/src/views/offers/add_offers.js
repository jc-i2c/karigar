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

  const [validated, setValidated] = useState(false);

  const [spinner, setSpinner] = useState(false);

  const [isEdit, setIsEdit] = useState(false);
  const [offerId, setOfferId] = useState("");
  const [servicesId, setServicesId] = useState("");
  const [subServicesId, setSubServicesId] = useState("");
  const [servicesProviderId, setServicesProviderId] = useState("");
  const [currentPrice, setCurrentPrice] = useState("");
  const [actualPrice, setActualPrice] = useState("");

  const [allServices, setAllServices] = useState([]);
  const [allSubServices, setAllSubServices] = useState([]);
  const [allServiceProvider, setAllServiceProvider] = useState([]);

  // Error state
  const [servicesError, setServicesError] = useState("");
  const [subServiceError, setSubServiceError] = useState("");
  const [ServicesProviderError, setServicesProviderError] = useState("");
  const [currentPriceError, setCurrentPriceError] = useState("");
  const [actualPriceError, setActualPriceError] = useState("");

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
  }, []);

  useEffect(() => {
    // Get all services.
    if (roleName == "ADMIN") {
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
    } else {
      axios
        .post(
          `${process.env.REACT_APP_APIURL}/karigar/serviceprovider/serviceslist`,
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
                serviceid: record.subserviceid.servicesid._id,
                servicename: record.subserviceid.servicesid.servicename,
              });
            });
            setAllServices(records);
          }
        })
        .catch((error) => {
          console.log(error, "error");
        });
    }
  }, [roleName]);

  // Get all sub services.
  useEffect(() => {
    if (servicesId && roleName) {
      if (roleName == "ADMIN") {
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
      } else {
        var data = new FormData();
        data.append("servicesid", servicesId);

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/serviceprovider/subserviceslist`,
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
            }
          })
          .catch((error) => {
            console.log(error, "error");
          });
      }
    }
  }, [servicesId, roleName]);

  // Get all service provider.
  useEffect(() => {
    if (subServicesId && roleName) {
      if (roleName == "ADMIN") {
        var data = new FormData();
        data.append("subserviceid", subServicesId);

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/serviceprovider/all`,
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
                  serviceproviderid: record._id,
                  serviceprovidername: record.name,
                });
              });
              setAllServiceProvider(records);
            } else {
              // toast.error(data.data.message);
            }
          })
          .catch((error) => {
            console.log(error, "error");
          });
      } else {
        var data = new FormData();
        data.append("subserviceid", subServicesId);

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/serviceprovider/getproviderlist`,
            data,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )
          .then((data) => {
            if (data.data.data) {
              const records = [];
              records.push({
                serviceproviderid: data.data.data._id,
                serviceprovidername: data.data.data.name,
              });
              setAllServiceProvider(records);
            }
          })
          .catch((error) => {
            console.log(error, "error");
          });
      }
    }
  }, [subServicesId, roleName]);

  // Error state empty.
  useEffect(() => {
    setServicesError("");
    setSubServiceError("");
    setServicesProviderError("");
    setCurrentPriceError("");
    setActualPriceError("");
    setValidated(false);
  }, [
    servicesId,
    subServicesId,
    servicesProviderId,
    currentPrice,
    actualPrice,
  ]);

  // Edit offers.
  useEffect(() => {
    if (location.state) {
      setIsEdit(true);
      setOfferId(location.state.offerid);
      setServicesId(location.state.servicesid);
      setSubServicesId(location.state.subserviceid);
      setServicesProviderId(location.state.serviceproviderid);
      setCurrentPrice(location.state.currentprice);
      setActualPrice(location.state.actualprice);
    }
  }, []);

  // Add and edit offers.
  function addOffers() {
    if (!servicesId) {
      setValidated(true);
      setServicesError("Please select services");
    }
    if (!subServicesId) {
      setValidated(true);
      setSubServiceError("Please select sub services");
    }
    if (!servicesProviderId) {
      setValidated(true);
      setServicesProviderError("Please select services provider");
    }
    if (!/^[0-9]/i.test(currentPrice)) {
      setValidated(true);
      setCurrentPriceError("Enter valid price (Only Number)");
    }
    if (!/^[0-9]/i.test(actualPrice)) {
      setValidated(true);
      setActualPriceError("Enter valid price (Only Number)");
    } else {
      setSpinner(true);
      if (isEdit) {
        // Edit offers.
        var data = new FormData();
        data.append("offerid", offerId);
        data.append("subserviceid", subServicesId);
        data.append("serviceproviderid", servicesProviderId);
        data.append("currentprice", currentPrice);
        data.append("actualprice", actualPrice);

        axios
          .post(`${process.env.REACT_APP_APIURL}/karigar/offer/update`, data, {
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
              toast.warning(data.data.message);
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
        data.append("subserviceid", subServicesId);
        data.append("serviceproviderid", servicesProviderId);
        data.append("currentprice", currentPrice);
        data.append("actualprice", actualPrice);

        axios
          .post(`${process.env.REACT_APP_APIURL}/karigar/offer/create`, data, {
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
              toast.warning(data.data.message);
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
                  onSubmit={addOffers}
                >
                  <h3>Offers</h3>
                  <hr />

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="services"
                      className="col-sm-12 col-form-label"
                    >
                      Select Service
                    </CFormLabel>
                    <CFormSelect
                      required
                      type="text"
                      id="services"
                      name="services"
                      value={servicesId && servicesId}
                      onChange={(e) => {
                        setServicesId("");
                        setSubServicesId("");
                        setServicesProviderId("");
                        setAllSubServices([]);
                        setAllServiceProvider([]);
                        setServicesId(e.target.value);
                      }}
                    >
                      <option value="" disabled>
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

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="subservices"
                      className="col-sm-12 col-form-label"
                    >
                      Sub Service
                    </CFormLabel>
                    <CFormSelect
                      required
                      id="subservices"
                      name="subservices"
                      value={subServicesId && subServicesId}
                      onChange={(e) => {
                        setSubServicesId("");
                        setServicesProviderId("");
                        setAllServiceProvider([]);
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

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="servicename"
                      className="col-sm-12 col-form-label"
                    >
                      Service Provider
                    </CFormLabel>
                    <CFormSelect
                      required
                      id="servicesprovider"
                      name="servicesprovider"
                      value={servicesProviderId && servicesProviderId}
                      onChange={(e) => {
                        setServicesProviderId("");
                        setServicesProviderId(e.target.value);
                      }}
                    >
                      <option value="" disabled>
                        Select Service Provider
                      </option>

                      {allServiceProvider.map((item) => (
                        <option
                          key={item.serviceproviderid}
                          value={item.serviceproviderid}
                        >
                          {item.serviceprovidername}
                        </option>
                      ))}
                    </CFormSelect>

                    {ServicesProviderError && (
                      <p className="text-danger">{ServicesProviderError}</p>
                    )}
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="text"
                      className="col-sm-12 col-form-label"
                    >
                      Current Price
                    </CFormLabel>
                    <CFormInput
                      id="currentprice"
                      placeholder="Current Price"
                      autoComplete="currentprice"
                      required
                      value={currentPrice ? currentPrice : ""}
                      onChange={(e) => {
                        var currentReg = /^[0-9]*\.?[0-9]*$/;
                        if (currentReg.test(e.target.value)) {
                          setCurrentPrice(e.target.value);
                        }
                      }}
                    />
                    {currentPriceError && (
                      <p className="text-danger">{currentPriceError}</p>
                    )}
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="text"
                      className="col-sm-12 col-form-label"
                    >
                      Actual Price
                    </CFormLabel>
                    <CFormInput
                      id="actualPrice"
                      placeholder="Actual Price"
                      autoComplete="actualPrice"
                      required
                      value={actualPrice}
                      onChange={(e) => {
                        var actualReg = /^[0-9]*\.?[0-9]*$/;
                        if (actualReg.test(e.target.value)) {
                          setActualPrice(e.target.value);
                        }
                      }}
                    />
                    {actualPriceError && (
                      <p className="text-danger">{actualPriceError}</p>
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
                          addOffers();
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
