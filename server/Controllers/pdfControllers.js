const pdfDetailsModel = require("../models/pdfDetailsModels");

console.log("entred to  pdfControllers ");
const uploadFile = async (req, res) => {
  console.log(req.file);
  console.log("req.body", req.body);
  const title = req.body.pdfTitle;
  console.log("title", title, "req.body.pdfTitle:", req.body.pdfTitle);
  const fileName = req.file.filename;
  console.log("fileName", fileName, " req.file.filename:", req.file.filename);
  try {
    await pdfDetailsModel
      .create({ title: title, pdf: fileName })
      .then((data) => {
        res
          .status(200)
          .send({ status: "files Uploaded succesfilly", data: data });
      });
  } catch (error) {
    res.status(500).send("Internal Server Error:", error.response.data);
  }
};

const getAllPdfFiles = async (req, res) => {
  try {
    pdfDetailsModel.find({}).then((data) => {
      res.status(200).send({ status: "files fetched succesfilly", data: data });
    });
  } catch (error) {
    res.status(500).send("Internal Server Error:", error.response.data);
  }
};

const deletePdf = async (req, res) => {
  try {
    const { filename } = req.params;
    pdfDetailsModel.findOneAndDelete({ filename }).then((data) => {
      res.status(200).send({ status: "files deleted succesfully", data: data });
    });
  } catch (error) {
    res.status(500).send("Internal Server Error:", error.response.data);
  }
};

const createNewPdf = async (req, res) => {
  try {
    const pdfId = req.params._id;
    const filename = req.params.filename;
    console.log("req.params", pdfId);

    const originalPdf = await pdfDetailsModel.findById(pdfId);

    const modifiedPdf = await pdfDetailsModel.create({
      title: `${originalPdf.title}-modified`,
      pdf: `${originalPdf.pdf}-modified`, // Corrected property name to 'pdf'
    });

    res.status(200).send({
      status: "Modified pdf file Created successfully",
      data: modifiedPdf,
    });
  } catch (error) {
    console.error("Error creating new PDF:", error);
    res.status(500).send("Error creating new PDF", error.response.data);
  }
};




module.exports = { uploadFile, getAllPdfFiles, deletePdf, createNewPdf };
