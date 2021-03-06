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

const AllUsers = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("karigar_token");

  const [allUsers, setAllUsers] = useState([]);

  const [openAlertBox, setOpenAlertBox] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteItemId, setDeleteItemId] = useState("");

  // Get all users.
  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/user/alluser`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((data) => {
        if (data.data.data) {
          const records = [];
          data.data.data.map((record) => {
            records.push({
              userid: record._id,
              emailaddress: record.emailaddress,
              name: record.name,
              gender: record.gender,
              status: record.status,
              isactive: record.isactive,
              mobilenumber: record.mobilenumber,
              userroll: record.userroll,
              // createdAt: record.createdAt,
              // updatedAt: record.updatedAt,
              profile_picture: record.profile_picture,
            });
          });
          setAllUsers(records);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }, []);

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
          setAllUsers((prevUserList) => {
            return prevUserList.map((item) => {
              if (item.userid === customerId) {
                statusMsg = !item.isactive;
                return { ...item, isactive: !item.isactive };
              } else {
                return item;
              }
            });
          });
          toast.success(statusMsg ? "User Activated" : "User Deactivated");
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

          let newCustomerData = allUsers.filter(
            (item) => item.userid !== customerId,
          );

          setAllUsers(newCustomerData);
        } else {
          toast.error(data.data.message);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }

  function verifyUser(userId, status) {
    if (status === false || !status) {
      let data = new FormData();
      data.append("userid", userId);

      axios
        .post(`${process.env.REACT_APP_APIURL}/karigar/user/verify`, data, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((data) => {
          if (data.data.status) {
            toast.success(data.data.message);
            let newCustomerData = allUsers.map((listOfCustomer) => {
              if (listOfCustomer.userid == userId) {
                if (listOfCustomer.status) {
                  return { ...listOfCustomer, status: false };
                } else {
                  return { ...listOfCustomer, status: true };
                }
              }
              return listOfCustomer;
            });
            setAllUsers(newCustomerData);
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
            <div>Users</div>
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
                  <CTableHeaderCell>Userrole</CTableHeaderCell>
                  {/* <CTableHeaderCell>CreateAT</CTableHeaderCell>
                  <CTableHeaderCell>UpdateAT</CTableHeaderCell> */}
                  <CTableHeaderCell>Verified</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {allUsers.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>
                      <div>{item.emailaddress ? item.emailaddress : "-"}</div>
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
                      <div>
                        {item.userroll.rolename ? item.userroll.rolename : "-"}
                      </div>
                    </CTableDataCell>

                    {/* <CTableDataCell>
                      <div>{item.createdAt ? item.createdAt : ""}</div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <div>{item.updatedAt ? item.updatedAt : ""}</div>
                    </CTableDataCell> */}

                    <CTableDataCell>
                      {item.userroll.rolename === "admin" ? (
                        <CFormCheck
                          key={index}
                          type="checkbox"
                          color="primary"
                          checked={item.status}
                          size="xl"
                          disabled
                          onChange={(e) => {
                            // console.log(e);
                          }}
                        />
                      ) : (
                        <CFormCheck
                          key={index}
                          type="checkbox"
                          color="primary"
                          checked={item.status}
                          size="xl"
                          onChange={(e) => {
                            verifyUser(item.userid, item.status);
                          }}
                        />
                      )}
                    </CTableDataCell>

                    <CTableDataCell>
                      {item.userroll.rolename === "admin" ? (
                        <CFormSwitch
                          key={index}
                          type="checkbox"
                          color="success"
                          checked={item.isactive}
                          size="xl"
                          disabled
                          onChange={() => {
                            // changeUserStatus(item.userid);
                          }}
                        />
                      ) : (
                        <CFormSwitch
                          key={index}
                          type="checkbox"
                          color="success"
                          checked={item.isactive}
                          size="xl"
                          onChange={() => {
                            changeUserStatus(item.userid);
                          }}
                        />
                      )}
                    </CTableDataCell>

                    <CTableDataCell>
                      <EditIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          navigate("/addusers", {
                            state: {
                              userid: item.userid,
                              emailaddress: item.emailaddress,
                              name: item.name,
                              userroll: item.userroll._id,
                              mobilenumber: item.mobilenumber,
                              gender: item.gender,
                              profile_picture: item.profile_picture,
                            },
                          });
                        }}
                      />
                      {item.userroll.rolename !== "admin" && (
                        <DeleteIcon
                          variant="contained"
                          color="inherit"
                          onClick={() => {
                            setOpenAlertBox(true);
                            setDeleteTitle(item.emailaddress);
                            setDeleteItemId(item.userid);
                          }}
                        />
                      )}
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
            <div className="d-md-flex pt-2 justify-content-md-end">
              <CButton color="primary" onClick={() => navigate(-1)}>
                Back
              </CButton>
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

export default AllUsers;
