import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import axios from 'axios';

const ServiceProcedureRatecard = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const ServiceProcedureRatecardView = useSelector(state => state.userRecord?.ServiceProcedureRatecardView);
    const dispatchvalue = useDispatch();
    const navigate = useNavigate();

    const [DoctorRateCardColumns, setDoctorRateCardColumns] = useState([]);
    const [DoctorRateCardData, setDoctorRateCardData] = useState([]);
    const [RoomTypes, setRoomTypes] = useState([]);
    const [ServiceProcedure, setServiceProcedure] = useState(null);
    const [editing, setEditing] = useState(null);
    const [getChanges, setGetChanges] = useState(false);

    useEffect(() => {
        console.log(ServiceProcedureRatecardView);
        
        if (Object.keys(ServiceProcedureRatecardView).length > 0 && ServiceProcedureRatecardView.MasterType && ServiceProcedureRatecardView.id) {
            console.log('iiii');
            
            axios.get(`${UrlLink}Masters/Service_Procedure_Ratecard_details_view_by_id?MasterType=${ServiceProcedureRatecardView.MasterType}&id=${ServiceProcedureRatecardView.id}`)
                .then((res) => {
                    console.log('iu',res);
                    
                    const { Ratecarddetials, Roomtypes, ...rest } = res.data
                    setRoomTypes(Roomtypes);
                    setServiceProcedure(rest)
                    setDoctorRateCardData(Array.isArray(Ratecarddetials) ? Ratecarddetials : []);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setRoomTypes([]);
            setDoctorRateCardData([]);
            navigate('/Home/ServiceProcedureMasterList')
        }

    }, [UrlLink, getChanges, ServiceProcedureRatecardView, navigate]);

    const handleChange = useCallback((e, rowIdx, column) => {
        const indexx = DoctorRateCardData.findIndex(p => p.id === rowIdx)
        const updatedRow = { ...DoctorRateCardData[indexx], [column]: e.target.value };
        const newRows = DoctorRateCardData.map((row, index) => (index === indexx ? updatedRow : row));
        setDoctorRateCardData(newRows);
    }, [DoctorRateCardData]);
    

    const handleDoubleClick = useCallback((rowIdx, column) => {
        if (ServiceProcedure?.Status === 'Active') {
            setEditing({ rowIdx, column });
        } else {
            const tdata = {
                message: `The Selected Doctor are in Inactive ,enable it to edit Rates`,
                type: 'warn',
            }

            dispatchvalue({ type: 'toast', value: tdata });
        }

    }, [dispatchvalue, ServiceProcedure]);

    const handleSaveChanges = useCallback((rows, columnchanged) => {
        console.log(rows, columnchanged);
        const splited = columnchanged.split('_')

        const editval = {
            MasterType: ServiceProcedureRatecardView?.MasterType,
            id: ServiceProcedureRatecardView?.id,
            col: splited[0],
            colId: !'OP_charge'.includes(splited[0]) ? parseInt(splited[1]) : null,
            RatecardType: rows?.RatecardType,
            SP_ratecard_id: rows?.ratecard_id || null,
            SP_Ratecardid: rows?.Ratecardid || null,
            location: rows?.location_id,
            changedRate:!'OP_charge'.includes(splited[0])? rows[columnchanged] :rows['fee']
        }
        const confirmChange = window.confirm("Do you want to save the changes?");
        if (confirmChange) {
            console.log(editval, 'uyfufufuf');

            axios.post(`${UrlLink}Masters/Service_Procedure_Ratecard_details_update`, editval)
                .then((res) => {
                    console.log(res);
                    const resres = res.data
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                })
                .catch((err) => {
                    console.log(err);
                })
            setGetChanges(prev => !prev);
        } else {
            setGetChanges(prev => !prev);
        }
        console.log('editval', editval);

    }, [ServiceProcedureRatecardView, UrlLink, dispatchvalue])


    const handleKeyDown = useCallback((e, rowss, changedcolumn) => {

        if (e.key === 'Enter') {
            setEditing(null);
            if (rowss && changedcolumn) {
                handleSaveChanges(rowss, changedcolumn);
            }
        } else if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
    }, [handleSaveChanges])


    useEffect(() => {
        const predefinedColumns = [
            { key: "locationshow", name: "Location",  },
            { key: "RatecardShow", name: "RateCard Type",  },
            { key: "RatecardName", name: "Ratecard Name", },


        ];
        if (ServiceProcedure?.Typess !== 'IP') {
            predefinedColumns.push(
                {
                    key: "OP_Charge",
                    name: "OP Charge",
                    children: [
                        { key: 'prev_fee', name: 'Prev Fee' },
                        {
                            key: 'fee',
                            name: 'Current Fee',
                            editable: true,
                            renderCell: (params) => (
                                editing && editing.rowIdx === params.row.id && editing.column === 'fee' ? (
                                    <input
                                        type="number"
                                        autoFocus
                                        className='ratecard_inputs'
                                        onKeyDown={(e) => handleKeyDown(e, params.row, 'OP_Charge')}
                                        value={params.row.fee}
                                        onChange={(e) => handleChange(e, params.row.id, 'fee')}
                                    />
                                ) : (
                                    <div onDoubleClick={() => handleDoubleClick(params.row.id, 'fee', params.row.Status)}>
                                        {params.row.fee}
                                    </div>
                                )
                            ),
                        }
                    ]
                }
            )
        }


        const dynamicColumns = (RoomTypes && RoomTypes.length > 0) ?
            RoomTypes.map(keyval => ({
                key: `${keyval?.id}_${keyval?.name}`,
                name: keyval?.name,
                children: [
                    { key: `${keyval?.name}_${keyval?.id}_prev_fee`, name: 'Prev Fee', width: 120 },
                    {
                        key: `${keyval?.name}_${keyval?.id}_curr_fee`,
                        name: 'Current Fee',
                        editable: true,
                        width: 120,
                        renderCell: (params) => (
                            editing && editing.rowIdx === params.row.id && editing.column === `${keyval?.name}_${keyval?.id}_curr_fee` ? (
                                <input
                                    type="number"
                                    autoFocus
                                    className='ratecard_inputs'
                                    onKeyDown={(e) => handleKeyDown(e, params.row, `${keyval?.name}_${keyval?.id}_curr_fee`)}
                                    value={params.row[`${keyval?.name}_${keyval?.id}_curr_fee`]}
                                    onChange={(e) => handleChange(e, params.row.id, `${keyval?.name}_${keyval?.id}_curr_fee`)}
                                />
                            ) : (
                                <div onDoubleClick={() => handleDoubleClick(params.row.id, `${keyval?.name}_${keyval?.id}_curr_fee`, params.row.Status)}>
                                    {params.row[`${keyval?.name}_${keyval?.id}_curr_fee`]}
                                </div>
                            )
                        ),
                    }
                ]
            })) : [];

        if (ServiceProcedure?.Typess !== 'OP') {
            predefinedColumns.push(
                {
                    key: "IP_Charge",
                    name: "IP Charge",
                    children: dynamicColumns
                }
            )
        }
        const Columns = [...predefinedColumns];
        setDoctorRateCardColumns(Columns);
    }, [RoomTypes, editing, handleKeyDown, handleChange, handleDoubleClick, ServiceProcedure]);


    return (
        <>
            <div className="Main_container_app">
                <h3>
                    {ServiceProcedureRatecardView?.MasterType} Rate Card List

                </h3>

                <div className="common_center_tag">

                    <span> {ServiceProcedureRatecardView?.MasterType === 'Service' ? 'Department' : 'Specialization'} : {ServiceProcedure?.Typess}</span>
                    <br />
                    <span>{ServiceProcedureRatecardView?.MasterType} Name : {ServiceProcedure?.Service_procedure_name}</span>
                </div>
                <ReactGrid columns={DoctorRateCardColumns} RowData={DoctorRateCardData} />
            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    )
}

export default ServiceProcedureRatecard;
