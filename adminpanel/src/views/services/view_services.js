import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import VisibilityIcon from "@material-ui/icons/Visibility";
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
} from "@coreui/react";

const ViewServices = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("karigar_token"));
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/services/all`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((data) => {
        const records = [];
        // console.log(data.data.data, "data");
        data.data.data.map((record) => {
          records.push({
            serviceid: record._id,
            servicename: record.servicename,
            serviceimage: record.serviceimage,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
          });
        });
        setServices(records);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }, []);

  function deleteServices(serviceId) {
    let data = new FormData();
    data.append("servicesid", serviceId);

    axios
      .post(`${process.env.REACT_APP_APIURL}/karigar/services/delete`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        if (data.data.status) {
          toast.success(data.data.message);

          let newServciesData = services.filter(
            (item) => item.serviceid !== serviceId,
          );

          setServices(newServciesData);
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
          <CCardHeader className="mb-0 border">Services List</CCardHeader>
          <CCardHeader className="mb-0 border">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <button type="button" className="btn btn-success">
                Add Services
              </button>
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
                  <CTableHeaderCell>Service Image</CTableHeaderCell>
                  <CTableHeaderCell>View Subservices</CTableHeaderCell>
                  <CTableHeaderCell>CreateAT</CTableHeaderCell>
                  <CTableHeaderCell>UpdateAT</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {services.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>
                      <div>{item.servicename}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        {item.serviceimage ? (
                          <img
                            src={
                              `${process.env.REACT_APP_PROFILEPIC}` +
                              item.serviceimage
                            }
                            alt={item.serviceimage}
                            style={{
                              height: "50px",
                              width: "50px",
                              borderRadius: "50%",
                            }}
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
                      <VisibilityIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          navigate("/subservices", {
                            state: { serviceid: item.serviceid },
                          });
                        }}
                      />
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
                          deleteServices(item.serviceid);
                        }}
                      />
                      <DeleteIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          deleteServices(item.serviceid);
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
