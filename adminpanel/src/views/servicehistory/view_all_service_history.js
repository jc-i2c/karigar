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
  CButton,
  CFormSwitch,
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const ViewServices = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("karigar_token");
  const [offers, setOffers] = useState([]);

  const [openAlertBox, setOpenAlertBox] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteItemId, setDeleteItemId] = useState("");

  // Get all offers list.
  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/servicehistory/all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((data) => {
        const records = [];
        console.log(data.data.data, "data");
        data.data.data.map((record) => {
          console.log(record, "record");
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
  }, []);

  function changeOfferStatus(offerId) {
    let data = new FormData();
    data.append("offerid", offerId);
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/offer/changestatus`,
        data,
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((data) => {
        if (data.data.status) {
          toast.success(data.data.message);
          let newOfferData = offers.map((offerList) => {
            if (offerList.offerid == offerId) {
              if (offerList.isactive) {
                return { ...offerList, isactive: false };
              } else {
                return { ...offerList, isactive: true };
              }
            }
            return offerList;
          });
          setOffers(newOfferData);
        } else {
          toast.error(data.data.message);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }

  function deleteOffers(offerId) {
    setOpenAlertBox(false);

    let data = new FormData();
    data.append("offerid", offerId);

    axios
      .post(`${process.env.REACT_APP_APIURL}/karigar/offer/delete`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        if (data.data.status) {
          toast.success(data.data.message);

          let newOffersData = offers.filter((item) => item.offerid !== offerId);

          setOffers(newOffersData);
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
            <div>Service historys</div>
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
                  <CTableHeaderCell>Service Provider Name</CTableHeaderCell>
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
                    <CTableDataCell>
                      <div>
                        {item.serviceprovidername && item.serviceprovidername}
                      </div>
                    </CTableDataCell>

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

                    {/* <CTableDataCell>
                      <EditIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          navigate("/addoffers", {
                            state: {
                              offerid: item.offerid,
                              servicesid: item.servicesid,
                              subserviceid: item.subserviceid,
                              serviceproviderid: item.serviceproviderid,
                              currentprice: item.currentprice,
                              actualprice: item.actualprice,
                            },
                          });
                        }}
                      />
                      <DeleteIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          setOpenAlertBox(true);
                          setDeleteTitle(item.serviceprovidername);
                          setDeleteItemId(item.offerid);
                        }}
                      />
                    </CTableDataCell> */}
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
                        deleteOffers(deleteItemId);
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

export default ViewServices;
