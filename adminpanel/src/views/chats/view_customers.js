import React, { useEffect, useState } from "react";
import axios from "axios";

import { CCard, CCardHeader, CCol, CRow, CButton } from "@coreui/react";

import io from "socket.io-client";
const socket = io.connect(process.env.REACT_APP_APIURL);

const ViewCustomerChat = () => {
  const token = localStorage.getItem("karigar_token");
  const [chatClick, setChatClick] = useState(false);

  const [cutomerList, setCutomerList] = useState([]);

  const [roleName, setRoleName] = useState("");
  const [message, setMessage] = useState("");

  const [customerDetails, setCustomerDetails] = useState("");

  useEffect(() => {
    let unmounted = false;

    // Identify user type.
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
        if (data.data.data) {
          const records = [];
          data.data.data.map((record) => {
            records.push({
              chatrequestid: record._id,
              customerid: record.customerid._id,
              customername: record.customerid.name,
              serviceprovid: record.serviceprovid._id,
              serviceprovname: record.serviceprovid.name,
              chatstatus: record.chatstatus,
            });
          });
          setCutomerList(records);
        }
      })
      .catch((error) => {
        console.log(error, "error");
      });
    return () => {
      unmounted = true;
    };
  }, []);

  // Send message.
  function sendMessage() {
    socket.emit("onChat", message);
  }

  // Change status accept or reject.
  function changeStatus(chatreqid, status) {
    let data = {};
    data.chatreqid = chatreqid;
    data.status = status;
    socket.emit("changestatus", data);

    socket.on("changestatus", function (data) {
      if (status == "3") {
        let filterData = cutomerList.filter(
          (item) => item.chatrequestid !== chatreqid,
        );
        setCutomerList(filterData);
        if (cutomerList.length == 0) {
          setChatClick(false);
        }
      } else {
        let updateData = cutomerList.map((list) => {
          if (list.customerid == data.customerid) {
            let newData = { ...list, chatstatus: data.chatstatus };
            return newData;
          } else {
            return list;
          }
        });
        setCutomerList(updateData);
      }
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
                                  setCustomerDetails(item);
                                  setChatClick(true);
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

                {chatClick && (
                  <div className="col-md-6 col-lg-7 col-xl-8">
                    <div className="card">
                      {cutomerList.map((item, index) => {
                        return item.chatstatus == "2" ? (
                          <ul className="list-unstyled" key={index}>
                            {/* Customer chat load */}
                            <li className="d-flex justify-content-start mb-1">
                              <div className="card">
                                <div className="d-flex p-1">
                                  <div className="card-text">
                                    <p>Hi, Hello, How are you?</p>
                                  </div>
                                </div>
                              </div>
                            </li>
                            <li className="d-flex justify-content-end mb-1">
                              <div className="card bg-light">
                                <div className="d-flex p-1">
                                  <div className="card-text">
                                    <p>Hi, I am fine you?</p>
                                  </div>
                                </div>
                              </div>
                            </li>

                            <li>
                              <div className="form-outline">
                                <textarea
                                  className="form-control"
                                  id="textAreaExample2"
                                  rows="2"
                                  onChange={(e) => {
                                    setMessage("");
                                    setMessage(e.target.value);
                                  }}
                                ></textarea>
                                Message
                              </div>
                              <button
                                type="button"
                                className="btn btn-info btn-rounded float-end"
                                onClick={() => {
                                  sendMessage();
                                }}
                              >
                                Send
                              </button>
                            </li>
                          </ul>
                        ) : (
                          <div className="card-body" key={index}>
                            <h5 className="card-title">
                              {customerDetails.customername}
                            </h5>
                            <p className="card-text">
                              have been sent you request!
                            </p>

                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={() => {
                                changeStatus(
                                  customerDetails.chatrequestid,
                                  "2",
                                );
                              }}
                            >
                              Accept
                            </button>
                            <button
                              type="button"
                              className="btn btn-outline-danger"
                              onClick={() => {
                                changeStatus(
                                  customerDetails.chatrequestid,
                                  "3",
                                );
                              }}
                            >
                              Reject
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>
        </CCard>
      </CCol>
    </CRow>
  );
};

export default ViewCustomerChat;
