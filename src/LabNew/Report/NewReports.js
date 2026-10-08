import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import "./Report.css";
import axios from "axios";
import { useSelector } from "react-redux";
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
import KMCHlogo from "../../Assets/KMCHlogo.png";
import sdalogo from "../../Assets/sdalogo.jpeg";
import isologo from "../../Assets/isologo.jpeg";
import nabhl_logo from "../../Assets/nabhl_logo.png";

import JoditEditor from "jodit-react";
import { Modal, Button, message, Spin } from "antd";

import ReportRenderer from "./components/ReportRenderer";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

  // const config = {
  //   readonly: false,
  //   height: 500,
  //   useTabForNext: false,
  //   allowTabChar: true,
  //   uploader: {
  //     insertImageAsBase64URI: true,
  //   },
  //   preserveWhiteSpace: true,
  //   cleanHTML: {
  //     fillEmptyParagraph: false,
  //     removeEmptyElements: false,
  //   },
  //   showSourceButton: true,
  //   editorCssClass: "jodit-document",
  //   style: {
  //     fontFamily: "Arial, sans-serif",
  //     whiteSpace: "pre-wrap",
  //     lineHeight: "1.5",
  //   },
  //   extraAllowedContent:
  //     "p(*),ul(*),ol(*),li(*),strong(*),em(*),pre(*),h1(*),h2(*),h3(*)",
  //   buttons: [
  //     "bold",
  //     "italic",
  //     "underline",
  //     "link",
  //     "source",
  //     "|",
  //     "ul",
  //     "ol",
  //     "image",
  //     "video",
  //     "|",
  //     "undo",
  //     "redo",
  //     "|",
  //     "hr",
  //     "formatBlock",
  //     "align",
  //     "about",
  //   ],
  //   events: {
  //     beforeFileUpload: (files) => {
  //       for (let file of files) {
  //         const reader = new FileReader();
  //         reader.onload = function (e) {
  //           const base64 = e.target.result;
  //           if (file.type.startsWith("video/")) {
  //             const videoHTML = `
  //               <video controls style="max-width:100%">
  //                 <source src="${base64}" type="${file.type}">
  //                 Your browser does not support the video tag.
  //               </video>`;
  //             editorRef.current?.editor.selection.insertHTML(videoHTML);
  //           } else {
  //             editorRef.current?.editor.selection.insertImage(base64);
  //           }
  //         };
  //         reader.readAsDataURL(file);
  //       }
  //       return false;
  //     },
  //     afterInit: function (editor) {
  //       // Store reference for other methods
  //       editorRef.current = { editor };

  //       // Set up keydown handler on the editor element
  //       const editorElement =
  //         editor.editor || editor.container.querySelector(".jodit-wysiwyg");
  //       if (editorElement) {
  //         editorElement.addEventListener(
  //           "keydown",
  //           (e) => {
  //             // Handle Tab key
  //             if (e.key === "Tab") {
  //               e.preventDefault();
  //               e.stopPropagation();

  //               try {
  //                 // Method 1: Try insertHTML with non-breaking spaces
  //                 if (editor.selection && editor.selection.insertHTML) {
  //                   editor.selection.insertHTML("&nbsp;&nbsp;&nbsp;&nbsp;");
  //                   return;
  //                 }

  //                 // Method 2: Try execCommand
  //                 if (editor.execCommand) {
  //                   editor.execCommand(
  //                     "insertHTML",
  //                     false,
  //                     "&nbsp;&nbsp;&nbsp;&nbsp;"
  //                   );
  //                   return;
  //                 }

  //                 // Method 3: Direct text insertion
  //                 if (editor.selection && editor.selection.insertNode) {
  //                   const textNode = editor.createInside.text("    "); // 4 spaces
  //                   editor.selection.insertNode(textNode, false);
  //                   return;
  //                 }

  //                 // Method 4: Focus and use document.execCommand as last resort
  //                 if (editor.editor && editor.editor.focus) {
  //                   editor.editor.focus();
  //                   document.execCommand("insertText", false, "    ");
  //                 }
  //               } catch (error) {
  //                 console.log("Tab insertion error:", error);
  //                 // Fallback: try basic document.execCommand
  //                 try {
  //                   document.execCommand("insertText", false, "    ");
  //                 } catch (fallbackError) {
  //                   console.log(
  //                     "Fallback tab insertion failed:",
  //                     fallbackError
  //                   );
  //                 }
  //               }
  //             }

  //             // Handle Space key to prevent formatting inheritance
  //             if (e.key === " " || e.code === "Space") {
  //               // Check if cursor is at the end of formatted text
  //               const selection = editor.selection;
  //               if (selection && selection.isCollapsed()) {
  //                 const range = selection.range;
  //                 const currentNode = range.endContainer;

  //                 // Check if we're at the end of an underlined element
  //                 let parentElement =
  //                   currentNode.nodeType === Node.TEXT_NODE
  //                     ? currentNode.parentElement
  //                     : currentNode;

  //                 if (
  //                   parentElement &&
  //                   (parentElement.tagName === "U" ||
  //                     parentElement.style.textDecoration === "underline" ||
  //                     parentElement.style.textDecorationLine === "underline")
  //                 ) {
  //                   // Check if cursor is at the very end of the underlined text
  //                   const textContent = currentNode.textContent || "";
  //                   const cursorPos = range.endOffset;

  //                   if (cursorPos === textContent.length) {
  //                     e.preventDefault();

  //                     // Insert space without formatting
  //                     const spaceNode = editor.createInside.text(" ");

  //                     // Move cursor after the underlined element
  //                     const afterUnderline = parentElement.parentNode;
  //                     if (afterUnderline) {
  //                       afterUnderline.insertBefore(
  //                         spaceNode,
  //                         parentElement.nextSibling
  //                       );

  //                       // Set cursor after the space
  //                       const newRange = editor.editorDocument.createRange();
  //                       newRange.setStartAfter(spaceNode);
  //                       newRange.collapse(true);
  //                       selection.selectRange(newRange);
  //                     }
  //                   }
  //                 }
  //               }
  //             }
  //           },
  //           true
  //         ); // Use capture phase
  //       }
  //     },
  //   },
  // };

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

function Reports() {
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
  console.log("jhdahjadjadjjajhsdjhsd", capturedatas);
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
    ColonyCount: "",
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

const [isDoc,setIsDoc] = useState(false)
  useEffect(()=>{
    const Access = userRecord?.AccessTwo.split(',');
    if (Access.includes('L12-4')){
      setIsDoc(true)
    }else{
      setIsDoc(false)
    }
  },[userRecord?.AccessTwo])


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
    const { newOrganism, Antibiotic, Sensitivity, Value, ColonyCount } =
      newEntry;
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
      ColonyCount:
        existingOrganism.length > 0
          ? existingOrganism[0].ColonyCount
          : ColonyCount, // Use existing colony count if organism exists
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
      ColonyCount: "",
    });
  };

  useEffect(() => {
    const isCovidReport = summa?.some(
      (dpt) =>
        dpt.department === "MICROBIOLOGY" &&
        dpt.testdetails?.some((p) => p.Test_Code === "LTC1116")
    );

    if (isCovidReport) {
      setemailsent(true);
    }
  }, [summa]);



  const handleSensitivityChange = (organism, index, value) => {
    const updatedValues = { ...groupedData };
    updatedValues[organism][index].Sensitivetype = value;
    setculturevalue(Object.values(updatedValues).flat());
  };

  const handleCaptureValueChange = (organism, index, field, value) => {
    const updatedValues = { ...groupedData };

    // Safely update the specific field
    if (updatedValues[organism] && updatedValues[organism][index]) {
      updatedValues[organism][index][field] = value;
      setculturevalue(Object.values(updatedValues).flat());
    }
  };

  const handleColonyCountChange = (organism, value) => {
    const updatedValues = culturevalue.map((item) =>
      item.Oraganism === organism ? { ...item, ColonyCount: value } : item
    );

    console.log("updatedValues", updatedValues);
    setculturevalue(updatedValues);
  };
  const handleDeleteOrganism = (organism) => {
    const deletedOrganism = culturevalue.filter(
      (item) => item.Oraganism === organism
    );
    setDeletedItems((prev) => [...prev, ...deletedOrganism]);

    console.log("deletedOrganism", deletedOrganism);
    const updatedCulture = culturevalue.filter(
      (item) => item.Oraganism !== organism
    );
    setculturevalue(updatedCulture);
  };

  const handleDeleteAntibiotic = (cultureId) => {
    console.log("deletedAntibiotic", cultureId);
    const updatedValues = culturevalue.filter(
      (item) => item.Culture_Id !== cultureId
    );
    const deletedAntibiotic = culturevalue.find(
      (item) => item.Culture_Id === cultureId
    );

    if (
      deletedAntibiotic?.Culture_Id &&
      !String(deletedAntibiotic.Culture_Id).startsWith("new-")
    ) {
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
    console.log("updatedOrganisms");

    if (editMode) {
      axios
        .get(
          `${urllink}Masters/getantibioticbyorganism?organismname=${newEntry.newOrganism}`
        )
        .then((response) => {
          setallantibiotic(response.data);
          console.log(response);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    }
  }, [urllink, newEntry.newOrganism, editMode]);

  useEffect(() => {
    if (editMode) {
      axios
        .get(`${urllink}Masters/getorganismdetails`)
        .then((response) => {
          setOrganismdetails(response.data);
          console.log(response);
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        });
    }
  }, [urllink, editMode]);

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

  const [dispatch, setDispatch] = useState(false)
  useEffect(() => {

    const Access = userRecord?.AccessTwo.split(',');
    if (Access.includes("L12-5")) {
      setDispatch(true)
    }
  }, [userRecord?.AccessTwo])

  const fetchData = () => {
    axios
      .get(
        `${urllink}Lab/getdataforreport?Visitid=${capturedatas?.Visit_Id}&patientid=${capturedatas?.Patient_Id}&Billinginvoice=${capturedatas?.Billing_Invoice}&Filter=${capturedatas.AllTest}`
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
              console.error(
                "Error decoding edited_content for item:",
                item,
                error
              );
              return item; // Return the item unchanged if decoding fails
            }
          }
          return item; // Return the item unchanged if no edited_content
        });

        const isCovidTestPresent =
          summa?.some((item) =>
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


        // const updatedReportData = filteredData
        //   .map((item) => {
        //     let allTests = [];

        //     item.testdetails.forEach((test) => {
        //       if (test.Test_Code) {
        //         // Format 1: direct test
        //         allTests.push(test);
        //       } else if (test.Packagegroup) {
        //         // Format 2: nested package groups
        //         test.Packagegroup.forEach((pkg) => {
        //           if (Array.isArray(pkg.testdetails)) {
        //             allTests.push(...pkg.testdetails);
        //           }
        //         });
        //       }
        //     });

        //     // Filter only the needed tests
        //     const filteredTests = allTests.filter((t) =>
        //       capturedatas.AllTest.includes(t.Test_Code)
        //     );

        //     return {
        //       ...item,
        //       testdetails: filteredTests,
        //     };
        //   })
        //   .filter((item) => item.testdetails.length > 0);

        const updatedReportData = filteredData
          .map((item) => {
            let allTests = [];

            item.testdetails.forEach((test) => {
              if (test.Test_Code) {
                // Format 1: direct test
                allTests.push(test);
              } else if (test.Packagegroup) {
                // Format 2: nested package groups
                test.Packagegroup.forEach((pkg) => {
                  if (Array.isArray(pkg.testdetails)) {
                    allTests.push(...pkg.testdetails);
                  }
                });
              }
            });

            // ✅ Guard against undefined capturedatas or AllTest
            const allowedTests = Array.isArray(capturedatas?.AllTest)
              ? capturedatas.AllTest
              : [];

            const filteredTests = allTests.filter((t) =>
              allowedTests.includes(t.Test_Code)
            );

            return {
              ...item,
              testdetails: filteredTests,
            };
          })
          .filter((item) => item.testdetails.length > 0);


        setsumma(filteredData);
        setemailsent(isCovidTestPresent);
        setDocid(doctorIdFromTests);
        console.log("All Set");

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
    let labTech, srTech, srRTech;
    {
      summa?.map((dpt, undex) => {
        labTech =
          dpt.testdetails?.[0]?.Packagegroup?.[0]?.testdetails?.[0]
            ?.tech ??
          dpt.testdetails?.[0]?.tech ??
          "";

        srTech =
          dpt.testdetails?.[0]?.Packagegroup?.[0]?.testdetails?.[0]?.sr_tech ??
          dpt.testdetails?.[0]?.sr_tech ??
          "";

        srRTech =
          dpt.testdetails?.[0]?.Packagegroup?.[0]
            ?.testdetails?.[0]?.sr_tech ??
          dpt.testdetails?.[0]?.sr_tech ??
          "";

      })
    }

    console.log("-------------------", labTech, srTech, srRTech);

    if (docid) {
      axios
        .get(`${urllink}Lab/get_doctor_forlab?doctor_id=${docid}&tech=${labTech}&sr_tech=${srTech}`)
        .then((response) => {
          console.log("SignPerson", response);

          setSignperson(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    }
  }, [docid, summa]);

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
            item.department === "HISTOPATHOLOGY" || item.Test_Code === "LTC1193"
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
  };

  const handleViewClick = (editContent, testCode, billingInvoice) => {
    setHistocontent(atob(editContent));

    setCurrentParams({
      testCode,
      billingInvoice,
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
        setEditMode(false);
        fetchData();
      })
      .catch((error) => {
        console.error("Error saving content:", error);
        setError("Failed to save content. Please try again.");
      });
  };

  const handleback = () => {
    console.log("Come back INDIAN");
    navigate("/Home/Nurse")
  }

  // const handleUpdate = () => {
  //   // console.log("Current formatData:", formatData);
  //   // console.log("Current editmicrodata:", editmicrodata);
  //   // console.log("Current editBioData:", editBioData);
  //   let isHistoOrHema, isMicroWithOt, isMicroNotOt, isOtherDepartment;
  //   const Access = userRecord.AccessTwo.split(',');

  //   setEditMode(true);
  //   if (Access.includes("L12-4")) {
  //     isHistoOrHema = summa.some(
  //       (p) =>
  //         p.department === "HISTOPATHOLOGY" ||
  //         (p.department === "HEMATOLOGY" &&
  //           p.testdetails.some((test) => test.Test_Code === "LTC1193"))
  //     );

  //     isMicroWithOt = summa.some(
  //       (department) =>
  //         department.department === "MICROBIOLOGY" &&
  //         department.testdetails.some((test) => test.Report_Type === "Ot")
  //     );

  //     isMicroNotOt = summa.some(
  //       (department) =>
  //         department.department === "MICROBIOLOGY" &&
  //         department.testdetails.some((test) => test.Report_Type !== "Ot")
  //     );

  //     isOtherDepartment = summa.some(
  //       (department) =>
  //         department.department !== "MICROBIOLOGY" &&
  //         department.department !== "HISTOPATHOLOGY"
  //     );

  //     if (!editMode) {
  //       setEditMode(true);

  //       if (isMicroWithOt) {
  //         setopenmodels(true);

  //         const microbiologyContent = summa
  //           .filter((p) => p.department === "MICROBIOLOGY")
  //           .flatMap((item) => item.testdetails.map((test) => test.Content))[0];

  //         setContent(microbiologyContent);
  //       }
  //       return;
  //     }

  //     // //  HISTOPATHOLOGY or HEMATOLOGY
  //     // if (isHistoOrHema && editMode) {
  //     //   const formData1 = new FormData();
  //     //   const histoTestCode = summa
  //     //     .filter(
  //     //       (item) =>
  //     //         item.department === "HISTOPATHOLOGY" ||
  //     //         item.department === "HEMATOLOGY"
  //     //     )
  //     //     .flatMap((item) => item.testdetails.map((test) => test.Test_Code))[0];

  //     //   if (!histoTestCode) {
  //     //     alert("Cannot update: Test code missing.");
  //     //     return;
  //     //   }

  //     //   formData1.append("Billing_Invoice", capturedatas.Billing_Invoice);
  //     //   formData1.append("Visit_Id", capturedatas.Visit_Id);
  //     //   formData1.append("Patient_Id", capturedatas.Patient_Id);

  //     //   formatData.forEach((item) => {
  //     //     if (item.name === "imageData" && item.value instanceof File) {
  //     //       formData1.append(`${histoTestCode}_imageData`, item.value);
  //     //     } else if (item.format) {
  //     //       formData1.append(`${histoTestCode}_format`, item.format);
  //     //     } else if (item.name !== "format") {
  //     //       formData1.append(`${histoTestCode}_${item.name}`, item.value || "");
  //     //     }
  //     //   });

  //     //   axios
  //     //     .post(`${urllink}Lab/insert_Histo_Template`, formData1, {
  //     //       headers: {
  //     //         "Content-Type": "multipart/form-data",
  //     //       },
  //     //     })
  //     //     .then((response) => {
  //     //       alert("Histo/Hema data updated successfully!");
  //     //       setEditMode(false);
  //     //     })
  //     //     .catch((error) => {
  //     //       console.error("Histo/Hema update failed:", error);
  //     //     });
  //     // }

  //     //  MICROBIOLOGY (Ot and Not Ot)
  //     if ((isMicroWithOt || isMicroNotOt) && editMode) {
  //       const microDepartments = summa.filter(
  //         (item) => item.department === "MICROBIOLOGY"
  //       );

  //       const updatePromises = microDepartments.flatMap((department) =>
  //         department.testdetails.map((testDetail) => {
  //           const microTestCode = testDetail.Test_Code;
  //           const key = microTestCode;

  //           const postdata = {
  //             notes: editmicrodata.notes[microTestCode] || testDetail.Notes || "",
  //             reportstatus:
  //               editmicrodata.reportstatus[microTestCode] ||
  //               testDetail.Report_Status ||
  //               "Final Report",
  //             microscopy:
  //               editmicrodata.microscopy[microTestCode] ||
  //               testDetail.Microscopy_Data ||
  //               "",
  //             macroscopy:
  //               editmicrodata.macroscopy[microTestCode] ||
  //               testDetail.macroscopy ||
  //               "",
  //             site: editmicrodata.site[microTestCode] || testDetail.site || "",
  //             culturereport:
  //               editmicrodata.culturereport[microTestCode] ||
  //               testDetail.Culture_Report ||
  //               "",
  //             bacteriaisolated:
  //               editmicrodata.bacteriaisolated[microTestCode] ||
  //               testDetail.Bacteria_Isolated ||
  //               "",
  //             Sample:
  //               editmicrodata.Sample[microTestCode] ||
  //               testDetail.Sample_Specimen ||
  //               "",
  //             patientname: capturedatas.Patient_Name,
  //             patient_Id: capturedatas.Patient_Id,
  //             Visit_Id: capturedatas.Visit_Id,
  //             invoice: capturedatas.Billing_Invoice,
  //             testcode: microTestCode,
  //             culturevalues: culturevalue,
  //             deletedItems: deletedItems,
  //             content:
  //               testDetail.Report_Type === "Ot"
  //                 ? content
  //                 : testDetail.Content || "",
  //           };

  //           return axios
  //             .post(`${urllink}Lab/update_microafter_flow_completed`, postdata)
  //             .then((response) => {
  //               // console.log(
  //               //   `Microbiology update successful for ${microTestCode}`
  //               // );
  //               return { success: true, testCode: microTestCode };
  //             })
  //             .catch((error) => {
  //               console.error(
  //                 `Microbiology update failed for ${microTestCode}`,
  //                 error
  //               );
  //               return { success: false, testCode: microTestCode, error };
  //             });
  //         })
  //       );

  //       Promise.all(updatePromises)
  //         .then((results) => {
  //           const allSuccessful = results.every((r) => r.success);
  //           if (allSuccessful) {
  //             alert("All Microbiology data updated successfully!");
  //           } else {
  //             alert("Some Microbiology updates failed. Check console.");
  //           }

  //           setEditMode(false);
  //           if (isMicroWithOt) setopenmodels(false);
  //           seteditmicrodata({
  //             notes: {},
  //             reportstatus: {},
  //             microscopy: {},
  //             culturereport: {},
  //             bacteriaisolated: {},
  //             Sample: {},
  //             macroscopy: {},
  //             site: {},
  //           });
  //         })
  //         .catch((err) => {
  //           console.error("Error updating Microbiology:", err);
  //         });
  //     }

  //     if (editMode && isOtherDepartment) {
  //       alert("Updating other departments...");
  //       const otherDepartments = summa.filter(
  //         (item) =>
  //           item.department !== "MICROBIOLOGY" &&
  //           item.department !== "HISTOPATHOLOGY"
  //       );

  //       otherDepartments.forEach((dept) => {
  //         dept.testdetails.forEach((test) => {
  //           const testCode = test.Test_Code;
  //           const invoice = test.Billing_Invoice;
  //           const key = `${testCode}_${invoice}`;
  //           const updated = editBioData[key];

  //           if (updated) {
  //             const mergedData = { ...test, ...updated };
  //             const postData = {
  //               invoice: mergedData.Billing_Invoice,
  //               testcode: mergedData.Test_Code,
  //               Capture_Value: mergedData.Capture_Value,
  //               ReferenceRange: mergedData.ReferenceRange,
  //               Method_Name: mergedData.Method_Name,
  //               UOM: mergedData.UOM,
  //               Patient_Id: capturedatas.Patient_Id,
  //               Visit_Id: capturedatas.Visit_Id,
  //             };

  //             // console.log("Post Data for Biochemistry", postData);

  //             axios
  //               .post(`${urllink}Lab/update_biochemistry`, postData)
  //               .then((res) => {
  //                 // console.log("Biochemistry updated:", res.data);
  //                 fetchData();
  //               })
  //               .catch((err) => {
  //                 console.error("Biochemistry update failed:", err);
  //               });
  //           }
  //         });
  //       });

  //       setEditMode(false);
  //     }
  //   }

  //   if (
  //     editMode &&
  //     !isHistoOrHema &&
  //     !isMicroWithOt &&
  //     !isMicroNotOt &&
  //     !isOtherDepartment
  //   ) {
  //     // console.log("No valid department in edit mode to update.");
  //     setEditMode(false);
  //   }
  // };



  const handleUpdate = () => {
    // console.log("Current formatData:", formatData);
    // console.log("Current editmicrodata:", editmicrodata);
    // console.log("Current editBioData:", editBioData);

    const isHistoOrHema = summa.some(
      (p) =>
        p.department === "HISTOPATHOLOGY" ||
        (p.department === "HAEMATOLOGY" &&
          p.testdetails.some((test) => test.Test_Code === "LTC1193"))
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

    // //  HISTOPATHOLOGY or HAEMATOLOGY
    // if (isHistoOrHema && editMode) {
    //   const formData1 = new FormData();
    //   const histoTestCode = summa
    //     .filter(
    //       (item) =>
    //         item.department === "HISTOPATHOLOGY" ||
    //         item.department === "HAEMATOLOGY"
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
      console.log("Dept------------", otherDepartments);

  otherDepartments.forEach((dept) => {
  dept.testdetails.forEach((test) => {
    if (!test.Test_Code) {
      test?.Packagegroup.forEach((t) => {
        t?.testdetails.forEach((i, idx) => {
          const testCode = i.Test_Code;
          const invoice = i.Billing_Invoice;
          const key = `${testCode}_${invoice}`;

          const updated = editBioData[key];
          if (updated) {
            const mergedData = { ...i, ...updated };
            // ✅ assign back so array gets updated
            t.testdetails[idx] = mergedData;

            console.log("Updated--------", mergedData);

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

            axios
              .post(`${urllink}Lab/update_biochemistry`, postData)
              .then(() => fetchData())
              .catch((err) => console.error("Biochemistry update failed:", err));
          }
        });

        console.log("Package-------- :", t.testdetails); // ✅ now will show updated values
      });
    } else {
      const testCode = test.Test_Code;
      const invoice = test.Billing_Invoice;
      const key = `${testCode}_${invoice}`;

      const updated = editBioData[key];
      if (updated) {
        const mergedData = { ...test, ...updated };
        // ✅ directly assign into dept.testdetails if needed
        Object.assign(test, mergedData);

        console.log("Updated--------", mergedData);

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

        axios
          .post(`${urllink}Lab/update_biochemistry`, postData)
          .then(() => fetchData())
          .catch((err) => console.error("Biochemistry update failed:", err));
      }
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
    setEditMode(false);
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

  const testBold = (testName) => {
    console.log("Bold--------", testName, "--");

    const bold = ["LTC1293", "LTC0495", "LTC0328", "LTC0179"];

    if (bold.includes(testName)) {
      return { fontWeight: "bold", };
    }
    return {}; // default style
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
  
  // const handlePrint = async () => {
  //   setshow(true); // show any hidden print styles if needed

  //   const element = componentRef.current;

  //   // Capture the component as canvas
  //   const canvas = await html2canvas(element, { scale: 2 });
  //   const imgData = canvas.toDataURL("image/png");

  //   // Create a PDF.0
  //   const pdf = new jsPDF("p", "mm", "a4");
  //   const pdfWidth = pdf.internal.pageSize.getWidth();
  //   const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

  //   pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);


  //   // Save PDF (you can also send to a print job)
  //   pdf.save("document.pdf");

  //   setshow(false); // reset visibility
  // };

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

      setFormatData((prev) =>
        prev?.map((field) =>
          field.name === "imageData" ? { ...field, value: file } : field
        )
      );
    }
  };

  const hasSensitive = culturevalue.some((item) => item.Sensitive?.trim());
  const hasIntermediate = culturevalue.some((item) =>
    item.Intermediate?.trim()
  );
  const hasResistant = culturevalue.some((item) => item.Resistant?.trim());

  console.log("-----Final-----", summa);

  return (
    <>
      {loader ? (
        <>
          <div class="loader"></div>
        </>
      ) : (
        <div>
          {/* <TableComponent
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
            hasSensitive={hasSensitive}
            hasIntermediate={hasIntermediate}
            hasResistant={hasResistant}
          /> */}
          <div ref={componentRef}>
            {summa?.map((dpt, undex) => (
              <ReportRenderer
                key={undex}
                dpt={dpt}
                capturedatas={capturedatas}
                summa={summa}
                emailsent={emailsent}
                patinetbillingbarcode={patinetbillingbarcode}
                patinetbillingQr={patinetbillingQr}
                SignPerson={SignPerson}
                editMode={editMode}
                autoResizeTextarea={autoResizeTextarea}
                handleeditchange={handleeditchange}
                groupedData={groupedData}
                newEntry={newEntry}
                handlecultureChange={handlecultureChange}
                organismdetails={organismdetails}
                antibioticorg={antibioticorg}
                handleAddAntibiotic={handleAddAntibiotic}
                handleDeleteOrganism={handleDeleteOrganism}
                handleDeleteAntibiotic={handleDeleteAntibiotic}
                handleCaptureValueChange={handleCaptureValueChange}
                handleColonyCountChange={handleColonyCountChange}
                handleSensitivityChange={handleSensitivityChange}
                hasSensitive={hasSensitive}
                hasIntermediate={hasIntermediate}
                hasResistant={hasResistant}
                handleViewClick={handleViewClick}
                editBioData={editBioData}
                handleBioChange={handleBioChange}
                patientdetails={patientdetails}
                handleInputChange={handleInputChange}
                getStatus={getStatus}
                formatMethodName={formatMethodName}
                microandhistonumber={microandhistonumber}
                testBold={testBold}
                provision={false}
              />
            ))}
          </div>
          <br />
          {console.log(showPrint, "-------------------")}
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
                        (test) => test.Test_Code === "LTC1193"
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
                      {dispatch ? (userRecord.Edit && (
                        <button
                          className="RegisterForm_1_btns Rhugt_report"
                          onClick={()=>{isDoc && handleUpdate()}}
                        >
                          {editMode ? "Update" : "Edit"}
                        </button>
                      )) : <button
                        className="RegisterForm_1_btns Rhugt_report"
                        onClick={handleback}
                      >
                        Back
                      </button>}
                    </>
                  )}

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
              </div>
            </>
          )}

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
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: 300,
            }}
          >
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

        <div style={{ textAlign: "right", marginTop: 10 }}>
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
export default Reports;
