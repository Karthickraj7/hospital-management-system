import React, { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import { Button } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';

const AssetCategories = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector(state => state.userRecord?.UserData);
    const [categoryName, setCategoryName] = useState('');
    const [status, setStatus] = useState('active');
    const [categories, setCategories] = useState([]);
    const [editingCategoryId, setEditingCategoryId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (!userRecord) {
            console.log("User record not available, waiting...");
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        axios
            .get(`${UrlLink}AccetCategory/asset_categories_list/`, {
                withCredentials: true // Ensure session cookies are sent
            })
            .then((response) => {
                console.log("API Response:", response.data);

                if (Array.isArray(response.data)) {
                    // Check if user is host or admin
                    if (userRecord?.username === "host" || userRecord?.username === "admin") {
                        // Show all categories for host or admin
                        setCategories(response.data);
                    } else if (userRecord?.Employeeid && userRecord?.AssetCategory_list?.[0]?.AssetCategoryAccessId) {
                        // Filter categories based on AssetCategoryAccessId for non-host/admin users
                        const filteredCategories = response.data.filter((category) =>
                            category.id === userRecord.AssetCategory_list[0].AssetCategoryAccessId
                        );
                        setCategories(filteredCategories);
                    } else {
                        // If no specific access, set empty array
                        setCategories([]);
                    }
                } else {
                    console.warn("Unexpected response format:", response.data);
                    setCategories([]);
                }
            })
            .catch((error) => {
                console.error("Error fetching categories:", error);
                setCategories([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [UrlLink, userRecord]);

    const fetchCategoryById = useCallback(async (id) => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/get_asset_category/${id}/`, {
                withCredentials: true
            });
            setCategoryName(response.data.name);
            setStatus(response.data.status);
            setEditingCategoryId(response.data.id);
        } catch (error) {
            console.error("Error fetching category:", error);
        }
    }, [UrlLink]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newCategory = { name: categoryName.toUpperCase(), status };

        try {
            if (editingCategoryId) {
                console.log("Updating category with ID", editingCategoryId);
                const response = await axios.put(
                    `${UrlLink}AccetCategory/update_asset_category/${editingCategoryId}/`,
                    newCategory,
                    { headers: { 'Content-Type': 'application/json' }, withCredentials: true }
                );
                setCategories(categories.map((cat) => (cat.id === editingCategoryId ? { ...cat, ...newCategory } : cat)));
                setEditingCategoryId(null);
            } else {
                console.log("Adding new category");
                const response = await axios.post(`${UrlLink}AccetCategory/asset_categories/`, newCategory, {
                    withCredentials: true
                });
                setCategories([...categories, response.data]);
            }

            setCategoryName('');
            setStatus('active');
        } catch (error) {
            console.error("Error adding/updating category:", error);
        }
    };

    const handleDeleteItemDetail = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this category?");
        if (!isConfirmed) return;

        try {
            const response = await axios.delete(`${UrlLink}AccetCategory/delete_Category/${id}/`, {
                withCredentials: true
            });

            if (response.status === 200) {
                console.log(response.data.message);
                setCategories(categories.filter((cat) => cat.id !== id));
            } else {
                console.log(response.data.error || 'Failed to delete the category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleEditAssetCategory = (category) => {
        fetchCategoryById(category.id);
    };

    const assetCategoriesColumn = [
        {
            key: 'id',
            name: 'Asset Category ID',
            frozen: true
        },
        {
            key: 'name',
            name: 'Asset Category Name',
            frozen: true
        },
        {
            key: 'status',
            name: 'Status',
            renderCell: ({ row }) => (
                <Button disabled={editingCategoryId === row.id} className="cell_btn">
                    {row.status === 'active' ? "ACTIVE" : "INACTIVE"}
                </Button>
            )
        },
        {
            key: 'Action',
            name: 'Action',
            renderCell: ({ row }) => (
                <div>
                    <Button className="cell_btn" onClick={() => handleEditAssetCategory(row)}>
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                    <Button className="cell_btn" onClick={() => handleDeleteItemDetail(row.id)}>
                        <DeleteIcon className="check_box_clrr_cancell" />
                    </Button>
                </div>
            )
        }
    ];

    return (
        <div className="Main_container_app">
            <h3>Asset Categories</h3>

            <div className="RegisFormcon_1" style={{ justifyContent: 'center' }}>
                <div className="RegisForm_1">
                    <label>
                        Asset Category Name <span>:</span>
                    </label>
                    <input
                        type="text"
                        name="categoryName"
                        value={categoryName}
                        onChange={(e) => setCategoryName(e.target.value)}
                        placeholder="Asset Category Name"
                        autoComplete="off"
                        required
                    />
                </div>

                <div className="RegisForm_1">
                    <label>
                        Status <span>:</span>
                    </label>
                    <select
                        name="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
            </div>

            <div className="Main_container_Btn">
                <button onClick={handleSubmit} style={{ width: "95px" }}>
                    {editingCategoryId ? "Update Category" : "Add Category"}
                </button>
            </div>

            {isLoading ? (
                <p>Loading categories...</p>
            ) : categories.length === 0 ? (
                <p>No data to display</p>
            ) : (
                <ReactGrid columns={assetCategoriesColumn} RowData={categories} />
            )}
        </div>
    );
};

export default AssetCategories;