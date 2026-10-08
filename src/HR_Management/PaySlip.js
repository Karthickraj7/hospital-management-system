import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";
import '../EmployeeRequest/PayslipView.css'

function PaySlip() {
  const userRecord = useSelector((state) => state.userRecord?.UserData);

  const employeedata = useSelector((state) => state.userRecord?.employeedata);
  console.log(employeedata)
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const [pdfBlob, setPdfBlob] = useState(null);

  const [clinicName, setClinicName] = useState("");
  const [clinicLogo, setClinic_Logo] = useState(null);
  const [location, setlocation] = useState("");
  const [date, setdate] = useState("");

  const [formData, setFormData] = useState({
    employeeName: "",
    employeeId: "",
    department: "",
    numberOfPresents: 0,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };



  const handlePrint = async () => {
    const printdata = document.getElementById("reactprintcontent");

    try {
      if (printdata) {
        const contentWidth = printdata.offsetWidth;
        const padding = 20; // Adjust the padding as needed
        const pdfWidth = contentWidth + 2 * padding; // Add padding to width
        const pdfHeight = contentWidth * 1.5; // Adjust height as needed
        const pdf = new jsPDF({
          unit: "px",
          format: [pdfWidth, pdfHeight],
        });

        pdf.html(printdata, {
          x: padding, // Set x-coordinate for content
          y: padding, // Set y-coordinate for content
          callback: () => {
            const generatedPdfBlob = pdf.output("blob");
            setPdfBlob(generatedPdfBlob);

            const formData = new FormData();
            formData.append("pdf", generatedPdfBlob, "paySlip.pdf");
            formData.append("employeeid", employeedata?.EmployeeID);
            formData.append("employeename", employeedata?.EmployeeName);
            formData.append("location", userRecord?.location);
            formData.append("Paid_Salary", employeedata?.net_salary);
            formData.append("createdby", userRecord?.username);
            formData.append('advance_amount', employeedata?.advance_amount)
            formData.append('fromdate', employeedata?.fromdate)

            axios.post(`${urllink}HRmanagement/insert_EmployeePaySlips`, formData)
              .then((response) => {
                console.log('PDF uploaded successfully');
                alert(response.data.message)
              })
              .catch((error) => {
                console.error('Error uploading PDF:', error);
              });
          },
        });
      } else {
        throw new Error("Unable to get the target element");
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  useEffect(() => {
    const location = userRecord?.location;
    axios
      .get(
        `${urllink}HR_Management/getAccountsetting_payslip?location=${location}`
      )
      .then((response) => {
        if (response.data) {
          const data = response.data;
          setClinicName(data.Clinic_Name);
          setClinic_Logo(`data:image/png;base64,${data.Clinic_Logo}`);
          setlocation(data.location);
          setdate(data.date);
        } else {
        }
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, [userRecord]);

  return (
    <>
      <div className="leaveform">
        <div className="h_head erferf print-button3">
          <h4>Pay Slip</h4>
        </div>

        <div id="reactprintcontent" >
          <div className="paymt-fr-mnth-slp">
            <div className="logo-pay-slp">
              <img src={clinicLogo} alt="" />
            </div>
            <div>
              <h2>
                {clinicName} ({location})
              </h2>
            </div>
          </div>
          <div className="paymt-fr-mnth-slp">
            <h3>Pay Slip for the month of ({date})</h3>
          </div>

          <table className="jon-flx-the-twoi">
            <tbody>
              <tr>
                <td>
                  <label htmlFor="employeeName">Employee Name:</label>
                </td>
                <td>{(employeedata && employeedata?.EmployeeName) || ""}</td>
                <td>
                  <label htmlFor="pfNumber">PF Number:</label>
                </td>
                <td>{(employeedata && employeedata?.EPFNumber) || ""}</td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="employeeId">Employee ID:</label>
                </td>
                <td>{(employeedata && employeedata?.EmployeeID) || ""}</td>
                <td>
                  <label htmlFor="panNumber">PAN Number:</label>
                </td>
                <td>{(employeedata && employeedata?.PanNumber) || ""}</td>
              </tr>

              <tr>
                <td>
                  <label htmlFor="department">Department:</label>
                </td>
                <td>{(employeedata && employeedata?.Department) || ""}</td>
                <td>
                  <label htmlFor="designation">Designation:</label>
                </td>
                <td>{(employeedata && employeedata?.Designation) || ""}</td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="bankName">Bank Name:</label>
                </td>
                <td>{(employeedata && employeedata?.BankName) || ""}</td>
                <td>
                  <label htmlFor="bankAccountNumber">Bank Account No:</label>
                </td>
                <td>
                  {(employeedata && employeedata?.AccountNumber) || ""}
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="numberOfPresents">Total Working Days:</label>
                </td>
                <td>
                  {(employeedata && employeedata?.num_days) || ""}
                </td>
                <td>
                  <label htmlFor="dateOfJoining">Date of Joining:</label>
                </td>
                <td>
                  {(employeedata && employeedata?.DateofJoining) || ""}
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="numberOfPresents">No of Days absent:</label>
                </td>
                <td>{(employeedata && employeedata?.leave_days) || "0"}</td>
                <td>
                  <label htmlFor="numberOfPresents">No of Days Present:</label>
                </td>
                <td>{(employeedata && employeedata?.present_days) || ""}</td>
              </tr>
            </tbody>
          </table>

          {employeedata?.Designation !== 'TRAINEE' && (
            <table className="responsive-table909">
              <thead>
                <tr>
                  <th>Earnings</th>
                  <th>Amount</th>
                  <th>Deduction</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Basic Salary</td>
                  <td>
                    {(employeedata && employeedata?.basic_salary) || "0"}
                  </td>
                  <td>PF</td>
                  <td>
                    {(employeedata && employeedata?.pf_amount) ||
                      "0"}
                  </td>
                </tr>
                <tr>
                  <td>HRA</td>
                  <td>
                    {(employeedata && employeedata?.HRA_Allowance_Amount) ||
                      "0"}
                  </td>
                  <td>Esi Amount</td>
                  <td>{(employeedata && employeedata?.esi_amount) || "0"}</td>
                </tr>
                <tr>
                  <td>Medical</td>
                  <td>
                    {(employeedata &&
                      employeedata?.Medical_Allowance_Amount) ||
                      "0"}
                  </td>
                  <td>Professional Tax</td>
                  <td>
                    {(employeedata && employeedata?.professional_tax) || "0"}
                  </td>
                </tr>
                <tr>
                  <td>Travel</td>
                  <td>
                    {(employeedata && employeedata?.Travel_Allowance_Amount) ||
                      "0"}
                  </td>
                  <td>Loss of Pay</td>
                  <td>{(employeedata && employeedata?.lossofpay) || "0"}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                  </td>
                  <td>Advance Amount</td>
                  <td>
                    {(employeedata && employeedata?.advance_amount) || "0"}
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                  </td>
                  <td>TDS Amount</td>
                  <td>
                    {(employeedata && employeedata?.tds_amount) || "0"}
                  </td>
                </tr>
                <tr>
                  <td>Total Earnings</td>
                  <td>
                    {(employeedata && employeedata?.TotalEarnings) || "0"}
                  </td>
                  <td>Total Deductions</td>
                  <td>
                    {(employeedata && employeedata?.totaldeduction) || "0"}
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          <div className="signature-section909">
            <div className="signature909">
              {/* <p>Net Salary :</p> */}
              <p>{employeedata && employeedata?.Designation === 'TRAINEE' ? 'Stipend Amount :' : 'Net Salary :'}</p>

              <p>{employeedata && employeedata?.Designation === 'TRAINEE' ? (employeedata && employeedata?.StipendAmount) : (employeedata && employeedata?.net_salary) || "0"}</p>
            </div>
          </div>
          <div className="signature-section909">
            <p className="disclaimer23">
              This page is created automatically without a signature.
            </p>
          </div>
        </div>
        <div className="Register_btn_con">
          <button
            className="RegisterForm_1_btns print-button3"
            onClick={handlePrint}
          >
            Print
          </button>
        </div>
      </div>
    </>
  );
}

export default PaySlip;
