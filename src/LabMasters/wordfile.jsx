// FileUploadForm.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

const FileUploadForm = () => {
  const [file, setFile] = useState(null);
  const [testname, setTestname] = useState("");
  const [department, setDepartment] = useState("");
  const [testnames, setTestnames] = useState([]);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);

  const departments = ["MOLECULARBIOLOGY", "HISTOPATHOLOGY"];
  const [selecttestcode, setselecttestcode] = useState("");

  console.log(selecttestcode);
  const handleTestnameChange = (e) => {
    const selectedTestName = e.target.value;
    setTestname(selectedTestName);

    const selectedTest = testnames?.find(
      (item) => item.Test_Name === selectedTestName
    );
    if (selectedTest) {
      setselecttestcode(selectedTest.Test_Code || "");
    } else {
      setselecttestcode("");
    }
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleDepartmentChange = (event) => {
    setDepartment(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file || !testname || !department) {
      alert("All fields are required");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("Testname", testname);
    formData.append("department", department);
    formData.append("Test_Code", selecttestcode);

    try {
      const response = await axios.post(
        `${urllink}usercontrol/insert_word_file_for_test`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert(response.data.message);
      setTestname("");
      setDepartment("");
      setFile(null);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Error uploading file.");
    }
  };

  useEffect(() => {
    if (department) {
      axios
        .get(`${urllink}usercontrol/get_test_by_dept?department=${department}`)
        .then((response) => {
          setTestnames(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [department, urllink]);

  return (
    <div className="appointment">
      <br />
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="department">Department:</label>
          <input
            type="text"
            id="department"
            value={department}
            list="doctorlist"
            onChange={handleDepartmentChange}
          />
          <datalist id="doctorlist">
            {departments.map((item, index) => (
              <option key={index} value={item}>
                {item}
              </option>
            ))}
          </datalist>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="testname">Test Name:</label>
          <input
            type="text"
            id="testname"
            value={testname}
            onChange={handleTestnameChange}
            list="testlist"
          />
          <datalist id="testlist">
            {testnames.map((item, index) => (
              <option key={index} value={item.Test_Name}>
                {item.Test_Name}
              </option>
            ))}
          </datalist>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="CapturedFile2">Report:</label>
          <div className="RegisterForm_2">
            <input
              type="file"
              id="CapturedFile2"
              className="hiden-nochse-file"
              name="CapturedFile2"
              accept=".doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleFileChange}
              required
            />
            <label
              htmlFor="CapturedFile2"
              className="RegisterForm_1_btns choose_file_update"
            >
              Choose File
            </label>
          </div>
        </div>
      </div>
      <br />

      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handleSubmit}>
          Upload
        </button>
      </div>
    </div>
  );
};

export default FileUploadForm;
