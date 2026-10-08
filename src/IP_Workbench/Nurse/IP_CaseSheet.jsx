import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import ToggleButton from "@mui/material/ToggleButton";
import PrintIcon from "@mui/icons-material/Print";
import AddBoxIcon from "@mui/icons-material/AddBox";

const PrintContent = React.forwardRef((props, ref) => {
  return (
    <div
      ref={ref}
      id="reactprintcontent"
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-start",
        height: "100%",
        width: "100%",
      }}
    >
      {props.children}
    </div>
  );
});

const IP_CaseSheet = () => {
  const dispatch = useDispatch();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const IP_DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation
  );
  const componentRef = useRef();
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const [vitalData, setVitalData] = useState({});
  const [progressNotesData, setProgressNotesData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!IP_DoctorWorkbenchNavigation || !UrlLink) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    const { RegistrationId, RequestType: departmentType } =
      IP_DoctorWorkbenchNavigation;

    if (RegistrationId) {
      // Fetch Vitals & Progress Notes
      const fetchVitals = axios.get(
        `${UrlLink}Ip_Workbench/IP_Vitals_Form_Details_Link`,
        {
          params: {
            RegistrationId,
            DepartmentType: departmentType,
            Type: "Nurse",
          },
        }
      );

      const fetchProgressNotes = axios.get(
        `${UrlLink}Ip_Workbench/IP_ProgressNotes_Details_Link`,
        {
          params: { RegistrationId, DepartmentType: departmentType },
        }
      );

      Promise.all([fetchVitals, fetchProgressNotes])
        .then(([vitalsRes, progressRes]) => {
          // Group vitals by date
          if (
            vitalsRes.data?.vital_details &&
            Array.isArray(vitalsRes.data.vital_details)
          ) {
            const groupedVitals = vitalsRes.data.vital_details.reduce(
              (acc, entry) => {
                const dateKey = entry.Date;
                if (!acc[dateKey]) acc[dateKey] = [];
                acc[dateKey].push(entry);
                return acc;
              },
              {}
            );
            setVitalData(groupedVitals);
          } else {
            setVitalData({});
          }

          // Group progress notes by date
          if (progressRes.data && Array.isArray(progressRes.data)) {
            const groupedProgress = progressRes.data.reduce((acc, entry) => {
              const dateKey = entry.Date;
              if (!acc[dateKey]) acc[dateKey] = [];
              acc[dateKey].push(entry);
              return acc;
            }, {});
            setProgressNotesData(groupedProgress);
          } else {
            setProgressNotesData({});
          }
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching data:", err);
          setIsLoading(false);
        });
    }
  }, [
    UrlLink,
    IP_DoctorWorkbenchNavigation?.RegistrationId,
    IP_DoctorWorkbenchNavigation?.RequestType,
  ]);

  // Sort dates to show older dates first (21-03-2025 first, 24-03-2025 later)
  const sortedDates = Object.keys({ ...vitalData, ...progressNotesData }).sort(
    (a, b) => new Date(a) - new Date(b)
  );

  const vitalList = [
    "Temperature",
    "PulseRate",
    "SPO2",
    "HeartRate",
    "RespiratoryRate",
    "SBP",
    "DBP",
    "Height",
    "Weight",
    "BMI",
    "WC",
    "HC",
    "BSL",
  ];

  const DoctorWorkbenchNavigation = useSelector(
    (state) => state.Frontoffice?.DoctorWorkbenchNavigation
  );
  console.log("DoctorWorkbenchNavigation", DoctorWorkbenchNavigation);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforePrint: () => console.log("Preparing to print..."),
    onAfterPrint: () => console.log("Print completed"),
  });

  // Render the content component
  const renderContent = () => {
    if (isLoading) {
      return <div>Loading data...</div>;
    }

    if (sortedDates.length === 0) {
      return <div>No data available</div>;
    }

    return (
<>

 

      <div className="new-patient-registration-form">
      
      <div className="wdqwtyxghs0">
        <h2 style={{ textAlign: "center" }}>Patient Visit Details</h2>
        <h2 style={{ textAlign: "center" }}>Case Sheet</h2>

        <br />

        <div className="ewjdew_p802">
          <div className="transfer-form-row">

            <div className="transfer-form-cell transfer-form-cell-forprint">
              <label>
                Patient Name<span>:</span>
              </label>
            <h2>{IP_DoctorWorkbenchNavigation?.PatientName || ""}</h2>
            </div>

            <div className="transfer-form-cell">
            <label>
              Age/Sex<span>:</span>
            </label>
            <h2>{ IP_DoctorWorkbenchNavigation?.Age && IP_DoctorWorkbenchNavigation?.Gender
              ? `${IP_DoctorWorkbenchNavigation?.Age} / ${IP_DoctorWorkbenchNavigation?.Gender}`
              : ""}
            </h2>
          </div>


          </div>

          <div className="transfer-form-row">
           
            <div className="transfer-form-cell">
              <label>
                PatientId<span>:</span>
              </label>
              <h2>{IP_DoctorWorkbenchNavigation?.PatientId || ""}</h2>
            </div>
            <div className="transfer-form-cell">
              <label>
                Doctor Name<span>:</span>
              </label>
              <h2>{IP_DoctorWorkbenchNavigation?.DoctorName || ""}</h2>
            </div>
            
          </div>
        </div>

        {/* {IP_DoctorWorkbenchNavigation?.PatientName ? (
          <span>
            {
              
              IP_DoctorWorkbenchNavigation.PatientName +
              " (PatientId: " +
              IP_DoctorWorkbenchNavigation.PatientId +
              ") Age " +
              IP_DoctorWorkbenchNavigation.Age +
              " Years, " +
              IP_DoctorWorkbenchNavigation.Gender
              //    +
              //   (GeneralEvaluationData?.length > 0
              //     ? ", was presented with " +
              //       GeneralEvaluationData[0].KeyComplaint +
              //       " with the following history of " +
              //       GeneralEvaluationData[0].History
              //     : "")
            }
          </span>
        ) : (
          <span>No patient details...</span>
        )} */}

        <div style={{ border: "1px solid grey", margin: "5px 0px" }}></div>
      </div>
      
      
      
      
      
        {sortedDates.map((date, index) => (
          <div key={index} className="date-section">
            <h2>{date}</h2>

            {/* Display Vitals for the Date */}
            {vitalData[date] && (
              <>
                <h2 style={{ textAlign: "start" }}>Vitals</h2>

                <div className="prin_nnrmll_table">
                  <table>
                    <thead>
                      <tr>
                        <th>Time (Type)</th>
                        {vitalList.map((vital, i) => (
                          <th key={i}>{vital}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {vitalData[date].map((entry, i) => (
                        <tr key={i}>
                          <td>
                            {entry.Time} ({entry.Type})
                          </td>
                          {vitalList.map((vital, j) => (
                            <td key={j}>{entry[vital] || "-"}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
            <br />

            {progressNotesData[date] && (
              <div className="prin_nnrmll_table">
                <h2 style={{ textAlign: "start" }}>Progress Notes</h2>
                <table>
                  <thead>
                    <tr>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        Time (Type)
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        Progress Notes
                      </th>
                      <th
                        style={{
                          border: "1px solid #ddd",
                          padding: "8px",
                          textAlign: "left",
                        }}
                      >
                        Treatment Notes
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {progressNotesData[date].map((note, i) => (
                      <tr key={i}>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {note.Time} ({note.Type})
                        </td>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {note.ProgressNotes || "N/A"}
                        </td>
                        <td
                          style={{ border: "1px solid #ddd", padding: "8px" }}
                        >
                          {note.TreatmentNotes || "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>


      </>

    );
  };

  return (
    <div>
      <div className="case-sheet-container">


        {renderContent()}
      </div>

      <div className="print-button-container">
        <ToggleButton
          value="print"
          aria-label="print"
          onClick={handlePrint}
          style={{ margin: "10px 0" }}
        >
          <PrintIcon /> Print Case Sheet
        </ToggleButton>
      </div>

      {/* Hidden print content that will be used for printing */}
      <div style={{ display: "none" }}>
        <PrintContent ref={componentRef}>{renderContent()}</PrintContent>
      </div>
    </div>
  );
};

export default IP_CaseSheet;
