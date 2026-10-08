import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import { useNavigate } from 'react-router-dom';
import LoupeIcon from "@mui/icons-material/Loupe";
import Visibility from '@mui/icons-material/Visibility';
import PhotoCameraBackIcon from "@mui/icons-material/PhotoCameraBack";
import DriveFolderUploadIcon from '@mui/icons-material/DriveFolderUpload';

const DoctorList = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);
    const pagewidth = useSelector(state => state.userRecord?.pagewidth);
    const dispatchvalue = useDispatch();
    const navigate = useNavigate()
    const [UserRegisterData, setUserRegisterData] = useState([])
    const [GetUserRegisterData, setGetUserRegisterData] = useState(false)   
    const [UserRegisterFIlteredData, setUserRegisterFIlteredData] = useState([])
    const [SearchQuery, setSearchQuery] = useState('')

    const [selectedSpecialization, setSelectedSpecialization] = useState('');
    const [selectedDesignation, setSelectedDesignation] = useState('');

    const [SearchSpecialization, setSearchSpecialization] = useState('');
    const [SearchDesignation, setSearchDesignation] = useState('');
    const [Specializations, setSpecializations] = useState([]);
    const [Designations, setDesignations] = useState([]);

    
    const [getdata, setgetdata] = useState(false);
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
    }, [UrlLink, GetUserRegisterData, dispatchvalue, getdata])

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
            .then((res) => {
                setSpecializations(res.data || []);
            })
            .catch((err) => console.log("Error fetching specializations:", err));
    }, [UrlLink]);
    console.log("Specializationsssss", Specializations);

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Designation_Detials_link`)
            .then((res) => {
                setDesignations(res.data || []);
            })
            .catch((err) => console.log("Error fetching designations:", err));
    }, [UrlLink]);



    console.log("UserRegisterData", UserRegisterData);

    // useEffect(() => {

    //     const lowercasesearch = SearchQuery.toLowerCase()
    //     const filteralldata = UserRegisterData.filter((row) => {
    //         const LowerName = row.Name.toLowerCase()
    //         const Mobile = row.ContactNumber.toString()
    //         const Docdtype = row.DoctorType.toLowerCase()

    //         return (
    //             LowerName.includes(lowercasesearch) ||
    //             Mobile.includes(lowercasesearch) ||
    //             Docdtype.includes(lowercasesearch)

    //         )

    //     })

    //     setUserRegisterFIlteredData(filteralldata)

    // }, [SearchQuery, UserRegisterData])

useEffect(() => {
    const lowercasesearch = SearchQuery?.toLowerCase() ?? "";

    const filteralldata = UserRegisterData?.filter((row) => {
        const name = row?.Name?.toLowerCase() ?? "";
        const mobile = row?.ContactNumber?.toString() ?? "";
        const type = row?.DoctorType?.toLowerCase() ?? "";

        const specializationMatch =
            !SearchSpecialization || row?.Specialization === SearchSpecialization;
        const designationMatch =
            !SearchDesignation || row?.Designation === SearchDesignation;


        return (
            (name.includes(lowercasesearch) ||
                mobile.includes(lowercasesearch) ||
                type.includes(lowercasesearch)) &&
            specializationMatch &&
            designationMatch
        );
    }) ?? [];

    setUserRegisterFIlteredData(filteralldata);
}, [SearchQuery, UserRegisterData, SearchSpecialization, SearchDesignation]);


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
            key: "Name",
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
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditDocRegister(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        },
        {
            key: "DoctorCalenderView",
            name: "Doctor Calender View",
            width: 150,
            renderCell: (params) => (
                <>{
                    params.row.DoctorType === 'Referral' ?
                        (
                            <>
                                No Calender View
                            </>
                        )
                        :
                        (
                            <Button
                                className="cell_btn"
                                onClick={() => HandleCalenderView(params.row)}
                            >
                                <Visibility className="check_box_clrr_cancell" />
                            </Button>
                        )

                }

                </>
            ),
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
        {
            key: "UserAction",
            name: "User Action",
            renderCell: (params) => (
                <>{
                    params.row.DoctorType === 'Referral' ?
                        (
                            <>
                                No Access
                            </>
                        )
                        :
                        params.row.usercreated ? (
                            <>user created</>
                        )
                            :
                            (
                                <Button
                                    className="cell_btn"
                                    onClick={() => handleDocUserRegister(params.row)}
                                >
                                    <ArrowForwardIcon className="check_box_clrr_cancell" />
                                </Button>
                            )

                }

                </>
            ),
        }

    ]


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
    const handleeditDocRegister = (params) => {
        console.log(params,'paramssssssss')
        const { id } = params
        dispatchvalue({ type: 'DoctorListId', value: { DoctorId: id } })
        navigate('/Home/Doctor_Master')
    }


    const handlenewDocRegister = () => {

        dispatchvalue({ type: 'DoctorListId', value: {} });

        navigate("/Home/MasterFolder");
        dispatchvalue({ type: 'HrFolder', value: 'Doctor_Master' });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });

    }
    const HandleRateCardView = (params) => {

        const { id } = params
        dispatchvalue({ type: 'DoctorListId', value: { DoctorId: id } })

        navigate("/Home/MasterFolder");
        dispatchvalue({ type: 'HrFolder', value: 'DoctorRatecardList' });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });

    }

    const HandleCalenderView = (params) => {

        const { id } = params

        console.log('Calenderrrrrr', params)
        dispatchvalue({ type: 'DoctorListId', value: { DoctorId: id } })


        navigate("/Home/MasterFolder");
        dispatchvalue({ type: 'HrFolder', value: 'Doctor_Calender' });
        dispatchvalue({ type: "setPreviousFolder", value: null });
        dispatchvalue({ type: "showMenu", value: true });


    }




    const handleDocUserRegister = (params) => {
        dispatchvalue({ type: 'UsercreateEmpdata', value: {} })
        dispatchvalue({ type: 'Usercreatedocdata', value: { DoctorId: params.id, Type: 'DOCTOR' } })
        dispatchvalue({ type: 'UserListId', value: {} })
        navigate('/Home/UserRegisterMaster')
    }
 

    const [SelectedFile, setSelectedFile] = useState(null);
     const [SelectedFileone, setSelectedFileone] = useState(null);


    const handleFileChange = (event) => {
        setSelectedFile(null);
        setSelectedFile(event.target.files[0]);
    };
    
    const handleFileChangeone = (event) => {
        console.log('0000',event.target.files[0])
        setSelectedFileone(null);
        setSelectedFileone(event.target.files[0]);
    };



    const handleCsvupload = () => {
        // console.log(SelectedFile);
        const formData = new FormData();
        formData.append("file", SelectedFile);
        formData.append("created_by", userRecord?.username);

        if (SelectedFile) {
            axios
                .post(`${UrlLink}Masters/Doctor_Master_File_Upload`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((response) => {
                    console.log(response);
                    setSelectedFile(null);

                    let data = response.data;

                    let type = Object.keys(data)[0]
                    let mess = Object.values(data)[0]
                    const tdata = {
                        message: mess,
                        type: type
                    }
                    dispatchvalue({ type: 'toast', value: tdata })
                    setgetdata(prev => !prev)
                })
                .catch((error) => {
                    console.log(error);
                    alert(error);
                });
        } else {
            // userwarn("Choose File");
        }
    };

    console.log('SelectedFileone',SelectedFileone);
     console.log('SelectedFile',SelectedFile);

    const handleCsvuploadone= () => {
        
        const formData = new FormData();
        formData.append("file", SelectedFileone);
        formData.append("created_by", userRecord?.username);

        if (SelectedFileone) {
            axios
                .post(`${UrlLink}Masters/Doctor_Master_File_Upload_Refferral`, formData, {
                    headers: { "Content-Type": "multipart/form-data" },
                })
                .then((response) => {
                    console.log(response);
                    setSelectedFileone(null);

                    let data = response.data;

                    let type = Object.keys(data)[0]
                    let mess = Object.values(data)[0]
                    const tdata = {
                        message: mess,
                        type: type
                    }
                    dispatchvalue({ type: 'toast', value: tdata })
                    setgetdata(prev => !prev)
                })
                .catch((error) => {
                    console.log(error);
                    alert(error);
                });
        } else {
            // userwarn("Choose File");
        }
    };


    return (
        <>
            <div className="Main_container_app">
                <h3>Doctor List</h3>
                <div className="search_div_bar">
                    <div className=" search_div_bar_inp_1">
                        <label htmlFor="">Search Here
                            <span>:</span>
                        </label>
                        <input
                            type="text"
                            value={SearchQuery}
                            placeholder='By DoctorName or Number or DoctorType'
                            onChange={(e) => setSearchQuery(e.target.value)} />
                    </div>

                    <div className="search_div_bar">
                        <label>Specialization <span>:</span></label>
                        <select value={SearchSpecialization} onChange={(e) => setSearchSpecialization(e.target.value)}>
                            <option value="">Select Specialization</option>
                            {Specializations.filter(s => s.Status === 'Active')?.map((item, index) => (
                                <option key={index} value={item.SpecialityName}>{item.SpecialityName}</option>
                            ))}
                        </select>
                    </div>

                    <div className="search_div_bar">
                        <label>Designation <span>:</span></label>
                        <select value={SearchDesignation} onChange={(e) => setSearchDesignation(e.target.value)}>
                            <option value="">Select Designation</option>
                            {Designations.filter(d => d.Status === 'Active')?.map((item, index) => (
                                <option key={index} value={item.Designation}>{item.Designation}</option>
                            ))}
                        </select>
                    </div>


                    <button
                        className="search_div_bar_btn_1"
                        onClick={handlenewDocRegister}
                        title="New Doctor Register"
                    >
                        <LoupeIcon />
                    </button>
                    <br></br>
                    <div style={{ display: "flex", alignItems: "center", }}>
                        <label>
                            {" "}
                            Doctor Master Excel File<span>:</span>{" "}
                        </label>
                        <input
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            id="Servicechoose"
                            required
                            style={{ display: "none" }}
                            onChange={handleFileChange}
                        />



                        <label
                            htmlFor="Servicechoose"
                            title='Choose File'
                            className="RegisterForm_1_btns choose_file_update"
                        >
                            <PhotoCameraBackIcon />
                        </label>
                        <button
                            className="RegisterForm_1_btns choose_file_update"
                            onClick={handleCsvupload}
                            title='File Upload'
                        >

                            <DriveFolderUploadIcon />

                        </button>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", }}>
                        <label>
                            {" "}
                          Referral Doctor Master Excel File<span>:</span>{" "}
                        </label>
                        <input
                            type="file"
                            accept=".xlsx, .xls, .csv"
                            id="Servicechooseone"
                            required
                            style={{ display: "none" }}
                            onChange={handleFileChangeone}
                        />



                        <label
                            htmlFor="Servicechooseone"
                            title='Choose File'
                            className="RegisterForm_1_btns choose_file_update"
                        >
                            <PhotoCameraBackIcon />
                        </label>
                        <button
                            className="RegisterForm_1_btns choose_file_update"
                            onClick={handleCsvuploadone}
                            title='File Upload'
                        >

                            <DriveFolderUploadIcon />

                        </button>
                    </div>
                </div>
                <ReactGrid columns={UserRegisterColumns} RowData={UserRegisterFIlteredData} />


            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    )
}

export default DoctorList;