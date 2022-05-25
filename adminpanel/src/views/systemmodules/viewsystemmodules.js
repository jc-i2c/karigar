import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import EditIcon from "@material-ui/icons/Edit";

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

const ViewSystemModules = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("karigar_token");

  const [systemModules, setSystemModules] = useState([]);

  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/systemmodules/getall`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((data) => {
        const records = [];
        data.data.data.map((record) => {
          records.push({
            systemmodulesid: record._id,
            modulesname: record.modulesname,
            modulespermission: record.modulespermission,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
          });
        });
        setSystemModules(records);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }, []);

  return (
    <CRow>
      <CCol xs>
        <CCard className="mb-4">
          <CCardHeader className="mb-0 border fs-4 d-flex justify-content-between">
            <div>System Modules</div>
            {/* <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton
                color="primary"
                type="button"
                className="btn btn-success"
                onClick={() => {
                  navigate("/addsystemmodules");
                }}
              >
                Add System Modules
              </CButton>
            </div> */}
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
                  <CTableHeaderCell>Modules Name</CTableHeaderCell>
                  <CTableHeaderCell>CreateAT</CTableHeaderCell>
                  <CTableHeaderCell>UpdateAT</CTableHeaderCell>
                  {/* <CTableHeaderCell>Edit</CTableHeaderCell> */}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {systemModules.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>
                      <div>{item.modulesname}</div>
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
                          navigate("/addsystemmodules", {
                            state: {
                              systemmodulesid: item.systemmodulesid,
                              modulesname: item.modulesname,
                            },
                          });
                        }}
                      />
                    </CTableDataCell> */}
                  </CTableRow>
                ))}
              </CTableBody>
            </CTable>

            <div className="d-md-flex pt-2 justify-content-md-end mb-0">
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

export default ViewSystemModules;
