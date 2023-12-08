const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const path = require("path");
const pdfUploadRoute = require("./Routes/pdfRoute")

require("dotenv").config();

app.use(express.json());
app.use(cors());
app.use("/files",express.static(path.join(__dirname,"files")));

const port = process.env.PORT || 5001;
const connectionUrl = process.env.ATLAS_URL;


mongoose
  .connect(connectionUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Database Connection Established 😎 "))
  .catch((error) =>
    console.log("Database Connection Filed 😓: ", error.message)
  );

  app.use("/",pdfUploadRoute);


  app.listen(port, (req, res) => {
    console.log(`Serverrunning on port...: ${port}`);
  });


