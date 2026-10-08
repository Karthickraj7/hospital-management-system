import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { IconButton } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";

const IP_VentilatorSettings = () => {
  const dispatch = useDispatch();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const [ventilatorSettings, setVentilatorSettings] = useState({
    Mode: "",
    BreathsPerMin: "",
    PressSupport: "",
    PeakPress: "",
    Peep: "",
    MeanPress: "",
    MV: "",
    ITV: "",
    ETV: "",
    FIO2: "",
  });

  // State to toggle visibility of input fields
  const [showSettings, setShowSettings] = useState(false);

  // State for grid data (if needed)
  const [gridData, setGridData] = useState([]);

  // Fetch ventilator data on component load or when needed
  const fetchVentilatorSettings = async () => {
    try {
      const response = await axios.get(
        `${UrlLink}/get-ventilator-settings?PatientId=${IP_DoctorWorkbenchNavigation?.PatientId}`
      );
      if (response.status === 200) {
        setVentilatorSettings(response.data); // Assuming the API sends the ventilator settings data
        ToastAlert("Settings fetched successfully", "success");
      } else {
        ToastAlert("Error fetching settings", "error");
      }
    } catch (error) {
      ToastAlert("Error fetching settings", "error");
    }
  };

  // Handle view click to show fields with data
  const handleViewClick = () => {
    setShowSettings(true); // Show the input fields
    fetchVentilatorSettings(); // Fetch data from API and populate the form
  };

  return (
    <div>
      {/* Grid or data table to show records */}
      <ReactGrid
        data={gridData} // Assuming gridData is populated elsewhere
        columns={[
          { headerName: "Patient Name", field: "PatientName" },
          { headerName: "Mode", field: "Mode" },
          { headerName: "Breaths Per Minute", field: "BreathsPerMin" },
          // Other columns based on the data structure
        ]}
      />

      {/* View button to toggle form display */}
      <IconButton onClick={handleViewClick}>
        <VisibilityIcon />
      </IconButton>

      {/* Ventilator settings form, initially hidden */}
      {showSettings && (
        <form>
          <div>
            <label>Mode:</label>
            <input
              type="text"
              name="Mode"
              value={ventilatorSettings.Mode}
              readOnly
            />
          </div>
          <div>
            <label>Breaths Per Minute:</label>
            <input
              type="text"
              name="BreathsPerMin"
              value={ventilatorSettings.BreathsPerMin}
              readOnly
            />
          </div>
          <div>
            <label>Press Support:</label>
            <input
              type="text"
              name="PressSupport"
              value={ventilatorSettings.PressSupport}
              readOnly
            />
          </div>
          <div>
            <label>Peak Pressure:</label>
            <input
              type="text"
              name="PeakPress"
              value={ventilatorSettings.PeakPress}
              readOnly
            />
          </div>
          <div>
            <label>Peep:</label>
            <input
              type="text"
              name="Peep"
              value={ventilatorSettings.Peep}
              readOnly
            />
          </div>
          <div>
            <label>Mean Pressure:</label>
            <input
              type="text"
              name="MeanPress"
              value={ventilatorSettings.MeanPress}
              readOnly
            />
          </div>
          <div>
            <label>MV:</label>
            <input
              type="text"
              name="MV"
              value={ventilatorSettings.MV}
              readOnly
            />
          </div>
          <div>
            <label>Inspiratory Tidal Volume (ITV):</label>
            <input
              type="text"
              name="ITV"
              value={ventilatorSettings.ITV}
              readOnly
            />
          </div>
          <div>
            <label>Expiratory Tidal Volume (ETV):</label>
            <input
              type="text"
              name="ETV"
              value={ventilatorSettings.ETV}
              readOnly
            />
          </div>
          <div>
            <label>FIO2:</label>
            <input
              type="text"
              name="FIO2"
              value={ventilatorSettings.FIO2}
              readOnly
            />
          </div>
        </form>
      )}
    </div>
  );
};

export default IP_VentilatorSettings;
