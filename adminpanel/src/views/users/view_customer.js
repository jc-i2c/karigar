import React, { useEffect, useLayoutEffect, useState } from "react";
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
  CFormSwitch,
  CFormCheck,
  CButton,
} from "@coreui/react";

const ViewCustomer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(localStorage.getItem("karigar_token"));
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/user/allcustomer`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((data) => {
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
          toast.success(data.data.message);
          let newCustomerData = customers.map((listOfCustomer) => {
            if (listOfCustomer.customerid == customerId) {
              if (listOfCustomer.isactive) {
                return { ...listOfCustomer, isactive: false };
              } else {
                return { ...listOfCustomer, isactive: true };
              }
            }
            return listOfCustomer;
          });
          setCustomers(newCustomerData);
        } else {
          toast.error(data.data.message);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }

  function deleteCustomer(customerId) {
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

  return (
    <CRow>
      <CCol xs>
        <CCard className="mb-4">
          <CCardHeader className="mb-0 border">Customer List</CCardHeader>
          <CCardHeader className="mb-0 border">
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
              <CTableHead color="light">
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
                        {item.gender == 1
                          ? "Male"
                          : item.gender == 2
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
                          // changeUserStatus(item.customerid);
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
                          deleteCustomer(item.customerid);
                        }}
                      />
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>
            <br />
          </CCardBody>
          <ToastContainer />
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ViewCustomer;
