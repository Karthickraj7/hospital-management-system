
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


const SerialNoAssignPage = () => {

    const dispatchvalue = useDispatch();
    const navigate = useNavigate();


    const SerialNoData = useSelector(state => state.Inventorydata?.SerialNoData);
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const userRecord = useSelector((state) => state.userRecord?.UserData);



    const [SerialItemState, setSerialItemState] = useState({
        SelectSerialType: '',

    })

    const [SerialItemArray, setSerialItemArray] = useState([])




    const formatLabel = (label) => {

        if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
            return label
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/^./, (str) => str.toUpperCase());
        } else {
            return label;
        }
    };



    useEffect(() => {
        if (Object.keys(SerialNoData).length !== 0) {


            if (SerialNoData?.ItemCode !== '' && SerialNoData?.StockId !== '') {
                axios.get(`${UrlLink}Inventory/GET_Last_SerialNumber_ItemDetails?ItemCode=${SerialNoData?.ItemCode}&StockId=${SerialNoData?.StockId}`)
                    .then((res) => {
                        // console.log(res.data,'PPPPp');                    
                        let data = res?.data

                        if (data && data.message === 'success') {

                            let ItemLastSerialNumberType = data.Items.ItemLastSerialNumberType
                            let ItemLastSerialNumber = data.Items.ItemLastSerialNumber

                            const { id, StoreLocation, Status, ...rest } = SerialNoData;

                            setSerialItemState({
                                ...rest,
                                SelectSerialType: ItemLastSerialNumberType,
                                ItemLastSerialNumber: ItemLastSerialNumber,
                            })

                        }
                        else {
                            const { id, StoreLocation, Status, ...rest } = SerialNoData;

                            setSerialItemState({
                                ...rest,
                                SelectSerialType: '',
                            })
                        }

                    })
                    .catch((err) => {
                        console.log(err);

                    })
            }


        }
    }, [SerialNoData])


    const HandleItemOnchange = (e) => {

        const { name, value } = e.target

        setSerialItemState((prev) => ({
            ...prev,
            [name]: value,
        }))

    }



    // useEffect(()=>{

    //     if(SerialItemState.SelectSerialType !== '')
    //     {
    //         if(SerialItemState.SelectSerialType === 'Manual' && +SerialItemState.ItemQuantity !==0){


    //             let UpdateArray = Array.from({length : +SerialItemState.ItemQuantity},(ele,ind) => ({
    //                 id:ind+1,
    //                 ItemCode:SerialItemState.ItemCode,
    //                 ItemName:SerialItemState.ItemName,
    //                 BatchNo:SerialItemState.BatchNo,
    //                 SerialNumber:'',
    //             }))

    //             setSerialItemArray(UpdateArray)

    //         }

    //         if (SerialItemState.SelectSerialType === 'Auto' && +SerialItemState.ItemQuantity !== 0) {
    //             let Old_Serial_Number = SerialItemState?.ItemLastSerialNumber || 0;

    //             console.log('Old_Serial_Number', Old_Serial_Number);

    //             const currentDate = new Date();
    //             const day = currentDate.getDate().toString().padStart(2, '0');  
    //             const month = (currentDate.getMonth() + 1).toString().padStart(2, '0'); 
    //             const year = currentDate.getFullYear().toString().slice(-2); 

    //             // Combine them into DMYY format
    //             const formattedDate = `${day}${month}${year}`;

    //             let Checknumberbydate = Old_Serial_Number?.slice(9, 15) === formattedDate
    //             // console.log('Checknumberbydate',Checknumberbydate);


    //             let UpdateArray = Array.from({ length: +SerialItemState.ItemQuantity }, (ele, ind) => {
    //                 let itemNamePrefix = SerialItemState.ItemName.substring(0, 3).toUpperCase(); // First 3 characters of ItemName

    //                 let incrementNumber = (ind + 1).toString().padStart(5, '0');

    //                 // Generate SerialNumber based on Old_Serial_Number or new format
    //                 let serialNumber = Old_Serial_Number !== 0 && Checknumberbydate
    //                     ? itemNamePrefix + '/'+ SerialItemState.BatchNo + '/'+formattedDate + '/'+ String(+Old_Serial_Number.slice(-5) + ind + 1).padStart(5, '0')
    //                     : itemNamePrefix + '/'+ SerialItemState.BatchNo + '/'+ formattedDate +'/'+ incrementNumber;

    //                 return {
    //                     id: ind + 1,
    //                     ItemCode: SerialItemState.ItemCode,
    //                     ItemName: SerialItemState.ItemName,
    //                     BatchNo: SerialItemState.BatchNo,
    //                     SerialNumber: serialNumber,
    //                 };
    //             });

    //             setSerialItemArray(UpdateArray);
    //         }


    //     }
    //     else{
    //         setSerialItemArray([]);
    //     }

    // },[SerialItemState])


    useEffect(() => {
        if (SerialItemState.SelectSerialType !== '') {
            if (SerialItemState.SelectSerialType === 'Manual' && +SerialItemState.ItemQuantity !== 0) {
                let UpdateArray = Array.from({ length: +SerialItemState.ItemQuantity }, (ele, ind) => ({
                    id: ind + 1,
                    ItemCode: SerialItemState.ItemCode,
                    ItemName: SerialItemState.ItemName,
                    BatchNo: SerialItemState.BatchNo,
                    SerialNumber: '',
                }));

                setSerialItemArray(UpdateArray);
            }

            if (SerialItemState.SelectSerialType === 'Auto' && +SerialItemState.ItemQuantity !== 0) {
                let Old_Serial_Number = SerialItemState?.ItemLastSerialNumber || 0;

                console.log('Old_Serial_Number', Old_Serial_Number);

                const currentDate = new Date();
                const day = currentDate.getDate().toString().padStart(2, '0');
                const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
                const year = currentDate.getFullYear().toString().slice(-2);

                // Combine them into DMYY format
                const formattedDate = `${day}${month}${year}`;

                // Check if the Old_Serial_Number exists and if it matches today's date (based on the last 6 digits)
                const isSameDate = Old_Serial_Number && Old_Serial_Number.slice(9, 15) === formattedDate;

                let UpdateArray = Array.from({ length: +SerialItemState.ItemQuantity }, (ele, ind) => {
                    let itemNamePrefix = SerialItemState.ItemName.substring(0, 3).toUpperCase(); // First 3 characters of ItemName
                    let incrementNumber = (ind + 1).toString().padStart(5, '0');

                    // If Old_Serial_Number exists and matches the date, generate based on the old number, otherwise generate new ones
                    let serialNumber = (Old_Serial_Number !== 0 && isSameDate)
                        ? itemNamePrefix + '/' + SerialItemState.BatchNo + '/' + formattedDate + '/' + String(+Old_Serial_Number.slice(-5) + ind + 1).padStart(5, '0')
                        : itemNamePrefix + '/' + SerialItemState.BatchNo + '/' + formattedDate + '/' + incrementNumber;

                    return {
                        id: ind + 1,
                        ItemCode: SerialItemState.ItemCode,
                        ItemName: SerialItemState.ItemName,
                        BatchNo: SerialItemState.BatchNo,
                        SerialNumber: serialNumber,
                    };
                });

                setSerialItemArray(UpdateArray);
            }

        } else {
            setSerialItemArray([]);
        }

    }, [SerialItemState]);



    console.log('SerialItemArray', SerialItemArray);


    const handleSerialNumberChange = (e, id) => {
        const newSerialNumber = e.target.value.toUpperCase();

        setSerialItemArray((prevArray) =>
            prevArray.map((item) =>
                item.id === id
                    ? { ...item, SerialNumber: newSerialNumber }
                    : item
            )
        );
    };



    const SerialArrayColumn = [
        {
            key: 'id',
            name: 'List.No',
            frozen: true
        },
        {
            key: 'ItemCode',
            name: 'Item Code',
        },
        {
            key: 'ItemName',
            name: 'Item Name',
        },
        {
            key: 'BatchNo',
            name: 'Batch No',
        },
        {
            key: 'SerialNumber',
            name: 'Serial Number',
            with: 300,
            renderCell: (params) => {
                if (!params || !params.row) {
                    return null; // or some fallback UI
                }

                return (
                    <div className="RegisForm_1" style={{ justifyContent: 'center' }}>
                        <input
                            type="text"
                            style={{ textAlign: 'center' }}
                            value={params.row.SerialNumber || ''}
                            onChange={(e) => handleSerialNumberChange(e, params.row.id)}
                            onClick={(e) => e.stopPropagation()}
                            readOnly={SerialItemState.SelectSerialType === 'Auto'}
                        />
                    </div>
                );
            },
        }
    ]


    const SaveSerialNo = () => {

        let CheckEmpty = SerialItemArray.some(ele => ele.SerialNumber === '')

        let duplicateSet = new Set();
        const serialSet = new Set();

        SerialItemArray.forEach((item) => {
            if (serialSet.has(item.SerialNumber)) {
                duplicateSet.add(item.SerialNumber)
            } else {
                serialSet.add(item.SerialNumber);
            }
        });


        if (CheckEmpty) {

            const tdata = {
                message: `Please fill out all Serial Number fields`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });

        }

        if (duplicateSet.size > 0) {

            const tdata = {
                message: `Duplicate Serial Numbers found. Please ensure all Serial Numbers are unique. Duplicate Serial Numbers: ${[...duplicateSet].join(', ')}`,
                type: 'warn',
            }
            dispatchvalue({ type: 'toast', value: tdata });

        }
        else {
            console.log('SerialItemArray', SerialItemArray);

            let Senddata = {
                StockId: SerialItemState.StockId,
                ItemCode: SerialItemState.ItemCode,
                SelectSerialType: SerialItemState.SelectSerialType,
                Create_by: userRecord?.username,
                SerialItemArray: SerialItemArray,
            }

            axios.post(`${UrlLink}Inventory/SerialNumber_Create_Link`, Senddata)
                .then((res) => {
                    console.log(res.data);

                    let resdata = res.data
                    let type = Object.keys(resdata)[0]
                    let mess = Object.values(resdata)[0]
                    const tdata = {
                        message: mess,
                        type: type,
                    }
                    dispatchvalue({ type: 'toast', value: tdata });
                    if (type === 'success') {
                        // navigate('/Home/SerialNoQuelist');
                        navigate("/Home/InventoryMaster");
                        dispatchvalue({ type: "HrFolder", value: "SerialNoQuelist" });
                        dispatchvalue({ type: "setPreviousFolder", value: null });
                        dispatchvalue({ type: "showMenu", value: true });
                        dispatchvalue({ type: 'SerialNoData', value: {} })
                    }
                })
                .catch((err) => {
                    console.log('mmmmm', err);

                })

        }




    }




    return (
        <>

            <div className="Main_container_app">
                <h3>Serial Number Page </h3>

                <br />

                <div className="RegisFormcon_1">

                    {
                        SerialItemState && Object.keys(SerialItemState).map((StateName, index) => {
                            return (
                                <div className="RegisForm_1" key={index + 'key'}>

                                    <label htmlFor={StateName}>{formatLabel(StateName)} :</label>

                                    {StateName === 'SelectSerialType' ?

                                        <select
                                            id={StateName}
                                            name={StateName}
                                            value={SerialItemState[StateName]}
                                            onChange={HandleItemOnchange}
                                            disabled={SerialItemState.ItemLastSerialNumber}
                                        >
                                            <option value=''>Select</option>
                                            <option value='Auto'>Auto</option>
                                            <option value='Manual'>Manual</option>

                                        </select>
                                        :
                                        <input
                                            type='text'
                                            id={StateName}
                                            name={StateName}
                                            value={SerialItemState[StateName]}
                                            onChange={HandleItemOnchange}
                                            disabled
                                        />
                                    }
                                </div>

                            )
                        })
                    }

                </div>

                <br />

                <div className="common_center_tag">
                    <span>{SerialItemState.SelectSerialType} Serial Number Table</span>
                </div>
                <br />

                <ReactGrid columns={SerialArrayColumn} RowData={SerialItemArray} />

                <br />

                {SerialItemArray.length !== 0 && <div className="Main_container_Btn">
                    <button onClick={SaveSerialNo} >
                        Save
                    </button>
                </div>}
            </div>

            <ToastAlert Message={toast.message} Type={toast.type} />

        </>
    )
}

export default SerialNoAssignPage;
