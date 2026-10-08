import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import { ToastContainer, toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditNoteIcon from '@mui/icons-material/EditNote';
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";

import UploadIcon from '@mui/icons-material/Upload';


function AgeSetUp() {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const [SelectedFile, setSelectedFile] = useState(null);
  const [ageData, setAgeData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedid, setSelectedid] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const [testname, setTestName] = useState();
  const [TestNameList, setTestNameList] = useState([]);
  // const [TestNameList, setTestNameList] = useState([]);
  const userRecord = useSelector((state) => state.userRecord?.UserData);


  const [ageSetupData, setAgeSetupData] = useState({
    testname: "",
    gender: "",
    fromAge: "",
    ageType: "day",
    toAge: "",
    toAgeType: "day",
    fromvalue: "",
    tovalue: "",
    panicLow: "",
    panicHigh: "",
    referencerange: "",
    testcode: "",
  });

  const dispatchvale = useDispatch();

  dispatchvale({ type: "Agesetup", value: ageSetupData });

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    // Check if the input is for test name and find the corresponding test code
    if (name === "testname") {
      const selectedTest = TestNameList.find((test) => test.name === value);
      const testCode = selectedTest ? selectedTest.Test_Code : "";

      setAgeSetupData((prevData) => ({
        ...prevData,
        testname: value,
        testcode: testCode,
      }));
    } else {
      setAgeSetupData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSearchChange = (event, type) => {
    const value = event.target.value;
    if (type === "name") {
      setSearchQuery(value);
    }
  };

  const handleEdit = (row) => {
    console.log(row)
    setAgeSetupData({
      // method_id: selectedid,
      testid:row.Test_Id,
      gender: row.Gender,
      fromAge: row.FromAge,
      ageType: row.FromAgeType,
      toAge: row.Toage,
      toAgeType: row.ToAgeType,
      fromvalue: row.From_Value,
      tovalue: row.To_Value,
      panicLow: row.PanicLow,
      panicHigh: row.PanicHigh,
      testname: row.Test_Name,
      referencerange: row.Reference_Range,
      // referencerange
      testcode: row.Test_Code,
    });
    setTestName(row.TestName);
    setIsEditMode(true);
    setSelectedid(row.S_No); // Assuming `id` is the identifier
  };

  const handleUpdateMethod = () => {
    const updatedata = {
      method_id: selectedid,
      testid: ageSetupData.testid,
      gender: ageSetupData.gender,
      fromAge: ageSetupData.fromAge,
      ageType: ageSetupData.ageType,
      toAge: ageSetupData.toAge,
      toAgeType: ageSetupData.toAgeType,
      fromvalue: ageSetupData.fromvalue,
      tovalue: ageSetupData.tovalue,
      panicLow: ageSetupData.panicLow,
      panicHigh: ageSetupData.panicHigh,
      testname: testname,
      referencerange: ageSetupData.referencerange,
      testcode: ageSetupData.testcode,
      isEditMode1: true,
      Type: "AgeSetupMaster"
    };

    axios
      .post(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET`, updatedata)
      .then((response) => {
        setIsEditMode(false);
        setSelectedid(null);
        setAgeSetupData({
          testname: "",
          gender: "",
          fromAge: "",
          ageType: "day",
          toAge: "",
          toAgeType: "day",
          fromvalue: "",
          tovalue: "",
          panicLow: "",
          panicHigh: "",
          referencerange: "",
          testcode: "",
        });
        setTestName("");
        fetchAgeSetUpData();
      })

      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  const fetchAgeSetUpData = useCallback(() => {
    axios
      .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=Get_AllTests_For_AgeSetup`)
      .then((response) => {
        const data = response.data;
        console.log(data)
        setAgeData(data);
      })
      .catch((error) => {
        console.error("Error fetching agesetup data:", error);
      });
  }, [urllink]);

 useEffect(() => {
      axios
        .get(`${urllink}Lab/test_and_group_forpackage`)
        .then((res) => {
          console.log(res);
          setTestNameList(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    }, [urllink]);


  // useEffect(() => {
  //   axios
  //     .get(`${urllink}usercontrol/gettestname`)
  //     .then((response) => {
  //       console.log(response.data);
  //       const data = response.data.test_name;
  //       const testcode = response.data.test_code
  //       setAgeSetupData(prev => ({
  //         ...prev,
  //         testname: data,
  //         testcode: testcode

  //       }))
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, [urllink,]);

  // useEffect(() => {
  //   axios
  //     .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=Get_AllTests_For_AgeSetup_DataList`)
  //     .then((res) => {
  //       console.log(res)
  //       setTestNameList(res.data);
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }, [urllink]);

  React.useEffect(() => {
    fetchAgeSetUpData();
  }, [fetchAgeSetUpData]);

  const handleFileChange = (event) => {
    setSelectedFile(null);
    const { name } = event.target;
    setSelectedFile(event.target.files[0]);
    // Additional handling based on the name attribute
    if (name === "Documents") {
      // Handle Insurance file
    }
  };

  // useEffect(() => {
  //   // console.log(ageData)
  //   if (Array.isArray(ageData)) {
  //     const lowerCaseNameQuery = searchQuery.toLowerCase();
  //     const filteredData = ageData.filter((row) => {
  //       const lowerCasePatientName = row?.TestName
  //         ? row.TestName.toLowerCase()
  //         : "";
  //       return lowerCasePatientName.includes(lowerCaseNameQuery);
  //     });
  //     // console.log(filteredData)
  //     setFilteredRows(filteredData);
  //   } else {
  //     // Handle the case where ageData is not an array
  //     setFilteredRows([]);
  //   }
  // }, [searchQuery, ageData]);


  useEffect(() => {
    if (Array.isArray(ageData)) {
      const lowerCaseNameQuery = searchQuery.toLowerCase();
      const filteredData = ageData.filter((row) => {
        const lowerCaseTestName = row?.Test_Name ? row.Test_Name.toLowerCase() : "";
        return lowerCaseTestName.includes(lowerCaseNameQuery);
      });
      setFilteredRows(filteredData);
    } else {
      setFilteredRows([]);
    }
  }, [searchQuery, ageData]);

  const handleSubmit = () => {
    // Basic validation check for mandatory fields
    if (
      !ageSetupData.testname
      ||
      !ageSetupData.referencerange
    ) {
      errmsg("Mandatory fields are missing");
      // Consider using a more user-friendly way to notify about the error, such as setting an error state and displaying it in the UI
      return;
    } else {
      const postData = {
        ...ageSetupData,
        isEditMode1: false,
        Type: "AgeSetupMaster",
        created_by: userRecord?.username
        // testname, // Ensure this matches the backend expected field name, adjust if necessary
      };
      console.log(postData)
      axios
        .post(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET`, postData)
        .then((response) => {
          console.log(response.data);
          successMsg(response.data.message);
          setAgeSetupData({
            gender: "",
            fromAge: "",
            ageType: "day",
            toAge: "",
            toAgeType: "day",
            fromvalue: "",
            tovalue: "",
            panicLow: "",
            panicHigh: "",
          });
          fetchAgeSetUpData();
        })
        .catch((error) => {
          errmsg(error);
          console.log(error);
        });
    }
  };

  const successMsg = (msg) => {
    toast.success(`${msg}`, {
      position: "top-center",
      autoClose: 1000,
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

  const handleCsvupload = (type) => {
    const formData = new FormData();
    formData.append("file", SelectedFile);

    if (SelectedFile) {
      if (type === "Documents") {
        axios
          .post(
            `${urllink}Lab/insert_csv_file_for_referencerange`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
          )
          .then((response) => {
            console.log(response);
            successMsg("File Processed Successfully");

            setSelectedFile(null);
          })
          .catch((error) => {
            console.log(error);
            // errmsg(error);
          });
      }
    }
  };

  const Agesetupcolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
      frozen: true,
    },
    {
      key: "Test_Name",
      name: "Test Name",
      frozen: true,
    },
    {
      key: "Gender",
      name: "Gender",
      frozen: true,
      width: 70,
    },
    {
      key: "Age",
      name: "Age",
      frozen: true,
      width: 100,
      renderCell: (params) => (
        `${params.row.FromAge ?? ''} ${params.row.FromAgeType ?? ''} - ${params.row.Toage ?? ''} ${params.row.ToAgeType ?? ''}`
      ),
    },
    {
      key: "Reference_Range",
      name: "Reference Range",
      renderCell: (params) => (
        params.row.Reference_Range ? (
          params.row.Reference_Range
        ) : (
          '-'
        )
      ),
    },

    {
      key: "EditAction",
      name: "Action",
      width: 70,
      renderCell: (params) => (
        <Button
          onClick={() => handleEdit(params.row)}

        >
          <EditNoteIcon />
        </Button>
      ),
    },
  ];
  // console.log(ageData,"-----------------")
console.log("-----data------",ageSetupData)
  return (
    <>
      <div className="appointment">

        <p
          style={{
            color: "red",
            fontSize: "13px",
            textAlign: "center",
            width: "100%",
            justifyContent: "center",
            display: "flex",
            flexWrap: "wrap",
          }}
        >
          * Select Test From Input Field To Insert New Record or For Update Select From Table{" "}

        </p>
        <br />
        <div className="RegisFormcon">
          <div className="RegisForm_1">
            <label className="" htmlFor="selectTest">
              Test Name<span className="mandatory"></span><span>:</span>
            </label>
            <input
              type="text"
              id="testname"
              name="testname"
              list="testnamelist"
              className=""
              required
              value={ageSetupData.testname}
              onChange={handleInputChange}
              autoComplete="Off"
              placeholder="select Test"
              disabled={isEditMode}
            />
            <datalist id="testnamelist">
              {Array.isArray(TestNameList) && TestNameList?.map((item, index) => (
                <option key={index} value={item.name}>
                  {item.Test_Code}
                </option>
              ))}
            </datalist>

          </div>

          <div className="RegisForm_1">
            <label className="" htmlFor="selectTest">
              Test Code<span className="mandatory"></span><span>:</span>
            </label>
            <input
              type="text"
              id="testcode"
              name="testcode"
              className=""
              required
              disabled
              value={ageSetupData.testcode}
              onChange={handleInputChange}
            />
          </div>

          <div className="RegisForm_1">
            <label htmlFor="referencerange">
              Reference Range <span>:</span>
            </label>
            <textarea
              id="referencerange"
              name="referencerange"
              value={ageSetupData.referencerange}
              onChange={handleInputChange}
              className="custom-textarea"
            ></textarea>
          </div>
          <div className="RegisForm_1">
            <label className="" htmlFor="selectTest">
              Gender<span className="mandatory"></span><span>:</span>
            </label>
            <select
              id="gender"
              name="gender"
              required
              className=""
              value={ageSetupData.gender}
              onChange={handleInputChange}
            >
              <option value="">Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Baby">Baby</option>
              <option value="Both">Both</option>
            </select>
          </div>

          <div className="RegisForm_1">
            <label className="" htmlFor="fromAge">
              From Age<span>:</span>
            </label>
            <input
              type="number"
              id="fromAge"
              name="fromAge"
              className=""
              required
              value={ageSetupData.fromAge}
              onChange={handleInputChange}
            />
          </div>
          <div className="RegisForm_1">
            <label className="" htmlFor="ageType">
              Type<span>:</span>
            </label>
            <select
              id="ageType"
              name="ageType"
              required
              className=""
              value={ageSetupData.ageType}
              onChange={handleInputChange}
            >
              <option value="day">Day(s)</option>
              <option value="month">Month(s)</option>
              <option value="year">Year(s)</option>
            </select>
          </div>

          <div className="RegisForm_1">
            <label className="" htmlFor="toAge">
              To Age<span>:</span>
            </label>
            <input
              type="number"
              id="toAge"
              name="toAge"
              required
              value={ageSetupData.toAge}
              onChange={handleInputChange}
            />
          </div>
          <div className="RegisForm_1">
            <label className="" htmlFor="toAgeType">
              Type<span>:</span>
            </label>
            <select
              id="toAgeType"
              name="toAgeType"
              required
              className=""
              value={ageSetupData.toAgeType}
              onChange={handleInputChange}
            >
              <option value="day">Day(s)</option>
              <option value="month">Month(s)</option>
              <option value="year">Year(s)</option>
            </select>
          </div>

          <div className="RegisForm_1">
            <label className="" htmlFor="panicLow">
              From Value<span>:</span>
            </label>
            <input
              type="text"
              id="fromvalue"
              name="fromvalue"
              required
              value={ageSetupData.fromvalue}
              onChange={handleInputChange}
            />
          </div>
          <div className="RegisForm_1">
            <label className="" htmlFor="panicHigh">
              To Value<span>:</span>
            </label>
            <input
              type="text"
              id="tovalue"
              name="tovalue"
              required
              value={ageSetupData.tovalue}
              onChange={handleInputChange}
            />
          </div>

          <div className="RegisForm_1">
            <label className="" htmlFor="panicLow">
              Panic Low<span>:</span>
            </label>
            <input
              type="text"
              id="panicLow"
              name="panicLow"
              required
              value={ageSetupData.panicLow}
              onChange={handleInputChange}
            />
          </div>
          <div className="RegisForm_1">
            <label className="" htmlFor="panicHigh">
              Panic High<span>:</span>
            </label>
            <input
              type="text"
              id="panicHigh"
              name="panicHigh"
              required
              value={ageSetupData.panicHigh}
              onChange={handleInputChange}
            />
          </div>
          <div className="search_div_bar_inp_1">
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
                <PhotoCameraBackIcon />
            </label>
            <button
              className="RegisterForm_1_btns choose_file_update"
              onClick={() => handleCsvupload("Documents")}
            >
              <UploadIcon />
            </button>
          </div>
        </div>

        <div className="Register_btn_con">
          <button
            className="RegisterForm_1_btns"
            onClick={isEditMode ? handleUpdateMethod : handleSubmit}
          >
            {isEditMode ? "Update" : <AddIcon />}
          </button>
        </div>

        <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
          <div className="con_1 ">
            <div className="inp_1">
              <label htmlFor="input">
                Test Name <span>:</span>
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e, "name")}
                placeholder="Enter Test Name"
              />
            </div>
          </div>
        </div>

        <div className="Main_container_app">
          <ReactGrid columns={Agesetupcolumns} RowData={filteredRows} />
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default AgeSetUp;
