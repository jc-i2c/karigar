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
} from "@coreui/react";

const ViewServices = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("karigar_token"));
  const [offers, setOffers] = useState([]);

  // Get all offers list.
  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/offer/getalloffer`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((data) => {
        const records = [];
        // console.log(data.data.data, "data");
        data.data.data.map((record) => {
          records.push({
            offerid: record._id,
            servicesid: record.servicesid,
            servicename: record.servicename,
            subserviceid: record.subserviceid._id,
            subservicename: record.subserviceid.subservicename,
            serviceproviderid: record.serviceproviderid._id,
            serviceprovidername: record.serviceproviderid.name,
            actualprice: record.actualprice,
            currentprice: record.currentprice,
            isactive: record.isactive,
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
          <CCardHeader className="mb-0 border">Offers List</CCardHeader>
          <CCardHeader className="mb-0 border">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton
                color="primary"
                type="button"
                className="btn btn-success"
                onClick={() => {
                  navigate("/addoffers");
                }}
              >
                Add Offers
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
                  <CTableHeaderCell>Service Name</CTableHeaderCell>
                  <CTableHeaderCell>Sub Service Name</CTableHeaderCell>
                  <CTableHeaderCell>Service Provider Name</CTableHeaderCell>
                  <CTableHeaderCell>Current Price</CTableHeaderCell>
                  <CTableHeaderCell>Actual Price</CTableHeaderCell>
                  <CTableHeaderCell>is_Active</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {offers.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>
                      <div>{item.servicename}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.subservicename}</div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <div>{item.serviceprovidername}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.currentprice}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.actualprice}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <CFormSwitch
                        key={index}
                        type="checkbox"
                        color="success"
                        checked={item.isactive}
                        size="xl"
                        onClick={() => {
                          changeOfferStatus(item.offerid);
                        }}
                      />
                    </CTableDataCell>

                    <CTableDataCell>
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
                          deleteOffers(item.offerid);
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

export default ViewServices;
