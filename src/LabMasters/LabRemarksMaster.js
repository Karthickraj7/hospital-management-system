import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

function LabRemarksMaster() {
  const [LabRemarks, setLabRemarks] = useState("");
  const [LabRemarkID, setLabRemarkID] = useState("");
  const [LabRemarksdata, setLabRemarksdata] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const [departmentrole, setDepartmentRole] = useState([]);
  const [selecteddepartment, setselecteddepartment] = useState("");
  console.log(selecteddepartment);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log(searchQuery);

  const handleSubmit = async () => {
    const datatosend = {
      LabRemarks: LabRemarks,
      LabRemarkID: LabRemarkID,
      Department: selecteddepartment,
      Type: "LabRemarksData",
      createdby: userRecord?.username,
    };

    if (!LabRemarks.trim() || !LabRemarkID.trim()) {
      userwarn("Both LabRemarks ID Name and LabRemarks are required.");
      return;
    }
    try {
      // Make a POST request to your Django backend endpoint
      const response = await axios.post(
        `${urllink}Masters/Insert_All_Other_Masters`,
        datatosend
      );

      // Handle the response as needed
      console.log(response.data);
      successMsg("Successfully Inserted");
      fetchLabRemarkID();
      fetchLabRemarkdata();
      setLabRemarks("");
      setselecteddepartment("");
      setIsEditMode(false);
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle error scenarios
    }
  };

  const handleEdit = (params) => {
    console.log(params);
    setLabRemarkID(params?.LabRemarkID);
    setLabRemarks(params?.LabRemarks);
    setselecteddepartment(params?.Department);
    setIsEditMode(true);
  };

  const fetchLabRemarkdata = useCallback(() => {
    axios
      .get(`${urllink}Masters/Get_All_Master_data?Type=LabRemarksData`)
      .then((response) => {
        console.log(response);
        const data = response.data.map((row, index) => ({
          id: index + 1,
          ...row,
        }));
        setLabRemarksdata(data);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
      });
  }, [urllink]); // No dependencies here to ensure it's only created once

  const fetchLabRemarkID = useCallback(() => {
    axios
      .get(
        `${urllink}Masters/Get_All_Other_Masters_PrimaryCodes?Type=LabRemarksData`
      )
      .then((response) => {
        const data = response.data;
        setLabRemarkID(data.LabRemarkID);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
      });
  }, [urllink]); // No dependencies here to ensure it's only created once

  useEffect(() => {
    fetchLabRemarkID();
    fetchLabRemarkdata();
  }, [fetchLabRemarkID, fetchLabRemarkdata]);

  const unitcolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
      frozen: true,
    },
    // {
    //   key: "LabRemarkID",
    //   name: "Remark ID",
    //   frozen: true,
    // },
    {
      key: "Department_Name",
      name: "Department Name",
      frozen: true,
    },
    {
      key: "LabRemarks",
      name: "LabRemarks",
      width: 600,
    },
    {
      key: "EditAction",
      name: "Action",
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
      containerId: "toast-container-over-header",
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

  useEffect(() => {
    axios
      .get(`${urllink}Masters/Get_All_Master_data?Type=SubMainDepartment`)
      .then((response) => {
        const data = response.data;
        console.log(data);
        setDepartmentRole(data);
      })
      .catch((error) => {
        console.error("Error fetching SubDepartment data:", error);
      });
  }, [urllink]);

  const handleSearchChange = (event, type) => {
    const value = event.target.value;
    if (type === "name") {
      setSearchQuery(value);
    }
  };

  useEffect(() => {
    // console.log(ageData)
    if (Array.isArray(LabRemarksdata)) {
      const lowerCaseNameQuery = searchQuery.toLowerCase();
      const filteredData = LabRemarksdata.filter((row) => {
        const lowerCasePatientName = row?.Department
          ? row.Department.toLowerCase()
          : "";
        return lowerCasePatientName.includes(lowerCaseNameQuery);
      });
      // console.log(filteredData)
      setFilteredRows(filteredData);
    } else {
      // Handle the case where ageData is not an array
      setFilteredRows([]);
    }
  }, [searchQuery, LabRemarksdata]);

  return (
    <div className="appointment">
      {/* <div className="ShiftClosing_Container"> */}
      <h2 style={{ textAlign: "center" }}>LabRemarks Master</h2>
      <br />
      {/* <div style={{ width: "100%", display: "grid", placeItems: "center" }}> */}
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="LabRemarkID">
            LabRemark ID <span>:</span>
          </label>
          <input
            type="text"
            id="LabRemarkID"
            name="LabRemarkID"
            value={LabRemarkID}
            disabled
            onChange={(e) => setLabRemarkID(e.target.value)}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="Department">
            Department <span>:</span>
          </label>
          <select
            id="Department"
            name="Department"
            value={selecteddepartment}
            onChange={(e) => setselecteddepartment(e.target.value)}
          >
            <option value="">Select</option>
            {Array.isArray(departmentrole) &&
              departmentrole.map((department) => (
                <option
                  key={department.SubDepartment_Code}
                  value={department.SubDepartment_Code}
                >
                  {department.SubDepartment_Name}
                </option>
              ))}
          </select>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="LabRemarks">
            LabRemarks <span>:</span>
          </label>
          <input
            type="text"
            id="LabRemarks"
            name="LabRemarks"
            value={LabRemarks}
            onChange={(e) => setLabRemarks(e.target.value)}
            placeholder="Enter LabRemarks"
            autoComplete="off"
          />
        </div>

        <button className="RegisterForm_1_btns" onClick={handleSubmit}>
          {isEditMode ? "Update" : <AddIcon />}
        </button>
      </div>
      {/* </div> */}
      <br />
      <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
        <div className="con_1 ">
          <div className="inp_1">
            <label htmlFor="Department">
              Filter Remarks By Department <span>:</span>
            </label>
            <select
              id="Department"
              name="Department"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e, "name")}
            >
              <option value="">Select</option>
              {Array.isArray(departmentrole) &&
                departmentrole.map((department) => (
                  <option
                    key={department.SubDepartment_Code}
                    value={department.SubDepartment_Code}
                  >
                    {department.SubDepartment_Name}
                  </option>
                ))}
            </select>
          </div>
        </div>
      </div>
      <div className="Main_container_app">
        <ReactGrid columns={unitcolumns} RowData={filteredRows} />
      </div>
      <ToastContainer />
    </div>
    // </div>
  );
}

export default LabRemarksMaster;
