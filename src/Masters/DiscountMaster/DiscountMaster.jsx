import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddBoxIcon from "@mui/icons-material/AddBox";
import axios from "axios";

const DiscountMaster = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector(state => state.userRecord?.UserData);
    const toast = useSelector((state) => state.userRecord?.toast);

    const dispatchvalue = useDispatch();

    const [departmentData, setDepartmentData] = useState([]);
    const [serviceData, setServiceData] = useState([]);
    const [discountMasterData, setDiscountMasterData] = useState([]);
    const [isDiscountMasterData, setIsDiscountMasterData] = useState(false);

    console.log(isDiscountMasterData,'isDiscountMasterData');

    const [discountMaster, setDiscountMaster] = useState({
        Discount_ID: '',
        DiscountName: '',
        Patient_Type: '',
        Department: '',
        Service: '',
        Discount_Type: '',
        Discount_Value: '',
        Min_Bill_Amount: '',
        Valid_From: '',
        Valid_To: '',
        Approval_Level: '',
        Notes: '',
        Status: true,
        created_by: userRecord?.username || '',
    });

    // Fetch Departments
    useEffect(() => {
        axios.get(`${UrlLink}Masters/Department_Detials_link`)
            .then((res) => setDepartmentData(res.data))
            .catch((err) => console.log(err));
    }, [UrlLink]);

    // Fetch Services
    useEffect(() => {
        axios.get(`${UrlLink}Masters/Insert_service_category_master`)
            .then((res) => setServiceData(res.data))
            .catch((err) => console.log(err));
    }, [UrlLink]);

    // Fetch Discount Master Data
    useEffect(() => {
        axios.get(`${UrlLink}Masters/Discount_Master_link`)
            .then((res) => {
                if (Array.isArray(res.data)) {
                    setDiscountMasterData(res.data);
                }
            })
            .catch((err) => console.log(err));
    }, [UrlLink, isDiscountMasterData]);

    const handleInputChange = (e) => {
        const { name, type, value, checked } = e.target;
        setDiscountMaster((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (name === 'Notes') {
            adjustHeight(e);
        }
    };

    const adjustHeight = (e) => {
        e.target.style.height = "auto";
        e.target.style.height = `${e.target.scrollHeight}px`;
    };

    const handleDiscountMasterSubmit = () => {
        // if (!discountMaster.Patient_Type || !discountMaster.Department || !discountMaster.Discount_Type || !discountMaster.Discount_Value) {
        //     dispatchvalue({
        //         type: 'toast',
        //         value: { message: 'Please provide Patient Type, Department, Discount Type, and Discount Value.', type: 'warn' },
        //     });
        //     return;
        // }

        const data = {
            ...discountMaster,
            created_by: userRecord?.username || '',
        };

        console.log(data,'data')

        axios.post(`${UrlLink}Masters/Discount_Master_link`, data)
            .then((res) => {
                const response = res.data;
                const messageType = Object.keys(response)[0];
                const messageContent = Object.values(response)[0];
                dispatchvalue({
                    type: 'toast',
                    value: { message: messageContent, type: messageType },
                });
                setIsDiscountMasterData((prev) => !prev);
                setDiscountMaster({
                    Discount_ID: '',
                    DiscountName:'',
                    Patient_Type: '',
                    Department: '',
                    Service: '',
                    Discount_Type: '',
                    Discount_Value: '',
                    Min_Bill_Amount: '',
                    Valid_From: '',
                    Valid_To: '',
                    Approval_Level: '',
                    Notes: '',
                    Status: true,
                    created_by: userRecord?.username || '',
                });
            })
            .catch((err) => {
                console.log(err);
                dispatchvalue({
                    type: 'toast',
                    value: { message: 'An error occurred while saving the discount.', type: 'error' },
                });
            });
    };

    const handleEditDiscountMaster = (row) => {

        console.log(row,'rowwwwwwwww')
        setDiscountMaster({
            Discount_ID: row.Discount_ID,
            DiscountName:row.DiscountName,
            Patient_Type: row.Patient_Type,
            Department: row.DepartmentId,
            Service: row.ServiceId || '',
            Discount_Type: row.Discount_Type,
            Discount_Value: row.Discount_Value,
            Min_Bill_Amount: row.Min_Bill_Amount || '',
            Valid_From: row.Valid_From ? row.Valid_From.split('T')[0] : '',
            Valid_To: row.Valid_To ? row.Valid_To.split('T')[0] : '',
            Approval_Level: row.Approval_Level,
            Notes: row.Notes || '',
            Status: row.Status,
            created_by: userRecord?.username || '',
        });
    };

    const handleEditDiscountMasterStatus = (row) => {
        const data = {
            Discount_ID: row.Discount_ID,
            Status: !row.Status,
            Statusedit : true
        };
        axios.post(`${UrlLink}Masters/Discount_Master_link`, data)
            .then((res) => {
                const response = res.data;
                const messageType = Object.keys(response)[0];
                const messageContent = Object.values(response)[0];
                dispatchvalue({
                    type: 'toast',
                    value: { message: messageContent, type: messageType },
                });
                setIsDiscountMasterData((prev) => !prev);
            })
            .catch((err) => {
                console.log(err);
                dispatchvalue({
                    type: 'toast',
                    value: { message: 'An error occurred while updating the status.', type: 'error' },
                });
            });
    };

    const DiscountMasterColumns = [
        { key: "sno", name: "S.No", frozen: true },
        { key: "DiscountName", name: "DiscountName", frozen: true },
        // { key: "created_by", name: "Created By", frozen: true },
        // { key: "Discount_ID", name: "Discount ID" },
        { key: "Patient_Type", name: "Patient Type" },
        { key: "DepartmentName", name: "Department" },
        { key: "ServiceName", name: "Service" },
        { key: "Discount_Type", name: "Discount Type" },
        { key: "Discount_Value", name: "Discount Value" },
        { key: "Min_Bill_Amount", name: "Min Bill Amount" },
        { key: "Valid_From", name: "Valid From" },
        { key: "Valid_To", name: "Valid To" },
        { key: "Approval_Level", name: "Approval Level" },
        { key: "Notes", name: "Notes" },
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <Button onClick={() => handleEditDiscountMasterStatus(params.row)}>
                    {params.row.Status ? 'Active' : 'Inactive'}
                </Button>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <Button onClick={() => handleEditDiscountMaster(params.row)}>
                    <EditIcon />
                </Button>
            ),
        },
    ];

    return (
        <div className="Main_container_app">
            <h3>Discount Master</h3>
            <br />
            <div className="RegisFormcon_1">
                <div className="RegisForm_1">
                    <label>Discount Name<span>:</span></label>
                    <input
                        type="text"
                        name="DiscountName"
                        placeholder="Enter DiscountName"
                        value={discountMaster.DiscountName}
                        onChange={handleInputChange}
                        autoComplete='off'
                        // disabled={!!discountMaster.Discount_ID} // Disable if editing
                    />
                </div>
                <div className="RegisForm_1">
                    <label>Patient Type<span>:</span></label>
                    <select
                        name="Patient_Type"
                        value={discountMaster.Patient_Type}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select</option>
                        <option value="General">General</option>
                        <option value="Student">Student</option>
                        <option value="Camp">Camp</option>
                        <option value="FreeAll">FreeAll</option>                       
                        <option value="Insurance">Insurance</option>
                        <option value="Client">Client</option>
                        <option value="Donation">Donation</option>
                        <option value="Employee">Employee</option>
                        <option value="EmployeeRelation">EmployeeRelation</option>
                        <option value="Doctor">Doctor</option>
                        <option value="DoctorRelation">DoctorRelation</option>
                        <option value="WellWisher">WellWisher</option>
                    
                    
                    </select>
                </div>
                <div className="RegisForm_1">
                    <label>Department<span>:</span></label>
                    <select
                        name="Department"
                        value={discountMaster.Department}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select</option>
                        {departmentData.map((dept, index) => (
                            <option key={index} value={dept.id}>
                                {dept.DepartmentName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="RegisForm_1">
                    <label>Service<span>:</span></label>
                    <select
                        name="Service"
                        value={discountMaster.Service}
                        onChange={handleInputChange}
                    >
                        <option value="">Select</option>
                        {serviceData.map((service, index) => (
                            <option key={index} value={service.Serviceid}>
                                {service.ServiceCategory}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="RegisForm_1">
                    <label>Discount Type<span>:</span></label>
                    <select
                        name="Discount_Type"
                        value={discountMaster.Discount_Type}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select</option>
                        <option value="PERCENTAGE">Percentage</option>
                        <option value="AMOUNT">Flat Amount</option>
                    </select>
                </div>
                <div className="RegisForm_1">
                    <label>Discount Value<span>:</span></label>
                    <input
                        type="number"
                        name="Discount_Value"
                        placeholder="Enter Discount Value"
                        value={discountMaster.Discount_Value}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label>Min Bill Amount<span>:</span></label>
                    <input
                        type="number"
                        name="Min_Bill_Amount"
                        placeholder="Enter Min Bill Amount"
                        value={discountMaster.Min_Bill_Amount}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="RegisForm_1">
                    <label>Valid From<span>:</span></label>
                    <input
                        type="date"
                        name="Valid_From"
                        value={discountMaster.Valid_From}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label>Valid To<span>:</span></label>
                    <input
                        type="date"
                        name="Valid_To"
                        value={discountMaster.Valid_To}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="RegisForm_1">
                    <label>Approval Level<span>:</span></label>
                    <select
                        name="Approval_Level"
                        value={discountMaster.Approval_Level}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select</option>
                        <option value="Manager">Manager</option>
                        <option value="Admin">Admin</option>
                        <option value="HOD">HOD</option>
                    </select>
                </div>
            </div>
            <div className="RegisFormcon extend_textarea_new">
                <div className="RegisForm_1 extend_textarea_new">
                    <label>Notes<span>:</span></label>
                    <textarea
                        name="Notes"
                        placeholder="Enter Notes"
                        value={discountMaster.Notes}
                        onChange={handleInputChange}
                    />
                </div>
            </div>
            <div className="Main_container_Btn">
                <button onClick={handleDiscountMasterSubmit}>
                    {discountMaster.Discount_ID ? 'Update' : 'Save'}
                </button>
            </div>
            {discountMasterData.length > 0 && (
                <ReactGrid columns={DiscountMasterColumns} RowData={discountMasterData} />
            )}
            <ToastAlert Message={toast.message} Type={toast.type} />
        </div>
    );
};

export default DiscountMaster;
