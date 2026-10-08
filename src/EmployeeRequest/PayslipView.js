import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import './PayslipView.css';


function PayslipView() {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log("userRecord",userRecord);
  const currentYear = new Date().getFullYear(); // Current year
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const [payslipData, setPayslipData] = useState([]);

  useEffect(() => {
    if (userRecord) {
      axios
        .get(
          `${UrlLink}HR_Management/EmployeePayslipDownload?EmployeeID=${userRecord?.Employeeid}&Year=${currentYear}`
        )
        .then((response) => {
          console.log(response.data);
          setPayslipData(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [userRecord?.Employeeid, currentYear]);

  // Function to download payslip
  const downloadPayslip = (payslip) => {
    // Use anchor element to trigger download
    const link = document.createElement("a");
    link.href = payslip.EmployeePayslip;
    link.setAttribute(
      "download",
      `Payslip_${userRecord?.Employeeid}_${payslip.PaySlip_Date}.pdf`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Function to group payslips by year and month
  const groupPayslipsByYearAndMonth = () => {
    const groupedPayslips = {};
     Array.isArray(payslipData) && payslipData?.forEach((payslip) => {
      const year = new Date(payslip.PaySlip_Date).getFullYear(); // Get year
      const month = new Date(payslip.PaySlip_Date).toLocaleString("en-us", {
        month: "short",
      }); // Get month name
      if (!groupedPayslips[year]) {
        groupedPayslips[year] = {};
      }
      if (!groupedPayslips[year][month]) {
        groupedPayslips[year][month] = [];
      }
      groupedPayslips[year][month].push(payslip);
    });
    return groupedPayslips;
  };

  const groupedPayslips = groupPayslipsByYearAndMonth();
  return (
    <>
        <div className="Main_container_app">
          <h4>PaySlip Download</h4>
        <div></div>
        <br />

        {groupedPayslips && Object.keys(groupedPayslips).length > 0 ? (
          Object.keys(groupedPayslips).map((year, index) => (
            <div key={index} className="head_payviw_sxd3">
              <div className="RegisFormcon_payviewwer">
                <div className="RegisForm_1_payviewwer">
                  <label htmlFor="input" style={{ fontSize: '18px' }}>
                    Year <span>:</span> {year}
                  </label>
                </div>
              </div>
              <br />
              <div>
                {Object.keys(groupedPayslips[year]).map((month, monthIndex) => (
                  <div key={monthIndex} className="RegisFormcon_payviewwer">
                    <div className="RegisForm_1_payviewwer">
                      <label>
                        Month <span>:</span> {month}
                      </label>
                    </div>

                    {groupedPayslips[year][month].map((payslip, payslipIndex) => (
                      <div key={payslipIndex} className="RegisForm_1_payviewwer">
                        <label style={{ width: '80px' }}>
                          {payslip.PaySlip_Date}
                        </label>
                        <div className="Register_btn_con">
                          <button
                            className="RegisterForm_1_btns"
                            onClick={() => downloadPayslip(payslip)}
                          >
                            Download
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div className="Add_items_Purchase_Master">
            <span>No Payslips To Download</span>
          </div>
        )}
      </div>
    </>
  );

}

export default PayslipView;


