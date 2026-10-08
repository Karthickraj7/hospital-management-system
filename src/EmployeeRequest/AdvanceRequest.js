import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";

const AdvanceRequest = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const navigate = useNavigate();
  const dispatchvalue = useDispatch();
  console.log("userRecord :", userRecord);
  const [openModal, setOpenModal] = useState(false);
  const toast = useSelector((state) => state.userRecord?.toast);
  const [advancedetails, setadvancedetails] = useState([]);
  const [page, setPage] = useState(0);
  const pageSize = 5;
  const [advanceamountdata, setadvanceamountdata] = useState([]);
  console.log("advanceamountdata",advanceamountdata);
  const [advanceget, setAdvanceget] = useState(false);

   const totalPages = Math.ceil(advanceamountdata.length / pageSize);

  // const paginatedData = advanceamountdata.slice(
  //   page * pageSize,
  //   (page + 1) * pageSize
  // );

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    designation: "",
    reqdate: "",
    designationid: "",
    reqAmount: "",
    reason: "",
    location: userRecord?.location || "",
    createdby: userRecord?.username || "",
  });

   const [EmployeeRegisterData, setEmployeeRegisterData] = useState([]);
   useEffect(() => {
    axios
      .get(`${UrlLink}HR_Management/HOD_MappedEmployee_Details?hodid=${userRecord?.Employeeid}`) 
      .then((res) => {
        const ress = res.data;
        console.log(ress, 'ress');
        setEmployeeRegisterData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  
    // Resetting EmployeeListId value
    dispatchvalue({ type: 'EmployeeListId', value: {} });
  }, [UrlLink]);


          useEffect(() => {
             const employeeId = formData?.employeeId;
             if (employeeId) {
               // Making API request to get employee details
               axios
                 .get(
                   `${UrlLink}HR_Management/Employee_Details?employeeid=${employeeId}`
                 )
                 .then((response) => {
                   const res = response.data[0]; // Accessing the first object in the array
                   console.log("Employee details:", res);
         
                   if (res) {
                     setFormData((prevData) => ({
                       ...prevData, // Spread the previous data
                       employeeName: res?.Employeename || "", // Accessing the employee name
                       designation: res?.designation || "", // Accessing the designation
                       designationid: res?.Designationid || "", // Accessing the designation id
                       employeeId: res?.Employeeid || "", // Using the current user employee ID
                       locations: userRecord?.location || "", // Using the current user location ID
                       createdby: userRecord?.username || "", // Using the current user created_by
                     }));
                   }
                   //  else {
                   //   const tdata = {
                   //     message: "EmployeeName and designation not found.",
                   //     type: "warn",
                   //   };
                   //   dispatchvalue({ type: "toast", value: tdata });
                   // }
                 })
                 .catch((error) => {
                   console.error("Error fetching employee details", error);
                 });
             } else {
               console.log("EmployeeId is missing");
             }
           }, [formData?.employeeId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // useEffect(() => {
  //   const employeeId = userRecord?.Employeeid;

  //   // Check if employeeId is available (not empty) before making the API request
  //   if (employeeId) {
  //     axios
  //       .get(
  //         `${UrlLink}HR_Management/Employee_Details?employeeid=${employeeId}`
  //       )
  //       .then((response) => {
  //         console.log("employeedetails", response.data);
  //         const res = response.data[0];
  //         if (res) {
  //           setFormData((prevData) => ({
  //             ...prevData,
  //             employeeName: res?.Employeename || "",
  //             designation: res?.designation || "",
  //             designationid: res?.Designationid || "",
  //             employeeId: userRecord?.Employeeid || "",
  //             locations: userRecord?.location || "",
  //             createdby: userRecord?.username || "",
  //           }));
  //         } else {
  //           const tdata = {
  //             message: "EmployeeName and designation not found.",
  //             type: "warn",
  //           };
  //           dispatchvalue({ type: "toast", value: tdata });
  //         }
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //       });
  //   } else {
  //     console.log("EmployeeId is missing");
  //   }
  // }, [userRecord?.Employeeid, UrlLink]);


  const handleSubmit = (e) => {
    if (formData.reqdate !== "" && formData.reqAmount !== "") {
      axios
        .post(
          `${UrlLink}HR_Management/Insert_AdvanceRequest_Register`,
          formData
        )
        .then((response) => {
          const resres = response.data;
          let typp = Object.keys(resres)[0];
          let mess = Object.values(resres)[0];
          const tdata = {
            message: mess,
            type: typp,
          };
          setAdvanceget((prev) => !prev);
          dispatchvalue({ type: "toast", value: tdata });
          setFormData({
            employeeId: userRecord?.Employeeid || "",
            employeeName: "",
            designation: "",
            reqdate: "",
            designationid: "",
            reqAmount: "",
            reason: "",  // Make sure the reason is reset to an empty string
            location: userRecord?.location || "",
            createdby: userRecord?.username || "",
          });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      const tdata = {
        message: "RequestDate and RequestAmount Fill.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  useEffect(() => {
    // Check if userRecord and Employeeid are available
    if (userRecord?.Employeeid) {
      axios
        .get(`${UrlLink}HR_Management/Employee_PrevAdvance_Details?employeeId=${userRecord.Employeeid}&&locationId=${userRecord?.location}`)
        .then((response) => {
          console.log("Response data:", response.data);
          // Ensure the response is valid before setting state
          if (response.data) {
            setadvanceamountdata(response.data);
          } else {
            // Handle case where there is no data in response
            setadvanceamountdata([]);
          }
        })
        .catch((error) => {
          console.log("Error fetching advance amount data:", error);
          // Optionally, you could handle the error state here, like setting an error message
        });
    } else {
      // In case Employeeid is not available, set an empty array to avoid errors
      setadvanceamountdata([]);
    }
  }, [userRecord?.Employeeid, UrlLink]); // Dependency array ensures effect runs when Employeeid or UrlLink changes
  



  const handleVisibilityClick = (params) => {
    console.log(params);
    setOpenModal(true);
    axios
      .get(
        `${UrlLink}HRmanagement/get_advancedetails_for_employee?employeeid=${params?.EmployeeID}`
      )
      .then((res) => {
        console.log(res);
        setadvancedetails(res.data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <div className="appointment">
      <div className="common_center_tag">
        <span>Prev Advance Details</span>
      </div>
      <div className="Selected-table-container">
  <table className="selected-medicine-table2">
    <thead>
      <tr>
        <th id="slectbill_ins">Request Date</th>
        <th id="slectbill_ins">Advance Amount</th>
        <th id="slectbill_ins">Status</th>
        <th id="slectbill_ins">View Installment Status</th>
      </tr>
    </thead>
    <tbody>
      {advanceamountdata.length > 0 ? (
        advanceamountdata.map((leave, index) => (
          <tr key={index}>
            <td>{leave.RequestDate}</td>
            <td>{leave.RequestAmount}</td>
            <td>{leave.Status}</td>
            <td>
              {leave.Status === "Approved" ? (
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={() => handleVisibilityClick(leave)}
                  startIcon={<VisibilityIcon />}
                >
                  View
                </Button>
              ) : (
                "None"
              )}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="4" style={{ textAlign: "center" }}>
            No Advance Requests Available
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

      {totalPages > 1 && (
        <div className="grid_foot">
          <button
            onClick={() => setPage((prevPage) => Math.max(prevPage - 1, 0))}
            disabled={page === 0}
          >
            Previous
          </button>
          Page {page + 1} of {totalPages}
          <button
            onClick={() =>
              setPage((prevPage) => Math.min(prevPage + 1, totalPages - 1))
            }
            disabled={page === totalPages - 1}
          >
            Next
          </button>
        </div>
      )}
      <br />
      <div className="Add_items_Purchase_Master">
        <span> Advance Request Form</span>
      </div>
      <br />
      <div className="RegisFormcon ">
        <div className="RegisForm_1 ">
          <label htmlFor="employeeId">
            Employee ID <span>:</span>
          </label>
          <input
            type="text"
            id="employeeId"
            name="employeeId"
            onChange={handleChange}
            value={formData.employeeId}
            list="employeelist"
          />

            <datalist id="employeelist">
                {Array.isArray(EmployeeRegisterData) &&
                    EmployeeRegisterData.map((f, i) => (
                        <option key={i} value={f.Employeeid}>{f.Employeeid}</option>
                    ))}
            </datalist>
        </div>
        <div className="RegisForm_1 ">
          <label htmlFor="employeeName">
            Employee Name <span>:</span>
          </label>
          <input
            type="text"
            id="employeeName"
            name="employeeName"
            onChange={handleChange}
            value={formData.employeeName}
          />
        </div>

        <div className="RegisForm_1 ">
          <label htmlFor="designation">
            Designation <span>:</span>
          </label>
          <input type="text" name="designation" value={formData.designation} />
        </div>

        <div className="RegisForm_1 ">
          <label htmlFor="reqdate">
            Request Date <span>:</span>
          </label>
          <input
            type="date"
            id="reqdate"
            name="reqdate"
            value={formData.reqdate}
            onChange={handleChange}
          />
        </div>

        <div className="RegisForm_1 ">
          <label htmlFor="reqAmount">
            Request Amount <span>:</span>
          </label>
          <input
            type="number" // Use number type for better UX
            id="reqAmount"
            name="reqAmount"
            min="0" // Restricts negative values
            placeholder="Enter amount"
            value={formData.reqAmount}
            onKeyDown={(e) =>
              ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
            }
            onChange={handleChange}
          />
        </div>

        <div className="RegisForm_1 ">
          <label htmlFor="reason">
            Reason <span>:</span>
          </label>
          <textarea
            type="text"
            id="reason"
            name="reason"
            value={formData.reason}
            onChange={handleChange}
          />
        </div>
      </div>

      <br></br>
      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handleSubmit}>
          Submit123
        </button>
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
                    {advancedetails?.map((employee, index) => (
                      <tr key={index}>
                        <td>{employee.RequestAmount}</td>
                        <td>{employee.IssuedDate}</td>
                        <td>{employee.RepaymentDue}</td>
                        <td>{employee.AmountDeductPerMonth}</td>
                        <td>{employee.No_of_MonthPaid}</td>
                        <td>{employee.Installment_Status}</td>
                      </tr>
                    ))}
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

      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
};

export default AdvanceRequest;
