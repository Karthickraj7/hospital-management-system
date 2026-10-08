import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';


const LeninVendorMaster = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector(state => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);
    const dispatchvalue = useDispatch();

    const [Lenin, setLenin] = useState({
        StockId: '',
        LeninCategory: '',
        LeninType: '',
        Quantity: '',

        VendorName: '',
        Address: '',
        PhoneNumber: '',
        Status: 'Active',

        BulkQty: '',
        BulkRate: '',
        BulkTotal: 0,

        PieceQty: '',
        PieceRate: '',
        PieceTotal: 0,

        GrandTotal: 0
    });

    const [LeninData, setLeninData] = useState([]);
    const [IsLeninGet, setIsLeninGet] = useState(false);
    const [LeninCategoryData, setLeninCategoryData] = useState([]);
    const [LeninTypeData, setLeninTypeData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const formatLabel = (label) =>
        label.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, s => s.toUpperCase());

    /* ---------------- AUTO TOTAL ---------------- */
    useEffect(() => {
        const bulkTotal = Number(Lenin.BulkQty) * Number(Lenin.BulkRate) || 0;
        const pieceTotal = Number(Lenin.PieceQty) * Number(Lenin.PieceRate) || 0;

        setLenin(prev => ({
            ...prev,
            BulkTotal: bulkTotal,
            PieceTotal: pieceTotal,
            GrandTotal: bulkTotal + pieceTotal
        }));
    }, [Lenin.BulkQty, Lenin.BulkRate, Lenin.PieceQty, Lenin.PieceRate]);

    const LeninColumns = [
        { key: "StockId", name: "Stock Id", frozen: true },
        { key: "VendorName", name: "Vendor Name" },
        { key: "PhoneNumber", name: "Phone" },
        { key: "LeninCategory", name: "Category" },
        { key: "LeninType", name: "Type" },
        { key: "BulkTotal", name: "Bulk Total" },
        { key: "PieceTotal", name: "Piece Total" },
        { key: "GrandTotal", name: "Total Amount" },
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <Button onClick={() => handleeditLeninstatus(params.row)}>
                    {params.row.Status}
                </Button>
            )
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <div style={{ display: 'flex', gap: '5px' }}>
                    <Button onClick={() => handleeditLenin(params.row)}>
                        <EditIcon />
                    </Button>
                    <Button onClick={() => handleDelete(params.row.StockId)} color="error">
                        <DeleteIcon />
                    </Button>
                </div>
            )
        }
    ];

    /* ---------------- CATEGORY & TYPE ---------------- */

        useEffect(() => {
            if (UrlLink) {
                axios.get(`${UrlLink}LeninManagement/Lenin_Catg_Master_Detials_link`)
                    .then(res => {
                        const data = res.data || [];                

                        setLeninCategoryData(data);
                        setLeninTypeData(data);
                    });
            }
        }, [UrlLink]);

    useEffect(() => {
        if (UrlLink) {
            axios.get(`${UrlLink}LeninManagement/laundryVendorMasterdetails`)
                .then(res => setLeninData(res.data || []));
        }
    }, [IsLeninGet, UrlLink]);

    const handleLeninChange = (e) => {
        const { name, value } = e.target;
        setLenin(prev => ({ ...prev, [name]: value }));
    };

    const handleeditLenin = (row) => {
        setLenin({
            ...row,
            BulkQty: row.BulkQty || '',
            BulkRate: row.BulkRate || '',
            PieceQty: row.PieceQty || '',
            PieceRate: row.PieceRate || ''
        });
    };

    /* ---------------- ✅ MAIN FIX HERE ---------------- */
    const handleLeninSubmit = () => {
        const Quantity =
            (Number(Lenin.BulkQty) || 0) +
            (Number(Lenin.PieceQty) || 0);

        if (!Lenin.LeninCategory || !Lenin.LeninType || Quantity <= 0) {
            dispatchvalue({
                type: 'toast',
                value: { message: "Required fields missing", type: 'warn' }
            });
            return;
        }

        sendPostRequest({
            ...Lenin,
            Quantity: Quantity,   // ✅ REQUIRED BY BACKEND
            created_by: userRecord?.username || 'Admin'
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this record?")) {
            sendPostRequest({
                StockId: id,
                action: 'delete'
            });
        }
    };

    const handleeditLeninstatus = (row) => {
        sendPostRequest({
            StockId: row.StockId,
            Statusedit: true
        });
    };

    const sendPostRequest = (payload) => {
        axios.post(`${UrlLink}LeninManagement/laundryVendorMasterdetails`, payload)
            .then(res => {
                dispatchvalue({
                    type: 'toast',
                    value: {
                        message: res.data.success || res.data.error,
                        type: res.data.success ? 'success' : 'error'
                    }
                });
                if (res.data.success) {
                    setIsLeninGet(p => !p);
                }
            });
    };

    const filteredLeninData = LeninData.filter(row =>
        Object.values(row).some(val =>
            val !== null &&
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="Main_container_app">
            <h3>Lenin Vendor Stock Management</h3>

            <div className="RegisFormcon_1">
                <div className="RegisForm_1">
                    <label>Vendor Name :</label>
                    <input name="VendorName" value={Lenin.VendorName} onChange={handleLeninChange} />
                </div>

                <div className="RegisForm_1">
                    <label>Address :</label>
                    <input name="Address" value={Lenin.Address} onChange={handleLeninChange} />
                </div>

                <div className="RegisForm_1">
                    <label>Phone Number :</label>
                    <input name="PhoneNumber" value={Lenin.PhoneNumber} onChange={handleLeninChange} />
                </div>

                <div className="RegisForm_1">
                    <label>Lenin Category :</label>
                    <select
                        name="LeninCategory"
                        value={Lenin.LeninCategory}
                        onChange={(e) =>
                            setLenin(prev => ({
                                ...prev,
                                LeninCategory: e.target.value,
                                LeninType: ""
                            }))
                        }
                    >
                        <option value="">Select Category</option>
                        {LeninCategoryData.map((cat, index) => (
                            <option key={index} value={cat.LeninCategory}>
                                {cat.LeninCategory}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="RegisForm_1">
                    <label>Lenin Type :</label>
                    <select
                        name="LeninType"
                        value={Lenin.LeninType}
                        onChange={handleLeninChange}
                        disabled={!Lenin.LeninCategory}
                    >
                        <option value="">Select Type</option>
                        {LeninTypeData
                            .filter(t => t.LeninCategory === Lenin.LeninCategory)
                            .map((t, index) => (
                                <option key={index} value={t.LeninType}>
                                    {t.LeninType} - {t.LeninSize}
                                </option>
                            ))}
                    </select>
                </div>

                {['BulkQty', 'BulkRate', 'PieceQty', 'PieceRate'].map(field => (
                    <div className="RegisForm_1" key={field}>
                        <label>{formatLabel(field)} :</label>
                        <input
                            type="number"
                            name={field}
                            value={Lenin[field]}
                            onChange={handleLeninChange}
                        />
                    </div>
                ))}
            </div>

            <h4>Grand Total : ₹ {Lenin.GrandTotal}</h4>

            <div className="Main_container_Btn">
                <button onClick={handleLeninSubmit}>
                    {Lenin.StockId ? "Update" : "Add"}
                </button>
            </div>

            <ReactGrid columns={LeninColumns} RowData={filteredLeninData} />
            <ToastAlert Message={toast?.message} Type={toast?.type} />
        </div>
    );
};

export default LeninVendorMaster;
