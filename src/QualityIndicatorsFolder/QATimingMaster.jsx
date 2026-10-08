import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import { useSelector } from 'react-redux';
import { Key } from 'lucide-react';
import { Button } from '@mui/material';
import { EditIcon } from 'lucide-react';
import { DeleteIcon } from 'lucide-react';

const QATimingMaster = () => {
    const [qatimingData, setQATimingData] = useState([]);
    // Correct formData to be an object
    const [formData, setFormData] = useState({
        id: null,
        department: '',
        process: '',
        average_time:0.0,
        status: true,
    });
    
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchQATiming();
    }, []);

    const fetchQATiming = async () => {
        const res = await axios.get(`${UrlLink}QualityIndicators/qatiming/`);
    
        setQATimingData(res.data);
        console.log(res.data,'res ponse data ');
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isEditing) {
            await axios.put(`${UrlLink}QualityIndicators/qatiming/edit/${formData.id}/`, formData);
        } else {
            await axios.post(`${UrlLink}QualityIndicators/qatiming/add/`, formData);
        }
        resetForm();
        fetchQATiming();
    };

    const handleEdit = (item) => {
        setFormData(item);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        await axios.delete(`${UrlLink}QualityIndicators/qatiming/delete/${id}/`);
        fetchQATiming();
    };

    const resetForm = () => {
        setFormData({
            id: null,
            department: '',
            process: '',
            average_time: 0.0,
            status: true
        });
        setIsEditing(false);
    };

    // Convert data into ReactGrid format
    const rows = qatimingData.map((item) => ({
        id: item.id,
        department: item.department,
        process: item.process,
        average_time: item.average_time,
        status: item.status ? 'Active' : 'Inactive',
    }));
    

    const columns = [
        {key :'id',name :'ID'},
        { key: 'department', name: 'Department' },
        { key: 'process', name: 'Process' },
        { key: 'average_time', name: 'Average Time' },
        { key: 'status', name: 'Status' },
        {
            key: 'Edit',
            name: 'Edit',
            renderCell: (params) => (
                <Button
                    className="edit_btn"
                    onClick={() => handleEdit(params.row)}
                    startIcon={<EditIcon />} 
                    variant="contained"
                    color="primary"
                >
                    Edit
                </Button>
            ),
        },
        {
            key: 'Delete',
            name: 'Delete',
            renderCell: (params) => (
                <Button
                    className="delete_btn"
                    onClick={() => handleDelete(params.row.id)}
                    startIcon={<DeleteIcon />}  
                    variant="contained"
                    color="secondary"
                >
                    Delete
                </Button>
            ),
        },
    ];
    

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <div className='RegisFormcon' style={{ margin: '12px', marginBottom: '12px' }}>
                    <div className="common_center_tag">
                        <span>QA Timing Master Registration</span>
                    </div>
                    <br /><br /><br />

                    <div className="RegisForm_1">
                        <label>Department<span>:</span></label>
                        <input
                            type="text"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="RegisForm_1">
                        <label>Process<span>:</span></label>
                        <input
                            type="text"
                            name="process"
                            value={formData.process}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="RegisForm_1">
                        <label>Average Time<span>:</span></label>
                        <input
                            type="number"
                            name="average_time"
                            placeholder="e.g., 00:30:00"
                            value={formData.average_time}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="RegisForm_1">
                        <label>Status<span>:</span></label>
                        <select name="status" value={formData.status} onChange={handleChange}>
                            <option value={true}>Active</option>
                            <option value={false}>Inactive</option>
                        </select>
                    </div>

                    <div className='Main_container_Btn'>
                        <button type="submit">{isEditing ? 'Update' : 'Save'}</button>
                        {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
                    </div>
                </div>
            </form>

            <ReactGrid RowData={rows} columns={columns} />
        </div>
    );
};

export default QATimingMaster;
