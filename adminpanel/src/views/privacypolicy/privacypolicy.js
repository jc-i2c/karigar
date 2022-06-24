import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  CFormTextarea,
} from "@coreui/react";

const PrivacyPolicy = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("karigar_token");
  const [validated, setValidated] = useState(false);
  const [spinner, setSpinner] = useState(false);

  // Edit Privacy Policy.
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [privacyPolicyId, setPrivacyPolicyId] = useState("");

  // Error state
  const [privacyPolicyError, setPrivacyPolicyError] = useState("");

  // Get Privacy Policy.
  useEffect(() => {
    let unmounted = false;

    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/privacypolicy/get`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((data) => {
        setPrivacyPolicyId(data.data.data._id);
        setPrivacyPolicy(data.data.data.privacypolicy);
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
    setPrivacyPolicyError("");

    setValidated(false);
  }, [privacyPolicy]);

  // Privacy Policy Details.
  function PrivacyPolicyDetails(e) {
    e.preventDefault();

    if (!/^[a-zA-Z]/i.test(privacyPolicy)) {
      setValidated(true);
      setPrivacyPolicyError("Please enter valid privacy policy details");
    } else {
      setSpinner(true);

      // Privacy Policy.
      var data = new FormData();
      data.append("privacypolicyid", privacyPolicyId);
      data.append("privacypolicy", privacyPolicy);

      axios
        .post(
          `${process.env.REACT_APP_APIURL}/karigar/privacypolicy/addupdate`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((data) => {
          if (data.data.status) {
            toast.success(data.data.message);
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
                  className="row g-3"
                  noValidate
                  validated={validated}
                  onSubmit={PrivacyPolicyDetails}
                >
                  <h3>Privacy Policy</h3>
                  <hr />

                  <CCol md={12}>
                    <CFormLabel
                      htmlFor="name"
                      className="col-sm-12 col-form-label"
                    >
                      Privacy Policy
                    </CFormLabel>
                    <CFormTextarea
                      type="textarea"
                      rows="15"
                      id="privacyPolicy"
                      placeholder="Privacy Policy"
                      autoComplete="privacyPolicy"
                      required
                      value={privacyPolicy ? privacyPolicy : ""}
                      onChange={(e) => {
                        setPrivacyPolicy(e.target.value);
                      }}
                    />
                    {privacyPolicyError && (
                      <p className="text-danger">{privacyPolicyError}</p>
                    )}
                  </CCol>

                  <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                    {spinner ? (
                      <div className="spinner-border" role="status">
                        <span className="visually-hidden">Loading...</span>
                      </div>
                    ) : (
                      <CButton color="primary" type="submit">
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

export default PrivacyPolicy;
