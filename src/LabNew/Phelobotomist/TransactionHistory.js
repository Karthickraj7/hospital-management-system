import * as React from 'react';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

import { orange } from '@mui/material/colors';
import "./TransactionHistory.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: orange,
    color: theme.palette.common.black,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));



function handleFilterClick() {
  // Logic to handle filtering based on the selected range
  // You can access the selected range using document.getElementById('selectRange').value
  const selectedRange = document.getElementById('selectRange').value;
  // Perform filtering operations based on the selected range
  // ...
}

export default function TransactionHistory() {
  return (
    <div className="appointment">
      <div className="h_head">
        <h4 >Test Data</h4>
      </div>
      <div className='RegisFormcon'>

        <div className="RegisForm_1">
          <label htmlFor="selectRange">Select Range<span>:</span></label>
          <input type="text" id="selectRange" name="selectRange" pattern="[A-Za-z ]+" title="Only letters and spaces are allowed"
            placeholder='Enter your Range' required />

          <button type="button" className="RegisterForm_1_btns" onClick={handleFilterClick}>Filter</button>
        </div>
      </div>
    
      <div className="Selected-table-container">
          <table className="selected-medicine-table2">
            <thead>
              <tr>
                <th>TESTRECID</th>
                <th>PatientName</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Address</th>
                <th>City</th>
                <th>State</th>
                <th>Phone</th>
                <th>Group</th>
                <th>RefDoctor</th>
                <th>Phlebotomist</th>
                <th>SchLab</th>
                <th>TestCount</th>
                <th>TestValue</th>
                <th>BillNo</th>
                <th>Option</th>
        
                </tr>
            </thead>
            <tbody>
                        {/* {selectedValues.map((values, index) => ( */}
                            <tr>

                                <td>data</td>
                                <td>data</td>
                                <td>data</td>
                                <td>data</td>
                                <td>data</td>
                                <td>data</td>
                                <td>data</td>
                                <td>data</td>
                                <td>data</td>
                                <td>data</td>
                                <td>data</td>
                                <td>data</td>
                                <td>data</td>
                                <td>data</td>
                                <td>data</td>
                                <td>data</td>
                              </tr>
                        {/* ))} */}
                    </tbody>
                 

          </table>
        </div>
            
    </div>
  );
}


