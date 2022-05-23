const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");

require("dotenv").config();
const port = process.env.API_PORT || 3031;

app.use("/demo", express.static(path.join("./uploads/demo.html")));

// serving index.html file to client
app.use(express.static("./../adminpanel/build"));

// Database file include.
require("./server/database")
  .connect()
  .then(async (data) => {
    app.use(express.json());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Image showing into browser.
    app.use("/uploads", express.static(path.join("./uploads")));

    app.use("/static", express.static("./assets/"));

    // Route file include.
    app.use(require("./routes/"));

    // Error controller in app
    const errorController = require("./helper/errorController");
    app.use(errorController);
  })
  .catch((err) => {
    console.log(err, "Error");
  });

// configuration of cors
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Socket database file include.
const {
  sendMessage,
  changeStatus,
  createChatRoom,
} = require("./socket/chat.js");

const server = http.createServer(app);
const { Server } = require("socket.io");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  // Save message.
  socket.on("onChat", async (getData) => {
    try {
      let data = {};
      data.senderid = getData.senderid;
      data.receiverid = getData.receiverid;
      data.message = getData.message;

      let resData = await sendMessage(data);

      io.emit("onChat", resData);
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  try {
    socket.on("getMessage", async (data) => {
      let resData = await createChatRoom(data);
      io.emit("getMessage", resData);
    });
  } catch (error) {
    socket.emit("error", error.message);
  }

  // Change status accept or reject.
  try {
    socket.on("changestatus", async (data) => {
      let resData = await changeStatus(data);
      socket.emit("changestatus", resData);
    });
  } catch (error) {
    socket.emit("error", error.message);
  }
});

// Create server and port number defined.
server.listen(port, () => console.log(`Server app listening on port: ${port}`));
