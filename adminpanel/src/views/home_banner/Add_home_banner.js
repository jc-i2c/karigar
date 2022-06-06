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

const HomeBanner = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("karigar_token");
  const [spinner, setSpinner] = useState(false);
  const [validated, setValidated] = useState(false);

  const [bannerTitle, setBannerTitle] = useState("");
  const [bannerSubTitle, setBannerSubTitle] = useState("");
  const [bannerImage, setBannerImage] = useState("");

  const [BannerTitleError, setBannerTitleError] = useState("");
  const [bannerSubTitleError, setBannerSubTitleError] = useState("");
  const [bannerImageError, setBannerImageError] = useState("");

  // Edit banner
  const [bannerId, setBannerId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [imagePath, setImagePath] = useState("");
  const initialState = { alt: "", src: "" };

  useEffect(() => {
    setBannerTitleError("");
    setBannerImageError("");
    setBannerSubTitleError("");
    setValidated(false);
  }, [bannerTitle, bannerImage, bannerSubTitle]);

  useEffect(() => {
    if (location.state) {
      setIsEdit(true);
      setBannerId(location.state.bannerid);
      setBannerTitle(location.state.bannertitle);
      setBannerSubTitle(location.state.bannersubtitle);
      setBannerImage(location.state.bannerimage);
    }
  }, [bannerId]);

  // Handle image.
  const fileHandle = (e) => {
    e.preventDefault();
    var bannerImage = e.target.files[0];
    setBannerImage(bannerImage);

    const { files } = e.target;
    const fileValue = files.length
      ? URL.createObjectURL(bannerImage)
      : initialState;
    setImagePath(fileValue);
  };

  function addBanner() {
    if (!/^[a-zA-Z]/i.test(bannerTitle)) {
      setValidated(true);
      setBannerTitleError("Please enter valid banner title");
    }
    if (!/^[a-zA-Z]/i.test(bannerSubTitle)) {
      setValidated(true);
      setBannerSubTitleError("Please enter valid banner sub title");
    }
    if (!bannerImage) {
      setValidated(true);
      setBannerImageError("Please provide banner image");
    } else {
      setSpinner(true);

      if (isEdit) {
        // Edit new banner
        var data = new FormData();
        data.append("bannerid", bannerId);
        data.append("bannertitle", bannerTitle);
        data.append("bannersubtitle", bannerSubTitle);
        data.append("bannerimage", bannerImage);

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/dashboard/update`,
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
        // Add new banner
        var data = new FormData();
        data.append("bannertitle", bannerTitle);
        data.append("bannersubtitle", bannerSubTitle);
        data.append("bannerimage", bannerImage);

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/dashboard/create`,
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
                  onSubmit={addBanner}
                >
                  <h3>Home Banner</h3>
                  <hr />

                  <CCol md={6}>
                    <CFormLabel
                      htmlFor="email"
                      className="col-sm-6 col-form-label"
                    >
                      Home Banner Title
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="bannertitle"
                      placeholder="Home Banner Title"
                      autoComplete="bannertitle"
                      required
                      value={bannerTitle ? bannerTitle : ""}
                      onChange={(e) => {
                        setBannerTitle(e.target.value);
                      }}
                    />
                    {BannerTitleError && (
                      <p className="text-danger">{BannerTitleError}</p>
                    )}
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel
                      htmlFor="email"
                      className="col-sm-6 col-form-label"
                    >
                      Home Banner Sub Title
                    </CFormLabel>
                    <CFormInput
                      type="text"
                      id="bannersubtitle"
                      placeholder="Home Banner Sub Title"
                      autoComplete="bannersubtitle"
                      required
                      value={bannerSubTitle ? bannerSubTitle : ""}
                      onChange={(e) => {
                        setBannerSubTitle(e.target.value);
                      }}
                    />
                    {bannerSubTitleError && (
                      <p className="text-danger">{bannerSubTitleError}</p>
                    )}
                  </CCol>

                  <CCol md={6}>
                    <CFormLabel
                      htmlFor="email"
                      className="col-sm-4 col-form-label"
                    >
                      Home Banner Image
                    </CFormLabel>

                    <CFormInput
                      type="file"
                      placeholder="Banner Image"
                      autoComplete="bannerimage"
                      id="bannerimage"
                      required
                      onChange={(e) => {
                        fileHandle(e);
                      }}
                    />

                    {bannerImageError && (
                      <p className="text-danger">{bannerImageError}</p>
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
                    ) : bannerImage ? (
                      <img
                        src={
                          `${process.env.REACT_APP_PROFILEPIC}` + bannerImage
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
                          addBanner();
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

export default HomeBanner;
