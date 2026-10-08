import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete"; // Added Delete Icon
import axios from "axios";
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';

const Lenin_DeptWise_MinMax = () => {

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector(state => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);
    const dispatchvalue = useDispatch();

    const formatLabel = (label) => {
        if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
            return label.replace(/([a-z])([A-Z])/g, "$1 $2").replace(/^./, str => str.toUpperCase());
        }
        return label;
    };

    const [LeninMinMax, setLeninMinMax] = useState({
        Id: '',
        Location: '',
        Department: '',
        LeninCategory: '',
        LeninType: '',
        Min: '',
        Max: '',
        NurseStation: '',
        CurrentStock: ''
    });

    const [LeninMinMaxData, setLeninMinMaxData] = useState([]);
    const [IsLeninMinMaxGet, setIsLeninMinMaxGet] = useState(false);

    const [DepartmentData, setDepartmentData] = useState([]);
    const [LocationData, setLocationData] = useState([]);
    const [LeninCategoryData, setLeninCategoryData] = useState([]);
    const [LeninTypeData, setLeninTypeData] = useState([]);
    const [NurseStation, setNurseStation] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");

    /* ===================== GRID COLUMNS ===================== */

    const LeninMinMaxColumns = [
        { key: "id", name: "Id", frozen: true },
        { key: "created_by", name: "Created By", frozen: true },
        { key: "LocationName", name: "Location" },
        { key: "DepartmentName", name: "Department" },
        { key: "LeninCategory", name: "Lenin Category" },
        { key: "LeninType", name: "Lenin Type" },
        { key: "LeninSize", name: "Lenin Size" },
        { key: "NurseStation", name: "Nurse Station" },
        {
            key: "Min",
            name: "Minimum",
            children: [
                { key: "PrevMin", name: "Previous Minimum", width: 150 },
                {
                    key: "Min",
                    name: "Current Minimum",
                    width: 150,
                    renderCell: (params) => (
                        <div onDoubleClick={() => handleDoubleClick(params.row, 'Min')} tabIndex={0}>
                            {params.row.Min}
                        </div>
                    )
                }
            ]
        },
        {
            key: "Max",
            name: "Maximum",
            children: [
                { key: "PrevMax", name: "Previous Maximum", width: 150 },
                {
                    key: "Max",
                    name: "Current Maximum",
                    width: 150,
                    renderCell: (params) => (
                        <div onDoubleClick={() => handleDoubleClick(params.row, 'Max')} tabIndex={0}>
                            {params.row.Max}
                        </div>
                    )
                }
            ]
        },
        { key: "CurrentStock", name: "Current Stock" },
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <Button 
                    className="cell_btn" 
                    onClick={() => handleeditLeninMinMaxstatus(params.row)}
                    style={{ color: params.row.Status === 'Active' ? 'green' : 'red' }}
                >
                    {params.row.Status}
                </Button>
            )
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button onClick={() => handleeditLeninMinMax(params.row)}>
                        <EditIcon />
                    </Button>
                    {/* FIXED DELETE BUTTON */}
                    <Button onClick={() => handleDeleteLeninMinMax(params.row)} style={{ color: 'red' }}>
                        <DeleteIcon />
                    </Button>
                </>
            )
        }
    ];

    /* ===================== FETCH DATA ===================== */

    const fetchLeninMinMaxData = async () => {
        try {
            const res = await axios.get(`${UrlLink}LeninManagement/Lenin_MinMax_Master_Detials_link`);
            setLeninMinMaxData(res.data);
        } catch (err) { console.error(err); }
    };

    useEffect(() => {
        fetchLeninMinMaxData();
    }, [IsLeninMinMaxGet, UrlLink]);

    useEffect(() => {
        const fetchMasters = async () => {
            const [
                departmentResponse,
                locationResponse,
                leninCategoryResponse,
                leninTypeResponse,
                nurseStationResponse
            ] = await Promise.all([
                axios.get(`${UrlLink}Masters/Department_Detials_link`),
                axios.get(`${UrlLink}Masters/Location_Detials_link`),
                axios.get(`${UrlLink}LeninManagement/Lenin_Catg_Master_Detials_link`),
                axios.get(`${UrlLink}LeninManagement/LeninMaster_Detials_link`),
                axios.get(`${UrlLink}Masters/NurseStationData`)
            ]);

            setDepartmentData(departmentResponse.data);
            setLocationData(locationResponse.data);
            setLeninCategoryData(leninCategoryResponse.data);
            setLeninTypeData(leninTypeResponse.data);
            setNurseStation(nurseStationResponse.data);
        };
        fetchMasters();
    }, [UrlLink]);

    /* ===================== STATUS FIX ===================== */

    const handleeditLeninMinMaxstatus = async (row) => {
        try {
            const res = await axios.post(`${UrlLink}LeninManagement/Lenin_MinMax_Master_Detials_link`, {
                Id: row.id,
                Statusedit: true
            });
            const resData = res.data;
            const [type, message] = [Object.keys(resData)[0], Object.values(resData)[0]];
            dispatchvalue({ type: 'toast', value: { message, type } });
            setIsLeninMinMaxGet(prev => !prev);
        } catch (err) { console.error(err); }
    };

    /* ===================== DELETE FIX ===================== */

    const handleDeleteLeninMinMax = async (row) => {
        if (window.confirm("Are you sure you want to delete this record?")) {
            try {
                const res = await axios.post(`${UrlLink}LeninManagement/Lenin_MinMax_Master_Detials_link`, {
                    Id: row.id,
                    isDelete: true
                });
                const resData = res.data;
                const [type, message] = [Object.keys(resData)[0], Object.values(resData)[0]];
                dispatchvalue({ type: 'toast', value: { message, type } });
                setIsLeninMinMaxGet(prev => !prev);
            } catch (err) { console.error(err); }
        }
    };

    /* ===================== EDIT FIX ===================== */

    const handleeditLeninMinMax = (row) => {
        setLeninMinMax({
            Id: row.id,
            Location: row.LocationId,
            Department: row.DepartmentId,
            LeninCategory: row.catgId,
            LeninType: row.LeninTypeId,
            Min: row.Min,
            Max: row.Max,
            NurseStation: row.NurseStationId || row.NurseStation, // Ensure ID is used
            CurrentStock: row.CurrentStock
        });
    };

    /* ===================== SUBMIT & INLINE ===================== */

    const handleDoubleClick = useCallback((row, field) => {
        const newValue = prompt(`Enter new ${field}`, row[field]);
        if (newValue === null || newValue === "") return;
        if (isNaN(newValue)) {
            dispatchvalue({ type: 'toast', value: { message: 'Only numbers allowed', type: 'warn' } });
            return;
        }
        const payload = {
            Id: row.id,
            [field]: Number(newValue),
            ...(field === 'Min' && { PrevMin: row.Min }),
            ...(field === 'Max' && { PrevMax: row.Max })
        };
        handleSaveChanges(payload);
    }, [UrlLink]);

    const handleSaveChanges = async (payload) => {
        const res = await axios.post(`${UrlLink}LeninManagement/Lenin_MinMax_Master_Detials_link`, payload);
        const resData = res.data;
        const [type, message] = [Object.keys(resData)[0], Object.values(resData)[0]];
        dispatchvalue({ type: 'toast', value: { message, type } });
        setIsLeninMinMaxGet(prev => !prev);
    };

    const handleLeninMinMaxSubmit = async () => {
        const { Id, Location, Department, LeninCategory, LeninType, Min, Max, NurseStation, CurrentStock } = LeninMinMax;

        if (!Location || !Department || !LeninCategory || !LeninType || !NurseStation || Min === '' || Max === '' || CurrentStock === '') {
            dispatchvalue({ type: 'toast', value: { message: 'Please provide all fields', type: 'warn' } });
            return;
        }

        const payload = {
            Location: Number(Location),
            Department: Number(Department),
            LeninCategory: Number(LeninCategory),
            LeninType: Number(LeninType), // Ensure this is the ID
            NurseStation: Number(NurseStation),
            Min: Number(Min),
            Max: Number(Max),
            CurrentStock: Number(CurrentStock),
            created_by: userRecord?.username || ''
        };

        if (Id) payload.Id = Id;

        try {
            const res = await axios.post(`${UrlLink}LeninManagement/Lenin_MinMax_Master_Detials_link`, payload);
            const resData = res.data;
            const [type, message] = [Object.keys(resData)[0], Object.values(resData)[0]];
            dispatchvalue({ type: 'toast', value: { message, type } });
            setIsLeninMinMaxGet(prev => !prev);
            setLeninMinMax({ Id: '', Location: '', Department: '', LeninCategory: '', LeninType: '', Min: '', Max: '', NurseStation: '', CurrentStock: '' });
        } catch (error) { console.error(error); }
    };

    const handleLeninMinMaxChange = (e) => {
        const { name, value } = e.target;
        setLeninMinMax(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredLeninMinMaxData = LeninMinMaxData.filter((row) => {
        return Object.values(row).some((val) =>
            String(val).toLowerCase().includes(searchQuery.toLowerCase())
        );
    });

    return (
        <>
            <div className="Main_container_app">
                <h3>Lenin Dept Wise Min Max</h3>
                <div className="RegisFormcon_1">
                    {Object.keys(LeninMinMax).filter(p => p !== 'Id').map((field, idx) => (
                        <div className="RegisForm_1" key={idx}>
                            <label>{formatLabel(field)} :</label>
                            {['Location', 'Department', 'LeninType', 'LeninCategory', 'NurseStation'].includes(field) ? (
                                <select name={field} value={LeninMinMax[field]} onChange={handleLeninMinMaxChange}>
                                    <option value="">Select</option>
                                    {field === 'Department' && DepartmentData.filter(p => p.Status === 'Active').map(p => <option key={p.id} value={p.id}>{p.DepartmentName}</option>)}
                                    {field === 'Location' && LocationData.filter(p => p.Status === 'Active').map(p => <option key={p.id} value={p.id}>{p.locationName}</option>)}
                                    {field === 'LeninCategory' && LeninCategoryData.filter(p => p.Status === 'Active').map(p => <option key={p.catgId} value={p.catgId}>{p.LeninCategory}</option>)}
                                    {field === 'LeninType' && LeninTypeData.filter(p => p.Status === 'Active' || p.Status === true).map(p => <option key={p.LeninCode} value={p.LeninCode}>{p.LeninType} / {p.LeninSize}</option>)}
                                    {field === 'NurseStation' && NurseStation.filter(p => p.Status === true).map(p => <option key={p.NurseStationid} value={p.NurseStationid}>{p.NurseStationName}</option>)}
                                </select>
                            ) : (
                                <input type="number" name={field} value={LeninMinMax[field]} onChange={handleLeninMinMaxChange} />
                            )}
                        </div>
                    ))}
                </div>
                <div className="Main_container_Btn">
                    <button onClick={handleLeninMinMaxSubmit}>{LeninMinMax.Id ? "Update" : "Add"}</button>
                </div>
                <div className="RegisFormcon_1" style={{ justifyContent: 'flex-end', marginTop: '20px' }}>
                    <div className="RegisForm_1">
                        <label>Search Table:</label>
                        <input type="text" placeholder="Search..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>
                </div>
                <ReactGrid columns={LeninMinMaxColumns} RowData={filteredLeninMinMaxData} />
            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    );
};

export default Lenin_DeptWise_MinMax;