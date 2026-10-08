import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';

const AdmissionPurpose = ({onAdmissionSubmitSuccess}) => {

    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector((state) => state.userRecord?.toast);
    const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
    const dispatch = useDispatch();

    const [AdmissionDetails, setAdmissionDetails] = useState({
        AdmissionPurpose:'',
        Remarks:'',
    })

    const [GetAdmissionDetails, setGetAdmissionDetails] = useState([]);
    const [IsGetData, setIsGetData] = useState(false);
    
    useEffect(() => {
        const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;

        axios.get(`${UrlLink}Frontoffice/IP_Patient_Admission_Purpose_Details_Link`, {
            params: { RegistrationId }
        })
        .then((res) => {
            setGetAdmissionDetails(res.data);
        })
        .catch((err) => {
            console.error('Error fetching admission details:', err);
        });
    }, [IsGetData,UrlLink, IP_DoctorWorkbenchNavigation?.RegistrationId]);


    const AdmissionColumns = [
        {key: 'id', name: ''},
        {key: 'AdmissionPurpose', name: 'AdmissionPurpose'},
        // {key: 'Remarks', name: 'Remarks'},
        { key: 'FromDate', name: ' From Date'},
        { key: 'ToDate', name: ' To Date'},
    ]

    const handleClear = () => {
        setAdmissionDetails({
            AdmissionPurpose:"",
            Remarks:"",
        })
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        console.log(name,value,'name,vlaue');
        
        setAdmissionDetails((prev) => ({
            ...prev,
            [name]: value,
        }));
    }

    const handleSubmit = () => {

        const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;

        const sendData = {
            // ...AdmissionDetails,
            AdmissionPurpose:AdmissionDetails.AdmissionPurpose,
            Remarks:AdmissionDetails.Remarks,
            RegistrationId: IP_DoctorWorkbenchNavigation?.RegistrationId,
            CreatedBy: userRecord?.username,
        };

        console.log(sendData,'sendData');
        

        axios.post(`${UrlLink}Frontoffice/IP_Patient_Admission_Purpose_Details_Link`, sendData)
            .then((res) => {
                const data = res?.data;
                if (data) {
                    const [type, message] = [Object.keys(data)[0], Object.values(data)[0]];
                    dispatch({ type: 'toast', value: { message, type } });
                    
                    axios.get(`${UrlLink}Frontoffice/IP_Patient_Admission_Purpose_Details_Link`, {
                        params: { RegistrationId }
                    })
                    .then((res) => {
                        if(Array.isArray(res.data)){
                        // setGetAdmissionDetails(res.data);
                        onAdmissionSubmitSuccess?.(res.data);
                        }
                        
                    })
                    
                    setIsGetData(prev => !prev);
                    handleClear();
                } else {
                    console.error("Empty response data");
                }
            })
            .catch((err) => {
                console.log(err);
                dispatch({ type: 'toast', value: { message: 'Failed to save admission purpose', type: 'error' } });
            });
    };




  return (
    <>
        <div className="RegisFormcon_1">
            <div className="RegisFormcon">
                <div className="RegisForm_1">
                    <label>Admission Purpose <span>:</span></label>
                    <select 
                        name="AdmissionPurpose" 
                        value={AdmissionDetails.AdmissionPurpose}
                        onChange={handleInputChange}
                    >
                        <option value="">Select</option>
                        <option value="Medical-Management">Medical-Management</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Day-Care">Day-Care</option>
                    </select>
                </div>
                
            </div>

            {/* <div className="RegisFormcon extend_textarea_new">
                <div className="RegisForm_1 extend_textarea_new">
                    <label>
                        Reason <span>:</span>
                    </label>
                    <textarea
                        name="Remarks"
                        value={AdmissionDetails.Remarks}
                        onChange={handleInputChange}
                        
                    />
                </div>
            </div> */}

            <div className="Main_container_Btn">
                {<button onClick={handleSubmit}>Submit</button>}
            </div>

            <ReactGrid columns={AdmissionColumns} RowData={GetAdmissionDetails} />
                
            <ToastAlert Message={toast.message} Type={toast.type} />

            
        </div>
    </>
  )
}

export default AdmissionPurpose;