
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import ModelContainer from "../../OtherComponent/ModelContainer/ModelContainer";
import ToastAlert from "../../OtherComponent/ToastContainer/ToastAlert";
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import Visibility from '@mui/icons-material/Visibility';

const RatecardMaster = () => {
    const dispatchvalue = useDispatch();
    const navigate = useNavigate();
    const [ServiceProcedureForm, setServiceProcedureForm] = useState("Service");
    console.log("ServiceProcedureForm", ServiceProcedureForm);
    const [ServiceProcedureColumns, setServiceProcedureColumns] = useState([]);
    const [ServiceProcedureData, setServiceProcedureData] = useState([]);
    const [getChanges, setgetChanges] = useState(false);
    const [loading, setLoading] = useState(false);
    const pagewidth = useSelector((state) => state.userRecord?.pagewidth);
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const toast = useSelector((state) => state.userRecord?.toast);
    const [SearchQuery, setSearchQuery] = useState({
        Type: "",
        SearchBy: "",
    });
    const handlesearch = (e) => {
        const { name, value } = e.target;
        setSearchQuery((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleselectChange = (e) => {
        const { value } = e.target;
        setLoading(true);
        setTimeout(() => {
            setServiceProcedureForm(value);
            setSearchQuery({
                Type: "",
                SearchBy: "",
            });
            setLoading(false);
        }, 200);
    };



    const handleeditstatus = useCallback(
        (params) => {
            const data = {
                MasterType: ServiceProcedureForm,
                id: params.id,
            };
            axios
                .post(
                    `${UrlLink}Masters/update_status_Service_Procedure_Detials_link`,
                    data
                )
                .then((res) => {
                    const resres = res.data;
                    let typp = Object.keys(resres)[0];
                    let mess = Object.values(resres)[0];
                    const tdata = {
                        message: mess,
                        type: typp,
                    };

                    dispatchvalue({ type: "toast", value: tdata });
                    setgetChanges((prev) => !prev);
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        [ServiceProcedureForm, UrlLink, dispatchvalue]
    );


    const handleRatecardview = useCallback(
        (params) => {
            const data = {
                MasterType: ServiceProcedureForm,
                id: params.id,
            };
            dispatchvalue({ type: "ServiceProcedureRatecardView", value: data });
            navigate("/Home/ServiceProcedureRatecard");

            
        },
        [ServiceProcedureForm, dispatchvalue, navigate]
    );
    useEffect(() => {
        const commonColumns = [
            { key: "IsGst", name: "IsGst" },
            { key: "GSTValue", name: "GSTValue" },
            {
                key: "Status",
                name: "Status",
                frozen: pagewidth > 1000 ? true : false,
                renderCell: (params) => (
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditstatus(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                ),
            },
            {
                key: "RatecardView",
                name: "Ratecard View",
                renderCell: (params) => (
                    <Button
                        className="cell_btn"
                        onClick={() => handleRatecardview(params.row)}
                    >
                        <VisibilityIcon />
                    </Button>
                ),
            },

        ];

        const ServiceColumns = [
            {
                key: "id",
                name: "Service Id",
                frozen: pagewidth > 500 ? true : false,
            },
            {
                key: "ServiceName",
                name: "Service Name",
                frozen: pagewidth > 700 ? true : false,
            },
            { key: "ServiceType", name: "Service Name" },
            { key: "Department", name: "Department" },
            ...commonColumns,
        ];

        const ProcedureColumns = [
            {
                key: "id",
                name: " Procedure Id",
                frozen: pagewidth > 500 ? true : false,
            },
            {
                key: "ProcedureName",
                name: "Therapy Name",
                frozen: pagewidth > 700 ? true : false,
            },
            { key: "Type", name: "Procedure Type" },
            ...commonColumns,
        ];

        setServiceProcedureColumns(
            ServiceProcedureForm === "Service" ? ServiceColumns : ProcedureColumns
        );
    }, [
        ServiceProcedureForm,
        pagewidth,
        handleeditstatus,
        handleRatecardview,
    ]);

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const data = {
                    MasterType: ServiceProcedureForm,
                    ...SearchQuery,
                };
                const [filteredRows] = await Promise.all([
                    axios.get(`${UrlLink}Masters/Service_Procedure_Master_Detials_link`, {
                        params: data,
                    }),
                ]);
                setServiceProcedureData(filteredRows.data);
                // setMastertypedata(Mastertypedata.data)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchdata();
    }, [UrlLink, getChanges, ServiceProcedureForm, SearchQuery]);
    // ----------------doctormaster
    const [UserRegisterData, setUserRegisterData] = useState([])
    const [GetUserRegisterData, setGetUserRegisterData] = useState(false)
    const [UserRegisterFIlteredData, setUserRegisterFIlteredData] = useState([])
    const [SearchQuery1, setSearchQuery1] = useState('')

    useEffect(() => {
        axios.get(`${UrlLink}Masters/get_Doctor_Detials_link`)
            .then((res) => {
                const ress = res.data
                if (Array.isArray(ress)) {
                    setUserRegisterData(ress)
                } else {
                    setUserRegisterData([])
                }

            })
            .catch((err) => {
                console.log(err);
            })
        dispatchvalue({ type: 'DoctorListId', value: {} })
    }, [UrlLink, GetUserRegisterData, dispatchvalue])


    useEffect(() => {

        const lowercasesearch = SearchQuery1.toLowerCase()
        const filteralldata = UserRegisterData.filter((row) => {
            const LowerName = row.Name.toLowerCase()
            const Mobile = row.ContactNumber.toString()
            const Docdtype = row.DoctorType.toLowerCase()

            return (
                LowerName.includes(lowercasesearch) ||
                Mobile.includes(lowercasesearch) ||
                Docdtype.includes(lowercasesearch)

            )

        })

        setUserRegisterFIlteredData(filteralldata)

    }, [SearchQuery1, UserRegisterData])


    const handleeditDoctorstatus = (params) => {
        const data = { DoctorId: params.id }
        axios.post(`${UrlLink}Masters/update_status_Doctor_Detials_link`, data)
            .then((res) => {
                const resres = res.data
                let typp = Object.keys(resres)[0]
                let mess = Object.values(resres)[0]
                const tdata = {
                    message: mess,
                    type: typp,
                }

                dispatchvalue({ type: 'toast', value: tdata });
                setGetUserRegisterData(prev => !prev)
            })
            .catch((err) => {
                console.log(err);
            })

    }
    const HandleRateCardView = (params) => {

        const { id } = params
        dispatchvalue({ type: 'DoctorListId', value: { DoctorId: id } })
        navigate('/Home/DoctorRatecardList')
    }

    const UserRegisterColumns = [
        {
            key: "id",
            name: "Doctor Id",
            filter: true,
            type: 'input-text',
            frozen: true,
            width: 300
        },
        {
            key: "ShortName",
            name: "Doctor Name",
            filter: true,
            frozen: true
        },
        {
            key: "ContactNumber",
            name: "Contact Number",
            frozen: true
        },
        {
            key: "DoctorType",
            name: "Doctor Type",
            frozen: true
        },
        {
            key: "Status",
            name: "Status",
            frozen: true,
            renderCell: (params) => (

                <Button
                    className="cell_btn"
                    onClick={() => handleeditDoctorstatus(params.row)}
                >
                    {params.row.Status}
                </Button>
            )

        },
        {
            key: "Email",
            name: "Email",

        },


        {
            key: "Qualification",
            name: "Qualification",
        },
        {
            key: "Department",
            name: "Department",
        },
        {
            key: "Designation",
            name: "Designation",
        },
        {
            key: "Specialization",
            name: "Specialization",
        },
        {
            key: "Category",
            name: "Category",
        },
        {
            key: "createdBy",
            name: "created By",
        },



        {
            key: "RatecardAction",
            name: "Rate Card View",
            renderCell: (params) => (
                <>{
                    params.row.DoctorType === 'Referral' ?
                        (
                            <>
                                No Ratecard
                            </>
                        )
                        :
                        (
                            <Button
                                className="cell_btn"
                                onClick={() => HandleRateCardView(params.row)}
                            >
                                <Visibility className="check_box_clrr_cancell" />
                            </Button>
                        )

                }

                </>
            ),
        },

    ]


    // RoomMasterService

    const [floorData, setFloorData] = useState([]);
    const [doctorRateCardColumns, setDoctorRateCardColumns] = useState([]);
    const [editing, setEditing] = useState(null);
    const [getChangess, setGetChangess] = useState(false);

    // useEffect(() => {
    //         axios
    //             .get(`${UrlLink}Masters/floor_ward_ratecard_view_by_doctor_id?DoctorId=${DoctorListId.DoctorId}`)
    //             .then((res) => {
    //                 const { FloorWardDetails } = res.data;
    //                 setFloorData(Array.isArray(FloorWardDetails) ? FloorWardDetails : []);
    //             })
    //             .catch((err) => console.error(err));
    // }, [UrlLink, navigate, getChanges]);

    const handleChange = useCallback((e, rowIdx, column) => {
        const updatedRow = floorData.map((row, index) =>
            index === rowIdx ? { ...row, [column]: e.target.value } : row
        );
        setFloorData(updatedRow);
    }, [floorData]);

    const handleDoubleClick = useCallback((rowIdx, column) => {
        setEditing({ rowIdx, column });
    }, []);

    const handleSaveChanges = useCallback((row, column) => {
        const editData = {
            // doctor_id: DoctorListId?.DoctorId,
            floor_id: row.FloorId,
            ward_id: row.WardId,
            updated_rate: row[column],
            column: column,
        };

        const confirmChange = window.confirm("Do you want to save the changes?");
        if (confirmChange) {
            axios.post(`${UrlLink}Masters/floor_ward_ratecard_update`, editData)
                .then((res) => {
                    const tdata = {
                        message: res.data.message || "Rate updated successfully",
                        type: res.data.status || "success",
                    };
                    dispatchvalue({ type: 'toast', value: tdata });
                })
                .catch((err) => console.error(err));
            setGetChangess((prev) => !prev);
        }
        setEditing(null);
    }, [UrlLink, dispatchvalue]);

    const handleKeyDown = useCallback((e, row, column) => {
        if (e.key === 'Enter') {
            handleSaveChanges(row, column);
        } else if (['e', 'E', '+', '-'].includes(e.key)) {
            e.preventDefault();
        }
    }, [handleSaveChanges]);

    useEffect(() => {
        const columns = [
            { key: "FloorName", name: "Floor Name", frozen: true },
            { key: "WardName", name: "Ward Name", frozen: true },
            { key: "PrevRate", name: "Previous Rate" },
            {
                key: "CurrentRate",
                name: "Current Rate",
                editable: true,
                renderCell: (params) => (
                    editing && editing.rowIdx === params.rowIndex && editing.column === 'CurrentRate' ? (
                        <input
                            type="number"
                            className="ratecard_inputs"
                            autoFocus
                            onKeyDown={(e) => handleKeyDown(e, params.row, 'CurrentRate')}
                            value={params.row.CurrentRate || ''}
                            onChange={(e) => handleChange(e, params.rowIndex, 'CurrentRate')}
                        />
                    ) : (
                        <div onDoubleClick={() => handleDoubleClick(params.rowIndex, 'CurrentRate')}>
                            {params.row.CurrentRate || ''}
                        </div>
                    )
                ),
            },
        ];

        setDoctorRateCardColumns(columns);
    }, [editing, handleKeyDown, handleChange, handleDoubleClick]);




    return (
        <>
            <div className="Main_container_app">
                <h3>RateCard Master</h3>
                <br />
                <div className="RegisterTypecon">
                    <div className="RegisterType">
                        {["Service", "Procedure", "DoctorRateCard", "Room/Ward_Service",].map((p, ind) => (
                            <div className="registertypeval" key={ind + "key"}>
                                <input
                                    type="radio"
                                    id={p}
                                    name="appointment_type"
                                    checked={ServiceProcedureForm === p}
                                    onChange={handleselectChange}
                                    value={p}
                                />
                                <label htmlFor={p}>{p === "Procedure" ? "Therapy" : p}</label>
                            </div>
                        ))}
                    </div>
                </div>
                <br />
                <div className="search_div_bar">
                    {ServiceProcedureForm !== "DoctorRateCard" && ServiceProcedureForm !== "Room/Ward_Service" && (
                        <div className=" search_div_bar_inp_1">
                            <label htmlFor="">
                                {ServiceProcedureForm} Type
                                <span>:</span>
                            </label>
                            <select
                                name="Type"
                                value={SearchQuery.Type}
                                onChange={handlesearch}
                            >
                                <option value="">Select</option>
                                {ServiceProcedureForm === "Service" &&
                                    ["OP", "IP", "Both"].map((val, ind) => (
                                        <option key={ind} value={val}>
                                            {val === "Both" ? "both IP and OP" : val}
                                        </option>
                                    ))}
                                {ServiceProcedureForm === "Procedure" &&
                                    ["Interventional", "Diagnostic"].map((val, ind) => (
                                        <option key={ind} value={val}>
                                            {val}
                                        </option>
                                    ))}
                            </select>
                        </div>
                    )}
                    {ServiceProcedureForm !== "DoctorRateCard" && ServiceProcedureForm !== "Room/Ward_Service" && (
                        <div className="search_div_bar_inp_1">
                            <label htmlFor="">
                                Search Here
                                <span>:</span>
                            </label>
                            <input
                                type="text"
                                name="SearchBy"
                                value={SearchQuery.SearchBy}
                                placeholder={`By ${ServiceProcedureForm} ...`}
                                onChange={handlesearch}
                            />
                        </div>
                    )}
                </div>
                <br />
                {ServiceProcedureForm !== "DoctorRateCard" && ServiceProcedureForm !== "Room/Ward_Service" && (
                    <ReactGrid
                        columns={ServiceProcedureColumns}
                        RowData={ServiceProcedureData}
                    />
                )}

                {ServiceProcedureForm === 'DoctorRateCard' && (
                    <>
                        <div className="search_div_bar">
                            <div className="search_div_bar_inp_1">
                                <label htmlFor="">
                                    Search Here
                                    <span>:</span>
                                </label>
                                <input
                                    type="text"
                                    value={SearchQuery1}
                                    placeholder="By DoctorName or Number or DoctorType"
                                    onChange={(e) => setSearchQuery1(e.target.value)}
                                />
                            </div>
                        </div>
                        
                        <ReactGrid
                            columns={UserRegisterColumns}
                            RowData={UserRegisterFIlteredData}
                        />
                    </>
                )}
                {
                    ServiceProcedureForm === 'Room/Ward_Service' &&
                    <>
                        <ReactGrid
                            RowData={floorData}
                            columns={doctorRateCardColumns}
                        />
                    </>
                }

                {loading && (
                    <div className="loader">
                        <div className="Loading">
                            <div className="spinner-border"></div>
                            <div>Loading...</div>
                        </div>
                    </div>
                )}
            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
            <ModelContainer />

        </>
    )
}

export default RatecardMaster

