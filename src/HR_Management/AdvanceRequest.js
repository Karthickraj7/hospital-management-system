import React, { useEffect, useState } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";





const AdvanceRequest = () => {

  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
  const urllink = useSelector(state => state.userRecord?.UrlLink);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    role: '',
    reqdate: '',
    reqAmount: '',
    approved: '',
    approvedDate: '',
    approvedAmount: '',
    issuedDate: '',
    issued: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  }
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  }


  useEffect(() => {
    axios.get(`${urllink}HRmanagement/get_previousadvanceampunt`)
      .then((response) => {
        console.log(response.data)
      })
      .catch((error) => {
        console.error(error)
      })
  })

  return (
    <div>
      <div className='leaveform'>
        
      </div>
      <div>
        <div className="RegisFormcon">
          <div className='RegisForm_1'>
            <label htmlFor="employeeId" >Employee ID <span>:</span></label>
            <input
              type="text"
              id="employeeId"
              name="employeeId"
              placeholder="Enter Employee ID"
              onChange={handleChange} />
          </div>

          <div className='RegisForm_1'>
            <label htmlFor="employeeName" >Employee Name <span>:</span></label>
            <input type="text" id="employeeName" name="employeeName" placeholder="Enter Employee Name" onChange={handleChange} />
          </div>

          <div className='RegisForm_1'>
            <label htmlFor="role" >Role <span>:</span></label>
            <select id="role" name="role" onChange={handleChange}>
              <option value="">Select</option>
              <option value="doctor">Doctor</option>
              <option value="nurse">Nurse</option>
              <option value="frontoffice">Front Office</option>
            </select>
          </div>
        </div>
        <div className="RegisFormcon">
          <div className='RegisForm_1'>
            <label htmlFor="reqdate" >Request Date <span>:</span></label>
            <input type="date" id="reqdate" name="reqdate" placeholder="Enter Employee Name" onChange={handleChange} />
          </div>

          <div className='RegisForm_1'>
            <label htmlFor="reqAmount" >Request Amount <span>:</span></label>
            <input type="text" id="reqAmount" name="reqAmount" placeholder="Enter Amount" onChange={handleChange} />
          </div>

          <div className='RegisForm_1'>
            <label htmlFor="approved" >Approved By <span>:</span></label>
            <input type="text" id="approved" name="approved" placeholder="Enter Approver Name" onChange={handleChange} />
          </div>
        </div>
        <div className="RegisFormcon">
          <div className='RegisForm_1'>
            <label htmlFor="approvedDate " >Approved Date <span>:</span></label>
            <input type="date" id="approvedDate" name="approvedDate" placeholder="Enter Approver Name" onChange={handleChange} />
          </div>

          <div className='RegisForm_1'>
            <label htmlFor="approvedAmount" >Approved Amount <span>:</span></label>
            <input type="text" id="approvedAmount" name="approvedAmount" placeholder="Enter Amount" onChange={handleChange} />
          </div>

          <div className='RegisForm_1'>
            <label htmlFor="issuedDate" >Issued Date <span>:</span></label>
            <input type="date" id="issuedDate" name="issuedDate" placeholder="Enter Amount" onChange={handleChange} />
          </div>
        </div>
        <div className="RegisFormcon">
          <div className='RegisForm_1'>
            <label htmlFor="issued" >Issued By <span>:</span></label>
            <input type="text" id="issued" name="issued" placeholder="Enter Issuever Name" onChange={handleChange} />
          </div>
        </div>
      </div>
      <div className="Register_btn_con">
        <button onClick={handleSubmit} className="RegisterForm_1_btns">Submit</button>

      </div>
    </div>
  )
}

export default AdvanceRequest