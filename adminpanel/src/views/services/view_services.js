import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
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

const ViewServices = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("karigar_token");

  const [services, setServices] = useState([]);
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

  // Get all services based on userrole
  useEffect(() => {
    if (roleName === "ADMIN") {
      axios
        .post(
          `${process.env.REACT_APP_APIURL}/karigar/services/all`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then((data) => {
          if (data.data.data) {
            const records = [];
            data.data.data.map((record) => {
              records.push({
                serviceid: record._id,
                servicename: record.servicename,
                serviceimage: record.serviceimage,
                createdAt: record.createdAt,
                updatedAt: record.updatedAt,
              });
            });
            setServices(records);
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
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then((data) => {
          if (data.data.data) {
            const records = [];
            data.data.data.map((record) => {
              records.push({
                serviceid: record.subserviceid.servicesid._id,
                servicename: record.subserviceid.servicesid.servicename,
                serviceimage: record.subserviceid.servicesid.serviceimage,
                createdAt: record.subserviceid.servicesid.createdAt,
                updatedAt: record.subserviceid.servicesid.updatedAt,
              });
            });
            setServices(records);
          }
        })
        .catch((error) => {
          console.log(error, "error");
        });
    }
  }, [roleName]);

  function deleteServices(serviceId) {
    setOpenAlertBox(false);

    let data = new FormData();
    data.append("servicesid", serviceId);

    axios
      .post(`${process.env.REACT_APP_APIURL}/karigar/services/delete`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        if (data.data.status) {
          toast.success(data.data.message);

          let newServciesData = services.filter(
            (item) => item.serviceid !== serviceId,
          );

          setServices(newServciesData);
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
            <div>Services</div>
            {roleName === "ADMIN" && (
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton
                  color="primary"
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    navigate("/addservices");
                  }}
                >
                  Add Services
                </CButton>
              </div>
            )}
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
                  <CTableHeaderCell>Service Name</CTableHeaderCell>
                  <CTableHeaderCell>Service Image</CTableHeaderCell>
                  <CTableHeaderCell>View Subservices</CTableHeaderCell>
                  {/* <CTableHeaderCell>CreateAT</CTableHeaderCell>
                  <CTableHeaderCell>UpdateAT</CTableHeaderCell> */}
                  {roleName === "ADMIN" && (
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  )}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {services.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>
                      <div>{item.servicename}</div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <div>
                        {item.serviceimage ? (
                          <img
                            src={
                              `${process.env.REACT_APP_PROFILEPIC}` +
                              item.serviceimage
                            }
                            alt={"Image not found"}
                            style={{
                              height: "50px",
                              width: "50px",
                              borderRadius: "50%",
                            }}
                          />
                        ) : (
                          <img
                            src={
                              `${process.env.REACT_APP_PROFILEPIC}` + "fiximage"
                            }
                            alt={"Image not found"}
                            style={{
                              height: "50px",
                              width: "50px",
                              borderRadius: "50%",
                            }}
                          />
                        )}
                      </div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <VisibilityIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          navigate("/subservices", {
                            state: { serviceid: item.serviceid },
                          });
                        }}
                      />
                    </CTableDataCell>

                    {/* <CTableDataCell>
                      <div>{item.createdAt}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.updatedAt}</div>
                    </CTableDataCell> */}

                    {roleName === "ADMIN" && (
                      <CTableDataCell>
                        <EditIcon
                          variant="contained"
                          color="inherit"
                          onClick={() => {
                            navigate("/addservices", {
                              state: {
                                serviceid: item.serviceid,
                                servicename: item.servicename,
                                serviceimage: item.serviceimage,
                              },
                            });
                          }}
                        />

                        <DeleteIcon
                          variant="contained"
                          color="inherit"
                          onClick={() => {
                            setOpenAlertBox(true);
                            setDeleteTitle(item.servicename);
                            setDeleteItemId(item.serviceid);
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
                        deleteServices(deleteItemId);
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
              {roleName === "ADMIN" && (
                <CButton color="primary" onClick={() => navigate(-1)}>
                  Back
                </CButton>
              )}
            </div>
          </CCardBody>
          <ToastContainer
            autoClose={`${process.env.REACT_APP_TOASTMESSAGETIME}`}
          />
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ViewServices;
