import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';

const IP_BloodLines = () => {
    const dispatch = useDispatch();
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_QADoctorWorkbenchNavigation);

    const userRecord = useSelector((state) => state.userRecord?.UserData);

    const [BloodLines, setBloodLines] = useState({
        BlType: "",
        IVsite: "",
        IAsite: "",
        Condition: "",
        Status: "",
        CentralLineInfection: "",
        Remarks: "",
    });

    const [gridData, setGridData] = useState([]);
    const [IsGetData, setIsGetData] = useState(false);
    const [IsViewMode, setIsViewMode] = useState(false);

    const BloodLinesColumns = [
        {
            key: 'id',
            name: 'S.No',
            frozen: true
        },
        { key: 'PrimaryDoctorName', name: 'Doctor Name', frozen: true },
        {
            key: 'CurrDate',
            name: 'Date',
            frozen: true
        },
        {
            key: 'CurrTime',
            name: 'Time',
            frozen: true
        },
        {
            key: 'view',
            frozen: true,
            name: 'View',
            renderCell: (params) => (
                <IconButton onClick={() => handleView(params.row)}>
                    <VisibilityIcon />
                </IconButton>
            ),
        },
        { key: 'BlType', name: 'Type' },
        { key: 'IVsite', name: 'IVsite' },
        { key: 'IAsite', name: 'IAsite' },
        { key: 'Condition', name: 'Condition' },
        { key: 'Status', name: 'Status' },
        { key: 'CentralLineInfection', name: 'CentralLineInfection' },
        { key: 'Remarks', name: 'Remarks' },
    ];

    const handleView = (data) => {
        setBloodLines({
            BlType: data.BlType || '',
            IVsite: data.IVsite || '',
            IAsite: data.IAsite || '',
            Condition: data.Condition || '',
            Status: data.Status || '',
            CentralLineInfection: data.CentralLineInfection || '',
            Remarks: data.Remarks || '',
        });
        setIsViewMode(true);
    };

    const handleClear = () => {
        setBloodLines({
            BlType: '',
            IVsite: '',
            IAsite: '',
            Condition: '',
            Status: '',
            CentralLineInfection: '',
            Remarks: '',
        });
        setIsViewMode(false);
    };

    useEffect(() => {
        const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
        const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;

        if (RegistrationId) {
            axios.get(`${UrlLink}Ip_Workbench/IP_BloodLines_Details_Link`, {
                params: {
                    RegistrationId: RegistrationId,
                    DepartmentType: departmentType
                }
            })
                .then((res) => {
                    const ress = res.data;
                    setGridData(ress);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [UrlLink, IP_DoctorWorkbenchNavigation, IsGetData]);

    const HandleOnChange = (e) => {
        const { name, value } = e.target;
        const formattedValue = value.trim();
        setBloodLines((prevFormData) => ({
            ...prevFormData,
            [name]: formattedValue,
        }));

        if (e.target.name === 'Remarks') {
            adjustHeight(e);
        }
    };

    const adjustHeight = (e) => {
        e.target.style.height = "auto"; // Reset height to calculate scrollHeight
        e.target.style.height = `${e.target.scrollHeight}px`; // Set height to scrollHeight
    };

    return (
        <>
            <div className="RegisFormcon_1">
                <div className="common_center_tag">
                    <span>Blood Lines</span>
                </div>

                {IsViewMode && (
                    <>
                        <div className='RegisForm_1'>
                            <label htmlFor="Status_0">Status<span>:</span></label>
                            <input
                                type="text"
                                id="Status_0"
                                name="Status"
                                value={BloodLines.Status}
                                readOnly
                            />
                        </div>

                        <div className='RegisForm_1'>
                            <label htmlFor="BlType_0">Type<span>:</span></label>
                            <input
                                type="text"
                                id="BlType_0"
                                name="BlType"
                                value={BloodLines.BlType}
                                readOnly
                            />
                        </div>

                        {BloodLines.BlType === 'IV' && (
                            <div className='RegisForm_1'>
                                <label htmlFor="IVsite_0">IV Site<span>:</span></label>
                                <input
                                    type="text"
                                    id="IVsite_0"
                                    name="IVsite"
                                    value={BloodLines.IVsite}
                                    readOnly
                                />
                            </div>
                        )}

                        {BloodLines.BlType === 'IA' && (
                            <div className='RegisForm_1'>
                                <label htmlFor="IAsite_0">IA Site<span>:</span></label>
                                <input
                                    type="text"
                                    id="IAsite_0"
                                    name="IAsite"
                                    value={BloodLines.IAsite}
                                    readOnly
                                />
                            </div>
                        )}

                        <div className='RegisForm_1'>
                            <label htmlFor="Condition_0">Condition<span>:</span></label>
                            <input
                                type="text"
                                id="Condition_0"
                                name="Condition"
                                value={BloodLines.Condition}
                                readOnly
                            />
                        </div>

                        <div className='RegisForm_1'>
                            <label htmlFor="Remarks_0">Remarks<span>:</span></label>
                            <textarea
                                id="Remarks_0"
                                name="Remarks"
                                value={BloodLines.Remarks}
                                readOnly
                            />
                        </div>
                        
            <div className="Main_container_Btn">
                {IsViewMode && <button onClick={handleClear}>Clear</button>}
            </div>

                    </>
                    
                )}

                <ReactGrid columns={BloodLinesColumns} RowData={gridData} />
            </div>
        </>
    );
};

export default IP_BloodLines;
