import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { TrashIcon } from 'lucide-react';
import { useSelector } from 'react-redux';

const BagTypeMaster = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const [bagData, setBagData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        // code: '',
        Name: '',
        // components: 0
        expiry_date:''
    });

    const fetchBagData = () => {
        axios.get(`${UrlLink}BloodBank/bag-type/`)
            .then(res => setBagData(res.data))
            .catch(err => console.error('Error fetching bag types:', err));
    };

    useEffect(() => {
        fetchBagData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };  

    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing && editId) {
            axios.put(`${UrlLink}BloodBank/bag-type/update/${editId}/`, formData)
                .then(() => {
                    fetchBagData();
                    resetForm();
                })
                .catch(err => console.error('Update error:', err));
        } else {
            axios.post(`${UrlLink}BloodBank/bag-type/create/`, formData)
                .then(() => {
                    fetchBagData();
                    resetForm();
                })
                .catch(err => console.error('Create error:', err));
        }
    };

    const resetForm = () => {
        setFormData({ code: '', Name: '', expiry_date: '' });
        setIsEditing(false);
        setEditId(null);
    };

    const handleEdit = (bag) => {
        setFormData({
            // code: bag.code,
            Name: bag.Name,
            expiry_date:bag.expiry_date,
            // components: bag.components
        });
        setIsEditing(true);
        setEditId(bag.id);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this bag type?')) {
            axios.delete(`${UrlLink}BloodBank/bag-type/delete/${id}/`)
                .then(() => fetchBagData())
                .catch(err => console.error('Delete error:', err));
        }
    };

    const columns = [
        { key: 'code', name: 'code', frozen: true, width: 80 },

        { key: 'Name', name: 'Name' },
        { key: 'expiry_date', name: 'expiry_date' },
        // { key: 'components', name: 'No. of Components' },
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
                <h3>Bag Type Master</h3>
                <br />
                
                <div className='RegisFormcon'>
                
                    {/* <div className="RegisForm_1">
                        <label>Code:</label>
                        <input type="text" name="code" value={formData.code} onChange={handleChange} required />
                    </div> */}
                    <div className="RegisForm_1">
                        <label>Name:</label>
                        <input type="text" name="Name" value={formData.Name} onChange={handleChange} required />
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
                    {/* <div className="RegisForm_1">
                        <label>No. of Components:</label>
                        <input type="number" name="components" value={formData.components} onChange={handleChange} required />
                    </div> */}
                    <br />
                        <br />
                        <br />
                    <div className="Main_container_Btn">
                        <button type="submit">{isEditing ? 'Update' : 'Save'}</button>
                        {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
                    </div>
                    <br />
                        <br />
                        <br />
                </div>
            </form>

            <ReactGrid columns={columns} RowData={bagData} />
        </>
    );
};

export default BagTypeMaster;
