import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from "react-router-dom"; import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import EditIcon from "@mui/icons-material/Edit";
import { useLocation } from 'react-router-dom';

import './AMC.css';


const BreakageForm = () => {
    
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const [editingAssetId, setEditingAssetId] = useState(null);
    const [RackMasterPage, setRackMasterPage] = useState('Breakage Form');
    const [amcs, setAmcs] = useState([]);
    const [maintenanceData, setMaintenanceData] = useState([]);



    const dispatchvalue = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const navigationState = location.state || {};
    const [visitFrequencies, setVisitFrequencies] = useState({});
    const [BreakageFormData, SetBreakageFormData] = useState([]);
    const [assets, setAssets] = useState([]);
    const [departments, setDepartments] = useState([]);


    const [wards, setWards] = useState([]);
    const [roomNos, setRoomNos] = useState([]);
    const [administrations, setAdministrations] = useState([]);
    const [theatreNames, setTheatreNames] = useState([]);
    const [consultationroomNames, setConsultationroomNames] = useState([]);
    const [AssetformData, setAssetformData] = useState({
        assetId: '',
        department: '',
        departmentname: '',
        ward: '',
        room: '',
        Administration: '',
        TheatreName: '',
        Consultationroom: '',
        breakageIssue: '',
        SisterId: '',
        InchargeId: '',
        repairDate: '',
    });
    const [departmentUsers, setDepartmentUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');


    const getLocationFieldName = (locationType) => {
        switch (locationType.toLowerCase()) {
            case 'ward': return 'ward';
            case 'room': return 'room';
            case 'administration': return 'Administration';
            case 'theatre': return 'TheatreName';
            case 'consultationroom': return 'Consultationroom';
            default: return null;
        }
    };

    useEffect(() => {
        if (navigationState && navigationState.prePopulate) {
            const fetchAssetDetails = async () => {
                try {
                    let assetDetails = null;
                    if (navigationState.assetId) {
                        const assetResponse = await axios.get(`${UrlLink}AccetCategory/Get_Maintenance_Log_Summary/${navigationState.assetId}`);
                        assetDetails = assetResponse.data;
                        console.log("assetResponse:", assetResponse.data);

                    }

                    setAssetformData(prev => ({
                        ...prev,
                        assetId: navigationState.assetId.toString(),
                        department: navigationState.departmentId ? navigationState.departmentId.toString() : (assetDetails?.department_id?.toString() || ''),
                        breakageIssue: navigationState.breakageIssue || assetDetails?.remarks || '',
                        repairDate: new Date().toISOString().split('T')[0]
                    }));

                    if (navigationState.departmentId || assetDetails?.department_id) {
                        const deptEvent = {
                            target: {
                                name: 'department',
                                value: navigationState.departmentId ? navigationState.departmentId.toString() : assetDetails.department_id.toString()
                            }
                        };
                        handleInputChange(deptEvent);

                        if (assetDetails?.location_type && assetDetails?.location_id) {
                            const locationField = getLocationFieldName(assetDetails.location_type);
                            if (locationField) {
                                const locationEvent = {
                                    target: {
                                        name: locationField,
                                        value: assetDetails.location_id.toString()
                                    }
                                };
                                handleInputChange(locationEvent);
                            }
                        }
                    }
                } catch (err) {
                    console.error("Error fetching maintenance log summary:", err);
                    setError("Failed to fetch maintenance log summary: " + err.message);

                    setAssetformData(prev => ({
                        ...prev,
                        assetId: navigationState.assetId.toString(),
                        department: navigationState.departmentId ? navigationState.departmentId.toString() : '',
                        breakageIssue: navigationState.breakageIssue || '',
                        repairDate: new Date().toISOString().split('T')[0]
                    }));

                    if (navigationState.departmentId) {
                        const deptEvent = {
                            target: {
                                name: 'department',
                                value: navigationState.departmentId.toString()
                            }
                        };
                        handleInputChange(deptEvent);
                    }
                }
            };

            fetchAssetDetails();
        }
    }, [navigationState, UrlLink]);

    useEffect(() => {
        const fetchDepartmentUsers = async () => {
            if (AssetformData.department) {
                try {
                    const response = await axios.get(`${UrlLink}AccetCategory/get_department_users`, {
                        params: {
                            department_id: AssetformData.department,
                            location_id: AssetformData.room || AssetformData.ward || AssetformData.Administration || AssetformData.TheatreName || AssetformData.Consultationroom
                        }
                    });
                    console.log("get_department_users", response.data);

                    setDepartmentUsers(response.data || []);
                } catch (err) {
                    console.error("Error fetching department users:", err);
                    setDepartmentUsers([]);
                }
            }
        };
        fetchDepartmentUsers();
    }, [AssetformData.department, AssetformData.room, AssetformData.ward, AssetformData.Administration, AssetformData.TheatreName, AssetformData.Consultationroom, UrlLink]);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await axios.get(`${UrlLink}AccetCategory/Asset_Reg_Get/`);
                setAssets(response.data || []);
            } catch (error) {
                console.log("Error fetching Assets:", error);
                setError("Failed to fetch assets: " + error.message);
                setAssets([]);
            }
        };

        const fetchDepartmentList = async () => {
            try {
                const res = await axios.get(`${UrlLink}Masters/Department_Detials_link`);
                const data = Array.isArray(res.data) ? res.data : [];
                setDepartments(data);
                console.log("Departments fetched:", data);
            } catch (err) {
                console.error("Error fetching departments:", err);
                setError("Failed to fetch departments: " + err.message);
                setDepartments([]);
            }
        };

        const fetchWardList = async () => {
            try {
                const res = await axios.get(`${UrlLink}Masters/Ward_Master_Detials_link`);
                setWards(res.data || []);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch wards: " + err.message);
                setWards([]);
            }
        };

        const fetchWardList_Roomno = async () => {
            try {
                const res = await axios.get(`${UrlLink}Masters/Room_Master_Detials_link`);
                setRoomNos(res.data || []);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch room numbers: " + err.message);
                setRoomNos([]);
            }
        };

        const fetchAdministrationNameData = async () => {
            try {
                const res = await axios.get(`${UrlLink}Masters/Administration_Details_link`);
                setAdministrations(res.data || []);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch administrations: " + err.message);
                setAdministrations([]);
            }
        };

        const fetchTheatreName = async () => {
            try {
                const res = await axios.get(`${UrlLink}OT/OtTheaterMaster_Detials_link`);
                setTheatreNames(res.data || []);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch theatre names: " + err.message);
                setTheatreNames([]);
            }
        };

        const fetchConsultation_Room = async () => {
            try {
                const res = await axios.get(`${UrlLink}Masters/Consultation_Room_Details_link`);
                setConsultationroomNames(res.data || []);
            } catch (err) {
                console.error(err);
                setError("Failed to fetch consultation rooms: " + err.message);
                setConsultationroomNames([]);
            }
        };

        const fetchBreakageReports = async () => {
            try {
                const res = await axios.get(`${UrlLink}AccetCategory/breakage_report_list`);
                const breakageData = Array.isArray(res.data) ? res.data : [];
                SetBreakageFormData(breakageData);

                const visitFreqRes = await axios.get(`${UrlLink}AccetCategory/get_visit_frequency_counts`);
                setVisitFrequencies(visitFreqRes.data || {});
            } catch (err) {
                console.error("Error fetching breakage reports:", err);
                setError("Failed to fetch breakage reports: " + (err.response?.data?.message || err.message));
                SetBreakageFormData([]);
            }
        };

        setLoading(true);
        Promise.all([
            fetchAssets(),
            fetchDepartmentList(),
            fetchWardList(),
            fetchWardList_Roomno(),
            fetchAdministrationNameData(),
            fetchTheatreName(),
            fetchConsultation_Room(),
            fetchBreakageReports(),
            fetchAMCs(),
            fetchMaintenanceList(),
        ]).finally(() => setLoading(false));
    }, [UrlLink]);

    useEffect(() => {
        console.log("Current departmentname:", AssetformData.departmentname);
    }, [AssetformData.departmentname]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAssetformData((prev) => {
            let updatedData = { ...prev, [name]: value };
            if (name === "department") {
                const selectedDept = departments.find((dept) => dept?.id?.toString() === value);
                updatedData.department = value ? parseInt(value) : '';
                updatedData.departmentname = selectedDept ? selectedDept.DepartmentName : '';
                updatedData.ward = '';
                updatedData.room = '';
                updatedData.Administration = '';
                updatedData.TheatreName = '';
                updatedData.Consultationroom = '';
                updatedData.SisterId = '';
                updatedData.InchargeId = '';
            }
            return updatedData;
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            const payload = {
                ...AssetformData,
                assetId: parseInt(AssetformData.assetId) || null,
                department_id: parseInt(AssetformData.department),
                ward: parseInt(AssetformData.ward) || null,
                room: parseInt(AssetformData.room) || null,
                Administration: parseInt(AssetformData.Administration) || null,
                TheatreName: parseInt(AssetformData.TheatreName) || null,
                Consultationroom: parseInt(AssetformData.Consultationroom) || null,
                repairDate: AssetformData.repairDate || null,
            };

            if (editingAssetId) {
                const updateResponse = await axios.put(`${UrlLink}AccetCategory/breakage_report_update/${editingAssetId}`, payload);
                console.log("Update response:", updateResponse.data);
            } else {
                const createResponse = await axios.post(`${UrlLink}AccetCategory/breakage_report_create`, payload);
                console.log("Create response:", createResponse.data);
            }

            const res = await axios.get(`${UrlLink}AccetCategory/breakage_report_list`);
            console.log("breakage_report_list", res.data);

            SetBreakageFormData(Array.isArray(res.data) ? res.data : []);

            setAssetformData({
                assetId: '',
                department: '',
                departmentname: '',
                ward: '',
                room: '',
                Administration: '',
                TheatreName: '',
                Consultationroom: '',
                breakageIssue: '',
                SisterId: '',
                InchargeId: '',
                repairDate: '',
            });
            setEditingAssetId(null);


            if (navigationState && navigationState.fromMaintenance) {
                setRackMasterPage('Breakage Log');
            }
        } catch (err) {
            setError('Error submitting report: ' + (err.response?.data?.message || err.message));
            console.error("Submit error:", err);
        }
    };

    const handleEdit = (row) => {
        setEditingAssetId(row.id);
        setAssetformData({
            assetId: row.assetId?.toString() || '',
            department: row.department?.toString() || '',
            departmentname: row.department_name || '',
            ward: row.ward?.toString() || '',
            room: row.room?.toString() || '',
            Administration: row.Administration?.toString() || '',
            TheatreName: row.TheatreName?.toString() || '',
            Consultationroom: row.Consultationroom?.toString() || '',
            breakageIssue: row.breakageIssue || '',
            SisterId: row.SisterId?.toString() || '',
            InchargeId: row.InchargeId?.toString() || '',
            repairDate: row.repairDate || '',
        });
    };

    const getLocationInfo = (row) => {
        if (row.department_name?.toUpperCase() === 'IP') return { ward: row.ward_name || 'N/A', room: row.room_name || 'N/A' };
        if (row.department_name?.toUpperCase() === 'ADMINISTRATION') return { administration: row.administration_name || 'N/A' };
        if (row.department_name?.toUpperCase() === 'OT') return { theatre: row.theatre_name || 'N/A' };
        if (row.department_name?.toUpperCase() === 'OP') return { consultation: row.consultation_room_name || 'N/A' };
        return { location: 'N/A' };
    };

    const BreakageFormColumn = [
        { key: 'id', name: 'ID' },
        { key: 'repairDate', name: 'Repair Date', renderCell: (params) => params.row.repairDate || 'N/A' },
        { key: 'created_at', name: 'Created Date', renderCell: (params) => new Date(params.row.created_at).toLocaleDateString() },
        { key: 'asset_name', name: 'Article Breakage Name', renderCell: (params) => params.row.asset_name || 'N/A' },
        { key: 'DepartmentName', name: 'Department Name', renderCell: (params) => params.row.department_name || 'N/A' },
        {
            key: 'location_details',
            name: 'Location Details',
            renderCell: (params) => {
                const locationInfo = getLocationInfo(params.row);
                if (params.row.department_name?.toUpperCase() === 'IP') return `Ward: ${locationInfo.ward}, Room: ${locationInfo.room}`;
                if (params.row.department_name?.toUpperCase() === 'ADMINISTRATION') return `Administration: ${locationInfo.administration}`;
                if (params.row.department_name?.toUpperCase() === 'OT') return `Theatre: ${locationInfo.theatre}`;
                if (params.row.department_name?.toUpperCase() === 'OP') return `Consultation Room: ${locationInfo.consultation}`;
                return 'N/A';
            },
        },
        { key: 'breakageIssue', name: 'Breakage Issue', renderCell: (params) => params.row.breakageIssue || 'N/A' },
        { key: 'SisterName', name: 'User', renderCell: (params) => params.row.SisterName || 'N/A' },
        { key: 'InchargeId', name: 'HOD', renderCell: (params) => params.row.InchargeName || 'N/A' },
        {
            key: 'actions',
            name: 'Actions',
            renderCell: (params) => (
                <button onClick={() => handleEdit(params.row)} className="cell_btn">
                    <EditIcon className="check_box_clrr_cancell" />
                </button>
            ),
        },
    ];

    // --------------------------------------Maintanace LOG----------------------------------------------------

    const [submittedData, setSubmittedData] = useState([]);
    const [errors, setErrors] = useState({});
    const [selectedAssetId, setSelectedAssetId] = useState(null);


    const [showPopup, setShowPopup] = useState(false);
    const [updateFormData, setUpdateFormData] = useState({
        date: '',
        notes: ''
    });


    const handleUpdateStatus = async (assetId) => {
        setSelectedAssetId(assetId);
        setUpdateFormData({ date: '', notes: '' });
        setErrors({});
        setShowPopup(true);
        await fetchUpdatedStatus(assetId); 
    };
    useEffect(() => {
        if (selectedAssetId) {
            fetchUpdatedStatus();
        }
    }, [selectedAssetId]);
    const handleInputChange_Asset = (e) => {
        const { name, value } = e.target;
        setUpdateFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleClosePopup = () => {
        setShowPopup(false);
        setUpdateFormData({ date: '', notes: '' });
        setErrors({});
    };


    const handleSubmitUpdate = async (e) => {
        e.preventDefault();
        setErrors({});
        if (!updateFormData.date) {
            setErrors({ date: 'Date is required' });
            return;
        }
        try {
            const response = await axios.post(`${UrlLink}AccetCategory/post_Update_Status`, {
                assetId: selectedAssetId,
                date: updateFormData.date,
                note: updateFormData.notes,
            });
            const newRecord = {
                id: response.data.id,
                assetName: assets.find(a => a.id === selectedAssetId)?.AssetName || 'Unknown Asset',
                date: updateFormData.date,
                note: updateFormData.notes || 'No notes',
            };
            setSubmittedData(prev => [...prev, newRecord]); // Append new data
            setUpdateFormData({ date: '', notes: '' }); // Reset form
            await fetchUpdatedStatus(selectedAssetId); // Refresh data
        } catch (error) {
            setErrors({ general: error.response?.data?.message || 'Error submitting update' });
        }
    };

    const fetchUpdatedStatus = async (assetId) => {
        if (!assetId) return;
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/get_Update_Status/${assetId}`);
            const updatedData = Array.isArray(response.data)
                ? response.data.map(item => ({
                    id: item.id,
                    assetName: item.assetName || assets.find(a => a.id === assetId)?.AssetName || 'Unknown Asset',
                    date: item.date,
                    note: item.note || item.notes || 'No notes',
                }))
                : [];
            setSubmittedData(updatedData);
        } catch (error) {
            console.error("Error fetching updated status:", error);
            setErrors({ general: "Error fetching updated status" });
            setSubmittedData([]);
        }
    };

    useEffect(() => {
        if (selectedAssetId) {
            fetchUpdatedStatus();
        }
    }, [selectedAssetId]);

    const fetchAMCs = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/AMC_CMC_GET`);
            setAmcs(response.data.map(item => ({
                asset_id: item.asset_id,
                asset_type: item.asset_type,
                provider: item.provider,
                visit_frequency: item.visit_frequency,
                createdAt: Date.now()
            })));
            console.log("AMC", response.data);

        } catch (error) {
            console.error('Error fetching AMCs:', error);
            if (error.response) {
                console.error('Error Response:', error.response.data);
                setError(`Error: ${error.response.data.message || 'An error occurred!'}`);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    const fetchMaintenanceList = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/get_maintenance_list`);
            console.log("Get_maintenance_list", response.data);

            setMaintenanceData(
                response.data.map((item) => ({
                    asset_id: item.asset,
                    service_by: item.ServiceBy,
                    provider_name: item.service_provider_name,
                    technician_name: item.technician_name,
                    createdAt: Date.now()
                }))
            );
        } catch (error) {
            console.error('Error fetching maintenance list:', error);
            if (error.response) {
                console.error('Error Response:', error.response.data);
                setError(`Error: ${error.response.data.message || 'An error occurred!'}`);
            } else {
                setError('An unexpected error occurred.');
            }
        }
    };

    const handleProceedToRepair = async (breakage) => {
        const matchingMaintenance = maintenanceData.find((amc) => amc.asset_id === breakage.assetId) || {};
        const matchingAMC = amcs.find((amc) => amc.asset_id === breakage.assetId) || {};
        const serviceName =
            matchingMaintenance.service_by === 'ServiceProvider'
                ? matchingMaintenance.provider_name
                : matchingMaintenance.service_by === 'Technician'
                    ? matchingMaintenance.technician_name
                    : 'N/A';

        const maxVisits = parseInt(matchingAMC.visit_frequency) || 0;
        const currentVisits = visitFrequencies[breakage.assetId]?.count || 0;

        if (currentVisits < maxVisits) {
            try {
                await axios.post(`${UrlLink}AccetCategory/increment_visit_frequency`, {
                    assetId: breakage.assetId,
                });

                setVisitFrequencies((prev) => ({
                    ...prev,
                    [breakage.assetId]: {
                        count: currentVisits + 1,
                        lastRepairVisit: breakage.repairDate ? currentVisits + 1 : prev[breakage.assetId]?.lastRepairVisit || 0,
                    },
                }));
            } catch (err) {
                console.error("Error incrementing visit frequency:", err);
                setError("Failed to update visit frequency: " + err.message);
                return;
            }
        }

        setSelectedAssetData({
            assetId: breakage.assetId,
            assetName: breakage.asset_name,
            breakageDoneBy: serviceName,
        });
        setEditingDataId(null);
        setRackMasterPage("Repair Fixd");
    };

    const popupStyle = {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        width: '400px',
        maxWidth: '90%'
    };
    const overlayStyle = {
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        zIndex: 999
    };
    const inputStyle = {
        width: '100%',
        padding: '8px',
        marginBottom: '15px',
        borderRadius: '4px',
        border: '1px solid #d1d5db',
        fontSize: '14px'
    };

    const submitButtonStyle = {
        backgroundColor: '#3b82f6',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        width: '100%',
        '&:hover': {
            backgroundColor: '#2563eb'
        }
    };

    const cancelButtonStyle = {
        backgroundColor: '#ef4444',
        color: '#fff',
        padding: '10px 20px',
        border: 'none',
        borderRadius: '6px',
        cursor: 'pointer',
        width: '100%',
        fontSize: '14px',
        fontWeight: '500',
        transition: 'background-color 0.2s ease',
        marginTop: '10px',
        '&:hover': {
            backgroundColor: '#dc2626'
        }
    };


    const tableContainerStyle = {
        overflowX: 'auto',
        padding: '10px',
        backgroundColor: '#f9fafb',
        borderRadius: '8px',
        maxWidth: '100%',
    };

    const tableStyle = {
        width: '100%',
        borderCollapse: 'collapse',
        minWidth: '800px',
        backgroundColor: '#fff',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        borderRadius: '8px',
        overflow: 'hidden',
    };

    const tableHeaderStyle = {
        textAlign: 'center',
        padding: '12px 10px',
        borderBottom: '2px solid #e5e7eb',
        fontWeight: '600',
        fontSize: '14px',
        color: '#1f2937',
        backgroundColor: '#f3f4f6',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    };

    const tableRowStyle = {
        borderBottom: '1px solid #e5e7eb',
        transition: 'background-color 0.2s ease, transform 0.1s ease',
        '&:hover': {
            backgroundColor: '#f9fafb',
            transform: 'scale(1.01)',
        },
    };

    const tableCellStyle = {
        padding: '12px 10px',
        verticalAlign: 'middle',
        fontSize: '14px',
        color: '#4b5563',
        textAlign: 'center',
    };

    const updateButtonStyle = {
        backgroundColor: '#f59e0b',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '6px',
        color: '#fff',
        fontSize: '13px',
        padding: '8px 12px',
        fontWeight: '500',
        transition: 'background-color 0.2s ease, transform 0.1s ease',
        '&:hover': {
            backgroundColor: '#d97706',
            transform: 'translateY(-1px)',
        },
    };

    const repairButtonStyle = {
        backgroundColor: '#10b981',
        border: 'none',
        cursor: 'pointer',
        borderRadius: '6px',
        color: '#fff',
        fontSize: '13px',
        padding: '8px 12px',
        fontWeight: '500',
        transition: 'background-color 0.2s ease, transform 0.1s ease',
        '&:hover': {
            backgroundColor: '#059669',
            transform: 'translateY(-1px)',
        },
    };

    const headingStyle = {
        fontSize: '24px',
        fontWeight: '600',
        color: '#1f2937',
        marginBottom: '20px',
        textAlign: 'center',
    };

    const noDataStyle = {
        fontSize: '16px',
        color: '#6b7280',
        textAlign: 'center',
        padding: '20px',
    };
    const submittedDataContainerStyle = {
        bottom: '20px',
        left: '50%',
        backgroundColor: '#fff',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        zIndex: 1000,
        width: '95%',
        maxWidth: '800px',
        maxHeight: '200px',
        overflowY: 'auto'
    };

    const submittedItemStyle = {
        padding: '10px',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: '14px',
        color: '#1f2937'
    };


    // ------------------------------------Repair fixd Page---------------------------------------------------------
    const [selectedAssetData, setSelectedAssetData] = useState(null);
    const [editingDataId, setEditingDataId] = useState(null);
    const [RepairData, setRepairData] = useState([]);
    const [repairFormData, setRepairFormData] = useState({
        assetId: '',
        actionDate: '',
        breakageDoneBy: '',
        breakageDoneDate: '',
        partReplaced: '',
        storeReceived: '',
        receivedBy: '',
        amount: '',
        remark: ''
    });



    useEffect(() => {
        if (selectedAssetData) {
            setRepairFormData((prev) => ({
                ...prev,
                assetId: selectedAssetData.assetId?.toString() || '',
                breakageDoneBy: selectedAssetData.breakageDoneBy || '',
            }));
        }
    }, [selectedAssetData]);

    const handleRepairInputChange = (e) => {
        const { name, value } = e.target;
        setRepairFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };
    useEffect(() => {
        const fetchRepairRecords = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${UrlLink}AccetCategory/get_repair_fixd_records`);

                if (Array.isArray(response.data)) {
                    setRepairData(response.data);
                } else {
                    console.warn("Expected array data but received:", response.data);
                    setRepairData([]);
                }
            } catch (error) {
                setError(error.response?.data?.message || error.message);
                console.error("Error fetching repair records:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchRepairRecords();
    }, []);

    const handleRepairSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const payload = {
                ...repairFormData,
                assetId: parseInt(repairFormData.assetId) || null,
                amount: parseFloat(repairFormData.amount) || 0,
            };

            let response;
            if (editingDataId) {
                response = await axios.put(`${UrlLink}AccetCategory/repair_fixd_update/${editingDataId}`, payload);
                console.log('Repair record updated:', response.data);
            } else {
                response = await axios.post(`${UrlLink}AccetCategory/repair_fixd_create`, payload);
                console.log('Repair record created:', response.data);
            }

            const res = await axios.get(`${UrlLink}AccetCategory/get_repair_fixd_records`);
            setRepairData(Array.isArray(res.data) ? res.data : []);
            console.log("get_repair_fixd_records", res.data);

            setRepairFormData({
                assetId: '',
                actionDate: '',
                breakageDoneBy: '',
                breakageDoneDate: '',
                partReplaced: '',
                storeReceived: '',
                receivedBy: '',
                amount: '',
                remark: ''
            });
            setEditingDataId(null);
            setSelectedAssetData(null);

            setRackMasterPage('Repair Fixd');
        } catch (err) {
            setError('Error submitting repair record: ' + (err.response?.data?.message || err.message));
            console.error("Submit error:", err);
        }
    };

    const handleRepairEdit = (row) => {
        setEditingDataId(row.id);
        setSelectedAssetData({
            assetId: row.assetId,
            assetName: row.assetName || 'N/A',
            breakageDoneBy: row.breakageDoneBy,
        });
        setRepairFormData({
            assetId: row.assetId?.toString() || '',
            actionDate: row.actionDate || '',
            breakageDoneBy: row.breakageDoneBy || '',
            breakageDoneDate: row.breakageDoneDate || '',
            partReplaced: row.partReplaced || '',
            storeReceived: row.storeReceived || '',
            receivedBy: row.receivedBy || '',
            amount: row.amount?.toString() || '',
            remark: row.remark || ''
        });
        setRackMasterPage('Repair Fixd');
    };



    const RepairColumn = [
        { key: "assetName", name: 'Asset Name' },
        { key: 'breakageDoneBy', name: 'Breakage Done By' },

        { key: 'actionDate', name: 'Take Action Date' },
        { key: 'breakageDoneDate', name: 'Breakage Done Date' },

        { key: 'partReplaced', name: 'Any Part Replaced' },
        { key: 'amount', name: 'Amount' },
        { key: 'storeReceived', name: 'Store Received' },
        { key: "receivedBy", name: "Received By" },

        { key: 'remark', name: 'Remark' },
        {
            key: 'actions',
            name: 'Actions',
            renderCell: (params) => (
                <button onClick={() => handleRepairEdit(params.row)} className="cell_btn">
                    <EditIcon className="check_box_clrr_cancell" />
                </button>
            ),
        },
    ];



    return (
        <div className="Main_container_app">
            <br />
            <div className="RegisterTypecon">
                <div className="RegisterType">
                    {["Breakage Form", "Breakage Log"].map((p, ind) => (
                        <div className="registertypeval" key={ind}>
                            <input
                                type="radio"
                                id={p}
                                name="appointment_type"
                                checked={RackMasterPage === p}
                                onChange={() => setRackMasterPage(p)}
                                value={p}
                            />
                            <label htmlFor={p}>{p}</label>
                        </div>
                    ))}
                </div>
            </div>

            {RackMasterPage === "Breakage Form" && (
                <div className="Main_container_app">
                    <h3>Breakage Form</h3>

                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label>Asset Name <span>:</span></label>
                            <select
                                name="assetId"
                                value={AssetformData.assetId}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Asset</option>
                                {assets.map((asset) => (
                                    <option key={asset.id} value={asset.id}>
                                        {asset.AssetName || asset.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="RegisForm_1">
                            <label>Department <span>:</span></label>
                            <select name="department" value={AssetformData.department} onChange={handleInputChange} required>
                                <option value="">Select</option>
                                {departments.length > 0 ? (
                                    departments.map((department) => (
                                        <option key={department.id} value={department.id}>
                                            {department.DepartmentName}
                                        </option>
                                    ))
                                ) : (
                                    <option disabled>No departments available</option>
                                )}
                            </select>
                        </div>

                        {(AssetformData.departmentname?.toUpperCase() || '') === 'IP' && (
                            <>
                                <div className="RegisForm_1">
                                    <label>Ward <span>:</span></label>
                                    <select name="ward" value={AssetformData.ward} onChange={handleInputChange} required>
                                        <option value="">Select Ward</option>
                                        {wards.map((ward) => (
                                            <option key={ward.id} value={ward.id}>
                                                {ward.WardName || ward.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="RegisForm_1">
                                    <label>Room No <span>:</span></label>
                                    <select name="room" value={AssetformData.room} onChange={handleInputChange} required>
                                        <option value="">Select Room No</option>
                                        {roomNos.map((room) => (
                                            <option key={room.id} value={room.id}>
                                                {room.Roomno || room.roomNo}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}

                        {(AssetformData.departmentname?.toUpperCase() || '') === 'ADMINISTRATION' && (
                            <div className="RegisForm_1">
                                <label>Administration <span>:</span></label>
                                <select name="Administration" value={AssetformData.Administration} onChange={handleInputChange} required>
                                    <option value="">Select Administration</option>
                                    {administrations.map((administration) => (
                                        <option key={administration.id} value={administration.id}>
                                            {administration.AdministrationName || administration.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {(AssetformData.departmentname?.toUpperCase() || '') === 'OT' && (
                            <div className="RegisForm_1">
                                <label>Theatre Name <span>:</span></label>
                                <select name="TheatreName" value={AssetformData.TheatreName} onChange={handleInputChange} required>
                                    <option value="">Select Theatre Name</option>
                                    {theatreNames.map((theatre) => (
                                        <option key={theatre.id} value={theatre.id}>
                                            {theatre.TheatreName || theatre.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {(AssetformData.departmentname?.toUpperCase() || '') === 'OP' && (
                            <div className="RegisForm_1">
                                <label>Consultation Room Name <span>:</span></label>
                                <select name="Consultationroom" value={AssetformData.Consultationroom} onChange={handleInputChange} required>
                                    <option value="">Select Consultation Room Name</option>
                                    {consultationroomNames.map((room) => (
                                        <option key={room.id} value={room.id}>
                                            {room.ConsultationroomName || room.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="RegisForm_1">
                            <label>Breakage Issue <span>:</span></label>
                            <textarea
                                name="breakageIssue"
                                value={AssetformData.breakageIssue}
                                onChange={handleInputChange}
                                placeholder="Describe the breakage issue"
                                rows="4"
                                style={{ width: '100px', padding: '5px', height: '60px' }}
                                required
                            />
                        </div>
                        <div className="RegisForm_1">
                            <label>Repair Date <span>:</span></label>
                            <input
                                type="date"
                                name="repairDate"
                                value={AssetformData.repairDate}
                                onChange={handleInputChange}
                                required
                            />
                        </div>
                        <div className="RegisForm_1">
                            <label>User <span>:</span></label>
                            <select
                                name="SisterId"
                                value={AssetformData.SisterId}
                                onChange={handleInputChange}
                            >
                                <option value="">Select User</option>
                                {departmentUsers
                                    .filter((user) => user.role !== "HOD")
                                    .map((user) => (
                                        <option key={user.user_id} value={user.user_id}>
                                            {user.first_name} {user.last_name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                        <div className="RegisForm_1">
                            <label>HOD <span>:</span></label>
                            <select
                                name="InchargeId"
                                value={AssetformData.InchargeId}
                                onChange={handleInputChange}
                            >
                                <option value="">Select HOD</option>
                                {departmentUsers
                                    .filter((user) => user.role === "HOD")
                                    .map((user) => (
                                        <option key={user.user_id} value={user.user_id}>
                                            {user.first_name} {user.last_name}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    </div>

                    <div className="Main_container_Btn">
                        <button onClick={handleSubmit} style={{ width: "85px" }}>
                            {editingAssetId ? "Update" : "Submit"}
                        </button>
                    </div>

                    <ReactGrid columns={BreakageFormColumn} RowData={BreakageFormData} />
                </div>
            )}

            {RackMasterPage === "Breakage Log" && (
                <div className="Main_container_app" style={{ padding: '20px' }}>
                    <h3 style={headingStyle}>Breakage Log</h3>
                    <div style={tableContainerStyle}>
                        {BreakageFormData.length > 0 ? (
                            <table style={tableStyle}>
                                <thead>
                                    <tr>
                                        <th style={tableHeaderStyle}>Asset</th>
                                        <th style={tableHeaderStyle}>Department</th>
                                        <th style={tableHeaderStyle}>Service By</th>
                                        <th style={tableHeaderStyle}>Visit Frequency</th>
                                        <th style={tableHeaderStyle}>Breakage Issue</th>
                                        <th style={tableHeaderStyle}>Date Repaired</th>
                                        <th style={tableHeaderStyle}>Date Register</th>
                                        <th style={tableHeaderStyle}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {BreakageFormData
                                        .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                                        .map((breakage) => {
                                            const assetId = breakage.assetId || breakage.asset_id;
                                            const currentVisits = visitFrequencies[assetId]?.count || 0;
                                            const matchingAMC = amcs.find((amc) => amc.asset_id === assetId) || {};
                                            const matchingMaintenance = maintenanceData.find((m) => m.asset_id === assetId) || {};
                                            const serviceLabel = matchingMaintenance.service_by === "ServiceProvider"
                                                ? 'Provider'
                                                : matchingMaintenance.service_by === "Technician"
                                                    ? 'Technician'
                                                    : 'N/A';
                                            const serviceName = matchingMaintenance.service_by === 'ServiceProvider'
                                                ? matchingMaintenance.provider_name
                                                : matchingMaintenance.service_by === 'Technician'
                                                    ? matchingMaintenance.technician_name
                                                    : 'N/A';
                                            const maxVisits = parseInt(matchingAMC.visit_frequency) || 0;
                                            const visitDisplay = currentVisits >= maxVisits
                                                ? 'Visit Frequency Closed'
                                                : `${currentVisits}/${maxVisits}`;

                                            return (
                                                <tr key={breakage.id} style={tableRowStyle}>
                                                    <td style={tableCellStyle}>{matchingAMC.asset_type || 'N/A'} - {breakage.asset_name || breakage.assetName}</td>
                                                    <td style={tableCellStyle}>{breakage.department_name || breakage.DepartmentName}</td>
                                                    <td style={tableCellStyle}>{serviceLabel}: {serviceName || 'N/A'}</td>
                                                    <td style={tableCellStyle}>{visitDisplay}</td>
                                                    <td style={tableCellStyle}>{breakage.breakageIssue || breakage.breakage_issue}</td>
                                                    <td style={tableCellStyle}>{breakage.repairDate || breakage.repair_date || 'N/A'}</td>
                                                    <td style={tableCellStyle}>{new Date(breakage.created_at).toLocaleDateString()}</td>
                                                    <td style={tableCellStyle}>
                                                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                                                            <button
                                                                style={updateButtonStyle}
                                                                onClick={() => handleUpdateStatus(assetId)}
                                                            >
                                                                Update Status
                                                            </button>
                                                            <button
                                                                style={repairButtonStyle}
                                                                onClick={() => handleProceedToRepair(breakage)}
                                                            >
                                                                Proceed to Repair
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        ) : (
                            <p style={noDataStyle}>No breakage data available.</p>
                        )}
                    </div>

                    {showPopup && (
                        <>
                            <div style={overlayStyle} onClick={handleClosePopup} />
                            <div style={popupStyle}>
                                <h3 style={{ margin: '0 0 20px 0', fontSize: '20px', color: '#1f2937', textAlign: 'center' }}>
                                    Update Breakage Status
                                </h3>

                                <div className="form-group">
                                    <label>Date *</label>
                                    <input
                                        type="date"
                                        name="date"
                                        value={updateFormData.date}
                                        onChange={handleInputChange_Asset}
                                        style={inputStyle}
                                        required
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                    {errors.date && <span className="error-message" style={{ color: 'red' }}>{errors.date}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Notes</label>
                                    <textarea
                                        name="notes"
                                        value={updateFormData.notes}
                                        onChange={handleInputChange_Asset}
                                        style={{ ...inputStyle, height: '100px', resize: 'vertical' }}
                                        placeholder="Enter any additional notes"
                                    />
                                    {errors.notes && <span className="error-message" style={{ color: 'red' }}>{errors.notes}</span>}
                                </div>

                                <div className="button-group">
                                    <button
                                        type="submit"
                                        style={submitButtonStyle}
                                        disabled={Object.keys(errors).length > 0}
                                        onClick={handleSubmitUpdate}
                                    >
                                        Update Status
                                    </button>
                                    <button
                                        type="button"
                                        style={cancelButtonStyle}
                                        onClick={handleClosePopup}
                                    >
                                        Cancel
                                    </button>
                                </div>

                                {/* Display submitted data by default when popup opens */}
                                {submittedData.length > 0 ? (
                                    <div style={submittedDataContainerStyle}>
                                        <h4 style={{ margin: '0 0 10px 0', color: '#1f2937' }}>Updated Status Records</h4>
                                        {submittedData
                                            .sort((a, b) => new Date(b.date) - new Date(a.date)) // Sort by date descending
                                            .map((item) => (
                                                <div key={item.id} style={submittedItemStyle}>
                                                    <span>{item.assetName} - {new Date(item.date).toLocaleDateString()}</span>
                                                    <span>{item.note || 'No notes'}</span>
                                                </div>
                                            ))}
                                    </div>
                                ) : (
                                    <p style={{ textAlign: 'center', color: '#6b7280', marginTop: '10px' }}>No updates available for this asset.</p>
                                )}
                                {errors.general && <p style={{ color: 'red', textAlign: 'center' }}>{errors.general}</p>}
                            </div>
                        </>
                    )}
                </div>
            )}

            {RackMasterPage === 'Repair Fixd' && (
                <div className='Main_container_app'>
                    <h3>Repair Fixed Page</h3>

                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label>Asset Name <span>:</span></label>
                            <input
                                type="text"
                                name="assetName"
                                value={selectedAssetData?.assetName || ''}
                                readOnly
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label>Breakage Done By <span>:</span></label>
                            <input
                                type="text"
                                name="breakageDoneBy"
                                value={repairFormData.breakageDoneBy}
                                onChange={handleRepairInputChange}
                                readOnly
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label>Take Action Date <span>:</span></label>
                            <input
                                type="date"
                                name="actionDate"
                                value={repairFormData.actionDate}
                                onChange={handleRepairInputChange}
                                required
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label>Breakage Done Date <span>:</span></label>
                            <input
                                type="date"
                                name="breakageDoneDate"
                                value={repairFormData.breakageDoneDate}
                                onChange={handleRepairInputChange}
                                required
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label>Any Part Replaced <span>:</span></label>
                            <textarea
                                name="partReplaced"
                                value={repairFormData.partReplaced}
                                onChange={handleRepairInputChange}
                                placeholder="Enter parts replaced (if any)"
                                rows="4"
                                style={{ width: '100%', padding: '5px', height: '60px' }}
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label>Amount <span>:</span></label>
                            <input
                                type="number"
                                name="amount"
                                value={repairFormData.amount}
                                onChange={handleRepairInputChange}
                                placeholder="Enter amount"
                                min="0"
                                step="0.01"
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label>Store Received <span>:</span></label>
                            <input
                                type="text"
                                name="storeReceived"
                                value={repairFormData.storeReceived}
                                onChange={handleRepairInputChange}
                                placeholder="Enter store received details"
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label>Received By <span>:</span></label>
                            <input
                                type="text"
                                name="receivedName"
                                value={repairFormData.receivedName}
                                onChange={handleRepairInputChange}
                                placeholder="Enter receiver's name"
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label>Remark <span>:</span></label>
                            <textarea
                                name="remark"
                                value={repairFormData.remark}
                                onChange={handleRepairInputChange}
                                placeholder="Enter any remarks"
                                rows="4"
                                style={{ width: '100%', padding: '5px', height: '60px' }}
                            />
                        </div>
                    </div>

                    <div className="Main_container_Btn">
                        <button onClick={handleRepairSubmit} style={{ width: "95px" }}>
                            {editingDataId ? "Update" : "Submit"}
                        </button>
                    </div>
                    <ReactGrid columns={RepairColumn} RowData={RepairData} />
                </div>
            )}
        </div>
    );
};

export default BreakageForm;