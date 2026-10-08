import React, { useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { format } from 'date-fns';
import SearchIcon from "@mui/icons-material/Search";
import { X } from '@mui/icons-material';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import './Attendance.css'
const theme = createTheme({
    components: {
        MuiDataGrid: {
            styleOverrides: {
                columnHeader: {
                    backgroundColor: "hsl(33, 100%, 50%)",
                },
                cell: {
                    borderTop: "0px !important",
                    borderBottom: "1px solid hsl(33, 100%, 50%) !important",
                },
            },
        },
    },
});

const AttendanceReport = () => {

    const [startDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1));
    const [endDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0));

    // Generate an array of dates for the given month
    const generateMonthDates = () => {
        const dates = [];
        for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
            dates.push(format(new Date(d), 'yyyy-MM-dd'));
            console.log("Generated Dates:", dates);
        }
        return dates;
        

    };

    const dates = generateMonthDates();

    // Generate columns dynamically based on the dates
    const columns = [
        { field: 'id', headerName: 'Employee ID', width: 180 },
        { field: 'firstName', headerName: 'Employee Name', width: 180 },
        ...dates.map((date, index) => ({
            field: `date${index + 1}`,
            headerName: format(new Date(date), 'yyyy-MM-dd'),
            width: 120,
            editable: true,
        })),
    ];

    const [rows] = useState([
        { id: 1, firstName: 'John', department: 'HR', ...dates.reduce((acc, date, index) => ({ ...acc, [`date${index + 1}`]: 'Present' }), {}) },
        { id: 2, firstName: 'Jane', department: 'Finance', ...dates.reduce((acc, date, index) => ({ ...acc, [`date${index + 1}`]: 'Absent' }), {}) },
        // Add more rows as needed
    ]);
    const [formData, setFormData] = useState({
        departments: '',
        month: '',
        employeeName: ''
    });

    // Function to handle changes in the form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSearchSubmit=()=>{

        console.log(formData);
    }
    return (
        <div >
            <div>

                <div className="appointment"> 
                    <div className="h_head">
                        <h3>Attendance Report</h3>
                    </div>

                    <div className="con_1 ">
                        <div className="inp_1">
                            <label htmlFor="input">Employee Name :</label>
                            <input
                                type="text"
                                id="date"
                                placeholder='Enter Employee Name'
                                name='employeeName'
                                onChange={handleChange}
                            />
                        </div>
                        <div className="inp_1">
                            <label htmlFor="input">Departments :</label>
                            <select name="departments" id="" onChange={handleChange}>
                                <option value="alldepartment"> All Department</option>
                                <option value="doctor">Doctor</option>
                                <option value="Nurse"> Nurse</option>
                                <option value="frontoffice">Front Office </option>
                            </select>
                        </div>

                        <div className="inp_1">
                            <label htmlFor="input">Month :</label>
                            <input
                                type="month"
                                id="date"
                                name='month'
                                onChange={handleChange}
                            />
                        </div>



                        <button className="btn_1" onClick={handleSearchSubmit}>
                            <SearchIcon />
                        </button>
                    </div>


                    <ThemeProvider theme={theme}>
                        <div className=" grid_12">
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                pageSize={100}
                                initialState={{
                                    pagination: {
                                        paginationModel: {
                                            pageSize: 10,
                                        },
                                    },
                                }}
                                pageSizeOptions={[10]}
                                hideFooterPagination
                                hideFooterSelectedRowCount
                                className=" data_grid"
                            />
           </div>
                    </ThemeProvider>
                </div>

            </div>
        </div>
    );
};

export default AttendanceReport;
