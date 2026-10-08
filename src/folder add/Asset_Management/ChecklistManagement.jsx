import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import { Button } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";

const ChecklistManagement = () => {
    const [subcategories, setSubcategories] = useState([]);
    const [selectedSubcategory, setSelectedSubcategory] = useState('');
    const [checklistData, setChecklistData] = useState([]);
    const [editingChecklistId, setEditingChecklistId] = useState(null);
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector(state => state.userRecord?.UserData);


    useEffect(() => {
        fetchSubcategories();
    }, []);

    const fetchSubcategories = async () => {
        try {
            const response = await axios.get(`${UrlLink}AccetCategory/get_asset_subcategories/`);
            setSubcategories(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error('Error fetching subcategories:', error.message);
            setSubcategories([]);
        }
    };

    const handleSearch = async () => {
        if (!selectedSubcategory) {
            setChecklistData([]);
            return;
        }

        try {
            const response = await axios.get(`${UrlLink}AccetCategory/ChecklistMasterEntry_get/`, {
                params: { subcategory: selectedSubcategory }
            });

            console.log("API Response:", response.data);

            // Handle the data array from the response
            const items = response.data.data || [];

            // Filter items based on subcategories array containing the selected subcategory
            const filteredItems = items.filter(item =>
                item.subcategories &&
                item.subcategories.some(sub => sub.toString() === selectedSubcategory.toString())
            );

            const selectedSubcategoryObj = subcategories.find(
                sub => sub.id.toString() === selectedSubcategory.toString()
            );

            const formattedData = filteredItems.map(item => ({
                id: item.id,
                itemname: item.item_name,
                subcategoryName: selectedSubcategoryObj?.name || '',
                status: item.status,
                asset_category: item.asset_category
            }));

            console.log("Formatted Data:", formattedData);
            setChecklistData(formattedData);

        } catch (error) {
            console.error('Error fetching checklist items:', error.message);
            setChecklistData([]);
        }
    };

    const handleEditChecklistItem = (item) => {
        setEditingChecklistId(item.id);
    };

    const toggleStatus = async (item) => {
        try {
            const updatedItem = { ...item, status: item.status === 'active' ? 'inactive' : 'active' };
            await axios.put(`${UrlLink}AccetCategory/ChecklistManagement_Put/${item.id}/`, updatedItem);

            setChecklistData(prevData =>
                prevData.map(dataItem =>
                    dataItem.id === item.id ? updatedItem : dataItem
                )
            );
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const checklistColumns = [
        {
            key: 'id',
            name: 'Item ID',
            frozen: true
        },
        {
            key: 'itemname',
            name: 'Item Name',
            frozen: true
        },
        {
            key: 'subcategoryName',
            name: 'Subcategory Name',
            frozen: true
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
        // {
        //     key: 'Action',
        //     name: 'Action',
        //     renderCell: (params) => (
        //         <Button className="cell_btn" onClick={() => handleEditChecklistItem(params.row)}>
        //             <EditIcon className="check_box_clrr_cancell" />
        //         </Button>
        //     )
        // }
    ];

    return (
        <div className="Main_container_app">
            <h3>Checklist Management</h3>

            <div className="RegisFormcon_1" style={{ justifyContent: 'center' }}>
                <div className="RegisForm_1">
                    <label>
                        Select Subcategory <span>:</span>
                    </label>
                    <select
                        onChange={(e) => {
                            setSelectedSubcategory(e.target.value);
                            setChecklistData([]); // Clear data when changing subcategory
                        }}
                        value={selectedSubcategory}
                    >
                        <option value="">Select Subcategory</option>
                        {Array.isArray(subcategories) &&
                            subcategories.map(subcategory => (
                                <option key={subcategory.id} value={subcategory.id}>
                                    {subcategory.name}
                                </option>
                            ))
                        }
                    </select>
                </div>
            </div>

            <div className="Main_container_Btn">
                <button onClick={handleSearch} style={{ width: "95px" }}>
                    Search
                </button>
            </div>

            <ReactGrid columns={checklistColumns} RowData={checklistData} />
        </div>
    );
};

export default ChecklistManagement;