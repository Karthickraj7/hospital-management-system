    import React, { useState, useEffect } from 'react';
    import axios from 'axios';
    import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
    import { Button } from '@mui/material';
    import EditIcon from '@mui/icons-material/Edit';
    import { useSelector } from 'react-redux';
    import { DeleteIcon, TrashIcon } from 'lucide-react';

    const QuestionMaster = () => {
        const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
        const [questionData, setQuestionData] = useState([]);
        const [isEditing, setIsEditing] = useState(false); 
        const [editId, setEditId] = useState(null);

        const [formData, setFormData] = useState({
            // code: '',
            question: '', 
            // order: 0,
            status: false
        });

        // Fetch all question groups
        const fetchQuestionData = () => {
            axios.get(`${UrlLink}BloodBank/question-group/`)
                .then((response) => {
                    setQuestionData(response.data);
                })
                .catch((error) => {
                    console.error('Error fetching question data', error);
                });
        };

        useEffect(() => {
            fetchQuestionData();
        }, []);

        // Handle form changes
        const handleChange = (e) => {
            const { name, value, type, checked } = e.target;
            setFormData({
                ...formData,
                [name]: type === 'checkbox' ? checked : value
            });
        };

        // Handle form submission for creating or updating question group
        const handleSubmit = (e) => {
            e.preventDefault();

            if (isEditing && editId) {
                // Update question group (PUT request)
                axios.put(`${UrlLink}BloodBank/question-group/update/${editId}/`, formData)
                    .then((response) => {
                        console.log('Question group updated');
                        resetForm();
                        fetchQuestionData();
                    })
                    .catch((error) => {
                        console.error('Error updating question group', error);
                    });
            } else {
                // Create new question group (POST request)
                axios.post(`${UrlLink}BloodBank/question-group/create/`, formData)
                    .then((response) => {
                        console.log('Question group created');
                        resetForm();
                        fetchQuestionData();
                    })
                    .catch((error) => {
                        console.error('Error creating question group', error);
                    });
            }
        };

        // Reset form
        const resetForm = () => {
            setFormData({
                // code: '',
                question: '',
                // order: 0,
                status: false
            });
            setIsEditing(false);
            setEditId(null);
        };

        // Handle editing
        const handleEdit = (question) => {
            setFormData({
                // code: question.code,
                question: question.question,
                // order: question.order,
                status: question.status
            });
            setIsEditing(true);
            setEditId(question.id);
        };

        // Handle deleting
        const handleDelete = (id) => {
            if (window.confirm('Are you sure you want to delete this group?')) {
                axios.delete(`${UrlLink}BloodBank/question-group/delete/${id}/`)
                    .then(() => {
                        console.log('Question group deleted');
                        fetchQuestionData(); // Refresh list after delete
                    })
                    .catch((error) => {
                        console.error('Error deleting question group', error);
                    });
            }
        };

        const columns = [
            // { key: 'id', name: 'ID', frozen: true, width: 80 },
            { key: 'code', name: 'Code' },
            { key: 'question', name: 'question' },
            // { key: 'order', name: 'Order' },
            {
                key: 'status',
                name: 'Status',
                renderCell: (params) => (params.row.status ? 'Active' : 'Inactive')
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
            },
        ];

        return (
            <>
                <form className="Main_container_app" onSubmit={handleSubmit}>
                <h3>Question Master</h3>
                <br />
                    <div className='RegisFormcon'>
                        {/* <div className="RegisForm_1">
                            <label>Code:</label>
                            <input type="text" name="code" value={formData.code} onChange={handleChange} required />
                        </div> */}
                        <div className="RegisForm_1">
                            <label>Question <span>:</span></label>
                            <input type="text" name="question" value={formData.question} onChange={handleChange} required />
                        </div>
                        {/* <div className="RegisForm_1">
                            <label>Order:</label>
                            <input type="number" name="order" value={formData.order} onChange={handleChange} required />
                        </div> */}
                        <div className="RegisForm_1">
                            <label>Status:</label>
                            <input type="checkbox" name="status" checked={formData.status} onChange={handleChange} />
                            <span>{formData.status ? 'Active' : 'Inactive'}</span>
                        </div>
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

                {/* Render grid with question data */}
                <ReactGrid columns={columns} RowData={questionData} />
            </>
        );
    };

    export default QuestionMaster;
