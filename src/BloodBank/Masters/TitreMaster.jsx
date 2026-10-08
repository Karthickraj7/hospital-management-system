import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { TrashIcon } from 'lucide-react';
import { useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
const TitreMaster = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

    const [titreData, setTitreData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        description: '',
        order: 1,
        status: false,
    });

    useEffect(() => {
        fetchTitreData();
    }, []);

    const fetchTitreData = () => {
        axios.get(`${UrlLink}BloodBank/titre/`)
            .then(response => setTitreData(response.data))
            .catch(error => console.error('Error fetching titre data', error));
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
            ? `${UrlLink}BloodBank/titre/update/${editId}/`
            : `${UrlLink}BloodBank/titre/create/`;

        const method = isEditing ? axios.put : axios.post;

        method(url, formData)
            .then(() => {
                fetchTitreData();
                resetForm();
            })
            .catch(error => console.error('Error saving titre', error));
    };

    const handleEdit = (titre) => {
        setFormData({
            description: titre.description,
            order: titre.order,
            status: titre.status,
        });
        setEditId(titre.id);
        setIsEditing(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this titre?')) {
            axios.delete(`${UrlLink}BloodBank/titre/delete/${id}/`)
                .then(() => fetchTitreData())
                .catch(error => console.error('Error deleting titre', error));
        }
    };

    const resetForm = () => {
        setFormData({
            description: '',
            order: 1,
            status: false,
        });
        setIsEditing(false);
        setEditId(null);
    };

    const columns = [
        { key: 'description', name: 'Titre' },
        { key: 'order', name: 'Order' },
        {
            key: 'status',
            name: 'status',
            renderCell: (params) => (
                <input  type="checkbox" checked={params.row.status}  />
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
                <h3>Titre Master</h3>
                <br />
                <div className="RegisFormcon">
                    <div className="RegisForm_1">
                        <label>Description:</label>
                        <input
                            type="text"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="RegisForm_1">
                        <label>Order:</label>
                        <input
                            type="number"
                            name="order"
                            value={formData.order}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="RegisForm_1">
                        <label>Status :</label>
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
                    </div>  <br />
                        <br />
                        <br />
                </div>
            </form>

            <ReactGrid columns={columns} RowData={titreData} />
        </>
    );
};

export default TitreMaster;
