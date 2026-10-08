import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import axios from "axios";
// import HeaderLogo from "../Assets/RelicH.png";
// import FooterLogo from "../Assets/RelicF.png";

function decodeUtf8Base64(str) {
  try {
    const decoded = atob(str.replace(/\s/g, ""));
    return decodeURIComponent(escape(decoded));
  } catch (e) {
    console.error("Error decoding content:", e);
    return "Error decoding content";
  }
}

const RadiologyPrintPreview = ({ completedId, rowData, onClose }) => {
  const componentRef = useRef();
  const urllink = useSelector((state) => state.userRecord?.UrlLink);

  const [htmlContent, setHtmlContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [printWithHeader, setPrintWithHeader] = useState(true);
 const [isPrinting, setIsPrinting]  = useState(false);
  // ADJUSTED SPACING:
  // Increased Header space for pre-printed letterhead (Without Header mode)
  // FOOTER_MM reserves space so content never overlaps your footer image/text
  const HEADER_MM = printWithHeader ? 40 : 30;
  const FOOTER_MM = 25;



  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${urllink}Radiology/Get_Radiology_Complete_Details/${completedId}/`);
        if (response.data.html_content) {
          const decoded = decodeUtf8Base64(response.data.html_content);
          const temp = document.createElement("div");
          temp.innerHTML = decoded;
          temp.querySelectorAll("table").forEach((table) => {
            if (table.getAttribute("border") !== "0") {
              table.classList.add("editor-table");
            }
          });
          setHtmlContent(temp.innerHTML);
        }
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    if (completedId) fetchReportData();
  }, [completedId, urllink]);

  // const getPageStyle = () => `
  //   @page {
  //     size: A4;
  //     margin: ${HEADER_MM}mm 0mm ${FOOTER_MM}mm 0mm;
  //   }

  //   .editor-table { border-collapse: collapse; width: 100% !important; border: none !important; }
  //   .editor-table td { border: none !important; padding: 4px; }

  //   .radiology_report_table { width: 100%; border-collapse: collapse; table-layout: fixed; }

  //   /* This makes the Patient Profile repeat on every page */
  //   .radiology_header { display: table-header-group; }

  //   /* This reserves physical space at the bottom of every page for your footer */
  //   .radiology_footer_spacer { display: table-footer-group; height: ${FOOTER_MM}mm; }

  //   .rp-fixed-footer {
  //     position: fixed;
  //     bottom: 0;
  //     left: 0;
  //     width: 100%;
  //     height: ${FOOTER_MM}mm;
  //     z-index: 1000;
  //   }

  //   .content {
  //     padding: 0px 35px;
  //     font-family: 'Book Antiqua', serif;
  //     font-size: 11pt;
  //   }

  //   .content p { margin: 0 !important; line-height: 1.4 !important; }

  //   @media print {
  //     .Register_btn_con { display: none !important; }
  //     .content {
  //   padding: 0 35px;
  //   font-family: 'Book Antiqua', serif;
  //   font-size: 11pt;
  // }

  // .content p {
  //   margin: 0;
  //   line-height: 1.4;
  // }

  // /* Lists */
  // .content ul,
  // .content ol {
  //   padding-left: 20px;
  //   margin: 0;
  // }

  // .content li {
  //   margin-bottom: 4px;
  // }

  // /* Tables */
  // .content table {
  //   width: 100%;
  //   border-collapse: collapse;
  // }

  //   }
  // `;


const getPageStyle = () => `
  @page {
    size: A4;
    margin: ${HEADER_MM}mm 0mm ${FOOTER_MM}mm 0mm;
  }
    
.content > div {
  text-align: initial !important;
}
  /* ===== Main Report Table ===== */
  .radiology_report_table {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
    margin: 0;
    page-break-inside: auto;   /* allow breaking */

  }
    

  .radiology_report_table td {
    vertical-align: top;
    text-align: left;
}

  .radiology_report_table tr {
    page-break-inside: auto;   /* allow row split */
    page-break-after: auto;
  }

  /* ===== Header Repeat ===== */
  .radiology_header {
    display: table-header-group;
  }

  /* ===== Footer Space Reserve ===== */
.radiology_footer_spacer {
  display: table-footer-group;
  height: ${FOOTER_MM}mm;
}

  /* ===== Fixed Footer ===== */
  .rp-fixed-footer {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: ${FOOTER_MM}mm;
    z-index: 1000;
  }

  /* ===== CKEditor Tables (No Borders) ===== */
  .editor-table {
    border-collapse: collapse;
    width: 100%;
    border: none;
  }

    .content > * {
    break-inside: avoid;
  }

    .content p,
  .content div,
  .content span,
  .content table {
    text-align: inherit;
  }

  .content table {
    border: none !important;
  }

  .content table td,
  .content table th {
    border: none !important;
  }


  .editor-table td,
  .editor-table th {

  }

  /* ===== Content Area ===== */
  .content {
    width: 100%;
    padding: 0 35px;
    font-family: 'Book Antiqua', serif;
    font-size: 11pt;
     padding: 0 35px ${FOOTER_MM}mm 35px;
  }

  .content p {
    margin: 0;
    line-height: 0.8;
  }

  /* ===== Lists ===== */
  .content ul,
  .content ol {
    padding-left: 20px;
    margin: 0;
  }

  .content li {
    margin-bottom: 4px;
  }

  /* ===== Tables Inside Content ===== */
  .content table {
    width: 100%;
    border-collapse: collapse;
  }

  /* ===== Proper Table Page Break ===== */
.content table {
  page-break-inside: auto;
}

.content tr {
  page-break-inside: auto;
  page-break-after: auto;
}
.content thead {
  display: table-header-group;
}

.content tfoot {
  display: table-footer-group;
}

  /* ===== Print Specific ===== */
  @media print {

  html, body {
    height: auto;
  }
      table {
    page-break-before: auto !important;
  }

  .radiology_report_table {
    page-break-before: auto;
  }

  .radiology_header {
    position: static !important;
  }

    .content {
      width: 100%;
       padding: 0 35px ${FOOTER_MM}mm 35px;
    }

        table {
      page-break-before: auto;
      page-break-after: auto;
    }
  }
`;



  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: getPageStyle(),
    
  });

  if (loading) return <div style={{ textAlign: 'center', padding: '50px' }}>Loading...</div>;

  return (
    <div className="a4-preview" style={{ background: "#525659", padding: "20px 0" }}>
      <div
        ref={componentRef}
        style={{
          width: "210mm",
          margin: "auto",
          background: "#fff",
          minHeight: "auto",
          position: "relative"
        }}
      >

        {/* Fixed Footer Image (Appears on every page) */}
        <div className="rp-fixed-footer">
          {printWithHeader && (
            <img
              src={FooterLogo}
              alt="Footer"
              style={{ width: "100%", display: "block" }}
            />
          )}
        </div>

        {/* 🔥 ADDED WRAPPER DIV (THIS FIXES PAGE 2 ISSUE) */}
        <div>

          <table className="radiology_report_table">
            <thead className="radiology_header">
              <tr>
                <td>
                  {printWithHeader ? (
                    <img
                      src={HeaderLogo}
                      alt="Header"
                      style={{ width: "100%", display: "block" }}
                    />
                  ) : (
                    <div />
                  )}

                  <div style={{ padding: "5px 35px 0 35px" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1px" }}>
                      <tbody>
                        <tr>
                          <td style={{ border: "1px solid black", padding: "4px", width: "15%", fontWeight: "bold", fontSize: "10pt" }}>Name</td>
                          <td style={{ border: "1px solid black", padding: "4px", width: "35%", fontSize: "10pt" }}>{rowData?.Patient_Name}</td>
                          <td style={{ border: "1px solid black", padding: "4px", width: "15%", fontWeight: "bold", fontSize: "10pt" }}>UHID</td>
                          <td style={{ border: "1px solid black", padding: "4px", width: "35%", fontSize: "10pt" }}>{rowData?.Patient_Id}</td>
                        </tr>
                      </tbody>
                    </table>

                    <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "1px" }}>
                      <tbody>
                        <tr>
                          <td style={{ border: "1px solid black", padding: "4px", width: "15%", fontWeight: "bold", fontSize: "10pt" }}>Age/Gender</td>
                          <td style={{ border: "1px solid black", padding: "4px", width: "35%", fontSize: "10pt" }}>{rowData?.Age} / {rowData?.gender}</td>
                          <td style={{ border: "1px solid black", padding: "4px", width: "15%", fontWeight: "bold", fontSize: "10pt" }}>Referrer</td>
                          <td style={{ border: "1px solid black", padding: "4px", width: "35%", fontSize: "10pt" }}>{rowData?.DoctorName}</td>
                          <td style={{ border: "1px solid black", padding: "4px", width: "15%", fontWeight: "bold", fontSize: "10pt" }}>Study Date</td>
                          <td style={{ border: "1px solid black", padding: "4px", width: "35%", fontSize: "10pt" }}>{rowData?.Patient_Id}</td>
                          <td style={{ border: "1px solid black", padding: "4px", width: "35%", fontSize: "10pt" }}>{rowData?.Contact}</td>
                        </tr>
                      </tbody>
                    </table>


                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <tbody>
                        <tr>
                          <td style={{ border: "1px solid black", padding: "4px", width: "15%", fontWeight: "bold", fontSize: "10pt" }}>Date</td>
                          <td style={{ border: "1px solid black", padding: "4px", width: "35%", fontSize: "10pt" }}>{rowData?.BillDate}</td>
                          <td style={{ border: "1px solid black", padding: "4px", width: "15%", fontWeight: "bold", fontSize: "10pt" }}>Visit ID</td>
                          <td style={{ border: "1px solid black", padding: "4px", width: "35%", fontSize: "10pt" }}>{rowData?.VisitId}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </td>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td style={{ verticalAlign: "top" }}>
                  <div style={{ height: "4mm" }} />


                  {/* Test name banner — in tbody, PAGE 1 ONLY, attached directly to patient profile border */}
                  <div style={{
                    margin: "0 26px 0 26px", textAlign: "center", padding: "5px",
                    fontWeight: "bold", fontSize: "14pt", textTransform: "uppercase",
                    background: "#d4d2d1", border: "1px solid black",
                    display: "flex", justifyContent: "center", alignItems: "center",
                    fontFamily: "'Book Antiqua', serif",
                  }}>
                    {isPrinting ? (
                      <span style={{
                        textAlign: "center", padding: "5px",
                        fontWeight: "bold", fontSize: "14pt", textTransform: "uppercase",

                      }}>{rowData?.TestName || "RADIOLOGY REPORT"}</span>
                    ) : (
                      <input
                        type="text"
                        placeholder="Enter Test Name.."
                        defaultValue={rowData?.TestName || "RADIOLOGY REPORT"}
                        style={{
                          width: "100%", border: "none", outline: "none",
                          background: "transparent", textAlign: "center",
                          fontWeight: "bold", fontSize: "14pt", textTransform: "uppercase",
                          fontFamily: "'Book Antiqua', serif",
                        }}
                      />
                    )}
                  </div>

                  <div className="content">
                    <div dangerouslySetInnerHTML={{ __html: htmlContent }} />

                    <div style={{ textAlign: "right", marginTop: "50px !important", paddingRight: "10px" }}>
                      <p style={{ margin: 0 }}><strong>Dr. S. Akilesh M.D.(Rd)</strong></p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>

            <tfoot className="radiology_footer_spacer">
              <tr>
                <td>
                  <div style={{ height: `${FOOTER_MM}mm` }}></div>
                </td>
              </tr>
            </tfoot>
          </table>

        </div> {/* 🔥 WRAPPER CLOSED */}

      </div>

      {/* Control Box */}
      <div className="Register_btn_con" style={{ position: "fixed", top: "20px", right: "20px", background: "white", padding: "15px", border: "1px solid #ccc", borderRadius: "8px", boxShadow: "0 2px 10px rgba(0,0,0,0.2)" }}>
        <div style={{ marginBottom: "10px" }}>
          <input type="checkbox" id="headerC" checked={printWithHeader} onChange={(e) => setPrintWithHeader(e.target.checked)} />
          <label htmlFor="headerC" style={{ marginLeft: "8px", fontWeight: "bold", cursor: "pointer" }}>Print Header/Footer</label>
        </div>
        <button onClick={handlePrint} style={{ background: "#4f9111", color: "white", padding: "10px 20px", border: "none", cursor: "pointer", borderRadius: "4px", fontWeight: "bold" }}>Print Now</button>
        <button onClick={onClose} style={{ background: "#e74c3c", color: "white", padding: "10px 20px", border: "none", marginLeft: "10px", cursor: "pointer", borderRadius: "4px", fontWeight: "bold" }}>Close</button>
      </div>
    </div>
  );
};

export default RadiologyPrintPreview;