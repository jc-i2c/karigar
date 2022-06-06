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
  const [spinner, setSpinner] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [custSupTitleId, setcustSupTitleId] = useState("");
  const [title, setTitle] = useState("");

  const [titleError, setTitleError] = useState("");

  useEffect(() => {
    setTitleError("");
    setValidated(false);
  }, [title]);

  useEffect(() => {
    if (location.state) {
      setIsEdit(true);
      setcustSupTitleId(location.state.custsuptitleid);
      setTitle(location.state.title);
    }
  }, [custSupTitleId]);

  function addServices() {
    if (!/^[a-zA-Z]/i.test(title)) {
      setValidated(true);
      setTitleError("Please enter valid customer support title");
    } else {
      setSpinner(true);

      if (isEdit) {
        // Edit data
        var data = new FormData();
        data.append("custsuptitleid", custSupTitleId);
        data.append("title", title);

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/custsuptitle/edit`,
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
        data.append("title", title);

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/custsuptitle/create`,
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
                  <h3>Customer Support</h3>
                  <hr />

                  <CCol md={6}>
                    <CFormLabel
                      htmlFor="email"
                      className="col-sm-12 col-form-label"
                    >
                      Customer Support Title
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="customersupporttitle"
                      placeholder="Customer Support Title"
                      autoComplete="customersupporttitle"
                      required
                      value={title ? title : ""}
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    />
                    {titleError && <p className="text-danger">{titleError}</p>}
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
                          addServices();
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
