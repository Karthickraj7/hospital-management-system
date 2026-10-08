import React, { useRef, useState, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
// import Barcode from "react-barcode";
import "./Report.css";
import axios from "axios";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";
import { toPng } from "html-to-image";
import { useNavigate } from "react-router-dom";
import Docsign from "../../Assets/aparna.jpg";
import Microsign from "../../Assets/Micro.png";
import { DataGrid } from "@mui/x-data-grid";
import JsBarcode from "jsbarcode";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TiArrowDownThick, TiArrowUpThick } from "react-icons/ti";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import ReactToPrint from "react-to-print";
import mammoth from "mammoth";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import "../LabTechnician/ckeditor-custom.css";
import html2canvas from "html2canvas";
import KMCHlogo from "../../Assets/KMCHlogo.png";
import sdalogo from "../../Assets/sdalogo.jpeg";
import isologo from "../../Assets/isologo.jpeg";
import nabhl_logo from "../../Assets/nabhl_logo.png";

import JoditEditor from 'jodit-react';
import { Modal, Button, message, Spin } from 'antd';

// import { textAlign } from "html2canvas/dist/types/css/property-descriptors/text-align";

// JoditRichEditor Component
const JoditRichEditor = forwardRef(({ initialContent = "", onChange }, ref) => {
  const editorRef = useRef(null);
  const [internalContent, setInternalContent] = useState(initialContent);

  useEffect(() => {
    setInternalContent(initialContent);
  }, [initialContent]);

  useImperativeHandle(ref, () => ({
    getContent: () => internalContent,
    setContent: (newContent) => setInternalContent(newContent),
    getEditorInstance: () => editorRef.current?.editor,
  }));

  const config = {
    readonly: false,
    height: 500,
    useTabForNext: false,
    allowTabChar: true,
    uploader: {
      insertImageAsBase64URI: true,
    },
    preserveWhiteSpace: true,
    cleanHTML: {
      fillEmptyParagraph: false,
      removeEmptyElements: false,
    },
    showSourceButton: true,
    editorCssClass: "jodit-document",
    style: {
      fontFamily: "Arial, sans-serif",
      whiteSpace: "pre-wrap",
      lineHeight: "1.5",
    },
    extraAllowedContent:
      "p(*),ul(*),ol(*),li(*),strong(*),em(*),pre(*),h1(*),h2(*),h3(*)",
    buttons: [
      "bold",
      "italic",
      "underline",
      "link",
      "source",
      "|",
      "ul",
      "ol",
      "image",
      "video",
      "|",
      "undo",
      "redo",
      "|",
      "hr",
      "formatBlock",
      "align",
      "about",
    ],
    events: {
      beforeFileUpload: (files) => {
        for (let file of files) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const base64 = e.target.result;
            if (file.type.startsWith("video/")) {
              const videoHTML = `
                <video controls style="max-width:100%">
                  <source src="${base64}" type="${file.type}">
                  Your browser does not support the video tag.
                </video>`;
              editorRef.current?.editor.selection.insertHTML(videoHTML);
            } else {
              editorRef.current?.editor.selection.insertImage(base64);
            }
          };
          reader.readAsDataURL(file);
        }
        return false;
      },
      afterInit: function (editor) {
        // Store reference for other methods
        editorRef.current = { editor };

        // Set up keydown handler on the editor element
        const editorElement = editor.editor || editor.container.querySelector('.jodit-wysiwyg');
        if (editorElement) {
          editorElement.addEventListener('keydown', (e) => {
            // Handle Tab key
            if (e.key === 'Tab') {
              e.preventDefault();
              e.stopPropagation();

              try {
                // Method 1: Try insertHTML with non-breaking spaces
                if (editor.selection && editor.selection.insertHTML) {
                  editor.selection.insertHTML('&nbsp;&nbsp;&nbsp;&nbsp;');
                  return;
                }

                // Method 2: Try execCommand
                if (editor.execCommand) {
                  editor.execCommand('insertHTML', false, '&nbsp;&nbsp;&nbsp;&nbsp;');
                  return;
                }

                // Method 3: Direct text insertion
                if (editor.selection && editor.selection.insertNode) {
                  const textNode = editor.createInside.text('    '); // 4 spaces
                  editor.selection.insertNode(textNode, false);
                  return;
                }

                // Method 4: Focus and use document.execCommand as last resort
                if (editor.editor && editor.editor.focus) {
                  editor.editor.focus();
                  document.execCommand('insertText', false, '    ');
                }
              } catch (error) {
                console.log('Tab insertion error:', error);
                // Fallback: try basic document.execCommand
                try {
                  document.execCommand('insertText', false, '    ');
                } catch (fallbackError) {
                  console.log('Fallback tab insertion failed:', fallbackError);
                }
              }
            }

            // Handle Space key to prevent formatting inheritance
            if (e.key === ' ' || e.code === 'Space') {
              // Check if cursor is at the end of formatted text
              const selection = editor.selection;
              if (selection && selection.isCollapsed()) {
                const range = selection.range;
                const currentNode = range.endContainer;

                // Check if we're at the end of an underlined element
                let parentElement = currentNode.nodeType === Node.TEXT_NODE ?
                  currentNode.parentElement : currentNode;

                if (parentElement && (
                  parentElement.tagName === 'U' ||
                  parentElement.style.textDecoration === 'underline' ||
                  parentElement.style.textDecorationLine === 'underline'
                )) {
                  // Check if cursor is at the very end of the underlined text
                  const textContent = currentNode.textContent || '';
                  const cursorPos = range.endOffset;

                  if (cursorPos === textContent.length) {
                    e.preventDefault();

                    // Insert space without formatting
                    const spaceNode = editor.createInside.text(' ');

                    // Move cursor after the underlined element
                    const afterUnderline = parentElement.parentNode;
                    if (afterUnderline) {
                      afterUnderline.insertBefore(spaceNode, parentElement.nextSibling);

                      // Set cursor after the space
                      const newRange = editor.editorDocument.createRange();
                      newRange.setStartAfter(spaceNode);
                      newRange.collapse(true);
                      selection.selectRange(newRange);
                    }
                  }
                }
              }
            }
          }, true); // Use capture phase
        }
      }
    },
  };

  return (
    <JoditEditor
      ref={editorRef}
      value={internalContent}
      config={config}
      onBlur={(newContent) => {
        setInternalContent(newContent);
        if (onChange) onChange(newContent);
      }}
    />
  );
});

function CancelAppointmentDialog({
  open,
  onClose,
  onConfirm,
  cancelReason,
  setCancelReason,
}) {
  const handleConfirm = () => {
    // Call the onConfirm callback with the cancellation reason
    onConfirm(cancelReason);
    // Close the dialog
    onClose();
  };

  const handleClose = () => {
    setCancelReason("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Reprint Register Reason</DialogTitle>
      <DialogContent>
        <TextField
          label="Reprint Reason"
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        <Button onClick={handleConfirm} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}

const generateBarcode = (value) => {
  try {
    const canvas = document.createElement("canvas");
    JsBarcode(canvas, value, {
      format: "CODE128",
      lineColor: "black",
      width: 2,
      height: 100,
      displayValue: true,
    });

    const image = canvas.toDataURL("image/png");
    // console.log("image", image); // Check the generated image data URL
    return image;
  } catch (error) {
    console.error("Error generating barcode:", error);
  }
};

const TableComponent = React.forwardRef(
  (
    {
      patinetbillingbarcode,
      patinetbillingQr,
      capturedatas,
      report,
      summa,
      ClinicDetials,
      navigate,
      getSensitivityColor,
      uniqueOrganisms,
      alphabetHeaders,
      summa1,
      emailsent,
      SignPerson,
      userRecord,
      printpapaer,
      isNoRendered,
      microandhistonumber,
      formatData,
      formatHeading,
      editMode,
      autoResizeTextarea,
      handleeditchange,
      setFormatData,
      formatMethodName,
      openmodels,
      setopenmodels,
      contentRef,
      uploadPlugin,
      isSidebarOpen,
      setContent,
      content,
      editmicrodata,
      formatName,
      touppercasefun,
      handleMouseUp,
      handleContentEditableInputChange,
      showmodel,
      setshowmodel,
      groupedData,

      setEditMode,
      handleupdatesencitivity,
      handleSensitivityChange,
      // hasAbnormalValues,
      imagePreview,
      getStatus,
      editableRef,
      handleBioChange,
      editBioData,
      handleInputChange,
      patientdetails,
      newEntry, handlecultureChange,
      organismdetails, antibioticorg, handleViewClick,
      handleAddAntibiotic, handleDeleteOrganism, handleDeleteAntibiotic, handleCaptureValueChange, handleColonyCountChange,

    },
    ref
  ) => {
    return (
      <div>
        {summa?.length > 0 && (
          <table ref={ref} className="print-table33">
            <thead className="print_header">
              <div>
                {!emailsent && (
                  <div
                    className="hhheader"
                    style={{
                      height: "127px",
                      width: "100%",
                    }}
                  ></div>
                )}

                {emailsent && (
                  <div className="dsdwd_p9o">
                    <tr className="ededfedf_9jui">
                      <div className="hdyd_p05421oo">
                        <img src={sdalogo} alt="logo" />
                      </div>
                      <td className="hdyd_p05421">
                        <div className="dssdfcwef_p9">
                          <div>
                            <img src={KMCHlogo} alt="logo" />
                          </div>

                          <div>
                            <div className="dchfejjj0p">
                              <div className="dchfejjj0p_hhdc">
                                <h2>KARUNA MEDICAL COLLEGE HOSPITAL</h2>{" "}
                              </div>
                            </div>

                            <div className="dchfejjj0p_hhdc">
                              <h3>
                                VILAYODI - CHITTUR - PALAKKAD - KERALA - 678103
                              </h3>
                            </div>
                          </div>
                        </div>

                        <div className="hdyd_p05421">
                          <img src={isologo} alt="logo" />
                        </div>
                      </td>

                      <td
                        className="jjkd8i_line"
                        style={{
                          height: "3px",
                          width: "100%",
                          backgroundColor: "grey",
                          marginBottom: "5px",
                        }}
                      ></td>
                    </tr>
                  </div>
                )}

                {summa.some((item) => item.Report_Type === "OT") && (
                  <>
                    <div className="wiioo900">
                      <td>
                        <h3>
                          {capturedatas.Patient_Name}
                          {" , "}
                          {capturedatas.Refering_Hospital}
                        </h3>
                      </td>
                    </div>
                    <div className="wiioo900 nbjui_94d">
                      <tr className="new_billing_address_2 ededfedf_9jui">
                        <td className="new_billing_div_report ffddffn">
                          <label>
                            Collected <p>:</p>
                          </label>
                          <span>
                            {
                              summa[0]?.invoicedetails
                                ?.AnalyseInvestigationResult
                            }
                          </span>
                        </td>
                        <td className="new_billing_div_report ffddffn">
                          <label>
                            Received <p>:</p>
                          </label>
                          <span>
                            {
                              summa[0]?.invoicedetails
                                ?.AnalyseInvestigationSenior
                            }
                          </span>
                        </td>

                        <td className="new_billing_div_report hhh_p2q">
                          <label>
                            Barcode <p>:</p>
                          </label>
                          <span>{capturedatas.Barcode}</span>
                        </td>
                      </tr>
                    </div>
                  </>
                )}
              </div>
            </thead>

            <tbody className="print_body Selected-table-container">
              {/* {console.log(summa)} */}

              {summa?.map((dpt, undex) => {
                {
                  // console.log("-----TEst-----", dpt.testdetails);
                }

                if (
                  dpt.department === "MICROBIOLOGY" && dpt.testdetails.some((p) => p.Culturetest === "Yes") &&
                  dpt.testdetails.some((p) => p.Test_Code !== "RD0098") &&
                  dpt.testdetails.some((p) => p.Test_Code !== "LTC1116")
                ) {
                  {
                    // console.log("-----TEst-1---RD0098-");
                  }
                  return (
                    <div key={undex} style={{ pageBreakAfter: "always" }}>
                      {dpt?.testdetails.map((group, groupIndex) => (
                        <table
                          key={groupIndex}
                          style={{
                            width: "91%",
                            position: "relative",
                            left: "50px",
                            pageBreakAfter: "always",
                          }}
                        >
                          {/* Each report type gets its own <thead> with the specific micronumber */}
                          <thead className="print_header">
                            {group.Report_Type !== "OT"
                              && (
                                <div className="wiioo900"
                                  style={{ marginTop: emailsent ? "0px" : "65px" }}
                                >
                                  <tr className="new_billing_address_2 ededfedf_9jui">
                                    <td className="Register_btn_con_barcode">
                                      <div id="get_imagecontent_1">
                                        <img
                                          src={
                                            patinetbillingbarcode
                                              ? generateBarcode(
                                                patinetbillingbarcode
                                              )
                                              : ""
                                          }
                                          alt="barcodeimage"
                                          style={{
                                            width: "170px",
                                            height: "40px",
                                            objectFit: "fill",
                                          }}
                                        />
                                      </div>
                                    </td>
                                    <td className="new_billing_div_report">
                                      <label>
                                        Patient Name <p>:</p>
                                      </label>
                                      <span>
                                        {capturedatas.Title}.{" "}
                                        {capturedatas.Patient_Name}
                                      </span>
                                    </td>
                                    {microandhistonumber === "" && (
                                      <td className="new_billing_div_report">
                                        <label>
                                          Visit ID <p>:</p>
                                        </label>
                                        <span>{capturedatas.Visit_Id}</span>
                                      </td>
                                    )}
                                    <td className="new_billing_div_report">
                                      <label>
                                        Age/Gender <p>:</p>
                                      </label>
                                      <span>
                                        {capturedatas.Age}{" "}
                                        {capturedatas?.Time_Period}s/{" "}
                                        {capturedatas.Gender}
                                      </span>
                                    </td>
                                    <td className="new_billing_div_report">
                                      <label>
                                        Ref.Dr <p>:</p>
                                      </label>
                                      <span>{capturedatas.Refering_Doctor?.split('/')?.[0] || ''}</span>
                                    </td>
                                    <td className="new_billing_div_report">
                                      <label>
                                        Department <p>:</p>
                                      </label>
                                      <span>{capturedatas.Refering_Doctor?.split('/')?.[1]}</span>
                                    </td>
                                    {/* Display the micronumber specific to this report type */}
                                    {group.micronumber !== "" && (
                                      <td className="new_billing_div_report">
                                        <label>
                                          UHID <p>:</p>
                                        </label>
                                        <span>{capturedatas.Patient_Id}</span>
                                      </td>
                                    )}

                                    {/* {capturedatas.Refering_Hospital !== "" && (
                                  <td className="new_billing_div_report">
                                    <label>
                                      Ref Hospital <p>:</p>
                                    </label>
                                    <span>
                                      {capturedatas.Refering_Hospital}
                                    </span>
                                  </td>
                                  )} */}

                                  </tr>

                                  <tr className="new_billing_address_2 ededfedf_9jui">
                                    <td className="Register_btn_con_barcode">
                                      <div id="get_imagecontent_2">
                                        <img
                                          src={
                                            capturedatas && capturedatas.Barcode
                                              ? generateBarcode(
                                                capturedatas.Barcode
                                              )
                                              : ""
                                          }
                                          alt="barcodeimage"
                                          className="get_imagecontent_2_imhhhh"
                                        />
                                      </div>
                                    </td>
                                    <td className="new_billing_div_report ffddffn">
                                      <label>
                                        OP/IP No <p>:</p>
                                      </label>
                                      <span>{capturedatas.Billing_Invoice}</span>
                                    </td>
                                    <td className="new_billing_div_report ffddffn">
                                      <label>
                                        Sample No <p>:</p>
                                      </label>
                                      <span>{capturedatas.Barcode}</span>
                                    </td>
                                    <td className="new_billing_div_report ffddffn">
                                      <label>
                                        Collected <p>:</p>
                                      </label>
                                      <span>
                                        {
                                          summa[0]?.invoicedetails
                                            ?.AnalyseInvestigationResult
                                        }
                                      </span>
                                    </td>
                                    <td className="new_billing_div_report ffddffn">
                                      <label>
                                        Received <p>:</p>
                                      </label>
                                      <span>
                                        {
                                          summa[0]?.invoicedetails
                                            ?.AnalyseInvestigationSenior
                                        }
                                      </span>
                                    </td>
                                    <td className="new_billing_div_report ffddffn">
                                      <label>
                                        Reported <p>:</p>
                                      </label>
                                      <span>
                                        {
                                          summa[0]?.invoicedetails
                                            ?.Approve_Test_Pathologist
                                        }
                                      </span>
                                    </td>

                                  </tr>
                                </div>
                              )}
                          </thead>

                          <tbody>
                            <div className="print-page3jjj">
                              <div className="culture_report_data">
                                <div className="culture_test_header">
                                  <p> Service - {dpt.department}</p>
                                </div>
                                {/* {console.log("Service", group?.Report_Type)} */}




                                {/* OT Report */}
                                {group?.Report_Type === "Ot" && (
                                  <div>
                                    <table className="report_table report_table_for_micro">
                                      <tbody className="print_body Selected-table-container">
                                        <tr>
                                          <td>
                                            <h3>{dpt.department}</h3>
                                            <div className="completed_report_1111">
                                              <div className="completed_report completed_report04948 gghbuy_o9">
                                                <div
                                                  style={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    justifyContent: "center",
                                                    width: "100%",
                                                  }}
                                                  dangerouslySetInnerHTML={{
                                                    __html: group?.EditContent,
                                                  }}
                                                />
                                              </div>
                                            </div>
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                    {group?.Report_Status !==
                                      "Preliminary Report" && (
                                        <div className="Add_items_Purchase_Master yydd_end_reprt">
                                          <span> - End of Report - </span>
                                        </div>
                                      )}
                                  </div>
                                )}

                                {/* NoGrowth Report */}
                                {group?.Report_Type === "NoGrowth" && (
                                  <div className="culturetest_div_head jgg_9i9kj Histo_new_css_div_head_po90">
                                    {dpt.department === "MICROBIOLOGY" && (
                                      <span className="mkdijcfisd_o99">
                                        Visit ID : {capturedatas.Visit_Id}{" "}
                                      </span>
                                    )}

                                    {group.Sample_Specimen !== "" && (
                                      <div className="culturetest_div Histo_new_css_div">
                                        <label className="headerculture">
                                          Nature of specimen<span>:</span>
                                        </label>
                                        {editMode ? (
                                          <textarea
                                            name={`Sample-${group.Test_Code}`}
                                            onChange={handleeditchange}
                                            defaultValue={
                                              group?.Sample_Specimen
                                            }
                                            onBeforeInput={autoResizeTextarea}
                                            onInput={autoResizeTextarea}
                                          />
                                        ) : (
                                          <p className="dataforprint">
                                            {group?.Sample_Specimen}
                                          </p>
                                        )}
                                      </div>
                                    )}

                                    <div className="culturetest_div Histo_new_css_div">
                                      <label className="headerculture">
                                        Test Requested<span>:</span>
                                      </label>
                                      <p className="dataforprint">
                                        {group?.DisplayText}
                                      </p>
                                    </div>
                                    <div className="culturetest_div Histo_new_css_div hewty_8j">
                                      <label className="headerculture">
                                        Report Status<span>:</span>
                                      </label>
                                      {editMode ? (
                                        <select
                                          className=""
                                          name={`reportstatus-${group.Test_Code}`}
                                          onChange={handleeditchange}
                                        >
                                          <option value="">Select</option>
                                          <option value="Final Report">
                                            Final Report
                                          </option>
                                          <option value="Preliminary Report">
                                            Preliminary Report
                                          </option>
                                        </select>
                                      ) : (
                                        <p className="dataforprint">
                                          {group?.Report_Status ||
                                            "Final Report"}
                                        </p>
                                      )}
                                    </div>
                                    {group.Microscopy_Data !== "" && (
                                      <div className="culturetest_div Histo_new_css_div">
                                        <label className="headerculture">
                                          Microscopy<span>:</span>
                                        </label>
                                        {editMode ? (
                                          <textarea
                                            name={`microscopy-${group.Test_Code}`}
                                            onChange={handleeditchange}
                                            defaultValue={
                                              group?.Microscopy_Data
                                            }
                                            onBeforeInput={autoResizeTextarea}
                                            onInput={autoResizeTextarea}
                                          />
                                        ) : (
                                          <p className="dataforprint">
                                            {group?.Microscopy_Data}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                    {group.Culture_Report !== "" && (
                                      <div className="culturetest_div Histo_new_css_div">
                                        <label className="headerculture">
                                          Culture Report<span>:</span>
                                        </label>
                                        {editMode ? (
                                          <textarea
                                            name={`culturereport-${group.Test_Code}`}
                                            onChange={handleeditchange}
                                            defaultValue={group?.Culture_Report}
                                            onBeforeInput={autoResizeTextarea}
                                            onInput={autoResizeTextarea}
                                          />
                                        ) : (
                                          <p className="dataforprint">
                                            {group?.Culture_Report}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                    {group?.Report_Status !==
                                      "Preliminary Report" && (
                                        <div className="Add_items_Purchase_Master yydd_end_reprt">
                                          <span> - End of Report - </span>
                                        </div>
                                      )}
                                  </div>
                                )}

                                {/* Isolated Report */}
                                {group?.Report_Type === "Isolated" && (
                                  <div className="culturetest_div_head jgg_9i9kj Histo_new_css_div_head_po90">
                                    {dpt.department === "MICROBIOLOGY" && (
                                      <span className="mkdijcfisd_o99">
                                        Visit ID : {capturedatas.Visit_Id}{" "}
                                      </span>
                                    )}
                                    {group.Sample_Specimen !== "" && (
                                      <div className="culturetest_div Histo_new_css_div">
                                        <label className="headerculture">
                                          Nature of specimen<span>:</span>
                                        </label>
                                        {editMode ? (
                                          <textarea
                                            name={`Sample-${group.Test_Code}`}
                                            onChange={handleeditchange}
                                            defaultValue={
                                              group?.Sample_Specimen
                                            }
                                            onBeforeInput={autoResizeTextarea}
                                            onInput={autoResizeTextarea}
                                          />
                                        ) : (
                                          <p className="dataforprint">
                                            {group?.Sample_Specimen}
                                          </p>
                                        )}
                                      </div>
                                    )}

                                    <div className="culturetest_div Histo_new_css_div">
                                      <label className="headerculture">
                                        Test Requested<span>:</span>
                                      </label>
                                      <p className="dataforprint">
                                        {group?.DisplayText}
                                      </p>
                                    </div>
                                    <div className="culturetest_div Histo_new_css_div hewty_8j">
                                      <label className="headerculture">
                                        Report Status<span>:</span>
                                      </label>
                                      {editMode ? (
                                        <select
                                          className=""
                                          name={`reportstatus-${group.Test_Code}`}
                                          onChange={handleeditchange}
                                        >
                                          <option value="">Select</option>
                                          <option value="Final Report">
                                            Final Report
                                          </option>
                                          <option value="Preliminary Report">
                                            Preliminary Report
                                          </option>
                                        </select>
                                      ) : (
                                        <p className="dataforprint">
                                          {group?.Report_Status ||
                                            "Final Report"}
                                        </p>
                                      )}
                                    </div>
                                    {group.Microscopy_Data !== "" && (
                                      <div className="culturetest_div Histo_new_css_div">
                                        <label className="headerculture">
                                          Microscopy<span>:</span>
                                        </label>
                                        {editMode ? (
                                          <textarea
                                            name={`microscopy-${group.Test_Code}`}
                                            onChange={handleeditchange}
                                            defaultValue={
                                              group?.Microscopy_Data
                                            }
                                            onBeforeInput={autoResizeTextarea}
                                            onInput={autoResizeTextarea}
                                          />
                                        ) : (
                                          <p className="dataforprint">
                                            {group?.Microscopy_Data}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                    {group.Bacteria_Isolated !== "" && (
                                      <div className="culturetest_div Histo_new_css_div">
                                        <label className="headerculture">
                                          Bacteria Isolated<span>:</span>
                                        </label>
                                        {editMode ? (
                                          <textarea
                                            name={`bacteriaisolated-${group.Test_Code}`}
                                            onChange={handleeditchange}
                                            defaultValue={
                                              group?.Bacteria_Isolated
                                            }
                                            onBeforeInput={autoResizeTextarea}
                                            onInput={autoResizeTextarea}
                                          />
                                        ) : (
                                          <p className="dataforprint">
                                            {group?.Bacteria_Isolated}
                                          </p>
                                        )}
                                      </div>
                                    )}
                                    {group?.Report_Status !==
                                      "Preliminary Report" && (
                                        <div className="Add_items_Purchase_Master yydd_end_reprt">
                                          <span> - End of Report - </span>
                                        </div>
                                      )}
                                  </div>
                                )}

                                {/* Sensitivity Report */}
                                {group?.Report_Type === "Sensitivity" && (
                                  <div>
                                    {console.log("------DATa-----", group)}
                                    <div className="culturetest_div_head jgg_9i9kj Histo_new_css_div_head_po90">
                                      {dpt.department === "MICROBIOLOGY" && (
                                        <span className="mkdijcfisd_o99">
                                          Visit ID : {capturedatas.Visit_Id}{" "}
                                        </span>
                                      )}
                                      {group.Sample_Specimen !== "" && (
                                        <div className="culturetest_div Histo_new_css_div">
                                          <label className="headerculture">
                                            Specimen<span>:</span>
                                          </label>
                                          {editMode ? (
                                            <textarea
                                              name={`Sample-${group.Test_Code}`}
                                              onChange={handleeditchange}
                                              defaultValue={
                                                group?.Sample_Specimen
                                              }
                                              onBeforeInput={autoResizeTextarea}
                                              onInput={autoResizeTextarea}
                                            />
                                          ) : (
                                            <p className="dataforprint">
                                              {group?.Sample_Specimen}
                                            </p>
                                          )}
                                        </div>
                                      )}


                                      {group.site !== "" && (
                                        <div className="culturetest_div Histo_new_css_div">
                                          <label className="headerculture">
                                            Site<span>:</span>
                                          </label>
                                          {editMode ? (
                                            <textarea
                                              name={`site-${group.Test_Code}`}
                                              onChange={handleeditchange}
                                              defaultValue={
                                                group?.site
                                              }
                                              onBeforeInput={autoResizeTextarea}
                                              onInput={autoResizeTextarea}
                                            />
                                          ) : (
                                            <p className="dataforprint">
                                              {group?.site}
                                            </p>
                                          )}
                                        </div>
                                      )}

                                      <div className="culturetest_div Histo_new_css_div">
                                        <label className="headerculture">
                                          Test Requested<span>:</span>
                                        </label>
                                        <p className="dataforprint">
                                          {group?.DisplayText}
                                        </p>
                                      </div>
                                      {group.macrsocopy !== "" && (
                                        <div className="culturetest_div Histo_new_css_div">
                                          <label className="headerculture">
                                            Macroscopy<span>:</span>
                                          </label>
                                          {editMode ? (
                                            <textarea
                                              name={`microscopy-${group.Test_Code}`}
                                              onChange={handleeditchange}
                                              defaultValue={
                                                group?.macroscopy
                                              }
                                              onBeforeInput={autoResizeTextarea}
                                              onInput={autoResizeTextarea}
                                            />
                                          ) : (
                                            <p className="dataforprint">
                                              {group?.macroscopy}
                                            </p>
                                          )}
                                        </div>
                                      )}
                                      {group.Microscopy_Data !== "" && (
                                        <div className="culturetest_div Histo_new_css_div">
                                          <label className="headerculture">
                                            Microscopy<span>:</span>
                                          </label>
                                          {editMode ? (
                                            <textarea
                                              name={`microscopy-${group.Test_Code}`}
                                              onChange={handleeditchange}
                                              defaultValue={
                                                group?.Microscopy_Data
                                              }
                                              onBeforeInput={autoResizeTextarea}
                                              onInput={autoResizeTextarea}
                                            />
                                          ) : (
                                            <p className="dataforprint">
                                              {group?.Microscopy_Data}
                                            </p>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                    <div className="culturetest_div Histo_new_css_div ergfregreg_64">
                                      <label className="headerculture">
                                        Organism Isolated<span>:</span>
                                      </label>
                                      <div className="dataforprint summaprintsummauuu">
                                        <ol
                                          style={{
                                            listStyleType: "upper-alpha",
                                            textAlign: "start",
                                            paddingLeft: "10px",
                                          }}
                                        >
                                          {Object.entries(groupedData).map(([organism], index) => (
                                            <li key={index}>
                                              <i style={{ fontWeight: "600" }}>{organism}</i>
                                            </li>
                                          ))}
                                        </ol>
                                      </div>
                                    </div>

                                    {group?.Notes !== "" && (
                                      <div className="culturetest_div Histo_new_css_div dscs_lop">
                                        <label className="headerculture">
                                          Comments<span>:</span>
                                        </label>
                                        {editMode ? (
                                          <textarea
                                            name={`notes-${group.Test_Code}`}
                                            onChange={handleeditchange}
                                            defaultValue={group?.Notes}
                                            onBeforeInput={autoResizeTextarea}
                                            onInput={autoResizeTextarea}
                                          />
                                        ) : (
                                          <p className="dataforprint">
                                            {group?.Notes}
                                          </p>
                                        )}
                                      </div>
                                    )}

                                    <br />
                                    {/* for adding new antibiotic */}
                                    {editMode && (
                                      <div className="add-antibiotic-section">
                                        <h3>Add New Antibiotic</h3>
                                        <div className="input-row">
                                          <div className="input-container">
                                            <input
                                              list="organismList"
                                              name="newOrganism"
                                              value={newEntry.newOrganism}
                                              onChange={handlecultureChange}
                                              placeholder="Select Organism"
                                              autoCapitalize="off"
                                            />
                                            <datalist id="organismList">
                                              {organismdetails?.map((organism, index) => (
                                                <option key={index} value={organism.Organism_Name} />
                                              ))}
                                            </datalist>
                                          </div>
                                          <div className="input-container">
                                            <input
                                              list="antibioticList"
                                              name="Antibiotic"
                                              value={newEntry.Antibiotic}
                                              onChange={handlecultureChange}
                                              placeholder="Select Antibiotic"
                                              autoComplete="off"
                                            />
                                            <datalist id="antibioticList">
                                              {antibioticorg?.map((antibiotic, index) => (
                                                <option key={index} value={antibiotic.anti_biotic} />
                                              ))}
                                            </datalist>
                                          </div>
                                          <div className="input-container">
                                            <select
                                              name="Sensitivity"
                                              value={newEntry.Sensitivity}
                                              onChange={handlecultureChange}
                                            >
                                              <option value="Sensitive">Sensitive</option>
                                              <option value="Intermediate">Intermediate</option>
                                              <option value="Resistant">Resistant</option>
                                            </select>
                                          </div>
                                        </div>
                                        <div className="input-row">
                                          <div className="input-container">
                                            <input
                                              type="text"
                                              name="Value"
                                              value={newEntry.Value}
                                              onChange={handlecultureChange}
                                              placeholder="Antibiotic Value"
                                              autoComplete="off"
                                            />
                                          </div>
                                          <div className="input-container">
                                            <input
                                              type="text"
                                              name="ColonyCount"
                                              value={newEntry.ColonyCount}
                                              onChange={handlecultureChange}
                                              placeholder="Colony count"
                                              autoComplete="off"
                                            />
                                          </div>
                                        </div>
                                        <div className="Register_btn_con">
                                          <button className="RegisterForm_1_btns"
                                            onClick={handleAddAntibiotic}>Add</button>
                                        </div>
                                      </div>
                                    )}

                                    <table className="report_table report_table_for_micro errrermicro">
                                      <thead>
                                        <tr>
                                          <th>ANTIBIOTICS</th>
                                          <th>SENSITIVE</th>
                                          <th>INTERMEDIATE</th>
                                          <th>RESISTANT</th>
                                          <th>SENSITIVE VALUES</th>
                                          <th>CAPTURE VALUE</th>
                                          {editMode && (
                                            <th>Action</th>
                                          )}

                                        </tr>
                                      </thead>
                                      <tbody>


                                        {Object.entries(groupedData).map(([organism, antibiotics], index) => {


                                          return (
                                            <>
                                              <tr>
                                                <td colSpan="6">

                                                  {editMode ? (
                                                    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "15px" }}>

                                                      <strong>{organism} - </strong>
                                                      <input
                                                        type="text"
                                                        value={antibiotics[0]?.ColonyCount || "-"}
                                                        onChange={(e) => handleColonyCountChange(organism, e.target.value)}
                                                      />
                                                      <button onClick={() => handleDeleteOrganism(organism)}>Delete Organism</button>
                                                    </div>
                                                  ) : (
                                                    <strong>{organism}-{antibiotics[0]?.ColonyCount || "-"}</strong>
                                                  )}
                                                </td>
                                              </tr>
                                              {antibiotics?.map((item, idx) => (
                                                <tr key={idx}>
                                                  {console.log("itemsssssssss", item)}
                                                  <td>{item.antibiotic}</td>
                                                  <td>{item.Sensitive}</td>
                                                  <td>{item.Intermediate}</td>
                                                  <td>{item.Resistant}</td>
                                                  <td> {editMode ? (
                                                    <select
                                                      value={item.Sensitivetype}

                                                      onChange={(e) =>
                                                        handleSensitivityChange(organism, idx, e.target.value)
                                                      }
                                                    >
                                                      <option value="Sensitive">Sensitive</option>
                                                      <option value="Intermediate">Intermediate</option>
                                                      <option value="Resistant">Resistant</option>
                                                    </select>
                                                  ) : (
                                                    item.Sensitivetype
                                                  )}


                                                  </td>
                                                  <td>{editMode ? (
                                                    <input
                                                      type="text"
                                                      value={item.Antibiotic_Value || ""}
                                                      onChange={(e) =>
                                                        handleCaptureValueChange(organism, idx, e.target.value)
                                                      }
                                                    />
                                                  ) : (
                                                    item.Antibiotic_Value || "-"
                                                  )}</td>
                                                  {editMode && <button
                                                    className="delete-button"
                                                    onClick={() => handleDeleteAntibiotic(item.Culture_Id)}>Delete</button>}
                                                </tr>
                                              ))}
                                            </>
                                          );
                                        })}


                                      </tbody>
                                    </table>
                                    <br />

                                    {group?.Report_Status !==
                                      "Preliminary Report" && (
                                        <div className="Add_items_Purchase_Master yydd_end_reprt">
                                          <span> - End of Report - </span>
                                        </div>
                                      )}
                                  </div>
                                )}


                              </div>
                            </div>
                          </tbody>

                          {/* Footer for each report type */}

                          <tfoot className="print_footerr">
                            <tr className="jjxcdsjjej_">
                              <td className="footer_fix_conten_fyft microejeo">
                                <div className="dcnnmjy0s66">
                                  <div className="Register_btn_con_QRcode_fix">
                                    <img
                                      src={patinetbillingQr}
                                      alt="qrcode"
                                      style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "fill",
                                      }}
                                    />
                                    <div className="cked_byhjus"
                                      style={{
                                        width: "310px",
                                        fontsize: "18px",
                                        // position: "relative",
                                        // right: "68px",
                                      }}>
                                      Checked By:
                                      {dpt.testdetails?.[0]?.Packagegroup
                                        ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]?.labtechnician
                                        : dpt.testdetails[0]?.labtechnician}
                                    </div>

                                  </div>



                                  <div className="doctr_sign_fix7cc doctr_sign_fix7cc_secddg">
                                    {dpt.department === "MICROBIOLOGY" && SignPerson?.Name && SignPerson?.sign && (

                                      <div className='dscsdcs_cdfer34'>

                                        <img src={SignPerson?.sign} alt="" className="docsign_fix" />
                                        <p style={{
                                          display: 'flex', justifyContent: 'flex-start',
                                          fontSize: "15px",
                                          width: "250px",
                                          fontWeight: "400",
                                        }}>{`${SignPerson?.Name}, ${SignPerson?.Qualification}`}</p>
                                        <p style={{
                                          display: 'flex', justifyContent: 'flex-start',
                                          fontSize: "15px",
                                          width: "250px",
                                          fontWeight: "400",
                                        }}>{SignPerson?.Designation}</p>

                                        <p style={{
                                          display: 'flex', justifyContent: 'flex-start',
                                          fontSize: "15px",
                                          width: "250px",
                                          fontWeight: "400",
                                        }}>Reg. No: {SignPerson?.State_RegistrationNumber}</p>

                                      </div>
                                    )}
                                  </div>


                                </div>

                              </td>
                            </tr>

                            <tr className="ehdhe_9ikw">
                              <td className="shshxhxs_secfooter">
                                {!emailsent && (
                                  <div
                                    style={{
                                      height: "150px",
                                      width: "100%",
                                    }}
                                  ></div>
                                )}

                                {emailsent && (
                                  <>
                                    <div className="doctr_sign_fix7ccdddd_head">
                                      <td
                                        className="jjkd8i_line"
                                        style={{
                                          height: "1px",
                                          width: "100%",
                                          backgroundColor: "grey",
                                          marginBottom: "5px",
                                        }}
                                      ></td>
                                      <div className="sdfsdfsdf_xcvjds89">
                                        <h4>
                                          Emergency Care<span>:</span>
                                          04923225300
                                        </h4>
                                        <h4>
                                          Mob No<span>:</span>09965150000
                                        </h4>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      ))}
                    </div>
                  );
                }
                else if (
                  dpt.department === "MICROBIOLOGY" &&
                  dpt.testdetails.some((p) => p.Culturetest === "Yes") &&
                  dpt.testdetails.some((p) => p.Test_Code === "LTC1116")
                ) {
                  return (
                    <div key={undex} style={{ pageBreakAfter: "always" }}>
                      {dpt?.testdetails.map((group, groupIndex) => (
                        <table
                          key={groupIndex}
                          style={{
                            width: "95%",
                            position: "relative",
                            left: "30px",
                            pageBreakAfter: "always",
                          }}
                        >
                          {/* Each report type gets its own <thead> with the specific micronumber */}
                          <thead className="print_header">

                            <div className="edwdx_Scuhzy53">
                              <h4>
                                Laboratory is approved for COVID - 19 test by
                                Indian Council of Medical Research, Govt of India
                                through Department of Health and Family Welfare,
                                Government of Kerala
                              </h4>

                            </div>
                          </thead>

                          <tbody>
                            <div className="print-page3jjj">
                              <div className="culture_report_data">
                                <div
                                  className="culture_test_header"
                                  style={{
                                    borderBottom: "none",
                                    borderTop: "1px solid black",
                                  }}
                                >
                                  <p>COVID-19 Test Report</p>
                                </div>

                                <div
                                  style={{
                                    maxWidth: "800px",
                                    margin: "0 auto",
                                    backgroundColor: "white",
                                    fontSize: "14px",
                                    padding: "0px",
                                    // border: "1px solid #333",
                                  }}
                                >
                                  <table
                                    className="edferfe_ju78x2"
                                    style={{
                                      width: "100%",

                                      borderCollapse: "collapse",
                                    }}
                                  >
                                    <tr>
                                      <td
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                          backgroundColor: "#e8e8e8",
                                          fontWeight: "bold",
                                          width: "30%",
                                        }}
                                      >
                                        Date and Time of Reporting:
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                          width: "40%",
                                        }}
                                      >
                                        {(() => {
                                          const invoiceDetailsFromPackagegroup = dpt?.testdetails?.flatMap(td => td.Packagegroup || [])?.find(pg => pg.invoicedetails)?.invoicedetails;
                                          const invoiceDetails = invoiceDetailsFromPackagegroup || dpt?.invoicedetails;
                                          return invoiceDetails?.AnalyseInvestigationResult || "-";
                                        })()}
                                      </td>
                                      <td
                                        rowSpan="8"
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                          textAlign: "center",
                                          verticalAlign: "middle",
                                          width: "30%",
                                        }}
                                      >
                                        <div
                                        >
                                          <img
                                            src={patinetbillingQr}
                                            alt="qrcode"
                                            style={{
                                              width: "209px",
                                              height: "209px",
                                              objectFit: "fill",
                                              borderBottom: "none",
                                            }}
                                          />
                                        </div>

                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                          backgroundColor: "#e8e8e8",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Address of the Referring Facility:
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                        }}
                                      >
                                        KARUNA MEDICAL COLLEGE
                                      </td>
                                    </tr>

                                    <tr>
                                      <td
                                        colSpan="2"
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                          backgroundColor: "#d0d0d0",
                                          fontWeight: "bold",
                                          textAlign: "center",
                                        }}
                                      >
                                        Specimen Details
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                          backgroundColor: "#e8e8e8",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Sample Collection Date:
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                        }}
                                      >
                                        {(() => {
                                          const invoiceDetailsFromPackagegroup = dpt?.testdetails?.flatMap(td => td.Packagegroup || [])?.find(pg => pg.invoicedetails)?.invoicedetails;
                                          const invoiceDetails = invoiceDetailsFromPackagegroup || dpt?.invoicedetails;
                                          const fullDateTime = invoiceDetails?.AnalyseInvestigationResult;

                                          // Convert "24/05/2025 16:41" → "24-05-2025"
                                          return fullDateTime ? fullDateTime.split(" ")[0].replace(/\//g, "-") : "-";
                                        })()}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                          backgroundColor: "#e8e8e8",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Date of Receipt of Specimen at the Lab:
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                        }}
                                      >
                                        {(() => {
                                          const invoiceDetailsFromPackagegroup = dpt?.testdetails?.flatMap(td => td.Packagegroup || [])?.find(pg => pg.invoicedetails)?.invoicedetails;
                                          const invoiceDetails = invoiceDetailsFromPackagegroup || dpt?.invoicedetails;
                                          const fullDateTime = invoiceDetails?.AnalyseInvestigationResult;

                                          // Convert "24/05/2025 16:41" → "24-05-2025"
                                          return fullDateTime ? fullDateTime.split(" ")[0].replace(/\//g, "-") : "-";
                                        })()}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                          backgroundColor: "#e8e8e8",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Sample Test Date:
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                        }}
                                      >
                                        {(() => {
                                          const invoiceDetailsFromPackagegroup = dpt?.testdetails?.flatMap(td => td.Packagegroup || [])?.find(pg => pg.invoicedetails)?.invoicedetails;
                                          const invoiceDetails = invoiceDetailsFromPackagegroup || dpt?.invoicedetails;
                                          const fullDateTime = invoiceDetails?.AnalyseInvestigationSenior;

                                          // Convert "24/05/2025 16:41" → "24-05-2025"
                                          return fullDateTime ? fullDateTime.split(" ")[0].replace(/\//g, "-") : "-";
                                        })()}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                          backgroundColor: "#e8e8e8",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Result Approved On:
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                        }}
                                      >
                                        {(() => {
                                          const invoiceDetailsFromPackagegroup = dpt?.testdetails?.flatMap(td => td.Packagegroup || [])?.find(pg => pg.invoicedetails)?.invoicedetails;
                                          const invoiceDetails = invoiceDetailsFromPackagegroup || dpt?.invoicedetails;
                                          return invoiceDetails?.Approve_Test_Pathologist || "-";
                                        })()}
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                          backgroundColor: "#e8e8e8",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        Condition of the Specimen
                                        Received/Quality on Arrival:
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                        }}
                                      >
                                        {group.specimenCondition}
                                      </td>
                                    </tr>

                                    {/* Reporting Details Section */}
                                    <tr>
                                      <td
                                        colSpan="3"
                                        style={{
                                          border: "1px solid #333",
                                          padding: "4px",
                                          backgroundColor: "#d0d0d0",
                                          fontWeight: "bold",
                                          textAlign: "center",
                                        }}
                                      >
                                        Reporting Details
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                          backgroundColor: "#e8e8e8",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        SRF ID: {group.srfId}
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                          backgroundColor: "#e8e8e8",
                                          fontWeight: "bold",
                                        }}
                                      >
                                        ICMR ID:{group.icmrId}
                                      </td>
                                      <td
                                        style={{
                                          border: "1px solid #333",
                                          padding: "5px",
                                        }}
                                      ></td>
                                    </tr>
                                  </table>
                                </div>

                                {/* {console.log("Service", group?.Report_Type)} */}
                                {group?.Report_Type === "" &&
                                  group?.Test_Code === "LTC1116" && (
                                    <>
                                      <div className="table-container554"
                                        style={{ marginTop: "5px" }}
                                      >

                                        <table className="hesyyd_p_Bicochemis0 hesyyd_p_Bicochemis0_normal covid-report-table">
                                          <thead >
                                            <tr>
                                              <th>Patient ID</th>
                                              <th>Patient name & Address</th>
                                              <th>Age</th>
                                              <th>Gender</th>
                                              <th>Type of Test</th>
                                              <th>COVID-19 Result</th>
                                            </tr>
                                          </thead>
                                          <tbody >
                                            <tr>
                                              <td className="uyhfgr_gf">{capturedatas.Patient_Id}</td>
                                              <td className="uyhfgr_gf">{capturedatas.Title}. {capturedatas.Patient_Name}</td>
                                              <td className="uyhfgr_gf">{capturedatas.Age} {capturedatas.Time_Period}s</td>
                                              <td className="uyhfgr_gf">{capturedatas.Gender}</td>
                                              <td className="uyhfgr_gf">{group.covidType}</td>
                                              <td className="uyhfgr_gf">{group.covidResult}</td>
                                            </tr>
                                          </tbody>
                                        </table>
                                      </div>










                                      <div
                                        className="dscsdcmvc2w"
                                        style={{
                                          display: "flex",
                                          width: '100%',
                                          justifyContent: "space-between",
                                          alignItems: "center",
                                          marginBottom: "10px",
                                          marginTop: "10px",
                                        }}
                                      >
                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "5px",
                                          }}
                                        >
                                          <label>Checked & Approved by :


                                          </label>


                                        </div>

                                        <div
                                          style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "5px",
                                            marginRight: "150px",
                                          }}
                                        >
                                          <label>Prepared by :</label>


                                        </div>
                                      </div>


                                      {
                                        <>
                                          {group?.testinterpreatation?.map(
                                            (item, index) =>
                                              // Only render if Header_interpretation or Comments is not null
                                              (item.Header_interpretation ||
                                                item.Comments) && (
                                                <div
                                                  key={index}
                                                  className="interpretation-container"
                                                >
                                                  {item.Header_interpretation && (
                                                    <label>
                                                      {
                                                        item.Header_interpretation
                                                      }
                                                    </label>
                                                  )}
                                                  {item.Comments && (
                                                    <p className="dataforprint">
                                                      {item.Comments}
                                                    </p>
                                                  )}
                                                </div>
                                              )
                                          )}

                                          {group?.guidelines_interpretation?.map(
                                            (item, index) =>
                                              // Only render if Header_interpretation or Comments is not null
                                              (item.Header_interpretation ||
                                                item.Comments) && (
                                                <div
                                                  key={index}
                                                  className="guideline-container"
                                                >
                                                  {item.Header_interpretation && (
                                                    <h4 className="guideline-header">
                                                      {
                                                        item.Header_interpretation
                                                      }
                                                    </h4>
                                                  )}
                                                  {item.Comments && (
                                                    <ol className="guideline-points">
                                                      {item.Comments.split(
                                                        "\n"
                                                      ).map((point, i) => {
                                                        const trimmedPoint =
                                                          point
                                                            .replace(
                                                              /^\d+\.\t/,
                                                              ""
                                                            )
                                                            .trim();
                                                        return trimmedPoint ? (
                                                          <li key={i}>
                                                            {trimmedPoint}
                                                          </li>
                                                        ) : null;
                                                      })}
                                                    </ol>
                                                  )}
                                                </div>
                                              )
                                          )}
                                        </>
                                      }
                                    </>
                                  )}
                              </div>
                            </div>
                          </tbody>

                          {/* Footer for each report type */}

                          <tfoot className="print_footerr">
                            <tr className="ehdhe_9ikw">
                              <td className="shshxhxs_secfooter">
                                {!emailsent && (
                                  <div
                                    style={{ height: "150px", width: "100%" }}
                                  ></div>
                                )}
                                {emailsent && (
                                  <div className="doctr_sign_fix7ccdddd_head">
                                    <td
                                      className="jjkd8i_line"
                                      style={{
                                        height: "1px",
                                        width: "100%",
                                        backgroundColor: "grey",
                                        marginBottom: "5px",
                                      }}
                                    ></td>
                                    <div className="sdfsdfsdf_xcvjds89">
                                      <h4>
                                        Emergency Care<span>:</span>04923225300
                                      </h4>
                                      <h4>
                                        Mob No<span>:</span>09965150000
                                      </h4>
                                    </div>

                                  </div>
                                )}
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      ))}
                    </div>
                  );
                }




                else if (
                  dpt.testdetails.some((p) => p.Test_Code === "RD0098")
                ) {
                  {
                  }
                  return (
                    <>
                      {summa
                        .filter((p) => p.department === "HEMATOLOGY")
                        .map((group, index) => (
                          <table
                            className="report_table report_table_for_micro"
                            style={{ pageBreakAfter: "always" }}
                          >
                            <thead className="print_header">
                              {!summa.some(
                                (item) => item.Report_Type === "OT"
                              ) && (
                                  <div className="wiioo900"
                                    style={{ marginTop: emailsent ? "0px" : "65px" }}
                                  >
                                    <tr className="new_billing_address_2 ededfedf_9jui">
                                      <td className="Register_btn_con_barcode">
                                        <div id="get_imagecontent_1">
                                          <img
                                            src={
                                              patinetbillingbarcode
                                                ? generateBarcode(
                                                  patinetbillingbarcode
                                                )
                                                : ""
                                            }
                                            alt="barcodeimage"
                                            style={{
                                              width: "170px",
                                              height: "40px",
                                              objectFit: "fill",
                                            }}
                                          />
                                        </div>
                                      </td>
                                      <td className="new_billing_div_report">
                                        <label>
                                          Patient Name <p>:</p>
                                        </label>
                                        <span>
                                          {capturedatas.Title}.{" "}
                                          {capturedatas.Patient_Name}
                                        </span>
                                      </td>
                                      {microandhistonumber === "" && (
                                        <td className="new_billing_div_report">
                                          <label>
                                            Visit ID <p>:</p>
                                          </label>
                                          <span>{capturedatas.Visit_Id}</span>
                                        </td>
                                      )}
                                      <td className="new_billing_div_report">
                                        <label>
                                          Age/Gender <p>:</p>
                                        </label>
                                        <span>
                                          {capturedatas.Age}{" "}
                                          {capturedatas?.Time_Period}s/{" "}
                                          {capturedatas.Gender}
                                        </span>
                                      </td>

                                      <td className="new_billing_div_report">
                                        <label>
                                          Ref.Dr <p>:</p>
                                        </label>
                                        <span>
                                          {capturedatas.Refering_Doctor}
                                        </span>
                                      </td>


                                      <td className="new_billing_div_report">
                                        <label>
                                          Histo.no <p>:</p>
                                        </label>
                                        <span>
                                          {dpt.testdetails?.[0]?.Packagegroup
                                            ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]?.histonumber || "-"
                                            : dpt.testdetails[0]?.histonumber || "-"}
                                        </span>
                                      </td>


                                      {/* <td className="new_billing_div_report">
                                      <label>
                                        Ref Hospital <p>:</p>
                                      </label>
                                      <span>
                                        {capturedatas.Refering_Hospital}
                                      </span>
                                    </td> */}
                                    </tr>

                                    <tr className="new_billing_address_2 ededfedf_9jui">
                                      <td className="Register_btn_con_barcode">
                                        <div id="get_imagecontent_2">
                                          <img
                                            src={
                                              capturedatas && capturedatas.Barcode
                                                ? generateBarcode(
                                                  capturedatas.Barcode
                                                )
                                                : ""
                                            }
                                            alt="barcodeimage"
                                            className="get_imagecontent_2_imhhhh"
                                          />
                                        </div>
                                      </td>
                                      <td className="new_billing_div_report ffddffn">
                                        <label>
                                          Invoice No <p>:</p>
                                        </label>
                                        <span>
                                          {capturedatas.Billing_Invoice}
                                        </span>
                                      </td>
                                      <td className="new_billing_div_report ffddffn">
                                        <label>
                                          Collected <p>:</p>
                                        </label>
                                        <span>
                                          {
                                            summa[0]?.invoicedetails
                                              ?.AnalyseInvestigationResult
                                          }
                                        </span>
                                      </td>
                                      <td className="new_billing_div_report ffddffn">
                                        <label>
                                          Received <p>:</p>
                                        </label>
                                        <span>
                                          {
                                            summa[0]?.invoicedetails
                                              ?.AnalyseInvestigationSenior
                                          }
                                        </span>
                                      </td>
                                      <td className="new_billing_div_report ffddffn">
                                        <label>
                                          Reported <p>:</p>
                                        </label>
                                        <span>
                                          {
                                            summa[0]?.invoicedetails
                                              ?.Approve_Test_Pathologist
                                          }
                                        </span>
                                      </td>
                                    </tr>
                                  </div>
                                )}
                            </thead>
                            <div className="report_table_oju7 new_report_table_oju7">
                              {formatData.length > 0 &&
                                formatData[0]?.format ? (
                                <h3>{formatHeading(formatData[0].format)}</h3>
                              ) : (
                                <h3>Report Details</h3>
                              )}
                              {/* {console.log("dssddssd", formatData)} */}
                              <br />

                              <table className="report_table_inner_p">
                                <tbody>
                                  {formatData.length > 0 ? (
                                    <>
                                      <div className="jdjd_8ji8">
                                        <div>
                                          {formatData
                                            .filter(
                                              (item) =>
                                                item.value !== null && // Ensure item.value is not null
                                                item.value !== undefined && // Ensure item.value is not undefined
                                                item.name // Ensure item.name exists
                                            )
                                            .sort((a, b) => {
                                              // Custom sort to place Notes and Disclaimer at the end
                                              const priority = [
                                                "Notes",
                                                "Note",
                                                "Disclaimer",
                                              ];
                                              const aIndex = priority.includes(
                                                a.name
                                              )
                                                ? priority.indexOf(a.name) + 1
                                                : 0;
                                              const bIndex = priority.includes(
                                                b.name
                                              )
                                                ? priority.indexOf(b.name) + 1
                                                : 0;
                                              return aIndex - bIndex;
                                            })
                                            .slice(0, 4) // Get the first four items
                                            .map((item, index) => (
                                              <tr key={index}>
                                                <h3>{item.format}</h3>
                                                <div className="ewhgdew_o">
                                                  <div>
                                                    <td>
                                                      <strong
                                                        style={{
                                                          fontSize:
                                                            item.name
                                                              .toLowerCase()
                                                              .includes(
                                                                "note"
                                                              ) &&
                                                              item.name
                                                                .toLowerCase()
                                                                .includes(
                                                                  "disclaimer"
                                                                )
                                                              ? item.name
                                                                .toLowerCase()
                                                                .includes(
                                                                  "disclaimer"
                                                                )
                                                                ? "10px" // Set font size to 10px for disclaimer
                                                                : "12px" // Set font size to 12px for note
                                                              : item.name.toLowerCase() ===
                                                                "note"
                                                                ? "12px"
                                                                : item.name.toLowerCase() ===
                                                                  "disclaimer"
                                                                  ? "10px" // Set font size to 10px for disclaimer
                                                                  : "17px", // Default font size for other cases
                                                          color: "#333", // Optional: Apply consistent styling
                                                        }}
                                                      >
                                                        {formatName(item.name)}
                                                        <span>:</span>
                                                      </strong>
                                                    </td>
                                                  </div>
                                                  <div className="yudsd_4rdf dwexeh_i9">
                                                    <td>
                                                      {editMode ? (
                                                        <div
                                                          contentEditable
                                                          suppressContentEditableWarning
                                                          ref={(el) =>
                                                          (editableRef.current[
                                                            item.name
                                                          ] = el)
                                                          }
                                                          onInput={(e) =>
                                                            handleContentEditableInputChange(
                                                              e,
                                                              item.name
                                                            )
                                                          }
                                                          onMouseUp={() =>
                                                            handleMouseUp(
                                                              item.name
                                                            )
                                                          } // Capture mouse selection
                                                          style={{
                                                            border:
                                                              "1px solid #ccc",
                                                            padding: "5px",
                                                            whiteSpace:
                                                              "pre-wrap", // Allow natural wrapping and preserve manual line breaks
                                                            wordBreak:
                                                              "break-word", // Break long words to fit
                                                            margin: "0",
                                                            wordSpacing:
                                                              "normal",
                                                            maxWidth: "100%", // Ensure it fits within parent
                                                            fontSize: "20px",
                                                          }}
                                                        ></div>
                                                      ) : item.name
                                                        .toLowerCase()
                                                        .includes("note") &&
                                                        item.name
                                                          .toLowerCase()
                                                          .includes(
                                                            "disclaimer"
                                                          ) ? (
                                                        <p
                                                          style={{
                                                            fontSize: item.name
                                                              .toLowerCase()
                                                              .includes(
                                                                "disclaimer"
                                                              )
                                                              ? "10px"
                                                              : "12px",
                                                          }}
                                                          dangerouslySetInnerHTML={{
                                                            __html:
                                                              item.value || "",
                                                          }}
                                                        ></p>
                                                      ) : item.name.toLowerCase() ===
                                                        "note" ? (
                                                        <p
                                                          style={{
                                                            fontSize: "12px",
                                                          }}
                                                          dangerouslySetInnerHTML={{
                                                            __html:
                                                              item.value || "",
                                                          }}
                                                        ></p>
                                                      ) : item.name.toLowerCase() ===
                                                        "disclaimer" ? (
                                                        <p
                                                          style={{
                                                            fontSize: "10px",
                                                          }}
                                                          dangerouslySetInnerHTML={{
                                                            __html:
                                                              item.value || "",
                                                          }}
                                                        ></p>
                                                      ) : (
                                                        <p
                                                          dangerouslySetInnerHTML={{
                                                            __html:
                                                              item.value || "",
                                                          }}
                                                        ></p>
                                                      )}
                                                    </td>
                                                  </div>
                                                </div>
                                              </tr>
                                            ))}
                                        </div>

                                        <div className="klsakask">
                                          {formatData
                                            .filter(
                                              (item) =>
                                                item.name &&
                                                item.name
                                                  .toLowerCase()
                                                  .includes("imagedata") &&
                                                item.value !== null && // Ensure item.value is not null
                                                item.value !== undefined // Ensure item.value is not undefined
                                            )
                                            .sort((a, b) => {
                                              // Custom sort to place Notes and Disclaimer at the end
                                              const priority = [
                                                "Notes",
                                                "Note",
                                                "Disclaimer",
                                              ];
                                              const aIndex = priority.includes(
                                                a.name
                                              )
                                                ? priority.indexOf(a.name) + 1
                                                : 0;
                                              const bIndex = priority.includes(
                                                b.name
                                              )
                                                ? priority.indexOf(b.name) + 1
                                                : 0;
                                              return aIndex - bIndex;
                                            })
                                            .map((item, index) => (
                                              <tr key={index + 4}>
                                                <td>
                                                  <div>
                                                    {imagePreview ? (
                                                      <img
                                                        src={imagePreview} // Show the new image preview
                                                        alt="Preview"
                                                        accept="image/*"
                                                        style={{
                                                          width: "222px",
                                                          height: "180px",
                                                          objectFit: "contain",
                                                        }}
                                                      />
                                                    ) : item.value &&
                                                      item.value !==
                                                      "data:application/octet-stream;base64,null" ? (
                                                      <img
                                                        src={item.value} // Show the existing image from the table (backend)
                                                        alt="Existing"
                                                        accept="image/*"
                                                        style={{
                                                          width: "222px",
                                                          height: "370px",
                                                          objectFit: "contain",
                                                        }}
                                                      />
                                                    ) : null}
                                                  </div>
                                                </td>
                                              </tr>
                                            ))}
                                        </div>
                                      </div>

                                      {formatData
                                        .filter(
                                          (item) =>
                                            item.value !== null && // Ensure item.value is not null
                                            item.value !== undefined && // Ensure item.value is not undefined
                                            item.name &&
                                            !item.name
                                              .toLowerCase()
                                              .includes("imagedata") // Exclude imagedata items
                                        )
                                        .sort((a, b) => {
                                          // Custom sort to place Notes and Disclaimer at the end
                                          const priority = [
                                            "Notes",
                                            "Note",
                                            "Disclaimer",
                                          ];
                                          const aIndex = priority.includes(
                                            a.name
                                          )
                                            ? priority.indexOf(a.name) + 1
                                            : 0;
                                          const bIndex = priority.includes(
                                            b.name
                                          )
                                            ? priority.indexOf(b.name) + 1
                                            : 0;
                                          return aIndex - bIndex;
                                        })
                                        .slice(4) // Get the remaining items after the first four
                                        .map((item, index) => (
                                          <tr key={index + 4}>
                                            <div className="ewhgdew_o">
                                              <div>
                                                <td>
                                                  <strong
                                                    style={{
                                                      fontSize:
                                                        item.name
                                                          .toLowerCase()
                                                          .includes("note") &&
                                                          item.name
                                                            .toLowerCase()
                                                            .includes(
                                                              "disclaimer"
                                                            )
                                                          ? item.name
                                                            .toLowerCase()
                                                            .includes(
                                                              "disclaimer"
                                                            )
                                                            ? "10px" // Set font size to 10px for disclaimer
                                                            : "12px" // Set font size to 12px for note
                                                          : item.name.toLowerCase() ===
                                                            "note"
                                                            ? "12px"
                                                            : item.name.toLowerCase() ===
                                                              "disclaimer"
                                                              ? "10px" // Set font size to 10px for disclaimer
                                                              : "17px", // Default font size for other cases
                                                      color: "#333", // Optional: Apply consistent styling
                                                    }}
                                                  >
                                                    {formatName(item.name)}
                                                    <span>:</span>
                                                  </strong>
                                                </td>
                                              </div>
                                              <div className="yudsd_4rdf">
                                                <td>
                                                  {editMode ? (
                                                    <div
                                                      contentEditable
                                                      suppressContentEditableWarning
                                                      ref={(el) =>
                                                      (editableRef.current[
                                                        item.name
                                                      ] = el)
                                                      }
                                                      onInput={(e) =>
                                                        handleContentEditableInputChange(
                                                          e,
                                                          item.name
                                                        )
                                                      }
                                                      onMouseUp={() =>
                                                        handleMouseUp(item.name)
                                                      } // Capture mouse selection
                                                      style={{
                                                        border:
                                                          "1px solid #ccc",
                                                        padding: "5px",
                                                        whiteSpace: "pre-wrap", // Allow natural wrapping and preserve manual line breaks
                                                        wordBreak: "break-word", // Break long words to fit
                                                        margin: "0",
                                                        wordSpacing: "normal",
                                                        maxWidth: "100%", // Ensure it fits within parent
                                                        fontSize: "20px",
                                                      }}
                                                    ></div>
                                                  ) : item.name
                                                    .toLowerCase()
                                                    .includes("note") &&
                                                    item.name
                                                      .toLowerCase()
                                                      .includes(
                                                        "disclaimer"
                                                      ) ? (
                                                    <p
                                                      style={{
                                                        fontSize: item.name
                                                          .toLowerCase()
                                                          .includes(
                                                            "disclaimer"
                                                          )
                                                          ? "10px"
                                                          : "12px",
                                                      }}
                                                      dangerouslySetInnerHTML={{
                                                        __html:
                                                          item.value || "",
                                                      }}
                                                    ></p>
                                                  ) : item.name.toLowerCase() ===
                                                    "note" ? (
                                                    <p
                                                      style={{
                                                        fontSize: "12px",
                                                      }}
                                                      dangerouslySetInnerHTML={{
                                                        __html:
                                                          item.value || "",
                                                      }}
                                                    ></p>
                                                  ) : item.name.toLowerCase() ===
                                                    "disclaimer" ? (
                                                    <p
                                                      style={{
                                                        fontSize: "10px",
                                                      }}
                                                      dangerouslySetInnerHTML={{
                                                        __html:
                                                          item.value || "",
                                                      }}
                                                    ></p>
                                                  ) : (
                                                    <p
                                                      dangerouslySetInnerHTML={{
                                                        __html:
                                                          item.value || "",
                                                      }}
                                                    ></p>
                                                  )}
                                                </td>
                                              </div>
                                            </div>
                                          </tr>
                                        ))}
                                    </>
                                  ) : (
                                    <tr>
                                      <td colSpan="2">
                                        No report data available
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                                <div className="Add_items_Purchase_Master yydd_end_reprt">
                                  <span> - End of Report - </span>
                                </div>
                              </table>
                            </div>

                            <tfoot className="print_footerr">
                              <tr className="jjxcdsjjej_">
                                <td className="footer_fix_conten_fyft microejeo">
                                  <div className="dcnnmjy0s66">
                                    <div className="Register_btn_con_QRcode_fix">
                                      <img
                                        src={patinetbillingQr}
                                        alt="qrcode"
                                        style={{
                                          width: "80px",
                                          height: "80px",
                                          objectFit: "fill",
                                          borderBottom: "none",
                                          marginTop: "13px"
                                        }}
                                      />
                                      <div className="edddosttt" style={{ width: "310px", fontSize: "14px" }}>
                                        Processed/Typed By:
                                        {dpt.testdetails?.[0]?.Packagegroup
                                          ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]?.labtechnician
                                          : dpt.testdetails[0]?.labtechnician}
                                      </div>
                                    </div>

                                    <div className="doctr_sign_fix7cc doctr_sign_fix7cc_secddg">
                                      {dpt.department !== "MICROBIOLOGY" && SignPerson?.Name && SignPerson?.sign && (

                                        <>
                                          <img src={SignPerson?.sign} alt="" className="docsign_fix" />
                                          <p>{`${SignPerson?.Name}, ${SignPerson?.Qualification}`}</p>
                                          <p>{SignPerson?.Designation}</p>
                                          <p>Reg. No: {SignPerson?.State_RegistrationNumber}</p>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                </td>
                              </tr>

                              <tr className="ehdhe_9ikw">
                                <td className="shshxhxs_secfooter">
                                  {!emailsent && (
                                    <div
                                      style={{
                                        height: "150px",
                                        width: "100%",
                                      }}
                                    ></div>
                                  )}

                                  {emailsent && (
                                    <>
                                      <div className="doctr_sign_fix7ccdddd_head">
                                        <td
                                          className="jjkd8i_line"
                                          style={{
                                            height: "1px",
                                            width: "100%",
                                            backgroundColor: "grey",
                                            marginBottom: "5px",
                                          }}
                                        ></td>
                                        <div className="sdfsdfsdf_xcvjds89">
                                          <h4>
                                            Emergency Care<span>:</span>
                                            04923225300
                                          </h4>
                                          <h4>
                                            Mob No<span>:</span>09965150000
                                          </h4>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        ))}
                    </>
                  );
                } else if (dpt.department === "HISTOPATHOLOGY") {
                  return (
                    <>
                      {summa
                        .filter((p) => p.department === "HISTOPATHOLOGY")
                        .map((group, index) => (
                          <table
                            className="report_table"
                            style={{ pageBreakAfter: "always" }}
                          >
                            <thead className="print_header">
                              {!summa.some(
                                (item) => item.Report_Type === "OT"
                              ) && (
                                  <div className="wiioo900"
                                    style={{ marginTop: emailsent ? "0px" : "65px" }}
                                  >
                                    <tr className="new_billing_address_2 ededfedf_9jui">
                                      <td className="Register_btn_con_barcode">
                                        <div id="get_imagecontent_1">
                                          <img
                                            src={
                                              patinetbillingbarcode
                                                ? generateBarcode(
                                                  patinetbillingbarcode
                                                )
                                                : ""
                                            }
                                            alt="barcodeimage"
                                            style={{
                                              width: "170px",
                                              height: "40px",
                                              objectFit: "fill",
                                            }}
                                          />
                                        </div>
                                      </td>
                                      <td className="new_billing_div_report">
                                        <label>
                                          Patient Name <p>:</p>
                                        </label>
                                        <span>
                                          {capturedatas.Title}.{" "}
                                          {capturedatas.Patient_Name}
                                        </span>
                                      </td>
                                      {microandhistonumber === "" && (
                                        <td className="new_billing_div_report">
                                          <label>
                                            Visit ID <p>:</p>
                                          </label>
                                          <span>{capturedatas.Visit_Id}</span>
                                        </td>
                                      )}
                                      <td className="new_billing_div_report">
                                        <label>
                                          Age/Gender <p>:</p>
                                        </label>
                                        <span>
                                          {capturedatas.Age}{" "}
                                          {capturedatas?.Time_Period}s/{" "}
                                          {capturedatas.Gender}
                                        </span>
                                      </td>

                                      <td className="new_billing_div_report">
                                        <label>
                                          UHID <p>:</p>
                                        </label>
                                        <span>{capturedatas.Patient_Id}</span>
                                      </td>

                                      <td className="new_billing_div_report">
                                        <label>
                                          Ref.Dr <p>:</p>
                                        </label>
                                        <span>{capturedatas.Refering_Doctor?.split('/')?.[0] || ''}</span>
                                      </td>
                                      <td className="new_billing_div_report">
                                        <label>
                                          Department <p>:</p>
                                        </label>
                                        <span>{capturedatas.Refering_Doctor?.split('/')?.[1]}</span>
                                      </td>




                                    </tr>

                                    <tr className="new_billing_address_2 ededfedf_9jui">
                                      <td className="Register_btn_con_barcode">
                                        <div id="get_imagecontent_2">
                                          <img
                                            src={
                                              capturedatas && capturedatas.Barcode
                                                ? generateBarcode(
                                                  capturedatas.Barcode
                                                )
                                                : ""
                                            }
                                            alt="barcodeimage"
                                            className="get_imagecontent_2_imhhhh"
                                          />
                                        </div>
                                      </td>
                                      {/* <td className="new_billing_div_report ffddffn">
                                      <label>
                                        Invoice No <p>:</p>
                                      </label>
                                      <span>
                                        {capturedatas.Billing_Invoice}
                                      </span>
                                    </td> */}
                                      {/* <td className="new_billing_div_report ffddffn">
                                      <label>
                                        Collected <p>:</p>
                                      </label>
                                      <span>
                                        {
                                          summa[0]?.invoicedetails
                                            ?.AnalyseInvestigationResult
                                        }
                                      </span>
                                    </td> */}
                                      <td className="new_billing_div_report ffddffn">
                                        <label>
                                          OP/IP No<p>:</p>
                                        </label>
                                        <span>{capturedatas.Billing_Invoice}</span>
                                      </td>
                                      <td className="new_billing_div_report ffddffn">
                                        <label>
                                          Histo.no <p>:</p>
                                        </label>
                                        <span>
                                          {dpt.testdetails?.[0]?.Packagegroup
                                            ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]?.histonumber || "-"
                                            : dpt.testdetails[0]?.histonumber || "-"}
                                        </span>
                                      </td>
                                      <td className="new_billing_div_report ffddffn">
                                        <label>
                                          Received <p>:</p>
                                        </label>
                                        <span>
                                          {
                                            summa[0]?.invoicedetails
                                              ?.AnalyseInvestigationSenior
                                          }
                                        </span>
                                      </td>
                                      <td className="new_billing_div_report ffddffn">
                                        <label>
                                          Reported <p>:</p>
                                        </label>
                                        <span>
                                          {
                                            summa[0]?.invoicedetails
                                              ?.Approve_Test_Pathologist
                                          }
                                        </span>
                                      </td>
                                    </tr>
                                  </div>
                                )}
                            </thead>

                            <div className="histo_report_1111 oiriruur">
                              <div
                                className="Register_btn_con"
                                style={{
                                  position: "relative", left: "235px"
                                }}>
                                {editMode && group.testdetails.map((test, idx) => (
                                  <button
                                    className="RegisterForm_1_btns  Rhugt_report"
                                    key={idx}
                                    onClick={() => handleViewClick(
                                      test.EditContent,
                                      test.Test_Code,
                                      test.Billing_Invoice
                                    )}
                                  >
                                    View
                                  </button>
                                ))}
                              </div>


                              <div className="histo_report">
                                {group.testdetails.map((test, idx) => (
                                  <div
                                    key={idx}
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      justifyContent: "center",
                                      width: "100%",
                                    }}

                                    dangerouslySetInnerHTML={{
                                      __html: atob(test.EditContent),
                                    }}
                                  />
                                ))}
                              </div>
                            </div>

                            <tfoot className="print_footerr">
                              <tr className="jjxcdsjjej_">
                                <td className="footer_fix_conten_fyft microejeo onlyfrhistoo009">
                                  <div className="dcnnmjy0s66">
                                    <div className="Register_btn_con_QRcode_fix">
                                      <img
                                        src={patinetbillingQr}
                                        alt="qrcode"
                                        style={{
                                          width: "80px",
                                          height: "80px",
                                          objectFit: "fill",
                                        }}
                                      />
                                      <div className=""
                                        style={{
                                          width: "310px",
                                          fontsize: "18px",
                                          // position: "relative",
                                          // right: "68px",
                                        }}>
                                        Checked By:
                                        {dpt.testdetails?.[0]?.Packagegroup
                                          ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]?.labtechnician
                                          : dpt.testdetails[0]?.labtechnician}
                                      </div>

                                    </div>



                                    <div className="doctr_sign_fix7cc doctr_sign_fix7cc_secddg">
                                      {SignPerson?.Name && SignPerson?.sign && (
                                        <div className='dscsdcs_cdfer34'>
                                          <img src={SignPerson.sign} alt="Signature" className="docsign_fix" />

                                          <p style={{
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            fontSize: "15px",
                                            width: "250px",
                                            fontWeight: "400",
                                          }}>
                                            {`${SignPerson.Name}, ${SignPerson.Qualification}`}
                                          </p>

                                          <p style={{
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            fontSize: "15px",
                                            width: "250px",
                                            fontWeight: "400",
                                          }}>
                                            {SignPerson.Designation}
                                          </p>

                                          <p style={{
                                            display: 'flex',
                                            justifyContent: 'flex-start',
                                            fontSize: "15px",
                                            width: "250px",
                                            fontWeight: "400",
                                          }}>
                                            Reg. No: {SignPerson.State_RegistrationNumber}
                                          </p>
                                        </div>
                                      )}


                                    </div>


                                  </div>

                                </td>
                              </tr>

                              <tr className="ehdhe_9ikw">
                                <td className="shshxhxs_secfooter">
                                  {!emailsent && (
                                    <div
                                      style={{
                                        height: "150px",
                                        width: "100%",
                                      }}
                                    ></div>
                                  )}

                                  {emailsent && (
                                    <>
                                      <div className="doctr_sign_fix7ccdddd_head onlyfrhistooo232">
                                        <div
                                          className="jjkd8i_line"
                                          style={{
                                            height: "1px",
                                            width: "100%",
                                            backgroundColor: "grey",
                                            marginBottom: "5px",
                                          }}
                                        ></div>
                                        <div className="sdfsdfsdf_xcvjds89">
                                          <h4>
                                            Emergency Care<span>:</span>
                                            04923225300
                                          </h4>
                                          <h4>
                                            Mob No<span>:</span>09965150000
                                          </h4>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </td>
                              </tr>
                            </tfoot>
                          </table>

                        ))}
                    </>
                  );
                } else if (
                  (dpt.department === "MICROBIOLOGY" && dpt.testdetails.every(test => test.Culturetest === "No")) ||
                  (dpt.department !== "HISTOPATHOLOGY" && !dpt.testdetails.some((p) => p.Test_Code === "LTC1116")) ||
                  dpt.testdetails.some(test => test.Test_Method === "Offers")
                ) {
                  // Filter Microbiology tests with Iscutoffvalue === "Yes" for SEROLOGY
                  const cutoffTests = dpt.department === "SEROLOGY" &&
                    !dpt.testdetails.some(p => p.Test_Code === "LTC1116")
                    ? dpt.testdetails.filter(test => test.Iscutoffvalue === "Yes")
                    : [];
                  const hasCutoffReport = cutoffTests.length > 0;

                  if (!hasCutoffReport) {
                    // Separate logic for Offers
                    const isOffer = dpt.testdetails.some(test => test.Test_Method === "Offers");

                    // Step 1: Flatten tests from Packagegroup and testdetails
                    const flattenedTests = [];
                    dpt.testdetails.forEach((item) => {
                      if (item.Packagegroup) {
                        item.Packagegroup.forEach((group) => {
                          group.testdetails.forEach((test) => {
                            flattenedTests.push({
                              ...test,
                              _groupName: group.groupname,
                              _packageName: group.PackageName,
                              _packageCode: test.PackageCode,
                              _isGroupTest: true,
                            });
                          });
                        });
                      } else {
                        flattenedTests.push({
                          ...item,
                          _groupName: item.Group_Name || "",
                          _packageName: item.PackageName || "",
                          _packageCode: item.PackageCode || "",
                          _isGroupTest: false,
                        });
                      }
                    });

                    // Step 2: Filter tests based on Test_Method === "Offers"
                    const filteredTests = isOffer
                      ? flattenedTests.filter(test => test.Test_Method === "Offers")
                      : flattenedTests;

                    // Step 3: Group tests by PackageCode
                    const groupedByPackage = filteredTests.reduce((acc, test) => {
                      const packageKey = test._packageCode || "no_package";
                      if (!acc[packageKey]) {
                        acc[packageKey] = {
                          packageName: test._packageName,
                          groups: {},
                        };
                      }
                      const groupKey = test._groupName || "no_group";
                      if (!acc[packageKey].groups[groupKey]) {
                        acc[packageKey].groups[groupKey] = [];
                      }
                      acc[packageKey].groups[groupKey].push(test);
                      return acc;
                    }, {});



                    // Step 4: Render each package as a separate table for Offers
                    return (
                      <div className="bioconnn">
                        {Object.entries(groupedByPackage).map(([packageKey, packageData], pkgIndex) => {
                          const isSemenAnalysisPackage = packageData?.packageName === "SEMEN ANALYSIS"
                          return (
                            <table
                              key={`package_table_${packageKey}`}
                              className="biochemistry-report-group"
                              style={{
                                width: "90%",
                                position: "relative",
                                left: "41px",
                                pageBreakAfter: isOffer ? "always" : "auto", // Ensure page break for Offers
                              }}
                            >
                              {/* Header Section for Each Package */}

                              <thead className="print_header">
                                {!summa.some((item) => item.Report_Type === "OT") && (
                                  isSemenAnalysisPackage ? (
                                    <div className="semiiioooiu"
                                      style={{ marginTop: emailsent ? "0px" : "65px" }}
                                    >
                                      <tr className="sem_address_2 weerrrrqqq">

                                        <td className="sem_div_report">
                                          <div className="label_colon">
                                            <label>
                                              Name and Age  </label>
                                            <span>:</span>
                                          </div>
                                          <span>
                                            {capturedatas.Title}. {capturedatas.Patient_Name} {capturedatas.Age}
                                          </span>

                                        </td>


                                        <td className="sem_div_report">
                                          <div className="label_colon">
                                            <label>
                                              Patient ID  </label>

                                            <span>:</span>

                                          </div>
                                          <span>
                                            {capturedatas.Patient_Id}
                                          </span>
                                        </td>
                                        <td className="sem_div_report">
                                          <div className="label_colon">
                                            <label>Period of Abstinence</label>
                                            <span>:</span>
                                          </div>
                                          <span> {dpt.testdetails?.[0]?.Packagegroup
                                            ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]?.abstinence || "-"
                                            : dpt.testdetails[0]?.abstinence || "-"}</span>
                                        </td>



                                      </tr>
                                      <tr className="sem_address_2 weerrrrqqq">
                                        <td className="sem_div_report">
                                          <div className="label_colon">
                                            <label>
                                              Referring Physician
                                            </label>
                                            <span>:</span>
                                          </div>
                                          <span>
                                            {capturedatas.Refering_Doctor?.split('/')?.[0] || ''}
                                          </span>
                                        </td>


                                        <td className="sem_div_report">
                                          <div className="label_colon">
                                            <label style={{ marginRight: "62px" }}  >
                                              Date and time of collection
                                            </label>
                                            <span>:</span>
                                          </div>
                                          <span>
                                            {(() => {
                                              const invoiceDetailsFromPackagegroup = dpt?.testdetails?.flatMap(td => td.Packagegroup || [])?.find(pg => pg.invoicedetails)?.invoicedetails;
                                              const invoiceDetails = invoiceDetailsFromPackagegroup || dpt?.invoicedetails;
                                              return invoiceDetails?.AnalyseInvestigationResult || "-";
                                            })()}
                                          </span>
                                        </td>

                                        <td className="sem_div_report">
                                          <div className="label_colon">
                                            <label>
                                              Examination time
                                            </label>
                                            <span>:</span>
                                          </div>
                                          <span>
                                            {(() => {
                                              const invoiceDetailsFromPackagegroup = dpt?.testdetails?.flatMap(td => td.Packagegroup || [])?.find(pg => pg.invoicedetails)?.invoicedetails;
                                              const invoiceDetails = invoiceDetailsFromPackagegroup || dpt?.invoicedetails;
                                              return invoiceDetails?.Approve_Test_Pathologist || "-";
                                            })()}
                                          </span>
                                        </td>
                                      </tr>

                                    </div>


                                  ) : (




                                    <div className="wiioo900"
                                      style={{ marginTop: emailsent ? "0px" : "65px" }}
                                    >
                                      <tr className="new_billing_address_2 ededfedf_9jui">
                                        <td className="Register_btn_con_barcode">
                                          <div id="get_imagecontent_1">
                                            <img
                                              src={
                                                patinetbillingbarcode
                                                  ? generateBarcode(patinetbillingbarcode)
                                                  : ""
                                              }
                                              alt="barcodeimage"
                                              style={{
                                                width: "170px",
                                                height: "40px",
                                                objectFit: "fill",
                                              }}
                                            />
                                          </div>
                                        </td>
                                        <td className="new_billing_div_report">
                                          <label>
                                            Patient Name <p>:</p>
                                          </label>
                                          {editMode ? (
                                            <span className="patient-input-group">
                                              <select
                                                name="title"
                                                value={patientdetails.title}
                                                onChange={handleInputChange}
                                                className="patient-titllles"
                                              >
                                                <option value="">Title</option>
                                                <option value="Mr">Mr.</option>
                                                <option value="Ms">Ms.</option>
                                                <option value="Mrs">Mrs.</option>
                                                <option value="Baby">Baby.</option>
                                                <option value="Dr">Dr.</option>
                                                <option value="BabyOf">Baby.of.</option>
                                                <option value="Child">Child.</option>
                                                <option value="Sister">Sister</option>
                                                <option value="Master">Master</option>
                                                <option value="Others">Others</option>
                                              </select>
                                              <input
                                                type="text"
                                                name="patientname"
                                                value={patientdetails.patientname}
                                                onChange={handleInputChange}
                                                className="patient-name"
                                              />
                                            </span>
                                          ) : (
                                            <span>
                                              {capturedatas.Title}. {capturedatas.Patient_Name}
                                            </span>
                                          )}
                                        </td>
                                        {microandhistonumber === "" && (
                                          <td className="new_billing_div_report">
                                            <label>
                                              Visit ID <p>:</p>
                                            </label>
                                            <span>{capturedatas.Visit_Id}</span>
                                          </td>
                                        )}
                                        <td className="new_billing_div_report">
                                          <label>
                                            Age/Gender <p>:</p>
                                          </label>
                                          {editMode ? (
                                            <span className="patient-input-group">
                                              <input
                                                type="number"
                                                name="age"
                                                value={patientdetails.age}
                                                onChange={handleInputChange}
                                                className="patient-age"
                                              />
                                              <select
                                                name="timeperiod"
                                                value={patientdetails.timeperiod}
                                                onChange={handleInputChange}
                                                className="patient-year"
                                              >
                                                <option value="hour">Hours</option>
                                                <option value="day">Days</option>
                                                <option value="week">Weeks</option>
                                                <option value="month">Months</option>
                                                <option value="year">Years</option>
                                              </select>
                                              /
                                              <select
                                                name="gender"
                                                value={patientdetails.gender}
                                                onChange={handleInputChange}
                                                className="patient-gender"
                                              >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                              </select>
                                            </span>
                                          ) : (
                                            <span>
                                              {capturedatas.Age} {capturedatas?.Time_Period}s /{" "}
                                              {capturedatas.Gender}
                                            </span>
                                          )}
                                        </td>
                                        <td className="new_billing_div_report">
                                          <label>
                                            UHID <p>:</p>
                                          </label>
                                          <span>{capturedatas.Patient_Id}</span>
                                        </td>
                                        <td className="new_billing_div_report">
                                          <label>
                                            Ref.Dr <p>:</p>
                                          </label>
                                          <span>{capturedatas.Refering_Doctor?.split('/')?.[0] || ''}</span>
                                        </td>
                                        <td className="new_billing_div_report">
                                          <label>
                                            Department <p>:</p>
                                          </label>
                                          <span>{capturedatas.Refering_Doctor?.split('/')?.[1]}</span>
                                        </td>
                                        {/* <td className="new_billing_div_report">
                      <label>
                        Ref Hospital <p>:</p>
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          name="concernname"
                          list="concernnamelist"
                          value={patientdetails.concernname}
                          onChange={handleInputChange}
                          className="patient-referhos"
                        />
                      ) : (
                        <span>{capturedatas.Refering_Hospital}</span>
                      )}
                    </td> */}
                                      </tr>
                                      <tr className="new_billing_address_2 ededfedf_9jui">
                                        <td className="Register_btn_con_barcode">
                                          <div id="get_imagecontent_2">
                                            <img
                                              src={
                                                capturedatas && capturedatas.Barcode
                                                  ? generateBarcode(capturedatas.Barcode)
                                                  : ""
                                              }
                                              alt="barcodeimage"
                                              className="get_imagecontent_2_imhhhh"
                                            />
                                          </div>
                                        </td>
                                        <td className="new_billing_div_report ffddffn">
                                          <label>
                                            OP/IP No<p>:</p>
                                          </label>
                                          <span>{capturedatas.Billing_Invoice}</span>
                                        </td>
                                        <td className="new_billing_div_report ffddffn">
                                          <label>
                                            Sample<p>:</p>
                                          </label>
                                          <span>
                                            {dpt.testdetails?.[0]?.Packagegroup
                                              ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]?.Sample_Specimen || "-"
                                              : dpt.testdetails[0]?.Sample_Specimen || "-"}
                                          </span>
                                        </td>

                                        <td className="new_billing_div_report ffddffn">
                                          <label>
                                            Collected <p>:</p>
                                          </label>
                                          <span>
                                            {(() => {
                                              const invoiceDetailsFromPackagegroup = dpt?.testdetails?.flatMap(td => td.Packagegroup || [])?.find(pg => pg.invoicedetails)?.invoicedetails;
                                              const invoiceDetails = invoiceDetailsFromPackagegroup || dpt?.invoicedetails;
                                              return invoiceDetails?.AnalyseInvestigationResult || "-";
                                            })()}
                                          </span>
                                        </td>
                                        <td className="new_billing_div_report ffddffn">
                                          <label>
                                            Received <p>:</p>
                                          </label>
                                          <span>
                                            {(() => {
                                              const invoiceDetailsFromPackagegroup = dpt?.testdetails?.flatMap(td => td.Packagegroup || [])?.find(pg => pg.invoicedetails)?.invoicedetails;
                                              const invoiceDetails = invoiceDetailsFromPackagegroup || dpt?.invoicedetails;
                                              return invoiceDetails?.AnalyseInvestigationSenior || "-";
                                            })()}
                                          </span>
                                        </td>
                                        <td className="new_billing_div_report ffddffn">
                                          <label>
                                            Reported <p>:</p>
                                          </label>
                                          <span>
                                            {(() => {
                                              const invoiceDetailsFromPackagegroup = dpt?.testdetails?.flatMap(td => td.Packagegroup || [])?.find(pg => pg.invoicedetails)?.invoicedetails;
                                              const invoiceDetails = invoiceDetailsFromPackagegroup || dpt?.invoicedetails;
                                              return invoiceDetails?.Approve_Test_Pathologist || "-";
                                            })()}
                                          </span>
                                        </td>
                                      </tr>

                                    </div>

                                  )
                                )}
                              </thead>




                              {/* Additional Header for Package Name */}
                              <div className="print-page3">
                                <div className="ewdwedcsdwe">


                                  <div className="table-container554">

                                    <table className="report_table hesyyd_p_Bicochemis0">
                                      <thead className="report_table_p99c">
                                        <tr>
                                          <th colSpan="4" className="bio_test_header"
                                            style={
                                              isSemenAnalysisPackage
                                                ? {
                                                  position: "relative",
                                                  left: "350px",
                                                }
                                                : {

                                                  textAlign: "center",

                                                }
                                            }>
                                            {
                                              packageData?.packageName
                                                ? packageData.packageName
                                                : `Test Report - ${dpt.testdetails?.[0]?.Packagegroup
                                                  ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]?.SubDepartment_Name || "-"
                                                  : dpt.testdetails[0]?.SubDepartment_Name || "-"
                                                }`
                                            }
                                          </th>
                                        </tr>


                                        {!isSemenAnalysisPackage && (
                                          <tr>
                                            <th>Test Name</th>
                                            <th>Result</th>
                                            {!isSemenAnalysisPackage && <th>Unit</th>}
                                            <th>Biological Reference</th>
                                          </tr>
                                        )}
                                      </thead>

                                      {/* Body Section */}
                                      <tbody className="hesyyd_p0 report_table_p99c">
                                        {/* <tr key={`package_${packageKey}`}>
                                        <td colSpan={4} style={{ textAlign: "left", fontWeight: "bold" }}>
                                          {packageData.packageName}
                                        </td>
                                      </tr> */}
                                        {isSemenAnalysisPackage && (
                                          <tr>
                                            <td colSpan={4}>
                                              <div style={{ marginTop: "1rem" }}>
                                                <label htmlFor="pathologyremark"><strong>Any severe infection/chronic inflammatory disease/Medications for severe illness in past 6 months:</strong></label>
                                                <p style={{ whiteSpace: "pre-wrap" }}>
                                                  {dpt.testdetails?.[0]?.Packagegroup
                                                    ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]?.pathologyyesorno || "-"
                                                    : dpt.testdetails[0]?.pathologyyesorno || "-"}
                                                </p>
                                              </div>
                                            </td>
                                          </tr>
                                        )}
                                        {Object.entries(packageData.groups).map(([groupKey, tests], groupIndex) => {
                                          const groupRows = [];

                                          // Add group header if applicable
                                          if (groupKey !== "no_group") {
                                            if (groupKey === "Sperm Count") {
                                              groupRows.push(
                                                <tr key={`microscopic_header_${packageKey}_${groupKey}`}>
                                                  <td colSpan={4} style={{ textAlign: "left", fontWeight: "bold" }}>
                                                    Microscopic Examination
                                                  </td>
                                                </tr>
                                              );
                                            }
                                            groupRows.push(
                                              <tr key={`group_${packageKey}_${groupKey}`}>
                                                <td colSpan={4} style={{ textAlign: "left", fontWeight: "bold" }}>
                                                  {groupKey}
                                                </td>
                                              </tr>
                                            );
                                          }
                                          // Add table header for each group in Semen Analysis
                                          if (isSemenAnalysisPackage) {
                                            groupRows.push(
                                              <tr className="weioxssdsd" key={`header_${packageKey}_${groupKey}`}>
                                                <th>Test Name</th>
                                                <th>Result</th>
                                                <th>Reference Range (WHO 6th Ed.)</th>
                                              </tr>
                                            );
                                          }

                                          // Sort tests within the group
                                          const sortedTests = isOffer
                                            ? tests.sort((a, b) => (a.Test_Name || "").localeCompare(b.Test_Name || ""))
                                            : tests;




                                          // Render each test
                                          sortedTests.forEach((test, testIndex) => {
                                            const testKey = `${test.Test_Code}_${test.Billing_Invoice}`;
                                            const isEditing = editMode;
                                            const edited = editBioData[testKey] || {};
                                            const merged = { ...test, ...edited };

                                            if (isSemenAnalysisPackage) {
                                              // Custom table-like structure for Semen Analysis
                                              groupRows.push(
                                                <tr key={`${packageKey}_${groupKey}_${testIndex}`}>
                                                  <td style={{ padding: "5px", border: "1px solid Black", textAlign: "left" }}>
                                                    <div className="uyhfgr_gf">
                                                      <p>{test.DisplayText || test.Test_Name}</p>
                                                      <i
                                                        style={{
                                                          visibility: test.Group_Code === "GM0019" ? "hidden" : "visible",
                                                        }}
                                                      >
                                                        {test.Method_Name && (
                                                          <span>{`Method- ${test.Method_Name}`}</span>
                                                        )}
                                                      </i>
                                                    </div>
                                                  </td>
                                                  <td style={{ padding: "5px", border: "1px solid Black", ...getStatus(merged.Capture_Value, merged.ReferenceRange).valueStyle }}>
                                                    {isEditing ? (
                                                      <input
                                                        type="text"
                                                        value={merged.Capture_Value}
                                                        onChange={(e) =>
                                                          handleBioChange(
                                                            test.Test_Code,
                                                            test.Billing_Invoice,
                                                            "Capture_Value",
                                                            e.target.value
                                                          )
                                                        }
                                                      />
                                                    ) : (
                                                      test.Capture_Value || ""
                                                    )}
                                                  </td>
                                                  {/*  */}
                                                  <td style={{ padding: "5px", border: "1px solid Black" }}>
                                                    {isEditing ? (
                                                      <input
                                                        type="text"
                                                        value={merged.ReferenceRange}
                                                        onChange={(e) =>
                                                          handleBioChange(
                                                            test.Test_Code,
                                                            test.Billing_Invoice,
                                                            "ReferenceRange",
                                                            e.target.value
                                                          )
                                                        }
                                                      />
                                                    ) : (
                                                      test.ReferenceRange || ""
                                                    )}
                                                  </td>
                                                </tr>
                                              );
                                            }
                                            else {
                                              groupRows.push(

                                                <tr key={`${packageKey}_${groupKey}_${testIndex}`}>



                                                  <td>
                                                    <div className="uyhfgr_gf">
                                                      <p>
                                                        {test.DisplayText}
                                                      </p>
                                                      <i
                                                        style={{
                                                          visibility: test.Group_Code === "GM0019" ? "hidden" : "visible",
                                                        }}
                                                      >
                                                        {test.Method_Name &&
                                                          (
                                                            <span>{`Method- ${test.Method_Name}`}</span>
                                                          )}
                                                      </i>
                                                    </div>
                                                  </td>
                                                  <td style={getStatus(merged.Capture_Value, merged.ReferenceRange).valueStyle}>
                                                    {isEditing ? (
                                                      <input
                                                        type="text"
                                                        value={merged.Capture_Value}
                                                        onChange={(e) =>
                                                          handleBioChange(
                                                            test.Test_Code,
                                                            test.Billing_Invoice,
                                                            "Capture_Value",
                                                            e.target.value
                                                          )
                                                        }
                                                      />
                                                    ) : (
                                                      test.Capture_Value
                                                    )}
                                                  </td>
                                                  {!isSemenAnalysisPackage && (

                                                    <td>
                                                      {isEditing ? (
                                                        <input
                                                          type="text"
                                                          value={merged.Unit_Name}
                                                          onChange={(e) =>
                                                            handleBioChange(
                                                              test.Test_Code,
                                                              test.Billing_Invoice,
                                                              "UOM",
                                                              e.target.value
                                                            )
                                                          }
                                                        />
                                                      ) : ["nil", "negative", "-"].includes(String(test.Capture_Value).toLowerCase()) ? (
                                                        ""
                                                      ) : (
                                                        test.Unit_Name
                                                      )}
                                                    </td>
                                                  )}



                                                  <td>
                                                    {isEditing ? (
                                                      <input
                                                        type="text"
                                                        value={merged.ReferenceRange}
                                                        onChange={(e) =>
                                                          handleBioChange(
                                                            test.Test_Code,
                                                            test.Billing_Invoice,
                                                            "ReferenceRange",
                                                            e.target.value
                                                          )
                                                        }
                                                      />
                                                    ) : (
                                                      test.ReferenceRange
                                                    )}
                                                  </td>
                                                  {test.Is_NABHL == "Yes" && (
                                                    <td>
                                                      <img
                                                        src={nabhl_logo}
                                                        alt="nabhllogo"
                                                        style={{
                                                          width: "40px",
                                                          height: "40px",
                                                          objectFit: "fill",
                                                        }}
                                                      />
                                                    </td>
                                                  )}

                                                </tr>
                                              );
                                            }


                                            // Add interpretation row if testinterpreatation exists
                                            if (test.testinterpreatation?.length > 0) {
                                              test.testinterpreatation.forEach((item, index) => {
                                                if (item.Header_interpretation || item.Comments) {
                                                  groupRows.push(
                                                    <tr key={`${packageKey}_${groupKey}_${testIndex}_interpretation_${index}`}>
                                                      <td colSpan={4} style={{ textAlign: "start" }}>
                                                        <div className="interpretation-container">
                                                          {item.Header_interpretation && (
                                                            <label>
                                                              {item.Header_interpretation}
                                                              <span>:</span>
                                                            </label>
                                                          )}
                                                          {console.log(item.comments)}

                                                          {item.Comments &&
                                                            item.Comments !== "null" &&
                                                            typeof item.Comments === "string" &&
                                                            (() => {
                                                              try {
                                                                const decoded = atob(item.Comments).trim();
                                                                return decoded !== "" ? (
                                                                  <div
                                                                    className="dataforprint"
                                                                    dangerouslySetInnerHTML={{ __html: decoded }}
                                                                  />
                                                                ) : null;
                                                              } catch (e) {
                                                                console.warn("Invalid base64:", item.Comments);
                                                                return null;
                                                              }
                                                            })()}

                                                        </div>
                                                      </td>
                                                    </tr>
                                                  );
                                                }
                                              });
                                            }




                                            // Add guidelines row if guidelines_interpretation exists
                                            if (test.guidelines_interpretation?.length > 0) {
                                              test.guidelines_interpretation.forEach((item, index) => {
                                                if (item.Header_interpretation || item.Comments) {
                                                  groupRows.push(
                                                    <tr key={`${packageKey}_${groupKey}_${testIndex}_guidelines_${index}`}>
                                                      <td colSpan={4} style={{ textAlign: "start" }}>
                                                        <div className="guideline-container">
                                                          {item.Header_interpretation && (
                                                            <h4 className="guideline-header">{item.Header_interpretation}</h4>
                                                          )}
                                                          {item.Comments && (
                                                            <ol className="guideline-points">
                                                              {item.Comments.split("\n").map((point, i) => {
                                                                const trimmedPoint = point.replace(/^\d+\.\t/, "").trim();
                                                                return trimmedPoint ? <li key={i}>{trimmedPoint}</li> : null;
                                                              })}
                                                            </ol>
                                                          )}
                                                        </div>
                                                      </td>
                                                    </tr>
                                                  );
                                                }
                                              });
                                            }

                                          });



                                          return groupRows;
                                        })}

                                      </tbody>
                                    </table>
                                  </div>
                                  {(() => {
                                    const remark = dpt.testdetails?.[0]?.Packagegroup
                                      ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]?.pathologyremarks
                                      : dpt.testdetails[0]?.pathologyremarks;

                                    return remark ? (
                                      <div className="remarks-section">
                                        <label htmlFor="pathologyremark"><strong>Remarks:</strong></label>
                                        <p>{remark}</p>
                                      </div>
                                    ) : null;
                                  })()}


                                  <div className="Add_items_Purchase_Master yydd_end_reprt">
                                    <span> - End of Report - </span>
                                  </div>
                                </div>
                              </div>



                              {/* Footer Section for Each Package */}
                              <tfoot className="print_footerr">
                                {isSemenAnalysisPackage ? (
                                  <tr className="jjxcdsjjej_">
                                    <td className="footer_fix_conten_fyft microejeo">
                                      <div className="dcnnmjy0s66">
                                        <div className="Register_btn_con_QRcode_fix">

                                          <div className="cked_byhjus"
                                            style={{
                                              width: "310px",
                                              fontsize: "18px",
                                              // position: "relative",
                                              // right: "68px",
                                            }}>
                                            Lab technician:
                                            {dpt.testdetails?.[0]?.Packagegroup
                                              ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]?.labtechnician || "-"
                                              : dpt.testdetails[0]?.labtechnician || "-"}
                                          </div>

                                        </div>



                                        <div className="doctr_sign_fix7cc doctr_sign_fix7cc_secddg">

                                          {SignPerson?.Name && SignPerson?.sign && (
                                            <div className='dscsdcs_cdfer34'>

                                              <div className="cked_byhjus"
                                                style={{
                                                  width: "310px",
                                                  fontsize: "18px",
                                                  // position: "relative",
                                                  // right: "68px",
                                                }}>
                                                Reported By: {SignPerson?.Name ? `${SignPerson.Name}, ${SignPerson.Qualification}` : ""}

                                              </div>







                                            </div>
                                          )}
                                        </div>


                                      </div>

                                    </td>
                                  </tr>
                                ) : (
                                  <tr className="jjxcdsjjej_">
                                    <td className="footer_fix_conten_fyft microejeo">
                                      <div className="dcnnmjy0s66">
                                        <div className="Register_btn_con_QRcode_fix">
                                          <img
                                            src={patinetbillingQr}
                                            alt="qrcode"
                                            style={{
                                              width: "80px",
                                              height: "80px",
                                              objectFit: "fill",
                                            }}
                                          />
                                          <div className="cked_byhjus"
                                            style={{
                                              width: "310px",
                                              fontsize: "18px",
                                              // position: "relative",
                                              // right: "68px",
                                            }}>
                                            Checked By:
                                            {dpt.testdetails?.[0]?.Packagegroup
                                              ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]?.labtechnician || "-"
                                              : dpt.testdetails[0]?.labtechnician || "-"}
                                          </div>

                                        </div>



                                        <div className="doctr_sign_fix7cc doctr_sign_fix7cc_secddg">

                                          {SignPerson?.Name && SignPerson?.sign && (
                                            <div className='dscsdcs_cdfer34'>

                                              <img src={SignPerson?.sign} alt="" className="docsign_fix" />
                                              <p style={{
                                                display: 'flex', justifyContent: 'flex-start',
                                                fontSize: "15px",
                                                width: "250px",
                                                fontWeight: "400",
                                              }}>{`${SignPerson?.Name}, ${SignPerson?.Qualification}`}</p>
                                              <p style={{
                                                display: 'flex', justifyContent: 'flex-start',
                                                fontSize: "15px",
                                                width: "250px",
                                                fontWeight: "400",
                                              }}>{SignPerson?.Designation}</p>

                                              <p style={{
                                                display: 'flex', justifyContent: 'flex-start',
                                                fontSize: "15px",
                                                width: "250px",
                                                fontWeight: "400",
                                              }}>Reg. No: {SignPerson?.State_RegistrationNumber}</p>

                                            </div>
                                          )}
                                        </div>


                                      </div>

                                    </td>
                                  </tr>
                                )}
                                <tr className="ehdhe_9ikw">
                                  <td className="shshxhxs_secfooter">
                                    {!emailsent && (
                                      <div
                                        style={{
                                          height: "150px",
                                          width: "100%",
                                        }}
                                      ></div>
                                    )}

                                    {emailsent && (
                                      <>
                                        <div className="doctr_sign_fix7ccdddd_head">
                                          <td
                                            className="jjkd8i_line"
                                            style={{
                                              height: "1px",
                                              width: "100%",
                                              backgroundColor: "grey",
                                              marginBottom: "5px",
                                            }}
                                          ></td>
                                          <div className="sdfsdfsdf_xcvjds89">
                                            <h4>
                                              Emergency Care<span>:</span>
                                              04923225300
                                            </h4>
                                            <h4>
                                              Mob No<span>:</span>09965150000
                                            </h4>
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  </td>
                                </tr>
                              </tfoot>
                            </table>
                          )

                        })}
                      </div>
                    );
                  }



                  // Find the index of the first non-Microbiology/non-Histopathology department
                  const firstNonMicroNonHistoIndex = summa.findIndex(
                    (dept) =>
                      (dept.department === "MICROBIOLOGY" && dept.testdetails.every(test => test.Culturetest === "No")) ||
                      dept.department !== "HISTOPATHOLOGY"
                  );

                  // Filter non-Microbiology/non-Histopathology departments for normal values table
                  const nonMicroNonHistoDepartments = summa.filter(
                    (dept) =>
                      (dept.department === "MICROBIOLOGY" && dept.testdetails.every(test => test.Culturetest === "No")) ||
                      dept.department !== "HISTOPATHOLOGY"
                  );

                  // Render cutoff report table for Microbiology with cutoff tests
                  if (dpt.department === "SEROLOGY" && hasCutoffReport) {
                    const isOffer = dpt.testdetails.some((test) => test.Test_Method === "Offers");

                    // Step 1: Flatten tests from Packagegroup and testdetails
                    const flattenedTests = [];
                    cutoffTests.forEach((item) => {
                      if (item.Packagegroup) {
                        item.Packagegroup.forEach((group) => {
                          group.testdetails.forEach((test) => {
                            flattenedTests.push({
                              ...test,
                              _groupName: group.groupname,
                              _packageName: group.PackageName,
                              _packageCode: test.PackageCode,
                              _isGroupTest: true,
                            });
                          });
                        });
                      } else {
                        flattenedTests.push({
                          ...item,
                          _groupName: item.Group_Name || "",
                          _packageName: item.PackageName || "",
                          _packageCode: item.PackageCode || "",
                          _isGroupTest: false,
                        });
                      }
                    });

                    // Step 2: Filter tests based on Test_Method === "Offers"
                    const filteredTests = isOffer
                      ? flattenedTests.filter((test) => test.Test_Method === "Offers")
                      : flattenedTests;

                    // Step 3: Group tests by PackageCode
                    const groupedByPackage = filteredTests.reduce((acc, test) => {
                      const packageKey = test._packageCode || "no_package";
                      if (!acc[packageKey]) {
                        acc[packageKey] = {
                          packageName: test._packageName,
                          groups: {},
                        };
                      }
                      const groupKey = test._groupName || "no_group";
                      if (!acc[packageKey].groups[groupKey]) {
                        acc[packageKey].groups[groupKey] = [];
                      }
                      acc[packageKey].groups[groupKey].push(test);
                      return acc;
                    }, {});

                    return (
                      <div className="bioconnn">
                        {Object.entries(groupedByPackage).map(([packageKey, packageData], pkgIndex) => (
                          <table
                            key={`package_table_${packageKey}`}
                            className="biochemistry-report-group"
                            style={{
                              width: "90%",
                              position: "relative",
                              left: "41px",
                              pageBreakAfter: isOffer ? "always" : "auto", // Ensure page break for Offers
                            }}
                          >
                            <thead className="print_header">
                              {!summa.some((item) => item.Report_Type === "OT") && (
                                <div
                                  className="wiioo900"
                                  style={{ marginTop: emailsent ? "0px" : "65px" }}
                                >
                                  <tr className="new_billing_address_2 ededfedf_9jui">
                                    <td className="Register_btn_con_barcode">
                                      <div id="get_imagecontent_1">
                                        <img
                                          src={
                                            patinetbillingbarcode
                                              ? generateBarcode(patinetbillingbarcode)
                                              : ""
                                          }
                                          alt="barcodeimage"
                                          style={{
                                            width: "170px",
                                            height: "40px",
                                            objectFit: "fill",
                                          }}
                                        />
                                      </div>
                                    </td>
                                    <td className="new_billing_div_report">
                                      <label>
                                        Patient Name <p>:</p>
                                      </label>
                                      {editMode ? (
                                        <span className="patient-input-group">
                                          <select
                                            name="title"
                                            value={patientdetails.title}
                                            onChange={handleInputChange}
                                            className="patient-titllles"
                                          >
                                            <option value="">Title</option>
                                            <option value="Mr">Mr.</option>
                                            <option value="Ms">Ms.</option>
                                            <option value="Mrs">Mrs.</option>
                                            <option value="Baby">Baby.</option>
                                            <option value="Dr">Dr.</option>
                                            <option value="BabyOf">Baby.of.</option>
                                            <option value="Child">Child.</option>
                                            <option value="Sister">Sister</option>
                                            <option value="Master">Master</option>
                                            <option value="Others">Others.</option>
                                          </select>
                                          <input
                                            type="text"
                                            name="patientname"
                                            value={patientdetails.patientname}
                                            onChange={handleInputChange}
                                            className="patient-name"
                                          />
                                        </span>
                                      ) : (
                                        <span>
                                          {capturedatas.Title}. {capturedatas.Patient_Name}
                                        </span>
                                      )}
                                    </td>
                                    {microandhistonumber === "" && (
                                      <td className="new_billing_div_report">
                                        <label>
                                          Visit ID <p>:</p>
                                        </label>
                                        <span>{capturedatas.Visit_Id}</span>
                                      </td>
                                    )}
                                    <td className="new_billing_div_report">
                                      <label>
                                        Age/Gender <p>:</p>
                                      </label>
                                      {editMode ? (
                                        <span className="patient-input-group">
                                          <input
                                            type="number"
                                            name="age"
                                            value={patientdetails.age}
                                            onChange={handleInputChange}
                                            className="patient-age"
                                          />
                                          <select
                                            name="timeperiod"
                                            value={patientdetails.timeperiod}
                                            onChange={handleInputChange}
                                            className="patient-year"
                                          >
                                            <option value="hour">Hours</option>
                                            <option value="day">Days</option>
                                            <option value="week">Weeks</option>
                                            <option value="month">Months</option>
                                            <option value="year">Years</option>
                                          </select>
                                          /
                                          <select
                                            name="gender"
                                            value={patientdetails.gender}
                                            onChange={handleInputChange}
                                            className="patient-gender"
                                          >
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                          </select>
                                        </span>
                                      ) : (
                                        <span>
                                          {capturedatas.Age} {capturedatas?.Time_Period}s /{" "}
                                          {capturedatas.Gender}
                                        </span>
                                      )}
                                    </td>
                                    <td className="new_billing_div_report">
                                      <label>
                                        UHID <p>:</p>
                                      </label>
                                      <span>{capturedatas.Patient_Id}</span>
                                    </td>
                                    <td className="new_billing_div_report">
                                      <label>
                                        Ref.Dr <p>:</p>
                                      </label>
                                      <span>{capturedatas.Refering_Doctor?.split("/")?.[0] || ""}</span>
                                    </td>
                                    <td className="new_billing_div_report">
                                      <label>
                                        Department <p>:</p>
                                      </label>
                                      <span>{capturedatas.Refering_Doctor?.split("/")?.[1]}</span>
                                    </td>
                                  </tr>
                                  <tr className="new_billing_address_2 ededfedf_9jui">
                                    <td className="Register_btn_con_barcode">
                                      <div id="get_imagecontent_2">
                                        <img
                                          src={
                                            capturedatas && capturedatas.Barcode
                                              ? generateBarcode(capturedatas.Barcode)
                                              : ""
                                          }
                                          alt="barcodeimage"
                                          className="get_imagecontent_2_imhhhh"
                                        />
                                      </div>
                                    </td>
                                    <td className="new_billing_div_report ffddffn">
                                      <label>
                                        OP/IP No<p>:</p>
                                      </label>
                                      <span>{capturedatas.Billing_Invoice}</span>
                                    </td>
                                    <td className="new_billing_div_report ffddffn">
                                      <label>
                                        Sample<p>:</p>
                                      </label>
                                      <span>
                                        {dpt.testdetails?.[0]?.Packagegroup
                                          ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]
                                            ?.Sample_Specimen || "-"
                                          : dpt.testdetails[0]?.Sample_Specimen || "-"}
                                      </span>
                                    </td>
                                    <td className="new_billing_div_report ffddffn"></td>
                                    <td className="new_billing_div_report ffddffn">
                                      <label>
                                        Collected <p>:</p>
                                      </label>
                                      <span>
                                        {(() => {
                                          const invoiceDetailsFromPackagegroup = dpt?.testdetails
                                            ?.flatMap((td) => td.Packagegroup || [])
                                            ?.find((pg) => pg.invoicedetails)?.invoicedetails;
                                          const invoiceDetails =
                                            invoiceDetailsFromPackagegroup || dpt?.invoicedetails;
                                          return invoiceDetails?.AnalyseInvestigationResult || "-";
                                        })()}
                                      </span>
                                    </td>
                                    <td className="new_billing_div_report ffddffn">
                                      <label>
                                        Received <p>:</p>
                                      </label>
                                      <span>
                                        {(() => {
                                          const invoiceDetailsFromPackagegroup = dpt?.testdetails
                                            ?.flatMap((td) => td.Packagegroup || [])
                                            ?.find((pg) => pg.invoicedetails)?.invoicedetails;
                                          const invoiceDetails =
                                            invoiceDetailsFromPackagegroup || dpt?.invoicedetails;
                                          return invoiceDetails?.AnalyseInvestigationSenior || "-";
                                        })()}
                                      </span>
                                    </td>
                                    <td className="new_billing_div_report ffddffn">
                                      <label>
                                        Reported <p>:</p>
                                      </label>
                                      <span>
                                        {(() => {
                                          const invoiceDetailsFromPackagegroup = dpt?.testdetails
                                            ?.flatMap((td) => td.Packagegroup || [])
                                            ?.find((pg) => pg.invoicedetails)?.invoicedetails;
                                          const invoiceDetails =
                                            invoiceDetailsFromPackagegroup || dpt?.invoicedetails;
                                          return invoiceDetails?.Approve_Test_Pathologist || "-";
                                        })()}
                                      </span>
                                    </td>
                                  </tr>
                                </div>
                              )}
                            </thead>
                            <tbody>
                              <tr>
                                <td>
                                  <div className="print-page3">
                                    <div className="ewdwedcsdwe">
                                      <div className="table-container554">
                                        <table
                                          className="report_table report_table_for_micro hesyyd_p_Bicochemis0 hesyyd_p_Bicochemis0_normal"
                                        >
                                          <thead className="report_table_p99c">
                                            <tr>
                                              <th
                                                colSpan="4"
                                                className="bio_test_header"
                                                style={{
                                                  textAlign: "center",
                                                  fontWeight: "bold",
                                                }}
                                              >
                                                Test Report -{" "}
                                                {dpt.testdetails?.[0]?.Packagegroup
                                                  ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]
                                                    ?.SubDepartment_Name || "-"
                                                  : dpt.testdetails[0]?.SubDepartment_Name || "-"}
                                              </th>
                                            </tr>
                                            <tr>
                                              <th>Test Name</th>
                                              <th>Cut off Value</th>
                                              <th>Absorbance Value</th>
                                              <th>Result</th>
                                            </tr>
                                          </thead>
                                          <tbody className="hesyyd_p0 report_table_p99c">
                                            <tr key={`package_${packageKey}`}>
                                              <td
                                                colSpan={4}
                                                style={{ textAlign: "left", fontWeight: "bold" }}
                                              >
                                                {packageData.packageName}
                                              </td>
                                            </tr>
                                            {Object.entries(packageData.groups).map(
                                              ([groupKey, tests], groupIndex) => {
                                                const groupRows = [];

                                                // Add group header if applicable
                                                if (groupKey !== "no_group") {
                                                  groupRows.push(
                                                    <tr key={`group_${packageKey}_${groupKey}`}>
                                                      <td
                                                        colSpan={4}
                                                        style={{
                                                          textAlign: "left",
                                                          fontWeight: "bold",
                                                        }}
                                                      >
                                                        {groupKey}
                                                      </td>
                                                    </tr>
                                                  );
                                                }

                                                // Sort tests within the group
                                                const sortedTests = isOffer
                                                  ? tests.sort((a, b) =>
                                                    (a.Test_Name || "").localeCompare(
                                                      b.Test_Name || ""
                                                    )
                                                  )
                                                  : tests;

                                                // Render each test
                                                sortedTests.forEach((test, testIndex) => {
                                                  const testKey = `${test.Test_Code}_${test.Billing_Invoice}`;
                                                  const isEditing = editMode;
                                                  const edited = editBioData[testKey] || {};
                                                  const merged = { ...test, ...edited };

                                                  groupRows.push(
                                                    <tr
                                                      key={`${packageKey}_${groupKey}_${testIndex}`}
                                                    >
                                                      <td>
                                                        <div className="uyhfgr_gf">
                                                          <p>{test.DisplayText}</p>
                                                          <i
                                                            style={{
                                                              visibility:
                                                                test.Group_Code === "GM0019"
                                                                  ? "hidden"
                                                                  : "visible",
                                                            }}
                                                          >
                                                            {test.Method_Name && (
                                                              <span>{`Method- ${test.Method_Name}`}</span>
                                                            )}
                                                          </i>
                                                        </div>
                                                      </td>
                                                      <td>
                                                        {isEditing ? (
                                                          <input
                                                            type="text"
                                                            value={merged.ReferenceRange || ""}
                                                            onChange={(e) =>
                                                              handleBioChange(
                                                                test.Test_Code,
                                                                test.Billing_Invoice,
                                                                "ReferenceRange",
                                                                e.target.value
                                                              )
                                                            }
                                                          />
                                                        ) : (
                                                          test.ReferenceRange
                                                        )}
                                                      </td>
                                                      <td>
                                                        {isEditing ? (
                                                          <input
                                                            type="text"
                                                            value={merged.Capture_Value || ""}
                                                            onChange={(e) =>
                                                              handleBioChange(
                                                                test.Test_Code,
                                                                test.Billing_Invoice,
                                                                "Capture_Value",
                                                                e.target.value
                                                              )
                                                            }
                                                          />
                                                        ) : (
                                                          test.Capture_Value || ""
                                                        )}
                                                      </td>
                                                      <td>
                                                        {isEditing ? (
                                                          <input
                                                            type="text"
                                                            value={merged.Result}
                                                            onChange={(e) =>
                                                              handleBioChange(
                                                                test.Test_Code,
                                                                test.Billing_Invoice,
                                                                "Result",
                                                                e.target.value
                                                              )
                                                            }
                                                          />
                                                        ) : (
                                                          test.Result
                                                        )}
                                                      </td>
                                                    </tr>
                                                  );

                                                  if (test.testinterpreatation?.length > 0) {
                                                    test.testinterpreatation.forEach((item, index) => {
                                                      if (item.Header_interpretation || item.Comments) {
                                                        groupRows.push(
                                                          <tr key={`${packageKey}_${groupKey}_${testIndex}_interpretation_${index}`}>
                                                            <td colSpan={4} style={{ textAlign: "start" }}>
                                                              <div className="interpretation-container">
                                                                {item.Header_interpretation && (
                                                                  <label>
                                                                    {item.Header_interpretation}
                                                                    <span>:</span>
                                                                  </label>
                                                                )}
                                                                {item.Comments && (
                                                                  <p className="dataforprint">{item.Comments}</p>
                                                                )}
                                                              </div>
                                                            </td>
                                                          </tr>
                                                        );
                                                      }
                                                    });
                                                  }

                                                  // Add guidelines row if guidelines_interpretation exists
                                                  if (test.guidelines_interpretation?.length > 0) {
                                                    test.guidelines_interpretation.forEach((item, index) => {
                                                      if (item.Header_interpretation || item.Comments) {
                                                        groupRows.push(
                                                          <tr key={`${packageKey}_${groupKey}_${testIndex}_guidelines_${index}`}>
                                                            <td colSpan={4} style={{ textAlign: "start" }}>
                                                              <div className="guideline-container">
                                                                {item.Header_interpretation && (
                                                                  <h4 className="guideline-header">{item.Header_interpretation}</h4>
                                                                )}
                                                                {item.Comments && (
                                                                  <ol className="guideline-points">
                                                                    {item.Comments.split("\n").map((point, i) => {
                                                                      const trimmedPoint = point.replace(/^\d+\.\t/, "").trim();
                                                                      return trimmedPoint ? <li key={i}>{trimmedPoint}</li> : null;
                                                                    })}
                                                                  </ol>
                                                                )}
                                                              </div>
                                                            </td>
                                                          </tr>
                                                        );
                                                      }
                                                    });
                                                  }
                                                });

                                                return groupRows;
                                              }
                                            )}
                                          </tbody>
                                        </table>
                                      </div>
                                      <div className="Add_items_Purchase_Master yydd_end_reprt">
                                        <span> - End of Report - </span>
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            </tbody>
                            <tfoot className="print_footerr">
                              <tr className="jjxcdsjjej_">
                                <td className="footer_fix_conten_fyft microejeo">
                                  <div className="dcnnmjy0s66">
                                    <div className="Register_btn_con_QRcode_fix">
                                      <img
                                        src={patinetbillingQr}
                                        alt="qrcode"
                                        style={{
                                          width: "80px",
                                          height: "80px",
                                          objectFit: "fill",
                                        }}
                                      />
                                      <div className="cked_byhjus"
                                        style={{
                                          width: "310px",
                                          fontsize: "18px",
                                          // position: "relative",
                                          // right: "68px",
                                        }}>
                                        Checked By:
                                        {dpt.testdetails?.[0]?.Packagegroup
                                          ? dpt.testdetails[0].Packagegroup[0]?.testdetails[0]?.labtechnician
                                          : dpt.testdetails[0]?.labtechnician}
                                      </div>

                                    </div>



                                    <div className="doctr_sign_fix7cc doctr_sign_fix7cc_secddg">
                                      {dpt.department === "MICROBIOLOGY" && SignPerson?.Name && SignPerson?.sign && (

                                        <div className='dscsdcs_cdfer34'>

                                          <img src={SignPerson?.sign} alt="" className="docsign_fix" />
                                          <p style={{
                                            display: 'flex', justifyContent: 'flex-start',
                                            fontSize: "15px",
                                            width: "250px",
                                            fontWeight: "400",
                                          }}>{`${SignPerson?.Name}, ${SignPerson?.Qualification}`}</p>
                                          <p style={{
                                            display: 'flex', justifyContent: 'flex-start',
                                            fontSize: "15px",
                                            width: "250px",
                                            fontWeight: "400",
                                          }}>{SignPerson?.Designation}</p>

                                          <p style={{
                                            display: 'flex', justifyContent: 'flex-start',
                                            fontSize: "15px",
                                            width: "250px",
                                            fontWeight: "400",
                                          }}>Reg. No: {SignPerson?.State_RegistrationNumber}</p>

                                        </div>
                                      )}
                                    </div>


                                  </div>

                                </td>
                              </tr>

                              <tr className="ehdhe_9ikw">
                                <td className="shshxhxs_secfooter">
                                  {!emailsent && (
                                    <div
                                      style={{
                                        height: "150px",
                                        width: "100%",
                                      }}
                                    ></div>
                                  )}

                                  {emailsent && (
                                    <>
                                      <div className="doctr_sign_fix7ccdddd_head">
                                        <td
                                          className="jjkd8i_line"
                                          style={{
                                            height: "1px",
                                            width: "100%",
                                            backgroundColor: "grey",
                                            marginBottom: "5px",
                                          }}
                                        ></td>
                                        <div className="sdfsdfsdf_xcvjds89">
                                          <h4>
                                            Emergency Care<span>:</span>
                                            04923225300
                                          </h4>
                                          <h4>
                                            Mob No<span>:</span>09965150000
                                          </h4>
                                        </div>
                                      </div>
                                    </>
                                  )}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        ))}
                      </div>
                    );
                  }

                  // Render normal values table for first non-Microbiology/non-Histopathology department (if no cutoff report)
                  // Render a table for each department if no cutoff report


                  return null;
                }
              })}
            </tbody>
          </table>
        )}

        {openmodels && (
          <div
            className={
              isSidebarOpen
                ? "sideopen_showcamera_profile"
                : "showcamera_profile"
            }
            onClick={() => {
              setopenmodels(false);
            }}
          >
            <div
              className="newwProfiles newwPopupforreason"
              onClick={(e) => e.stopPropagation()}
            >
              <div ref={contentRef} className="editor_life">
                <CKEditor
                  editor={ClassicEditor}
                  config={{
                    extraPlugins: [uploadPlugin],
                  }}
                  data={content}
                  onChange={(event, editor) => {
                    const data = editor.getData();
                    setContent(data);
                  }}
                />
              </div>

              <div className="Register_btn_con regster_btn_contsai">
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => setopenmodels(false)}
                >
                  Close
                </button>
                {/* <button className="RegisterForm_1_btns" onClick={handleSavedoc}>
                                Save
                            </button> */}
              </div>
            </div>
          </div>
        )}


        {summa.length === 0 && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              gap: "10px",
              marginTop: "15px",
            }}
          >
            <p style={{ color: "red" }}> Your Report is not Ready Now</p>

            <button
              className="RegisterForm_1_btns  Rhugt_report"
              onClick={() => navigate("/Home/Lab")}
            >
              Back
            </button>
          </div>
        )}
      </div>
    );
  }
);

function ReportDocview() {
  const componentRef = useRef();

  const touppercasefun = (value) => {
    return value?.toUpperCase();
  };

  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log(userRecord, "record");
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  // const SignPerson = useSelector((state) => state.userRecord?.SignPerson);
  const printpapaer = useSelector((state) => state.userRecord?.printpapaer);
  const showPrint = useSelector((state) => state.userRecord?.showPrint);



  const [microandhistonumber, setmicroandhistonumber] = useState({});
  let isNoRendered = false;
  const [Dispatch, setdispatch] = useState("");
  const [docid, setDocid] = useState("");

  const [summa, setsumma] = useState([]);
  const [SignPerson, setSignperson] = useState({});

  const [summa1, setsumma1] = useState([]);
  const [formatData, setFormatData] = useState([]);
  const [content, setContent] = useState("");
  const [showmodel, setshowmodel] = useState(false);

  const [editmicrodata, seteditmicrodata] = useState({
    notes: {},
    reportstatus: {},
    microscopy: {},
    culturereport: {},
    bacteriaisolated: {},
    Sample: {},
    macroscopy: {},
    site: {},
  });

  const [cancelReason, setCancelReason] = useState("");
  const [culturevalue, setculturevalue] = useState([]);
  // const [selectedId, setselectedId] = useState(null);
  const [trues, settrues] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [patinetbillingbarcode, setpatinetbillingbarcode] = useState();
  const capturedatas = useSelector((state) => state.userRecord?.Samplecapture);
  // console.log("jhdahjadjadjjajhsdjhsd", capturedatas);
  const [editMode, setEditMode] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [selectedField, setSelectedField] = useState("");
  const [page, setPage] = useState(0);
  const [show, setshow] = useState(false);

  const navigate = useNavigate();
  const pageSize = 10;
  const totalPages = Math.ceil(culturevalue.length / pageSize);
  const showdown = culturevalue.length;
  const [patinetbillingQr, setpatinetbillingQr] = useState("");

  const [emailsent, setemailsent] = useState(false);
  const [openmodels, setopenmodels] = useState(false);
  const [ClinicDetials, setClinicDetials] = useState({
    ClinicLogo: null,
    ClinicName: "",
    ClinicGST: "",
    ClinicAddress: "",
    ClinicCity: "",
    ClinicState: "",
    ClinicCode: "",
    ClinicMobileNo: "",
    ClinicLandLineNo: "",
    ClinicMailID: "",
    InvoiceNo: "",
  });
  const contentRef = useRef(null);
  const editableRef = useRef({});
  const [editBioData, setEditBioData] = useState({});
  const [report, setreport] = useState({
    Collected: "",
    Received: "",
    Reported: "",
    Head: "",
    Detail: "",
  });

  const [patientdetails, setPatientdetails] = useState({
    title: capturedatas.Title || "",
    patientname: capturedatas.Patient_Name || "",
    age: capturedatas.Age || "",
    timeperiod: capturedatas.Time_Period || "",
    gender: capturedatas.Gender || "",
    Referingdoctor: capturedatas.Refering_Doctor || "",
    concernname: capturedatas.Refering_Hospital || "",
  });


  const [antibioticorg, setallantibiotic] = useState([]);
  const [organismdetails, setOrganismdetails] = useState([]);
  const [newEntry, setNewEntry] = useState({
    newOrganism: "",
    Antibiotic: "",
    Sensitivity: "Sensitive",
    Value: "",
    ColonyCount: ""
  });
  const [deletedItems, setDeletedItems] = useState([]);
  const [microscopyname, setMicrocopyName] = useState([]);


  const editorRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editorVisible, setEditorVisible] = useState(false);
  const [currentParams, setCurrentParams] = useState({});
  const [editorContent, setEditorContent] = useState("");
  const [histocontent, setHistocontent] = useState("");
  // console.log("---------------showPrint---------", showPrint);
  const handlecultureChange = (e) => {
    const { name, value } = e.target;

    setNewEntry((prev) => {
      if (name === "newOrganism") {
        // If organism is cleared, clear only Antibiotic and ColonyCount
        if (value.trim() === "") {
          return {
            ...prev,
            newOrganism: "",
            Antibiotic: "",
            ColonyCount: "",
          };
        }

        // If organism is being updated, check if it already exists
        const existingOrganism = culturevalue.find(
          (item) => item.Oraganism === value
        );
        if (existingOrganism) {
          // Automatically set the existing ColonyCount
          return {
            ...prev,
            [name]: value,
            ColonyCount: existingOrganism.ColonyCount,
          };
        }
      }

      // For other fields, just update normally
      return {
        ...prev,
        [name]: value,
      };
    });
  };



  useEffect(() => {
    const culturetestcode = summa
      .filter((item) => item.department === "MICROBIOLOGY")
      .flatMap((item) => item.testdetails.map((test) => test.Test_Code))[0];

    if (culturetestcode) {
      axios
        .get(
          `${urllink}Lab/get_for_culture_report_dispatc?Billinginvoice=${capturedatas?.Billing_Invoice}&Visitid=${capturedatas?.Visit_Id}&testcode=${culturetestcode}`
        )
        .then((response) => {
          console.log(response);
          const data = response.data.map((p, index) => ({
            id: index + 1,
            ...p,
          }));
          setculturevalue(data);
        })
        .catch((error) => {
          console.error("Error fetching culture data:", error);
        });
    }
  }, [capturedatas, urllink, summa]);


  const groupedData = culturevalue.reduce((acc, item) => {
    if (!acc[item.Oraganism]) {
      acc[item.Oraganism] = [];
    }
    acc[item.Oraganism].push(item);
    return acc;
  }, {});


  const handleAddAntibiotic = () => {

    const { newOrganism, Antibiotic, Sensitivity, Value, ColonyCount } = newEntry;
    if (!newOrganism || !Antibiotic) {
      alert("Please select an organism and antibiotic");
      return;
    }

    const existingOrganism = culturevalue.filter(
      (item) => item.Oraganism === newOrganism
    );
    // Check if the organism already exists in the culture value
    const isAntibioticExists = existingOrganism.some(
      (item) => item.antibiotic.toLowerCase() === Antibiotic.toLowerCase()
    );

    console.log(existingOrganism);



    if (isAntibioticExists) {
      alert("Antibiotic already found for this organism.");
      return;
    }

    const newAntibioticEntry = {
      Oraganism: newOrganism,
      antibiotic: Antibiotic,
      Sensitivetype: Sensitivity,
      Antibiotic_Value: Value,
      ColonyCount: existingOrganism.length > 0 ? existingOrganism[0].ColonyCount : ColonyCount, // Use existing colony count if organism exists
      testcode: existingOrganism[0].testcode,
    };

    console.log("newEntry", newAntibioticEntry);
    // Add the new entry to the respective organism
    if (existingOrganism.length > 0) {
      // If organism exists, add antibiotic under it
      const updatedCultureValue = culturevalue.map((item) => {
        if (item.Oraganism === newOrganism) {
          return item;
        }
        return item;
      });

      setculturevalue([...updatedCultureValue, newAntibioticEntry]);
    } else {
      // If organism does not exist, add as a new organism entry
      setculturevalue([...culturevalue, newAntibioticEntry]);
    }

    // Clear inputs
    setNewEntry({
      newOrganism: "",
      Antibiotic: "",
      Sensitivity: "Sensitive",
      Value: "",
      ColonyCount: ""
    });
  };


  const handleSensitivityChange = (organism, index, value) => {
    const updatedValues = { ...groupedData };
    updatedValues[organism][index].Sensitivetype = value;
    setculturevalue(Object.values(updatedValues).flat());
  };

  const handleCaptureValueChange = (organism, index, value) => {
    const updatedValues = { ...groupedData };
    updatedValues[organism][index].Antibiotic_Value = value;
    setculturevalue(Object.values(updatedValues).flat());
  };


  const handleColonyCountChange = (organism, value) => {
    const updatedValues = culturevalue.map((item) =>
      item.Oraganism === organism ? { ...item, ColonyCount: value } : item
    );

    console.log("updatedValues", updatedValues);
    setculturevalue(updatedValues);
  };
  const handleDeleteOrganism = (organism) => {
    const deletedOrganism = culturevalue.filter((item) => item.Oraganism === organism);
    setDeletedItems((prev) => [...prev, ...deletedOrganism]);

    console.log("deletedOrganism", deletedOrganism);
    const updatedCulture = culturevalue.filter((item) => item.Oraganism !== organism);
    setculturevalue(updatedCulture);
  };

  const handleDeleteAntibiotic = (cultureId) => {

    console.log("deletedAntibiotic", cultureId);
    const updatedValues = culturevalue.filter((item) => item.Culture_Id !== cultureId);
    const deletedAntibiotic = culturevalue.find((item) => item.Culture_Id === cultureId);

    if (deletedAntibiotic?.Culture_Id && !String(deletedAntibiotic.Culture_Id).startsWith("new-")) {
      setDeletedItems((prev) => [...prev, deletedAntibiotic]);
    }

    setculturevalue(updatedValues);
  };



  useEffect(() => {
    if (showPrint) {
      // console.log("---------------showPrint---------", showPrint);
      setemailsent(true);
    } else {
      setemailsent(false);
    }
  }, [showPrint]);

  const handleCheckboxChange = (e) => {
    setemailsent(e.target.value === "yes");
  };
  const formatHeading = (format) => {
    const formatMap = {
      histopathologySecondOpinion: "Histopathology (Second Opinion)",
      peripheralSmear: "PeripheralSmear (PS)",
      lbc: "LBC",
      biopsy: "Biopsy",
      fnac: "FNAC",
      pathologyReport: "Pathology Report",
    };



    return formatMap[format] || format; // Fallback to original format if not found
  };

  const handleBioChange = (testCode, invoice, field, value) => {
    setEditBioData((prev) => ({
      ...prev,
      [`${testCode}_${invoice}`]: {
        ...(prev[`${testCode}_${invoice}`] || {}),
        [field]: value,
      },
    }));
  };


  useEffect(() => {
    console.log("updatedOrganisms",)

    if (editMode) {
      axios
        .get(
          `${urllink}Masters/getantibioticbyorganism?organismname=${newEntry.newOrganism}`
        )
        .then((response) => {
          setallantibiotic(response.data)
          console.log(response)
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        })
    }

  }, [urllink, newEntry.newOrganism, editMode])


  useEffect(() => {
    if (editMode) {
      axios
        .get(
          `${urllink}Masters/getorganismdetails`
        )
        .then((response) => {
          setOrganismdetails(response.data)
          console.log(response)
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        })
    }

  }, [urllink, editMode])



  useEffect(() => {
    axios
      .get(
        `${urllink}Lab/get_for_preview_examinations_dispatch?Visitid=${capturedatas?.Visit_Id}&patientid=${capturedatas.Patient_Id}&Billinginvoice=${capturedatas?.Billing_Invoice}`
      )
      .then((response) => {
        // console.log(response, "1234567890");

        const groupsData = response.data;

        const reportsData = groupsData.map((group) => {
          return {
            method: group.Method,
            Department: group.Department,
            groupName: group.Group_Name,
            createdby: group.CreatedBy,
            Collected: group.Updated_At?.AnalyseInvestigationResult,
            Received: group.Updated_At?.AnalyseInvestigationSenior,
            Reported: group.Updated_At?.Approve_Test_Pathologist,
            Tests: group.Tests.map((test) => ({
              Test_Name: test.Test_Name || "",
              Method_Name: test.Method_Name || "",
              Department: test.Department || "",
              Sample: test.Specimen || "",
              Content: test.EditContent || "",
              Samplepicture: test.Samplepic
                ? `data:image/jpeg;base64,${test.Samplepic}`
                : null,
            })),
          };
        });

        setsumma1(reportsData);
      })
      .catch((error) => {
        console.error(
          "Error fetching data:",
          error.response || error.message || error
        );
      });
  }, [capturedatas, urllink, editmicrodata]);

  const autoResizeTextarea = (e) => {
    e.target.style.height = "auto"; // Reset the height to auto
    e.target.style.height = `${e.target.scrollHeight}px`; // Set it to the scroll height
  };

  useEffect(() => {
    axios
      .get(
        `${urllink}Lab/getMicro_and_HistoNumber?Invoice=${capturedatas?.Billing_Invoice}`
      )
      .then((res) => {
        // console.log(res);
        setmicroandhistonumber(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [urllink, capturedatas]);

  useEffect(() => {
    axios
      .get(
        `${urllink}Lab/get_for_dispatch_report_status?invoice=${capturedatas?.Billing_Invoice}`
      )
      .then((response) => {
        setdispatch(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

    if (capturedatas) {
      const barval = `${urllink}Lab/get_report?inv=${capturedatas?.Barcode}`;
      axios
        .get(`${urllink}Lab/get_qrcode_image?qrValue=${barval}`)
        .then((res) => {
          const datass = res.data.qrImage;
          setpatinetbillingQr(datass);
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [urllink, capturedatas, trues]);

  // const innerHeightOfPDF = getInnerHeightOfPDF();

  const getAllUniqueOrganisms = (groups) => {
    const organismSet = new Set();

    if (Array.isArray(groups)) {
      groups.forEach((group) => {
        if (group.testdetails && Array.isArray(group.testdetails)) {
          group.testdetails.forEach((test) => {
            if (test.OrganismDetails && Array.isArray(test.OrganismDetails)) {
              test.OrganismDetails.forEach((orgDetail) => {
                Object.keys(orgDetail).forEach((organism) => {
                  organismSet.add(organism);
                });
              });
            }
          });
        }
      });
    }

    return Array.from(organismSet);
  };

  const getSensitivityColor = (sensitivetype) => {
    switch (sensitivetype) {
      case "Sensitive":
        return "green";
      case "Intermediate":
        return "blue";
      case "Resistant":
        return "red";
      default:
        return "black";
    }
  };

  const uniqueOrganisms = getAllUniqueOrganisms(summa);

  const getAlphabetHeaders = (length) => {
    const alphabets = [];
    for (let i = 0; i < length; i++) {
      alphabets.push(String.fromCharCode(65 + i));
    }
    return alphabets;
  };

  const alphabetHeaders = getAlphabetHeaders(uniqueOrganisms.length);

  // console.log("summa", summa);
  // const uniqueOrganisms = [...new Set(summa[0]?.Sensitive.map(item => item.oraganism))];
  // console.log("uniqueOrganisms", uniqueOrganisms);

  // console.log(show);


  // console.log("--------Data-------", capturedatas);

  const fetchData = () => {
    axios
      .get(
        `${urllink}Lab/getdataforreport?Visitid=${capturedatas?.Visit_Id}&patientid=${capturedatas?.Patient_Id}&Billinginvoice=${capturedatas?.Billing_Invoice}`
      )
      .then((response) => {
        const groupsData = response.data;
        console.log("groupsData", groupsData);




        // Get the department codes as an array
        const allowedDepartments = userRecord?.Lab_DepartmentName || [];

        const decodedData = groupsData.map((item) => {
          if (item.EditContent) {
            try {
              // Decode the edited_content using atob
              const decodedContent = atob(item.EditContent);
              console.log("Decoded content for item:", item, decodedContent);
              return { ...item, EditContent: decodedContent };
            } catch (error) {
              console.error("Error decoding edited_content for item:", item, error);
              return item; // Return the item unchanged if decoding fails
            }
          }
          return item; // Return the item unchanged if no edited_content
        });

        const isCovidTestPresent = summa?.some(
          (item) =>
            item?.testdetails?.some((test) => test?.Test_Code === "LTC1116")
        ) ?? false;



        // Filter groupsData to include only allowed departments
        const filteredData = decodedData.filter((item) =>
          allowedDepartments.includes(item.department)
        );
        console.log("Filtered Data:", filteredData);

        let doctorIdFromTests = null;

        for (const group of filteredData) {
          for (const test of group.testdetails || []) {
            // If it's a Packagegroup
            if (test.Packagegroup?.length > 0) {
              for (const pkg of test.Packagegroup) {
                for (const innerTest of pkg.testdetails || []) {
                  if (innerTest.DoctorID) {
                    doctorIdFromTests = innerTest.DoctorID;
                    break;
                  }
                }
                if (doctorIdFromTests) break;
              }
            } else {
              // Individual test
              if (test.DoctorID) {
                doctorIdFromTests = test.DoctorID;
                break;
              }
            }
          }
          if (doctorIdFromTests) break;
        }


        console.log("Doctor ID from tests:", doctorIdFromTests);

        // Set the filtered data to summa state
        setsumma(filteredData);
        setemailsent(isCovidTestPresent);
        setDocid(doctorIdFromTests);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  useEffect(() => {
    fetchData();
  }, [capturedatas, urllink, userRecord?.Lab_Department, editMode]);

  const [PdfBlob, setPdfBlob] = useState(null);
  // console.log(PdfBlob);
  useEffect(() => {
    if (Object.keys(capturedatas).length === 0) {
      navigate("/Home/Lab");
    }
  }, [capturedatas, navigate]);

  const handleeditchange = (e) => {
    const { name, value } = e.target;

    // Extract the field name and Test_Code from the input name
    // For example, "reportstatus-TC001" -> field: "reportstatus", testCode: "TC001"
    const [field, testCode] = name.split("-");

    if (!testCode) {
      console.error("Test_Code not found in input name:", name);
      return;
    }

    seteditmicrodata((prevData) => ({
      ...prevData,
      [field]: {
        ...prevData[field],
        [testCode]: value,
      },
    }));
  };





  useEffect(() => {
    console.log("SignPerson", docid);
    if (docid) {
      axios
        .get(`${urllink}Lab/get_doctor_forlab?doctor_id=${docid}`)
        .then((response) => {
          console.log("SignPerson", response);

          setSignperson(response.data);


        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [docid]);



  useEffect(() => {
    axios
      .get(`${urllink}Masters/Hospital_Detials_link`)
      .then((res) => {
        const ress = res.data;
        // console.log("hospitalllll", ress);
        setClinicDetials((prev) => ({
          ...prev,
          ClinicName: ress.hospitalName,
          ClinicLogo: ress.hospitalLogo,
        }));
      })
      .catch((e) => console.log(e));
    // axios
    //   .get(`${urllink}usercontrol/getClinic?location=${userRecord?.location}`)
    //   .then((response) => {
    //     const data = response.data[0];
    //     if (data) {
    //       setClinicDetials((prev) => ({
    //         ...prev,
    //         ClinicAddress: data.doorNo + "," + data.area + "," + data.street,
    //         ClinicGST: data.gstno,
    //         ClinicCity: data.city,
    //         ClinicState: data.state,
    //         ClinicCode: data.pincode,
    //         ClinicMobileNo: data.phoneNo,
    //         ClinicLandLineNo: data.landline,
    //         ClinicMailID: data.email,
    //       }));
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    // axios
    //   .get(`${urllink}usercontrol/getAccountsetting`)
    //   .then((response) => {
    //     const data = response.data;
    //     console.log(data, "uiiieueeieiei");
    //     if (data) {
    //       setClinicDetials((prev) => ({
    //         ...prev,
    //         ClinicName: data.clinicName,
    //         ClinicLogo: `data:image/png;base64,${data.clinicLogo}`,
    //       }));
    //     }
    //   })
    //   .catch((error) => {
    //     console.log(error);
    //   });
    axios
      .get(
        `${urllink}Lab/get_billing_patient_barcode?Patientid=${capturedatas?.Patient_Id}&Patientname=${capturedatas.Patient_Name}`
      )
      .then((response) => {
        // console.log(response);
        setpatinetbillingbarcode(response.data.Patient_Barcode);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [capturedatas, urllink]);

  const handlebeforereprint = () => {
    // setselectedId(capturedatas?.Billing_Invoice);
    setOpenDialog(true);
  };

  const handleupdatesencitivity = () => {
    const postdata = {
      ...culturevalue,
      invoice: capturedatas?.Billing_Invoice,
      visitid: capturedatas?.Visit_Id,
    };
    // console.log("postdata", postdata);
    axios
      .post(`${urllink}Lab/culture_sencitivity_type_update`, postdata)
      .then((response) => {
        // console.log(response);
        // setEditMode(!editMode);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formatMethodName = (methodName) => {
    if (!methodName) return ""; // Handle empty or undefined method names
    return (
      methodName.charAt(0).toUpperCase() + methodName.slice(1).toLowerCase()
    );
  };






  const fetchTemplateData = useCallback(
    (data) => {
      const histopathologyTestCode = summa
        .filter(
          (item) =>
            item.department === "HISTOPATHOLOGY" ||
            item.department === "HEMATOLOGY"
        )
        .flatMap((item) => item.testdetails.map((test) => test.Test_Code))[0];

      // console.log("Test Code for HISTOPATHOLOGY:", histopathologyTestCode);

      if (histopathologyTestCode) {
        axios
          .get(
            `${urllink}Lab/Get_Template?Billing_Invoice=${capturedatas.Billing_Invoice}&patient_id=${capturedatas?.Patient_Id}&visitid=${capturedatas?.Visit_Id}&Test_Code=${histopathologyTestCode}`
          )
          .then((res) => {
            // console.log(res);
            // Assuming res.data.format contains the format array
            setFormatData(res.data.format);
          })
          .catch((err) => {
            console.error(err);
          });
      }
    },
    [urllink, summa, capturedatas, setFormatData]
  );

  useEffect(() => {
    fetchTemplateData();
  }, [fetchTemplateData]);

  const [imagePreview, setImagePreview] = useState(null);

  // console.log(summa1, "uhjfijfiijfijfiijfijfofoifoofjifji");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPatientdetails((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleOnCloseEditor = () => {
    setEditorVisible(false);

  }

  const handleViewClick = (editContent, testCode, billingInvoice) => {

    setHistocontent(atob(editContent));

    setCurrentParams({
      testCode,
      billingInvoice
    });
    setLoading(false);
    setError(null);
    setEditorVisible(true);
  };


  const handleHistoSave = () => {

    const currentContent = editorRef.current?.getContent?.();

    if (!currentContent) {
      setError("Content is empty or editor not loaded.");
      return;
    }

    axios
      .post(`${urllink}Lab/update_senior_edit_content`, {
        content: currentContent,
        testcode: currentParams.testCode,
        billinginvoice: currentParams.billingInvoice,
      })
      .then((response) => {
        console.log("Content saved successfully:", response.data);
        setEditorVisible(false);
        setError(null); // clear error
        setCurrentParams({});
        setEditMode(false)
        fetchData()
      })
      .catch((error) => {
        console.error("Error saving content:", error);
        setError("Failed to save content. Please try again.");
      });
  };

  const handleUpdate = () => {
    // console.log("Current formatData:", formatData);
    // console.log("Current editmicrodata:", editmicrodata);
    // console.log("Current editBioData:", editBioData);

    const isHistoOrHema = summa.some(
      (p) =>
        p.department === "HISTOPATHOLOGY" ||
        (p.department === "HEMATOLOGY" &&
          p.testdetails.some((test) => test.Test_Code === "RD0098"))
    );

    const isMicroWithOt = summa.some(
      (department) =>
        department.department === "MICROBIOLOGY" &&
        department.testdetails.some((test) => test.Report_Type === "Ot")
    );

    const isMicroNotOt = summa.some(
      (department) =>
        department.department === "MICROBIOLOGY" &&
        department.testdetails.some((test) => test.Report_Type !== "Ot")
    );

    const isOtherDepartment = summa.some(
      (department) =>
        department.department !== "MICROBIOLOGY" &&
        department.department !== "HISTOPATHOLOGY"
    );

    if (!editMode) {
      setEditMode(true);

      if (isMicroWithOt) {
        setopenmodels(true);

        const microbiologyContent = summa
          .filter((p) => p.department === "MICROBIOLOGY")
          .flatMap((item) => item.testdetails.map((test) => test.Content))[0];

        setContent(microbiologyContent);
      }
      return;
    }

    // //  HISTOPATHOLOGY or HEMATOLOGY
    // if (isHistoOrHema && editMode) {
    //   const formData1 = new FormData();
    //   const histoTestCode = summa
    //     .filter(
    //       (item) =>
    //         item.department === "HISTOPATHOLOGY" ||
    //         item.department === "HEMATOLOGY"
    //     )
    //     .flatMap((item) => item.testdetails.map((test) => test.Test_Code))[0];

    //   if (!histoTestCode) {
    //     alert("Cannot update: Test code missing.");
    //     return;
    //   }

    //   formData1.append("Billing_Invoice", capturedatas.Billing_Invoice);
    //   formData1.append("Visit_Id", capturedatas.Visit_Id);
    //   formData1.append("Patient_Id", capturedatas.Patient_Id);

    //   formatData.forEach((item) => {
    //     if (item.name === "imageData" && item.value instanceof File) {
    //       formData1.append(`${histoTestCode}_imageData`, item.value);
    //     } else if (item.format) {
    //       formData1.append(`${histoTestCode}_format`, item.format);
    //     } else if (item.name !== "format") {
    //       formData1.append(`${histoTestCode}_${item.name}`, item.value || "");
    //     }
    //   });

    //   axios
    //     .post(`${urllink}Lab/insert_Histo_Template`, formData1, {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     })
    //     .then((response) => {
    //       alert("Histo/Hema data updated successfully!");
    //       setEditMode(false);
    //     })
    //     .catch((error) => {
    //       console.error("Histo/Hema update failed:", error);
    //     });
    // }

    //  MICROBIOLOGY (Ot and Not Ot)
    if ((isMicroWithOt || isMicroNotOt) && editMode) {
      const microDepartments = summa.filter(
        (item) => item.department === "MICROBIOLOGY"
      );

      const updatePromises = microDepartments.flatMap((department) =>
        department.testdetails.map((testDetail) => {
          const microTestCode = testDetail.Test_Code;
          const key = microTestCode;

          const postdata = {
            notes: editmicrodata.notes[microTestCode] || testDetail.Notes || "",
            reportstatus:
              editmicrodata.reportstatus[microTestCode] ||
              testDetail.Report_Status ||
              "Final Report",
            microscopy:
              editmicrodata.microscopy[microTestCode] ||
              testDetail.Microscopy_Data ||
              "",
            macroscopy: editmicrodata.macroscopy[microTestCode] ||
              testDetail.macroscopy ||
              "",
            site: editmicrodata.site[microTestCode] ||
              testDetail.site ||
              "",
            culturereport:
              editmicrodata.culturereport[microTestCode] ||
              testDetail.Culture_Report ||
              "",
            bacteriaisolated:
              editmicrodata.bacteriaisolated[microTestCode] ||
              testDetail.Bacteria_Isolated ||
              "",
            Sample:
              editmicrodata.Sample[microTestCode] ||
              testDetail.Sample_Specimen ||
              "",
            patientname: capturedatas.Patient_Name,
            patient_Id: capturedatas.Patient_Id,
            Visit_Id: capturedatas.Visit_Id,
            invoice: capturedatas.Billing_Invoice,
            testcode: microTestCode,
            culturevalues: culturevalue,
            deletedItems: deletedItems,
            content:
              testDetail.Report_Type === "Ot"
                ? content
                : testDetail.Content || "",
          };

          return axios
            .post(`${urllink}Lab/update_microafter_flow_completed`, postdata)
            .then((response) => {
              // console.log(
              //   `Microbiology update successful for ${microTestCode}`
              // );
              return { success: true, testCode: microTestCode };
            })
            .catch((error) => {
              console.error(
                `Microbiology update failed for ${microTestCode}`,
                error
              );
              return { success: false, testCode: microTestCode, error };
            });
        })
      );

      Promise.all(updatePromises)
        .then((results) => {
          const allSuccessful = results.every((r) => r.success);
          if (allSuccessful) {
            alert("All Microbiology data updated successfully!");
          } else {
            alert("Some Microbiology updates failed. Check console.");
          }

          setEditMode(false);
          if (isMicroWithOt) setopenmodels(false);
          seteditmicrodata({
            notes: {},
            reportstatus: {},
            microscopy: {},
            culturereport: {},
            bacteriaisolated: {},
            Sample: {},
            macroscopy: {},
            site: {},
          });
        })
        .catch((err) => {
          console.error("Error updating Microbiology:", err);
        });
    }

    if (editMode && isOtherDepartment) {
      alert("Updating other departments...");
      const otherDepartments = summa.filter(
        (item) =>
          item.department !== "MICROBIOLOGY" &&
          item.department !== "HISTOPATHOLOGY"
      );

      otherDepartments.forEach((dept) => {
        dept.testdetails.forEach((test) => {
          const testCode = test.Test_Code;
          const invoice = test.Billing_Invoice;
          const key = `${testCode}_${invoice}`;
          const updated = editBioData[key];

          if (updated) {
            const mergedData = { ...test, ...updated };
            const postData = {
              invoice: mergedData.Billing_Invoice,
              testcode: mergedData.Test_Code,
              Capture_Value: mergedData.Capture_Value,
              ReferenceRange: mergedData.ReferenceRange,
              Method_Name: mergedData.Method_Name,
              UOM: mergedData.UOM,
              Patient_Id: capturedatas.Patient_Id,
              Visit_Id: capturedatas.Visit_Id,
            };

            // console.log("Post Data for Biochemistry", postData);

            axios
              .post(`${urllink}Lab/update_biochemistry`, postData)
              .then((res) => {
                // console.log("Biochemistry updated:", res.data);
              })
              .catch((err) => {
                console.error("Biochemistry update failed:", err);
              });
          }
        });
      });

      setEditMode(false);
    }



    if (
      editMode &&
      !isHistoOrHema &&
      !isMicroWithOt &&
      !isMicroNotOt &&
      !isOtherDepartment
    ) {
      // console.log("No valid department in edit mode to update.");
      setEditMode(false);
    }
  };



  useEffect(() => {
    if (editMode) {
      formatData.forEach((item) => {
        const div = editableRef.current[item.name];
        if (div && div.innerHTML.trim() === "") {
          div.innerHTML = (item.value || "").trim();
        }
      });
    }
  }, [editMode, formatData]);



  const parseReferenceData = (referenceData) => {
    if (!referenceData || referenceData === "-") return [];
    return referenceData
      .split(/,|\n/)
      .map((item) => {
        let label,
          minValue = null,
          maxValue = null,
          value = null;

        // Check if it's a range (e.g., "70-140")
        if (item.includes(":")) {
          [label, value] = item.split(":").map((str) => str.trim());
        } else {
          label = "Unknown";
          value = item.trim();
        }

        if (value.includes("-")) {
          [minValue, maxValue] = value
            .split("-")
            .map((str) => parseFloat(str.trim()));
        } else if (value.includes(">=") || value.includes(">")) {
          minValue = parseFloat(value.replace(">=", "").replace(">", ""));
          maxValue = Infinity;
        } else if (value.includes("<=") || value.includes("<")) {
          minValue = -Infinity;
          maxValue = parseFloat(value.replace("<=", "").replace("<", ""));
        }

        return { label, minValue, maxValue };
      })
      .filter((range) => range.label);
  };

  // const hasAbnormalValues = summa?.some((group) =>
  //   group.testdetails.some((test) => {
  //     const CaptureValue = parseFloat(test.Capture_Value);
  //     const ranges = parseReferenceData(test.ReferenceRange);

  //     return ranges.some(
  //       (range) =>
  //         !isNaN(CaptureValue) &&
  //         ((range.minValue !== null && CaptureValue < range.minValue) ||
  //           (range.maxValue !== null && CaptureValue > range.maxValue))
  //     );
  //   })
  // );

  const getStatus = (captureValue, referenceRange) => {
    let valueStyle = {};
    let panicLevel = null;

    if (!referenceRange || referenceRange === "-") {
      return { valueStyle, panicLevel };
    }

    const ranges = parseReferenceData(referenceRange);
    const numericValue = parseFloat(captureValue);

    if (isNaN(numericValue)) {
      return { valueStyle, panicLevel };
    }

    let isNormal = false;
    let isAbnormal = false;

    for (let ref of ranges) {
      if (ref.minValue !== null && ref.maxValue !== null) {
        if (numericValue >= ref.minValue && numericValue <= ref.maxValue) {
          isNormal = true;
        } else {
          isAbnormal = true;
        }
      }
    }

    if (isAbnormal && !isNormal) {
      valueStyle = { fontWeight: "bold", fontSize: "15px", color: "Black" };
      panicLevel = (
        <span className="indicator">
          <TiArrowUpThick />
        </span>
      );
    }

    return { valueStyle, panicLevel };
  };


  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () => {
      setshow(true);
    },
    onAfterPrint: async () => {
      setshow(false);
    },
  });

  const printStylesA4 = `
  @page {
    size: A4 !important;
    border: 1px solid black !important;
  }
`;


  // const handleSave = async () => {
  //   const element = componentRef.current;
  //   if (!element) {
  //     console.error("No element to capture");
  //     return;
  //   }

  //   try {
  //     // Select header, body, and footer elements
  //     const headerElement = element.querySelector(".print_header");
  //     const bodyElement = element.querySelector(".print-page3");
  //     const footerElement = element.querySelector(".print_footerr");

  //     if (!headerElement || !bodyElement || !footerElement) {
  //       console.error("Header, body, or footer element not found");
  //       return;
  //     }

  //     // Initialize jsPDF
  //     const pdf = new jsPDF({
  //       orientation: "portrait",
  //       unit: "px",
  //       format: "a4",
  //     });

  //     const pdfWidth = pdf.internal.pageSize.getWidth();
  //     const pdfHeight = pdf.internal.pageSize.getHeight();
  //     const margin = 20; // Adjust margin as needed
  //     const maxContentHeight = pdfHeight - margin * 2 - 100; // Reserve space for header and footer

  //     // Capture header and footer as images
  //     const headerCanvas = await html2canvas(headerElement, { scale: 2 });
  //     const footerCanvas = await html2canvas(footerElement, { scale: 2 });
  //     const headerImg = headerCanvas.toDataURL("image/png");
  //     const footerImg = footerCanvas.toDataURL("image/png");

  //     const headerHeight = (headerCanvas.height * pdfWidth) / headerCanvas.width;
  //     const footerHeight = (footerCanvas.height * pdfWidth) / footerCanvas.width;

  //     // Capture body content
  //     const bodyCanvas = await html2canvas(bodyElement, { scale: 2 });
  //     const bodyImg = bodyCanvas.toDataURL("image/png");
  //     const bodyImgProps = pdf.getImageProperties(bodyImg);
  //     const bodyImgWidth = pdfWidth - margin * 2;
  //     const bodyImgHeight = (bodyImgProps.height * bodyImgWidth) / bodyImgProps.width;

  //     let heightLeft = bodyImgHeight;
  //     let position = margin + headerHeight; // Start after header
  //     let pageNumber = 1;

  //     // Add first page
  //     pdf.addImage(headerImg, "PNG", margin, margin, pdfWidth - margin * 2, headerHeight);
  //     pdf.addImage(
  //       bodyImg,
  //       "PNG",
  //       margin,
  //       position,
  //       bodyImgWidth,
  //       Math.min(heightLeft, maxContentHeight)
  //     );
  //     pdf.addImage(
  //       footerImg,
  //       "PNG",
  //       margin,
  //       pdfHeight - footerHeight - margin,
  //       pdfWidth - margin * 2,
  //       footerHeight
  //     );
  //     heightLeft -= maxContentHeight;

  //     // Add additional pages if needed
  //     while (heightLeft > 0) {
  //       pdf.addPage();
  //       pageNumber++;
  //       position = margin + headerHeight; // Reset position for new page

  //       // Add header to new page
  //       pdf.addImage(headerImg, "PNG", margin, margin, pdfWidth - margin * 2, headerHeight);

  //       // Add body content for the current page
  //       pdf.addImage(
  //         bodyImg,
  //         "PNG",
  //         margin,
  //         position,
  //         bodyImgWidth,
  //         Math.min(heightLeft, maxContentHeight),
  //         0,
  //         -position + margin + (pageNumber - 1) * maxContentHeight // Adjust for pagination
  //       );

  //       // Add footer to new page
  //       pdf.addImage(
  //         footerImg,
  //         "PNG",
  //         margin,
  //         pdfHeight - footerHeight - margin,
  //         pdfWidth - margin * 2,
  //         footerHeight
  //       );

  //       heightLeft -= maxContentHeight;
  //     }

  //     // Save PDF to backend
  //     const generatedPdfBlob = pdf.output("blob");
  //     setPdfBlob(generatedPdfBlob);

  //     const formdata = new FormData();
  //     const postdata = {
  //       patientname: capturedatas.Patient_Name,
  //       patient_Id: capturedatas.Patient_Id,
  //       Visit_Id: capturedatas.Visit_Id,
  //       refering_doc: capturedatas.Refering_Doctor,
  //       invoice: capturedatas.Billing_Invoice,
  //       patinetbillingbarcode: patinetbillingbarcode,
  //       samplecode: capturedatas.Barcode,
  //       location: userRecord?.location,
  //       createdby: userRecord?.username,
  //     };

  //     for (const key in postdata) {
  //       if (postdata.hasOwnProperty(key)) {
  //         formdata.append(key, postdata[key]);
  //       }
  //     }

  //     formdata.append("report", generatedPdfBlob);

  //     try {
  //       const response = await axios.post(
  //         `${urllink}Phelobotomist/insert_reort_table`,
  //         formdata,
  //         { headers: { "Content-Type": "multipart/form-data" } }
  //       );
  //       settrues(!trues);
  //     } catch (error) {
  //       console.error("Error saving the report:", error);
  //     }

  //     // Conditional external update for "RMC"
  //     if (capturedatas.Refering_Hospital === "RMC") {
  //       try {
  //         const response = await axios.post(
  //           `${urllink}Phelobotomist/update_report_for_external_request`,
  //           formdata,
  //           { headers: { "Content-Type": "multipart/form-data" } }
  //         );
  //         settrues(!trues);
  //       } catch (error) {
  //         console.error("Error updating external request:", error);
  //       }
  //     }

  //     // Save the PDF file locally
  //     pdf.save(`${capturedatas.Patient_Name}_labReport.pdf`);
  //   } catch (error) {
  //     console.error("Error generating PDF or during the process:", error);
  //   }
  // };

  const [loader, setloader] = useState(false);

  const handleDownloadPDF = async () => {
    setemailsent(true);

    const printData = componentRef.current;

    if (!printData) {
      console.error("Unable to get the target element");
      return;
    }

    setshow(true);

    try {
      const contentWidth = printData.offsetWidth;
      const contentHeight = printData.offsetHeight;
      // const pdfWidth = contentWidth + 2 * 5;
      // const pdfHeight = contentHeight + 2 * 5;

      const a4WidthPx = 794; // A4 width in pixels
      const a4HeightPx = 1123; // A4 height in pixels

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "px",
        format: [a4WidthPx, a4HeightPx],
      });

      const marginX = (a4WidthPx - contentWidth) / 2;
      const marginY = (a4HeightPx - contentHeight) / 2;

      pdf.html(printData, {
        x: marginX > 0 ? marginX : 5,
        y: marginY > 0 ? marginY : 5,
        callback: async () => {
          const generatedPdfBlob = pdf.output("blob");
          setPdfBlob(generatedPdfBlob);

          const formData = new FormData();
          const postData = {
            patientname: capturedatas.Patient_Name,
            Patient_Id: capturedatas.Patient_Id,
          };

          for (const key in postData) {
            if (postData.hasOwnProperty(key)) {
              formData.append(key, postData[key]);
            }
          }

          formData.append("report", generatedPdfBlob);
          setloader(true);
          try {
            const response = await axios.post(
              `${urllink}Phelobotomist/sendEmail`,
              formData,
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            setemailsent(false);
            setPdfBlob(null);
            setloader(false);
            // console.log(response);
          } catch (error) {
            console.error(error);
          } finally {
            setshow(false);
          }
        },
      });
    } catch (error) {
      console.error("Error generating PDF:", error);
      setshow(false);
    }
  };

  const uploadAdapter = (loader) => {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          loader.file.then((file) => {
            const reader = new FileReader();

            reader.onloadend = () => {
              // Convert image file to base64
              const base64String = reader.result.split(",")[1];
              resolve({ default: `data:${file.type};base64,${base64String}` });
            };

            reader.onerror = (error) => {
              reject(error);
            };

            reader.readAsDataURL(file);
          });
        });
      },
    };
  };

  function uploadPlugin(editor) {
    editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  const formatName = (name) => {
    return name
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // const loadImage = (src) => {
  //   return new Promise((resolve, reject) => {
  //     const img = new Image();
  //     img.onload = () => resolve(img);
  //     img.onerror = reject;
  //     img.src = src;
  //   });
  // };

  // const appendImageToContainer = (container, image) => {
  //   container.innerHTML = ""; // Clear previous content
  //   container.appendChild(image);
  // };

  // const PdfViewer = ({ pdfBlob }) => {
  //   // Check if pdfBlob is a Blob object
  //   if (pdfBlob instanceof Blob) {
  //     // Convert Blob object to data URL
  //     const url = URL.createObjectURL(pdfBlob);

  //     // Render the PDF using iframe
  //     return (
  //       <iframe
  //         title="PDF Viewer"
  //         src={url}
  //         style={{
  //           width: "100%",
  //           height: "435px",
  //           border: "1px solid rgba(0, 0, 0, 0.5)", // Black border with reduced opacity
  //         }}
  //       />
  //     );
  //   }

  //   // If pdfBlob is not a Blob object, assume it's already a valid data URL and render it directly
  //   return (
  //     <img
  //       src={pdfBlob}
  //       alt="Concern Form"
  //       style={{
  //         width: "100%",
  //         height: "100%",
  //         marginTop: "20px",
  //       }}
  //     />
  //   );
  // };

  // function getInnerHeightOfPDF() {
  //   const pdfget = new jsPDF({
  //     orientation: "portrait", // or 'landscape'
  //     unit: "px", // pixels
  //     format: [595, 842], // A4 size in pixels (width, height)
  //   });
  //   const innerHeightInPoints = pdfget.internal.pageSize.getHeight();
  //   pdfget.deletePage();
  //   const innerHeightInPixels = innerHeightInPoints * (1 / 72) * 96;
  //   return innerHeightInPixels - 10;
  // }

  const handleContentEditableInputChange = (e, name) => {
    const div = editableRef.current[name];
    let updatedContent = div.innerHTML.trim();

    // Remove unintended <br> or extra spaces
    updatedContent = updatedContent
      .replace(/<br\s*\/?>/g, "")
      .replace(/\s+/g, " ");

    // Update formatData
    setFormatData((prev) =>
      prev.map((item) =>
        item.name === name ? { ...item, value: updatedContent } : item
      )
    );
  };

  const handleMouseUp = (name) => {
    setTimeout(() => {
      // Ensure the state updates correctly after selection
      const selection = window.getSelection();
      if (selection && selection.toString().trim() !== "") {
        setSelectedField(name);
        setSelectedText(selection.toString().trim());
        // console.log(
        //   `Selected text for ${name}: "${selection.toString().trim()}"`
        // );
      }
    }, 10);
  };




  const makeTextBold = () => {
    if (!selectedText || !selectedField) return;

    const updatedData = [...formatData];
    const itemIndex = updatedData.findIndex((p) => p.name === selectedField);

    if (itemIndex !== -1) {
      const value = updatedData[itemIndex].value;

      // Escape special characters in the selected text for regex
      const escapedText = selectedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // Replace selected text with bolded text
      const boldedValue = value.replace(
        new RegExp(`(${escapedText})`, "g"),
        `<b>$1</b>`
      );

      updatedData[itemIndex] = {
        ...updatedData[itemIndex],
        value: boldedValue,
      };

      setFormatData(updatedData);

      // Manually update the contentEditable div
      if (editableRef.current[selectedField]) {
        editableRef.current[selectedField].innerHTML = boldedValue;
      }
    }
  };

  const makeTextNormal = () => {
    if (!selectedText || !selectedField) return;

    const updatedData = [...formatData];
    const itemIndex = updatedData.findIndex((p) => p.name === selectedField);

    if (itemIndex !== -1) {
      let value = updatedData[itemIndex].value;

      // Escape special characters in the selected text for regex
      const escapedText = selectedText.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

      // Create a regex to find the selected text wrapped in <b> tags
      const regex = new RegExp(`<b>${escapedText}</b>`, "g");

      // Replace the bold text with normal text
      const updatedValue = value.replace(regex, selectedText);

      // Update formatData state
      updatedData[itemIndex] = {
        ...updatedData[itemIndex],
        value: updatedValue,
      };

      setFormatData(updatedData);

      // Manually update the contentEditable div
      if (editableRef.current[selectedField]) {
        editableRef.current[selectedField].innerHTML = updatedValue;
      }
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const previewUrl = URL.createObjectURL(file); // Create a preview URL

      setImagePreview(previewUrl); // Set the preview URL for immediate display

      // Update the `formatData` array
      setFormatData((prev) =>
        prev?.map(
          (field) =>
            field.name === "imageData"
              ? { ...field, value: file } // Store the actual file in `value`
              : field // Keep other fields unchanged
        )
      );
    }
  };

  console.log("-----Final-----", summa)



  console.log("------Loop-------", summa)


  return (
    <>
      {loader ? (
        <>
          <div class="loader"></div>
        </>
      ) : (
        <div>
          <TableComponent
            ref={componentRef}
            patinetbillingbarcode={patinetbillingbarcode}
            patinetbillingQr={patinetbillingQr}
            capturedatas={capturedatas}
            report={report}
            summa={summa}
            userRecord={userRecord}
            navigate={navigate}
            ClinicDetials={ClinicDetials}
            urllink={urllink}
            uniqueOrganisms={uniqueOrganisms}
            getSensitivityColor={getSensitivityColor}
            alphabetHeaders={alphabetHeaders}
            // index = {index}
            summa1={summa1}
            formatData={formatData}
            emailsent={emailsent}
            SignPerson={SignPerson}
            printpapaer={printpapaer}
            isNoRendered={isNoRendered}
            formatHeading={formatHeading}
            microandhistonumber={microandhistonumber}
            editMode={editMode}
            setEditMode={setEditMode}
            autoResizeTextarea={autoResizeTextarea}
            handleeditchange={handleeditchange}
            openmodels={openmodels}
            setFormatData={setFormatData}
            formatMethodName={formatMethodName}
            // otreporttype = {otreporttype}
            setopenmodels={setopenmodels}
            contentRef={contentRef}
            uploadPlugin={uploadPlugin}
            isSidebarOpen={isSidebarOpen}
            content={content}
            setContent={setContent}
            editmicrodata={editmicrodata}
            formatName={formatName}
            touppercasefun={touppercasefun}
            setSelectedText={setSelectedText}
            setSelectedField={setSelectedField}
            handleContentEditableInputChange={handleContentEditableInputChange}
            showmodel={showmodel}
            setshowmodel={setshowmodel}
            groupedData={groupedData}

            handleupdatesencitivity={handleupdatesencitivity}
            handleSensitivityChange={handleSensitivityChange}
            imagePreview={imagePreview}
            handleImageChange={handleImageChange}
            getStatus={getStatus}
            // hasAbnormalValues={hasAbnormalValues}
            handleMouseUp={handleMouseUp}
            editableRef={editableRef}
            handleBioChange={handleBioChange}
            editBioData={editBioData}
            handleInputChange={handleInputChange}
            patientdetails={patientdetails}
            newEntry={newEntry}
            handlecultureChange={handlecultureChange}
            deletedItems={deletedItems}
            microscopyname={microscopyname}
            organismdetails={organismdetails}
            antibioticorg={antibioticorg}
            handleAddAntibiotic={handleAddAntibiotic}
            handleDeleteOrganism={handleDeleteOrganism}
            handleDeleteAntibiotic={handleDeleteAntibiotic}
            handleCaptureValueChange={handleCaptureValueChange}
            handleColonyCountChange={handleColonyCountChange}
            handleViewClick={handleViewClick}


          />

          <br />
          {/* {console.log(showPrint, "-------------------")}
          {!showPrint && (
            <>
              <div className="sdcyysc_uxcds67">
                <label>
                  <h3 style={{ color: "black" }}>
                    Do you want Header and Footer?
                  </h3>
                </label>
                <div className="dhchche_oici8">
                  <h3>
                    {" "}
                    <label>
                      <input
                        type="checkbox"
                        name="headerFooterOption"
                        value="yes"
                        checked={emailsent === true}
                        onChange={handleCheckboxChange}
                      />
                      Yes
                    </label>
                  </h3>
                  <h3>
                    <label>
                      <input
                        type="checkbox"
                        name="headerFooterOption"
                        value="no"
                        checked={emailsent === false}
                        onChange={handleCheckboxChange}
                      />
                      No
                    </label>
                  </h3>
                </div>
              </div>
              <br />

              <div className="Register_btn_con">
                {summa?.some(
                  (p) =>
                    p.department === "HISTOPATHOLOGY" ||
                    (p.department === "HEMATOLOGY" &&
                      p.testdetails.some(
                        (test) => test.Test_Code === "RD0098"
                      )) ||
                    summa?.some(
                      (department) => department.department === "MICROBIOLOGY"
                    ) ||
                    summa?.some(
                      (department) =>
                        department.department !== "MICROBIOLOGY" &&
                        department.department !== "HISTOPATHOLOGY"
                    )
                ) && (
                    <>

                      {userRecord.Edit && (
                        <button
                          className="RegisterForm_1_btns Rhugt_report"
                          onClick={handleUpdate}
                        >
                          {editMode ? "Update" : "Edit"}
                        </button>
                      )}


                      
                    </>
                  )}

                <button
                  onClick={handleSave} // Save button for saving the PDF
                  className="RegisterForm_1_btns Rhugt_report"
                >
                  Save
                </button>

                <button
                  onClick={
                    Dispatch === "Dispatched"
                      ? handlebeforereprint
                      : handlePrint
                  }
                  className="RegisterForm_1_btns  Rhugt_report"
                >
                  {Dispatch === "Dispatched" ? "Reprint" : "Print"}
                </button>

                <div>
                  {summa?.length > 0 && (
                    <div className="Register_btn_con">
                      <button
                        onClick={handleDownloadPDF}
                        className="RegisterForm_1_btns  Rhugt_report"
                      >
                        Send Email
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </>
          )} */}

          {/* )}
              content={() => componentRef.current}
            /> */}

          <CancelAppointmentDialog
            open={openDialog}
            onClose={() => setOpenDialog(false)}
            setCancelReason={setCancelReason}
            cancelReason={cancelReason}
          />
        </div>
      )}


      <Modal
        title="Edit Document"
        open={editorVisible}
        onCancel={handleOnCloseEditor}
        footer={null}
        width={900}
        style={{ top: 20 }}
        destroyOnClose={false}
      >
        {loading ? (
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: 300 }}>
            <Spin size="large" />
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", color: "red" }}>
            <p>{error}</p>
            <Button onClick={handleOnCloseEditor}>Close</Button>
          </div>
        ) : (
          <JoditRichEditor
            ref={editorRef}
            initialContent={histocontent}
            onChange={(newContent) => setEditorContent(newContent)}
          />


        )}

        <div style={{ textAlign: 'right', marginTop: 10 }}>
          <Button
            type="primary"
            onClick={handleHistoSave}
            style={{ marginRight: 8 }}
          >
            Save
          </Button>
        </div>
      </Modal>
    </>
  );
}
export default ReportDocview;

