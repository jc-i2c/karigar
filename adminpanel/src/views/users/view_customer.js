import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  CFormSwitch,
  CFormCheck,
  CButton,
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const ViewCustomer = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("karigar_token");

  const [customers, setCustomers] = useState([]);

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

  // Get all customer list
  useEffect(() => {
    if (roleName === "ADMIN") {
      axios
        .post(
          `${process.env.REACT_APP_APIURL}/karigar/user/allcustomer`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then((data) => {
          if (data.data.data) {
            const records = [];
            data.data.data.map((record) => {
              records.push({
                customerid: record._id,
                emailaddress: record.emailaddress,
                name: record.name,
                gender: record.gender,
                status: record.status,
                isactive: record.isactive,
                mobilenumber: record.mobilenumber,
                userroll: record.userroll,
              });
            });
            setCustomers(records);
          }
        })
        .catch((error) => {
          console.log(error, "error");
        });
    }
  }, [roleName]);

  function changeUserStatus(customerId) {
    let data = new FormData();
    data.append("userid", customerId);
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/user/activedeactive`,
        data,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((data) => {
        if (data.data.status) {
          let statusMsg = "";
          setCustomers((prevUserList) => {
            return prevUserList.map((item) => {
              if (item.customerid === customerId) {
                statusMsg = !item.isactive;
                return { ...item, isactive: !item.isactive };
              } else {
                return item;
              }
            });
          });
          toast.success(
            statusMsg ? "Customer Activated" : "Customer Deactivated",
          );
        } else {
          toast.error(data.data.message);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }

  function deleteCustomer(customerId) {
    setOpenAlertBox(false);

    let data = new FormData();
    data.append("userid", customerId);

    axios
      .post(`${process.env.REACT_APP_APIURL}/karigar/user/deleteuser`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        if (data.data.status) {
          toast.success(data.data.message);

          let newCustomerData = customers.filter(
            (item) => item.customerid !== customerId,
          );

          setCustomers(newCustomerData);
        } else {
          toast.error(data.data.message);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }

  function verifyCustomer(userId, status) {
    if (status === false) {
      let data = new FormData();
      data.append("userid", userId);

      axios
        .post(`${process.env.REACT_APP_APIURL}/karigar/user/verify`, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((data) => {
          if (data.data.status) {
            toast.success(data.data.message);
            let customerStatus = customers.map((listOfCustomer) => {
              if (listOfCustomer.customerid === userId) {
                if (listOfCustomer.status) {
                  return { ...listOfCustomer, status: false };
                } else {
                  return { ...listOfCustomer, status: true };
                }
              }
              return listOfCustomer;
            });
            setCustomers(customerStatus);
          } else {
            toast.error(data.data.message);
          }
        })
        .catch((error) => {
          console.log(error, "error");
        });
    }
  }

  return (
    <CRow>
      <CCol xs>
        <CCard className="mb-4">
          <CCardHeader className="mb-0 border fs-4 d-flex justify-content-between">
            <div>Customers</div>
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
                {customers.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>
                      <div>{item.emailaddress}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.name ? item.name : "-"}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        {item.gender === 1
                          ? "Male"
                          : item.gender === 2
                          ? "Female"
                          : "-"}
                      </div>
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
                          verifyCustomer(item.customerid, item.status);
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
                          changeUserStatus(item.customerid);
                        }}
                      />
                    </CTableDataCell>
                    <CTableDataCell>
                      <EditIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          navigate("/addusers", {
                            state: {
                              userid: item.customerid,
                              emailaddress: item.emailaddress,
                              name: item.name,
                              userroll: item.userroll,
                              mobilenumber: item.mobilenumber,
                              gender: item.gender,
                              pagename: "dashboard",
                            },
                          });
                        }}
                      />
                      <DeleteIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          setOpenAlertBox(true);
                          setDeleteTitle(item.emailaddress);
                          setDeleteItemId(item.customerid);
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
                  visible={openAlertBox}
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
        </CCard>
      </CCol>
    </CRow>
  );
};

<ToastContainer autoClose={`${process.env.REACT_APP_TOASTMESSAGETIME}`} />;

export default ViewCustomer;
