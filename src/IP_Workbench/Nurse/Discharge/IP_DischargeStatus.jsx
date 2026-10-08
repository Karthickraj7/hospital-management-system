import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useEffect, useState } from "react";
import React from "react";
import "./IP_DischargeStatus.css";
import IP_DischargeStatus_DischargeClearance from "./IP_DischargeStatus_DischargeClearance"; // Import the new page
import IP_RoomItemCheclist from "./IP_DischargeStatus_IP_RoomItemChecklist";
import IP_DischargeStatus_IP_DischargeChecklist from "./IP_DischargeStatus_IP_DischargeChecklist";
import IP_DischargeStatus_IP_PhysicalDischarge from "./IP_DischargeStatus_IP_PhysicalDischarge";

const IP_DischargeStatus = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const IP_DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.IP_DoctorWorkbenchNavigation);
    const dispatch = useDispatch();
    const [PatientDischargeData, setPatientDischargeData] = useState([]);
    const [selectedType, setSelectedType] = useState("DischargeClearance");

    const handleSelectChange = (event) => {
        setSelectedType(event.target.value);
    };

    useEffect(() => {
        axios.get(`${UrlLink}Ip_Workbench/IP_DischargeRequest_Details_Link`, {
            params: { RegistrationId: IP_DoctorWorkbenchNavigation?.RegistrationId }
        })
        .then((res) => {
            setPatientDischargeData(res.data);
        })
        .catch((err) => {
            console.log(err);
        });
    }, [UrlLink, IP_DoctorWorkbenchNavigation]);

    return (
        <>
            <div className="Main_container_app">
                <div className="RegisterTypecon navchange">
                    <div className="RegisterType">
                        {["DischargeClearance", "RoomItemChecklist", "DischargeChecklist", "PhysicalDischarge"].map((p, ind) => (
                            <div className="registertypeval" key={ind}>
                                <input
                                    type="radio"
                                    id={p}
                                    name="DischargeStatus"
                                    checked={selectedType === p}
                                    onChange={handleSelectChange}
                                    value={p}
                                />
                                <label htmlFor={p}>{p}</label>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Conditionally render the page based on selection */}
            {selectedType === "DischargeClearance" && <IP_DischargeStatus_DischargeClearance />}
            {selectedType === "RoomItemChecklist" && <IP_RoomItemCheclist />}
            {selectedType === "DischargeChecklist" && <IP_DischargeStatus_IP_DischargeChecklist />}
            {selectedType === "PhysicalDischarge" && <IP_DischargeStatus_IP_PhysicalDischarge />}
        </>
    );
};

export default IP_DischargeStatus;






