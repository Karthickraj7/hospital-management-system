import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { TrashIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';

const BloodBankMaster = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

    const [bloodBankData, setBloodBankData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        name: '',
        code: '',
        address: '',
        contact_number: '',
        email: '',
        Liscence_no: '',
        expiry_date: '',
        Renewal_date: '',
        order: 1,
        status: false,
    });
    

    useEffect(() => {
        fetchBloodBankData();
    }, []);

    const fetchBloodBankData = () => {
        axios.get(`${UrlLink}BloodBank/BloodBankMaster/`)

            .then(response => setBloodBankData(response.data))
            .catch(error => console.error('Error fetching blood bank data', error));
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
    ? `${UrlLink}BloodBank/BloodBankMaster/update/${editId}/`
    : `${UrlLink}BloodBank/BloodBankMaster/`;


        const method = isEditing ? axios.put : axios.post;

        method(url, formData)
            .then(() => {
                fetchBloodBankData();
                resetForm();
            })
            .catch(error => console.error('Error saving blood bank', error));
    };

    const handleEdit = (bank) => {
        setFormData({
            name: bank.name,
            code: bank.code,
            address: bank.address,
            contact_number: bank.contact_number,
            email: bank.email,
            Liscence_no: bank.Liscence_no,
            expiry_date: bank.expiry_date,
            Renewal_date: bank.Renewal_date,
            order: bank.order,
            status: bank.status,
        });
        setEditId(bank.id);
        setIsEditing(true);
    };
    
    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this entry?')) {
            axios.delete(`${UrlLink}BloodBank/BloodBankMaster/delete/${id}/`)

                .then(() => fetchBloodBankData())
                .catch(error => console.error('Error deleting entry', error));
        }
    };

    const resetForm = () => {
        setFormData({
            name: '',
            code: '',
            address: '',
            contact_number: '',
            email: '',
            Liscence_no: '',
            expiry_date: '',
            Renewal_date: '',
            order: 1,
            status: false,
        });
        setIsEditing(false);
        setEditId(null);
    };
    

    const columns = [
        { key: 'name', name: 'Name' },
        { key: 'address', name: 'Address' },
        { key: 'contact_number', name: 'Contact Number' },
        { key: 'email', name: 'Email' },
        { key: 'Liscence_no', name: 'Liscence_no' },
        // { key: 'order', name: 'Order' },
        { key: 'expiry_date', name: 'expiry_date' },
        { key: 'Renewal_date', name: 'Renewal_date' },
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
        }
    ];

    return (
        <>
            <form className="Main_container_app" onSubmit={handleSubmit}>
                <h3>Blood Bank Master</h3>
                <br />
                <div className="RegisFormcon">
                    <div className="RegisForm_1">
                        <label>Name:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    
                    <div className="RegisForm_1">
                        <label>Contact No:</label>
                        <input
                            type="text"
                            name="contact_number"
                            value={formData.contact_number}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="RegisForm_1">
                        <label>Email:</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                        />
                    </div>
                  
<div className="RegisForm_1">
    <label>License No:</label>
    <input
        type="text"
        name="Liscence_no"
        value={formData.Liscence_no}
        onChange={handleChange}
        required
    />
</div>
<div className="RegisForm_1">
    <label>Expiry Date:</label>
    <input
        type="date"
        name="expiry_date"
        value={formData.expiry_date}
        onChange={handleChange}
        required
    />
</div>
<div className="RegisForm_1">
    <label>Renewal Date:</label>
    <input
        type="date"
        name="Renewal_date"
        value={formData.Renewal_date}
        onChange={handleChange}
        required
    />
</div>

<div className="RegisForm_text">
                        <label>Address <span>:</span></label>
                        <textarea
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                        />
                    </div>
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                    <br />
                                   {/* <div className="RegisForm_1">
                        <label>Order:</label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                        />
                    </div> */}
                    <div className="RegisForm_1">
                        <label>status:</label>
                        <input
                            type="checkbox"
                            name="status"
                            checked={formData.status}
                            onChange={handleChange}
                        />
                    </div>
                    <br />
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

            <ReactGrid columns={columns} RowData={bloodBankData} />
        </>
    );
};

export default BloodBankMaster;
