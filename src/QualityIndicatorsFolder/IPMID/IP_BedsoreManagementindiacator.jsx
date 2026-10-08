import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import axios from 'axios';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const IP_BedsoreManagement = () => {
    const dispatch = useDispatch();
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_QADoctorWorkbenchNavigation);

    const userRecord = useSelector((state) => state.userRecord?.UserData);

    const [BedsoreManagement, setBedsoreManagement] = useState({
        Site: "",
        LocationLR: "", 
        Area: "",
        Dressing: "",
        Condition: "",
        Remarks: "",
    });

    const [gridData, setGridData] = useState([]);
    const [IsViewMode, setIsViewMode] = useState(false);

    const BedsoreManagementColumns = [
        { key: 'id', name: 'S.No', frozen: true },
        { key: 'PrimaryDoctorName', name: 'Doctor Name', frozen: true },
        { key: 'CurrDate', name: 'Date', frozen: true },
        { key: 'CurrTime', name: 'Time', frozen: true },
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
        { key: 'Site', name: 'Site' },
        { key: 'LocationLR', name: 'Location' },
        { key: 'Area', name: 'Area' },
        { key: 'Dressing', name: 'Dressing' },
        { key: 'Condition', name: 'Condition' },
        { key: 'Remarks', name: 'Remarks' },
    ];

    const handleView = (data) => {
        setBedsoreManagement({
            Site: data.Site || '',
            LocationLR: data.LocationLR || '',
            Area: data.Area || '',
            Dressing: data.Dressing || '',
            Condition: data.Condition || '',
            Remarks: data.Remarks || '',
        });
        setIsViewMode(true); // Show input fields
    };
  
    const handleClear = () => {
        setBedsoreManagement({
            Site: '',
            LocationLR: '',
            Area: '',
            Dressing: '',
            Condition: '',
            Remarks: '',
        });
        setIsViewMode(false); // Hide input fields
    };

    useEffect(() => {
        const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
        const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;

        if (RegistrationId) {
            axios.get(`${UrlLink}Ip_Workbench/IP_BedsoreManagement_Details_Link`, {
                params: {
                    RegistrationId: RegistrationId,
                    DepartmentType: departmentType
                }})
                .then((res) => {
                    const ress = res.data;
                    setGridData(ress);
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    }, [UrlLink, IP_DoctorWorkbenchNavigation]);

    return (
        <>
            <div className="RegisFormcon_1" >
                <div className="common_center_tag">
                    <span>Bedsore Management</span>
                </div>

                {IsViewMode && (
                    Object.keys(BedsoreManagement).map((p, index) => (
                        p !== 'Remarks' && (
                            <div className='RegisForm_1' key={p}>
                                <label htmlFor={`${p}_${index}`}>
                                    {p === "LocationLR" ? "Location" : p}
                                    <span>:</span>
                                </label>
                                <input
                                    id={`${p}_${index}`}
                                    name={p}
                                    value={BedsoreManagement[p]}
                                    readOnly={IsViewMode}
                                />
                            </div>
                        )
                    ))
                )}
            </div>

            {IsViewMode && (
                <div className="RegisFormcon extend_textarea_new">
                    <div className="RegisForm_1 extend_textarea_new">
                        <label htmlFor="Remarks">Remarks<span>:</span></label>
                        <textarea
                            id="Remarks"
                            name="Remarks"
                            value={BedsoreManagement.Remarks}
                            readOnly={IsViewMode}
                        />
                    </div>
                </div>
            )}

            <div className="Main_container_Btn">
                {IsViewMode && <button onClick={handleClear}>Clear</button>}
            </div>

            {gridData.length >= 0 && (
                <ReactGrid columns={BedsoreManagementColumns} RowData={gridData} />
            )}

            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    );
}

export default IP_BedsoreManagement;
