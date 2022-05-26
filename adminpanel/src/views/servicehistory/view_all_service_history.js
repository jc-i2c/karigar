import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
  CFormSelect,
  CButton,
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
      console.log("JENISH");
      axios
        .post(
          `${process.env.REACT_APP_APIURL}/karigar/servicehistory/all`,
          {},
          { headers: { Authorization: `Bearer ${token}` } },
        )
        .then((data) => {
          if (data.data.data) {
            const records = [];
            data.data.data.map((record) => {
              records.push({
                servicehistoryid: record._id,
                name: record.name,
                serviceprovidername: record.serviceproviderid.name,
                customername: record.customerid.name,
                addresstype: record.addresstype,
                servicedate: record.servicedate,
                sessiontime: record.sessiontime,
                servicestatus: record.servicestatus,
                paymentstatus: record.paymentstatus,
                createdAt: record.createdAt,
                updatedAt: record.updatedAt,
              });
            });
            setOffers(records);
          }
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
          if (data.data.data) {
            const records = [];
            data.data.data.map((record) => {
              // console.log(record, "record");
              records.push({
                servicehistoryid: record._id,
                name: record.name,
                serviceprovidername: record.serviceproviderid.name,
                customername: record.customerid.name,
                addresstype: record.addresstype,
                servicedate: record.servicedate,
                sessiontime: record.sessiontime,
                servicestatus: record.servicestatus,
                paymentstatus: record.paymentstatus,
                createdAt: record.createdAt,
                updatedAt: record.updatedAt,
              });
            });
            setOffers(records);
          }
        })
        .catch((error) => {
          console.log(error, "error");
        });
    }
  }, [roleName]);

  // Service history status changed.
  function changeStatus(Id, status) {
    var data = new FormData();
    data.append("servicehistoryid", Id);
    data.append("servicestatus", status);

    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/servicehistory/statuschange`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((data) => {
        if (data.data.status) {
          toast.success(data.data.message);
          let newOffers = offers.map((allOffer) => {
            if (allOffer.servicehistoryid == Id) {
              return { ...allOffer, servicestatus: status };
            } else {
              return allOffer;
            }
          });

          setOffers(newOffers);
        } else {
          toast.warning(data.data.message);
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
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {offers.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>
                      <div>{item.name ? item.name : ""}</div>
                    </CTableDataCell>

                    {roleName == "ADMIN" && (
                      <CTableDataCell>
                        <div>
                          {item.serviceprovidername ? item.serviceprovidername : ""}
                        </div>
                      </CTableDataCell>
                    )}

                    <CTableDataCell>
                      <div>{item.customername ? item.customername : ""}</div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <div>
                        {item.addresstype == 1
                          ? "OFFICE"
                          : item.addresstype == 2
                            ? "HOME"
                            : ""}
                      </div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <div>{item.servicedate ? item.servicedate : ""}</div>
                    </CTableDataCell>

                    <CTableDataCell>
                      {item.sessiontime ? item.sessiontime : ""}
                    </CTableDataCell>

                    <CTableDataCell>
                      {item.servicestatus == 5 ? (
                        <CFormSelect required id="services" name="services">
                          <option key={5} value={5}>
                            Reject
                          </option>
                        </CFormSelect>
                      ) : (
                        <CFormSelect
                          required
                          id="services"
                          name="services"
                          value={item.servicestatus}
                          onChange={(e) => {
                            changeStatus(item.servicehistoryid, e.target.value);
                          }}
                        >
                          <option key={0} value={0}>
                            Booking_request_sent
                          </option>
                          <option key={1} value={1}>
                            Accept
                          </option>
                          <option key={2} value={2}>
                            Confirmed
                          </option>
                          <option key={3} value={3}>
                            Job_started
                          </option>
                          <option key={4} value={4}>
                            Job_Completed
                          </option>
                          <option key={5} value={5}>
                            Reject
                          </option>
                        </CFormSelect>
                      )}
                    </CTableDataCell>

                    <CTableDataCell>
                      <div>{item.paymentstatus ? item.paymentstatus : ""}</div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <div>{item.createdAt ? item.createdAt : ""}</div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <div>{item.updatedAt ? item.updatedAt : ""}</div>
                    </CTableDataCell>
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            <div className="d-md-flex pt-2 justify-content-md-end">
              <CButton color="primary" onClick={() => navigate(-1)}>
                Back
              </CButton>
            </div>
          </CCardBody>
          <ToastContainer />
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ViewServices;
