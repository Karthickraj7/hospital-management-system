import React, { useState } from 'react';



function Statistics() {

  const [selectedDate, setSelectedDate] = useState('');
  console.log('Selected Date:', selectedDate);

  return (
    <div className="appointment">
      <div className="h_head">
        <h4>
          Statistics-Filter</h4>
      </div>
      <br />
        <div className='RegisFormcon'>

          <div className="RegisForm_1">
            <label htmlFor="dateRange" >Select Range<span>:</span></label>

            <input type="date" id="startDate" name="startDate" required />
            <span className="date-separator">-</span>
            <input type="date" id="endDate" name="endDate" required />
          </div>

          <div className="RegisForm_1">
            <label htmlFor="selectReportType" >Select Statics Type<span>:</span></label>
            <select id="selectReportType" name="selectReportType" >
              <option value="">Select </option>
              <option value="patient">patient.</option>
              <option value="testentry">test entry.</option>
              <option value="sample">sample collection.</option>
            </select>
          </div>
        </div>
        <div className='Register_btn_con'>

          <button className="RegisterForm_1_btns">Generate</button>
        </div>
      
    </div>

  );
}

export default Statistics;
