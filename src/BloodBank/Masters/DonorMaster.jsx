import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Button, MenuItem, Select, InputLabel, FormControl } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { TrashIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';

const DonorMaster = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

    const [donors, setDonors] = useState([]);
    const [bloodGroups, setBloodGroups] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        age: '',
        gender: '',
        BloodGroup_Id: '',
        contact_number: '',
        contact_number2:'',
        email: '',
        address: '',
        status: false,
    });

    useEffect(() => {
        fetchDonors();
        fetchBloodGroups();
    }, []);

    const fetchDonors = () => {
        axios.get(`${UrlLink}BloodBank/Donor/master/`)
            .then(res => setDonors(res.data))
            .catch(err => console.error('Error fetching donors', err));
    };

    const fetchBloodGroups = () => {
        axios.get(`${UrlLink}BloodBank/BloodGroup/list/`)  // Adjust if endpoint differs
            .then(res => setBloodGroups(res.data))
            .catch(err => console.error('Error fetching blood groups', err));
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const url = isEditing
            ? `${UrlLink}BloodBank/Donor/master/update/${editId}/`
            : `${UrlLink}BloodBank/Donor/master/`;

        const method = isEditing ? axios.put : axios.post;

        method(url, formData)
            .then(() => {
                fetchDonors();
                resetForm();
            })
            .catch(err => console.error('Error saving donor', err));
    };

    const handleEdit = (donor) => {
        setFormData({
            name: donor.name,
            age: donor.age,
            gender: donor.gender,
            BloodGroup_Id: donor.blood_group.BloodGroup_Id,
            contact_number: donor.contact_number,
            contact_number2:donor.contact_number2,
            email: donor.email,
            address: donor.address,
            status: donor.status,
        });
        setEditId(donor.DNR_ID);

        setIsEditing(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this donor?')) {
            axios.delete(`${UrlLink}BloodBank/Donor/master/delete/${id}/`)
                .then(() => fetchDonors())
                .catch(err => console.error('Error deleting donor', err));
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            age: '',
            gender: '',
            BloodGroup_Id: '',
            contact_number: '',
            contact_number2:'',
            email: '',
            address: '',
            status: false,
        });
        setEditId(null);
        setIsEditing(false);
    };

    const columns = [
        { key: 'name', name: 'Name' },
        { key: 'age', name: 'Age' },
        { key: 'gender', name: 'Gender' },
        { key: 'blood_group', name: 'Blood Group', renderCell: ({ row }) => row.blood_group?.BloodGroup_Name },
        
        { key: 'contact_number', name: 'Contact No' },
        { key: 'contact_number2', name: 'Contact No 2' },
        { key: 'email', name: 'Email' },
        { key: 'address', name: 'Address' },
        {
            key: 'status',
            name: 'status',
            renderCell: (params) => (
                <input type="checkbox" checked={params.row.status} readOnly />
            )
        },
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
                        onClick={() => handleDelete(params.row.DNR_ID)}
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
                <h3>Donor Master</h3>
                <br />
                <div className="RegisFormcon">
                    <div className="RegisForm_1">
                        <label>Name <span>:</span></label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} required />
                    </div>
                    <div className="RegisForm_1">
                        <label>Age <span>:</span></label>
                        <input type="number" name="age" value={formData.age} onChange={handleChange} />
                    </div>
                    <div className="RegisForm_1">
                        <label>Gender <span>:</span></label>
                        <select name="gender" value={formData.gender} onChange={handleChange}>
                            <option value="">Select</option>
                            <option value="Male">Male</option>
                            <option value="Female">Female</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div className="RegisForm_1">
    <label>Blood Group <span>:</span></label>
    <select
        name="BloodGroup_Id"
        value={formData.BloodGroup_Id}
        onChange={handleChange}
        required
    >
        <option value="" disabled>Select</option>
        {bloodGroups.map(group => (
            <option key={group.id} value={group.id}>
                {group.blood_type}
            </option>
        ))}
    </select>
</div>
<div className="RegisForm_1">
                        <label>RH Factor <span>:</span></label>
                        <select
        name="BloodGroup_Id"
        value={formData.BloodGroup_Id}
        onChange={handleChange}
        required
    >
        <option value="" disabled>Select</option>
        {bloodGroups.map(group => (
            <option key={group.id} value={group.id}>
                {group.rh_type}
            </option>
        ))}
    </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>Contact No <span>:</span></label>
                        <input type="text" name="contact_number" value={formData.contact_number} onChange={handleChange} />
                    </div>
                    <div className="RegisForm_1">
                        <label>Contact No 2 <span>:</span></label>
                        <input type="text" name="contact_number2" value={formData.contact_number2} onChange={handleChange} />
                    </div>
                    <div className="RegisForm_1">
                        <label>Email <span>:</span></label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} />
                    </div>
                    <br />
                    <br />
                    <div className="RegisForm_text">
                        <label>Address <span>:</span></label>
                        <textarea name="address" value={formData.address} onChange={handleChange} />
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <div className="RegisForm_1">
                        <label>Status <span>:</span></label>
                        <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} />
                    </div>
                    <br />
                    <br />
                    <div className="Main_container_Btn">
                        <button type="submit">{isEditing ? 'Update' : 'Save'}</button>
                        {isEditing && (
                            <button type="button" onClick={resetForm}>Cancel</button>
                        )}
                    </div>
                    <br />
                        <br />
                        <br />
                </div>
            </form>

            <ReactGrid columns={columns} RowData={donors} />
        </>
    );
};

export default DonorMaster;
