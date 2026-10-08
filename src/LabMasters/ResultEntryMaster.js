import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function ResultEntryMaster() {
  const [inputValue, setInputValue] = useState("");
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const [testname, setTestName] = useState([]);
  const [tags, setTags] = useState([]);
  const [selectedTestData, setSelectedTestData] = useState([]);
  const [selectedTest, setSelectedTest] = useState("");
  const [testCode, setTestCode] = useState("");
  const dispatchvalue = useDispatch();
  const ResultValueEditData = useSelector(
    (state) => state.userRecord?.ResultValueEditData
  );
  const navigate = useNavigate();

  console.log(selectedTestData);

  useEffect(() => {
    axios
      .get(`${urllink}usercontrol/get_all_test_name_forResultEntry`)
      .then((response) => {
        setTestName(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [urllink]);

  useEffect(() => {
    if (ResultValueEditData && Object.keys(ResultValueEditData).length > 0) {
      setTags(ResultValueEditData?.resultValues);
      setSelectedTest(ResultValueEditData?.testName);
      setTestCode(ResultValueEditData?.testCode);
    }
  }, []);

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleTestSelect = (e) => {
    const selectedTestName = e.target.value;
    setSelectedTest(selectedTestName);

    // Find the object that matches the selected test name and set the test code
    const selectedTestObject = testname.find(
      (test) => test.Test_Name === selectedTestName
    );

    // If found, set the test code in state
    if (selectedTestObject) {
      setTestCode(selectedTestObject.Test_Code);
    }
  };

  const handleAddTag = () => {
    if (inputValue.trim() && !tags.includes(inputValue.trim())) {
      setTags([...tags, inputValue.trim()]);
      setInputValue("");
    }
  };

  const handleRemoveTag = (index) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      handleAddTag();
    }
  };
  const handleAddTestEntry = () => {
    console.log(selectedTest);
    if (selectedTest && tags.length > 0) {
        // Check if there is already an entry with the same testCode
        const existingEntryIndex = selectedTestData.findIndex(
            entry => entry.testCode === testCode
        );

        if (existingEntryIndex !== -1) {
            // Update the result_values of the existing entry
            const updatedSelectedTestData = [...selectedTestData];
            updatedSelectedTestData[existingEntryIndex].result_values = tags.join(", ");
            setSelectedTestData(updatedSelectedTestData);
        } else {
            // Add a new entry since testCode is not found
            setSelectedTestData([
                ...selectedTestData,
                {
                    id: selectedTestData.length + 1,
                    test_name: selectedTest,
                    result_values: tags.join(", "),
                    testCode: testCode,
                },
            ]);
        }

        // Reset the tags and selectedTest
        setTags([]);
        setSelectedTest("");
    }
};

  const handleSubmit = () => {
    axios
      .post(`${urllink}usercontrol/update_ResultValues`, selectedTestData)
      .then((res) => {
        console.log(res);
        successMsg(res.data.message);
        dispatchvalue({ type: "ResultValueEditData", value: {} });
        navigate("/Home/ResulEntryValueList");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const handleEditClick = (params) => {
    console.log(params);
    setSelectedTest(params?.test_name);
    const resultValues = params?.result_values || ""; // Ensure it's not undefined
    const tagsArray = resultValues.split(",").map((value) => value.trim()); // Split by comma and trim whitespace

    // Set the tags state
    setTags(tagsArray);
  };

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
      width: 400,
      frozen: true,
    },
    {
      key: "result_values",
      name: "Result Values",
      width: 500,
      frozen: true,
    },
    {
      key: "EditAction",
      name: "Action",
      width: 70,
      renderCell: (params) => (
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => handleEditClick(params.row)}
        ></Button>
      ),
    },
  ];

  const successMsg = (message) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
      containerId: "toast-container-over-header",
      style: { marginTop: "50px" },
    });
  };

  return (
    <div className="appointment">
      <div className="h_head">
        <h4>Result Entry Master</h4>
      </div>
      <br />

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="testname">
            Test Name<span>:</span>
          </label>
          <input
            id="testname"
            name="testname"
            list="browsers1"
            value={selectedTest}
            onChange={handleTestSelect}
            autoComplete="off"
            required
          />
          <datalist id="browsers1">
            {Array.isArray(testname) &&
              testname.map((item, index) => (
                <option key={index} value={item.Test_Name}>
                  {item.Test_Name}
                </option>
              ))}
          </datalist>
        </div>

        <label htmlFor="resultValues">
          Result Values<span>:</span>
        </label>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            flexWrap: "wrap",
            border: "1px solid var(--ProjectColor)",
            padding: "8px",
            borderRadius: "4px",
            width: "700px",
          }}
        >
          {tags.map((tag, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                alignItems: "center",
                backgroundColor: "#e0e0e0",
                padding: "4px 8px",
                margin: "4px",
                borderRadius: "4px",
              }}
            >
              <span>{tag}</span>
              <button
                onClick={() => handleRemoveTag(index)}
                style={{
                  marginLeft: "8px",
                  background: "transparent",
                  border: "1px solid red",
                  cursor: "pointer",
                  backgroundColor: "#FFADB0",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                }}
              >
                &times;
              </button>
            </div>
          ))}
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Type and press Enter or comma"
            style={{ border: "none", outline: "none", flex: 1 }}
          />
        </div>

        <div className="Register_btn_con">
          <button className="RegisterForm_1_btns" onClick={handleAddTestEntry}>
            <AddIcon />
          </button>
        </div>
      </div>

      <div className="Main_container_app">
        <ReactGrid
          columns={GroupMasterlistcolumns}
          RowData={selectedTestData}
        />
      </div>
      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handleSubmit}>
          Submit
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ResultEntryMaster;
