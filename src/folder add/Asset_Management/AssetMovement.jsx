import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const AssetMovement = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const dispatch = useDispatch();
    const userRecord = useSelector(state => state.userRecord?.UserData);

    const [AssetMovementDatas, setAssetMovementDatas] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [assets, setAssets] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [selectedAsset, setSelectedAsset] = useState("");
    const [departments, setDepartments] = useState([]);
    const [wards, setWards] = useState([]);
    const [RoomNos, setRoomNos] = useState([]);
    const [Administartions, setAdministartions] = useState([]);
    const [TheatreNames, setTheatreNames] = useState([]);
    const [ConsultationroomNames, setConsultationroomNames] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [movementDate, setMovementDate] = useState("");
    const [movementTime, setMovementTime] = useState("");

    const [fromLocation, setFromLocation] = useState({
        department: "",
        departmentname: "",
        ward: "",
        room: "",
        Administartion: "",
        TheatreName: "",
        Consultationroom: "",
    });

    const [toLocation, setToLocation] = useState({
        department: "",
        departmentname: "",
        ward: "",
        room: "",
        Administartion: "",
        TheatreName: "",
        Consultationroom: "",
    });


    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchCategories(),
                    fetchDepartments(),
                    fetchWardList(),
                    fetchWardList_Roomno(),
                    fetchAdministartionNameData(),
                    fetchTheatreName(),
                    fetchConsultation_Room(),
                    fetchAssetMovementData(),
                ]);
            } catch (error) {
                console.error("Error fetching initial data:", error);
                dispatch({
                    type: "toast",
                    value: { message: "Failed to fetch initial data.", type: "error" },
                });
            }
        };
        fetchData();
    }, [dispatch, UrlLink]);

    // Fetch Categories
    const fetchCategories = async () => {
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

                setCategories(filteredCategories);
            } else {
                console.warn("Unexpected response format:", response.data);
                setCategories([]);
                dispatch({
                    type: "toast",
                    value: { message: "Unexpected response format.", type: "error" },
                });
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
            dispatch({
                type: "toast",
                value: { message: "Failed to fetch categories.", type: "error" },
            });
        }
    };

    // Fetch Subcategories
    const handleCategoryChange = async (categoryId) => {
        setSelectedCategory(categoryId);
        setSelectedSubcategory("");
        setSelectedAsset("");
        setAssets([]);
        setSubcategories([]);

        if (!categoryId) return;

        try {
            const response = await axios.get(`${UrlLink}AccetCategory/get_asset_subcategories/`);
            const filteredSubcategories = response.data.filter(
                (subcat) => subcat.category === parseInt(categoryId)
            );
            setSubcategories(filteredSubcategories);
        } catch (error) {
            console.error("Error fetching subcategories:", error);
            dispatch({
                type: "toast",
                value: { message: "Failed to fetch subcategories.", type: "error" },
            });
        }
    };

    // Fetch Assets
    const handleSubcategoryChange = async (subcategoryId) => {
        setSelectedSubcategory(subcategoryId);
        setSelectedAsset("");
        setAssets([]);

        if (!subcategoryId) return;

        try {
            const response = await axios.get(
                `${UrlLink}AccetCategory/Asset_Reg_Get/?subcategory_id=${subcategoryId}`
            );
            if (Array.isArray(response.data)) {
                const filteredAssets = response.data.filter(
                    (asset) => asset.asset_subcategory === parseInt(subcategoryId)
                );
                setAssets(filteredAssets);
            } else {
                console.error("Unexpected API response format:", response.data);
                dispatch({
                    type: "toast",
                    value: { message: "Invalid response from server.", type: "error" },
                });
            }
        } catch (error) {
            console.error("Error fetching assets:", error);
            dispatch({
                type: "toast",
                value: { message: "Failed to fetch assets.", type: "error" },
            });
        }
    };

    // Handle Asset Selection
    const handleSelectedAsset = (assetId) => {
        setSelectedAsset(assetId);
    };

    // Fetch Departments
    const fetchDepartments = async () => {
        try {
            const response = await axios.get(`${UrlLink}Masters/Department_Detials_link`);
            setDepartments(response.data);
        } catch (error) {
            console.error("Error fetching departments:", error);
            dispatch({
                type: "toast",
                value: { message: "Failed to fetch departments.", type: "error" },
            });
        }
    };

    // Fetch Wards
    const fetchWardList = async () => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Ward_Master_Detials_link`);
            setWards(res.data);
        } catch (error) {
            console.error("Error fetching wards:", error);
            dispatch({
                type: "toast",
                value: { message: "Failed to fetch wards.", type: "error" },
            });
        }
    };

    // Fetch Rooms
    const fetchWardList_Roomno = async () => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Room_Master_Detials_link`);
            setRoomNos(res.data);
        } catch (error) {
            console.error("Error fetching rooms:", error);
            dispatch({
                type: "toast",
                value: { message: "Failed to fetch rooms.", type: "error" },
            });
        }
    };

    // Fetch Administrations
    const fetchAdministartionNameData = async () => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Administration_Details_link`);
            setAdministartions(res.data);
        } catch (error) {
            console.error("Error fetching administrations:", error);
            dispatch({
                type: "toast",
                value: { message: "Failed to fetch administrations.", type: "error" },
            });
        }
    };

    // Fetch Theatre Names
    const fetchTheatreName = async () => {
        try {
            const res = await axios.get(`${UrlLink}OT/OtTheaterMaster_Detials_link`);
            setTheatreNames(res.data);
        } catch (error) {
            console.error("Error fetching theatre names:", error);
            dispatch({
                type: "toast",
                value: { message: "Failed to fetch theatre names.", type: "error" },
            });
        }
    };

    // Fetch Consultation Rooms
    const fetchConsultation_Room = async () => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Consultation_Room_Details_link`);
            setConsultationroomNames(res.data);
        } catch (error) {
            console.error("Error fetching consultation rooms:", error);
            dispatch({
                type: "toast",
                value: { message: "Failed to fetch consultation rooms.", type: "error" },
            });
        }
    };

    // Fetch Asset Movement Data
    const fetchAssetMovementData = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/asset_movement_list`);
            if (Array.isArray(response.data)) {
                setAssetMovementDatas(response.data);
            } else {
                console.error("Unexpected API response format:", response.data);
                dispatch({
                    type: "toast",
                    value: { message: `Invalid movement data format: ${JSON.stringify(response.data)}`, type: "error" },
                });
                setAssetMovementDatas([]);
            }
        } catch (error) {
            console.error("Error fetching asset movement data:", error);
            dispatch({
                type: "toast",
                value: {
                    message: error.response?.data?.error || "Failed to fetch movement data.",
                    type: "error"
                },
            });
            setAssetMovementDatas([]);
        }
    };

    // Handle Input Changes for From Location
    const handleFromInputChange = (e) => {
        const { name, value } = e.target;
        setFromLocation((prev) => {
            let updatedData = { ...prev, [name]: value };
            if (name === "department") {
                const selectedDept = departments.find((dept) => dept.id.toString() === value);
                updatedData.department = value ? parseInt(value) : "";
                updatedData.departmentname = selectedDept ? selectedDept.DepartmentName : "";
                // Reset dependent fields
                updatedData.ward = "";
                updatedData.room = "";
                updatedData.Administartion = "";
                updatedData.TheatreName = "";
                updatedData.Consultationroom = "";
            }
            return updatedData;
        });
    };

    // Handle Input Changes for To Location
    const handleToInputChange = (e) => {
        const { name, value } = e.target;
        setToLocation((prev) => {
            let updatedData = { ...prev, [name]: value };
            if (name === "department") {
                const selectedDept = departments.find((dept) => dept.id.toString() === value);
                updatedData.department = value ? parseInt(value) : "";
                updatedData.departmentname = selectedDept ? selectedDept.DepartmentName : "";
                // Reset dependent fields
                updatedData.ward = "";
                updatedData.room = "";
                updatedData.Administartion = "";
                updatedData.TheatreName = "";
                updatedData.Consultationroom = "";
            }
            return updatedData;
        });
    };

    // Handle Edit
    const handleEdit = async (row) => {
        try {
            setIsEditing(true);
            setEditingId(row.id);
            setSelectedCategory(row.category?.toString() || "");
            setSelectedSubcategory(row.asset_subcategory?.toString() || "");
            setSelectedAsset(row.asset?.toString() || "");
            setMovementDate(row.movement_date || "");
            setMovementTime(row.movement_time ? row.movement_time.slice(0, 5) : "");

            // Fetch subcategories if category is set
            if (row.category) {
                const response = await axios.get(`${UrlLink}AccetCategory/get_asset_subcategories/`);
                const filteredSubcategories = response.data.filter(
                    (subcat) => subcat.category === parseInt(row.category)
                );
                setSubcategories(filteredSubcategories);
            }

            // Fetch assets if subcategory is set
            if (row.asset_subcategory) {
                const response = await axios.get(
                    `${UrlLink}AccetCategory/Asset_Reg_Get/?subcategory_id=${row.asset_subcategory}`
                );
                if (Array.isArray(response.data)) {
                    setAssets(
                        response.data.filter(
                            (asset) => asset.asset_subcategory === parseInt(row.asset_subcategory)
                        )
                    );
                }
            }

            setFromLocation({
                department: row.from_location.department?.toString() || "",
                departmentname: row.from_location.department_name || "",
                ward: row.from_location.ward?.toString() || "",
                room: row.from_location.room?.toString() || "",
                Administartion: row.from_location.Administartion?.toString() || "",
                TheatreName: row.from_location.TheatreName?.toString() || "",
                Consultationroom: row.from_location.Consultationroom?.toString() || "",
            });

            setToLocation({
                department: row.to_location.department?.toString() || "",
                departmentname: row.to_location.department_name || "",
                ward: row.to_location.ward?.toString() || "",
                room: row.to_location.room?.toString() || "",
                Administartion: row.to_location.Administartion?.toString() || "",
                TheatreName: row.to_location.TheatreName?.toString() || "",
                Consultationroom: row.to_location.Consultationroom?.toString() || "",
            });
        } catch (error) {
            console.error("Error preparing edit:", error);
            dispatch({
                type: "toast",
                value: { message: "Failed to load movement data.", type: "error" },
            });
        }
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this movement record?")) return;
        try {
            await axios.delete(`${UrlLink}AccetCategory/delete_asset_movement/${id}`);
            dispatch({
                type: "toast",
                value: { message: "Movement deleted successfully!", type: "success" },
            });
            await fetchAssetMovementData();
        } catch (error) {
            console.error("Error deleting movement:", error);
            dispatch({
                type: "toast",
                value: { message: "Failed to delete movement.", type: "error" },
            });
        }
    };

    // Handle Submission
    const handleSubmit = async () => {
        setIsSubmitting(true);

        if (!selectedAsset) {
            dispatch({
                type: "toast",
                value: { message: "Please select an asset.", type: "error" },
            });
            setIsSubmitting(false);
            return;
        }

        if (!fromLocation.department || !toLocation.department) {
            dispatch({
                type: "toast",
                value: { message: "Please select both from and to departments.", type: "error" },
            });
            setIsSubmitting(false);
            return;
        }

        if (!movementDate || !movementTime) {
            dispatch({
                type: "toast",
                value: { message: "Please provide movement date and time.", type: "error" },
            });
            setIsSubmitting(false);
            return;
        }

        // Validate date is not in future
        const today = new Date().toISOString().split("T")[0];
        if (movementDate > today) {
            dispatch({
                type: "toast",
                value: { message: "Movement date cannot be in the future.", type: "error" },
            });
            setIsSubmitting(false);
            return;
        }

        if (fromLocation.departmentname === "IP" && (!fromLocation.ward || !fromLocation.room)) {
            dispatch({
                type: "toast",
                value: { message: "Please select ward and room for the 'From' IP department.", type: "error" },
            });
            setIsSubmitting(false);
            return;
        }

        if (toLocation.departmentname === "IP" && (!toLocation.ward || !toLocation.room)) {
            dispatch({
                type: "toast",
                value: { message: "Please select ward and room for the 'To' IP department.", type: "error" },
            });
            setIsSubmitting(false);
            return;
        }

        if (fromLocation.departmentname === "ADMINISTARTION" && !fromLocation.Administartion) {
            dispatch({
                type: "toast",
                value: { message: "Please select administration for the 'From' ADMINISTARTION department.", type: "error" },
            });
            setIsSubmitting(false);
            return;
        }

        if (toLocation.departmentname === "ADMINISTARTION" && !toLocation.Administartion) {
            dispatch({
                type: "toast",
                value: { message: "Please select administration for the 'To' ADMINISTARTION department.", type: "error" },
            });
            setIsSubmitting(false);
            return;
        }

        if (fromLocation.departmentname === "OT" && !fromLocation.TheatreName) {
            dispatch({
                type: "toast",
                value: { message: "Please select theatre name for the 'From' OT department.", type: "error" },
            });
            setIsSubmitting(false);
            return;
        }

        if (toLocation.departmentname === "OT" && !toLocation.TheatreName) {
            dispatch({
                type: "toast",
                value: { message: "Please select theatre name for the 'To' OT department.", type: "error" },
            });
            setIsSubmitting(false);
            return;
        }

        if (fromLocation.departmentname === "OP" && !fromLocation.Consultationroom) {
            dispatch({
                type: "toast",
                value: { message: "Please select consultation room for the 'From' OP department.", type: "error" },
            });
            setIsSubmitting(false);
            return;
        }

        if (toLocation.departmentname === "OP" && !toLocation.Consultationroom) {
            dispatch({
                type: "toast",
                value: { message: "Please select consultation room for the 'To' OP department.", type: "error" },
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const formDataToSubmit = {
                id: isEditing ? editingId : null,
                asset: selectedAsset ? parseInt(selectedAsset) : null,
                asset_subcategory: selectedSubcategory ? parseInt(selectedSubcategory) : null,
                category: selectedCategory ? parseInt(selectedCategory) : null,
                from_location: {
                    department: fromLocation.department ? parseInt(fromLocation.department) : null,
                    department_name: fromLocation.departmentname || "",
                    ward: fromLocation.ward ? parseInt(fromLocation.ward) : null,
                    room: fromLocation.room ? parseInt(fromLocation.room) : null,
                    Administartion: fromLocation.Administartion ? parseInt(fromLocation.Administartion) : null,
                    TheatreName: fromLocation.TheatreName ? parseInt(fromLocation.TheatreName) : null,
                    Consultationroom: fromLocation.Consultationroom ? parseInt(fromLocation.Consultationroom) : null,
                },
                to_location: {
                    department: toLocation.department ? parseInt(toLocation.department) : null,
                    department_name: toLocation.departmentname || "",
                    ward: toLocation.ward ? parseInt(toLocation.ward) : null,
                    room: toLocation.room ? parseInt(toLocation.room) : null,
                    Administartion: toLocation.Administartion ? parseInt(toLocation.Administartion) : null,
                    TheatreName: toLocation.TheatreName ? parseInt(toLocation.TheatreName) : null,
                    Consultationroom: toLocation.Consultationroom ? parseInt(toLocation.Consultationroom) : null,
                },
                movement_date: movementDate,
                movement_time: movementTime,
            };

            await axios.post(`${UrlLink}AccetCategory/asset_movement_list`, formDataToSubmit);
            dispatch({
                type: "toast",
                value: {
                    message: `Asset movement ${isEditing ? "updated" : "recorded"} successfully!`,
                    type: "success",
                },
            });

            // Reset form
            setFromLocation({
                department: "",
                departmentname: "",
                ward: "",
                room: "",
                Administartion: "",
                TheatreName: "",
                Consultationroom: "",
            });
            setToLocation({
                department: "",
                departmentname: "",
                ward: "",
                room: "",
                Administartion: "",
                TheatreName: "",
                Consultationroom: "",
            });
            setSelectedCategory("");
            setSelectedSubcategory("");
            setSelectedAsset("");
            setMovementDate("");
            setMovementTime("");
            setSubcategories([]);
            setAssets([]);
            setIsEditing(false);
            setEditingId(null);

            // Refresh movement data
            await fetchAssetMovementData();
        } catch (error) {
            console.error("Error submitting asset movement:", error);
            dispatch({
                type: "toast",
                value: {
                    message: error.response?.data?.error || "Failed to record movement.",
                    type: "error",
                },
            });
        } finally {
            setIsSubmitting(false);
        }
    };


    const getLocationInfo = (location, wards, RoomNos) => {
        const result = {
            department_name: location.department_name || "N/A",
            ward: "N/A",
            room: "N/A",
            administration: location.AdministrationName || "N/A",
            theatre: location.TheatreName || "N/A",
            consultation: location.ConsultationroomName || "N/A",
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

        return result;
    };

    const AssetMovementColumn = [
        { key: "id", name: "Movement ID" },
        { key: "category_name", name: "Category" },
        { key: "subcategory_name", name: "Subcategory" },
        { key: "asset_name", name: "Asset" },
        { key: "movement_date", name: "Movement Date" },
        { key: "movement_time", name: "Movement Time" },
        {
            key: "original_location",
            name: "Original Location",
            renderCell: (params) => {
                const locationInfo = getLocationInfo(params.row.from_location, wards, RoomNos);
                if (params.row.from_location.department_name === "IP") {
                    return `Department: ${locationInfo.department_name}: Ward: ${locationInfo.ward}, Room: ${locationInfo.room}`;
                }
                if (params.row.from_location.department_name === "ADMINISTARTION") {
                    return `${locationInfo.department_name}: Administration: ${locationInfo.administration}`;
                }
                if (params.row.from_location.department_name === "OT") {
                    return `${locationInfo.department_name}: Theatre: ${locationInfo.theatre}`;
                }
                if (params.row.from_location.department_name === "OP") {
                    return `${locationInfo.department_name}: Consultation Room: ${locationInfo.consultation}`;
                }
                return `${locationInfo.department_name}`;
            },
        },
        {
            key: "new_location",
            name: "New Location",
            renderCell: (params) => {
                const locationInfo = getLocationInfo(params.row.to_location, wards, RoomNos);
                if (params.row.to_location.department_name === "IP") {
                    return `Department:${locationInfo.department_name}: Ward: ${locationInfo.ward}, Room: ${locationInfo.room}`;
                }
                if (params.row.to_location.department_name === "ADMINISTARTION") {
                    return `${locationInfo.department_name}: Administration: ${locationInfo.administration}`;
                }
                if (params.row.to_location.department_name === "OT") {
                    return `${locationInfo.department_name}: Theatre: ${locationInfo.theatre}`;
                }
                if (params.row.to_location.department_name === "OP") {
                    return `${locationInfo.department_name}: Consultation Room: ${locationInfo.consultation}`;
                }
                return `${locationInfo.department_name}`;
            },
        },
        {
            key: "Actions",
            name: "Actions",
            renderCell: (params) => (
                <div>
                    <Button className="cell_btn" onClick={() => handleEdit(params.row)}>
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                    <Button className="cell_btn" onClick={() => handleDelete(params.row.id)}>
                        <DeleteIcon className="check_box_clrr_cancell" />
                    </Button>
                </div>
            ),
        },
    ];




    return (
        <div className="Main_container_app">
            <h3>Asset Movement</h3>
            <br />
            <div className="RegisFormcon_1">
                <div className="RegisForm_1">
                    <label>
                        Select Category <span>:</span>
                    </label>
                    <select
                        value={selectedCategory}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                    >
                        <option value="">Select a Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="RegisForm_1">
                    <label>
                        Select Subcategory <span>:</span>
                    </label>
                    <select
                        value={selectedSubcategory}
                        onChange={(e) => handleSubcategoryChange(e.target.value)}
                        disabled={!selectedCategory}
                    >
                        <option value="">Select a Subcategory</option>
                        {subcategories.map((subcategory) => (
                            <option key={subcategory.id} value={subcategory.id}>
                                {subcategory.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="RegisForm_1">
                    <label>
                        Select Asset <span>:</span>
                    </label>
                    <select
                        value={selectedAsset}
                        onChange={(e) => handleSelectedAsset(e.target.value)}
                        disabled={!selectedSubcategory}
                    >
                        <option value="">Select an Asset</option>
                        {assets.map((asset) => (
                            <option key={asset.id} value={asset.id}>
                                {asset.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="RegisForm_1">
                    <label>
                        Movement Date <span>:</span>
                    </label>
                    <input
                        type="date"
                        value={movementDate}
                        onChange={(e) => setMovementDate(e.target.value)}
                    />
                </div>

                <div className="RegisForm_1">
                    <label>
                        Movement Time <span>:</span>
                    </label>
                    <input
                        type="time"
                        value={movementTime}
                        onChange={(e) => setMovementTime(e.target.value)}
                    />
                </div>

                <h4>Original Location</h4>
                <div className="RegisFormcon_1">
                    <div className="RegisForm_1">
                        <label>
                            Department <span>:</span>
                        </label>
                        <select
                            name="department"
                            value={fromLocation.department || ""}
                            onChange={handleFromInputChange}
                        >
                            <option value="">Select</option>
                            {departments.map((department, index) => (
                                <option key={`${department.id}-${index}`} value={department.id}>
                                    {department.DepartmentName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {fromLocation.departmentname === "IP" && (
                        <>
                            <div className="RegisForm_1">
                                <label>
                                    Ward <span>:</span>
                                </label>
                                <select
                                    name="ward"
                                    value={fromLocation.ward || ""}
                                    onChange={handleFromInputChange}
                                >
                                    <option value="">Select Ward</option>
                                    {wards.map((ward) => (
                                        <option key={ward.id} value={ward.id}>
                                            {ward.WardName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="RegisForm_1">
                                <label>
                                    Room No <span>:</span>
                                </label>
                                <select
                                    name="room"
                                    value={fromLocation.room || ""}
                                    onChange={handleFromInputChange}
                                >
                                    <option value="">Select Room No</option>
                                    {RoomNos.map((room) => (
                                        <option key={room.id} value={room.id}>
                                            {room.Roomno}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {fromLocation.departmentname === "ADMINISTARTION" && (
                        <div className="RegisForm_1">
                            <label>
                                Administration <span>:</span>
                            </label>
                            <select
                                name="Administartion"
                                value={fromLocation.Administartion || ""}
                                onChange={handleFromInputChange}
                            >
                                <option value="">Select Administration</option>
                                {Administartions.map((admin) => (
                                    <option key={admin.id} value={admin.id}>
                                        {admin.AdministrationName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {fromLocation.departmentname === "OT" && (
                        <div className="RegisForm_1">
                            <label>
                                Theatre Name <span>:</span>
                            </label>
                            <select
                                name="TheatreName"
                                value={fromLocation.TheatreName || ""}
                                onChange={handleFromInputChange}
                            >
                                <option value="">Select Theatre Name</option>
                                {TheatreNames.map((theatre) => (
                                    <option key={theatre.id} value={theatre.id}>
                                        {theatre.TheatreName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {fromLocation.departmentname === "OP" && (
                        <div className="RegisForm_1">
                            <label>
                                Consultation Room <span>:</span>
                            </label>
                            <select
                                name="Consultationroom"
                                value={fromLocation.Consultationroom || ""}
                                onChange={handleFromInputChange}
                            >
                                <option value="">Select Consultation Room</option>
                                {ConsultationroomNames.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.ConsultationroomName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <h4>New Location</h4>
                <div className="RegisFormcon_1">
                    <div className="RegisForm_1">
                        <label>
                            Department <span>:</span>
                        </label>
                        <select
                            name="department"
                            value={toLocation.department || ""}
                            onChange={handleToInputChange}
                        >
                            <option value="">Select</option>
                            {departments.map((department, index) => (
                                <option key={`${department.id}-${index}`} value={department.id}>
                                    {department.DepartmentName}
                                </option>
                            ))}
                        </select>
                    </div>

                    {toLocation.departmentname === "IP" && (
                        <>
                            <div className="RegisForm_1">
                                <label>
                                    Ward <span>:</span>
                                </label>
                                <select
                                    name="ward"
                                    value={toLocation.ward || ""}
                                    onChange={handleToInputChange}
                                >
                                    <option value="">Select Ward</option>
                                    {wards.map((ward) => (
                                        <option key={ward.id} value={ward.id}>
                                            {ward.WardName}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="RegisForm_1">
                                <label>
                                    Room No <span>:</span>
                                </label>
                                <select
                                    name="room"
                                    value={toLocation.room || ""}
                                    onChange={handleToInputChange}
                                >
                                    <option value="">Select Room No</option>
                                    {RoomNos.map((room) => (
                                        <option key={room.id} value={room.id}>
                                            {room.Roomno}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </>
                    )}

                    {toLocation.departmentname === "ADMINISTARTION" && (
                        <div className="RegisForm_1">
                            <label>
                                Administration <span>:</span>
                            </label>
                            <select
                                name="Administartion"
                                value={toLocation.Administartion || ""}
                                onChange={handleToInputChange}
                            >
                                <option value="">Select Administration</option>
                                {Administartions.map((admin) => (
                                    <option key={admin.id} value={admin.id}>
                                        {admin.AdministrationName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {toLocation.departmentname === "OT" && (
                        <div className="RegisForm_1">
                            <label>
                                Theatre Name <span>:</span>
                            </label>
                            <select
                                name="TheatreName"
                                value={toLocation.TheatreName || ""}
                                onChange={handleToInputChange}
                            >
                                <option value="">Select Theatre Name</option>
                                {TheatreNames.map((theatre) => (
                                    <option key={theatre.id} value={theatre.id}>
                                        {theatre.TheatreName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {toLocation.departmentname === "OP" && (
                        <div className="RegisForm_1">
                            <label>
                                Consultation Room <span>:</span>
                            </label>
                            <select
                                name="Consultationroom"
                                value={toLocation.Consultationroom || ""}
                                onChange={handleToInputChange}
                            >
                                <option value="">Select Consultation Room</option>
                                {ConsultationroomNames.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.ConsultationroomName}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>
            </div>

            <div className="Main_container_Btn">
                <button onClick={handleSubmit} disabled={isSubmitting} style={{ width: "125px" }}>
                    {isSubmitting ? "Submitting..." : isEditing ? "Update" : "Record Movement"}
                </button>
            </div>

            <ReactGrid columns={AssetMovementColumn} RowData={AssetMovementDatas} />
        </div>
    );
};

export default AssetMovement;
