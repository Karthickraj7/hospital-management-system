import React, { useState, useEffect, useRef, useCallback, forwardRef, useImperativeHandle } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { TiArrowDownThick, TiArrowUpThick } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import mammoth from "mammoth";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { Modal, Button, message, Spin } from 'antd';


import "./ckeditor-custom.css"; // Import custom CSS
// import Webcam from "react-webcam";
// import CameraswitchIcon from "@mui/icons-material/Cameraswitch";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import JoditEditor from 'jodit-react';
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";


// JoditRichEditor Component
const JoditRichEditor = forwardRef(({ initialContent = "", onChange }, ref) => {
  const editorRef = useRef(null);
  const [content, setContent] = useState(initialContent || '');

  const [internalContent, setInternalContent] = useState(initialContent);

  useEffect(() => {
    setInternalContent(initialContent); // update when parent changes initialContent
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
    editorCssClass: 'jodit-document',
    style: {
      fontFamily: 'Arial, sans-serif',
      whiteSpace: 'pre-wrap',
      lineHeight: '1.5',
    },
    showSourceButton: true,
    extraAllowedContent: 'p(*),ul(*),ol(*),li(*),strong(*),em(*),pre(*),h1(*),h2(*),h3(*)',
    buttons: [
      'bold', 'italic', 'underline', 'link', 'source', '|',
      'ul', 'ol', 'image', 'video', '|',
      'undo', 'redo', '|', 'hr', 'formatBlock', 'align', 'about',
    ],
    events: {
      beforeFileUpload: (files) => {
        for (let file of files) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const base64 = e.target.result;
            if (file.type.startsWith('video/')) {
              const videoHTML = `
                <video controls style="max-width:100%">
                  <source src="${base64}" type="${file.type}">
                  Your browser does not support the video tag.
                </video>`;
              editorRef.current?.editor.selection.insertHTML(videoHTML);
            } else {
              editorRef.current?.editor.selection.insertImage(base64, null, file.name);
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
    <div>
      <JoditEditor
        ref={editorRef}
        value={internalContent}
        config={config}
        onBlur={(newContent) => {
          setInternalContent(newContent);
          if (onChange) onChange(newContent); // send back to parent if needed
        }}
      />
    </div>
  );
});



function Reportcapture() {
  // const [value, setValue] = useState()

  const api_url = "https://playerofcode.in";

  const upload_endpoint = "api/auth/upload";

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

  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [loadingEditor, setLoadingEditor] = useState(false);
  // console.log("userRecord................", userRecord);

  // const [filteredRows, setFilteredRows] = useState([]);
  const [testDetails, setTestDetails] = useState([]);
  const [capOrganism, setcaptureOrganism] = useState({});
  const [selectrangetype, setselectrangeType] = useState({});
  const [antibioticorg, setallantibiotic] = useState([]);
  const [microscopyname, setMicrocopyName] = useState([]);
  const [micronumber, setMicronumber] = useState("");
  const [histonumber, setHistonumber] = useState("");
  const [htmlContent, setHtmlContent] = useState("");
  const [histotestcode, setHistotestcode] = useState("");
  const [editorVisible, setEditorVisible] = useState(false);
  const [docName, setDocName] = useState('');
  const [loading, setLoading] = useState(false);
  const [iscontinue, setIscontinue] = useState(false);
  const [error, setError] = useState(null);
  const [editorContent, setEditorContent] = useState("");
  const editorRef = useRef(null);
  // const [captureantibiotic, setcaptureantibiotic] = useState('');
  // const [sensitivetype, setsensitivetype] = useState('');
  // const [completeantibiotic, setcompleteantibiotic] = useState([]);
  const [reportformat, setreportformat] = useState("NoGrowth");
  const [reportstatus, setreportstatus] = useState("");
  const [wordtest, setwordtest] = useState([]);
  const [comments, setComments] = useState("");
  const [nogrowthreport, setnogrowthreport] = useState("");
  const [microscopy, setmicroscopy] = useState("");
  const capturedatas = useSelector((state) => state.userRecord?.Samplecapture);
  // console.log("capturedatas", capturedatas);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
  const [showAntibioticModal, setShowAntibioticModal] = useState(false);
  const [antibac, setantibac] = useState([]);
  const [specimenName, setSpecimenName] = useState({});

  const [bacteriaisolated, setbacteriaisolated] = useState("");

  const [selecteddept, setselecteddept] = useState();

  const [showFile, setShowFile] = useState({
    file1: false,
  });
  const [isImageCaptured1, setIsImageCaptured1] = useState(false);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  // const [facingMode, setFacingMode] = useState("user");
  // const devices = ["iPhone", "iPad", "Android", "Mobile", "Tablet", "desktop"];
  // const [IsmobileorNot, setIsmobileorNot] = useState(null);
  const [samplepicture, setsamplepicture] = useState(null);
  const dispatchvalue = useDispatch();
  const [sensitivityLevels, setSensitivityLevels] = useState({});
  // const [department, setDepartment] = useState([])
  // const, setselectdepartment] = useState()
  const [openpreview, setopenpreview] = useState(false);
  const [selectedAntibiotics, setSelectedAntibiotics] = useState({});
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const contentRef = useRef(null);
  const [selectedTestCode, setSelectedTestCode] = useState(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked1, setIsChecked1] = useState(false);
  const [activeTest, setActiveTest] = useState(null);
  const [testFormats, setTestFormats] = useState({});
  const [openpreview1, setopenpreview1] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [labtechdatas, setlabtechdatas] = useState("");
  const handleCheckboxChangeComment = (e) => {
    setIsChecked(e.target.checked);
  };
  const handleCheckboxChangeComment1 = (e) => {
    setIsChecked1(e.target.checked);
  };

  const [formData3, setFormData3] = useState({
    CapturedImage1: null,
  });

  const inputRefs = useRef([]);

  const [crop, setCrop] = useState({
    unit: "%",
    width: 100, // Full width initially
    height: 100, // Full height initially
    x: 0, // Start at the top-left corner
    y: 0,
  });
  const [completedCrop, setCompletedCrop] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [isCropping, setIsCropping] = useState(false);
  const [originalImageFile, setOriginalImageFile] = useState(null); // Store the original image
  const [originalImagePreview, setOriginalImagePreview] = useState(null);
  const imgRef = useRef(null);


  const [condition, setCondition] = useState("");
  const [srfId, setSrfId] = useState("");
  const [icmrId, setIcmrid] = useState("");
  const [methoddata, setMethodData] = useState([]);
  const [testType, setTestType] = useState("");
  const [covidTest, setCovidTest] = useState("");
  const [pathologyyesorno, setpatologyyesorno] = useState("");
  const [pathologyremark, setpathologyremark] = useState("");
  const [abstinence, setabstinence] = useState("");
  const [microFind, setmicroFind] = useState("")

  const [fluidSps, setFluidSps] = useState("")


  const [file, setFile] = useState(null);
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



  useEffect(() => {
    axios
      .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=MethodsMaster`)
      .then((response) => {
        const data = response.data;
        // console.log("data", data);

        setMethodData(data);
      })
      .catch((error) => {
        console.error("Error fetching method data:", error);
      });
  }, [urllink]);




  useEffect(() => {
    axios
      .get(`${urllink}Lab/get_labtech_forlab?employeeid=${userRecord.Employee_Id}`)
      .then((response) => {
        const data = response.data.Name;
        // console.log("data", data);

        setlabtechdatas(data);
      })
      .catch((error) => {
        console.error("Error fetching method data:", error);
      });
  }, [urllink, userRecord.Employee_Id]);


  // Handle keydown event
  const handleInputNavigation = (e, dept, currentIndex) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevent form submission or default behavior

      // Identify the next input field
      const nextInput = document.getElementById(
        `input-${dept}-${currentIndex + 1}`
      );
      if (nextInput) {
        nextInput.focus(); // Focus the next input if it exists
      }
    }
  };

  // const videoConstraints = {
  //     facingMode: facingMode,
  // };
  const webcamRef1 = useRef(null);
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(",")[1]);
    const mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ab], { type: mimeString });
  };

  // const switchCamera = () => {
  //     setFacingMode((prevMode) => (prevMode === "user" ? "environment" : "user"));
  // };
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setShowFile(selectedFile);
    }
  };
  // console.log("--------content-1----", content);

  const loadWordFile = async (arrayBuffer) => {
    try {
      const { value, messages } = await mammoth.convertToHtml({ arrayBuffer });

      // Optional: Log warnings if you want to see them
      if (messages && messages.length > 0) {
        console.warn("Conversion warnings:", messages);
      }
      // console.log("sssssssss", value);

      setContent(value);
    } catch (error) {
      console.error("Error converting DOCX to HTML:", error);
    }
  };

  // console.log("--------content-2----", content);

  // const loadWordFile = async (arrayBuffer) => {
  //   try {
  //     const options = {
  //       styleMap: [
  //         "p[style-name='List Paragraph'] => ul > li:fresh",
  //         // Add other custom style mappings here
  //       ]
  //     };

  //     const { value, messages } = await mammoth.convertToHtml({ arrayBuffer }, options);

  //     if (messages && messages.length > 0) {
  //       console.warn("Conversion warnings:", messages);
  //     }

  //     setContent(value); // Update your state with the converted HTML
  //   } catch (error) {
  //     console.error("Error converting DOCX to HTML:", error);
  //   }
  // };

  useEffect(() => {
    const departmentCodes = userRecord?.Lab_Department?.join(',');
    axios
      .get(
        `${urllink}Lab/getcompletedsample?Billinginvoice=${capturedatas?.Billing_Invoice}&Location=${userRecord?.location}&gender=${capturedatas.Gender}&age=${capturedatas?.Age}&timeperiod=${capturedatas?.Time_Period}&Department=${departmentCodes}&Location=${userRecord?.location}`
      )
      .then((response) => {
        // console.log("------------", response);
        const data = response.data.map((item, index) => ({
          id: index + 1, // Assigning a unique id based on the item index
          testcode: item.Test_Code,
          testname: item.Test_Name,
          testnames: item.Test_Name,
          Captured_Unit: item.Captured_Unit,
          Container_Name: item.Container_Name,
          Specimen_Name: item.Specimen_Name,
          UpdateAt: capturedatas.UpdatedAt,
          paniclow: item.PanicLow,
          panichigh: item.PanicHigh,
          Calculation: item.Calculation,
          Formula: item.Formula,
          patient_name: capturedatas.Patient_Name,
          Billing_Invoice: capturedatas.Billing_Invoice,
          barcodedata: capturedatas.Barcode_Id,
          parameterone: item.Parameterone,
          parametertwo: item.parametertwo,
          Colonycount: item.Colonycount || "",
          uom: item.UOM,
          culturetest: item.culturetest || "",
          inputtype: item.input_type,
          organisn: item.Organism || [],
          antibiotic: item.Antibiotic || [],
          subdepartment: item.Department,
          reference: item.Reference,
          referencedata: item.Referencedata,
          Iscutoffvalue: item.Iscutoffvalue,
          Test_Method: item.Test_Method || "",
          capturevalue: item.capturevalue,
          selectedFormat: selectedFormat,
          is_sub_test: item.is_sub_test,
          sub_test_code: item.sub_test_code,
          transferlocation: item.Transfer,
          Group_Or_Offer_Name: item.Group_Or_Offer_Name,
          PackageName: item.PackageName, // Add PackageName
          Group_Name: item.Group_Name,
          Previous_Value: item.Previous_Value,
          Group_Code: item.Group_Code,
          // captureOrganism : captureOrganism

          // You don't need to explicitly include the 'actions' field here
        }));
        // console.log("------Data------", data);
        const Department = [];
        data.map((item) => {
          if (!Department.includes(item.subdepartment)) {
            Department.push(item.subdepartment);
          }
        });

        // console.log("--------Department------", Department);
        setFilteredDepartments(Department);
        // setFilteredRows(data);
        setTestDetails(data);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      });
  }, [capturedatas, urllink, userRecord]);

  // console.log("testDetails", testDetails);


  useEffect(() => {
    // console.log("updatedOrganisms", capOrganism, selectrangetype, specimenName);

    testDetails.forEach((detail) => {
      if (
        selectrangetype[detail.testcode] &&
        capOrganism[detail.testcode] &&
        specimenName[detail.testcode] &&
        detail.culturetest === "Yes" &&
        detail.testcode !== "LTC1116"
      ) {
        axios
          .get(
            `${urllink}Masters/getantibioticbyorganism?organismname=${encodeURIComponent(
              capOrganism[detail.testcode]
            )}&rangetype=${encodeURIComponent(
              selectrangetype[detail.testcode]
            )}&Specimen=${encodeURIComponent(specimenName[detail.testcode])}`
          )
          .then((response) => {
            setallantibiotic(response.data);

          })
          .catch((error) => {
            console.error(`Error fetching antibiotics for test ${detail.testcode}:`, error);
          });
      }
    });
  }, [urllink, capOrganism, selectrangetype, specimenName, testDetails]);









  useEffect(() => {
    axios
      .get(
        `${urllink}Masters/getmicroname`
      )
      .then((response) => {
        setMicrocopyName(response.data)
        // console.log(response)
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
      })
  }, [urllink])

  // useEffect(() => {
  //   // console.log("djsjsd", capturedatas)
  //   console.log("djsjsd", testDetails , capturedatas?.Barcode_Id)
  //   axios
  //     .get(
  //       `${urllink}Lab/getmachineinterfaceresult?sampleid=${capturedatas?.Barcode_Id}?=Test_Codes=${testDetails}`
  //     )
  //     .then((response) => {
  //       // console.log("------------", response);
  //       const data = response.data;

  //       // Create a copy of testDetails and update capturevalue for matching testcode

  //       if (data.length > 0 && testDetails.length > 0) {
  //         let foundmatch = false;
  //         const updatedTestDetails = testDetails.map((testDetail) => {
  //           // console.log(testDetail.testcode, "7uy84y8789");
  //           const matchingResult = data.find(
  //             (item) => item.LIS_MACHTESTID === testDetail.testcode
  //           );
  //           // console.log("matchingResult", matchingResult);
  //           if (matchingResult) {
  //             foundmatch = true;
  //             return {
  //               ...testDetail,
  //               capturevalue: matchingResult.LIS_MACHRESULTS,
  //             };
  //           }
  //           return testDetail;
  //         });
  //         if (!foundmatch) {
  //           alert("Sample is still not processed");
  //         }

  //         setTestDetails(updatedTestDetails);
  //       }
  //       // Optional: If you need to use machine results separately
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data: ", error);
  //     });
  // }, [
  //   capturedatas?.Barcode,
  //   testDetails.testcode,
  //   urllink,
  //   testDetails.length,
  // ]);

useEffect(() => {
  if (!capturedatas?.Barcode_Id || testDetails.length === 0) return;

  const testCodes = testDetails.map(td => td.testcode).join(",");

  console.log("Barcode:", capturedatas.Barcode_Id);
  console.log("Test Codes:", testCodes);

  axios
    .get(
      `${urllink}Lab/getmachineinterfaceresult`,
      {
        params: {
          sampleid: capturedatas.Barcode_Id,
          Test_Codes: testCodes,
        },
      }
    )
    .then((response) => {
      const data = response.data;

      if (data.length > 0) {
        let foundmatch = false;

        const updatedTestDetails = testDetails.map((testDetail) => {
          const matchingResult = data.find(
            (item) => item.LIS_MACHTESTID === testDetail.testcode
          );

          if (matchingResult) {
            foundmatch = true;
            return {
              ...testDetail,
              capturevalue: matchingResult.LIS_MACHRESULTS,
            };
          }
          return testDetail;
        });

        if (!foundmatch) {
          alert("Sample is still not processed");
        }

        setTestDetails(updatedTestDetails);
      }
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });

}, [capturedatas?.Barcode_Id, testDetails.length, urllink]);

  const handleinputchange = (index, value, field) => {
    console.log("Input-------", index, value, field);

    setTestDetails(prevDetails => {
      const updatedDetails = [...prevDetails];
      if (index < 0 || index >= updatedDetails.length) {
        console.warn("Invalid index:", index);
        return prevDetails;
      }
      if (field) {
        updatedDetails[index] = {
          ...updatedDetails[index],
          [field]: value === "" ? "" : value,
        };
      } else {
        updatedDetails[index] = {
          ...updatedDetails[index],
          capturevalue: value === "" ? "" : value,
        };
      }

      return updatedDetails;
    });
  };

  console.log("test----------", testDetails);


  const handleRemarksChange = (indexInFiltered, newValue, dept, packageName, groupName) => {
    setTestDetails(prevDetails => {
      // Filter by dept, package, group
      const filteredList = prevDetails.filter(p =>
        p.subdepartment === dept &&
        (p.PackageName || "No Package") === packageName &&
        (p.Group_Name || "No Group") === groupName &&
        p.culturetest !== "Yes"
      );

      // Get the actual item
      const actualItem = filteredList[indexInFiltered];
      if (!actualItem) return prevDetails;

      // Find its real index in full list
      const actualIndex = prevDetails.findIndex(
        p =>
          p.subdepartment === dept &&
          (p.PackageName || "No Package") === packageName &&
          (p.Group_Name || "No Group") === groupName &&
          p.testcode === actualItem.testcode
      );

      if (actualIndex === -1) return prevDetails;

      // Update the test detail
      const updatedDetails = [...prevDetails];
      updatedDetails[actualIndex] = {
        ...updatedDetails[actualIndex],
        capturevalue: newValue,
        ...(updatedDetails[actualIndex].culturetest === "Yes" && {
          Colonycount: newValue,
        }),
      };

      return updatedDetails;
    });
  };


  const handleRefernceChange = (indexInFiltered, newValue, dept, packageName, groupName) => {
    setTestDetails(prevDetails => {
      // Filter by dept, package, group
      const filteredList = prevDetails.filter(p =>
        p.subdepartment === dept &&
        (p.PackageName || "No Package") === packageName &&
        (p.Group_Name || "No Group") === groupName &&
        p.culturetest !== "Yes"
      );

      // Get the actual item
      const actualItem = filteredList[indexInFiltered];
      if (!actualItem) return prevDetails;

      // Find its real index in full list
      const actualIndex = prevDetails.findIndex(
        p =>
          p.subdepartment === dept &&
          (p.PackageName || "No Package") === packageName &&
          (p.Group_Name || "No Group") === groupName &&
          p.testcode === actualItem.testcode
      );

      if (actualIndex === -1) return prevDetails;

      // Update the test detail
      const updatedDetails = [...prevDetails];
      updatedDetails[actualIndex] = {
        ...updatedDetails[actualIndex],
        referencedata: newValue,
      };

      return updatedDetails;
    });
  };

  const handleValueChange = (indexInFiltered, newValue, dept, packageName, groupName) => {
    setTestDetails(prevDetails => {
      // Filter by dept, package, group
      const filteredList = prevDetails.filter(p =>
        p.subdepartment === dept &&
        (p.PackageName || "No Package") === packageName &&
        (p.Group_Name || "No Group") === groupName &&
        p.culturetest !== "Yes"
      );

      // Get the actual item
      const actualItem = filteredList[indexInFiltered];
      if (!actualItem) return prevDetails;

      // Find its real index in full list
      const actualIndex = prevDetails.findIndex(
        p =>
          p.subdepartment === dept &&
          (p.PackageName || "No Package") === packageName &&
          (p.Group_Name || "No Group") === groupName &&
          p.testcode === actualItem.testcode
      );

      if (actualIndex === -1) return prevDetails;

      // Update the test detail
      const updatedDetails = [...prevDetails];
      updatedDetails[actualIndex] = {
        ...updatedDetails[actualIndex],
        Result: newValue,
      };

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



  const handleantibiotic = () => {
    navigate("/Home/Antibioticmaster");
  };

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  useEffect(() => {
    const updatedTestDetails = testDetails.map((test) => {
      if (test.Calculation === "Yes") {
        const formula = test.Formula.trim();
        // console.log("formula", formula);
        const parts = tokenizeFormula(formula); // Tokenize formula excluding parentheses and operators

        const parameters = {};
        // console.log("parts", parts);

        // Populate parameters with values from  testDetails
        parts.forEach((element) => {
          if (isNaN(element)) {
            const parameterTest = testDetails.find(
              (item) => item.testcode === element
            );
            // console.log("parameterTest", parameterTest);
            parameters[element] = parameterTest
              ? parseFloat(parameterTest.capturevalue) || 0
              : 0;
          }
        });

        // Evaluate expression using parameters
        return evaluateExpression(formula, parameters)
          .then((result) => {
            // console.log("res........", result);
            return { ...test, capturevalue: parseFloat(result) || 0 }; // Return a new object with updated capturevalue
          })
          .catch((error) => {
            console.error("Error evaluating expression:", error);
            return { ...test, capturevalue: 0 }; // Return a new object with capturevalue set to 0 in case of error
          });
      }
      return test;
    });

    // Wait for all promises to resolve
    Promise.all(updatedTestDetails).then((updatedTestDetailsResolved) => {
      // Check if the updatedTestDetailsResolved is different from the current state
      const isTestDetailsChanged =
        JSON.stringify(updatedTestDetailsResolved) !==
        JSON.stringify(testDetails);

      // Update the state only if the testDetails has changed
      if (isTestDetailsChanged) {
        setTestDetails(updatedTestDetailsResolved);
      }
    });
  }); // Depend on testDetails to trigger the effect

  async function evaluateExpression(tokens, parameters) {
    // console.log(parameters);
    try {
      const response = await axios.get(
        `${urllink}Lab/getformula_calculated_value`,
        {
          params: {
            formula: tokens,
            parameters: JSON.stringify(parameters),
          },
        }
      );
      // console.log(response.data);
      const currentOperand = response.data?.valll;
      // console.log(currentOperand, "0000000000000000");
      return parseFloat(currentOperand) || 0;
    } catch (error) {
      console.error("Error fetching expression:", error);
      return 0;
    }
  }

  function tokenizeFormula(formula) {
    // Add spaces around operators and parentheses to tokenize them properly
    formula = formula.replace(/([+\-*/%^()])/g, " $1 ");
    // Split by spaces to get tokens

    const tokens = formula.split(/\s+/).filter((token) => token.trim() !== "");

    // Remove parentheses and operators from tokens
    return tokens.filter(
      (token) => !["(", ")", "+", "-", "*", "/", "%", "^"].includes(token)
    );
  }

  const handleaddneworaganism = () => {
    navigate("/Home/OrganismMaster");
  };

  const handleCheckboxChange = (antibiotic, testcode) => {
    setSelectedAntibiotics((prevSelected) => {
      const testSelections = prevSelected[testcode] || {};

      if (antibiotic === "All") {
        const allAntibiotics = getFilteredAntibiotics().filter(
          (item) => item !== "All"
        );
        const areAllSelected = allAntibiotics.every(
          (item) => testSelections[item]
        );

        const newTestSelections = areAllSelected
          ? {}
          : allAntibiotics.reduce((acc, item) => {
            acc[item] = true;
            return acc;
          }, {});

        return { ...prevSelected, [testcode]: newTestSelections };
      } else {
        return {
          ...prevSelected,
          [testcode]: {
            ...testSelections,
            [antibiotic]: !testSelections[antibiotic],
          },
        };
      }
    });
  };
  const [antibioticValues, setAntibioticValues] = useState({})




  console.log("----Anti-Bio------", antibioticValues)

  const handlemedicalRemarksChange = (index, newValue) => {
    const updatedTestDetails = [...testDetails];
    updatedTestDetails[index].medicalremark = newValue;
    setTestDetails(updatedTestDetails);
  };

  const handletecnicalRemarksChange = (index, newValue) => {
    const updatedTestDetails = [...testDetails];
    updatedTestDetails[index].technicalremark = newValue;
    setTestDetails(updatedTestDetails);
  };

  const handlenavigateagesetupmaster = () => {
    navigate("/Home/TestMastersNavigation");
  };

  const antibioticValue = (e, testcode, antibiotic, field) => {
    setAntibioticValues((prev) => {
      const testSelections = prev[testcode] || {};
      const current = testSelections[antibiotic] || {};
      return {
        ...prev,
        [testcode]: {
          ...testSelections,
          [antibiotic]: {
            ...current,
            [field]: e.target.value,
          },
        },
      };
    });
  };



  const getFilteredAntibiotics = () => {
    const allAntibiotics = antibioticorg.map((antibiotic) => antibiotic.anti_biotic);
    const filteredAntibiotics = allAntibiotics.filter(
      (antibiotic) => !(antibiotic in sensitivityLevels)
    );
    return ["All", ...filteredAntibiotics];
  };

  const handleSensitivityChange = (level) => {
    let hasSelection = false;
    let missingValues = [];

    const updatedLevels = { ...sensitivityLevels };

    Object.keys(selectedAntibiotics).forEach((testcode) => {
      Object.keys(selectedAntibiotics[testcode] || {}).forEach((antibiotic) => {
        if (selectedAntibiotics[testcode][antibiotic]) {
          hasSelection = true; // At least one selected
          const uservalue = antibioticValues[testcode]?.[antibiotic]?.uservalue || "";

          //  Check if uservalue is missing
          if (!uservalue.trim()) {
            missingValues.push(`${antibiotic} (${testcode})`);
            return; // Skip this item if no value
          }

          const antibioticInfo = antibioticorg.find((a) => a.anti_biotic === antibiotic) || {};
          updatedLevels[antibiotic] = {
            level,
            uservalue,
            sensitiverange: antibioticInfo.sensitiverange || "",
            intermediaterange: antibioticInfo.intermediaterange || "",
            resistantrange: antibioticInfo.resistantrange || "",
          };
        }
      });
    });

    if (!hasSelection) {
      alert("Please select at least one antibiotic before continuing.");
      return;
    }

    if (missingValues.length > 0) {
      alert(`Please enter values for the following selected antibiotics:\n\n${missingValues.join('\n')}`);
      return;
    }

    setSensitivityLevels(updatedLevels);
    setSelectedAntibiotics({});
  };




  console.log("-------------Test------------", testDetails);

  const handleSubmitAnalyseReport = () => {

    const isAnySensitiveMicro = testDetails.some(
      (item) =>
        item.subdepartment === "MICROBIOLOGY" &&
        item.reportformat === "Sensitivity"
    );

    if (isAnySensitiveMicro && iscontinue !== true) {
      alert("Please click continue before submitting the report.");
      return;
    }
    const errors = [];
    const valids = [];

    // Iterate over all test details
    testDetails.forEach((item) => {
      const {
        subdepartment,
        culturetest,
        Colonycount,
        capturevalue,
        testname,
        Calculation,
        testcode,
        content,
        reportformat,
      } = item;


      if (
        subdepartment === "MOLECULAR" ||
        subdepartment === "TUMAR MARKAR" ||
        subdepartment === "COAGULATION" ||
        subdepartment === "IMMUNOCHEMISTRY" ||
        subdepartment === "IMMUNOLOGY" ||
        subdepartment === "ENDOCRINOLOGY" ||
        subdepartment === "BLOOD GAS ANALYSIS" ||
        subdepartment === "IRON PROFILE" ||
        subdepartment === "HAEMATOLOGY-BB" ||
        subdepartment === "BIOCHEMISTRY" ||
        subdepartment === "LAB" ||
        (subdepartment === "HAEMATOLOGY" && testcode !== "LTC1193") ||
        subdepartment === "CLINICALPATHOLOGY" ||
        subdepartment === "HORMONE" ||
        subdepartment === "SEROLOGY" ||
        subdepartment === "MICROBIOLOGY" && culturetest !== "Yes" &&
        reportformat !== "Ot"
      ) {
        // Check if capturevalue is empty
        if (testcode === "LTC1116") {
          valids.push(item); // Directly push to valids without any checks
        } else {
          if (capturevalue === "") {
            errors.push({
              ...item,
              message: `${testname} - Capture value not entered.`,
            });
          } else {
            console.log("-----------t------", item);
            // valids.push(item);
            if (item.PackageName === "FLUID TC, DC") {
              valids.push({
                ...item,
                Specimen_Name: fluidSps
              });
            } else {
              valids.push(item);
            }
          }
        }

      } else if (
        subdepartment === "BIOCHEMISTRY" ||
        subdepartment === "LAB" ||
        (subdepartment === "HAEMATOLOGY" && testcode !== "LTC1193") ||
        subdepartment === "CLINICALPATHOLOGY" ||
        subdepartment === "HORMONE" ||
        subdepartment === "SEROLOGY" ||
        subdepartment === "MICROBIOLOGY" && culturetest !== "Yes" &&
        reportformat !== "Ot"
      ) {
        if (Calculation === "Yes" && capturevalue === 0) {
          errors.push({
            ...item,
            message: `${testname} - Capture value not entered.`,
          });
        } else {
          valids.push(item);
        }
      } else if (
        subdepartment === "MICROBIOLOGY" &&
        culturetest === "Yes" &&
        reportformat !== "Ot" &&
        testcode !== "LTC1116"
      ) {
        if (Colonycount === "") {
          errors.push({
            ...item,
            message: `${testname} - Colony count not entered.`,
          });
          // Colonycount = '-';
          // valids.push(item);
        } else {
          valids.push(item);
        }
      } else if (
        subdepartment === "MICROBIOLOGY" &&
        culturetest === "Yes" &&
        reportformat === "Ot"
      ) {
        if (content === "") {
          errors.push({
            ...item,
            message: `${testname} - Content not entered.`,
          });
        } else {
          valids.push(item);
        }
      } else if (subdepartment === "HISTOPATHOLOGY" || subdepartment === "CYTOLOGY" || testcode === "LTC1193") {
        valids.push(item);
      } else if (
        subdepartment === "MICROBIOLOGY" &&
        culturetest === "Yes" &&
        testcode === "LTC1116"
      ) {
        if (condition === "" || testType === "" || covidTest === "") {
          errors.push({
            ...item,
            message: `Please Fill Specimen Condition, Test Method and Covid Result.`,
          });
        } else {
          valids.push(item);
        }
      }
    });

    // Check if there are any errors
    if (errors.length > 0) {
      // Collect error messages into a single alert
      const errorMessages = errors.map((err) => err.message).join("\n");

      // Display an alert with error details and confirm to proceed
      const proceed = window.confirm(
        `The following errors were found:\n\n${errorMessages}\n\nDo you want to proceed?`
      );

      if (proceed) {
        console.log("User chose to proceed despite the errors.");
      } else {
        console.log("User cancelled the operation.");
      }
    }

    // Log the valid and error items for further use
    console.log("Errors:", errors);
    console.log("Valid Items:", valids);

    const validPanicAlerts = [];

    valids.forEach((item) => {
      const {
        subdepartment,
        capturevalue,
        testname,
        paniclow,
        panichigh,
        reference,
        referencedata,
      } = item;

      if (
        (subdepartment === "BIOCHEMISTRY" || subdepartment === "HAEMATOLOGY") &&
        reference !== "Yes"
      ) {
        // console.log(capturevalue, testname, typeof(paniclow), typeof(panichigh), "isisisisisisisisisisisisis");

        // Check if capturevalue is greater than or equal to panichigh or less than or equal to paniclow
        const hasValue = (val) => val !== undefined && val !== null && val !== "";
        if (hasValue(panichigh) && hasValue(paniclow)) {
          if (
            Number(capturevalue) >= Number(panichigh) ||
            Number(capturevalue) <= Number(paniclow)
          ) {
            validPanicAlerts.push(`${testname} - Value is out of normal range.`);
          }
        }
      } else if (
        (subdepartment === "BIOCHEMISTRY" || subdepartment === "HAEMATOLOGY") &&
        reference === "Yes"
      ) {
        // If not a normal case, parse the reference data
        const referenceArray = parseReferenceData(referencedata);
        const status = getStatus1(Number(capturevalue), referenceArray);
        // console.log('status', status);

        if (status !== "Normal") {
          // If the status is not unknown, add an alert
          validPanicAlerts.push(`${testname} -Value is out of normal range.`); // Access the children of the span for display
        }
      }
    });

    // Check if there are any valid panic alerts
    if (validPanicAlerts.length > 0) {
      const panicMessages = validPanicAlerts.join("\n");

      // Display an alert for valid items within panic range
      const proceedPanic = window.confirm(
        `The following valid items are within the panic range:\n\n${panicMessages}\n\nDo you want to proceed?`
      );

      if (proceedPanic) {
        console.log("User chose to proceed with valid panic alerts.");
      } else {
        console.log("User cancelled the operation for valid panic alerts.");
      }
    }
    let currentContent = "";

    const histoItem = testDetails.find(
      (item) => item.subdepartment === "CYTOLOGY" || item.subdepartment === "HISTOPATHOLOGY" || item.testcode === "LTC1193"
    );

    if (histoItem) {
      currentContent = editorRef.current?.getContent?.() || "";
    }

    console.log("find--------", microFind);

    if (microFind && microFind !== "") {
      valids.forEach(q => {
        q.microscopy = (q.microscopy || "") + "??" + microFind;
      });
    }


    const postdata = {
      valids,
      Billing_Invoice: capturedatas.Billing_Invoice,
      visitid: capturedatas.Visit_Id,
      patient_Id: capturedatas.Patient_Id,
      CreatedBy: userRecord?.username,
      Location: userRecord?.location,
      captureOrganism: capOrganism,
      content: currentContent || "",
      Photo: samplepicture,
      Notes: comments || "",
      microscopy: microscopy || "",
      reportformat: reportformat || "",
      nogrowthreport: nogrowthreport || "",
      reportstatus: reportstatus || "",
      micronumber: micronumber || "",
      histonumber: histonumber || "",
      bacteriaisolated: bacteriaisolated || "",
      condition: condition || "",
      srfId: srfId || "",
      icmrId: icmrId || "",
      testType: testType || "",
      covidTest: covidTest || "",
      labtechnicianname: labtechdatas || "",
      pathologyyesorno: pathologyyesorno || "",
      pathologyremark: pathologyremark || "",
      abstinence: abstinence || "",
      reportfile: file || null,
    };

    console.log("postdata----------", postdata);

    const formData = new FormData();
    for (const key in postdata) {
      if (key === "Photo" && postdata[key]) {
        formData.append(key, postdata[key]); // Append file directly
      } else if (typeof postdata[key] === "object" && postdata[key] !== null) {
        formData.append(key, JSON.stringify(postdata[key])); // Stringify JSON objects
      } else {
        formData.append(key, postdata[key]); // Append simple values directly
      }
    }

    // Perform API calls

    axios
      .post(`${urllink}Lab/insert_analyse_investigation_result`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        console.log(response);
        dispatchvalue({ type: "setActiveFolder", value: "LabTechnician" });
        setmicroFind("")
      })
      .catch((error) => {
        console.log(error);
      });


  };




  const [Colonycount, setColonyCount] = useState('')

  const handlecontinueprocess = () => {


    if (!Colonycount || Colonycount.toString().trim() === "") {
      alert("Please enter colony count.");
      return;
    }
    // Transform captureOrganism into a simpler format
    const updatedOrganisms = testDetails
      .map((detail) => {
        if (detail.captureOrganism) {
          // Join all characters to form a proper string
          const organismName = Object.values(detail.captureOrganism).join("");
          return {
            testcode: detail.testcode,
            organism_name: organismName.trim(), // Trim to remove extra spaces, if any
          };
        }
        return null; // Handle cases where captureOrganism is not present
      })
      .filter((item) => item !== null); // Remove null values

    // Prepare culturepost object
    const culturepost = {
      Billing_Invoice: capturedatas?.Billing_Invoice,
      visitid: capturedatas?.Visit_Id,
      patient_Id: capturedatas?.Patient_Id,
      CreatedBy: userRecord?.username,
      Location: userRecord?.location,
      Patient_name: capturedatas?.Patient_Name,
      refering_doc: capturedatas?.Refering_Doctor,
      antibiotic: sensitivityLevels,
      captureOrganism: updatedOrganisms, // Updated structure for captureOrganism
      antibioticValue: antibioticValues,
      Colonycount: Colonycount
    };

    console.log("=============>culturepost", culturepost);

    axios
      .post(`${urllink}Lab/insert_into_culture_report`, culturepost)
      .then((response) => {
        // console.log(response);
        setIscontinue(true);
        setSelectedAntibiotics({});
        setSensitivityLevels({});
        setAntibioticValues({})
      })
      .catch((error) => {
        console.error(error);
      });
  };



  const parseReferenceData = (referenceData) => {
    // console.log(referenceData);
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

  useEffect(() => {
    const hasOtReportFormat = testDetails.some(
      (detail) => detail.reportformat === "Ot"
    );

    if (hasOtReportFormat) {
      // console.log("Running useEffect with:", hasOtReportFormat);

      axios
        .get(`${urllink}Lab/get_test_name_by_word`)
        .then((response) => {
          // console.log(typeof response.data, "8888888888888888888888888888");
          setwordtest(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [urllink, testDetails]); // Assuming testDetails is an updated state variable holding your test details

  // Function to determine the status based on capture value and reference ranges
  const getStatus = (captureValue, referenceArray) => {
    // console.log(captureValue);
    // console.log(referenceArray);

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

  const getStatus1 = (captureValue, referenceArray) => {
    // console.log(captureValue);
    // console.log(referenceArray);

    for (let ref of referenceArray) {
      // if (captureValue === 0) {
      //     return <span className='indicator' style={{ color: 'green' }}></span>;

      // } else {
      if (ref.label === "Normal") {
        // Normal range
        if (captureValue >= ref.minValue && captureValue <= ref.maxValue) {
          return "Normal";
        } else if (captureValue <= ref.minValue) {
          return "Low";
        }
      } else if (ref.label === "Borderline") {
        // Borderline range
        if (captureValue >= ref.minValue && captureValue <= ref.maxValue) {
          return "Low";
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
          return "High";
        }
        // }
      }
    }
    return "Unknown";
  };

  // useEffect(() => {
  //   if (!userRecord || !userRecord.Lab_DepartmentName) return;

  //   axios
  //     .get(`${urllink}Lab/get_for_pending_result_department`, {
  //       params: {
  //         invoice: capturedatas?.Billing_Invoice,
  //       },
  //     })
  //     .then((response) => {
  //       // console.log(response);

  //       // Assuming response.data is an array of departments
  //       const fetchedDepartments = response.data.map((dept) => dept.trim());
  //       // setDepartment(fetchedDepartments);

  //       // console.log(typeof userRecord.Lab_Department);
  //       // console.log(userRecord.Lab_Department);

  //       // Filter the fetched departments based on userRecord.Department
  //       const userDepartments = userRecord.Lab_DepartmentName.map((dept) =>
  //         dept.trim()
  //       );
  //       const filtered = fetchedDepartments.filter((dept) =>
  //         userDepartments.includes(dept)
  //       );
  //       const D = testDetails.filter(item => filtered.includes(item.Department));
  //       console.log("----------",D)
  //       setFilteredDepartments(filtered);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [capturedatas, urllink, userRecord]);

  // console.log("---------------filteredDepartments", filteredDepartments);

  const [selectedFormat, setSelectedFormat] = useState("peripheralSmear");
  const [formTextareaData, setFormTextareaData] = useState({});
  // console.log(formTextareaData);

  const [imageData, setImageData] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handlereportedit1 = (data, word) => {
    let department = data?.subdepartment;
    // console.log(data)
    let testname = word;
    let testcode = data?.testcode;
    setLoadingEditor(true);

    axios
      .get(
        `${urllink}Lab/get_word_data?department=${department}&testname=${testname}&testcode=${testcode}`,
        { responseType: "blob" }
      )
      .then((response) => {
        console.log(response);
        const fileReader = new FileReader();
        fileReader.onload = () => {
          const arrayBuffer = fileReader.result;
          console.log(arrayBuffer, "arrayBuffer");
          loadWordFile(arrayBuffer);
        };
        fileReader.readAsArrayBuffer(response.data);
      })
      .catch((error) => {
        console.error("Error fetching DOCX file:", error);
      });
    setopenpreview1(true);
  };


  const fetchHistopathologyDoc = (data, word) => {
    let testcode = data?.testcode;

    if (editorContent !== "" && testcode) {
      setEditorVisible(true);
      setHtmlContent(editorContent);

    }
    else if (testcode && editorContent === "") {

      setLoading(true);
      setEditorVisible(true);
      setError(null);
      setHtmlContent("");

      axios
        .get(`${urllink}Lab/getbytestcodedoc?testcode=${testcode}`)
        .then((response) => {
          const data = response.data;
          console.log("data", data);
          const decodedHtml = atob(data.html);
          setHtmlContent(decodedHtml || "<p>No content available.</p>");
          setDocName(data.fileName || "Untitled Document");
        })
        .catch((error) => {
          console.error("Error fetching document:", error);
          setError(`Failed to load document: ${error.message}`);
          message.error(`Failed to load document: ${error.message}`);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setError("No HISTOPATHOLOGY test found.");
      message.warning("No HISTOPATHOLOGY test found.");
    }
  };

  const handleOnCloseEditor = () => {
    setEditorVisible(false);

  }


  const handlereportedit = (data, word) => {
    // console.log(data);
    let department = data?.subdepartment;
    let testname = word;
    let testcode = data?.testcode;
    // console.log(testFormats);
    // Initialize formats and textarea data for the active test if not already set

    if (testFormats[testcode]) {
      setTestFormats((prev) => {
        return {
          ...prev,
          [testcode]: prev[testcode]?.map((item) => {
            if (item.name === "Specimen") {
              return { ...item, value: data.Specimen_Name }; // Update the value for the matching field
            }
            return item;
          }),
        };
      });
      setopenpreview(true);
      setselecteddept(department);
    }
    setSelectedTestCode(data.testcode);
  };

  const handleFormatChange = (e, detail) => {
    const format = e.target.value;
    const testcode = detail.testcode;

    // console.log(format, 'lfffflflffffffffffffffffff');
    // console.log(testcode, 'hdhdhdhdhddhhddhdhdhdhdhd');

    axios
      .get(
        `${urllink}Lab/Get_Template?newFormat=${format}&testcode=${testcode}`
      )
      .then((res) => {
        // console.log(res);
        setTestFormats((prev) => ({
          ...prev,
          [testcode]: res.data.format,
        }));
      })
      .catch((err) => {
        console.log(err);
      });

    // fetchTemplateData(format, testcode); // Fetch data with the new format
  };

  // const handleTextareaChange = (e, name) => {
  //   setFormTextareaData((prev) => ({
  //     ...prev,
  //     [name]: e.target.value,
  //   }));
  // };

  const handleTextareaChange = (e, name) => {
    const { value } = e.target;

    setTestFormats((prev) => {
      return {
        ...prev,
        [selectedTestCode]: prev[selectedTestCode].map((item) => {
          if (item.name === name) {
            return { ...item, value: value }; // Update the value for the matching field
          }
          return item; // Keep other fields unchanged
        }),
      };
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageData(file);
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);

      setTestFormats((prev) => ({
        ...prev,
        [selectedTestCode]: prev[selectedTestCode]?.map((field) => {
          if (field.name === "imageData") {
            return { ...field, value: file };
          }
          return field;
        }),
      }));

      setImageFile(file);
      setOriginalImageFile(file);
      setOriginalImagePreview(preview);

      setCrop({
        unit: "%",
        width: 100, // Full width initially
        height: 100, // Full height initially
        x: 0,
        y: 0,
      });
      setCompletedCrop(null);
      setIsCropping(true);
    }
  };

  const getCroppedImg = useCallback(async (image, crop) => {
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    const ctx = canvas.getContext("2d");

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    return new Promise((resolve) => {
      canvas.toBlob(
        (blob) => {
          resolve(blob);
        },
        "image/jpeg",
        1.0
      );
    });
  }, []);

  const handleCropComplete = useCallback((crop) => {
    setCompletedCrop(crop);
  }, []);

  const handleApplyCrop = async () => {
    if (completedCrop && imgRef.current) {
      const croppedImageBlob = await getCroppedImg(
        imgRef.current,
        completedCrop
      );
      const croppedFile = new File([croppedImageBlob], "cropped-image.jpg", {
        type: "image/jpeg",
      });

      setTestFormats((prev) => ({
        ...prev,
        [selectedTestCode]: prev[selectedTestCode]?.map((field) => {
          if (field.name === "imageData") {
            return { ...field, value: croppedFile };
          }
          return field;
        }),
      }));

      setImagePreview(URL.createObjectURL(croppedFile));
      setImageFile(croppedFile);
      setImageData(croppedFile);
      setIsCropping(false);
    }
  };

  const handleRevertCrop = () => {
    if (originalImageFile && originalImagePreview) {
      setImageData(originalImageFile);
      setImagePreview(originalImagePreview);
      setImageFile(originalImageFile);

      setTestFormats((prev) => ({
        ...prev,
        [selectedTestCode]: prev[selectedTestCode]?.map((field) => {
          if (field.name === "imageData") {
            return { ...field, value: originalImageFile };
          }
          return field;
        }),
      }));

      setIsCropping(true); // Go back to cropping mode with the original image
      setCrop({
        unit: "%",
        width: 100, // Full width initially
        height: 100, // Full height initially
        x: 0,
        y: 0,
      });
      setCompletedCrop(null);
    }
  };

  // console.log(testFormats);

  // Function to auto-resize textarea
  const autoResizeTextarea = (e) => {
    e.target.style.height = "auto"; // Reset the height to auto
    e.target.style.height = `${e.target.scrollHeight}px`; // Set it to the scroll height
  };

  const filteredAntibiotics = getFilteredAntibiotics().filter(
    (antibiotic) =>
      typeof antibiotic === "string" && // Ensure the element is a string
      antibiotic.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // console.log(filteredDepartments, "testDetailssssssssssssssss");

  const handleRemoveAntibiotic = (antibiotic) => {
    const updatedLevels = { ...sensitivityLevels };
    delete updatedLevels[antibiotic];
    setSensitivityLevels(updatedLevels);

    const updatedSelected = { ...selectedAntibiotics };
    Object.keys(updatedSelected).forEach((testcode) => {
      if (updatedSelected[testcode]?.[antibiotic]) {
        delete updatedSelected[testcode][antibiotic];
      }
    });
    setSelectedAntibiotics(updatedSelected);
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

      {testDetails.length > 0 &&
        filteredDepartments.map((dept, deptIndex) => (
          <div key={deptIndex}>
            <h3 style={{ textAlign: "center" }}>{dept}</h3>
            <div className="samplecapture_component">
              <div className="Selected-table-container">
                {testDetails?.some(
                  (p) => p.subdepartment === dept && p.culturetest === "Yes" && p.testcode !== "LTC1116"
                ) && (
                    <>
                      {testDetails
                        ?.filter(
                          (p) =>
                            p.subdepartment === dept && p.culturetest === "Yes" && p.testcode !== "LTC1116"
                        )
                        ?.map((test, index) => {
                          {
                            console.log("testDetails", testDetails);
                          }
                          const format = test?.reportformat || "Default Format"; // Provide a fallback
                          return (
                            format === "Sensitivity" && (
                              <div key={index}>
                                <p className="Notesforinform">
                                  <span>Note</span>: Please fill first{" "}
                                  <span>Report Type,</span>{" "}
                                  <span>Capture Organism,</span>{" "}
                                  <span>Colony Count / Growth,</span> next select
                                  the <span>Antibiotics</span> and Don't forget to
                                  click <span>Continue</span>
                                </p>
                              </div>
                            )
                          );
                        })}

                      {testDetails
                        ?.filter(
                          (p) =>
                            p.subdepartment === dept && p.culturetest === "Yes" && p.testcode !== "LTC1116"
                        )
                        .map((detail, filteredIndex) => {
                          // Find the original index in testDetails using testcode
                          const originalIndex = testDetails.findIndex(
                            (item) => item.testcode === detail.testcode
                          );

                          return (
                            <table
                              className="selected-medicine-table2"
                              key={filteredIndex}
                              style={{ marginBottom: "20px" }} // Optional: Adds spacing between tables
                            >
                              <thead>
                                <tr>
                                  <th>Test Name</th>
                                  <th>Specimen</th>
                                  <th>Report Type</th>
                                  <th>Micro Number</th>
                                  {detail.reportformat !== "Ot" &&
                                    detail.reportformat !== "NoGrowth" &&
                                    detail.reportformat !== "Isolated" && (
                                      <>
                                        <th>Range Type</th>
                                        <th>Capture Organism</th>
                                      </>
                                    )}
                                  {detail.reportformat !== "Ot" && (
                                    <th>Colony Count / Growth</th>
                                  )}

                                  {detail.reportformat === "Ot" && (
                                    <th>Format</th>
                                  )}
                                  {detail.reportformat === "Ot" && (
                                    <th>Action</th>
                                  )}
                                  {(detail.reportformat === "NoGrowth" ||
                                    detail.reportformat === "Isolated") && (
                                      <th>Status</th>
                                    )}
                                </tr>
                              </thead>
                              <tbody>
                                <React.Fragment key={filteredIndex}>
                                  <tr>
                                    <td>{detail.testname}</td>
                                    <td>
                                      <div className="organism_add">
                                        <textarea
                                          style={{
                                            width: "271px",
                                            height: "41px",
                                          }}
                                          value={specimenName[detail.testcode] || ""} // Use specimenName state as the source of truth
                                          className="Capture_Status_select1"
                                          onChange={(e) => {
                                            const newValue = e.target.value;
                                            // Update specimenName state
                                            setSpecimenName((prev) => ({
                                              ...prev,
                                              [detail.testcode]: newValue,
                                            }));
                                            // Update testDetails to keep it in sync
                                            const updatedDetails = [...testDetails];
                                            updatedDetails[originalIndex] = {
                                              ...updatedDetails[originalIndex],
                                              Specimen_Name: newValue,
                                            };
                                            setTestDetails(updatedDetails);
                                          }}
                                        />
                                      </div>
                                    </td>
                                    <td>
                                      <select
                                        className=""
                                        value={detail.reportformat || ""}
                                        onChange={(e) => {
                                          const updatedDetails = [...testDetails];
                                          updatedDetails[originalIndex] = {
                                            ...updatedDetails[originalIndex],
                                            reportformat: e.target.value,
                                          };
                                          setTestDetails(updatedDetails);
                                        }}
                                      >
                                        <option value="">Select</option>
                                        <option value="NoGrowth">
                                          No Growth
                                        </option>
                                        <option value="Sensitivity">
                                          Sensitivity
                                        </option>
                                        <option value="Ot">Ot</option>
                                        <option value="Isolated">Isolated</option>
                                      </select>
                                    </td>
                                    <td>
                                      <div className="organism_add">
                                        <input
                                          type="text"
                                          value={detail.micronumber || ""}
                                          className="Capture_Status_select1"
                                          onChange={(e) => {
                                            const updatedDetails = [
                                              ...testDetails,
                                            ];
                                            updatedDetails[originalIndex] = {
                                              ...updatedDetails[originalIndex],
                                              micronumber: e.target.value,
                                            };
                                            setTestDetails(updatedDetails);
                                          }}
                                        />
                                      </div>
                                    </td>
                                    {detail.reportformat !== "Ot" && (
                                      <>
                                        {detail.reportformat !== "NoGrowth" &&
                                          detail.reportformat !== "Isolated" && (
                                            <>
                                              <td>
                                                <select
                                                  value={detail.RangeType || ""}
                                                  onChange={(e) => {
                                                    const updatedDetails = [...testDetails];
                                                    updatedDetails[originalIndex] = {
                                                      ...updatedDetails[originalIndex],
                                                      RangeType: e.target.value,
                                                    };
                                                    setTestDetails(updatedDetails);
                                                    // Update selectrangetype for this testcode
                                                    setselectrangeType((prev) => ({
                                                      ...prev,
                                                      [detail.testcode]: e.target.value,
                                                    }));
                                                  }}
                                                >
                                                  <option value="">Select Range Type</option>
                                                  <option value="MIC">MIC</option>
                                                  <option value="DISK Diffusion">DISK Diffusion</option>
                                                </select>
                                              </td>
                                              <td>
                                                <div className="organism_add">
                                                  <input
                                                    type="text"
                                                    list="organismlist"
                                                    value={detail.captureOrganism || ""}
                                                    className="Capture_Status_select1"
                                                    onChange={(e) => {
                                                      const updatedDetails = [...testDetails];
                                                      updatedDetails[originalIndex] = {
                                                        ...updatedDetails[originalIndex],
                                                        captureOrganism: e.target.value,
                                                      };
                                                      setTestDetails(updatedDetails);
                                                      // Update capOrganism for this testcode
                                                      setcaptureOrganism((prev) => ({
                                                        ...prev,
                                                        [detail.testcode]: e.target.value,
                                                      }));
                                                    }}
                                                  />
                                                  <datalist id="organismlist">
                                                    {detail.organisn.map((p, i) => (
                                                      <option key={i} value={p}>
                                                        {p}
                                                      </option>
                                                    ))}
                                                  </datalist>
                                                  <span onClick={handleaddneworaganism}>
                                                    <AddIcon />
                                                  </span>
                                                </div>
                                              </td>
                                            </>
                                          )}
                                        <td>
                                          <input
                                            type={
                                              "text"
                                            }
                                            className="Capture_Status_select1"

                                            value={detail.Colonycount || ""}
                                            onChange={(e) => {
                                              const updatedDetails = [
                                                ...testDetails,
                                              ];
                                              updatedDetails[originalIndex] = {
                                                ...updatedDetails[originalIndex],
                                                Colonycount: e.target.value,
                                              };
                                              setColonyCount(e.target.value)
                                              setTestDetails(updatedDetails);



                                            }}
                                          />
                                        </td>
                                      </>
                                    )}

                                    {detail.reportformat === "Ot" && (
                                      <>
                                        <td>
                                          <input
                                            type="text"
                                            list="organismlist1"
                                            value={detail.formatword}
                                            className="Capture_Status_select1"
                                            onChange={(e) => {
                                              const updatedDetails = [
                                                ...testDetails,
                                              ];
                                              updatedDetails[originalIndex] = {
                                                ...updatedDetails[originalIndex],
                                                formatword: e.target.value,
                                              };
                                              setTestDetails(updatedDetails);
                                            }}
                                          />
                                          <datalist id="organismlist1">
                                            {wordtest
                                              ?.filter(
                                                (p) =>
                                                  p.Department_Name ===
                                                  detail.subdepartment
                                              )
                                              .map((p, i) => (
                                                <option
                                                  key={i}
                                                  value={p.Test_Name}
                                                >
                                                  {p.Test_Name}
                                                </option>
                                              ))}
                                          </datalist>
                                        </td>

                                        <td>
                                          <button
                                            onClick={() =>
                                              handlereportedit1(
                                                detail,
                                                detail.formatword
                                              )
                                            }
                                          >
                                            <EditIcon />
                                          </button>
                                        </td>
                                      </>
                                    )}

                                    {(detail.reportformat === "NoGrowth" ||
                                      detail.reportformat === "Isolated") && (
                                        <td>
                                          <select
                                            className=""
                                            value={detail.reportstatus}
                                            onChange={(e) => {
                                              const updatedDetails = [
                                                ...testDetails,
                                              ];
                                              updatedDetails[originalIndex] = {
                                                ...updatedDetails[originalIndex],
                                                reportstatus: e.target.value,
                                              };
                                              setTestDetails(updatedDetails);
                                            }}
                                          >
                                            <option value="">Select</option>
                                            <option value="Final Report">
                                              Final Report
                                            </option>
                                            <option value="Preliminary Report">
                                              Preliminary Report
                                            </option>
                                          </select>
                                        </td>
                                      )}
                                  </tr>
                                  {detail.reportformat === "Sensitivity" && (
                                    <tr className="no-background">
                                      <td
                                        colSpan="100%"
                                        style={{ textAlign: "center" }}
                                      >
                                        <>
                                          <div
                                            className=""
                                            style={{
                                              display: "flex",
                                              justifyContent: "center",
                                              alignItems: "center",
                                            }}
                                          >
                                            <input
                                              type="text"
                                              placeholder="Search Antibiotics"
                                              value={searchQuery}
                                              onChange={(e) =>
                                                setSearchQuery(e.target.value)
                                              }
                                              className="Capture_Status_select1"
                                            />
                                          </div>
                                          <div className="antibioticnames">
                                            <table className="microantibiotictable">
                                              <thead>
                                                <tr>
                                                  <th>Select</th>
                                                  <th>Antibiotic</th>
                                                  <th>Enter Value</th>
                                                  <th>Sensitive</th>
                                                  <th>Intermediate</th>
                                                  <th>Resistant</th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {filteredAntibiotics.map((antibiotic, index) => {
                                                  const isSelected = selectedAntibiotics[detail.testcode]?.[antibiotic] || false;
                                                  const storedValues = antibioticValues[detail.testcode]?.[antibiotic] || {};
                                                  const antibioticData = antibioticorg.find((a) => a.anti_biotic === antibiotic) || {};

                                                  return (
                                                    <tr key={index}>
                                                      <td>
                                                        <input
                                                          type="checkbox"
                                                          checked={isSelected}
                                                          onChange={() => handleCheckboxChange(antibiotic, detail.testcode)}
                                                        />
                                                      </td>
                                                      <td>{antibiotic}</td>

                                                      <td>
                                                        {isSelected && (
                                                          <input
                                                            type="text"
                                                            placeholder="Enter Value"
                                                            value={storedValues.uservalue || ""}
                                                            onChange={(e) => antibioticValue(e, detail.testcode, antibiotic, "uservalue")}
                                                            className="Capture_Status_select1"
                                                            style={{ width: "80px" }}
                                                          />
                                                        )}
                                                      </td>
                                                      <td>
                                                        <input
                                                          type="text"
                                                          value={storedValues.sensitiverange ?? antibioticData.sensitiverange ?? ""}
                                                          onChange={(e) => antibioticValue(e, detail.testcode, antibiotic, "sensitiverange")}
                                                          className="Capture_Status_select1"
                                                          style={{ width: "80px" }}
                                                        />
                                                      </td>
                                                      <td>
                                                        <input
                                                          type="text"
                                                          value={storedValues.intermediaterange ?? antibioticData.intermediaterange ?? ""}
                                                          onChange={(e) => antibioticValue(e, detail.testcode, antibiotic, "intermediaterange")}
                                                          className="Capture_Status_select1"
                                                          style={{ width: "80px" }}
                                                        />
                                                      </td>
                                                      <td>
                                                        <input
                                                          type="text"
                                                          value={storedValues.resistantrange ?? antibioticData.resistantrange ?? ""}
                                                          onChange={(e) => antibioticValue(e, detail.testcode, antibiotic, "resistantrange")}
                                                          className="Capture_Status_select1"
                                                          style={{ width: "80px" }}
                                                        />
                                                      </td>

                                                    </tr>
                                                  );
                                                })}
                                              </tbody>

                                            </table>


                                          </div>


                                          <div className="Register_btn_con">

                                            <button className="RegisterForm_1_btns"
                                              onClick={() => setShowAntibioticModal(true)}>
                                              View
                                            </button>
                                            <button
                                              className="RegisterForm_1_btns"
                                              onClick={() =>
                                                handleSensitivityChange(
                                                  "Sensitive"
                                                )
                                              }
                                            >
                                              Sensitive
                                            </button>
                                            <button
                                              className="RegisterForm_1_btns"
                                              onClick={() =>
                                                handleSensitivityChange(
                                                  "Intermediate"
                                                )
                                              }
                                            >
                                              Intermediate
                                            </button>
                                            <button
                                              className="RegisterForm_1_btns"
                                              onClick={() =>
                                                handleSensitivityChange(
                                                  "Resistant"
                                                )
                                              }
                                            >
                                              Resistant
                                            </button>
                                            <button
                                              className="RegisterForm_1_btns"
                                              onClick={() => {
                                                handlecontinueprocess();
                                              }}
                                            >
                                              Continue
                                            </button>
                                          </div>

                                          <div className="comments_for_microscopy">
                                            <label
                                              htmlFor={`Site-${filteredIndex}`}
                                            >
                                              Site<span>:</span>
                                            </label>
                                            <textarea
                                              id={`Site-${filteredIndex}`}
                                              name={`Site-${filteredIndex}`}
                                              value={detail.site || ""}
                                              onChange={(e) => {
                                                const updatedDetails = [
                                                  ...testDetails,
                                                ];
                                                updatedDetails[originalIndex] = {
                                                  ...updatedDetails[
                                                  originalIndex
                                                  ],
                                                  site: e.target.value,
                                                };
                                                setTestDetails(updatedDetails);
                                              }}
                                            ></textarea>
                                          </div>
                                          <div className="comments_for_microscopy">
                                            <label
                                              htmlFor={`macroscopy-${filteredIndex}`}
                                            >
                                              Macroscopy<span>:</span>
                                            </label>
                                            <textarea
                                              id={`macroscopy-${filteredIndex}`}
                                              name={`macroscopy-${filteredIndex}`}
                                              value={detail.macroscopy || ""}
                                              onChange={(e) => {
                                                const updatedDetails = [
                                                  ...testDetails,
                                                ];
                                                updatedDetails[originalIndex] = {
                                                  ...updatedDetails[
                                                  originalIndex
                                                  ],
                                                  macroscopy: e.target.value,
                                                };
                                                setTestDetails(updatedDetails);
                                              }}
                                            ></textarea>
                                          </div>
                                          <div className="comments_for_microscopy">
                                            <label htmlFor={`Microscopy-${filteredIndex}`}>
                                              Microscopy<span>:</span>
                                            </label>
                                            <input
                                              list={`microscopy-options-${filteredIndex}`}
                                              id={`Microscopy-${filteredIndex}`}
                                              name={`Microscopy-${filteredIndex}`}
                                              value={detail.microscopy || ""}
                                              onChange={(e) => {
                                                const updatedDetails = [...testDetails];
                                                updatedDetails[originalIndex] = {
                                                  ...updatedDetails[originalIndex],
                                                  microscopy: e.target.value,
                                                };
                                                setTestDetails(updatedDetails);
                                              }}
                                            />
                                            <datalist id={`microscopy-options-${filteredIndex}`}>
                                              {microscopyname?.map((option, index) => (
                                                <option key={index} value={option.microscopyname} />
                                              ))}
                                            </datalist>
                                          </div>
                                          <div className="comments_for_microscopy">
                                            <label
                                              htmlFor={`Microscopy-${filteredIndex}`}
                                            >
                                              Microscopy Finding
                                            </label>
                                            <textarea
                                              id={`Microscopy-${filteredIndex}`}
                                              name={`Microscopy-${filteredIndex}`}
                                              value={microFind}
                                              onChange={(e) => { setmicroFind(e.target.value) }}
                                            ></textarea>
                                          </div>
                                          <div className="comments_for_microscopy">
                                            <label
                                              htmlFor={`acid_fast-${filteredIndex}`}
                                            >
                                              Acid fast staining
                                            </label>
                                            <textarea
                                              id={`acid_fast-${filteredIndex}`}
                                              name={`acid_fast-${filteredIndex}`}
                                              value={detail.acid_fast || ""}
                                              onChange={(e) => {
                                                const updatedDetails = [
                                                  ...testDetails,
                                                ];
                                                updatedDetails[originalIndex] = {
                                                  ...updatedDetails[
                                                  originalIndex
                                                  ],
                                                  acid_fast: e.target.value,
                                                };
                                                setTestDetails(updatedDetails);
                                              }}
                                            ></textarea>
                                          </div>

                                          <div className="comments_for_microscopy">
                                            <label
                                              htmlFor={`positivity-${filteredIndex}`}
                                            >
                                              Time to positivity
                                            </label>
                                            <textarea
                                              id={`positivity-${filteredIndex}`}
                                              name={`positivity-${filteredIndex}`}
                                              value={detail.positivity || ""}
                                              onChange={(e) => {
                                                const updatedDetails = [
                                                  ...testDetails,
                                                ];
                                                updatedDetails[originalIndex] = {
                                                  ...updatedDetails[
                                                  originalIndex
                                                  ],
                                                  positivity: e.target.value,
                                                };
                                                setTestDetails(updatedDetails);
                                              }}
                                            ></textarea>
                                          </div>

                                          <div className="comments_for_microscopy">
                                            <label
                                              htmlFor={`ceck-${filteredIndex}`}
                                            >
                                              Culture report<span>:</span>
                                            </label>
                                            <input
                                              type="checkbox"
                                              checked={detail.isChecked || false}
                                              onChange={() => {
                                                const updatedDetails = [
                                                  ...testDetails,
                                                ];
                                                updatedDetails[originalIndex] = {
                                                  ...updatedDetails[originalIndex],
                                                  isChecked: !detail.isChecked,
                                                };

                                                setTestDetails(updatedDetails);
                                              }}
                                            />
                                            {detail.isChecked && (
                                              <textarea
                                                id={`ceck-${filteredIndex}`}
                                                name={`ceck-${filteredIndex}`}
                                                value={detail.nogrowthreport || ""}
                                                onChange={(e) => {
                                                  const updatedDetails = [
                                                    ...testDetails,
                                                  ];
                                                  updatedDetails[originalIndex] = {
                                                    ...updatedDetails[
                                                    originalIndex
                                                    ],
                                                    nogrowthreport: e.target.value,
                                                  };
                                                  setTestDetails(updatedDetails);
                                                }}
                                              ></textarea>
                                            )}
                                          </div>

                                          <div className="comments_for_microscopy">
                                            <label
                                              htmlFor={`notes-${filteredIndex}`}
                                            >
                                              Comments<span>:</span>
                                            </label>
                                            <textarea
                                              id={`comments-${filteredIndex}`}
                                              name={`comments-${filteredIndex}`}
                                              value={detail.comments || ""}
                                              onChange={(e) => {
                                                const updatedDetails = [
                                                  ...testDetails,
                                                ];
                                                updatedDetails[originalIndex] = {
                                                  ...updatedDetails[
                                                  originalIndex
                                                  ],
                                                  comments: e.target.value,
                                                };
                                                setTestDetails(updatedDetails);
                                              }}
                                            ></textarea>
                                          </div>
                                        </>
                                      </td>
                                    </tr>
                                  )}

                                  {detail.reportformat === "Isolated" && (
                                    <tr className="no-background">
                                      <td
                                        colSpan="100%"
                                        style={{ textAlign: "center" }}
                                      >
                                        <div className="comments_for_microscopy">
                                          <label
                                            htmlFor={`Microscopy-${filteredIndex}`}
                                          >
                                            Microscopy<span>:</span>
                                          </label>
                                          <textarea
                                            id={`Microscopy-${filteredIndex}`}
                                            name={`Microscopy-${filteredIndex}`}
                                            value={detail.microscopy}
                                            onChange={(e) => {
                                              const updatedDetails = [
                                                ...testDetails,
                                              ];
                                              updatedDetails[originalIndex] = {
                                                ...updatedDetails[originalIndex],
                                                microscopy: e.target.value,
                                              };
                                              setTestDetails(updatedDetails);
                                            }}
                                          ></textarea>
                                        </div>
                                        <div className="comments_for_microscopy">
                                          <label
                                            htmlFor={`remarks-isolated-${filteredIndex}`}
                                          >
                                            Bacteria Isolated<span>:</span>
                                          </label>
                                          <textarea
                                            id={`remarks-isolated-${filteredIndex}`}
                                            name={`remarks-isolated-${filteredIndex}`}
                                            value={detail.bacteriaisolated}
                                            onChange={(e) => {
                                              const updatedDetails = [
                                                ...testDetails,
                                              ];
                                              updatedDetails[originalIndex] = {
                                                ...updatedDetails[originalIndex],
                                                bacteriaisolated: e.target.value,
                                              };
                                              setTestDetails(updatedDetails);
                                            }}
                                          ></textarea>
                                        </div>

                                        <div className="comments_for_microscopy">
                                          <label htmlFor="remarks">
                                            Notes<span>:</span>
                                          </label>
                                          <textarea
                                            id="remarks"
                                            name="remarks"
                                            value={detail.comments}
                                            onChange={(e) => {
                                              const updatedDetails = [
                                                ...testDetails,
                                              ];
                                              updatedDetails[originalIndex] = {
                                                ...updatedDetails[originalIndex],
                                                comments: e.target.value,
                                              };
                                              setTestDetails(updatedDetails);
                                            }}
                                          ></textarea>
                                        </div>
                                      </td>
                                    </tr>
                                  )}

                                  {/* {detail.reportformat === "NoGrowth" && (
                                    <tr className="no-background">
                                      <td
                                        colSpan="100%"
                                        style={{ textAlign: "center" }}
                                      >
                                        <div className="comments_for_microscopy">
                                          <label
                                            htmlFor={`Microscopy-${filteredIndex}`}
                                          >
                                            Microscopy<span>:</span>
                                          </label>
                                          <textarea
                                            id={`Microscopy-${filteredIndex}`}
                                            name={`Microscopy-${filteredIndex}`}
                                            value={detail.microscopy || ""}
                                            onChange={(e) => {
                                              const updatedDetails = [
                                                ...testDetails,
                                              ];
                                              updatedDetails[originalIndex] = {
                                                ...updatedDetails[originalIndex],
                                                microscopy: e.target.value,
                                              };
                                              setTestDetails(updatedDetails);
                                            }}
                                          ></textarea>
                                        </div>
                                        <div className="comments_for_microscopy">
                                          <label
                                            htmlFor={`macroscopy-${filteredIndex}`}
                                          >
                                            Macroscopy<span>:</span>
                                          </label>
                                          <textarea
                                            id={`macroscopy-${filteredIndex}`}
                                            name={`macroscopy-${filteredIndex}`}
                                            value={detail.macroscopy || ""}
                                            onChange={(e) => {
                                              const updatedDetails = [
                                                ...testDetails,
                                              ];
                                              updatedDetails[originalIndex] = {
                                                ...updatedDetails[
                                                originalIndex
                                                ],
                                                macroscopy: e.target.value,
                                              };
                                              setTestDetails(updatedDetails);
                                            }}
                                          ></textarea>
                                        </div>
                                        <div className="comments_for_microscopy">
                                          <label
                                            htmlFor={`ceck-${filteredIndex}`}
                                          >
                                            Culture report<span>:</span>
                                          </label>
                                          <input
                                            type="checkbox"
                                            checked={detail.isChecked || false}
                                            onChange={() => {
                                              const updatedDetails = [
                                                ...testDetails,
                                              ];
                                              updatedDetails[originalIndex] = {
                                                ...updatedDetails[originalIndex],
                                                isChecked: !detail.isChecked,
                                              };

                                              setTestDetails(updatedDetails);
                                            }}
                                          />
                                          {detail.isChecked && (
                                            <textarea
                                              id={`ceck-${filteredIndex}`}
                                              name={`ceck-${filteredIndex}`}
                                              value={detail.nogrowthreport || ""}
                                              onChange={(e) => {
                                                const updatedDetails = [
                                                  ...testDetails,
                                                ];
                                                updatedDetails[originalIndex] = {
                                                  ...updatedDetails[
                                                  originalIndex
                                                  ],
                                                  nogrowthreport: e.target.value,
                                                };
                                                setTestDetails(updatedDetails);
                                              }}
                                            ></textarea>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  )} */}

                                  {detail.reportformat === "NoGrowth" && (
                                    <tr className="no-background">
                                      <td
                                        colSpan="100%"
                                        style={{ textAlign: "center" }}
                                      >
                                        <div className="comments_for_microscopy">
                                          <label
                                            htmlFor={`Site-${filteredIndex}`}
                                          >
                                            Site<span>:</span>
                                          </label>
                                          <textarea
                                            id={`Site-${filteredIndex}`}
                                            name={`Site-${filteredIndex}`}
                                            value={detail.site || ""}
                                            onChange={(e) => {
                                              const updatedDetails = [
                                                ...testDetails,
                                              ];
                                              updatedDetails[originalIndex] = {
                                                ...updatedDetails[
                                                originalIndex
                                                ],
                                                site: e.target.value,
                                              };
                                              setTestDetails(updatedDetails);
                                            }}
                                          ></textarea>
                                        </div>
                                        <div className="comments_for_microscopy">
                                          <label
                                            htmlFor={`macroscopy-${filteredIndex}`}
                                          >
                                            Macroscopy<span>:</span>
                                          </label>
                                          <textarea
                                            id={`macroscopy-${filteredIndex}`}
                                            name={`macroscopy-${filteredIndex}`}
                                            value={detail.macroscopy || ""}
                                            onChange={(e) => {
                                              const updatedDetails = [
                                                ...testDetails,
                                              ];
                                              updatedDetails[originalIndex] = {
                                                ...updatedDetails[
                                                originalIndex
                                                ],
                                                macroscopy: e.target.value,
                                              };
                                              setTestDetails(updatedDetails);
                                            }}
                                          ></textarea>
                                        </div>
                                        <div className="comments_for_microscopy">
                                          <label htmlFor={`Microscopy-${filteredIndex}`}>
                                            Microscopy<span>:</span>
                                          </label>
                                          <input
                                            list={`microscopy-options-${filteredIndex}`}
                                            id={`Microscopy-${filteredIndex}`}
                                            name={`Microscopy-${filteredIndex}`}
                                            value={detail.microscopy || ""}
                                            onChange={(e) => {
                                              const updatedDetails = [...testDetails];
                                              updatedDetails[originalIndex] = {
                                                ...updatedDetails[originalIndex],
                                                microscopy: e.target.value,
                                              };
                                              setTestDetails(updatedDetails);
                                            }}
                                          />
                                          <datalist id={`microscopy-options-${filteredIndex}`}>
                                            {microscopyname?.map((option, index) => (
                                              <option key={index} value={option.microscopyname} />
                                            ))}
                                          </datalist>
                                        </div>
                                        <div className="comments_for_microscopy">
                                          <label
                                            htmlFor={`Microscopy-${filteredIndex}`}
                                          >
                                            Microscopy Finding
                                          </label>
                                          <textarea
                                            id={`Microscopy-${filteredIndex}`}
                                            name={`Microscopy-${filteredIndex}`}
                                            value={microFind}
                                            onChange={(e) => { setmicroFind(e.target.value) }}
                                          ></textarea>
                                        </div>
                                        <div className="comments_for_microscopy">
                                          <label
                                            htmlFor={`acid_fast-${filteredIndex}`}
                                          >
                                            Acid fast staining
                                          </label>
                                          <textarea
                                            id={`acid_fast-${filteredIndex}`}
                                            name={`acid_fast-${filteredIndex}`}
                                            value={detail.acid_fast || ""}
                                            onChange={(e) => {
                                              const updatedDetails = [
                                                ...testDetails,
                                              ];
                                              updatedDetails[originalIndex] = {
                                                ...updatedDetails[
                                                originalIndex
                                                ],
                                                acid_fast: e.target.value,
                                              };
                                              setTestDetails(updatedDetails);
                                            }}
                                          ></textarea>
                                        </div>
                                        <div className="comments_for_microscopy">
                                          <label
                                            htmlFor={`ceck-${filteredIndex}`}
                                          >
                                            Culture report<span>:</span>
                                          </label>
                                          <input
                                            type="checkbox"
                                            checked={detail.isChecked || false}
                                            onChange={() => {
                                              const updatedDetails = [
                                                ...testDetails,
                                              ];
                                              updatedDetails[originalIndex] = {
                                                ...updatedDetails[originalIndex],
                                                isChecked: !detail.isChecked,
                                              };

                                              setTestDetails(updatedDetails);
                                            }}
                                          />
                                          {detail.isChecked && (
                                            <textarea
                                              id={`ceck-${filteredIndex}`}
                                              name={`ceck-${filteredIndex}`}
                                              value={detail.nogrowthreport || ""}
                                              onChange={(e) => {
                                                const updatedDetails = [
                                                  ...testDetails,
                                                ];
                                                updatedDetails[originalIndex] = {
                                                  ...updatedDetails[
                                                  originalIndex
                                                  ],
                                                  nogrowthreport: e.target.value,
                                                };
                                                setTestDetails(updatedDetails);
                                              }}
                                            ></textarea>
                                          )}
                                        </div>
                                      </td>
                                    </tr>
                                  )}


                                </React.Fragment>
                              </tbody>
                            </table>
                          );
                        })}
                    </>
                  )}

                {testDetails?.some(
                  (detail) => detail.testcode === "LTC1116"
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
                          <th>Test Method</th>
                          <th>Type Of Test</th>
                          <th>COVID-19 Result</th>

                        </tr>
                      </thead>
                      <tbody>
                        {/* {console.log(testDetails)} */}
                        {testDetails
                          .filter(
                            (detail) =>
                              detail.subdepartment === dept &&
                              detail.culturetest === "Yes"
                          )
                          .map((detail, index) => {
                            const referenceArray = detail.referencedata
                              ? parseReferenceData(detail.referencedata)
                              : [];

                            const inputid = `input-${dept}-${index}`;
                            // { console.log('referenceArray', referenceArray) }
                            return (
                              <tr key={index}>
                                <td>{detail.testname}</td>
                                <td>{detail.Specimen_Name}</td>
                                <td>{detail.Test_Method}</td>
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

                                  <select value={covidTest} onChange={(e) => setCovidTest(e.target.value)}>
                                    <option value="">Select</option>
                                    <option value="Positive">Positive</option>
                                    <option value="Negative">Negative</option>
                                  </select>

                                </td>
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </>
                ) :
                  (dept !== "HISTOPATHOLOGY" && dept !== "CYTOLOGY" && !testDetails?.some(
                    (p) => p.subdepartment === dept && p.Iscutoffvalue === "Yes"
                  ) &&
                    !testDetails?.some(
                      (p) => p.subdepartment === dept && p.culturetest === "Yes"
                    ) &&
                    // !testDetails?.some(
                    //   (p) =>p.Test_Method ==="individual" && p.subdepartment === "HAEMATOLOGY" && p.testcode === "LTC1193"
                    // ) &&
                    !testDetails?.some(
                      (detail) => detail.testcode === "LTC1116"
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
                              {testDetails.some((detail) => detail.Specimen_Name !== null) && (
                                <th>Specimen</th>
                              )}
                              <th>Test Method</th>

                              {testDetails?.some(detail => detail.Previous_Value != null && detail.Previous_Value !== '') && (
                                <th>Previous Value</th>
                              )}

                              <th>
                                Capture Value
                              </th>

                              {testDetails?.some(detail => detail.Group_Code === "LGM0042") && (
                                <th>Values</th>
                              )}


                              <th>
                                Reference Range
                              </th>
                              <th>
                                Units
                              </th>



                              {/* {testDetails.some((detail) => detail.inputtype === "Numeric") && (
                              <th>Indicator</th>
                            )} */}


                              <th>
                                Remarks
                                <table className="remarktable">
                                  <thead>
                                    <tr>
                                      <th>Technical</th>
                                      <th>Medical</th>
                                    </tr>
                                  </thead>
                                </table>
                              </th>




                            </tr>
                          </thead>
                          <tbody>

                            {console.log("00000000000000", testDetails)}



                            {[...new Set(testDetails
                              .filter((detail) => detail.subdepartment === dept && detail.culturetest !== "Yes" && detail.testcode !== "LTC1193")
                              .map((detail) => detail.PackageName || "No Package")
                            )].map((packageName) => (
                              <React.Fragment key={packageName}>
                                {/* PackageName header row */}
                                {packageName !== "No Package" && (
                                  <tr className="wertyyyy">
                                    <td colSpan={testDetails.some((detail) => detail.Specimen_Name !== null) ? 8 : 7}>
                                      {packageName}
                                      {packageName === 'FLUID TC, DC' &&
                                        <input
                                          type="text"
                                          className="Capture_Status_select1"
                                          value={fluidSps}
                                          onChange={(e) => setFluidSps(e.target.value)}
                                        />}
                                    </td>

                                  </tr>
                                )}


                                {/* Group_Name sections */}
                                {[...new Set(testDetails
                                  .filter((detail) => detail.subdepartment === dept && (detail.PackageName || "No Package") === packageName && detail.culturetest !== "Yes" && detail.testcode !== "LTC1193")
                                  .map((detail) => detail.Group_Name || "No Group")
                                )].map((groupName) => (
                                  <React.Fragment key={groupName}>
                                    {/* Group_Name header row */}

                                    {groupName === "Sperm Count" && (
                                      <tr className="wertyyyy">
                                        <td colSpan={testDetails.some((detail) => detail.Specimen_Name !== null) ? 8 : 7}>
                                          Microscopic Examination
                                        </td>
                                      </tr>
                                    )}
                                    {groupName !== "No Group" && (
                                      <tr className="wertyyyy">
                                        <td colSpan={testDetails.some((detail) => detail.Specimen_Name !== null) ? 8 : 7}>
                                          {groupName}
                                        </td>
                                      </tr>
                                    )}
                                    {/* Test rows */}
                                    {testDetails
                                      .filter((detail) =>
                                        detail.subdepartment === dept &&
                                        (detail.PackageName || "No Package") === packageName &&
                                        (detail.Group_Name || "No Group") === groupName &&
                                        detail.culturetest !== "Yes" &&
                                        detail.testcode !== "LTC1193"
                                      )
                                      .map((detail, index) => {
                                        const referenceArray = detail.referencedata
                                          ? parseReferenceData(detail.referencedata)
                                          : [];
                                        const inputid = `input-${dept}-${packageName}-${groupName}-${index}`;
                                        return (
                                          <React.Fragment key={index}>
                                            <tr key={index}>
                                              <td>{detail.testname}</td>
                                              {testDetails.some((detail) => detail.Specimen_Name !== null) && (
                                                <td>{detail.Specimen_Name || "-"}</td>
                                              )}
                                              <td>{detail.Test_Method || "-"}</td>
                                              {testDetails.some((detail) => detail.Previous_Value !== null) && (
                                                <td>{detail.Previous_Value || "-"}</td>
                                              )}
                                              <td>
                                                {detail.Calculation === "Yes" ? (
                                                  detail.capturevalue
                                                ) : (
                                                  <input
                                                    id={inputid}
                                                    type={detail.inputtype === "Numeric" ? "number" : "text"}
                                                    className="Capture_Status_select1"
                                                    value={detail.capturevalue}
                                                    autoComplete="off"
                                                    onChange={(e) => handleRemarksChange(index, e.target.value, dept, packageName, groupName)}
                                                    onKeyDown={(e) => handleInputNavigation(e, dept, index, packageName, groupName)}
                                                  />
                                                )}
                                              </td>
                                              {testDetails?.some(detail => detail.Group_Code === "LGM0042") &&
                                                <td>
                                                  <input
                                                    id={inputid}
                                                    type={detail.inputtype === "Numeric" ? "number" : "text"}
                                                    className="Capture_Status_select1"
                                                    value={detail.Result}
                                                    autoComplete="off"
                                                    onChange={(e) => handleValueChange(index, e.target.value, dept, packageName, groupName)}
                                                    onKeyDown={(e) => handleInputNavigation(e, dept, index)}
                                                  />
                                                </td>
                                              }


                                              <td>
                                                <textarea
                                                  className="table_textarea"
                                                  value={detail.referencedata || ""}
                                                  onChange={(e) => handleRefernceChange(index, e.target.value, dept, packageName, groupName)}
                                                // readOnly
                                                />
                                              </td>
                                              <td>{detail.uom || "-"}</td>
                                              {/* {detail.inputtype === "Numeric" && (
                            <td>
                              <span>
                                {detail.reference !== "Yes" ? (
                                  (Number(detail.capturevalue) >= detail.panichigh && (
                                    <span className="indicator" style={{ color: "red" }}>
                                      <TiArrowUpThick />
                                    </span>
                                  )) ||
                                  (Number(detail.capturevalue) <= detail.paniclow && (
                                    <span className="indicatorlow" style={{ color: "blue" }}>
                                      <TiArrowDownThick />
                                    </span>
                                  )) || (
                                    <p style={{ color: "green" }}>Normal</p>
                                  )
                                ) : (
                                  getStatus(Number(detail.capturevalue), referenceArray)
                                )}
                              </span>
                            </td>
                          )} */}
                                              <td>
                                                <table className="remarktable">
                                                  <tbody>
                                                    <tr>
                                                      <td>
                                                        <textarea
                                                          cols="20"
                                                          rows="1"
                                                          value={detail.technicalRemark || ""}
                                                          className="table_textarea"
                                                          onChange={(e) =>
                                                            handletecnicalRemarksChange(index, e.target.value, dept, packageName, groupName)
                                                          }
                                                        />
                                                      </td>
                                                      <td>
                                                        <textarea
                                                          cols="20"
                                                          rows="1"
                                                          value={detail.medicalRemark || ""}
                                                          className="table_textarea"
                                                          onChange={(e) =>
                                                            handlemedicalRemarksChange(index, e.target.value, dept, packageName, groupName)
                                                          }
                                                        />
                                                      </td>
                                                    </tr>
                                                  </tbody>
                                                </table>
                                              </td>
                                            </tr>

                                          </React.Fragment>
                                        );
                                      })}
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
                                  onChange={(e) => setpathologyremark(e.target.value)}
                                ></textarea>
                              </td>
                            </tr>

                          </tbody>

                        </table>
                      </>
                    ))
                }

                {dept === "SEROLOGY" && (
                  (() => {
                    const cutoffTests = testDetails.filter(
                      (test) => test.subdepartment === "SEROLOGY" && test.Iscutoffvalue === "Yes"
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
                                  {/* {detail.reference !== "Yes" ? (
                                    `${detail.paniclow} - ${detail.panichigh} ${detail.uom}`
                                  ) : (
                                    detail.referencedata
                                  )} */}
                                  <input
                                    id={`${inputId}-referencedata`}
                                    type="text"
                                    className="Capture_Status_select1"
                                    value={detail.referencedata}
                                    autoComplete="off"
                                    onChange={(e) =>
                                      handleinputchange(index, e.target.value, "referencedata")
                                    }
                                    onKeyDown={(e) => handleInputNavigation(e, dept, index)}
                                  />
                                </td>
                                <td>
                                  {detail.Calculation === "Yes" ? (
                                    detail.capturevalue
                                  ) : (
                                    <input
                                      id={`${inputId}-absorbance`}
                                      type={detail.inputtype === "Numeric" ? "number" : "text"}
                                      className="Capture_Status_select1"
                                      value={detail.capturevalue}
                                      autoComplete="off"
                                      onChange={(e) =>
                                        handleinputchange(index, e.target.value, "capturevalue",)
                                      }
                                      onKeyDown={(e) => handleInputNavigation(e, dept, index)}
                                    />
                                  )}
                                </td>
                                <td>
                                  <input
                                    id={`${inputId}-result`}
                                    type={detail.inputtype === "Numeric" ? "number" : "text"}
                                    className="Capture_Status_select1"
                                    value={detail.Result}
                                    autoComplete="off"
                                    onChange={(e) => handleResultChange(index, e.target.value, dept)}
                                    onKeyDown={(e) => handleInputNavigation(e, dept, index)}
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
                  testDetails?.some(
                    (p) =>
                      dept === "HAEMATOLOGY" &&
                      p.testcode === "LTC1193"
                  )) && (
                    <table className="selected-medicine-table2">
                      <thead>
                        <tr>
                          <th>Test Name</th>
                          <th>Test Code</th>
                          {/* <th>Specimen</th> */}
                          {dept === "HISTOPATHOLOGY" ? <th>Histo Number</th> : dept === "CYTOLOGY" ? <th>Cyto Number</th> : null}
                          {/* <th>Format</th> */}
                          <th>File Edit</th>
                          <th>File upload</th>
                        </tr>
                      </thead>
                      <tbody>
                        {testDetails
                          .filter((p) => {
                            if (dept === "HAEMATOLOGY") {
                              return p.testcode === "LTC1193";
                            }
                            return p.subdepartment === dept;
                          })
                          .map((detail, index) => (
                            <tr key={index}>
                              <td>{detail.testname}</td>
                              <td>{detail.testcode}</td>
                              {/* <td>{detail.Specimen_Name}</td> */}
                              {detail.subdepartment !== "HAEMATOLOGY" && (
                                <td>
                                  <div className="organism_add">
                                    <input
                                      type="text"
                                      value={histonumber}
                                      className="Capture_Status_select1"
                                      onChange={(e) =>
                                        setHistonumber(e.target.value)
                                      }
                                    />
                                  </div>
                                </td>
                              )}
                              {/* <td>
                                {console.log("----pap-----", selectedFormat[detail.Test_Code])}
                                <div className="hewty_8j">
                                  <select
                                    onChange={(e) =>
                                      handleFormatChange(e, detail)
                                    }
                                    value={selectedFormat[detail.Test_Code]}
                                  >
                                    <option value="">Select</option>
                                    {dept !== "HISTOPATHOLOGY" && (
                                      <option value="peripheralSmear">
                                        Peripheral Smear (PS)
                                      </option>
                                    )}.
                                    <option value={'PAP'}>PAP</option>
                                    {dept === "HISTOPATHOLOGY" && (
                                      <>
                                        <option value="lbc">
                                          LBC (Liquid Based Cytology)
                                        </option>
                                        <option value="biopsy">Biopsy</option>
                                        <option value="fnac">
                                          FNAC (Fine Needle Aspiration Cytology)
                                        </option>
                                        <option value="histopathologySecondOpinion">
                                          Histopathology (Second Opinion)
                                        </option>
                                        <option value="pathologyReport">
                                          Pathology Report
                                        </option>
                                        <option value="Immunohistochemistry(IHC)">
                                          Immunohistochemistry (IHC)
                                        </option>
                                        <option value="Histopathology Report HP">
                                          Histopathology Report HP
                                        </option>
                                        {/* <option value="FluidCytology">
                                        Fluid Cytology
                                      </option> 
                                      </>
                                    )}
                                  </select>
                                </div>
                              </td> */}
                              <td>
                                <button
                                  onClick={() =>
                                    fetchHistopathologyDoc(
                                      detail,
                                      testFormats[detail.testcode]
                                    )
                                  }
                                >
                                  <EditIcon />
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
                                    onChange={(e) =>
                                      handlePDFupload(e.target.files[0])
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
                                    onClick={() => handleOpenPDF(file)} // ✅ fixed
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
                            </tr>
                          ))}
                        <tr className="remarks-row">
                          <td colSpan={5}>
                            <label
                              htmlFor="pathologyremark"
                              className="remarks-label"
                            >
                              Remarks<span>:</span>
                            </label>
                            <textarea
                              id="pathologyremark"
                              name="pathologyremark"
                              value={pathologyremark}
                              className="remarks-textarea"
                              onChange={(e) => setpathologyremark(e.target.value)}
                            />
                          </td>
                        </tr>
                      </tbody>
                    </table>


                  )}
              </div>
            </div>
          </div>
        ))}

      {testDetails.length !== 0 &&
        <div className="Register_btn_con">
          <button
            className="RegisterForm_1_btns"
            onClick={handleSubmitAnalyseReport}
          >
            Save
          </button>
        </div>
      }


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
            <div ref={contentRef} className="editor_life editor_lkkife">
              <div className="Histo_new_css_div_head">
                <h3>{selecteddept}</h3>
                {/* {console.log(selectedTestCode)} */}

                <div className="hytt_9u76">
                  <div className="Histo_new_css_div_head_po90">
                    {testFormats[selectedTestCode]?.slice(0, 4).map((field) => (
                      <div
                        className="Histo_new_css_div first-four"
                        key={field.name}
                      >
                        {!field.format && (
                          <label>
                            {field.name} <span>:</span>
                          </label>
                        )}
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
                  {testFormats[selectedTestCode]?.slice(4).map((field) => (
                    <div className="Histo_new_css_div" key={field.name}>
                      {!field.format && (
                        <label>
                          {field.name} <span>:</span>
                        </label>
                      )}
                      {field.name === "imageData" ? (
                        <div className="Histo_new_css_div_uHHHFH">
                          <label className="custom-file-upload">
                            <input
                              type="file"
                              onChange={handleImageChange}
                              accept="image/*"
                            />
                            Choose File
                          </label>

                          {imageFile && (
                            <>
                              {isCropping ? (
                                <>
                                  <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) =>
                                      setCrop(percentCrop)
                                    }
                                    onComplete={handleCropComplete}
                                    aspect={undefined}
                                    style={{
                                      maxWidth: "100%",
                                      background: "transparent",
                                    }}
                                  >
                                    <img
                                      ref={imgRef}
                                      src={imagePreview}
                                      alt="Preview"
                                      style={{
                                        maxWidth: "300px",
                                        marginTop: "10px",
                                        background: "transparent",
                                      }}
                                      onLoad={(e) => {
                                        imgRef.current = e.currentTarget;
                                      }}
                                    />
                                  </ReactCrop>
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <button
                                      onClick={handleApplyCrop}
                                      className="RegisterForm_1_btns"
                                    >
                                      Apply Crop
                                    </button>
                                  </div>
                                </>
                              ) : (
                                <>
                                  <img
                                    src={imagePreview}
                                    alt="Cropped Preview"
                                    style={{
                                      maxWidth: "300px",
                                      marginTop: "10px",
                                      background: "transparent",
                                    }}
                                  />
                                  <div
                                    style={{
                                      display: "flex",
                                      gap: "10px",
                                      marginTop: "10px",
                                    }}
                                  >
                                    <button
                                      onClick={handleRevertCrop}
                                      className="RegisterForm_1_btns"
                                    >
                                      Revert Crop
                                    </button>
                                  </div>
                                </>
                              )}
                            </>
                          )}
                        </div>
                      ) : (
                        !field.format && (
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
                      setopenpreview(false);
                    }}
                  >
                    Close
                  </button>
                </div>
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

      {showAntibioticModal && (
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
            <h3>Selected Antibiotics</h3>
            {Object.keys(sensitivityLevels).length === 0 ? (
              <p>No antibiotics selected.</p>
            ) : (
              <table className="microantibiotictable">
                <thead>
                  <tr>
                    <th>Antibiotic</th>
                    <th>Value</th>
                    <th>Level</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(sensitivityLevels).map(([antibiotic, data]) => (
                    <tr key={antibiotic}>
                      <td>{antibiotic}</td>
                      <td>{data.uservalue}</td>
                      <td>{data.level}</td>
                      <td>
                        <button onClick={() => handleRemoveAntibiotic(antibiotic)}>Remove</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div style={{ textAlign: "right", marginTop: "1rem" }}>
              <button onClick={() => setShowAntibioticModal(false)}>Close</button>
            </div>


          </div>
        </div>
      )}
    </>
  );
}

export default Reportcapture;
