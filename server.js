const express = require("express");
require("dotenv").config();
const path = require("node:path");
const router = require("./backend/routes/router");
const errorHandler = require("./backend/errors/errorHandler");
const app = express();

// ejs
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// frontend handling
const assetsPath = path.join(__dirname, "frontend");
app.use(express.static(assetsPath));

app.use("/", router);
app.use(errorHandler);

app.listen(process.env.PORT, () =>
  console.log(`app started on port ${process.env.PORT}`)
);
