import axios from "axios";
import React, { useState } from "react";
import { Document, Page } from "react-pdf";
import { ToastContainer, toast } from "react-toastify";

function PdfComponent({
  pdfs,
  pdfTitle,
  _id,
  filename,
  getAllPdf = { getAllPdf },
  resetForm,
}) {
  console.log("________________id:", _id);
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [selectedPages, setSelectedPages] = useState([]);

  console.log(" pdfs.datas", pdfs);
  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages);
  }

  const handleTogglePage = (page) => {
    setSelectedPages((prevSelected) => {
      if (prevSelected.includes(page)) {
        return prevSelected.filter((selectedPage) => selectedPage !== page);
      } else {
        return [...prevSelected, page];
      }
    });
  };

  const handleCreateNewPdf = async () => {
    try {
      const result = await axios.get(
        `http://localhost:5001/create-pdf/${_id}/${filename}`
      );

      console.log("New PDF Created Succesfully", result.data);

      resetForm();

      getAllPdf();

     

      toast.success("File Created successfully", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      toast.error("File Creation failed", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.error(
        "Creation of new PDF from Existing PDF Failed:",
        error.result.data
      );
    }
  };

  return (
    <>
      <ToastContainer />
      <div className=" bg-fuchsia-400 p-4 sm:p-8 text-fuchsia-900">
        <h2 className=" font-semibold text-center text-3xl">{pdfTitle}</h2>
        <div className="text-center">
          <p>
            Page {pageNumber} of {numPages}
          </p>
          <div className="flex justify-end"></div>
          {numPages && (
            <div className="flex justify-end">
              <div className="pagination-container flex items-center overflow-x-auto ">
                <div className="scroll-auto flex items-center overflow-x-auto max-h-24">
                  {Array.from({ length: numPages }, (_, i) => i + 1).map(
                    (page) => (
                      <label key={page}>
                        <input
                          type="checkbox"
                          value={page}
                          checked={selectedPages.includes(page)}
                          onChange={() => handleTogglePage(page)}
                        />
                        Page {page}
                      </label>
                    )
                  )}
                </div>
              </div>

              <button
                className={`bg-fuchsia-800 p-2 rounded-md border-4 text-white border-y-fuchsia-900 hover:bg-fuchsia-700 ${
                  numPages && numPages > 1
                    ? ""
                    : "opacity-50 cursor-not-allowed"
                }`}
                disabled={!numPages || numPages <= 1}
                onClick={() => {
                  handleCreateNewPdf();
                }}
              >
                Create New Pdf
              </button>
            </div>
          )}

          <div className="flex flex-wrap justify-center items-center">
            <Document file={pdfs} onLoadSuccess={onDocumentLoadSuccess}>
              {Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
                <Page
                  key={`${pdfs}_${page}`}
                  pageNumber={page}
                  renderTextLayer={false}
                  renderAnnotationLayer={false}
                  className="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 xl:w-1/5 p-2 sm:p-4 my-2 sm:my-4"
                />
              ))}
            </Document>
          </div>
        </div>
      </div>
    </>
  );
}

export default PdfComponent;
