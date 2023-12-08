const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadFile,getAllPdfFiles,deletePdf,createNewPdf } = require("../Controllers/pdfControllers");

//multer----------------------------------------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

const upload = multer({ storage: storage });


router.post("/upload-files", upload.single("pdfFile"), uploadFile);
router.get("/api",(req,res)=>{
  res.send("success!!!!!!!!!!!!!!!!")
})
router.get("/get-files",getAllPdfFiles);
router.delete("/delete-pdf/:filename",deletePdf);
router.get("/create-pdf/:_id/:filename",createNewPdf)



module.exports = router;
