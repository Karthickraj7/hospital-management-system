import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { TrashIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';

const BloodGroupMaster = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const [groupData, setGroupData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        blood_type: '',
        rh_type: ''
    });

    const BLOOD_TYPES = ['A+', 'B+', 'AB+', 'O+','A-','B-','AB-','o-'];
    const RH_TYPES = ['+', '-'];

    const fetchGroupData = () => {
        axios.get(`${UrlLink}BloodBank/BloodGroup/list/`)
            .then(res => setGroupData(res.data))
            .catch(err => console.error('Error fetching blood groups:', err));
    };

    useEffect(() => {
        fetchGroupData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing && editId) {
            // Update request
            axios.put(`${UrlLink}BloodBank/BloodGroup/by/id/${editId}/`, formData)
                .then(() => {
                    fetchGroupData();
                    resetForm();
                })
                .catch(err => console.error('Update error:', err));
        } else {
            // Create request
            axios.post(`${UrlLink}BloodBank/BloodGroup/list/`, formData)
                .then(() => {
                    fetchGroupData();
                    resetForm();
                })
                .catch(err => console.error('Create error:', err));
        }
    };

    const resetForm = () => {
        setFormData({ blood_type: '', rh_type: '' });
        setIsEditing(false);
        setEditId(null);
    };

    const handleEdit = (group) => {
        setFormData({
            blood_type: group.blood_type,
            rh_type: group.rh_type
        });
        setIsEditing(true);
        setEditId(group.id);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this blood group?')) {
            // Delete request
            axios.delete(`${UrlLink}BloodBank/BloodGroup/delete/${id}/`)
                .then(() => fetchGroupData())
                .catch(err => console.error('Delete error:', err));
        }
    };

    const columns = [
        { key: 'blood_type', name: 'Blood Type' },
        { key: 'rh_type', name: 'Rh Type' },
        {
            key: 'actions',
            name: 'Actions',
            renderCell: (params) => (
                <>
                    <Button
                        onClick={() => handleEdit(params.row)}
                        startIcon={<EditIcon />}
                        variant="contained"
                        color="primary"
                    >
                        Edit
                    </Button>
                    <Button
                        onClick={() => handleDelete(params.row.id)}
                        startIcon={<TrashIcon />}
                        variant="contained"
                        color="secondary"
                        style={{ marginLeft: 8 }}
                    >
                        Delete
                    </Button>
                </>
            ),
        },
    ];

    return (
        <>
            <form className="Main_container_app" onSubmit={handleSubmit}>
                <h3>Blood Group Master</h3>
                <br />
                <div className="RegisFormcon">
                    <div className="RegisForm_1">
                        <label>Blood Type:</label>
                        <select
                            name="blood_type"
                            value={formData.blood_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Blood Type</option>
                            {BLOOD_TYPES.map((type) => (
                                <option key={type} value={type}>
                                    {type}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>Rh Type:</label>
                        <select
                            name="rh_type"
                            value={formData.rh_type}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Select Rh Type</option>
                            {RH_TYPES.map((rh) => (
                                <option key={rh} value={rh}>
                                    {rh === '+' ? 'Positive' : 'Negative'}
                                </option>
                            ))}
                        </select>
                    </div>
                    <br />
                    <br />
                    <br />
                    <div className="Main_container_Btn">
                        <button type="submit">{isEditing ? 'Update' : 'Save'}</button>
                        {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
                    </div>
                </div>
            </form>

            <ReactGrid columns={columns} RowData={groupData} />
        </>
    );
};

export default BloodGroupMaster;
