import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import jsPDF from "jspdf";
import { useReactToPrint } from "react-to-print";
import '../EmployeeRequest/PayslipView.css'
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";

function PaySlip() {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log("userRecord", userRecord);
    const dispatchvalue = useDispatch();
  const employeedata = useSelector(
    (state) => state.Frontoffice?.EmployeePaySlipData
  );
    const toast = useSelector((state) => state.userRecord?.toast);

  console.log("employeedata", employeedata)
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
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
            console.log("generatedPdfBlob",generatedPdfBlob)
            setPdfBlob(generatedPdfBlob);

            const formData = new FormData();
            formData.append("pdf", generatedPdfBlob, "paySlip.pdf");
            formData.append("employeeid", employeedata?.Employee_ID);
            formData.append("advanceid", employeedata?.advanceid);
            formData.append("location", userRecord?.location);
            formData.append("Paid_Salary", employeedata?.NetSalary);
            formData.append("createdby", userRecord?.username);
            // formData.append('advance_amount', employeedata?.advance_amount)
            formData.append('fromdate', employeedata?.fromdate)
            formData.append('AmountDeduct_PerMonth', employeedata?.AmountDeduct_PerMonth)
            formData.append('No_of_MonthPaid',employeedata?.No_of_MonthPaid)
            axios.post(`${UrlLink}HR_Management/insert_EmployeePaySlips`, formData)
              .then((response) => {
                console.log('PDF uploaded successfully');
                const reste = response.data;
                const typp = Object.keys(reste)[0];
                const mess = Object.values(reste)[0];
                const tdata = {
                  message: mess,
                  type: typp,
                };
                dispatchvalue({ type: "toast", value: tdata });
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

    axios
      .get(
        `${UrlLink}Masters/Hospital_Detials_link`
      )
      .then((response) => {
        if (response.data) {
          const data = response.data;
          setClinicName(data.hospitalName);
          setClinic_Logo(`data:image/png;base64,${data.hospitalLogo}`);
          setlocation(data.location);
          setdate(data.date);
        } else {
        }
      })
      .catch((error) => console.error("Error fetching data: ", error));
  }, [userRecord]);

  return (
    <>
      <div className="Main_container_app">
        <h3>Pay Slip</h3>

        <div id="reactprintcontent" >
          <div className="paymt-fr-mnth-slp">
            <div className="logo-pay-slp">
              <img src={clinicLogo} alt="" />
            </div>
            <div>
              <h2>
                {clinicName}
              </h2>
            </div>
          </div>
          <div className="paymt-fr-mnth-slp">
            {/* <h4>Pay Slip for the month of ({employeedata?.fromdate})</h4> */}
            <h4>
              Pay Slip for the month of ({new Date(employeedata?.fromdate).toLocaleString('default', { month: 'long', year: 'numeric' })})
            </h4>

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
                <td>{(employeedata && employeedata?.PFNumber) || ""}</td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="employeeId">Employee ID:</label>
                </td>
                <td>{(employeedata && employeedata?.Employee_ID) || ""}</td>
                <td>
                  <label htmlFor="panNumber">PAN Number:</label>
                </td>
                <td>{(employeedata && employeedata?.PanNumber) || ""}</td>
              </tr>

              <tr>
                <td>
                  <label htmlFor="department">Department:</label>
                </td>
                <td>{(employeedata && employeedata?.Department_Name) || ""}</td>
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
                  {(employeedata && employeedata?.TotalDays) || ""}
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
                <td>{(employeedata && employeedata?.PresentDays) || ""}</td>
              </tr>
            </tbody>
          </table>

          {employeedata?.SalaryType !== 'Stipend' && (
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
                    {(employeedata && employeedata?.BasicSalary) || "0"}
                  </td>
                  <td>PF</td>
                  <td>
                    {(employeedata && employeedata?.PfForEmployee_Amount) ||
                      "0"}
                  </td>
                </tr>
                <tr>
                  <td>HRA</td>
                  <td>
                    {(employeedata && employeedata?.HRAfinal) ||
                      "0"}
                  </td>
                  <td>Esi Amount</td>
                  <td>{(employeedata && employeedata?.EsiAmount) || "0"}</td>
                </tr>
                <tr>
                  <td>Medical</td>
                  <td>
                    {(employeedata &&
                      employeedata?.MedicalAllowancefinal) ||
                      "0"}
                  </td>
                  <td>Professional Tax</td>
                  <td>
                    {(employeedata && employeedata?.ProfessionalTax) || "0"}
                  </td>
                </tr>
                <tr>
                  <td>Travel</td>
                  <td>
                    {(employeedata && employeedata?.TravelAllowancefinal) ||
                      "0"}
                  </td>
                  <td>Loss of Pay</td>
                  <td>{(employeedata && employeedata?.LossofPay) || "0"}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                  </td>
                  <td>Advance Amount</td>
                  <td>
                    {(employeedata && employeedata?.AmountDeduct_PerMonth) || "0"}
                  </td>
                </tr>
                <tr>
                  <td></td>
                  <td>
                  </td>
                  <td>TDS Amount</td>
                  <td>
                    {(employeedata && employeedata?.Tds_Amount) || "0"}
                  </td>
                </tr>
                <tr>
                  <td>Total Earnings</td>
                  <td>
                    {(employeedata && employeedata?.earnings) || "0"}
                  </td>
                  <td>Total Deductions</td>
                  <td>
                    {(employeedata && employeedata?.deductions) || "0"}
                  </td>
                </tr>
              </tbody>
            </table>
          )}

          <div className="signature-section909">
            <div className="signature909">
              {/* <p>Net Salary :</p> */}
              <p>{employeedata && employeedata?.SalaryType === 'Stipend' ? 'Stipend Amount :' : 'Net Salary :'}</p>

              <p>{employeedata && employeedata?.SalaryType === 'Stipend' ? (employeedata && employeedata?.StipendAmount) : (employeedata && employeedata?.NetSalary) || "0"}</p>
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
        <ToastAlert Message={toast.message} Type={toast.type} />
      </div>
    </>
  );
}

export default PaySlip;



