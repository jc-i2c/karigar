import React, { useEffect, useState } from "react";
import axios from "axios";

import { CCard, CCardHeader, CCol, CRow } from "@coreui/react";

import io from "socket.io-client";
const socket = io.connect(process.env.REACT_APP_APIURL);

const ViewCustomerChat = () => {
  const token = localStorage.getItem("karigar_token");

  const [cutomerList, setCutomerList] = useState([]);
  const [getAllMessage, setGetAllMessage] = useState([]);
  const [customerDetails, setCustomerDetails] = useState("");
  const [typeMessage, setTypeMessage] = useState("");

  useEffect(() => {
    let unmounted = false;

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

  useEffect(() => {
    if (customerDetails) {
      if (customerDetails.chatstatus == "2") {
        let data = {};
        data.chatrequestid = customerDetails.chatrequestid;
        data.customerid = customerDetails.customerid;
        data.serviceprovid = customerDetails.serviceprovid;

        socket.emit("getMessage", data);

        socket.on("getMessage", function (data) {
          setGetAllMessage(data);
        });
      }
    }
  }, [customerDetails]);

  // Change status accept or reject.
  function changeStatus(chatreqid, status) {
    let data = {};
    data.chatreqid = chatreqid;
    data.status = status;
    socket.emit("changestatus", data);

    socket.on("changestatus", function (data) {
      if (status == "3") {
        let updateData = cutomerList.filter(
          (item) => item.chatrequestid !== chatreqid,
        );
        setCustomerDetails("");
        setCutomerList(updateData);
      } else {
        let updateData = cutomerList.map((list) => {
          if (list.chatrequestid == chatreqid) {
            let newData = { ...list, chatstatus: data.chatstatus };
            setCustomerDetails(newData);
            return newData;
          } else {
            return list;
          }
        });
        setCutomerList(updateData);
      }
    });
  }

  // Send message
  function sendMessage() {
    setTypeMessage("");
    let sendData = {};

    sendData.senderid = customerDetails.serviceprovid;
    sendData.receiverid = customerDetails.customerid;
    sendData.message = typeMessage && typeMessage;

    socket.emit("onChat", sendData);

    socket.on("onChat", function (resData) {
      setGetAllMessage([...getAllMessage, resData]);
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
                <div className="col-md-6 col-lg-5 col-xl-4 mb-md-0">
                  <div className="card">
                    <div className="card-body">
                      <ul className="list-unstyled mb-0">
                        {cutomerList &&
                          cutomerList.map((item, index) => {
                            return (
                              <li
                                className={`${
                                  item.customerid === customerDetails.customerid
                                    ? "p-1 border-bottom bg-light"
                                    : "p-1 border-bottom"
                                }`}
                                key={index}
                                onClick={() => {
                                  setCustomerDetails("");
                                  setCustomerDetails(item);
                                }}
                              >
                                <p className="fw-bold mb-0">
                                  {item.customername}
                                </p>
                                <p className="small text mb-1">
                                  Hello, Are you there?
                                </p>
                              </li>
                            );
                          })}
                      </ul>
                    </div>
                  </div>
                </div>

                {customerDetails && (
                  <div className="col-md-6 col-lg-7 col-xl-8">
                    <div className="card">
                      <div className="card-title">
                        <div className="card-header bg-light d-flex justify-content-between align-items-center">
                          <h5>{customerDetails.customername}</h5>
                        </div>
                      </div>
                      {customerDetails.chatstatus == "2" ? (
                        <ul className="list-unstyled">
                          {getAllMessage &&
                            getAllMessage.map((msg, index) => {
                              if (
                                msg.receiverid == customerDetails.customerid
                              ) {
                                return (
                                  <li
                                    className="d-flex justify-content-end mb-1"
                                    key={index}
                                  >
                                    <div className="card bg-light">
                                      <div className="d-flex">
                                        <div className="card-text">
                                          <p className="p-1 mb-0">
                                            {msg.message + " " + msg.createdAt}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                );
                              } else {
                                return (
                                  <li
                                    className="d-flex justify-content-start mb-1"
                                    key={index}
                                  >
                                    <div className="card">
                                      <div className="d-flex">
                                        <div className="card-text">
                                          <p className="p-1 mb-0">
                                            {msg.message + " " + msg.createdAt}
                                          </p>
                                        </div>
                                      </div>
                                    </div>
                                  </li>
                                );
                              }
                            })}

                          <li>
                            <br />
                            <div className="form-outline">
                              <textarea
                                placeholder="Type message"
                                className="form-control"
                                id="textAreaExample2"
                                rows="2"
                                value={typeMessage ? typeMessage : ""}
                                onChange={(e) => {
                                  setTypeMessage(e.target.value);
                                }}
                              />
                            </div>
                            <br />
                            <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                              <button
                                type="button"
                                className="btn btn-outline-primary"
                                disabled={!typeMessage}
                                onClick={() => {
                                  setTypeMessage("");
                                  sendMessage();
                                }}
                              >
                                Send
                              </button>
                            </div>
                          </li>
                        </ul>
                      ) : (
                        <div className="card-body">
                          <p className="card-text">
                            {customerDetails.customername} have been sent you
                            request!
                          </p>

                          <button
                            type="button"
                            className="btn btn-outline-primary"
                            onClick={() => {
                              changeStatus(customerDetails.chatrequestid, "2");
                            }}
                          >
                            Accept
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            onClick={() => {
                              changeStatus(customerDetails.chatrequestid, "3");
                            }}
                          >
                            Reject
                          </button>
                        </div>
                      )}
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
