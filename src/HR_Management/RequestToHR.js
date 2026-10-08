import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

function RequestToHR() {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const urllink = useSelector((state) => state.userRecord?.UrlLink);
  const [departmentAndRoleData, setDepartmentAndRoleData] = useState([]);

  console.log(userRecord);

  // const departments = departmentAndRoleData[0].rolename ? departmentAndRoleData[0].split(',') : [];

  const [requestInput, setrequestInput] = useState({
    employeeID: "",
    department: "",
    departmentManager: "",
    role: "",
    openings: "",
    endDate: "",
    qualification: "",
    experience: "",
    jobDescription: "",
  });

  console.log(requestInput);

  useEffect(() => {
    setrequestInput((prev) => ({
      ...prev,
      employeeID: userRecord?.EmployeeId,
      departmentManager: userRecord?.First_Name + " " + userRecord?.Last_Name,
    }));
  }, [userRecord]);

  useEffect(() => {
    axios
      .get(
        `${urllink}HRmanagement/departmentandrole_forrequesttoHR?role_id=${userRecord?.role_id}`
      )
      .then((response) => {
        console.log(response.data);
        setDepartmentAndRoleData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [userRecord?.role_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setrequestInput({ ...requestInput, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newdata = new FormData();

    // Loop over the keys and values of requestInput
    for (const key in requestInput) {
      if (Object.hasOwnProperty.call(requestInput, key)) {
        const value = requestInput[key];

        // Append key-value pair to FormData object
        newdata.append(key, value);
      }
    }

    newdata.append('CreatedBy',userRecord?.username)
    newdata.append('location',userRecord?.location)

    console.log("Form submitted:", requestInput);

    axios.post(`${urllink}HRmanagement/postJobrequest`,newdata)
    .then((response)=>{
      console.log(response.data)
    })
    .catch((error)=>{
      console.error(error)
    })

    // setrequestInput({
    //   ...requestInput,
    //   department: "",
    //   departmentManager: "",
    //   role: "",
    //   openings: "",
    //   endDate: "",
    //   qualification: "",
    //   experience: "",
    //   jobDescription: "",
    // });
  };

  return (
    <div className="appointment">
      <div className="h_head">
        <h4>Request to HR</h4>
      </div>
      <br />

      <form onSubmit={handleSubmit}>
        <div className="RegisFormcon">
          <div className="RegisForm_1">
            <label htmlFor="employeeID">
              Employee ID<span>:</span>
            </label>
            <input
              type="text"
              name="employeeID"
              id="employeeID"
              value={requestInput.employeeID}
              readOnly
            />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="department">
              Department<span>:</span>
            </label>
            <input
              list="departments"
              type="text"
              name="department"
              id="department"
              value={requestInput.department}
              onChange={handleChange}
            />
            <datalist id="departments">
              {departmentAndRoleData.map((item, index) => (
                <option key={index} value={item.department} />
              ))}
            </datalist>
          </div>
          <div className="RegisForm_1">
            <label htmlFor="departmentManager">
              Department Manager<span>:</span>
            </label>
            <input
              type="text"
              name="departmentManager"
              id="departmentManager"
              value={requestInput.departmentManager}
              onChange={handleChange}
            />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="role">
              Role<span>:</span>
            </label>
            <select
              name="role"
              id="role"
              value={requestInput.role}
              onChange={handleChange}
            >
              <option value="">Select</option>
              {departmentAndRoleData
                .filter((item) => item.department === requestInput.department)
                .map((item) =>
                  item.rolename.map((role, index) => (
                    <option key={index} value={role}>
                      {role}
                    </option>
                  ))
                )}
            </select>
          </div>
          <div className="RegisForm_1">
            <label htmlFor="openings">
              No. of Openings<span>:</span>
            </label>
            <input
              type="number"
              name="openings"
              id="openings"
              value={requestInput.openings}
              onChange={handleChange}
            />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="endDate">
              End Date<span>:</span>
            </label>
            <input
              type="date"
              name="endDate"
              id="endDate"
              value={requestInput.endDate}
              onChange={handleChange}
            />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="qualification">
              Qualification<span>:</span>
            </label>
            <input
              type="text"
              name="qualification"
              id="qualification"
              value={requestInput.qualification}
              onChange={handleChange}
            />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="experience">
              Experience<span>:</span>
            </label>
            <input
              type="text"
              name="experience"
              id="experience"
              value={requestInput.experience}
              onChange={handleChange}
            />
          </div>

          <div className="RegisForm_1">
            <label htmlFor="jobDescription">
              Job Description<span>:</span>
            </label>
            <textarea
              name="jobDescription"
              id="jobDescription"
              value={requestInput.jobDescription}
              onChange={handleChange}
            ></textarea>
          </div>
        </div>
        <br />
        <div className="Register_btn_con">
          <button
            className="RegisterForm_1_btns"
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

export default RequestToHR;
