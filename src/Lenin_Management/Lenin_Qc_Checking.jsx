import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import { Button } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete"; // Added Delete Icon

const Lenin_QC_Department_Summary = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector(state => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);
    const dispatch = useDispatch();

    const [departmentData, setDepartmentData] = useState([]);
    const [locationData, setLocationData] = useState([]);
    const [leninCategoryData, setLeninCategoryData] = useState([]);
    const [leninTypeData, setLeninTypeData] = useState([]);
    
    const [qcTableData, setQcTableData] = useState([]);
    const [editId, setEditId] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");

    const [formData, setFormData] = useState({
        Location: '',
        Department: '',
        LeninCategory: '',
        LeninType: '',
        Inspector: userRecord?.username || '',
        Total: 0,
        Approved: 0,
        Rewash: 0,
        Condemned: 0,
        Infected: 'NO',
        InfectionDesc: ''
    });

    // ---------- ReactGrid Columns ----------
    const QcColumns = [
        { key: "id", name: "ID", width: 70, frozen: true },
        { key: "LocationName", name: "Location", width: 160 },
        { key: "DepartmentName", name: "Department", width: 160 },
        { key: "LinenCategory", name: "Linen Category", width: 180 },
        { key: "LinenType", name: "Linen Type", width: 180 },
        { key: "Inspector", name: "Inspector", width: 150 },
        { key: "Total", name: "Total", width: 100 },
        { key: "Approved", name: "Approved", width: 100 },
        { key: "Rewash", name: "Rewash", width: 100 },
        { key: "Condemned", name: "Condemned", width: 120 },
        { key: "Infected", name: "Infected", width: 100 },
        { key: "InfectionDesc", name: "Infection Description", width: 250 },
        {
            key: "actions",
            name: "Actions",
            width: 140, // Increased width for two buttons
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleEditRow(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                    <Button
                        className="cell_btn"
                        onClick={() => handleDeleteRow(params.row)}
                        style={{ color: 'red' }} // Red color for delete
                    >
                        <DeleteIcon />
                    </Button>
                </>
            ),
        }
    ];

    // ---------- Fetch Master Data ----------
    useEffect(() => {
        Promise.all([
            axios.get(`${UrlLink}Masters/Department_Detials_link`),
            axios.get(`${UrlLink}Masters/Location_Detials_link`),
            axios.get(`${UrlLink}LeninManagement/Lenin_Catg_Master_Detials_link`),
            axios.get(`${UrlLink}LeninManagement/LeninMaster_Detials_link`)
        ])
        .then(([deptRes, locRes, catRes, typeRes]) => {
            setDepartmentData(deptRes.data || []);
            setLocationData(locRes.data || []);
            setLeninCategoryData(catRes.data || []);
            setLeninTypeData(typeRes.data || []);
        })
        .catch(err => console.error(err));

        fetchQcInspectionList();
    }, [UrlLink]);

    // ---------- Handle Form Change ----------
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
            ...(name === 'LeninCategory' && { LeninType: '' }) 
        }));
    };

    // ---------- Save QC Inspection ----------
    const handleSaveInspection = async () => {
        if (!formData.Location || !formData.Department || !formData.LeninCategory || !formData.LeninType) {
            dispatch({ type: 'toast', value: { message: 'Please select Location, Department, Category & Type', type: 'warn' } });
            return;
        }
        if (formData.Infected === 'YES' && !formData.InfectionDesc) {
            dispatch({ type: 'toast', value: { message: 'Please provide infection description', type: 'warn' } });
            return;
        }

        try {
            const payload = { ...formData, Id: editId };
            const res = await axios.post(`${UrlLink}LeninManagement/QC_Details_link`, payload);
            const key = Object.keys(res.data)[0];
            const msg = Object.values(res.data)[0];
            dispatch({ type: 'toast', value: { message: msg, type: key } });

            setFormData({
                Location: '',
                Department: '',
                LeninCategory: '',
                LeninType: '',
                Inspector: userRecord?.username || '',
                Total: 0,
                Approved: 0,
                Rewash: 0,
                Condemned: 0,
                Infected: 'NO',
                InfectionDesc: ''
            });
            setEditId(null);
            fetchQcInspectionList();
        } catch (error) {
            console.error(error);
            dispatch({ type: 'toast', value: { message: 'Failed to save inspection', type: 'error' } });
        }
    };

    // ---------- Fetch QC Table ----------
    const fetchQcInspectionList = async () => {
        try {
            const res = await axios.get(`${UrlLink}LeninManagement/QC_Details_link`);
            if (res.status === 200) {
                const data = res.data.map(item => ({
                    id: item.Id,
                    LocationName: item.LocationName,
                    DepartmentName: item.DepartmentName,
                    LinenCategory: item.LeninCategory,
                    LinenType: item.LeninType,
                    Inspector: item.Inspector,
                    Total: item.Total,
                    Approved: item.Approved,
                    Rewash: item.Rewash,
                    Condemned: item.Condemned,
                    Infected: item.Infected,
                    InfectionDesc: item.InfectionDesc
                }));
                setQcTableData(data);
            }
        } catch (error) {
            console.error(error);
        }
    };

    // ---------- Edit Row ----------
    const handleEditRow = (row) => {
        setFormData({
            Location: locationData.find(l => l.locationName === row.LocationName)?.id || '',
            Department: departmentData.find(d => d.DepartmentName === row.DepartmentName)?.id || '',
            LeninCategory: leninCategoryData.find(c => c.LeninCategory === row.LinenCategory)?.catgId || '',
            LeninType: leninTypeData.find(t => t.LeninType === row.LinenType)?.LeninCode || '',
            Inspector: row.Inspector,
            Total: row.Total,
            Approved: row.Approved,
            Rewash: row.Rewash,
            Condemned: row.Condemned,
            Infected: row.Infected,
            InfectionDesc: row.InfectionDesc
        });
        setEditId(row.id);
    };

    // ---------- DELETE HANDLER (NEW) ----------
    const handleDeleteRow = async (row) => {
        if (window.confirm("Are you sure you want to delete this inspection record?")) {
            try {
                const res = await axios.post(`${UrlLink}LeninManagement/QC_Details_link`, {
                    Id: row.id,
                    isDelete: true
                });
                const key = Object.keys(res.data)[0];
                const msg = Object.values(res.data)[0];
                dispatch({ type: 'toast', value: { message: msg, type: key } });
                fetchQcInspectionList();
            } catch (error) {
                console.error(error);
                dispatch({ type: 'toast', value: { message: 'Failed to delete record', type: 'error' } });
            }
        }
    };

    // ---------- FILTER LOGIC ----------
    const filteredRows = qcTableData.filter((row) => {
        return Object.values(row).some((val) =>
            String(val).toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    return (
        <>
            <div className="Main_container_app">
                <h3>Department Wise Linen QC Inspection</h3>

                <div className="RegisFormcon_1">
                    <div className="RegisForm_1">
                        <label>Location :</label>
                        <select name="Location" value={formData.Location} onChange={handleChange}>
                            <option value="">Select</option>
                            {locationData.filter(p => p.Status?.toLowerCase() === 'active').map(p => <option key={p.id} value={p.id}>{p.locationName}</option>)}
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>Department :</label>
                        <select name="Department" value={formData.Department} onChange={handleChange}>
                            <option value="">Select</option>
                            {departmentData.filter(p => p.Status?.toLowerCase() === 'active').map(p => <option key={p.id} value={p.id}>{p.DepartmentName}</option>)}
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>Linen Category :</label>
                        <select name="LeninCategory" value={formData.LeninCategory} onChange={handleChange}>
                            <option value="">Select</option>
                            {leninCategoryData.filter(p => p.Status?.toLowerCase() === 'active').map(p => <option key={p.catgId} value={p.catgId}>{p.LeninCategory}</option>)}
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>Linen Type :</label>
                        <select name="LeninType" value={formData.LeninType} onChange={handleChange}>
                            <option value="">Select</option>
                        { leninTypeData
                                .map(p=> 
                                    <option key={p.LeninCode} value={p.LeninCode}>
                                        {p.LeninType} / {p.LeninSize}
                                    </option>
                                )
                        }
                        </select>                        
                    </div>

                    <div className="RegisForm_1">
                        <label>Inspector :</label>
                        <input name="Inspector" value={formData.Inspector} onChange={handleChange} />
                    </div>

                    <div className="RegisForm_1">
                        <label>Total :</label>
                        <input type="number" name="Total" value={formData.Total} onChange={handleChange} />
                    </div>

                    <div className="RegisForm_1">
                        <label>Approved :</label>
                        <input type="number" name="Approved" value={formData.Approved} onChange={handleChange} />
                    </div>

                    <div className="RegisForm_1">
                        <label>Rewash :</label>
                        <input type="number" name="Rewash" value={formData.Rewash} onChange={handleChange} />
                    </div>

                    <div className="RegisForm_1">
                        <label>Condemned :</label>
                        <input type="number" name="Condemned" value={formData.Condemned} onChange={handleChange} />
                    </div>

                    <div className="RegisForm_1">
                        <label>Infected :</label>
                        <select name="Infected" value={formData.Infected} onChange={handleChange}>
                            <option value="NO">No</option>
                            <option value="YES">Yes</option>
                        </select>
                    </div>

                    {formData.Infected === 'YES' && (
                        <div className="RegisForm_1">
                            <label>Infection Description :</label>
                            <input name="InfectionDesc" value={formData.InfectionDesc} onChange={handleChange} />
                        </div>
                    )}
                </div>

                <div className="Main_container_Btn">
                    <button onClick={handleSaveInspection}>{editId ? 'Update' : 'Add'}</button>
                </div>

                <div className="RegisFormcon_1" style={{justifyContent: 'flex-end', marginTop: '20px'}}>
                    <div className="RegisForm_1">
                        <label>Search All Fields:</label>
                        <input 
                            type="text" 
                            placeholder="Enter keywords..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                        />
                    </div>
                </div>

                <div style={{ width: '100%', overflowX: 'auto', marginTop: '10px' }}>
                    <ReactGrid columns={QcColumns} RowData={filteredRows} />
                </div>
            </div>

            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    );
};

export default Lenin_QC_Department_Summary;