import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import axios from 'axios';

const RoomRateCardList = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const RoomListId = useSelector(state => state.userRecord?.DoctorListId);

    console.log(RoomListId,'RoomListId');
    const dispatchvalue = useDispatch();
    const navigate = useNavigate();

    const [RoomRateCardColumns, setRoomRateCardColumns] = useState([]);
    const [RoomRateCardData, setRoomRateCardData] = useState([]);
    const [RoomDetails, setRoomDetails] = useState(null);
    const [editing, setEditing] = useState(null);
    const [getChanges, setGetChanges] = useState(false);

    useEffect(() => {
        if (Object.keys(RoomListId).length > 0 && RoomListId.RoomId) {
            axios.get(`${UrlLink}Masters/room_ratecard_details_view_by_room_id?RoomId=${RoomListId.RoomId}`)
                .then((res) => {
                    const { Ratecarddetials, ...rest } = res.data;
                    setRoomDetails(rest);
                    setRoomRateCardData(Array.isArray(Ratecarddetials) ? Ratecarddetials : []);
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setRoomRateCardData([]);
            // navigate('/Home/RoomList')
        }
    }, [UrlLink, getChanges, RoomListId, navigate]);

    const handleChange = useCallback((e, rowIdx, column) => {
        const indexx = RoomRateCardData.findIndex(p => p.id === rowIdx);
        const updatedRow = { ...RoomRateCardData[indexx], [column]: e.target.value };
        const newRows = RoomRateCardData.map((row, index) => (index === indexx ? updatedRow : row));
        setRoomRateCardData(newRows);
    }, [RoomRateCardData]);

    const handleDoubleClick = useCallback((rowIdx, column, status) => {
        if (RoomDetails?.Status === 'Active') {
            setEditing({ rowIdx, column });
        } else {
            const tdata = {
                message: `The selected room is inactive, enable it to edit rates`,
                type: 'warn',
            };
            dispatchvalue({ type: 'toast', value: tdata });
        }
    }, [dispatchvalue, RoomDetails]);

    const handleSaveChanges = useCallback((rows, columnchanged) => {
        const colMap = {
            'curr_fee': 'fee',
            'curr_ac_fee': 'ac_fee',
            'curr_nac_fee': 'nac_fee'
        };
        const col = colMap[columnchanged];
        const editval = {
            room_id: RoomListId?.RoomId,
            col: col,
            RatecardType: rows?.RatecardType,
            room_ratecard_id: rows?.room_ratecard_id || null,
            Ratecardid: rows?.Ratecardid || null,
            changedRate: parseFloat(rows[columnchanged])
        };
        const confirmChange = window.confirm("Do you want to save the changes?");
        if (confirmChange) {
            axios.post(`${UrlLink}Masters/room_ratecard_details_update`, editval)
                .then((res) => {
                    const resres = res.data;
                    let typp = Object.keys(resres)[0];
                    let mess = Object.values(resres)[0];
                    const tdata = {
                        message: mess,
                        type: typp,
                    };
                    dispatchvalue({ type: 'toast', value: tdata });
                    setTimeout(() => {
                        setGetChanges(prev => !prev);
                    }, 300);
                })
                .catch((err) => {
                    console.log(err);
                    const tdata = {
                        message: 'Failed to update rate card',
                        type: 'error',
                    };
                    dispatchvalue({ type: 'toast', value: tdata });
                });
        } else {
            setGetChanges(prev => !prev);
        }
    }, [RoomListId, UrlLink, dispatchvalue]);

    const handleKeyDown = useCallback((e, rowss, changedcolumn) => {
        if (e.key === 'Enter') {
            setEditing(null);
            if (rowss && changedcolumn) {
                handleSaveChanges(rowss, changedcolumn);
            }
        } else if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
    }, [handleSaveChanges]);

    useEffect(() => {
        const predefinedColumns = [
            { key: "RatecardShow", name: "RateCard Type", frozen: true },
            { key: "RatecardName", name: "Ratecard Name", frozen: true },
            {
                key: "fee",
                name: "Fee",
                children: [
                    { key: 'prev_fee', name: 'Prev Fee' },
                    {
                        key: 'curr_fee',
                        name: 'Current Fee',
                        editable: true,
                        renderCell: (params) => (
                            editing && editing.rowIdx === params.row.id && editing.column === 'curr_fee' ? (
                                <input
                                    type="number"
                                    autoFocus
                                    className='ratecard_inputs'
                                    onKeyDown={(e) => handleKeyDown(e, params.row, 'curr_fee')}
                                    value={params.row.curr_fee}
                                    onChange={(e) => handleChange(e, params.row.id, 'curr_fee')}
                                />
                            ) : (
                                <div onDoubleClick={() => handleDoubleClick(params.row.id, 'curr_fee', params.row.Status)}>
                                    {params.row.curr_fee}
                                </div>
                            )
                        ),
                    }
                ]
            },
            {
                key: "ac_fee",
                name: "AC Fee",
                children: [
                    { key: 'prev_ac_fee', name: 'Prev Fee' },
                    {
                        key: 'curr_ac_fee',
                        name: 'Current Fee',
                        editable: true,
                        renderCell: (params) => (
                            editing && editing.rowIdx === params.row.id && editing.column === 'curr_ac_fee' ? (
                                <input
                                    type="number"
                                    autoFocus
                                    className='ratecard_inputs'
                                    onKeyDown={(e) => handleKeyDown(e, params.row, 'curr_ac_fee')}
                                    value={params.row.curr_ac_fee}
                                    onChange={(e) => handleChange(e, params.row.id, 'curr_ac_fee')}
                                />
                            ) : (
                                <div onDoubleClick={() => handleDoubleClick(params.row.id, 'curr_ac_fee', params.row.Status)}>
                                    {params.row.curr_ac_fee}
                                </div>
                            )
                        ),
                    }
                ]
            },
            {
                key: "nac_fee",
                name: "Non-AC Fee",
                children: [
                    { key: 'prev_nac_fee', name: 'Prev Fee' },
                    {
                        key: 'curr_nac_fee',
                        name: 'Current Fee',
                        editable: true,
                        renderCell: (params) => (
                            editing && editing.rowIdx === params.row.id && editing.column === 'curr_nac_fee' ? (
                                <input
                                    type="number"
                                    autoFocus
                                    className='ratecard_inputs'
                                    onKeyDown={(e) => handleKeyDown(e, params.row, 'curr_nac_fee')}
                                    value={params.row.curr_nac_fee}
                                    onChange={(e) => handleChange(e, params.row.id, 'curr_nac_fee')}
                                />
                            ) : (
                                <div onDoubleClick={() => handleDoubleClick(params.row.id, 'curr_nac_fee', params.row.Status)}>
                                    {params.row.curr_nac_fee}
                                </div>
                            )
                        ),
                    }
                ]
            }
        ];

        setRoomRateCardColumns(predefinedColumns);
    }, [editing, handleKeyDown, handleChange, handleDoubleClick]);

    return (
        <>
            <div className="Main_container_app">
                <h3>Room Rate Card List</h3>

                <div className="common_center_tag">
                    <span>Room Id : {RoomDetails?.id}</span>
                    <br />
                    <span>Room Name : {RoomDetails?.room_name}</span>
                </div>
                <ReactGrid columns={RoomRateCardColumns} RowData={RoomRateCardData} />
            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    );
};

export default RoomRateCardList;