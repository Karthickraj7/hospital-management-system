import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function Report() {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const [pdfUrl, setPdfUrl] = useState(null);

  const ResultEntryNavigationdata = useSelector(
    (state) => state.Frontoffice?.ResultEntryNavigationdata
  );
console.log(pdfUrl)
  useEffect(() => {
    const fetchPDF = async () => {
      try {
        const response = await axios.get(
          `${urllink}OP/ReportData?Request_Id=${ResultEntryNavigationdata?.Request_Id}`,
          {
            responseType: "arraybuffer", // Use arraybuffer to work with pdf-lib
          }
        );
console.log(response)
        // Load the PDF data into pdf-lib
        const pdfDoc = response.data;

        const modifiedPdfUrl = URL.createObjectURL(
          new Blob([pdfDoc], { type: "application/pdf" })
        );

        setPdfUrl(modifiedPdfUrl); // Set the URL to the modified PDF
      } catch (error) {
        console.error("Error fetching or editing PDF:", error);
      }
    };

    fetchPDF();
  }, [urllink, ResultEntryNavigationdata]);

  return (
    <>
      {/* <div>Generating report...</div> */}
      <div>
        <h1>Test Report</h1>
        {pdfUrl && (
           <div style={{display: 'flex',alignItems: 'center',justifyContent: 'center'}}>

           <iframe
          style={{
            height: '400px',
            width: '800px',
            backgroundColor: '#f0f0f0',
            border: 'none',
          }}
          src={pdfUrl}
        /> 
       </div> 
          
        )}
      </div>
    </>
  );
}


export default Report;
