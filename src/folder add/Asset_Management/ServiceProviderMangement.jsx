import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { FaStar } from 'react-icons/fa';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import { Button } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import { useSelector } from 'react-redux';
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

import DeleteIcon from '@mui/icons-material/Delete';


const ServiceProviderMangement = () => {


    const [formData, setFormData] = useState({
        name: '',
        contact_info: '',
        email: '',
        asset_categories: '',
        subcategories: [],
        status: 'active',
        cost_effective: true,
        service_quality: 'fair',
        hourly_rate: '',
        average_response_time: '1 day',
        years_of_experience: '',
        ranking: '',
        rating: 0,
    });
    const [serviceProviders, setServiceProviders] = useState([]);
    const [assetCategories, setAssetCategories] = useState([]);
    const [allSubcategories, setAllSubcategories] = useState([]);
    const [displayedSubcategories, setDisplayedSubcategories] = useState([]);
    const [editingServiceProvider, setEditingServiceProvider] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortCriteria, setSortCriteria] = useState('rating', 'hourly_rate', 'response_time');
    const userRecord = useSelector(state => state.userRecord?.UserData);


    const [ServiceProviderColumnData, setServiceProviderColumnData] = useState([]);
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    const Handlesearch = () => {
        if (!searchTerm.trim()) {
            fetchServiceProviders();
            return;
        }

        const filtered = ServiceProviderColumnData.filter(provider =>
            provider.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            provider.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        setServiceProviderColumnData(filtered);
    };

    useEffect(() => {
        fetchServiceProviders();
        fetchAssetCategories();
        fetchAllSubcategories();
    }, []);

    // useEffect(() => {
    //     const fetchServiceProviders = async () => {
    //         try {
    //             const response = await axios.get(`${UrlLink}/AccetCategory/ServiceProviderManagement_GET/`);
    //             console.log('Service Providers Response:', response.data);

    //             const mappedData = response.data.map(sp => ({
    //                 ...sp,
    //                 asset_category_display: sp.asset_category_name || 'No Category'
    //             }));

    //             setServiceProviders(mappedData);
    //         } catch (error) {
    //             console.error('Error fetching service providers:', error);
    //         }
    //     };

    //     fetchServiceProviders();
    // }, [UrlLink]);


    useEffect(() => {
        if (editingServiceProvider) {
            fetchSubcategories(editingServiceProvider.asset_categories);

            setFormData(prev => ({
                ...prev,
                name: editingServiceProvider.name,
                contact_info: editingServiceProvider.contact_info,
                email: editingServiceProvider.email,
                asset_categories: editingServiceProvider.asset_categories,
                subcategories: Array.isArray(editingServiceProvider.subcategories)
                    ? editingServiceProvider.subcategories.map(subcat =>
                        typeof subcat === 'object' ? subcat.id : subcat
                    )
                    : [],
                status: editingServiceProvider.status,
                cost_effective: editingServiceProvider.cost_effective,
                service_quality: editingServiceProvider.service_quality,
                hourly_rate: editingServiceProvider.hourly_rate,
                average_response_time: editingServiceProvider.average_response_time,
                years_of_experience: editingServiceProvider.years_of_experience,
                ranking: editingServiceProvider.ranking.toString(),
                rating: editingServiceProvider.rating,
            }));
        }
    }, [editingServiceProvider]);


    useEffect(() => {
        const mappedData = serviceProviders.map(sp => ({
            id: sp.id,
            name: sp.name,
            contact_info: sp.contact_info,
            email: sp.email,
            asset_categories: sp.asset_categories,
            subcategories: sp.subcategories,
            cost_effective: sp.cost_effective ? "Yes" : "No",
            service_quality: sp.service_quality,
            hourly_rate: sp.hourly_rate,
            avg_response_time: sp.average_response_time,
            years_of_experience: sp.years_of_experience,
            ranking: sp.ranking,
            rating: sp.rating,
            status: sp.status,
        }));

        console.log("Mapped Data:", mappedData);
        setServiceProviderColumnData(mappedData);
    }, [serviceProviders]);

    const fetchServiceProviders = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/ServiceProviderManagement_GET/`);
            console.log('Service Providers Raw Response:', response.data);
            if (response.data.length > 0) {
                console.log('Example asset_categories structure:', response.data[0].asset_categories);
            }
            setServiceProviders(response.data);
        } catch (error) {
            console.error('Error fetching service providers:', error);
        }
    };


    // const fetchServiceProviders = async () => {
    //     try {
    //         const response = await axios.get(`${UrlLink}/AccetCategory/ServiceProviderManagement_GET/`);
    //         setServiceProviders(response.data);
    //     } catch (error) {
    //         console.error('Error fetching service providers:', error);
    //     }
    // };

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
            }
        } catch (error) {
            console.error('Error fetching asset categories:', error);
            setAssetCategories([]);
        }
    };
    const fetchAllSubcategories = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/get_asset_subcategories/`);
            setAllSubcategories(response.data);
        } catch (error) {
            console.error('Error fetching all subcategories:', error);
        }
    };

    const fetchSubcategories = (categoryId) => {
        const filteredSubcategories = allSubcategories.filter(subcat => subcat.category === parseInt(categoryId));
        setDisplayedSubcategories(filteredSubcategories);

    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => {
            const updatedData = {
                ...prev,
                [name]: type === 'checkbox' ? checked : value
            };

            if (name === 'asset_categories' && value) {
                console.log('Asset category changed to:', value);
                fetchSubcategories(value);
            }

            return updatedData;
        });
    };

    const handleSubcategoryChange = (selectedOptions) => {
        setFormData({
            ...formData,
            subcategories: selectedOptions ? selectedOptions.map(option => option.value) : []
        });

    };
    const handleRatingChange = (rating) => {
        setFormData(prev => ({ ...prev, rating }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dataToSend = {
                ...formData,
                asset_categories: parseInt(formData.asset_categories),  // Ensure it's a number
                hourly_rate: parseFloat(formData.hourly_rate) || 0.0,
                years_of_experience: parseInt(formData.years_of_experience) || 0,
                ranking: parseInt(formData.ranking) || 0,
                rating: parseFloat(formData.rating) || 0.0,
                subcategories: Array.isArray(formData.subcategories) ? formData.subcategories : [],
                cost_effective: Boolean(formData.cost_effective),
                status: formData.status || 'active',
                service_quality: formData.service_quality || 'fair',
                average_response_time: formData.average_response_time || '1 day'
            };

            let response;
            if (editingServiceProvider && editingServiceProvider.id) {
                response = await axios.put(
                    `${UrlLink}AccetCategory/ServiceProviderManagement_PUT/${editingServiceProvider.id}/`,
                    dataToSend
                );
            } else {
                response = await axios.post(
                    `${UrlLink}AccetCategory/ServiceProviderManagement_POST/`,
                    dataToSend
                );
            }

            if (response.status >= 200 && response.status < 300) {
                fetchServiceProviders();
                resetForm();
                console.log('Service provider saved successfully!');
            }

        } catch (error) {
            console.error('Error:', error);
            console.log(error.response?.data?.error || 'An error occurred while saving');
        }
    };

    const handleEdit = (serviceProvider) => {
        console.log('Editing service provider:', serviceProvider);
        setEditingServiceProvider(serviceProvider);

        const categoryIds = Array.isArray(serviceProvider.asset_categories)
            ? serviceProvider.asset_categories.map(cat => (typeof cat === 'object' ? cat.id : cat))
            : [];

        const subcategoryIds = Array.isArray(serviceProvider.subcategories)
            ? serviceProvider.subcategories.map(subcat => subcat.id)
            : [];

        setFormData({
            name: serviceProvider.name,
            contact_info: serviceProvider.contact_info,
            email: serviceProvider.email,
            asset_categories: categoryIds,
            subcategories: subcategoryIds,
            status: serviceProvider.status,
            cost_effective: serviceProvider.cost_effective,
            service_quality: serviceProvider.service_quality,
            hourly_rate: serviceProvider.hourly_rate,
            average_response_time: serviceProvider.average_response_time,
            years_of_experience: serviceProvider.years_of_experience,
            ranking: serviceProvider.ranking.toString(),
            rating: serviceProvider.rating,
        });

        // Fetch subcategories if there's a category
        if (categoryIds.length > 0) {
            categoryIds.forEach(catId => {
                fetchSubcategories(catId);
            });
        }
    };
    const handelDeleteite_ServiceProvider = async (id) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this Provider?");

        if (!isConfirmed) return;

        try {
            const response = await fetch(`${UrlLink}AccetCategory/delete_Provider/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            if (response.ok) {
                console.log(data.message);
                fetchServiceProviders();
            } else {
                console.log(data.error || 'Failed to delete the Provider');
            }
        } catch (error) {
            console.error('Error deleting Provider:', error);
            console.log('An error occurred while deleting the Provider.');
        }
    };
    // const handleDelete = async (id) => {
    //     if (window.confirm('Are you sure you want to delete this service provider?')) {
    //         try {
    //             await axios.delete(`http://localhost:8000/api/service-providers/${id}/`);
    //             fetchServiceProviders();
    //         } catch (error) {
    //             console.error('Error deleting service provider:', error);
    //         }
    //     }
    // };

    const resetForm = () => {
        setFormData({
            name: '',
            contact_info: '',
            email: '',
            asset_categories: '',
            subcategories: [],
            status: 'active',
            cost_effective: true,
            service_quality: 'fair',
            hourly_rate: '',
            average_response_time: '1 day',
            years_of_experience: '',
            ranking: '',
            rating: '',
        });
        setEditingServiceProvider(null);
        setDisplayedSubcategories([]);
    };

    // ... (keep handleSubmit, handleEdit, handleDelete, and resetForm as they were)

    const filteredAndSortedServiceProviders = serviceProviders
        .filter(sp =>
            sp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            sp.email.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortCriteria === 'ranking') return b.ranking - a.ranking;
            if (sortCriteria === 'hourly_rate') return a.hourly_rate - b.hourly_rate;
            if (sortCriteria === 'rating') return b.rating - a.rating;
            return 0;
        });

    const StarRating = ({ rating, onRatingChange }) => {
        return (
            <div style={{ display: "flex", width: "130px" }}>
                {[...Array(5)].map((star, i) => {
                    const ratingValue = i + 1;
                    return (
                        <label key={i}>
                            <input
                                type="radio"
                                name="rating"
                                value={ratingValue}
                                onClick={() => onRatingChange(ratingValue)}
                                style={{ display: 'none' }}
                            />
                            <FaStar
                                color={ratingValue <= rating ? "#ffc107" : "#e4e5e9"}
                                size={20}
                                style={{ cursor: 'pointer' }}
                            />
                        </label>
                    );
                })}
            </div>
        );
    };

    const toggleStatus = async (row) => {
        const updatedStatus = row.status === 'active' ? 'inactive' : 'active';
        try {
            await axios.put(`${UrlLink}AccetCategory/ServiceProviderManagement_PUT/${row.id}/`, {
                ...row,
                status: updatedStatus
            });
            fetchServiceProviders();
        } catch (error) {
            console.error('Error toggling status:', error);
        }
    };

    const ServiceProviderColumn = [
        {
            key: 'id',
            name: 'id',
            frozen: true
        },
        {
            key: 'name',
            name: 'Service Provider Name',
            frozen: true
        },
        {
            key: 'contact_info',
            name: 'Contact Info'
        },
        {
            key: 'email',
            name: 'Email'
        },
        {
            key: 'asset_categories',
            name: 'Asset Categories',
            renderCell: (params) => {
                const categories = params.row.asset_categories;
                if (!categories || !Array.isArray(categories)) return 'N/A';
                const categoryNames = categories.map(cat => cat.name).filter(name => name);
                return categoryNames.length > 0 ? categoryNames.join(', ') : 'N/A';
            }
        },
        {
            key: 'subcategories',
            name: 'Subcategories',
            renderCell: (params) => {
                const subcategories = params.row.subcategories;
                if (!subcategories || !Array.isArray(subcategories) || subcategories.length === 0) {
                    return 'No subcategories';
                }
                return subcategories.map(subcat => subcat.name).join(', ');
            }
        }
        ,

        {
            key: 'cost_effective',
            name: 'Cost Effective'
        },
        {
            key: 'service_quality',
            name: 'Service Quality'
        },
        {
            key: 'hourly_rate',
            name: 'Hourly Rate (INR)'
        },
        {
            key: 'avg_response_time',
            name: 'Avg Response Time'
        },
        {
            key: 'years_of_experience',
            name: 'Years of Experience'
        },
        {
            key: 'ranking',
            name: 'Ranking'
        },
        {
            key: 'rating',
            name: 'Rating'
        },
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
            key: 'actions',
            name: 'Actions',
            renderCell: (params) => (
                <div>
                    <Button className="cell_btn" onClick={() => handleEdit(params.row)}>
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                    <Button className="cell_btn" onClick={() => handelDeleteite_ServiceProvider(params.row.id)}>
                        <DeleteIcon className="check_box_clrr_cancell" />
                    </Button>
                </div>

            )
        }
    ];
    console.log('formData.subcategories:', formData.subcategories);
    // console.log('params.row.subcategories:', params.row.subcategories);
    console.log('displayedSubcategories:', displayedSubcategories);
    console.log('allSubcategories:', allSubcategories);
    console.log('formData.subcategories inside Select:', formData.subcategories);




    return (
        <div className="Main_container_app">
            <h3> Service Provider Management</h3>
            <div style={{}}>
                <h2>Service Providers List</h2>
                <div className="search_div_bar">
                    <div className="search_div_bar_inp_1">
                        <label>
                            Search by <span>:</span>
                        </label>
                        <input
                            type="text"
                            value={searchTerm}
                            placeholder="Search by name or email"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <span>
                        <PersonSearchIcon onClick={Handlesearch} />
                    </span>

                    {/* <div className="search_div_bar_inp_2">
                        <label>
                            Sort by <span>:</span>
                        </label>
                        <select
                            value={sortCriteria}
                            onChange={(e) => setSortCriteria(e.target.value)}
                        >
                            <option value="ranking">Ranking</option>
                            <option value="hourly_rate">Hourly Rate</option>
                            <option value="rating">Rating</option>
                        </select>
                    </div> */}
                </div>
            </div>
            <br />
            <div className="RegisFormcon_1">
                <div className="RegisForm_1">
                    <label>
                        Service Provider Name <span>:</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Service Provider Name"
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label>
                        Contact Info <span>:</span>
                    </label>
                    <input
                        type="text"
                        name="contact_info"
                        value={formData.contact_info}
                        onChange={handleInputChange}
                        placeholder="Contact Info"
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label>
                        Email <span>:</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Email"
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label>
                        Asset Category <span>:</span>
                    </label>
                    <select
                        name="asset_categories"
                        value={formData.asset_categories}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="">Select Asset Category</option>
                        {assetCategories.map(category => (
                            <option key={category.id} value={category.id}>{category.name}</option>
                        ))}
                    </select>
                </div>

                {formData.asset_categories && (
                    <div className="RegisForm_1">
                        <label>
                            Subcategories <span>:</span>
                        </label>
                        <Select
                            isMulti
                            name="subcategories"
                            options={displayedSubcategories.map(subcat => ({
                                value: subcat.id,
                                label: subcat.name
                            }))}
                            value={formData.subcategories.map(id => ({
                                value: id,
                                label: allSubcategories.find(s => s.id === id)?.name || 'Unknown'
                            }))}
                            onChange={handleSubcategoryChange}
                        />

                    </div>
                )}


                <div className="RegisForm_1">
                    <label>
                        Status <span>:</span>
                    </label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                    >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </select>
                </div>
                <div className="RegisForm_1">
                    <label>
                        Cost Effective <span>:</span>
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="cost_effective"
                            checked={formData.cost_effective}
                            onChange={handleInputChange}
                        />
                        Yes
                    </label>
                </div>
                <div className="RegisForm_1">
                    <label>
                        Service Quality <span>:</span>
                    </label>
                    <select
                        name="service_quality"
                        value={formData.service_quality}
                        onChange={handleInputChange}
                    >
                        <option value="excellent">Excellent</option>
                        <option value="good">Good</option>
                        <option value="fair">Fair</option>
                        <option value="bad">Bad</option>
                    </select>
                </div>
                <div className="RegisForm_1">
                    <label>
                        Hourly Rate (INR) <span>:</span>
                    </label>
                    <input
                        type="number"
                        name="hourly_rate"
                        value={formData.hourly_rate}
                        onChange={handleInputChange}
                        placeholder="Hourly Rate"
                        required
                    />
                </div>

                <div className="RegisForm_1">
                    <label>
                        Average Response Time <span>:</span>
                    </label>
                    <select
                        name="average_response_time"
                        value={formData.average_response_time}
                        onChange={handleInputChange}
                    >
                        <option value="1 day">1 day</option>
                        <option value="2 days">2 days</option>
                        <option value="3 days">3 days</option>
                        <option value="4 days">4 days</option>
                        <option value="5 days">5 days</option>
                        <option value="more than 5 days">More than 5 days</option>
                    </select>
                </div>

                <div className="RegisForm_1">
                    <label>
                        Years of Experience <span>:</span>
                    </label>
                    <input
                        type="number"
                        name="years_of_experience"
                        value={formData.years_of_experience}
                        onChange={handleInputChange}
                        placeholder="Years of Experience"
                        required
                    />
                </div>
                <div className="RegisForm_1">
                    <label>
                        Ranking <span>:</span>
                    </label>
                    <input
                        type="number"
                        name="ranking"
                        value={formData.ranking}
                        onChange={handleInputChange}
                        placeholder="Ranking"
                        required
                    />
                </div>
                <div className="RegisForm_1" >
                    <label>
                        Rating <span>:</span>
                    </label>
                    <div style={{}}>
                        <StarRating rating={formData.rating} onRatingChange={handleRatingChange} />
                    </div>
                </div>


            </div>
            <div className="Main_container_Btn">
                <button onClick={handleSubmit} style={{ width: "95px" }}>
                    {editingServiceProvider ? "Update" : "Add"}
                </button>
            </div>

            <ReactGrid columns={ServiceProviderColumn} RowData={ServiceProviderColumnData} />

        </div>
    );
}
export default ServiceProviderMangement;