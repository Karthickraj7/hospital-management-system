import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';

const DepartmentLocationMaster = () => {

    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

    const [departmentData, setDepartmentData] = useState([]);
    const [locationList, setLocationList] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState({
        Store_Name: '',
        Store_Type: '',
        Location_Name: '',
        IsPointOfSale: false,
        Status: true,
        created_by: 'admin'
    });

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    // Fetch Department Locations
    const fetchDepartmentData = () => {
        axios.get(`${UrlLink}Inventory/department-location/`)
            .then(res => setDepartmentData(res.data))
            .catch(err => console.error(err));
    };

    // Fetch Locations (FK dropdown)
   const fetchLocations = () => {
    axios.get(`${UrlLink}Masters/Location_Detials_link`)
        .then((res) => {
            setLocationList(res.data);
        })
        .catch((err) => {
            console.error('Error fetching locations', err);
        });
};


    useEffect(() => {
        fetchDepartmentData();
        fetchLocations();
    }, []);

    // Submit (Create / Update)
    const handleSubmit = (e) => {
        e.preventDefault();

        if (isEditing) {
            axios.put(
                `${UrlLink}Inventory/department-location/update/${editId}/`,
                formData
            ).then(() => {
                resetForm();
                fetchDepartmentData();
            });
        } else {
            axios.post(
                `${UrlLink}Inventory/department-location/create/`,
                formData
            ).then(() => {
                resetForm();
                fetchDepartmentData();
            });
        }
    };

    // Reset form
    const resetForm = () => {
        setFormData({
            Store_Name: '',
            Store_Type: '',
            Location_Name: '',
            IsPointOfSale: false,
            Status: true,
            created_by: 'admin'
        });
        setIsEditing(false);
        setEditId(null);
    };

    // Edit handler
 const handleEdit = (row) => {
    setFormData({
        Store_Name: row.Store_Name,
        Store_Type: row.Store_Type,
        Location_Name: row.Location_Name_id || row.Location_Name,
        IsPointOfSale: row.IsPointOfSale,
        Status: row.Status,
        created_by: row.created_by
    });
    setEditId(row.Store_Id);
    setIsEditing(true);
};


    // Grid columns
    const columns = [
        { key: 'Store_Id', name: 'ID', frozen: true, width: 80 },
        { key: 'Store_Name', name: 'Store Name', filter: true },
        { key: 'Store_Type', name: 'Store Type', filter: true },
{ key: 'Location_Name_name', name: 'Location', filter: true },
        {
            key: 'IsPointOfSale',
            name: 'POS',
            renderCell: (p) => (p.row.IsPointOfSale ? 'Yes' : 'No')
        },
        {
            key: 'Status',
            name: 'Status',
            renderCell: (p) => (p.row.Status ? 'Active' : 'Inactive')
        },
        {
            key: 'actions',
            name: 'Actions',
            renderCell: (params) => (
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    onClick={() => handleEdit(params.row)}
                >
                    Edit
                </Button>
            )
        }
    ];

    return (
        <>
            {/* FORM */}
            <form onSubmit={handleSubmit}>
                <div className="RegisFormcon" style={{ margin: '12px' }}>

                    <div className="RegisForm_1">
                        <label>Store Name<span>:</span></label>
                        <input
                            type="text"
                            name="Store_Name"
                            value={formData.Store_Name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="RegisForm_1">
                        <label>Store Type<span>:</span></label>
                        <input
                            type="text"
                            name="Store_Type"
                            value={formData.Store_Type}
                            onChange={handleChange}
                            required
                        />
                    </div>

        <div className="RegisForm_1">
    <label>Location<span>:</span></label>
    <select
        name="Location_Name"
        value={formData.Location_Name}
        onChange={handleChange}
        required
    >
        <option value="">Select Location</option>
        {locationList
            .filter(loc => loc.Status === 'Active')
            .map((loc) => (
                <option key={loc.id} value={loc.id}>
                    {loc.locationName}
                </option>
            ))}
    </select>
</div>


                    <div className="RegisForm_1">
                        <label>Point Of Sale<span>:</span></label>
                        <input
                            type="checkbox"
                            name="IsPointOfSale"
                            checked={formData.IsPointOfSale}
                            onChange={handleChange}
                        />
                        <span>{formData.IsPointOfSale ? 'Yes' : 'No'}</span>
                    </div>

                    <div className="RegisForm_1">
                        <label>Status<span>:</span></label>
                        <input
                            type="checkbox"
                            name="Status"
                            checked={formData.Status}
                            onChange={handleChange}
                        />
                        <span>{formData.Status ? 'Active' : 'Inactive'}</span>
                    </div>

                    <div className="Main_container_Btn">
                        <button type="submit">
                            {isEditing ? 'Update' : 'Save'}
                        </button>
                        {isEditing && (
                            <button type="button" onClick={resetForm}>
                                Cancel
                            </button>
                        )}
                    </div>
                </div>
            </form>

            {/* GRID */}
            <ReactGrid columns={columns} RowData={departmentData} />
        </>
    );
};

export default DepartmentLocationMaster;
