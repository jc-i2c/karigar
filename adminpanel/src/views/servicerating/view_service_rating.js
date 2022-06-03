import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import DeleteIcon from "@material-ui/icons/Delete";

import {
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CButton,
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const ViewServiceRating = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem("karigar_token");

  const [serviceRating, setServiceRating] = useState([]);

  const [openAlertBox, setOpenAlertBox] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteItemId, setDeleteItemId] = useState("");

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
        setRoleName(data.data.data.roletag);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }, []);

  useEffect(() => {
    if (roleName === "ADMIN") {
      axios
        .post(
          `${process.env.REACT_APP_APIURL}/karigar/servicerating/getall`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then((data) => {
          if (data.data.data) {
            const records = [];
            data.data.data.map((record) => {
              records.push({
                ratingid: record._id,
                customername: record.customerid.name,
                serviceprovideridname: record.serviceproviderid.name,
                rate: record.rate,
                description: record.description,
                createdAt: record.createdAt,
                updatedAt: record.updatedAt,
              });
            });
            setServiceRating(records);
          }
        })
        .catch((error) => {
          console.log(error, "error");
        });
    }
    if (roleName === "SERVICEPROVIDER") {
      axios
        .post(
          `${process.env.REACT_APP_APIURL}/karigar/servicerating/getservicerating`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then((data) => {
          if (data.data.data) {
            const records = [];
            data.data.data.map((record) => {
              records.push({
                ratingid: record._id,
                customername: record.customerid.name,
                serviceprovideridname: record.serviceproviderid.name,
                rate: record.rate,
                description: record.description,
                createdAt: record.createdAt,
                updatedAt: record.updatedAt,
              });
            });
            setServiceRating(records);
          }
        })
        .catch((error) => {
          console.log(error, "error");
        });
    }
  }, [roleName]);

  function deleteServiceRating(serviceRatingId) {
    setOpenAlertBox(false);

    let data = new FormData();
    data.append("servicerateid", serviceRatingId);

    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/servicerating/delete`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((data) => {
        if (data.data.status) {
          toast.success(data.data.message);

          let newServcieRatingData = serviceRating.filter(
            (item) => item.ratingid !== serviceRatingId,
          );

          setServiceRating(newServcieRatingData);
        } else {
          toast.error(data.data.message);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }

  return (
    <CRow>
      <CCol xs>
        <CCard className="mb-4">
          <CCardHeader className="mb-0 border fs-4 d-flex justify-content-between">
            <div>Service Rating List</div>
          </CCardHeader>
          <CCardBody>
            <CTable
              align="middle"
              className="mb-0 border"
              hover
              responsive
              columnfilter="true"
              columnsorter="true"
              itemsperpageselect="true"
              itemsperpage={5}
              pagination="true"
            >
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>Customer Name</CTableHeaderCell>
                  <CTableHeaderCell>Service Provider Name</CTableHeaderCell>
                  <CTableHeaderCell>Rate</CTableHeaderCell>
                  <CTableHeaderCell>Description</CTableHeaderCell>
                  <CTableHeaderCell>CreateAT</CTableHeaderCell>
                  <CTableHeaderCell>UpdateAT</CTableHeaderCell>
                  {roleName === "ADMIN" && (
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  )}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {serviceRating.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>
                      <div>{item.customername}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.serviceprovideridname}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.rate}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.description}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.createdAt}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.updatedAt}</div>
                    </CTableDataCell>

                    {roleName === "ADMIN" && (
                      <CTableDataCell>
                        <DeleteIcon
                          variant="contained"
                          color="inherit"
                          onClick={() => {
                            setOpenAlertBox(true);
                            setDeleteTitle(item.description);
                            setDeleteItemId(item.ratingid);
                          }}
                        />
                      </CTableDataCell>
                    )}
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            {/* ----------------------Open Delete Dialog Box---------------------------------- */}
            {openAlertBox && (
              <template>
                <CModal
                  visible={openAlertBox && openAlertBox}
                  alignment="center"
                  onClose={() => {
                    setOpenAlertBox(false);
                  }}
                >
                  <CModalHeader>
                    <CModalTitle>Are you sure want to delete?</CModalTitle>
                  </CModalHeader>
                  <CModalBody>{deleteTitle && deleteTitle}</CModalBody>
                  <CModalFooter>
                    <CButton
                      color="secondary"
                      onClick={() => {
                        setOpenAlertBox(false);
                      }}
                    >
                      Close
                    </CButton>
                    <CButton
                      color="primary"
                      onClick={() => {
                        deleteServiceRating(deleteItemId);
                      }}
                    >
                      Delete
                    </CButton>
                  </CModalFooter>
                </CModal>
              </template>
            )}
            {/* ---------------------Close Delete Dialog Box---------------------------------- */}
            <div className="d-md-flex pt-2 justify-content-md-end">
              <CButton color="primary" onClick={() => navigate(-1)}>
                Back
              </CButton>
            </div>
          </CCardBody>
          <ToastContainer />
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ViewServiceRating;
