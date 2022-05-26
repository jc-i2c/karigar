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
  CFormTextarea,
} from "@coreui/react";

const AddCustomerSubTitle = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("karigar_token");
  const [validated, setValidated] = useState(false);
  const [spinner, setSpinner] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [allTitle, setAllTitle] = useState([]);
  const [title, setTitle] = useState("");
  const [subTitle, setSubTitle] = useState("");
  const [subTitleId, setSubTitleId] = useState("");
  const [description, setDescription] = useState("");

  const [titleError, setTitleError] = useState("");
  const [subTitleError, setSubTitleError] = useState("");
  const [descriptionError, setDescriptionError] = useState("");

  // Get all title.
  useEffect(() => {
    let unmounted = false;

    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/custsuptitle/getall`,
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
              titleid: record._id,
              title: record.title,
            });
          });
          setAllTitle(records);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
    return () => {
      unmounted = true;
    };
  }, []);

  // Edit sub title data.
  useEffect(() => {
    if (location.state.titleid) {
      setTitle(location.state.titleid);
    }
    if (location.state.subtitleid) {
      setIsEdit(true);
      setTitle(location.state.titleid);
      setSubTitleId(location.state.subtitleid);
      setSubTitle(location.state.subtitle);
      setDescription(location.state.description);
    }
  }, []);

  useEffect(() => {
    setTitleError("");
    setSubTitleError("");
    setDescriptionError("");
    setValidated(false);
  }, [title, subTitle, description]);

  function addSubTitle() {
    if (!title) {
      setValidated(true);
      setTitleError("Please select customer support title.");
    }
    if (!/^[a-zA-Z]/i.test(subTitle)) {
      setValidated(true);
      setSubTitleError("Please enter valid customer support sub title.");
    }
    if (!/^[a-zA-Z]/i.test(description)) {
      setValidated(true);
      setDescriptionError("Please enter valid descriptions.");
    } else {
      if (isEdit) {
        // Edit data
        setSpinner(true);
        var data = new FormData();
        data.append("custsuptitleid", title);
        data.append("custsupsubtitleid", subTitleId);
        data.append("subtitle", subTitle);
        data.append("description", description);
        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/custsupsubtitle/edit`,
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
        data.append("custsuptitleid", title);
        data.append("subtitle", subTitle);
        data.append("description", description);

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/custsupsubtitle/create`,
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
                  onSubmit={addSubTitle}
                >
                  <h3>Customer Support Sub Title</h3>
                  <hr />

                  <CCol md={6}>
                    <CFormLabel
                      htmlFor="title"
                      className="col-sm-12 col-form-label"
                    >
                      Select Customer Support Title
                    </CFormLabel>

                    <CFormSelect
                      required
                      id="title"
                      name="title"
                      value={title}
                      onChange={(e) => {
                        setTitle(e.target.value);
                      }}
                    >
                      <option defaultValue="select customer support title">
                        Select Customer Support Title
                      </option>

                      {allTitle.map((item) => (
                        <option key={item.titleid} value={item.titleid}>
                          {item.title}
                        </option>
                      ))}
                    </CFormSelect>

                    {titleError && <p className="text-danger">{titleError}</p>}
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel
                      htmlFor="subtitle"
                      className="col-sm-12 col-form-label"
                    >
                      Customer Support Sub Title
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="subtitle"
                      placeholder="Customer Support Sub Title"
                      autoComplete="subtitle"
                      required
                      value={subTitle ? subTitle : ""}
                      onChange={(e) => {
                        setSubTitle(e.target.value);
                      }}
                    />
                    {subTitleError && (
                      <p className="text-danger">{subTitleError}</p>
                    )}
                  </CCol>

                  <CCol md={12}>
                    <CFormLabel
                      htmlFor="description"
                      className="col-sm-12 col-form-label"
                    >
                      Description
                    </CFormLabel>
                    <CFormTextarea
                      type="textarea"
                      rows="6"
                      id="description"
                      placeholder="Description"
                      autoComplete="description"
                      required
                      value={description ? description : ""}
                      onChange={(e) => {
                        setDescription(e.target.value);
                      }}
                    />
                    {descriptionError && (
                      <p className="text-danger">{descriptionError}</p>
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
                          addSubTitle();
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

export default AddCustomerSubTitle;
