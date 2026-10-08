import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import ToastAlert from "../../../OtherComponent/ToastContainer/ToastAlert";
import { formatLabel } from "../../../OtherComponent/OtherFunctions";
import "./IP_DischargeStatus_IP_PhysicalDischarge.css";

const IP_DischargeStatus_IP_PhysicalDischarge = () => {


    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const UserData = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector((state) => state.userRecord?.toast);
    const IP_DoctorWorkbenchNavigation = useSelector((state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
    const dispatch = useDispatch();

    const [PhysicalDischarge, setPhysicalDischarge] = useState([]);
    const [DischargeClearance, setDischargeClearance] = useState({});

    const [GetData,setGetData]=useState(false);
    console.log(PhysicalDischarge,'PhysicalDischarge');
    console.log(DischargeClearance,'DischargeClearance--------');
    
    const [PhysicalDischargeChecklist, setPhysicalDischargeChecklist] = useState({
        IDBandOff: false,
        IVCannulaOff: false,
        FoleysCathete: false,
        MedInstruction: false,
        WoundDressing: false,
        DischargeSummary: false,
        AttenderVisitiorPass: false,
        Exitpassgiven: false,
        Remarks:"",
        dateTime:"",
        Createdby:"",

    });


    const handleCheckboxChange = (name, value) => {
       
        console.log(name,'name-----------1111111');
        console.log(value,'value-----------1111111');
        
        
        setPhysicalDischargeChecklist((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    useEffect(() => {
        const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
        const DepartmentType = IP_DoctorWorkbenchNavigation?.RequestType;
    
        axios
          .get(`${UrlLink}Ip_Workbench/IP_PhysicalDischarge_Checklist_Details_Link`, { params: { RegistrationId, DepartmentType } })
          .then((response) => {
            const resData = response.data.PhysicalDischarge_checklist || {};
    
            console.log(resData, 'response.data----111');
            setPhysicalDischarge(resData)
    
            setPhysicalDischargeChecklist({
                IDBandOff: resData.IDBandOff ?? null,
                IVCannulaOff: resData.IVCannulaOff ?? null,
                FoleysCathete: resData.FoleysCathete ?? null,
                MedInstruction: resData.MedInstruction ?? null,
                WoundDressing: resData.WoundDressing ?? null,
                DischargeSummary: resData.DischargeSummary ?? null,
                AttenderVisitiorPass: resData.AttenderVisitiorPass ?? null,
                Exitpassgiven: resData.Exitpassgiven ?? null,
                Remarks: resData.Remarks ?? '',
                dateTime: resData.dateTime ?? '',
                Createdby: resData.Createdby ?? '',
            });
          })
          .catch((e) => console.error(e));
    }, [UrlLink, IP_DoctorWorkbenchNavigation,GetData]);


    useEffect(() => {
        const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
        const DepartmentType = IP_DoctorWorkbenchNavigation?.RequestType;

        if (!RegistrationId) return;

        axios.get(`${UrlLink}Ip_Workbench/IP_DischargeClearance_Details`, { params: { RegistrationId, DepartmentType } })
            .then((res) => {
                console.log(res,'111111111111111111');
                const resData = res.data.DischargeClearance || {};
                setDischargeClearance(resData)
                
            })
            .catch((err) => console.error("Error fetching clearance details:", err));
    }, [UrlLink, IP_DoctorWorkbenchNavigation]);


    const handleSubmit = () => {
        if (!DischargeClearance?.discharge) {
            dispatch({
                type: "toast",
                value: {
                    message: "Discharge clearance is not completed. Please complete all clearance steps before submitting.",
                    type: "error"
                }
            });
            return;
        }

        const postData = {
          ...PhysicalDischargeChecklist,
          RegistrationId: IP_DoctorWorkbenchNavigation?.RegistrationId,
          DepartmentType: IP_DoctorWorkbenchNavigation?.RequestType,
          Createdby: UserData?.username,
        };
        console.log("Submitting:", postData);
        axios
          .post(`${UrlLink}Ip_Workbench/IP_PhysicalDischarge_Checklist_Details_Link`, postData)
          .then((res) => {
            const [type, message] = [Object.keys(res.data)[0], Object.values(res.data)[0]];
            dispatch({ type: "toast", value: { message, type } });
            setGetData(prev => !prev);
        })
          .catch((err) => console.error(err));
    };

    


  return (
    <>
        <br/>
        <div className="DivCenter_container"> Physical Discharge Checklist</div>
    
        <table>
            <tbody>
                {Object.keys(PhysicalDischargeChecklist).map((field, ind) => {
                    let displayLabel = "";

                    // Custom field labels
                    switch (field) {
                        case "IDBandOff":
                            displayLabel = "ID Band Off";
                            break;
                        case "IVCannulaOff":
                            displayLabel = "IV Cannula Off";
                            break;
                        case "FoleysCathete":
                            displayLabel = "Foleys Catheter/ Other Invasive Tubes Removed";
                            break;
                        case "MedInstruction":
                            displayLabel = "Explained About Post Discharge Medicine Instruction";
                            break;
                        case "WoundDressing":
                            displayLabel = "Explained About Post Discharge Wound Dressing";
                            break;
                        case "DischargeSummary":
                            displayLabel = "Discharge Summary & Investigation Reports Handed Over to Patient";
                            break;
                        case "AttenderVisitiorPass":
                            displayLabel = "Attender & Visitor Pass Returned";
                            break;
                        case "Exitpassgiven":
                            displayLabel = "Exit Pass Given";
                            break;
                        case "Createdby":
                            displayLabel = "Checked By";
                            break;
                        case "dateTime":
                            displayLabel = "Date And Time";
                            break;
                        default:
                            displayLabel = formatLabel(field);
                    }

                    return (
                        <tr key={ind} style={{ border: '1px solid black' }}>
                            <td className="checkbox-container-jeeva" style={{ border: '1px solid black' }}>
                                <label htmlFor={`${field}_${ind}`}>{displayLabel}</label>
                            </td>

                            {field === "Remarks" ? (
                                <td className="remarks-container" colSpan="4" style={{ border: '1px solid black' }}>
                                    <textarea
                                        id={`textarea_${field}_${ind}`}
                                        className="remarks-textarea"
                                        value={PhysicalDischargeChecklist[field]}
                                        onChange={(e) => handleCheckboxChange(field, e.target.value)}
                                    />
                                </td>
                            ) : field === "Createdby" || field === "dateTime" ? (
                                <td colSpan="4" style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                    {PhysicalDischargeChecklist[field]}
                                </td>
                            ) : (
                                <>
                                    <td className="checkbox-group-jeeva">
                                        <input
                                            type="radio"
                                            name={field}
                                            checked={PhysicalDischargeChecklist[field] === true}
                                            onChange={() => handleCheckboxChange(field, true)}
                                        />
                                        <label>Yes</label>
                                    </td>

                                    <td className="checkbox-group-jeeva">
                                        <input
                                            type="radio"
                                            name={field}
                                            checked={PhysicalDischargeChecklist[field] === false}
                                            onChange={() => handleCheckboxChange(field, false)}
                                        />
                                        <label>No</label>
                                    </td>

                                    <td className="checkbox-group-jeeva">
                                        <input
                                            type="radio"
                                            name={field}
                                            checked={PhysicalDischargeChecklist[field] === null}
                                            onChange={() => handleCheckboxChange(field, null)}
                                        />
                                        <label>N/A</label>
                                    </td>
                                </>
                            )}
                        </tr>
                    );
                })}
            </tbody>


        </table>



        <button className="submit-button" onClick={handleSubmit} disabled={!DischargeClearance?.discharge}>Submit</button>
        
        <ToastAlert Message={toast.message} Type={toast.type} />

    </>

  )
}

export default IP_DischargeStatus_IP_PhysicalDischarge;