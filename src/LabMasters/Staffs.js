import React, { useState } from 'react';

function Staffs() {
  const [staffData, setStaffData] = useState({
    orgName: '',
    dateOfBirth: '',
    gender: '',
    department: '',
    role: '',
    orgEmail: '',
    orgPhone: '',
    orgAddress: '',
    orgPincode: '',
    referanceNumber: '',
    remarks: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStaffData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  return (
    <div className="appointment">
      <div className="h_head">
        <h4>Staffs</h4>
      </div>
      <br />
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="orgName">
            Employee Name<span>:</span>
          </label>
          <input
            type="text"
            id="orgName"
            name="orgName"
            placeholder="Enter Employee Name"
            required
            value={staffData.orgName}
            onChange={handleChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="dateOfBirth">
            Date of Birth<span>:</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            required
            value={staffData.dateOfBirth}
            onChange={handleChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="gender">
            Gender<span>:</span>
          </label>
          <select
            id="gender"
            name="gender"
            required
            value={staffData.gender}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="department">
            Department<span>:</span>
          </label>
          <select
            id="department"
            name="department"
            required
            value={staffData.department}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="lab_testing_details">Lab Testing Details</option>
            <option value="blood_test">Blood Test</option>
            <option value="radiology">Radiology</option>
            <option value="csf_analysis">C.S.F. Analysis</option>
          </select>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="role">
            Role<span>:</span>
          </label>
          <select
            id="role"
            name="role"
            required
            value={staffData.role}
            onChange={handleChange}
          >
            <option value="">Select</option>
            <option value="receptionist">Receptionist</option>
            <option value="lab_technician">Lab Technician</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="orgEmail">
            Email<span>:</span>
          </label>
          <input
            type="email"
            id="orgEmail"
            name="orgEmail"
            placeholder="Enter Email"
            required
            value={staffData.orgEmail}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="orgPhone">
            Phone Number<span>:</span>
          </label>
          <input
            type="tel"
            id="orgPhone"
            name="orgPhone"
            placeholder="Enter Phone Number"
            required
            value={staffData.orgPhone}
            onChange={handleChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="orgAddress">
            Address<span>:</span>
          </label>
          <textarea
            id="orgAddress"
            name="orgAddress"
            placeholder="Enter Address"
            required
            value={staffData.orgAddress}
            onChange={handleChange}
          ></textarea>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="orgPincode">
            PinCode<span>:</span>
          </label>
          <input
            type="text"
            id="orgPincode"
            name="orgPincode"
            placeholder="Enter Pincode"
            required
            value={staffData.orgPincode}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="referanceNumber">
            Reference Number<span>:</span>
          </label>
          <input
            type="number"
            id="referanceNumber"
            name="referanceNumber"
            placeholder="Enter Reference Number"
            required
            value={staffData.referanceNumber}
            onChange={handleChange}
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="remarks">
            Remarks<span>:</span>
          </label>
          <textarea
            id="remarks"
            name="remarks"
            placeholder="Enter Remarks"
            required
            value={staffData.remarks}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>

      <div className='Register_btn_con'>
        <button className='RegisterForm_1_btns'>Submit</button>
      </div>
    </div>
  );
}

export default Staffs;
