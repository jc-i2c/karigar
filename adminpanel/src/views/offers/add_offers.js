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

const AddServices = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(localStorage.getItem("karigar_token"));
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

  // Get all sub services.
  useEffect(() => {

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
        const records = [];
        if (data.data.data) {

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
  }, [servicesId]);

  // Get all service provider
  useEffect(() => {

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
        const records = [];
        if (data.data.data) {

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
  }, [subServicesId]);

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
                  navigate("/offers");
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
                  navigate("/offers");
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
                      htmlFor="servicename"
                      className="col-sm-4 col-form-label"
                    >
                      Select Service
                    </CFormLabel>
                    <CFormSelect
                      required
                      id="services"
                      name="services"
                      value={servicesId}
                      onChange={(e) => {
                        setServicesId("");
                        setSubServicesId("");
                        setServicesProviderId("");
                        setAllSubServices([]);
                        setAllServiceProvider([]);
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

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="servicename"
                      className="col-sm-4 col-form-label"
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
                        setServicesProviderId("");
                        setAllServiceProvider([]);
                        setSubServicesId(e.target.value);
                      }}
                    >
                      <option value="" selected>
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
                      className="col-sm-4 col-form-label"
                    >
                      Service Provider
                    </CFormLabel>
                    <CFormSelect
                      required
                      id="servicesprovider"
                      name="servicesprovider"
                      value={servicesProviderId}
                      onChange={(e) => {
                        setServicesProviderId("");
                        setServicesProviderId(e.target.value);
                      }}
                    >
                      <option value="" selected>
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
                      htmlFor="email"
                      className="col-sm-4 col-form-label"
                    >
                      Current Price
                    </CFormLabel>
                    <CFormInput
                      type="number"
                      id="currentprice"
                      placeholder="Current Price"
                      autoComplete="currentprice"
                      required
                      value={currentPrice ? currentPrice : ""}
                      onChange={(e) => {
                        setCurrentPrice(e.target.value);
                      }}
                    />
                    {currentPriceError && (
                      <p className="text-danger">{currentPriceError}</p>
                    )}
                  </CCol>

                  <CCol md={4}>
                    <CFormLabel
                      htmlFor="actualprice"
                      className="col-sm-4 col-form-label"
                    >
                      Actual Price
                    </CFormLabel>
                    <CFormInput
                      type="number"
                      id="actualPrice"
                      placeholder="Actual Price"
                      autoComplete="actualPrice"
                      required
                      value={actualPrice ? actualPrice : ""}
                      onChange={(e) => {
                        setActualPrice(e.target.value);
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

export default AddServices;
