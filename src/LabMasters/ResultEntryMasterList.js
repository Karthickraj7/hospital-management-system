import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useNavigate } from "react-router-dom";
import DeleteOutlineTwoToneIcon from "@mui/icons-material/DeleteOutlineTwoTone";

function ResultEntryMasterList() {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const [ResultValuedata, setResultValuedata] = useState([]);
  console.log(ResultValuedata);
  const [searchQuery, setSearchQuery] = useState("");
  const [FilteredRows, setFilteredRows] = useState([]);
  const navigate = useNavigate();
  const dispatchvalue = useDispatch();

  useEffect(() => {
    axios
      .get(`${urllink}usercontrol/get_ResultValue`)
      .then((response) => {
        const selectedTests = response.data?.map((test, index) => ({
          id: index + 1, // Use a unique identifier if available
          ...test,
        }));

        setResultValuedata(selectedTests);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [urllink]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const lowerCaseTestNameQuery = searchQuery.toLowerCase();

    // Filter data based on all search queries
    const filteredData = ResultValuedata.filter((row) => {
      const lowerCaseTestName = row.Test_Name
        ? row.Test_Name.toLowerCase()
        : "";

      return lowerCaseTestName.includes(lowerCaseTestNameQuery);
    });

    setFilteredRows(filteredData);
  }, [searchQuery, ResultValuedata]);

  const handlenavigate = () => {
    dispatchvalue({ type: "ResultValueEditData", value: {} });
    navigate("/Home/ResultEntryMaster");
  };

  const handlenavigateEdit = (params) => {
    console.log(params);

    const testName = params.row.Test_Name;
    const testCode = params.row.Test_Code;
    const resultValuesString = params.row.ResultValues;

    const resultValuesList = resultValuesString
      ? resultValuesString.split(",").map((value) => value.trim())
      : [];

    const finalObject = {
      testName: testName,
      testCode: testCode,
      resultValues: resultValuesList,
    };

    console.log(finalObject);
    dispatchvalue({ type: "ResultValueEditData", value: finalObject });
    navigate("/Home/ResultEntryMaster");
  };

  const removetheresultvalue = (params) => {
    console.log(params);

    const conmsg = window.confirm(
      `Are You Sure ! You Want Remove the Result Value For this Test - ${params?.Test_Name}`
    );
    if (conmsg) {
      axios
        .post(
          `${urllink}usercontrol/Remove_ResultValues?Test_Code=${params?.Test_Code}`
        )
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      return;
    }
  };

  const GroupMasterlistcolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
      frozen: true,
    },
    {
      key: "Test_Name",
      name: "Test Name",
      width: 300,
      frozen: true,
    },
    {
      key: "ResultValues",
      name: "Result Values",
      width: 500,
      frozen: true,
    },
    {
      key: "EditAction",
      name: "Action",
      width: 90,
      renderCell: (params) => (
        <p
          style={{ width: "130px", textAlign: "center", cursor: "pointer" }}
          onClick={() => handlenavigateEdit(params)}
        >
          <EditIcon />
        </p>
      ),
    },
    {
      key: "DeleteAction",
      name: "Remove",
      width: 90,
      renderCell: (params) => (
        <p
          onClick={() => removetheresultvalue(params.row)}
          style={{ width: "130px", textAlign: "center", cursor: "pointer"}}
        >
          <DeleteOutlineTwoToneIcon />
        </p>
      ),
    },
  ];

  return (
    <div className="appointment">
      <div className="h_head">
        <h4>ResultEntry MasterList</h4>
      </div>
      <br />

      <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
        <div className="con_1 ">
          <div className="inp_1">
            <label htmlFor="input">
              Test Name <span>:</span>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Enter Test Name"
            />
          </div>
          <button
            className="RegisterForm_1_btns"
            type="submit"
            onClick={handlenavigate}
          >
            <AddCircleOutlineIcon />
          </button>
        </div>
      </div>

      <div className="Main_container_app">
        <ReactGrid columns={GroupMasterlistcolumns} RowData={FilteredRows} />
      </div>
    </div>
  );
}

export default ResultEntryMasterList;
