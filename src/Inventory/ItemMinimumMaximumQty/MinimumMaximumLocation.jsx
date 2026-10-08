
import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { margin } from '@mui/system';

const MinimumMaximumLocation = () => {
    
    const dispatchvalue = useDispatch();
    const dispatch = useDispatch();

    const MinimumMaximumData = useSelector(state => state.Inventorydata?.MinimumMaximumData);
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);

    const [ItemDataList,setItemDataList]=useState(null)

    const [disableState,setdisableState]=useState(null)

    console.log('MinimumMaximumData',MinimumMaximumData);
  
    const style = {
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
        // color: "#666",
        color: "black",
        padding: "4px",
        borderRadius: "4px",
        fontSize: "13px",
        textAlign: "center",
        width: "100px",
      };

      const div_style = {
        backgroundColor: "#f0f0f0",
        border: "1px solid #ccc",
        // color: "#666",
        color: "black",
        padding: "4px",
        borderRadius: "4px",
        fontSize: "13px",
        textAlign: "center",
        width: "100px",
        margin:'auto',
    };

    useEffect(()=>{
        if(MinimumMaximumData && Object.values(MinimumMaximumData).length !==0){

            axios.get(`${UrlLink}Inventory/Single_Item_All_Location_Minimum_Maximum_Qty?ItemCode=${MinimumMaximumData.ItemCode}`)
            .then((res)=>{
                console.log('kkkkkkkk',res.data,typeof(res.data));
                let getdata = res.data
                if(getdata && Object.values(getdata).length !==0){
                    setItemDataList(getdata)
                }    
                else{
                    setItemDataList(null)
                }          
            })
            .catch((err)=>{
                console.log(err);               
            })

        }

    },[MinimumMaximumData,UrlLink])


    const handelSaveChangeQty =(row,column)=>{

        if (row && column){
        
        let Senddata={
            column:column,
            ...row
        }

        axios.post(`${UrlLink}Inventory/Post_Change_Minimum_Maximum_Qty`,Senddata)
        .then((res)=>{
            console.log(res.data); 
            let resdata = res.data
            let type = Object.keys(resdata)[0]
            let mess = Object.values(resdata)[0]
            const tdata = {
                message: mess,
                type: type,
            }
            dispatchvalue({ type: 'toast', value: tdata });           
        })
        .catch((err)=>{
            console.log(err);            
        })

        }
        
    }


    const handleDoubleClick =(locationName,StoreType,storeName,field)=>{
        setdisableState({'location':locationName,'StoreType':StoreType,'storeName':storeName,'field':field})
    }

    const handleInputChange = (locationName, subLocationName, field, value) => {
        setItemDataList(prevData => {
            const updatedData = { ...prevData };
            if (updatedData[locationName]) {
                if (updatedData[locationName].StoreLocation[subLocationName]) {
                    updatedData[locationName].StoreLocation[subLocationName][field] = value === 0? 0 : parseInt(value);
                } else if (updatedData[locationName].NurseStation[subLocationName]) {
                    updatedData[locationName].NurseStation[subLocationName][field] = value === 0? 0 : parseInt(value);
                }
            }
            return updatedData;
        });
    };

    const handleKeyDown = useCallback((e,row,column)=>{

        if (e.key === 'Enter') {
        setdisableState(null)
        if(Object.keys(row).length !==0){
            console.log('row----+++',row);
            if(row.MinimumQuantity > row.MaximumQuantity){

                const tdata = {
                    message: 'Minimum Quantity is greater than Maximum Quantity. Data was not saved.',
                    type: 'warn',
                };
                dispatch({ type: 'toast', value: tdata });

            }
            else if(row.ReorderLevel > row.MaximumQuantity){
                const tdata = {
                    message: 'Reorder Level Quantity is greater than Maximum Quantity.Data was not saved.',
                    type: 'warn',
                };
                dispatch({ type: 'toast', value: tdata }); 
            }
            else{
                handelSaveChangeQty(row,column)
            }
            
        }

        }else if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }

    },[handelSaveChangeQty])



    const renderTableRows = () => {
        return Object.entries(ItemDataList).map(([locationName, locationDetails], index) => {
            const storeCount = Object.keys(locationDetails.StoreLocation).length;
            const NurseStationCount = Object.keys(locationDetails.NurseStation).length;
    
            return (
                <React.Fragment key={`location-${index}`}>
                    {/* Store Locations */}
                    {Object.entries(locationDetails.StoreLocation).map(([storeName, storeData], subIndex) => (
                        <tr key={`store-${index}-${subIndex}`}>
                            {subIndex === 0 && (
                                <>
                                    <td rowSpan={storeCount + NurseStationCount}>
                                        {locationName}
                                    </td>
                                    <td rowSpan={storeCount}>
                                        Store Location
                                    </td>
                                </>
                            )}
                            <td>{storeName}</td>
                            <td>
                        {disableState && disableState.location === locationName && disableState.StoreType === 'StoreLocation' &&
                        disableState.storeName === storeName && disableState.field === 'MinimumQuantity' ? (
                            <input
                                type='number'
                                autoFocus
                                style={style}
                                value={storeData.MinimumQuantity || 0}
                                onKeyDown={(e) => handleKeyDown(e, storeData,'MinimumQuantity')}
                                onChange={(e) => {
                                    const updatedValue = e.target.value;
                                    handleInputChange(locationName, storeName, 'MinimumQuantity', updatedValue);
                                }}    
                             />
                            ):(
                            <div style={div_style}  onDoubleClick={()=> handleDoubleClick(locationName,'StoreLocation',storeName, 'MinimumQuantity')}>
                                {storeData.MinimumQuantity || 0}
                            </div>
                            )}
                            </td>
                            <td>
                            {disableState && disableState.location === locationName && disableState.StoreType === 'StoreLocation' &&
                            disableState.storeName === storeName && disableState.field === 'MaximumQuantity' ? (
                                <input
                                    type='number'
                                    autoFocus
                                    style={style}
                                    value={storeData.MaximumQuantity || 0}
                                    onKeyDown={(e) => handleKeyDown(e, storeData,'MaximumQuantity')}
                                    onChange={(e) => {
                                        const updatedValue = e.target.value;
                                        handleInputChange(locationName, storeName, 'MaximumQuantity', updatedValue);
                                    }}
                                />)
                                :(
                                <div style={div_style}  onDoubleClick={()=> handleDoubleClick(locationName,'StoreLocation',storeName, 'MaximumQuantity')}>
                                {storeData.MaximumQuantity || 0}
                                </div>
                                )}
                            </td>
                            <td>
                            {disableState && disableState.location === locationName && disableState.StoreType === 'StoreLocation' &&
                            disableState.storeName === storeName && disableState.field === 'ReorderLevel' ? (

                                <input
                                    type='number'
                                    autoFocus
                                    style={style}
                                    value={storeData.ReorderLevel || 0}
                                    onKeyDown={(e) => handleKeyDown(e, storeData,'ReorderLevel')}
                                    onChange={(e) => {
                                        const updatedValue = e.target.value;
                                        // Update the state
                                        handleInputChange(locationName, storeName, 'ReorderLevel', updatedValue);
                                    }}
                                />)
                                :(
                                <div style={div_style}  onDoubleClick={()=> handleDoubleClick(locationName,'StoreLocation',storeName, 'ReorderLevel')}>
                                {storeData.ReorderLevel || 0}
                                </div>    
                                )}
                            </td>
                        </tr>
                    ))}
    
                    {Object.entries(locationDetails.NurseStation).map(([NurseStationName, NurseStationData], subIndex) => (
                        <tr key={`NurseStation-${index}-${subIndex}`}>
                            {subIndex === 0 && ( // Only show Nurse Station type for the first NurseStation
                                <td rowSpan={NurseStationCount}>
                                    Nurse Station
                                </td>
                            )}
                            <td>{NurseStationName}</td>
                            <td>
                            {disableState && disableState.location === locationName && disableState.StoreType === 'NurseStation' &&
                             disableState.storeName === NurseStationName && disableState.field === 'MinimumQuantity' ? (
                                <input
                                    type='number'
                                    autoFocus
                                    style={style}
                                    value={NurseStationData.MinimumQuantity || 0}
                                    onKeyDown={(e) => handleKeyDown(e, NurseStationData,'MinimumQuantity')}
                                    onChange={(e) => {
                                        const updatedValue = e.target.value;
                                        // Update the state
                                        handleInputChange(locationName, NurseStationName, 'MinimumQuantity', updatedValue);
                                    }}
                                />)
                                :(
                                <div style={div_style}  onDoubleClick={()=> handleDoubleClick(locationName,'NurseStation',NurseStationName, 'MinimumQuantity')}>
                                {NurseStationData.MinimumQuantity || 0}
                                </div>
                                )}
                            </td>
                            <td>
                            {disableState && disableState.location === locationName && disableState.StoreType === 'NurseStation' &&
                             disableState.storeName === NurseStationName && disableState.field === 'MaximumQuantity' ? (
                                <input
                                    type='number'
                                    autoFocus
                                    style={style}
                                    value={NurseStationData.MaximumQuantity || 0}
                                    onKeyDown={(e) => handleKeyDown(e, NurseStationData,'MaximumQuantity')}
                                    onChange={(e) => {
                                        const updatedValue = e.target.value;
                                        // Update the state
                                        handleInputChange(locationName, NurseStationName, 'MaximumQuantity', updatedValue);
                                    }}
                                />)
                                :(
                                <div style={div_style} onDoubleClick={()=> handleDoubleClick(locationName,'NurseStation',NurseStationName, 'MaximumQuantity')}>
                                {NurseStationData.MaximumQuantity || 0}
                                </div>
                                    
                                )}
                            </td>
                            <td>
                            {disableState && disableState.location === locationName && disableState.StoreType === 'NurseStation' &&
                             disableState.storeName === NurseStationName && disableState.field === 'ReorderLevel' ? (
                                <input
                                    type='number'
                                    autoFocus
                                    style={style}
                                    value={NurseStationData.ReorderLevel || 0}
                                    onKeyDown={(e) => handleKeyDown(e, NurseStationData,'ReorderLevel')}
                                    onChange={(e) => {
                                        const updatedValue = e.target.value;
                                        // Update the state
                                        handleInputChange(locationName, NurseStationName, 'ReorderLevel', updatedValue);
                                    }}
                                />)
                                :(
                                <div style={div_style}  onDoubleClick={()=> handleDoubleClick(locationName,'NurseStation',NurseStationName, 'ReorderLevel')}>
                                {NurseStationData.ReorderLevel || 0}
                                </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </React.Fragment>
            );
        });
    };
    
    // Handler function for input changes
    
    
    

    return (
        <>
            <div className="Main_container_app">
                <h3>Product Minimum Maximum Quantity by Location</h3>
                <br />

                <div className="RegisFormcon_1">
                    <div className="RegisForm_1" style={{ justifyContent: 'center' }}>
                        <label>
                            Item Code<span>:</span>
                        </label>
                        <span>{MinimumMaximumData?.ItemCode}</span>
                    </div>

                    <div className="RegisForm_1">
                        <label>
                            Item Name<span>:</span>
                        </label>
                        <span>{MinimumMaximumData?.ItemName}</span>
                    </div>
                </div>

                <br/>
                <br/>

                {ItemDataList && (
                    <div className="doctor_schedule_table_wrapper">
                        <div className="doctor_schedule_table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Locations</th>
                                        <th>Location Type</th>
                                        <th>Sub Locations</th>
                                        <th>Minimum Quantity</th>
                                        <th>Maximum Quantity</th>
                                        <th>Reorder Level</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderTableRows()}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}
            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    );
};

export default MinimumMaximumLocation;
