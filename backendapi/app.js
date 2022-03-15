const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");

// Database file include.
require("./server/database")
  .connect()
  .then(async (data) => {
    const app = express();
    app.use(express.json());
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: true }));

    // Image showing into browser.
    app.use("/uploads", express.static(path.join("./uploads")));

    app.use(cors());

    // ENV file include.
    require("dotenv").config();
    const port = process.env.API_PORT || 3031;

    // Route file include.
    app.use(require("./routes/"));

    // Error controller in app
    const errorController = require("./helper/errorController");
    app.use(errorController);

    // Create server and port number defined.
    app.listen(port, () =>
      console.log(`Server app listening on port: ${port}`)
    );
  })
  .catch((err) => {
    console.log(err, "Error");
  });
