const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");
var useragent = require("express-useragent");

require("dotenv").config();
const port = process.env.API_PORT || 3031;

// Database file include.
require("./server/database")
  .connect()
  .then(async (data) => {
    app.use(express.json());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    app.use(useragent.express());

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
  getAllChatRequest,
  getAllCusChatRequest,
} = require("./socket/chat.js");

const server = http.createServer(app);
const { Server } = require("socket.io");
const { error } = require("console");

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  // console.log("Socket connection");

  // Save message. // Send message
  socket.on("onChat", async (getData) => {
    try {
      let { chatCraeteQry, roomId } = await sendMessage(getData);
      io.to(roomId.toString()).emit("onChat", chatCraeteQry);
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  socket.on("getMessage", async (data) => {
    try {
      let currentRoomId = null;
      const joinRoom = (roomid) => {
        currentRoomId = roomid.toString();
        socket.join(roomid.toString());
      };
      let resData = await createChatRoom(data, joinRoom);

      io.to(currentRoomId).emit("getMessage", resData);
      // io.emit("getMessage", resData);
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  // Change status accept or reject.
  socket.on("changestatus", async (data) => {
    try {
      let resData = await changeStatus(data);
      socket.emit("changestatus", resData);
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  // get all chat customer.
  socket.on("getCusChat", async (token) => {
    try {
      let resData = await getAllChatRequest(token);
      socket.emit("getCusChat", resData);
    } catch (error) {
      socket.emit("error", error.message);
    }
  });

  // get all chat service provider.
  socket.on("getSerProChat", async (token) => {
    try {
      let resData = await getAllCusChatRequest(token);

      socket.emit("getSerProChat", resData);
    } catch (error) {
      socket.emit("error", error.message);
    }
  });
});

// Create server and port number defined.
server.listen(port, () => console.log(`Server app listening on port: ${port}`));
