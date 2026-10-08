

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useSelector } from 'react-redux';

const AdvanceOpticallist = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

    const [advanceData, setAdvanceData] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [editId, setEditId] = useState(null);
const [patientList, setPatientList] = useState([]);
const [searchText, setSearchText] = useState('');
    const [formData, setFormData] = useState({
        Advance_Id: '',
        Patient_Name: '',
        Patient_Phone_No: '',
        Patient_Phone_age: '',
        Patient_Id: '',
        Advance_Amount: 0,
        Advance_Status: 'Hold',
        Status: true
    });

    

    // Handle input change
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const searchPatient = (value) => {
    setSearchText(value);

    if (value.length < 2) {
        setPatientList([]);
        return;
    }

   axios.get(`${UrlLink}DrugAdminstrations/search_patient/?q=${value}`)

        .then(res => setPatientList(res.data.data || []));
};

const selectPatient = (p) => {
    setFormData((prev) => ({
        ...prev,
        Patient_Id: p.PatientId,
        Patient_Name: p.Name,
        Patient_Phone_No: p.Phone,
        Patient_Phone_age: p.Age
    }));
    setPatientList([]);
};

    // Fetch data
    const fetchAdvanceData = () => {
        axios.get(`${UrlLink}DrugAdminstrations/advance-optical/`)
            .then((res) => {
                setAdvanceData(res.data.data || []);
            })
            .catch((err) => {
                console.error('Error fetching advance optical data', err);
            });
    };

    useEffect(() => {
        fetchAdvanceData();
    }, []);

    // Submit (Create / Update)
    const handleSubmit = (e) => {
    e.preventDefault();

    const payload = {
        ...formData,
        Patient_Name:
            formData.Patient_Name || searchText || null
    };

    if (isEditing && editId) {
        axios.put(
            `${UrlLink}DrugAdminstrations/advance-optical/update/${editId}/`,
            payload
        ).then(() => {
            resetForm();
            fetchAdvanceData();
        });
    } else {
        axios.post(
            `${UrlLink}DrugAdminstrations/advance-optical/create/`,
            payload
        ).then(() => {
            resetForm();
            fetchAdvanceData();
        });
    }
};


const resetForm = () => {
    setFormData({
        Advance_Id: '',
        Patient_Name: '',
        Patient_Phone_No: '',
        Patient_Phone_age: '',
        Patient_Id: '',
        Advance_Amount: 0,
        Advance_Status: 'Hold',
        Status: true
    });

    setSearchText('');
    setPatientList([]);
    setIsEditing(false);
    setEditId(null);
};


    // Edit handler
    const handleEdit = (row) => {
        setFormData({
            Advance_Id: row.Advance_Id,
            Patient_Name: row.Patient_Name,
            Patient_Phone_No: row.Patient_Phone_No,
            Patient_Phone_age: row.Patient_Phone_age,
            Patient_Id: row.Patient_Id,
            Advance_Amount: row.Advance_Amount,
            Advance_Status: row.Advance_Status,
            Status: row.Status
        });
        setEditId(row.Advance_Id);
        setIsEditing(true);
    };
const handlePrintReceipt = (row) => {
    const HospitalDetails = {
        Hospital_Name: "KARUNA MEDICAL COLLEGE HOSPITAL",
        Clinic_DoorNo: "23",
        Clinic_Street: "Vilayodi",
        Clinic_Area: "Chittur",
        Clinic_City: "Palakkad",
        Clinic_State: "Kerala - 678103",
        Clinic_LandlineNo: "04923-221791",
        Clinic_PhoneNo: "8348397848"
    };

    const receiptWindow = window.open('', '_blank', 'width=800,height=650');

    receiptWindow.document.write(`
        <html>
        <head>
            <title>Advance Receipt</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    padding: 20px;
                }
                .receipt {
                    border: 1px solid #000;
                    padding: 20px;
                }
                .header {
                    text-align: center;
                    border-bottom: 2px solid #000;
                    padding-bottom: 10px;
                    margin-bottom: 20px;
                }
                .header h2 {
                    margin: 0;
                    font-size: 22px;
                }
                .header p {
                    margin: 3px 0;
                    font-size: 13px;
                }
                .receipt-title {
                    text-align: center;
                    font-weight: bold;
                    margin: 15px 0;
                    text-decoration: underline;
                }
                table {
                    width: 100%;
                    border-collapse: collapse;
                }
                td {
                    padding: 8px;
                    border-bottom: 1px solid #ccc;
                }
                .label {
                    font-weight: bold;
                    width: 40%;
                }
                .footer {
                    margin-top: 30px;
                    display: flex;
                    justify-content: space-between;
                }
                @media print {
                    button {
                        display: none;
                    }
                }
            </style>
        </head>
        <body>
            <div class="receipt">

                <!-- Hospital Header -->
                <div class="header">
                    <h2>${HospitalDetails.Hospital_Name}</h2>
                    <p>
                        ${HospitalDetails.Clinic_DoorNo},
                        ${HospitalDetails.Clinic_Street},
                        ${HospitalDetails.Clinic_Area},
                        ${HospitalDetails.Clinic_City},
                        ${HospitalDetails.Clinic_State}
                    </p>
                    <p>
                        Phone: ${HospitalDetails.Clinic_PhoneNo} |
                        Landline: ${HospitalDetails.Clinic_LandlineNo}
                    </p>
                </div>

                <div class="receipt-title">ADVANCE RECEIPT</div>

                <!-- Receipt Details -->
                <table>
                    <tr>
                        <td class="label">Advance ID</td>
                        <td>${row.Advance_Id}</td>
                    </tr>
                    <tr>
                        <td class="label">Patient ID</td>
                        <td>${row.Patient_Id || '-'}</td>
                    </tr>
                    <tr>
                        <td class="label">Patient Name</td>
                        <td>${row.Patient_Name}</td>
                    </tr>
                    <tr>
                        <td class="label">Phone</td>
                        <td>${row.Patient_Phone_No}</td>
                    </tr>
                    <tr>
                        <td class="label">Age</td>
                        <td>${row.Patient_Phone_age}</td>
                    </tr>
                    <tr>
                        <td class="label">Advance Amount</td>
                        <td>₹ ${row.Advance_Amount}</td>
                    </tr>
                    <tr>
                        <td class="label">Advance Status</td>
                        <td>${row.Advance_Status}</td>
                    </tr>
                    <tr>
                        <td class="label">Receipt Date</td>
                        <td>${new Date().toLocaleString()}</td>
                    </tr>
                </table>

                <!-- Footer -->
                <div class="footer">
                    <div>Cashier Signature</div>
                    <div>Authorized Signature</div>
                </div>

                <div style="text-align:center;margin-top:20px;">
                    <button onclick="window.print()">Print Receipt</button>
                </div>
            </div>
        </body>
        </html>
    `);

    receiptWindow.document.close();
};

    // Grid columns
    const columns = [
        { key: 'Advance_Id', name: 'Advance ID', frozen: true },
        { key: 'Patient_Name', name: 'Patient Name', filter: true },
        { key: 'Patient_Phone_No', name: 'Phone', filter: true },
        { key: 'Advance_Amount', name: 'Amount' },
        {
            key: 'Advance_Status',
            name: 'Advance Status',
            filter: true
        },
        {
            key: 'Status',
            name: 'Status',
            renderCell: (params) =>
                params.row.Status ? 'Active' : 'Inactive'
        },
       
        {
    key: 'actions',
    name: 'Actions',
    renderCell: (params) => (
        <>
            <Button
                className="edit_btn"
                onClick={() => handleEdit(params.row)}
                startIcon={<EditIcon />}
                variant="contained"
                color="primary"
                size="small"
                style={{ marginRight: '6px' }}
            >
                Edit
            </Button>

            <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => handlePrintReceipt(params.row)}
            >
                Receipt
            </Button>
        </>
    ),
},

    ];


    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="RegisFormcon" style={{ margin: '12px' }}>
<div className="RegisForm_1" style={{ position: 'relative' }}>
    <label>Search Patient<span>:</span></label>

    <input
        type="text"
        value={searchText}
        onChange={(e) => searchPatient(e.target.value)}
        placeholder="Patient ID / Phone / Name"
        autoComplete="off"
        style={{
            width: '100%',
            padding: '6px',
            boxSizing: 'border-box'
        }}
    />

    {patientList.length > 0 && (
        <ul
            style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: '#fff',
                border: '1px solid #ccc',
                listStyle: 'none',
                margin: 0,
                padding: 0,
                maxHeight: '220px',
                overflowY: 'auto',
                zIndex: 99999
            }}
        >
            {patientList.map((p) => (
                <li
                    key={p.PatientId}
                    onClick={() => {
                        selectPatient(p);
                        setSearchText(`${p.PatientId} - ${p.Name}`);
                    }}
                    style={{
                        padding: '8px',
                        cursor: 'pointer',
                        borderBottom: '1px solid #eee'
                    }}
                    onMouseEnter={(e) =>
                        (e.currentTarget.style.background = '#f5f5f5')
                    }
                    onMouseLeave={(e) =>
                        (e.currentTarget.style.background = '#fff')
                    }
                >
                    <strong>{p.PatientId}</strong> – {p.Name}
                    <br />
                    <small style={{ color: '#666' }}>{p.Phone}</small>
                </li>
            ))}
        </ul>
    )}
</div>



                    <div className="RegisForm_1">
                        <label>Patient ID<span>:</span></label>
                        <input
                            type="text"
                            name="Patient_Name"
                            disabled={true}
                            value={formData.Patient_Id}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="RegisForm_1">
                        <label>Patient Name<span>:</span></label>
                        <input
                            type="text"
                            name="Patient_Name"
                            value={formData.Patient_Name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="RegisForm_1">
                          <label>Patient Phone<span>:</span></label>
                      <input
    type="text"
    name="Patient_Phone_No"
    value={formData.Patient_Phone_No}
    onChange={(e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 10);
        setFormData({
            ...formData,
            Patient_Phone_No: value
        });
    }}
    placeholder="Enter 10 digit phone number"
/>

                    </div>

                    <div className="RegisForm_1">
                        <label>Age<span>:</span></label>
                        <input
                            type="text"
                            name="Patient_Phone_age"
                            value={formData.Patient_Phone_age}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="RegisForm_1">
                        <label>Advance Amount<span>:</span></label>
                        <input
                            type="number"
                            name="Advance_Amount"
                            value={formData.Advance_Amount}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="RegisForm_1">
                        <label>Advance Status<span>:</span></label>
                        <select
                            name="Advance_Status"
                            value={formData.Advance_Status}
                            onChange={handleChange}
                        >
                            <option value="Hold">Hold</option>
                            <option value="Adjusted">Adjusted</option>
                            <option value="Refunded">Refunded</option>
                        </select>
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
                        <button
    type="button"
    onClick={resetForm}
>
    Clear
</button>

                    </div>
                </div>
            </form>

            <ReactGrid columns={columns} RowData={advanceData} />
        </>
    );
};

export default AdvanceOpticallist;
