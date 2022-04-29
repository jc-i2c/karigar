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
  CButton,
} from "@coreui/react";

const ViewSubServices = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [token, setToken] = useState(localStorage.getItem("karigar_token"));
  const [subServices, setSubServices] = useState([]);

  useEffect(() => {
    if (location.state.serviceid) {
      let servicesId = location.state.serviceid;

      let data = new FormData();
      data.append("servicesid", servicesId);

      axios
        .post(
          `${process.env.REACT_APP_APIURL}/karigar/subservices/allsubservices`,
          data,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        )
        .then((data) => {
          const records = [];
          // console.log(data.data.data, "data");
          if (data.data.data) {
            data.data.data.map((record) => {
              records.push({
                subserviceid: record._id,
                servicename: record.servicesid.servicename,
                subservicename: record.subservicename,
                subserviceimage: record.subserviceimage,
                createdAt: record.createdAt,
                updatedAt: record.updatedAt,
              });
            });
            setSubServices(records);
          }
        })
        .catch((error) => {
          console.log(error, "error");
        });
    } else {
      navigate("/services");
    }
  }, []);

  function deleteSubServices(subServiceId) {
    let data = new FormData();
    data.append("subservicesid", subServiceId);
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/subServices/delete`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((data) => {
        if (data.data.status) {
          toast.success(data.data.message);
          let newServciesData = subServices.filter(
            (item) => item.subserviceid !== subServiceId,
          );
          setSubServices(newServciesData);
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
          <CCardHeader className="mb-0 border">Sub Services List</CCardHeader>
          <CCardHeader className="mb-0 border">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton
                color="primary"
                type="button"
                className="btn btn-success"
                onClick={() => {
                  navigate("/addsubservices");
                }}
              >
                Add Sub Services
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
                  <CTableHeaderCell>Sub Service Image</CTableHeaderCell>
                  <CTableHeaderCell>CreateAT</CTableHeaderCell>
                  <CTableHeaderCell>UpdateAT</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {subServices.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>
                      <div>{item.servicename}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.subservicename}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        {item.subserviceimage ? (
                          <img
                            style={{
                              alignItems: "center",
                              height: "50px",
                              width: "50px",
                              borderRadius: "50%",
                            }}
                            src={
                              `${process.env.REACT_APP_PROFILEPIC}` +
                              item.subserviceimage
                            }
                            alt={item.subserviceimage}
                          />
                        ) : (
                          <img
                            src={
                              `${process.env.REACT_APP_PROFILEPIC}` + "fiximage"
                            }
                            alt={"fiximage"}
                            style={{
                              height: "50px",
                              width: "50px",
                              borderRadius: "50%",
                            }}
                          />
                        )}
                      </div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <div>{item.createdAt}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.updatedAt}</div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <EditIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          navigate("/addsubservices", {
                            state: {
                              subserviceid: item.subserviceid,
                              servicename: item.servicename,
                              serviceimage: item.serviceimage,
                            },
                          });
                        }}
                      />
                      <DeleteIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          deleteSubServices(item.subserviceid);
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

export default ViewSubServices;
