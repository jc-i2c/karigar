import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import EditIcon from "@material-ui/icons/Edit";

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

const ViewAllUserRoles = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("karigar_token");

  const [userrole, setUserrole] = useState([]);

  const [openAlertBox, setOpenAlertBox] = useState(false);

  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/userrole/getall`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((data) => {
        const records = [];
        data.data.data.map((record) => {
          let systemModulesArray = [];
          record.systemmodulesid.map((item) => {
            systemModulesArray.push(item._id);
          });

          records.push({
            userroleid: record._id,
            rolename: record.rolename,
            systemmodulesid: systemModulesArray,
            roletag: record.roletag,
            createdAt: record.createdAt,
            updatedAt: record.updatedAt,
          });
        });
        setUserrole(records);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }, []);

  function deleteUserRoles(userRoleId) {
    setOpenAlertBox(false);

    let data = new FormData();
    data.append("userroleid", userRoleId);

    axios
      .post(`${process.env.REACT_APP_APIURL}/karigar/userrole/delete`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        if (data.data.status) {
          toast.success(data.data.message);

          let newUserRoleData = userrole.filter(
            (item) => item.userroleid !== userRoleId,
          );

          setUserrole(newUserRoleData);
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
            <div>Userrole List</div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton
                color="primary"
                type="button"
                className="btn btn-success"
                onClick={() => {
                  navigate("/adduserrole");
                }}
              >
                Add Userrole
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
              <CTableHead color="dark">
                <CTableRow>
                  <CTableHeaderCell>Userrole Name</CTableHeaderCell>
                  <CTableHeaderCell>CreateAT</CTableHeaderCell>
                  <CTableHeaderCell>UpdateAT</CTableHeaderCell>
                  {/* <CTableHeaderCell>View</CTableHeaderCell> */}
                  <CTableHeaderCell>Action</CTableHeaderCell>
                  {/* <CTableHeaderCell>Delete</CTableHeaderCell> */}
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {userrole.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>
                      <div>{item.rolename}</div>
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
                          navigate("/adduserrole", {
                            state: {
                              userroleid: item.userroleid,
                              rolename: item.rolename,
                              rolepermission: item.systemmodulesid,
                              roletag: item.roletag,
                            },
                          });
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

export default ViewAllUserRoles;
