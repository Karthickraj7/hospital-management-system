import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete"; // Added Delete Icon
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";

const Linen_Laundry = () => {

  const UrlLink = useSelector(state => state.userRecord?.UrlLink);
  const userRecord = useSelector(state => state.userRecord?.UserData);
  const toast = useSelector(state => state.userRecord?.toast);
  const dispatchvalue = useDispatch();

  /* -------------------- STATE -------------------- */
  const [Laundry, setLaundry] = useState({
    LaundryId: '',
    BatchNo: '',
    WashType: '',
    StartTime: '',
    EndTime: '',
    VendorType: '',
    VendorName: '',
    VendorLocation: ''
  });

  const [LaundryData, setLaundryData] = useState([]);
  const [IsLaundryGet, setIsLaundryGet] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  /* -------------------- GRID -------------------- */
  const LaundryColumns = [
    { key: "BatchNo", name: "Batch No", frozen: true },
    { key: "WashType", name: "Wash Type" },
    { key: "StartTime", name: "Start Time" },
    { key: "EndTime", name: "End Time" },
    { key: "VendorType", name: "Vendor Type" },
    { key: "VendorName", name: "Vendor Name" },
    { key: "VendorLocation", name: "Vendor Location" },
    { key: "created_by", name: "Created By" },

    {
      key: "Action",
      name: "Action",
      renderCell: (params) => (
        <>
          <Button
            className="cell_btn"
            onClick={() => handleEditLaundry(params.row)}
          >
            <EditIcon />
          </Button>
          {/* FIXED DELETE BUTTON */}
          <Button
            className="cell_btn"
            onClick={() => handleDeleteLaundry(params.row)}
            style={{ color: 'red' }}
          >
            <DeleteIcon />
          </Button>
        </>
      )
    }
  ];

  /* -------------------- FETCH DATA -------------------- */
  useEffect(() => {
    axios.get(`${UrlLink}LeninManagement/Laundry_Details_Link`)
      .then(res => setLaundryData(res.data))
      .catch(err => console.error(err));
  }, [IsLaundryGet, UrlLink]);

  /* -------------------- HANDLERS -------------------- */
  const handleLaundryChange = (e) => {
    const { name, value } = e.target;

    setLaundry(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditLaundry = (row) => {
    setLaundry({
      LaundryId: row.LaundryId,
      BatchNo: row.BatchNo,
      WashType: row.WashType,
      StartTime: row.StartTime,
      EndTime: row.EndTime,
      VendorType: row.VendorType,
      VendorName: row.VendorName,
      VendorLocation: row.VendorLocation
    });
  };

  /* -------------------- DELETE HANDLER (FIXED) -------------------- */
  const handleDeleteLaundry = (row) => {
    if (window.confirm("Are you sure you want to delete this laundry record?")) {
      axios.post(`${UrlLink}LeninManagement/Laundry_Details_Link`, {
        LaundryId: row.LaundryId,
        isDelete: true // Sending delete flag to backend
      })
        .then(res => {
          const key = Object.keys(res.data)[0];
          const msg = Object.values(res.data)[0];

          dispatchvalue({
            type: 'toast',
            value: { message: msg, type: key }
          });

          setIsLaundryGet(prev => !prev);
        })
        .catch(err => console.error(err));
    }
  };

  const handleLaundrySubmit = () => {

    if (!Laundry.BatchNo || !Laundry.WashType || !Laundry.StartTime) {
      dispatchvalue({
        type: 'toast',
        value: { message: "Please fill required fields", type: "warn" }
      });
      return;
    }

    if (
      Laundry.VendorType === "OUTSOURCE" &&
      (!Laundry.VendorName || !Laundry.VendorLocation)
    ) {
      dispatchvalue({
        type: 'toast',
        value: { message: "Vendor details required for outsource", type: "warn" }
      });
      return;
    }

    axios.post(`${UrlLink}LeninManagement/Laundry_Details_Link`, {
      ...Laundry,
      created_by: userRecord?.username || ''
    })
      .then(res => {
        const key = Object.keys(res.data)[0];
        const msg = Object.values(res.data)[0];

        dispatchvalue({
          type: 'toast',
          value: { message: msg, type: key }
        });

        setIsLaundryGet(prev => !prev);
        setLaundry({
          LaundryId: '',
          BatchNo: '',
          WashType: '',
          StartTime: '',
          EndTime: '',
          VendorType: '',
          VendorName: '',
          VendorLocation: ''
        });
      })
      .catch(err => console.error(err));
  };

  // --- FILTER LOGIC ---
  const filteredLaundryData = LaundryData.filter((row) => {
    return Object.values(row).some((val) =>
      String(val).toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  /* -------------------- UI -------------------- */
  return (
    <>
      <div className="Main_container_app">
        <h3>Linen Laundry Management</h3>

        <div className="RegisFormcon_1">

          <div className="RegisForm_1">
            <label>Batch No :</label>
            <input
              type="text"
              name="BatchNo"
              value={Laundry.BatchNo}
              onChange={handleLaundryChange}
            />
          </div>

          <div className="RegisForm_1">
            <label>Wash Type :</label>
            <select
              name="WashType"
              value={Laundry.WashType}
              onChange={handleLaundryChange}
            >
              <option value="">Select</option>
              <option value="NORMAL">Normal</option>
              <option value="HEAVY">Heavy</option>
              <option value="CHEMICAL">Chemical</option>
              <option value="STEAM">Steam</option>
            </select>
          </div>

          <div className="RegisForm_1">
            <label>Start Time :</label>
            <input
              type="datetime-local"
              name="StartTime"
              value={Laundry.StartTime}
              onChange={handleLaundryChange}
            />
          </div>

          <div className="RegisForm_1">
            <label>End Time :</label>
            <input
              type="datetime-local"
              name="EndTime"
              value={Laundry.EndTime}
              onChange={handleLaundryChange}
            />
          </div>
            
          <div className="RegisForm_1">
            <label>Vendor Type :</label>
            <select
              name="VendorType"
              value={Laundry.VendorType}
              onChange={handleLaundryChange}
            >
              <option value="">Select</option>
              <option value="INHOUSE">In-House</option>
              <option value="OUTSOURCE">Out-Source</option>
            </select>
          </div>

          {Laundry.VendorType === "OUTSOURCE" && (
            <>
             <div className="RegisForm_1">
                <label>Vendor Name :</label>
                <input
                  type="text"
                  name="VendorName"
                  value={Laundry.VendorName}
                  onChange={handleLaundryChange}
                />
              </div>
            
              <div className="RegisForm_1">
                <label>Vendor Location :</label>
                <input
                  type="text"
                  name="VendorLocation"
                  value={Laundry.VendorLocation}
                  onChange={handleLaundryChange}
                />
              </div>
            </>
          )}
        </div>

        <div className="Main_container_Btn">
          <button onClick={handleLaundrySubmit}>
            {Laundry.LaundryId ? "Update" : "Add"}
          </button>
        </div>

        {/* --- SEARCH FILTER UI --- */}
        <div className="RegisFormcon_1" style={{ justifyContent: 'flex-end', marginTop: '20px' }}>
          <div className="RegisForm_1">
            <label>Search Laundry:</label>
            <input
              type="text"
              name="SearchQuery"
              placeholder="Search all fields..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <ReactGrid columns={LaundryColumns} RowData={filteredLaundryData} />
      </div>

      <ToastAlert Message={toast.message} Type={toast.type} />
    </>
  );
};

export default Linen_Laundry;