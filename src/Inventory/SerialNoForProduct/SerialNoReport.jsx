
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';

const SerialNoReport = () => {

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    const [LocationData, setLocationData] = useState([]);
    const [StoreData, setStoreData] = useState([])

    const [SerialNoProductArray, setSerialNoProductArray] = useState([])

    const [SerialNoArray, setSerialNoArray] = useState([])

    const [BatchNoList, setBatchNoList] = useState([])

    const [SerialNOItemList, setSerialNOItemList] = useState([])

    const [searchQuery, setsearchQuery] = useState({
        SerialNumber: '',
        ItemCode: '',
        ItemName: '',
        BatchNo: '',
        DateType: '',
        CurrentDate: '',
        FromDate: '',
        ToDate: '',
        Monthly: '',
        Location: '',
        StoreType: '',
        StoreName: '',
    })


    useEffect(() => {

        axios.get(`${UrlLink}Masters/Location_Detials_link`)
            .then((res) => {
                const ress = res.data
                setLocationData(ress)
            })
            .catch((err) => {
                console.log(err);
            })

        axios.get(`${UrlLink}Inventory/GET_SerialNumber_Prodect_From_Master`)
            .then((res) => {
                let data = res.data
                if (Array.isArray(data) && data.length !== 0) {
                    setSerialNoProductArray(data)
                }
                else {
                    setSerialNoProductArray([])
                }

            })
            .catch((err) => {
                console.log(err)
            })


    }, [UrlLink])


    useEffect(() => {

        if (searchQuery.SerialNumber !== '') {

            axios.get(`${UrlLink}Inventory/Get_SerialNumber?SerialNumber=${searchQuery.SerialNumber}`)
                .then((res) => {
                    let data = res.data
                    if (Array.isArray(data) && data.length !== 0) {
                        setSerialNoArray(data)
                    }
                    else {
                        setSerialNoArray([])
                    }

                })
                .catch((err) => {
                    console.log(err)
                })
        }
        else {
            setSerialNoArray([])
        }

    }, [UrlLink, searchQuery.SerialNumber])

    useEffect(() => {
        axios.get(`${UrlLink}Inventory/Get_BatchNo`)
            .then((res) => {
                console.log(res.data);
                let data = res.data
                if (Array.isArray(data) && data.length !== 0) {
                    setBatchNoList(data)
                }
                else {
                    setBatchNoList([])
                }
            })
            .catch((err) => {
                console.log(err);
            })

    }, [UrlLink])

    useEffect(() => {

        if (searchQuery.Location && searchQuery.Location !== '') {

            axios.get(`${UrlLink}Inventory/get_ward_store_detials_by_loc?Location=${searchQuery.Location}&IsFromWardStore=${searchQuery.StoreType === 'NurseStation'}`)
                .then((res) => {
                    const ress = res.data || []
                    console.log('rrrrreeeee', res.data);
                    setStoreData(ress)

                })
                .catch((err) => {
                    console.log(err);
                })
        }

    }, [searchQuery.Location, searchQuery.StoreType])


    useEffect(() => {

        axios.get(`${UrlLink}Inventory/Get_SerialNumber_Report`, {
            params: searchQuery
        })
            .then((res) => {
                console.log('************', res.data);
                let getdata = res.data

                if (getdata && Array.isArray(getdata) && getdata.length !== 0) {
                    setSerialNOItemList(getdata)
                }
                else {
                    setSerialNOItemList([])
                }

            })
            .catch((err) => {
                console.log(err);
            })

    }, [searchQuery])




    const handleonchange = (e) => {

        const { name, value } = e.target

        if (name === 'DateType') {

            if (value === 'Current') {
                const today = new Date();
                const currentDate = today.toISOString().split('T')[0];
                setsearchQuery((prev) => ({
                    ...prev,
                    [name]: value,
                    CurrentDate: currentDate,
                }))

            }
            else {

                setsearchQuery((prev) => ({
                    ...prev,
                    [name]: value
                }))

            }


        }
        else if (name === 'ItemCode') {
            setsearchQuery((prev) => ({
                ...prev,
                [name]: value,
                ItemName: '',
            }))
        }

        else if (name === 'ItemName') {
            setsearchQuery((prev) => ({
                ...prev,
                [name]: value,
                ItemCode: '',
            }))
        }

        else if (name === 'Location') {
            setsearchQuery((prev) => ({
                ...prev,
                [name]: value,
                StoreType: '',
                StoreName: '',
            }))
        }

        else if (name === 'StoreType') {
            setsearchQuery((prev) => ({
                ...prev,
                [name]: value,
                StoreName: '',
            }))
        }


        else {

            setsearchQuery((prev) => ({
                ...prev,
                [name]: value
            }))

        }

    }



    const SerialNOListColumn = [
        {
            key: 'id',
            name: 'S.No',
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
            name: 'Batch Number',
        },
        {
            key: 'SerialNoType',
            name: 'Serial Number Type',
        },
        {
            key: 'SerialNumber',
            name: 'Serial Number',
        },
        {
            key: 'LocationName',
            name: 'Location',
        },
        {
            key: 'StoreLocationName',
            name: 'Store Location',
        },
        {
            key: 'ItemStatus',
            name: 'Item Status',
        }
    ]


    return (
        <>

            <div className="Main_container_app">
                <h3>Serial Number Item List</h3>
                <br />
                <div className="RegisFormcon_1">

                    <div className="RegisForm_1">
                        <label>Serial Number<span>:</span></label>

                        <input
                            type='text'
                            name='SerialNumber'
                            value={searchQuery.SerialNumber}
                            onChange={handleonchange}
                            list='SerialNumberList'
                            autoComplete='off'
                        />
                        {/* SerialNoArray */}
                        <datalist
                            id='SerialNumberList'
                        >
                            {
                                SerialNoArray.map((ele, ind) => (
                                    <option key={ind + 'key'} value={ele.SerialNumber}></option>
                                ))
                            }
                        </datalist>
                    </div>

                    <div className="RegisForm_1">
                        <label>Item Code<span>:</span></label>

                        <input
                            type='text'
                            name='ItemCode'
                            value={searchQuery.ItemCode}
                            onChange={handleonchange}
                            list='ItemCodeList'
                            autoComplete='off'
                        />
                        <datalist
                            id='ItemCodeList'
                        >
                            {
                                SerialNoProductArray.map((option, index) => (
                                    <option key={index + 'key'} value={option.ItemCode}>
                                    </option>
                                ))
                            }
                        </datalist>
                    </div>

                    <div className="RegisForm_1">
                        <label>Item Name<span>:</span></label>

                        <input
                            type='text'
                            name='ItemName'
                            value={searchQuery.ItemName}
                            onChange={handleonchange}
                            list='ItemNameList'
                            autoComplete='off'
                        />

                        <datalist
                            id='ItemNameList'
                        >
                            {
                                SerialNoProductArray.map((option, index) => (
                                    <option key={index + 'key'} value={option.ItemName}>
                                    </option>
                                ))
                            }
                        </datalist>
                    </div>

                    <div className="RegisForm_1">
                        <label>Batch Number<span>:</span></label>

                        <input
                            type='text'
                            name='BatchNo'
                            value={searchQuery.BatchNo}
                            onChange={handleonchange}
                            list='BatchNolist'
                            autoComplete='off'
                        />
                        <datalist
                            id='BatchNolist'
                        >
                            {
                                BatchNoList.map((ele, ind) => (
                                    <option key={ind + 'key'} value={ele.BatchNo}></option>
                                ))
                            }
                        </datalist>
                    </div>

                    <div className="RegisForm_1">
                        <label>Date Type<span>:</span></label>

                        <select
                            name='DateType'
                            value={searchQuery.DateType}
                            onChange={handleonchange}
                        >
                            <option value=''>Select</option>
                            <option value='Current'>Current Date</option>
                            <option value='Customize'>Customize</option>
                            <option value='Monthly'>Monthly</option>
                        </select>
                    </div>

                    {searchQuery.DateType === '' ?
                        <></>

                        :

                        searchQuery.DateType === 'Current' ?
                            <div className="RegisForm_1">
                                <label>Current Date<span>:</span></label>
                                <input
                                    type='date'
                                    name='CurrentDate'
                                    value={searchQuery.CurrentDate}
                                    onChange={handleonchange}
                                    readOnly
                                />

                            </div>
                            :
                            searchQuery.DateType === 'Customize' ?
                                <>
                                    <div className="RegisForm_1">
                                        <label>From Date<span>:</span></label>
                                        <input
                                            type='date'
                                            name='FromDate'
                                            value={searchQuery.FromDate}
                                            onChange={handleonchange}
                                            autoComplete='off'
                                        />

                                    </div>


                                    <div className="RegisForm_1">
                                        <label>To Date<span>:</span></label>
                                        <input
                                            type='date'
                                            name='ToDate'
                                            value={searchQuery.ToDate}
                                            onChange={handleonchange}
                                            min={searchQuery.FromDate}
                                            autoComplete='off'
                                        />

                                    </div>
                                </>
                                :

                                <div className="RegisForm_1">
                                    <label>Monthly<span>:</span></label>
                                    <input
                                        type='month'
                                        name='Monthly'
                                        value={searchQuery.Monthly}
                                        onChange={handleonchange}
                                        disabled={searchQuery.DateType === ''}
                                        autoComplete='off'
                                    />

                                </div>

                    }

                    <div className="RegisForm_1">
                        <label>Location<span>:</span></label>
                        <select
                            id='Location'
                            name='Location'
                            value={searchQuery.Location}
                            onChange={handleonchange}
                            autoComplete='off'
                        >
                            <option value=''>Select</option>
                            {
                                LocationData.map((ele, ind) => (
                                    <option key={ind + 'key'} value={ele.id} >{ele.locationName}</option>
                                ))

                            }
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>Store Type<span>:</span></label>
                        <select
                            id='StoreType'
                            name='StoreType'
                            value={searchQuery.StoreType}
                            onChange={handleonchange}
                            disabled={searchQuery.Location === ''}
                        >
                            <option value=''>Select</option>
                            <option value='NurseStation'>Nurses Station</option>
                            <option value='InventoryStore'>Inventory Store</option>
                        </select>
                    </div>

                    <div className="RegisForm_1">
                        <label>Store Name<span>:</span></label>
                        <select
                            id='StoreName'
                            name='StoreName'
                            value={searchQuery.StoreName}
                            onChange={handleonchange}
                            disabled={searchQuery.StoreType === ''}
                            autoComplete='off'
                        >
                            <option value=''>Select</option>
                            {
                                StoreData.map((ele, ind) => (
                                    <option key={ind + 'key'} value={ele.id} >{searchQuery.StoreType === 'NurseStation' ? ele.NurseStation : ele.StoreName}</option>
                                ))
                            }
                        </select>
                    </div>

                </div>
                <br />
                <br />
                <ReactGrid columns={SerialNOListColumn} RowData={SerialNOItemList} />

            </div>

        </>
    )
}

export default SerialNoReport;
