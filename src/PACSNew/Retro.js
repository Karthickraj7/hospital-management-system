import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useReactToPrint } from "react-to-print";
import KMCHlogo from "../Assets/KMCHlogo.png";
import sdalogo from "../Assets/sdalogo.jpeg";
import isologo from "../Assets/isologo.jpeg";
import axios from "axios";
import "./retro.css";
import JoditEditor from 'jodit-react';
import { Modal, Button, message, Spin } from 'antd';
import JoditRichEditor from './docTest2';


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

const Retro = () => {


    const [editorVisible, setEditorVisible] = useState(false);
    const [docName, setDocName] = useState('');
    const [htmlContent, setHtmlContent] = useState("Please Select The Template");
    const editorRef = useRef(null);
    const [editorContent, setEditorContent] = useState("");

    const handleOpenEditor = () => {
        setEditorVisible(true);
    }

    const handleOnCloseEditor = () => {
        setEditorVisible(false);


    }






  const urllink = useSelector((state) => state.userRecord?.UrlLink);

  const componentRef = useRef();
  // const capturedatas = useSelector((state) => state.userRecord?.Samplecapture);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [content, setContent] = useState("");
  const [useHeader, setUseHeader] = useState(true);
  const test = useSelector((state) => state.userRecord?.RadData);
  const [capturedatas, setCapturedatas] = useState({})


  useEffect(() => {
    axios.get(`${urllink}Radiology/Get_Data_For_Dispatch?completedId=${test?.Radiology_RequestId}`)
      .then((res) => {
        const data = res.data;
        setCapturedatas(data[0])
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  }, [urllink, test?.Radiology_RequestId])

  useEffect(() => {
    try {
      if (!capturedatas?.html) {
        setContent("<p>No content available.</p>");
        return;
      }

      // Clean and decode the HTML content
      const cleanBase64 = capturedatas.html.trim().replace(/\s/g, "");
      const decodedContent = decodeUtf8Base64(cleanBase64);
      const decodedHtml = decodeUtf8Base64(capturedatas.html);

      // Use content exactly as authored in the editor without transformations
      setContent(decodedContent);
      setHtmlContent(decodedContent)
    } catch (e) {
      console.error("Error processing content:", e);
      setContent("<p>Error processing content.</p>");
    }
  }, [capturedatas]);

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
    documentTitle: `Report_${capturedatas?.Visit_Id || "Unknown"}`,
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
          <strong>Name:</strong> {capturedatas?.FirstName || "N/A"}
        </p>
        <p style={{ margin: "3px 0", fontSize: "14px" }}>
          <strong>Age/Gender:</strong> {capturedatas?.Age || "N/A"} {capturedatas?.Time_Period || ""} / {capturedatas?.Gender || "N/A"}
        </p>
        <p style={{ margin: "3px 0", fontSize: "14px" }}>
          <strong>Reg No:</strong> {capturedatas?.Registrationid || "N/A"}
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
          {capturedatas?.ReportTime
            ? new Date(capturedatas.ReportTime).toLocaleDateString("en-GB").replaceAll("/", "-")
            : "N/A"}
        </p>
        <p style={{ margin: "3px 0", fontSize: "14px" }}>
          <strong>Reported:</strong>{" "}
          {capturedatas?.receiveddate
            ? new Date(capturedatas.receiveddate).toLocaleDateString("en-GB").replaceAll("/", "-")
            : "N/A"}
        </p>
        <p style={{ margin: "3px 0", fontSize: "14px" }}>
          <strong>Doctor:</strong> {capturedatas?.DoctorName?.split("/")?.[0] || "N/A"}
        </p>
      </div>
    </div>
  );
// .editor-like p { margin-bottom: 10pt; }
  return (
    <>
    <div className="a4-preview">
      <div ref={componentRef} className="a4-page">
        <style>{`
          /* Match editor iframe styles for on-screen preview */
          .editor-like {
            font-family: Tahoma, Arial, sans-serif;
            font-size: 11pt;
            line-height: 1.8;
          }
          
          .editor-like table {
            border-collapse: collapse;
            width: 100%;
            margin: 10pt 0;
            border: 1px solid black;
          }
          .editor-like td, .editor-like th {
            border: 1px solid black;
            padding: 5pt;
          }
        `}</style>
        {useHeader && (
          <>
            <div id="pageHeader">
              <div style={{ display: "flex", justifyContent: "center", gap: "18px" }}>
                <img src={sdalogo} alt="SDA logo" height="44" style={{ objectFit: "contain" }} />
                <img src={KMCHlogo} alt="KMCH logo" height="44" style={{ objectFit: "contain" }} />
                <img src={isologo} alt="ISO logo" height="44" style={{ objectFit: "contain" }} />
              </div>
              <div style={{ textAlign: "center", fontWeight: 700, fontSize: "15px", marginTop: 8 }}>
                KARUNA MEDICAL COLLEGE HOSPITAL
              </div>
              <div style={{ textAlign: "center", fontSize: "12px" }}>
                VILAYODI - CHITTUR - PALAKKAD - KERALA - 678103
              </div>

              <PatientDetailsSection />
            </div>

            {/* <div id="pageFooter">
              <div style={{ textAlign: "center", fontSize: "11px", marginTop: 2 }}>
                Emergency Care: 04923225300 | Mob: 09965150000
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", margin: "0 16px" }}>
                <div>Checked By: {userRecord?.username || "N/A"}</div>
                <div>Page <span className="pageNumber"></span></div>
              </div>
            </div> */}

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

        <div className="report-content editor-like" dangerouslySetInnerHTML={{ __html: content }} />


        {/* {useHeader && (
          <>
            <div id="pageFooter">
              <div style={{ textAlign: "center", fontSize: "11px", marginTop: 2 }}>
                Emergency Care: 04923225300 | Mob: 09965150000
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px", margin: "0 16px" }}>
                <div>Checked By: {userRecord?.username || "N/A"}</div>
                <div>Page <span className="pageNumber"></span></div>
              </div>
            </div>
          </>)} */}

      </div>

      <div className="Register_btn_con" style={{ marginTop: 20, textAlign: "center" }}>
         <button onClick={handleOpenEditor} className="RegisterForm_1_btns Rhugt_report">
          Edit
        </button>
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
    
       {/* {openpreview1 && (
                        <div
                            className={
                                isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
                            }
                            onClick={() => {
                                setopenpreview1(false);
                            }}
                        >
                            <div
                                className="newwProfiles newwPopupforreason"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div ref={contentRef} className="editor_life">
                                    {console.log("content", content)}
    
    
                                    {console.log("-----@-------", loadingEditor)}
                                    {content && !loadingEditor ? ( // ✅ only render CKEditor if content is ready
                                        <CKEditor
                                            editor={ClassicEditor}
                                            config={{ extraPlugins: [uploadPlugin] }}
                                            data={content || ""}
                                            onChange={(event, editor) => {
                                                const data = editor.getData();
                                                setContent(data || "");
    
                                            }}
                                        />
                                    ) : (
                                        <p>Loading editor...</p>
                                    )}
                                </div>
    
                                <div className="Register_btn_con regster_btn_contsai">
                                    <button
                                        className="RegisterForm_1_btns"
                                        onClick={() => setopenpreview1(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )} */}
    
    
    
                    <Modal
                        title={docName || 'Edit Document'}
                        open={editorVisible}
                        onCancel={handleOnCloseEditor}
                        footer={null}
                        width={900}
                        style={{ top: 20 }}
                        destroyOnClose={false}
                    >
                        {/* {loading ? (
                            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                                <Spin size="large" />
                            </div>
                        ) : error ? (
                            <div style={{ textAlign: 'center', color: 'red' }}>
                                <p>{error}</p>
                                <Button onClick={handleOnCloseEditor}>Close</Button>
                            </div>
                        ) : ( */}
                            <>
                                <JoditRichEditor
                                    ref={editorRef}
                                    initialContent={htmlContent}
                                    onChange={(newContent) => setEditorContent(newContent)}
                                />
                            </>
                        {/* )} */}
                    </Modal>
    
    </>
  );
};

export default Retro;







