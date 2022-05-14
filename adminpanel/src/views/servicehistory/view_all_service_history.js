import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
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
} from "@coreui/react";

const ViewServices = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("karigar_token");
  const [offers, setOffers] = useState([]);

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

  // Get all offers list.
  useEffect(() => {
    if (roleName == "ADMIN") {
      axios
        .post(
          `${process.env.REACT_APP_APIURL}/karigar/servicehistory/all`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then((data) => {
          const records = [];
          
          data.data.data.map((record) => {
          
            records.push({
              servicehistoryid: record._id,
              name: record.name,
              serviceprovidername: record.serviceproviderid.name,
              customername: record.customerid.name,
              addresstype: record.addresstype,
              servicedate: record.servicedate,
              sessiontype: record.servicetime.sessiontype,
              sessiontime: record.servicetime.sessiontime,
              servicestatus: record.servicestatus,
              paymentstatus: record.paymentstatus,
              createdAt: record.createdAt,
              updatedAt: record.updatedAt,
            });
          });
          setOffers(records);
        })
        .catch((error) => {
          console.log(error, "error");
        });
    } else {
      axios
        .post(
          `${process.env.REACT_APP_APIURL}/karigar/servicehistory/getserprohistoty`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then((data) => {
          const records = [];
          
          data.data.data.map((record) => {
            
            records.push({
              servicehistoryid: record._id,
              name: record.name,
              serviceprovidername: record.serviceproviderid.name,
              customername: record.customerid.name,
              addresstype: record.addresstype,
              servicedate: record.servicedate,
              sessiontype: record.servicetime.sessiontype,
              sessiontime: record.servicetime.sessiontime,
              servicestatus: record.servicestatus,
              paymentstatus: record.paymentstatus,
              createdAt: record.createdAt,
              updatedAt: record.updatedAt,
            });
          });
          setOffers(records);
        })
        .catch((error) => {
          console.log(error, "error");
        });
    }
  }, [roleName]);

  return (
    <CRow>
      <CCol xs>
        <CCard className="mb-4">
          <CCardHeader className="mb-0 border fs-4 d-flex justify-content-between">
            <div>Service Historys</div>
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
                  <CTableHeaderCell>Name</CTableHeaderCell>
                  {roleName == "ADMIN" && (
                    <CTableHeaderCell>Service Provider Name</CTableHeaderCell>
                  )}
                  <CTableHeaderCell>Customer Name</CTableHeaderCell>
                  <CTableHeaderCell>Address Type</CTableHeaderCell>
                  <CTableHeaderCell>Service Time</CTableHeaderCell>
                  <CTableHeaderCell>Service Date</CTableHeaderCell>
                  <CTableHeaderCell>Service Status</CTableHeaderCell>
                  <CTableHeaderCell>Payment Status</CTableHeaderCell>
                  <CTableHeaderCell>CreatedAt</CTableHeaderCell>
                  <CTableHeaderCell>UpdatedAt</CTableHeaderCell>
                  {/* <CTableHeaderCell>Action</CTableHeaderCell> */}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {offers.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>
                      <div>{item.name}</div>
                    </CTableDataCell>
                    {roleName == "ADMIN" && (
                      <CTableDataCell>
                        <div>
                          {item.serviceprovidername && item.serviceprovidername}
                        </div>
                      </CTableDataCell>
                    )}

                    <CTableDataCell>
                      <div>{item.customername}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.addresstype}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.sessiontype + " " + item.sessiontime}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.servicedate}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.servicestatus}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.paymentstatus}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.createdAt}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.updatedAt}</div>
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

export default ViewServices;
