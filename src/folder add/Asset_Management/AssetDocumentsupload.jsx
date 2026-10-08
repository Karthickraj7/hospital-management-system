import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios';
import ModelContainer from '../../OtherComponent/ModelContainer/ModelContainer';




const AssetDocumentsupload = () => {

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const [viewerOpen, setViewerOpen] = useState(false);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [loading, setLoading] = useState(false);
    const userRecord = useSelector(state => state.userRecord?.UserData);


    const [categories, setCategories] = useState([]);
    const [subcategories, setSubcategories] = useState([]);
    const [assets, setAssets] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [selectedAsset, setSelectedAsset] = useState('');
    const [documentType, setDocumentType] = useState('');
    const [documents, setDocuments] = useState([]);
    const [file, setFile] = useState(null);
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showDocuments, setShowDocuments] = useState(false);
    const dispatch = useDispatch();




    // --------------------------------------------------------------------------
    const Selectedfileview = (fileval) => {
        if (fileval) {
            let tdata = {
                Isopen: false,
                content: null,
                type: "image/jpg",
            };
            if (
                ["data:image/jpeg;base64", "data:image/jpg;base64"].includes(
                    fileval?.split(",")[0]
                )
            ) {
                tdata = {
                    Isopen: true,
                    content: fileval,
                    type: "image/jpeg",
                };
            } else if (fileval?.split(",")[0] === "data:image/png;base64") {
                tdata = {
                    Isopen: true,
                    content: fileval,
                    type: "image/png",
                };
            } else if (fileval?.split(",")[0] === "data:application/pdf;base64") {
                tdata = {
                    Isopen: true,
                    content: fileval,
                    type: "application/pdf",
                };
            }

            dispatch({ type: "modelcon", value: tdata });
        } else {
            const tdata = {
                message: "There is no file to view.",
                type: "warn",
            };
            dispatch({ type: "toast", value: tdata });
        }
    };



    // ----------------------------------------------------------------------


    useEffect(() => {
        fetchCategories();
    }, []);

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
                setMessage('Unexpected response format');
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
            setCategories([]);
            setMessage('Failed to fetch categories.');
        }
    };

    const handleCategoryChange = async (categoryId) => {
        setSelectedCategory(categoryId);
        setSelectedSubcategory('');
        setSelectedAsset('');
        setAssets([]);
        setShowDocuments(false);
        setDocuments([]);

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
            setMessage('Failed to fetch subcategories.');
            setSubcategories([]);
        }
    };


    const handleSubcategoryChange = async (subcategoryId) => {
        setSelectedSubcategory(subcategoryId);
        setSelectedAsset('');
        setShowDocuments(false);
        setDocuments([]);

        if (!subcategoryId) {
            setAssets([]);
            return;
        }

        try {
            const response = await axios.get(`${UrlLink}AccetCategory/Asset_Reg_Get/?subcategory_id=${subcategoryId}`);

            console.log("Full API Response:", response.data);

            if (Array.isArray(response.data)) {
                const filteredAssets = response.data.filter(asset =>
                    asset.asset_subcategory === parseInt(subcategoryId) // Change key if necessary
                );

                console.log("Filtered Assets:", filteredAssets);
                setAssets(filteredAssets);
            } else {
                console.error("Unexpected API response format:", response.data);
                setMessage("Invalid response from server.");
                setAssets([]);
            }

        } catch (error) {
            console.error('Error fetching assets:', error);
            setMessage('Failed to fetch assets.');
            setAssets([]);
        }
    };



    const handleSelectedAsset = (assetId) => {
        setSelectedAsset(assetId);
        setShowDocuments(false);
        setDocuments([]);
    };



    const handleFileChange = (e) => {
        const { files } = e.target;

        if (files && files.length > 0) {
            const selectedFile = files[0];
            const allowedTypes = ["application/pdf", "image/jpeg", "image/png"];
            const maxSize = 5 * 1024 * 1024; // 5MB limit

            if (!allowedTypes.includes(selectedFile.type)) {
                dispatch({
                    type: "toast",
                    value: { message: "Invalid file type. Please upload a PDF, JPEG, or PNG file.", type: "warn" }
                });
            } else if (selectedFile.size > maxSize) {
                dispatch({
                    type: "toast",
                    value: { message: "File size exceeds the limit of 5MB.", type: "warn" }
                });
            } else {
                const reader = new FileReader();
                reader.onload = () => {
                    setFile({ binary: reader.result, name: selectedFile.name, type: selectedFile.type });
                };
                reader.readAsDataURL(selectedFile);
            }
        } else {
            dispatch({
                type: "toast",
                value: { message: "No file selected. Please choose a file to upload.", type: "warn" }
            });
        }
    };



    const fetchDocuments = async () => {
        if (!selectedAsset && !selectedCategory && !selectedSubcategory && !documentType) {
            setMessage('Please select at least one filter criteria.');
            return;
        }

        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            if (selectedAsset) params.append('asset', selectedAsset);
            if (selectedCategory) params.append('category', selectedCategory);
            if (selectedSubcategory) params.append('subcategory', selectedSubcategory);
            if (documentType) params.append('document_type', documentType);

            const response = await axios.get(`${UrlLink}AccetCategory/assetdocumentsuploadget?${params.toString()}`);

            if (Array.isArray(response.data)) {
                setDocuments(response.data);
                console.log('docc', response.data);

                setShowDocuments(true);
                if (response.data.length === 0) {
                    setMessage('No documents found for the selected filters.');
                }
            } else {
                setMessage('Invalid response format from server.');
            }
        } catch (error) {
            console.error('Error fetching documents:', error);
            setMessage(error.response?.data?.error || 'Failed to fetch documents.');
        } finally {
            setIsLoading(false);
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        if (!selectedAsset || !documentType || !file || !selectedCategory || !selectedSubcategory) {
            setMessage('Please fill all required fields.');
            setIsLoading(false);
            return;
        }

        try {
            const response = await axios.post(
                `${UrlLink}AccetCategory/assetdocumentsuploadpost`,
                {
                    file_data: file.binary,
                    file_name: file.name,
                    file_type: file.type,
                    asset: selectedAsset,
                    document_type: documentType,
                    description: description || '',
                    category: selectedCategory,
                    subcategory: selectedSubcategory
                },
                { headers: { 'Content-Type': 'application/json' } }
            );

            if (response.data.message) {
                console.log('Document uploaded successfully!');
                setMessage('Document uploaded successfully!');
                setFile(null);
                setDescription('');
                setDocumentType('');
                const fileInput = document.querySelector('input[type="file"]');
                if (fileInput) fileInput.value = '';
                await fetchDocuments();
            }
        } catch (error) {
            console.error('Error uploading document:', error);
            setMessage(error.response?.data?.error || 'Failed to upload document.');
        } finally {
            setIsLoading(false);
        }
    };


    // ------------------------------------------------------------------------------------
    return (
        <>
            <div className="Main_container_app">
                <h3>Asset Documents</h3>
                <br />
                <div className="RegisFormcon_1">
                    <div className="RegisForm_1">
                        <label>Select Category:</label>
                        <select
                            value={selectedCategory}
                            onChange={(e) => handleCategoryChange(e.target.value)}
                            required
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
                        <label>Select Subcategory:</label>
                        <select
                            value={selectedSubcategory}
                            onChange={(e) => handleSubcategoryChange(e.target.value)}
                            disabled={!selectedCategory}
                            required
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
                        <label>Select Asset:</label>
                        <select
                            value={selectedAsset}
                            onChange={(e) => handleSelectedAsset(e.target.value)}
                            disabled={!selectedSubcategory}
                            required
                        >
                            <option value="">Select an Asset</option>
                            {assets.map((asset) => (
                                <option key={asset.id} value={asset.id}>
                                    {asset.name}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Document Upload Section */}
                <div className="RegisFormcon_1">
                    <div className="RegisForm_1">
                        <label>Document Type:</label>
                        <select
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                            required
                        >
                            <option value="">Select Document Type</option>
                            <option value="INVOICE">Invoice</option>
                            <option value="WARRANTY">Warranty Card</option>
                            <option value="MANUAL">User Manual</option>
                            <option value="CERTIFICATE">Certificate</option>
                            <option value="CONTRACT">Contract</option>
                            <option value="REPORT">Inspection Report</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>File:</label>
                        <input
                            type="file"
                            accept="image/jpeg, image/png, application/pdf"
                            onChange={handleFileChange}
                            required
                        />
                    </div>

                    <div className="RegisForm_1">
                        <label>Description:</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        ></textarea>
                    </div>

                </div>

                <form onSubmit={handleSubmit}>
                    <div className="Main_container_Btn">
                        <button type="submit" disabled={isLoading} style={{ width: '70px' }}>
                            {isLoading ? 'Uploading...' : 'Upload'}
                        </button>
                        <button
                            type="button"
                            onClick={fetchDocuments}
                            disabled={isLoading || (!selectedAsset && !selectedCategory && !selectedSubcategory && !documentType)}
                            style={{ width: '70px' }}
                        >
                            {isLoading ? 'Fetching...' : 'Fetch'}
                        </button>
                    </div>
                </form>

                <br />
                {message && <div className="alert alert-info">{message}</div>}

                {showDocuments && documents.length > 0 && (
                    <div className="documents-container" style={{
                        display: 'flex', flexWrap: 'wrap', gap: '20px', border: '1px solid', padding: '20px', borderRadius: '10px'
                    }}>
                        {documents.map((doc, index) => (
                            <div key={index} className="document-card" style={{
                                display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '15px', border: '1px solid #ddd', borderRadius: '8px', minWidth: '200px'
                            }}>
                                <h3 style={{ marginBottom: '10px' }}>{doc.asset_name}</h3>
                                <p>Asset Code: {doc.asset_code}</p>
                                <p>Type: {doc.document_type}</p>
                                <div className="Main_container_Btn">
                                    <button
                                        onClick={() => Selectedfileview(doc.file)}
                                        disabled={loading}
                                        style={{ marginTop: '10px' }}
                                    >
                                        {loading ? 'Loading...' : 'View'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                )}
                <ModelContainer />

            </div>

        </>

    )
}
export default AssetDocumentsupload;