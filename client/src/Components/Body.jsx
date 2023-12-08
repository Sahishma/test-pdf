import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { pdfjs } from "react-pdf";
import PdfComponent from "./PdfComponent";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

const Body = () => {
  const [filePlaceholder, setFilePlaceholder] = useState("Choose a PDF File");

  const [allPdfs, setAllPdfs] = useState([]); // initializing state to hold all pdfs

  const [pdfs, setPdfs] = useState([]);

  const [title,setTitle] = useState([]);

  const[pdfId,setPdfId] = useState([]);

  const [filename,setFilname] = useState([])

console.log("heeeeyyyuuuuuu",pdfs);

  const getAllPdf = async () => {
    try {
      const result = await axios.get("http://localhost:5001/get-files");
      console.log(result.data.data);
      setAllPdfs(result.data.data);
    } catch (error) {
      console.error("Error fetching PDFs:", error);
    }
  };

  useEffect(() => {
    getAllPdf();
  }, []);

  const onSubmit = async (values, { setSubmitting, resetForm }) => {
    console.log("submitted:", values.pdfFile, "title:", values.pdfTitle);

    const formData = new FormData();
    formData.append("pdfTitle", values.pdfTitle);
    formData.append("pdfFile", values.pdfFile);

    try {
      const result = await axios.post(
        "http://localhost:5001/upload-files",
        formData
      );

      console.log("upload result", result);

      setSubmitting(false);

      // Reset the form
      resetForm();

      // Reset the filePlaceholder
      setFilePlaceholder("Choose a PDF File");

      getAllPdf(); // Call the getAllPdf function to update the pdfs state

      toast.success("File uploaded successfully", {
        position: "top-right",
        autoClose: 3000, // Duration of the toast in milliseconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.log("Upload error:", error.response.data);
      // Handle the error or show an error message to the user
      toast.error("File upload failed", {
        position: "top-right",
        autoClose: 3000, // Duration of the toast in milliseconds
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const formik = useFormik({
    initialValues: {
      pdfTitle: "",
      pdfFile: null,
    },
    validationSchema: Yup.object({
      pdfFile: Yup.mixed()
        .required("Please select a PDF file")
        .test(
          "fileType",
          "invalid file format.Please upload a PDF file.",
          (value) => {
            return value && value.type === "application/pdf";
          }
        ),

      pdfTitle: Yup.string().required("Please enter a title for your PDF"),
    }),
    onSubmit,
  });

  const handleFileChange = (event) => {
    const selectedFile = event.currentTarget.files[0];
    console.log("selected file:", selectedFile);

    formik.setFieldValue("pdfFile", selectedFile);
    setFilePlaceholder(selectedFile ? selectedFile.name : "Choose a PDF File");
  };
  const showPdf = async (pdf) => {
    console.log(pdf);
    //window.open(`http://localhost:5001/files/${pdf}`, "_blank", "noreferrer");
    setPdfs(`http://localhost:5001/files/${pdf}`);
  };

  

  const deletePdf = async (pdf) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this PDF?"
    );

    if (!confirmed) return;

    try {
      const result = await axios.delete(
        `http://localhost:5001/delete-pdf/${pdf}`
      );
      console.log("deleted Successful", result.data);
      toast.success("File deleted successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      getAllPdf();
    } catch (error) {
      
      toast.error("File deletion failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
    
      <ToastContainer />
      <form onSubmit={formik.handleSubmit}>
        <div className=" overflow-hidden flex bg-fuchsia-100 text-white font-semibold ">
       
          <input
            type="text"
            id="pdfTitle"
            name="pdfTitle"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.pdfTitle || ""}
            placeholder="Enter Title for Your PDF"
             className=" bg-white ml-32 my-20 pt-5 pb-5 flex-auto w-64 rounded-l-2xl text-center  text-fuchsia-800 hover:bg-fuchsia-300 border-4 border-fuchsia-800"
            
          />
          <label
            htmlFor="pdfFile"
            className="border-4 border-fuchsia-800  bg-white text-fuchsia-800   ml-0  my-20 pt-5 pb-5  flex-auto w-64  text-center  hover:bg-fuchsia-300  "
           
          >
            {filePlaceholder}
            <input
              type="file"
              id="pdfFile"
              name="pdfFile"
              accept=".pdf"
              onChange={handleFileChange}
              onBlur={formik.handleBlur}
              className="absolute opacity-0 w-0 "
            />
          </label>
          <button
            type="submit"
            className="bg-fuchsia-800    border-fuchsia-800 mr-52 my-20 pt-5 pl-3 pr-3  border-4 flex  w-32 rounded-r-2xl text-center hover:bg-fuchsia-600"
          >
            Upload
          </button>
        </div>
      </form>
     
      <div className="overflow-hidden text-center mt-4">
    
        <h2 className="text-3xl text-fuchsia-900 font-bold bg-fuchsia-100 p-4">
          _____________Your files_____________
        </h2>
      </div>
      
      <div className="flex-auto justify-between m-8 sm:space-y-0 sm:space-x-4 md:space-x-8 lg:space-x-12">
  
        <div  >
          {allPdfs == null
            ? ""
            : allPdfs.map((data) => {
                return (
                  <div
                    key={data._id}
                    className="flex flex-col sm:flex-row text-center w-full sm:w-1/2 md:w-1/3 lg:w-1/4 py-1"
                  >

                    <h3 className="bg-fuchsia-300 sm:w-full md:w-full lg:w-full px-2 py-2 rounded-bl-md rounded-tl-md sm:rounded-bl-md sm:rounded-tl-md whitespace-no-wrap">
                      {data.title}
                    </h3>

                    <div className="flex mt-2 sm:mt-0">

                      <button
                        className="bg-fuchsia-800 text-white px-2 py-1 hover:bg-fuchsia-500  whitespace-no-wrap"
                        onClick={() => {
                          showPdf(data.pdf);
                          setTitle(data.title)
                          setPdfId(data._id)
                          setFilname(data.pdf)
                        }}
                      >
                        View pdf 
                      </button>
                      <button
                        className="bg-red-500 text-white px-2 py-1 hover:bg-orange-900 sm:rounded-br-md sm:rounded-tr-md  whitespace-no-wrap"
                        onClick={() => {
                          deletePdf(data.pdf);
                        }}
                      >
                        delete pdf
                      </button>
                    </div>
                  </div>
                );
              })}
        </div>
      </div>
      <PdfComponent pdfs={pdfs} pdfTitle={title} _id={pdfId} filename={filename}  getAllPdf={getAllPdf} resetForm={formik.resetForm}/>
      
    </>
  );
};

export default Body;
