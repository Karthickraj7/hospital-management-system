import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import axios from 'axios';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useNavigate } from 'react-router-dom';
import '../Nurse/jeeva.css';



const IP_DocMlc = () => {
    const dispatch = useDispatch();
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
    console.log(IP_DoctorWorkbenchNavigation,'IP_DoctorWorkbenchNavigation');
    const navigate = useNavigate();

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

    const [Mlc,setMlc] = useState({
      MlcNo: "",
      ExaminationDate: "",
      ExaminationTime: "",
      ExaminationBy: "",
      IdentificationMarkOne: "",
      IdentificationMarkTwo: "",
      InformedBroughtBy: "",
      EventPlace: "",
      EventLocation: "",
      InjuryType: "",
      InjuryDetails: "",
      PoliceStationName: "",
      FirStatus: "",
      FirNo: "",
      MlcSendTime: "",
      MlcCopyReceiveTime: "",
      ReceivedBy: "",
      Narration: "",
      Investigation: "",
      InvestigationDetails: "",
      FinalDiagnosis: "",
      Type: "",
      Remarks: "",
      
    })

    
    const [gridData, setGridData] = useState([])
    const [IsGetData, setIsGetData] = useState(false)

    const [IsViewMode, setIsViewMode] = useState(false)
  

    const MlcColumns = [
        {
            key: 'id',
            name: 'S.No',
            frozen: true
        },
        // { key: 'VisitId', name: 'VisitId',frozen: true },
        { key: 'PrimaryDoctorName', name: 'Doctor Name',frozen: true },
      
        {
            key: 'Date',
            name: 'Date',
            frozen: true
        },
        {
            key: 'Time',
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

        {
          key: 'form',
          frozen: true,
          name: 'Form',
          renderCell: (params) => (
            <IconButton onClick={() => handleFormView(params.row)}>
              <VisibilityIcon />
            </IconButton>
          ),
        },
        
    ]


    const handleView = (data) => {
      setMlc({
          MlcNo: data.MlcNo || '',
          ExaminationDate: data.ExaminationDate || '',
          ExaminationTime: data.ExaminationTime || '',
          ExaminationBy: data.ExaminationBy || '',
          IdentificationMarkOne: data.IdentificationMarkOne || '',
          IdentificationMarkTwo: data.IdentificationMarkTwo || '',
          InformedBroughtBy: data.InformedBroughtBy || '',
          EventPlace: data.EventPlace || '',
          EventLocation: data.EventLocation || '',
          InjuryType: data.InjuryType || '',
          InjuryDetails: data.InjuryDetails || '',
          PoliceStationName: data.PoliceStationName || '',
          FirStatus: data.FirStatus || '',
          FirNo: data.FirNo || '',
          MlcSendTime: data.MlcSendTime || '',
          MlcCopyReceiveTime: data.MlcCopyReceiveTime || '',
          ReceivedBy: data.ReceivedBy || '',
          Narration: data.Narration || '',
          Investigation: data.Investigation || '',
          FinalDiagnosis: data.FinalDiagnosis || '',
          Remarks: data.Remarks || '',
          Type: data.Type || ''
      });
      setIsViewMode(true);
    };

    const handleFormView = (row) => {
      navigate('/Home/MlcRegisterForm', { state: { rowData: row } });
    };
    
    const handleClear = () => {
      setMlc({
        MlcNo: "",
        ExaminationDate: "",
        ExaminationTime: "",
        ExaminationBy: "",
        IdentificationMarkOne: "",
        IdentificationMarkTwo: "",
        InformedBroughtBy: "",
        EventPlace: "",
        EventLocation: "",
        InjuryType: "",
        InjuryDetails: "",
        PoliceStationName: "",
        FirStatus: "",
        FirNo: "",
        MlcSendTime: "",
        MlcCopyReceiveTime: "",
        ReceivedBy: "",
        Narration: "",
        Investigation: "",
        FinalDiagnosis: "",
        Remarks: "",
        Type: ""
    });
        setIsViewMode(false);
    };

    
    useEffect(() => {

      const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
      const departmentType = IP_DoctorWorkbenchNavigation?.RequestType;

      
      if (RegistrationId) {
        axios.get(`${UrlLink}Ip_Workbench/IP_Mlc_Details_Link`,{
          params:{
            RegistrationId: RegistrationId,
            DepartmentType: departmentType,
            

          }})
            .then((res) => {
                const ress = res.data
                console.log(ress)
                setGridData(ress)
    
            })
            .catch((err) => {
                console.log(err);
            })
      }
    }, [UrlLink,IP_DoctorWorkbenchNavigation,IsGetData])
  
    

    const handleMlcChange = (e) => {
        const { name, value } = e.target;
        setMlc(prev => ({
          ...prev,
          [name]: value
        }));

        if (
            name === "IdentificationMarkOne" ||
            name === "IdentificationMarkTwo" ||
          
            name === "InjuryDetails" ||
            name === "Narration" ||
            name === "InvestigationDetails" ||
    
            name === "FinalDiagnosis" ||
    
            name === "Remarks" 
           
    
        ) {
            adjustHeight(e);  // Call adjustHeight for all textareas
        }
      };

      const adjustHeight = (e) => {
        e.target.style.height = "auto"; // Reset height to calculate scrollHeight
        e.target.style.height = `${e.target.scrollHeight}px`; // Set height to scrollHeight
      };

    //   const handleSubmit = () => {
        
    //     console.log(IP_DoctorWorkbenchNavigation?.RegistrationId);
        
    //     const senddata={
    //         ...Mlc,
    //         RegistrationId:IP_DoctorWorkbenchNavigation?.RegistrationId,
    //         Createdby:userRecord?.username,
    //         // Type:'Nurse'
            
    //     }

    //     console.log(senddata,'senddata');
        
    //     axios.post(`${UrlLink}Ip_Workbench/IP_Mlc_Details_Link`, senddata)
    //     .then((res) => {
    //         const [type, message] = [Object.keys(res.data)[0], Object.values(res.data)[0]];
    //         dispatch({ type: 'toast', value: { message, type } });
    //         setIsGetData(prev => !prev);
    //         handleClear();
    //         })
    //     .catch((err) => console.log(err));
        
    // }



    const fields = [
      { label: "Mlc No", name: "MlcNo", type: "text" },
      { label: "Examination Date", name: "ExaminationDate", type: "date" },
      { label: "Examination Time", name: "ExaminationTime", type: "time" },
      { label: "Examination By", name: "ExaminationBy", type: "text" },
      { label: "Identification Mark 1", name: "IdentificationMarkOne", type: "textarea" },
      { label: "Identification Mark 2", name: "IdentificationMarkTwo", type: "textarea" },
      { label: "Informed / Brought by", name: "InformedBroughtBy", type: "text" },
      { label: "Event Place", name: "EventPlace", type: "text" },
      { label: "Event Location", name: "EventLocation", type: "text" },
      { label: "Injury Type", name: "InjuryType", type: "text" },
      { label: "Injury Details", name: "InjuryDetails", type: "textarea" },
      { label: "Police Station Name", name: "PoliceStationName", type: "text" },
      { label: "Narration", name: "Narration", type: "textarea" },
      { label: "Received by", name: "ReceivedBy", type: "text" },
      { label: "Final Diagnosis", name: "FinalDiagnosis", type: "textarea" },
      { label: "Remarks", name: "Remarks", type: "textarea" },
    ];



  return (
    <>
      <div className="Main_container_app">
 
       

          <div className="RegisFormcon_1">
            <div className="RegisForm_1">
                <label> Mlc No <span>:</span> </label>
                <input
                    type="text"
                    name='MlcNo'
                    value={Mlc.MlcNo}
                    onChange={handleMlcChange}
                    readOnly={IsViewMode}
                    disabled = {IsViewMode}
                />
            </div>
            <div className="RegisForm_1">
                <label> Examination Date<span>:</span> </label>
                <input
                    type="date"
                    name='ExaminationDate'
                    value={Mlc.ExaminationDate}
                    onChange={handleMlcChange}
                    readOnly={IsViewMode}
                    disabled = {IsViewMode}
                />
            </div>
            <div className="RegisForm_1">
                <label> Examination Time<span>:</span> </label>
                <input
                    type="time"
                    name='ExaminationTime'
                    value={Mlc.ExaminationTime}
                    onChange={handleMlcChange}
                    readOnly={IsViewMode}
                    disabled = {IsViewMode}
                />
            </div>
            <div className="RegisForm_1">
                <label> ExaminationBy<span>:</span> </label>
                <input
                    type="text"
                    name='ExaminationBy'
                    value={Mlc.ExaminationBy}
                    onChange={handleMlcChange}
                    readOnly={IsViewMode}
                    disabled = {IsViewMode}
                />
            </div>
            <div className="RegisForm_1">
                <label> Identification Mark 1<span>:</span> </label>
                <textarea
                    type="text"
                    name='IdentificationMarkOne'
                    value={Mlc.IdentificationMarkOne}
                    onChange={handleMlcChange}
                    readOnly={IsViewMode}
                    disabled = {IsViewMode}
                />
            </div>
            <div className="RegisForm_1">
                <label> Identification Mark 2<span>:</span> </label>
                <textarea
                    type="text"
                    name='IdentificationMarkTwo'
                    value={Mlc.IdentificationMarkTwo}
                    onChange={handleMlcChange}
                    readOnly={IsViewMode}
                    disabled = {IsViewMode}
                />
            </div>
            <div className="RegisForm_1">
                <label> Informed / Brought by<span>:</span> </label>
                <input
                    type="text"
                    name='InformedBroughtBy'
                    value={Mlc.InformedBroughtBy}
                    onChange={handleMlcChange}
                    readOnly={IsViewMode}
                    disabled = {IsViewMode}
                />
            </div>
            <div className="RegisForm_1">
                <label> Event Place<span>:</span> </label>
                <input
                    type="text"
                    name='EventPlace'
                    value={Mlc.EventPlace}
                    onChange={handleMlcChange}
                    readOnly={IsViewMode}
                    disabled = {IsViewMode}
                />
            </div>
            <div className="RegisForm_1">
                <label> Event Location<span>:</span> </label>
                <input
                    type="text"
                    name='EventLocation'
                    value={Mlc.EventLocation}
                    onChange={handleMlcChange}
                    readOnly={IsViewMode}
                    disabled = {IsViewMode}
                />
            </div>
            <div className="RegisForm_1">
                <label> Injury Type<span>:</span> </label>
                <input
                    type="text"
                    name='InjuryType'
                    value={Mlc.InjuryType}
                    onChange={handleMlcChange}
                    readOnly={IsViewMode}
                    disabled = {IsViewMode}
                />
            </div>
            <div className="RegisForm_text">
                <label> Injury Details<span>:</span> </label>
                <textarea
                    type="text"
                    name='InjuryDetails'
                    value={Mlc.InjuryDetails}
                    readOnly={IsViewMode}
                    disabled = {IsViewMode}
                    onChange={handleMlcChange}
                />
            </div>
            <div className="RegisForm_1">
                <label> Police Station Name<span>:</span> </label>
                <input
                    type="text"
                    name='PoliceStationName'
                    value={Mlc.PoliceStationName}
                    onChange={handleMlcChange}
                    readOnly={IsViewMode}
                    disabled = {IsViewMode}
                />
            </div>
            <div   className="RegisForm_1" >
              <label>Fir Statuss<span>:</span></label>



              <div
            style={{
                display: "flex",
              justifyContent: "flex-start",
              width: "120px",
              gap: '10px',
            }}
          >
            <label style={{width:'auto'}}>
              <input
                  type='radio'
                  name='FirStatus'
                  value='Yes'
                  style={{ width: "15px"}}

                  checked={Mlc.FirStatus === 'Yes'}
                  onChange={handleMlcChange}
                  readOnly={IsViewMode}
                  disabled={IsViewMode}
              />
              Yes</label>


              <label style={{width:'auto'}}>
              <input
                  type='radio'
                  name='FirStatus'
                  value='No'
                  style={{ width: "15px"}}

                  checked={Mlc.FirStatus === 'No'}
                  onChange={handleMlcChange}
                  readOnly={IsViewMode}
                  disabled={IsViewMode}
              />
              No </label>
           </div>

           
            </div>
          
            <div className="RegisForm_1">
                <label>Fir No<span>:</span></label>
                <input
                    type="text"
                    name="FirNo"
                    value={Mlc.FirNo}
                    readOnly={IsViewMode}
                    disabled={IsViewMode || Mlc.FirStatus !== 'Yes'}
                    onChange={handleMlcChange}
                />
            </div>
            
            <div className="RegisForm_1">
                <label> MlcSend Time<span>:</span> </label>
                <input
                    type="time"
                    name='MlcSendTime'
                    value={Mlc.MlcSendTime}
                    onChange={handleMlcChange}
                    readOnly={IsViewMode}
                    disabled = {IsViewMode}
                />
            </div>
            <div className="RegisForm_1">
                <label> MlcCopyReceive Time<span>:</span> </label>
                <input
                    type="time"
                    name='MlcCopyReceiveTime'
                    value={Mlc.MlcCopyReceiveTime}
                    onChange={handleMlcChange}
                    readOnly={IsViewMode}
                    disabled = {IsViewMode}
                />
            </div>
            <div className="RegisForm_1">
                <label> Received by<span>:</span> </label>
                <input
                    type="text"
                    name='ReceivedBy'
                    value={Mlc.ReceivedBy}
                    onChange={handleMlcChange}
                    readOnly={IsViewMode}
                    disabled = {IsViewMode}
                />
            </div>
            <div className="RegisForm_text ">
                <label> Narration<span>:</span> </label>
                <textarea
                    type="text"
                    name='Narration'
                    value={Mlc.Narration}
                    readOnly={IsViewMode}
                    disabled = {IsViewMode}
                    onChange={handleMlcChange}
                />
            </div>




            <div   className="RegisForm_1" >
              <label>Investigation<span>:</span></label>


<div  style={{
                display: "flex",
              justifyContent: "flex-start",
              width: "120px",
              gap: '5px',
            }}>

<label style={{width:'auto'}}>
              <input
                  type='radio'
                  name='Investigation'
                  value='Yes'
                  style={{ width: "15px"}}

                  checked={Mlc.Investigation === 'Yes'}
                  onChange={handleMlcChange}
                  readOnly={IsViewMode}
                  disabled={IsViewMode}
              />
              Yes</label>  {/* 'htmlFor' is not necessary with <span> */}


              <label style={{width:'auto'}}>
              <input
                  type='radio'
                  name='Investigation'
                  value='No'
                  style={{ width: "15px"}}

                  checked={Mlc.Investigation === 'No'}
                  onChange={handleMlcChange}
                  readOnly={IsViewMode}
                  disabled={IsViewMode}
              />
              No</label> 
              </div> {/* 'htmlFor' is not necessary with <span> */}
            </div>
            
            <div className="RegisForm_text">
                <label>Investigation Details<span>:</span></label>
                <textarea
                   
                    name="InvestigationDetails"
                    value={Mlc.InvestigationDetails}
                    readOnly={IsViewMode}
                    disabled={IsViewMode || Mlc.Investigation !== 'Yes'}
                    onChange={handleMlcChange}
                />
            </div>
          
            <div className="RegisForm_1">
              <label>FinalDiagnosis<span>:</span></label>
              <textarea
                 
                  name="FinalDiagnosis"
                  value={Mlc.FinalDiagnosis}
                  readOnly={IsViewMode}
                  disabled={IsViewMode}
                  onChange={handleMlcChange}
              />
          </div>
          <div className="RegisForm_1">
            <label htmlFor="Type">Type <span>:</span></label>
            <select
              id="Type"
              name="Type"
              onChange={handleMlcChange}
              value={Mlc.Type}
              required
              readOnly={IsViewMode}
              disabled = {IsViewMode}
            >
              <option value="online" readOnly={IsViewMode}>Online</option>
              <option value="driver" readOnly={IsViewMode}>Driver</option>
            </select>
          </div>
          <div className="RegisForm_text">
              <label>Remarks<span>:</span></label>
              <textarea
                  type="text"
                  name="Remarks"
                  value={Mlc.Remarks}
                  readOnly={IsViewMode}
                  disabled={IsViewMode}
                  onChange={handleMlcChange}
              />
          </div>
          

        </div>


        



            
         
        

        <div className="Main_container_Btn">
                
            {IsViewMode && (
                <button onClick={handleClear}>Clear</button>
            )}
            {/* {!IsViewMode && (
                <button onClick={handleSubmit}>Submit</button>
            )} */}
        </div>

        {gridData.length >= 0 &&
            <ReactGrid columns={MlcColumns} RowData={gridData} />
        }

        <ToastAlert Message={toast.message} Type={toast.type} />

      </div>
      
      
    </>

  )
}

export default IP_DocMlc;