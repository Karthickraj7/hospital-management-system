import React, { useState, useEffect, useCallback } from "react";
import "./GroupMaster.css";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useSelector,useDispatch } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

function GroupMaster() {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const navigate = useNavigate();
  // const [isEditMode, setIsEditMode] = useState(false);
  const [testname, setTestName] = useState([]);
  const [selecttest, setselecttest] = useState("");
  const [selectedtest, setselectedtest] = useState([]);
  const [selecttestcode, setselecttestcode] = useState("");
  const [Department, setDepartment] = useState([]);
  const [SelectedFile, setSelectedFile] = useState(null);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const dispatchvalue = useDispatch();
  const testdatas = useSelector((state) => state.Frontoffice?.GroupMasterEditData);
  console.log("testdatas", testdatas);
  const [formData, setFormData] = useState({
    groupCode: "",
    groupName: "",
    displayName: "",
    billingCode: "",
    billingName: "",
    gender: "",
    reportType: "",
    departmentName: "",
    SubDepartment_Code: "",
    testCategory: "",
    logicalCategory: "",
    authorizedUser: "",
    lonicCode: "",
    groupCost: "",
    selectedtest: [],
    Type: "GroupMaster",
    created_by: userRecord?.username,
    isEditMode: false,
  });
  console.log(formData);
  console.log(selectedtest);

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

  const handleTestNameChange = (e) => {
    const selectedTestName = e.target.value;

    setselecttest(selectedTestName);

    const selectedTest = testname?.find(
      (item) => item.Test_Name === selectedTestName
    );
    if (selectedTest) {
      setselecttestcode(selectedTest.Test_Code || "");
    } else {
      setselecttestcode("");
    }
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

  const errmsg = (errorMessage) => {
    toast.error(`${errorMessage}`, {
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
    let SubDepartment_Code;

    if (name === "departmentName") {
      const selectedDepartment = Department?.find(
        (item) => item.SubDepartment_Name === value
      );
      SubDepartment_Code = selectedDepartment?.SubDepartment_Code;
    }

    // Only set SubDepartment_Code if it is available and not already in the formData
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      SubDepartment_Code: SubDepartment_Code || prevData.SubDepartment_Code,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any required fields are empty
    const requiredFields = [
      "groupCode",
      "groupName",
      "gender",
      "departmentName",
      "groupCost",
      "selectedtest"
    ];
    const missingFields = requiredFields.filter((field) => !formData[field]);

    if (missingFields.length === 0) {
      try {
        const updatedSelectedTest = selectedtest.map((test) => ({
          ...test,
          group_name: formData.groupName,
        }));

        const updatedFormData = {
          ...formData,
          selectedtest: updatedSelectedTest,
        };
        console.log(updatedFormData);
        const response = await axios.post(
          `${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET`,
          updatedFormData
        );


        // setselectedtest([]);
        console.log(response);
        successMsg(response.data.message);
        setFormData({
          groupCode: "",
          groupName: "",
          displayName: "",
          billingCode: "",
          billingName: "",
          gender: "",
          reportType: "",
          departmentName: "",
          SubDepartment_Code: "",
          testCategory: "",
          logicalCategory: "",
          authorizedUser: "",
          lonicCode: "",
          groupCost: "",
          selectedtest: [],
          Type: "GroupMaster",
          created_by: userRecord?.username,
          isEditMode: false,
        });

        
        navigate("/Home/MasterFolder");
        dispatchvalue({ type: "labnav", value: "GroupMasterList"  });
      } catch (error) {
        console.error("An error occurred:", error);
      }
    } else {
      const missingFieldsStr = missingFields.join(", ");
      userwarn(`Please fill out the following required fields: ${missingFieldsStr}`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=Get_AllTests&gender=${formData?.gender}`
        );
        console.log(response.data);
        setTestName(response.data);
      } catch (error) {
        console.error("Error fetching test names:", error);
      }
    };

    fetchData();
  }, [urllink, formData.gender]);
  // Inside your component
  //
  useEffect(() => {
    if (testdatas && Object.keys(testdatas).length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        groupCode: testdatas.Group_Code,
        groupName: testdatas.Group_Name,
        displayName: testdatas.Display_Name,
        billingCode: testdatas.Billing_Code,
        billingName: testdatas.Billing_Name,
        gender: testdatas.Gender,
        reportType: testdatas.Report_Type,
        departmentName: testdatas.Sub_DepartmentName,
        SubDepartment_Code: testdatas?.Department_id,
        testCategory: testdatas.Test_Category,
        logicalCategory: testdatas.Logical_Category,
        authorizedUser: testdatas.AutoAuthorized_User,
        lonicCode: testdatas.Lonic_Code,
        groupCost: testdatas?.Amount,
        isEditMode: testdatas?.isEditMode,
      }));
      setselectedtest(testdatas?.GroupList || []);
      // setIsEditMode(testdatas.isEditMode);
    } else {
      axios
        .get(
          `${urllink}Masters/Get_All_Other_Masters_PrimaryCodes?Type=GroupMaster`
        )
        .then((res) => {
          console.log(res.data);
          setFormData((prev) => ({
            ...prev,
            groupCode: res.data.GroupCode,
          }));
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, [testdatas, urllink]);

  const handleInsertGroupMasterTestList = () => {
    console.log(selecttest);
    console.log(formData);
    if (selecttest !== "") {
      console.log(selecttestcode);
      const isTestCodeExists = selectedtest.some(
        (test) => test.Test_Code === selecttestcode
      );

      if (isTestCodeExists) {
        alert(
          "Test code already exists with the name: " +
          selectedtest.find((test) => test.Test_Code === selecttestcode)
            .TestName
        );
      } else {
        const newvalues = {
          id: selectedtest.length + 1,
          group_code: formData.groupCode,
          test_name: selecttest,
          Test_Code: selecttestcode,
        };
        console.log(newvalues);
        setselectedtest((prev) => [...prev, newvalues]);
        setselecttest("");
        setselecttestcode("");
      }
    } else {
      alert("Please Enter Required Values");
    }
  };

  

  const fetchGroupMasterList = useCallback(() => {
    axios
      .get(
        `${urllink}usercontrol/getgroupmastermasterlist?groupcode=${testdatas?.group_code}`
      )
      .then((response) => {
        const data = response.data;
        console.log("masterlist", data);

        setselectedtest(data);
      })
      .catch((error) => {
        console.error("Error fetching groupmaster masterlist data:", error);
      });
  }, [urllink, testdatas]);

  React.useEffect(() => {
    fetchGroupMasterList();
  }, [fetchGroupMasterList]);

  const handleDelete = (index) => {
    console.log(index);
    console.log(selectedtest);

    // Remove the row at the specified index
    const updatedTests = selectedtest.filter(
      (test) => test.Test_Code_id !== index.Test_Code_id
    );

    // Update the state with the modified data
    setselectedtest(updatedTests);
  };

  console.log("formData", formData);

  const GroupMasterlistcolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
      frozen: true,
    },
    {
      key: "test_name",
      name: "Test Name",
      frozen: true,
    },

    {
      key: "EditAction",
      name: "Action",
      renderCell: (params) => (
        <p
          onClick={() => handleDelete(params.row)}
          style={{
            width: "130px",
            display: "flex",
            cursor: "pointer",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <DeleteIcon />
        </p>
      ),
    },
  ];

  return (
    <div className="Main_container_app">
    <h3>Profile Master</h3>
      <br />

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label className="" htmlFor="groupCode">
            Group Code<span className="mandatory"></span>
            <span>:</span>
          </label>
          <input
            type="text"
            id="groupCode"
            name="groupCode"
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            // className="new_clinic_form_inp111"
            // placeholder="Enter your Group Code"
            required
            disabled
            onChange={handleInputChange}
            value={formData.groupCode}
          />
        </div>
        <div className="RegisForm_1">
          <label className="" htmlFor="GroupName">
            Group Name<span className="mandatory"></span>
            <span>:</span>
          </label>
          <input
            type="text"
            id="groupName"
            name="groupName"
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            // className="new_clinic_form_inp111"
            // placeholder="Enter your Group Name"
            required
            onChange={handleInputChange}
            value={formData.groupName}
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
          <label htmlFor="billingCode" className="">
            Billing Code<span>:</span>
          </label>

          <input
            type="text"
            id="billingCode"
            name="billingCode"
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            // className="new_clinic_form_inp111"
            // placeholder="Enter your Billing Code"
            required
            onChange={handleInputChange}
            value={formData.billingCode}
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="billingName" className="">
            Billing Name<span>:</span>
          </label>
          <input
            type="text"
            id="billingName"
            name="billingName"
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            // className="new_clinic_form_inp111"
            // placeholder="Enter your Billing Name"
            required
            onChange={handleInputChange}
            value={formData.billingName}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="gender">
            Gender<span className="mandatory"></span>
            <span>:</span>
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
            // className="new_clinic_form_inp111"
            onChange={handleInputChange}
            value={formData.testCategory}
          >
            <option value="">Select</option>
            <option value="Special">Special</option>
            <option value="STAT">STAT</option>
            <option value="General">General</option>
            <option value="Routine">Routine</option>
          </select>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="logicalcategory" className="">
            Logical Category<span>:</span>
          </label>

          <select
            id="logicalCategory"
            name="logicalCategory"
            // className="new_clinic_form_inp111"
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
            // className="new_clinic_form_inp111"
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            // placeholder="Enter your Auto Authorized User"
            required
            onChange={handleInputChange}
            value={formData.authorizedUser}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="loniccode" className="">
            Lonic Code<span>:</span>
          </label>

          <input
            type="text"
            id="loincCode"
            name="lonicCode"
            // className="new_clinic_form_inp111"
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            // placeholder="Enter your Lonic Code"
            required
            onChange={handleInputChange}
            value={formData.lonicCode}
          />
        </div>

        {/* testname */}
        {
          <>
            <div className="RegisForm_1">
              <label htmlFor="groupcost" className="">
                Group Cost<span className="mandatory"></span>
                <span>:</span>
              </label>

              <input
                type="number"
                id="groupCost"
                name="groupCost"
                // className="new_clinic_form_inp111"
                pattern="[A-Za-z ]+"
                title="Only numbers and spaces are allowed"
                // placeholder="Enter your Group Cost"
                required
                onChange={handleInputChange}
                value={formData.groupCost}
                disabled={formData?.isEditMode}
              />
            </div>

            <div className="RegisForm_1">
              <label className="" htmlFor="test names">
                Test Name <span className="mandatory"></span>
                <span>:</span>
              </label>

              <input
                id="testname"
                name="testname"
                list="browsers1"
                onChange={handleTestNameChange}
                value={selecttest}
                required
                autoComplete="off"
                placeholder="Select Test"
              />
              <datalist id="browsers1">
                {testname && testname.length > 0 ? (
                  testname.map((item, index) => (
                    <option key={item.Test_Code} value={item.Test_Name}>
                      {item.Test_Name}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    No tests available
                  </option>
                )}
              </datalist>
            </div>
            {/* <div className="RegisForm_1">
              <label>
                Test Code <span>:</span>
              </label>
              <input
                type="text"
                id="Test_Code"
                name="Test_Code"
                onChange={(e) => setselecttestcode(e.target.value)}
                value={selecttestcode}
                required
              />
            </div> */}
            {/* <div className="RegisForm_1">
              <label>
                {" "}
                Upload CSV File <span>:</span>{" "}
              </label>
              <input
                type="file"
                accept=".xlsx, .xls, .csv"
                id="Servicechoose"
                required
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
              <label
                htmlFor="Servicechoose"
                className="RegisterForm_1_btns choose_file_update"
              >
                Choose File
              </label>
              <button
                className="RegisterForm_1_btns choose_file_update"
                onClick={() => handleCsvupload("Documents")}
              >
                Upload
              </button>
            </div> */}
          </>
        }
      </div>

      <div className="Register_btn_con">
        <button
          className="RegisterForm_1_btns"
          onClick={handleInsertGroupMasterTestList}
        >
          <AddIcon />
        </button>
      </div>
      <br />
      <div className="Main_container_app">
        <ReactGrid columns={GroupMasterlistcolumns} RowData={selectedtest} />
      </div>

      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handleSubmit}>
          {formData?.isEditMode ? "Update" : "Submit"}
        </button>
      </div>

      <ToastContainer />
    </div>
  );
}

export default GroupMaster;





