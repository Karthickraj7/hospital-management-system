import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import JoditEditor from 'jodit-react';
import { Modal, Button, message, Spin } from 'antd';
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Select, MenuItem } from '@mui/material';
// import Editor from '../../Masters/RadiologyMaster/JoditRichEditor.jsx';
import VisibilityIcon from "@mui/icons-material/Visibility";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import UploadIcon from '@mui/icons-material/Upload';




const JoditRichEditor = forwardRef(({ initialContent = "", onChange, onSave, }, ref) => {
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
        if (onSave) {
            onSave(current);
            console.log(current)
            dispatchvalue({ type: "RadHTML", value: current });

        }
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
            <button onClick={handleSave} className="btn btn-primary mt-2">
                Save
            </button>
        </div>
    );
});


// export default JoditRichEditor;

const DocTest2 = () => {
    const dispatchvalue = useDispatch();

    const [loadingEditor, setLoadingEditor] = useState(false);
    const [editorVisible, setEditorVisible] = useState(false);
    const [error, setError] = useState(null);
    const [docName, setDocName] = useState('');
    const [loading, setLoading] = useState(false);
    const [testFormats, setTestFormats] = useState({});
    const [histonumber, setHistonumber] = useState("");
    const [htmlContent, setHtmlContent] = useState("Please Select The Template");
    const [histotestcode, setHistotestcode] = useState("");
    const [testDetails, setTestDetails] = useState({})
    const [editorContent, setEditorContent] = useState("");
    const [openpreview1, setopenpreview1] = useState(false);
    const contentRef = useRef(null);
    const [content, setContent] = useState("");

    const [completeId, setCompleteId] = useState()

    const urllink = useSelector((state) => state.userRecord?.UrlLink);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
    const editorRef = useRef(null);
    const [doctorList, setDoctorList] = useState([]);
    const [documentList, setDocmentList] = useState([])

    const test = useSelector((state) => state.userRecord?.RadData);
    const HTML = useSelector((state) => state.userRecord?.RadHTML);

    console.log("content", editorContent)

    const [file, setFile] = useState(null);

    const [reportData, setReportData] = useState({
        doctorName: "",
        doctorId: "",
        documentId: "",
        documentName: "",
    })

    useEffect(() => {
        setTestDetails(test)
        if (HTML !== "") {

        }
    }, [test, HTML])
    console.log("cAPTURE-------", testDetails);

    function decodeUtf8Base64(str) {
        return decodeURIComponent(escape(window.atob(str)));
    }

    const handleInputChange = (event) => {
        const name = event.target.name;
        const Id = event.target.value;

        console.log("Input", name,)
        if (name === "doctor") {
            const doctor = doctorList.find((doc) => doc.DoctorID === Id);
            setReportData((pre) => ({
                ...pre,
                doctorId: doctor.DoctorID,
                doctorName: doctor.DoctorName
            }))
        } else if (name === "document") {
            const document = documentList.find((doc) => doc.id === Id);
            console.log("file-----", document);
            setReportData((pre) => ({
                ...pre,
                documentId: document.id,
                documentName: document.fileName,
            }))
            // const htmlContent = atob(document.html);
            // setHtmlContent(htmlContent)

        }
    }



    useEffect(() => {
        axios
            .get(`${urllink}Masters/get_Doctor_Detials_link`, {})
            .then((res) => {
                const allDoctors = res.data;

                const radiologyDoctors = allDoctors
                    .filter((doctor) => {
                        const department = (doctor.Department || "").toLowerCase();
                        return department.includes("radiology");
                    })
                    .map((doctor) => ({
                        DoctorID: doctor.id,
                        DoctorName: doctor.Name,
                    }));
                setDoctorList(radiologyDoctors);
            })
            .catch((err) => {
                console.error("Error fetching doctors:", err);
            });
    }, [urllink]);



    // useEffect(() => {
    //     axios
    //         .get(`${urllink}Radiology/Get_Report_From_Doctor?Radiologist=${reportData?.doctorId}&Department=${testDetails?.subDepartment}`)
    //         .then((res) => {
    //             console.log("API response:", res.data);
    //             // Ensure reports is an array
    //             const reportData = Array.isArray(res.data) ? res.data : [res.data];
    //             setDocmentList(reportData);
    //         })
    //         .catch((err) => {
    //             console.error("Error fetching reports:", err);
    //             const tdata = {
    //                 message: "Error fetching reports. Please try again.",
    //                 type: "error",
    //             };
    //             dispatchvalue({ type: "toast", value: tdata });
    //             setDocmentList([]);
    //         });
    // }, [urllink, reportData?.doctorId])

    console.log("Doctor-----JJJJJJJJJJJJJ---", file);

    useEffect(() => {
        if (testDetails?.Radiology_RequestId && testDetails?.TestCode) {
            axios
                .get(`${urllink}/Radiology/Documents_Edit_link/?document_id=${reportData?.documentId}&from=${"doctor"}&request=${testDetails?.Radiology_RequestId}&test=${testDetails?.TestCode}`)
                .then((response) => {
                    const data = response.data;
                    console.log("data", data);
                    let decodedHtml = "<p>No content available.</p>"
                    if (data.html) {
                        decodedHtml = decodeUtf8Base64(data.html);
                        setHtmlContent(decodedHtml);
                    }
                    console.log("HTML---------", data)
                    setReportData({
                        doctorName: data.doctor,
                        doctorId: "",
                        documentId: data.fileid,
                        documentName: data.fileName,
                    })
                    setCompleteId(data.completeId)
                    setFile(data.file)
                    setDocName(data.fileName || "Untitled Document");
                })
                .catch((error) => {
                    console.error("Error fetching document:", error);
                })
                .finally(() => {
                    setLoading(false);
                });

        }

    }, [urllink, reportData?.documentId, testDetails?.Radiology_RequestId, testDetails?.TestName])


    const handleOpenEditor = () => {
        setEditorVisible(true);
        setError(null);
    }

    const handleOnCloseEditor = () => {
        setEditorVisible(false);

    }
    function uploadPlugin(editor) {
        editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
            return uploadAdapter(loader);
        };
    }

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

    console.log("VArupuuuuuuuuuuuuuuu", file)


    const handlePDFupload = async (file) => {
        const toBase64 = (file) =>
            new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(file); // Reads as base64 string with prefix
                reader.onload = () => resolve(reader.result);
                reader.onerror = (error) => reject(error);
            });

        if (file) {
            try {
                const base64File = await toBase64(file);
                setFile(base64File); // store base64 with prefix
            } catch (error) {
                console.error("Error:", error);
                alert("Failed to upload file");
            }
        }
    };


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

    // const handleOpenPDF = async (base64PDF, fileName = "report.pdf") => {
    //     if (!base64PDF) {
    //         alert("No report available.");
    //         return;
    //     }

    //     // Remove prefix if exists
    //     let actualBase64 = base64PDF;
    //     if (actualBase64.startsWith("data:application/pdf;base64,")) {
    //         actualBase64 = actualBase64.split(",")[1];
    //     }

    //     // Convert base64 -> binary
    //     const byteCharacters = atob(actualBase64);
    //     const byteNumbers = Array.from(byteCharacters, (char) => char.charCodeAt(0));
    //     const byteArray = new Uint8Array(byteNumbers);

    //     // Create blob
    //     const blob = new Blob([byteArray], { type: "application/pdf" });

    //     // Convert blob to object URL (temporary)
    //     const blobURL = URL.createObjectURL(blob);

    //     // ❌ Google Docs does not support local blob:// URLs
    //     // ✅ You must upload the file to your backend and get a public URL
    //     // For demo, let’s pretend you already uploaded and got this URL:
    //     const publicFileURL = `http://kmch.life:3001/uploads/${fileName}`;

    //     // Open in Google Docs Viewer
    //     const officeURL = "https://view.officeapps.live.com/op/embed.aspx?src=" + encodeURIComponent(publicFileURL);
    //     window.open(officeURL, "HashWar");
    // };


    const handleSave = () => {

        const HTMLCont = editorContent || htmlContent;
        console.log("Content------------", HTMLCont);
        if (HTMLCont || file) {
            const ok = window.confirm("Do You Want To Save...")
            if (ok) {
                console.log("---------HTML Source--------", editorContent ? "editorContent" : "htmlContent");
                const submitData = {
                    ...testDetails,
                    ...reportData,
                    HTMLCont: HTMLCont,
                    createdBy: userRecord?.username,
                    completeId: completeId,
                    File: file,
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
                        dispatchvalue({ type: "setActiveFolder", value: "PatientList" });
                        dispatchvalue({ type: "toast", value: tdata });
                        setTestDetails({})
                        reportData({
                            doctorName: "",
                            doctorId: "",
                            documentId: "",
                            documentName: "",
                        })
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            }
        } else {
            const tdata = {
                message: "Please Choose or Upload Report...",
                type: "warn",
            };
            dispatchvalue({ type: "toast", value: tdata });
        }
    }

    return (
        <>
            <div className="appointment">
                <div className="h_head">
                    <h3>Template Editor</h3>
                </div>
                <h1 style={{ margin: "10px", fontSize: "28px", fontWeight: "bold", color: "black" }}>{testDetails.subDepartment}</h1>
                <table className="responsive-table-M007">
                    <thead>
                        <tr>
                            <th>Test Name</th>
                            <th>Radiologist</th>
                            <th>Template</th>
                            <th>Action</th>
                            <th>Upload</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td><p style={{ fontSize: "18px", fontWeight: "bold" }}>{testDetails.TestName}</p></td>
                            <td >
                                <Select
                                    name="doctor"
                                    value={reportData?.doctorName}
                                    onChange={(event) => handleInputChange(event)}
                                    size="small"
                                    displayEmpty
                                    renderValue={(selected) => (selected ? selected : <em>Select a Doctor</em>)}
                                    style={{ minWidth: "150px" }}

                                >
                                    {doctorList.length > 0 ? (
                                        doctorList.map((doctor) => (
                                            <MenuItem key={doctor.DoctorName} value={doctor.DoctorID}>
                                                {doctor.DoctorName}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>No Doctors Available</MenuItem>
                                    )}
                                </Select>

                            </td>
                            <td>
                                <Select
                                    name="document"
                                    value={reportData?.documentName}
                                    onChange={(event) => handleInputChange(event)}
                                    size="small"
                                    displayEmpty
                                    renderValue={(selected) => (selected ? selected : <em>Select a Template</em>)}
                                    style={{ minWidth: "150px" }}
                                >
                                    {documentList.length > 0 ? (
                                        documentList.map((doctor) => (
                                            <MenuItem key={doctor.fileName} value={doctor.id}>
                                                {doctor.fileName}
                                            </MenuItem>
                                        ))
                                    ) : (
                                        <MenuItem disabled>Please Select Doctor</MenuItem>
                                    )}
                                </Select>

                            </td>
                            <td>
                                <button
                                    onClick={() =>
                                        handleOpenEditor()
                                    }
                                    style={{ backgroundColor: "#ffffff", width: "60px", height: "40px" }}
                                >
                                    <VisibilityIcon style={{ fontSize: "32px", color: "var(--ProjectColor) !important" }} />
                                </button>
                            </td>
                            <td>
                                <div style={{ display: "flex", gap: "10px" }}>
                                    <input
                                        type="file"
                                        accept=".pdf"
                                        id="Servicechoose"
                                        required
                                        style={{ display: "none" }}
                                        onChange={(e) => handlePDFupload(e.target.files[0])}
                                    />
                                    <label
                                        htmlFor="Servicechoose"
                                        className="RegisterForm_1_btns choose_file_update"
                                        style={{ backgroundColor: "#ffffff", }}
                                    >
                                        <UploadIcon style={{ fontSize: "32px", color: "var(--ProjectColor) !important", }} />
                                    </label>
                                    <button
                                        className="RegisterForm_1_btns choose_file_update"
                                        onClick={() => handleOpenPDF(file)}   // ✅ fixed
                                        style={{ backgroundColor: "#ffffff", }}
                                    >
                                        <PhotoCameraBackIcon style={{ fontSize: "32px", color: "var(--ProjectColor) !important" }} />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div className="Register_btn_con regster_btn_contsai" style={{ marginTop: "80px" }}>
                    <button
                        className="RegisterForm_1_btns"
                        onClick={handleSave}
                    >
                        Save
                    </button>
                </div>


                {openpreview1 && (
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
                )}



                <Modal
                    title={docName || 'Edit Document'}
                    open={editorVisible}
                    onCancel={handleOnCloseEditor}
                    footer={null}
                    width={900}
                    style={{ top: 20 }}
                    destroyOnClose={false}
                >
                    {loading ? (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 300 }}>
                            <Spin size="large" />
                        </div>
                    ) : error ? (
                        <div style={{ textAlign: 'center', color: 'red' }}>
                            <p>{error}</p>
                            <Button onClick={handleOnCloseEditor}>Close</Button>
                        </div>
                    ) : (
                        <>
                            <JoditRichEditor
                                ref={editorRef}
                                initialContent={htmlContent}
                                onChange={(newContent) => setEditorContent(newContent)}
                            />
                        </>
                    )}
                </Modal>
            </div>
        </>
    );
}

export default DocTest2;
