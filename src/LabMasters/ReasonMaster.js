import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

function ReasonMaster() {
  const [Reason, setReason] = useState("");
  const [ReasonID, setReasonID] = useState("");
  const [Reasondata, setReasondata] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const handleSubmit = async () => {
    const datatosend = {
      Reason: Reason,
      ReasonID: ReasonID,
      Type : "ReasonMaster",
      createdby : userRecord?.username,
    };

    if (!Reason.trim() || !ReasonID.trim()) {
      userwarn("Both Reason and Id are required.");
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
      if(isEditMode){
        successMsg("Successfully Updated");
      }
      else{
        successMsg("Successfully Inserted");
      }
      fetchReasonID();
      fetchReasondata();
      setReason("");
      setIsEditMode(false)
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle error scenarios
    }
  };

  const handleEdit = (params) => {
    
    setReasonID(params?.Reason_Id);
    setReason(params?.Reason);
    setIsEditMode(true)
  };


  const fetchReasondata = useCallback(() => {
    axios
      .get(`${urllink}Masters/Get_All_Master_data?Type=ReasonMaster`)
      .then((response) => {
        console.log(response);
        const data = response.data.map((row, index) => ({
          id: index + 1,
          ...row,
        }));
        setReasondata(data);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
      });
  }, [urllink]); // No dependencies here to ensure it's only created once

  const fetchReasonID = useCallback(() => {
    axios
      .get(`${urllink}Masters/Get_All_Other_Masters_PrimaryCodes?Type=ReasonMaster`)
      .then((response) => {
        const data = response.data;
        setReasonID(data.Reason_Id);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
      });
  }, [urllink]); // No dependencies here to ensure it's only created once

  useEffect(() => {
    fetchReasonID();
    fetchReasondata();
  }, [fetchReasonID, fetchReasondata]);

  const unitcolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
    },
    // {
    //   key: "Reason_Id",
    //   name: "Remark ID",
    // },
    {
      key: "Reason",
      name: "Reason",
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
        <h2 style={{ textAlign: "center" }}>Reason Master</h2>
        <div style={{ width: "100%", display: "grid", placeItems: "center" }}>
          <div className="con_1 ">
            <div className="inp_1">
              <label htmlFor="ReasonID">
                Reason ID <span>:</span>
              </label>
              <input
                type="text"
                id="ReasonID"
                name="ReasonID"
                value={ReasonID}
                disabled
                onChange={(e) => setReasonID(e.target.value)}
              />
            </div>
            <div className="inp_1">
              <label htmlFor="Reason">
                Reason <span>:</span>
              </label>
              <input
                type="text"
                id="Reason"
                name="Reason"
                value={Reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter Reason"
                autoComplete="off"
              />
            </div>

            <button className="RegisterForm_1_btns" onClick={handleSubmit}>
              {isEditMode ? "Update" : <AddIcon />}
            </button>
          </div>
        </div>

        <div className="Main_container_app">
          <ReactGrid columns={unitcolumns} RowData={Reasondata} />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}

export default ReasonMaster;
