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
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";


const JoditRichEditor = forwardRef(({ initialContent = "", onChange, onSave, testDetails, reportData, urllink,Radiology_CompleteId }, ref) => {
  const editorRef = useRef(null);
  const [internalContent, setInternalContent] = useState(initialContent);
  const dispatchvalue = useDispatch();

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
    uploader: {
      insertImageAsBase64URI: true,
    },
    preserveWhiteSpace: true,
    beautifyHTML: false,
    toolbarAdaptive: false,
    indentMargin: 20,
    cleanHTML: {
      fillEmptyParagraph: false,
      removeEmptyElements: false,
      removeSpans: false,
      removeStyleAttributes: false,
      removeCommentsOnPaste: false,
      replaceNBSP: false,
    },
    editorCssClass: "jodit-document",
    style: {
      fontFamily: "Tahoma, Arial, sans-serif",
      fontSize: "11pt",
      lineHeight: "1.5",
      width: "100%",
      boxSizing: "border-box",
    },
    width: "100%",
    maxWidth: "100%",
    minWidth: "100%",
    padding: "10px",
    defaultMode: "wysiwyg",
    enter: "p",
    enterBlock: "p",
    defaultTag: "p",
    iframe: true,
    iframeStyle: `
      body { font-family: Tahoma, Arial, sans-serif; font-size: 11pt; line-height: 1.5; margin: 10pt; }
      table { border-collapse: collapse; width: 100%; margin: 10pt 0; border: 1px solid black; }
      td, th { border: 1px solid black; padding: 5pt; }
      p { margin: 0 0 5pt; }
    `,
    colors: {
      greyscale: [
        "#000000",
        "#434343",
        "#666666",
        "#999999",
        "#B7B7B7",
        "#CCCCCC",
        "#D9D9D9",
        "#EFEFEF",
        "#F3F3F3",
        "#FFFFFF",
      ],
      palette: [
        "#980000",
        "#FF0000",
        "#FF9900",
        "#FFFF00",
        "#00F0F0",
        "#00FFFF",
        "#4A86E8",
        "#0000FF",
        "#9900FF",
        "#FF00FF",
      ],
      standardColors: [
        "#E6B8AF",
        "#F4CCCC",
        "#FCE5CD",
        "#FFF2CC",
        "#D9EAD3",
        "#D0E0E3",
        "#C9DAF8",
        "#CFE2F3",
        "#D9D2E9",
        "#EAD1DC",
      ],
    },
    controls: {
      font: {
        list: {
          Tahoma: "Tahoma",
          Arial: "Arial",
          "Times New Roman": "Times New Roman",
          Calibri: "Calibri",
        },
      },
      fontsize: {
        list: [
          "8pt",
          "9pt",
          "10pt",
          "11pt",
          "12pt",
          "14pt",
          "16pt",
          "18pt",
          "24pt",
          "36pt",
        ],
      },
      paragraph: {
        list: {
          p: "Normal",
          h1: "Heading 1",
          h2: "Heading 2",
          h3: "Heading 3",
          div: "Division",
          pre: "Preformatted",
        },
      },
      list: {
        list: {
          default: "Default",
          disc: "•",
          circle: "○",
          square: "■",
          decimal: "1,2,3...",
          "lower-alpha": "a,b,c...",
          "upper-alpha": "A,B,C...",
          "lower-roman": "i,ii,iii...",
          "upper-roman": "I,II,III...",
        },
      },
      lineSpacing: {
        name: "lineSpacing",
        tooltip: "Line Spacing",
        list: {
          1: "1",
          1.15: "1.15",
          1.25: "1.25",
          1.5: "1.5",
          2: "2",
          2.5: "2.5",
          3: "3",
        },
        // exec: (editor, current, { control }) => {
        //     const value = control.args ? control.args[0] : "1.5";
        //     const selection = editor.selection;
        //     if (!selection || !selection.range) return;
        //     const range = selection.range;

        //     const blockTags = /^(P|LI|DIV|TD|TH|H1|H2|H3|H4|H5|H6)$/;
        //     const getBlockAncestor = (el) => {
        //         let node =
        //             el && el.nodeType === Node.ELEMENT_NODE ? el : el?.parentElement;
        //         while (
        //             node &&
        //             node.nodeType === Node.ELEMENT_NODE &&
        //             !blockTags.test(node.tagName)
        //         ) {
        //             node = node.parentElement;
        //         }
        //         return node || null;
        //     };

        //     const applyLineHeight = (node) => {
        //         if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
        //         node.style.lineHeight = value;
        //     };

        //     if (range.collapsed) {
        //         const block = getBlockAncestor(range.startContainer);
        //         if (block) applyLineHeight(block);
        //         return;
        //     }

        //     const root =
        //         range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        //             ? range.commonAncestorContainer
        //             : range.commonAncestorContainer.parentElement;
        //     const candidates = root.querySelectorAll(
        //         "p, li, div, td, th, h1, h2, h3, h4, h5, h6"
        //     );
        //     candidates.forEach((el) => applyLineHeight(el));
        // },


        exec: (editor, current, { control }) => {
          const value = control.args ? control.args[0] : "1.5";
          const selection = editor.selection;
          if (!selection || !selection.range) return;
          const range = selection.range;

          const blockTags = /^(P|LI|DIV|TD|TH|H1|H2|H3|H4|H5|H6)$/;
          const getBlockAncestor = (el) => {
            let node =
              el && el.nodeType === Node.ELEMENT_NODE ? el : el?.parentElement;
            while (
              node &&
              node.nodeType === Node.ELEMENT_NODE &&
              !blockTags.test(node.tagName)
            ) {
              node = node.parentElement;
            }
            return node || null;
          };

          const applyLineHeight = (node) => {
            if (!node || node.nodeType !== Node.ELEMENT_NODE) return;
            node.style.lineHeight = value;
          };

          if (range.collapsed) {
            // cursor only → apply to current block
            const block = getBlockAncestor(range.startContainer);
            if (block) applyLineHeight(block);
            return;
          }

          // iterate only nodes inside selection
          const walker = editor.editorDocument.createTreeWalker(
            range.commonAncestorContainer,
            NodeFilter.SHOW_ELEMENT,
            {
              acceptNode: (node) => (blockTags.test(node.tagName) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP),
            }
          );

          let node;
          while ((node = walker.nextNode())) {
            if (range.intersectsNode(node)) {
              applyLineHeight(node);
            }
          }
        },
        isActive: (editor, control) => {
          try {
            const selection = editor.selection;
            if (!selection) return false;
            const current = selection.current ? selection.current() : null;
            if (!current) return false;

            let node = current.nodeType === Node.ELEMENT_NODE ? current : current.parentElement;
            const blockTags = /^(P|LI|DIV|TD|TH|H1|H2|H3|H4|H5|H6)$/;
            while (node && node.nodeType === Node.ELEMENT_NODE && !blockTags.test(node.tagName)) {
              node = node.parentElement;
            }
            if (!node) return false;

            const style = (node.getAttribute && node.getAttribute("style")) || "";
            const match = style.match(/line-height\s*:\s*([^;]+)/i);
            if (!match) return false;
            const currentValue = match[1].trim();
            const target = control.args && control.args[0] ? String(control.args[0]) : "1.5";

            if (currentValue.endsWith("px")) {
              const computed = window.getComputedStyle(node);
              const fontSize = parseFloat(computed.fontSize);
              const px = parseFloat(currentValue);
              if (!isNaN(fontSize) && fontSize > 0) {
                return Math.abs(px / fontSize - parseFloat(target)) < 0.1;
              }
            }
            return currentValue === target || Math.abs(parseFloat(currentValue) - parseFloat(target)) < 0.1;
          } catch (e) {
            return false;
          }
        },

      },
    },
    buttons: [
      "source",
      "|",
      "font",
      "fontsize",
      "|",
      "bold",
      "italic",
      "underline",
      "strikethrough",
      "|",
      "superscript",
      "subscript",
      "|",
      "ul",
      "ol",
      "|",
      "outdent",
      "indent",
      "|",
      "left",
      "center",
      "right",
      "justify",
      "|",
      "table",
      "link",
      "image",
      "video",
      "|",
      "forecolor",
      "backcolor",
      "|",
      "undo",
      "redo",
      "|",
      "fullsize",
      "print",
      "|",
      "lineSpacing",
    ],
    history: {
      timeout: 1000,
      maxHistoryLength: 100,
    },
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
              editorRef.current?.editor.selection.insertImage(
                base64,
                null,
                file.name
              );
            }
          };
          reader.readAsDataURL(file);
        }
        return false;
      },
      afterInit: function (editor) {
        editorRef.current = { editor };

        const editorElement =
          editor.editor || editor.container.querySelector(".jodit-wysiwyg");
        if (editorElement) {
          editorElement.addEventListener(
            "keydown",
            (e) => {
              // Handle Tab
              if (e.key === "Tab") {
                e.preventDefault();
                try {
                  editor.selection.insertHTML("&nbsp;&nbsp;&nbsp;&nbsp;");
                } catch {
                  document.execCommand("insertText", false, "    ");
                }
              }

              // Handle Space after underline
              if (e.key === " " || e.code === "Space") {
                const selection = editor.selection;
                if (selection && selection.isCollapsed()) {
                  const range = selection.range;
                  const currentNode = range.endContainer;
                  let parentElement =
                    currentNode.nodeType === Node.TEXT_NODE
                      ? currentNode.parentElement
                      : currentNode;

                  if (
                    parentElement &&
                    (parentElement.tagName === "U" ||
                      parentElement.style.textDecoration === "underline" ||
                      parentElement.style.textDecorationLine === "underline")
                  ) {
                    const textContent = currentNode.textContent || "";
                    if (range.endOffset === textContent.length) {
                      e.preventDefault();
                      const spaceNode = editor.createInside.text(" ");
                      const afterUnderline = parentElement.parentNode;
                      if (afterUnderline) {
                        afterUnderline.insertBefore(
                          spaceNode,
                          parentElement.nextSibling
                        );
                        const newRange = editor.editorDocument.createRange();
                        newRange.setStartAfter(spaceNode);
                        newRange.collapse(true);
                        selection.selectRange(newRange);
                      }
                    }
                  }
                }
              }
            },
            true
          );
        }
      },
    },
  };

  const handleSave = () => {
    const current = editorRef.current?.editor?.value || editorRef.current?.value || initialContent;
    // if (onSave) {
      // onSave(current);
      console.log(current)
      // dispatchvalue({ type: "RadHTML", value: current });

      const submitData = {
        ...testDetails,
        ...reportData,
        HTMLCont: current,
        createdBy: '',
        completeId: Radiology_CompleteId,
      }
      axios.post(`${urllink}Radiology/Radiology_Complete_Details_Link`, submitData)
        .then((res) => {
          const responsedata = res.data;
          let typp = Object.keys(responsedata)[0];
          let mess = Object.values(responsedata)[0];
          const tdata = {
            message: mess,
            type: typp,
          };
          // dispatchvalue({ type: "setActiveFolder", value: "PatientList" });
          dispatchvalue({ type: "toast", value: tdata });
        })
        .catch((err) => {
          console.error(err);
        });

    // }
  };

  return (
    <div>
      <JoditEditor
        ref={editorRef}
        value={internalContent}
        config={config}
        onBlur={(newContent) => {
          setInternalContent(newContent);
          if (onChange) onChange(newContent);
        }}
      />
      <button onClick={(newContent)=>handleSave(newContent)} className="btn btn-primary mt-2">
        Save
      </button>
    </div>
  );
});

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
    getReprot()

  }


  const dispatchvalue = useDispatch();




  const urllink = useSelector((state) => state.userRecord?.UrlLink);

  const componentRef = useRef();
  // const capturedatas = useSelector((state) => state.userRecord?.Samplecapture);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [content, setContent] = useState("");
  const [useHeader, setUseHeader] = useState(true);
  const test = useSelector((state) => state.userRecord?.RadData);
  const [capturedatas, setCapturedatas] = useState({})
  const toast = useSelector((state) => state.userRecord?.toast);


  const getReprot = useCallback(() => {
    if(test?.Radiology_RequestId){
    axios.get(`${urllink}Radiology/Get_Data_For_Dispatch?completedId=${test?.Radiology_RequestId}`)
      .then((res) => {
        const data = res.data;
        setCapturedatas(data[0])
        
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });

    }
  }, [urllink, test?.Radiology_RequestId, editorContent])

  useEffect(()=>{
    getReprot();
  },[getReprot])

  
    const handleOpenPDF = (base64PDF) => {
        if (!base64PDF) {
            alert("No report available.");
            return;
        }

        // Remove prefix if exists
        let actualBase64 = base64PDF;
        if (actualBase64.startsWith("data:application/pdf;base64,")) {
            actualBase64 = actualBase64.split(",")[1];
        }

        // Convert base64 -> binary
        const byteCharacters = atob(actualBase64);
        const byteNumbers = Array.from(byteCharacters, (char) =>
            char.charCodeAt(0)
        );
        const byteArray = new Uint8Array(byteNumbers);

        // Create blob and open
        const blob = new Blob([byteArray], { type: "application/pdf" });
        const blobURL = URL.createObjectURL(blob);
        const pdfWindow = window.open(blobURL);
        if (!pdfWindow) {
            alert("Popup blocked. Please allow popups for this site.");
        }
    };



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
  const handleBack = ()=>{
  dispatchvalue({ type: "setActiveFolder", value: "PatientList" });

  }

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
     <ToastAlert Message={toast.message} Type={toast.type} />


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
            Print
          </button>
          <button onClick={handleBack} className="RegisterForm_1_btns Rhugt_report">
            Back
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
            testDetails={test}
            urllink={urllink}
            Radiology_CompleteId={capturedatas?.Radiology_CompleteId}
          />
        </>
        {/* )} */}
      </Modal>

    </>
  );
};

export default Retro;







