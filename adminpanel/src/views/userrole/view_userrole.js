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
} from "@coreui/react";

const ViewAllUserRoles = () => {
  const navigate = useNavigate();

  const [token, setToken] = useState(localStorage.getItem("karigar_token"));
  const [userrole, setUserrole] = useState([]);

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
          let newArray = [];
          record.permissions.map((item, index) => {
            let newObj = {};
            newObj.systemmodulesid = item.systemmodulesid._id;
            newObj.access = item.access;
            newArray.push(newObj);
          });

          records.push({
            userroleid: record._id,
            rolename: record.rolename,
            permissions: newArray,
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
          <CCardHeader className="mb-0 border">Userrole List</CCardHeader>
          <CCardHeader className="mb-0 border">
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
              <CTableHead color="light">
                <CTableRow>
                  <CTableHeaderCell>Userrole Name</CTableHeaderCell>
                  <CTableHeaderCell>CreateAT</CTableHeaderCell>
                  <CTableHeaderCell>UpdateAT</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
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
                              permissions: item.permissions,
                            },
                          });
                        }}
                      />
                      {item.userroleid == "626113fadf6c093c730a54fa" ? (
                        ""
                      ) : item.userroleid == "6273bcdff5932013fc9e678b" ? (
                        ""
                      ) : (
                        <DeleteIcon
                          variant="contained"
                          color="inherit"
                          onClick={() => {
                            deleteUserRoles(item.userroleid);
                          }}
                        />
                      )}
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
