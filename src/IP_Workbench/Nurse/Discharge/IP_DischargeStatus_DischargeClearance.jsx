import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import ToastAlert from "../../../OtherComponent/ToastContainer/ToastAlert";
import React from "react";
import "./IP_DischargeStatus.css";
import { format } from "date-fns";






const IP_DischargeStatus_DischargeClearance = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector((state) => state.userRecord?.toast);
    const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
    const dispatch = useDispatch();
    const [PatientDischargeData, setPatientDischargeData] = useState([])
    const [DischargeSummary,setDischargeSummary]=useState({discharge: false})
    const [dateTime, setDateTime] = useState("");
    const [VerifiedBy, setVerifiedBy] = useState("");
    console.log(userRecord,'userRecord');
    console.log(IP_DoctorWorkbenchNavigation,'IP_DoctorWorkbenchNavigation');
    const [IsGetData, setIsGetData] = useState(false);
    

        
    useEffect(() => {
        axios.get(`${UrlLink}Ip_Workbench/get_discharge_request_Using_IP_Registration_details`,{params:{RegistrationId:IP_DoctorWorkbenchNavigation?.RegistrationId}})
            .then((res) => {
                const ress = res.data;
                console.log(ress,'resssss');
                setPatientDischargeData(ress);
               
            })
            .catch((err) => {
                console.log(err);
            });
    }, [UrlLink,IP_DoctorWorkbenchNavigation]);



    // useEffect(() => {
    //     const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    //     const DepartmentType = IP_DoctorWorkbenchNavigation?.RequestType;

    //     if (!RegistrationId) return;

    //     axios.get(`${UrlLink}Ip_Workbench/IP_DischargeClearance_Details`, {
    //         params: { RegistrationId, DepartmentType }
    //     })
    //     .then((res) => {
    //         const resss = res.data;  // ✅ Correctly assign the response data
    //         console.log(resss,'ressssssssssssssss');  // ✅ Log the response
    //         setDischargeSummary(resss);  // ✅ Update state
    //         setDateTime(resss.dateTime || ""); 
    //         setVerifiedBy(resss.VerifiedBy || "");
    //     })
        
    //     .catch((err) => console.error("Error fetching clearance details:", err));
    // }, [UrlLink, IP_DoctorWorkbenchNavigation, IsGetData]);


    // const handleCheckboxChange = (name, value) => {
    //     const now = new Date();
    //     const formattedDateTime = format(now, "dd-MM-yy hh:mm a"); // Formats to "24-02-25 05:40 PM"
    
    //     setDischargeSummary((prevState) => ({
    //         ...prevState,
    //         [name]: value,
    //     }));
    
    //     if (value === "Yes") {
    //         setDateTime(formattedDateTime);
    //         setVerifiedBy(userRecord?.username);
    //     } else {
    //         setDateTime("");
    //         setVerifiedBy("");
    //     }


    //     const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
    //     const DepartmentType = IP_DoctorWorkbenchNavigation?.RequestType;

    //     if (!RegistrationId) {
    //       dispatch({ type: 'toast', value: { message: 'Registration ID is missing', type: 'error' } });
    //       return;
    //     }
    //     console.log(IP_DoctorWorkbenchNavigation?.RegistrationId);
        
    //     const senddata={
    //         DischargeSummary,
    //         dateTime,
    //         VerifiedBy,
    //         RegistrationId,
    //         DepartmentType,
    //         Createdby:userRecord?.username,
           
    //     }

    //     console.log(senddata,'senddata');
        
    //     axios.post(`${UrlLink}Ip_Workbench/IP_DischargeClearance_Details`, senddata)
    //     .then((res) => {
    //         const [type, message] = [Object.keys(res.data)[0], Object.values(res.data)[0]];
    //         dispatch({ type: 'toast', value: { message, type } });
    //         setIsGetData(prev => !prev);
    //         })
    //     .catch((err) => console.log(err));

    // };


    useEffect(() => {
        const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
        const DepartmentType = IP_DoctorWorkbenchNavigation?.RequestType;

        if (!RegistrationId) return;

        axios.get(`${UrlLink}Ip_Workbench/IP_DischargeClearance_Details`, { params: { RegistrationId, DepartmentType } })
            .then((res) => {
                console.log(res,'111111111111111111');
                
                const resData = res.data.DischargeClearance || {};
                setDischargeSummary({ discharge: resData.discharge });
                setDateTime(resData.dateTime || "");
                setVerifiedBy(resData.VerifiedBy || "");
            })
            .catch((err) => console.error("Error fetching clearance details:", err));
    }, [UrlLink, IP_DoctorWorkbenchNavigation,IsGetData]);

    const isAllClearanceCompleted = () => {
        if (PatientDischargeData.length === 0) return false;
        
        const latestData = PatientDischargeData[PatientDischargeData.length - 1];

        return (
            // latestData.LabStatus === "Completed" &&
            // latestData.RadiologyStatus === "Completed" &&
            latestData.BillingStatus === "Completed"
        );
    };


    const handleCheckboxChange = (name, value) => {
        
        if (!isAllClearanceCompleted()) {
            dispatch({ type: "toast", value: { message: "Please ensure Billing Dues are 'Completed'", type: "warn" } });
            return;
        }

        const now = new Date();
        const formattedDateTime = format(now, "yyyy-MM-dd HH:mm:ss"); 
    
        // Ensure valid Registration ID before API call
        const RegistrationId = IP_DoctorWorkbenchNavigation?.RegistrationId;
        const DepartmentType = IP_DoctorWorkbenchNavigation?.RequestType;
    
        if (!RegistrationId) {
            dispatch({ type: "toast", value: { message: "Registration ID is missing", type: "error" } });
            return;
        }
    
        // Convert "Yes" → true, "No" → false
        const isChecked = value === true;
    
        const senddata = {
            discharge: isChecked, 
            dateTime: isChecked ? formattedDateTime : "", 
            VerifiedBy: isChecked ? userRecord?.username : "",
            RegistrationId,
            DepartmentType,
            Createdby: userRecord?.username
        };
    
        console.log("Sending Data:", senddata);
    
        // Send API Request
        axios.post(`${UrlLink}Ip_Workbench/IP_DischargeClearance_Details`, senddata)
            .then((res) => {
                const [type, message] = [Object.keys(res.data)[0], Object.values(res.data)[0]];
                dispatch({ type: "toast", value: { message, type } });
                setIsGetData((prev) => !prev);
    
                // ✅ Fetch updated data after successful submission
                // axios.get(`${UrlLink}Ip_Workbench/IP_DischargeClearance_Details`, { params: { RegistrationId, DepartmentType } })
                //     .then((res) => {
                //         const dataaaa=Object.keys( res.data)
                //         console.log(dataaaa,'dataaaa');
                        
                //         setDischargeSummary(
                //         {
                //             discharge:dataaaa
                //         }); 
                //         setDateTime(dataaaa.dateTime || ""); 
                //         setVerifiedBy(dataaaa.VerifiedBy || "");
                //     })
                //     .catch((err) => console.error("Error fetching updated clearance details:", err));
            })
            .catch((err) => console.error("API Error:", err));
    };
    
    
   
  return (
    
    <div className="overflow-x-auto p-4 bg-white shadow-lg rounded-lg">
    <div className="Selected-table-container">
    <table className="selected-medicine-table2">     
               <thead className="bg-blue-600 text-white">
            <tr>
                <th className="px-6 py-3 text-left uppercase tracking-wider">Category</th>
                <th className="px-6 py-3 text-left uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left uppercase tracking-wider">Date & Time</th>
                <th className="px-6 py-3 text-left uppercase tracking-wider">Checked By</th>
            </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 text-gray-700">
            {PatientDischargeData.map((patient, index) => (
                <>
                    <tr key={`lab-${index}`} className="hover:bg-gray-100">
                        <td className="px-6 py-4 font-semibold">Lab</td>
                        <td className="px-6 py-4">{patient.LabStatus || ""}</td>
                        <td className="px-6 py-4">
                        {patient.CurrLabDate ? `${patient.CurrLabDate} ${patient.CurrLabTime || ""}` : "N/A"}
                        </td>
                        <td className="px-6 py-4">{patient.LabStatusCheckedBy || ""}</td>
                    </tr>
                    <tr key={`radiology-${index}`} className="hover:bg-gray-100">
                        <td className="px-6 py-4 font-semibold">Radiology</td>
                        <td className="px-6 py-4">{patient.RadiologyStatus || ""}</td>
                        <td className="px-6 py-4">
                        {patient.CurrRadiologyDate ? `${patient.CurrRadiologyDate} ${patient.CurrRadiologyTime || ""}` : "N/A"}
                        </td>
                        <td className="px-6 py-4">{patient.RadiologyStatusCheckedBy || ""}</td>
                    </tr>
                    <tr key={`billing-${index}`} className="hover:bg-gray-100">
                        <td className="px-6 py-4 font-semibold">Billing</td>
                        <td className="px-6 py-4">{patient.BillingStatus || ""}</td>
                        <td className="px-6 py-4">
                        {patient.CurrBillingDate ? `${patient.CurrBillingDate} ${patient.CurrBillingTime || ""}` : "N/A"}
                        </td>
                        <td className="px-6 py-4">{patient.BillingStatusCheckedBy || ""}</td>
                    </tr>
                    <tr key={`Pharmacy-${index}`} className="hover:bg-gray-100">
                        <td className="px-6 py-4 font-semibold">Pharmacy</td>
                        <td className="px-6 py-4">{patient.PharmacyStatus || ""}</td>
                        <td className="px-6 py-4">
                        {patient.CurrPharmacyDate ? `${patient.CurrPharmacyDate} ${patient.CurrPharmacyTime || ""}` : "N/A"}
                        </td>
                        <td className="px-6 py-4">{patient.PharmacyStatusCheckedBy || ""}</td>
                    </tr>


                    <tr key={`discharge-${index}`} className="hover:bg-gray-100">
                        <td className="px-6 py-4 font-semibold">Discharge Summary</td>

                        {/* ✅ Yes/No Checkboxes */}
                        <td className="checkbox-container" style={{display:'flex',gap:'10px', alignItems:'center'

                        }}>
                            <div className="checkbox-group" style={{display:'flex',gap:'3px', alignItems:'center'

}}>
                                <input
                                    type="checkbox"
                                    name="discharge"
                                    checked={DischargeSummary.discharge === true} // Check if true
                                    onChange={() => handleCheckboxChange("discharge", true)} // Send boolean true
                                />
                                <label>Yes</label>
                            </div>

                            <div className="checkbox-group">
                                <input
                                    type="checkbox"
                                    name="discharge"
                                    checked={DischargeSummary.discharge === false} // Check if false
                                    onChange={() => handleCheckboxChange("discharge", false)} // Send boolean false
                                />
                                <label>No</label>
                            </div>
                        </td>

                        {/* ✅ Show Date & Time only if discharge is true */}
                        <td>{DischargeSummary.discharge === true ? dateTime : ""}</td>

                        {/* ✅ Show Username only if discharge is true */}
                        <td>{DischargeSummary.discharge === true ? VerifiedBy : ""}</td>
                    </tr>






                </>
            ))}
            </tbody>
        </table>
</div>
        <ToastAlert Message={toast.message} Type={toast.type} />

    </div>

  )
}

export default IP_DischargeStatus_DischargeClearance;

















