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
  CModal,
  CModalTitle,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from "@coreui/react";

const ViewCustomer = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("karigar_token");

  const [banners, setBanners] = useState([]);

  const [openAlertBox, setOpenAlertBox] = useState(false);
  const [deleteTitle, setDeleteTitle] = useState("");
  const [deleteItemId, setDeleteItemId] = useState("");

  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/dashboard/getall`,
        {},
        { headers: { Authorization: `Bearer ${token}` } },
      )
      .then((data) => {
        if (data.data.data) {
          const records = [];
          data.data.data.map((record) => {
            records.push({
              bannerid: record._id,
              bannertitle: record.bannertitle,
              bannersubtitle: record.bannersubtitle,
              bannerimage: record.bannerimage,
              createdAt: record.createdAt,
              updatedAt: record.updatedAt,
            });
          });
          setBanners(records);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }, []);

  function deleteHomeBanner(bannerId) {
    setOpenAlertBox(false);

    let data = new FormData();
    data.append("bannerid", bannerId);

    axios
      .post(`${process.env.REACT_APP_APIURL}/karigar/dashboard/delete`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        if (data.data.status) {
          toast.success(data.data.message);

          let newBannerData = banners.filter(
            (item) => item.bannerid !== bannerId,
          );

          setBanners(newBannerData);
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
            <div>Home Banner List</div>
            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton
                color="primary"
                type="button"
                className="btn btn-success"
                onClick={() => {
                  navigate("/addbanner");
                }}
              >
                Add Banner
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
                  <CTableHeaderCell>Banner Title</CTableHeaderCell>
                  <CTableHeaderCell>Banner Sub Title</CTableHeaderCell>
                  <CTableHeaderCell>Banner Image</CTableHeaderCell>
                  {/* <CTableHeaderCell>CreateAT</CTableHeaderCell>
                  <CTableHeaderCell>UpdateAT</CTableHeaderCell> */}
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                {banners.map((item, index) => (
                  <CTableRow v-for="item in tableItems" key={index}>
                    <CTableDataCell>
                      <div>{item.bannertitle}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.bannersubtitle}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>
                        {item.bannerimage && (
                          <img
                            src={
                              `${process.env.REACT_APP_PROFILEPIC}` +
                              item.bannerimage
                            }
                            alt={"Image not found"}
                            style={{
                              height: "70px",
                              width: "70px",
                            }}
                          />
                        )}
                      </div>
                    </CTableDataCell>
                    {/* <CTableDataCell>
                      <div>{item.createdAt}</div>
                    </CTableDataCell>
                    <CTableDataCell>
                      <div>{item.updatedAt}</div>
                    </CTableDataCell> */}

                    <CTableDataCell>
                      <EditIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          navigate("/addbanner", {
                            state: {
                              bannerid: item.bannerid,
                              bannertitle: item.bannertitle,
                              bannersubtitle: item.bannersubtitle,
                              bannerimage: item.bannerimage,
                            },
                          });
                        }}
                      />
                      <DeleteIcon
                        variant="contained"
                        color="inherit"
                        onClick={() => {
                          setOpenAlertBox(true);
                          setDeleteTitle(item.bannertitle);
                          setDeleteItemId(item.bannerid);
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
                  visible={openAlertBox}
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
                        deleteHomeBanner(deleteItemId);
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

export default ViewCustomer;
