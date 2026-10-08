import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from '../../../OtherComponent/ReactGrid/ReactGrid';
import axios from 'axios';
import ToastAlert from '../../../OtherComponent/ToastContainer/ToastAlert';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';


const PatientTimeEntry = () => {

    const dispatch = useDispatch();
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
    console.log(IP_DoctorWorkbenchNavigation,'IP_DoctorWorkbenchNavigation');

    const userRecord = useSelector((state) => state.userRecord?.UserData);

    const formatLabel = (label) => {

        if (/[a-z]/.test(label) && /[A-Z]/.test(label) && !/\d/.test(label)) {
            return label
                .replace(/([a-z])([A-Z])/g, "$1 $2")
                .replace(/^./, (str) => str.toUpperCase());
        } else {
            return label;
        }
    };


    const [PatientTimeEntry, setPatientTimeEntry] = useState({
       
        PatientInTime: "",
        PatientArrivedAmbulance: "",
        AmbulanceNo: "",
        RmoName: "",
        RmoSeenTime: "",
        SpecialityDrName: "",
        DrSeenTime: "",
        SisterIncharge: "",
        Remarks: "",
       
    });

    const [gridData, setGridData] = useState([])
    const [IsGetData, setIsGetData] = useState(false)

    const [IsViewMode, setIsViewMode] = useState(false)
  


    const PatientTimeColumns = [
        { key: 'id',name: 'S.No',frozen: true},
        { key: 'VisitId', name: 'VisitId',frozen: true },
        { key: 'PrimaryDoctorId', name: 'Doctor Id',frozen: true },
        { key: 'PrimaryDoctorName', name: 'Doctor Name',frozen: true },
      
        {key: 'Date',name: 'Date',frozen: true},
        {key: 'Time',name: 'Time',frozen: true},
       
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
        
    ]

    const handleView = (data) => {
        setPatientTimeEntry({
            PatientInTime: data.PatientInTime || '',
            PatientArrivedAmbulance: data.PatientArrivedAmbulance || '',
            AmbulanceText: data.AmbulanceText || '',
            RmoName: data.RmoName || '',
            RmoSeenTime: data.RmoSeenTime || '',
            SpecialityDocName: data.SpecialityDocName || '',
            DocSeenTime: data.DocSeenTime || '',
            SisterIncharge: data.SisterIncharge || '',
            Remarks: data.Remarks || '',
           
        });
        setIsViewMode(true);
    };


    const handleClear = () => {
        setPatientTimeEntry({
            PatientInTime: '',
            PatientArrivedAmbulance: '',
            AmbulanceText: '',
            RmoName: '',
            RmoSeenTime: '',
            SpecialityDocName: '',
            DocSeenTime: '',
            SisterIncharge: '',
            Remarks: '',
            
        });
        setIsViewMode(false);
    };


        
    // useEffect(() => {

    //     const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    //     const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;

    //     if (RegistrationId) {
    //         axios.get(`${UrlLink}Ip_Workbench/Casuality_PatientTimeEntry_Details_Link`, {
    //             params: {
    //                 RegistrationId: RegistrationId,
    //                 DepartmentType: departmentType
    //             }
    //         })
    //         .then((res) => {
    //             setGridData(res.data);
    //         })
    //         .catch((err) => {
    //             console.log(err);
    //         });
    //     }
    // }, [UrlLink, IP_DoctorWorkbenchNavigation]);






    const HandleOnChange = (e) => {
        const { name, value } = e.target;
        
        setPatientTimeEntry((prevFormData) => ({
            ...prevFormData,
            [name]: value,
        }));
    };


    const handlePatientTimeEntrySubmit = () => {
        
        console.log(IP_DoctorWorkbenchNavigation?.RegistrationId);
        
        const senddata={
            ...PatientTimeEntry,
            RegistrationId:IP_DoctorWorkbenchNavigation?.RegistrationId,
            Createdby:userRecord?.username,
            
        }

        console.log(senddata,'senddata');
        
        axios.post(`${UrlLink}Ip_Workbench/Casuality_PatientTimeEntry_Details_Link`, senddata)
        .then((res) => {
            const [type, message] = [Object.keys(res.data)[0], Object.values(res.data)[0]];
            dispatch({ type: 'toast', value: { message, type } });
            setIsGetData(prev => !prev);
            handleClear();
            })
        .catch((err) => console.log(err));
        
    }
    





  return (
    <>
        <div className="RegisFormcon_1" >
        <br/>
        <div className="common_center_tag">
            <span>Patient Time Entry</span>
        </div>


            
        {
            Object.keys(PatientTimeEntry).map((p, index) =>
            (
                <div className='RegisForm_1' key={p}>
                <label htmlFor={`${p}_${index}`}>
                {p === "RmoSeenTime" ? "Rmo Evaluated Time"
                : p === "DrSeenTime" ? "Dr Evaluated Time"
                : formatLabel(p)} <span>:</span>
                </label>
                {p === 'DateOfSurgery' ? (
                    <input
                        id={`${p}_${index}`}
                        autoComplete='off'
                        type='date'
                        name={p}
                        value={PatientTimeEntry[p]}
                        onChange={HandleOnChange}
                        readOnly={IsViewMode}

                    />
                ) : p === 'PatientArrivedAmbulance' ? (
                    <div className="text_adjust_mt_Ot_rado_0">
                        <input
                            type='radio'
                            id={`${p}_yes_${index}`}
                            name={p}
                            value='Yes'
                            checked={PatientTimeEntry[p] === 'Yes'}
                            onChange={HandleOnChange}
                            readOnly={IsViewMode}
                            disabled = {IsViewMode}

                        />
                        <label htmlFor={`${p}_yes_${index}`}>Yes</label>
                        
                        <input
                            type='radio'
                            id={`${p}_no_${index}`}
                            name={p}
                            value='No'
                            checked={PatientTimeEntry[p] === 'No'}
                            onChange={HandleOnChange}
                            readOnly={IsViewMode}
                            disabled = {IsViewMode}

                        />
                        <label htmlFor={`${p}_no_${index}`}>No</label>
                    </div>
                ) : p === 'Remarks' ? (
                    <textarea
                        id={`${p}_${index}`}
                        name={p}
                        value={PatientTimeEntry[p]}
                        onChange={HandleOnChange}
                        readOnly={IsViewMode}

                    />
                ) : (
                    <input
                        id={`${p}_${index}`}
                        autoComplete='off'
                        type={p === 'Date' ? 'date' : p === 'PatientInTime' || p === 'RmoSeenTime' || p === 'DocSeenTime' ? 'time' : 'text'}
                        name={p}
                        value={PatientTimeEntry[p]}
                        onChange={HandleOnChange}
                        readOnly={IsViewMode || (PatientTimeEntry.PatientArrivedAmbulance === 'No' && !!PatientTimeEntry.AmbulanceNo)}


                    />
                )}
                </div>
            
            ))
        }
        </div>
        
        <div className="Main_container_Btn">
    
            {IsViewMode && (
                <button onClick={handleClear}>Clear</button>
            )}
            {!IsViewMode && (
                <button onClick={handlePatientTimeEntrySubmit}>Submit</button>
            )}
        </div>

        {gridData.length >= 0 &&
            <ReactGrid columns={PatientTimeColumns} RowData={gridData} />
        }
    
        <ToastAlert Message={toast.message} Type={toast.type} />

    </>
  )
}

export default PatientTimeEntry;










