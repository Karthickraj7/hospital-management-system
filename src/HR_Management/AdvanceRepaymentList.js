import React, { useState, useEffect } from "react";
import axios from "axios";
import { useSelector } from "react-redux";

function AdvanceRepaymentList() {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

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

 

  const [searchOPParams, setsearchOPParams] = useState({
    query: "",
    status: "Completed",
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
    <div>
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
              <th id="slectbill_ins">Approved Amount</th>
              <th id="slectbill_ins">Installment Status</th>
              <th id="slectbill_ins">Paid Amount</th>
            </tr>
          </thead>
          <tbody>
            {Filterdata.length > 0 ?(
              Filterdata.map((leave, index) => (
                <tr key={index}>
                  <td>{leave.EmployeeId}</td>
                  <td>{leave.EmployeeName}</td>
                  <td>{leave.Designation}</td>
                  <td>{leave.RequestAmount}</td>
                  <td>{leave.InstallmentStatus}</td>
                  <td>{leave.PaidAmount || 0.00}</td>
                </tr>
              ))):(
                <tr>
                <td colSpan="4">No records found</td>
              </tr>
              )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdvanceRepaymentList;
