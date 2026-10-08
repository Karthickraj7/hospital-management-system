import React, { useCallback, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import axios from 'axios';

const SurgeryProcedureRatecardView = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const SurgeryProcedureRatecardView = useSelector(state => state.userRecord?.SurgeryProcedureRatecardView);
    const dispatchvalue = useDispatch();
    const navigate = useNavigate();
    const [DoctorRateCardColumns, setDoctorRateCardColumns] = useState([]);
    const [DoctorRateCardData, setDoctorRateCardData] = useState([]);
    const [RoomTypes, setRoomTypes] = useState([]);
    console.log("RoomTypes", RoomTypes)
    const [ServiceProcedure, setServiceProcedure] = useState(null);
    const [editing, setEditing] = useState(null);
    const [getChanges, setGetChanges] = useState(false);
  
    useEffect(() => {
        if (Object.keys(SurgeryProcedureRatecardView).length > 0 && SurgeryProcedureRatecardView.MasterType && SurgeryProcedureRatecardView.id) {
            console.log("-----------iiiiiiiiiiiiiiii");
            axios.get(`${UrlLink}Masters/Surgery_Procedure_Ratecard_details_view_by_id?MasterType=${SurgeryProcedureRatecardView.MasterType}&id=${SurgeryProcedureRatecardView.id}`)
                .then((res) => {
                    const { Ratecarddetials, Roomtypes, ...rest } = res.data;
                    setRoomTypes(Roomtypes);
                    setServiceProcedure(rest)
                    setDoctorRateCardData(Array.isArray(Ratecarddetials) ? Ratecarddetials : []);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
        else {
            setRoomTypes([]);
            setDoctorRateCardData([]);
            navigate("/Home/MasterFolder");
            dispatchvalue({ type: "HrFolder", value: "Surgery_Master" });
        }

    }, [UrlLink, getChanges, SurgeryProcedureRatecardView, navigate]);

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
                message: `The Selected Surgery are in Inactive ,enable it to edit Rates`,
                type: 'warn',
            }

            dispatchvalue({ type: 'toast', value: tdata });
        }

    }, [dispatchvalue, ServiceProcedure])

    const handleSaveChanges = useCallback((rows, columnchanged) => {
        console.log(rows, columnchanged);
        const splited = columnchanged.split('_')

        const editval = {
            MasterType: SurgeryProcedureRatecardView?.MasterType,
            id: SurgeryProcedureRatecardView?.id,
            col: splited[0],
            colId: !'OP_charge'.includes(splited[0]) ? parseInt(splited[1]) : null,
            RatecardType: rows?.RatecardType,
            SP_ratecard_id: rows?.ratecard_id || null,
            SP_Ratecardid: rows?.Ratecardid || null,
            location: rows?.location_id,
            changedRate: !'OP_charge'.includes(splited[0]) ? rows[columnchanged] : rows['fee']
        }
        const confirmChange = window.confirm("Do you want to save the changes?");
        if (confirmChange) {
            console.log(editval, 'uyfufufuf');

            axios.post(`${UrlLink}Masters/Surgery_Procedure_Ratecard_details_update`, editval)
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

    }, [SurgeryProcedureRatecardView, UrlLink, dispatchvalue])



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
            { key: "locationshow", name: "Location" },
            { key: "RatecardShow", name: "RateCard Type" },
            { key: "RatecardName", name: "Ratecard Name" },
        ];

        const dynamicColumns = (RoomTypes && RoomTypes.length > 0) ?
            RoomTypes.map(keyval => ({
                key: `${keyval?.id}_${keyval?.name}`,
                name: keyval?.name,
                children: [
                  
                    {
                        key: `${keyval?.name}_${keyval?.id}_fees`, // A single key for both values
                        name: 'Prev Fee | Current Fee', // Column header displaying both names
                        width: 240,
                        renderCell: (params) => (
                            <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '50px',
                                padding: '0px 7px'
                            }}>
                                <span> {params.row[`${keyval?.name}_${keyval?.id}_prev_fee`]}</span>
                                {editing && editing.rowIdx === params.row.id && editing.column === `${keyval?.name}_${keyval?.id}_curr_fee` ? (
                                    <input
                                        type="number"
                                        autoFocus
                                        className="ratecard_inputs"
                                        onKeyDown={(e) => handleKeyDown(e, params.row, `${keyval?.name}_${keyval?.id}_curr_fee`)}
                                        value={params.row[`${keyval?.name}_${keyval?.id}_curr_fee`]}
                                        onChange={(e) => handleChange(e, params.row.id, `${keyval?.name}_${keyval?.id}_curr_fee`)}
                                    />
                                ) : (
                                    <span
                                        onDoubleClick={() =>
                                            handleDoubleClick(params.row.id, `${keyval?.name}_${keyval?.id}_curr_fee`, params.row.Status)
                                        }
                                    >{params.row[`${keyval?.name}_${keyval?.id}_curr_fee`]}
                                    </span>
                                )}
                            </div>
                        ),
                    }
                    
                ]
            })) : [];

        if (ServiceProcedure?.Typess !== 'OP') {
            predefinedColumns.push({
                key: "IP_Charge",
                name: "IP Charge",
                children: dynamicColumns
            });
        }

        const Columns = [...predefinedColumns];
        setDoctorRateCardColumns(Columns);
    }, [RoomTypes, editing, handleKeyDown, handleChange, handleDoubleClick, ServiceProcedure]);

    return (
        <>


            <div className="Main_container_app">
                <h3>
                    {SurgeryProcedureRatecardView?.MasterType} Rate Card List

                </h3>
                <div className="common_center_tag">

                    <span> {SurgeryProcedureRatecardView?.MasterType === 'Surgery' ? 'Department' : 'Specialization'} : {ServiceProcedure?.Typess}</span>
                    <br />
                    <span>{SurgeryProcedureRatecardView?.MasterType} Name : {ServiceProcedure?.Service_procedure_name}</span>
                </div>
                <ReactGrid columns={DoctorRateCardColumns} RowData={DoctorRateCardData} />
            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    )
}

export default SurgeryProcedureRatecardView