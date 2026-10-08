import React from 'react';
import './Organization.css';

function Physician() {
  return (
    <div className="appointment">
      <div className="h_head">
        <h4 >Physician</h4>
      </div>
      <br></br>
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="orgName" >
            Physician Name<span>:</span>
          </label>
          <input
            type="text"
            id="orgName"
            name="orgName"
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            placeholder="Enter Physician Name"
            required
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="dateOfBirth" >
            Date of Birth<span>:</span>
          </label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            required
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="gender" >
            Gender<span>:</span>
          </label>
          <select
            id="gender"
            name="gender"
            required
          >
            <option value="">Select </option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

      </div>

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="qualification" >
            Qualification<span>:</span>
          </label>
          <input
            type="text"
            id="qualification"
            name="qualification"
            placeholder="Enter Qualification"
            required
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="mcNumber" >
            MC Number<span>:</span>
          </label>
          <input
            type="text"
            id="mcNumber"
            name="mcNumber"
            placeholder="Enter MC Number"
            required
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="consultantCode" >
            Consultant Code<span>:</span>
          </label>
          <input
            type="text"
            id="consultantCode"
            name="consultantCode"
            placeholder="Enter Consultant Code"
            required
          />
        </div>

      </div>

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="consultantType" >
            Consultant Type<span>:</span>
          </label>
          <select
            id="consultantType"
            name="consultantType"
            required
          >
            <option value="">Select </option>
            <option value="general">General</option>
            <option value="specialist">Specialist</option>

          </select>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="department" >
            Department<span>:</span>
          </label>
          <select
            id="department"
            name="department"
            required
          >
            <option value="">Select </option>
            <option value="general">General</option>
            <option value="cardiology">Cardiology</option>
            <option value="orthopedics">Orthopedics</option>

          </select>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="email" >
            Email<span>:</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter Email"
            required
          />
        </div>



      </div>

      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="remarksNumber" >
            Phone Number<span>:</span>
          </label>
          <input
            type="number"
            id="phoneNumber"
            name="phoneNumber"
            placeholder="Enter Phone Number"
            required
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="orgAddress" >
            Address<span>:</span>
          </label>
          <textarea
            id="orgAddress"
            name="orgAddress"
            pattern="[A-Za-z ]+"
            title="Only letters and spaces are allowed"
            placeholder="Enter Address"
            required
          ></textarea>
        </div>
        <div className="RegisForm_1">
          <label htmlFor="orgPincode" >
            PinCode<span>:</span>
          </label>
          <input
            type="text"
            id="orgPincode"
            name="orgPincode"
            pattern="[0-9]+"
            title="Only numbers are allowed"
            placeholder="Enter Pincode"
            required
          />
        </div>
        {/* <div className="RegisForm_1">
    <label htmlFor="remarks" >
      Remarks<span>:</span>
    </label>
    <textarea
      id="remarks"
      name="remarks"
      className="org-textarea-remarks"
      placeholder="Enter Remarks"
      required
    ></textarea>
  </div> */}

      </div>
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label>
            Signature <span>:</span>
          </label>
          <div className="RegisterForm_2">
            <input
              type="file"
              id="CapturedFile123"
              name="CapturedFile123"
              accept="image/*,.pdf"
              className="hiden-nochse-file"
              required
            />
            <label
              htmlFor="CapturedFile123"
              className="RegisterForm_1_btns"
            >
              Choose File
            </label>
          </div>
        </div>

        <div className="RegisForm_1">
          <label htmlFor="referenceNumber" >
            Reference Number<span>:</span>
          </label>
          <input
            type="text"
            id="referenceNumber"
            name="referenceNumber"
            placeholder="Enter Reference Number"
            required
          />
        </div>


      </div>
      <div className="RegisFormcon">
        <div className="RegisForm_1">
          <label htmlFor="loginPassword" >
            Login Password<span>:</span>
          </label>
          <input
            type="password"
            id="loginPassword"
            name="loginPassword"
            placeholder="Enter Login Password"
            defaultValue="123456"
            required
          />
        </div>
        <div className="RegisForm_1">
          <label htmlFor="remarks" >
            Remarks<span>:</span>
          </label>
          <textarea
            id="remarks"
            name="remarks"
            placeholder="Enter Remarks"
            required
          ></textarea>
        </div>


      </div>
      <div className='Register_btn_con'>

        <button className='RegisterForm_1_btns'>Submit</button>
      </div>
    </div>
  );
}

export default Physician;

