import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';

const DeductionMaster = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const [deductionData, setDeductionData] = useState([]);
    const [isEditing, setIsEditing] = useState(false); // Track if in edit mode
    const [editId, setEditId] = useState(null); // Track the deduction ID being edited

    const [formData, setFormData] = useState({
        deduction_name: '',
        deduction_type: 'Fixed',
        value: '',
        status: true,
    });

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    // Fetch deduction data from the API
    const fetchDeductionData = () => {
        axios.get(`${UrlLink}HR_Management/deduction-master/`)
            .then((response) => {
                setDeductionData(response.data); // Save fetched data in state
            })
            .catch((error) => {
                console.error('Error fetching deduction data', error);
            });
    };

    // Fetch data on component mount
    useEffect(() => {
        fetchDeductionData();
    }, []);

    // Handle form submission (create or update)
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing && editId) {
            // Update existing record (PUT request)
            axios.put(`${UrlLink}HR_Management/deduction-master/update/${editId}/`, formData)
                .then((response) => {
                    console.log('Deduction Master updated:', response.data);

                    // Reset form and exit edit mode
                    resetForm();
                    fetchDeductionData(); // Refresh the grid data after updating
                })
                .catch((error) => {
                    console.error('Error updating deduction', error);
                    alert('Error updating deduction');
                });
        } else {
            // Create new record (POST request)
            axios.post(`${UrlLink}HR_Management/deduction-master/create/`, formData)
                .then((response) => {
                    console.log('Deduction Master created:', response.data);

                    // Reset form after submission
                    resetForm();
                    fetchDeductionData(); // Refresh the grid data after creating a new record
                })
                .catch((error) => {
                    console.error('Error adding deduction', error);
                    alert('Error adding deduction');
                });
        }
    };

    // Reset form fields
    const resetForm = () => {
        setFormData({
            deduction_name: '',
            deduction_type: 'Fixed',
            value: '',
            status: true,
        });
        setIsEditing(false);
        setEditId(null);
    };

    // Handle editing
    const handleEdit = (deduction) => {
        setFormData({
            deduction_name: deduction.deduction_name,
            deduction_type: deduction.deduction_type,
            value: deduction.value,
            status: deduction.status,
        });
        setIsEditing(true);
        setEditId(deduction.id);
    };

    // Define columns for ReactGrid, including the Edit button
    const columns = [
        { key: 'id', name: 'ID', frozen: true, width: 80 },
        { key: 'deduction_name', name: 'Deduction Name', filter: true },
        { key: 'deduction_type', name: 'Deduction Type', filter: true },
        { key: 'value', name: 'Value' },
        {
            key: 'status',
            name: 'Status',
            renderCell: (params) => (params.row.status ? 'Active' : 'Inactive'),
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
                        <label>Deduction Name<span>:</span></label>
                        <input type="text" name="deduction_name" value={formData.deduction_name} onChange={handleChange} required />
                    </div>
                    <div className="RegisForm_1">
                        <label>Deduction Type<span>:</span></label>
                        <select name="deduction_type" value={formData.deduction_type} onChange={handleChange}>
                            <option value="Fixed">Fixed</option>
                            <option value="Percentage">Percentage</option>
                        </select>
                    </div>
                  
                        <div className="RegisForm_1">
                        <label>Value<span>:</span></label>
                        <input type="number" name="value" value={formData.value} onChange={handleChange} required />
                    </div>
           
                 
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

            {/* Render grid with deduction data */}
            <ReactGrid columns={columns} RowData={deductionData} />
        </>
    );
};

export default DeductionMaster;
