import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import { Button } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from 'react-redux';
import DeleteIcon from '@mui/icons-material/Delete';




const AssetManagement = () => {
    const convertToNumber = (value) => {
        if (value === '' || value === null || value === undefined) return null;
        return Number(value);
    };

    const [RackMasterPage, setRackMasterPage] = useState('AssetRegister')
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector(state => state.userRecord?.UserData);



    // -------------------------------------------------AssetReg-------------------------------------
    const [assetCategories, setAssetCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [suppliers, setSuppliers] = useState([]);

    const [departments, setdepartments] = useState([]);
    const [wards, setwards] = useState([]);
    const [RoomNos, setRoomNos] = useState([]);
    const [Administartions, setAdministartion] = useState([]);
    const [TheatreNames, setTheatreNames] = useState([]);
    const [ConsultationroomNames, setConsultationroomNames] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [assetId, setAssetId] = useState(null);
    const [error, setError] = useState('');
    const [assets, setAssets] = useState([]);



    const initialFormState = {
        id: '',
        name: '',
        category: '',
        asset_subcategory: '',
        supplier: '',
        Company_Brand: '',
        department: '',
        departmentname: '',
        ward: '',
        Administartion: '',
        TheatreName: '',
        room: '',
        Consultationroom: '',

        condition: '',
        status: '',
        purchase_date: '',
        purchase_price: '',
        market_value: '',
        total_working_life: '',
        expected_working_life: '',
        valuation_method: '',
        is_new_asset: true,
        depreciation_method: '',
        depreciation_rate: '',
        salvage_value: '',
        appreciation_rate: '',
    };
    const [AssetformData, setAssetFormData] = useState(initialFormState);

    console.log(AssetformData.departmentname, 'departmentname');
    console.log(AssetformData.department, 'departmentname');



    useEffect(() => {
        const initializeData = async () => {
            try {
                await Promise.all([
                    fetchAssetsList(),
                    fetchAssetCategories(),
                    fetchDepartmentList(),
                    fetchWardList(),
                    fetchWardList_Roomno(),
                    fetchAdministartionNameData(),
                    fetchTheatreName(),
                    fetchConsultation_Room(),
                ]);
            } catch (error) {
                setError('Failed to initialize data');
            }
        };

        initializeData();
    }, []);

    const fetchAssetsList = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/Asset_Reg_Get/`);

            if (!Array.isArray(response.data)) {
                console.error('Invalid data format received:', response.data);
                setAssets([]);
                return;
            }

            const processedData = response.data.map(asset => ({
                ...asset,
                is_new_asset: asset.is_new_asset ?? false,
                purchase_date: asset.purchase_date || 'N/A',
                current_value: asset.current_value?.toFixed(2) || 'N/A',
                life_completed: asset.life_completed?.toFixed(2) || 'N/A',
                life_remain: asset.life_remain?.toFixed(2) || 'N/A',
                Company_Brand: asset.Company_Brand || 'N/A',
                condition: asset.condition || 'N/A',
                department_name: asset.department_name || 'N/A',
                ward_name: asset.ward_name || '',
                room_name: asset.room_name || '',
                Consultationroom: asset.Consultationroom || '',
                administration_name: asset.administration_name || 'N/A',
                theatre_name: asset.theatre_name || '',
                valuation_method: asset.valuation_method || ''
            }));

            setAssets(processedData);
        } catch (error) {
            console.error('Error fetching assets:', error);
            setError('Error fetching assets list');
            setAssets([]);
        }
    };


    const fetchAssetCategories = async () => {
        if (!userRecord) {
            console.log("User record not available, waiting...");
            return;
        }

        try {
            const response = await axios.get(`${UrlLink}AccetCategory/asset_categories_list/`, {
                withCredentials: true // Ensure session cookies are sent
            });
            console.log("categoriesResponse:", response);

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

                setAssetCategories(filteredCategories);
            } else {
                console.warn("Unexpected response format:", response.data);
                setAssetCategories([]);
                setError('Unexpected response format');
            }
        } catch (error) {
            console.error('Error fetching asset categories:', error);
            setAssetCategories([]);
            setError('Error fetching asset categories');
        }
    };

    const fetchSubcategoriesAssetList = async (categoryId) => {
        if (!categoryId) {
            setSubcategories([]);
            return;
        }
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/get_asset_subcategories/`);
            const allSubcategories = response.data;

            const filteredSubcategories = allSubcategories.filter(subcat => subcat.category === parseInt(categoryId));
            setSubcategories(filteredSubcategories);
        } catch (error) {
            setError('Error fetching subcategories');
            setSubcategories([]);
        }
    };



    const fetchSuppliers = async (subcategoryId) => {
        if (!subcategoryId) {
            setSuppliers([]);
            return;
        }
        try {
            const response = await axios.get(
                `${UrlLink}AccetCategory/suppliers_Data_Get/?subcategory_id=${subcategoryId}`
            );

            const activeSuppliers = response.data.filter(supplier => supplier.status === "active");

            setSuppliers(activeSuppliers);
        } catch (error) {
            console.error('Error fetching suppliers:', error.response ? error.response.data : error.message);
            setError('Error fetching suppliers');
            setSuppliers([]);
        }
    };
    // --------------------------------------------------------------------------------
    const fetchDepartmentList = async () => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Department_Detials_link`);
            console.log("deportment", res.data)
            setdepartments(res.data);
        } catch (err) {
            console.log("Error fetching departments:", err);
        }
    };

    const fetchWardList = async () => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Ward_Master_Detials_link`);
            setwards(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchWardList_Roomno = async () => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Room_Master_Detials_link`);
            const mappedRooms = res.data.map(room => ({
                ...room,
                id: room.id
            }));
            setRoomNos(mappedRooms);
        } catch (err) {
            console.error(err);
        }
    };
    const fetchAdministartionNameData = async () => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Administration_Details_link`);
            console.log("fetchAdministartionNameData", res.data)
            setAdministartion(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchTheatreName = async () => {
        try {
            const res = await axios.get(`${UrlLink}OT/OtTheaterMaster_Detials_link`);
            console.log("fetchTheatreName", res.data)
            setTheatreNames(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const fetchConsultation_Room = async () => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Consultation_Room_Details_link`);
            console.log("fetchThConsultation_RoomeatreName", res.data)
            setConsultationroomNames(res.data);
        } catch (err) {
            console.error(err);
        }
    };



    // ---------------------------------------------------------------------------
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === "checkbox" ? checked : value;

        setAssetFormData((prevData) => {
            let updatedData = { ...prevData, [name]: newValue };

            if (name === "category") {
                fetchSubcategoriesAssetList(value);
                updatedData = {
                    ...updatedData,
                    asset_subcategory: "",
                    supplier: "",
                };
            } else if (name === "asset_subcategory") {
                fetchSuppliers(value);
                updatedData = {
                    ...updatedData,
                    supplier: "",
                    Company_Brand: "",
                };
            } else if (name === "valuation_method") {
                updatedData = {
                    ...updatedData,
                    depreciation_method: "",
                    depreciation_rate: "",
                    salvage_value: "",
                    appreciation_rate: "",
                };
            } else if (name === "department") {
                const selectedDept = departments.find((dept) => dept.id.toString() === value);
                updatedData.department = value ? parseInt(value) : null;
                updatedData.departmentname = selectedDept ? selectedDept.DepartmentName : "";
            } else if (name === "ward") {
                updatedData = {
                    ...updatedData,
                    ward: value,
                };
            } else if (name === "Administartion") {
                updatedData = {
                    ...updatedData,
                    Administartion: value,
                };
            } else if (name === "room") {
                console.log(value, "value")
                updatedData = {
                    ...updatedData,
                    room: value,
                };
            } else if (name === "Consultationroom") {
                updatedData = {
                    ...updatedData,
                    Consultationroom: value,
                };
            }

            return updatedData;
        });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');


        try {
            const formDataToSubmit = {
                ...AssetformData,
                id: AssetformData.id ? parseInt(AssetformData.id) : null,
                purchase_date: AssetformData.purchase_date || null,
                supplier: AssetformData.supplier ? [parseInt(AssetformData.supplier)] : [], category: parseInt(AssetformData.category),
                asset_subcategory: AssetformData.asset_subcategory ? parseInt(AssetformData.asset_subcategory) : null,
                department: AssetformData.department ? parseInt(AssetformData.department) : null,
                departmentname: AssetformData.departmentname ? parseInt(AssetformData.departmentname) : null,
                ward: AssetformData.ward ? parseInt(AssetformData.ward) : null,
                administration: AssetformData.Administartion ? parseInt(AssetformData.Administartion) : null,
                theatre: AssetformData.TheatreName ? parseInt(AssetformData.TheatreName) : null,
                room: AssetformData.room ? parseInt(AssetformData.room) : null,
                Consultationroom: AssetformData.Consultationroom ? parseInt(AssetformData.Consultationroom) : null,
                purchase_price: parseFloat(AssetformData.purchase_price) || null,
                market_value: parseFloat(AssetformData.market_value) || null,
                total_working_life: parseInt(AssetformData.total_working_life) || null,
                expected_working_life: parseInt(AssetformData.expected_working_life) || null,
                valuation_method: AssetformData.valuation_method || null,
                depreciation_method: AssetformData.depreciation_method || null,
                depreciation_rate: parseFloat(AssetformData.depreciation_rate) || null,
                salvage_value: parseFloat(AssetformData.salvage_value) || null,
                appreciation_rate: parseFloat(AssetformData.appreciation_rate) || null
            };

            const url = isEditing
                ? `${UrlLink}AccetCategory/Asset_Reg_put/${assetId}/`
                : `${UrlLink}AccetCategory/Asset_Reg_post/`;
            console.log("submit data", formDataToSubmit)
            const method = isEditing ? 'put' : 'post';

            const response = await axios[method](url, formDataToSubmit);

            if (response.data.error) {
                throw new Error(response.data.error);
            }

            await fetchAssetsList();
            resetForm();

        } catch (error) {
            console.error('Submission error:', error);
            setError(error.response?.data?.error || error.message || 'Failed to save asset');
        }
    };

    const handelDeleteite_Asset = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this category?");

        if (!isConfirmed) return;

        try {
            const response = await fetch(`${UrlLink}AccetCategory/delete_AssetManegment/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data.message);
                fetchAssetsList();
            } else {
                console.log(data.error || 'Failed to delete the category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            console.log('An error occurred while deleting the category.');
        }
    };

    const handleEditAssetReg = (row) => {
        console.log("row.Consultationroom", row.Consultationroom)
        console.log("row", row)
        setAssetId(row.id);
        setIsEditing(true);

        setAssetFormData({
            ...initialFormState,
            id: row.id ? parseInt(row.id) : null,
            name: row.name,
            category: row.category?.toString() || '',
            asset_subcategory: row.asset_subcategory?.toString() || '',
            supplier: Array.isArray(row.supplier) ? row.supplier[0]?.toString() : '',
            Company_Brand: row.Company_Brand || '',
            department: row.department?.toString() || '',
            ward: row.ward?.toString() || '',
            administration: row.administration?.toString() || '',
            theatre: row.theatre?.toString() || '',
            room: row.room?.toString() || '',
            Consultationroom: row.Consultationroom?.toString() || '',
            condition: row.condition || '',
            status: row.status || '',
            purchase_date: row.purchase_date || '',
            purchase_price: row.purchase_price?.toString() || '',
            market_value: row.market_value?.toString() || '',
            total_working_life: row.total_working_life?.toString() || '',
            expected_working_life: row.expected_working_life?.toString() || '',
            valuation_method: row.valuation_method || '',
            is_new_asset: row.is_new_asset || false,
            depreciation_method: row.depreciation_method || '',
            depreciation_rate: row.depreciation_rate?.toString() || '',
            salvage_value: row.salvage_value?.toString() || '',
            appreciation_rate: row.appreciation_rate?.toString() || ''
        });

        if (row.category) fetchSubcategoriesAssetList(row.category);
        if (row.asset_subcategory) fetchSuppliers(row.asset_subcategory);
    };

    const resetForm = () => {
        setAssetFormData(initialFormState);
        setIsEditing(false);
        setAssetId(null);
        setSubcategories([]);
        setSuppliers([]);
    };

    const toggleStatusAssetReg = async (row) => {
        try {
            const newStatus = row.status === 'active' ? 'inactive' : 'active';
            await axios.put(
                `${UrlLink}AccetCategory/Asset_Reg_put/${row.id}/`,
                { status: newStatus },
            );
            await fetchAssetsList();
        } catch (error) {
            setError('Error updating status');
        }
    };

    const getLocationInfo = (location, wards, RoomNos, Administartions, TheatreNames, ConsultationroomNames) => {
        const result = {
            department_name: location.department_name || "N/A",
            ward: "N/A",
            room: "N/A",
            administration: location.administration_name || "N/A",
            theatre: location.theatre_name || "N/A",
            consultation: location.Consultationroom || "N/A",
        };

        if (location.department_name === "IP") {
            if (location.ward) {
                const ward = wards.find((w) => w.id === location.ward);
                result.ward = ward ? ward.WardName : "Unknown Ward";
            }
            if (location.room) {
                const room = RoomNos.find((r) => r.id === location.room);
                result.room = room ? room.Roomno : "Unknown Room";
            }
        }

        if (location.department_name === "ADMINISTRATION") {
            if (location.administration) {
                const admin = Administartions.find((a) => a.id === location.administration);
                result.administration = admin ? admin.AdministrationName : "Unknown Administration";
            }
        }

        if (location.department_name === "OT") {
            if (location.theatre) {
                const theatre = TheatreNames.find((t) => t.id === location.theatre);
                result.theatre = theatre ? theatre.TheatreName : "Unknown Theatre";
            }
        }

        if (location.department_name === "OP") {
            if (location.Consultationroom) {
                const consultation = ConsultationroomNames.find((c) => c.id === location.Consultationroom);
                result.consultation = consultation ? consultation.ConsultationroomName : "Unknown Consultation Room";
            }
        }

        return result;
    };

    const assetRegColumn = [
        {
            key: 'id',
            name: 'Asset id',
        },
        {
            key: 'name',
            name: 'Asset Name',
        },
        {
            key: 'asset_code',
            name: 'Asset Code',
            renderCell: (params) => params.row.asset_code || 'N/A'
        }
        , {
            key: 'category_name',
            name: 'category Name',
        }, {
            key: 'subcategory_name',
            name: 'subcategory Name',
            // renderCell: (params) => (Array.isArray(params.row.subcategory_name) ? params.row.subcategory_name.join(', ') : 'N/A')

        }, {
            key: 'supplier_names',
            name: 'supplier Name',
        }, {
            key: 'Company_Brand',
            name: 'Company Brand',
            renderCell: (params) => params.row.Company_Brand || 'N/A'
        },
        {
            key: 'is_new_asset',
            name: 'Is New Asset',
            renderCell: (params) => (params.row.is_new_asset ? "Yes" : "No")
        },
        {
            key: 'location',
            name: 'Location',
            renderCell: (params) => {
                const locationInfo = getLocationInfo(params.row, wards, RoomNos, Administartions, TheatreNames, ConsultationroomNames);
                if (params.row.department_name === "IP") {
                    return `Department: ${locationInfo.department_name}: Ward: ${locationInfo.ward}, Room: ${locationInfo.room}`;
                }
                if (params.row.department_name === "ADMINISTRATION") {
                    return `${locationInfo.department_name}: Administration: ${locationInfo.administration}`;
                }
                if (params.row.department_name === "OT") {
                    return `${locationInfo.department_name}: Theatre: ${locationInfo.theatre}`;
                }
                if (params.row.department_name === "OP") {
                    return `${locationInfo.department_name}: Consultation Room: ${locationInfo.consultation}`;
                }
                return `${locationInfo.department_name}`;
            },
        },
        {
            key: 'condition',
            name: 'condition',
        }, {
            key: 'purchase_date',
            name: 'purchase Date',
        }, {
            key: 'purchase_price',
            name: 'purchase Price',
        },
        {
            key: 'market_value',
            name: 'market Value',
        },
        {
            key: 'total_working_life',
            name: 'Total Working Life',
        }, {
            key: 'life_completed',
            name: 'Life Completed',
        }, {
            key: 'life_remain',
            name: 'life Remain',
        }, {
            key: 'current_value',
            name: 'current Value',
        }, {
            key: 'expected_working_life',
            name: 'Expected Working Life',
        }, {
            key: 'valuation_method',
            name: 'Valuation Method',
            renderCell: (params) => params.row.valuation_method || ''
        }, {
            key: 'depreciation_method',
            name: 'Depreciation Method',
            renderCell: (params) => params.row.depreciation_method || ''
        }, {
            key: 'depreciation_rate',
            name: 'Depreciation Rate',
        }, {
            key: 'appreciation_rate',
            name: 'Appreciation Rate',
        },
        {
            key: 'status',
            name: 'status',
            renderCell: (params) => (
                <Button className="cell_btn" onClick={() => toggleStatusAssetReg(params.row)}>
                    {params.row.status === 'IN_USE' ? "ACTIVE" : "INACTIVE"}
                </Button>
            )
        }, {
            key: 'Actions',
            name: 'Actions',
            renderCell: (params) => (
                <div>
                    <Button className="cell_btn" onClick={() => handleEditAssetReg(params.row)}>
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                    <Button className="cell_btn" onClick={() => handelDeleteite_Asset(params.row.id)}>
                        <DeleteIcon className="check_box_clrr_cancell" />
                    </Button>
                </div>

            )
        },
    ]
    // console.log("assetRegColumn",assetRegColumn)
    //  ------------------------------------------------------------------------------------------------
    // -------------------------------------------AssetList---------------------------------------------
    //// AssetList States
    const [AssetListSearchTerm, setAssetListSearchTerm] = useState('');
    const [AssetListCategories, setAssetListCategories] = useState([]);
    const [AssetListSubcategories, setAssetListSubcategories] = useState([]);
    // const [AssetListDepartments, setAssetListDepartments] = useState([]);
    const [AssetListData, setAssetListData] = useState([]);
    const [AssetListEditing, setAssetListEditing] = useState(null);
    const [AssetListRegData, setAssetListRegData] = useState([]);

    // AssetList Filters
    const [AssetListFilters, setAssetListFilters] = useState({
        name: '',
        category_id: '',
        subcategory_id: '',
        // department: '',
        asset_code: '',
        supplier: '',
        status: '',
        condition: '',
        valuation_method: '',
    });
    console.log("AssetListData:", AssetListData);


    useEffect(() => {
        AssetListFetchCategories();
        AssetListFetchRegData();
    }, []);



    useEffect(() => {
        AssetListFetchAssets();
    }, [AssetListFilters, AssetListSearchTerm]);

    useEffect(() => {
        console.log('Filters:', AssetListFilters);
        AssetListFetchAssets();
    }, [AssetListFilters, AssetListSearchTerm]);

    // Fetch categories
    const AssetListFetchCategories = async () => {
        if (!userRecord) {
            console.log("User record not available, waiting...");
            return;
        }

        try {
            const response = await axios.get(`${UrlLink}AccetCategory/asset_categories_list/`, {
                withCredentials: true // Ensure session cookies are sent
            });
            console.log("categoriesResponse:", response);

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

                setAssetListCategories(filteredCategories);
            } else {
                console.warn("Unexpected response format:", response.data);
                setAssetListCategories([]);
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setAssetListCategories([]);
        }
    };

    // Fetch registration data
    const AssetListFetchRegData = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/Asset_Reg_Get/`);
            setAssetListRegData(response.data);
        } catch (error) {
            console.error('Error fetching asset registration data:', error.response ? error.response.data : error.message);
        }
    };

    const AssetListFetchSubcategories = async (categoryId) => {
        if (!categoryId) {
            setAssetListSubcategories([]);
            return;
        }
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/get_asset_subcategories/`);
            const allSubcategories = response.data;

            const filteredSubcategories = allSubcategories.filter(subcat => subcat.category === parseInt(categoryId));
            setAssetListSubcategories(filteredSubcategories);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            setAssetListSubcategories([]);
        }
    };


    // Fetch departments
    // const AssetListFetchDepartments = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:8000/api/departments/');
    //         setAssetListDepartments(response.data);
    //     } catch (error) {
    //         console.error('Error fetching departments:', error);
    //     }
    // };

    const AssetListFetchAssets = async () => {
        try {
            console.log("Fetching asset list...");

            const params = {
                name: AssetListSearchTerm.trim() || '',
                asset_code: AssetListFilters.asset_code || '',
                category_id: AssetListFilters.category_id || '',
                subcategory_id: AssetListFilters.subcategory_id || '',
                supplier: AssetListFilters.supplier || '',
                status: AssetListFilters.status || '',
                condition: AssetListFilters.condition || '',
                valuation_method: AssetListFilters.valuation_method || '',
            };

            console.log("Sending Params:", params);

            const response = await axios.get(`${UrlLink}AccetCategory/assetList_Get/`, { params });
            console.log("Response Data Structure:", {
                firstItem: response.data[0],
                subcategoryStructure: response.data[0]?.subcategory
            });
            setAssetListData(response.data);
        } catch (error) {
            console.error("Error fetching assets:", error.response?.data || error.message);
            setAssetListData([]);
        }
    };

    const AssetListUpdateAssets = async (assetId) => {
        try {
            if (!assetId) {
                console.error("No asset ID provided for update");
                return;
            }

            // Validate asset code format
            if (!AssetListFilters.asset_code) {
                console.log("Asset code is required!");
                return;
            }

            const updateData = {
                id: assetId,
                name: AssetListFilters.name,
                asset_code: AssetListFilters.asset_code,
                category_id: AssetListFilters.category_id,
                subcategory_id: AssetListFilters.subcategory_id,
                supplier: AssetListFilters.supplier,
                status: AssetListFilters.status,
                condition: AssetListFilters.condition,
                valuation_method: AssetListFilters.valuation_method,
            };

            console.log("Sending update data:", updateData);

            const response = await axios.put(`${UrlLink}AccetCategory/assetList_PUT/${assetId}/`, updateData);
            console.log("Update response:", response.data);

            setAssetListEditing(null);
            await AssetListFetchAssets();
            console.log("Asset updated successfully!");
        } catch (error) {
            console.error("Error updating asset:", error);
            console.log("Failed to update asset. Please try again.");
        }
    };

    // Handle search
    const AssetListHandleSearch = (e) => {
        setAssetListSearchTerm(e.target.value);
    };

    // Handle filter changes
    const AssetListHandleFilterChange = (e) => {
        const { name, value } = e.target;

        setAssetListFilters(prevFilters => ({
            ...prevFilters,
            [name]: value,
        }));

        if (name === 'category_id') {
            setAssetListFilters(prevFilters => ({
                ...prevFilters,
                subcategory: '',
            }));
            AssetListFetchSubcategories(value);
        }
    };

    // // Handle page change
    // const AssetListHandlePageChange = (newPage) => {
    //     setCurrentPage(newPage);
    // };

    // Print function
    const AssetListHandlePrint = () => {
        window.print();
    };

    const AssetListHandle = async () => {
        console.log("Handling asset request...");
        if (AssetListFilters.category) {
            await AssetListUpdateAssets();
        } else {
            await AssetListFetchAssets();
        }
    };

    const AssetListHandleEdit = (asset) => {
        console.log("Selected Asset:", asset);

        setAssetListEditing(asset);
        setAssetListFilters({
            name: asset.name || '',
            asset_code: asset.asset_code || '',
            category_id: asset.category?.id || '',
            // Changed to handle single subcategory object
            subcategory_id: asset.subcategory?.id || '',
            supplier: Array.isArray(asset.supplier) ? asset.supplier[0] : asset.supplier || '',
            status: asset.status || '',
            condition: asset.condition || '',
            valuation_method: asset.valuation_method || '',
        });

        if (asset.category?.id) {
            AssetListFetchSubcategories(asset.category.id);
        }
    };

    const toggleStatusAssetList = async (asset) => {
        try {
            const newStatus = { ...asset, status: asset.status === 'active' ? 'inactive' : 'active' };

            await axios.put(`${UrlLink}AccetCategory/assetList_PUT/`, {
                asset_id: asset.id,
                status: newStatus,
            });
            AssetListFetchAssets();
        } catch (error) {
            console.error('Error updating asset status:', error);
        }
    };


    const AssetListColumns = [
        { key: "name", name: "Name" },
        {
            key: 'asset_code',
            name: 'Asset Code',
            renderCell: (params) => params.row.asset_code || 'N/A'
        },
        {
            key: "category",
            name: "Category",
            renderCell: (params) => params.row.category?.name || 'N/A'
        },
        {
            key: "subcategory",
            name: "Subcategory",
            renderCell: (params) => params.row.subcategory?.name || 'N/A'
        },
        {
            key: "supplier",
            name: "Supplier",
            renderCell: (params) => {
                if (Array.isArray(params.row.supplier)) {
                    return params.row.supplier.join(', ') || 'N/A';
                }
                return params.row.supplier || 'N/A';
            }
        },
        { key: "condition", name: "Condition" },
        { key: "valuation_method", name: "Valuation Method" },
        {
            key: "status",
            name: "Status",
            renderCell: (params) => (
                <Button className="cell_btn" onClick={() => toggleStatusAssetList(params.row)}>
                    {params.row.status === 'IN_USE' ? "ACTIVE" : "INACTIVE"}
                </Button>
            )
        }
    ];



    // -----------------------------Search Asset---------------------------------------
    const [searchAsset_List, setSearchAsset_List] = useState([]);
    const [searchAsset_CategoryList, setSearchAsset_CategoryList] = useState([]);
    const [searchAsset_SubcategoryList, setSearchAsset_SubcategoryList] = useState([]);
    // const [searchAsset_DepartmentList, setSearchAsset_DepartmentList] = useState([]);
    const [searchAsset_Data, setSearchAsset_Data] = useState([]);
    const [searchAsset_SelectedForEditing, setSearchAsset_SelectedForEditing] = useState(null);

    const [searchAsset_Filters, setSearchAsset_Filters] = useState({
        assetName: '',
        categoryId: '',
        subcategoryId: '',
        // departmentId: '',
        valuationMethod: '',
        conditionStatus: '',
        assetStatus: '',
    });

    useEffect(() => {
        fetchSearchAsset_List();
        fetchCategoryList();
        // fetchDepartmentList();
    }, []);

    useEffect(() => {
        if (searchAsset_Filters.categoryId) {
            fetchSubcategoryList(searchAsset_Filters.categoryId);
        } else {
            setSearchAsset_SubcategoryList([]);
        }
    }, [searchAsset_Filters.categoryId]);

    const fetchSearchAsset_List = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/assetList_Get/`);
            console.log("Asset Data:", response.data);
            setSearchAsset_List(response.data);
            setSearchAsset_Data(response.data);
        } catch (error) {
            console.error('Error fetching assets:', error);
        }
    };



    const fetchCategoryList = async () => {
        if (!userRecord) {
            console.log("User record not available, waiting...");
            return;
        }

        try {
            const response = await axios.get(`${UrlLink}AccetCategory/asset_categories_list/`, {
                withCredentials: true // Ensure session cookies are sent
            });
            console.log("categoriesResponse:", response);

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

                setSearchAsset_CategoryList(filteredCategories);
            } else {
                console.warn("Unexpected response format:", response.data);
                setSearchAsset_CategoryList([]);
            }
        } catch (error) {
            console.error('Error fetching asset categories:', error);
            setSearchAsset_CategoryList([]);
        }
    };

    const fetchSubcategoryList = async (categoryId) => {
        if (!categoryId) {
            setSearchAsset_SubcategoryList([]);
            return;
        }
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/get_asset_subcategories/`);
            const allSubcategories = response.data;

            const filteredSubcategories = allSubcategories.filter(subcat => subcat.category === parseInt(categoryId));
            setSearchAsset_SubcategoryList(filteredSubcategories);

            console.log("Filtered Subcategories:", filteredSubcategories);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            setSearchAsset_SubcategoryList([]);
        }
    };


    // const fetchDepartmentList = async () => {
    //     try {
    //         const response = await axios.get('http://localhost:8000/api/departments/');
    //         setSearchAsset_DepartmentList(response.data);
    //     } catch (error) {
    //         console.error('Error fetching departments:', error);
    //     }
    // };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchAsset_Filters(prevFilters => {
            const newFilters = { ...prevFilters, [name]: value };
            if (name === 'categoryId') {
                newFilters.subcategoryId = '';
            }
            return newFilters;
        });
    };

    useEffect(() => {
        fetchCategoryList();
    }, []);

    const handleSearch = async () => {
        const { assetName, categoryId, subcategoryId, valuationMethod, conditionStatus, assetStatus } = searchAsset_Filters;

        if (!assetName && !categoryId && !subcategoryId && !valuationMethod && !conditionStatus && !assetStatus) {
            console.log("Please fill at least one field before searching.");
            return;
        }


        try {
            // Convert filters to URL parameters
            const params = new URLSearchParams();
            if (assetName) params.append('name', assetName);
            if (categoryId) params.append('category', categoryId);
            if (subcategoryId) params.append('subcategory', subcategoryId);
            if (valuationMethod) params.append('valuation_method', valuationMethod);
            if (conditionStatus) params.append('condition', conditionStatus);
            if (assetStatus) params.append('status', assetStatus);

            const response = await axios.get(`${UrlLink}AccetCategory/assetList_Get/?${params.toString()}`);
            setSearchAsset_Data(response.data);
            setSearchAsset_List(response.data);
        } catch (error) {
            console.error('Error fetching filtered assets:', error);
            console.log('Error fetching data. Please try again.');
        }
    };


    const toggleStatusSearchAsset = async (asset) => {
        const updatedStatus = asset.status === 'active' ? 'inactive' : 'active';
        try {
            await axios.patch(`http://localhost:8000/api/assets/${asset.id}/`, { status: updatedStatus });

            const updatedAssets = searchAsset_List.map(item =>
                item.id === asset.id ? { ...item, status: updatedStatus } : item
            );
            setSearchAsset_List(updatedAssets);
            setSearchAsset_Data(updatedAssets);
        } catch (error) {
            console.error('Error toggling asset status:', error);
        }
    };

    const handleEditSearchAssetCategory = (asset) => {
        console.log('Editing asset category:', asset);
        setSearchAsset_SelectedForEditing(asset);
    };



    const assetSearchColumn = [
        { key: 'id', name: 'ID' },
        { key: 'name', name: 'Name' },
        {
            key: 'asset_code',
            name: 'Asset Code',
            renderCell: (params) => params.row.asset_code || '-'
        },

        {
            key: 'category',
            name: 'Category Name',
            renderCell: (params) => params.row.category?.name || '-'
        },

        {
            key: 'asset_subcategory',
            name: 'Subcategory Name',
            renderCell: (params) => {
                console.log("Subcategory Data:", params.row.subcategory);
                return params.row.subcategory && typeof params.row.subcategory === 'object'
                    ? params.row.subcategory.name
                    : '-';
            }


        }
        ,

        {
            key: 'supplier_name',
            name: 'Supplier Name',
            renderCell: (params) => Array.isArray(params.row.supplier) ? params.row.supplier.join(', ') : '-'
        },

        { key: 'condition', name: 'Condition' },

        {
            key: 'status',
            name: 'Status',
            renderCell: (params) => (
                <Button className="cell_btn" onClick={() => toggleStatusSearchAsset(params.row)}>
                    {params.row.status === 'IN_USE' ? "ACTIVE" : "INACTIVE"}
                </Button>
            )
        },

        // {
        //     key: 'Actions',
        //     name: 'Actions',
        //     renderCell: (params) => (
        //         <Button className="cell_btn" onClick={() => handleEditSearchAssetCategory(params.row)}>
        //             <EditIcon className="check_box_clrr_cancell" />
        //         </Button>
        //     )
        // },
    ];

    // -------------------------------------------------------------------------------------------------
    // ------------------------AssetManagement-----------------------------

    const [AssetManagement_assets, setAssetManagement_Assets] = useState([]);
    const [AssetManagement_isEditing, setAssetManagement_IsEditing] = useState(false);
    const [editingAssetId_AssetManagement, setEditingAssetId_AssetManagement] = useState(null);
    const [assetManagementData, setAssetManagementData] = useState([]);



    const [AssetManagement_formData, setAssetManagement_FormData] = useState({
        id: '', name: '', category: '', asset_subcategory: '', supplier: '',
        department: '', room: '', condition: '',
        status: '', purchase_date: '', purchase_price: '', market_value: '',
        total_working_life: '', expected_working_life: '', valuation_method: '',
        is_new_asset: true, depreciation_method: '', depreciation_rate: '',
        salvage_value: '', appreciation_rate: ''
    });

    useEffect(() => {
        fetchAsset_AssetManagement();
    }, []);

    const fetchAsset_AssetManagement = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/Asset_Reg_Get/`);
            setAssets(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching assets:', error.response ? error.response.data : error.message);
        }
    };

    const handleEditAsset_AssetManagement = (asset) => {
        setAssetManagement_FormData({
            id: asset.id, name: asset.name, category: asset.category.toString(),
            asset_subcategory: asset.asset_subcategory.toString(), supplier: asset.supplier.toString(),
            department: asset.department.toString(),
            room: asset.room, condition: asset.condition, status: asset.status,
            purchase_date: asset.purchase_date, purchase_price: asset.purchase_price.toString(),
            market_value: asset.market_value ? asset.market_value.toString() : '',
            total_working_life: asset.total_working_life.toString(),
            expected_working_life: asset.expected_working_life.toString(),
            valuation_method: asset.valuation_method, is_new_asset: asset.is_new_asset,
            depreciation_method: asset.depreciation_method || '',
            depreciation_rate: asset.depreciation_rate ? asset.depreciation_rate.toString() : '',
            salvage_value: asset.salvage_value ? asset.salvage_value.toString() : '',
            appreciation_rate: asset.appreciation_rate ? asset.appreciation_rate.toString() : ''
        });

        setEditingAssetId_AssetManagement(true);
        setEditingAssetId_AssetManagement(asset.id);
    };

    const toggleStatus_AssetManagement = (asset) => {
        const updatedAsset = { ...asset, status: asset.status === 'active' ? 'inactive' : 'active' };
        setAssets(assets.map(a => (a.id === asset.id ? updatedAsset : a)));
    };

    const handle_Print_Assetmanagemnet = () => {

    }
    const handle_AssetManagementData_Search = () => {

    }


    const assetManagementColumns = [
        { key: 'name', name: 'Name', frozen: true },
        { key: 'asset_code', name: 'Asset Code', frozen: true },
        {
            key: 'category',
            name: 'Category',
        },
        {
            key: 'asset_subcategory',
            name: 'Subcategory',
        },
        {
            key: 'supplier',
            name: 'Supplier',
        },
        {
            key: 'status', name: 'Status', renderCell: (params) => (
                <Button className="cell_btn" onClick={() => toggleStatus_AssetManagement(params.row)}>
                    {params.row.status === 'active' ? "ACTIVE" : "INACTIVE"}
                </Button>
            )
        },
        { key: 'purchase_date', name: 'Purchase Date' },
        { key: 'purchase_price', name: 'Purchase Price' },
        // {
        //     key: 'actions', name: 'Actions', renderCell: (params) => (
        //         <Button className="cell_btn" onClick={() => handleEditAsset_AssetManagement(params.row)}>
        //             <EditIcon className="check_box_clrr_cancell" />
        //         </Button>
        //     )
        // }
    ];
    // ----------------------------------------------------------------------------------------------------

    return (
        <div className="Main_container_app">
            <h3>Asset Management</h3>
            <br />
            <div className="RegisterTypecon">
                <div className="RegisterType">

                    {["AssetRegister", "AssetList", "Searchasset", "AssetManagementData"].map((p, ind) => (

                        <div className="registertypeval" key={ind}>
                            <input
                                type="radio"
                                id={p}
                                name="appointment_type"
                                checked={RackMasterPage === p}
                                onChange={(e) => {
                                    setRackMasterPage(e.target.value)
                                }}
                                value={p}
                            />
                            <label htmlFor={p}>
                                {p}
                            </label>
                        </div>
                    ))}

                </div>
            </div>
            <br />
            {/* -------------------------------------AssetRegister----------------------------- */}
            {RackMasterPage === 'AssetRegister' && <>
                <br />

                <div className="RegisFormcon_1">
                    <div className="RegisForm_1">
                        <label>Asset Name <span>:</span></label>
                        <input
                            type="text"
                            name="name"
                            value={AssetformData.name}
                            onChange={handleInputChange}
                            placeholder="Asset Name"
                            required
                        />
                    </div>

                    <div className="RegisForm_1">
                        <label>Category <span>:</span></label>
                        <select
                            name="category"
                            value={AssetformData.category}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Category</option>
                            {assetCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>Subcategory <span>:</span></label>
                        <select
                            name="asset_subcategory"
                            value={AssetformData.asset_subcategory}
                            onChange={handleInputChange}
                            required
                            disabled={!AssetformData.category}
                        >
                            <option value="">Select Subcategory</option>
                            {subcategories.map((subcategory) => (
                                <option key={subcategory.id} value={subcategory.id}>
                                    {subcategory.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>Supplier <span>:</span></label>
                        <select
                            name="supplier"
                            value={AssetformData.supplier}
                            onChange={handleInputChange}
                            required
                            disabled={!AssetformData.asset_subcategory}
                        >
                            <option value="">Select Supplier</option>
                            {suppliers.map((supplier) => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>Company / Brand <span>:</span></label>
                        <input
                            type="text"
                            name="Company_Brand"
                            value={AssetformData.Company_Brand}
                            onChange={handleInputChange}
                            placeholder="Company Brand Name"
                            required
                        />
                    </div>
                    {/* ----------------------------------------------------------------------------------------- */}
                    <div className="RegisForm_1">
                        <label>Department <span>:</span></label>
                        <select
                            name="department"
                            value={AssetformData.department || ""}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select</option>
                            {departments.map((department, ind) => (
                                <option key={ind} value={department.id}>
                                    {department.DepartmentName}
                                </option>
                            ))}
                        </select>


                    </div>

                    {AssetformData.departmentname === 'IP' &&

                        <div className="RegisForm_1">
                            <label>Ward <span>:</span></label>
                            <select
                                name="ward"
                                value={AssetformData.ward}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Ward</option>
                                {wards.map((ward) => (
                                    <option key={ward.id} value={ward.id}>
                                        {ward.WardName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    }
                    {AssetformData.departmentname === 'IP' &&
                        <div className="RegisForm_1">
                            <label>Room No <span>:</span></label>
                            <select
                                name="room"
                                value={AssetformData.room}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Room No</option>
                                {RoomNos.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.Roomno}
                                    </option>
                                ))}
                            </select>
                        </div>

                    }

                    {AssetformData.departmentname === 'ADMINISTARTION' &&
                        <div className="RegisForm_1">
                            <label>Administartion <span>:</span></label>
                            <select
                                name="Administartion"
                                value={AssetformData.Administartion}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Administartion</option>
                                {Administartions.map((Administartion) => (
                                    <option key={Administartion.id} value={Administartion.id}>
                                        {Administartion.AdministrationName}
                                    </option>
                                ))}
                            </select>
                        </div>

                    }
                    {AssetformData.departmentname === 'OT' &&
                        <div className="RegisForm_1">
                            <label>TheatreName <span>:</span></label>
                            <select
                                name="TheatreName"
                                value={AssetformData.TheatreName}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select TheatreName</option>
                                {TheatreNames.map((TheatreName) => (
                                    <option key={TheatreName.id} value={TheatreName.id}>
                                        {TheatreName.TheatreName}
                                    </option>
                                ))}
                            </select>
                        </div>}

                    {AssetformData.departmentname === 'OP' &&
                        <div className="RegisForm_1">
                            <label>Consultation Room Name <span>:</span></label>
                            <select
                                name="Consultationroom"
                                value={AssetformData.Consultationroom}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Select Consultation Room Name</option>
                                {ConsultationroomNames.map((Consultationroom) => (
                                    <option key={Consultationroom.id} value={Consultationroom.id}>
                                        {Consultationroom.ConsultationroomName}
                                    </option>
                                ))}
                            </select>
                        </div>}

                    {/* -------------------------------------------------------------------------------------- */}
                    <div className="RegisForm_1">
                        <label>
                            Asset is new:
                            <input
                                type="checkbox"
                                name="is_new_asset"
                                checked={AssetformData.is_new_asset}
                                onChange={handleInputChange}
                            />
                        </label>
                    </div>

                    <div className="RegisForm_1">
                        <label>Purchase Date <span>:</span></label>
                        <input
                            type="date"
                            name="purchase_date"
                            value={AssetformData.purchase_date}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="RegisForm_1">
                        <label>Purchase Price <span>:</span></label>
                        <input
                            type="number"
                            name="purchase_price"
                            value={AssetformData.purchase_price}
                            onChange={handleInputChange}
                            placeholder="Purchase Price"
                            required
                        />
                    </div>

                    <div className="RegisForm_1">
                        <label>Total Working Life (years) <span>:</span></label>
                        <input
                            type="number"
                            name="total_working_life"
                            value={AssetformData.total_working_life}
                            onChange={handleInputChange}
                            placeholder="Total Working Life"
                            required
                        />
                    </div>





                    <div className="RegisForm_1">
                        <label>Condition <span>:</span></label>
                        <select
                            name="condition"
                            value={AssetformData.condition}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Condition</option>
                            <option value="GOOD">Good</option>
                            <option value="FAIR">Fair</option>
                            <option value="BAD">Bad</option>
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>Status <span>:</span></label>
                        <select
                            name="status"
                            value={AssetformData.status}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Status</option>
                            <option value="IN_USE">In Use</option>
                            <option value="MAINTENANCE">Under Maintenance</option>
                            <option value="SCRAPPED">Scrapped</option>
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>Market Value <span>:</span></label>
                        <input
                            type="number"
                            name="market_value"
                            value={AssetformData.market_value}
                            onChange={handleInputChange}
                            placeholder="Market Value"
                        />
                    </div>

                    <div className="RegisForm_1">
                        <label>Valuation Method <span>:</span></label>
                        <select
                            name="valuation_method"
                            value={AssetformData.valuation_method}
                            onChange={handleInputChange}
                            required
                        >
                            <option value="">Select Valuation Method</option>
                            <option value="DEPRECIATION">Depreciation</option>
                            <option value="APPRECIATION">Appreciation</option>
                            <option value="NONE">No Valuation</option>
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>Expected Working Life (Years) <span>:</span></label>
                        <input
                            type="number"
                            name="expected_working_life"
                            value={AssetformData.expected_working_life}
                            onChange={handleInputChange}
                            placeholder="Expected Working Life (Years)"
                            required
                        />
                    </div>

                    {AssetformData.valuation_method === 'DEPRECIATION' && (
                        <div>
                            <div className="RegisForm_1">
                                <label>Depreciation Method <span>:</span></label>
                                <select
                                    name="depreciation_method"
                                    value={AssetformData.depreciation_method}
                                    onChange={handleInputChange}
                                    required
                                >
                                    <option value="">Select Depreciation Method</option>
                                    <option value="STRAIGHT_LINE">Straight Line</option>
                                    <option value="DECLINING_BALANCE">Declining Balance</option>
                                </select>
                            </div>

                            <div className="RegisForm_1">
                                <label>Depreciation Rate <span>:</span></label>
                                <input
                                    type="number"
                                    name="depreciation_rate"
                                    value={AssetformData.depreciation_rate}
                                    onChange={handleInputChange}
                                    placeholder="Depreciation Rate"
                                    required
                                />
                            </div>

                            <div className="RegisForm_1">
                                <label>Salvage Value <span>:</span></label>
                                <input
                                    type="number"
                                    name="salvage_value"
                                    value={AssetformData.salvage_value}
                                    onChange={handleInputChange}
                                    placeholder="Salvage Value"
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {AssetformData.valuation_method === 'APPRECIATION' && (
                        <div className="RegisForm_1">
                            <label>Appreciation Rate <span>:</span></label>
                            <input
                                type="number"
                                name="appreciation_rate"
                                value={AssetformData.appreciation_rate}
                                onChange={handleInputChange}
                                placeholder="Appreciation Rate"
                                required
                            />
                        </div>
                    )}


                </div>
                <div className="Main_container_Btn">
                    <button onClick={handleSubmit} style={{ width: "95px" }}>
                        {isEditing ? 'Update Asset' : 'Add Asset'}
                    </button>
                </div>

                <ReactGrid columns={assetRegColumn} RowData={assets} />

            </>}
            {/* ------------------------------ AssetList --------------------------- */}
            {RackMasterPage === 'AssetList' && <>
                <br />

                <div className="RegisFormcon_1">
                    <div className="RegisForm_1">
                        <label>
                            Search by Name <span>:</span>
                        </label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Search by name..."
                            value={AssetListSearchTerm.name}
                            onChange={AssetListHandleSearch}
                        />
                    </div>

                    <div className="RegisForm_1">
                        <label>
                            Category <span>:</span>
                        </label>
                        <select name="category_id" value={AssetListFilters.category_id} onChange={AssetListHandleFilterChange}>
                            <option value="">Filter by Category</option>
                            {AssetListCategories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>
                            Subcategory <span>:</span>
                        </label>
                        <select
                            name="subcategory_id"
                            value={AssetListFilters.subcategory_id}
                            onChange={AssetListHandleFilterChange}
                            disabled={!AssetListFilters.category_id}
                        >
                            <option value="">Filter by Subcategory</option>
                            {AssetListSubcategories.map((subcategory) => (
                                <option key={subcategory.id} value={subcategory.id}>
                                    {subcategory.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* <div className="RegisForm_1">
                            <label>
                                Department <span>:</span>
                            </label>
                            <select name="department" value={AssetListFilters.department} onChange={AssetListHandleFilterChange}>
                                <option value="">Filter by Department</option>
                                {AssetListDepartments.map((department) => (
                                    <option key={department.id} value={department.id}>
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                        </div> */}

                    <div className="RegisForm_1">
                        <label>
                            Status <span>:</span>
                        </label>
                        <select name="status" value={AssetListFilters.status} onChange={AssetListHandleFilterChange}>
                            <option value="">Filter by Status</option>
                            <option value="IN_USE">In Use</option>
                            <option value="MAINTENANCE">Under Maintenance</option>
                            <option value="SCRAPPED">Scrapped</option>
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>
                            Condition <span>:</span>
                        </label>
                        <select name="condition" value={AssetListFilters.condition} onChange={AssetListHandleFilterChange}>
                            <option value="">Filter by Condition</option>
                            <option value="GOOD">Good</option>
                            <option value="FAIR">Fair</option>
                            <option value="BAD">Bad</option>
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>
                            Valuation Method <span>:</span>
                        </label>
                        <select name="valuation_method" value={AssetListFilters.valuation_method} onChange={AssetListHandleFilterChange}>
                            <option value="">Filter by Valuation Method</option>
                            <option value="DEPRECIATION">Depreciation</option>
                            <option value="APPRECIATION">Appreciation</option>
                            <option value="NONE">No Valuation</option>
                        </select>
                    </div>
                </div>

                <div className="Main_container_Btn">
                    <button onClick={AssetListHandlePrint} style={{ width: "95px" }}>
                        Print
                    </button>
                </div>
                <div className="Main_container_Btn">
                    <button onClick={AssetListHandle} style={{ width: "95px" }}>
                        Search
                    </button>
                </div>

                <ReactGrid
                    columns={AssetListColumns}
                    RowData={Array.isArray(AssetListData) ? AssetListData : []}
                />

            </>}
            {/* -------------------------Serach Asset-------------------------- */}
            {RackMasterPage === 'Searchasset' && <>
                <br />
                <div className="Main_container_app">

                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label>
                                Category <span>:</span>
                            </label>
                            <select
                                name="categoryId"
                                value={searchAsset_Filters.categoryId}
                                onChange={handleSearchChange}
                            >
                                <option value="">All Categories</option>
                                {searchAsset_CategoryList.map(category => (
                                    <option key={category.id} value={category.id.toString()}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="RegisForm_1">
                            <label>
                                Subcategory <span>:</span>
                            </label>
                            <select
                                name="subcategoryId"
                                value={searchAsset_Filters.subcategoryId}
                                onChange={handleSearchChange}
                                disabled={!searchAsset_Filters.categoryId}
                            >
                                <option value="">All Subcategories</option>
                                {searchAsset_SubcategoryList.map(subcategory => (
                                    <option key={subcategory.id} value={subcategory.id.toString()}>
                                        {subcategory.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* <div className="RegisForm_1">
                            <label>
                                Department <span>:</span>
                            </label>
                            <select
                                name="departmentId"
                                value={searchAsset_Filters.departmentId}
                                onChange={handleSearchChange}
                            >
                                <option value="">All Departments</option>
                                {fetchSearchAsset_DepartmentList.map(department => (
                                    <option key={department.id} value={department.id.toString()}>
                                        {department.name}
                                    </option>
                                ))}
                            </select>
                        </div> */}
                    </div>

                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label>
                                Asset Name <span>:</span>
                            </label>
                            <input
                                type="text"
                                name="assetName"
                                value={searchAsset_Filters.assetName}
                                onChange={handleSearchChange}
                                placeholder="Search by Name"
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label>
                                Valuation Method <span>:</span>
                            </label>
                            <select
                                name="valuationMethod"
                                value={searchAsset_Filters.valuationMethod}
                                onChange={handleSearchChange}
                            >
                                <option value="">All Valuation Methods</option>
                                <option value="DEPRECIATION">Depreciation</option>
                                <option value="APPRECIATION">Appreciation</option>
                                <option value="NONE">No Valuation</option>
                            </select>
                        </div>

                        <div className="RegisForm_1">
                            <label>
                                Condition <span>:</span>
                            </label>
                            <select
                                name="conditionStatus"
                                value={searchAsset_Filters.conditionStatus}
                                onChange={handleSearchChange}
                            >
                                <option value="">All Conditions</option>
                                <option value="GOOD">Good</option>
                                <option value="FAIR">Fair</option>
                                <option value="BAD">Bad</option>
                            </select>
                        </div>

                        <div className="RegisForm_1">
                            <label>
                                Status <span>:</span>
                            </label>
                            <select
                                name="assetStatus"
                                value={searchAsset_Filters.assetStatus}
                                onChange={handleSearchChange}
                            >
                                <option value="">All Status</option>
                                <option value="IN_USE">In Use</option>
                                <option value="MAINTENANCE">Under Maintenance</option>
                                <option value="SCRAPPED">Scrapped</option>
                            </select>
                        </div>
                    </div>

                    <div className="Main_container_Btn">
                        <button onClick={handleSearch} style={{ width: "95px" }}>
                            Search
                        </button>
                    </div>

                    <ReactGrid columns={assetSearchColumn} RowData={searchAsset_Data} />
                </div>

            </>}
            {/* ------------------------------AssetManagementData--------------------------- */}
            {RackMasterPage === 'AssetManagementData' && <>
                <br />
                <div className="Main_container_app">
                    <div className="Main_container_Btn">
                        <button onClick={handle_Print_Assetmanagemnet} style={{ width: "95px" }}>
                            Print
                        </button>
                    </div>
                    <div className="Main_container_Btn">
                        <button onClick={handle_AssetManagementData_Search} style={{ width: "95px" }}>
                            Search
                        </button>
                    </div>

                    <ReactGrid columns={assetManagementColumns} RowData={assetManagementData} />
                </div>
            </>}

        </div>
    );
};

export default AssetManagement;
