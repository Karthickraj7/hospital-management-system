import React, { useState, useEffect } from "react";
import "./Sixdoctor.css";
import { useDispatch, useSelector } from "react-redux";
import ForwardIcon from "@mui/icons-material/Forward";
import axios from "axios";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import SixdoctorContext from "./SixdoctorContext";
import { useNavigate } from "react-router-dom";
const Sixdoctor = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const toast = useSelector((state) => state.userRecord?.toast);
    // const [contextMenu, setContextMenu] = useState(null);
    const dispatchvalue = useDispatch();
    const navigate = useNavigate();

    const [IsPatientStatusGet, setIsPatientStatusGet] = useState(false);

    const [selectedPatient, setSelectedPatient] = useState(null);

    const [OpDoctors, setOpDoctors] = useState({
        inhouse_doctors: [],
        visiting_doctors: [],
    });

    const [OpPatients, setOpPatients] = useState({});
    console.log("OpPatients",OpPatients);

    const [allDoctors, setAllDoctors] = useState([]);
    console.log("allDoctors",allDoctors);
    useEffect(() => {
        axios
            .get(`${UrlLink}Masters/OpDoctor_Details_link`)
            .then((response) => {
                setOpDoctors({
                    inhouse_doctors: Array.isArray(response.data.inhouse_doctors) ? response.data.inhouse_doctors : [],
                    visiting_doctors: Array.isArray(response.data.visiting_doctors) ? response.data.visiting_doctors : [],
                });
                const allDoctors = [
                    ...(Array.isArray(response.data.inhouse_doctors) ? response.data.inhouse_doctors : []),
                    ...(Array.isArray(response.data.visiting_doctors) ? response.data.visiting_doctors : []),
                ];
                setAllDoctors(allDoctors);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [UrlLink, IsPatientStatusGet]);

    useEffect(() => {
        if (allDoctors.length > 0) {
            const doctorIds = allDoctors.map((doctor) => doctor.Doctor_ID);

            axios
                .get(`${UrlLink}Masters/OpPatients_Details_link`, {
                    params: {
                        doctorIds: doctorIds.join(","), // Sending doctor IDs as a comma-separated string
                    },
                })
                .then((response) => {
                    if (response.data && typeof response.data === "object") {
                        setOpPatients({
                            doctor_patient_totals: response.data.doctor_patient_totals || {},
                            patients_details: Array.isArray(response.data.patients_details) ? response.data.patients_details : [],
                        });
                    } else {
                        console.log("Unexpected response format:", response.data);
                    }
                })
                .catch((err) => {
                    console.log("Error fetching patient details:", err);
                });
        }
    }, [UrlLink, allDoctors, IsPatientStatusGet]);

    // const handleStatusChange = (newPatientId, VisitId, registrationId, newStatus) => {

 
    const handleStatusChange = (newPatientId, VisitId, registrationId, newStatus) => {
        if (newPatientId && VisitId && registrationId && newStatus) {
            // Update patient status locally before API call
            setOpPatients((prevPatients) => ({
                ...prevPatients,
                patients_details: prevPatients.patients_details.map((patient) =>
                    patient.PatientId === newPatientId
                        ? { ...patient, Status: newStatus }
                        : patient
                ),
            }));
    
            // API request to update status
            axios
                .post(`${UrlLink}Masters/StatusUpdate_Details_Patient`, {
                    newPatientId,
                    VisitId,
                    newStatus,
                    registrationId, // Fixed incorrect casing
                })
                .then((res) => {
                    const resData = res.data;
                    const responseType = Object.keys(resData)[0];
                    const message = Object.values(resData)[0];
    
                    const toastData = {
                        message: message,
                        type: responseType,
                    };
                    dispatchvalue({ type: "toast", value: toastData });
    
                    // Trigger a state refresh after update
                    setIsPatientStatusGet((prev) => !prev);
                })
                .catch((err) => {
                    console.error("Error updating patient status:", err);
                });
        }
    }

    // const handleRightClick = (event, patient) => {
    //     event.preventDefault();
    //     setSelectedPatient(patient);
    //     setContextMenu({
    //         x: event.clientX,
    //         y: event.clientY,
    //     });
    // };
    // const handleCloseContextMenu = () => {
    //     setContextMenu(null);
    // };
    // const handleSelectStatus = (newStatus) => {
    //     if (selectedPatient && selectedPatient.PatientId) {
    //         console.log("Selected Patient:", selectedPatient);
    //         handleStatusChange(
    //             selectedPatient.PatientId,
    //             selectedPatient.VisitId,
    //             selectedPatient.Registration_Id,
    //             newStatus
    //         );
    //         // setContextMenu(null);
    //     }
    // };
    const handlePatientDetailsClick = (doctorId, status) => {

        const url = status
            ? `${UrlLink}Masters/Status_Patient_Details_link`
            : `${UrlLink}Masters/Separated_Patient_Details_link`;

        axios
            .get(url, {
                params: { DoctorId: doctorId, ...(status && { Status: status }) },
            })
            .then((response) => {
                const patientDetails = response.data.patients_details;

                setOpPatients((prev) => {
                    const updatedPatients = prev.patients_details.filter(
                        (patient) => patient.PrimaryDoctor !== doctorId
                    );

                    const newPatientsDetails = [...updatedPatients, ...patientDetails];

                    return {
                        ...prev,
                        patients_details: newPatientsDetails,
                    };
                });
            })
            .catch((err) => {
                console.log("Error fetching patient details:", err);
            });
    };

    const handlePatientDetailsVisitClick = (doctorId, VisitPurpose) => {
        console.log("visit details clicked", doctorId, VisitPurpose);

        const url = VisitPurpose
            ? `${UrlLink}Masters/VisitPurpose_Patient_Details_link`
            : `${UrlLink}Masters/Separated_Patient_Details_link`;

        axios
            .get(url, {
                params: { DoctorId: doctorId, ...(VisitPurpose && { VisitPurpose: VisitPurpose }) },
            })
            .then((response) => {
                const patientDetails = response.data.patients_details;
                console.log("Patient Details:", patientDetails);

                setOpPatients((prev) => {
                    const updatedPatients = prev.patients_details.filter(
                        (patient) => patient.PrimaryDoctor !== doctorId
                    );

                    const newPatientsDetails = [...updatedPatients, ...patientDetails];

                    return {
                        ...prev,
                        patients_details: newPatientsDetails,
                    };
                });
            })
            .catch((err) => {
                console.log("Error fetching patient details:", err);
            });
    };
    const allDoctorsPatients = [
        ...OpDoctors.inhouse_doctors,
        ...OpDoctors.visiting_doctors,
    ];
    const handlePatientRegister = async (doctorId, patientId, visitId) => {
        try {
            // Fetch patient data from the backend
            const response = await axios.get(
                `${UrlLink}Frontoffice/get_Patient_Details_by_patientId`,
                {
                    params: {
                        PatientId: patientId,
                        VisitId: visitId,
                        DoctorID: doctorId,
                    },
                }
            );

            if (response.data) {
                if (response.data.patients) {
                    const patientData = Array.isArray(response.data.patients)
                        ? response.data.patients[0]
                        : response.data.patients;

                    // Dispatch the fetched patient data to the Redux store
                    dispatchvalue({
                        type: "UsercreatePatientdata",
                        value: { ...patientData },
                    });

                    // Navigate to the PatientNavigation component
                    navigate("/Home/PatientNavigation");
                    


                } else {
                    console.log("No patient data found");
                }
            }
        } catch (error) {
            console.error("Error fetching patient data:", error);
        }
    };
    return (
        <div className="Main_container_app" id="scrollupppp">
            <div className="h_head">
                <h4>Doctor Dashboard</h4>
            </div>
            <div className="doctor_table_das">
                <div className="table_container_docdas">
                    <table>
                        <thead>
                            <tr>
                                {allDoctors.map((doctor) => {
                                    const isVisiting = doctor.DoctorType === "Visiting";
                                    const patientCount =
                                        (OpPatients &&
                                            OpPatients.doctor_patient_totals &&
                                            OpPatients.doctor_patient_totals[doctor.Doctor_ID]) ||
                                        0;
                                    const registeredCount = doctor.registered_patient_count || 0;
                                    const consultedCount = doctor.consulted_patient_count || 0;
                                    const newconsultationCount =
                                        doctor.new_consultation_count || 0;
                                    const followupCount = doctor.followup_count || 0;

                                    return (
                                        <th
                                            key={doctor.Doctor_ID}
                                            style={{
                                                color: isVisiting ? "red" : "black",
                                                cursor: "pointer",
                                            }}
                                            onClick={() =>
                                                handlePatientDetailsClick(doctor.Doctor_ID)
                                            }
                                        >
                                            {/* {doctor.Full_Name} {patientCount} */}
                                            <div>
                                                <div>
                                                    <strong>{doctor.Full_Name}</strong>{" "}
                                                    {/* Doctor's full name */}
                                                </div>
                                                <div>
                                                    Patient Count: {patientCount}{" "}
                                                    {/* Total patient count */}
                                                </div>
                                                <div
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePatientDetailsVisitClick(
                                                            doctor.Doctor_ID,
                                                            "NewConsultation"
                                                        );
                                                    }}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    New Consultation Count: {newconsultationCount}{" "}
                                                    {/* New consultation count */}
                                                </div>
                                                <div onClick={(e) => {
                                                    e.stopPropagation();
                                                    handlePatientDetailsVisitClick(
                                                        doctor.Doctor_ID,
                                                        "FollowUp"
                                                    );
                                                }}
                                                    style={{ cursor: "pointer" }}>
                                                    Follow-Up Count: {followupCount}{" "}
                                                    {/* Follow-up count */}
                                                </div>
                                            </div>

                                            <div>
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePatientDetailsClick(
                                                            doctor.Doctor_ID,
                                                            "Registered"
                                                        );
                                                    }}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    Registered: {registeredCount}
                                                </span>
                                            </div>
                                            <div>
                                                <span
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handlePatientDetailsClick(
                                                            doctor.Doctor_ID,
                                                            "Completed"
                                                        );
                                                    }}
                                                    style={{ cursor: "pointer" }}
                                                >
                                                    Completed: {consultedCount}
                                                </span>
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                {allDoctorsPatients.map((doctor) => {
                                    const patientsForDoctor = OpPatients.patients_details?.filter(
                                        (patient) => patient.PrimaryDoctor === doctor.Doctor_ID
                                    );

                                    return (
                                        <td key={doctor.Doctor_ID}>
                                            {patientsForDoctor?.length > 0 ? (
                                                <ul>
                                                    {patientsForDoctor?.map((patient) => (
                                                        <li
                                                            key={patient.PatientId}
                                                           
                                                        >
                                                            <div
                                                                className={`iuyr444r ${patient.Status.toLowerCase()}`}
                                                            >
                                                                <h5>{patient.PatientName}</h5>
                                                                <div className="dsewx">
                                                                    <div className="kjs26">
                                                                        <p>{patient.VisitPurpose}</p>
                                                                    </div>
                                                                    {/* <div className="frwr_icom8">
                                                                        <ForwardIcon
                                                                            onClick={() =>
                                                                                handlePatientRegister(
                                                                                    doctor.Doctor_ID,
                                                                                    patient.PatientId,
                                                                                    patient.VisitId
                                                                                )
                                                                            }
                                                                        />
                                                                    </div> */}
                                                                </div>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>No patients</p>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* {contextMenu && (
                    <SixdoctorContext
                        x={contextMenu.x}
                        y={contextMenu.y}
                        onClose={handleCloseContextMenu}
                        onSelectStatus={handleSelectStatus}
                        onMouseLeave={handleCloseContextMenu}
                    />
                )} */}
                <ToastAlert Message={toast.message} Type={toast.type} />
            </div>
        </div>
    )
}

export default Sixdoctor