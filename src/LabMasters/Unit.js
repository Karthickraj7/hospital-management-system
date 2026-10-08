import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";

function Units() {
  const [isEditMode, setIsEditMode] = useState(false);
  const [unitData, setUnitData] = React.useState([]);
  const [unit, setUnit] = useState("");
  const [selectedid, setSelectedid] = useState(null);
  const [unitcode, setUnitCode] = useState("");
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);

  const handleSubmitUnits = async () => {
    if (!unit.trim() || !unitcode.trim()) {
      if (!unitcode) {
        userwarn("unit Code are Mandatory");
      } else if (!unit) {
        userwarn("unit  are Mandatory");
      } else {
        userwarn("Both unit Code and unit are required.");
      }

      return;
    }
    try {
      const Type = "UnitMaster";
      const createdby = userRecord?.username;
      // Make a POST request to your Django backend endpoint
      const response = await axios.post(
        `${urllink}Masters/Insert_All_Other_Masters`,
        {
          unit,
          unitcode,
          Type,
          createdby,
        }
      );

      // Handle the response as needed
      console.log(response.data);
      if (response.data.success) {
        successMsg(response.data.message);
      } else {
        userwarn(response.data.message);
      }
      fetchUnitCodeData();
      setUnit("");
      // setUnitCode('')
      // Optionally, you can reset the state after a successful submission

      fetchUnitData();
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle error scenarios
    }
  };

  const fetchUnitCodeData = useCallback(() => {
    axios
      .get(
        `${urllink}Masters/Get_All_Other_Masters_PrimaryCodes?Type=UnitMaster`
      )
      .then((response) => {
        const data = response.data;
        setUnitCode(data.unitCode);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
      });
  }, [urllink]); // No dependencies here to ensure it's only created once

  const fetchUnitData = useCallback(() => {
    axios
      .get(`${urllink}Masters/Get_All_Master_data?Type=UnitMaster`)
      .then((response) => {
        const data = response.data;
        console.log("data", data);
        setUnitData(data);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
      });
  }, [urllink]); // No dependencies here to ensure it's only created once

  useEffect(() => {
    fetchUnitData();
    fetchUnitCodeData();
  }, [fetchUnitCodeData, fetchUnitData]);

  const handleEdit = (row) => {
    setUnit(row.Unit_Name);
    setUnitCode(row.Unit_Code);
    setIsEditMode(true);
    setSelectedid(row.unit_id); // Assuming `method_id` is the identifier
  };

  const handleUpdateMethod = () => {
    axios
      .post(`${urllink}Masters/Insert_All_Other_Masters`, {
        unit: unit,
        unitcode: unitcode,
        Type: "UnitMaster",
        createdby: userRecord?.username,
      })
      .then((res) => {
        console.log(res.data);
        if (res.data.success) {
          successMsg(res.data.message);
        } else {
          userwarn(res.data.message);
        }
        fetchUnitData();
        setUnit("");
        setUnitCode("");
        setIsEditMode(false);
        setSelectedid("");
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const unitcolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
    },
    {
      key: "Unit_Code",
      name: "Unit Code",
      width: 250,
    },
    {
      key: "Unit_Name",
      name: "Unit Name",
      // width: 380,
    },
    {
      key: "EditAction",
      name: "Action",
      width: 70,
      renderCell: (params) => (
        <p
          onClick={() => handleEdit(params.row)}
          style={{ width: "130px", textAlign: "center", cursor: "pointer" }}
        >
          <EditIcon />
        </p>
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
      // containerId: "toast-container-over-header",
      style: { marginTop: "50px" },
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

  const handleSearchChange = (event, type) => {
    const value = event.target.value;
    if (type === "name") {
      setSearchQuery(value);
    }
  };

  useEffect(() => {
    // console.log(ageData)
    if (Array.isArray(unitData)) {
      const lowerCaseNameQuery = searchQuery.toLowerCase();
      const filteredData = unitData.filter((row) => {
        const lowerCasePatientName = row?.Unit_Name
          ? row.Unit_Name.toLowerCase()
          : "";
        return lowerCasePatientName.includes(lowerCaseNameQuery);
      });
      // console.log(filteredData)
      setFilteredRows(filteredData);
    } else {
      // Handle the case where ageData is not an array
      setFilteredRows([]);
    }
  }, [searchQuery, unitData]);

  return (
    <div className="appointment">
      {/* <div className="ShiftClosing_Container"> */}
      <h2 style={{ textAlign: "center" }}>Unit Master</h2>
      <br />
      {/* <div style={{ width: "100%", display: "grid", placeItems: "center" }}> */}
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="input">
            Unit Code <span>:</span>
          </label>
          <input
            type="text"
            id="FirstName"
            name="roleName"
            value={unitcode}
            disabled
            onChange={(e) => setUnitCode(e.target.value)}
            placeholder="Enter Unit Code"
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="input">
            Unit <span>:</span>
          </label>
          <input
            type="text"
            id="FirstName"
            name="roleName"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="Enter Unit"
          />
        </div>

        <button
          className="RegisterForm_1_btns"
          onClick={isEditMode ? handleUpdateMethod : handleSubmitUnits}
        >
          {isEditMode ? "Update" : <AddIcon />}
        </button>
      </div>
      <br />
      <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
        <div className="con_1 ">
          <div className="inp_1">
            <label htmlFor="input">
              Unit Name <span>:</span>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e, "name")}
              placeholder="Search Units"
            />
          </div>
        </div>
      </div>
      <div className="Main_container_app">
        <ReactGrid columns={unitcolumns} RowData={filteredRows} />
      </div>
      <ToastContainer />
    </div>
  );
}

export default Units;
