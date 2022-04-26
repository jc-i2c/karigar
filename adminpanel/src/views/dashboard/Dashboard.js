import React, { useEffect, useState } from "react";
import axios from "axios";

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

  return (
    <>
      <WidgetsDropdown />

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader className="mb-0 border " hover responsive>
              Customer List
            </CCardHeader>
            <CCardBody>
              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Email Address</CTableHeaderCell>
                    <CTableHeaderCell>Name</CTableHeaderCell>
                    <CTableHeaderCell>Status</CTableHeaderCell>
                    <CTableHeaderCell>Active or Inactive</CTableHeaderCell>
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
                        {/* <div>{item.status}</div> */}
                        <CFormSwitch
                          key={index}
                          type="checkbox"
                          color="success"
                          checked={item.status}
                          size="xl"
                        />
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{item.isactive}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};

export default Dashboard;
