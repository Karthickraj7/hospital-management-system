

import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import KMCHlogo from "../Assets/KMCHlogo.png";
import sdalogo from "../Assets/sdalogo.jpeg";
import isologo from "../Assets/isologo.jpeg";

function decodeUtf8Base64(str) {
  try {
    // First try standard base64 decoding
    const decoded = atob(str.replace(/\s/g, ''));
    // Then decode UTF-8
    return decodeURIComponent(escape(decoded));
  } catch (e) {
    console.error('Error decoding content:', e);
    return 'Error decoding content';
  }
}

const FakeReportView = () => {
  const componentRef = useRef();
  const capturedatas = useSelector((state) => state.userRecord?.Samplecapture);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [content, setContent] = useState("");
  const [useHeader, setUseHeader] = useState(true);

  const MCIReportdata = useSelector(state => state.Frontoffice?.MCIReportdata);

  console.log(MCIReportdata,'MCIReportdata')

  
  

  useEffect(() => {
    try {
      if (!MCIReportdata[0]?.html) {
        setContent("<p>No content available.</p>");
        return;
      }

      // Clean and decode the HTML content
      const cleanBase64 = MCIReportdata[0].html.trim().replace(/\s/g, "");
      const decodedContent = decodeUtf8Base64(cleanBase64);
      
      // Process the content to ensure proper formatting
      const processedContent = decodedContent
        .replace(/&nbsp;/g, ' ')  // Replace &nbsp; with regular spaces
        .replace(/<p><br><\/p>/g, '<p></p>')  // Clean empty paragraphs
        .replace(/<p>\s*<\/p>/g, '<p></p>');  // Clean whitespace-only paragraphs

      setContent(processedContent);
      
    } catch (e) {
      console.error("Error processing content:", e);
      setContent("<p>Error processing content.</p>");
    }
  }, [MCIReportdata]);

  const getPageStyle = () => `
    @media print {
      @page {
        size: A4 !important;
        margin-top: ${useHeader ? '0 cm' : '3.4cm'} !important;
        margin-bottom: ${useHeader ? '3cm' : '3cm'} !important;
        margin-left: 20px !important;
        margin-right: 20px !important;
      }
      
      body {
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        -webkit-print-color-adjust: exact !important;
        print-color-adjust: exact !important;
      }

      /* Header and Footer */
      ${useHeader ? `
        #pageHeader {
          position: running(pageHeader) !important;
          top: 0 !important;
          width: 100% !important;
          box-sizing: border-box !important;
          padding: 10px !important;
        }
        #pageFooter {
          position: running(pageFooter) !important;
          bottom: 0 !important;
          width: 100% !important;
          box-sizing: border-box !important;
          padding: 10px !important;
        }
        @top-center { content: element(pageHeader) !important; }
        @bottom-center { content: element(pageFooter) !important; }
      ` : `
        #pageHeader, #pageFooter {
          display: none !important;
        }
      `}

      /* Page numbering */
      .pageNumber:before { 
        content: counter(page) !important; 
      }

      /* Patient details section */
      .patient-details-section {
        page-break-inside: avoid !important;
        margin: 10px !important;
        font-size: 15px !important;
      }

      /* Report content */
      .report-content {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        font-family: Tahoma, Arial, sans-serif !important;
        font-size: 11pt !important;
        line-height: 1.5 !important;
      }

      /* Lists */
      .report-content ul {
        list-style-type: disc !important;
        margin-left: 20px !important;
        padding-left: 20px !important;
      }

      .report-content ol {
        list-style-type: decimal !important;
        margin-left: 20px !important;
        padding-left: 20px !important;
      }

      .report-content li {
        display: list-item !important;
        margin-bottom: 8px !important;
      }

      /* Tables */
      .report-content table {
        border-collapse: collapse !important;
        width: 100% !important;
        box-sizing: border-box !important;
        margin: 10px 0 !important;
      }

      .report-content th, 
      .report-content td {
        border: 1px solid black !important;
        padding: 8px 12px !important;
        text-align: left !important;
        box-sizing: border-box !important;
      }

      /* Paragraphs */
      .report-content p {
        margin-bottom: 12px !important;
        max-width: 100% !important;
      }

      /* Doctor details */
      .doctor-details {
        text-align: right !important;
        width: 100% !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        padding: 0 8px 0 0 !important;
        overflow: visible !important;
        white-space: normal !important;
      }

      /* Hide print buttons */
      .Register_btn_con, 
      .sdcyysc_uxcds67 {
        display: none !important;
      }
    }
    
    /* Screen styles */
    @media screen {
      #pageHeader, 
      #pageFooter {
        display: none !important;
      }
      
      .report-content {
        width: 100% !important;
        max-width: 100% !important;
        margin: 0 !important;
        padding: 0 !important;
        box-sizing: border-box !important;
        font-family: Tahoma, Arial, sans-serif !important;
        font-size: 11pt !important;
        line-height: 1.8 !important;
      }

      /* Lists */
      .report-content ul {
        list-style-type: disc !important;
        margin-left: 20px !important;
        padding-left: 20px !important;
      }

      .report-content ol {
        list-style-type: decimal !important;
        margin-left: 20px !important;
        padding-left: 20px !important;
      }

      .report-content li {
        display: list-item !important;
        margin-bottom: 8px !important;
      }

      /* Tables */
      .report-content table {
        border-collapse: collapse !important;
        width: 100% !important;
        box-sizing: border-box !important;
        margin: 10px 0 !important;
      }

      .report-content th,
      .report-content td {
        border: 1px solid black !important;
        padding: 8px 12px !important;
        text-align: left !important;
        box-sizing: border-box !important;
      }
      .doctor-details {
        text-align: right !important;
        width: 100% !important;
        box-sizing: border-box !important;
        margin: 0 !important;
        padding: 0 8px 0 0 !important;
        overflow: visible !important;
        white-space: normal !important;
      }
    }
  `;

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Report_${MCIReportdata[0]?.Visit_Id || "Unknown"}`,
    pageStyle: getPageStyle(),
    onBeforeGetContent: () => {
      return Promise.resolve();
    },
    print: async (iframe) => {
      try {
        iframe.contentWindow.print();
      } catch (error) {
        console.error("Print failed:", error);
      }
    },
  });

  // Patient details component
  const PatientDetailsSection = ({ style = {} }) => (
    <div
      className="patient-details-section"
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "10px",
        marginBottom: "10px",
        fontSize: "18px",
        border: "1px solid #bbb",
        padding: "6px 10px",
        background: "#f7f7f7",
        borderRadius: "4px",
        ...style
      }}
    >
      <div>
        {/* <h3
          style={{
            fontSize: "20px",
            fontWeight: "600",
            margin: "0 0 5px 0",
            color: "#3498db",
            borderBottom: "1px solid #eee",
            paddingBottom: "2px",
          }}
        >
          PATIENT DETAILS
        </h3> */}
        <p style={{ margin: "3px 0", fontSize: "14px" }}>
          <strong>Name:</strong> {MCIReportdata[0]?.FirstName || "N/A"}
        </p>
        <p style={{ margin: "3px 0", fontSize: "14px" }}>
          <strong>Age/Gender:</strong> {MCIReportdata[0]?.Age || "N/A"} {MCIReportdata[0]?.Time_Period || ""} / {MCIReportdata[0]?.Gender || "N/A"}
        </p>
        <p style={{ margin: "3px 0", fontSize: "14px" }}>
          <strong>Reg No:</strong> {MCIReportdata[0]?.Registrationid || "N/A"}
        </p>
        
      </div>

      <div></div>

      <div>
        {/* <h3
          style={{
            fontSize: "20px",
            fontWeight: "600",
            margin: "0 0 5px 0",
            color: "#3498db",
            borderBottom: "1px solid #eee",
            paddingBottom: "2px",
          }}
        >
          DATE
        </h3> */}
        <p style={{ margin: "3px 0", fontSize: "14px" }}>
          <strong>Collected:</strong>{" "}
          {MCIReportdata[0]?.ReportTime
            ? new Date(MCIReportdata[0].ReportTime).toLocaleDateString("en-GB").replaceAll("/", "-")
            : "N/A"}
        </p>
        <p style={{ margin: "3px 0", fontSize: "14px" }}>
          <strong>Reported:</strong>{" "}
          {MCIReportdata[0]?.receiveddate
            ? new Date(MCIReportdata[0].receiveddate).toLocaleDateString("en-GB").replaceAll("/", "-")
            : "N/A"}
        </p>
        <p style={{ margin: "3px 0", fontSize: "14px" }}>
          <strong>Doctor:</strong> {MCIReportdata[0]?.DoctorName?.split("/")?.[0] || "N/A"}
        </p>
      </div>
    </div>
  );

  return (
    <div>
      <div ref={componentRef}>
        {useHeader && (
          <>
            <div id="pageHeader">
              {/* <div style={{ display: "flex", justifyContent: "center", gap: "18px" }}>
                <img src={sdalogo} alt="SDA logo" height="44" style={{ objectFit: "contain" }} />
                <img src={KMCHlogo} alt="KMCH logo" height="44" style={{ objectFit: "contain" }} />
                <img src={isologo} alt="ISO logo" height="44" style={{ objectFit: "contain" }} />
              </div> */}
              <div style={{ textAlign: "center", fontWeight: 700, fontSize: "15px", marginTop: 8 }}>
                KARUNA MEDICAL COLLEGE HOSPITAL
              </div>
              <div style={{ textAlign: "center", fontSize: "12px" }}>
                VILAYODI - CHITTUR - PALAKKAD - KERALA - 678103
              </div>
              
              <PatientDetailsSection />
            </div>

            <div id="pageFooter">
              <div style={{ textAlign: "center", fontSize: "11px", marginTop: 2 }}>
                Emergency Care: 04923225300 | Mob: 09965150000
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", margin: "0 16px" }}>
                <div>Checked By: {userRecord?.username || "N/A"}</div>
                <div>Page <span className="pageNumber"></span></div>
              </div>
            </div>
          </>
        )}

        {!useHeader && (
          <PatientDetailsSection 
            style={{
              marginBottom: "15px",
              marginTop: "10px",
            }}
          />
        )}

        <div className="report-content" dangerouslySetInnerHTML={{ __html: content }} />
      </div>

      <div className="Register_btn_con" style={{ marginTop: 20, textAlign: "center" }}>
        <button onClick={handlePrint} className="RegisterForm_1_btns Rhugt_report">
          Print & Close
        </button>
      </div>
      
      <div className="sdcyysc_uxcds67" style={{ margin: "22px 0", textAlign: "center" }}>
        <label>
          <h3 style={{ color: "black" }}>Do you want to print with header/footer?</h3>
        </label>
        <div className="dhchche_oici8" style={{ display: "flex", justifyContent: "center", gap: "20px" }}>
          <label htmlFor="withHeader" style={{ marginRight: 8 }}>
            <input
              id="withHeader"
              type="radio"
              name="printOption"
              checked={useHeader}
              onChange={() => setUseHeader(true)}
            />{" "}
            Yes (KMCH header)
          </label>
          <label htmlFor="letterHead">
            <input
              id="letterHead"
              type="radio"
              name="printOption"
              checked={!useHeader}
              onChange={() => setUseHeader(false)}
            />{" "}
            No (Letterhead print)
          </label>
        </div>
      </div>
    </div>
  );
};

export default FakeReportView;








