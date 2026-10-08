import axios from 'axios';
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import "./Insurance.css";
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';
import { Button } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelPresentationIcon from '@mui/icons-material/CancelPresentation';



const ClientDashboard = () => {
    const navigate = useNavigate();
    const dispatchvalue = useDispatch();

    const toast = useSelector(state => state.userRecord?.toast);
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector((state) => state.userRecord?.UserData);

    const [ClientPatientlist, setClientPatientlist] = useState([]);
    console.log("ClientPatientlist",ClientPatientlist);


    const [SerchOptions, setSerchOptions] = useState({
        ServiceType: '',
        PatientId: '',
        PatientName: '',
        Filterby: 'ALL',
    })


    const [StatusCount, setStatusCount] = useState({

        Allcount: 0,
        Pendingcount: 0,
        ApprovedCount: 0,
        RejectedCount: 0,
        CompletedCount: 0,
    })


    const Handeleonchange = (e) => {

        const { name, value } = e.target;

        setSerchOptions((prev) => ({
            ...prev,
            [name]: value
        }))

    }

    // bharathi

    const GetSetCountNumbers = useCallback(() => {

        axios.get(`${UrlLink}Insurance/Get_StatusCount_Client`)
            .then((res) => {
                console.log(res.data);
                let data = res.data
                if (data && Object.values(data).length !== 0) {
                    setStatusCount(data)
                }
            })
            .catch((err) => {
                console.log(err);
            })

    }, [UrlLink])


    useEffect(() => {

        GetSetCountNumbers()
    }, [GetSetCountNumbers])
    // bharathi

    const GetInsurance_detailes = useCallback(() => {

        axios.get(`${UrlLink}Insurance/Signal_ClientPatientEntry_Get_Details`, {
            params: SerchOptions
        })
            .then((res) => {
                console.log(res.data);
                let data = res.data

                if (data && Array.isArray(data) && data.length !== 0) {
                    setClientPatientlist(data)
                }
                else {
                    setClientPatientlist([])
                }

            })
            .catch((err) => {
                console.log(err);
            })

    }, [UrlLink, SerchOptions])

    useEffect(() => {

        GetInsurance_detailes()

    }, [GetInsurance_detailes])

    const HandelEditedata = (row) => {
        console.log("row",row);
        navigate('/Home/ClientMainpage');
        dispatchvalue({ type: 'ClientPatientDetailes', value: row });
    }

    // bharathi
    const UpdateStatusFun = (row, Status) => {


        console.log('123345555', row, Status);

        let ConformStatus = window.confirm(`Are you sure to change status ${Status}`)

        if (ConformStatus) {

            let params = {
                InstId: row.id,
                Status: Status,
            }

            axios.post(`${UrlLink}Insurance/Update_StatusFor_Client_Patient_Detailes`, params)
                .then((res) => {
                    console.log(res.data);

                    let resdata = res.data
                    let type = Object.keys(resdata)[0]
                    let mess = Object.values(resdata)[0]
                    const tdata = {
                        message: mess,
                        type: type,
                    }
                    dispatchvalue({ type: 'toast', value: tdata });

                    setSerchOptions((prev) => ({
                        ...prev,
                        Filterby: Status,
                    }))
                    GetInsurance_detailes()
                    GetSetCountNumbers()

                })
                .catch((err) => {
                    console.log(err);
                })
        }


    }


    const ClientDashboardcolumn = useMemo(() => {
        const baseColumns = [
            { key: 'id', name: 'S.No', frozen: true },
            { key: 'PatientId', name: 'Patient Id', frozen: true },
            { key: 'PatientName', name: 'Patient Name', frozen: true },
            { key: 'RegistrationId', name: 'Registration Id', frozen: true, width: '150px' },
            { key: 'ClientName', name: 'Client Name' },
            { key: 'CreatedAt', name: 'Created Date' },
        ];

        const renderActionCell = (params) => (
            <>
                {params.row.Papersstatus === 'APPROVED' ? (
                    <Button className="cell_btn" onClick={() => HandelEditedata(params.row)}>
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                ) : params.row.Papersstatus === 'PENDING' ? (
                    <>
                        <Button className="cell_btn">
                            <CheckCircleOutlineIcon
                                className="check_box_clrr_cancell"
                                onClick={() => UpdateStatusFun(params.row, 'APPROVED')}
                            />
                        </Button>
                        <Button className="cell_btn">
                            <CancelPresentationIcon
                                className="check_box_clrr_cancell"
                                onClick={() => UpdateStatusFun(params.row, 'REJECTED')}
                            />
                        </Button>
                    </>
                ) : (
                    <>No Action</>
                )}
            </>
        );

        if (SerchOptions.Filterby === 'ALL') {
            return [
                ...baseColumns,
                { key: 'Papersstatus', name: 'Status' },
            ];
        } else {
            return [
                ...baseColumns,
                { key: 'Action', name: 'Action', renderCell: renderActionCell },
            ];
        }
    }, [SerchOptions.Filterby]);


    return (
        <>
            <div className="Main_container_app">
                <h3>Client Dashboard</h3>
                <br />

                <div className="RegisFormcon_1">


                    <div className="RegisForm_1">
                        <label>Service Type<span>:</span></label>
                        <select
                            name='ServiceType'
                            value={SerchOptions.ServiceType}
                            onChange={Handeleonchange}
                        >
                            <option value=''>Select</option>
                            <option value='OP'>OP</option>
                            <option value='IP'>IP</option>
                            <option value='Casuality'>Casuality</option>
                            <option value='Diagnosis'>Diagnosis</option>
                            <option value='Laboratory'>Laboratory</option>
                        </select>

                    </div>

                    <div className="RegisForm_1">


                        <label>Patient Id<span>:</span></label>
                        <input
                            type='text'
                            name='PatientId'
                            value={SerchOptions.PatientId}
                            onChange={Handeleonchange}
                            autoComplete='off'
                        />

                    </div>

                    <div className="RegisForm_1">


                        <label>Patient First Name<span>:</span></label>
                        <input
                            type='text'
                            name='PatientName'
                            value={SerchOptions.PatientName}
                            onChange={Handeleonchange}
                            autoComplete='off'
                        />
                    </div>



                </div>

                <div className="new-patient-registration-form1">
                    <div className="Insurancenew-navigation">
                        <h2>

                            <div
                                className="insur_box_chnge6"
                                style={{
                                    backgroundColor: "transparent",
                                    transition: "background-color 0.3s",
                                }}

                                onClick={() =>
                                    setSerchOptions((prev) => ({
                                        ...prev,
                                        Filterby: "ALL",
                                    }))
                                }


                            >
                                <button
                                    style={{
                                        backgroundColor: "#ffcccc",
                                        width: "100%",
                                        padding: "20px",
                                    }}
                                >
                                    All
                                </button>
                                <p style={{ backgroundColor: SerchOptions.Filterby === 'ALL' ? '#ffcccc' : "transparent" }}>{StatusCount.Allcount}</p>
                            </div>


                            <div
                                className="insur_box_chnge6"
                                style={{
                                    backgroundColor: "transparent",
                                    transition: "background-color 0.3s",
                                }}

                                onClick={() =>
                                    setSerchOptions((prev) => ({
                                        ...prev,
                                        Filterby: "PENDING",
                                    }))
                                }
                            >
                                <button
                                    style={{
                                        backgroundColor: "#ffd966",
                                        width: "100%",
                                        padding: "20px",
                                    }}
                                >
                                    Pending
                                </button>
                                <p style={{ backgroundColor: SerchOptions.Filterby === 'PENDING' ? '#ffd966' : "transparent" }}>{StatusCount.Pendingcount}</p>
                            </div>

                            <div
                                className="insur_box_chnge6"
                                style={{
                                    backgroundColor: "transparent",
                                    transition: "background-color 0.3s",
                                }}

                                onClick={() =>
                                    setSerchOptions((prev) => ({
                                        ...prev,
                                        Filterby: "APPROVED",
                                    }))
                                }

                            >
                                <button
                                    style={{
                                        backgroundColor: "#b3e0ff",
                                        width: "100%",
                                        padding: "20px",
                                    }}
                                >
                                    Approved
                                </button>
                                <p style={{ backgroundColor: SerchOptions.Filterby === 'APPROVED' ? '#b3e0ff' : "transparent" }}>{StatusCount.ApprovedCount}</p>
                            </div>


                            <div
                                className="insur_box_chnge6"
                                style={{
                                    backgroundColor: "transparent",
                                    transition: "background-color 0.3s",
                                }}

                                onClick={() =>
                                    setSerchOptions((prev) => ({
                                        ...prev,
                                        Filterby: "REJECTED",
                                    }))
                                }

                            >
                                <button
                                    style={{
                                        backgroundColor: "#b3ffb3",
                                        width: "100%",
                                        padding: "20px",
                                    }}
                                >
                                    Rejected
                                </button>
                                <p style={{ backgroundColor: SerchOptions.Filterby === 'REJECTED' ? '#b3ffb3' : "transparent" }}>{StatusCount.RejectedCount}</p>
                            </div>

                            <div
                                className="insur_box_chnge6"
                                style={{
                                    backgroundColor: "transparent",
                                    transition: "background-color 0.3s",
                                }}

                                onClick={() =>
                                    setSerchOptions((prev) => ({
                                        ...prev,
                                        Filterby: "COMPLETED",
                                    }))
                                }

                            >
                                <button
                                    style={{
                                        backgroundColor: "#ffcc99",
                                        width: "100%",
                                        padding: "20px",
                                    }}
                                >
                                    Compleated
                                </button>
                                <p style={{ backgroundColor: SerchOptions.Filterby === 'COMPLETED' ? '#ffcc99' : "transparent" }}>{StatusCount.CompletedCount}</p>
                            </div>





                        </h2>
                    </div>


                </div>

                <ReactGrid columns={ClientDashboardcolumn} RowData={ClientPatientlist} />


            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    )
}

export default ClientDashboard;


