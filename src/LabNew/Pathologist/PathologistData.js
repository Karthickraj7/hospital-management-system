import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import Barcode from "react-barcode";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import { TiArrowDownThick, TiArrowUpThick } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
// import { colors } from '@mui/material';
// import { red } from '@mui/material/colors';
import { useDispatch } from "react-redux";
import {
  ResponsiveContainer,
  Bar,
  ComposedChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line
} from 'recharts';
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid } from "@mui/x-data-grid";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { TbDelta } from "react-icons/tb";
import "../Report/Report.css";
import { Select, MenuItem } from '@mui/material';
import JoditEditor from 'jodit-react';
import { Modal, Button, message, Spin } from 'antd';
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";


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

function Pathologydata() {
  // const [filteredRows, setFilteredRows] = useState([]);
  const [testDetails, setTestDetails] = useState([]);
  console.log(testDetails);
  // const [visitids, setvisitids] = useState([])
  const [reflexlist, setreflexlist] = useState([]);
  // const [value, setvalue] = useState([]);
  const [page, setPage] = useState(0);
  const [content, setcontent] = useState("");
  const [openpreview, setopenpreview] = useState(false);
  const [openpreview1, setopenpreview1] = useState(false);
  const [culturevalue, setculturevalue] = useState([]);
  const [showmodel, setshowmodel] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const [editData, seteditData] = useState("")
  // const [formatData, setFormatData] = useState([]);
  const [imageData, setImageData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [openeditpreview, setopeneditpreview] = useState(false)
  // const [isNavigating, setIsNavigating] = useState(false)
  const pageSize = 10;
  const totalPages = Math.ceil(culturevalue.length / pageSize);
  const showdown = culturevalue.length;
  const [dataline, setdataline] = useState([]);

  // const [visitid, setvisitid] = useState()
  const capturedatas = useSelector((state) => state.userRecord?.Samplecapture);
  console.log("capturedatas", capturedatas);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const senioredit = useSelector((state) => state.userRecord?.pathalogydoc);
  const isedited = useSelector((state) => state.userRecord?.iseditedsenior);
  const [editMode, setEditMode] = useState(false);
  const dispatchvalue = useDispatch();
  const [department, setDepartment] = useState([]);
  const editorRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editorVisible, setEditorVisible] = useState(false);
  const [currentParams, setCurrentParams] = useState(null);
  const [editorContent, setEditorContent] = useState("");


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

  const [report, setreport] = useState({
    Collected: "",
    Received: "",
    Reported: "",
    Head: "",
    Detail: "",
  });

  const [summa, setsumma] = useState([]);
  // const [isedited, setisedited] = useState('')
  const [patinetbillingbarcode, setpatinetbillingbarcode] = useState("");

  const contentRef = useRef(null);

  useEffect(() => {
    if (Object.keys(capturedatas).length === 0) {
      // Add state to prevent re-renders
      navigate("/Home/AuthorizedReportEntry");
    }
  });

  const autoResizeTextarea = (e) => {
    e.target.style.height = "auto"; // Reset the height to auto
    e.target.style.height = `${e.target.scrollHeight}px`; // Set it to the scroll height
  };

  const navigate = useNavigate();


  const [condition, setCondition] = useState("");
  const [srfId, setSrfId] = useState("");
  const [icmrId, setIcmrid] = useState("");
  const [methoddata, setMethodData] = useState([]);
  const [testType, setTestType] = useState("");
  const [covidTest, setCovidTest] = useState("");
  const [pathologyyesorno, setpatologyyesorno] = useState("");
  const [pathologyremark, setpathologyremark] = useState("");
  const [abstinence, setabstinence] = useState("");

  const [file, setFile] = useState(null);
  const handleReportChange = (index, base64File, depart, Test_Code) => {
    console.log("statue-------", index, base64File, depart, Test_Code);

    const updatedTestDetails = [...testDetails];
    let updateddetail = updatedTestDetails.filter(
      (i) => i.department === depart
    );

    let test = updateddetail.filter((i) => i.Test_Code === Test_Code);
    console.log("Test------------", test);

    test[0].reportfile = base64File;
    setTestDetails(updatedTestDetails);
  };

  const handlePDFupload = async (file, index, depart, Test_Code) => {
    const toBase64 = (file) =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (error) => reject(error);
      });

    if (file) {
      try {
        const base64File = await toBase64(file);
        setFile(base64File);
        handleReportChange(index, base64File, depart, Test_Code);
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


  useEffect(() => {
    axios
      .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=MethodsMaster`)
      .then((response) => {
        const data = response.data;
        console.log("data", data);

        setMethodData(data);
      })
      .catch((error) => {
        console.error("Error fetching method data:", error);
      });
  }, [urllink]);



  const handlecultureChange = (e) => {
    const { name, value } = e.target;

    if (name === "Antibiotic") {
      const selectedAntibiotic = antibioticorg.find(
        (a) => a.anti_biotic === value
      );

      setNewEntry((prev) => ({
        ...prev,
        Antibiotic: value,
        sensitiverange: selectedAntibiotic?.sensitiverange || "",
        intermediaterange: selectedAntibiotic?.intermediaterange || "",
        resistantrange: selectedAntibiotic?.resistantrange || "",
      }));
      return;
    }

    if (name === "newOrganism") {
      if (value.trim() === "") {
        setNewEntry((prev) => ({
          ...prev,
          newOrganism: "",
          Antibiotic: "",
          ColonyCount: "",
        }));
        return;
      }

      const existingOrganism = culturevalue.find(
        (item) => item.Oraganism === value
      );

      if (existingOrganism) {
        setNewEntry((prev) => ({
          ...prev,
          newOrganism: value,
          ColonyCount: existingOrganism.ColonyCount,
        }));
        return;
      }
    }

    setNewEntry((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddAntibiotic = () => {
    const { newOrganism, Antibiotic, Sensitivity, Value, ColonyCount } = newEntry;
    if (!newOrganism) {
      alert("Please enter an Organism.");
      return;
    }

    if (!Antibiotic) {
      alert("Please enter an Antibiotic.");
      return;
    }

    if (!Sensitivity) {
      alert("Please select Sensitivity.");
      return;
    }

    if (!Value) {
      alert("Please enter a Value.");
      return;
    }

    if (!ColonyCount) {
      alert("Please enter Colony Count.");
      return;
    }

    // Check if the organism already exists in the culture value
    const existingOrganism = culturevalue.filter(
      (item) => item.Oraganism === newOrganism
    );

    // Check if the antibiotic already exists for the selected organism
    const isAntibioticExists = existingOrganism.some(
      (item) => item.antibiotic.toLowerCase() === Antibiotic.toLowerCase()
    );

    if (isAntibioticExists) {
      alert("Antibiotic already found for this organism.");
      return;
    }

    const newAntibioticEntry = {
      Oraganism: newOrganism,
      antibiotic: Antibiotic,
      Sensitivetype: Sensitivity,
      Antibiotic_Value: Value,
      ColonyCount: existingOrganism.length > 0 ? existingOrganism[0].ColonyCount : ColonyCount,
      testcode: existingOrganism.length > 0 ? existingOrganism[0].testcode : testDetails[0]?.Test_Code,
      sensitiverange: newEntry.sensitiverange || "",
      intermediaterange: newEntry.intermediaterange || "",
      resistantrange: newEntry.resistantrange || "",
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


  const handleDetailChange = (index, field, value) => {
    const updatedDetails = [...testDetails];
    updatedDetails[index][field] = value;
    setTestDetails(updatedDetails);
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


  const groupedData = culturevalue.reduce((acc, item) => {
    if (!acc[item.Oraganism]) {
      acc[item.Oraganism] = [];
    }
    acc[item.Oraganism].push(item);
    return acc;
  }, {});

  const handleCloseModal = () => {
    setshowmodel(null);
    setEditMode(false)
  };


  useEffect(() => {
    if (editMode) {
      axios
        .get(
          `${urllink}Masters/getmicroname`
        )
        .then((response) => {
          setMicrocopyName(response.data)
          console.log(response)
        })
        .catch((error) => {
          console.error("Error fetching data: ", error);
        })
    }
  }, [urllink, editMode])







  useEffect(() => {
    axios.get(`${urllink}Masters/Hospital_Detials_link`)
      .then((res) => {
        const ress = res.data
        console.log('hospitalllll', ress);
        setClinicDetials((prev) => ({
          ...prev,
          ClinicName: ress.hospitalName,
          ClinicLogo: ress.hospitalLogo,
        }))
      })
      .catch((e) =>
        console.log(e)
      )
    // axios
    //   .get(`${urllink}usercontrol/getClinic?location=ALL`)
    //   .then((response) => {
    //     // console.log(response.data)
    //     const data = response.data[0];
    //     console.log(data);
    //     if (data) {
    //       setClinicDetials((prev) => ({
    //         ...prev,
    //         ClinicAddress: data.door_no + "," + data.area + "," + data.street,
    //         ClinicGST: data.Gst_no,
    //         ClinicCity: data.city,
    //         ClinicState: data.state,
    //         ClinicCode: data.pincode,
    //         ClinicMobileNo: data.phone_no,
    //         ClinicLandLineNo: data.landline_no,
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
    //     // console.log(response.data.Data)
    //     const data = response.data;
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
        console.log(response);
        setpatinetbillingbarcode(response.data.Patient_Barcode);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [urllink, capturedatas]);

  const handleStatusChange = (index, newValue, dept) => {
    console.log("index", index, newValue, dept);

    const updatedTestDetails = [...testDetails];
    let summa = updatedTestDetails.filter((p) => p.department === dept);
    console.log("summa", summa);

    summa[index].status = newValue;
    setTestDetails(updatedTestDetails);

    // Check if status is 'Reflex', then call handleReflexChange
    if (newValue === "Reflex") {
      handleReflexChange(index + 1, dept); // Assuming index is the parameter required by handleReflexChange
    }
  };

  const handlereflexchange = (index, newValue) => {
    const updatedDetails = [...testDetails];
    updatedDetails[index].reflextest = newValue;
    setTestDetails(updatedDetails);
  };

  const handlereflexsamplechange = (index, newValue) => {
    const updatedTestDetails = [...testDetails];
    updatedTestDetails[index].reflexsample = newValue;
    setTestDetails(updatedTestDetails);
  };

  // const handlestatuscahngeretest= (index)=>{
  //   const updatedTestDetails = [...testDetails];
  //   updatedTestDetails[index].status = '';
  //   setTestDetails(updatedTestDetails);
  //  }


  const handleTextareaChange = (e, name) => {
    const { value } = e.target;

    setFormatData((prev) => {
      // Map directly over prev since formatData is at the top level
      const updatedFormatData = prev.map((item) => {
        if (item.name === name) {
          return { ...item, value: value }; // Update the value for the matching field
        }
        return item; // Keep other fields unchanged
      });

      return updatedFormatData; // Return the updated array
    });
  };



  const fetchseniorTechRecords = () => {

    const departmentCodes = userRecord?.Lab_Department?.join(',') || '';
    axios
      .get(
        `${urllink}Lab/getverifieddata?Billinginvoice=${capturedatas.Billing_Invoice}&Visitid=${capturedatas.Visit_Id}&Location=${userRecord?.location}&Department=${departmentCodes}`
      )
      .then((response) => {
        console.log(response.data);
        const data = response.data.map((item, index) => ({
          id: index + 1, // Assigning a unique id based on the item index
          // testcode: item.Test_Code,
          analyseid: item.Analyse_Id,
          testname: item.Test,
          // testnames: item.Test_Name,
          Test_Code: item.Test_Code,
          Capture_Value: item.Capture_Value,
          Status: item.Status,
          Sample_Specimen: item.Sample_Specimen,
          Patient_Name: capturedatas.Patient_Name,
          UpdateAt: capturedatas.UpdatedAt,
          paniclow: item.Panic_Low,
          panichigh: item.Panic_High,
          Medical_Remark: item.Medical_Remark,
          Technical_Remark: item.Technical_Remark,
          Billing_Invoice: item.Billing_invoice,
          patient_id: capturedatas.Patient_Id,
          visitid: capturedatas.Visit_Id,
          barcode: capturedatas.Barcode,
          status: item.Status === "Retest" ? "" : "Approved",
          reflextest: "",
          reflexsample: "",
          Culturetest: item.Culturetest || "",
          colony_count: item.Colony_Count || "",
          Capture_Oragnism: item.Capture_Oragnism || "",
          location: userRecord?.location,
          createdby: userRecord?.Employeename,
          department: item.Department || "",
          Content: atob(item.Content) || "",
          reference: item.Reference,
          referencedata: item.Reference_Range,
          Notes: item.Notes || "",
          Microscopy_Data: item.Microscopy_Data || "",
          site: item.site || "",
          macroscopy: item.macroscopy || "",
          Report_Type: item.Report_Type || "",
          Culture_Report: item.Culture_Report || "",
          inputtype: item.Input_Type || "",
          Report_Status: item.Report_Status || "",
          micronumber: item.micronumber || "",
          histonumber: item.histonumber || "",
          Bacteria_Isolated: item.Bacteria_Isolated || "",
          IsSubTest: item.IsSubTest,
          SubTestCodes: item.SubTestCodes,
          transferlocation: item.transferlocation,
          Iscutoffvalue: item.Iscutoffvalue,
          Result: item.Result,
          srfId: item.srfId,
          icmrId: item.icmrId,
          condition: item.condition,
          testType: item.testType,
          covidTest: item.covidTest,
          uom: item.uom,
          PackageName: item.PackageName, // Add PackageName
          Group_Name: item.Group_Name,
          Previous_Value: item.Previous_Value,
          labtechnician: item.labtechnician,
          doctorid: userRecord.Doctor,
          pathologyremarks: item.pathologyremarks,
          pathologyyesorno: item.pathologyyesorno,
          abstinence: item.abstinence,
          subdept: item.Department,
          acid_fast: item.acid_fast,
          positivity: item.positivity,
          reportfile: item.reportfile,
          rangeType: item.rangeType,
        }));
        // setFilteredRows(data);

        const Department = []
        data.map((item) => {
          if (!Department.includes(item.department)) {
            Department.push(item.department);
          }
        });
        setDepartment(Department)
        setTestDetails(data);
        data.map((item) => {
          setSrfId(item.srfId);
          setIcmrid(item.icmrId);
          setCondition(item.condition);
          setTestType(item.testType);
          setCovidTest(item.covidTest);
          setpathologyremark(item.pathologyremarks)
          setpatologyyesorno(item.pathologyyesorno)
          setabstinence(item.abstinence)
        })
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }

  useEffect(() => {
    fetchseniorTechRecords();

  }, [capturedatas, urllink, userRecord]);

  // const ishistopathology = testDetails.some((item) => item.department === 'HISTOPATHOLOGY')

  const handleChangemicronumber = (id, value) => {
    // prompt("You are changing the Capture Value");

    let updatedDetail = [...testDetails];
    let testData = updatedDetail.find((p) => p.testcode === id);

    if (testData) {
      testData.micronumber = value;
      setTestDetails(updatedDetail); // Assuming testDetails is your state variable
    }
  };


  const handleImageChange = (e) => {
    const file = e.target.files[0]; // Get the selected file
    if (file) {
      const previewUrl = URL.createObjectURL(file); // Create a preview URL

      // Update the state for the selected image
      setImageData(file); // Store the actual file for submission
      setImagePreview(previewUrl); // Set the preview URL for immediate display

      // Update the `formatData` array
      setFormatData((prev) =>
        prev?.map((field) =>
          field.name === "imageData"
            ? { ...field, value: file } // Store the actual file in `value`
            : field // Keep other fields unchanged
        )
      );
    }
  };



  const handleverifydata = () => {
    console.log("testDetails", testDetails);
    // Separate the testDetails into groups based on their status
    const recollectTests = testDetails.filter(
      (detail) => detail.status === "Recollect"
    );
    const retestTests = testDetails.filter(
      (detail) => detail.status === "Retest"
    );
    const verifiedTests = testDetails.filter(
      (detail) => detail.status === "Approved" || detail.status === "co-authorize"
    );

    const reverifyTests = testDetails.filter(
      (detail) => detail.status === "Reverify"
    );
    console.log("reflexTests", recollectTests);
    console.log("reflexTests", retestTests);
    console.log("reflexTests", verifiedTests);
    console.log("reverifyTests", reverifyTests);
    // Define a function for handling API calls (for demonstration)
    const performApiCall = (url, data) => {
      return axios
        .post(url, data)
        .then((response) => {
          console.log(response);
          alert(response.data.message);
          navigate("/Home/Lab");
          dispatchvalue({ type: 'HrFolder', value: 'Approvereport' });
          dispatchvalue({ type: "setPreviousFolder", value: null });
        })
        .catch((error) => {
          console.error(error);
        });
    };

    console.log(retestTests);

    // Process Recollect Tests
    if (recollectTests.length > 0) {
      performApiCall(
        `${urllink}Lab/pathologistsampleaprove`,
        recollectTests
      );
    }

    // Process Retest Testsv
    if (retestTests.length > 0) {
      performApiCall(`${urllink}Lab/updateretest`, retestTests);
    }

    // Process Verified Tests
    if (verifiedTests.length > 0) {
      performApiCall(
        `${urllink}Lab/insertpathologistcomplete`,
        verifiedTests
      );
    }

    if (reverifyTests.length > 0) {
      performApiCall(`${urllink}Lab/reflextestinsert`, reverifyTests);
    }

  };

  const handletrendview = (testname) => {
    console.log(capturedatas);
    axios
      .get(
        `${urllink}Lab/gettrendsfortest?patientname=${capturedatas.Patient_Id}&test=${testname}`
      )
      .then((response) => {
        let data = response.data.map(item => ({
          ...item,
          data: parseFloat(item.data), // Use parseFloat instead of Number for better handling
          visit: item.visit.toString() // Ensure visit is string
        }));
        console.log("Chart data:", data);
        setdataline(data);
        setOpenModel(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleupdatesencitivity = () => {

    const postdata = {
      culturevalues: culturevalue,
      deletedItems: deletedItems,
      testdetailstoupdate: testDetails,
      invoice: capturedatas?.Billing_Invoice,
      visitid: capturedatas?.Visit_Id,
    }
    console.log('postdata', postdata);
    axios.post(`${urllink}Lab/culture_sencitivity_type_update`, postdata)
      .then((response) => {
        console.log(response);
        setEditMode(!editMode);
      })
      .catch((error) => {
        console.log(error);
      })

  };

  const handleReflexChange = (index, depart) => {
    console.log(index);
    const reflexTestName = testDetails
      .filter((item) => item.id === index && item.department === depart)
      .map((item) => item.testname); // Filter the array based on the index
    const testname = reflexTestName[0];
    console.log("reflexTestName", testname);

    axios
      .get(`${urllink}Lab/getforallreflex?testname=${testname}`)
      .then((response) => {
        console.log(response);
        const data = response.data;
        // const nodata = response.error

        if (Array.isArray(data)) {
          setreflexlist(data);
        } else {
          setreflexlist([]);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  console.log("reflexlist", reflexlist);
  //   useEffect(() => {
  //     if (testDetails && testDetails.status === 'Reflex') {
  //         console.log('reflexTestName', reflexTestName);

  //         // axios.get(`${urllink}Billing/getforvisitid`)
  //         //     .then((response) => {
  //         //         console.log(response);
  //         //     })
  //         //     .catch((error) => {
  //         //         console.log(error);
  //         //     });
  //     }
  // }, [testDetails]);

  // const culturetests = testDetails?.some((item) => item.Culturetest === 'Yes');
  const hasRecollect = testDetails?.some(
    (detail) => detail.status === "Reflex"
  );

  const [formatData, setFormatData] = useState([]);

  const handleSubmitAnalyseReport = () => {
    const formData1 = new FormData();

    // Append regular data
    formData1.append("Billing_Invoice", capturedatas.Billing_Invoice);
    formData1.append("Visit_Id", capturedatas.Visit_Id);
    formData1.append("Patient_Id", capturedatas.Patient_Id);

    // Define testCode here

    // Find and set testCode from format field


    // Iterate over formatData to append fields to formData1
    formatData.forEach((item) => {
      console.log("testCode:", editData);

      if (item.name === "imageData" && item.value instanceof File) {
        // If the item is an image, append it as a file
        formData1.append(`${editData}_imageData`, item.value); // Append the testCode to differentiate images
      } else if (item.format) {
        formData1.append(`${editData}_format`, item.format)
      }

      else if (item.name !== "format") {
        // For other items, append their name and value with the testCode prefix (skip format itself)
        formData1.append(`${editData}_${item.name}`, item.value || '');
      }
    });

    // Send formData1 to your backend using Axios
    axios
      .post(`${urllink}Lab/insert_Histo_Template`, formData1, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        setopeneditpreview(!openeditpreview);
        // navigate("/Home/AnalayseReportEntry");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handlepdfpreview = (params) => {

    console.log("Preliminary Report", params);
    console.log("params", params.Content);
    setcontent(params.Content)
    setopenpreview(true);
    // axios
    //   .get(
    //     `${urllink}Lab/Get_Template?Billing_Invoice=${params?.Billing_Invoice}&patient_id=${params?.patient_id}&visitid=${params?.visitid}&Test_Code=${params?.Test_Code}`
    //   )

    //   .then((res) => {
    //     console.log(res);
    //     // Assuming res.data.format contains the format array
    //     console.log(res);
    //     setFormatData(res.data.format);
    //   })

    //   .catch((err) => {
    //     console.error(err);
    //   });

    // // Accumulate content data
    // console.log(isedited);
    // if (isedited === "PathEdited") {
    //   console.log("hai");
    //   setcontent(senioredit);
    //   setopenpreview(!openpreview);
    // } else {
    //   console.log("else");
    //   const accumulatedContent = testDetails
    //     .filter((item) => item.department === "HISTOPATHOLOGY")
    //     .map((item) => item.Content)
    //     .join("\n"); // Assuming item.Content contains strings
    //   console.log(accumulatedContent);
    //   // Update content state
    //   setcontent(accumulatedContent);

    //   // Toggle openpreview state
    //   setopenpreview(!openpreview);
    // }
  };



  //   const processContent = (content) => {
  //   console.log("Processing content:", content);

  //   // Split the content into lines
  //   const lines = content.split('</p>').filter(line => line.trim() !== '');
  //   console.log("Lines:", lines);

  //   // Ensure there are enough lines to process the professor section
  //   if (lines.length < 4) {
  //     console.log("Not enough lines, returning original content");
  //     return content;
  //   }

  //   // Find the professor-related lines (last 4 lines, filter out empty ones)
  //   const lastFourLines = lines.slice(-4); // Take the last 4 lines
  //   const professorLines = lastFourLines
  //     .filter(line => {
  //       const match = line.match(/<p><strong>([^<]+)<\/strong>/);
  //       return match && match[1].trim();
  //     })
  //     .slice(-3); // Take the last 3 meaningful lines
  //   console.log("Professor lines:", professorLines);

  //   // Ensure we have exactly 3 professor lines
  //   if (professorLines.length !== 3) {
  //     console.log("Not exactly 3 professor lines after filtering, returning original content");
  //     return content;
  //   }

  //   // Adjust otherLines to exclude the professor lines
  //   const professorLineIndices = lastFourLines
  //     .map((line, index) => (professorLines.includes(line) ? lines.length - 4 + index : -1))
  //     .filter(index => index !== -1);
  //   const otherLines = lines.slice(0, Math.min(...professorLineIndices));
  //   console.log("Other lines:", otherLines);

  //   // Process the professor lines
  //   const processedProfessors = professorLines.map(line => {
  //     // Extract the text inside the <p><strong>...</strong></p>
  //     const match = line.match(/<p><strong>([^<]+)<\/strong>/);
  //     if (!match || !match[1].trim()) {
  //       console.log("No match for line:", line);
  //       return [''];
  //     }
  //     const text = match[1].trim();
  //     console.log("Extracted text:", text);

  //     // Split the text by a large gap, adjusting for qualifications
  //     const splitText = text.includes('MBBS') && text.includes('Pathology')
  //       ? text.split(/\s{20,}/).filter(item => item !== '')
  //       : text.split(/\s{10,}/).filter(item => item !== '');
  //     console.log("Split text:", splitText);
  //     return splitText.length > 0 ? splitText : [''];
  //   });

  //   console.log("Processed professors:", processedProfessors);

  //   // Check if processedProfessors has the expected structure
  //   const validProfessorLines = processedProfessors.filter(arr => arr[0] !== '');
  //   console.log("Valid professor lines:", validProfessorLines);
  //   if (validProfessorLines.length !== 3) {
  //     console.log("Not exactly 3 valid professor lines, returning original content");
  //     return content;
  //   }

  //   // Ensure both professors' data exists, provide fallback if not
  //   const professor1Name = processedProfessors[0][0] || 'Unknown';
  //   const professor1Qualification = processedProfessors[1][0] || '';
  //   const professor1Title = processedProfessors[2][0] || '';
  //   const professor2Name = processedProfessors[0][1] || 'Unknown';
  //   const professor2Qualification = processedProfessors[1][1] || '';
  //   const professor2Title = processedProfessors[2][1] || '';

  //   // Reconstruct the professor section
  //   const professorSection = `
  //     <div class="professors-section">
  //       <div class="professor">
  //         <p><strong>${professor1Name}</strong></p>
  //         <p><strong>${professor1Qualification}</strong></p>
  //         <p><strong>${professor1Title}</strong></p>
  //       </div>
  //       <div class="professor">
  //         <p><strong>${professor2Name}</strong></p>
  //         <p><strong>${professor2Qualification}</strong></p>
  //         <p><strong>${professor2Title}</strong></p>
  //       </div>
  //     </div>
  //   `;

  //   // Reconstruct the full content
  //   return otherLines.join('</p>') + '</p>' + professorSection;
  // };

  //   // Process the content
  //   const processedContent = processContent(content);


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


  const handleOnCloseEditor = () => {
    setEditorVisible(false);

  }

  const handleeditpreview = (params) => {

    console.log(params.Content, "yeueueueuueueueue");
    setLoading(false);
    setError(null);
    setEditorVisible(true);
    setcontent(params.Content);
    setCurrentParams(params);
  }

  const handleSave = () => {

    const currentContent = editorRef.current?.getContent?.();

    if (!currentContent) {
      setError("Content is empty or editor not loaded.");
      return;
    }

    axios
      .post(`${urllink}Lab/update_senior_edit_content`, {
        content: currentContent,
        testcode: currentParams.Test_Code,
        billinginvoice: currentParams.Billing_Invoice,
        pathologist: true,
      })
      .then((response) => {
        console.log("Content saved successfully:", response.data);
        setEditorVisible(false);
        setError(null); // clear error
        fetchseniorTechRecords()
      })
      .catch((error) => {
        console.error("Error saving content:", error);
        setError("Failed to save content. Please try again.");
      });
  };

  const handleshowculturetest = (testCode) => {
    axios
      .get(
        `${urllink}Lab/get_for_culture_report_completion?Billinginvoice=${capturedatas?.Billing_Invoice}&Visitid=${capturedatas?.Visit_Id}&testcode=${testCode}`
      )
      .then((response) => {
        console.log(response);
        const data = response.data?.map((p, index) => ({
          id: index + 1,
          ...p,
        }));
        setculturevalue(data);
        setshowmodel(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleeditdocs = () => {
    let patObj = {
      pateditword: content,
      patientid: capturedatas.Patient_Id,
      visitid: capturedatas?.Visit_Id,
      invno: capturedatas?.Billing_Invoice,
    };

    dispatchvalue({ type: "foreditcontent", value: patObj });
    navigate("/Home/Pathreportpreview");
    // setisedited('Edited')
  };

  useEffect(() => {
    // let testname = testDetails[0]?.testname;
    axios
      .get(
        `${urllink}Lab/get_for_preview_examinations_pathologist?Visitid=${capturedatas?.Visit_Id}&patientid=${capturedatas.Patient_Id}&Billinginvoice=${capturedatas?.Billing_Invoice}`
      )
      .then((response) => {
        console.log(response);
        const groupsData = response.data;
        console.log("groupsData", groupsData);
        let latestCollectedDate = new Date(0);
        let latestReceivedDate = new Date(0);
        let latestReportedDate = new Date(0);

        groupsData.forEach((group) => {
          const analyseResultDate = new Date(
            group.Updated_At.Sample_Capture_in_Phelobotomist
          );
          const analyseSeniorDate =
            group.Updated_At.AnalyseInvestigationResult &&
              group.Updated_At.AnalyseInvestigationResult !== "N/A"
              ? new Date(group.Updated_At.AnalyseInvestigationResult)
              : new Date(); // Default to the current date if invalid

          const approvePathologistDate =
            group.Updated_At.AnalyseInvestigationSenior &&
              group.Updated_At.AnalyseInvestigationSenior !== "N/A"
              ? new Date(group.Updated_At.AnalyseInvestigationSenior)
              : new Date(); // Default to the current date if "N/A"
          if (analyseResultDate > latestCollectedDate) {
            latestCollectedDate = analyseResultDate;
          }

          if (analyseSeniorDate > latestReceivedDate) {
            latestReceivedDate = analyseSeniorDate;
          }

          if (approvePathologistDate > latestReportedDate) {
            latestReportedDate = approvePathologistDate;
          }
        });

        const formatDateAndTime = (date) => {
          let d = new Date(date),
            day = "" + d.getDate(),
            month = "" + (d.getMonth() + 1),
            year = d.getFullYear(),
            hours = "" + d.getHours(),
            minutes = "" + d.getMinutes();

          if (day.length < 2) day = "0" + day;
          if (month.length < 2) month = "0" + month;
          if (hours.length < 2) hours = "0" + hours;
          if (minutes.length < 2) minutes = "0" + minutes;

          return (
            [day, month, year].join("/") + " " + [hours, minutes].join(":")
          );
        };

        setreport((prev) => ({
          ...prev,
          Collected: formatDateAndTime(latestCollectedDate),
          Received: formatDateAndTime(latestReceivedDate),
          Reported: formatDateAndTime(latestReportedDate),
        }));

        const reportsData = groupsData.map((group) => {
          return {
            method: group.Method,
            Department: group.Department,
            groupName: group.Group_Name,
            Tests: group.Tests.map((test) => ({
              Test_Name: test.Test_Name || "",
              Method_Name: test.Method_Name || "",
              Department: test.Department || "",
              Sample: test.Specimen || "",
              Samplepicture: test.Samplepic
                ? `data:image/jpeg;base64,${test.Samplepic}`
                : null,
              Content: test.EditContent || "",
            })),
          };
        });

        setsumma(reportsData);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, [
    // testDetails,
    urllink,
    capturedatas?.Visit_Id,
    capturedatas?.Billing_Invoice,
  ]);

  const handleChange = (analyseid, value) => {
    console.log("New input:", value, "for analyseid:", analyseid);
    setTestDetails(prevDetails => {
      const actualIndex = prevDetails.findIndex(p => p.analyseid === analyseid);
      if (actualIndex === -1) {
        console.warn("No matching item found for analyseid:", analyseid);
        return prevDetails;
      }
      const updatedDetails = [...prevDetails];
      updatedDetails[actualIndex] = {
        ...updatedDetails[actualIndex],
        Capture_Value: value === "" ? "" : value,
      };
      console.log("Updated Capture_Value for analyseid:", analyseid, "to:", value);
      return updatedDetails;
    });
  };

  // const handleRemarksChange = (analyseid, newValue) => {
  //   console.log("New input:", newValue, "for analyseid:", analyseid);
  //   setTestDetails(prevDetails => {
  //     const actualIndex = prevDetails.findIndex(p => p.analyseid === analyseid);
  //     if (actualIndex === -1) {
  //       console.warn("No matching item found for analyseid:", analyseid);
  //       return prevDetails;
  //     }
  //     const updatedDetails = [...prevDetails];
  //     updatedDetails[actualIndex] = {
  //       ...updatedDetails[actualIndex],
  //       Capture_Value: newValue === "" ? "" : newValue,
  //     };
  //     console.log("Updated Capture_Value for analyseid:", analyseid, "to:", newValue);
  //     return updatedDetails;
  //   });
  // };

  const handleRemarksChange = (newValue) => {
    console.log("New input:", newValue);

    setpathologyremark(newValue)
    setTestDetails(prevDetails => {
      const updatedDetails = prevDetails.map(item => ({
        ...item,
        pathologyremarks: newValue === "" ? "" : newValue
      }));

      console.log("Updated ALL pathologyremarks to:", newValue);
      return updatedDetails;
    });
  };

  const handleResultChange = (index, newValue, dept) => {
    const updatedvall = [...testDetails];
    const updatedvalue = updatedvall.filter((p) => p.subdepartment === dept);

    // Update Result only if Iscutoffvalue is "Yes"
    if (updatedvalue[index].Iscutoffvalue === "Yes") {
      updatedvalue[index].Result = newValue;
    }

    setTestDetails(updatedvall);
  };



  const parseReferenceData = (referenceData) => {
    console.log(referenceData);
    return referenceData.split(",").map((item) => {
      const [label, value] = item.split(":").map((str) => str.trim());
      let minValue = null;
      let maxValue = null;
      // console.log('value :', value)
      if (value?.includes("<")) {
        maxValue = parseFloat(value.replace("<", ""));
      } else if (value?.includes(">=")) {
        minValue = parseFloat(value.replace(">=", ""));
      } else if (value?.includes("-")) {
        [minValue, maxValue] = value
          .split("-")
          .map((str) => parseFloat(str.trim()));
      } else if (value?.includes(">")) {
        maxValue = value;
      }

      return { label, minValue, maxValue };
    });
  };

  // Function to determine the status based on capture value and reference ranges
  const getStatus = (captureValue, referenceArray) => {
    console.log(captureValue);
    console.log(referenceArray);

    for (let ref of referenceArray) {
      // if (captureValue === 0) {
      //     return <span className='indicator' style={{ color: 'green' }}></span>;

      // } else {
      if (ref.label === "Normal") {
        // Normal range
        if (captureValue >= ref.minValue && captureValue <= ref.maxValue) {
          return (
            <span className="indicator" style={{ color: "green" }}>
              Normal
            </span>
          );
        } else if (captureValue <= ref.minValue) {
          return (
            <span className="indicator" style={{ color: "blue" }}>
              <TiArrowDownThick />
            </span>
          );
        }
      } else if (ref.label === "Borderline") {
        // Borderline range
        if (captureValue >= ref.minValue && captureValue <= ref.maxValue) {
          return (
            <span className="indicator" style={{ color: "blue" }}>
              <TiArrowDownThick />
            </span>
          );
        }
      } else if (ref.label === "High Risk") {
        let highRiskThreshold = null;
        // Determine the high risk threshold
        const minVal = ref.minValue;
        const maxVal = ref.maxValue;

        let minThreshold = null;
        let maxThreshold = null;

        // Parse minValue if it's a string with '>'
        if (typeof minVal === "string" && minVal.includes(">")) {
          minThreshold = parseFloat(minVal.split(">")[1]);
          // minThreshold = minThreshold - 1
        } else if (typeof minVal === "number") {
          minThreshold = minVal;
        } else if (typeof minVal === "string" && minVal.includes(">=")) {
          minThreshold = parseFloat(minVal.split(">=")[1]);
        }

        // Parse maxValue if it's a string with '>'
        if (typeof maxVal === "string" && maxVal.includes(">")) {
          maxThreshold = parseFloat(maxVal.split(">")[1]);
        } else if (typeof maxVal === "number") {
          maxThreshold = maxVal;
        }
        if (typeof maxVal === "string" && maxVal.includes(">=")) {
          maxThreshold = parseFloat(maxVal.split(">=")[1]);
        }

        // Set the highest threshold for high risk
        if (minThreshold !== null && maxThreshold !== null) {
          highRiskThreshold = Math.max(minThreshold, maxThreshold);
        } else if (minThreshold !== null) {
          highRiskThreshold = minThreshold;
        } else if (maxThreshold !== null) {
          highRiskThreshold = maxThreshold;
        }

        // Check if captureValue is above the high risk threshold
        if (highRiskThreshold !== null && captureValue > highRiskThreshold) {
          return (
            <span className="indicator" style={{ color: "red" }}>
              <TiArrowUpThick />
            </span>
          );
        }
        // }
      }
    }
    return "Unknown";
  };

  // useEffect(() => {
  //   axios
  //     .get(
  //       `${urllink}Lab/get_for_pending_result_department?invoice=${capturedatas?.Billing_Invoice}`
  //     )
  //     .then((response) => {
  //       console.log(response);
  //       setDepartment(response.data);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [capturedatas, urllink]);

  const reportnogrowth = testDetails.some((p) => p.Report_Type === "NoGrowth");
  const reportot = testDetails.some((p) => p.Report_Type === "Ot");

  console.log(testDetails, "..................testdetatils");

  const handlepdfpreview1 = () => {
    // Accumulate content data
    if (isedited === "PathEdited") {
      setcontent(senioredit);
      setopenpreview1(!openpreview1);
    } else {
      const accumulatedContent = testDetails
        .filter((item) => item.department === "HISTOPATHOLOGY")
        .map((item) => item.Content)
        .join("\n"); // Assuming item.Content contains strings

      // Update content state
      setcontent(accumulatedContent);

      // Toggle openpreview state
      setopenpreview1(!openpreview1);
    }
  };

  return (
    <>
      {testDetails.length === 0 &&
        <>
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
            <p style={{ color: "red" }}> This Test Not in Your Department</p>

            {/* <button
              className="RegisterForm_1_btns  Rhugt_report"
              onClick={() => navigate("/Home/LabPatientList")}
            >
              Back
            </button> */}
          </div>
        </>}

      {department.map((dept, deptIndex) => (
        <div key={deptIndex}>
          <h3>{dept}</h3>
          <div className="samplecapture_component">

            <div className="Selected-table-container">
              {testDetails
                .filter((p) => p.department === dept && p.Culturetest === "Yes" && p.Test_Code !== "LTC1193" && p.Test_Code !== "LTC1116")
                .map((detail, index) => {
                  const originalIndex = testDetails.findIndex(
                    (item) => item.Test_Code === detail.Test_Code
                  );

                  return (
                    <table className="selected-medicine-table2">
                      <thead>
                        <tr>
                          <th>Test Name</th>
                          <th>Specimen</th>
                          <th>Micro Number</th>

                          {/* Render headers based on reporttype */}
                          {detail.Report_Type === "Sensitivity" && (
                            <>
                              <th>Colony Count</th>
                              <th>Capture Organism</th>
                              <th>Antibiotic</th>
                            </>
                          )}
                          {detail.Report_Type === "Ot" && <th>Preview</th>}
                          {detail.Report_Type === "NoGrowth" && detail.Report_Type === "Isolated" && <th>Colony Status</th>}


                          <th>Status</th>
                          <th>Verification</th>
                          {/* <th>
                        Trends
                      </th> */}

                          {hasRecollect ? (
                            <>
                              <th>Reflex</th>2<th>Sample</th>
                            </>
                          ) : null}
                        </tr>
                      </thead>

                      <tbody>
                        <tr key={index}>
                          <td>{detail.testname}</td>
                          <td><div className="organism_add">
                            <textarea style={{ width: "271px", height: "41px" }}
                              value={detail.Sample_Specimen || ""}
                              className="Capture_Status_select1"
                              onChange={(e) => {
                                const updatedDetails = [...testDetails];
                                updatedDetails[originalIndex] = {
                                  ...updatedDetails[originalIndex],
                                  Sample_Specimen: e.target.value,
                                }
                                setTestDetails(updatedDetails);
                              }}
                            />
                          </div></td>

                          {/* <td>{detail.Sample_Specimen}</td> */}
                          <td>
                            <input
                              type="text"
                              className="Capture_Status_select1"
                              value={detail.micronumber}
                              onChange={(e) => {
                                const updatedDetails = [...testDetails];
                                updatedDetails[originalIndex] = {
                                  ...updatedDetails[originalIndex],
                                  micronumber: e.target.value,
                                }
                                setTestDetails(updatedDetails);
                              }}
                            />
                          </td>

                          {/* Render row data based on reporttype */}
                          {detail.Report_Type === "Sensitivity" && (
                            <>
                              <td>{detail.colony_count}</td>
                              <td>{detail.Capture_Oragnism}</td>
                              <td>
                                <span
                                  onClick={() => {
                                    handleshowculturetest(detail.Test_Code);
                                  }}>
                                  <VisibilityIcon />
                                </span>
                              </td>
                            </>
                          )}

                          {detail.Report_Type === "Ot" && (
                            <td>
                              <span>
                                <VisibilityIcon onClick={handlepdfpreview1} />
                              </span>
                            </td>
                          )}

                          {detail.Report_Type === "NoGrowth" && detail.Report_Type === "Isolated" && <td>{detail.colony_status}</td>}


                          <td>{detail.Status}</td>
                          <td>
                            {detail.Status === "Retest" ? null : (
                              <select
                                name="status"
                                id="status"
                                className="Capture_Status_select"
                                value={detail.status}
                                onChange={(e) =>
                                  handleStatusChange(
                                    index,
                                    e.target.value,
                                    dept
                                  )
                                }
                              >

                                <option value="Approved">Approved</option>
                                <option value="">Pending</option>
                                <option value="Reverify">Reverify</option>
                                <option value="Retest">Retest</option>
                                <option value="Recollect">Recollect</option>
                              </select>
                            )}
                          </td>
                          {/* <td>
                          <span className='trends' onClick={() => handletrendview(detail.Test_Code)}><TbDelta /></span>
                        </td> */}
                          {detail.status === "Reflex" ? (
                            <>
                              <td>
                                <select
                                  name="reflextest"
                                  id="reflextest"
                                  className="Capture_Status_select"
                                  value={detail.reflextest}
                                  onChange={(e) =>
                                    handlereflexchange(
                                      index,
                                      e.target.value,
                                      dept
                                    )
                                  }
                                >
                                  <option value="">Select Reflex</option>
                                  {reflexlist?.map((item, idx) => (
                                    <option key={idx} value={item}>
                                      {item}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td>
                                <select
                                  name="reflexsample"
                                  id="reflexsample"
                                  className="Capture_Status_select"
                                  value={detail.reflexsample}
                                  onChange={(e) =>
                                    handlereflexsamplechange(
                                      index,
                                      e.target.value,
                                      dept
                                    )
                                  }
                                >
                                  <option value="">Select Sample</option>
                                  <option value="Same Sample">
                                    Same Sample
                                  </option>
                                  <option value="New Sample">New Sample</option>
                                </select>
                              </td>
                            </>
                          ) : null}
                        </tr>

                      </tbody>
                    </table>
                  );
                })}

              {dept === "MICROBIOLOGY" &&
                testDetails?.some(
                  (detail) => detail.Test_Code === "LTC1116"
                ) ? (
                <>
                  <table className="selected-medicine-table2">
                    <thead>
                      <tr>
                        <td>
                          <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                            <label htmlFor="PatientID">
                              Condition of the Specimen <span>:</span>
                            </label>
                            <input
                              type="text"
                              name="condition"
                              value={condition}
                              onChange={(e) => setCondition(e.target.value)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                            <label htmlFor="PatientID">
                              SRF ID <span>:</span>
                            </label>
                            <input
                              type="text"
                              name="srfid"
                              value={srfId}
                              onChange={(e) => setSrfId(e.target.value)}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="RegisForm_1 dctr_wrbvh_pice666 ">
                            <label htmlFor="PatientID">
                              ICMR ID <span>:</span>
                            </label>
                            <input
                              type="text"
                              name="icmrid"
                              value={icmrId}
                              onChange={(e) => setIcmrid(e.target.value)}
                            />
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <th>Test Name</th>
                        <th>Specimen</th>
                        {/* <th>Test Method</th> */}
                        <th>Type Of Test</th>
                        <th>COVID-19 Result</th>
                        <th>Verification</th>
                        {/* <th>Indicator</th> */}
                        {/* <th>
                            Remarks
                            <table className="remarktable">
                              <thead>
                                <tr>
                                  <th>Technical</th>
                                  <th>Medical</th>
                                </tr>
                              </thead>
                            </table>
                          </th> */}
                        {/* <th>Action</th> */}
                      </tr>
                    </thead>
                    <tbody>
                      {/* {console.log(testDetails)} */}
                      {testDetails?.map((detail, index) => {
                        const referenceArray = detail.referencedata
                          ? parseReferenceData(detail.referencedata)
                          : [];

                        const inputid = `input-${dept}-${index}`;
                        // { console.log('referenceArray', referenceArray) }
                        return (
                          <tr key={index}>
                            <td>{detail.testname}</td>
                            <td>{detail.Sample_Specimen || "N/A"}</td>
                            {/* <td>{detail.Test_Method}</td> */}
                            <td>
                              <input
                                id="method"
                                onChange={(e) => setTestType(e.target.value)}
                                value={testType}
                                name="method"
                                list="methodList"
                                autoComplete="off"
                                placeholder="Select Method"
                              />
                              <datalist id="methodList">
                                {methoddata?.map((row, index) => (
                                  <option
                                    key={index}
                                    value={row.Method_Name}
                                  />
                                ))}
                              </datalist>
                            </td>
                            <td>

                              <select value={covidTest} onChange={(e) => setCovidTest(e.target.value)} >
                                <option value="">Select</option>
                                <option value="Positive">Positive</option>
                                <option value="Negative">Negative</option>
                              </select>

                            </td>
                            <td>
                              {detail.Status === "Retest" ? (
                                "Retest"
                              ) : (
                                <select
                                  name="status"
                                  id="status"
                                  className="Capture_Status_select"
                                  value={detail.status}
                                  onChange={(e) =>
                                    handleStatusChange(index, e.target.value, dept)
                                  }
                                >

                                  <option value="Approved">Approved</option>
                                  <option value="">Pending</option>
                                  <option value="Reverify">Reverify</option>
                                  <option value="Retest">Retest</option>
                                  <option value="Recollect">Recollect</option>
                                </select>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </>
              ) :
                (dept !== "HISTOPATHOLOGY" && dept !== "CYTOLOGY" &&
                  !testDetails?.some(
                    (p) =>
                      p.department === dept &&
                      p.Culturetest === "Yes" && p.Iscutoffvalue === "Yes"
                  )
                  // &&!testDetails?.some(
                  //   (p) =>
                  //     p.department === "HAEMATOLOGY" &&
                  //     p.Test_Code === "LTC1193"
                  // )
                ) &&
                !testDetails?.some(
                  (detail) => detail.Test_Code === "LTC1116"
                ) && (
                  <>
                    {testDetails?.some(pack => pack.PackageName === "SEMEN ANALYSIS") && (
                      <>
                        <div className="horizontal-field">
                          <label className="field-label">Period of Abstinence</label>
                          <span>:</span>
                          <input
                            type="text"
                            name="abstinence"
                            value={abstinence}
                            onChange={(e) => setabstinence(e.target.value)}
                            className="field-input"
                          />
                        </div>

                        <div className="remark-block">
                          <label htmlFor="pathologyyesorno">
                            Any severe infection/chronic inflammatory disease/Medications for severe illness in past 6 months:
                          </label>
                          <textarea
                            id="pathologyyesorno"
                            name="pathologyyesorno"
                            value={pathologyyesorno}
                            className="remarks-textarea"
                            onChange={(e) => setpatologyyesorno(e.target.value)}
                          ></textarea>
                        </div>
                      </>
                    )}



                    <table className="selected-medicine-table2">

                      <thead>
                        <tr>
                          <th>Test Name</th>
                          {testDetails.some((detail) => detail.Sample_Specimen !== null) && (
                            <th>Specimen</th>
                          )}

                          <th>Units</th>
                          {testDetails.some((detail) => detail.Previous_Value !== null) && (
                            <th>
                              Previous Value
                            </th>
                          )}
                          <th>

                            Capture Value
                          </th>
                          <th>

                            Reference Range
                          </th>



                          {/* {testDetails.some((detail) => detail.inputtype === "Numeric") && (
                          <th>Indicator</th>
                        )} */}
                          {/* {ishistopathology && <th>Preview</th>} */}
                          {/* {testDetails.some((detail) => detail.Iscutoffvalue !== "Yes") && (
                                      <th>
                                        Remarks
                                        <table className="remarktable">
                                          <tr>
                                            <th>Technical</th>
                                            <th>Medical</th>
                                          </tr>
                                        </table>
                                      </th>
                                    )} */}


                          <th>Status</th>
                          <th>Verification</th>
                          {/* {
                                  !hasRecollect?(
                                  <th>Reflex</th>
                                  ):null
                               }
                              */}

                          <th>Trends</th>

                        </tr>
                      </thead>

                      <tbody>
                        {[...new Set(testDetails
                          .filter((detail) => detail.department === dept && detail.Culturetest !== "Yes" && detail.Test_Code !== "LTC1193")
                          .map((detail) => detail.PackageName)
                        )].map((packageName) => (
                          <React.Fragment key={packageName}>
                            <tr className="wertyyyy">
                              <td colSpan={8}>{packageName}</td>
                            </tr>
                            {[...new Set(testDetails
                              .filter((detail) => detail.department === dept && detail.PackageName === packageName && detail.Culturetest !== "Yes" && detail.Test_Code !== "LTC1193")
                              .map((detail) => detail.Group_Name)
                            )].map((groupName) => (
                              <React.Fragment key={groupName}>
                                {groupName && (
                                  <tr className="wertyyyy">
                                    <td colSpan={8}>{groupName}</td>
                                  </tr>
                                )}
                                {testDetails
                                  .filter((detail) =>
                                    detail.department === dept &&
                                    detail.PackageName === packageName &&
                                    detail.Group_Name === groupName &&
                                    detail.Culturetest !== "Yes" &&
                                    detail.Test_Code !== "LTC1193"
                                  )
                                  .map((detail, index) => (
                                    <tr key={detail.id}>
                                      <td>{detail.testname}</td>
                                      {testDetails.some((detail) => detail.Sample_Specimen !== null) && <td>{detail.Sample_Specimen}</td>}
                                      <td>{detail.uom}</td>
                                      {testDetails.some((detail) => detail.Previous_Value !== null) && (
                                        <td>{detail.Previous_Value}</td>
                                      )}
                                      <td>
                                        <input
                                          type="text"
                                          className="Capture_Status_select1"
                                          value={detail.Capture_Value || ""}
                                          onChange={(e) => handleChange(detail.analyseid, e.target.value)}
                                        />
                                      </td>
                                      <td>{detail.referencedata}</td>
                                      <td>{detail.Status}</td>
                                      <td>
                                        <select
                                          name="status"
                                          className="Capture_Status_select"
                                          value={detail.status}
                                          onChange={(e) => handleStatusChange(index, e.target.value, dept)}
                                        >
                                          <option value="Approved">Approved</option>
                                          <option value="">Pending</option>
                                          <option value="Reverify">Reverify</option>
                                          <option value="Retest">Retest</option>
                                          <option value="Recollect">Recollect</option>
                                        </select>
                                      </td>
                                      <td>
                                        <span className="trends" onClick={() => handletrendview(detail.Test_Code)}>
                                          <TbDelta />
                                        </span>
                                      </td>
                                    </tr>
                                  ))}
                              </React.Fragment>
                            ))}
                          </React.Fragment>
                        ))}
                        <tr className="remarks-row">
                          <td colSpan="100%">
                            <label htmlFor="pathologyremark" className="remarks-label">
                              Remarks<span>:</span>
                            </label>
                            <textarea
                              id="pathologyremark"
                              name="pathologyremark"
                              value={pathologyremark}
                              className="remarks-textarea"
                              onChange={(e) => handleRemarksChange(e.target.value)}
                            ></textarea>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </>
                )

              }


              {dept === "SEROLOGY" && (
                (() => {
                  const cutoffTests = testDetails.filter(
                    (test) => test.department === "SEROLOGY" && test.Iscutoffvalue === "Yes"
                  );

                  return cutoffTests.length > 0 ? (
                    <table className="selected-medicine-table2">
                      <thead>
                        <tr>
                          <th>Test Name</th>
                          <th>Cut Off Value</th>
                          <th>Absorbance Value</th>
                          <th>Result</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cutoffTests.map((detail, index) => {
                          const inputId = `input-cutoff-${index}`;
                          return (
                            <tr key={index}>
                              <td>{detail.testname}</td>
                              <td>
                                {detail.reference !== "Yes" ? (
                                  `${detail.paniclow} - ${detail.panichigh} ${detail.uom}`
                                ) : (
                                  detail.referencedata
                                )}
                              </td>
                              <td>
                                {detail.Calculation === "Yes" ? (
                                  detail.capturevalue
                                ) : (
                                  <input
                                    type="text"
                                    className="Capture_Status_select1"
                                    value={detail.Capture_Value}
                                    onChange={(e) =>
                                      handleChange(detail.analyseid, e.target.value)
                                    }
                                  />
                                )}
                              </td>
                              <td>
                                <input
                                  type="text"
                                  className="Capture_Status_select1"
                                  value={detail.Result}
                                  onChange={(e) =>
                                    handleResultChange(index, e.target.value, dept)
                                  }
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  ) : null;
                })()
              )}


              {(dept === "HISTOPATHOLOGY" || dept === "CYTOLOGY" ||
                (dept === "HAEMATOLOGY" && testDetails?.some((p) => p.Test_Code === "LTC1193"))
              ) && (
                  <table className="selected-medicine-table2">
                    <thead>
                      <tr>
                        <th>Test Name</th>
                        <th>Specimen</th>
                        <th>Preview</th>
                        <th>Edit</th>
                        <th>Upload</th>
                        <th>Status</th>
                        <th>Verification</th>
                        {hasRecollect && (
                          <>
                            <th>Reflex</th>
                            <th>Sample</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {testDetails
                        .filter((p) => {
                          if (p.department === "HAEMATOLOGY") {
                            return p.Test_Code === "LTC1193";
                          }
                          return p.department === dept;
                        })
                        .map((detail, index) => (
                          <tr key={index}>
                            <td>{detail.testname}</td>
                            <td>{detail.Sample_Specimen}</td>
                            <td>
                              <span onClick={() => handlepdfpreview(detail)}>
                                <VisibilityIcon />
                              </span>
                            </td>
                            <td>
                              <span onClick={() => handleeditpreview(detail)}>
                                <EditIcon />
                              </span>
                            </td>
                          <td>
                            <div style={{ display: "flex", gap: "10px" }}>
                              <input
                                type="file"
                                accept=".pdf"
                                id="Servicechoose"
                                required
                                style={{ display: "none" }}
                                onChange={(e) =>
                                  handlePDFupload(
                                    e.target.files[0],
                                    index,
                                    dept,
                                    detail.Test_Code,
                                    detail.Test_Code
                                  )
                                }
                              />
                              <label
                                htmlFor="Servicechoose"
                                className="RegisterForm_1_btns choose_file_update"
                                style={{ backgroundColor: "#ffffff" }}
                              >
                                <FileUploadIcon
                                  style={{
                                    fontSize: "32px",
                                    color: "var(--ProjectColor) !important",
                                  }}
                                />
                              </label>
                              <button
                                className="RegisterForm_1_btns choose_file_update"
                                onClick={() =>
                                  handleOpenPDF(file ? file : detail.reportfile)
                                } // ✅ fixed
                                style={{ backgroundColor: "#ffffff" }}
                              >
                                <PhotoCameraBackIcon
                                  style={{
                                    fontSize: "32px",
                                    color: "var(--ProjectColor) !important",
                                  }}
                                />
                              </button>
                            </div>
                          </td>
                            <td>{detail.Status}</td>
                            <td>
                              {detail.Status === "Retest" ? null : (
                                <select
                                  name="status"
                                  className="Capture_Status_select"
                                  value={detail.status}
                                  onChange={(e) => handleStatusChange(index, e.target.value, dept)}
                                >
                                  <option value="Approved">Approved</option>
                                  <option value="co-authorize">co-authorize</option>
                                  <option value="">Pending</option>
                                  <option value="Reverify">Reverify</option>
                                  <option value="Retest">Retest</option>
                                  <option value="Recollect">Recollect</option>
                                </select>
                              )}
                            </td>
                            {detail.status === "Reflex" && hasRecollect && (
                              <>
                                <td>
                                  <select
                                    name="reflextest"
                                    className="Capture_Status_select"
                                    value={detail.reflextest}
                                    onChange={(e) => handlereflexchange(index, e.target.value)}
                                  >
                                    <option value="">Select Reflex</option>
                                    {reflexlist?.map((item, idx) => (
                                      <option key={idx} value={item}>
                                        {item}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td>
                                  <select
                                    name="reflexsample"
                                    className="Capture_Status_select"
                                    value={detail.reflexsample}
                                    onChange={(e) =>
                                      handlereflexsamplechange(index, e.target.value)
                                    }
                                  >
                                    <option value="">Select Sample</option>
                                    <option value="Same Sample">Same Sample</option>
                                    <option value="New Sample">New Sample</option>
                                  </select>
                                </td>
                              </>
                            )}
                          </tr>
                        ))}
                      <tr className="remarks-row">
                        <td colSpan="100%">
                          <label htmlFor="pathologyremark" className="remarks-label">
                            Remarks<span>:</span>
                          </label>
                          <textarea
                            id="pathologyremark"
                            name="pathologyremark"
                            value={pathologyremark}
                            className="remarks-textarea"
                            onChange={(e) => handleRemarksChange(e.target.value)}
                          ></textarea>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                )}


            </div>
          </div>
        </div>
      ))}
      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handleverifydata}>
          Save
        </button>
      </div>

      {openModel && (
        <div
          className={isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"}
          onClick={() => setOpenModel(false)}
        >
          <div
            className="newwProfiles newwPopupforreason trend-chart-container"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ textAlign: "center", marginBottom: "20px" }}>Test Trend</h3>

            <div className="chart-wrapper">
              <ResponsiveContainer width="100%">
                <ComposedChart
                  data={dataline}
                  margin={{ top: 50, right: 40, left: 20, bottom: 30 }}
                  barCategoryGap="20%"
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis
                    dataKey="visit"
                    axisLine={true}
                    tickLine={true}
                    tick={{ fontSize: 12 }}
                    height={50}
                  />
                  <YAxis
                    domain={[0, 'dataMax + 20']}
                    axisLine={true}
                    tickLine={true}
                    tick={{ fontSize: 12 }}
                    width={50}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#fff',
                      border: '1px solid #ccc',
                      borderRadius: '4px'
                    }}
                  />

                  <Bar
                    dataKey="data"
                    name="Data Values"
                    fill="#8884d8"
                    fillOpacity={0.7}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={60}
                    label={{
                      position: 'top',
                      fontSize: 12,
                      fill: '#333',
                      fontWeight: 'bold',
                      offset: 10
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="data"
                    name="Trend"
                    stroke="#ff7300"
                    strokeWidth={3}
                    dot={{ r: 6, fill: '#ff7300' }}
                    activeDot={{ r: 8, fill: '#ff7300' }}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="Register_btn_con regster_btn_contsai">
              <button
                className="RegisterForm_1_btns"
                onClick={() => setOpenModel(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showmodel && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setshowmodel(false);
          }}
        >
          <div
            className="wwadsdsd iodjdjdjd"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="report-container">
              <h2 className="report-heading">Culture Test Report</h2>
              <div className="details-section">
                {testDetails?.length > 0 ? (
                  testDetails
                    .filter(
                      (detail) =>
                        detail.subdept === "MICROBIOLOGY" &&
                        detail.Report_Type === "Sensitivity"
                    )
                    .map((detail, index) => (
                      <div key={index}>
                        <p>
                          <strong>Specimen:</strong>{" "}
                          {editMode ? (
                            <textarea
                              value={detail.Sample_Specimen || ""}
                              onChange={(e) =>
                                handleDetailChange(index, "Sample_Specimen", e.target.value)
                              }
                            />
                          ) : (
                            detail.Sample_Specimen
                          )}
                        </p>
                        <p>
                          <strong>Site:</strong>{" "}
                          {editMode ? (
                            <textarea
                              value={detail.site || ""}
                              onChange={(e) =>
                                handleDetailChange(index, "site", e.target.value)
                              }
                            />
                          ) : (
                            detail.site
                          )}
                        </p>
                        <p>
                          <strong>Test Requested:</strong> {detail.testname}
                        </p>
                        <p>
                          <strong>Macroscopy:</strong>{" "}
                          {editMode ? (
                            <textarea
                              value={detail.macroscopy || ""}
                              onChange={(e) =>
                                handleDetailChange(index, "macroscopy", e.target.value)
                              }
                            />
                          ) : (
                            detail.macroscopy
                          )}
                        </p>
                        <p>
                          <strong>Microscopy:</strong>{" "}
                          {editMode ? (
                            <input
                              list="microscopyOptions"
                              value={detail.Microscopy_Data || ""}
                              onChange={(e) =>
                                handleDetailChange(index, "Microscopy_Data", e.target.value)
                              }
                            />
                          ) : (
                            detail.Microscopy_Data
                          )}
                          <datalist id="microscopyOptions">
                            {microscopyname?.map((option, index) => (
                              <option key={index} value={option.microscopyname} />
                            ))}
                          </datalist>
                        </p>
                        <p>
                          <strong>Acid Fast Staining:</strong>{" "}
                          {editMode ? (
                            <textarea
                              value={detail.acid_fast || ""}
                              onChange={(e) =>
                                handleDetailChange(index, "acid_fast", e.target.value)
                              }
                            />
                          ) : (
                            detail.acid_fast
                          )}
                        </p>
                        <p>
                          <strong>Time to Positivity:</strong>{" "}
                          {editMode ? (
                            <textarea
                              value={detail.positivity || ""}
                              onChange={(e) =>
                                handleDetailChange(index, "positivity", e.target.value)
                              }
                            />
                          ) : (
                            detail.positivity
                          )}
                        </p>
                        <p>
                          <strong>Comments:</strong>{" "}
                          {editMode ? (
                            <textarea
                              value={detail.Notes || ""}
                              onChange={(e) =>
                                handleDetailChange(index, "Notes", e.target.value)
                              }
                            />
                          ) : (
                            detail.Notes
                          )}
                        </p>
                      </div>
                    ))
                ) : (
                  <p>No Test Details Available</p>
                )}
              </div>
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
                        name="sensitiverange"
                        value={newEntry.sensitiverange || ""}
                        onChange={handlecultureChange}
                        placeholder="Sensitive Value"
                      />
                    </div>
                    <div className="input-container">
                      <input
                        type="text"
                        name="intermediaterange"
                        value={newEntry.intermediaterange || ""}
                        onChange={handlecultureChange}
                        placeholder="Intermediate Value"
                      />
                    </div>
                    <div className="input-container">
                      <input
                        type="text"
                        name="resistantrange"
                        value={newEntry.resistantrange || ""}
                        onChange={handlecultureChange}
                        placeholder="Resistant Value"
                      />
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
                      />
                    </div>
                    <div className="input-container">
                      <input
                        type="text"
                        name="ColonyCount"
                        value={newEntry.ColonyCount}
                        onChange={handlecultureChange}
                        placeholder="Colony count"
                      />
                    </div>
                  </div>
                  <div className="Register_btn_con">
                    <button className="RegisterForm_1_btns"
                      onClick={handleAddAntibiotic}>Add</button>
                  </div>
                </div>
              )}

              {Object.entries(groupedData).map(([organism, antibiotics], index) => (
                <div key={index} className="organism-section">
                  <h4>{organism}</h4>
                  {editMode ? (
                    <div className="colony-count-container">
                      <input
                        type="text"
                        value={antibiotics[0]?.ColonyCount || "-"}
                        onChange={(e) => handleColonyCountChange(organism, e.target.value)}
                      />
                      <button onClick={() => handleDeleteOrganism(organism)}>Delete Organism</button>
                    </div>
                  ) : (
                    <p>{antibiotics[0]?.ColonyCount}</p>
                  )}
                  <table className="antibiotic-table">
                    <thead>
                      <tr>
                        <th>Antibiotic</th>
                        <th>Sensitive Values</th>
                        <th>Capture Value</th>
                        <th>Sensitive Range</th>
                        <th>Intermediate Range</th>
                        <th>Resistant Range</th>
                        {editMode && (
                          <th>Action</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {antibiotics.map((item, idx) => (
                        <tr key={idx}>
                          <td>{item.antibiotic}</td>
                          <td>
                            {editMode ? (
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

                          <td>
                            {editMode ? (
                              <input
                                type="text"
                                value={item.Antibiotic_Value || ""}
                                onChange={(e) =>
                                  handleCaptureValueChange(organism, idx, "Antibiotic_Value", e.target.value)
                                }
                              />
                            ) : (
                              item.Antibiotic_Value || "-"
                            )}
                          </td>
                          <td>
                            {editMode ? (
                              <input
                                type="text"
                                value={item.sensitiverange || ""}
                                onChange={(e) =>
                                  handleCaptureValueChange(organism, idx, "sensitiverange", e.target.value)
                                }
                              />
                            ) : (
                              item.sensitiverange || "-"
                            )}
                          </td>
                          <td>
                            {editMode ? (
                              <input
                                type="text"
                                value={item.intermediaterange || ""}
                                onChange={(e) =>
                                  handleCaptureValueChange(organism, idx, "intermediaterange", e.target.value)
                                }
                              />
                            ) : (
                              item.intermediaterange || "-"
                            )}
                          </td>
                          <td>
                            {editMode ? (
                              <input
                                type="text"
                                value={item.resistantrange || ""}
                                onChange={(e) =>
                                  handleCaptureValueChange(organism, idx, "resistantrange", e.target.value)
                                }
                              />
                            ) : (
                              item.resistantrange || "-"
                            )}
                          </td>


                          <td>
                            {editMode && <button
                              className="delete-button"
                              onClick={() => handleDeleteAntibiotic(item.Culture_Id)}>Delete</button>}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}

              <div className="Register_btn_con">
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => {
                    if (editMode) {
                      handleupdatesencitivity();
                    }
                    setEditMode(!editMode);
                  }}
                >
                  {editMode ? "Update" : "Edit"}
                </button>
                <button className="RegisterForm_1_btns" onClick={handleCloseModal}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openpreview && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setopenpreview(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="Report_master_preview" id={`reactprintcontent`}>
              <div className="Report_master report_preview">

                <div
                  className="Register_btn_con"
                  style={{ color: "var(--labelcolor)", fontWeight: 600 }}
                >
                  Test Report
                </div>
                <div className="new_billing_address new_report_address">
                  <div className="new_billing_address_2">
                    {
                      <div className="Register_btn_con_barcode">
                        <div id="get_imagecontent_1">
                          <Barcode
                            value={patinetbillingbarcode || ""}
                            lineColor="black"
                            height={40}
                            width={1.2}
                            displayValue={true}
                            fontSize={12}
                          />
                        </div>
                      </div>
                    }
                    <div className="new_billing_div">
                      <label>
                        Patient Name <span>:</span>
                      </label>
                      <span>{capturedatas.Patient_Name}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Visit ID <span>:</span>
                      </label>
                      <span>{capturedatas.Visit_Id}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Age/Gender <span>:</span>
                      </label>
                      <span>
                        {capturedatas.Age}/{capturedatas.Gender}
                      </span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Phone <span>:</span>
                      </label>
                      <span>{capturedatas.Phone}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Reference Doctor <span>:</span>
                      </label>
                      <span>{capturedatas.Refering_Doctor}</span>
                    </div>
                  </div>
                  <div className="new_billing_address_2">
                    {
                      <div className="Register_btn_con_barcode">
                        <div id="get_imagecontent_2">
                          <Barcode
                            value={capturedatas.Barcode || ""}
                            lineColor="black"
                            height={40}
                            width={1.2}
                            displayValue={true}
                            fontSize={12}
                          />
                        </div>
                      </div>
                    }
                    <div className="new_billing_div">
                      <label>
                        Invoice No <span>:</span>
                      </label>
                      <span>{capturedatas.Billing_Invoice}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Collected <span>:</span>
                      </label>
                      <span>{report.Collected}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Received <span>:</span>
                      </label>
                      <span>{report.Received}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Reported <span>:</span>
                      </label>
                      <span>{report.Reported}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        {" "}
                        Barcode<span>:</span>
                      </label>
                      <span>{capturedatas.Barcode}</span>
                    </div>
                  </div>
                </div>

                <div className="histo_report_1111">
                  <div className="histo_report">
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        width: "100%",
                      }}
                      dangerouslySetInnerHTML={{
                        __html: content,
                      }}
                    />
                  </div>
                </div>
              </div>

              <div className="Register_btn_con regster_btn_contsai">
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => setopenpreview(false)}
                >
                  Close
                </button>
                {/* <button
                  className="RegisterForm_1_btns"
                  onClick={() => handleeditdocs()}
                >
                  Edit
                </button> */}
              </div>
            </div>
          </div>
        </div>
      )}

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
            <div className="Report_master_preview" id={`reactprintcontent`}>
              <div className="Report_master report_preview">
                <div className="New_billlling_invoice_head new_report_con">
                  <div className="new_billing_logo_con">
                    <img src={ClinicDetials.ClinicLogo} alt="Medical logo" />
                  </div>
                  <div className="new_billing_address_1 ">
                    <span>{ClinicDetials.ClinicName}</span>
                    <div>
                      <span>{ClinicDetials.ClinicAddress},</span>
                      <span>
                        {ClinicDetials.ClinicCity +
                          "," +
                          ClinicDetials.ClinicState +
                          "," +
                          ClinicDetials.ClinicCode}
                      </span>
                    </div>
                    <div>
                      <span>{ClinicDetials.ClinicMobileNo + " , "}</span>
                      <span>{ClinicDetials.ClinicLandLineNo + " , "}</span>
                      <span>{ClinicDetials.ClinicMailID}</span>
                    </div>
                  </div>
                </div>
                <div
                  className="Register_btn_con"
                  style={{ color: "var(--labelcolor)", fontWeight: 600 }}
                >
                  Test Report
                </div>
                <div className="new_billing_address new_report_address">
                  <div className="new_billing_address_2">
                    {
                      <div className="Register_btn_con_barcode">
                        <div id="get_imagecontent_1">
                          <Barcode
                            value={patinetbillingbarcode || ""}
                            lineColor="black"
                            height={40}
                            width={1.2}
                            displayValue={true}
                            fontSize={12}
                          />
                        </div>
                      </div>
                    }
                    <div className="new_billing_div">
                      <label>
                        Patient Name <span>:</span>
                      </label>
                      <span>{capturedatas.Patient_Name}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Visit ID <span>:</span>
                      </label>
                      <span>{capturedatas.Visit_Id}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Age/Gender <span>:</span>
                      </label>
                      <span>
                        {capturedatas.Age}/{capturedatas.Gender}
                      </span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Phone <span>:</span>
                      </label>
                      <span>{capturedatas.Phone}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Reference Doctor <span>:</span>
                      </label>
                      <span>{capturedatas.Refering_Doctor}</span>
                    </div>
                  </div>
                  <div className="new_billing_address_2">
                    {
                      <div className="Register_btn_con_barcode">
                        <div id="get_imagecontent_2">
                          <Barcode
                            value={capturedatas.Barcode || ""}
                            lineColor="black"
                            height={40}
                            width={1.2}
                            displayValue={true}
                            fontSize={12}
                          />
                        </div>
                      </div>
                    }
                    <div className="new_billing_div">
                      <label>
                        Invoice No <span>:</span>
                      </label>
                      <span>{capturedatas.Billing_Invoice}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Collected <span>:</span>
                      </label>
                      <span>{report.Collected}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Received <span>:</span>
                      </label>
                      <span>{report.Received}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        Reported <span>:</span>
                      </label>
                      <span>{report.Reported}</span>
                    </div>
                    <div className="new_billing_div">
                      <label>
                        {" "}
                        Barcode<span>:</span>
                      </label>
                      <span>{capturedatas.Barcode}</span>
                    </div>
                  </div>
                </div>

                {summa
                  .filter((p) => p.Department === "MICROBIOLOGY")
                  .map((group, index) => (
                    <table
                      className="report_table report_table_for_micro"
                      key={index}
                    >
                      <tbody className="print_body Selected-table-container">
                        <tr>
                          <td>
                            <h3>{group.groupName}</h3>

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
                                    __html: group.Tests[0]?.Content,
                                  }}
                                />
                              </div>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ))}
              </div>

              <div className="Register_btn_con regster_btn_contsai">
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => setopenpreview1(false)}
                >
                  Close
                </button>
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => handleeditdocs()}
                >
                  Edit
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {openeditpreview && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setopeneditpreview(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason"
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={contentRef} className="editor_life editor_lkkife">
              <div className="Histo_new_css_div_head">
                <h3>HISTOPATHOLOGY</h3>
                {/* {console.log(selectedTestCode)} */}

                <div className="hytt_9u76">
                  <div className="Histo_new_css_div_head_po90">
                    {formatData?.slice(0, 4).map((field) => (
                      <div
                        className="Histo_new_css_div first-four"
                        key={field.name}
                      >
                        {!field.format && (
                          <label>
                            {field.name.replace(/_/g, " ")} <span>:</span>
                          </label>
                        )}
                        {/* Only render textarea if field name is not 'format' */}
                        {!field.format ? (
                          <textarea
                            value={field.value || ""}
                            onChange={(e) =>
                              handleTextareaChange(e, field.name)
                            }
                            onInput={autoResizeTextarea}
                          />
                        ) : null}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="Histo_new_css_div_head_po90">
                  {formatData?.slice(4).map((field) => (
                    <div className="Histo_new_css_div" key={field.name}>
                      {!field.format && (
                        <label>
                          {field.name.replace(/_/g, " ")} <span>:</span>
                        </label>
                      )}
                      {field.name === "imageData" ? (
                        <div className="Histo_new_css_div_uHHHFH">

                          <label className="custom-file-upload">
                            <input type="file" onChange={handleImageChange} />
                            Choose File</label>

                          {imagePreview ? (
                            <img
                              src={imagePreview} // Show the new image preview
                              alt="Preview"
                              accept="image/*"
                              style={{
                                marginTop: "10px",
                                maxWidth: "170px",
                                borderRadius: "4px",
                              }}
                            />
                          ) : field.value ? (
                            <img
                              src={field.value} // Show the existing image from the table (backend)
                              alt="Existing"
                              accept="image/*"
                              style={{
                                marginTop: "10px",
                                maxWidth: "170px",
                                borderRadius: "4px",
                              }}
                            />
                          ) : null}
                        </div>
                      ) : (
                        !field.format && ( // Prevent rendering textarea for 'format'
                          <textarea
                            value={field.value || ""}
                            onChange={(e) =>
                              handleTextareaChange(e, field.name)
                            }
                            onInput={autoResizeTextarea}
                          />

                        )
                      )}
                    </div>
                  ))}
                </div>

                <div className="Register_btn_con regster_btn_contsai">
                  <button
                    className="RegisterForm_1_btns"
                    onClick={() => {
                      setopeneditpreview(false);
                    }}
                  >
                    Close
                  </button>
                  <button className="RegisterForm_1_btns" onClick={handleSubmitAnalyseReport}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
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
            initialContent={content}
            onChange={(newContent) => setEditorContent(newContent)}
          />


        )}
        {testDetails.length !== 0 &&
          <div style={{ textAlign: 'right', marginTop: 10 }}>
            <Button
              type="primary"
              onClick={handleSave}
              style={{ marginRight: 8 }}
            >
              Save
            </Button>
          </div>
        }

      </Modal>
    </>
  );
}

export default Pathologydata;
