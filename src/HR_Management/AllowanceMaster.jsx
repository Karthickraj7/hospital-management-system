import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';

const AllowanceMaster = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const [allowanceData, setAllowanceData] = useState([]);
    const [isEditing, setIsEditing] = useState(false); // Track if in edit mode
    const [editId, setEditId] = useState(null); // Track the allowance ID being edited

    const [formData, setFormData] = useState({
        allowance_name: '',
        allowance_type: '',
        value: 0,
        status: true
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
            
        });
    };

    // Fetch allowance data from the API
    const fetchAllowanceData = () => {
        axios.get(`${UrlLink}HR_Management/allowance-master/`)
            .then((response) => {
                setAllowanceData(response.data); // Save fetched data in state
            })
            .catch((error) => {
                console.error('Error fetching allowance data', error);
            });
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchAllowanceData();
    }, []);

    // Handle form submission (create or update)
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing && editId) {
            // Update existing record (PUT request)
            axios.put(`${UrlLink}HR_Management/allowance-master/update/${editId}/`, formData)
                .then((response) => {
                    console.log('Allowance Master updated:', response.data);

                    // Reset form and exit edit mode
                    resetForm();
                    fetchAllowanceData(); // Refresh the grid data after updating
                })
                .catch((error) => {
                    console.error('Error updating allowance type', error);
                    alert('Error updating allowance type');
                });
        } else {
            // Create new record (POST request)
            axios.post(`${UrlLink}HR_Management/allowance-master/create/`, formData)
                .then((response) => {
                    console.log('Allowance Master created:', response.data);

                    // Reset form after submission
                    resetForm();
                    fetchAllowanceData(); // Refresh the grid data after creating a new record
                })
                .catch((error) => {
                    console.error('Error adding allowance type', error);
                    alert('Error adding allowance type');
                });
        }
    };

    // Reset form fields
    const resetForm = () => {
        setFormData({
            allowance_name: '',
            allowance_type: 'Fixed',
            value: 0,
            status: true
        });
        setIsEditing(false);
        setEditId(null);
    };

    // Handle editing
    const handleEdit = (allowance) => {
        setFormData({
            allowance_name: allowance.allowance_name,
            allowance_type: allowance.allowance_type,
            value: allowance.value,
            status: allowance.status
        });
        setIsEditing(true);
        setEditId(allowance.id);
    };

    // Define columns for ReactGrid, including the Edit button
    const columns = [
        { key: 'id', name: 'ID', frozen: true, width: 80 },
        { key: 'allowance_name', name: 'Allowance Name', filter: true },
        { key: 'allowance_type', name: 'Allowance Type', filter: true },
        { key: 'value', name: 'Value' },
        {
            key: 'status',
            name: 'Status',
            renderCell: (params) => (params.row.status ? 'Active' : 'Inactive')
        },
        {
            key: 'actions',
            name: 'Actions',
            renderCell: (params) => (
                <Button
                    className="edit_btn"
                    onClick={() => handleEdit(params.row)}
                    startIcon={<EditIcon />}  // Adds the edit icon
                    variant="contained"
                    color="primary"
                >
                    Edit
                </Button>
            ),
        },
    ];

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className='RegisFormcon' style={{ margin: '12px', marginBottom: '12px' }}>
                    <div className="RegisForm_1">
                        <label>Allowance Name<span>:</span></label>
                        <input type="text" name="allowance_name" value={formData.allowance_name} onChange={handleChange} required />
                    </div>
                    <div className="RegisForm_1">
                        <label>Allowance Type<span>:</span></label>
                        <select name="allowance_type" value={formData.allowance_type} onChange={handleChange}>
                            <option value="Fixed">Fixed</option>
                            <option value="Percentage">Percentage</option>
                        </select>
                   
                    </div>
                    {formData.allowance_type == 'Percentage' && (
                         <div className="RegisForm_1">
                         <label>Value<span>:</span></label>
                         <input type="number" name="value" value={formData.value} onChange={handleChange} required />
                     </div>
                    )}    
                   
                    <div className="RegisForm_1">
                        <label>Status<span>:</span></label>
                        <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} />
                        <span>{formData.status ? 'Active' : 'Inactive'}</span>
                    </div>
                    <div className='Main_container_Btn'>
                        <button type="submit">{isEditing ? 'Update' : 'Save'}</button>
                        {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
                    </div>
                </div>
            </form>

            {/* Render grid with allowance data */}
            <ReactGrid columns={columns} RowData={allowanceData} />
        </>
    );
};

export default AllowanceMaster;
