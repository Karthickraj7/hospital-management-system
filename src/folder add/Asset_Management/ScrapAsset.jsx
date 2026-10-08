import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { Button } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";

const ScrapAsset = () => {
    const dispatch = useDispatch();
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const userRecord = useSelector(state => state.userRecord?.UserData);

    const [scrapAssetDatas, setScrapAssetDatas] = useState([]);
    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [assets, setAssets] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState("");
    const [selectedSubcategory, setSelectedSubcategory] = useState("");
    const [selectedAsset, setSelectedAsset] = useState("");
    const [scrapDate, setScrapDate] = useState("");
    const [reason, setReason] = useState("");
    const [approvedBy, setApprovedBy] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Fetch initial data
    useEffect(() => {
        const fetchData = async () => {
            try {
                await Promise.all([
                    fetchCategories(),
                    fetchScrapAssetData(),
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
    }, [dispatch]);

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

    // Fetch Scrap Asset Data
    const fetchScrapAssetData = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/scrap_asset_list`);
            if (Array.isArray(response.data)) {
                setScrapAssetDatas(response.data);
            } else {
                console.error("Unexpected API response format:", response.data);
                dispatch({
                    type: "toast",
                    value: { message: `Invalid scrap data format: ${JSON.stringify(response.data)}`, type: "error" },
                });
                setScrapAssetDatas([]);
            }
        } catch (error) {
            console.error("Error fetching scrap asset data:", error);
            dispatch({
                type: "toast",
                value: { message: error.response?.data?.error || "Failed to fetch scrap data.", type: "error" },
            });
            setScrapAssetDatas([]);
        }
    };

    // Handle Edit
    const handleEdit = async (row) => {
        try {
            setIsEditing(true);
            setEditingId(row.id);
            setSelectedCategory(row.category?.toString() || "");
            setSelectedSubcategory(row.asset_subcategory?.toString() || "");
            setSelectedAsset(row.asset?.toString() || "");
            setScrapDate(row.scrap_date || "");
            setReason(row.reason || "");
            setApprovedBy(row.approved_by || "");

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
        } catch (error) {
            console.error("Error preparing edit:", error);
            dispatch({
                type: "toast",
                value: { message: "Failed to load scrap data.", type: "error" },
            });
        }
    };

    // Handle Delete
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this scrap record?")) return;
        try {
            await axios.delete(`${UrlLink}AccetCategory/delete_scrap_asset/${id}`);
            dispatch({
                type: "toast",
                value: { message: "Scrap record deleted successfully!", type: "success" },
            });
            await fetchScrapAssetData();
        } catch (error) {
            console.error("Error deleting scrap record:", error);
            dispatch({
                type: "toast",
                value: { message: "Failed to delete scrap record.", type: "error" },
            });
        }
    };

    // Handle Submission
    const handleSubmit = async () => {
        setIsSubmitting(true);

        if (!selectedAsset || !selectedCategory || !selectedSubcategory) {
            dispatch({
                type: "toast",
                value: { message: "Please select category, subcategory, and asset.", type: "error" },
            });
            setIsSubmitting(false);
            return;
        }

        if (!scrapDate) {
            dispatch({
                type: "toast",
                value: { message: "Please provide scrap date.", type: "error" },
            });
            setIsSubmitting(false);
            return;
        }

        if (!reason.trim()) {
            dispatch({
                type: "toast",
                value: { message: "Please provide a reason for scrapping.", type: "error" },
            });
            setIsSubmitting(false);
            return;
        }

        if (!approvedBy.trim()) {
            dispatch({
                type: "toast",
                value: { message: "Please provide the approved by name.", type: "error" },
            });
            setIsSubmitting(false);
            return;
        }

        // Validate date is not in future
        const today = new Date().toISOString().split("T")[0];
        if (scrapDate > today) {
            dispatch({
                type: "toast",
                value: { message: "Scrap date cannot be in the future.", type: "error" },
            });
            setIsSubmitting(false);
            return;
        }

        try {
            const formDataToSubmit = {
                id: isEditing ? editingId : null,
                category: selectedCategory ? parseInt(selectedCategory) : null,
                asset_subcategory: selectedSubcategory ? parseInt(selectedSubcategory) : null,
                asset: selectedAsset ? parseInt(selectedAsset) : null,
                scrap_date: scrapDate,
                reason: reason.trim(),
                approved_by: approvedBy.trim(),
            };

            await axios.post(`${UrlLink}AccetCategory/scrap_asset_list`, formDataToSubmit);
            dispatch({
                type: "toast",
                value: {
                    message: `Scrap record ${isEditing ? "updated" : "created"} successfully!`,
                    type: "success",
                },
            });

            // Reset form
            setSelectedCategory("");
            setSelectedSubcategory("");
            setSelectedAsset("");
            setScrapDate("");
            setReason("");
            setApprovedBy("");
            setSubcategories([]);
            setAssets([]);
            setIsEditing(false);
            setEditingId(null);

            // Refresh scrap data
            await fetchScrapAssetData();
        } catch (error) {
            console.error("Error submitting scrap record:", error);
            dispatch({
                type: "toast",
                value: {
                    message: error.response?.data?.error || "Failed to record scrap.",
                    type: "error",
                },
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const ScrapAssetColumns = [
        { key: "id", name: "Scrap ID" },
        { key: "category_name", name: "Category" },
        { key: "subcategory_name", name: "Subcategory" },
        { key: "asset_name", name: "Asset" },
        { key: "scrap_date", name: "Scrap Date" },
        { key: "reason", name: "Reason" },
        { key: "approved_by", name: "Approved By" },
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
            <h3>Scrap Asset</h3>
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
                        onChange={(e) => setSelectedAsset(e.target.value)}
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
                        Scrap Date <span>:</span>
                    </label>
                    <input
                        type="date"
                        value={scrapDate}
                        onChange={(e) => setScrapDate(e.target.value)}
                    />
                </div>

                <div className="RegisForm_1">
                    <label>
                        Reason <span>:</span>
                    </label>
                    <textarea
                        style={{ height: '50px' }}
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        placeholder="Enter reason for scrapping"
                    />
                </div>

                <div className="RegisForm_1">
                    <label>
                        Approved By <span>:</span>
                    </label>
                    <input
                        type="text"
                        value={approvedBy}
                        onChange={(e) => setApprovedBy(e.target.value)}
                        placeholder="Enter approver's name"
                    />
                </div>
            </div>

            <div className="Main_container_Btn">
                <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    variant="contained"
                    color="primary"
                >
                    {isSubmitting ? "Submitting..." : isEditing ? "Update" : "Submit"}
                </Button>
            </div>

            <ReactGrid columns={ScrapAssetColumns} RowData={scrapAssetDatas} />
        </div>
    );
};

export default ScrapAsset;