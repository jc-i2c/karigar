import React, { useEffect, useState } from "react";
import axios from "axios";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

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
  CPagination,
  CPaginationItem,
} from "@coreui/react";

import WidgetsDropdown from "../widgets/WidgetsDropdown";

const Dashboard = () => {
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

  return (
    <>
      <WidgetsDropdown />

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader className="mb-0 border">Customer List</CCardHeader>
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
                    <CTableHeaderCell>User verified</CTableHeaderCell>
                    <CTableHeaderCell>Active {"&"} Inactive</CTableHeaderCell>
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
                        <div>{item.name}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.gender ? item.gender : "No Data"}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <CFormSwitch
                          key={index}
                          type="checkbox"
                          color="success"
                          checked={item.status}
                          size="xl"
                          onChange={(e) => {
                            // changeUserStatus(e, item.customerid);
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
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <br />
              {/* <CPagination aria-label="Page navigation example">
                <CPaginationItem aria-label="Previous">
                  <span aria-hidden="true">&laquo;</span>
                </CPaginationItem>
                <CPaginationItem>1</CPaginationItem>
                <CPaginationItem>2</CPaginationItem>
                <CPaginationItem>3</CPaginationItem>
                <CPaginationItem aria-label="Next">
                  <span aria-hidden="true">&raquo;</span>
                </CPaginationItem>
              </CPagination> */}
            </CCardBody>
            <ToastContainer />
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;
