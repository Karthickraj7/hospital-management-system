import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from '../../OtherComponent/ReactGrid/ReactGrid';
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';

const BasicMaster = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const toast = useSelector(state => state.userRecord?.toast);
    const dispatchvalue = useDispatch();

    const [FlaggNamePage, setFlaggNamePage] = useState('Flag')


    const [FlaggName, setFlaggName] = useState({
        FlaggId: '',
        FlaggName: '',
        FlaggColor: '#000000',


    });
    const handleFlaggInputChange = (e) => {
        const { name, value } = e.target;
        setFlaggName((prevState) => ({
            ...prevState,
            [name]: value?.toUpperCase()?.trim(),
        }));
    }
    const [FlaggData, setFlaggData] = useState([])
    const [IsFlaggData, setIsFlaggData] = useState(false)
    const FlaggColumns = [
        {
            key: "id",
            name: "Flagg Id",
            frozen: true
        },

        {
            key: "FlaggName",
            name: "Flagg Name",
        },
        {
            key: "FlaggColor",
            name: "Flagg Color",
            renderCell: (params) => (
                <span
                    style={{
                        display: 'inline-block',
                        alignItems:'center',
                        height: '20px',
                        width: '20px',
                        backgroundColor: params.row.FlaggColor,
                        borderRadius: '4px', // Optional: for a rounded look
                        border: '1px solid #ccc' // Optional: adds border for visibility
                    }}
                ></span>
                // <span style={{ height: '20px', width: '20px', backgroundColor: params.row.FlaggColor }}></span>
            ),
        },
        {
            key: "Status",
            name: "Status",
            frozen: true,
            renderCell: (params) => (


                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditFlaggstatus(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                </>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditFlagg(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }


    ]

    const handleeditFlaggstatus = (params) => {
        const data = {
            FlaggId: params.id,
            Statusedit: true
        }
        axios.post(`${UrlLink}Masters/Flagg_color_Detials_link`, data)
            .then((res) => {
                const resres = res.data
                let typp = Object.keys(resres)[0]
                let mess = Object.values(resres)[0]
                const tdata = {
                    message: mess,
                    type: typp,
                }

                dispatchvalue({ type: 'toast', value: tdata });
                setIsFlaggData(prev => !prev)
            })
            .catch((err) => {
                console.log(err);
            })
    }


    const handleeditFlagg = (params) => {
        const { id, ...rest } = params
        setFlaggName((prev) => ({
            ...prev,
            FlaggId: id,
            FlaggName: rest.FlaggName,
            FlaggColor: rest.FlaggColor,
        }))
    }


    const handleFlaggsubmit = () => {
        if (FlaggName.FlaggName && FlaggName.FlaggColor) {
            const data = {
                ...FlaggName,
                created_by: userRecord?.username || ''

                // created_by: LocationName.locationId ? LocationName.created_by : userRecord?.username || '',
            }
            axios.post(`${UrlLink}Masters/Flagg_color_Detials_link`, data)
                .then((res) => {
                    const resData = res.data;
                    const mess = Object.values(resData)[0];
                    const typp = Object.keys(resData)[0];
                    const tdata = {
                        message: mess,
                        type: typp,
                    }



                    dispatchvalue({ type: 'toast', value: tdata })
                    setIsFlaggData(prev => !prev)
                    setFlaggName({
                        FlaggId: '',
                        FlaggName: '',
                        FlaggColor: '#000000',
                    })
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide both Flagg Name and Flagg Color.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }



    };


    useEffect(() => {
        axios.get(`${UrlLink}Masters/Flagg_color_Detials_link`)
            .then((res) => {
                const ress = res.data
                setFlaggData(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [IsFlaggData, UrlLink])



    // ---------------location master









    // const handleInputChange = (e) => {
    //     const { name, value } = e.target;
    //     setLocationName((prev) => ({
    //         ...prev,
    //         [name]: name === 'locationName' ? value.toUpperCase() : value
    //     }));
    // };


    // -------------- Department Name ---------------


    const [DepartmentName, setDepartmentName] = useState({
        DepartmentId: '',
        DepartmentName: '',

    });

    const [Departments, setDepartments] = useState([])
    const [IsDepartmentGet, setIsDepartmentGet] = useState(false)


    const DepartmentColumns = [
        {
            key: "id",
            name: "Department Id",
            frozen: true
        },
        {
            key: "created_by",
            name: "Created By ",
            frozen: true
        },
        {
            key: "DepartmentName",
            name: "Department Name",
        },

        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditDepartmentstatus(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                </>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditDepartment(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ]



    const handleeditDepartmentstatus = (params) => {
        const data = {
            DepartmentId: params.id,
            Statusedit: true
        }
        axios.post(`${UrlLink}Masters/Department_Detials_link`, data)
            .then((res) => {
                const resres = res.data
                let typp = Object.keys(resres)[0]
                let mess = Object.values(resres)[0]
                const tdata = {
                    message: mess,
                    type: typp,
                }

                dispatchvalue({ type: 'toast', value: tdata });
                setIsDepartmentGet(prev => !prev)
            })
            .catch((err) => {
                console.log(err);
            })
    }



    const handleeditDepartment = (params) => {
        const { id, ...rest } = params
        setDepartmentName((prev) => ({
            ...prev,
            DepartmentId: id,
            ...rest
        }))
    }



    const handleDepartmentSubmit = () => {

        if (DepartmentName.DepartmentName) {
            const data = {
                ...DepartmentName,
                created_by: userRecord?.username || ''
            }
            axios.post(`${UrlLink}Masters/Department_Detials_link`, data)
                .then((res) => {
                    const resres = res.data
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsDepartmentGet(prev => !prev)
                    setDepartmentName({
                        DepartmentId: '',
                        DepartmentName: '',

                    })
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide both Ward Name and Location.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
    }

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Department_Detials_link`)
            .then((res) => {
                const ress = res.data
                setDepartments(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [IsDepartmentGet, UrlLink])




    const handleDepartmentChange = (e) => {
        const { name, value } = e.target;
        setDepartmentName((prev) => ({
            ...prev,
            [name]: value?.toUpperCase()?.trim()
        }));
    };




    //------------------------------Category-----------------------------------------


    const [Category, setCategory] = useState({
        CategoryId: '',
        // Department: '',
        Category: '',


    });

    const [Categories, setCategories] = useState([]);
    const [IsCategoryGet, setIsCategoryGet] = useState(false)


    const CategoryColumns = [
        {
            key: "id",
            name: "Category Id",
            frozen: true
        },
        {
            key: "created_by",
            name: "Created By ",
            frozen: true
        },
        // {
        //     key: "Department",
        //     name: "Department Name",
        // },
        {
            key: "CategoryName",
            name: "Category Name",
        },

        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditCategorystatus(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                </>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditCategory(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ]




    const handleeditCategorystatus = (params) => {
        const data = { CategoryId: params.id, Statusedit: true }
        axios.post(`${UrlLink}Masters/Category_Detials_link`, data)
            .then((res) => {
                const resres = res.data
                console.log(resres);
                let typp = Object.keys(resres)[0]
                let mess = Object.values(resres)[0]
                const tdata = {
                    message: mess,
                    type: typp,
                }

                dispatchvalue({ type: 'toast', value: tdata });
                setIsCategoryGet(prev => !prev)
            })
            .catch((err) => {
                console.log(err);
            })
    }



    const handleeditCategory = (params) => {


        const { id, ...rest } = params;
        console.log(rest);
        setCategory((prev) => ({
            ...prev,
            CategoryId: id,
            // Department: rest?.DepartmentId,
            CategoryName: rest?.CategoryName

        }))
    };



    const handleCategorySubmit = () => {

        if (Category.Category) {

            const data = {
                ...Category,
                created_by: userRecord?.username || ''
            }
            axios.post(`${UrlLink}Masters/Category_Detials_link`, data)
                .then((res) => {
                    const resres = res.data
                    console.log(resres);
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsCategoryGet(prev => !prev)
                    setCategory({
                        CategoryId: '',
                        // Department: '',
                        Category: '',

                    })
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide both Ward Name and Location.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
    }

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Category_Detials_link`)
            .then((res) => {
                const ress = res.data
                setCategories(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [IsCategoryGet, UrlLink])


    const handleCategoryChange = (e) => {
        const { name, value } = e.target;
        setCategory((prevState) => ({
            ...prevState,
            [name]: value?.toUpperCase()?.trim(),
        }));
    };


    //------------------------- Category insert get update ----------------------------------------------------


    const [Designation, setDesignation] = useState({
        DesignationId: '',
        // Department: '',
        Designation: '',


    });

    const [Designations, setDesignations] = useState([])
    const [IsDesignationGet, setIsDesignationGet] = useState(false)


    const DesignationColumns = [
        {
            key: "id",
            name: "Designation Id",
            frozen: true
        },
        {
            key: "created_by",
            name: "Created By ",
            frozen: true
        },
        // {
        //     key: "Department",
        //     name: "Department Name",
        // },
        {
            key: "Designation",
            name: "Designation Name",
        },

        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditDesignationstatus(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                </>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditDesignation(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ]




    const handleeditDesignationstatus = (params) => {
        const data = { DesignationId: params.id, Statusedit: true }
        axios.post(`${UrlLink}Masters/Designation_Detials_link`, data)
            .then((res) => {
                const resres = res.data
                console.log(resres);
                let typp = Object.keys(resres)[0]
                let mess = Object.values(resres)[0]
                const tdata = {
                    message: mess,
                    type: typp,
                }

                dispatchvalue({ type: 'toast', value: tdata });
                setIsDesignationGet(prev => !prev)
            })
            .catch((err) => {
                console.log(err);
            })
    }



    const handleeditDesignation = (params) => {
        const { id, ...rest } = params
        console.log(rest);
        setDesignation((prev) => ({
            ...prev,
            DesignationId: id,
            // Department: rest?.DepartmentId,
            Designation: rest?.Designation

        }))
    }



    const handleDesignationSubmit = () => {

        if (Designation.Designation) {

            const data = {
                ...Designation,
                created_by: userRecord?.username || ''
            }
            axios.post(`${UrlLink}Masters/Designation_Detials_link`, data)
                .then((res) => {
                    const resres = res.data
                    console.log(resres);
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsDesignationGet(prev => !prev)
                    setDesignation({
                        DesignationId: '',
                        // Department: '',
                        Designation: '',

                    })
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide both Ward Name and Location.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
    }

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Designation_Detials_link`)
            .then((res) => {
                const ress = res.data
                setDesignations(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [IsDesignationGet, UrlLink])


    const handleDesignationChange = (e) => {
        const { name, value } = e.target;
        setDesignation((prevState) => ({
            ...prevState,
            [name]: value?.toUpperCase()?.trim(),
        }));
    };

    //-------------------------------Classification-----------------------------


    const [Classification, setClassification] = useState({
        ClassificationId: '',
        Classification: '',


    });

    const [Classifications, setClassifications] = useState([]);
    const [IsClassificationGet, setIsClassificationGet] = useState(false);


    const ClassificationColumns = [
        {
            key: "id",
            name: "Classification Id",
            frozen: true
        },
        {
            key: "created_by",
            name: "Created By ",
            frozen: true
        },

        {
            key: "Classification",
            name: "Classification Name",
        },

        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditClassificationstatus(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                </>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditClassification(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ]




    const handleeditClassificationstatus = (params) => {
        const data = { ClassificationId: params.id, Statusedit: true }
        axios.post(`${UrlLink}Masters/Classification_Detials_link`, data)
            .then((res) => {
                const resres = res.data
                console.log(resres);
                let typp = Object.keys(resres)[0]
                let mess = Object.values(resres)[0]
                const tdata = {
                    message: mess,
                    type: typp,
                }

                dispatchvalue({ type: 'toast', value: tdata });
                setIsClassificationGet(prev => !prev)
            })
            .catch((err) => {
                console.log(err);
            })
    }



    const handleeditClassification = (params) => {
        const { id, ...rest } = params
        console.log(rest);
        setClassification((prev) => ({
            ...prev,
            ClassificationId: id,

            Classification: rest?.Classification

        }))
    };



    const handleClassificationSubmit = () => {

        if (Classification.Classification) {

            const data = {
                ...Classification,
                created_by: userRecord?.username || ''
            }
            axios.post(`${UrlLink}Masters/Classification_Detials_link`, data)
                .then((res) => {
                    const resres = res.data
                    console.log(resres);
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsClassificationGet(prev => !prev);
                    setClassification({
                        ClassificationId: '',
                        Classification: '',

                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide Classification Name.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
    }

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Classification_Detials_link`)
            .then((res) => {
                const ress = res.data
                setClassifications(ress);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [IsClassificationGet, UrlLink])


    const handleClassificationChange = (e) => {
        const { name, value } = e.target;
        setClassification((prevState) => ({
            ...prevState,
            [name]: value?.toUpperCase()?.trim(),
        }));
    };

























    //------------------------------ Speciality insert get update---------------------------------------------

    const [Speciality, setSpeciality] = useState({
        SpecialityId: '',
        Category: '',
        SpecialityName: '',


    })

    const [SpecialityData, setSpecialityData] = useState([])
    const [IsSpecialityGet, setIsSpecialityGet] = useState(false)


    const SpecialityColumns = [
        {
            key: "id",
            name: "Speciality Id",
            frozen: true
        },
        {
            key: "created_by",
            name: "Created By ",
            frozen: true
        },
        {
            key: "CategoryName",
            name: "Designation",
        },
        {
            key: "SpecialityName",
            name: "Speciality",
        },

        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditSpecialitystatus(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                </>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditSpeciality(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ]





    const handleeditSpecialitystatus = (params) => {
        const data = { SpecialityId: params.id, Statusedit: true }
        axios.post(`${UrlLink}Masters/Speciality_Detials_link`, data)
            .then((res) => {
                const resres = res.data
                let typp = Object.keys(resres)[0]
                let mess = Object.values(resres)[0]
                const tdata = {
                    message: mess,
                    type: typp,
                }

                dispatchvalue({ type: 'toast', value: tdata });
                setIsSpecialityGet(prev => !prev)
            })
            .catch((err) => {
                console.log(err);
            })
    }



    const handleeditSpeciality = (params) => {
        const { id, ...rest } = params
        setSpeciality((prev) => ({
            ...prev,
            SpecialityId: id,
            Category: rest.CategoryId,
            SpecialityName: rest.SpecialityName
        }))
    }



    const handleSpecialitySubmit = () => {

        if (Speciality.SpecialityName && Speciality.Category) {

            const data = {
                ...Speciality,
                created_by: userRecord?.username || ''
            }
            axios.post(`${UrlLink}Masters/Speciality_Detials_link`, data)
                .then((res) => {
                    const resres = res.data
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsSpecialityGet(prev => !prev)
                    setSpeciality({
                        SpecialityId: '',
                        Category: '',
                        SpecialityName: '',

                    })
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide both Designation and Speciality.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
    }

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
            .then((res) => {
                const ress = res.data
                setSpecialityData(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [IsSpecialityGet, UrlLink])



    const handleSpecialityChange = (e) => {
        const { name, value } = e.target;
        setSpeciality((prevState) => ({
            ...prevState,
            [name]: value?.toUpperCase()?.trim(),
        }));
    };

    //------------------------ RoleName ---------------------------------------------------

    const [RoleName, setRoleName] = useState({
        RoleId: '',
        Role: '',


    })


    const [RoleNameData, setRoleNameData] = useState([])
    const [IsRoleNameget, setIsRoleNameget] = useState(false)

    const RoleColumns = [
        {
            key: "id",
            name: "Role Id",
            frozen: true
        },
        {
            key: "created_by",
            name: "Created By ",
            frozen: true
        },
        {
            key: "Role",
            name: "Role",
        },

        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditRolestatus(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                </>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditRole(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }


    ]

    const handleeditRolestatus = (params) => {
        const data = {
            RoleId: params.id,
            Statusedit: true
        }
        axios.post(`${UrlLink}Masters/UserControl_Role_link`, data)
            .then((res) => {
                const resres = res.data
                let typp = Object.keys(resres)[0]
                let mess = Object.values(resres)[0]
                const tdata = {
                    message: mess,
                    type: typp,
                }

                dispatchvalue({ type: 'toast', value: tdata });
                setIsRoleNameget(prev => !prev)
            })
            .catch((err) => {
                console.log(err);
            })
    }


    const handleeditRole = (params) => {
        const { id, ...rest } = params
        setRoleName((prev) => ({
            ...prev,
            RoleId: id,
            ...rest
        }))
    }


    const handleRolesubmit = () => {
        if (RoleName.Role) {
            const data = {
                ...RoleName,
                created_by: userRecord?.username || ''

                // created_by: LocationName.locationId ? LocationName.created_by : userRecord?.username || '',
            }
            axios.post(`${UrlLink}Masters/UserControl_Role_link`, data)
                .then((res) => {
                    const resData = res.data;
                    const mess = Object.values(resData)[0];
                    const typp = Object.keys(resData)[0];
                    const tdata = {
                        message: mess,
                        type: typp,
                    }



                    dispatchvalue({ type: 'toast', value: tdata })
                    setIsRoleNameget(prev => !prev)
                    setRoleName({
                        RoleId: '',
                        Role: '',


                    })
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide both Role Name.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }



    };


    useEffect(() => {
        axios.get(`${UrlLink}Masters/UserControl_Role_link`)
            .then((res) => {
                const ress = res.data
                setRoleNameData(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [IsRoleNameget, UrlLink])


    const handleRoleChange = (e) => {
        const { name, value } = e.target;
        setRoleName((prevState) => ({
            ...prevState,
            [name]: value?.toUpperCase()?.trim(),
        }));
    };


    // ---------------------Relegion---------------------

    const [religionName, setReligionName] = useState({
        religionId: '',
        religion: '',
    });

    const [religionNameData, setReligionNameData] = useState([]);
    const [isReligionNameGet, setIsReligionNameGet] = useState(false);

    const religionColumns = [
        {
            key: "id",
            name: "Religion Id",
            frozen: true
        },
        {
            key: "created_by",
            name: "Created By",
            frozen: true
        },
        {
            key: "religion",
            name: "Religion",
        },
        {
            key: "status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleEditReligionStatus(params.row)}
                    >
                        {params.row.status}
                    </Button>
                </>
            ),
        },
        {
            key: "action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleEditReligion(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ];

    const handleEditReligionStatus = (params) => {
        const data = {
            religionId: params.id,
            statusEdit: true
        };
        axios.post(`${UrlLink}Masters/Relegion_Master_link`, data)
            .then((res) => {
                const resData = res.data;
                const type = Object.keys(resData)[0];
                const message = Object.values(resData)[0];
                const tdata = {
                    message: message,
                    type: type,
                };
                dispatchvalue({ type: 'toast', value: tdata });
                setIsReligionNameGet(prev => !prev);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleEditReligion = (params) => {
        const { id, ...rest } = params;
        setReligionName((prev) => ({
            ...prev,
            religionId: id,
            ...rest
        }));
    };

    const handleReligionSubmit = () => {
        if (religionName.religion) {
            const data = {
                ...religionName,
                created_by: userRecord?.username || ''
            };
            axios.post(`${UrlLink}Masters/Relegion_Master_link`, data)
                .then((res) => {
                    const resData = res.data;
                    const message = Object.values(resData)[0];
                    const type = Object.keys(resData)[0];
                    const tdata = {
                        message: message,
                        type: type,
                    };
                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsReligionNameGet(prev => !prev);
                    setReligionName({
                        religionId: '',
                        religion: '',
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            const tdata = {
                message: 'Please provide Religion Name.',
                type: 'warn'
            };
            dispatchvalue({ type: 'toast', value: tdata });
        }
    };

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Relegion_Master_link`)
            .then((res) => {
                const resData = res.data;
                setReligionNameData(resData);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [isReligionNameGet, UrlLink]);

    const handleReligionChange = (e) => {
        const { name, value } = e.target;
        setReligionName((prevState) => ({
            ...prevState,
            [name]: value?.toUpperCase()?.trim(),
        }));
    };

    //--------------------------- Caste ------------------------------------------------

    const [CastName, setCastName] = useState({
        CastId: '',
        Cast: '',
    });

    const [CastNameData, setCastNameData] = useState([]);
    const [isCastNameGet, setIsCastNameGet] = useState(false);


    const CastColumns = [
        {
            key: "id",
            name: "Cast Id",
            frozen: true
        },
        {
            key: "created_by",
            name: "Created By",
            frozen: true
        },
        {
            key: "Cast",
            name: "CastName",
        },
        {
            key: "status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleEditCastStatus(params.row)}
                    >
                        {params.row.status}
                    </Button>
                </>
            ),
        },
        {
            key: "action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleEditCast(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ];

    const handleEditCastStatus = (params) => {
        const data = {
            CastId: params.id,
            statusEdit: true
        };
        axios.post(`${UrlLink}Masters/Cast_Master_link`, data)
            .then((res) => {
                const resData = res.data;
                const type = Object.keys(resData)[0];
                const message = Object.values(resData)[0];
                const tdata = {
                    message: message,
                    type: type,
                };
                dispatchvalue({ type: 'toast', value: tdata });
                setIsCastNameGet(prev => !prev);
            })
            .catch((err) => {
                console.log(err);
            });
    };


    const handleEditCast = (params) => {
        const { id, ...rest } = params;
        setCastName((prev) => ({
            ...prev,
            CastId: id,
            ...rest
        }));
    };

    const handleCastSubmit = () => {
        if (CastName.Cast) {
            const data = {
                ...CastName,
                created_by: userRecord?.username || ''
            };
            axios.post(`${UrlLink}Masters/Cast_Master_link`, data)
                .then((res) => {
                    const resData = res.data;
                    const message = Object.values(resData)[0];
                    const type = Object.keys(resData)[0];
                    const tdata = {
                        message: message,
                        type: type,
                    };
                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsCastNameGet(prev => !prev);
                    setCastName({
                        CastId: '',
                        Cast: '',
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            const tdata = {
                message: 'Please provide Religion Name.',
                type: 'warn'
            };
            dispatchvalue({ type: 'toast', value: tdata });
        }
    };


    useEffect(() => {
        axios.get(`${UrlLink}Masters/Cast_Master_link`)
            .then((res) => {
                const resData = res.data;
                setCastNameData(resData);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [isCastNameGet, UrlLink]);

    const handleCastChange = (e) => {
        const { name, value } = e.target;
        setCastName((prevState) => ({
            ...prevState,
            [name]: value?.toUpperCase()?.trim(),
        }));
    };

    // --------------------------- Title ------------------------------------------------

    const [TitleName, setTitleName] = useState({
        TitleId: '',
        Title: '',
    });

    const [TitleNameData, setTitleNameData] = useState([]);
    const [isTitleNameGet, setIsTitleNameGet] = useState(false);


    const TitleColumns = [
        {
            key: "id",
            name: "Title Id",
            frozen: true
        },
        {
            key: "created_by",
            name: "Created By",
            frozen: true
        },
        {
            key: "Title",
            name: "TitleName",
        },
        {
            key: "status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleEditTitleStatus(params.row)}
                    >
                        {params.row.status}
                    </Button>
                </>
            ),
        },
        {
            key: "action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleEditTitle(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ];

    const handleEditTitleStatus = (params) => {
        const data = {
            TitleId: params.id,
            statusEdit: true
        };
        axios.post(`${UrlLink}Masters/Title_Master_link`, data)
            .then((res) => {
                const resData = res.data;
                const type = Object.keys(resData)[0];
                const message = Object.values(resData)[0];
                const tdata = {
                    message: message,
                    type: type,
                };
                dispatchvalue({ type: 'toast', value: tdata });
                setIsTitleNameGet(prev => !prev);
            })
            .catch((err) => {
                console.log(err);
            });
    };


    const handleEditTitle = (params) => {
        const { id, ...rest } = params;
        setTitleName((prev) => ({
            ...prev,
            TitleId: id,
            ...rest
        }));
    };

    const handleTitleSubmit = () => {
        if (TitleName.Title) {
            const data = {
                ...TitleName,
                created_by: userRecord?.username || ''
            };
            axios.post(`${UrlLink}Masters/Title_Master_link`, data)
                .then((res) => {
                    const resData = res.data;
                    const message = Object.values(resData)[0];
                    const type = Object.keys(resData)[0];
                    const tdata = {
                        message: message,
                        type: type,
                    };
                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsTitleNameGet(prev => !prev);
                    setTitleName({
                        TitleId: '',
                        Title: '',
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            const tdata = {
                message: 'Please provide Title.',
                type: 'warn'
            };
            dispatchvalue({ type: 'toast', value: tdata });
        }
    };


    useEffect(() => {
        axios.get(`${UrlLink}Masters/Title_Master_link`)
            .then((res) => {
                const resData = res.data;
                setTitleNameData(resData);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [isTitleNameGet, UrlLink]);

    const handleTitleChange = (e) => {
        const { name, value } = e.target;
        setTitleName((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };


    // --------------------------- Triage Category  ------------------------------------------------

    const [TriageCategory, setTriageCategory] = useState({
        Triage_Id: '',
        Description: '',

    });

    const [TriageCategoryData, setTriageCategoryData] = useState([]);
    const [isTriageCategoryGet, setIsTriageCategoryGet] = useState(false);


    const TriageCategoryColumns = [
        {
            key: "id",
            name: "Triage_Id",
            frozen: true
        },
        {
            key: "created_by",
            name: "Created By",
            frozen: true
        },
        {
            key: "Category",
            name: "Category",
        },
        {
            key: "Description",
            name: "Description",
        },
        {
            key: "Colour",
            name: "Colour",
            renderCell: (params) => (
                <span
                    style={{
                        display: 'inline-block',
                        alignItems:'center',
                        height: '20px',
                        width: '20px',
                        backgroundColor: params.row.Colour,
                        borderRadius: '4px', // Optional: for a rounded look
                        border: '1px solid #ccc' // Optional: adds border for visibility
                    }}
                ></span>
                // <span style={{ height: '20px', width: '20px', backgroundColor: params.row.Colour }}></span>
            ),
        },

        // {
        //     key: "Colour",
        //     name: "Colour",
        // },

        {
            key: "status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleEditTriageCategoryStatus(params.row)}
                    >
                        {params.row.status}
                    </Button>
                </>
            ),
        },
        {
            key: "action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleEditTriageCategory(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ];

    const handleEditTriageCategoryStatus = (params) => {
        const data = {
            Triage_Id: params.id,
            statusEdit: true
        };
        axios.post(`${UrlLink}Masters/TriageCategory_Master_link`, data)
            .then((res) => {
                const resData = res.data;
                const type = Object.keys(resData)[0];
                const message = Object.values(resData)[0];
                const tdata = {
                    message: message,
                    type: type,
                };
                dispatchvalue({ type: 'toast', value: tdata });
                setIsTriageCategoryGet(prev => !prev);
            })
            .catch((err) => {
                console.log(err);
            });
    };


    const handleEditTriageCategory = (params) => {
        const { id, Description } = params; // Only keep id and Description
        setTriageCategory((prev) => ({
            ...prev,
            Triage_Id: id,
            Description: Description,
        }));
    };


    const handleTriageCategorySubmit = () => {
        const data = {
            Triage_Id: TriageCategory.Triage_Id,
            Description: TriageCategory.Description,
        };

        axios.post(`${UrlLink}Masters/TriageCategory_Master_link`, data)
            .then((res) => {
                const resData = res.data;
                const message = Object.values(resData)[0];
                const type = Object.keys(resData)[0];
                const tdata = {
                    message: message,
                    type: type,
                };
                dispatchvalue({ type: 'toast', value: tdata });
                setIsTriageCategoryGet((prev) => !prev);
                setTriageCategory({
                    Triage_Id: '',
                    Description: '',
                });
            })
            .catch((err) => {
                console.log(err);
            });

        // Notify user if Description is missing
        if (!TriageCategory.Description) {
            const tdata = {
                message: 'Please provide Triage Category Description.',
                type: 'warn'
            };
            dispatchvalue({ type: 'toast', value: tdata });
        }
    };



    useEffect(() => {
        axios.get(`${UrlLink}Masters/TriageCategory_Master_link`)
            .then((res) => {
                const resData = res.data;
                setTriageCategoryData(resData);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [isTriageCategoryGet, UrlLink]);

    const handleTriageCategoryChange = (e) => {
        const { name, value } = e.target;
        setTriageCategory((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    //--------------------------- BloodGroup ------------------------------------------------

    const [BloodGroupName, setBloodGroupName] = useState({
        BloodGroupId: '',
        BloodGroup: '',
    });

    const [BloodGroupNameData, setBloodGroupNameData] = useState([]);
    const [isBloodGroupNameGet, setIsBloodGroupNameGet] = useState(false);


    const BloodGroupColumns = [
        {
            key: "id",
            name: "BloodGroup Id",
            frozen: true
        },
        {
            key: "created_by",
            name: "Created By",
            frozen: true
        },
        {
            key: "BloodGroup",
            name: "BloodGroupName",
        },
        {
            key: "status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleEditBloodGroupStatus(params.row)}
                    >
                        {params.row.status}
                    </Button>
                </>
            ),
        },
        {
            key: "action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleEditBloodGroup(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ];

    const handleEditBloodGroupStatus = (params) => {
        const data = {
            BloodGroupId: params.id,
            statusEdit: true
        };
        axios.post(`${UrlLink}Masters/BloodGroup_Master_link`, data)
            .then((res) => {
                const resData = res.data;
                const type = Object.keys(resData)[0];
                const message = Object.values(resData)[0];
                const tdata = {
                    message: message,
                    type: type,
                };
                dispatchvalue({ type: 'toast', value: tdata });
                setIsBloodGroupNameGet(prev => !prev);
            })
            .catch((err) => {
                console.log(err);
            });
    };


    const handleEditBloodGroup = (params) => {
        const { id, ...rest } = params;
        setBloodGroupName((prev) => ({
            ...prev,
            BloodGroupId: id,
            ...rest
        }));
    };

    const handleBloodGroupSubmit = () => {
        if (BloodGroupName.BloodGroup) {
            const data = {
                ...BloodGroupName,
                created_by: userRecord?.username || ''
            };
            axios.post(`${UrlLink}Masters/BloodGroup_Master_link`, data)
                .then((res) => {
                    const resData = res.data;
                    const message = Object.values(resData)[0];
                    const type = Object.keys(resData)[0];
                    const tdata = {
                        message: message,
                        type: type,
                    };
                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsBloodGroupNameGet(prev => !prev);
                    setBloodGroupName({
                        BloodGroupId: '',
                        BloodGroup: '',
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            const tdata = {
                message: 'Please provide BloodGroup.',
                type: 'warn'
            };
            dispatchvalue({ type: 'toast', value: tdata });
        }
    };


    useEffect(() => {
        axios.get(`${UrlLink}Masters/BloodGroup_Master_link`)
            .then((res) => {
                const resData = res.data;
                setBloodGroupNameData(resData);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [isBloodGroupNameGet, UrlLink]);

    const handleBloodGroupChange = (e) => {
        const { name, value } = e.target;
        setBloodGroupName((prevState) => ({
            ...prevState,
            [name]: value.toUpperCase(),
        }));
    };


    //---------------------------------------------------------------------------grade--------------
    const [roomnames, setRoomNames] = useState([]);
    useEffect(() => {
        const fetchRoomNames = async () => {
            try {
                // Reset error before attempting fetch
                const response = await axios.get(`${UrlLink}Masters/Active_Rooms_link`);
                setRoomNames(response.data);
                console.log("RoomNames:", response.data);
            } catch (err) {
                console.error("Error fetching test names:", err);

            }
        };

        fetchRoomNames();
    }, [UrlLink]);
    const [GradeName, setGradeName] = useState({
        GradeNameId: '',
        GradeName: '',
        Roomid: "",
        Roomtype: "",
    });

    const [GradeNameData, setGradeNameData] = useState([]);
    const [isGradeNameGet, setIsGradeNameGet] = useState(false);


    const GradeNameColumns = [
        {
            key: "id",
            name: "GradeName Id",
            frozen: true
        },
        {
            key: "created_by",
            name: "Created By",
            frozen: true
        },
        {
            key: "GradeName",
            name: "GradeName",
        },
        {
            key: "Roomtype",
            name: "RoomName",
        },
        {
            key: "status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleEditGradeNameStatus(params.row)}
                    >
                        {params.row.status}
                    </Button>
                </>
            ),
        },
        {
            key: "action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleEditGradeName(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ];

    const handleEditGradeNameStatus = (params) => {
        const data = {
            GradeNameId: params.id,
            statusEdit: true
        };
        axios.post(`${UrlLink}Masters/GradeName_Master_link`, data)
            .then((res) => {
                const resData = res.data;
                const type = Object.keys(resData)[0];
                const message = Object.values(resData)[0];
                const tdata = {
                    message: message,
                    type: type,
                };
                dispatchvalue({ type: 'toast', value: tdata });
                setIsGradeNameGet(prev => !prev);
            })
            .catch((err) => {
                console.log(err);
            });
    };


    const handleEditGradeName = (params) => {
        const { id, ...rest } = params;
        setGradeName((prev) => ({
            ...prev,
            GradeNameId: id,
            ...rest
        }));
    };

    const handleGradeNameSubmit = () => {
        if (GradeName.GradeName) {
            const data = {
                ...GradeName,
                created_by: userRecord?.username || ''
            };
            axios.post(`${UrlLink}Masters/GradeName_Master_link`, data)
                .then((res) => {
                    const resData = res.data;
                    const message = Object.values(resData)[0];
                    const type = Object.keys(resData)[0];
                    const tdata = {
                        message: message,
                        type: type,
                    };
                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsGradeNameGet(prev => !prev);
                    setGradeName({
                        GradeNameId: '',
                        GradeName: '',
                        Roomid: '',
                        Roomtype: "",
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            const tdata = {
                message: 'Please provide GradeName.',
                type: 'warn'
            };
            dispatchvalue({ type: 'toast', value: tdata });
        }
    };


    useEffect(() => {
        axios.get(`${UrlLink}Masters/GradeName_Master_link`)
            .then((res) => {
                const resData = res.data;
                setGradeNameData(resData);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [isGradeNameGet, UrlLink]);

    const handleGradeNameChange = (e) => {
        const { name, value } = e.target;
        if (name === 'Roomtype') {
            const selectedroom = roomnames.find(room => room.RoomName === value);
            if (selectedroom) {
                setGradeName((prev) => ({
                    ...prev,
                    Roomtype: value,
                    Roomid: selectedroom.id || "",

                }));
            }
            else {
                setGradeName((prev) => ({
                    ...prev,
                    Roomtype: "",
                    Roomid: "",

                }));

            }
        }
        else {
            setGradeName((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }

    };

    // --------------------


    //------------------------------PaymentMode--------------------------------------------
    const [PaymentMode, setPaymentMode] = useState({
        PaymentModeId: '',
        PaymentMode: '',
    })

    const handlePaymentNameChange = (e) => {
        const { name, value } = e.target;
        setPaymentMode((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    const [PaymentModeData, setPaymentModeData] = useState([]);
    const [isPaymentGet, setIsPaymentGet] = useState(false);


    const PaymentModeColumns = [
        {
            key: "id",
            name: "Payment Id",
            frozen: true
        },
        {
            key: "created_by",
            name: "Created By",
            frozen: true
        },
        {
            key: "GradeName",
            name: "Payment Name",
        },

        {
            key: "status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleEditPaymentStatus(params.row)}
                    >
                        {params.row.status}
                    </Button>
                </>
            ),
        },
        {
            key: "action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleEditPaymentMOde(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ];

    const handleEditPaymentStatus = (params) => {
        const data = {
            PaymentModeId: params.id,
            statusEdit: true
        };
        axios.post(`${UrlLink}Masters/PaymentMode_Master_link`, data)
            .then((res) => {
                const resData = res.data;
                const type = Object.keys(resData)[0];
                const message = Object.values(resData)[0];
                const tdata = {
                    message: message,
                    type: type,
                };
                dispatchvalue({ type: 'toast', value: tdata });
                setIsPaymentGet(prev => !prev);
            })
            .catch((err) => {
                console.log(err);
            });
    };


    const handleEditPaymentMOde = (params) => {
        const { id, GradeName } = params;
        setPaymentMode((prev) => ({
            ...prev,
            PaymentModeId: id,
            PaymentMode: GradeName,
        }));
    };

    const handlePaymentModeSubmit = () => {
        if (PaymentMode.PaymentMode) {
            const data = {
                ...PaymentMode,
                created_by: userRecord?.username || ''
            };
            axios.post(`${UrlLink}Masters/PaymentMode_Master_link`, data)
                .then((res) => {
                    const resData = res.data;
                    const message = Object.values(resData)[0];
                    const type = Object.keys(resData)[0];
                    const tdata = {
                        message: message,
                        type: type,
                    };
                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsPaymentGet(prev => !prev);
                    setPaymentMode({
                        PaymentModeId: '',
                        PaymentMode: '',
                    });
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            const tdata = {
                message: 'Please provide PaymentMode Name.',
                type: 'warn'
            };
            dispatchvalue({ type: 'toast', value: tdata });
        }
    };


    useEffect(() => {
        axios.get(`${UrlLink}Masters/PaymentMode_Master_link`)
            .then((res) => {
                const resData = res.data;
                setPaymentModeData(resData);
            })
            .catch((err) => {
                console.log(err);
            });
    }, [isPaymentGet, UrlLink]);

    // --------------------

    //----------------------------------Expenses-----------------------------------------

    const [Expenses, setExpenses] = useState({
        ExpensesId: '',
        ExpensesName: '',
    });

    const [ExpensesArr, setExpensesArr] = useState([])
    const [IsExpensesArrGet, setIsExpensesArrGet] = useState(false)

    const handleExpensesChange = (e) => {
        const { name, value } = e.target;
        setExpenses((prevState) => ({
            ...prevState,
            [name]: value?.toUpperCase()?.trim(),
        }));
    };


    const handleeditExpenses = (params) => {
        const { id, ...rest } = params
        console.log(rest);
        setExpenses((prev) => ({
            ...prev,
            ExpensesId: id,
            ExpensesName: rest?.ExpensesName

        }))
    }


    const handleeditExpensesstatus = (params) => {
        const data = { ExpensesId: +params.id, Statusedit: true }
        axios.post(`${UrlLink}Masters/Expenses_Master_link`, data)
            .then((res) => {
                const resres = res.data
                console.log(resres);
                let typp = Object.keys(resres)[0]
                let mess = Object.values(resres)[0]
                const tdata = {
                    message: mess,
                    type: typp,
                }

                dispatchvalue({ type: 'toast', value: tdata });
                setIsExpensesArrGet(prev => !prev)
            })
            .catch((err) => {
                console.log(err);
            })
    }



    const ExpensesColumns = [
        {
            key: "id",
            name: "Expenses Id",
            frozen: true
        },
        {
            key: "created_by",
            name: "Created By ",
            frozen: true
        },
        {
            key: "ExpensesName",
            name: "Expenses Name",
        },

        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditExpensesstatus(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                </>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditExpenses(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ]




    const handleExpensesSubmit = () => {

        if (Expenses.ExpensesName) {

            const data = {
                ...Expenses,
                created_by: userRecord?.username || ''
            }
            axios.post(`${UrlLink}Masters/Expenses_Master_link`, data)
                .then((res) => {
                    const resres = res.data
                    console.log(resres);
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsExpensesArrGet(prev => !prev)
                    setExpenses({
                        ExpensesId: '',
                        ExpensesName: '',
                    })
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide both Ward Name and Location.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
    }


    useEffect(() => {
        axios.get(`${UrlLink}Masters/Expenses_Master_link`)
            .then((res) => {
                const ress = res.data
                setExpensesArr(ress)
            })
            .catch((err) => {
                console.log(err);
            })
    }, [IsExpensesArrGet, UrlLink])


    // ----------------------IntakeType-------------------------------------

    const [IntakeType, setIntakeType] = useState({
        IntakeTypeId: '',
        IntakeTypeName: '',
    });

    const [IntakeTypeArr, setIntakeTypeArr] = useState([]);
    const [isIntakeTypeArr, setisIntakeTypeArr] = useState(false)

    const handleeditIntakeType = (params) => {
        const { id, ...rest } = params
        console.log(rest);
        setIntakeType((prev) => ({
            ...prev,
            IntakeTypeId: id,
            IntakeTypeName: rest?.IntakeTypeName,
        }))

    }

    const handleedite_IntakeType_status = (params) => {
        const data = { ExpensesId: +params.id, Statusedit: true }
        axios.post(`${UrlLink}Masters/IntakeType_Master_link`, data)
            .then((res) => {
                const resres = res.data
                console.log(resres);
                let typp = Object.keys(resres)[0]
                let mess = Object.values(resres)[0]
                const tdata = {
                    message: mess,
                    type: typp,
                }

                dispatchvalue({ type: 'toast', value: tdata });
                setisIntakeTypeArr(prev => !prev)
            })
            .catch((err) => {
                console.log(err);
            })
    }


    const IntakeTypeColumns = [
        { key: 'id', name: 'ID' },
        { key: 'IntakeTypeName', name: 'Intake Type Name' },
        { key: 'created_by', name: 'Created By' },
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleedite_IntakeType_status(params.row)}
                    >
                        {params.row.Status}
                    </Button>
                </>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <>
                    <Button
                        className="cell_btn"
                        onClick={() => handleeditIntakeType(params.row)}
                    >
                        <EditIcon className="check_box_clrr_cancell" />
                    </Button>
                </>
            ),
        }
    ];

    const handleIntakeTypeChange = (e) => {
        const { name, value } = e.target;
        setIntakeType((prevState) => ({
            ...prevState,
            [name]: value?.toUpperCase()?.trim(),
        }));
    };

    const fetchIntakeTypes = async () => {
        try {
            const response = await axios.get(`${UrlLink}Masters/IntakeType_Master_link`);
            console.log("IntakeType_Master_link get :", response.data);

            setIntakeTypeArr(response.data);
        } catch (error) {
            console.error('Error fetching intake types:', error);
        }
    };

    const handleIntakeTypeSubmit = async () => {
        try {
            const payload = {
                IntakeTypeId: IntakeType.IntakeTypeId,
                IntakeTypeName: IntakeType.IntakeTypeName,
                created_by: userRecord?.username || '',
            };

            const response = await axios.post(`${UrlLink}Masters/IntakeType_Master_link`, payload);
            console.log("Pots IntakeType_Master_link:", response.data)

            if (response.data.success) {
                // alert(response.data.success);
                setIntakeType({ IntakeTypeId: '', IntakeTypeName: '' });
                fetchIntakeTypes();
            } else if (response.data.warn) {
                // alert(response.data.warn);
            }
        } catch (error) {
            console.error('Error submitting intake type:', error);
            alert('An error occurred while submitting');
        }
    };

    useEffect(() => {
        if (FlaggNamePage === 'IntakeType') {
            fetchIntakeTypes();
        }
    }, [isIntakeTypeArr, FlaggNamePage]);

    // -------------------------------------IntakeMode------------------------------------------------------


    const [IntakeMode, setIntakeMode] = useState({
        IntakeModeId: '',
        IntakeModeName: '',
    });

    const [IntakeModeArr, setIntakeModeArr] = useState([]);
    const [isIntakeModeArr, setIsIntakeModeArr] = useState(false);

    const handleEditIntakeMode = (params) => {
        const { id, ...rest } = params;
        setIntakeMode((prev) => ({
            ...prev,
            IntakeModeId: id,
            IntakeModeName: rest?.IntakeModeName,
        }));
    };

    const handleEditIntakeModeStatus = (params) => {
        const data = { IntakeModeId: +params.id, Statusedit: true };
        axios.post(`${UrlLink}Masters/IntakeMode_Master_link`, data)
            .then((res) => {
                const resres = res.data;
                let typp = Object.keys(resres)[0];
                let mess = Object.values(resres)[0];
                const tdata = {
                    message: mess,
                    type: typp,
                };
                dispatchvalue({ type: 'toast', value: tdata });
                setIsIntakeModeArr(prev => !prev);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const IntakeModeColumns = [
        { key: 'id', name: 'ID' },
        { key: 'IntakeModeName', name: 'Intake Mode Name' },
        { key: 'created_by', name: 'Created By' },
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <Button
                    className="cell_btn"
                    onClick={() => handleEditIntakeModeStatus(params.row)}
                >
                    {params.row.Status}
                </Button>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <Button
                    className="cell_btn"
                    onClick={() => handleEditIntakeMode(params.row)}
                >
                    <EditIcon className="check_box_clrr_cancell" />
                </Button>
            ),
        }
    ];

    const handleIntakeModeChange = (e) => {
        const { name, value } = e.target;
        setIntakeMode((prevState) => ({
            ...prevState,
            [name]: value?.toUpperCase()?.trim(),
        }));
    };

    const fetchIntakeModes = async () => {
        try {
            const response = await axios.get(`${UrlLink}Masters/IntakeMode_Master_link`);
            setIntakeModeArr(response.data);
        } catch (error) {
            console.error('Error fetching intake modes:', error);
        }
    };

    const handleIntakeModeSubmit = async () => {
        try {
            const payload = {
                IntakeModeId: IntakeMode.IntakeModeId,
                IntakeModeName: IntakeMode.IntakeModeName,
                created_by: userRecord?.username || '',
            };

            const response = await axios.post(`${UrlLink}Masters/IntakeMode_Master_link`, payload);
            if (response.data.success) {
                setIntakeMode({ IntakeModeId: '', IntakeModeName: '' });
                fetchIntakeModes();
            } else if (response.data.warn) {
                // Handle warning
            }
        } catch (error) {
            console.error('Error submitting intake mode:', error);
            alert('An error occurred while submitting');
        }
    };

    useEffect(() => {
        if (FlaggNamePage === 'IntakeMode') {
            fetchIntakeModes();
        }
    }, [isIntakeModeArr, FlaggNamePage]);

    // --------------------------------------------Measurement------------------------------------------------------

    const [Measurement, setMeasurement] = useState({
        MeasurementId: '',
        MeasurementName: '',
    });

    const [MeasurementArr, setMeasurementArr] = useState([]);
    const [isMeasurementArr, setIsMeasurementArr] = useState(false);

    const handleEditMeasurement = (params) => {
        const { id, ...rest } = params;
        setMeasurement((prev) => ({
            ...prev,
            MeasurementId: id,
            MeasurementName: rest?.MeasurementName,
        }));
    };

    const handleEditMeasurementStatus = (params) => {
        const data = { MeasurementId: +params.id, Statusedit: true };
        axios.post(`${UrlLink}Masters/Measurement_Master_link`, data)
            .then((res) => {
                const resres = res.data;
                let typp = Object.keys(resres)[0];
                let mess = Object.values(resres)[0];
                const tdata = {
                    message: mess,
                    type: typp,
                };
                dispatchvalue({ type: 'toast', value: tdata });
                setIsMeasurementArr(prev => !prev);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const MeasurementColumns = [
        { key: 'id', name: 'ID' },
        { key: 'MeasurementName', name: 'Measurement Name' },
        { key: 'created_by', name: 'Created By' },
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <Button
                    className="cell_btn"
                    onClick={() => handleEditMeasurementStatus(params.row)}
                >
                    {params.row.Status}
                </Button>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <Button
                    className="cell_btn"
                    onClick={() => handleEditMeasurement(params.row)}
                >
                    <EditIcon className="check_box_clrr_cancell" />
                </Button>
            ),
        }
    ];

    const handleMeasurementChange = (e) => {
        const { name, value } = e.target;
        setMeasurement((prevState) => ({
            ...prevState,
            [name]: value?.toUpperCase()?.trim(),
        }));
    };

    const fetchMeasurements = async () => {
        try {
            const response = await axios.get(`${UrlLink}Masters/Measurement_Master_link`);
            setMeasurementArr(response.data);
        } catch (error) {
            console.error('Error fetching measurements:', error);
        }
    };

    const handleMeasurementSubmit = async () => {
        try {
            const payload = {
                MeasurementId: Measurement.MeasurementId,
                MeasurementName: Measurement.MeasurementName,
                created_by: userRecord?.username || '',
            };

            const response = await axios.post(`${UrlLink}Masters/Measurement_Master_link`, payload);
            if (response.data.success) {
                setMeasurement({ MeasurementId: '', MeasurementName: '' });
                fetchMeasurements();
            } else if (response.data.warn) {
                // Handle warning
            }
        } catch (error) {
            console.error('Error submitting measurement:', error);
            alert('An error occurred while submitting');
        }
    };

    useEffect(() => {
        if (FlaggNamePage === 'Measurement') {
            fetchMeasurements();
        }
    }, [isMeasurementArr, FlaggNamePage]);



    // -------------------------------------------------------------------------------------------
    return (
        <>
            <div className="Main_container_app">
                <h3>Basic Masters</h3>
                <div className="RegisterTypecon">
                    <div className="RegisterType eced_p00">
                        {["Flag", "Department", "Classification", 'Category', "Designation", "Speciality", "Title", "Roles", "Relegion", "Caste", "Triage", "BloodGroup", "GradeName", 'PaymentMode', 'Expenses', 'IntakeType','IntakeMode','Measurement'].map((p, ind) => (
                            <div className="registertypeval registertypeval_222" key={ind}>
                                <input
                                    type="radio"
                                    id={p}
                                    name="appointment_type"
                                    checked={FlaggNamePage === p}
                                    onChange={(e) => {
                                        setFlaggNamePage(e.target.value)
                                    }}
                                    value={p}
                                />
                                <label htmlFor={p}>
                                    {p}
                                </label>
                            </div>
                        ))}
                    </div>

                </div>

                {/*---------------Flagging-----------------------------*/}
                {FlaggNamePage === 'Flag' && <>
                    <div className="common_center_tag">
                        <span> Color Flagging</span>
                    </div>
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label> Flagg Name <span>:</span> </label>
                            <input
                                type="text"
                                placeholder='Enter Flagg Name'
                                name='FlaggName'
                                required
                                value={FlaggName.FlaggName}
                                onChange={handleFlaggInputChange}
                            />
                        </div>
                        <div className="RegisForm_1">
                            <label> Flagg Color <span>:</span> </label>
                            <input
                                style={{ border: '0px' }}
                                type="color"
                                name='FlaggColor'
                                required
                                value={FlaggName.FlaggColor}
                                onChange={handleFlaggInputChange}
                            />
                        </div>
                    </div>

                    <div className="Main_container_Btn">
                        <button onClick={handleFlaggsubmit}>
                            {FlaggName.FlaggId ? 'Update' : 'Save'}
                        </button>
                    </div>

                    {FlaggData.length > 0 &&
                        <ReactGrid columns={FlaggColumns} RowData={FlaggData} />
                    }
                </>}



                {/*------------------Departments--------------------- */}

                {FlaggNamePage === 'Department' && <>
                    <div className="common_center_tag">
                        <span>Departments</span>
                    </div>

                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label> Department Name <span>:</span> </label>
                            <input
                                type="text"
                                name='DepartmentName'
                                required
                                value={DepartmentName.DepartmentName}
                                onChange={handleDepartmentChange}
                            />
                        </div>

                    </div>

                    <div className="Main_container_Btn">
                        <button onClick={handleDepartmentSubmit}>
                            {DepartmentName.DepartmentId ? "Update" : "Add"}
                        </button>
                    </div>
                    {Departments.length > 0 &&
                        <ReactGrid columns={DepartmentColumns} RowData={Departments} />
                    }
                </>}
                {/*------------------Category--------------------- */}

                {FlaggNamePage === 'Category' && <>
                    <div className="common_center_tag">
                        <span>Category</span>
                    </div>
                    <div className="RegisFormcon_1">
                        {/* <div className="RegisForm_1">
                        <label> Department <span>:</span> </label>

                        <select
                            name='Department'
                            required
                            value={Designation.Department}
                            onChange={handleDesignationChange}
                        >
                            <option value=''>Select Department</option>
                            {Departments.filter(p => p.Status === 'Active').map((dept, indx) => (
                                <option key={indx} value={dept.id}>
                                    {dept.DepartmentName}
                                </option>
                            ))}
                        </select>
                    </div> */}
                        <div className="RegisFormcon_1">
                            <div className="RegisForm_1">
                                <label> Category <span>:</span> </label>
                                <input
                                    type="text"
                                    name='Category'
                                    required
                                    value={Category.Category}
                                    onChange={handleCategoryChange}
                                />
                            </div>

                        </div>
                    </div>



                    <div className="Main_container_Btn">
                        <button onClick={handleCategorySubmit}>
                            {Category.CategoryId ? "Update" : "Add"}
                        </button>
                    </div>
                    {Categories.length > 0 &&
                        <ReactGrid columns={CategoryColumns} RowData={Categories} />
                    }
                </>}

                {/*------------------Designation--------------------- */}

                {FlaggNamePage === 'Designation' && <>
                    <div className="common_center_tag">
                        <span>Designations</span>
                    </div>
                    <div className="RegisFormcon_1">
                        {/* <div className="RegisForm_1">
                        <label> Department <span>:</span> </label>

                        <select
                            name='Department'
                            required
                            value={Designation.Department}
                            onChange={handleDesignationChange}
                        >
                            <option value=''>Select Department</option>
                            {Departments.filter(p => p.Status === 'Active').map((dept, indx) => (
                                <option key={indx} value={dept.id}>
                                    {dept.DepartmentName}
                                </option>
                            ))}
                        </select>
                    </div> */}
                        <div className="RegisFormcon_1">
                            <div className="RegisForm_1">
                                <label> Designation <span>:</span> </label>
                                <input
                                    type="text"
                                    name='Designation'
                                    required
                                    value={Designation.Designation}
                                    onChange={handleDesignationChange}
                                />
                            </div>

                        </div>
                    </div>



                    <div className="Main_container_Btn">
                        <button onClick={handleDesignationSubmit}>
                            {Designation.DesignationId ? "Update" : "Add"}
                        </button>
                    </div>
                    {Designations.length > 0 &&
                        <ReactGrid columns={DesignationColumns} RowData={Designations} />
                    }
                </>}






                {/*------------------Classification--------------------- */}

                {FlaggNamePage === 'Classification' && <>
                    <div className="common_center_tag">
                        <span>Classification</span>
                    </div>
                    <div className="RegisFormcon_1">
                        {/* <div className="RegisForm_1">
                        <label> Department <span>:</span> </label>

                        <select
                            name='Department'
                            required
                            value={Designation.Department}
                            onChange={handleDesignationChange}
                        >
                            <option value=''>Select Department</option>
                            {Departments.filter(p => p.Status === 'Active').map((dept, indx) => (
                                <option key={indx} value={dept.id}>
                                    {dept.DepartmentName}
                                </option>
                            ))}
                        </select>
                    </div> */}
                        <div className="RegisFormcon_1">
                            <div className="RegisForm_1">
                                <label> Classification <span>:</span> </label>
                                <input
                                    type="text"
                                    name='Classification'
                                    required
                                    value={Classification.Classification}
                                    onChange={handleClassificationChange}
                                />
                            </div>

                        </div>
                    </div>



                    <div className="Main_container_Btn">
                        <button onClick={handleClassificationSubmit}>
                            {Classification.ClassificationId ? "Update" : "Add"}
                        </button>
                    </div>
                    {Designations.length > 0 &&
                        <ReactGrid columns={ClassificationColumns} RowData={Classifications} />
                    }
                </>}
                {/*------------------Speciality--------------------- */}

                {FlaggNamePage === 'Speciality' && <>
                    <div className="common_center_tag">
                        <span>Speciality</span>
                    </div>

                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label> Category <span>:</span> </label>

                            <select
                                name='Category'
                                required
                                value={Speciality.Category}
                                onChange={handleSpecialityChange}
                            >
                                <option value=''>Select Category</option>
                                {Categories.filter(p => p.Status === 'Active')?.map((Catg, indx) => (
                                    <option key={indx} value={Catg.id}>
                                        {Catg.CategoryName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="RegisForm_1">
                            <label> Speciality <span>:</span> </label>
                            <input
                                type="text"
                                name='SpecialityName'
                                required
                                value={Speciality.SpecialityName}
                                onChange={handleSpecialityChange}
                            />
                        </div>


                    </div>
                    <div className="Main_container_Btn">
                        <button onClick={handleSpecialitySubmit}>
                            {Speciality.SpecialityId ? 'Update' : 'Save'}
                        </button>
                    </div>

                    {SpecialityData.length > 0 &&
                        <ReactGrid columns={SpecialityColumns} RowData={SpecialityData} />
                    }
                </>}
                {/*------------------Role--------------------- */}

                {FlaggNamePage === 'Roles' && <>
                    <div className="common_center_tag">
                        <span>Role</span>
                    </div>

                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label>Role Name <span>:</span> </label>
                            <input
                                type="text"
                                name='Role'
                                required
                                value={RoleName.Role}
                                onChange={handleRoleChange}
                            />
                        </div>

                    </div>

                    <div className="Main_container_Btn">
                        <button onClick={handleRolesubmit}>
                            {RoleName.RoleId ? "Update" : "Add"}
                        </button>
                    </div>
                    {RoleNameData.length > 0 &&
                        <ReactGrid columns={RoleColumns} RowData={RoleNameData} />
                    }
                </>
                }

                {/*------------------Religion --------------------- */}

                {FlaggNamePage === 'Relegion' && <>
                    <div className="common_center_tag">
                        <span>Religion</span>
                    </div>

                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label>Relegion Name <span>:</span> </label>
                            <input
                                type="text"
                                name='religion'
                                required
                                value={religionName.religion}
                                onChange={handleReligionChange}
                            />
                        </div>

                    </div>

                    <div className="Main_container_Btn">
                        <button onClick={handleReligionSubmit}>
                            {religionName.religionId ? "Update" : "Add"}
                        </button>
                    </div>
                    {religionNameData.length > 0 &&
                        <ReactGrid columns={religionColumns} RowData={religionNameData} />
                    }
                </>}

                {/*------------------Caste --------------------- */}

                {FlaggNamePage === 'Caste' && <>
                    <div className="common_center_tag">
                        <span>Caste</span>
                    </div>

                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label>Caste Name <span>:</span> </label>
                            <input
                                type="text"
                                name='Cast'
                                required
                                value={CastName.Cast}
                                onChange={handleCastChange}
                            />
                        </div>

                    </div>

                    <div className="Main_container_Btn">
                        <button onClick={handleCastSubmit}>
                            {CastName.CastId ? "Update" : "Add"}
                        </button>
                    </div>
                    {CastNameData.length > 0 &&
                        <ReactGrid columns={CastColumns} RowData={CastNameData} />
                    }
                </>}


                {/*------------------Title --------------------- */}
                {FlaggNamePage === 'Title' && <>
                    <div className="common_center_tag">
                        <span>Title</span>
                    </div>

                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label>Title Name <span>:</span> </label>
                            <input
                                type="text"
                                name='Title'
                                required
                                value={TitleName.Title}
                                onChange={handleTitleChange}
                            />
                        </div>

                    </div>

                    <div className="Main_container_Btn">
                        <button onClick={handleTitleSubmit}>
                            {TitleName.TitleId ? "Update" : "Add"}
                        </button>
                    </div>
                    {TitleNameData.length > 0 &&
                        <ReactGrid columns={TitleColumns} RowData={TitleNameData} />
                    }
                </>}

                {/*------------------Triage Category --------------------- */}

                {FlaggNamePage === 'Triage' && <>
                    <div className="common_center_tag">
                        <span>Triage Category</span>
                    </div>

                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label>Description <span>:</span> </label>
                            <input
                                type="text"
                                name='Description'
                                required
                                value={TriageCategory.Description}
                                onChange={handleTriageCategoryChange}
                            />
                        </div>


                    </div>


                    <div className="Main_container_Btn">
                        <button onClick={handleTriageCategorySubmit}>
                            {TriageCategory.Triage_Id ? "Update" : "Add"}
                        </button>
                    </div>
                    {TriageCategoryData.length > 0 &&
                        <ReactGrid columns={TriageCategoryColumns} RowData={TriageCategoryData} />
                    }
                </>}



                {/*------------------BloodGroup --------------------- */}

                {FlaggNamePage === 'BloodGroup' && <>
                    <div className="common_center_tag">
                        <span>BloodGroup</span>
                    </div>

                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label>BloodGroup Name <span>:</span> </label>
                            <input
                                type="text"
                                name='BloodGroup'
                                required
                                value={BloodGroupName.BloodGroup}
                                onChange={handleBloodGroupChange}
                            />
                        </div>

                    </div>

                    <div className="Main_container_Btn">
                        <button onClick={handleBloodGroupSubmit}>
                            {BloodGroupName.BloodGroupId ? "Update" : "Add"}
                        </button>
                    </div>
                    {BloodGroupNameData.length > 0 &&
                        <ReactGrid columns={BloodGroupColumns} RowData={BloodGroupNameData} />
                    }
                </>}

                {/* -------------------------gradename--------- */}

                {FlaggNamePage === 'GradeName' && <>
                    <div className="common_center_tag">
                        <span>RateCard For Insurance/Client/Corporate</span>
                    </div>

                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label>Rate Card<span>:</span> </label>
                            <input
                                type="text"
                                name='GradeName'
                                required
                                value={GradeName.GradeName}
                                onChange={handleGradeNameChange}
                            />
                        </div>
                        <div className="RegisForm_1">
                            <label>
                                Eligible RoomType<span>:</span>
                            </label>
                            <input
                                type="text"
                                name="Roomtype"
                                list="RoomnameOptions"
                                required
                                value={GradeName.Roomtype}
                                autoComplete="off"
                                onChange={handleGradeNameChange}
                            />
                            <datalist id="RoomnameOptions">
                                {Array.isArray(roomnames) && roomnames.length > 0 ? (
                                    roomnames.map((pack) => (
                                        <option key={pack.id} value={pack.RoomName} />
                                    ))
                                ) : null}
                            </datalist>

                        </div>

                    </div>


                    <div className="Main_container_Btn">
                        <button onClick={handleGradeNameSubmit}>
                            {GradeName.GradeNameId ? "Update" : "Add"}
                        </button>
                    </div>
                    {Array.isArray(GradeNameData) && GradeNameData.length > 0 && (
                        <ReactGrid columns={GradeNameColumns} RowData={GradeNameData} />
                    )}

                </>}


                {/* -------------------------PaymentMode--------- */}

                {FlaggNamePage === 'PaymentMode' && <>
                    <div className="common_center_tag">
                        <span>Payment Mode</span>
                    </div>

                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label>Payment Mode<span>:</span> </label>
                            <input
                                type="text"
                                name='PaymentMode'
                                required
                                value={PaymentMode.PaymentMode}
                                onChange={handlePaymentNameChange}
                            />
                        </div>
                    </div>


                    <div className="Main_container_Btn">
                        <button onClick={handlePaymentModeSubmit}>
                            {PaymentMode.PaymentModeId ? "Update" : "Add"}
                        </button>
                    </div>
                    {Array.isArray(PaymentModeData) && PaymentModeData.length > 0 && (
                        <ReactGrid columns={PaymentModeColumns} RowData={PaymentModeData} />
                    )}

                </>}

                {/* -------------------------Expenses--------- */}

                {FlaggNamePage === 'Expenses' && <>
                    <div className="common_center_tag">
                        <span>Expenses</span>
                    </div>
                    <div className="RegisFormcon_1">
                        <div className="RegisFormcon_1">
                            <div className="RegisForm_1">
                                <label> Expenses Name <span>:</span> </label>
                                <input
                                    type="text"
                                    name='ExpensesName'
                                    required
                                    value={Expenses.ExpensesName}
                                    onChange={handleExpensesChange}
                                />
                            </div>

                        </div>
                    </div>



                    <div className="Main_container_Btn">
                        <button onClick={handleExpensesSubmit}>
                            {Expenses.ExpensesId ? "Update" : "Add"}
                        </button>
                    </div>
                    {ExpensesArr.length > 0 &&
                        <ReactGrid columns={ExpensesColumns} RowData={ExpensesArr} />
                    }
                </>}

                {/* ------------------------IntakeType------------------  */}
                {FlaggNamePage === "IntakeType" && (
                    <>
                        <div className="common_center_tag">
                            <span>Intake Type</span>
                        </div>
                        <div className="RegisFormcon_1">
                            <div className="RegisFormcon_1">
                                <div className="RegisForm_1">
                                    <label>Intake Type Name <span>:</span></label>
                                    <input
                                        type="text"
                                        name="IntakeTypeName"
                                        required
                                        value={IntakeType.IntakeTypeName}
                                        onChange={handleIntakeTypeChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="Main_container_Btn">
                            <button onClick={handleIntakeTypeSubmit}>
                                {IntakeType.IntakeTypeId ? "Update" : "Add"}
                            </button>
                        </div>
                        {IntakeTypeArr.length > 0 && (
                            <ReactGrid
                                columns={IntakeTypeColumns}
                                RowData={IntakeTypeArr}
                            />
                        )}
                    </>
                )}

                {/* ------------------------IntakeMode------------------  */}

                {FlaggNamePage === "IntakeMode" && (
                    <>
                        <div className="common_center_tag">
                            <span>Intake Mode</span>
                        </div>
                        <div className="RegisFormcon_1">
                            <div className="RegisFormcon_1">
                                <div className="RegisForm_1">
                                    <label>Intake Mode Name <span>:</span></label>
                                    <input
                                        type="text"
                                        name="IntakeModeName"
                                        required
                                        value={IntakeMode.IntakeModeName}
                                        onChange={handleIntakeModeChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="Main_container_Btn">
                            <button onClick={handleIntakeModeSubmit}>
                                {IntakeMode.IntakeModeId ? "Update" : "Add"}
                            </button>
                        </div>
                        {IntakeModeArr.length > 0 && (
                            <ReactGrid
                                columns={IntakeModeColumns}
                                RowData={IntakeModeArr}
                            />
                        )}
                    </>
                )}

                {/* -------------------------------------------------------------- */}
                {FlaggNamePage === "Measurement" && (
                    <>
                        <div className="common_center_tag">
                            <span>Measurement</span>
                        </div>
                        <div className="RegisFormcon_1">
                            <div className="RegisFormcon_1">
                                <div className="RegisForm_1">
                                    <label>Measurement Name <span>:</span></label>
                                    <input
                                        type="text"
                                        name="MeasurementName"
                                        required
                                        value={Measurement.MeasurementName}
                                        onChange={handleMeasurementChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="Main_container_Btn">
                            <button onClick={handleMeasurementSubmit}>
                                {Measurement.MeasurementId ? "Update" : "Add"}
                            </button>
                        </div>
                        {MeasurementArr.length > 0 && (
                            <ReactGrid
                                columns={MeasurementColumns}
                                RowData={MeasurementArr}
                            />
                        )}
                    </>
                )}




            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />

        </>
    )
}

export default BasicMaster;