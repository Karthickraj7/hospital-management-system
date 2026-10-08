
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { Button } from '@mui/material';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import EditIcon from "@mui/icons-material/Edit";
import { format, differenceInDays } from 'date-fns';
import DeleteIcon from '@mui/icons-material/Delete';


import './AMC.css';

const AssetAMC = () => {
    const userRecord = useSelector(state => state.userRecord?.UserData);

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const [RackMasterPage, setRackMasterPage] = useState('AMC/CMC')
    const [assetCategories, setAssetCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [assets, setAssets] = useState([]);
    const [amcs, setAmcs] = useState([]);
    const [serviceProviders, setServiceProviders] = useState([]);
    const [error, setError] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedAsset, setSelectedAsset] = useState('');
    const [assetAMCData, setassetAMCData] = useState([]);

    const [isEditing, setIsEditing] = useState(false);
    const [amcId, setAmcId] = useState(null);

    const [formData, setFormData] = useState({
        provider: '',
        start_date: '',
        end_date: '',
        cost: '',
        terms: '',
        warranty_type: 'partial',
        is_active: true,
        asset_type: '',
        parts: '',
        visit_frequency: '',
        category: '',
        subcategory: '',
    });


    useEffect(() => {
        fetchAssetCategories();
        fetchAMCs();
    }, []);

    const fetchAssetCategories = async () => {
        if (!userRecord) {
            console.log("User record not available, waiting...");
            return;
        }

        try {
            const response = await axios.get(`${UrlLink}AccetCategory/asset_categories_list/`, {
                withCredentials: true // Ensure session cookies are sent
            });
            console.log("AccetCategory response", response);

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
            }
        } catch (error) {
            console.error('Error fetching asset categories:', error);
            setAssetCategories([]);
        }
    };

    const fetchSubcategories = async (categoryId) => {
        if (!categoryId) {
            setSubcategories([]);
            return;
        }

        try {
            const response = await axios.get(`${UrlLink}AccetCategory/get_asset_subcategories/`);
            const allSubcategories = response.data;

            const filteredSubcategories = allSubcategories.filter(subcat => subcat.category === parseInt(categoryId));
            setSubcategories(filteredSubcategories);

            console.log("Filtered Subcategories:", filteredSubcategories);
        } catch (error) {
            console.error('Error fetching subcategories:', error);
            setSubcategories([]);
        }
    };


    const fetchAssets = async (subcategoryId) => {
        if (!subcategoryId) {
            setAssets([]);
            return;
        }

        try {
            const response = await axios.get(`${UrlLink}AccetCategory/Asset_Reg_Get/?subcategory_id=${subcategoryId}`);

            console.log("Full API Response:", response.data);

            if (Array.isArray(response.data)) {
                const filteredAssets = response.data.filter(asset =>
                    asset.asset_subcategory === parseInt(subcategoryId)
                );

                console.log("Filtered Assets:", filteredAssets);
                setAssets(filteredAssets);
            } else {
                console.error("Unexpected API response format:", response.data);
                setAssets([]);
            }
        } catch (error) {
            console.error('Error fetching assets:', error);
            setAssets([]);
        }
    };



    // const fetchServiceProviders = async (subcategoryId) => {
    //     if (!subcategoryId) {
    //         setServiceProviders([]);
    //         return;
    //     }
    //     try {
    //         const response = await axios.get(`${UrlLink}AccetCategory/ServiceProviderManagement_GET/?subcategory_id=${subcategoryId}`);
    //         setServiceProviders(response.data);
    //         setError('');
    //     } catch (error) {
    //         console.error('Error fetching Service Provider:', error.response ? error.response.data : error.message);
    //         setServiceProviders([]);
    //         setError('Failed to fetch Service Provider. Please try again.');
    //     }
    // };
    const fetchServiceProviders = async (subcategoryId) => {
        if (!subcategoryId) {
            setServiceProviders([]);
            return;
        }
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/ServiceProviderManagement_GET/?subcategory_id=${subcategoryId}`);

            // Filter only active service providers
            const activeServiceProviders = response.data.filter(provider => provider.status === "active");

            setServiceProviders(activeServiceProviders);
            setError('');
        } catch (error) {
            console.error('Error fetching Service Provider:', error.response ? error.response.data : error.message);
            setServiceProviders([]);
            setError('Failed to fetch Service Provider. Please try again.');
        }
    };



    useEffect(() => {
        if (selectedSubcategory) {
            fetchServiceProviders(selectedSubcategory);
        }
    }, [selectedSubcategory]);

    useEffect(() => {
        console.log('Fetched AMCs:', assetAMCData);
    }, [assetAMCData]);



    const fetchAMCs = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/AMC_CMC_GET`);
            setAmcs(response.data);
            setassetAMCData(response.data);
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



    const handleCategoryChange = (e) => {
        const categoryId = e.target.value;
        setSelectedCategory(categoryId);
        setSelectedSubcategory('');
        setSelectedAsset('');
        setSubcategories([]);
        setAssets([]);
        if (categoryId) {
            fetchSubcategories(categoryId);
        }
    };

    const handleSubcategoryChange = (e) => {
        const subcategoryId = e.target.value;
        setSelectedSubcategory(subcategoryId);
        setSelectedAsset('');
        setAssets([]);
        if (subcategoryId) {
            fetchAssets(subcategoryId);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,

            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const dataToSend = {
            ...formData,
            asset: selectedAsset ? parseInt(selectedAsset) : null,
            category: selectedCategory ? parseInt(selectedCategory) : null,
            asset_subcategory: selectedSubcategory ? parseInt(selectedSubcategory) : null,
            cost: formData.cost ? parseFloat(formData.cost) : 0,
        };

        console.log("dataToSend:", dataToSend);

        try {
            let response;

            if (isEditing && amcId) {
                response = await axios.put(`${UrlLink}AccetCategory/AMC_CMC_PUT/${amcId}`, dataToSend);
                console.log("dataToSend response:", response.data)
            } else {
                response = await axios.post(`${UrlLink}AccetCategory/AMC_CMC_POST`, dataToSend);
                console.log(response)
            }

            if (response) {
                console.log(`AMC successfully ${isEditing ? 'updated' : 'added'}!`);
                fetchAMCs();
                resetForm();
            }
        } catch (error) {
            if (error.response) {
                console.error('Error saving AMC:', error.response.data);
                console.log(`Error: ${error.response.data.error || 'Something went wrong!'}`);
            } else {
                console.error('Error saving AMC:', error);
                console.log('An unexpected error occurred!');
            }
        }
    };


    // const handleDelete = async (id) => {
    //     try {
    //         await axios.delete(`http://localhost:8000/api/amcs/${id}/`);
    //         fetchAMCs();  // Refresh the AMC list after deletion
    //     } catch (error) {
    //         console.error('Error deleting AMC:', error);
    //     }
    // };

    const resetForm = () => {
        setFormData({
            asset: '',
            category: '',
            subcategory: '',
            provider: '',
            start_date: '',
            end_date: '',
            cost: '',
            terms: '',
            warranty_type: 'partial',
            is_active: true,
            asset_type: '',
            parts: '',
            visit_frequency: '',
        });

        setIsEditing(false);
    };

    const toggleStatus = async (amc) => {
        try {
            const updatedStatus = amc.status === 'active' ? 'inactive' : 'active';
            const response = await axios.patch(`${UrlLink}AccetCategory/AMC_CMC_PUT/${amc.AMC_id}/`, { status: updatedStatus });

            if (response) {
                setAmcs(prevAmcs =>
                    prevAmcs.map(item =>
                        item.AMC_id === amc.AMC_id ? { ...item, status: updatedStatus } : item
                    )
                );
            }
        } catch (error) {
            console.error('Error toggling AMC status:', error);
        }
    };
    useEffect(() => {
        console.log("Updated Form Data:", formData);
    }, [formData]);

    useEffect(() => {
        if (selectedCategory && subcategories.length > 0 && isEditing) {
            const editingAMC = assetAMCData.find(amc => amc.id === amcId);
            if (editingAMC) {
                const subCat = subcategories.find(sc => sc.name === editingAMC.asset_subcategory);
                if (subCat) {
                    setSelectedSubcategory(subCat.id.toString());
                }
            }
        }
    }, [selectedCategory, subcategories, isEditing]);

    useEffect(() => {
        if (selectedSubcategory && assets.length > 0 && isEditing) {
            const editingAMC = assetAMCData.find(amc => amc.id === amcId);
            if (editingAMC) {
                const asset = assets.find(a => a.name === editingAMC.asset);
                if (asset) {
                    setSelectedAsset(asset.id.toString());
                }
            }
        }
    }, [selectedSubcategory, assets, isEditing]);

    useEffect(() => {
        if (selectedSubcategory && serviceProviders.length > 0 && isEditing) {
            const editingAMC = assetAMCData.find(amc => amc.id === amcId);
            if (editingAMC) {
                const provider = serviceProviders.find(p => p.name === editingAMC.provider);
                if (provider) {
                    setFormData(prev => ({
                        ...prev,
                        provider: provider.id.toString()
                    }));
                }
            }
        }
    }, [selectedSubcategory, serviceProviders, isEditing]);


    const handleEditAssetCategory = (amc) => {
        console.log("Editing AMC Data:", amc);

        if (amc.category_id !== undefined && amc.category_id !== null) {
            setSelectedCategory(amc.category_id.toString());
            fetchSubcategories(amc.category_id);
        } else {
            setSelectedCategory('');
        }

        setTimeout(() => {
            setSelectedSubcategory(amc.asset_subcategory_id ? amc.asset_subcategory_id.toString() : '');

            if (amc.asset_subcategory_id) {
                fetchAssets(amc.asset_subcategory_id);
                fetchServiceProviders(amc.asset_subcategory_id);
            }

            setTimeout(() => {
                setSelectedAsset(amc.asset_id ? amc.asset_id.toString() : '');

                setFormData({
                    ...formData,
                    provider: amc.provider_id ? amc.provider_id.toString() : '',
                    asset_type: amc.asset_type || '',
                    start_date: amc.start_date || '',
                    end_date: amc.end_date || '',
                    cost: amc.cost !== undefined && amc.cost !== null ? amc.cost.toString() : '',
                    warranty_type: amc.warranty_type || '',
                    is_active: amc.is_active || false,
                    parts: amc.parts || '',
                    visit_frequency: amc.visit_frequency || '',
                });
            });
        });

        setIsEditing(true);
        setAmcId(amc.id);
    };
    const handelDeleteite_AMC = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this category?");

        if (!isConfirmed) return;

        try {
            const response = await fetch(`${UrlLink}AccetCategory/delete_AMC/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data.message);
                fetchAMCs();
            } else {
                console.log(data.error || 'Failed to delete the category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            console.log('An error occurred while deleting the category.');
        }
    };


    const assetAMCColumn = [
        {
            key: 'id',
            name: 'ID',
        },
        {
            key: 'asset',
            name: 'Asset Name',
        },
        {
            key: 'category',
            name: 'Category',
        },
        {
            key: 'asset_subcategory',
            name: 'Subcategory',
        },
        {
            key: 'provider',
            name: 'Provider Name',
        },
        {
            key: 'asset_type',
            name: 'Asset Type',
        },
        {
            key: 'visit_frequency',
            name: 'Visit Frequency',
        },
        {
            key: 'start_date',
            name: 'Start Date',
        },
        {
            key: 'end_date',
            name: 'End Date',
        },
        {
            key: 'cost',
            name: 'Cost',
        },
        {
            key: 'warranty_type',
            name: 'Warranty Type',
        },
        {
            key: 'parts',
            name: 'Parts',
        },

        {
            key: 'terms',
            name: 'Terms',
        },
        {
            key: 'is_active',
            name: 'Status',
            renderCell: (params) => (
                <Button className="cell_btn" onClick={() => toggleStatus(params.row)}>
                    {params.row.is_active ? "ACTIVE" : "INACTIVE"}
                </Button>
            )
        },
        {
            key: 'Action',
            name: 'Action',
            renderCell: (params) => (
                <div>
                    <Button className="cell_btn" onClick={() => {
                        console.log("Editing AMC:", params.row);
                        handleEditAssetCategory(params.row);
                    }}>
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                    <Button className="cell_btn" onClick={() => handelDeleteite_AMC(params.row.id)}>
                        <DeleteIcon className="check_box_clrr_cancell" />
                    </Button>
                </div>

            )
        }
    ];

    // -----------------------------Asset AMC Near Expiry----------------------------------------

    const [AMC_CMC_INF, setAMC_CMC_INF] = useState([]);

    useEffect(() => {
        if (selectedCategory && subcategories.length > 0 && isEditing) {
            const editingAMC = assetAMCData.find(amc => amc.id === amcId);
            if (editingAMC) {
                const subCat = subcategories.find(sc => sc.name === editingAMC.asset_subcategory);
                if (subCat) {
                    setSelectedSubcategory(subCat.id.toString());
                }
            }
        }
    }, [selectedCategory, subcategories, isEditing]);

    useEffect(() => {
        if (selectedSubcategory && assets.length > 0 && isEditing) {
            const editingAMC = assetAMCData.find(amc => amc.id === amcId);
            if (editingAMC) {
                const asset = assets.find(a => a.name === editingAMC.asset);
                if (asset) {
                    setSelectedAsset(asset.id.toString());
                }
            }
        }
    }, [selectedSubcategory, assets, isEditing]);

    useEffect(() => {
        if (selectedSubcategory && serviceProviders.length > 0 && isEditing) {
            const editingAMC = assetAMCData.find(amc => amc.id === amcId);
            if (editingAMC) {
                const provider = serviceProviders.find(p => p.name === editingAMC.provider);
                if (provider) {
                    setFormData(prev => ({
                        ...prev,
                        provider: provider.id.toString()
                    }));
                }
            }
        }
    }, [selectedSubcategory, serviceProviders, isEditing]);


    useEffect(() => {
        axios.get(`${UrlLink}AccetCategory/AMC_CMC_GET`)
            .then(response => {
                const today = new Date();
                const upcomingAMCs = response.data.filter(amc => {
                    const endDate = new Date(amc.end_date);
                    const daysLeft = differenceInDays(endDate, today);
                    return daysLeft > 0 && daysLeft <= 30;
                });
                setAMC_CMC_INF(upcomingAMCs);
            })
            .catch(error => console.error(error));
    }, [UrlLink]);
    const handleAction = async (id, asset, action) => {

        if (action === "Don't Renew") {
            if (window.confirm(`Are you sure you want to hide the contract for ${asset}?`)) {
                setAMC_CMC_INF(prevData => prevData.filter(amc => amc.id !== id));
                console.log(`The contract for ${asset} has been Delete from the table.`);
            }
        }
        else if (action === "Renewal") {
            if (window.confirm(`Are you sure you want to renew the contract for ${asset}?`)) {

                try {
                    const response = await axios.get(`${UrlLink}AccetCategory/AMC_CMC_INS_get/${id}`);
                    console.log("AMC_CMC_INS_get", response.data)

                    if (response.data) {
                        console.log("Fetched data for renewal:", response.data);
                        const amc = response.data;

                        if (amc.category_id !== undefined && amc.category_id !== null) {
                            setSelectedCategory(amc.category_id.toString());
                            fetchSubcategories(amc.category_id);
                        } else {
                            setSelectedCategory('');
                        }

                        setTimeout(() => {
                            setSelectedSubcategory(amc.asset_subcategory_id ? amc.asset_subcategory_id.toString() : '');

                            if (amc.asset_subcategory_id) {
                                fetchAssets(amc.asset_subcategory_id);
                                fetchServiceProviders(amc.asset_subcategory_id);
                            }

                            setTimeout(() => {
                                setSelectedAsset(amc.asset_id ? amc.asset_id.toString() : '');

                                setFormData((prevData) => ({
                                    ...prevData,
                                    provider: amc.provider_id ? amc.provider_id.toString() : '',
                                    asset_type: amc.asset_type || '',
                                    start_date: amc.start_date || '',
                                    end_date: amc.end_date || '',
                                    cost: amc.cost ? amc.cost.toString() : '',
                                    warranty_type: amc.warranty_type || '',
                                    is_active: amc.is_active || false,
                                    parts: amc.parts || '',
                                    visit_frequency: amc.visit_frequency || '',
                                    terms: amc.terms || '',
                                }));
                            });
                        });

                        setRackMasterPage("AMC/CMC");
                    } else {
                        console.log("No data found for the given contract.");
                    }
                } catch (error) {
                    console.error("Error fetching data for renewal:", error);
                    console.log("Failed to fetch renewal data. Please try again.");
                }


            }
        }

    };


    // ---------------------------------------------------------------------------------------------------------
    return (
        <>
            <div className="Main_container_app">

                <br />
                <div className="RegisterTypecon">

                    <div className="RegisterType">

                        {["AMC/CMC", "AMC/CMC/Insurance NearExpiry"].map((p, ind) => (

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
                {/* -------------------------Asset AMC------------------------- */}
                {RackMasterPage === 'AMC/CMC' && <>
                    <br />
                    <div className="Main_container_app">
                        <h3>AMC / CMC</h3>
                        <div className="RegisFormcon_1" >
                            <div className="RegisForm_1">
                                <label>Asset Category <span>:</span></label>
                                <select value={selectedCategory} onChange={handleCategoryChange} required>
                                    <option value="">Select Asset Category</option>
                                    {assetCategories.map((category) => (
                                        <option key={category.id} value={category.id}>{category.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="RegisForm_1">
                                <label>Asset Subcategory <span>:</span></label>
                                <select value={selectedSubcategory} onChange={handleSubcategoryChange} disabled={!selectedCategory} required>
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
                                <label>Asset Type <span>:</span></label>
                                <select
                                    value={formData.asset_type}
                                    onChange={handleInputChange}
                                    name="asset_type"
                                    required
                                >
                                    <option value="">Select Asset Type</option>
                                    <option value="AMC">AMC</option>
                                    <option value="CMC">CMC</option>
                                </select>
                            </div>


                            <div className="RegisForm_1">
                                <label>Service Provider <span>:</span></label>
                                <select
                                    value={formData.provider}
                                    onChange={handleInputChange}
                                    name="provider"
                                    disabled={!selectedSubcategory}
                                    required
                                >
                                    <option value="">Select Provider</option>
                                    {serviceProviders.map((provider) => (
                                        <option key={provider.id} value={provider.id}>
                                            {provider.name}
                                        </option>
                                    ))}
                                </select>
                            </div>


                            <div className="RegisForm_1">
                                <label>Visit Frequency <span>:</span></label>
                                <input
                                    type="text"
                                    name="visit_frequency"
                                    value={formData.visit_frequency}
                                    onChange={handleInputChange}
                                    placeholder="Visit Frequency (e.g., yearly)"
                                    required
                                />
                            </div>



                            {/* Start Date */}
                            <div className="RegisForm_1">
                                <label>Start Date <span>:</span></label>
                                <input type="date" name="start_date" value={formData.start_date} onChange={handleInputChange} required />
                            </div>

                            {/* End Date */}
                            <div className="RegisForm_1">
                                <label>End Date <span>:</span></label>
                                <input type="date" name="end_date" value={formData.end_date} onChange={handleInputChange} required />
                            </div>

                            {/* Cost */}
                            <div className="RegisForm_1">
                                <label>Cost <span>:</span></label>
                                <input type="number" name="cost" value={formData.cost} onChange={handleInputChange} placeholder="Cost" required />
                            </div>

                            {/* Terms */}
                            <div className="RegisForm_1">
                                <label>Terms and Conditions <span>:</span></label>
                                <textarea name="terms" value={formData.terms} onChange={handleInputChange} placeholder="Terms and Conditions" required />
                            </div>


                            <div className="RegisForm_1">
                                <label>Warranty Type <span>:</span></label>
                                <select name="warranty_type" value={formData.warranty_type} onChange={handleInputChange} required>
                                    <option value="partial">Parts Only</option>
                                    <option value="full">Full Replacement</option>
                                </select>
                            </div>

                            {formData.warranty_type === "partial" && (
                                <div className="RegisForm_1">
                                    <label>Parts <span>:</span></label>
                                    <input
                                        type="text"
                                        name="parts"
                                        value={formData.parts}
                                        onChange={handleInputChange}
                                        placeholder="Parts"
                                        required
                                    />
                                </div>
                            )}

                            {/* Active Status */}
                            <div className="RegisForm_1">
                                <label>Active <span>:</span></label>
                                <input type="checkbox"
                                    name="is_active"
                                    checked={formData.is_active}
                                    onChange={(e) => setFormData((prevData) => ({ ...prevData, is_active: e.target.checked }))} />
                            </div>
                        </div>

                        <div className="Main_container_Btn">
                            <button onClick={handleSubmit} style={{ width: "95px" }}>Add</button>
                        </div>
                        <ReactGrid columns={assetAMCColumn} RowData={Array.isArray(assetAMCData) ? assetAMCData : []} />

                    </div>

                </>}
                {/* -------------------------AMC_CMC_Insurance_NearExpiry----------------------- */}
                {RackMasterPage === 'AMC/CMC/Insurance NearExpiry' && <>
                    <br />
                    <div className="Main_container_app">
                        <h3>AMCs / CMCs / Insurance Near Expiry</h3>
                        <div className="RegisFormcon_1">
                            <div className="AMC_CMC_INS">
                                <ul>
                                    {AMC_CMC_INF.map(amc => (
                                        <li key={amc.id} >
                                            Validity Period for <strong>{amc.asset}</strong> - Ends on{" "}
                                            {format(new Date(amc.end_date), "yyyy-MM-dd")} (
                                            in {differenceInDays(new Date(amc.end_date), new Date())} days)
                                            <div className="action-buttons">
                                                <button onClick={() => handleAction(amc.id, amc.asset, "Renewal")}>
                                                    Renewal
                                                </button>
                                                <button onClick={() => handleAction(amc.id, amc.asset, "Don't Renew")}>
                                                    Don't Renew
                                                </button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>

                </>}
            </div>
        </>
    )
}
export default AssetAMC;