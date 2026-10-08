import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from 'react-redux';
import { Button } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import "./AMC.css";

const InsuranceRegistration = () => {
    const [isSubmit, setIsSubmit] = useState(false);
    const [insuranceData, setInsuranceData] = useState([]);
    const [formData, setFormData] = useState({
        id: null,
        productName: '',
        startDate: '',
        endDate: '',
        insuranceName: '',
        amount: '',
    });

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    const fetchInsuranceData = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/Asset_insurance_registration_list`);
            setInsuranceData(response.data);
        } catch (error) {
            console.error('Error fetching insurance data:', error);
        }
    };

    useEffect(() => {
        fetchInsuranceData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const url = `${UrlLink}AccetCategory/Asset_insurance_registration_list`;
            const method = formData.id ? 'put' : 'post';
            const response = await axios({
                method,
                url,
                data: formData,
            });
            setFormData({
                id: null,
                productName: '',
                startDate: '',
                endDate: '',
                insuranceName: '',
                amount: '',
            });
            setIsSubmit(false);
            fetchInsuranceData();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    };

    const handleEdit = (row) => {
        setFormData({
            id: row.id,
            productName: row.productName,
            startDate: row.startDate,
            endDate: row.endDate,
            insuranceName: row.insuranceName,
            amount: row.amount,
        });
        setIsSubmit(true);
    };

    const calculateDaysUntilExpiry = (endDate) => {
        const today = new Date();
        const expiryDate = new Date(endDate);
        const timeDiff = expiryDate - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        return daysDiff >= 0 ? daysDiff : 0;
    };

    const insuranceColumns = [
        { key: 'id', name: 'ID' },
        { key: 'productName', name: 'Product Name' },
        { key: 'startDate', name: 'Start Date' },
        { key: 'endDate', name: 'End Date' },
        { key: 'insuranceName', name: 'Insurance Name' },
        { key: 'amount', name: 'Amount' },
        {
            key: 'nearbyExpiry',
            name: 'Nearby Expiry',
            renderCell: (params) =>
                params.row.nearbyExpiry && (
                    <div>
                        <span style={{ color: 'red' }}>{`${calculateDaysUntilExpiry(params.row.endDate)} days`}</span>
                        <Button onClick={() => handleEdit(params.row)}>
                            Renewal
                        </Button>
                    </div>
                ),
        },
        {
            key: 'action',
            name: 'Action',
            renderCell: (params) => (
                <div>
                    <Button className="cell_btn" onClick={() => handleEdit(params.row)}>
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="Main_container_app">
            <h3>Insurance Registration Page</h3>
            <br />
            <div className="RegisFormcon_1">
                <div className="RegisForm_1">
                    <label>
                        Insurance Product Name <span>:</span>
                    </label>
                    <input
                        type="text"
                        name="productName"
                        value={formData.productName}
                        onChange={handleChange}
                        placeholder="Insurance Product Name"
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label>
                        Insurance Start Date <span>:</span>
                    </label>
                    <input
                        type="date"
                        name="startDate"
                        value={formData.startDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label>
                        Insurance End Date <span>:</span>
                    </label>
                    <input
                        type="date"
                        name="endDate"
                        value={formData.endDate}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label>Insurance Name <span>:</span></label>
                    <input
                        type="text"
                        name="insuranceName"
                        value={formData.insuranceName}
                        onChange={handleChange}
                        placeholder="Enter Insurance Name"
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label>Insurance Amount <span>:</span></label>
                    <input
                        type="number"
                        name="amount"
                        value={formData.amount}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="Main_container_Btn">
                <button onClick={handleSubmit}>{isSubmit ? 'Update' : 'Submit'}</button>
            </div>
            <ReactGrid
                columns={insuranceColumns}
                RowData={insuranceData}
                getRowClassName={(params) =>
                    params.row.nearbyExpiry
                        ? 'nearby-expiry-row'
                        : params.row.isEdited
                            ? 'edited-row'
                            : ''
                }
            />
        </div>
    );
};

export default InsuranceRegistration;