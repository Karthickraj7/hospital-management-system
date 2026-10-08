import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import ToastAlert from "../../../OtherComponent/ToastContainer/ToastAlert";
import { formatLabel } from "../../../OtherComponent/OtherFunctions";
import "./IP_DischargeStatus_IP_RoomItemChecklist.css";

const IP_DischargeStatus_IP_DischargeChecklist = () => {


    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const UserData = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector((state) => state.userRecord?.toast);
    const IP_DoctorWorkbenchNavigation = useSelector((state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
    const dispatch = useDispatch();

    const [DischargeChecklistGet, setDischargeChecklistGet] = useState([]);

    const [GetData,setGetData]=useState(false);
    console.log(DischargeChecklistGet,'DischargeChecklistGet');
    
    const [DischargeChecklist, setDischargeChecklist] = useState({
        DischargeClearanceDone: false,
        RoomItemsChecked: false,
        DrugReturned: false,
        NursingClearanceDone: false,
        Remarks:"",
        dateTime:"",
        Createdby:"",

    });


    const handleCheckboxChange = (name, value) => {
       
        console.log(name,'name-----------1111111');
        console.log(value,'value-----------1111111');
        
        
        setDischargeChecklist((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    useEffect(() => {
        const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
        const DepartmentType = IP_DoctorWorkbenchNavigation?.RequestType;
    
        axios
          .get(`${UrlLink}Ip_Workbench/IP_Discharge_Checklist_Details_Link`, { params: { RegistrationId, DepartmentType } })
          .then((response) => {
            const resData = response.data.Discharge_checklist || {};
    
            console.log(resData, 'response.data----111');
            setDischargeChecklistGet(resData)
    
            setDischargeChecklist({
                DischargeClearanceDone: resData.DischargeClearanceDone ?? null,
                RoomItemsChecked: resData.RoomItemsChecked ?? null,
                DrugReturned: resData.DrugReturned ?? null,
                NursingClearanceDone: resData.NursingClearanceDone ?? null,
                Remarks: resData.Remarks ?? '',
                dateTime: resData.dateTime ?? '',
                Createdby: resData.Createdby ?? '',
            });
          })
          .catch((e) => console.error(e));
    }, [UrlLink, IP_DoctorWorkbenchNavigation,GetData]);


    const handleSubmit = () => {
        const postData = {
          ...DischargeChecklist,
          RegistrationId: IP_DoctorWorkbenchNavigation?.RegistrationId,
          DepartmentType: IP_DoctorWorkbenchNavigation?.RequestType,
          Createdby: UserData?.username,
        };
        console.log("Submitting:", postData);
        axios
          .post(`${UrlLink}Ip_Workbench/IP_Discharge_Checklist_Details_Link`, postData)
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
        <div className="DivCenter_container"> Discharge Checklist</div>
    
        <table>
            <tbody>
                {Object.keys(DischargeChecklist).map((field, ind) => {
                    let displayLabel = formatLabel(field);

                    // Change label names for specific fields
                    if (field === "Createdby") {
                        displayLabel = "CheckedBy";
                    } else if (field === "dateTime") {
                        displayLabel = "Date And Time";
                    }

                    return (
                        <tr key={ind} style={{ border: '1px solid black' }}>
                            {/* Label for the item (e.g., MedicineTray) */}
                            <td className="checkbox-container-jeeva" style={{ border: '1px solid black' }}>
                                <label htmlFor={`${field}_${ind}`}>{displayLabel}</label>
                            </td>

                            {/* Special case: Remarks (Textarea) */}
                            {field === "Remarks" ? (
                                <td className="remarks-container" colSpan="4" style={{ border: '1px solid black' }}>
                                    <textarea
                                        id={`textarea_${field}_${ind}`}
                                        className="remarks-textarea"
                                        value={DischargeChecklist[field]}
                                        onChange={(e) => handleCheckboxChange(field, e.target.value)}
                                    />
                                </td>
                            ) : field === "Createdby" || field === "dateTime" ? (
                                // Display Createdby (CheckedBy) and dateTime (Date And Time) as simple text
                                <td colSpan="4" style={{ border: '1px solid black', textAlign: 'center', padding: '5px' }}>
                                    {DischargeChecklist[field]}
                                </td>
                            ) : (
                                <>
                                    {/* Yes (True) Checkbox */}
                                    <td className="checkbox-group-jeeva">
                                        <input
                                            type="radio"
                                            name={field}
                                            checked={DischargeChecklist[field] === true}
                                            onChange={() => handleCheckboxChange(field, true)}
                                        />
                                        <label>Yes</label>
                                    </td>

                                    {/* No (False) Checkbox */}
                                    <td className="checkbox-group-jeeva">
                                        <input
                                            type="radio"
                                            name={field}
                                            checked={DischargeChecklist[field] === false}
                                            onChange={() => handleCheckboxChange(field, false)}
                                        />
                                        <label>No</label>
                                    </td>

                                    {/* N/A (Null) Checkbox */}
                                    <td className="checkbox-group-jeeva">
                                        <input
                                            type="radio"
                                            name={field}
                                            checked={DischargeChecklist[field] === null}
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



        <button className="submit-button" onClick={handleSubmit}>Submit</button>
        
        <ToastAlert Message={toast.message} Type={toast.type} />

    </>

  )
}

export default IP_DischargeStatus_IP_DischargeChecklist;