import React, { useState, useEffect } from "react";
import "./GroupMaster.css";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDispatch, useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useNavigate } from "react-router-dom";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";

function OfferPackage() {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  console.log("urllink", urllink);
  const dispatchValue = useDispatch();

  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedtest, setselectedtest] = useState([]);
  console.log("selectedtest", selectedtest);

  
  const [editMode, setEditMode] = useState(false);
  const [groupandtestnames, setgroupandtestnames] = useState([]);
  const testdatas = useSelector((state) => state.userRecord?.OfferPackageData);
  console.log("testdatas", testdatas);
  const [openModal, setOpenModal] = useState(false);
  const [selectedrow, setselectedrow] = useState(null);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const navigate = useNavigate();
  const [Department, setDepartment] = useState([]);

  const [formData, setFormData] = useState({
    PackageName: "",
    PackageCode: "",
    displayName: "",
    gender: "",
    reportType: "",
    departmentName: "",
    testCategory: "",
    logicalCategory: "",
    authorizedUser: "",
    PackageCost: "",
  });
  console.log("formData", formData);

  // const [tableData, setTableData] = useState([]);

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

  const warnmessage = (wmsg) => {
    toast.warn(`${wmsg}`, {
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

  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  useEffect(() => {
    axios
      .get(`${urllink}Lab/test_and_group_forpackage`)
      .then((res) => {
        console.log(res);
        setgroupandtestnames(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [urllink]);





  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any required fields are empty
    const requiredFields = [
      "PackageCode",
      "PackageName",
      "displayName",
      "reportType",
      "gender",
      "reportType",
      "departmentName",
      "testCategory",
      "logicalCategory",
      "authorizedUser",
      "PackageCost",
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length === 0) {
      try {
        // Determine the endpoint based on editMode
        const endpoint = editMode
          ? `${urllink}Lab/update_offerpackage_data`
          : `${urllink}Lab/insert_offer_package`;

        // Make a POST request to the appropriate endpoint
        const response = await axios.post(endpoint, formData);

        // Handle the response as needed
        console.log("cgvh", response.data);
        successMsg("Inserted Successfully");
        navigate('/Home/MasterFolder')
        // setHide(true);

        // Reset the form data after submission
        // setFormData({
        //   PackageName: "",
        //   PackageCode: "",
        //   displayName: "",
        //   gender: "",
        //   reportType: "",
        //   departmentName: "",
        //   testCategory: "",
        //   logicalCategory: "",
        //   authorizedUser: "",
        //   PackageCost: "",
        // });

        console.log(selectedtest);
        if (!editMode) {
          await axios.post(
            `${urllink}Lab/insert_offerpackage_testlist`,
            selectedtest
          );

          successMsg("Updated Successfully");
          // setselectedtest([]);
          dispatchValue({ type: "labnav", value: "PackageMasterList" });
        }

        // Reset the editMode state after submission
        setEditMode(false);
        // setselectedtest([]);
      } catch (error) {
        console.error("An error occurred:", error);
        // Handle error scenarios
      }
    } else {
      userwarn(
        `Please fill out all required fields: ${missingFields.join(", ")}`
      );
    }
  };




  useEffect(() => {
    if (testdatas.length > 0) {
      console.log("testdatas", testdatas);

      setFormData((prevData) => ({
        ...prevData,
        PackageCode: testdatas[0].package_code,
        PackageName: testdatas[0].package_name,
        displayName: testdatas[0].display_name,
        gender: testdatas[0].gender,
        reportType: testdatas[0].report,
        departmentName: testdatas[0].department_name,
        testCategory: testdatas[0].test_category,
        logicalCategory: testdatas[0].logical_category,
        authorizedUser: testdatas[0].authorized_user,
        PackageCost: testdatas[0].Package_Cost,
        offer_package_id: testdatas[0].id,
      }));
      const transformedData = testdatas.flatMap((packageData) =>
        packageData.tests.map((test, index) => ({
          PackageCode: packageData.package_code,
          PackageName: packageData.package_name,
          TestName: test.test_name,
          Test_Code: test.Test_Code,
          Test_Method: test.Test_Method,
          id: index + 1,
          Test_Details:  Array.isArray(test.test_details) ? test.test_details : null,
          IssubTest: test.IssubTest,

        }))
      );
      console.log(transformedData);
      setselectedtest(transformedData);
      setIsEditMode(true);
    }
  }, [testdatas, urllink]);





  useEffect(() => {
    if (testdatas.length === 0) {
      axios
        .get(`${urllink}Lab/get_package_code`)
        .then((res) => {
          console.log(res);
          setFormData({
            ...formData,
            PackageCode: res.data.nextoffer_package_id,
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [testdatas, urllink]);

  const handleInsertGroupMasterTestList = () => {
    if (
      formData.PackageCode !== "" &&
      formData.PackageName !== "" &&
      selecttest !== ""
    ) {
      const isDuplicate1 = groupandtestnames.filter(
        (test) => test.group_code || test.package_code === selecttestcode
      );

      console.log(isDuplicate1);

      const newvalues = {
        id: selectedtest.length + 1,
        PackageName: formData.PackageName,
        PackageCode: formData.PackageCode,
        TestName: selecttest,
        Test_Code: selecttestcode,
        Test_Method: testmethod,
        Test_Details: isDuplicate1[0]?.test_details,
      };

      // Check for duplicates
      console.log(selecttestcode);

      const isDuplicate = selectedtest.some(
        (test) => test.Test_Code === selecttestcode
      );

      if (isDuplicate) {
        warnmessage("Duplicate entry: This Test is already added.");
      } else {
        console.log("newvalues", newvalues);
        setselectedtest((prev) => [...prev, newvalues]);
        setselecttest("");
        setselecttestcode("");
      }
    } else {
      alert("Please Enter Required Values");
    }
  };

  const handleDelete = (index) => {
    const updatedTests = selectedtest.filter((test) => test.id !== index.id);
    setselectedtest(updatedTests);
  };

  const handleTestdata = (testData) => {
    const updatedata = {
      ...formData,
      selectedtest: selectedtest,
    };
    console.log(updatedata);
    axios
      .post(`${urllink}Lab/update_offerpackage_data`, updatedata)
      .then((response) => {
        console.log(response.data);
        // navigate("/Home/OfferPackageList");
        dispatchValue({ type: "labnav", value: "PackageMasterList" });
      })

      .catch((error) => {
        console.log(error);
      });
  };

  const [selecttest, setselecttest] = useState("");
  const [selecttestcode, setselecttestcode] = useState("");

  const [testmethod, setTestMethod] = useState("");

  const handleTestNameChange = (e) => {
    console.log(e);
    const selectedTestName = e.target.value;
    const selectedTest1 = groupandtestnames?.find(
      (item) =>
        item.Test_Code === selectedTestName ||
        item.group_code === selectedTestName ||
        item.package_code === selectedTestName
    );

    setselecttest(selectedTest1?.name);
    console.log(selectedTestName);

    const selectedTest = groupandtestnames?.find(
      (item) =>
        item.Test_Code === selectedTestName ||
        item.group_code === selectedTestName ||
        item.package_code === selectedTestName
    );

    console.log(selectedTest);

    if (selectedTest) {
      if (selectedTest.testmethod === "Individual") {
        setselecttestcode(selectedTest.Test_Code || "");
        setTestMethod("individual");
      } else if (selectedTest.testmethod === "Group") {
        setselecttestcode(selectedTest.group_code || "");
        setTestMethod("Group");
      }
       else if (selectedTest.testmethod === "Offers") {
        setselecttestcode(selectedTest.package_code || "");
        setTestMethod("Offers");
      }
    } else {
      setselecttestcode("");
      setTestMethod("");
    }
  };

  const handleview = (params) => {
    console.log(params);
    const selectedTests = params?.Test_Details.map((test, index) => ({
      id: index + 1, // Use a unique identifier if available
      ...test,
    }));

    setselectedrow(selectedTests);
    setOpenModal(true);
  };

  const offerMasterlistcolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
      frozen: true,
    },
    {
      key: "TestName",
      name: "Test Name",
      width: 300,
      frozen: true,
    },

    {
      key: "EditAction1",
      name: "View",
      renderCell: (params) =>
        params.row.Test_Method === "Group" || params.row.IssubTest === 'Yes' ? (
          <Button onClick={() => handleview(params.row)}>
            <VisibilityIcon />
          </Button>
        ) : (
          "-"
        ),
    },
    {
      key: "EditAction",
      name: "Action",
      renderCell: (params) => (
        <Button
          size="small"
          onClick={() => handleDelete(params.row)}
          startIcon={<DeleteIcon />}
        ></Button>
      ),
    },
  ];

  const offerMasterviewlistcolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
      frozen: true,
    },
    {
      key: "test_name",
      name: "Test Name",
      width: 300,
      frozen: true,
    },
  ];


  // useEffect(() => {
  //   axios
  //     .get(`${urllink}mainddepartment/getsubdepartment`)
  //     .then((response) => {
  //       console.log(response);
  //       const data = response.data;
  //       console.log("data", data);

  //       setDepartment(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching SubDepartment data:", error);
  //     });
  // }, [urllink]);

  useEffect(() => {
    axios
      .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=LabSubDepartment`)
      .then((response) => {
        const data = response.data;

        setDepartment(data);
      })
      .catch((error) => {
        console.error("Error fetching SubDepartment data:", error);
      });
  }, [urllink]);

  return (
    <div className="appointment">
      <div className="h_head">
        <h4>Profile Master</h4>
      </div>
      <br />

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label className="" htmlFor="PackageCode">
            Package Code<span>:</span>
          </label>
          <input
            type="text"
            id="PackageCode"
            name="PackageCode"
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            disabled
            onChange={handleInputChange}
            value={formData.PackageCode}
          />
        </div>
        <div className="RegisForm_1">
          <label className="" htmlFor="PackageName">
            Package Name<span>:</span>
          </label>
          <input
            type="text"
            id="PackageName"
            name="PackageName"
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            // className="new_clinic_form_inp111"
            // placeholder="Enter your Group Name"
            required
            onChange={handleInputChange}
            value={formData.PackageName}
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="displayName" className="">
            Display Name<span>:</span>
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            // className="new_clinic_form_inp111"
            // placeholder="Enter your Display Name"
            required
            onChange={handleInputChange}
            value={formData.displayName}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="gender">
            Gender<span>:</span>
          </label>
          <select
            id="gender"
            name="gender"
            required
            // className="new_clinic_form_inp111"
            onChange={handleInputChange}
            value={formData.gender}
          >
            <option value="">Select</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Both">Both</option>
          </select>
        </div>

        {/* <div><dddd/div> */}

        <div className="RegisForm_1">
          <label htmlFor="report">
            Report<span>:</span>
          </label>
          <select
            id="reportType"
            name="reportType"
            required
            // className="new_clinic_form_inp111"
            onChange={handleInputChange}
            value={formData.reportType}
          >
            <option value="">Select</option>
            <option value="Cloud-Based">Cloud-Based</option>
            <option value="HardCopy">Hard Copy</option>
          </select>
        </div>

        <div className="RegisForm_1">
          <label htmlFor="departmentName" className="">
            Department Name<span className="mandatory"></span>
            <span>:</span>
          </label>
          <input
            id="departmentName"
            name="departmentName"
            required
            list="departments"
            placeholder="Select Department"
            onChange={handleInputChange}
            value={formData.departmentName}
          />
          <datalist id="departments">
            {Array.isArray(Department) &&
              Department.map((department) => (
                <option
                  key={department.SubDepartment_Code}
                  value={department.SubDepartment_Name}
                >
                  {department.SubDepartment_Name}
                </option>
              ))}
          </datalist>
        </div>

        <div className="RegisForm_1">
          <label htmlFor="testcategory" className="">
            Test Category<span>:</span>
          </label>
          <select
            id="testCategory"
            name="testCategory"
            onChange={handleInputChange}
            value={formData.testCategory}
          >
            <option value="">Select</option>
            <option value="Special">Special</option>
          </select>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="logicalcategory" className="">
            Logical Category<span>:</span>
          </label>

          <select
            id="logicalCategory"
            name="logicalCategory"
            onChange={handleInputChange}
            value={formData.logicalCategory}
          >
            <option value="">Select</option>
            <option value="Numeric">Numeric</option>
            <option value="AlphaNumeric">Alpha Numeric</option>
            <option value="Symbol">Symbol</option>
          </select>
        </div>

        <div className="RegisForm_1">
          <label htmlFor="autoauthorizeduser" className="">
            Auto Authorized User<span>:</span>
          </label>

          <input
            type="text"
            id="authorizedUser"
            name="authorizedUser"
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            required
            onChange={handleInputChange}
            value={formData.authorizedUser}
          />
        </div>

        {/* testname */}
        {/* {!isEditMode && ( */}
        <>
          <div className="RegisForm_1">
            <label htmlFor="groupcost" className="">
              Package Cost<span>:</span>
            </label>

            <input
              type="number"
              id="PackageCost"
              name="PackageCost"
              // className="new_clinic_form_inp111"
              pattern="[A-Za-z ]+"
              title="Only numbers and spaces are allowed"
              // placeholder="Enter your Group Cost"
              required
              onChange={handleInputChange}
              value={formData.PackageCost}
            />
          </div>

         
          <div className="RegisForm_1">
            <label htmlFor="testname">
              Test Name <span>:</span>
            </label>
            <input
              id="testname"
              name="testname"
              list="browsers1"
              onChange={handleTestNameChange}
              value={selecttest}
              required
            />
            <datalist id="browsers1">
              {groupandtestnames?.map((item, index) => {
                const code = item.Test_Code || item.group_code || item.package_code || "";
                const isPackage = item.testmethod === "Offers";

                return (
                  <option key={index} value={code}>
                    {item.name}
                    {isPackage && item.package_code ? ` (${item.package_code})` : ""}
                  </option>
                );
              })}
            </datalist>
          </div>

          {/* <div className="RegisForm_1">
            <label>
              {testmethod === "Group" ? "Group Code" : "Test Code"}{" "}
              <span>:</span>
            </label>
            <input
              type="text"
              id={testmethod === "Group" ? "groupcode" : "TestCode"}
              name={testmethod === "Group" ? "groupcode" : "TestCode"}
              onChange={(e) => setselecttestcode(e.target.value)}
              value={selecttestcode}
              required
            />
          </div> */}
        </>
        {/* )} */}
      </div>

      <div className="Register_btn_con">
        <button
          className="RegisterForm_1_btns"
          onClick={handleInsertGroupMasterTestList}
          // onClick={handleSubmit}
        >
          <AddIcon />
        </button>
      </div>
      <div className="Main_container_app">
        <ReactGrid columns={offerMasterlistcolumns} RowData={selectedtest} />
      </div>

      <div className="Register_btn_con">
        <button
          className="RegisterForm_1_btns"
          onClick={isEditMode ? handleTestdata : handleSubmit}
        >
          {isEditMode ? "Update" : "Submit"}
        </button>
      </div>

      {openModal && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setOpenModal(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason uwagduaguleaveauto foradvanceview"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="appointment">
              <div className="h_head">
                <h4>Test Details</h4>
              </div>

              <br />

              <div className="Main_container_app">
                <ReactGrid
                  columns={offerMasterviewlistcolumns}
                  RowData={selectedrow}
                />
              </div>

              <div className="Register_btn_con">
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => setOpenModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
}

export default OfferPackage;
