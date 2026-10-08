import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditNoteIcon from '@mui/icons-material/EditNote';



function ReflexMaster() {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);

  // Initialize state for CPT and CPRT
  const [mainTest, setMainTest] = useState("");
  const [reflexTest, setReflexTest] = useState("");
  const [reflexCode, setReflexCode] = useState("");
  const [reflexData, setReflexData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedid, setSelectedid] = useState(null);
  const [filteredRows, setFilteredRows] = useState([]);
  const [testname, setTestName] = useState("");
  const [Test_Code, setTest_Code] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Handle changes in CPT input

  // Handle changes in CPRT input
  const handlereflexTestChange = (event) => {
    setReflexTest(event.target.value);
  };
  const handlereflexCodeChange = (event) => {
    setReflexCode(event.target.value);
  };
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setReflexData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // useEffect(() => {
  //   axios
  //     .get(`${urllink}usercontrol/gettestname`)
  //     .then((response) => {
  //       console.log(response.data);
  //       const data = response.data.test_name;
  //       const testcode = response.data.test_code;
  //       setTestName(data);
  //       setTest_Code(testcode);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //     });
  // }, []);

  const handlesubmit = () => {
    const postdata = {
      maintest: mainTest,
      reflextestname: reflexTest,
      reflexcode: reflexCode,
      testname: testname,
      Test_Code: Test_Code,
    };

    if (!mainTest || !reflexTest || !reflexCode) {
      alert("Please Enter All data");
    } else {
      axios
        .post(`${urllink}usercontrol/insertreflexdata`, postdata)
        .then((response) => {
          console.log(response);
          setMainTest("");
          setReflexCode("");
          setTestName("");
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const fetchReflexData = useCallback(() => {
    axios
      .get(`${urllink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=Get_AllTests_For_Reflex`)
      .then((response) => {
        const data = response.data;
        console.log("fetchReflexData", data);

        setReflexData(data);
      })
      .catch((error) => {
        console.error("Error fetching Reflex data:", error);
      });
  }, [urllink]);
  React.useEffect(() => {
    fetchReflexData();
  }, [fetchReflexData]);

  const handleEdit = (row) => {
    console.log(row);
    setMainTest(row.Main_Test);
    setReflexTest(row.Reflex_Test);
    setMainTest(row.Main_Test);
    setReflexCode(row.Reflex_Code);
    setTestName(row.Test_Name);
    setIsEditMode(true);
    setSelectedid(row.Test_id); // Assuming `id` is the identifier
    setTest_Code(row.Test_Code);
  };

  const handleUpdateMethod = () => {
    const updatedata = {
      method_id: selectedid, // Assuming `id` is the identifier
      mainTest: mainTest,
      reflexTest: reflexTest,
      reflexCode: reflexCode,
      testname: testname,
      Test_Code: Test_Code,
    };

    axios
      .post(`${urllink}usercontrol/updatereflexdata`, updatedata)
      .then((response) => {
        console.log(response.data);
        setIsEditMode(false);
        setSelectedid(null);
        setMainTest("");
        setReflexTest("");
        setReflexCode("");
        setTestName("");
        fetchReflexData();
      })

      .catch((error) => {
        console.error("An error occurred:", error);
      });
  };

  const handleSearchChange = (event, type) => {
    const value = event.target.value;
    if (type === "name") {
      setSearchQuery(value);
    }
  };

  useEffect(() => {
    if (Array.isArray(reflexData)) {
      const lowerCaseNameQuery = searchQuery.toLowerCase();
      const filteredData = reflexData.filter((row) => {
        const lowerCasePatientName = row?.Test_Name
          ? row.Test_Name.toLowerCase()
          : "";
        return lowerCasePatientName.includes(lowerCaseNameQuery);
      });
      setFilteredRows(filteredData);
    } else {
      // Handle the case where ageData is not an array
      setFilteredRows([]);
    }
  }, [searchQuery, reflexData]);

  const ReflexMastercolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
    },
    {
      key: "Test_Name",
      name: "Test Name",
      width: 300,
    },
    {
      key: "Reflex_Test",
      name: "Reflex Test",
    },
    {
      key: "Reflex_Code",
      name: "Redflex Code",
    },

    {
      key: "EditAction",
      name: "Action",
      renderCell: (params) => (
        <Button
          onClick={() => handleEdit(params.row)}
        >
          <EditNoteIcon />
        </Button>
      ),
    },
  ];

  return (
    <div className="appointment">
      <br />

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label className="new_form_first" htmlFor="selectTest">
            Test Name<span>:</span>
          </label>
          <input
            type="text"
            id="testname"
            name="selectTest"
            // placeholder="Enter Test Name"
            // className="new_clinic_form_inp"
            required
            value={testname}
            onChange={handleInputChange}
            readOnly
          />
        </div>
        {/* <div className="RegisForm_1">
            <label htmlFor="productName" >
              MainTest<span>:</span>
            </label>
            <input
              type="text"
              id="maintest"
              name="mainTest"
              // placeholder="Enter MainTest"
              value={mainTest}
              onChange={handlemainTestChange} // Handle changes in CPT input
              required
            />
          </div> */}

        <div className="RegisForm_1">
          <label htmlFor="productType">
            ReflexTest<span>:</span>
          </label>
          <input
            type="text"
            id="reflexTest"
            name="reflexTest"
            // placeholder="Enter ReflexTest"
            value={reflexTest}
            onChange={handlereflexTestChange} // Handle changes in CPRT input
            required
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="productType">
            ReflexCode<span>:</span>
          </label>
          <input
            type="text"
            id="reflexCode"
            name="reflexCode"
            // placeholder="Enter ReflexCode"
            value={reflexCode}
            onChange={handlereflexCodeChange} // Handle changes in CPRT input
            required
          />
        </div>
      </div>
      <div className="Register_btn_con">
        <button
          className="RegisterForm_1_btns"
          onClick={isEditMode ? handleUpdateMethod : handlesubmit}
        >
          {isEditMode ? "Update" : <AddIcon />}
        </button>
      </div>
      <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
        <div className="con_1 ">
          <div className="inp_1">
            <label htmlFor="input">Test Name :</label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e, "name")}
              placeholder="Enter Test Name"
            />
          </div>
        </div>
        <br />
      </div>
      <div className="Main_container_app">
        <ReactGrid columns={ReflexMastercolumns} RowData={filteredRows} />
      </div>
    </div>
  );
}

export default ReflexMaster;
