import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// import VisibilityIcon from "@material-ui/icons/Visibility";
import EditIcon from "@material-ui/icons/Edit";
// import DeleteIcon from "@material-ui/icons/Delete";

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
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const ViewAllUserRoles = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("karigar_token");

  const [userrole, setUserrole] = useState([]);

  const [openAlertBox, setOpenAlertBox] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteItemId, setDeleteItemId] = useState("");

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
                      {item.userroleid == "627a23bac43d69171deaa3ae" ? (
                        "-"
                      ) : (
                        <EditIcon
                          variant="contained"
                          color="inherit"
                          onClick={() => {
                            navigate("/adduserrole", {
                              state: {
                                userroleid: item.userroleid,
                                rolename: item.rolename,
                                rolepermission: item.systemmodulesid,
                              },
                            });
                          }}
                        />
                      )}
                    </CTableDataCell>
                    {/* <CTableDataCell>
                      {item.userroleid == "627a23bac43d69171deaa3ae" ? (
                        "-"
                      ) : item.userroleid == "627a130c8351761097d515ac" ? (
                        "-"
                      ) : item.userroleid == "62611430df6c093c730a5504" ? (
                        "-"
                      ) : (
                        <DeleteIcon
                          variant="contained"
                          color="inherit"
                          onClick={() => {
                            setOpenAlertBox(true);
                            setDeleteTitle(item.rolename);
                            setDeleteItemId(item.userroleid);
                          }}
                        />
                      )}
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
                        deleteUserRoles(deleteItemId);
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

export default ViewAllUserRoles;
