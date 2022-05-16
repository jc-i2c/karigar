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
  CFormSwitch,
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const ViewServiceProvider = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("karigar_token");
  const [visible, setVisible] = useState(false);

  const [serviceProvider, setServiceProvider] = useState([]);
  const [detailsData, setDetailsData] = useState([]);
  const [title, setTitle] = useState("");

  const [serviceProviderId, setServiceProviderId] = useState("");

  const [openAlertBox, setOpenAlertBox] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteItemId, setDeleteItemId] = useState("");

  const [openDesBox, setOpenDesBox] = useState(false);
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
    if (roleName == "ADMIN") {
      axios
        .post(
          `${process.env.REACT_APP_APIURL}/karigar/serviceprovider/getall`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then((data) => {
          const records = [];
          data.data.data.map((record) => {
            records.push({
              serviceproviderid: record._id,
              name: record.name,
              description: record.description,
              image: record.image,
              userid: record.userid,
              subserviceid: record.subserviceid,
              price: record.price,
              isactive: record.isactive,
              servicedetails: record.servicedetails,
            });
          });
          setServiceProvider(records);
        })
        .catch((error) => {
          console.log(error, "error");
        });
    } else {
      axios
        .post(
          `${process.env.REACT_APP_APIURL}/karigar/serviceprovider/ownlist`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then((data) => {
          const records = [];
          data.data.data.map((record) => {
            setServiceProviderId(record.userid._id);
            records.push({
              serviceproviderid: record._id,
              name: record.name,
              description: record.description,
              image: record.image,
              userid: record.userid,
              subserviceid: record.subserviceid,
              price: record.price,
              isactive: record.isactive,
              servicedetails: record.servicedetails,
            });
          });
          setServiceProvider(records);
        })
        .catch((error) => {
          console.log(error, "error");
        });
    }
  }, [roleName]);

  function deleteServiceProvider(deleteItemId) {
    setOpenAlertBox(false);

    let data = new FormData();
    data.append("servicesproviderid", deleteItemId);

    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/serviceprovider/delete`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((data) => {
        if (data.data.status) {
          toast.success(data.data.message);

          let newServciesData = serviceProvider.filter(
            (item) => item.serviceproviderid !== deleteItemId,
          );

          setServiceProvider(newServciesData);
        } else {
          toast.error(data.data.message);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }

  function changeUserStatus(serviceProviderId) {
    let data = new FormData();
    data.append("serviceproviderid", serviceProviderId);

    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/serviceprovider/changestatus`,
        data,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((data) => {
        if (data.data.status) {
          toast.success(data.data.message);
          let newServiceProvider = serviceProvider.map((listOfCustomer) => {
            if (listOfCustomer.serviceproviderid == serviceProviderId) {
              if (listOfCustomer.isactive) {
                return { ...listOfCustomer, isactive: false };
              } else {
                return { ...listOfCustomer, isactive: true };
              }
            }
            return listOfCustomer;
          });
          setServiceProvider(newServiceProvider);
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
            <div>Service Provider Info</div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton
                color="primary"
                type="button"
                className="btn btn-success"
                onClick={() => {
                  navigate("/addserviceprovider", {
                    state: { userid: serviceProviderId },
                  });
                }}
              >
                Add Service Provider
              </CButton>
            </div>
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
                  <CTableHeaderCell>Person Name</CTableHeaderCell>
                  <CTableHeaderCell>Service Name</CTableHeaderCell>
                  <CTableHeaderCell>Sub Service Name</CTableHeaderCell>
                  <CTableHeaderCell>Price</CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Image
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Description
                  </CTableHeaderCell>
                  <CTableHeaderCell className="text-center">
                    Service Details
                  </CTableHeaderCell>
                  <CTableHeaderCell>Is_Active</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {serviceProvider.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>
                      <div>{item.userid.name}</div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <div>{item.name}</div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <div>{item.subserviceid.subservicename}</div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <div>{item.price}</div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <div>
                        {item.image ? (
                          <img
                            src={
                              `${process.env.REACT_APP_PROFILEPIC}` + item.image
                            }
                            alt={item.image}
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

                    <CTableDataCell className="text-center">
                      <VisibilityIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          setDetailsData("");
                          setDetailsData(item.description && item.description);
                          setTitle(item.name);
                          setVisible(true);
                          setOpenDesBox(true);
                        }}
                      />
                    </CTableDataCell>

                    <CTableDataCell className="text-center">
                      <VisibilityIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          setOpenDesBox(false);
                          setDetailsData("");
                          setDetailsData(
                            item.servicedetails && item.servicedetails,
                          );
                          setTitle(item.name);
                          setVisible(true);
                        }}
                      />
                    </CTableDataCell>

                    <CTableDataCell>
                      {
                        <CFormSwitch
                          key={index}
                          type="checkbox"
                          color="primary"
                          checked={item.isactive}
                          size="xl"
                          onChange={() => {
                            changeUserStatus(item.serviceproviderid);
                          }}
                        />
                      }
                    </CTableDataCell>

                    <CTableDataCell>
                      <EditIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          navigate("/addserviceprovider", {
                            state: {
                              serviceproviderid: item.serviceproviderid,
                              userid: item.userid._id,
                              name: item.name,
                              description: item.description,
                              image: item.image,
                              subserviceid: item.subserviceid._id,
                              servicesid: item.subserviceid.servicesid._id,
                              price: item.price,
                              isactive: item.isactive,
                              servicedetails: item.servicedetails,
                            },
                          });
                        }}
                      />

                      <DeleteIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          setOpenAlertBox(true);
                          setDeleteTitle(item.name);
                          setDeleteItemId(item.serviceproviderid);
                        }}
                      />
                    </CTableDataCell>
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
                        deleteServiceProvider(deleteItemId);
                      }}
                    >
                      Delete
                    </CButton>
                  </CModalFooter>
                </CModal>
              </template>
            )}
            {/* ---------------------Close Delete Dialog Box---------------------------------- */}

            {/* ----------------------Open details Dialog Box---------------------------------- */}
            {visible && (
              <template>
                <CModal
                  alignment="center"
                  visible={visible}
                  onClose={() => setVisible(false)}
                >
                  <CModalHeader>
                    <CModalTitle>{title && title}</CModalTitle>
                  </CModalHeader>
                  <CModalBody>
                    {openDesBox ? (
                      <p>{detailsData}</p>
                    ) : (
                      detailsData &&
                      detailsData.map((data, index) => {
                        let dataValue = "";
                        if (data.value == "true") {
                          dataValue = "Yes";
                        } else if (data.value == "false") {
                          dataValue = "No";
                        } else {
                          dataValue = data.value;
                        }
                        return (
                          <p key={index}>
                            <b>{data.name + " : "}</b>
                            {dataValue}
                          </p>
                        );
                      })
                    )}
                  </CModalBody>
                  <CModalFooter>
                    <CButton color="primary" onClick={() => setVisible(false)}>
                      Close
                    </CButton>
                  </CModalFooter>
                </CModal>
              </template>
            )}
            {/* ---------------------Close details Dialog Box---------------------------------- */}
            <br />
          </CCardBody>
          <ToastContainer />
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ViewServiceProvider;
