import React, { useState, useEffect } from "react";
import ToggleOnIcon from "@mui/icons-material/ToggleOn";
import ToggleOffIcon from "@mui/icons-material/ToggleOff";
import Reportcapture from "./ReportCapture";
import Reportverify from "./Reportverify";
import { useDispatch, useSelector } from "react-redux";
import PathologyApproval from "./PathologyApproval";
import Report from "./Report";

function ResultEntryNavigation() {
  const [activeTab, setActiveTab] = useState("");
  const [isToggled, setIsToggled] = useState(false);
  const [filteredTests, setFilteredTests] = useState([]);
  const dispatch = useDispatch();
  const [disbledat, setdisbledat] = useState({});

  const ResultEntryNavigationdata = useSelector(
    (state) => state.Frontoffice?.ResultEntryNavigationdata
  );

  const toggle = () => setIsToggled(!isToggled);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    closeToggle();
  };

  const closeToggle = () => {
    setIsToggled(false);
  };

  useEffect(() => {
    if (
      ResultEntryNavigationdata &&
      Object.keys(ResultEntryNavigationdata).length > 0
    ) {
      const { TestDetails } = ResultEntryNavigationdata;

      console.log(TestDetails)
      // Create filtered arrays
      const Analysis_FilteredTests = TestDetails.filter(
        (test) => test.Analysis_Status === "Pending"
      );
      const Verify_FilteredTests = TestDetails.filter(
        (test) =>
          test.Analysis_Status === "Completed" &&
          test.Verify_Status === "Pending"
      );
      const Approve_FilteredTests = TestDetails.filter(
        (test) =>
          test.Analysis_Status === "Completed" &&
          test.Verify_Status === "Verified" &&
          test.Approve_Status === "Pending"
      );

      // Determine active tab based on priority
      if (Analysis_FilteredTests.length > 0) {
        setActiveTab("Reportcapture");
      } else if (Verify_FilteredTests.length > 0) {
        setActiveTab("Reportverify");
      } else if (Approve_FilteredTests.length > 0) {
        setActiveTab("PathologyApproval");
      } else {
        setActiveTab("Reportverify"); // Default fallback
      }

      // Dispatch updated data only if something has changed
      const data = {
        ...ResultEntryNavigationdata,
        Analysis_FilteredTests: Analysis_FilteredTests,
        Verify_FilteredTests: Verify_FilteredTests,
        Approve_FilteredTests: Approve_FilteredTests,
      };
      setdisbledat(data);
      if (
        JSON.stringify(ResultEntryNavigationdata.Analysis_FilteredTests) !==
          JSON.stringify(Analysis_FilteredTests) ||
        JSON.stringify(ResultEntryNavigationdata.Verify_FilteredTests) !==
          JSON.stringify(Verify_FilteredTests) ||
        JSON.stringify(ResultEntryNavigationdata.Approve_FilteredTests) !==
          JSON.stringify(Approve_FilteredTests)
      ) {
        dispatch({
          type: "ResultEntryNavigationdata",
          value: data,
        });
      }
    }
  }, [ResultEntryNavigationdata, dispatch]);


  // const areAllTestsApproved =
  // ResultEntryNavigationdata?.TestDetails?.every(
  //   (test) =>
  //     test.Display_Analysis_Status === "Completed" &&
  //     test.Display_Verify_Status === "Verified" &&
  //     test.Display_Approve_Status === "Approved"
  // );

// console.log(areAllTestsApproved)

  useEffect(() => {
    const handleBodyClick = (event) => {
      if (!event.target.closest(".new-kit")) {
        closeToggle();
      }
    };

    document.body.addEventListener("click", handleBodyClick);

    return () => {
      document.body.removeEventListener("click", handleBodyClick);
    };
  }, []);

  return (
    <>
      <div className="appointment">
        <br />
        <div className="new-patient-registration-form1">
          <div className="new-navigation">
            <h2>
              <button
                disabled={
                  disbledat?.Analysis_FilteredTests &&
                  Array.isArray(disbledat?.Analysis_FilteredTests) &&
                  disbledat?.Analysis_FilteredTests.length === 0 
                }
                onClick={() => handleTabChange("Reportcapture")}
              >
                Result Entry
              </button>
              |
              <button
                disabled={
                  disbledat?.Verify_FilteredTests &&
                  Array.isArray(disbledat?.Verify_FilteredTests) &&
                  disbledat?.Verify_FilteredTests.length === 0 
                }
                onClick={() => handleTabChange("Reportverify")}
              >
                Report Verify
              </button>
              |
              <button
                disabled={
                  disbledat?.Approve_FilteredTests &&
                  Array.isArray(disbledat?.Approve_FilteredTests) &&
                  disbledat?.Approve_FilteredTests.length === 0 
                }
                onClick={() => handleTabChange("PathologyApproval")}
              >
                Approve
              </button> |
              <button
                disabled={
                  disbledat?.Report &&
                  Array.isArray(disbledat?.Report) &&
                  disbledat?.Report.length === 0
                }
                onClick={() => handleTabChange("Report")}
              >
                Report
              </button>
            </h2>
          </div>

          <div className="new-kit">
            <button className="new-tog" onClick={toggle}>
              {isToggled ? <ToggleOffIcon /> : <ToggleOnIcon />}
            </button>

            <div>
              {isToggled && (
                <div className="new-navigation-toggle">
                  <h2>
                    <button
                      disabled={
                        !ResultEntryNavigationdata?.TestDetails?.some(
                          (test) => test.Analysis_Status === "Pending"
                        )
                      }
                      onClick={() => handleTabChange("Reportcapture")}
                    >
                      Result Entry
                    </button>
                    |
                    <button
                      disabled={
                        !ResultEntryNavigationdata?.TestDetails?.some(
                          (test) => test.Verify_Status === "Pending"
                        )
                      }
                      onClick={() => handleTabChange("Reportverify")}
                    >
                      Report Verify
                    </button>
                    |
                    <button
                      disabled={
                        !ResultEntryNavigationdata?.TestDetails?.some(
                          (test) => test.Approve_Status === "Pending"
                        )
                      }
                      onClick={() => handleTabChange("PathologyApproval")}
                    >
                      Approve
                    </button> |
              <button
                disabled={
                  disbledat?.Approve_FilteredTests &&
                  Array.isArray(disbledat?.Approve_FilteredTests) &&
                  disbledat?.Approve_FilteredTests.length === 0 
                }
                onClick={() => handleTabChange("Report")}
              >
                Report
              </button>
                  </h2>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {activeTab === "Reportcapture" && <Reportcapture />}
      {activeTab === "Reportverify" && <Reportverify />}
      {activeTab === "PathologyApproval" && (
        <PathologyApproval  />
      )}
       {activeTab === "Report" && (
        <Report/>
      )}
    </>
  );
}

export default ResultEntryNavigation;
