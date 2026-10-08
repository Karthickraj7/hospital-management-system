import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PerformanceAppraisal = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  // const [employeedata, setEmployeeData] = useState(null);
  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    date: "",
    performance: "",
    hike: "",
    amount: "",
    remarks: "",
    current: "",
    newpay: "",
    location: userRecord?.location,
    createdby: userRecord?.username,
  });
  console.log(formData);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    axios
      .post(
        `${UrlLink}HR_Management/insert_employee_performance`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((response) => {
        console.log("response", response);
        alert("Performance Updated Sucessfully");
      
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    const employeeId = formData.employeeId;
    // const hikepercentage = formData.hike;

    // Check if employeeId is available (not empty) before making the API request
    if (employeeId) {
      axios
        .get(
          `${UrlLink}HRmanagement/employee_performance?employeeid=${employeeId}&location=${userRecord?.location}`
        )
        .then((response) => {
          console.log(response.data);
          if (response.data.length === 0) {
            alert("Empoyee Not Found");
            setFormData((prevState) => ({
              ...prevState,
              employeeId: "",
              employeeName: "",
              current: "",
            }));
          } else {
            setFormData((prevState) => ({
              ...prevState,
              employeeId: response.data[0]?.employeeId || "",
              employeeName: response.data[0]?.employeeName || "",
              current: response.data[0]?.current || "",
            }));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("EmployeeId must be 9 characters in length");
    }
  }, [formData.employeeId, formData.hike, userRecord, UrlLink]);

  useEffect(() => {
    const employeeId = formData.employeeId;
    const hikepercentage = formData.hike;
    if (hikepercentage && hikepercentage.length >= 1) {
      axios
        .get(
          `${UrlLink}HRmanagement/employee_performanceamount?employeeid=${employeeId}&location=${userRecord?.location}&hikepercentage=${hikepercentage}`
        )
        .then((response) => {
          console.log(response.data);
          if (response.data.error) {
            alert(response.data.error);
            setFormData((prevState) => ({
              ...prevState,
              amount: "",
              newpay: "",
            }));
          } else {
            setFormData((prevState) => ({
              ...prevState,
              amount: response.data[0]?.amount || "",
              newpay: response.data[0]?.newpay || "",
            }));
          }
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      console.log("EmployeeId must be 9 characters in length");
    }
  }, [formData.employeeId, formData.hike, userRecord,UrlLink]);

  return (
    <div className="appointment">
      <div className="h_head">
        <h4>Performance Appraisal Form</h4>
      </div>
      <br />
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="employeeId">
            Employee ID <span>:</span>{" "}
          </label>
          <input
            type="text"
            id="employeeId"
            name="employeeId"
            onChange={handleChange}
          />
        </div>

        <div className="RegisForm_1">
          <label htmlFor="employeeName">
            Employee Name <span>:</span>{" "}
          </label>
          <input
            type="text"
            id="employeeName"
            name="employeeName"
            value={formData.employeeName}
            onChange={handleChange}
            readOnly
          />
        </div>


        <div className="RegisForm_1">
          <label htmlFor="date">
            Date <span>:</span>{" "}
          </label>
          <input type="date" id="date" name="date" onChange={handleChange} />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="current">
            Current Pay <span>:</span>
          </label>
          <input
            type="text"
            name="current"
            onChange={handleChange}
            value={formData.current}
          />
        </div>


        <div className="RegisForm_1">
          <label htmlFor="performance">
            Performance Rate <span>:</span>{" "}
          </label>
          <select id="performance" name="performance" onChange={handleChange}>
            {[...Array(11)].map((_, index) => (
              <option key={index} value={index}>
                {index}/10
              </option>
            ))}
          </select>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="hike">
            Hike Percentage <span>:</span>
          </label>
          <input
            type="text"
            name="hike"

            onChange={handleChange}
          />
        </div>


        <div className="RegisForm_1">
          <label htmlFor="amount">
            Hike Amount <span>:</span>
          </label>
          <input
            type="text"
            name="amount"

            value={formData.amount}
            onChange={handleChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="newpay">
            New Pay <span>:</span>
          </label>
          <input
            type="text"
            name="newpay"
            onChange={handleChange}
            value={formData.newpay}
          />
        </div>


        <div className="RegisForm_1">
          <label htmlFor="remarks">
            Remarks <span>:</span>
          </label>
          <textarea
            name="remarks"
            id="remarks"
            cols="15"
            rows="3"
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="approvedby">
            Approved By <span>:</span>{" "}
          </label>
          <input
            type="text"
            id="approvedby"
            name="approvedby"

            onChange={handleChange}
          />
        </div>
      </div>

      <div className="Register_btn_con">
        <button className="RegisterForm_1_btns" onClick={handleSubmit}>
          Save
        </button>
      </div>
    </div>
  );
};

export default PerformanceAppraisal;
