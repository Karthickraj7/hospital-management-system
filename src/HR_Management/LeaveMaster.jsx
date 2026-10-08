import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';

const LeaveMaster = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const [leaveData, setLeaveData] = useState([]);
    const [isEditing, setIsEditing] = useState(false); // Track if in edit mode
    const [editId, setEditId] = useState(null); // Track the leave ID being edited

    const [formData, setFormData] = useState({
        code: '',
        leave_type: '',
        short_name: '',
        // description: '',
        applicable_to: 'Both',
        leave_unit: 'Days',
        leave_unit_no_of: 1,
        carry_forward: 'NO',
        lop: 'NO',
        payable: 'NO',
        yearly_encashment: 'NO',
        // Per_year: '',
        // no_balance_check: 'NO',
        // leave_back_date: '',
        inactive: 'NO'
    });

    // Handle input changes, including handling for select and checkbox values
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? (checked ? 'YES' : 'NO') : value
        });
    };

    // Fetch leave data from the API
    const fetchLeaveData = () => {
        axios.get(`${UrlLink}HR_Management/leave-master/`)
            .then((response) => {
                setLeaveData(response.data); // Save fetched data in state
            })
            .catch((error) => {
                console.error('Error fetching leave data', error);
            });
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchLeaveData();
    }, []);

    // Handle form submission (create or update)
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing && editId) {
            // Update existing record (PUT request)
            axios.put(`${UrlLink}HR_Management/leave-master/update/${editId}/`, formData)
                .then((response) => {
                    console.log('Leave Master updated:', response.data);

                    // Reset form and exit edit mode
                    resetForm();
                    fetchLeaveData(); // Refresh the grid data after updating
                })
                .catch((error) => {
                    console.error('Error updating leave type', error);
                    alert('Error updating leave type');
                });
        } else {
            // Create new record (POST request)
            axios.post(`${UrlLink}HR_Management/leave-master/create/`, formData)
                .then((response) => {
                    console.log('Leave Master created:', response.data);

                    // Reset form after submission
                    resetForm();
                    fetchLeaveData(); // Refresh the grid data after creating a new record
                })
                .catch((error) => {
                    console.error('Error adding leave type', error);
                    alert('Error adding leave type');
                });
        }
    };

    // Reset form fields
    const resetForm = () => {
        setFormData({
            code: '',
            leave_type: '',
            short_name: '',
            // description: '',
            applicable_to: 'Both',
            leave_unit: 'Days',
            leave_unit_no_of: 1,
            carry_forward: 'NO',
            lop: 'NO',
            payable: 'NO',
            yearly_encashment: 'NO',
            // Per_year: '',
            // no_balance_check: 'NO',
            // leave_back_date: '',
            inactive: 'NO'
        });
        setIsEditing(false);
        setEditId(null);
    };

    // Handle editing
    const handleEdit = (leave) => {
        setFormData({
            code: leave.code,
            leave_type: leave.leave_type,
            short_name: leave.short_name,
            // description: leave.description,
            applicable_to: leave.applicable_to,
            leave_unit: leave.leave_unit,
            leave_unit_no_of: leave.leave_unit_no_of,
            carry_forward: leave.carry_forward,
            lop: leave.lop,
            payable: leave.payable,
            yearly_encashment: leave.yearly_encashment,
            // Per_year: leave.encashment_month,
            // no_balance_check: leave.no_balance_check,
            // leave_back_date: leave.leave_back_date,
            inactive: leave.inactive
        });
        setIsEditing(true);
        setEditId(leave.id);
    };

    // Define columns for ReactGrid, including the Edit button
    const columns = [
        { key: 'id', name: 'ID', frozen: true, width: 80 },
        { key: 'code', name: 'Code', filter: true, frozen: true },
        { key: 'leave_type', name: 'Leave Type', filter: true },
        { key: 'short_name', name: 'Short Name' },
        // { key: 'description', name: 'Description', filter: true },
        { key: 'applicable_to', name: 'Applicable To' },
        { key: 'leave_unit', name: 'Leave Unit' },
        { key: 'leave_unit_no_of', name: 'No. of Units' },
        { key: 'carry_forward', name: 'Carry Forward', filter: true },
        { key: 'lop', name: 'LOP' },
        { key: 'payable', name: 'Payable' },
        { key: 'yearly_encashment', name: 'Yearly Encashment' },
        // { key: 'Per_year', name: 'Per_year?' },
        // { key: 'no_balance_check', name: 'No Balance Check' },
        // { key: 'leave_back_date', name: 'Leave Back Date' },
        { key: 'inactive', name: 'Inactive' },
        {
            key: 'actions',
            name: 'Actions',
            renderCell: (params) => (
                <>
                    {
                        // Conditional check for any field if necessary
                        params.row.someField === 'SomeCondition' ?
                            (
                                <span>No Edit Access</span>
                            ) : (
                                <Button
                                    className="edit_btn"
                                    onClick={() => handleEdit(params.row)}
                                    startIcon={<EditIcon />}  // Adds the edit icon
                                    variant="contained"
                                    color="primary"
                                >
                                    Edit
                                </Button>
                            )
                    }
                </>
            ),
        },
    
    ];
    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className='RegisFormcon' style={{Margin:'12px',marginBottom:'12px'}}>
                    <div className="RegisForm_1">
                        <label>Leave Type<span>:</span></label>
                        <input type="text" name="leave_type" value={formData.leave_type} onChange={handleChange} required />
                    </div>
                    <div className="RegisForm_1">
                        <label>Short Name<span>:</span></label>
                        <input type="text" name="short_name"  value={formData.short_name} style={{ textTransform: 'uppercase' }} onChange={handleChange} required  />
                    </div>
                    {/* <div className="RegisForm_1">
                        <label>Description<span>:</span></label>
                        <input type="text" name="description" value={formData.description} onChange={handleChange} required />
                    </div> */}
                    <div className="RegisForm_1">
                        <label>Applicable To<span>:</span></label>
                        <select name="applicable_to" value={formData.applicable_to} onChange={handleChange}>
                            <option value="Both">Both</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                        </select>
                    </div>
                    <div className="RegisForm_1">
                        <label>Leave Unit<span>:</span></label>
                        <input type="number" name="leave_unit_no_of"  min = "1" max="365" step="1" value={formData.leave_unit_no_of} onChange={handleChange} required />
                        <select name="leave_unit" value={formData.leave_unit} onChange={handleChange}>
                            <option value="Days">Days</option>
                            <option value="Hours">Hours</option>
                            <option value="Months">Months</option>
                        </select>
                    </div>
                    <div className="RegisForm_1">
                        <label>Carry Forward<span>:</span></label>
                        <input type="checkbox" name="carry_forward" checked={formData.carry_forward === 'YES'} onChange={handleChange} />
                    </div>
                    <div className="RegisForm_1">
                        <label>Loss of Pay (LOP)<span>:</span></label>
                        <input type="checkbox" name="lop" checked={formData.lop === 'YES'} onChange={handleChange} />
                    </div>
                    <div className="RegisForm_1">
                        <label>Payable<span>:</span></label>
                        <input type="checkbox" name="payable" checked={formData.payable === 'YES'} onChange={handleChange} />
                    </div>
                    <div className="RegisForm_1">
                        <label>Yearly Encashment<span>:</span></label>
                        <input type="checkbox" name="yearly_encashment" checked={formData.yearly_encashment === 'YES'} onChange={handleChange} />
                    </div>
                    
                    <div className="RegisForm_1">
                        <label>Inactive<span>:</span></label>
                        <input type="checkbox" name="inactive" checked={formData.inactive === 'YES'} onChange={handleChange} />
                    </div>
                    <div className='Main_container_Btn'>
                        <button type="submit">{isEditing ? 'Update' : 'Save'}</button>
                        {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
                    </div>
                </div>
            </form>

            {/* Render grid with leave data */}
            <ReactGrid columns={columns} RowData={leaveData} />
        </>
    );
};

export default LeaveMaster;