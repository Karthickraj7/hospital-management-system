import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { TiArrowDownThick, TiArrowUpThick } from "react-icons/ti";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import mammoth from "mammoth";
// import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
// import { CKEditor } from "@ckeditor/ckeditor5-react";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import Select from "react-select";
import { ToastContainer, toast } from "react-toastify";

function Reportcapture({ filteredTests }) {
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
  console.log("userRecord................", userRecord);

  // const [filteredRows, setFilteredRows] = useState([]);
  const [testDetails, setTestDetails] = useState([]);

  const [LabRemarksdata, setLabRemarksdata] = useState([]);
  console.log(LabRemarksdata);

  const [captureOrganism, setcaptureOrganism] = useState("");
  const [formatword, setformatword] = useState("");
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
  console.log("capturedatas", capturedatas);
  const [filteredDepartments, setFilteredDepartments] = useState([]);
const [AnalysisTestData,setAnalysisTestData] = useState([])
  // const [showFile, setShowFile] = useState({
  //     file1: false,
  // });
  // const [isImageCaptured1, setIsImageCaptured1] = useState(false);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  // const [facingMode, setFacingMode] = useState("user");
  // const devices = ["iPhone", "iPad", "Android", "Mobile", "Tablet", "desktop"];
  // const [IsmobileorNot, setIsmobileorNot] = useState(null);
  // const [samplepicture, setsamplepicture] = useState(null)
  const dispatchvalue = useDispatch();
  const [sensitivityLevels, setSensitivityLevels] = useState({});
  // const [department, setDepartment] = useState([])
  // const, setselectdepartment] = useState()
  const [openpreview, setopenpreview] = useState(false);
  const [selectedAntibiotics, setSelectedAntibiotics] = useState({});
  const navigate = useNavigate();
  const [content, setContent] = useState("");
  const contentRef = useRef(null);

  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChangeComment = (e) => {
    setIsChecked(e.target.checked);
  };

  // const remarksOptions =
  //   Array.isArray(LabRemarksdata) &&
  //   LabRemarksdata.map((remark) => ({
  //     value: remark.LabRemarks,
  //     label: remark.LabRemarks,
  //   }));

  const inputRefs = useRef([]);

  const handleKeyDown = (event, index) => {
    if (event.key === "ArrowDown" || event.key === "Enter") {
      event.preventDefault();
      const nextInput = inputRefs.current[index + 1];
      if (nextInput) {
        nextInput.focus();
      }
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      const prevInput = inputRefs.current[index - 1];
      if (prevInput) {
        prevInput.focus();
      }
    }
  };

  const handleInputChangeRemarks = (detail, selectedOptions) => {
    // Find the test detail using the testcode
    const updatedTestDetails = testDetails.map((testDetail) => {
      if (testDetail.Test_Code === detail.Test_Code) {
        // If selectedOptions is not null, map through the selected remarks and join them with spaces
        const selectedRemarks = selectedOptions
          ? selectedOptions.map((option) => option.value).join(".")
          : "";

        // Update the Remarks field with the selected remarks
        return {
          ...testDetail,
          Remarks: selectedRemarks,
        };
      }
      return testDetail;
    });

    // Update the state or do further processing as needed
    setTestDetails(updatedTestDetails);
  };

  useEffect(() => {
    axios
      .get(`${urllink}usercontrol/getsetLabRemarksdata`)
      .then((response) => {
        const data = response.data;
        setLabRemarksdata(data);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
      });
  }, [urllink]);

  // const handlereportedit = (data, word) => {
  //   let department = data?.subdepartment;
  //   console.log(data);
  //   let testname = word;
  //   let testcode = data?.testcode;

  //   axios
  //     .get(
  //       `${urllink}/Billing/get_word_data?department=${department}&testname=${testname}&testcode=${testcode}`,
  //       { responseType: "blob" }
  //     )
  //     .then((response) => {
  //       console.log(response);
  //       const fileReader = new FileReader();
  //       fileReader.onload = () => {
  //         const arrayBuffer = fileReader.result;
  //         // loadWordFile(arrayBuffer);
  //       };
  //       fileReader.readAsArrayBuffer(response.data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching DOCX file:", error);
  //     });
  //   setopenpreview(true);
  // };

  // const loadWordFile = async (arrayBuffer) => {
  //   try {
  //     const { value, messages } = await mammoth.convertToHtml({ arrayBuffer });

  //     if (messages && messages.length > 0) {
  //       console.warn("Conversion warnings:", messages);
  //     }

  //     setContent(value); // Assuming setContent is a state setter to update your HTML content
  //   } catch (error) {
  //     console.error("Error converting DOCX to HTML:", error);
  //   }
  // };

  const ResultEntryNavigationdata = useSelector(
    (state) => state.Frontoffice?.ResultEntryNavigationdata
  );

  console.log(ResultEntryNavigationdata);

  useEffect(() => {
    if (
      ResultEntryNavigationdata &&
      Object.keys(ResultEntryNavigationdata).length > 0
    ) {
      setTestDetails(ResultEntryNavigationdata?.Analysis_FilteredTests);
      setFilteredDepartments(ResultEntryNavigationdata?.filterdepartment);
    }
  }, [ResultEntryNavigationdata]);

  // useEffect(() => {
  //   axios
  //     .get(
  //       `${urllink}Billing/getcompletedsample?Billinginvoice=${capturedatas?.Billing_Invoice}&Location=${userRecord?.location}&gender=${capturedatas?.Gender}&age=${capturedatas?.Age}&timeperiod=${capturedatas?.Time_Period}&Department=${userRecord?.Department}`
  //     )
  //     .then((response) => {
  //       console.log("------------", response);
  //       const data = response.data.map((item, index) => ({
  //         id: index + 1, // Assigning a unique id based on the item index
  //         testcode: item.Test_Code,
  //         testname: item.Test_Name,
  //         testnames: item.Test_Name,
  //         Captured_Unit: item.Captured_Unit,
  //         Container_Name: item.Container_Name,
  //         Specimen_Name: item.Specimen_Name,
  //         UpdateAt: capturedatas.UpdatedAt,
  //         paniclow: item.PanicLow,
  //         panichigh: item.PanicHigh,
  //         Calculation: item.Calculation,
  //         Formula: item.Formula,
  //         patient_name: capturedatas.Patient_Name,
  //         Billing_Invoice: capturedatas.Billing_Invoice,
  //         barcodedata: capturedatas.Barcode_id,
  //         parameterone: item.Parameterone,
  //         parametertwo: item.parametertwo,
  //         Colonycount: item.Colonycount,
  //         uom: item.Captured_Unit,
  //         culturetest: item.culturetest || "",
  //         inputtype: item.input_type,
  //         organisn: item.Organism || [],
  //         antibiotic: item.Antibiotic || [],
  //         subdepartment: item.Department,
  //         reference: item.Reference,
  //         referencedata: item.Referencedata,
  //         Test_Method: item.Test_Method || "",
  //         Result_Value: item.Result_Value,
  //         // captureOrganism : captureOrganism
  //         technicalRemark: item.Technical_Remark,
  //         Remarks: item.Remarks,
  //         Group_Name: item.Group_Name,
  //         PackageName: item.PackageName,
  //         Item_Id: item.Item_Id,
  //         is_sub_test: item.is_sub_test,
  //         sub_test_code: item.sub_test_code,
  //         sub_department_code: item.sub_department_code,
  //         ResultValues: item.ResultValues,
  //         // You don't need to explicitly include the 'actions' field here
  //       }));
  //       // setFilteredRows(data);
  //       setTestDetails(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching data: ", error);
  //     });
  // }, [capturedatas, urllink, userRecord]);

  // useEffect(() => {
  //   axios
  //     .get(
  //       `${urllink}Phelobotomist/getmachineinterfaceresult?sampleid=${capturedatas?.Barcode}`
  //     )
  //     .then((response) => {
  //       console.log("------------", response);
  //       const data = response.data;

  //       // Create a copy of testDetails and update Result_Value for matching testcode

  //       if (data.length > 0 && testDetails.length > 0) {
  //         let foundmatch = false;
  //         const updatedTestDetails = testDetails.map((testDetail) => {
  //           console.log(testDetail.testcode, "7uy84y8789");
  //           const matchingResult = data.find(
  //             (item) => item.LIS_MACHTESTID === testDetail.testcode
  //           );
  //           console.log("matchingResult", matchingResult);
  //           if (matchingResult) {
  //             foundmatch = true;
  //             return {
  //               ...testDetail,
  //               Result_Value: matchingResult.LIS_MACHRESULTS,
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
  // }, [capturedatas?.Barcode, testDetails, urllink]);

  const handleRemarksChange = (index, newValue, depart) => {
    const updatedvall = [...testDetails];
    const updatedvalue = updatedvall.filter((p) => p.subdepartment === depart);

    // Check if culture test is "Yes" for the corresponding test
    if (updatedvalue[index].culturetest === "Yes") {
      updatedvalue[index].Colonycount = newValue; // Update Colonycount
    } else {
      updatedvalue[index].Result_Value = newValue;
    }

    setTestDetails(updatedvall); // Use the original array with the modified sub-array
  };

  // const handleRemarksChange1 = (detail, newValue, depart) => {
  //   console.log(detail);

  //   // Create a shallow copy of testDetails
  //   const updatedvall = [...testDetails];

  //   // Update the specific test's Result_Value based on the provided detail
  //   const updatedTestDetails = updatedvall.map((item) => {
  //     // Check if the testcode matches
  //     if (item.testcode === detail.testcode) {
  //       return { ...item, Result_Value: newValue };
  //     }
  //     return item;
  //   });

  //   console.log('updatedTestDetails :',updatedTestDetails)
  //   // Sum capture values of tests in the "DIFFERENTIAL COUNT" group
  //   const differentialCountTests = updatedTestDetails.filter(
  //     (item) => item.Group_Name === "DIFFERNTIAL COUNT"
  //   );

  //   console.log('differentialCountTests :',differentialCountTests)
  //   // Calculate the sum of capturevalues for the filtered tests
  //   const sumCaptureValue = differentialCountTests.reduce((sum, item) => {
  //     return sum + (Number(item.Result_Value) || 0); // Ensure Result_Value is a number
  //   }, 0);

  //   // Check if the sum exceeds 100 and alert if it does
  //   if (sumCaptureValue > 100) {
  //     const testValues = differentialCountTests.map(item =>
  //       `${item.testname}: ${item.Result_Value}`
  //     ).join(", ");

  //     alert(`The sum of capture values for DIFFERENTIAL COUNT exceeds 100!\nTest Values: ${testValues}\nTotal: ${sumCaptureValue}`);
  //   }

  //   // Update the state with the modified test details
  //   setTestDetails(updatedTestDetails);
  // };

  const handleRemarksChange1 = (detail, newValue, depart) => {
    // Step 1: Flatten the structure and update the necessary values
    let updatedvall = [];
  
    // Flatten testDetails and update Result_Value and Analysis_Status
    testDetails.forEach(item => {
      if (item.group_items && Array.isArray(item.group_items)) {
        updatedvall = [...updatedvall, ...item.group_items];
      } else {
        updatedvall.push(item);
      }
    });
  
    // Update the details (Result_Value and Analysis_Status)
    const updatedTestDetails = updatedvall.map((item) => {
      if (item.Test_Code === detail.Test_Code) {
        return {
          ...item,
          Result_Value: newValue,
          Analysis_Status: "Completed",
        };
      }
      return item;
    });
  
    console.log("updatedTestDetails (flattened):", updatedTestDetails);
  setAnalysisTestData(updatedTestDetails)
    // Step 2: Restore the original structure with groups
    const restoredTestDetails = [];
  
    testDetails.forEach(originalItem => {
      if (originalItem.group_items && Array.isArray(originalItem.group_items)) {
        // If it's a group, add back the group_items with updated values
        const updatedGroupItems = originalItem.group_items.map(groupItem => {
          const updatedItem = updatedTestDetails.find(
            updated => updated.Test_Code === groupItem.Test_Code
          );
          return updatedItem ? { ...groupItem, ...updatedItem } : groupItem;
        });
  
        restoredTestDetails.push({
          ...originalItem,
          group_items: updatedGroupItems
        });
      } else {
        // If it's an individual item, just push the updated version
        const updatedItem = updatedTestDetails.find(
          updated => updated.Test_Code === originalItem.Test_Code
        );
        restoredTestDetails.push(updatedItem ? { ...originalItem, ...updatedItem } : originalItem);
      }
    });
  
    console.log("restoredTestDetails (with groups):", restoredTestDetails);
  
    // Step 3: Set the final updated test details
    setTestDetails(restoredTestDetails);
  };
  
  const handleantibiotic = () => {
    navigate("/Home/Antibioticmaster");
  };

  const blockInvalidChar = (e) =>
    ["e", "E", "+", "-"].includes(e.key) && e.preventDefault();

  // useEffect(() => {
  //   const updatedTestDetails = Array.isArray(testDetails) && testDetails.map((test) => {
  //     if (test.Calculation === "Yes") {
  //       const formula = test.Formula.trim();
  //       console.log("formula", formula);
  //       const parts = tokenizeFormula(formula); // Tokenize formula excluding parentheses and operators

  //       const parameters = {};
  //       console.log("parts", parts);

  //       // Populate parameters with values from  testDetails
  //       parts.forEach((element) => {
  //         if (isNaN(element)) {
  //           const parameterTest = testDetails.find(
  //             (item) => item.testcode === element
  //           );
  //           console.log("parameterTest", parameterTest);
  //           parameters[element] = parameterTest
  //             ? parseFloat(parameterTest.Result_Value) || 0
  //             : 0;
  //         }
  //       });

  //       // Evaluate expression using parameters
  //       return evaluateExpression(formula, parameters)
  //         .then((result) => {
  //           console.log("res........", result);
  //           return { ...test, Result_Value: parseFloat(result) || 0 }; // Return a new object with updated Result_Value
  //         })
  //         .catch((error) => {
  //           console.error("Error evaluating expression:", error);
  //           return { ...test, Result_Value: 0 }; // Return a new object with Result_Value set to 0 in case of error
  //         });
  //     }
  //     return test;
  //   });

  //   // Wait for all promises to resolve
  //   Promise.all(updatedTestDetails).then((updatedTestDetailsResolved) => {
  //     // Check if the updatedTestDetailsResolved is different from the current state
  //     const isTestDetailsChanged =
  //       JSON.stringify(updatedTestDetailsResolved) !==
  //       JSON.stringify(testDetails);

  //     // Update the state only if the testDetails has changed
  //     if (isTestDetailsChanged) {
  //       setTestDetails(updatedTestDetailsResolved);
  //     }
  //   });
  // }); // Depend on testDetails to trigger the effect

  async function evaluateExpression(tokens, parameters) {
    console.log(parameters);
    try {
      const response = await axios.get(
        `${urllink}Billing/getformula_calculated_value`,
        {
          params: {
            formula: tokens,
            parameters: JSON.stringify(parameters),
          },
        }
      );
      console.log(response.data);
      const currentOperand = response.data?.valll;
      console.log(currentOperand, "0000000000000000");
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

  const handleCheckboxChange = (antibiotic) => {
    setSelectedAntibiotics((prevSelected) => {
      // If "All" is selected, toggle all antibiotics
      if (antibiotic === "All") {
        const allAntibiotics = getFilteredAntibiotics().filter(
          (item) => item !== "All"
        );
        const areAllSelected = allAntibiotics.every(
          (item) => prevSelected[item]
        );

        // If all are selected, deselect all, otherwise select all
        const newSelectionState = areAllSelected
          ? {}
          : allAntibiotics.reduce((acc, item) => {
              acc[item] = true;
              return acc;
            }, {});

        return newSelectionState;
      } else {
        // Toggle the selection state of the specific antibiotic
        return {
          ...prevSelected,
          [antibiotic]: !prevSelected[antibiotic],
        };
      }
    });
  };

  const handlemedicalRemarksChange = (index, newValue) => {
    const updatedTestDetails = [...testDetails];
    updatedTestDetails[index].medicalremark = newValue;
    setTestDetails(updatedTestDetails);
  };
  const handletecnicalRemarksChange = (detail, newValue) => {
    setTestDetails((prevTestDetails) =>
      prevTestDetails.map((item) =>
        item.testcode === detail.testcode
          ? { ...item, Remarks: newValue }
          : item
      )
    );
  };

  const handlenavigateagesetupmaster = () => {
    navigate("/Home/TestMastersNavigation");
  };

  const handleSensitivityChange = (level) => {
    const updatedLevels = { ...sensitivityLevels };
    Object.keys(selectedAntibiotics).forEach((antibiotic) => {
      if (selectedAntibiotics[antibiotic]) {
        updatedLevels[antibiotic] = level;
      }
    });
    setSensitivityLevels(updatedLevels);
    // Reset selected antibiotics
    setSelectedAntibiotics({});
  };

  const getFilteredAntibiotics = () => {
    const allAntibiotics = testDetails
      .filter((p) => p.culturetest === "Yes")
      .flatMap((detail) => detail.antibiotic);

    const filteredAntibiotics = allAntibiotics.filter(
      (antibiotic) => !sensitivityLevels[antibiotic]
    );

    return ["All", ...filteredAntibiotics];
  };

  // const isEmptyObject = (obj) => {
  //     return Object.keys(obj).length === 0;
  // };

  const handleSubmitAnalyseReport = () => {
    // const differentialCountTests = testDetails.filter(
    //   (item) => item.Group_Name === "DIFFERNTIAL COUNT"
    // );

    // console.log("differentialCountTests:", differentialCountTests);

    // // Calculate the sum of capturevalues for the filtered tests
    // const sumCaptureValue = differentialCountTests.reduce((sum, item) => {
    //   return sum + (Number(item.Result_Value) || 0); // Ensure Result_Value is a number
    // }, 0);

    // // Check if the sum exceeds 100 and alert if it does
    // if (sumCaptureValue > 100) {
    //   const testValues = differentialCountTests
    //     .sort((a, b) => a.Item_Id - b.Item_Id) // Sort by itemid
    //     .map((item) => `${item.testname}: ${item.Result_Value || 0}`)
    //     .join("\n"); // Join the values with a new line

    //   const alertMessage =
    //     `The sum of capture values for DIFFERENTIAL COUNT exceeds 100!\n` +
    //     `Test Values:\n${testValues}\n` +
    //     `Total: ${sumCaptureValue}`;

    //   alert(alertMessage);
    // }

    // if (reportformat === 'Sensitivity' && isEmptyObject(sensitivityLevels) && isEmptyObject(selectedAntibiotics)){
    console.log(testDetails);
    console.log(AnalysisTestData)
    console.log(ResultEntryNavigationdata);
    delete ResultEntryNavigationdata.Analysis_FilteredTests;
    console.log(ResultEntryNavigationdata)
    // Create updatedData by adding testDetails as Analysis_FilteredTests
    ResultEntryNavigationdata.Analysis_FilteredTests = AnalysisTestData
    console.log(ResultEntryNavigationdata)
    const postdata = {
      ...ResultEntryNavigationdata,
      SelectedTest: testDetails,
      captureOrganism: captureOrganism,
      content: content || "",
      // Photo: samplepicture,
      Notes: comments || "",
      microscopy: microscopy || "",
      reportformat: reportformat || "",
      nogrowthreport: nogrowthreport || "",
      reportstatus: reportstatus || "",
      user_id: userRecord?.user_id,
      PageType: "ResultEntry",
    };

    // const formData = new FormData();
    // for (const key in postdata) {
    //   if (key === "Photo" && postdata[key]) {
    //     formData.append(key, postdata[key]); // Append file directly
    //   } else if (typeof postdata[key] === "object" && postdata[key] !== null) {
    //     formData.append(key, JSON.stringify(postdata[key])); // Stringify JSON objects
    //   } else {
    //     formData.append(key, postdata[key]); // Append simple values directly
    //   }
    // }

    console.log(postdata);
    // Perform API calls

    axios
      .post(`${urllink}OP/POST_Lab_Data`, postdata)

      .then((response) => {
        console.log(response);
        dispatchvalue({ type: "Navigationlab", value: "" });
        navigate("/Home/ResultEntryNavigation");
      })
      .catch((error) => {
        console.log(error);
      });

    // }else{
    //     alert("Please Submit Sensitivity & Antibiotic")
    // }
  };

  const handlecontinueprocess = () => {
    const culturepost = {
      Billing_Invoice: capturedatas?.Billing_Invoice,
      visitid: capturedatas?.VisitId,
      patient_Id: capturedatas?.Patient_Id,
      CreatedBy: userRecord?.username,
      Location: userRecord?.location,
      Patient_name: capturedatas?.Patient_Name,
      refering_doc: capturedatas?.Refering_Doctor,
      antibiotic: sensitivityLevels,
      captureOrganism: captureOrganism,
    };

    axios
      .post(`${urllink}Phelobotomist/insert_into_culture_report`, culturepost)
      .then((response) => {
        console.log(response);
        setSelectedAntibiotics({});
        setSensitivityLevels({});
      })
      .catch((error) => {
        console.error(error);
      });
  };

  console.log("selectedAntibiotics........", selectedAntibiotics);
  console.log("sensitivityLevels", sensitivityLevels);

  console.log("testDetails", testDetails);

  useEffect(() => {
    axios
      .get(`${urllink}usercontrol/get_test_name_by_word`)
      .then((response) => {
        console.log(typeof response.data, "8888888888888888888888888888");
        setwordtest(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [urllink]);

  // useEffect(() => {
  //   if (!userRecord || !userRecord.Department) return;

  //   axios
  //     .get(`${urllink}Billing/get_for_pending_result_offer`, {
  //       params: {
  //         invoice: capturedatas?.Billing_Invoice,
  //       },
  //     })
  //     .then((response) => {
  //       console.log(response);

  //       // Assuming response.data is an array of departments
  //       const fetchedDepartments = response.data.map((dept) => dept.trim());
  //       // setDepartment(fetchedDepartments);

  //       // Filter the fetched departments based on userRecord.Department
  //       const userDepartments = userRecord.Department.split(",").map((dept) =>
  //         dept.trim()
  //       );
  //       const filtered = fetchedDepartments.filter((dept) =>
  //         userDepartments.includes(dept)
  //       );
  //       setFilteredDepartments(filtered);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [capturedatas, urllink, userRecord]);

  // const filteredTestDetails = testDetails?.filter(
  //   (detail) => detail.Test_Method === "offer"
  // );

  // const groupedTests = Object.entries(
  //   filteredTestDetails?.reduce((acc, detail) => {
  //     const packageName = detail.PackageName || "";
  //     const groupName = detail.Group_Name || "Individual Test";

  //     if (!acc[packageName]) {
  //       acc[packageName] = {};
  //     }

  //     if (!acc[packageName][groupName]) {
  //       acc[packageName][groupName] = [];
  //     }

  //     acc[packageName][groupName].push(detail);
  //     return acc;
  //   }, {})
  // );

  const userwarn = (warningMessage) => {
    toast.warn(`${warningMessage}`, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: { marginTop: "50px" },
    });
  };
  console.log(testDetails);
  console.log(filteredDepartments);
  return (
    <div className="Main_container_app">
      <h3>Result Entry</h3>
      <br />

      {testDetails && testDetails.length > 0 && (
        <>
          {/* Non-offer tests grouped by department */}
          {filteredDepartments
            .filter((dept) =>
              testDetails.some(
                (detail) =>
                  detail.SubDepartment_Code || detail?.Department === dept.key
              )
            )
            .map((dept, deptIndex) => (
              <div style={{ width: "100%" }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: "bold",
                  }}
                >
                  {dept.value}
                </span>
                <div className="samplecapture_component">
                  <div className="Selected-table-container">
                    {dept.value !== "HISTOPATHOLOGY" &&
                      !testDetails?.some(
                        (p) =>
                          p.SubDepartment_Code === dept &&
                          p.culturetest === "Yes"
                      ) && (
                        <>
                          <table className="selected-medicine-table2 xshxshshsx_j_table">
                            <thead>
                              <tr>
                                <th>Test Name</th>
                                <th>Specimen</th>
                                <th>Test Method</th>
                                <th>Capture Value</th>
                                <th>Reference Range</th>
                                <th>Indicator</th>
                                <th>Remarks</th>
                              </tr>
                            </thead>
                            <tbody>
                              {console.log(testDetails)}
                              {testDetails
                                .filter(
                                  (detail) =>
                                    detail.SubDepartment_Code === dept.key &&
                                    detail.culturetest !== "Yes"
                                )
                                .map((detail, detailIndex) => {
                                  const filteredRemarksOptions =
                                    Array.isArray(LabRemarksdata) && LabRemarksdata.filter(
                                      (remark) =>
                                        remark.DepartmentCode ===
                                        detail.sub_department
                                    ).map((remark) => ({
                                      value: remark.LabRemarks,
                                      label: remark.LabRemarks,
                                    }));

                                  return (
                                    <React.Fragment key={detailIndex}>
                                      {detail?.type === "group" && (
                                        <>
                                          <tr>
                                            <td
                                              colSpan={7}
                                              style={{
                                                fontWeight: "bold",
                                                fontSize: "15px",
                                                backgroundColor: "#f7f7f7",
                                                textAlign: "center",
                                              }}
                                            >
                                              {detail?.SelectItemName}
                                            </td>
                                          </tr>
                                          {detail.group_items?.map(
                                            (groupItem, groupIndex) => (
                                              <tr key={groupIndex}>
                                                <td>{groupItem.Test_Name}</td>
                                                <td>
                                                  {groupItem.Specimen_Name ||
                                                    "-"}
                                                </td>
                                                <td>
                                                  {groupItem.Method_Name || "-"}
                                                </td>
                                                <td>
                                                  <input
                                                    type="text"
                                                    className="Capture_Status_select1"
                                                    value={
                                                      groupItem.Result_Value ||
                                                      ""
                                                    }
                                                    onChange={(e) =>
                                                      handleRemarksChange1(
                                                        groupItem,
                                                        e.target.value,
                                                        groupItem
                                                      )
                                                    }
                                                  />
                                                </td>
                                                <td>
                                                  {groupItem.paniclow -
                                                    groupItem.panichigh || "-"}
                                                </td>
                                                <td>
                                                  {groupItem.inputtype ===
                                                    "Numeric" &&
                                                    Number(
                                                      groupItem.Result_Value
                                                    ) >=
                                                      Number(
                                                        groupItem.panichigh
                                                      ) && (
                                                      <span className="indicator">
                                                        <p id="sfishifisusvg">
                                                          {"\u2191"}
                                                        </p>
                                                      </span>
                                                    )}
                                                  {groupItem.inputtype ===
                                                    "Numeric" &&
                                                    Number(
                                                      groupItem.Result_Value
                                                    ) <=
                                                      Number(
                                                        groupItem.paniclow
                                                      ) && (
                                                      <span
                                                        className="indicatorlow"
                                                        style={{
                                                          color: "blue",
                                                        }}
                                                      >
                                                        <p id="sfishifisusvg_low">
                                                          {"\u2193"}
                                                        </p>
                                                      </span>
                                                    )}
                                                </td>
                                                <td>
                                                  <Select
                                                    id="Remarks"
                                                    name="Remarks"
                                                    value={Array.isArray(filteredRemarksOptions) && filteredRemarksOptions.filter(
                                                      (option) =>
                                                        groupItem.Remarks.includes(
                                                          option.value
                                                        )
                                                    )}
                                                    onChange={(
                                                      selectedOptions
                                                    ) =>
                                                      handleInputChangeRemarks(
                                                        groupItem,
                                                        selectedOptions
                                                      )
                                                    }
                                                    options={Array.from(
                                                      new Map(
                                                        filteredRemarksOptions.map(
                                                          (item) => [
                                                            item.value,
                                                            item,
                                                          ]
                                                        )
                                                      ).values()
                                                    )}
                                                    isMulti
                                                    classNamePrefix="react-select"
                                                    placeholder="Select Remarks"
                                                  />
                                                </td>
                                              </tr>
                                            )
                                          )}
                                        </>
                                      )}

                                      {detail?.type !== "group" && (
                                        <tr>
                                          <td>{detail.Test_Name}</td>
                                          <td>{detail.Specimen_Name}</td>
                                          <td>{detail.Method_Name}</td>
                                          <td>
                                            {detail.Calculation === "Yes" ? (
                                              detail.Result_Value
                                            ) : detail.ResultValues ? (
                                              <select
                                                className="Capture_Status_select1"
                                                value={detail.Result_Value}
                                                onChange={(e) =>
                                                  handleRemarksChange1(
                                                    detail,
                                                    e.target.value,
                                                    detail
                                                  )
                                                }
                                              >
                                                <option value="">Select</option>
                                                {detail.ResultValues.split(
                                                  ","
                                                ).map((value, index) => (
                                                  <option
                                                    key={index}
                                                    value={value.trim()}
                                                  >
                                                    {value.trim()}
                                                  </option>
                                                ))}
                                              </select>
                                            ) : (
                                              <input
                                                type={
                                                  detail.Input_Pattern_Type ===
                                                  "Numeric"
                                                    ? "number"
                                                    : "text"
                                                }
                                                className="Capture_Status_select1"
                                                value={detail.Result_Value}
                                                onChange={(e) =>
                                                  handleRemarksChange1(
                                                    detail,
                                                    e.target.value,
                                                    detail
                                                  )
                                                }
                                                onKeyDown={(e) =>
                                                  handleKeyDown(e, detailIndex)
                                                }
                                                ref={(el) =>
                                                  (inputRefs.current[
                                                    detailIndex
                                                  ] = el)
                                                }
                                              />
                                            )}
                                          </td>
                                          <td>{detail.referencedata || "-"}</td>
                                          <td>
                                            {detail.Input_Pattern_Type ===
                                              "Numeric" && (
                                              <>
                                                {Number(detail.Result_Value) >=
                                                Number(detail.panichigh) ? (
                                                  <span className="indicator">
                                                    <p id="sfishifisusvg">
                                                      {"\u2191"}
                                                    </p>
                                                  </span>
                                                ) : Number(
                                                    detail.Result_Value
                                                  ) <=
                                                  Number(detail.paniclow) ? (
                                                  <span
                                                    className="indicatorlow"
                                                    style={{ color: "blue" }}
                                                  >
                                                    <p id="sfishifisusvg_low">
                                                      {"\u2193"}
                                                    </p>
                                                  </span>
                                                ) : (
                                                  <p
                                                    style={{
                                                      backgroundColor:
                                                        "transparent",
                                                      color: "green",
                                                    }}
                                                  >
                                                    Normal
                                                  </p>
                                                )}
                                              </>
                                            )}
                                          </td>
                                          {/* <td>
                                            <Select
                                              id="Remarks"
                                              name="Remarks"
                                              value={Array.isArray(filteredRemarksOptions) && filteredRemarksOptions.filter(
                                                (option) =>
                                                  detail.Remarks.includes(
                                                    option.value
                                                  )
                                              )}
                                              onChange={(selectedOptions) =>
                                                handleInputChangeRemarks(
                                                  detail,
                                                  selectedOptions
                                                )
                                              }
                                              options={Array.from(
                                                new Map(
                                                  Array.isArray(filteredRemarksOptions) && filteredRemarksOptions.map(
                                                    (item) => [item.value, item]
                                                  )
                                                ).values()
                                              )}
                                              isMulti
                                              classNamePrefix="react-select"
                                              placeholder="Select Remarks"
                                            />
                                          </td> */}
                                        </tr>
                                      )}
                                    </React.Fragment>
                                  );
                                })}
                            </tbody>
                          </table>
                        </>
                      )}
                  </div>
                </div>
              </div>
            ))}
        </>
      )}

      <div className="Register_btn_con">
        <button
          className="RegisterForm_1_btns"
          onClick={handleSubmitAnalyseReport}
        >
          Save
        </button>
      </div>

      {/* {openpreview && (
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
                onClick={() => setopenpreview(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )} */}
      <ToastContainer />
    </div>
  );
}

export default Reportcapture;
