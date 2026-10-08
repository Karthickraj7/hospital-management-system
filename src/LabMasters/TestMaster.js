import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSelector, useDispatch } from "react-redux";
import Select from "react-select";

function TestMaster() {
  // const [highlight, setHighlight] = useState(false);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);

  // const [radio, setRadio] = useState();
  const [roleData, setRoleData] = useState([]);
  // const [testDesData, setTestDesData] = useState([]);
  const [containerdata, setContainerData] = useState([]);
  const [methoddata, setMethodData] = useState([]);
  const [unitdata, setUnitData] = useState([]);
  const [specimendata, setSpecimenData] = useState([]);
  const [subDep, setSetDep] = useState([]);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const dispatchvalue = useDispatch();
  const testdata = useSelector(
    (state) => state.Frontoffice?.TestMasterEditData
  );


  console.log("testdata", testdata);
  const [TestName, setTestName] = useState([]);
  console.log(TestName)
  const [testMasterData, setTestMasterData] = useState({
    testName: "",
    testCode: "",
    department: "",
    departmentcode: "",
    subdepartment: "",
    subdepartmentcode: "",
    header: "",
    displayText: "",
    billingName: "",
    container: "",
    containercode: "",
    specimen: "",
    specimencode: "",
    method: "",
    methodcode: "",
    gender: "",
    inputType: "",
    decimalPlaces: "",
    inputPatternType: "",
    testCategory: "",
    logicalCategory: "",
    capturedUnit: "",
    uom: "",
    uomcode: "",
    reportType: "",
    testInstruction: "",
    loincCode: "",
    allowDiscount: "No",
    orderable: "No",
    showGraph: "No",
    active: "No",
    stat: "No",
    nonReportable: "No",
    calculatedTest: "No",
    isOutsourced: "No",
    minimumtime: "",
    Emergencytime: "",
    timeperiod: "",
    isEditMode: false,
    formula: "",
    paraone: "",
    paratwo: "",
    Culturetest: "No",
    Checkout: "No",
    isNABHL: "No",
    isCAP: "No",
    is_Machine_Interfaced: "No",
    Reagentlevel: "",
    AssayCode: "",
    IsSubTest: "No",
    Iscutoffvalue: "No",
    SubTestCodes: "",
    Captured_Unit_UOM: "",
    Reagent_Level_UOM: "",
    Type: "TestMaster",
    created_by: userRecord?.username,
  });

  const [fieldErrors, setFieldErrors] = useState({
    testCode: false,
    testName: false,
    subdepartment: false,
    department: false,
    gender: false,
    // other fields
  });

  const getInputBorderColor = (fieldName) => {
    if (fieldErrors[fieldName]) {
      return "red"; // Field is empty and has been submitted
    } else if (testMasterData[fieldName]) {
      return "green"; // Field is filled in
    }
    return "black"; // Default color
  };

  console.log("testMasterData:", testMasterData);
  console.log("agesetupdata:", testdata);

  useEffect(() => {
    axios
      .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=Get_AllTests`)
      .then((response) => {
        setTestName(response.data);
      })
      .catch((error) => {
        //.error(error);
      });
  }, [urllink]);

  const handleInputChangeRemarks = (selectedOptions) => {
    // Convert selected options to an array of test codes
    const selectedTestCodes = selectedOptions
      ? selectedOptions.map((option) => option.value)
      : [];

    // Exclude the main test code from the selected options
    const finalTestCodes = selectedTestCodes.filter(
      (code) => code !== testMasterData?.testCode
    );

    // Convert the array to a comma-separated string
    const finalTestCodesString = finalTestCodes.join(",");

    // Update the state with the new SubTestCodes
    setTestMasterData({
      ...testMasterData,
      SubTestCodes: finalTestCodesString, // Store as a single string with commas
    });
  };

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

  const successMsg = (msg) => {
    toast.success(`${msg}`, {
      position: "top-center",
      autoClose: 100,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      style: { marginTop: "50px" },
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;


    const dataMapping = {
      department: {
        data: roleData,
        key: "Department_Name",
        code: "Department_Code",
      },
      subdepartment: {
        data: subDep,
        key: "SubDepartment_Name",
        code: "SubDepartment_Code",
      },
      container: {
        data: containerdata,
        key: "Container_Name",
        code: "Container_Code",
      },
      specimen: {
        data: specimendata,
        key: "Specimen_Name",
        code: "Specimen_Code",
      },
      method: { data: methoddata, key: "Method_Name", code: "Method_Code" },
      uom: { data: unitdata, key: "Unit_Name", code: "Unit_Code" },
    };

    const selectedItem = dataMapping[name]
      ? dataMapping[name].data.find(
        (row) => row[dataMapping[name].key] === value
      )
      : '';

    setTestMasterData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? (checked ? "Yes" : "No") : value,
      [`${name}code`]: selectedItem?.[dataMapping[name]?.code],
    }));

    if (value) {
      setFieldErrors((prev) => ({ ...prev, [name]: false }));
    }
  };


  useEffect(() => {
    if (testdata && Object.keys(testdata).length > 0) {
      console.log("testdatadepartment", testdata.department);
      console.log("testdatasub_department", testdata.sub_department);
      setTestMasterData({
        testName: testdata.Test_Name || "",
        testCode: testdata.Test_Code || "",
        department: testdata.department || "",
        subdepartment: testdata.sub_department || "",
        header: testdata.Header || "",
        displayText: testdata.DisplayText || "",
        billingName: testdata.Billing_Name || "",
        container: testdata.Container_Name || "",
        specimen: testdata.Specimen_Name || "",
        method: testdata.Method_Name || "",
        gender: testdata.Gender || "",
        inputType: testdata.Input_Type || "",
        decimalPlaces: testdata.Decimal_Places || "",
        inputPatternType: testdata.Input_Pattern_Type || "",
        testCategory: testdata.Test_Category || "",
        logicalCategory: testdata.Logical_Category || "",
        capturedUnit: testdata.Captured_Unit || "",
        uom: testdata.UOM || "",
        reportType: testdata.Report_Type || "",
        testInstruction: testdata.Test_Instructions || "",
        loincCode: testdata.Loinc_Code || "",
        allowDiscount: testdata.Allow_Discount || "No",
        orderable: testdata.Orderable,
        showGraph: testdata.Show_Graph || "No",
        active: testdata.Active_Status || "No",
        stat: testdata.STAT || "No",
        nonReportable: testdata.Non_Reportable || "No",
        calculatedTest: testdata.Calculated_Test || "No",
        isOutsourced: testdata.Outsourced || "No",
        minimumtime: testdata.Processing_Time || "",
        Emergencytime: testdata.Emergency_Processing_Time || "",
        timeperiod: testdata.Period_Type || "",
        isEditMode: testdata.isEditMode || false,
        formula: testdata.Formula || "",
        paraone: testdata.Parameter_One || "",
        paratwo: testdata.Parameter_Two || "",
        Culturetest: testdata.Culturetest || "No",
        Checkout: testdata.Checkout || "No",
        isNABHL: testdata.Is_NABHL || "No",
        isCAP: testdata.Is_CAP || "No",
        is_Machine_Interfaced: testdata.Is_Machine_Interfaced || "No",
        Reagentlevel: testdata.Reagent_Level || "",
        AssayCode: testdata.Assay_Code || "",
        test_id: testdata.id,
        IsSubTest: testdata?.IsSubTest,
        SubTestCodes: testdata?.SubTestCodes,
        Iscutoffvalue: testdata?.Iscutoffvalue,
      });
    } else {
      axios
        .get(
          `${urllink}Masters/Get_All_Other_Masters_PrimaryCodes?Type=TestMaster`
        )
        .then((res) => {
          console.log(res.data);
          setTestMasterData((prev) => ({
            ...prev,
            testCode: res.data.TestCode,
          }));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [testdata, urllink]);

  useEffect(() => {
    axios
      .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=LabDepartment`)
      .then((response) => {
        const data = response.data;
        console.log("datadep", data);

        setRoleData(data);
      })
      .catch((error) => {
        console.error("Error fetching Department data:", error);
      });
    axios
      .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=LabSubDepartment`)
      .then((response) => {
        const data = response.data;
        console.log("data", data);
        setSetDep(data);
      })
      .catch((error) => {
        console.error("Error fetching SubDepartment data:", error);
      });

    axios
      .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=ContainerMaster`)
      .then((response) => {
        const data = response.data;
        console.log("data", data);

        setContainerData(data);
      })
      .catch((error) => {
        console.error("Error fetching container data:", error);
      });

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

    axios
      .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=UnitMaster`)
      .then((response) => {
        const data = response.data;
        console.log("data", data);

        setUnitData(data);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
      });

    axios
      .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=SpecimenMaster`)
      .then((response) => {
        const data = response.data;
        console.log("data", data);

        setSpecimenData(data);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
      });
  }, [urllink]);


  // Separate Effect - Map Department and SubDepartment Names
  useEffect(() => {
    if (roleData.length > 0 && testMasterData.department) {
      const matchedDepartment = roleData.find(
        (dept) => dept.Department_Code === testMasterData.department
      );
      if (matchedDepartment) {
        setTestMasterData((prev) => ({
          ...prev,
          department: matchedDepartment.Department_Name,
          departmentcode: matchedDepartment.Department_Code,
        }));
      }
    }

    if (subDep.length > 0 && testMasterData.subdepartment) {
      const matchedSubDepartment = subDep.find(
        (sub) => sub.SubDepartment_Code === testMasterData.subdepartment
      );
      if (matchedSubDepartment) {
        setTestMasterData((prev) => ({
          ...prev,
          subdepartment: matchedSubDepartment.SubDepartment_Name,
          subdepartmentcode: matchedSubDepartment.SubDepartment_Code,
        }));
      }
    }

    if (containerdata.length > 0 && testMasterData.container) {
      const matchedcontainer = containerdata.find(
        (sub) => sub.Container_Code === testMasterData.container
      );
      if (matchedcontainer) {
        setTestMasterData((prev) => ({
          ...prev,
          container: matchedcontainer.Container_Name,
          containercode: matchedcontainer.Container_Code,
        }));
      }
    }
    if (specimendata.length > 0 && testMasterData.specimen) {
      const matchedspecimen = specimendata.find(
        (sub) => sub.Specimen_Code === testMasterData.specimen
      );
      if (matchedspecimen) {
        setTestMasterData((prev) => ({
          ...prev,
          specimen: matchedspecimen.Specimen_Name,
          specimencode: matchedspecimen.Specimen_Code,

        }));
      }
    }

    if (methoddata.length > 0 && testMasterData.method) {
      const matchedsmethod = methoddata.find(
        (sub) => sub.Method_Code === testMasterData.method
      );
      if (matchedsmethod) {
        setTestMasterData((prev) => ({
          ...prev,
          method: matchedsmethod.Method_Name,
          methodcode: matchedsmethod.Method_Code,
        }));
      }
    }
    if (unitdata.length > 0 && testMasterData.uom) {
      const matchedsuom = unitdata.find(
        (sub) => sub.Unit_Code === testMasterData.uom
      );
      if (matchedsuom) {
        setTestMasterData((prev) => ({
          ...prev,
          uom: matchedsuom.Unit_Name,
          uomcode: matchedsuom.Unit_Code,
        }));
      }
    }

  }, [roleData, subDep, testMasterData.department, specimendata, testMasterData.specimen, unitdata, testMasterData.uom,
    testMasterData.subdepartment, containerdata, testMasterData.container]);



  const handleSubmittestData = () => {
    const missingFields = [];

    // Check for missing fields
    if (!testMasterData?.testCode) {
      missingFields.push("Test Code");
      setFieldErrors((prev) => ({ ...prev, testCode: true }));
    }
    if (!testMasterData?.testName) {
      missingFields.push("Test Name");
      setFieldErrors((prev) => ({ ...prev, testName: true }));
    }
    if (!testMasterData?.subdepartment) {
      missingFields.push("Sub Department");
      setFieldErrors((prev) => ({ ...prev, subdepartment: true }));
    }
    if (!testMasterData?.department) {
      missingFields.push("Department");
      setFieldErrors((prev) => ({ ...prev, department: true }));
    }
    if (!testMasterData?.gender) {
      missingFields.push("Gender");
      setFieldErrors((prev) => ({ ...prev, gender: true }));
    }

    // If there are missing fields, show the warning and prevent submission
    if (missingFields.length > 0) {
      const missingFieldsMessage = `Please fill out the following fields: ${missingFields.join(
        ", "
      )}.`;
      userwarn(missingFieldsMessage);
      return;
    } else {
      // If all fields are filled, proceed with the submission
      axios
        .post(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET`, testMasterData)
        .then((response) => {
          console.log(response);
          successMsg("Successfully");
          // setHide(true);
          // Reset the form fields after successful submission
          setTestMasterData({
            testName: "",
            testCode: "",
            department: "",
            subdepartment: "",
            header: "",
            displayText: "",
            billingName: "",
            container: "",
            specimen: "",
            method: "",
            gender: "",
            inputType: "",
            decimalPlaces: "",
            inputPatternType: "",
            testCategory: "",
            logicalCategory: "",
            capturedUnit: "",
            uom: "",
            reportType: "",
            testInstruction: "",
            loincCode: "",
            highlight: "No",
            allowDiscount: "No",
            orderable: "No",
            showGraph: "No",
            active: "No",
            stat: "No",
            nonReportable: "No",
            calculatedTest: "No",
            isOutsourced: "No",
            Culturetest: "No",
            Checkout: "No",
            isNABHL: "No",
            isCAP: "No",
            is_Machine_Interfaced: "No",
            Reagentlevel: "",
            AssayCode: "",
            IsSubTest: "No",
            SubTestCodes: "",
            Iscutoffvalue: "No"
          });
          dispatchvalue({ type: "labnav", value: "NewMasterList" });
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  // React.useEffect(() => {
  //   fetchTestDescriptionData();
  // }, []);
  // const fetchTestDescriptionData = () => {
  //   axios
  //     .get(`${urllink}Lab/gettestdescriptiondata`)
  //     .then((response) => {
  //       const data = response.data;
  //       console.log("data", data);

  //       // setTestDesData(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching testdescription data:", error);
  //     });
  // };

  const handleTestdata = () => {
    const updatedata = {
      ...testMasterData,
    };
    console.log(updatedata);
    axios
      .post(`${urllink}Lab/update_test_description_data`, updatedata)
      .then((response) => {
        console.log(response.data);

        setTestMasterData({
          testName: "",
          testCode: "",
          department: "",
          subdepartment: "",
          header: "",
          displayText: "",
          billingName: "",
          container: "",
          specimen: "",
          method: "",
          gender: "",
          inputType: "",
          decimalPlaces: "",
          inputPatternType: "",
          testCategory: "",
          logicalCategory: "",
          capturedUnit: "",
          uom: "",
          reportType: "",
          testInstruction: "",
          loincCode: "",
          highlight: "No",
          allowDiscount: "No",
          orderable: "No",
          showGraph: "No",
          active: "No",
          stat: "No",
          nonReportable: "No",
          Culturetest: "No",
          Checkout: "No",
          isNABHL: "No",
          isCAP: "No",
          is_Machine_Interfaced: "No",
          Reagentlevel: "",
          AssayCode: "",
          IsSubTest: "No",
          SubTestCodes: "",
          Iscutoffvalue: "No"
        });
        dispatchvalue({ type: "TestMasterEditData", value: {} });
        dispatchvalue({ type: "labnav", value: "NewMasterList" });
      })

      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="Main_container_app">

      <h3 style={{ textAlign: 'center' }}>Test Master</h3>

      <br />
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="testCode">
            Test Code <span className="mandatory"></span>
            <span style={{ color: "red", fontWeight: "bold", fontSize: "1.2rem" }}>*</span>:
          </label>
          <input
            type="text"
            id="testCode"
            name="testCode"
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            value={testMasterData.testCode}
            onChange={handleInputChange}
            readOnly
            style={{ borderColor: getInputBorderColor("testCode") }}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="testName">
            Test Name<span className="mandatory"></span>
            <span>:</span>
          </label>
          <input
            type="text"
            id="testName"
            name="testName"
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            value={testMasterData.testName}
            onChange={handleInputChange}
            required
            style={{ borderColor: getInputBorderColor("testName") }}
          />
        </div>


        <div className="RegisForm_1">
          <label htmlFor="department">
            Department<span className="mandatory"></span>
            <span style={{ color: "red", fontWeight: "bold", fontSize: "1.2rem" }}>*</span>:
          </label>
          <select
            id="department"
            name="department"
            value={testMasterData.department}
            onChange={handleInputChange}
          // style={{ borderColor: getInputBorderColor("department") }}
          >
            <option value="">Select</option>
            {Array.isArray(roleData) && roleData?.map((role, index) => (
              <option key={index} value={role.Department_Name}>
                {role.Department_Name}
              </option>
            ))}
          </select>
        </div>

        <div className="RegisForm_1">
          <label htmlFor="department">
            Sub Department<span className="mandatory"></span>
            <span style={{ color: "red", fontWeight: "bold", fontSize: "1.2rem" }}>*</span>:
          </label>
          <input
            id="subdepartment"
            name="subdepartment"
            value={testMasterData.subdepartment}
            onChange={handleInputChange}
            list="subdepList"
            autoComplete="off"
            placeholder="Select Subdepartment"
          // style={{ borderColor: getInputBorderColor("subdepartment") }}
          />
          <datalist id="subdepList">
            {Array.isArray(subDep) && subDep?.map((row, index) => (
              <option key={index} value={row.SubDepartment_Name} />
            ))}
          </datalist>

        </div>
        <div className="RegisForm_1">
          <label htmlFor="header">
            Header<span style={{ color: "red", fontWeight: "bold", fontSize: "1.2rem" }}>*</span>:
          </label>
          <input
            type="text"
            id="header"
            name="header"
            pattern="[A-Za-z ]+"
            onChange={handleInputChange}
            value={testMasterData.header}
            title="Only letters and spaces are allowed"
            required
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="displayText">
            Display Text<span style={{ color: "red", fontWeight: "bold", fontSize: "1.2rem" }}>*</span>:
          </label>
          <input
            type="text"
            id="displayText"
            onChange={handleInputChange}
            name="displayText"
            pattern="[A-Za-z ]+"
            value={testMasterData.displayText}
            title="Only letters and spaces are allowed"
            required
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="billingName">
            Billing Name<span style={{ color: "red", fontWeight: "bold", fontSize: "1.2rem" }}>*</span>:
          </label>
          <input
            type="text"
            id="billingName"
            onChange={handleInputChange}
            name="billingName"
            value={testMasterData.billingName}
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            required
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="container">
            Container<span>:</span>
          </label>
          <input
            id="container"
            onChange={handleInputChange}
            name="container"
            value={testMasterData.container}
            list="containerList"
            autoComplete="off"
            placeholder="Select Container"
          />

          <datalist id="containerList">
            {containerdata?.map((row, index) => (
              <option key={index} value={row.Container_Name} />
            ))}
          </datalist>
        </div>

        <div className="RegisForm_1">
          <label htmlFor="specimen">
            Specimen<span >:</span>
          </label>
          <input
            id="specimen"
            value={testMasterData.specimen}
            onChange={handleInputChange}
            name="specimen"
            list="specimenList"
            autoComplete="off"
            placeholder="Select Specimen"
          />
          <datalist id="specimenList">
            {specimendata?.map((row, index) => (
              <option key={index} value={row.Specimen_Name} />
            ))}
          </datalist>
        </div>

        <div className="RegisForm_1">
          <label htmlFor="method">
            Method<span >:</span>
          </label>
          <input
            id="method"
            onChange={handleInputChange}
            value={testMasterData.method}
            name="method"
            list="methodList"
            autoComplete="off"
            placeholder="Select Method"
          />
          <datalist id="methodList">
            {methoddata?.map((row, index) => (
              <option key={index} value={row.Method_Name} />
            ))}
          </datalist>
        </div>

        <div className="RegisForm_1">
          <label htmlFor="gender">
            Gender<span className="mandatory"></span>
            <span style={{ color: "red", fontWeight: "bold", fontSize: "1.2rem" }}>*</span>:
          </label>
          <select
            id="gender"
            onChange={handleInputChange}
            name="gender"
            value={testMasterData.gender}
          // style={{ borderColor: getInputBorderColor("gender") }}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Both">Both</option>
          </select>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="inputPatternType">
            Input Pattern Type<span style={{ color: "red", fontWeight: "bold", fontSize: "1.2rem" }}>*</span>:
          </label>
          <select
            id="inputPatternType"
            onChange={handleInputChange}
            name="inputPatternType"
            value={testMasterData.inputPatternType}
          >
            <option value="">Select</option>
            <option value="Numeric">Numeric</option>
            <option value="AlphaNumeric">Alpha Numeric</option>
            <option value="Symbol">Symbol</option>
          </select>
        </div>

        <div className="RegisForm_1">
          <label htmlFor="uom">
            UOM<span >:</span>
          </label>
          <input
            id="uom"
            onChange={handleInputChange}
            name="uom"
            value={testMasterData.uom}
            list="uomList"
            autoComplete="off"
            placeholder="Select UOM"
          />
          <datalist id="uomList">
            {unitdata?.map((row, index) => (
              <option key={index} value={row.Unit_Name} />
            ))}
          </datalist>
        </div>

        <div className="RegisForm_1">
          <label htmlFor="AssayCode">
            Assay Code<span>:</span>
          </label>
          <input
            type="text"
            id="AssayCode"
            name="AssayCode"
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            value={testMasterData.AssayCode}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="inputType">
            Input Type<span>:</span>
          </label>
          <select
            id="inputType"
            onChange={handleInputChange}
            name="inputType"
            value={testMasterData.inputType}
          >
            <option value="">Select</option>
            <option value="Manual">Manual</option>
            <option value="Automatic">Automatic</option>
          </select>
        </div>

        <div className="RegisForm_1">
          <label htmlFor="decimalPlaces">
            Decimal Places<span>:</span>
          </label>
          <input
            type="number"
            id="decimalPlaces"
            onChange={handleInputChange}
            name="decimalPlaces"
            value={testMasterData.decimalPlaces}
            required
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="inputPatternType">
            Minimum Processing Time<span>:</span>
          </label>
          <input
            type="number"
            id="minimumtime"
            name="minimumtime"
            required
            value={testMasterData.minimumtime}
            onChange={handleInputChange}
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="Emergencytime">
            Emergency Processing Time<span>:</span>
          </label>
          <input
            type="number"
            id="Emergencytime"
            name="Emergencytime"
            required
            value={testMasterData.Emergencytime}
            onChange={handleInputChange}
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="logicalCategory">
            Time Period<span>:</span>
          </label>
          <select
            id="timeperiod"
            onChange={handleInputChange}
            name="timeperiod"
            value={testMasterData.timeperiod}
          >
            <option value="">Select</option>
            <option value="Minute">Minute</option>
            <option value="Hours">Hours</option>
            <option value="Day">Day</option>
          </select>
        </div>



        <div className="RegisForm_1">
          <label htmlFor="testCategory">
            Test Category<span>:</span>
          </label>
          <select
            id="testCategory"
            onChange={handleInputChange}
            name="testCategory"
            value={testMasterData.testCategory}
          >
            <option value="">Select</option>
            <option value="Special">Special</option>
            <option value="STAT">STAT</option>
            <option value="General">General</option>
            <option value="Routine">Routine</option>
          </select>
        </div>

        <div className="RegisForm_1">
          <label htmlFor="logicalCategory">
            Logical Category<span>:</span>
          </label>
          <select
            id="logicalCategory"
            onChange={handleInputChange}
            name="logicalCategory"
            value={testMasterData.logicalCategory}
          >
            <option value="">Select</option>
            <option value="Lab">Lab</option>
            <option value="Imaging">Imaging</option>
            <option value="UltraSound">UltraSound</option>
            <option value="Xray">X-Ray</option>
            <option value="Bone">Bone</option>
            <option value="Blood">Blood</option>
          </select>
        </div>

        <div className="RegisForm_1 smalefhiu">
          <label htmlFor="capturedUnit">
            Captured Unit<span>:</span>
          </label>
          <input
            type="text"
            id="capturedUnit"
            name="capturedUnit"
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            onChange={handleInputChange}
            value={testMasterData.capturedUnit}
            required
          />
          <select
            id="Captured_Unit_UOM"
            onChange={handleInputChange}
            name="Captured_Unit_UOM"
            value={testMasterData.Captured_Unit_UOM}
            className="krfekj_09"
          >
            <option value="">Select</option>
            {unitdata?.map((row, index) => (
              <option key={index} value={row.Unit_Name}>
                {row.Unit_Name}
              </option>
            ))}
          </select>
        </div>


        <div className="RegisForm_1">
          <label htmlFor="reportType">
            Report<span>:</span>
          </label>
          <select
            id="reportType"
            onChange={handleInputChange}
            name="reportType"
            value={testMasterData.reportType}
          >
            <option value="">Select</option>
            <option value=" Cloud-Based"> Cloud-Based</option>
            <option value="HardCopy">Hard Copy</option>
          </select>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="testInstruction">
            Test Instruction<span>:</span>
          </label>
          <textarea
            id="testInstruction"
            onChange={handleInputChange}
            name="testInstruction"
            value={testMasterData.testInstruction}
          ></textarea>
        </div>

        {/* <div className="RegisForm_1 smalefhiu">
          <label htmlFor="Reagentlevel">
            Reagent level<span>:</span>
          </label>
          <input
            type="number"
            id="Reagentlevel"
            onChange={handleInputChange}
            value={testMasterData.Reagentlevel}
            name="Reagentlevel"
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            required
          />
          <select
            id="Reagent_Level_UOM"
            onChange={handleInputChange}
            name="Reagent_Level_UOM"
            value={testMasterData.Reagent_Level_UOM}
            className="krfekj_09"
          >
            <option value="">Select</option>
            {unitdata?.map((row, index) => (
              <option key={index} value={row.Unit_Name}>
                {row.Unit_Name}
              </option>
            ))}
          </select>
        </div> */}

        <div className="RegisForm_1">
          <label htmlFor="loincCode">
            Loinc Code<span>:</span>
          </label>
          <input
            type="text"
            id="loincCode"
            onChange={handleInputChange}
            value={testMasterData.loincCode}
            name="loincCode"
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            required
          />
        </div>

        <div className="RegisForm_1 rghrhfh">
          <label htmlFor="allowDiscount">
            Allow Discount<span>:</span>
          </label>
          <input
            type="checkbox"
            id="allowDiscount"
            onChange={handleInputChange}
            className="chk_box_23"
            name="allowDiscount"
            value={testMasterData.allowDiscount}
            checked={testMasterData.allowDiscount === "Yes"}
          />
        </div>
        <div className="RegisForm_1 rghrhfh">
          <label htmlFor="orderable">
            Orderable<span>:</span>
          </label>
          <input
            type="checkbox"
            id="orderable"
            onChange={handleInputChange}
            className="chk_box_23"
            name="orderable"
            value={testMasterData.orderable}
            checked={testMasterData.orderable === "Yes"}
          />
        </div>

        <div className="RegisForm_1 rghrhfh">
          <label htmlFor="showGraph">
            Show Graph<span>:</span>
          </label>
          <input
            type="checkbox"
            id="showGraph"
            onChange={handleInputChange}
            className="chk_box_23"
            name="showGraph"
            value={testMasterData.showGraph}
            checked={testMasterData.showGraph === "Yes"}

          />
        </div>
        <div className="RegisForm_1 rghrhfh">
          <label htmlFor="stat">
            STAT<span>:</span>
          </label>
          <input
            type="checkbox"
            id="stat"
            onChange={handleInputChange}
            className="chk_box_23"
            name="stat"
            value={testMasterData.stat}
            checked={testMasterData.stat === "Yes"}

          />
        </div>

        <div className="RegisForm_1 rghrhfh">
          <label htmlFor="active">
            Active<span>:</span>
          </label>
          <input
            type="checkbox"
            id="active"
            onChange={handleInputChange}
            className="chk_box_23"
            name="active"
            value={testMasterData.active}
            checked={testMasterData.active === "Yes"}

          />
        </div>

        <div className="RegisForm_1 rghrhfh">
          <label htmlFor="nonReportable">
            Non-reportable<span>:</span>
          </label>
          <input
            type="checkbox"
            id="nonReportable"
            onChange={handleInputChange}
            className="chk_box_23"
            name="nonReportable"
            value={testMasterData.nonReportable}
            checked={testMasterData.nonReportable === "Yes"}

          />
        </div>
        <div className="RegisForm_1 rghrhfh">
          <label htmlFor="isOutsourced">
            Is Outsourced<span>:</span>
          </label>
          <input
            type="checkbox"
            id="isOutsourced"
            onChange={handleInputChange}
            className="chk_box_23"
            name="isOutsourced"
            value={testMasterData.isOutsourced}
            checked={testMasterData.isOutsourced === "Yes"}
          />
        </div>
        <div className="RegisForm_1 rghrhfh">
          <label htmlFor="calculatedTest">
            is Machine Interfaced<span>:</span>
          </label>
          <input
            type="checkbox"
            id="is_Machine_Interfaced"
            onChange={handleInputChange}
            className="chk_box_23"
            name="is_Machine_Interfaced"
            value={testMasterData.is_Machine_Interfaced}
            checked={testMasterData.is_Machine_Interfaced === "Yes"}
          />
        </div>
        <div className="RegisForm_1 rghrhfh">
          <label htmlFor="calculatedTest">
            Calculated Test<span>:</span>
          </label>
          <input
            type="checkbox"
            id="calculatedTest"
            onChange={handleInputChange}
            className="chk_box_23"
            name="calculatedTest"
            value={testMasterData.calculatedTest}
            checked={testMasterData.calculatedTest === "Yes"}
          />
        </div>
        <div className="RegisForm_1 rghrhfh">
          <label htmlFor="calculatedTest">
            isCAP <span>:</span>
          </label>
          <input
            type="checkbox"
            id="isCAP"
            onChange={handleInputChange}
            className="chk_box_23"
            name="isCAP"
            value={testMasterData.isCAP}
            checked={testMasterData.isCAP === "Yes"}
          />
        </div>
        <div className="RegisForm_1 rghrhfh">
          <label htmlFor="calculatedTest">
            isNABHL <span>:</span>
          </label>
          <input
            type="checkbox"
            id="isNABHL"
            onChange={handleInputChange}
            className="chk_box_23"
            name="isNABHL"
            value={testMasterData.isNABHL}
            checked={testMasterData.isNABHL === "Yes"}
          />
        </div>

        <div className="RegisForm_1 rghrhfh">
          <label htmlFor="calculatedTest">
            Iscutoffvalue <span>:</span>
          </label>
          <input
            type="checkbox"
            id="Iscutoffvalue"
            onChange={handleInputChange}
            className="chk_box_23"
            name="Iscutoffvalue"
            value={testMasterData.Iscutoffvalue}
            checked={testMasterData.Iscutoffvalue === "Yes"}
          />
        </div>

        {testMasterData.calculatedTest === "Yes" ? (
          <>
            <div className="RegisForm_1">
              <label htmlFor="calculatedTest">
                Calculated Formula<span>:</span>
              </label>
              <input
                type="text"
                id="formula"
                onChange={handleInputChange}
                //  className="chk_box_23"
                name="formula"
                value={testMasterData.formula}

              //  value={testMasterData.calculatedTest}
              />
            </div>
          </>
        ) : null}
        <div className="RegisForm_1 rghrhfh">
          <label htmlFor="Culturetest">
            Culture Test<span>:</span>
          </label>
          <input
            type="checkbox"
            id="Culturetest"
            onChange={handleInputChange}
            className="chk_box_23"
            name="Culturetest"
            value={testMasterData.Culturetest}
            checked={testMasterData.Culturetest === "Yes"}
          />
        </div>
        <div className="RegisForm_1 rghrhfh">
          <label htmlFor="Checkout">
            Checkout Test <span>:</span>
          </label>
          <input
            type="checkbox"
            id="Checkout"
            onChange={handleInputChange}
            className="chk_box_23"
            name="Checkout"
            value={testMasterData.Checkout}
            checked={testMasterData.Checkout === "Yes"}
          />
        </div>
        {testMasterData.Checkout === "Yes" && (
          <>
            <div className="RegisForm_1">
              <label htmlFor="calculatedTest">
                Routine <span>:</span>
              </label>
              <input
                type="text"
                id="formula"
                onChange={handleInputChange}
                //  className="chk_box_23"
                name="paraone"
                value={testMasterData.paraone}
              //  value={testMasterData.calculatedTest}
              />
            </div>
            <div className="RegisForm_1">
              <label htmlFor="calculatedTest">
                Time Gap <span>:</span>
              </label>
              <input
                type="text"
                id="formula"
                onChange={handleInputChange}
                //  className="chk_box_23"
                name="paratwo"
                value={testMasterData.paratwo}
              //  value={testMasterData.calculatedTest}
              />
            </div>
          </>
        )}

        <div className="RegisForm_1 rghrhfh">
          <label htmlFor="IsSubTest">
            Is SubTest <span>:</span>
          </label>
          <input
            type="checkbox"
            id="IsSubTest"
            onChange={handleInputChange}
            className="chk_box_23"
            name="IsSubTest"
            value={testMasterData.IsSubTest}
            checked={testMasterData.IsSubTest === "Yes"}

          />
        </div>

        {testMasterData?.IsSubTest === "Yes" && (
          <div className="RegisForm_1">
            <label htmlFor="IsSubTest">
              SubTest <span>:</span>
            </label>

            <Select
              id="Remarks"
              name="Remarks"
              value={Array.isArray(TestName) && TestName.filter((test) =>
                testMasterData?.SubTestCodes?.split(",").includes(test.Test_Code)
              ).map((test) => ({
                value: test.Test_Code,
                label: test.Test_Name,
              }))}
              onChange={handleInputChangeRemarks}
              options={Array.isArray(TestName) && TestName
                // Exclude the main test code from the options
                .filter((test) => test.Test_Code !== testMasterData?.testCode)
                .map((test) => ({
                  value: test.Test_Code,
                  label: test.Test_Name,
                }))}
              isMulti
              classNamePrefix="react-select"
              placeholder="Select Test"
            />
          </div>
        )}
      </div>

      <div className="Main_container_Btn">
        <button

          onClick={
            testMasterData.isEditMode ? handleTestdata : handleSubmittestData
          }
        >
          {testMasterData.isEditMode ? "Update" : "Submit"}
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}

export default TestMaster;
