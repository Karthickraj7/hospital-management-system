import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';

const Lenin_Stock = () => {

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector(state => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);
    const dispatchvalue = useDispatch();

    const [Lenin, setLenin] = useState({
        StockId: '',
        LeninCategory: '',
        LeninType: '',
        Quantity: '',
    });

    const [LeninData, setLeninData] = useState([]);
    const [IsLeninGet, setIsLeninGet] = useState(false);
    const [LeninCategoryData, setLeninCategoryData] = useState([]);
    const [LeninTypeData, setLeninTypeData] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");

    const formatLabel = (label) =>
        label.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, s => s.toUpperCase());

    const LeninColumns = [
        { key: "StockId", name: "Stock Id", frozen: true },
        { key: "created_by", name: "Created By" },
        { key: "LeninCategory", name: "Lenin Category" },
        { key: "LeninType", name: "Lenin Type" },
        { key: "LeninSize", name: "Lenin Size" },
        { key: "Quantity", name: "Quantity" },
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

    // 🔹 MASTER DATA (EXISTING API – NO CHANGE)
    useEffect(() => {
        if (UrlLink) {
            axios.get(`${UrlLink}LeninManagement/Lenin_Catg_Master_Detials_link`)
                .then(res => {
                    setLeninCategoryData(res.data || []);
                })
                .catch(err => console.error(err));
        }
    }, [UrlLink]);



    useEffect(() => {
        if (UrlLink) {
            axios.get(`${UrlLink}LeninManagement/LeninMaster_Detials_link_by_id?catid=${Lenin.LeninCategory}`)
                .then(res => {
                    setLeninTypeData(res.data || []);
                })
                .catch(err => console.error(err));
        }
    }, [UrlLink,Lenin]);






    // 🔹 STOCK DATA
    useEffect(() => {
        if (UrlLink) {
            axios.get(`${UrlLink}LeninManagement/Lenin_Stock_Detials_link`)
                .then(res => setLeninData(res.data || []))
                .catch(err => console.error(err));
        }
    }, [IsLeninGet, UrlLink]);

    // ✅ FIXED CHANGE HANDLER
    const handleLeninChange = (e) => {
        const { name, value } = e.target;

        setLenin(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'LeninCategory' ? { LeninType: '' } : {})
        }));
    };

    const handleeditLenin = (row) => {
        setLenin({
            StockId: row.StockId,
            LeninCategory: row.LeninCategory,
            LeninType: row.LeninType,
            Quantity: row.Quantity
        });
    };

    const handleLeninSubmit = () => {
        if (!Lenin.LeninCategory || !Lenin.LeninType || Lenin.Quantity === "") {
            dispatchvalue({
                type: 'toast',
                value: { message: "Please provide all fields.", type: 'warn' }
            });
            return;
        }

        sendPostRequest({
            ...Lenin,
            created_by: userRecord?.username || 'Admin'
        });
    };

    const handleDelete = (id) => {
        if (window.confirm("Delete this record?")) {
            sendPostRequest({ StockId: id, action: 'delete' });
        }
    };

    const handleeditLeninstatus = (row) => {
        sendPostRequest({ StockId: row.StockId, Statusedit: true });
    };

    const sendPostRequest = (payload) => {
        axios.post(`${UrlLink}LeninManagement/Lenin_Stock_Detials_link`, payload)
            .then(res => {
                const type = res.data.success
                    ? 'success'
                    : (res.data.warn ? 'warn' : 'error');

                dispatchvalue({
                    type: 'toast',
                    value: {
                        message: res.data.success || res.data.warn || res.data.error,
                        type
                    }
                });

                if (res.data.success) {
                    setIsLeninGet(prev => !prev);
                    setLenin({
                        StockId: '',
                        LeninCategory: '',
                        LeninType: '',
                        Quantity: ''
                    });
                }
            })
            .catch(err => {
                dispatchvalue({
                    type: 'toast',
                    value: {
                        message: err.response?.data?.error || "Error occurred",
                        type: 'error'
                    }
                });
            });
    };

    const filteredLeninData = LeninData.filter(row =>
        Object.values(row).some(val =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        )
    );

    return (
        <div className="Main_container_app">
            <h3>Lenin Stock Management</h3>

            <div className="RegisFormcon_1">
                {['LeninCategory', 'LeninType', 'Quantity'].map((field) => (
                    <div className="RegisForm_1" key={field}>
                        <label>{formatLabel(field)} :</label>

                        {field === 'Quantity' ? (
                            <input
                                type="number"
                                name={field}
                                value={Lenin[field]}
                                onChange={handleLeninChange}
                            />
                        ) : (
                            <select
    name={field}
    value={Lenin[field]}
    onChange={handleLeninChange}
>
    <option value="">Select</option>

    {(field === 'LeninCategory'
        ? Array.isArray(LeninCategoryData) ? LeninCategoryData : []
        : Array.isArray(LeninTypeData)
            ? LeninTypeData.filter(t =>
                t.LeninCategory === Lenin.LeninCategory ||
                t.LeninType === Lenin.LeninType
            )
            : []
    ).map((p, index) => (
        <option
            key={index}
            value={field === 'LeninCategory'
                ? p.LeninCategory
                : p.LeninType}
        >
            {field === 'LeninCategory'
                ? p.LeninCategory
                : `${p.LeninType} - ${p.LeninSize}`}
        </option>
    ))}
</select>


                        )}
                    </div>
                ))}
            </div>

            <div className="Main_container_Btn">
                <button onClick={handleLeninSubmit}>
                    {Lenin.StockId ? "Update" : "Add"}
                </button>
            </div>

            <div className="RegisFormcon_1" style={{ justifyContent: 'flex-end', marginTop: '20px' }}>
                <div className="RegisForm_1">
                    <label>Search Stock:</label>
                    <input
                        type="text"
                        placeholder="Search all fields..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <ReactGrid columns={LeninColumns} RowData={filteredLeninData} />
            <ToastAlert Message={toast?.message} Type={toast?.type} />
        </div>
    );
};

export default Lenin_Stock;
