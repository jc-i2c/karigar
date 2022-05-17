import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { CCard, CCardHeader, CCol, CRow } from "@coreui/react";

const ViewOffers = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("karigar_token");

  const [roleName, setRoleName] = useState("");
  const [cutomerList, setCutomerList] = useState([]);
  const [chatReqId, setChatReqId] = useState("");
  const [customerId, setCustomerId] = useState("");
  const [serviceProviderId, setServiceProviderId] = useState("");

  // Identify user type.
  useEffect(() => {
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/userrole/getpermission`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((data) => {
        setRoleName(data.data.data.roletag);
      })
      .catch((error) => {
        console.log(error, "error");
      });

    // Get customer chat.
    axios
      .post(
        `${process.env.REACT_APP_APIURL}/karigar/chatrequest/getallchatrequest`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      )
      .then((data) => {
        const records = [];
        data.data.data.map((record) => {
          records.push({
            chatrequestid: record._id,
            customerid: record.customerid._id,
            customername: record.customerid.name,
            serviceprovid: record.serviceprovid._id,
            serviceprovidername: record.serviceprovid.name,
            chatstatus: record.chatstatus,
          });
        });
        setCutomerList(records);
      })
      .catch((error) => {
        console.log(error, "error");
      });
  }, []);

  // Find chat room.
  function findChatRoom(chatReqId, customerId, serviceProviderId) {
    var data = new FormData();
    data.append("userid", chatReqId);
    data.append("otheruserid", customerId);
    data.append("chatrequestid", serviceProviderId);

    axios
      .post(`${process.env.REACT_APP_APIURL}/karigar/chatroom/create`, data, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((data) => {
        console.log(data.data.data, "Data");
        // const records = [];
        // data.data.data.map((record) => {
        //   records.push({
        //     chatrequestid: record._id,
        //     customerid: record.customerid._id,
        //     customername: record.customerid.name,
        //     serviceprovid: record.serviceprovid._id,
        //     serviceprovidername: record.serviceprovid.name,
        //     chatstatus: record.chatstatus,
        //   });
        // });
        // setCutomerList(records);
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
            <div>Chats</div>
          </CCardHeader>

          <section>
            <div className="container py-1">
              <div className="row">
                <div className="col-md-6 col-lg-5 col-xl-4 mb-4 mb-md-0">
                  <div className="card">
                    <div className="card-body">
                      <ul className="list-unstyled mb-0">
                        {cutomerList &&
                          cutomerList.map((item, index) => {
                            return (
                              <li
                                className="p-1 border-bottom bg-light"
                                key={index}
                                onClick={() => {
                                  findChatRoom(
                                    item.chatrequestid,
                                    item.customerid,
                                    item.serviceprovid,
                                  );
                                }}
                              >
                                <div className="pt-1">
                                  <p className="fw-bold mb-2">
                                    {item.customername}
                                  </p>
                                  <p className="small text">
                                    Hello, Are you there?
                                  </p>
                                </div>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="col-md-6 col-lg-7 col-xl-8">
                  <ul className="list-unstyled">
                    {/* Customer chat load */}
                    {}
                    <li className="d-flex justify-content-start mb-1">
                      <div className="card">
                        <div className="card-text">
                          <p>Hi, Hello, How are you? Hi, Hello, How are you?</p>
                        </div>
                      </div>
                    </li>
                    <li className="d-flex justify-content-end mb-1">
                      <div className="card bg-light">
                        <div className="card-text">
                          <p>Hi, I am fine you?</p>
                        </div>
                      </div>
                    </li>
                    {/* Customer chat load */}

                    <li>
                      <div className="form-outline">
                        <textarea
                          className="form-control"
                          id="textAreaExample2"
                          rows="2"
                        ></textarea>
                        Message
                      </div>
                      <button
                        type="button"
                        className="btn btn-info btn-rounded float-end"
                      >
                        Send
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </section>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ViewOffers;
