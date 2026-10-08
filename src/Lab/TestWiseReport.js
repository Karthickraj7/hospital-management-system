import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import "jspdf-autotable";
import DownloadIcon from "@mui/icons-material/Download";
import { ToastContainer, toast } from "react-toastify";

function TestWiseReport() {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const [datetype, setdatetype] = useState("");
  const [currentdate, setcurrentdate] = useState("");
  const [fromdate, setfromdate] = useState("");
  const [todate, settodate] = useState("");
  const [groupandtestnames, setgroupandtestnames] = useState([]);
  const [selectedCode, setSelectedCode] = useState("");
  const [isTestwise, setIsTestwise] = useState(false);

  const hexToRgb = (hex) => {
    // Remove the hash at the start if it's there
    hex = hex.replace(/^#/, "");

    // Parse r, g, b values
    let r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16);

    return [r, g, b];
  };

  // Get the CSS variable value
  const projectColor = getComputedStyle(document.documentElement)
    .getPropertyValue("--selectbackgroundcolor")
    .trim();
  const projectColor1 = getComputedStyle(document.documentElement)
    .getPropertyValue("--ProjectColor")
    .trim();

  // Convert the CSS variable (hex) to RGB
  const [r, g, b] = hexToRgb(projectColor);
  const [r1, g1, b1] = hexToRgb(projectColor1);

  const formatAmountWithCommas = (amount) => {
    if (isNaN(amount)) return amount; // Return if not a valid number

    return Number(amount).toLocaleString(); // Converts the number to a locale string with commas
  };

  useEffect(() => {
    axios
      .get(`${urllink}Masters/Groupandtestmaster`)
      .then((res) => {
        setgroupandtestnames(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [urllink]);

  const handleonchange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "datetype") {
      setdatetype(value);
      setfromdate("");
      settodate("");
      setcurrentdate("");
    } else if (name === "CurrentDate") {
      setcurrentdate(value);
      setfromdate("");
      settodate("");
    } else if (name === "FromDate") {
      setfromdate(value);
      setcurrentdate("");
    } else if (name === "ToDate") {
      settodate(value);
      setcurrentdate("");
    } else if (name === "testName") {
      const selectedTest = groupandtestnames.find(
        (test) => test.name === value
      );

      console.log("Selected Test:", selectedTest);

      if (selectedTest) {
        setSelectedCode(selectedTest.code);
      } else {
        setSelectedCode(""); // Reset if no match is found
      }
    } else if (name === "isTestwise" && type === "checkbox") {
      setIsTestwise(checked);
    }
  };

  const handledownload = () => {
    const datatosend = {
      currentdate: currentdate,
      datetype: datetype,
      fromdate: fromdate,
      todate: todate,
      code: isTestwise ? selectedCode : null, // Send code only if IsTestwise is checked
    };

    if (datetype) {
      if (datetype === "Currentdate" && !currentdate) {
        alert("Current date must be provided.");
        return;
      } else if (datetype === "Customize" && (!fromdate || !todate)) {
        alert("From date and To date must be provided.");
        return;
      } else if (isTestwise && !selectedCode) {
        alert("Choose Test Method Or Test Name");
        return;
      }
    } else {
      alert("Select Date Type");
      return;
    }

    axios
      .get(`${urllink}Masters/TestWiseReport`, {
        params: datatosend,
      })
      .then((res) => {
        const data = res.data;
        console.log(data);

        // // Create a new jsPDF instance
        // const doc = new jsPDF({ orientation: "landscape" });

        // // Fetch clinic data
        // axios
        //   .get(
        //     `${urllink}usercontrol/getClinic?location=${userRecord?.location}`
        //   )
        //   .then((response) => {
        //     const clinicData = response.data[0];
        //     if (clinicData) {
        //       const {
        //         ClinicName,
        //         doorNo,
        //         street,
        //         area,
        //         city,
        //         state,
        //         country,
        //         pincode,
        //       } = clinicData;

        //       const pageHeight = doc.internal.pageSize.getHeight();

        //       // Function to add header and footer on every page
        //       // Function to add header and footer on every page
        //       const addHeaderFooter = (currentPage, totalPages) => {
        //         // Add the header
        //         doc.setFontSize(18);
        //         doc.setFont("helvetica", "bold");
        //         doc.text(
        //           "Test Wise Report",
        //           doc.internal.pageSize.getWidth() / 2,
        //           10,
        //           { align: "center" }
        //         );

        //         // Clinic Address in two lines on the right side
        //         doc.setFontSize(11);
        //         doc.text(
        //           `${ClinicName}`,
        //           doc.internal.pageSize.getWidth() - 12,
        //           6,
        //           { align: "right" }
        //         );
        //         doc.setFontSize(9);
        //         doc.text(
        //           `${doorNo}, ${street} ${area}, ${city},`,
        //           doc.internal.pageSize.getWidth() - 12,
        //           12,
        //           { align: "right" }
        //         );
        //         doc.text(
        //           `${state}, ${country} - ${pincode}`,
        //           doc.internal.pageSize.getWidth() - 12,
        //           18,
        //           { align: "right" }
        //         );

        //         // Date Selection on the left side
        //         doc.setFontSize(13);
        //         const dateText =
        //           datetype === "Currentdate"
        //             ? `Date : ${currentdate}`
        //             : `From : ${fromdate}  - To : ${todate}`;
        //         doc.text(dateText, 15, 35); // Left side corner

        //         // Add the footer (page numbering in the format "Page X of Y")
        //         doc.setFontSize(10);
        //         doc.text(
        //           `Page No : ${totalPages}`,
        //           doc.internal.pageSize.getWidth() / 2,
        //           pageHeight - 10,
        //           { align: "center" }
        //         );
        //       };

        //       // Organize data by department
        //       let startY = 45;

        //       // Add department sections to the PDF
        //       data.forEach((departmentObj) => {
        //         for (const [department, tests] of Object.entries(
        //           departmentObj
        //         )) {
        //           if (tests.length === 0) continue; // Skip if no tests in the department

        //           // Define the table headers
        //           const tableColumn = [
        //             "Test Name",
        //             "Test Code",
        //             "Basic Amount",
        //             "Test Count",
        //             "Total Amount",
        //           ];

        //           // Prepare table rows
        //           const rows = tests.map((test) => [
        //             test.Test_Name || "",
        //             test.Test_Code || "",
        //             formatAmountWithCommas(test.Basic_Amount || ""),
        //             test.Test_Count || 0,
        //             formatAmountWithCommas(test.Total_Test_Amount || ""),
        //           ]);

        //           // Add the table to the PDF
        //           doc.autoTable({
        //             head: [tableColumn],
        //             body: rows,
        //             startY: startY,
        //             theme: "grid",
        //             didDrawPage: function (data) {
        //               // Add header and footer on each page
        //               addHeaderFooter(
        //                 data.pageNumber,
        //                 doc.internal.getNumberOfPages()
        //               );
        //             },
        //             didDrawCell: (data) => {
        //               if (data.row.index !== 0 && data.row.cells[3].raw > 0) {
        //                 // Skip header row and check if Test_Count > 0
        //                 if (data.cell.section === "body") {
        //                   // Apply only to body cells
        //                   const x = data.cell.x;
        //                   const y = data.cell.y;
        //                   const width = data.cell.width;
        //                   const height = data.cell.height;

        //                   // Draw a background rectangle with light color
        //                   doc.setFillColor(r, g, b); // Set background color (e.g., light yellow)
        //                   doc.rect(x, y, width, height, "F");

        //                   // Ensure text color is set to black for highlighted rows
        //                   doc.setTextColor(0, 0, 0); // Set text color to black

        //                   // Draw text again to ensure visibility
        //                   doc.text(data.cell.text, x + 1, y + height / 2 + 1, {
        //                     baseline: "middle",
        //                   });
        //                 }
        //               }
        //             },
        //             margin: { top: 40 }, // Keep some margin for the header
        //             headStyles: {
        //               fillColor: [r1, g1, b1], // Light gray background for headers
        //               fontSize: 10,
        //             },
        //             styles: {
        //               cellPadding: 2,
        //               fontSize: 8,
        //               valign: "middle",
        //               halign: "left",
        //               fillColor: [255, 255, 255], // Default cell background color (white)
        //               textColor: [0, 0, 0], // Default text color (black)
        //             },
        //             pageBreak: "auto", // Ensure automatic page break after every 30 rows
        //             tableWidth: "auto",
        //             rowPageBreak: "auto",
        //           });

        //           // Update startY for the next department
        //           startY = doc.autoTable.previous.finalY + 10;
        //         }
        //       });

        //       // Save the PDF
        //       doc.save("TestWiseReport.pdf");
        //     }
        //   })
        //   .catch((error) => {
        //     console.error(error);
        //   });
      })
      .catch((err) => {
        console.error(err);
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
      <div className="h_head">
        <h4>TestWise Report</h4>
      </div>
      <br />
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="datetype">
            Date Type<span>:</span>
          </label>
          <select
            type="text"
            name="datetype"
            id="datetype"
            required
            onChange={handleonchange}
          >
            <option value="">Select</option>
            <option value="Currentdate">Current Date</option>
            <option value="Customize">Customize</option>
          </select>
        </div>

        {datetype === "Currentdate" && (
          <div className="RegisForm_1">
            <label htmlFor="CurrentDate">
              Current Date<span>:</span>
            </label>
            <input
              type="date"
              name="CurrentDate"
              id="CurrentDate"
              required
              onChange={handleonchange}
            ></input>
          </div>
        )}

        {datetype === "Customize" && (
          <>
            <div className="RegisForm_1">
              <label htmlFor="FromDate">
                From Date<span>:</span>
              </label>
              <input
                type="date"
                name="FromDate"
                id="FromDate"
                required
                onChange={handleonchange}
              ></input>
            </div>
            <div className="RegisForm_1">
              <label htmlFor="ToDate">
                To Date<span>:</span>
              </label>
              <input
                type="date"
                name="ToDate"
                id="ToDate"
                required
                onChange={handleonchange}
              ></input>
            </div>
          </>
        )}

        <div className="RegisForm_1 rghrhfh">
          <label htmlFor="isTestwise">
            IsTestwise<span>:</span>
          </label>
          <input
            type="checkbox"
            name="isTestwise"
            id="isTestwise"
            onChange={handleonchange}
          />
        </div>

        {isTestwise && (
          <>
            <div className="RegisForm_1">
              <label htmlFor="testName">
                servicename
                <span>:</span>
              </label>
              <input
                list="testNames"
                name="testName"
                id="testName"
                required
                onChange={handleonchange}
              />
              <datalist id="testNames">
                {console.log("groupandtestnames", groupandtestnames)}
                {Array.isArray(groupandtestnames) &&
                  groupandtestnames.map((test) => (
                    <option key={test.code} value={test.name} />
                  ))}
              </datalist>
            </div>
          </>
        )}
      </div>
      <br />
      <div className="Register_btn_con">
        <button onClick={handledownload} className="RegisterForm_1_btns">
          <DownloadIcon />
        </button>
      </div>
      <ToastContainer />
    </div>
  );
}

export default TestWiseReport;
