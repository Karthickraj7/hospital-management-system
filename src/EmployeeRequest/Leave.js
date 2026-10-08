import React, { useState, useEffect } from "react";
import "./Leave.css";
import axios from "axios";
import ModelContainer from "../OtherComponent/ModelContainer/ModelContainer";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
const EmployeeLeave = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const dispatchvalue = useDispatch();
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const navigate = useNavigate();
  const [leavecount, setLeaveCount] = useState([]);
  const [leaveget, setLeaveGet] = useState(false);
  const [leavelist,setleavelist] = useState([]);

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    leaveType: "",
    fromDate: "",
    toDate: "",
    designation: "",
    designationid: "",
    fromtime: "",
    totime: "",
    prDate: "",
    reason: "",
    locations: userRecord?.location || "",
    createdby: userRecord?.username || "",
    photo: null,
  });
  console.log("formData", formData);

  console.log(userRecord?.Employeeid);

  const [EmployeeRegisterData, setEmployeeRegisterData] = useState([]);

  console.log(EmployeeRegisterData,'EmployeeRegisterData');


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
    const fetchLeaveData = async () => {
      try {
        const employeeId = formData?.employeeId;

        const locationId = userRecord?.location;

        if (!employeeId || !locationId) {
          setLeaveCount([]); // Ensure fallback if essential data is missing
          return;
        }

        const response = await axios.get(
          `${UrlLink}HR_Management/Employee_Leave_Details`,
          {
            params: {
              location: locationId,
              EmployeeId: employeeId,
            },
          }
        );

        const data = response.data;

        if (data) {
          setLeaveCount(data);
        } else {
          setLeaveCount([]);
        }
      } catch (error) {
        console.error("Error fetching leave data:", error);
        setLeaveCount([]); // Optional: Handle fallback state on error
      }
    };

    fetchLeaveData();
  }, [formData?.employeeId, UrlLink, leaveget]); // Add UrlLink if it may change

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

    console.log("Changing:", name, value);

    // Handle leaveType changes and reset corresponding fields
    if (name === "leaveType") {
      console.log("Resetting due to leaveType change");
      setFormData((prevState) => ({
        ...prevState,
        leaveType: value,
        days: "", // Clear days
        fromDate: "", // Reset fromDate when leaveType is changed
        toDate: "", // Reset toDate
        prDate: "", // Reset prDate
        totime: "", // Reset totime
        fromtime: "", // Reset fromtime
        timeDifference: "", // Reset timeDifference
      }));
      return; // Early return to avoid further handling of leaveType
    }

    // Handle days change
    if (name === "days") {
      const days = parseInt(value, 10); // Convert input to an integer
      if (isNaN(days) || days < 1) {
        setFormData((prev) => ({ ...prev, days: "" }));
        return; // Return early if days is invalid
      }

      setFormData((prev) => ({
        ...prev,
        days,
        fromDate: days === 1 ? prev.fromDate : "", // If days == 1, keep fromDate; else clear it
        toDate: "", // Always clear toDate when days is updated
      }));
      return; // Early return after updating days
    }

    // Handle fromDate and toDate change
    if (name === "fromDate" || name === "toDate") {
      console.log("Updating date fields:", name, value);
      setFormData((prevState) => ({
        ...prevState,
        [name]: value, // Update specific date field
      }));
      return; // Early return after updating date fields
    }

    // Update other fields in formData
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleinpchangeDocumentsForm = (e) => {
    const { name, files } = e.target;

    // Ensure that files exist and are not empty
    if (files && files.length > 0) {
      let formattedValue = files[0];

      // Optional: Add validation for file type and size
      const allowedTypes = ["application/pdf", "image/jpeg", "image/png"]; // Example allowed types
      const maxSize = 5 * 1024 * 1024; // Example max size of 5MB
      console.log(formattedValue);
      console.log(formattedValue.type);
      if (
        !allowedTypes.includes(formattedValue.type) ||
        formattedValue.type === ""
      ) {
        // Dispatch a warning toast or handle file type validation
        const tdata = {
          message: "Invalid file type. Please upload a PDF, JPEG, or PNG file.",
          type: "warn",
        };
        dispatchvalue({ type: "toast", value: tdata });
      } else {
        if (formattedValue.size > maxSize) {
          // Dispatch a warning toast or handle file size validation
          const tdata = {
            message: "File size exceeds the limit of 5MB.",
            type: "warn",
          };
          dispatchvalue({ type: "toast", value: tdata });
        } else {
          const reader = new FileReader();
          reader.onload = () => {
            setFormData((prev) => ({
              ...prev,
              [name]: reader.result,
            }));
          };
          reader.readAsDataURL(formattedValue);
        }
      }
    } else {
      // Handle case where no file is selected
      const tdata = {
        message: "No file selected. Please choose a file to upload.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  const Selectedfileview = (fileval) => {
    console.log("fileval", fileval);
    if (fileval) {
      let tdata = {
        Isopen: false,
        content: null,
        type: "image/jpg",
      };
      if (
        ["data:image/jpeg;base64", "data:image/jpg;base64"].includes(
          fileval?.split(",")[0]
        )
      ) {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "image/jpeg",
        };
      } else if (fileval?.split(",")[0] === "data:image/png;base64") {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "image/png",
        };
      } else if (fileval?.split(",")[0] === "data:application/pdf;base64") {
        tdata = {
          Isopen: true,
          content: fileval,
          type: "application/pdf",
        };
      }

      dispatchvalue({ type: "modelcon", value: tdata });
    } else {
      const tdata = {
        message: "There is no file to view.",
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
    }
  };

  useEffect(() => {
    // Calculate days difference for leave dates
    if (formData?.fromDate && formData?.toDate) {
      const fromDate = new Date(formData?.fromDate);
      const toDate = new Date(formData?.toDate);

      if (toDate >= fromDate) {
        const daysDifference = Math.floor(
          (toDate - fromDate) / (1000 * 60 * 60 * 24) + 1 // Include both dates
        );

        setFormData((prevState) => ({
          ...prevState,
          days: daysDifference.toString(),
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          days: "0",
        }));
      }
    }

    // Calculate time difference for permission
    if (formData?.fromtime && formData?.totime) {
      const fromTime = new Date(`2022-01-01T${formData?.fromtime}`);
      const toTime = new Date(`2022-01-01T${formData?.totime}`);

      if (toTime > fromTime) {
        const timeDifference = (toTime - fromTime) / (1000 * 60 * 60); // Hours difference

        setFormData((prevState) => ({
          ...prevState,
          timeDifference: timeDifference.toFixed(2).toString(), // Format to 2 decimal places
        }));
      } else {
        setFormData((prevState) => ({
          ...prevState,
          timeDifference: "0", // Reset or handle invalid case
        }));
      }
    }
  }, [formData.fromDate, formData.toDate, formData.fromtime, formData.totime]);



  const clearData1 = () => {
    setFormData({
      employeeId: "",
      employeeName: "",
      leaveType: "",
      fromDate: "",
      toDate: "",
      designation: "",
      designationid: "",
      fromtime: "",
      totime: "",
      prDate: "",
      reason: "",
      locations: userRecord?.location || "",
      createdby: userRecord?.username || "",
      photo: null,
    });
  };
  const handleSubmit = () => {
 
  
    let isValid = true;
    let validationMessage = "";
    let data = null;
  
    // Validate based on leaveType
    // switch (formData.leaveType) {

    let leaveType = formData.leaveType.toLowerCase().includes("casual")
  ? "casual"
  : formData.leaveType.toLowerCase().includes("sick")
  ? "sick"
  : formData.leaveType.toLowerCase();
    switch (leaveType) {
      case "casual":

      case "sick":
        // Validate for casual/sick leave
        if (!formData.days || formData.days < 1) {
          isValid = false;
          validationMessage = "Please specify the number of days.";
        } else if (formData.days === 1) {
          // If days is 1, ensure fromDate and toDate are the same
          if (!formData.fromDate) {
            isValid = false;
            validationMessage = "For 1-day leave, From Date Must Provide";
          } else {
            data = { ...formData };
          }
        } else if (formData.days > 1) {
          // If days is greater than 1, ensure fromDate and toDate are provided
          if (!formData.fromDate || !formData.toDate) {
            isValid = false;
            validationMessage = "For multi-day leave, choose both From Date and To Date.";
          } 
          else {
            // Ensure the difference between fromDate and toDate is valid
            const fromDate = new Date(formData.fromDate);
            const toDate = new Date(formData.toDate);
            const dayDiff = (toDate - fromDate) / (1000 * 3600 * 24); // Calculate the day difference
  
            if (dayDiff < 1) {
              isValid = false;
              validationMessage = "To Date must be after From Date.";
            } else {
              data = { ...formData };
            }
          }
        }
        break;
  
      case "permission":
        // Validate for permission leave type
        if (!formData.fromtime || !formData.totime || !formData.prDate) {
          isValid = false;
          validationMessage = "Choose From Date, Time and To Time.";
        } else {
          data = { ...formData };
        }
        break;
  
      default:
        isValid = false;
        validationMessage = "Invalid leave type selected.";
    }
  
    // If validation fails, dispatch warning and exit
    if (!isValid) {
      const tdata = {
        message: validationMessage,
        type: "warn",
      };
      dispatchvalue({ type: "toast", value: tdata });
      return;
    }
  
    // Proceed with form submission if validation passes
    console.log("senddata", formData);
    axios
      .post(`${UrlLink}HR_Management/Insert_Leave_Register`, data)
      .then((response) => {
        console.log(response);
        const resres = response.data;
        let typp = Object.keys(resres)[0];
        let mess = Object.values(resres)[0];
        const tdata = {
          message: mess,
          type: typp,
        };
        setLeaveGet((prev) => !prev);

        dispatchvalue({ type: "toast", value: tdata });
        // clearData1();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleempchange = (e) => {

    const {name,value} = e.target;

    console.log(value,'premkumarrrrrrr');

    setFormData((prev)=>({
      ...prev,
      [name] : value
    }))

  }

  
  useEffect(() => {
    axios
      .get(`${UrlLink}HR_Management/leave-master`)
      .then((res) => {
        const ress = res.data;
        setleavelist(ress);

      })
      .catch((err) => {
        console.log(err);
      })
  }, [UrlLink])


  return (
    <div className="appointment">
      <div className="Selected-table-container">
        <table className="selected-medicine-table2">
          <thead>
            <tr>
              <th id="slectbill_ins">Leave Type</th>
              <th id="slectbill_ins">Total Leave</th>
              <th id="slectbill_ins">Availed Leaves</th>
              <th id="slectbill_ins">Remaining Leaves</th>
            </tr>
          </thead>
          <tbody>
            {leavecount.length > 0 ? (
              leavecount.map((leave, index) => (
                <tr key={index}>
                  <td>{leave.leavetype}</td>
                  <td>{leave.Totalleave}</td>
                  <td>{leave.AvailedLeave}</td>
                  <td>{leave.RemainingLeave}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" style={{ textAlign: "center" }}>
                  No leave data available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <br />
      <br />

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="employeeId">
            Employee ID <span>:</span>
          </label>
          <input
            type="text"
            id="employeeId"
            name="employeeId"
            value={formData.employeeId}
            onChange={handleempchange}
            list="employeelist"
          />

           <datalist id="employeelist">
                        {Array.isArray(EmployeeRegisterData) &&
                            EmployeeRegisterData.map((f, i) => (
                                <option key={i} value={f.Employeeid}>{f.Employeeid}</option>
                            ))}
            </datalist>
          
        </div>

        <div className="RegisForm_1">
          <label htmlFor="employeeName">
            Employee Name <span>:</span>
          </label>
          <input
            type="text"
            id="employeeName"
            name="employeeName"
            // onChange={handleChange}
            value={formData.employeeName}
            readOnly
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="designation">
            Designation <span>:</span>
          </label>
          <input
            type="text"
            // onChange={handleChange}
            value={formData.designation}
            readOnly
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="leaveType">
            Leave Type <span>:</span>
          </label>
          <select
            id="leaveType"
            name="leaveType"
            onChange={handleChange}
            required
          >
            <option value="select">Select</option>
          
              {Array.isArray(leavelist) &&
                leavelist.map((f, i) => (
                    <option key={i} value={f.leave_type}>{f.leave_type}</option>
                ))}
            
            <option value="permission">Permission</option>
          </select>
        </div>

        {(formData.leaveType.toLowerCase().includes("casual") || formData.leaveType.toLowerCase().includes("sick")) && (
          <>
            <div className="RegisForm_1">
              <label htmlFor="days">
                Days Count <span>:</span>
              </label>
              <input
                type="number"
                name="days"
                value={formData.days}
                min="1"
                onChange={handleChange}
              />
            </div>

            <div className="RegisForm_1">
              <label htmlFor="fromDate">
                From Date <span>:</span>
              </label>

              <input
                type="date"
                name="fromDate"
                min={formData.fromDate}
                value={formData.fromDate}
                onChange={handleChange}
                required
              />
            </div>

            {formData.days > 1 && (
              <div className="RegisForm_1">
                <label htmlFor="toDate">
                  To Date <span>:</span>
                </label>
                <input
                  type="date"
                  id="toDate"
                  min={formData.fromDate}
                  name="toDate"
                  onChange={handleChange}
                  required
                />
              </div>
            )}
          </>
        )}
          {formData.leaveType.toLowerCase().includes("sick") && formData.days >= 3 && (
          <>
            <div class="RegisForm_1 ">
              <label>
                Medical Certificate <span>:</span>
              </label>
              <div className="RegisterForm_2">
                <input
                  type="file"
                  id="photo"
                  name="photo"
                  className="hiden-nochse-file"
                  accept="image/jpeg, image/png,application/pdf"
                  onChange={(e) => handleinpchangeDocumentsForm(e)}
                  required
                />
                <label htmlFor="photo" className="RegisterForm_1_btns">
                  Choose File
                </label>
                <button
                  className="fileviewbtn"
                  onClick={() => Selectedfileview(formData.photo)}
                >
                  view
                </button>
              </div>
            </div>
          </>
        )}

        {formData.leaveType === "permission" && (
          <>
            <div className="RegisForm_1">
              <label htmlFor="prDate">
                Date <span>:</span>
              </label>
              <input
                type="date"
                id="prDate"
                name="prDate"
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label htmlFor="fromtime">
                From Time <span>:</span>
              </label>
              <input
                type="time"
                id="fromtime"
                name="fromtime"
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label htmlFor="totime">
                To Time <span>:</span>
              </label>
              <input
                type="time"
                id="totime"
                name="totime"
                onChange={handleChange}
                required
              />
            </div>
            <div className="RegisForm_1">
              <label htmlFor="timeDifference">
                Time Difference (hours) <span>:</span>
              </label>
              <input
                type="text"
                name="timeDifference"
                value={formData.timeDifference}
                readOnly
              />
            </div>
          </>
        )}

        <br />

        <div className="RegisForm_1">
          <label htmlFor="reason">
            Reason <span>:</span>
          </label>
          <textarea
            id="reason"
            name="reason"
            rows="4"
            cols="3"
            onChange={handleChange}
            required
          ></textarea>
        </div>
      </div>

      <br></br>
      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handleSubmit}>
          Submit123
        </button>
      </div>
      <ModelContainer />
      <ToastAlert Message={toast.message} Type={toast.type} />
    </div>
  );
};

export default EmployeeLeave;
