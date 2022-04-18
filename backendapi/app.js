const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Socket io code
const http = require("http").Server(app);
const io = require("socket.io")(http);

// const { createChatReq } = require("./socket/chat_request.js");

const {
  createChatReq,
  changeStatus,
  getAllMessage,
  sendMessage,
} = require("./socket/chat_request.js");

const { on } = require("stream");
const res = require("express/lib/response");

io.on("connection", (socket) => {
  console.log("SOCKET connected", socket.id);

  socket.on("sendrequest", async (msgData) => {
    try {
      let data = {};
      data.message = msgData;
      data.customerid = "62591ed0791660342d5f1469";
      data.serviceprovid = "625940c8b3e716196a5d4c70";

      await createChatReq(data);
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("changestatus", async (msgData) => {
    try {
      let data = {};
      data.chatroomid = "625d263b4cd74390666fcece";
      data.chatstatus = 2;
      await changeStatus(data);
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("getmessage", async (msgData) => {
    try {
      let data = {};
      data.chatroomid = "625d263b4cd74390666fcece";
      await getAllMessage(data);
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("sendmessage", async (msgData) => {
    try {
      let data = {};
      data.senderid = "62591ed0791660342d5f1469";
      data.receiverid = "625940c8b3e716196a5d4c70";
      data.message = msgData;
      await sendMessage(data);
    } catch (error) {
      socket.emit("error", error.message);
    }
  });
});

app.use("/demo", express.static(path.join("./uploads/demo.html")));

// ENV file include.
require("dotenv").config();
const port = process.env.API_PORT || 3031;

// Create server and port number defined.
http.listen(port, () => console.log(`Server app listening on port: ${port}`));

// Database file include.
require("./server/database")
  .connect()
  .then(async (data) => {
    app.use(express.json());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Image showing into browser.
    app.use("/uploads", express.static(path.join("./uploads")));

    app.use(cors());

    // Route file include.
    app.use(require("./routes/"));

    // Error controller in app
    const errorController = require("./helper/errorController");
    app.use(errorController);
  })
  .catch((err) => {
    console.log(err, "Error");
  });
