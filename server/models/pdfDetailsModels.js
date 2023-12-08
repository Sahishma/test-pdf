const mongoose = require("mongoose");

const pdfDetailsSchema = new mongoose.Schema({
  pdf: String,
  title: String,
});

const pdfDetailsModel = mongoose.model("pdfDetails", pdfDetailsSchema);

module.exports = pdfDetailsModel;
