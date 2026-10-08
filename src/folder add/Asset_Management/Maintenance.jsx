import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import { Button } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import './AMC.css';
import { useLocation } from 'react-router-dom';


const Maintenance = () => {
    const userRecord = useSelector(state => state.userRecord?.UserData);

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const [RackMasterPage, setRackMasterPage] = useState('Maintenance Schedule Master');
    const dispatchvalue = useDispatch();

    const navigate = useNavigate();
    const location = useLocation();
    // Maintenance Schedule Master States
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedAsset, setSelectedAsset] = useState('');
    const [selectedServiceProvider, setSelectedServiceProvider] = useState('');
    const [selectedTechnician, setSelectedTechnician] = useState('');
    const [Technicians, setTechnicians] = useState([]);
    const [assets, setAssets] = useState([]);
    const [maintenance_data, setmaintenance_data] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [departments, setDepartments] = useState([]);
    const [wards, setWards] = useState([]);
    const [RoomNos, setRoomNos] = useState([]);
    const [Administartions, setAdministartions] = useState([]);
    const [TheatreNames, setTheatreNames] = useState([]);
    const [ConsultationroomNames, setConsultationroomNames] = useState([]);
    const [error, setError] = useState('');
    const [ServiceProviders, setServiceProviders] = useState([]);
    const [AssetformData, setAssetformData] = useState({
        id: '',
        asset: '',
        asset_subcategory: '',
        ServiceBy: '',
        ServiceProvider: '',
        Technician: '',
        maintenanceDay: '',
        maintenanceDays: [],
        maintenanceDates: [],
        department: "",
        departmentname: "",
        ward: "",
        room: "",
        Administartion: "",
        TheatreName: "",
        Consultationroom: "",
        maintenanceSchedule: "",
        timeFrequency: "",
        maintenanceDate: "",
    });

    // Maintenance Log States
    const [Maintenancedepartments, setMaintenancedepartments] = useState([]);
    const [MaintenanceWards, setMaintenanceWards] = useState([]);
    const [MaintenanceRoomNos, setMaintenanceRoomNos] = useState([]);
    const [MaintenanceAdministrations, setMaintenanceAdministrations] = useState([]);
    const [MaintenanceTheatreNames, setMaintenanceTheatreNames] = useState([]);
    const [MaintenanceConsultationRoomNames, setMaintenanceConsultationRoomNames] = useState([]);
    const [MaintenanceCategories, setMaintenanceCategories] = useState([]);
    const [MaintenanceSubcategories, setMaintenanceSubcategories] = useState([]);
    const [MaintenanceAssets, setMaintenanceAssets] = useState([]);
    const [selectedMaintenanceCategory, setSelectedMaintenanceCategory] = useState('');
    const [selectedMaintenanceSubcategory, setSelectedMaintenanceSubcategory] = useState('');
    const [selectedMaintenanceAsset, setSelectedMaintenanceAsset] = useState('');
    const [MaintenanceAssetformData, setMaintenanceAssetformData] = useState({
        id: "",
        MaintenanceDepartment: "",
        MaintenanceWard: "",
        MaintenanceRoom: "",
        MaintenanceAdministration: "",
        MaintenanceTheatreName: "",
        MaintenanceConsultationRoom: ""
    });

    // Checklist and Maintenance Schedule States
    const [checklistData, setChecklistData] = useState({});
    const [checklistStatus, setChecklistStatus] = useState({});
    const [checklistInputs, setChecklistInputs] = useState({});
    const [maintenanceSchedules, setMaintenanceSchedules] = useState([]);

    const [departmentUsers, setDepartmentUsers] = useState([]);



    // Fetch Data based on RackMasterPage
    useEffect(() => {
        const fetchData = async () => {
            try {
                if (RackMasterPage === 'Maintenance Schedule Master') {
                    console.log('Fetching data for Maintenance Schedule Master');
                    await Promise.all([
                        fetchSubcategories(),
                        fetchDepartments(),
                        fetchWardList(),
                        fetchWardList_Roomno(),
                        fetchAdministartionNameData(),
                        fetchTheatreName(),
                        fetchConsultation_Room(),
                        FetchMaintenanceList(),
                        FetchAllMaintenanceList(),
                        fetchServiceProvider(),
                        fetchTechnician(),
                    ]);
                } else if (RackMasterPage === 'Maintenance Log') {
                    console.log('Fetching data for Maintenance Log');
                    await Promise.all([
                        fetchMaintenanceAdministrationNameData(),
                        fetchMaintenanceDepartments(),
                        fetchMaintenanceWardList(),
                        fetchMaintenanceWardList_Roomno(),
                        fetchMaintenanceTheatreName(),
                        fetchMaintenanceConsultation_Room(),
                        fetchMaintenanceCategories(),
                        fetchMaintenanceSubcategories(),
                        fetchMaintenanceAssets(),
                        FetchMaintenanceList(),
                    ]);
                }
            } catch (error) {
                setError(`Failed to fetch data for ${RackMasterPage}`);
                console.error(error);
            }
        };
        fetchData();
    }, [RackMasterPage]);

    // Fetch Assets when selectedSubcategory changes
    useEffect(() => {
        if (selectedSubcategory) {
            fetchAssets(selectedSubcategory);
        } else {
            setAssets([]);
        }
    }, [selectedSubcategory]);

    // Fetch Default Checklist Data for Maintenance Log
    useEffect(() => {
        if (
            RackMasterPage === 'Maintenance Log' &&
            maintenanceSchedules.length > 0 &&
            MaintenanceAssets.length > 0 &&
            MaintenanceSubcategories.length > 0 &&
            MaintenanceCategories.length > 0
        ) {
            fetchDefaultChecklistData();
        }
    }, [maintenanceSchedules, MaintenanceAssets, MaintenanceSubcategories, MaintenanceCategories, RackMasterPage]);

    // Fetch Filtered Checklist Data for Maintenance Log
    useEffect(() => {
        if (RackMasterPage === 'Maintenance Log') {
            const hasFilters = (
                MaintenanceAssetformData.MaintenanceDepartment ||
                MaintenanceAssetformData.MaintenanceWard ||
                MaintenanceAssetformData.MaintenanceRoom ||
                MaintenanceAssetformData.MaintenanceAdministration ||
                MaintenanceAssetformData.MaintenanceTheatreName ||
                MaintenanceAssetformData.MaintenanceConsultationRoom ||
                selectedMaintenanceCategory ||
                selectedMaintenanceSubcategory ||
                selectedMaintenanceAsset
            );
            if (hasFilters) {
                fetchChecklistData();
            }
        }
    }, [
        MaintenanceAssetformData,
        selectedMaintenanceCategory,
        selectedMaintenanceSubcategory,
        selectedMaintenanceAsset,
        RackMasterPage
    ]);

    // Fetch Functions
    const fetchSubcategories = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/get_asset_subcategories/`);
            setSubcategories(response.data);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
        }
    };

    const fetchAssets = async (subcategoryId) => {
        if (!subcategoryId) {
            setAssets([]);
            return;
        }
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/Asset_Reg_Get/?subcategory_id=${subcategoryId}`);
            if (Array.isArray(response.data)) {
                setAssets(response.data.filter(asset => asset.asset_subcategory === parseInt(subcategoryId)));
            } else {
                setAssets([]);
            }
        } catch (error) {
            console.error('Error fetching assets:', error);
            setAssets([]);
        }
    };

    const fetchDepartments = async () => {
        try {
            const response = await axios.get(`${UrlLink}Masters/Department_Detials_link`);
            setDepartments(response.data);
        } catch (error) {
            console.error('Error fetching departments:', error);
        }
    };

    const fetchWardList = async () => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Ward_Master_Detials_link`);
            setWards(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchWardList_Roomno = async () => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Room_Master_Detials_link`);
            setRoomNos(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchAdministartionNameData = async () => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Administration_Details_link`);
            setAdministartions(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTheatreName = async () => {
        try {
            const res = await axios.get(`${UrlLink}OT/OtTheaterMaster_Detials_link`);
            setTheatreNames(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchConsultation_Room = async () => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Consultation_Room_Details_link`);
            setConsultationroomNames(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const FetchMaintenanceList = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/get_maintenance_list`);
            if (Array.isArray(response.data)) {
                const formattedData = response.data.map(maintenance => ({
                    ...maintenance,
                    maintenanceDays: maintenance.maintenance_days ? JSON.parse(maintenance.maintenance_days) : [],
                    maintenanceDates: maintenance.maintenance_dates ? JSON.parse(maintenance.maintenance_dates) : [],
                    next_maintenance_date: maintenance.next_maintenance_date,
                }));
                console.log('Fetched Maintenance Data (Due Today):', formattedData);
                setMaintenanceSchedules(formattedData);
            } else {
                setMaintenanceSchedules([]);
            }
        } catch (error) {
            console.error('Error fetching maintenance:', error);
            setError('Error fetching maintenance list');
        }
    };

    const fetchServiceProvider = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/ServiceProviderManagement_GET/`);
            setServiceProviders(response.data);
        } catch (error) {
            console.error('Error fetching service providers:', error);
        }
    };

    const fetchTechnician = async () => {
        try {
            const res = await axios.get(`${UrlLink}AccetCategory/get_technicians`);
            setTechnicians(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMaintenanceDepartments = async () => {
        try {
            const response = await axios.get(`${UrlLink}Masters/Department_Detials_link`);
            setMaintenancedepartments(response.data);
        } catch (error) {
            console.error('Error fetching maintenance departments:', error);
        }
    };

    const fetchMaintenanceWardList = async () => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Ward_Master_Detials_link`);
            setMaintenanceWards(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMaintenanceWardList_Roomno = async () => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Room_Master_Detials_link`);
            setMaintenanceRoomNos(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMaintenanceAdministrationNameData = async () => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Administration_Details_link`);
            setMaintenanceAdministrations(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMaintenanceTheatreName = async () => {
        try {
            const res = await axios.get(`${UrlLink}OT/OtTheaterMaster_Detials_link`);
            setMaintenanceTheatreNames(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMaintenanceConsultation_Room = async () => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Consultation_Room_Details_link`);
            setMaintenanceConsultationRoomNames(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchMaintenanceCategories = async () => {
        if (!userRecord) {
            console.log("User record not available, waiting...");
            return;
        }

        try {
            const response = await axios.get(`${UrlLink}AccetCategory/asset_categories_list/`, {
                withCredentials: true // Ensure session cookies are sent
            });
            console.log("maintenanceCategoriesResponse:", response);

            let filteredCategories = [];
            if (Array.isArray(response.data)) {
                // Filter active categories only
                const activeCategories = response.data.filter(category => category.status === "active");
                console.log("activeCategories:", activeCategories);

                // Check if user is host or admin
                if (userRecord?.username === "host" || userRecord?.username === "admin") {
                    // Show all active categories for host or admin
                    filteredCategories = activeCategories;
                } else if (userRecord?.Employeeid && userRecord?.AssetCategory_list?.[0]?.AssetCategoryAccessId) {
                    // Filter categories based on AssetCategoryAccessId for non-host/admin users
                    filteredCategories = activeCategories.filter((category) =>
                        category.id === userRecord.AssetCategory_list[0].AssetCategoryAccessId
                    );
                }

                setMaintenanceCategories(filteredCategories);
            } else {
                console.warn("Unexpected response format:", response.data);
                setMaintenanceCategories([]);
            }
        } catch (error) {
            console.error('Error fetching maintenance categories:', error);
            setMaintenanceCategories([]);
        }
    };

    const fetchMaintenanceSubcategories = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/get_asset_subcategories/`);
            setMaintenanceSubcategories(response.data);
        } catch (error) {
            console.error('Error fetching maintenance subcategories:', error);
        }
    };

    const fetchMaintenanceAssets = async (subcategoryId = null) => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/Asset_Reg_Get/`);
            if (Array.isArray(response.data)) {
                console.log('Fetched Maintenance Assets:', response.data);
                const assets = subcategoryId
                    ? response.data.filter(asset => asset.asset_subcategory === parseInt(subcategoryId))
                    : response.data;
                setMaintenanceAssets(assets);
            } else {
                console.error('Maintenance assets response is not an array:', response.data);
                setMaintenanceAssets([]);
            }
        } catch (error) {
            console.error('Error fetching maintenance assets:', error);
            setMaintenanceAssets([]);
        }
    };

    // Helper Function to Check Maintenance Schedule
    const isMaintenanceDay = (schedule) => {
        const today = new Date();
        const nextMaintenanceDate = schedule.next_maintenance_date ? new Date(schedule.next_maintenance_date) : null;

        // If next_maintenance_date exists and is in the future, skip this schedule
        if (nextMaintenanceDate && nextMaintenanceDate > today) {
            return false;
        }

        const dayOfWeek = today.toLocaleString('en-US', { weekday: 'long' });
        switch (schedule.maintenanceSchedule) {
            case 'Daily':
                return true;
            case 'Weekly':
                return schedule.maintenanceDays.includes(dayOfWeek);
            case 'Monthly':
                return schedule.maintenanceDates.some(date => {
                    const [year, month, day] = date.split('-');
                    return parseInt(day) === today.getDate();
                });
            case 'Yearly':
                if (schedule.maintenanceDate) {
                    const maintDate = new Date(schedule.maintenanceDate);
                    return (
                        maintDate.getDate() === today.getDate() &&
                        maintDate.getMonth() === today.getMonth()
                    );
                }
                return false;
            default:
                return false;
        }
    };

    // Fetch Default Checklist Data
    const fetchDefaultChecklistData = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/ChecklistMasterEntry_get/`);
            const items = response.data.data || [];
            console.log('Checklist Data from API:', items);

            const checklistByAsset = {};
            const todaySchedules = maintenanceSchedules.filter(sched => isMaintenanceDay(sched));
            console.log('Today\'s Schedules:', todaySchedules);

            for (const sched of todaySchedules) {
                const asset = MaintenanceAssets.find(a => a.id === sched.asset);
                if (!asset) {
                    console.log(`Asset ${sched.asset} not found in MaintenanceAssets:`, MaintenanceAssets);
                    continue;
                }

                const subcategory = MaintenanceSubcategories.find(sub => sub.id === asset.asset_subcategory);
                if (!subcategory) {
                    console.log(`Subcategory ${asset.asset_subcategory} not found in MaintenanceSubcategories:`, MaintenanceSubcategories);
                    continue;
                }

                const category = MaintenanceCategories.find(cat => cat.id === subcategory.category);
                if (!category) {
                    console.log(`Category ${subcategory.category} not found in MaintenanceCategories:`, MaintenanceCategories);
                    continue;
                }

                const filteredChecklist = items.filter(item =>
                    item.asset_category === category.id &&
                    item.subcategories.some(sub => sub.toString() === subcategory.id.toString()) &&
                    item.status === 'active'
                );
                console.log(`Filtered Checklist for Asset ${asset.id}:`, filteredChecklist);

                if (filteredChecklist.length > 0) {
                    const formattedData = filteredChecklist.map(item => ({
                        id: item.id,
                        item_name: item.item_name,
                        subcategoryName: subcategory.name,
                        assetName: asset.name,
                        assetId: asset.id,
                        status: item.status,
                        asset_category: item.asset_category
                    }));
                    checklistByAsset[asset.id] = formattedData;
                } else {
                    console.log(`No active checklist items found for asset ${asset.id}, category ${category.id}, subcategory ${subcategory.id}`);
                }
            }

            console.log('Final Checklist Data:', checklistByAsset);
            setChecklistData(checklistByAsset);
            initializeChecklistStatus(checklistByAsset);
        } catch (error) {
            console.error('Error fetching default checklist data:', error.message);
            setChecklistData({});
            setChecklistStatus({});
        }
    };

    // Fetch Filtered Checklist Data
    const fetchChecklistData = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/ChecklistMasterEntry_get/`);
            console.log('Checklist Data:', response.data.data);
            const items = response.data.data || [];
            const checklistByAsset = {};

            let filteredSchedules = maintenanceSchedules.filter(sched => isMaintenanceDay(sched));

            if (MaintenanceAssetformData.MaintenanceDepartment) {
                const dept = Maintenancedepartments.find(d => d.id.toString() === MaintenanceAssetformData.MaintenanceDepartment);
                filteredSchedules = filteredSchedules.filter(sched => sched.department_name === dept?.DepartmentName);
            }
            if (MaintenanceAssetformData.MaintenanceWard) {
                filteredSchedules = filteredSchedules.filter(sched => sched.ward === parseInt(MaintenanceAssetformData.MaintenanceWard));
            }
            if (MaintenanceAssetformData.MaintenanceRoom) {
                filteredSchedules = filteredSchedules.filter(sched => sched.room === parseInt(MaintenanceAssetformData.MaintenanceRoom));
            }
            if (MaintenanceAssetformData.MaintenanceAdministration) {
                filteredSchedules = filteredSchedules.filter(sched => sched.administration === parseInt(MaintenanceAssetformData.MaintenanceAdministration));
            }
            if (MaintenanceAssetformData.MaintenanceTheatreName) {
                filteredSchedules = filteredSchedules.filter(sched => sched.theatre_name === parseInt(MaintenanceAssetformData.MaintenanceTheatreName));
            }
            if (MaintenanceAssetformData.MaintenanceConsultationRoom) {
                filteredSchedules = filteredSchedules.filter(sched => sched.consultation_room_name === parseInt(MaintenanceAssetformData.MaintenanceConsultationRoom));
            }
            if (selectedMaintenanceCategory) {
                filteredSchedules = filteredSchedules.filter(sched => {
                    const asset = MaintenanceAssets.find(a => a.id === sched.asset);
                    const subcategory = MaintenanceSubcategories.find(sub => sub.id === asset?.asset_subcategory);
                    return subcategory?.category === parseInt(selectedMaintenanceCategory);
                });
            }
            if (selectedMaintenanceSubcategory) {
                filteredSchedules = filteredSchedules.filter(sched => {
                    const asset = MaintenanceAssets.find(a => a.id === sched.asset);
                    return asset?.asset_subcategory === parseInt(selectedMaintenanceSubcategory);
                });
            }
            if (selectedMaintenanceAsset) {
                filteredSchedules = filteredSchedules.filter(sched => sched.asset === parseInt(selectedMaintenanceAsset));
            }

            for (const sched of filteredSchedules) {
                const asset = MaintenanceAssets.find(a => a.id === sched.asset);
                if (!asset) continue;

                const subcategory = MaintenanceSubcategories.find(sub => sub.id === asset.asset_subcategory);
                if (!subcategory) continue;

                const category = MaintenanceCategories.find(cat => cat.id === subcategory.category);
                if (!category) continue;

                const filteredChecklist = items.filter(item =>
                    item.asset_category === category.id &&
                    item.subcategories.some(sub => sub.toString() === subcategory.id.toString()) &&
                    item.status === 'active'
                );

                if (filteredChecklist.length > 0) {
                    const formattedData = filteredChecklist.map(item => ({
                        id: item.id,
                        item_name: item.item_name,
                        subcategoryName: subcategory.name,
                        assetName: asset.name,
                        assetId: asset.id,
                        status: item.status,
                        asset_category: item.asset_category
                    }));

                    checklistByAsset[asset.id] = formattedData;
                }
            }

            console.log('Filtered Checklist Data:', checklistByAsset);
            setChecklistData(checklistByAsset);
            initializeChecklistStatus(checklistByAsset);
        } catch (error) {
            console.error('Error fetching checklist data:', error.message);
            setChecklistData({});
            setChecklistStatus({});
        }
    };

    // Initialize Checklist Status
    const initializeChecklistStatus = (checklistByAsset) => {
        const initialStatus = {};
        Object.values(checklistByAsset).forEach(items => {
            items.forEach(item => {
                initialStatus[item.id] = false;
            });
        });
        setChecklistStatus(initialStatus);
    };

    // Event Handlers
    const handleSubcategoryChange = (e) => {
        const subcategoryId = e.target.value;
        setSelectedSubcategory(subcategoryId);
        setSelectedAsset('');
    };

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        setAssetformData(prev => {
            const updatedDays = checked
                ? [...(prev.maintenanceDays || []), value]
                : (prev.maintenanceDays || []).filter(day => day !== value);
            return { ...prev, maintenanceDays: updatedDays };
        });
    };

    const handleDateChange = (index, event) => {
        const updatedDates = [...(AssetformData.maintenanceDates || [])];
        updatedDates[index] = event.target.value;
        setAssetformData(prev => ({ ...prev, maintenanceDates: updatedDates }));
    };

    const addDateField = () => {
        setAssetformData(prev => ({
            ...prev,
            maintenanceDates: [...(prev.maintenanceDates || []), ""]
        }));
    };

    const removeDateField = (index) => {
        const updatedDates = [...(AssetformData.maintenanceDates || [])];
        updatedDates.splice(index, 1);
        setAssetformData(prev => ({ ...prev, maintenanceDates: updatedDates }));
    };

    const handleTechnicianChange = (e) => {
        const techId = e.target.value;
        setSelectedTechnician(techId);
        setAssetformData(prev => ({
            ...prev,
            Technician: techId || null
        }));
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;
        setAssetformData(prev => {
            let updatedData = { ...prev, [name]: newValue };
            if (name === "department") {
                const selectedDept = departments.find(dept => dept.id.toString() === value);
                updatedData.department = value ? parseInt(value) : null;
                updatedData.departmentname = selectedDept ? selectedDept.DepartmentName : "";
            }
            return updatedData;
        });
    };

    const MaintenancehandleInputChange = (e) => {
        const { name, value } = e.target;
        setMaintenanceAssetformData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleChecklistChange = (id) => {
        setChecklistStatus(prev => {
            const newStatus = { ...prev, [id]: !prev[id] };
            if (newStatus[id]) {
                setChecklistInputs(prevInputs => {
                    const newInputs = { ...prevInputs };
                    delete newInputs[id];
                    return newInputs;
                });
            }
            return newStatus;
        });
    };

    const handleChecklistInputChange = (id, value) => {
        setChecklistInputs(prev => ({ ...prev, [id]: value }));
    };

    const handleMaintenanceCategoryChange = async (e) => {
        const categoryId = e.target.value;
        setSelectedMaintenanceCategory(categoryId);
        setSelectedMaintenanceSubcategory('');
        setSelectedMaintenanceAsset('');
        setMaintenanceAssets([]);
        if (!categoryId) {
            setMaintenanceSubcategories([]);
        } else {
            try {
                const response = await axios.get(`${UrlLink}AccetCategory/get_asset_subcategories/`);
                const filtered = response.data.filter(subcat => subcat.category === parseInt(categoryId));
                setMaintenanceSubcategories(filtered);
            } catch (error) {
                console.error('Error fetching subcategories for category:', error);
                setMaintenanceSubcategories([]);
            }
        }
    };

    const handleMaintenanceSubcategoryChange = async (e) => {
        const subcategoryId = e.target.value;
        setSelectedMaintenanceSubcategory(subcategoryId);
        setSelectedMaintenanceAsset('');
        if (!subcategoryId) {
            setMaintenanceAssets([]);
        } else {
            await fetchMaintenanceAssets(subcategoryId);
        }
    };

    const handleMaintenanceAssetChange = (e) => {
        setSelectedMaintenanceAsset(e.target.value);
    };

    const resetForm = () => {
        setAssetformData({
            id: '',
            asset: '',
            asset_subcategory: '',
            ServiceBy: '',
            ServiceProvider: '',
            Technician: '',
            maintenanceDay: '',
            maintenanceDays: [],
            maintenanceDates: [],
            department: "",
            departmentname: "",
            ward: "",
            room: "",
            Administartion: "",
            TheatreName: "",
            Consultationroom: "",
            maintenanceSchedule: "",
            timeFrequency: "",
            maintenanceDate: "",
        });
        setSelectedSubcategory('');
        setSelectedAsset('');
        setSelectedServiceProvider('');
        setSelectedTechnician('');
        setIsEditing(false);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');
        try {
            const formDataToSubmit = {
                id: AssetformData.id ? parseInt(AssetformData.id) : null,
                asset: AssetformData.asset ? parseInt(AssetformData.asset) : null,
                asset_subcategory: AssetformData.asset_subcategory ? parseInt(AssetformData.asset_subcategory) : null,
                department: AssetformData.department ? parseInt(AssetformData.department) : null,
                departmentname: AssetformData.departmentname || '',
                ward: AssetformData.ward ? parseInt(AssetformData.ward) : null,
                room: AssetformData.room ? parseInt(AssetformData.room) : null,
                Administartion: AssetformData.Administartion ? parseInt(AssetformData.Administartion) : null,
                TheatreName: AssetformData.TheatreName ? parseInt(AssetformData.TheatreName) : null,
                Consultationroom: AssetformData.Consultationroom ? parseInt(AssetformData.Consultationroom) : null,
                maintenanceSchedule: AssetformData.maintenanceSchedule,
                timeFrequency: AssetformData.timeFrequency,
                maintenanceDate: AssetformData.maintenanceDate ? new Date(AssetformData.maintenanceDate).toISOString().split("T")[0] : null,
                ServiceBy: AssetformData.ServiceBy,
                ServiceProvider: AssetformData.ServiceProvider ? parseInt(AssetformData.ServiceProvider) : null,
                Technician: AssetformData.Technician ? AssetformData.Technician : null,
                maintenance_days: JSON.stringify(AssetformData.maintenanceDays || []),
                maintenance_dates: JSON.stringify(AssetformData.maintenanceDates || []),
            };
            await axios.post(`${UrlLink}AccetCategory/submit_maintenance`, formDataToSubmit);
            await FetchAllMaintenanceList();
            resetForm();
        } catch (error) {
            console.error("Error submitting data:", error);
            setError("Failed to submit data. " + (error.response?.data?.error || error.message));
        }
    };

    const handleEdit = (row) => {
        setSelectedSubcategory(row.asset_subcategory?.toString() || '');
        setSelectedAsset(row.asset?.toString() || '');
        setSelectedServiceProvider(row.ServiceProvider?.toString() || '');
        setSelectedTechnician(row.Technician?.toString() || '');
        if (row.asset_subcategory) fetchAssets(row.asset_subcategory);
        setIsEditing(true);
        setAssetformData({
            id: row.id || '',
            asset: row.asset || '',
            asset_subcategory: row.asset_subcategory || '',
            ServiceBy: row.ServiceBy || '',
            ServiceProvider: row.ServiceProvider || '',
            Technician: row.Technician || '',
            department: row.department || '',
            departmentname: row.department_name || '',
            ward: row.ward || '',
            room: row.room || '',
            Administartion: row.administration || '',
            TheatreName: row.theatre_name || '',
            Consultationroom: row.consultation_room_name || '',
            maintenanceSchedule: row.maintenanceSchedule || '',
            timeFrequency: row.timeFrequency || '',
            maintenanceDate: row.maintenanceDate || '',
            maintenanceDays: Array.isArray(row.maintenanceDays) ? row.maintenanceDays : [],
            maintenanceDates: Array.isArray(row.maintenanceDates) ? row.maintenanceDates : [],
        });
    };

    const handelDeleteite = async (id) => {
        if (!window.confirm("Are you sure you want to delete this?")) return;
        try {
            const response = await fetch(`${UrlLink}AccetCategory/delete_maintenance/${id}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });
            const data = await response.json();
            if (response.ok) {
                console.log(data.message || "Maintenance deleted successfully");
                await FetchAllMaintenanceList(); // Refresh all schedules
            } else {
                console.log(data.error || 'Failed to delete the maintenance record');
            }
        } catch (error) {
            console.error('Error deleting maintenance record:', error);
            console.log('An error occurred while deleting the maintenance record');
        }
    };

    const getFormattedDates = (row) => {
        if (row.maintenanceSchedule === "Weekly" && row.maintenanceDays?.length) return row.maintenanceDays.join(", ");
        if (row.maintenanceSchedule === "Monthly" && row.maintenanceDates?.length) return row.maintenanceDates.map(date => new Date(date).toLocaleDateString()).join(", ");
        if (row.maintenanceSchedule === "Yearly" && row.maintenanceDate) return new Date(row.maintenanceDate).toLocaleDateString();
        return "Daily";
    };

    const getLocationInfo = (row) => {
        if (row.department_name === 'IP') return { ward: row.ward_name || 'N/A', room: row.room_name || 'N/A' };
        if (row.department_name === 'ADMINISTARTION') return { administration: row.AdministrationName || 'N/A' };
        if (row.department_name === 'OT') return { theatre: row.theatre_name || 'N/A' };
        if (row.department_name === 'OP') return { consultation: row.consultation_room_name || 'N/A' };
        return { location: 'N/A' };
    };

    const getServiceInfo = (row) => {
        if (row.ServiceBy === 'ServiceProvider') return `Service Provider: ${row.service_provider_name || 'N/A'}`;
        if (row.ServiceBy === 'Technician') return `Technician: ${row.technician_name || 'N/A'}`;
        return 'N/A';
    };

    const maintenanceColumn = [
        { key: 'id', name: 'Maintenance id' },
        { key: 'subcategory_name', name: 'Subcategory Name' },
        { key: 'Asset_name', name: 'Asset Name' },
        { key: 'DepartmentName', name: 'Department Name', renderCell: (params) => params.row.department_name || 'N/A' },
        {
            key: 'location_details',
            name: 'Location Details',
            renderCell: (params) => {
                const locationInfo = getLocationInfo(params.row);
                if (params.row.department_name === 'IP') return `Ward: ${locationInfo.ward}, Room: ${locationInfo.room}`;
                if (params.row.department_name === 'ADMINISTARTION') return `Administration: ${locationInfo.administration}`;
                if (params.row.department_name === 'OT') return `Theatre: ${locationInfo.theatre}`;
                if (params.row.department_name === 'OP') return `Consultation Room: ${locationInfo.consultation}`;
                return 'N/A';
            }
        },
        { key: 'ServiceBy', name: 'Service By', renderCell: (params) => params.row.ServiceBy || 'N/A' },
        { key: 'service_details', name: 'Service Details', renderCell: (params) => getServiceInfo(params.row) },
        { key: 'maintenanceSchedule', name: 'Maintenance Schedule' },
        { key: 'timeFrequency', name: 'Time Frequency' },
        { key: 'scheduleDates', name: 'Scheduled Dates/Days', renderCell: (params) => getFormattedDates(params.row) },
        {
            key: 'Actions',
            name: 'Actions',
            renderCell: (params) => (
                <div>
                    <Button className="cell_btn" onClick={() => handleEdit(params.row)}>
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                    <Button className="cell_btn" onClick={() => handelDeleteite(params.row.id)}>
                        <DeleteIcon className="check_box_clrr_cancell" />
                    </Button>
                </div>
            )
        },
    ];

    useEffect(() => {
        setAssetformData(prev => ({
            ...prev,
            asset_subcategory: selectedSubcategory || '',
            asset: selectedAsset || '',
            ServiceProvider: selectedServiceProvider || '',
            Technician: selectedTechnician || '',
        }));
    }, [selectedSubcategory, selectedAsset, selectedServiceProvider, selectedTechnician]);

    const handle_Maintenance_Submit = async (event, assetId, maintenanceScheduleId) => {
        event.preventDefault();
        setError('');

        try {
            const items = checklistData[assetId] || [];
            if (!items.length) {
                setError(`No checklist items found for asset ${assetId}`);
                return;
            }

            const checklistItems = items.map(item => ({
                checklist_item_id: item.id,
                checklist_item_name: item.item_name,
                status: checklistStatus[item.id] ? 'Completed' : (checklistInputs[item.id] ? 'Issue' : 'Pending'),
                remarks: checklistInputs[item.id] || '',
            }));

            const hasSelection = checklistItems.some(item => item.status !== 'Pending');
            if (!hasSelection) {
                setError('Please select at least one checklist item or provide details before submitting.');
                return;
            }

            const allCompleted = checklistItems.every(item => item.status === 'Completed');

            const submissionData = {
                maintenance_schedule_id: maintenanceScheduleId,
                checklist_items: checklistItems,
                completed_by: 'User',
                asset_id: assetId,
                next_maintenance_date: maintenanceSchedules.find(sched => sched.asset === parseInt(assetId))?.next_maintenance_date || new Date().toISOString().split('T')[0],
            };

            const response = await axios.post(`${UrlLink}AccetCategory/Post_Maintenance_ChecklistData`, submissionData);

            console.log('Submission Response:', response.data);

            const newChecklistStatus = { ...checklistStatus };
            const newChecklistInputs = { ...checklistInputs };
            items.forEach(item => {
                delete newChecklistStatus[item.id];
                delete newChecklistInputs[item.id];
            });
            setChecklistStatus(newChecklistStatus);
            setChecklistInputs(newChecklistInputs);

            await FetchMaintenanceList();
            await fetchChecklistData();

            if (!allCompleted) {
                const asset = MaintenanceAssets.find(a => a.id === parseInt(assetId));
                const issueItems = checklistItems.filter(item => item.status === 'Issue');
                const issueDescriptions = issueItems.map(item =>
                    `${item.checklist_item_name}: ${item.remarks}`
                ).join('; ');

                let departmentId = asset?.department_id || '';
                let assetName = asset?.name || asset?.AssetName || 'Unknown Asset';

                if (!departmentId) {
                    try {
                        const assetResponse = await axios.get(`${UrlLink}AccetCategory/Get_Asset_Details_By_Id/${assetId}`);
                        const assetDetails = assetResponse.data;
                        console.log("assetDetails", assetDetails);
                        departmentId = assetDetails.department_id || '';
                        assetName = assetDetails.name || assetDetails.AssetName || assetName;
                    } catch (err) {
                        console.error("Error fetching asset details for department:", err);
                    }
                }

                if (navigate) {
                    setRackMasterPage('Breakage Form');
                    dispatchvalue({ type: "HrFolder", value: "BreakageForm" });

                    navigate("/Home/BreakageForm", {
                        state: {
                            prePopulate: true,
                            assetId: parseInt(assetId),
                            assetName: assetName,
                            breakageIssue: issueDescriptions || "Issue found during maintenance check",
                            departmentId: departmentId ? parseInt(departmentId) : null,
                            fromMaintenance: true
                        }
                    });

                    dispatchvalue({ type: "setPreviousFolder", value: null });
                    dispatchvalue({ type: "showMenu", value: true });

                    console.log(`Maintenance checklist saved. You're being redirected to submit a breakage report for the issues found.`);
                } else {
                    console.log(`Maintenance checklist for asset ${assetName} submitted successfully! 
                Issues were found that require repair. Please submit a breakage form.`);
                    setRackMasterPage('Breakage Form');
                }
            } else {
                console.log(`Maintenance checklist for asset ${items[0]?.assetName} submitted successfully! Next Maintenance: ${response.data.next_maintenance_date}`);
                setRackMasterPage('Maintenance Log');
            }

        } catch (error) {
            console.error('Error submitting maintenance checklist:', error);
            setError('Failed to submit checklist: ' + (error.response?.data?.error || error.message));
        }
    };



    const handlePageChange = (page) => {
        if (RackMasterPage === 'Maintenance Log' && Object.keys(checklistData).length > 0) {
            const hasAnySelection = Object.values(checklistData).some(items =>
                items.some(item => checklistStatus[item.id] || checklistInputs[item.id])
            );
            if (!hasAnySelection) {
                setError('Please select at least one checklist item before navigating away.');
                return;
            }
        }
        setRackMasterPage(page);
    };

    const FetchAllMaintenanceList = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/get_all_maintenance_list`);
            if (Array.isArray(response.data)) {
                const formattedData = response.data.map(maintenance => ({
                    ...maintenance,
                    maintenanceDays: maintenance.maintenance_days ? JSON.parse(maintenance.maintenance_days) : [],
                    maintenanceDates: maintenance.maintenance_dates ? JSON.parse(maintenance.maintenance_dates) : [],
                    next_maintenance_date: maintenance.next_maintenance_date,
                }));
                console.log('Fetched All Maintenance Data:', formattedData);
                setmaintenance_data(formattedData);
            } else {
                setmaintenance_data([]);
            }
        } catch (error) {
            console.error('Error fetching all maintenance:', error);
            setError('Error fetching all maintenance list');
        }
    };



    return (
        <div className="Main_container_app">
            <br />
            <div className="RegisterTypecon">
                <div className="RegisterType">
                    {["Maintenance Schedule Master", "Maintenance Log"].map((p, ind) => (
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

            {RackMasterPage === 'Maintenance Schedule Master' && (
                <div className="Main_container_app">
                    <h3>Maintenance Schedule Entry</h3>
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label>Asset Subcategory <span>:</span></label>
                            <select value={selectedSubcategory} onChange={handleSubcategoryChange} required>
                                <option value="">Select Asset Subcategory</option>
                                {subcategories.map((subcategory) => (
                                    <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="RegisForm_1">
                            <label>Asset <span>:</span></label>
                            <select value={selectedAsset} onChange={(e) => setSelectedAsset(e.target.value)} disabled={!selectedSubcategory} required>
                                <option value="">Select Asset</option>
                                {assets.map((asset) => (
                                    <option key={asset.id} value={asset.id}>{asset.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="RegisForm_1">
                            <label>Department <span>:</span></label>
                            <select name="department" value={AssetformData.department || ""} onChange={handleInputChange} required>
                                <option value="">Select</option>
                                {departments.map((department, index) => (
                                    <option key={`${department.id}-${index}`} value={department.id}>{department.DepartmentName}</option>
                                ))}
                            </select>
                        </div>
                        {AssetformData.departmentname === 'IP' && (
                            <>
                                <div className="RegisForm_1">
                                    <label>Ward <span>:</span></label>
                                    <select name="ward" value={AssetformData.ward} onChange={handleInputChange} required>
                                        <option value="">Select Ward</option>
                                        {wards.map((ward) => (
                                            <option key={ward.id} value={ward.id}>{ward.WardName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="RegisForm_1">
                                    <label>Room No <span>:</span></label>
                                    <select name="room" value={AssetformData.room} onChange={handleInputChange} required>
                                        <option value="">Select Room No</option>
                                        {RoomNos.map((room) => (
                                            <option key={room.id} value={room.id}>{room.Roomno}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                        {AssetformData.departmentname === 'ADMINISTARTION' && (
                            <div className="RegisForm_1">
                                <label>Administration <span>:</span></label>
                                <select name="Administartion" value={AssetformData.Administartion} onChange={handleInputChange} required>
                                    <option value="">Select Administration</option>
                                    {Administartions.map((admin) => (
                                        <option key={admin.id} value={admin.id}>{admin.AdministrationName}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {AssetformData.departmentname === 'OT' && (
                            <div className="RegisForm_1">
                                <label>Theatre Name <span>:</span></label>
                                <select name="TheatreName" value={AssetformData.TheatreName} onChange={handleInputChange} required>
                                    <option value="">Select Theatre Name</option>
                                    {TheatreNames.map((theatre) => (
                                        <option key={theatre.id} value={theatre.id}>{theatre.TheatreName}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {AssetformData.departmentname === 'OP' && (
                            <div className="RegisForm_1">
                                <label>Consultation Room Name <span>:</span></label>
                                <select name="Consultationroom" value={AssetformData.Consultationroom} onChange={handleInputChange} required>
                                    <option value="">Select Consultation Room Name</option>
                                    {ConsultationroomNames.map((room) => (
                                        <option key={room.id} value={room.id}>{room.ConsultationroomName}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="RegisForm_1">
                            <label>Service By <span>:</span></label>
                            <select name="ServiceBy" value={AssetformData.ServiceBy || ""} onChange={handleInputChange} required>
                                <option value="">Select Service</option>
                                <option value="Technician">Technician</option>
                                <option value="ServiceProvider">Service Provider</option>
                            </select>
                        </div>
                        {AssetformData.ServiceBy === "ServiceProvider" && (
                            <div className="RegisForm_1">
                                <label>Service Provider <span>:</span></label>
                                <select value={selectedServiceProvider} onChange={(e) => setSelectedServiceProvider(e.target.value)} required>
                                    <option value="">Select Service Provider</option>
                                    {ServiceProviders.map((provider) => (
                                        <option key={provider.id} value={provider.id}>{provider.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {AssetformData.ServiceBy === "Technician" && (
                            <div className="RegisForm_1">
                                <label>Technician <span>:</span></label>
                                <select value={selectedTechnician} onChange={handleTechnicianChange}>
                                    <option value="">Select Technician</option>
                                    {Technicians.map((technician) => (
                                        <option key={technician.id} value={technician.id}>{technician.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="RegisForm_1">
                            <label>Maintenance Schedule <span>:</span></label>
                            <select name="maintenanceSchedule" value={AssetformData.maintenanceSchedule || ""} onChange={handleInputChange} required>
                                <option value="">Select Schedule</option>
                                <option value="Daily">Daily</option>
                                <option value="Weekly">Weekly</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                        </div>
                        {AssetformData.maintenanceSchedule === "Weekly" && (
                            <div className="RegisForm_1">
                                <label>Select Days <span>:</span></label>
                                <div className="checkbox-group-mugesh">
                                    {["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"].map((day) => (
                                        <label key={day} className="container-mugesh">
                                            {day}
                                            <input
                                                type="checkbox"
                                                value={day}
                                                checked={AssetformData.maintenanceDays?.includes(day) || false}
                                                onChange={handleCheckboxChange}
                                            />
                                            <span className="checkmark-mugesh"></span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )}
                        {AssetformData.maintenanceSchedule === "Monthly" && (
                            <div className="RegisForm_1">
                                <label>Maintenance Dates <span>:</span></label>
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    {AssetformData.maintenanceDates?.map((date, index) => (
                                        <div key={index} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <input
                                                type="date"
                                                value={date}
                                                onChange={(event) => handleDateChange(index, event)}
                                                required
                                            />
                                            <button type="button" onClick={() => removeDateField(index)}>❌</button>
                                        </div>
                                    ))}
                                    <button type="button" onClick={addDateField}>➕ Add Date</button>
                                </div>
                            </div>
                        )}
                        {AssetformData.maintenanceSchedule === "Yearly" && (
                            <div className="RegisForm_1">
                                <label>Maintenance Date <span>:</span></label>
                                <input
                                    type="date"
                                    name="maintenanceDate"
                                    value={AssetformData.maintenanceDate || ""}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>
                        )}
                        <div className="RegisForm_1">
                            <label>Time Frequency <span>:</span></label>
                            <input
                                type="number"
                                name="timeFrequency"
                                value={AssetformData.timeFrequency || ""}
                                onChange={handleInputChange}
                                required
                                min="1"
                            />
                        </div>
                    </div>
                    <div className="Main_container_Btn">
                        <button onClick={handleSubmit}>{isEditing ? 'Update' : 'Add'}</button>
                    </div>
                    <ReactGrid columns={maintenanceColumn} RowData={maintenance_data} />
                </div>
            )}

            {RackMasterPage === 'Maintenance Log' && (
                <div className="Main_container_app">
                    <h3>Maintenance Log</h3>
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label>Department <span>:</span></label>
                            <select
                                name="MaintenanceDepartment"
                                value={MaintenanceAssetformData.MaintenanceDepartment || ""}
                                onChange={MaintenancehandleInputChange}
                            >
                                <option value="">Select</option>
                                {Maintenancedepartments.map((department, index) => (
                                    <option key={`${department.id}-${index}`} value={department.id}>
                                        {department.DepartmentName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        {MaintenanceAssetformData.MaintenanceDepartment && Maintenancedepartments.find(d => d.id.toString() === MaintenanceAssetformData.MaintenanceDepartment)?.DepartmentName === 'IP' && (
                            <>
                                <div className="RegisForm_1">
                                    <label>Ward <span>:</span></label>
                                    <select name="MaintenanceWard" value={MaintenanceAssetformData.MaintenanceWard} onChange={MaintenancehandleInputChange}>
                                        <option value="">Select Ward</option>
                                        {MaintenanceWards.map((ward) => (
                                            <option key={ward.id} value={ward.id}>{ward.WardName}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="RegisForm_1">
                                    <label>Room No <span>:</span></label>
                                    <select name="MaintenanceRoom" value={MaintenanceAssetformData.MaintenanceRoom} onChange={MaintenancehandleInputChange}>
                                        <option value="">Select Room No</option>
                                        {MaintenanceRoomNos.map((room) => (
                                            <option key={room.id} value={room.id}>{room.Roomno}</option>
                                        ))}
                                    </select>
                                </div>
                            </>
                        )}
                        {MaintenanceAssetformData.MaintenanceDepartment && Maintenancedepartments.find(d => d.id.toString() === MaintenanceAssetformData.MaintenanceDepartment)?.DepartmentName === 'ADMINISTARTION' && (
                            <div className="RegisForm_1">
                                <label>Administration <span>:</span></label>
                                <select name="MaintenanceAdministration" value={MaintenanceAssetformData.MaintenanceAdministration} onChange={MaintenancehandleInputChange}>
                                    <option value="">Select Administration</option>
                                    {MaintenanceAdministrations.map((admin) => (
                                        <option key={admin.id} value={admin.id}>{admin.AdministrationName}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {MaintenanceAssetformData.MaintenanceDepartment && Maintenancedepartments.find(d => d.id.toString() === MaintenanceAssetformData.MaintenanceDepartment)?.DepartmentName === 'OT' && (
                            <div className="RegisForm_1">
                                <label>Theatre Name <span>:</span></label>
                                <select name="MaintenanceTheatreName" value={MaintenanceAssetformData.MaintenanceTheatreName} onChange={MaintenancehandleInputChange}>
                                    <option value="">Select Theatre Name</option>
                                    {MaintenanceTheatreNames.map((theatre) => (
                                        <option key={theatre.id} value={theatre.id}>{theatre.TheatreName}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        {MaintenanceAssetformData.MaintenanceDepartment && Maintenancedepartments.find(d => d.id.toString() === MaintenanceAssetformData.MaintenanceDepartment)?.DepartmentName === 'OP' && (
                            <div className="RegisForm_1">
                                <label>Consultation Room Name <span>:</span></label>
                                <select name="MaintenanceConsultationRoom" value={MaintenanceAssetformData.MaintenanceConsultationRoom} onChange={MaintenancehandleInputChange}>
                                    <option value="">Select Consultation Room Name</option>
                                    {MaintenanceConsultationRoomNames.map((room) => (
                                        <option key={room.id} value={room.id}>{room.ConsultationRoomName}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                        <div className="RegisForm_1">
                            <label>Asset Category <span>:</span></label>
                            <select value={selectedMaintenanceCategory} onChange={handleMaintenanceCategoryChange}>
                                <option value="">Select Asset Category</option>
                                {MaintenanceCategories.map((category) => (
                                    <option key={category.id} value={category.id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="RegisForm_1">
                            <label>Asset Subcategory <span>:</span></label>
                            <select
                                value={selectedMaintenanceSubcategory}
                                onChange={handleMaintenanceSubcategoryChange}
                                disabled={!selectedMaintenanceCategory}
                            >
                                <option value="">Select Asset Subcategory</option>
                                {MaintenanceSubcategories.map((subcategory) => (
                                    <option key={subcategory.id} value={subcategory.id}>{subcategory.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="RegisForm_1">
                            <label>Asset <span>:</span></label>
                            <select
                                value={selectedMaintenanceAsset}
                                onChange={handleMaintenanceAssetChange}
                                disabled={!selectedMaintenanceSubcategory}
                            >
                                <option value="">Select Asset</option>
                                {MaintenanceAssets.map((asset) => (
                                    <option key={asset.id} value={asset.id}>{asset.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Checklist Display */}
                    {Object.keys(checklistData).length > 0 ? (
                        <div className="checklist-container">
                            <h4>Checklist Items</h4>
                            {Object.entries(checklistData).map(([assetId, items]) => {
                                const schedule = maintenanceSchedules.find(sched => sched.asset === parseInt(assetId) && isMaintenanceDay(sched));
                                if (!schedule) return null;

                                return (
                                    <div key={assetId} className="asset-checklist-card" style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                                        <h5>{items[0]?.assetName} ({items[0]?.subcategoryName})</h5>
                                        <div className="checklist-cards">
                                            {items.map((item) => (
                                                <div key={item.id} className="checklist-card">
                                                    <label className="checklist-item">
                                                        <input
                                                            type="checkbox"
                                                            checked={checklistStatus[item.id] || false}
                                                            onChange={() => handleChecklistChange(item.id)}
                                                        />
                                                        <span>{item.item_name}</span>
                                                    </label>
                                                    {!checklistStatus[item.id] && (
                                                        <input
                                                            type="text"
                                                            value={checklistInputs[item.id] || ''}
                                                            onChange={(e) => handleChecklistInputChange(item.id, e.target.value)}
                                                            placeholder="Enter details"
                                                            className="checklist-input"
                                                        />
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                        <div className="Main_container_Btn" style={{ marginTop: '10px' }}>
                                            <button onClick={(e) => handle_Maintenance_Submit(e, assetId, schedule.id)}>
                                                Submit
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p>No maintenance checklists available for today.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Maintenance;