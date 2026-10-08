import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";

function OrganismMaster() {
  const [organismData, setOrganismData] = useState([]);
  const [organismCode, setOrganismCode] = useState("");
  // console.log(organismCode);
  const [organismName, setOrganismName] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedMethodId, setSelectedMethodId] = useState(null);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

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

  const handleSubmitOrganismMaster = async () => {
    const Type = "OrganismMaster";
    const createdby = userRecord?.username;
    if (!organismCode.trim() || !organismName.trim()) {
      userwarn(" Both OrganismCode And  OrganismName  are required.");
      return; // Exit the function early if validation fails
    }
    try {
      const response = await axios.post(
        `${urllink}Masters/Insert_All_Other_Masters`,
        {
          organismCode,
          organismName,
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
      fetchOrganismMastercodeData();
      // setOrganismCode('');
      setOrganismName("");
      fetchOrganismMasterData();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  const fetchOrganismMasterData = useCallback(() => {
    axios
      .get(`${urllink}Masters/Get_All_Master_data?Type=OrganismMaster`)
      .then((response) => {
        const data = response.data;
        
        setOrganismData(data);
        
      })
      .catch((error) => {
        console.error("Error fetching organismmaster data:", error);
        setOrganismData([]); // Reset data in case of an error
      });
  }, [urllink]);

  const fetchOrganismMastercodeData = useCallback(() => {
    axios
      .get(`${urllink}Masters/Get_All_Other_Masters_PrimaryCodes?Type=OrganismMaster`)
      .then((response) => {
        const data = response.data;
        console.log("data", data);
        setOrganismCode(data.Organism_Code);
      })
      .catch((error) => {
        console.error("Error fetching organismmaster data:", error);
        setOrganismData([]); // Reset data in case of an error
      });
  }, [urllink]);

  const handleEdit = (row) => {
    setOrganismCode(row.Organism_Code);
    setOrganismName(row.Organism_Name);
    setIsEditMode(true);
    setSelectedMethodId(row.organism_id);
  };

  const handleUpdateMethod = async () => {
    const Type = "OrganismMaster";
    const createdby = userRecord?.username;
    try {
      const response = await axios.post(
        `${urllink}Masters/Insert_All_Other_Masters`,
        {
          organismCode,
          organismName,
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
      fetchOrganismMastercodeData();
      // setOrganismCode('');
      setOrganismName("");
      setIsEditMode(false);
      setSelectedMethodId(null);
      fetchOrganismMasterData();
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  useEffect(() => {
    fetchOrganismMasterData();
    fetchOrganismMastercodeData();
  }, [fetchOrganismMasterData, fetchOrganismMastercodeData]);

  const organismcolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
    },
    // {
    //   key: "Organism_Code",
    //   name: "Organism Code",
    // },
    {
      key: "Organism_Name",
      name: "Organism Name",
      width: 280,
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

  return (
    <>
      <div className="appointment">
      <h2 style={{ textAlign: "center" }}>Organism Master</h2>
        <br />

        <div className="ShiftClosing_Container">
          <div className="con_1">
            <div className="inp_1">
              <label htmlFor="input">
                Organism Code <span>:</span>
              </label>
              <input
                type="text"
                id="organismCode"
                name="organismCode"
                value={organismCode}
                disabled
                onChange={(e) => setOrganismCode(e.target.value)}
                placeholder="Enter Organism Code"
              />
            </div>
            <div className="inp_1">
              <label htmlFor="input">
                Organism Name <span>:</span>
              </label>
              <input
                type="text"
                id="organismName"
                name="organismName"
                value={organismName}
                onChange={(e) => setOrganismName(e.target.value)}
                placeholder="Enter Organism Name"
              />
            </div>
            <button
              className="RegisterForm_1_btns"
              onClick={
                isEditMode ? handleUpdateMethod : handleSubmitOrganismMaster
              }
            >
              {isEditMode ? "Update" : <AddIcon />}
            </button>
          </div>

          <div className="Main_container_app">
            <ReactGrid columns={organismcolumns} RowData={organismData} />
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
}

export default OrganismMaster;
