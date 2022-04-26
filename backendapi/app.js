const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Socket io code
const http = require("http").Server(app);
const io = require("socket.io")(http);

const { sendMessage } = require("./socket/chat.js");

io.on("connection", (socket) => {
  socket.on("ontest", async (msg) => {
    try {
      let data = {};
      data.senderid = "62594136b3e716196a5d4c78";
      data.receiverid = "62595ef9c2362694626aae6e";
      data.message = msg;
      await sendMessage(data);

      io.emit("emittest", msg);
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

    app.use("/static", express.static("./assets/"));

    var corsOptions = {
      origin: "*",
    };

    app.use(cors(corsOptions));

    // Route file include.
    app.use(require("./routes/"));

    // Error controller in app
    const errorController = require("./helper/errorController");
    app.use(errorController);
  })
  .catch((err) => {
    console.log(err, "Error");
  });
