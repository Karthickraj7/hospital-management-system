// src/components/AddEditDepartment.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';


const DepartmentManagement = () => {
    const [departmentName, setDepartmentName] = useState('');
    const [status, setStatus] = useState('active');
    const [departments, setDepartments] = useState([]);
    const [editingDepartmentId, setEditingDepartmentId] = useState(null);
    const [DepartNameArray, setDepartNameArray] = useState([]);

    useEffect(() => {
        const fetchDepartments = async () => {
            // const response = await axios.get('http://localhost:8000/api/departments/');
            // setDepartments(response.data);
        };
        fetchDepartments();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newDepartment = { name: departmentName.toUpperCase(), status };

        if (editingDepartmentId) {
            // Update existing department
            // await axios.put(`http://localhost:8000/api/departments/${editingDepartmentId}/`, newDepartment);
            setEditingDepartmentId(null);
        } else {
            // Check for duplicates before adding
            try {
                // await axios.post('http://localhost:8000/api/departments/', newDepartment);
            } catch (error) {
                if (error.response && error.response.status === 400) {
                    console.log(error.response.data.detail);
                    return;
                }
            }
        }

        setDepartmentName('');
        setStatus('active');
        // Re-fetch departments after add/update
        // const response = await axios.get('http://localhost:8000/api/departments/');
        // setDepartments(response.data);
    };

    const startEditing = (department) => {
        setDepartmentName(department.name);
        setStatus(department.status);
        setEditingDepartmentId(department.id);
    };

    const toggleStatus = async (department) => {
        // const updatedDepartment = { ...department, status: department.status === 'active' ? 'inactive' : 'active' };
        // await axios.put(`http://localhost:8000/api/departments/${department.id}/`, updatedDepartment);
        // // Update local state
        // setDepartments(departments.map(d => (d.id === department.id ? updatedDepartment : d)));
    };

    const DepartmentColumns = [
        {
            key: 'id',
            name: 'Department ID',
            frozen: true
        },
        {
            key: 'name',
            name: 'Department Name',
            frozen: true
        },
        {
            key: 'status',
            name: 'Status',
            renderCell: (params) => (
                <>
                    <button
                        className="cell_btn"
                        onClick={() => toggleStatus(params.row)}
                    >
                        {params.row.status === 'active' ? "DEACTIVATE" : "ACTIVATE"}
                    </button>
                </>
            )
        },
        {
            key: 'actions',
            name: 'Actions',
            renderCell: (params) => (
                <>
                    <button onClick={() => startEditing(params.row)}>Edit</button>
                    <button onClick={() => toggleStatus(params.row)}>
                        {params.row.status === 'active' ? "Deactivate" : "Activate"}
                    </button>
                </>
            )
        }
    ];


    return (
        <>
            <div className="Main_container_app">
                <h3>Department Management</h3>

                <div className="RegisFormcon_1" style={{ justifyContent: "center" }}>
                    <div className="RegisForm_1">

                        <label>Department Name<span>:</span></label>
                        <input
                            type="text"
                            value={departmentName}
                            onChange={(e) => setDepartmentName(e.target.value)}
                            placeholder="Department Name"
                            required
                        />
                    </div>
                    <div className="RegisForm_1">
                        <label>Status<span>:</span></label>
                        <select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>

                    </div>

                </div>
                <div className="Main_container_Btn">
                    <button type="submit">{editingDepartmentId ? 'Update' : 'Add'}</button>
                </div>

                <ReactGrid columns={DepartmentColumns} RowData={DepartNameArray} />
            </div >

        </>

    );
};

export default DepartmentManagement;