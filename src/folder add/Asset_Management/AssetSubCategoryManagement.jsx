import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import { Button, Tabs, Tab, Box } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import axios from 'axios';
import DeleteIcon from '@mui/icons-material/Delete';


const AssetSubCategoryManagement = () => {
    const userRecord = useSelector(state => state.userRecord?.UserData);
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const [subCategoryName, setSubCategoryName] = useState('');
    const [selectedCategoryId, setSelectedCategoryId] = useState('');
    const [status, setStatus] = useState('active');
    const [categories, setCategories] = useState([]);
    const [subCategories, setSubCategories] = useState({});
    const [editingSubCategoryId, setEditingSubCategoryId] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeCategory, setActiveCategory] = useState(null);

   

    useEffect(() => {
        fetchData();
    }, [UrlLink]);

   
    const fetchData = async () => {
        if (!userRecord) {
            console.log("User record not available, waiting...");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const categoriesResponse = await axios.get(`${UrlLink}AccetCategory/asset_categories_list/`, {
                withCredentials: true // Ensure session cookies are sent
            });
            console.log("API Response:", categoriesResponse.data);

            let filteredCategories = [];
            if (Array.isArray(categoriesResponse.data)) {
                // Filter active categories only
                const activeCategories = categoriesResponse.data.filter(category => category.status === "active");

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
                setActiveCategory(filteredCategories[0]?.id || null);
            } else {
                console.warn("Unexpected response format:", categoriesResponse.data);
                setCategories([]);
                setActiveCategory(null);
            }

            // Fetch subcategories
            const subCategoriesResponse = await axios.get(`${UrlLink}AccetCategory/get_asset_subcategories/`, {
                withCredentials: true
            });
            const groupedSubCategories = subCategoriesResponse.data.reduce((acc, subCategory) => {
                if (!acc[subCategory.category]) {
                    acc[subCategory.category] = [];
                }
                acc[subCategory.category].push(subCategory);
                return acc;
            }, {});
            setSubCategories(groupedSubCategories);

        } catch (error) {
            console.error("Error fetching data:", error);
            setCategories([]);
            setActiveCategory(null);
            setSubCategories({});
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

   


    const handleSubmit = async (e) => {
        e.preventDefault();

        const categoryId = parseInt(selectedCategoryId, 10);

        if (isNaN(categoryId) || categoryId <= 0) {
            console.log('Please select a valid category.');
            return;
        }

        const newSubCategory = {
            name: subCategoryName.toUpperCase(),
            category: categoryId,
            status
        };

        try {
            if (editingSubCategoryId) {
                await axios.put(`${UrlLink}AccetCategory/update_asset_subcategory/${editingSubCategoryId}/`, newSubCategory);
                setEditingSubCategoryId(null);
            } else {
                await axios.post(`${UrlLink}AccetCategory/asset_subcategories/`, newSubCategory);
            }

            setSubCategoryName('');
            setStatus('active');
            setSelectedCategoryId('');

            const response = await axios.get(`${UrlLink}AccetCategory/get_asset_subcategories/`);
            const groupedSubCategories = response.data.reduce((acc, subCategory) => {
                if (!acc[subCategory.category]) {
                    acc[subCategory.category] = [];
                }
                acc[subCategory.category].push(subCategory);
                return acc;
            }, {});
            setSubCategories(groupedSubCategories);
        } catch (error) {
            console.error('Error adding/updating subcategory:', error);
            if (error.response && error.response.data) {
                setError(error.response.data.detail);
            }
        }
    };

    const startEditing = (subCategory) => {
        setSubCategoryName(subCategory.name);
        setSelectedCategoryId(subCategory.category);
        setStatus(subCategory.status);
        setEditingSubCategoryId(subCategory.id);
    };
    const handelDeleteite = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this subCategory?");
        if (!isConfirmed) return;
        try {
            const response = await fetch(`${UrlLink}AccetCategory/delete_AssetSubCategory/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data.message);
                fetchData();
            } else {
                console.log(data.error || 'Failed to delete the category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            console.log('An error occurred while deleting the category.');
        }

    }

    const toggleStatus = async (subCategory) => {
        const updatedSubCategory = { ...subCategory, status: subCategory.status === 'active' ? 'inactive' : 'active' };
        try {
            await axios.put(`${UrlLink}AccetCategory/update_asset_subcategory/${subCategory.id}/`, updatedSubCategory);
            setSubCategories(prev => {
                const updated = { ...prev };
                updated[subCategory.category] = updated[subCategory.category].map(sc => sc.id === subCategory.id ? updatedSubCategory : sc);
                return updated;
            });
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };
    const formattedSubCategories = Object.values(subCategories)
        .flat()
        .map((subCategory, index) => ({
            ...subCategory,
            index: index + 1 // Assigns sequential order
        }));


    const AssetSubCategoriesColumn = [
        {
            key: 'index',
            name: 'SubCategory ID',
            frozen: true,
            renderCell: (params) => params.row.index
        },
        { key: 'name', name: 'SubCategory Name', frozen: true },
        {
            key: 'category',
            name: 'Category Name',
            renderCell: (params) => {
                const category = categories.find(c => c.id === params.row.category);
                return category ? category.name : 'N/A';
            }
        }
        ,
        {
            key: 'status',
            name: 'Status',
            renderCell: (params) => (
                <Button className="cell_btn" onClick={() => toggleStatus(params.row)}>
                    {params.row.status === 'active' ? "ACTIVE" : "INACTIVE"}
                </Button>
            )
        },
        {
            key: 'Actions',
            name: 'Actions',
            renderCell: (params) => (
                <div>
                    <Button className="cell_btn" onClick={() => startEditing(params.row)}>
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                    <Button className="cell_btn" onClick={() => handelDeleteite(params.row.id)}>
                        <DeleteIcon className="check_box_clrr_cancell" />
                    </Button>
                </div>

            )
        },
    ];

    if (isLoading) return <p>Loading...</p>;
    if (error) return <p className="error">{error}</p>;

    return (
        <div className="Main_container_app">
            <h3>Asset SubCategory Management</h3>

            <div className="RegisFormcon_1" style={{ justifyContent: 'center' }}>
                <div className="RegisForm_1">
                    <label>Asset SubCategory Name <span>:</span></label>
                    <input
                        type="text"
                        value={subCategoryName}
                        onChange={(e) => setSubCategoryName(e.target.value)}
                        placeholder="Asset Subcategory Name"
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label>Status <span>:</span></label>
                    <select
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div className="RegisForm_1">
                    <label>Select Category <span>:</span></label>
                    <select
                        name="category"
                        value={selectedCategoryId}
                        onChange={(e) => setSelectedCategoryId(e.target.value)}
                    >
                        <option value="">Select Category</option>
                        {categories.map((category) => (
                            <option key={category.id} value={category.id}>
                                {category.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="Main_container_Btn">
                <button onClick={handleSubmit} style={{ width: "120px" }}>
                    {editingSubCategoryId ? "Update SubCategory" : "Add SubCategory"}
                </button>
            </div>

            <ReactGrid columns={AssetSubCategoriesColumn} RowData={formattedSubCategories} />
        </div>
    );
};

export default AssetSubCategoryManagement;
