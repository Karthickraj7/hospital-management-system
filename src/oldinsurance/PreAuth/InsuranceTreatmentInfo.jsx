import * as React from "react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function InsuranceTreatmentInfo() {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const [SpecialityData, setSpecialityData] = useState([]);
    const [DoctorDetailsData, setDoctorDetailsData] = useState([]);
    const [IcdCodeData, setIcdCodeData] = useState([]);
    const [generalEvaluationData, setGeneralEvaluationData] = useState([]);

    const [ServiceProcedureData, setServiceProcedureData] = useState([]);

    const dispatchvalue = useDispatch();
    const isSidebarOpen = useSelector((state) => state.userRecord?.isSidebarOpen);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const InsuranceUpdatedata = {};
    // const InsurancePatientDetailes = useSelector((state) => state.Insurancedata?.InsurancePatientDetailes);
    const InsurancePatientDetails = useSelector(
        (state) => state.Insurancedata?.InsurancePatientDetailes
    );
    console.log('InsurancePatientDetails:', InsurancePatientDetails);


    const [rows3, setRows3] = useState([
        {
            department: "", // Stores specialty ID
            treatingDoctor: "",
            contactNumber3: "",
            registrationNumber: "",
            medicalCouncil: "",
        },
    ]);
    const [checkboxStateTreatment, setCheckboxStateTreatment] = useState({
        icuManagement: false,
        dialysis: false,
        chemotherapy: false,
        radiation: false,
    });
    const [medicalManagement, setMedicalManagement] = useState("No");
    const [TreatmentTxtareaDetails, setTreatmentTxtareaDetails] = useState("");
    const [rows4, setRows4] = useState([
        {
            treatment: "",
            pcsHospitalCode: "",
        },
    ]);
    const [surgicalManagement, setSurgicalManagement] = useState("No");
    const [additionalSurgicalOptions, setAdditionalSurgicalOptions] = useState([]);

    // -----------------------------------------------------------

    const addRow3 = () => {
        setRows3([
            ...rows3,
            {
                department: "",
                treatingDoctor: "",
                contactNumber3: "",
                registrationNumber: "",
                medicalCouncil: "",
            },
        ]);
    };

    useEffect(() => {
        fetchSpecialityList();
    }, []);

    const fetchSpecialityList = async () => {
        try {
            const res = await axios.get(`${UrlLink}Masters/Speciality_Detials_link`);
            console.log("specialties", res.data);
            setSpecialityData(res.data);
        } catch (err) {
            console.error("Error fetching specialties:", err);
        }
    };



    const fetchSurgeonsForOption = async (specialtyId, index) => {
        if (!specialtyId || !SpecialityData.length) {
            updateSurgeonsForOption(index, []);
            return;
        }

        const specialty = SpecialityData.find(spec => spec.Speciality_Id == specialtyId);
        if (!specialty) {
            updateSurgeonsForOption(index, []);
            return;
        }

        try {
            const response = await axios.get(`${UrlLink}Masters/get_Doctor_Detials_link`);
            const allDoctors = response.data;

            const normalize = (str) =>
                (str || "").toLowerCase().trim().replace(/\s+/g, " ");

            const filtered = allDoctors.filter(doctor => {
                const isSurgeon = ["JUNIORSURGEON", "SENIORSURGEON"].includes(doctor.Designation);
                const specMatch = normalize(doctor.Specialization) === normalize(specialty.SpecialityName);
                return isSurgeon && specMatch;
            });

            updateSurgeonsForOption(index, filtered);
        } catch (error) {
            console.error("Error fetching surgeons:", error);
            updateSurgeonsForOption(index, []);
        }
    };

    const updateSurgeonsForOption = (index, surgeons) => {
        setAdditionalSurgicalOptions(prev => {
            const updated = [...prev];
            updated[index] = { ...updated[index], surgeons };
            return updated;
        });
    };

    const handleChangeRow3 = async (index, key, value) => {
        const newRows = [...rows3];
        newRows[index][key] = value;

        if (key === "department" && value) {
            console.log("Selected Specialty ID:", value);
            console.log("Current SpecialityData:", SpecialityData);
            const selectedSpecialty = SpecialityData.find((spec) => spec.Speciality_Id == value);
            console.log("Selected Specialty Object:", selectedSpecialty);

            const selectedSpecialtyName = selectedSpecialty ? selectedSpecialty.SpecialityName : null;
            console.log("Selected Specialty Name:", selectedSpecialtyName);

            if (selectedSpecialtyName) {
                try {
                    const response = await axios.get(`${UrlLink}Masters/get_Doctor_Detials_link`);
                    const allDoctors = response.data;
                    console.log("All Doctors:", allDoctors);

                    const normalizeString = (str) =>
                        (str || "")
                            .trim()
                            .toLowerCase()
                            .replace(/\s+/g, " ")
                            .replace(/[^a-z0-9\s]/g, "");

                    const filteredDoctors = allDoctors.filter((doc) => {
                        const specialtyNormalized = normalizeString(selectedSpecialtyName);
                        const doctorSpecialization = normalizeString(doc.Specialization || "");
                        console.log(
                            `Comparing: ${specialtyNormalized} (Specialty) vs ${doctorSpecialization} (Doctor)`
                        );
                        return specialtyNormalized === doctorSpecialization;
                    });

                    console.log("Filtered Doctors:", filteredDoctors);
                    setDoctorDetailsData(filteredDoctors);

                    if (filteredDoctors.length === 0) {
                        console.warn(`No doctors found for specialty: ${selectedSpecialtyName}`);
                        console.log(
                            "All Doctor Specializations:",
                            allDoctors.map((doc) => doc.Specialization)
                        );
                    }
                } catch (err) {
                    console.error("Error fetching doctors:", err);
                    setDoctorDetailsData([]);
                }
            } else {
                console.warn("No specialty name found for ID:", value);
                setDoctorDetailsData([]);
            }
        }

        if (key === "treatingDoctor" && value) {
            try {
                const response = await axios.get(`${UrlLink}Masters/get_Doctor_Detials_link`, {
                    params: { DoctorId: value },
                });
                const doctorData = response.data.find((doc) => doc.id === value);

                if (doctorData) {
                    newRows[index].contactNumber3 = doctorData.ContactNumber || "";
                    newRows[index].registrationNumber = doctorData.State_RegistrationNumber || "";
                    newRows[index].medicalCouncil = doctorData.MCI_Number || "";
                } else {
                    newRows[index].contactNumber3 = "";
                    newRows[index].registrationNumber = "";
                    newRows[index].medicalCouncil = "";
                }
            } catch (err) {
                console.error("Error fetching doctor details:", err);
                newRows[index].contactNumber3 = "";
                newRows[index].registrationNumber = "";
                newRows[index].medicalCouncil = "";
            }
        }

        setRows3(newRows);
    };
    const removeRow3 = (index) => {
        const newRows = [...rows3];
        newRows.splice(index, 1);
        setRows3(newRows);
    };

    const handleCheckboxChangeTreatment = (event) => {
        const { name, checked } = event.target;
        setCheckboxStateTreatment({ ...checkboxStateTreatment, [name]: checked });
    };

    const handleCheckboxChangeMedical = (event) => {
        setMedicalManagement(event.target.value);
    };

    const handleTextAreaChangeDetails = (event) => {
        setTreatmentTxtareaDetails(event.target.value);
    };

    const addRow4 = () => {
        setRows4([
            ...rows4,
            {
                treatment: "",
                pcsHospitalCode: "",
            },
        ]);
    };

    const handleChangeRow4 = (index, key, value) => {
        const newRows = [...rows4];
        newRows[index][key] = value;
        setRows4(newRows);
    };

    const removeRow4 = (index) => {
        const newRows = [...rows4];
        newRows.splice(index, 1);
        setRows4(newRows);
    };

    const handleCheckboxChangeSurgical = (event) => {
        setSurgicalManagement(event.target.value);
    };

    const addAdditionalSurgicalOption = () => {
        setAdditionalSurgicalOptions((prevOptions) => [
            ...prevOptions,
            {
                departmentSurgical: "",
                surgeonSurgical: "",
                CheckboxStates: {
                    laAnesthesia: false,
                    raAnesthesia: false,
                    saAnesthesia: false,
                    eaAnesthesia: false,
                    gaAnesthesia: false,
                },
                Type: "elective",
                procedureTables: [],
                surgeons: [],
            },
        ]);
    };

    const removeAdditionalSurgicalOption = () => {
        if (additionalSurgicalOptions.length > 0) {
            const updatedOptions = [...additionalSurgicalOptions];
            updatedOptions.pop();
            setAdditionalSurgicalOptions(updatedOptions);
        }
    };

    const addRow5 = (tableIndex) => {
        setAdditionalSurgicalOptions((prev) => {
            let updated = [...prev];
            let newrow = updated[tableIndex]["procedureTables"];
            newrow = [
                ...updated[tableIndex]["procedureTables"],
                {
                    procedureSurgical: "",
                    pcdHospitalCodeSurgical: "",
                },
            ];
            updated[tableIndex]["procedureTables"] = newrow;
            return updated;
        });
    };

    const removeRow5 = (tableIndex, rowIndex) => {
        setAdditionalSurgicalOptions((prev) => {
            let updated = [...prev];
            let newrow = [...updated[tableIndex]["procedureTables"]];
            newrow.splice(rowIndex, 1);
            updated[tableIndex]["procedureTables"] = newrow;
            return updated;
        });
    };

    const SavebtnFun = () => {
        const params = {
            MRN: InsurancePatientDetails.RegistrationId,
            ContactNumber: InsurancePatientDetails.PhoneNo,
            Location: userRecord.location || "",
            createAt: userRecord.username || "",
            rows3: rows3,
            checkboxStateTreatment: checkboxStateTreatment,
            medicalManagement: medicalManagement,
            TreatmentTxtareaDetails: TreatmentTxtareaDetails,
            rows4: rows4,
            surgicalManagement: surgicalManagement,
            additionalSurgicalOptions: additionalSurgicalOptions,
            MainPageCompleted: "MainPage1",
            PageCompleted: "BillingInfo",
        };
        axios
            .post(`${UrlLink}Insurance/Pre_Auth_Treatment_info`, params)
            .then((response) => {
                console.log("Form data submitted.", response.data);
                dispatchvalue({
                    type: 'toast',
                    value: { message: 'Treatment Info details saved successfully', type: 'success' },
                });
                dispatchvalue({ type: "InsurancePageChange", value: "BillingInfo" });
            })
            .catch((error) => {
                console.error(error);
            });
    };

    useEffect(() => {
        if (InsurancePatientDetails?.RegistrationId) {
            console.log('Fetching data for MRN:', InsurancePatientDetails.RegistrationId);
            const params = {
                MRN: InsurancePatientDetails.RegistrationId
            };

            axios.get(`${UrlLink}Insurance/Pre_Auth_Treatment_info`, {
                params: params
            })
                .then((response) => {
                    console.log('GET response:', response.data);
                    const data = response.data;
                    if (data && Object.keys(data).length !== 0) {
                        if (data.rows3 && data.rows3.length > 0) {
                            setRows3(data.rows3);
                        }
                        if (data.checkboxStateTreatment) {
                            setCheckboxStateTreatment({
                                icuManagement: data.checkboxStateTreatment.icuManagement || false,
                                dialysis: data.checkboxStateTreatment.dialysis || false,
                                chemotherapy: data.checkboxStateTreatment.chemotherapy || false,
                                radiation: data.checkboxStateTreatment.radiation || false,
                            });
                        }
                        setMedicalManagement(data.medicalManagement || 'No');
                        setSurgicalManagement(data.surgicalManagement || 'No');
                        setTreatmentTxtareaDetails(data.TreatmentTxtareaDetails || '');
                        if (data.rows4 && data.rows4.length > 0) {
                            setRows4(data.rows4);
                        }
                        if (data.surgical_management && data.surgical_management.length > 0) {
                            setAdditionalSurgicalOptions(data.surgical_management);
                        }
                    }
                })
                .catch((error) => {
                    console.error("Error fetching treatment info:", error.response || error.message);
                });
        }
    }, [UrlLink, InsurancePatientDetails?.RegistrationId]);

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const response = await axios.get(
                    `${UrlLink}Insurance/FetchProcedureDetails`,
                    { params: { MasterType: "Procedure" } }
                );
                console.log("FetchProcedureDetails Response:", response);
                console.log("FetchProcedureDetails Data:", response.data);

                if (Array.isArray(response.data) && response.data.length > 0) {
                    if ('procedure_name' in response.data[0]) {
                        console.log("Procedure Names:", response.data.map(item => item.procedure_name));
                        setServiceProcedureData(response.data);
                    } else {
                        console.warn("procedure_name key missing in response data");
                        setServiceProcedureData([]);
                    }
                } else {
                    console.warn("No procedure data received or data is not an array");
                    setServiceProcedureData([]);
                }
            } catch (error) {
                console.error("Error fetching procedures:", error.response || error.message);
                setServiceProcedureData([]);
            }
        };

        fetchdata();
    }, [UrlLink]);

    useEffect(() => {
        axios
            .get(`${UrlLink}Workbench/Workbench_GeneralEvaluation_Details`, {
                params: {
                    RegistrationId: InsurancePatientDetails?.RegistrationId,
                },
            })
            .then((res) => {
                const formattedData = res.data.map((item, index) => ({
                    ...item,
                    id: index + 1,
                    KeyComplaint: item.KeyComplaint?.name || '',
                    cheifComplaint: Array.isArray(item.cheifComplaint)
                        ? item.cheifComplaint.map((c) => c.ChiefComplaintName).join(', ')
                        : '',
                    History: Array.isArray(item.History)
                        ? item.History.map((h) => h.HistoryName).join(', ')
                        : '',
                    Examine: Array.isArray(item.Examine)
                        ? item.Examine.map((e) => e.ExaminationName).join(', ')
                        : '',
                }));

                setGeneralEvaluationData(formattedData);

                const icdCodes = formattedData
                    .filter((item) => item.SearchICDCode)
                    .map((item) => ({
                        id: item.id,
                        icd_code: item.SearchICDCode || 'N/A',
                        description: item.SearchDescription || 'No description',
                    }));
                setIcdCodeData(icdCodes);

                const detailsText = formattedData
                    .map((item) => {
                        return `Treatment ${item.id}:\n` +
                            `Key Complaint: ${item.KeyComplaint}\n` +
                            `Chief Complaint: ${item.cheifComplaint}\n` +
                            `History: ${item.History}\n` +
                            `Examination: ${item.Examine}\n` +
                            `Diagnosis: ${item.Diagnosis}\n` +
                            `ICD Code: ${item.SearchICDCode || 'N/A'}\n` +
                            `Description: ${item.SearchDescription || 'N/A'}\n` +
                            `Disease Details: ${item.DiseaseDetails.map((d) =>
                                `${d.DiseaseName} (Chronic: ${d.IsChronicle}, Communicable: ${d.IsCommunicable})`
                            ).join(', ')}\n` +
                            `Date: ${item.Date} | Time: ${item.Time}\n` +
                            `-----------------------------------`;
                    })
                    .join('\n');

                setTreatmentTxtareaDetails(detailsText);

                const treatmentRows = formattedData.map((item) => ({
                    treatment: `Treatment ${item.id}: ${item.Diagnosis}`,
                    pcsHospitalCode: item.SearchICDCode || '',
                }));

                setRows4(treatmentRows);
            })
            .catch((err) => {
                console.log("Error fetching GeneralEvaluation:", err);
                setIcdCodeData([]);
            });
    }, [UrlLink, InsurancePatientDetails]);


    return (
        <>
            <div className="Supplier_Master_Container">
                <>
                    <div className="Selected-table-container">
                        <table className="selected-medicine-table2 _hide_hover_table">
                            <thead className="Spl_backcolr_09">
                                <tr>
                                    <th className="Provisional_Diagnosis">Specialty</th>
                                    <th className="ICD_Code">Treating Doctor</th>
                                    <th className="ICD_Code">Contact Number</th>
                                    <th className="ICD_Code">Registration Number</th>
                                    <th className="ICD_Code">Medical Council</th>
                                    <th className="add32_Code">
                                        <span onClick={addRow3}>
                                            <AddIcon className="add32_Code" />
                                        </span>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {rows3.map((row, index) => (
                                    <tr key={index}>
                                        <td>
                                            <select
                                                className="department_tretmt"
                                                value={row.department}
                                                onChange={(e) => handleChangeRow3(index, "department", e.target.value)}
                                            >
                                                <option value="">Select</option>
                                                {SpecialityData.map((specialty, ind) => (
                                                    <option key={ind} value={specialty.Speciality_Id}>
                                                        {specialty.SpecialityName}
                                                    </option>
                                                ))}
                                            </select>
                                        </td>
                                        <td>
                                            <select
                                                className="department_tretmt_with"
                                                value={row.treatingDoctor}
                                                onChange={(e) =>
                                                    handleChangeRow3(index, "treatingDoctor", e.target.value)
                                                }
                                            >
                                                <option value="">Select</option>
                                                {DoctorDetailsData.length > 0 ? (
                                                    DoctorDetailsData.map((doctor, ind) => (
                                                        <option key={ind} value={doctor.id}>
                                                            {doctor.Name}
                                                        </option>
                                                    ))
                                                ) : (
                                                    <option value="" disabled>
                                                        No doctors available
                                                    </option>
                                                )}
                                            </select>
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="ICD_Code"
                                                value={row.contactNumber3}
                                                onChange={(e) =>
                                                    handleChangeRow3(index, "contactNumber3", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="number"
                                                className="ICD_Code"
                                                value={row.registrationNumber}
                                                onChange={(e) =>
                                                    handleChangeRow3(index, "registrationNumber", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="ICD_Code"
                                                value={row.medicalCouncil}
                                                onChange={(e) =>
                                                    handleChangeRow3(index, "medicalCouncil", e.target.value)
                                                }
                                            />
                                        </td>
                                        <td className="add32_Code">
                                            <span onClick={() => removeRow3(index)}>
                                                <RemoveIcon className="add32_Code" />
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <br />

                    <div className="RegisFormcon column_regisFormcon_forinsurance Spl_backcolr_09">
                        <div className="RegisForm_1 column_RegisForm_1_forinsurance Spl_backcolr_09_bottom">
                            <label className="fe_l5f">
                                Medical Management <span>:</span>
                            </label>
                            <div className="ewj_i87_head">
                                <div className="ewj_i87">
                                    <input
                                        type="radio"
                                        id="medicalManagementYes"
                                        name="medicalManagement"
                                        value="Yes"
                                        checked={medicalManagement === "Yes"}
                                        onChange={handleCheckboxChangeMedical}
                                    />
                                    <label htmlFor="medicalManagementYes">Yes</label>
                                </div>
                                <div className="ewj_i87">
                                    <input
                                        type="radio"
                                        id="medicalManagementNo"
                                        name="medicalManagement"
                                        value="No"
                                        checked={medicalManagement === "No"}
                                        onChange={handleCheckboxChangeMedical}
                                    />
                                    <label htmlFor="medicalManagementNo">No</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {medicalManagement === "Yes" && (
                        <>
                            <div className="txtars3_wit_hdj">
                                <label>Details</label>
                                <textarea
                                    name="details"
                                    placeholder="Enter Details"
                                    value={TreatmentTxtareaDetails}
                                    onChange={handleTextAreaChangeDetails}
                                ></textarea>
                            </div>
                            <div className="Selected-table-container">
                                <table className="selected-medicine-table2 _hide_hover_table">
                                    <thead className="Spl_backcolr_09">
                                        <tr>
                                            <th className="Provisional_Diagnosis">Treatment</th>
                                            <th className="ICD_Code">ICD 10 PCS/Hospital Code</th>
                                            <th className="add32_Code">
                                                <span onClick={addRow4}>
                                                    <AddIcon className="add32_Code" />
                                                </span>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rows4.map((row, index) => (
                                            <tr key={index}>
                                                <td>
                                                    <input
                                                        className="Provisional_Diagnosis"
                                                        value={row.treatment}
                                                        onChange={(e) =>
                                                            handleChangeRow4(index, "treatment", e.target.value)
                                                        }
                                                        placeholder="Enter Treatment"
                                                    />
                                                </td>
                                                <td>
                                                    <input
                                                        className="ICD_Code"
                                                        value={row.pcsHospitalCode}
                                                        onChange={(e) =>
                                                            handleChangeRow4(index, "pcsHospitalCode", e.target.value)
                                                        }
                                                        placeholder="Enter ICD Code"
                                                    />
                                                </td>
                                                <td className="add32_Code">
                                                    <span onClick={() => removeRow4(index)}>
                                                        <RemoveIcon className="add32_Code" />
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}
                    <br />
                    <div className="RegisFormcon column_regisFormcon_forinsurance Spl_backcolr_09">
                        <div className="RegisForm_1 column_RegisForm_1_forinsurance Spl_backcolr_09_bottom">
                            <label className="fe_l5f">
                                Surgical Management <span>:</span>
                            </label>
                            <div className="ewj_i87_head">
                                <div className="ewj_i87">
                                    <input
                                        type="radio"
                                        id="surgicalManagementYes"
                                        name="surgicalManagement"
                                        value="Yes"
                                        checked={surgicalManagement === "Yes"}
                                        onChange={handleCheckboxChangeSurgical}
                                    />
                                    <label htmlFor="surgicalManagementYes">Yes</label>
                                </div>
                                <div className="ewj_i87">
                                    <input
                                        type="radio"
                                        id="surgicalManagementNo"
                                        name="surgicalManagement"
                                        value="No"
                                        checked={surgicalManagement === "No"}
                                        onChange={handleCheckboxChangeSurgical}
                                    />
                                    <label htmlFor="surgicalManagementNo">No</label>
                                </div>
                            </div>
                        </div>
                    </div>
                    {surgicalManagement === "Yes" &&
                        additionalSurgicalOptions.map((option, index) => (
                            <div key={index}>
                                <div className="surgical_flex_srtgt">
                                    <div className="RegisForm_1 column_RegisForm_1_forinsurance surgical_flex_srtgt_div">
                                        <label>
                                            Specialty <span>:</span>{" "}
                                        </label>
                                        <select
                                            value={option.departmentSurgical}
                                            onChange={(e) => {
                                                const newValue = e.target.value;
                                                setAdditionalSurgicalOptions(prev => {
                                                    const updated = [...prev];
                                                    updated[index] = {
                                                        ...updated[index],
                                                        departmentSurgical: newValue,
                                                        surgeonSurgical: ""
                                                    };
                                                    return updated;
                                                });
                                                fetchSurgeonsForOption(newValue, index);
                                            }}
                                        >
                                            <option value="">Select</option>
                                            {SpecialityData.map((specialty, ind) => (
                                                <option key={ind} value={specialty.Speciality_Id}>
                                                    {specialty.SpecialityName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="RegisForm_1 column_RegisForm_1_forinsurance surgical_flex_srtgt_div">
                                        <label>
                                            Surgeon <span>:</span>{" "}
                                        </label>
                                        <select
                                            className="department_tretmt"
                                            name="surgeonSurgical"
                                            value={option.surgeonSurgical}
                                            onChange={(e) =>
                                                setAdditionalSurgicalOptions((prev) => {
                                                    let updated = [...prev];
                                                    let newrow = updated[index];
                                                    newrow["surgeonSurgical"] = e.target.value;
                                                    updated[index] = newrow;
                                                    return updated;
                                                })
                                            }
                                        >
                                            <option value="">Select</option>
                                            {option.surgeons.map(surgeon => (
                                                <option key={surgeon.id} value={surgeon.id}>
                                                    {surgeon.Name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="div_ckkkbox_head dwcw3wd">
                                        <div className="RegisForm_1 column_RegisForm_1_forinsurance surgical_flex_srtgt_div efws">
                                            <label style={{ width: "280px", padding: "5px" }}>
                                                Type of Anesthesia <span>:</span>{" "}
                                            </label>
                                        </div>
                                        <div className="jkdll_piss_head">
                                            {Object.keys(option.CheckboxStates).map((ppp, indx) => (
                                                <div className="jkdll_piss" key={indx}>
                                                    <label className="checkbox-label">
                                                        <input
                                                            type="checkbox"
                                                            className="checkbox-input"
                                                            name={ppp}
                                                            checked={option.CheckboxStates[ppp]}
                                                            onChange={(e) => {
                                                                setAdditionalSurgicalOptions((prev) => {
                                                                    let updated = [...prev];
                                                                    let newrow = updated[index];
                                                                    newrow["CheckboxStates"][ppp] = e.target.checked;
                                                                    updated[index] = newrow;
                                                                    return updated;
                                                                });
                                                            }}
                                                        />
                                                        {ppp === "laAnesthesia"
                                                            ? "PRO"
                                                            : ppp === "raAnesthesia"
                                                                ? "MDZ"
                                                                : ppp === "saAnesthesia"
                                                                    ? "FEN"
                                                                    : ppp === "eaAnesthesia"
                                                                        ? "SEV"
                                                                        : "KET"}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="RegisFormcon column_regisFormcon_forinsurance Spl_backcolr_09">
                                    <div className="RegisForm_1 column_RegisForm_1_forinsurance Spl_backcolr_09_bottom">
                                        <label>
                                            Type <span>:</span>
                                        </label>
                                        <div className="ewj_i87_head">
                                            <div className="ewj_i87 ewj_i87_secd">
                                                <input
                                                    type="radio"
                                                    name={option["Type"]}
                                                    value="emergency"
                                                    checked={option["Type"] === "emergency"}
                                                    onChange={(e) =>
                                                        setAdditionalSurgicalOptions((prev) => {
                                                            let updated = [...prev];
                                                            let newrow = updated[index];
                                                            newrow["Type"] = e.target.value;
                                                            updated[index] = newrow;
                                                            return updated;
                                                        })
                                                    }
                                                />
                                                <label htmlFor={`emergencyYes${index}`}>Emergency</label>
                                            </div>
                                            <div className="ewj_i87 ewj_i87_secd">
                                                <input
                                                    type="radio"
                                                    name={option["Type"]}
                                                    value="elective"
                                                    checked={option["Type"] === "elective"}
                                                    onChange={(e) =>
                                                        setAdditionalSurgicalOptions((prev) => {
                                                            let updated = [...prev];
                                                            let newrow = updated[index];
                                                            newrow["Type"] = e.target.value;
                                                            updated[index] = newrow;
                                                            return updated;
                                                        })
                                                    }
                                                />
                                                <label htmlFor={`electiveYes${index}`}>Elective</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="Selected-table-container">
                                    <table className="selected-medicine-table2 _hide_hover_table">
                                        <thead className="Spl_backcolr_09">
                                            <tr>
                                                <th className="Provisional_Diagnosis">Procedure</th>
                                                <th className="ICD_Code">ICD 10 PCS / Hospital Code</th>
                                                <th className="add32_Code">
                                                    <span onClick={() => addRow5(index)}>
                                                        <AddIcon className="add32_Code" />
                                                    </span>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {option?.procedureTables &&
                                                option.procedureTables.map((row, rowIndex) => (
                                                    <tr key={rowIndex}>
                                                        <td>
                                                            <input
                                                                className="Provisional_Diagnosis"
                                                                value={row.procedureSurgical}
                                                                list={`procedureOptions${index}${rowIndex}`}
                                                                onChange={(e) =>
                                                                    setAdditionalSurgicalOptions((prev) => {
                                                                        let updated = [...prev];
                                                                        let newrow = updated[index];
                                                                        newrow["procedureTables"][rowIndex]["procedureSurgical"] =
                                                                            e.target.value;
                                                                        updated[index] = newrow;
                                                                        return updated;
                                                                    })
                                                                }
                                                                onClick={() =>
                                                                    console.log(
                                                                        "Input clicked, Datalist ID:",
                                                                        `procedureOptions${index}${rowIndex}`
                                                                    )
                                                                }
                                                                placeholder="Type to see options"
                                                            />
                                                            <datalist id={`procedureOptions${index}${rowIndex}`}>
                                                                {ServiceProcedureData.length > 0 ? (
                                                                    ServiceProcedureData.map((procedure) => (
                                                                        <option key={procedure.id} value={procedure.procedure_name}>
                                                                            {procedure.procedure_name}
                                                                        </option>
                                                                    ))
                                                                ) : (
                                                                    <option value="" disabled>No procedures available</option>
                                                                )}
                                                            </datalist>
                                                        </td>
                                                        <td>
                                                            <input
                                                                className="ICD_Code"
                                                                value={row.pcdHospitalCodeSurgical}
                                                                list={`icdCodeOptions${index}${rowIndex}`}
                                                                onChange={(e) =>
                                                                    setAdditionalSurgicalOptions((prev) => {
                                                                        let updated = [...prev];
                                                                        let newrow = updated[index];
                                                                        newrow["procedureTables"][rowIndex]["pcdHospitalCodeSurgical"] =
                                                                            e.target.value;
                                                                        updated[index] = newrow;
                                                                        return updated;
                                                                    })
                                                                }
                                                                placeholder="Type to see ICD codes"
                                                            />
                                                            <datalist id={`icdCodeOptions${index}${rowIndex}`}>
                                                                {IcdCodeData.length > 0 ? (
                                                                    IcdCodeData.map((icd) => (
                                                                        <option key={icd.id} value={icd.icd_code}>
                                                                            {icd.icd_code} - {icd.description}
                                                                        </option>
                                                                    ))
                                                                ) : (
                                                                    <option value="" disabled>No ICD codes available</option>
                                                                )}
                                                            </datalist>
                                                        </td>
                                                        <td className="add32_Code">
                                                            <span onClick={() => removeRow5(index, rowIndex)}>
                                                                <RemoveIcon className="add32_Code" />
                                                            </span>
                                                        </td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))}

                    {surgicalManagement === "Yes" && (
                        <>
                            <br />
                            <div className="SUGCL_AD_PO0">
                                <div className="add32_Code_POK8" onClick={addAdditionalSurgicalOption}>
                                    <AddIcon />
                                </div>
                                {additionalSurgicalOptions.length > 0 && (
                                    <div className="add32_Code_POK8" onClick={removeAdditionalSurgicalOption}>
                                        <RemoveIcon />
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </>
            </div>
            <div className="submit_button_prev_next">
                <button onClick={SavebtnFun}>Save</button>
            </div>
        </>
    );
}





