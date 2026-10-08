import React, { useEffect, useCallback, useState } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";

function Specimen() {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);

  const [specimenData, setSpecimenData] = useState([]);
  const [specimen, setSpecimen] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [specimenCode, setSpecimenCode] = useState("");
  const [selectedid, setSelectedid] = useState(null);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);

  const successMsg = (message) => {
    toast.success(`${message}`, {
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

  const handleSubmitSpecimen = async () => {
    const Type = "SpecimenMaster";
    const createdby = userRecord?.username;
    if (!specimen.trim() || !specimenCode.trim()) {
      userwarn("Both specimen Code Name and specimen are required.");
      return; // Exit the function early if validation fails
    }
    try {
      // Make a POST request to your Django backend endpoint
      const response = await axios.post(
        `${urllink}Masters/Insert_All_Other_Masters`,
        {
          specimen,
          specimenCode,
          Type,
          createdby,
        }
      );

      // Handle the response as needed
      console.log("kkkk",response.data.success);
      if(response.data.success){
        successMsg(response.data.message);
      }
      else{
        userwarn(response.data.message)
      }
      
      
      fetchSpecimenCodeData();
      setSpecimen("");
      // setSpecimenCode('')
      // Optionally, you can reset the state after a successful submission

      fetchSpecimenData();
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle error scenarios
    }
  };

  const fetchSpecimenData = useCallback(() => {
    axios
      .get(`${urllink}Masters/Get_All_Master_data?Type=SpecimenMaster`)
      .then((response) => {
        const data = response.data;
        console.log("data", data);

        setSpecimenData(data);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
      });
  }, [urllink]);

  const fetchSpecimenCodeData = useCallback(() => {
    axios
      .get(
        `${urllink}Masters/Get_All_Other_Masters_PrimaryCodes?Type=SpecimenMaster`
      )
      .then((response) => {
        const data = response.data;
        console.log("data", data);

        setSpecimenCode(data.specimen_code);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
      });
  }, [urllink]);

  React.useEffect(() => {
    fetchSpecimenData();
    fetchSpecimenCodeData();
  }, [fetchSpecimenData, fetchSpecimenCodeData]);

  const handleEdit = (row) => {
    setSpecimen(row.Specimen_Name);
    setSpecimenCode(row.Specimen_Code);
    setIsEditMode(true);
    setSelectedid(row.specimen_id); // Assuming `method_id` is the identifier
  };

  const handleUpdateMethod = async () => {
    try {
      const response = await axios.post(
        `${urllink}Masters/Insert_All_Other_Masters`,
        {
          specimen: specimen,
          specimenCode: specimenCode,
          Type: "SpecimenMaster",
          createdby: userRecord?.username,
        }
      );
      console.log(response.data);
      if (response.data.success){
        successMsg(response.data.message);
      } else{
        userwarn(response.data.message);
      }
      fetchSpecimenCodeData();
      setSpecimen("");
      // setSpecimenCode('')
      setIsEditMode(false);
      setSelectedid("");
      fetchSpecimenData();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const specimencolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
    },
    // {
    //   key: "Specimen_Code",
    //   name: "Specimen Code",
    // },
    {
      key: "Specimen_Name",
      name: "Specimen Name",
    },
    {
      key: "EditAction",
      name: "Action",
      width: 280,
      renderCell: (params) => (
        <p
          style={{ width: "130px", textAlign: "center", cursor: "pointer" }}
          onClick={() => handleEdit(params.row)}
        >
          <EditIcon />
        </p>
      ),
    },
  ];

  

  const handleSearchChange = (event, type) => {
    const value = event.target.value;
    if (type === "name") {
      setSearchQuery(value);
    }
  };

  useEffect(() => {
    // console.log(ageData)
    if (Array.isArray(specimenData)) {
      const lowerCaseNameQuery = searchQuery.toLowerCase();
      const filteredData = specimenData.filter((row) => {
        const lowerCasePatientName = row?.Specimen_Name
          ? row.Specimen_Name.toLowerCase()
          : "";
        return lowerCasePatientName.includes(lowerCaseNameQuery);
      });
      // console.log(filteredData)
      setFilteredRows(filteredData);
    } else {
      // Handle the case where ageData is not an array
      setFilteredRows([]);
    }
  }, [searchQuery, specimenData]);

  return (
    <>
      <div className="appointment">
        {/* <div className="ShiftClosing_Container"> */}
        <h2 style={{ textAlign: "center" }}>Specimen Master</h2>
        <br />
        <div className="RegisFormcon ">
          <div className="RegisForm_1">
            <label htmlFor="input">
              Specimen Code <span>:</span>
            </label>
            <input
              type="text"
              id="FirstName"
              name="roleName"
              value={specimenCode}
              disabled
              onChange={(e) => setSpecimenCode(e.target.value)}
              placeholder="Enter Specimen Code"
            />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="input">
              Specimen Name <span>:</span>
            </label>
            <input
              type="text"
              id="FirstName"
              name="roleName"
              value={specimen}
              onChange={(e) => setSpecimen(e.target.value)}
              placeholder="Enter Specimen Name"
            />
          </div>

          <button
            className="RegisterForm_1_btns"
            onClick={isEditMode ? handleUpdateMethod : handleSubmitSpecimen}
          >
            {isEditMode ? "Update" : <AddIcon />}
          </button>
        </div>
        <br />
        <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
          <div className="con_1 ">
            <div className="inp_1">
              <label htmlFor="input">
                Specimen Name <span>:</span>
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e, "name")}
                placeholder="Search Specimen"
              />
            </div>
          </div>
        </div>
        <div className="Main_container_app">
          <ReactGrid columns={specimencolumns} RowData={filteredRows} />
        </div>
        {/* </div> */}
        <ToastContainer />
      </div>
    </>
  );
}

export default Specimen;
