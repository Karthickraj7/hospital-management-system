import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

function QualificationMaster() {
  const [Qualification, setQualification] = useState("");
  const [QualificationID, setQualificationID] = useState("");
  const [QualificationData, setQualificationData] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const handleSubmit = async () => {
    const datatosend = {
      Qualification: Qualification,
      QualificationID: QualificationID,
      Type : "QualificationMaster",
      createdby : userRecord?.username,
    };

    if (!Qualification.trim() || !QualificationID.trim()) {
      userwarn("Both Qualification and Id are required.");
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
      if (response.data.success){
        successMsg(response.data.message);
      } else{
        userwarn(response.data.message);
      }
      fetchQualificationID();
      fetchQualificationdata();
      setQualification("");
      setIsEditMode(false);
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle error scenarios
    }
  };

  const handleEdit = (params) => {
    console.log(params);
    setQualificationID(params?.Qualification_Id);
    setQualification(params?.Qualification);
    setIsEditMode(true);
  };

  const fetchQualificationdata = useCallback(() => {
    axios
      .get(`${urllink}Masters/Get_All_Master_data?Type=QualificationMaster`)
      .then((response) => {
        console.log(response);
        const data = response.data.map((row, index) => ({
          id: index + 1,
          ...row,
        }));
        setQualificationData(data);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
      });
  }, [urllink]); // No dependencies here to ensure it's only created once

  const fetchQualificationID = useCallback(() => {
    axios
      .get(`${urllink}Masters/Get_All_Other_Masters_PrimaryCodes?Type=QualificationMaster`)
      .then((response) => {
        const data = response.data;
        setQualificationID(data.Qualification_Id);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
      });
  }, [urllink]); // No dependencies here to ensure it's only created once

  useEffect(() => {
    fetchQualificationID();
    fetchQualificationdata();
  }, [fetchQualificationID, fetchQualificationdata]);

  const unitcolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
    },
    // {
    //   key: "Qualification_Id",
    //   name: "Qualification ID",
    // },
    {
      key: "Qualification",
      name: "Qualification",
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

  return (
    <div className="appointment">
      <div className="ShiftClosing_Container">
        <h2 style={{ textAlign: "center" }}>Qualification Master</h2>
        <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
          <div className="con_1 ">
            <div className="inp_1">
              <label htmlFor="QualificationID">
                Qualification ID <span>:</span>
              </label>
              <input
                type="text"
                id="QualificationID"
                name="QualificationID"
                value={QualificationID}
                disabled
                onChange={(e) => setQualificationID(e.target.value)}
              />
            </div>
            <div className="inp_1">
              <label htmlFor="Qualification">
                Qualification <span>:</span>
              </label>
              <input
                type="text"
                id="Qualification"
                name="Qualification"
                value={Qualification}
                onChange={(e) => setQualification(e.target.value)}
                placeholder="Enter Qualification"
                autoComplete="off"
              />
            </div>

            <button className="RegisterForm_1_btns" onClick={handleSubmit}>
              {isEditMode ? "Update" : <AddIcon />}
            </button>
          </div>
        </div>

        <div className="Main_container_app">
          <ReactGrid columns={unitcolumns} RowData={QualificationData} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default QualificationMaster;
