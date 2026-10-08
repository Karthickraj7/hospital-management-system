import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import axios from 'axios';
import { IconButton } from '@mui/material';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import VisibilityIcon from '@mui/icons-material/Visibility';

const MedicalHistory = () => {
    const dispatch = useDispatch();
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    const RadiologyWorkbenchNavigation = useSelector(state => state.Frontoffice?.RadiologyWorkbenchNavigation);
    console.log(RadiologyWorkbenchNavigation, 'RadiologyWorkbenchNavigation');
    const userRecord = useSelector((state) => state.userRecord?.UserData);

    const [PastHistoryform,setPastHistoryform]=useState({
        illnessordiseases:'No',
        illnessordiseasesText:'',
        surgerybefore:'No',
        surgerybeforeText:'',
        pressureorheartdiseases:'No',
        pressureorheartdiseasesText:'',
        allergicmedicine:'No',
        allergicmedicineText:'',
        alreadytakentest:'No',
        Text:'',
        diabetesorAsthmadisease:'No',
        diabetesorAsthmadiseaseText:'',
        localanesthesiabefore:'No',
        localanesthesiabeforeText:'',
        healthproblems:'No',
        healthproblemsText:'',
        regularbasis:'No',
        regularbasisText:'',
        allergicfood:'No',
        allergicfoodText:'',
        // operativeinstuctions:'No',
        // operativeinstuctionsText:'',
        Other:'',
      })
      const [gridData, setGridData] = useState([]);
      const [IsGetData, setIsGetData] = useState(false)
      const [IsViewMode, setIsViewMode] = useState(false)
      const PastHistorycolumns = [
        { key: 'id', name: 'S.No', frozen: true  },
        { key: 'Date', name: 'Date',frozen: true },
        { key: 'Time', name: 'Time', frozen: true},
        { key: 'other', name: 'Other' },
        
        {
          key: 'view',
          name: 'View',
          renderCell: (params) => (
            <IconButton onClick={() => handleView(params.row)}>
              <VisibilityIcon />
            </IconButton>
          ),
        },
      ];
      useEffect(() => {
        const RegistrationId = RadiologyWorkbenchNavigation?.params.RegistrationId;
        const RegisterType = RadiologyWorkbenchNavigation?.params.RegisterType;
        axios.get(`${UrlLink}OP/Radiology_Medical_History_Details`,{
            params: {
                RegistrationId: RegistrationId,
                Registertype: RegisterType,
              },
        })
            .then((res) => {
                const ress = res.data
                console.log("123",ress);
                setGridData(ress);
    
            })
            .catch((err) => {
                console.log(err);
            })
      }, [UrlLink,RadiologyWorkbenchNavigation,IsGetData])
      

      const handelOnchangeform =(e)=>{
        const {name,value}=e.target
    
        setPastHistoryform((pre)=>({
          ...pre,
          [name]:value,
        }))
    
      }
      const handleView = (data) => {
        setPastHistoryform({
            illnessordiseases: data.illnessordiseases || '',
            illnessordiseasesText: data.illnessordiseasesText || '',
            surgerybefore: data.surgerybefore || '',
            surgerybeforeText: data.surgerybeforeText || '',
            pressureorheartdiseases: data.pressureorheartdiseases || '',
            pressureorheartdiseasesText: data.pressureorheartdiseasesText || '',
            // stomachacidityproblem: data.stomachacidityproblem || '',
            // stomachacidityproblemText: data.stomachacidityproblemText || '',
            allergicmedicine: data.allergicmedicine || '',
            allergicmedicineText: data.allergicmedicineText || '',
            // drinkalcohol: data.drinkalcohol || '',
            // drinkalcoholText: data.drinkalcoholText || '',
            alreadytakentest: data.Alreadytakentest || '',
            alreadytakentestText: data.AlreadytakentestText || '',
            diabetesorAsthmadisease: data.diabetesorAsthmadisease || '',
            diabetesorAsthmadiseaseText: data.diabetesorAsthmadiseaseText || '',
            localanesthesiabefore: data.localanesthesiabefore || '',
            localanesthesiabeforeText: data.localanesthesiabeforeText || '',
            healthproblems: data.healthproblems || '',
            healthproblemsText: data.healthproblemsText || '',
            regularbasis: data.regularbasis || '',
            regularbasisText: data.regularbasisText || '',
            allergicfood: data.allergicfood || '',
            allergicfoodText: data.allergicfoodText || '',
            // operativeinstuctions: data.operativeinstuctions || '',
            // operativeinstuctionsText: data.operativeinstuctionsText || '',
            Other: data.other || '',
        });
        setIsViewMode(true);
      };
      const handleClear = () => {
        setPastHistoryform({
            illnessordiseases: '',
            illnessordiseasesText: '',
            surgerybefore: '',
            surgerybeforeText: '',
            pressureorheartdiseases: '',
            pressureorheartdiseasesText: '',
            // stomachacidityproblem: '',
            // stomachacidityproblemText: '',
            allergicmedicine: '',
            allergicmedicineText: '',
            // drinkalcohol: '',
            // drinkalcoholText: '',
            alreadytakentest: '',
            alreadytakentestText: '',
            diabetesorAsthmadisease: '',
            diabetesorAsthmadiseaseText: '',
            localanesthesiabefore: '',
            localanesthesiabeforeText: '',
            healthproblems: '',
            healthproblemsText: '',
            regularbasis: '',
            regularbasisText: '',
            allergicfood: '',
            allergicfoodText: '',
            // operativeinstuctions: '',
            // operativeinstuctionsText: '',
            Other: '',
        });
        setIsViewMode(false);
      };
      const handleSubmit = () => {
        let registrationId = null;
        if (RadiologyWorkbenchNavigation && RadiologyWorkbenchNavigation.params) {
            registrationId = RadiologyWorkbenchNavigation.params.RegistrationId;
          }
        const dataToSend = {
            RegistrationId: registrationId,  
            Registertype: RadiologyWorkbenchNavigation?.params?.RegisterType,
          Created_By: userRecord?.username,
          ...PastHistoryform,
        };
    
        console.log(dataToSend,'dataToSend');
    
        axios.post(`${UrlLink}OP/Radiology_Medical_History_Details`, dataToSend)
          .then((res) => {
            const [type, message] = [Object.keys(res.data)[0], Object.values(res.data)[0]];
            dispatch({ type: 'toast', value: { message, type } });
            setIsGetData(prev =>!prev)
            handleClear();
                       
          })
          .catch((err) => console.log(err));
    
      };

  return (
    <>
    <div className="new-patient-registration-form">
        <div className="new-patient-info-container">
          <div className="new-custom-form-row width_pasthist">
            <label htmlFor="title" className="new-custom-label-title pasthist">
              Do you suffer from any illness or diseases ?
            </label>
            <div style={{display:'flex',gap:"20px"}}>
            <select
              id="Question 1 - cosmetic surgery"
              name="illnessordiseases"
              value={PastHistoryform.illnessordiseases}
              onChange={handelOnchangeform}
              className="new-custom-select-title"
              readOnly={IsViewMode}
              disabled = {IsViewMode}

            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

           
            <textarea
              className="area_pasthistory"
              id="Question 11 - Other"
              name="illnessordiseasesText"
              value={PastHistoryform.illnessordiseasesText}
              onChange={handelOnchangeform}
              disabled={PastHistoryform.illnessordiseases === "No"}
              readOnly={IsViewMode}
            ></textarea>
            </div>
          </div>
          <div className="new-custom-form-row width_pasthist">
            <label htmlFor="title" className="new-custom-label-title pasthist">
              Have you had any surgery before ?
            </label>
            <div style={{display:'flex',gap:"20px"}}>
            <select
              id="Question 2 - previous treatments adverse reaction"
              name="surgerybefore"
              value={PastHistoryform.surgerybefore}
              onChange={handelOnchangeform}
              readOnly={IsViewMode}
              className="new-custom-select-title"
              disabled = {IsViewMode}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <textarea
              className="area_pasthistory"
              id="Question 11 - Other"
              name="surgerybeforeText"
              value={PastHistoryform.surgerybeforeText}
              onChange={handelOnchangeform}
              disabled={PastHistoryform.surgerybefore === "No"}
              readOnly={IsViewMode}
            ></textarea>
            </div>
          </div>
        </div>
        <div className="new-patient-info-container">
          <div className="new-custom-form-row width_pasthist">
            <label htmlFor="title" className="new-custom-label-title pasthist">
              Did you have high blood pressure or heart diseases ?
            </label>
            <div style={{display:'flex',gap:"20px"}}>
            <select
              id="Question 3 - allergies to cosmetic products"
              name="pressureorheartdiseases"
              value={PastHistoryform.pressureorheartdiseases}
              onChange={handelOnchangeform}
              className="new-custom-select-title"
              readOnly={IsViewMode}
              disabled = {IsViewMode}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>

            <textarea
              className="area_pasthistory"
              id="Question 11 - Other"
              name="pressureorheartdiseasesText"
              value={PastHistoryform.pressureorheartdiseasesText}
              onChange={handelOnchangeform}
              disabled={PastHistoryform.pressureorheartdiseases === "No"}
              readOnly={IsViewMode}
            ></textarea>
          </div>
          </div>
          <div className="new-custom-form-row width_pasthist">
            <label htmlFor="title" className="new-custom-label-title pasthist">
              Are you allergic to any medicine ?
            </label>
            <div style={{display:'flex',gap:"20px"}}>
            <select
              id="Question 4 - On medications"
              name="allergicmedicine"
              value={PastHistoryform.allergicmedicine}
              onChange={handelOnchangeform}
              className="new-custom-select-title"
              readOnly={IsViewMode}
              disabled = {IsViewMode}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <textarea
              className="area_pasthistory"
              id="Question 5 - Allergies"
              name="allergicmedicineText"
              value={PastHistoryform.allergicmedicineText}
              onChange={handelOnchangeform}
              disabled={PastHistoryform.allergicmedicine === "No"}
              readOnly={IsViewMode}
            ></textarea>
          </div>
          </div>

          
        </div>
        <div className="new-patient-info-container">
          

         

        </div>
        <div className="new-patient-info-container">
          <div className="new-custom-form-row width_pasthist">
            
            <label htmlFor="title" className="new-custom-label-title pasthist">
           Is Already Taken MRI or CT Scan Taken?
            </label>
            <div style={{display:'flex',gap:"20px"}}>
            <select
              id="Question 6 - Smoking Habits"
              className="new-custom-select-title"
              name="alreadytakentest"
              value={PastHistoryform.alreadytakentest}
              onChange={handelOnchangeform}
              readOnly={IsViewMode}
              disabled = {IsViewMode}
            >
               <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <textarea
              className="area_pasthistory"
              id="Question 5 - Allergies"
              name="alreadytakentestText"
              value={PastHistoryform.alreadytakentestText}
              onChange={handelOnchangeform}
              disabled={PastHistoryform.alreadytakentest === "No"}
              readOnly={IsViewMode}
            ></textarea>
            </div>
          </div>
          <div className="new-custom-form-row width_pasthist">
            <label htmlFor="title" className="new-custom-label-title pasthist">
              Do you have diabetes/Asthma/any other disease ?
            </label>
            <div style={{display:'flex',gap:"20px"}}>
            <select
              id="Question 7 - Alcohol Consumptions"
              className="new-custom-select-title"
              name="diabetesorAsthmadisease"
              value={PastHistoryform.diabetesorAsthmadisease}
              onChange={handelOnchangeform}
              readOnly={IsViewMode}
              disabled = {IsViewMode}
            >
               <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <textarea
              className="area_pasthistory"
              id="Question 5 - Allergies"
              name="diabetesorAsthmadiseaseText"
              value={PastHistoryform.diabetesorAsthmadiseaseText}
              onChange={handelOnchangeform}
              disabled={PastHistoryform.diabetesorAsthmadisease === "No"}
              readOnly={IsViewMode}
            ></textarea>
          </div>
          </div>
        </div>
        <div className="new-patient-info-container">
          <div className="new-custom-form-row width_pasthist">
            <label htmlFor="title" className="new-custom-label-title pasthist">
             Have you had any local anesthesia before ?
            </label>
            <div style={{display:'flex',gap:"20px"}}>
            <select
              id="Question 8 - Pregnant"
              className="new-custom-select-title"
              name="localanesthesiabefore"
              value={PastHistoryform.localanesthesiabefore}
              onChange={handelOnchangeform}
              readOnly={IsViewMode}
              disabled = {IsViewMode}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <textarea
              className="area_pasthistory"
              id="Question 5 - Allergies"
              name="localanesthesiabeforeText"
              value={PastHistoryform.localanesthesiabeforeText}
              onChange={handelOnchangeform}
              disabled={PastHistoryform.localanesthesiabefore === "No"}
              readOnly={IsViewMode}
            ></textarea>
          </div>
          </div>

          <div className="new-custom-form-row width_pasthist">
            <label htmlFor="title" className="new-custom-label-title pasthist">
              Are you in medication for any health problems?
            </label>
            <div style={{display:'flex',gap:"20px"}}>
            <select
              id="Question 9 - breastfeeding"
              className="new-custom-select-title"
              name="healthproblems"
              value={PastHistoryform.healthproblems}
              onChange={handelOnchangeform}
              readOnly={IsViewMode}
              disabled = {IsViewMode}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <textarea
              className="area_pasthistory"
              id="Question 5 - Allergies"
              name="healthproblemsText"
              value={PastHistoryform.healthproblemsText}
              onChange={handelOnchangeform}
              disabled={PastHistoryform.healthproblems === "No"}
              readOnly={IsViewMode}
            ></textarea>
          </div>
          </div>
        </div>
        <div className="new-patient-info-container">
          <div className="new-custom-form-row width_pasthist">
            <label htmlFor="title" className="new-custom-label-title pasthist">
              Do you take any vitamin supplements or aspirin on regular basis ?
            </label>
            <div style={{display:'flex',gap:"20px"}}>
            <select
              id="Question 10 - Skin Type"
              className="new-custom-select-title"
              name="regularbasis"
              value={PastHistoryform.regularbasis}
              onChange={handelOnchangeform}
              readOnly={IsViewMode}
              disabled = {IsViewMode}
            >
               <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <textarea
              className="area_pasthistory"
              id="Question 5 - Allergies"
              name="regularbasisText"
              value={PastHistoryform.regularbasisText}
              onChange={handelOnchangeform}
              disabled={PastHistoryform.regularbasis === "No"}
              readOnly={IsViewMode}
            ></textarea>
          </div>
          </div>

          <div className="new-custom-form-row width_pasthist">
            <label htmlFor="title" className="new-custom-label-title pasthist">
             Are you allergic to any food ? <br/>
             please list all types of allergies if any
            </label>
            <div style={{display:'flex',gap:"20px"}}>
            <select
              id="Question 10 - Skin Type"
              className="new-custom-select-title"
              name="allergicfood"
              value={PastHistoryform.allergicfood}
              onChange={handelOnchangeform}
              readOnly={IsViewMode}
              disabled = {IsViewMode}
            >
              <option value="">Select</option>
              <option value="Yes">Yes</option>
              <option value="No">No</option>
            </select>
            <textarea
              className="area_pasthistory"
              id="Question 11 - Other"
              name="allergicfoodText"
              value={PastHistoryform.allergicfoodText}
              onChange={handelOnchangeform}
              disabled={PastHistoryform.allergicfood === "No"}
              readOnly={IsViewMode}
            ></textarea>
          </div>
          </div>
        </div>
        <div className="new-patient-info-container">
         
          <div className="new-custom-form-row width_pasthist">
            <label htmlFor="title" className="new-custom-label-title pasthist">
              Other
            </label>
            <textarea
              className="area_pasthistory"
              id="Question 11 - Other"
              name="Other"
              value={PastHistoryform.Other}
              onChange={handelOnchangeform}
              readOnly={IsViewMode}
            ></textarea>
          </div>
        </div>
        
        <div className="Main_container_Btn">
            
          {IsViewMode && (
            <button onClick={handleClear}>Clear</button>
          )}
          {!IsViewMode && (
            <button onClick={handleSubmit}>Submit</button>
          )}
        </div>

        {gridData.length > 0 &&
          <ReactGrid columns={PastHistorycolumns} RowData={gridData} />
        }

        <ToastAlert Message={toast.message} Type={toast.type} />


       
      </div>
     
    </>
  )
}

export default MedicalHistory
