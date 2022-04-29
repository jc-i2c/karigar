import React, { useEffect, useState } from "react";
import axios from "axios";

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
} from "@coreui/react";

const ViewCustomer = () => {
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
        // console.log(data.data.data, "data");
        data.data.data.map((record) => {
          // console.log(record._id, "record._id");
          records.push({
            customerid: record._id,
            emailaddress: record.emailaddress,
            name: record.name,
            gender: record.gender,
            status: record.status,
            isactive: record.isactive,
            mobilenumber: record.mobilenumber,
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
          {/* <CCardHeader className="mb-0 border">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button type="button" className="btn btn-success">
                Add Customer
              </button>
            </div>
          </CCardHeader> */}

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
