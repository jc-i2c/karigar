const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Socket io code
const http = require("http").Server(app);
const io = require("socket.io")(http);

const { createChatReq, changeStatus } = require("./socket/chat_request.js");
const { on } = require("stream");

io.on("connection", (socket) => {
  // console.log("SOCKET connected", socket.id);

  socket.on("sendrequest", async (msgData) => {
    try {
      console.log(msgData, "msgData");
      const { customerid, serviceprovid } = msgData;
      await createChatReq({ ...msgData });
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("changestatus", async (msgData) => {
    try {
      console.log(msgData, "msgData");
      const { chatrequestid, chatstatus } = msgData;
      await changeStatus({ ...msgData });
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
