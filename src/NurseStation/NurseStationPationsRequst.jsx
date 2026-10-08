import React, { useState } from "react";
import LabRequest from "./LabRequest";
import RadiologyRequest from "./RadiologyRequest";
import DischargeRequest from "./DischargeRequest";
import OtRequest from "./OtRequest";
import DrugRequest from "./DrugRequest";

const NurseStationPationsRequst = () => {
    const [selectedType, setSelectedType] = useState("LabRequest");

    return (
        <>
            <div className="Main_container_app">
                <br />

                <div className="RegisterTypecon navchange">
                    <div className="RegisterType">
                        {[
                            "LabRequest",
                            "RadiologyRequest",
                            "DischargeRequest",
                            "OtRequest",
                            "DrugRequest",
                        ].map((p, ind) => (
                            <div className="registertypeval" key={ind + "key"}>
                                <input
                                    type="radio"
                                    id={p}
                                    name="appointment_type"
                                    checked={selectedType === p}
                                    onChange={() => setSelectedType(p)}
                                    value={p}
                                />
                                <label htmlFor={p}>{p}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <br />

                <div className="content" style={{ width: "100%" }}>
                    {selectedType === "LabRequest" && <LabRequest />}
                    {selectedType === "RadiologyRequest" && <RadiologyRequest />}
                    {selectedType === "DischargeRequest" && <DischargeRequest />}
                    {selectedType === "OtRequest" && <OtRequest />}
                    {selectedType === "DrugRequest" && <DrugRequest />}
                </div>
            </div>
        </>
    );

}
export default NurseStationPationsRequst;