import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import { ToastContainer, toast } from "react-toastify";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";

function AntibioticMaster() {
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const [antibioticData, setAntibioticData] = useState([]);
  const [antibioticGroupCode, setAntibioticGroupCode] = useState("");
  const [antibioticDes, setAntibioticDes] = useState("");
  const [antibioticCode, setAntibioticCode] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const [SelectedFile, setSelectedFile] = useState(null);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredRows, setFilteredRows] = useState([]);

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

  const handleFileChange = (event) => {
    setSelectedFile(null);
    const { name } = event.target;
    setSelectedFile(event.target.files[0]);
    console.log("Service file selected:", event.target.files[0]);
    // Additional handling based on the name attribute
    if (name === "Documents") {
      // Handle Insurance file
      console.log("Insurance file selected:", event.target.files[0]);
    }
  };

  const handleSubmitAntibiotic = async () => {
    if (
      !antibioticGroupCode.trim() ||
      !antibioticCode.trim() ||
      !antibioticDes.trim()
    ) {
      userwarn(
        " AntibioticGroupCode,AntibioticCode and AntibioticDes are required."
      );
      return; // Exit the function early if validation fails
    }
    const anti_biotic_id = "";
    const Type = "AntibioticMaster";
    const createdby = userRecord?.username;
    try {
      const response = await axios.post(
        `${urllink}Masters/Insert_All_Other_Masters`,
        {
          antibioticGroupCode,
          antibioticCode,
          antibioticDes,
          anti_biotic_id,
          Type,
          createdby,
        }
      );

      console.log(response.data);
      if (response.data.success){
        successMsg(response.data.message);
      } else{
        userwarn(response.data.message);
      }
      fetchAntibioticcodeData();
      // setAntibioticGroupCode('');
      // setAntibioticCode('');
      setAntibioticDes("");
      fetchAntibioticData();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const fetchAntibioticData = useCallback(() => {
    axios
      .get(`${urllink}Masters/Get_All_Master_data?Type=AntibioticMaster`)
      .then((response) => {
        const data = response.data;
        console.log("data", data);
        setAntibioticData(data);
      })
      .catch((error) => {
        console.error("Error fetching antibioticgroup data:", error);
        setAntibioticData([]); // Reset data in case of an error
      });
  }, [urllink]);

  const fetchAntibioticcodeData = useCallback(() => {
    axios
      .get(
        `${urllink}Masters/Get_All_Other_Masters_PrimaryCodes?Type=AntibioticMaster`
      )
      .then((response) => {
        const data = response.data;
        console.log("data", data);
        setAntibioticGroupCode(data.data.anti_biotic_group_code);
        setAntibioticCode(data.data.anti_biotic_code);
      })
      .catch((error) => {
        console.error("Error fetching antibioticgroup data:", error);
        setAntibioticData([]); // Reset data in case of an error
      });
  }, [urllink]);

  const handleEdit = (row) => {
    console.log(row);
    setAntibioticGroupCode(row.anti_biotic_group_code);
    setAntibioticCode(row.anti_biotic_code);
    setAntibioticDes(row.anti_biotic);
    setIsEditMode(true);
    setSelectedMethodId(row.anti_biotic_id);
  };

  const handleUpdateMethod = async () => {
    try {
      const response = await axios.post(
        `${urllink}Masters/Insert_All_Other_Masters`,
        {
          anti_biotic_id: selectedMethodId,
          antibioticGroupCode: antibioticGroupCode,
          antibioticCode: antibioticCode,
          antibioticDes: antibioticDes,
          createdby: userRecord?.username,
          Type: "AntibioticMaster",
        }
      );

      console.log(response.data);
      if (response.data.success){
        successMsg(response.data.message);
      } else{
        userwarn(response.data.message);
      }
      fetchAntibioticcodeData();
      // setAntibioticGroupCode('');
      // setAntibioticCode('');
      setAntibioticDes("");
      setAntibioticDes("");
      setIsEditMode(false);
      setSelectedMethodId(null);
      fetchAntibioticData();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const handleCsvupload = (type) => {
    console.log(SelectedFile);
    const formData = new FormData();
    formData.append("file", SelectedFile);
    formData.append("Type", "AntibioticMaster_CSV");
    formData.append("created_by", userRecord?.username);
    if (SelectedFile) {
      if (type === "Documents") {
        axios
          .post(`${urllink}Masters/All_CSV_Files_Upload`, formData, {
            headers: { "Content-Type": "multipart/form-data" },
          })
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

  useEffect(() => {
    fetchAntibioticData();
    fetchAntibioticcodeData();
  }, [fetchAntibioticData, fetchAntibioticcodeData]);

  const anticolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
    },
    {
      key: "anti_biotic",
      name: "Antibiotic",
      width: 400,
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

  const handleSearchChange = (event, type) => {
    const value = event.target.value;
    if (type === "name") {
      setSearchQuery(value);
    }
  };

  useEffect(() => {
    // console.log(ageData)
    if (Array.isArray(antibioticData)) {
      const lowerCaseNameQuery = searchQuery.toLowerCase();
      const filteredData = antibioticData.filter((row) => {
        const lowerCasePatientName = row?.anti_biotic
          ? row.anti_biotic.toLowerCase()
          : "";
        return lowerCasePatientName.includes(lowerCaseNameQuery);
      });
      // console.log(filteredData)
      setFilteredRows(filteredData);
    } else {
      // Handle the case where ageData is not an array
      setFilteredRows([]);
    }
  }, [searchQuery, antibioticData]);

  return (
    <>
      <div className="appointment">
        <h2 style={{ textAlign: "center" }}>Antibiotic Master</h2>
        <br />
        <div className="RegisFormcon">
          <div className="RegisForm_1">
            <label htmlFor="input">
              Antibiotic Group Code<span>:</span>
            </label>
            <input
              type="text"
              id="antibioticGroupCode"
              name="antibioticGroupCode"
              value={antibioticGroupCode}
              disabled
              onChange={(e) => setAntibioticGroupCode(e.target.value)}
              // placeholder="Enter Antibiotic Group Code"
              // style={{ width: "150px" }}
            />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="input">
              Antibiotic Code<span>:</span>
            </label>
            <input
              type="text"
              id="antibioticCode"
              name="antibioticCode"
              value={antibioticCode}
              disabled
              onChange={(e) => setAntibioticCode(e.target.value)}
              // placeholder="Enter Antibiotic Code"
              // style={{ width: "150px" }}
            />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="input">
              Antibiotic Description<span>:</span>
            </label>
            <input
              type="text"
              id="antibioticDes"
              name="antibioticDes"
              value={antibioticDes}
              onChange={(e) => setAntibioticDes(e.target.value)}
              // placeholder="Enter Antibiotic Description"
              // style={{ width: "150px" }}
            />
          </div>
          <div
            style={{
              display: "flex",
              padding: "10px",
              color: "black",
              fontFamily: "Nunito, system-ui, sans-serif",
              fontWeight: "bold",
            }}
          >
            or
          </div>
          <div className="RegisForm_1">
            <label>
              {" "}
              Antibiotic Excel/CSV File <span>:</span>{" "}
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
          </div>
        </div>
        <div className="Register_btn_con">
          <button
            className="RegisterForm_1_btns"
            onClick={isEditMode ? handleUpdateMethod : handleSubmitAntibiotic}
          >
            {isEditMode ? "Update" : <AddIcon />}
          </button>
        </div>
        <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
          <div className="con_1 ">
            <div className="inp_1">
              <label htmlFor="input">
                Antibiotic Name <span>:</span>
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e, "name")}
                placeholder="Search Antibiotic"
              />
            </div>
          </div>
        </div>

        <div className="Main_container_app">
          <ReactGrid columns={anticolumns} RowData={filteredRows} />
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default AntibioticMaster;
