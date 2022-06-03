import React, { useEffect, useState } from "react";

import { CCard, CCardHeader, CCol, CRow } from "@coreui/react";

import io from "socket.io-client";
const socket = io.connect(process.env.REACT_APP_APIURL);

const ViewCustomerChat = () => {
  const token = localStorage.getItem("karigar_token");

  const [cutomerList, setCutomerList] = useState([]);
  const [getAllMessage, setGetAllMessage] = useState([]);
  const [customerDetails, setCustomerDetails] = useState("");
  const [typeMessage, setTypeMessage] = useState("");

  console.log(customerDetails, "customerDetails");

  useEffect(() => {
    let unmounted = false;
    // get all customer list for service provider.
    if (token) {
      socket.emit("getCusChat", token);

      socket.on("getCusChat", function (data) {
        if (data !== null) {
          const records = [];
          data.map((record) => {
            records.push({
              chatrequestid: record._id,
              customerid: record.customerid._id,
              customername: record.customerid.name,
              serviceprovid: record.serviceprovid._id,
              serviceprovname: record.serviceprovid.name,
              chatstatus: record.chatstatus,
              lastmsg: record.lastmsg,
              msgtime: record.msgtime,
            });
          });
          setCutomerList(records);
        }
      });
    } else {
      console.log("Token is required");
    }

    // // get all service provider list for customer.
    // if (token) {
    //   socket.emit(
    //     "getSerProChat",
    //     "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYyNTk0MGZiYjNlNzE2MTk2YTVkNGM3NCIsInVzZXJyb2xsIjoiNjI3YTI0MDljNDNkNjkxNzFkZWFhM2JhIiwicm9sZXRhZyI6IkNVU1RPTUVSIiwiaWF0IjoxNjUzNzE0NjE1fQ.anlc1Y0nEBP94ErWuDS4YMDh9LCNU-Prpm1STE_KFu8",
    //   );

    //   socket.on("getSerProChat", function (data) {
    //     if (data) {
    //       console.log(data, "data");
    //       // const records = [];
    //       // data.map((record) => {
    //       //   records.push({
    //       //     chatrequestid: record._id,
    //       //     customerid: record.customerid._id,
    //       //     customername: record.customerid.name,
    //       //     serviceprovid: record.serviceprovid._id,
    //       //     serviceprovname: record.serviceprovid.name,
    //       //     chatstatus: record.chatstatus,
    //       //   });
    //       // });
    //       // setCutomerList(records);
    //     }
    //   });
    // } else {
    //   console.log("Token is required");
    // }
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
  function changeStatus(customerid, serviceprovid, chatreqid, status) {
    let data = {};
    data.customerid = customerid;
    data.serviceprovid = serviceprovid;
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
    let sendData = {};

    // sendData.senderid = customerDetails.serviceprovid;
    sendData.senderid = customerDetails.serviceprovid;
    sendData.receiverid = customerDetails.customerid;
    sendData.message = typeMessage && typeMessage;

    socket.emit("onChat", sendData);

    socket.on("onChat", function (resData) {
      let lastMsg = cutomerList.map((cusList) => {
        if (customerDetails.chatrequestid === cusList.chatrequestid) {
          return { ...cusList, lastmsg: typeMessage, msgtime: resData.msgtime };
        } else {
          return cusList;
        }
      });
      setCutomerList(lastMsg);
      if (getAllMessage.length > 0) {
        return setGetAllMessage([...getAllMessage, resData]);
      } else {
        return setGetAllMessage([resData]);
      }
    });
    setTypeMessage("");
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
                        {cutomerList
                          ? cutomerList.map((item, index) => {
                              return (
                                <li
                                  className={`${
                                    item.customerid ===
                                    customerDetails.customerid
                                      ? "p-1 border-bottom bg-light"
                                      : "p-1 border-bottom"
                                  }`}
                                  key={index}
                                  onClick={() => {
                                    setCustomerDetails("");
                                    setCustomerDetails(item);
                                  }}
                                >
                                  <div className="container">
                                    <div className="row">
                                      <div className="col-md-auto">
                                        <p className="fw-bold mb-0">
                                          {item.customername &&
                                            item.customername}
                                        </p>
                                      </div>
                                      <div className="col">
                                        <p className="mb-0 d-flex justify-content-end">
                                          {item.msgtime && item.msgtime}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="col">
                                      <p className="w-100 small text">
                                        {item.lastmsg ? item.lastmsg : " "}
                                      </p>
                                    </div>
                                  </div>
                                </li>
                              );
                            })
                          : ""}
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
                                            {msg.message + " " + msg.msgtime}
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
                          <div
                            className="btn-group mr-2"
                            role="group"
                            aria-label="First group"
                          >
                            <button
                              type="button"
                              className="btn btn-outline-primary"
                              onClick={() => {
                                changeStatus(
                                  customerDetails.customerid,
                                  customerDetails.serviceprovid,
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
