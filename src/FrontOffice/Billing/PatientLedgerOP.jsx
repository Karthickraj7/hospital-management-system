import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import axios from 'axios';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const OPPatientLedger = () => {
    const dispatchvalue = useDispatch();
    const navigate = useNavigate()
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);
    const PatientLedger = useSelector(state => state.Frontoffice?.PatientLedger);
    const RegistrationLedger = useSelector(state => state.Frontoffice?.RegistrationLedger);
    const [LocationData, setLocationData] = useState([]);
    const [ledgerdetails, setledgerdetails] = useState([]);
    console.log('Patienttttt', PatientLedger);
    console.log('Regggggg', RegistrationLedger);

    useEffect(() => {
        if (Object.keys(PatientLedger).length !== 0) {
            axios.get(`${UrlLink}Frontoffice/Patient_Overall_Ledger_Details?PatientId=${PatientLedger?.PatientId}`)
                .then((res) => {
                    const ress = res?.data;
                    console.log('1232131', ress);
                    setledgerdetails(ress)
                })
                .catch((e) => {
                    console.log(e)
                })
        }else{
            axios.get(`${UrlLink}Frontoffice/Registration_Overall_Ledger_Details?RegistrationId=${RegistrationLedger?.RegistrationId}`)
            .then((res) => {
                const ress = res?.data;
                console.log('333333', ress);
                setledgerdetails(ress)
            })
            .catch((e) => {
                console.log(e)
            })
        }
    }, [UrlLink,PatientLedger])

    return (
        <>
            <div className="Main_container_app">
                <h3>OP Patient Ledger</h3>
                <div className="common_center_tag">
                    <span>PatientID: {PatientLedger?.PatientId}</span>
                    <span>Patient Name : {PatientLedger?.FullName}</span>
                </div>
                <div className="doctor_schedule_table_wrapper_sri_2">
                    <div className="doctor_schedule_table_sri_2">
                        <table>
                            <thead>
                                <tr>
                                    <th>Date</th>
                                    <th>Registration ID</th>
                                    <th>Description</th>
                                    <th>Debit(&#x20B9;)</th>
                                    <th>Credit(&#x20B9;)</th>
                                    <th>Balance(&#x20B9;)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ledgerdetails.map((ledger, ind) => (
                                    <>
                                        <tr key={`${ind}_${ledger.Items_Id}`}>
                                            <td >{ledger?.Date}</td>
                                            <td >{ledger?.RegistrationId}</td>
                                            <td >{ledger?.Service_Type}</td>
                                            <td >{ledger?.Debit}</td>
                                            <td >{ledger?.Credit}</td>
                                            <td >{ledger?.Balance}</td>
                                        </tr>
                                    </>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    )
}

export default OPPatientLedger;