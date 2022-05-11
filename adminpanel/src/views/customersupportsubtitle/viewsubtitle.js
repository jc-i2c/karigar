import React, { useEffect, useState } from "react";
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
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const ViewCustomerSupport = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("karigar_token");

  const [cusSupportSubTitle, setCusSupportSubTitle] = useState([]);
  const [cusSupportTitleId, setCusSupportTitleId] = useState("");

  const [openAlertBox, setOpenAlertBox] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteItemId, setDeleteItemId] = useState("");

  useEffect(() => {
    let unmounted = false;

    if (location.state) {
      setCusSupportTitleId(location.state.custsuptitleid);

      if (cusSupportTitleId) {
        let data = new FormData();
        data.append("custsuptitleid", cusSupportTitleId);

        axios
          .post(
            `${process.env.REACT_APP_APIURL}/karigar/custsupsubtitle/getall`,
            data,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          )
          .then((data) => {
            const records = [];
            if (data.data.data) {
              data.data.data.map((record) => {
                records.push({
                  titleid: record.custsuptitleid._id,
                  title: record.custsuptitleid.title,

                  subtitleid: record._id,
                  subtitle: record.subtitle,
                  description: record.description,
                  createdAt: record.createdAt,
                  updatedAt: record.updatedAt,
                });
              });
              setCusSupportSubTitle(records);
            }
          })
          .catch((error) => {
            console.log(error, "error");
          });
      }
    } else {
      navigate("/customersupport");
    }
    return () => {
      unmounted = true;
    };
  }, [cusSupportTitleId]);

  function delCusSupportSubTitle(custSupSubTitleId) {
    setOpenAlertBox(false);

    let data = new FormData();
    data.append("custsupsubtitleid", custSupSubTitleId);

    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/custsupsubtitle/delete`,
        data,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((data) => {
        if (data.data.status) {
          toast.success(data.data.message);

          let newCusSupportIdData = cusSupportSubTitle.filter(
            (item) => item.subtitleid !== custSupSubTitleId,
          );

          setCusSupportSubTitle(newCusSupportIdData);
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
            <div>Customer Support Sub Title</div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton
                color="primary"
                type="button"
                className="btn btn-success"
                onClick={() => {
                  navigate("/addsubtitle", {
                    state: { titleid: cusSupportTitleId },
                  });
                }}
              >
                Add Sub Title
              </CButton>
            </div>
          </CCardHeader>
          {/* <CCardHeader className="mb-0 border">
            Customer Support Sub Title
          </CCardHeader>
          <CCardHeader className="mb-0 border">
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton
                color="primary"
                type="button"
                className="btn btn-success"
                onClick={() => {
                  navigate("/addsubtitle", {
                    state: { titleid: cusSupportTitleId },
                  });
                }}
              >
                Add Sub Title
              </CButton>
            </div>
          </CCardHeader> */}

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
                  <CTableHeaderCell>Customer Support Title</CTableHeaderCell>
                  <CTableHeaderCell>
                    Customer Support Sub Title
                  </CTableHeaderCell>
                  <CTableHeaderCell>
                    Customer Support Description
                  </CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {cusSupportSubTitle.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>
                      <div>{item.title}</div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <div>{item.subtitle}</div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <div>{item.description}</div>
                    </CTableDataCell>

                    <CTableDataCell>
                      <EditIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          navigate("/addsubtitle", {
                            state: {
                              titleid: item.titleid,
                              subtitleid: item.subtitleid,
                              subtitle: item.subtitle,
                              description: item.description,
                            },
                          });
                        }}
                      />

                      <DeleteIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          setOpenAlertBox(true);
                          setDeleteTitle(item.subtitle);
                          setDeleteItemId(item.subtitleid);
                        }}
                      />
                    </CTableDataCell>
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
                        delCusSupportSubTitle(deleteItemId);
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

export default ViewCustomerSupport;
