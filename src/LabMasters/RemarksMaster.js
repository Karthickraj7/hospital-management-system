import React, { useCallback, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import EditIcon from "@mui/icons-material/Edit";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import { ToastContainer, toast } from "react-toastify";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";

function RemarksMaster() {
  const [Remarks, setRemarks] = useState("");
  const [RemarkID, setRemarkID] = useState("");
  const [Remarksdata, setRemarksdata] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const handleSubmit = async () => {
    const datatosend = {
      Remarks: Remarks,
      RemarkID: RemarkID,
      Type : "RemarksMaster",
      createdby : userRecord?.username,
    };

    if (!Remarks.trim() || !RemarkID.trim()) {
      userwarn("Both Remarks  and Id are required.");
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
      
      fetchRemarkID();
      fetchRemarkdata();
      setRemarks("");
      setIsEditMode(false);
    } catch (error) {
      console.error("An error occurred:", error);
      // Handle error scenarios
    }
  };

  const handleEdit = (params) => {
    
    setRemarkID(params?.Remark_Id);
    setRemarks(params?.Remarks);
    setIsEditMode(true);
  };

  const fetchRemarkdata = useCallback(() => {
    axios
      .get(`${urllink}Masters/Get_All_Master_data?Type=RemarksMaster`)
      .then((response) => {
        console.log(response);
        const data = response.data.map((row, index) => ({
          id: index + 1,
          ...row,
        }));
        setRemarksdata(data);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
      });
  }, [urllink]); // No dependencies here to ensure it's only created once

  const fetchRemarkID = useCallback(() => {
    axios
      .get(`${urllink}Masters/Get_All_Other_Masters_PrimaryCodes?Type=RemarksMaster`)
      .then((response) => {
        const data = response.data;
        setRemarkID(data.Remark_Id);
      })
      .catch((error) => {
        console.error("Error fetching unit data:", error);
      });
  }, [urllink]); // No dependencies here to ensure it's only created once

  useEffect(() => {
    fetchRemarkID();
    fetchRemarkdata();
  }, [fetchRemarkID, fetchRemarkdata]);

  const unitcolumns = [
    {
      key: "id",
      name: "S.No",
      width: 70,
    },
    // {
    //   key: "Remark_Id",
    //   name: "Remark ID",
    // },
    {
      key: "Remarks",
      name: "Remarks",
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
      {/* <div className="ShiftClosing_Container"> */}
        <h2 style={{ textAlign: "center" }}>Remarks Master</h2>
        <br/>
        {/* <div style={{ width: "100%", display: "grid", placeItems: "center" }}> */}
          <div className="RegisFormcon ">
            <div className="RegisForm_1">
              <label htmlFor="RemarkID">
                Remark ID <span>:</span>
              </label>
              <input
                type="text"
                id="RemarkID"
                name="RemarkID"
                value={RemarkID}
                disabled
                onChange={(e) => setRemarkID(e.target.value)}
              />
            </div>
            <div className="RegisForm_1">
              <label htmlFor="Remarks">
                Remarks <span>:</span>
              </label>
              <input
                type="text"
                id="Remarks"
                name="Remarks"
                value={Remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter Remarks"
                autoComplete="off"
              />
            </div>

            <button className="RegisterForm_1_btns" onClick={handleSubmit}>
              {isEditMode ? "Update" : <AddIcon />}
            </button>
          </div>
        {/* </div> */}
        <br/>
        <div className="Main_container_app">
          <ReactGrid columns={unitcolumns} RowData={Remarksdata} />
        </div>
      {/* </div> */}
      <ToastContainer />
    </div>
  );
}

export default RemarksMaster;
