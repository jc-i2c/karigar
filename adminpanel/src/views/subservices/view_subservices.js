import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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

const ViewSubServices = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("karigar_token");

  const [subServices, setSubServices] = useState([]);
  const [servicesId, setServiceId] = useState("");

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

  useEffect(() => {}, [servicesId]);

  useEffect(() => {
    let unmounted = false;
    if (location.state) {
      setServiceId(location.state.serviceid);
      if (servicesId) {
        if (roleName == "ADMIN") {
          let data = new FormData();
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
                    servicename: record.servicesid.servicename,
                    servicesid: record.servicesid._id,
                    subservicename: record.subservicename,
                    subserviceimage: record.subserviceimage,
                    createdAt: record.createdAt,
                    updatedAt: record.updatedAt,
                  });
                });
                setSubServices(records);
              }
            })
            .catch((error) => {
              console.log(error, "error");
            });
        } else {
          let data = new FormData();
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
              const records = [];
              if (data.data.data) {
                data.data.data.map((record) => {
                  console.log(record, "record");
                  records.push({
                    subserviceid: record._id,
                    servicename: record.servicesid.servicename,
                    servicesid: record.servicesid._id,
                    subservicename: record.subservicename,
                    subserviceimage: record.subserviceimage,
                    createdAt: record.createdAt,
                    updatedAt: record.updatedAt,
                  });
                });
                setSubServices(records);
              }
            })
            .catch((error) => {
              console.log(error, "error");
            });
        }
      }
      // else {
      //   navigate("/services");
      // }
    } else {
      navigate("/services");
    }
    return () => {
      unmounted = true;
    };
  }, [roleName]);

  function deleteSubServices(subServiceId) {
    setOpenAlertBox(false);

    let data = new FormData();
    data.append("subservicesid", subServiceId);

    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/subServices/delete`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((data) => {
        if (data.data.status) {
          toast.success(data.data.message);
          let newServciesData = subServices.filter(
            (item) => item.subserviceid !== subServiceId,
          );
          setSubServices(newServciesData);
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
            <div>Sub Services List</div>
            {roleName == "ADMIN" && (
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <CButton
                  color="primary"
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    navigate("/addsubservices", {
                      state: {
                        servicesid: servicesId,
                      },
                    });
                  }}
                >
                  Add Sub Services
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
                  <CTableHeaderCell>Sub Service Name</CTableHeaderCell>
                  <CTableHeaderCell>Sub Service Image</CTableHeaderCell>
                  <CTableHeaderCell>CreateAT</CTableHeaderCell>
                  <CTableHeaderCell>UpdateAT</CTableHeaderCell>

                  {roleName == "ADMIN" && (
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  )}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {subServices.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>
                      <div>{item.servicename}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.subservicename}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        {item.subserviceimage ? (
                          <img
                            style={{
                              alignItems: "center",
                              height: "50px",
                              width: "50px",
                              borderRadius: "50%",
                            }}
                            src={
                              `${process.env.REACT_APP_PROFILEPIC}` +
                              item.subserviceimage
                            }
                            alt={item.subserviceimage}
                          />
                        ) : (
                          <img
                            src={
                              `${process.env.REACT_APP_PROFILEPIC}` + "fiximage"
                            }
                            alt={"fiximage"}
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
                      <div>{item.createdAt}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.updatedAt}</div>
                    </CTableDataCell>

                    {roleName == "ADMIN" && (
                      <CTableDataCell>
                        <EditIcon
                          variant="contained"
                          color="inherit"
                          onClick={() => {
                            navigate("/addsubservices", {
                              state: {
                                servicesid: item.servicesid,
                                subserviceid: item.subserviceid,
                                subservicename: item.subservicename,
                                subserviceimage: item.subserviceimage,
                              },
                            });
                          }}
                        />
                        <DeleteIcon
                          variant="contained"
                          color="inherit"
                          onClick={() => {
                            setOpenAlertBox(true);
                            setDeleteTitle(item.subservicename);
                            setDeleteItemId(item.subserviceid);
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
                        deleteSubServices(deleteItemId);
                      }}
                    >
                      Delete
                    </CButton>
                  </CModalFooter>
                </CModal>
              </template>
            )}
            {/* ---------------------Close Delete Dialog Box---------------------------------- */}
            <br />
          </CCardBody>
          <ToastContainer />
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ViewSubServices;
