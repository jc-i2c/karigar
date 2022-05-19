const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const http = require("http");

require("dotenv").config();
const port = process.env.API_PORT || 3031;

app.use("/demo", express.static(path.join("./uploads/demo.html")));

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
  socket.on("onChat", async (msg) => {
    try {
      let data = {};
      data.senderid = "62595ef9c2362694626aae6e";
      data.receiverid = "625940c8b3e716196a5d4c70";
      data.message = msg;
      await sendMessage(data);

      io.emit("emittest", msg);
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
