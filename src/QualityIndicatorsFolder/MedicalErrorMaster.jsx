import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const MedicalErrorMaster = () => {
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const [medicalErrors, setMedicalErrors] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    error_type: '',
    severity: 'low',
    applicable_for: 'ALL'
  });

  
  // Fetch medical errors on component mount
  useEffect(() => {
    fetchMedicalErrors();
  }, []);

  // Fetch medical errors data
  const fetchMedicalErrors = () => {
    axios.get(`${UrlLink}QualityIndicators/medical-errors/`)
      .then((response) => {
        setMedicalErrors(response.data);
      })
      .catch((error) => {
        console.error('Error fetching medical errors', error);
      });
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission (create or update)
  const handleSubmit = (e) => {
    e.preventDefault();

    if (isEditing && editId) {
      axios.put(`${UrlLink}QualityIndicators/medical-errors/update/${editId}/`, formData)
        .then(() => {
          resetForm();
          fetchMedicalErrors();
        })
        .catch((error) => {
          console.error('Error updating medical error', error);
          alert('Error updating medical error');
        });
    } else {
      axios.post(`${UrlLink}QualityIndicators/medical-errors/create/`, formData)
        .then(() => {
          resetForm();
          fetchMedicalErrors();
        })
        .catch((error) => {
          console.error('Error adding medical error', error);
          alert('Error adding medical error');
        });
    }
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      error_type: '',
      severity: 'low',
      applicable_for: 'ALL'
    });
    setIsEditing(false);
    setEditId(null);
  };

  // Handle editing
  const handleEdit = (error) => {
    setFormData({
      error_type: error.error_type,
      severity: error.severity,
      applicable_for: error.applicable_for
    });
    setIsEditing(true);
    setEditId(error.id);
  };

  // Handle delete
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this medical error?')) {
        axios.delete(`${UrlLink}QualityIndicators/medical-errors/delete/${id}/`)
            .then(() => {
                fetchMedicalErrors(); // Refresh the list after deleting
                console.log('Medical Error deleted');
            })
            .catch((error) => {
                console.error('Error deleting medical error', error);
                alert('Error deleting medical error');
            });
    }
};

  // Define columns for ReactGrid
  const columns = [
    { key: 'id', name: 'ID', frozen: true, width: 80 },
    { key: 'error_type', name: 'Error Type', filter: true },
    { key: 'severity', name: 'Severity', filter: true },
    { key: 'applicable_for', name: 'Applicable For' },
    {
      key: 'Edit',
      name: 'Edit',
      renderCell: (params) => (
        <>
        <Button
          className="edit_btn"
          onClick={() => handleEdit(params.row)}
          startIcon={<EditIcon />} 
          variant="contained"
          color="primary"
        >
          Edit
        </Button>

</>
      ),
    },
    {
        key: 'Delete',
        name: 'Delete',
        renderCell: (params) => (
          <>

  
  <Button
  className="delete_btn"
  onClick={() => handleDelete(params.row.id)}
  startIcon={<DeleteIcon />}  // Adds the delete icon
  variant="contained"
  color="secondary"
  >
  Delete
  </Button>
  </>
        ),
      },
  ];


  return (
    <>


      <form onSubmit={handleSubmit}>

        
        <div className='RegisFormcon' style={{ margin: '12px', marginBottom: '12px' }}>

        <div className="common_center_tag">
        
        <span>Medical Error Master Registration</span>
      </div>
      
      <br />
      <br />
      <br />
      

          <div className="RegisForm_1">
            <label>Error Type<span>:</span></label>
            <input type="text" name="error_type" value={formData.error_type} onChange={handleChange} required />
          </div>
          <div className="RegisForm_1">
            <label>Severity<span>:</span></label>
            <select name="severity" value={formData.severity} onChange={handleChange}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          <div className="RegisForm_1">
            <label>Applicable For<span>:</span></label>
            <select name="applicable_for" value={formData.applicable_for} onChange={handleChange}>
              <option value="IP">IP</option>
              <option value="OP">OP</option>
              <option value="EMERGENCY">EMERGENCY</option>
              <option value="ALL">ALL</option>
            </select>
          </div>
          
          <div className='Main_container_Btn'>
            <button type="submit">{isEditing ? 'Update' : 'Save'}</button>
            {isEditing && <button type="button" onClick={resetForm}>Cancel</button>}
          </div>
        </div>
      </form>
      

      {/* Render grid with medical errors data */}
      <ReactGrid columns={columns} RowData={medicalErrors} />
    </>
  );
};

export default MedicalErrorMaster;
