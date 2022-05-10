import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";

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
  CFormSwitch,
  CFormCheck,
  CButton,
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const ViewServiceProvider = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("karigar_token");

  const [serviceProvider, setServiceProvider] = useState([]);

  const [openAlertBox, setOpenAlertBox] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteItemId, setDeleteItemId] = useState("");

  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/user/allserviceprovider`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((data) => {
        const records = [];
        data.data.data.map((record) => {
          records.push({
            serviceproviderid: record._id,
            emailaddress: record.emailaddress,
            name: record.name,
            gender: record.gender,
            status: record.status,
            isactive: record.isactive,
            mobilenumber: record.mobilenumber,
          });
        });
        setServiceProvider(records);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }, []);

  function changeUserStatus(serviceProviderId) {
    setOpenAlertBox(false);

    let data = new FormData();
    data.append("userid", serviceProviderId);
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/user/activedeactive`,
        data,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((data) => {
        if (data.data.status) {
          toast.success(data.data.message);
          let newCustomerData = serviceProvider.map((serviceProviderList) => {
            if (serviceProviderList.serviceproviderid == serviceProviderId) {
              if (serviceProviderList.isactive) {
                return { ...serviceProviderList, isactive: false };
              } else {
                return { ...serviceProviderList, isactive: true };
              }
            }
            return serviceProviderList;
          });
          setServiceProvider(newCustomerData);
        } else {
          toast.error(data.data.message);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }

  function deleteCustomer(serviceProviderId) {
    setOpenAlertBox(false);

    let data = new FormData();
    data.append("userid", serviceProviderId);

    axios
      .post(`${process.env.REACT_APP_APIURL}/karigar/user/deleteuser`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        if (data.data.status) {
          toast.success(data.data.message);

          let newCustomerData = serviceProvider.filter(
            (item) => item.serviceproviderid !== serviceProviderId,
          );

          setServiceProvider(newCustomerData);
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
            <div>Service Provider List</div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton
                color="primary"
                type="button"
                className="btn btn-success"
                onClick={() => {
                  navigate("/addusers");
                }}
              >
                Add Users
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
                  <CTableHeaderCell>Email Address</CTableHeaderCell>
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  <CTableHeaderCell>Gender</CTableHeaderCell>
                  <CTableHeaderCell>Mobile Number</CTableHeaderCell>
                  <CTableHeaderCell>Verified</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {serviceProvider.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>
                      <div>{item.emailaddress}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.name ? item.name : "-"}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.gender ? item.gender : "-"}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.mobilenumber ? item.mobilenumber : "-"}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormCheck
                        key={index}
                        type="checkbox"
                        color="primary"
                        checked={item.status}
                        size="xl"
                        onChange={(e) => {
                          // changeUserStatus(item.serviceproviderid);
                        }}
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormSwitch
                        key={index}
                        type="checkbox"
                        color="success"
                        checked={item.isactive}
                        size="xl"
                        onChange={(e) => {
                          changeUserStatus(item.serviceproviderid);
                        }}
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <DeleteIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          setOpenAlertBox(true);
                          setDeleteTitle(item.emailaddress);
                          setDeleteItemId(item.serviceproviderid);

                          // deleteCustomer(item.serviceproviderid);
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
                        deleteCustomer(deleteItemId);
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

export default ViewServiceProvider;
