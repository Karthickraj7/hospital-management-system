import React, { useState, useEffect } from "react";

import axios from "axios";
import { useSelector } from "react-redux";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";

const AdvaceManagement = () => {
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const [openModal, setOpenModal] = useState(false);
  const [advancedetails, setadvancedetails] = useState([]);

  console.log(userRecord);

  const [rolename, setRolename] = useState([]);

  useEffect(() => {
    axios
      .get(`${UrlLink}HR_Management/Employee_Designation_Details`)
      .then((response) => {
        console.log(response.data);
        setRolename(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [UrlLink]);

  const handleview = (params) => {
    console.log(params);
    setOpenModal(true);
    axios
      .get(
        `${UrlLink}HR_Management/Advance_Amount_Details?employeeid=${params?.EmployeeId}`
      )
      .then((res) => {
        console.log(res);
        setadvancedetails(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const [searchOPParams, setsearchOPParams] = useState({
    query: "",
    status: "Approved",
  });

  const [Filterdata, setFilterdata] = useState([]);
  const [PatientRegisterData, setPatientRegisterData] = useState([]);
  const [SearchQuery, setSearchQuery] = useState("");
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };
  const handleSearchChangeStatus = (e) => {
    const { name, value } = e.target;
    setsearchOPParams({ ...searchOPParams, [name]: value });
  };

  useEffect(() => {
    if (SearchQuery !== "") {
      const lowerCaseQuery = SearchQuery.toLowerCase();

      const filteredData = PatientRegisterData.filter((row) => {
        const { EmployeeId, EmployeeName, PhoneNo } = row;
        return (
          (EmployeeId && EmployeeId.toLowerCase().includes(lowerCaseQuery)) ||
          (PhoneNo && PhoneNo.toLowerCase().includes(lowerCaseQuery)) ||
          (EmployeeName && EmployeeName.toLowerCase().includes(lowerCaseQuery))
        );
      });

      setFilterdata(filteredData);
    } else {
      setFilterdata(PatientRegisterData);
    }
  }, [SearchQuery, PatientRegisterData]);
  useEffect(() => {
    axios
      .get(`${UrlLink}HR_Management/Employee_Advance_RequestList_link`, {
        params: searchOPParams,
      })
      .then((res) => {
        const ress = res.data;
        console.log("567", ress);
        if (Array.isArray(ress)) {
          setPatientRegisterData(ress);
          setFilterdata(ress);
        } else {
          setPatientRegisterData([]);
          setFilterdata([]);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, [UrlLink, searchOPParams]);
  
  return (
    <div className="appointment">
      
      <div className="con_1 ">
        <div className="inp_1">
          <label htmlFor="input">
            Search by <span>:</span>
          </label>
          <input
            type="text"
            name="employeeName"
            placeholder="Employee Name or EmployeeId or PhoneNo"
            value={SearchQuery} // Use the correct state variable here
            onChange={handleSearchChange} // Call the handler on input change
          />
        </div>
        <div className="inp_1">
          <label htmlFor="designation">
            Designation <span>:</span>
          </label>
          <select
            id="designation"
            name="designation"
            value={searchOPParams.designation}
            onChange={handleSearchChangeStatus}
            className="new-custom-input-phone wei32j"
            required
          >
            {/* Explicitly set value to an empty string */}
            <option value="">Select</option>
            {Array.isArray(rolename) && rolename.length > 0 ? (
              rolename.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.Designation}
                </option>
              ))
            ) : (
              <option disabled>No Option</option>
            )}
          </select>
        </div>
      </div>
      <div className="Selected-table-container">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th id="slectbill_ins">Employee ID</th>
              <th id="slectbill_ins">Employee Name</th>
              <th id="slectbill_ins">Designation</th>
              <th id="slectbill_ins">Issued Date</th>
              <th id="slectbill_ins">Request Amount</th>
              <th id="slectbill_ins">No.of.Installment</th>
              <th id="slectbill_ins">Status</th>

              <th id="slectbill_ins">View</th>
            </tr>
          </thead>
          <tbody>
            {Filterdata.length > 0 ? (
              Filterdata.map((leave, index) => (
                <tr key={index}>
                  <td>{leave.EmployeeId}</td>
                  <td>{leave.EmployeeName}</td>
                  <td>{leave.Designation}</td>
                  <td>{leave.IssuedDate}</td>
                  <td>{leave.RequestAmount}</td>

                  <td>{leave.Repayment_Due}</td>
                  <td>{leave.Status}</td>

                  <td>
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleview(leave)}
                      startIcon={<VisibilityIcon />}
                    >
                      View
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">No records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {openModal && (
        <div
          className={
            isSidebarOpen ? "sideopen_showcamera_profile" : "showcamera_profile"
          }
          onClick={() => {
            setOpenModal(false);
          }}
        >
          <div
            className="newwProfiles newwPopupforreason uwagduaguleaveauto foradvanceview"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="appointment">
              <div className="h_head">
                <h4>Installment Details</h4>
              </div>
              <div className="Selected-table-container">
                <table className="selected-medicine-table2">
                  <thead>
                    <tr>
                      <th id="slectbill_ins">Approved Amount</th>
                      <th id="slectbill_ins">Approved Date</th>
                      <th id="slectbill_ins">No.of Installment</th>
                      <th id="slectbill_ins">Amount Per Month</th>
                      <th id="slectbill_ins">No.of Month Paid</th>
                      <th id="slectbill_ins">Installment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {console.log(advancedetails)}
                    {Array.isArray(advancedetails) ? (
                      advancedetails.map((employee, index) => (
                        <tr key={index}>
                          <td>{employee.Request_Amount}</td>
                          <td>{employee.IssuedDate}</td>
                          <td>{employee.Repayment_Due}</td>
                          <td>{employee.AmountPerMonth}</td>
                          <td>{employee.NoofMonthPaid || 0}</td>
                          <td>{employee.InstallmentStatus}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6">No data available</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <div className="Register_btn_con">
                <button
                  className="RegisterForm_1_btns"
                  onClick={() => setOpenModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvaceManagement;
