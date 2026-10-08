import React, { useState, useEffect, useCallback } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid"
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";


function NewNavigationMasters() {

    const [PageType, setPageType] = useState('LabDepartment')
    const [captureorganism, setCaptureorganism] = useState([])
    const [organismFilter, setOrganismFilter] = useState('');
    const [antibioticFilter, setAntibioticFilter] = useState('');
    const [uomFilter, setuomFilter] = useState('');

    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const dispatchvalue = useDispatch();
    const toast = useSelector(state => state.userRecord?.toast);
    console.log(toast)

    const UrlLink = useSelector(state => state.userRecord?.UrlLink);

    const PageTypes = [
        { key: "LabDepartment", name: "Lab Department" },
        { key: "LabSubDepartment", name: "Lab Sub Department" },
        { key: "ContainerMaster", name: "Container Master" },
        { key: "SpecimenMaster", name: "Specimen Master" },
        { key: "UnitMaster", name: "Unit Master" },
        { key: "Microscopytype", name: "Microscopy Type" },
        { key: "MethodsMaster", name: "Methods Master" },
        { key: "OrganismMaster", name: "Organism Master" },
        { key: "AntibioticMaster", name: "Antibiotic Master" },
        { key: "EquipmentMaster", name: "Equipment Master" },
        { key: "TemplateMaster", name: "Template Master" },
        { key: "RemarksMaster", name: "Remarks Master" },
        { key: "ReasonMaster", name: "Reason Master" },
        { key: "QualificstionMaster", name: "Qualification Master" },
        { key: "LabRemarksMaster", name: "Lab Remarks Master" },
        { key: "FormulaMaster", name: "Formula Master" },
        { key: "ResultEntryMaster", name: "Result Entry Master" },
        { key: "DepartmentOrderMaster", name: "Department Order Master" }
    ];


    const [CommonData, setCommonData] = useState([])
    const [maindepartmentdata, setmaindepartmentdata] = useState([])
    const [LabDepartment, setLabDepartment] = useState({
        Department_Code: '',
        Department_Name: '',
        created_by: userRecord?.username,
        isEdit: false,
        Status: "Active",
        Type: "MainDepartment",
        ResponseMsg: "New Department Created"

    });

    const [LabSubDepartment, setLabSubDepartment] = useState({
        SubDepartment_Code: '',
        SubDepartment_Name: '',
        created_by: userRecord?.username,
        isEdit: false,
        Status: "Active",
        Type: "SubMainDepartment",
        department: '',
        departmentName: '',
        ResponseMsg: "New Sub Department Created"
    });

    const [ContainerData, setContainerData] = useState({
        Container_Code: '',
        Container_Name: '',
        created_by: userRecord?.username,
        isEdit: false,
        Type: "ContainerMaster",
        ColorFlag: '',
        ResponseMsg: "New Container Created"
    });

    const [SpecimenData, setSpecimenData] = useState({
        Specimen_Code: '',
        Specimen_Name: '',
        created_by: userRecord?.username,
        isEdit: false,
        Type: "SpecimenMaster",
        ResponseMsg: "New Specimen Created"
    });

    const [UnitMasterdata, setUnitMasterdata] = useState({
        Unit_Code: '',
        Unit_Name: '',
        created_by: userRecord?.username,
        isEdit: false,
        Type: "UnitMaster",
        ResponseMsg: "New Unit Created"
    });


    const [microscopy, setMicroscopy] = useState({
        microscopy_Code: '',
        microscopy_Name: '',
        created_by: userRecord?.username,
        isEdit: false,
        Type: "Microscopytype",
        ResponseMsg: "New Microscopy Type"
    });


    const [MethodsMasterData, setMethodsMasterData] = useState({
        Method_Code: '',
        Method_Name: '',
        created_by: userRecord?.username,
        isEdit: false,
        Type: "MethodsMaster",
        ResponseMsg: "New Method Created"
    });

    const [AntibioticMasterdata, setAntibioticMasterdata] = useState({
        anti_biotic_group_code: '',
        anti_biotic_code: '',
        captureorganism: '',
        anti_biotic: '',
        sensitive:'',
        intermediate:'',
        resistant:'',
        created_by: userRecord?.username,
        isEdit: false,
        Type: "AntibioticMaster",
        ResponseMsg: "New Antibiotic Created",
        anti_biotic_id: "",
        RangeType: "",
        Specimen:"",
    });


    const [OrganismMasterdata, setOrganismMasterdata] = useState({
        Organism_Code: '',
        Organism_Name: '',
        created_by: userRecord?.username,
        isEdit: false,
        Type: "OrganismMaster",
        ResponseMsg: "New Organism Created"
    });

    const [RemarksMasterData, setRemarksMasterData] = useState({
        Remark_Id: '',
        Remarks: '',
        created_by: userRecord?.username,
        isEdit: false,
        Type: "RemarksMaster",
        ResponseMsg: "New Remark Created"
    });


    console.log(OrganismMasterdata)

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (PageType === "LabDepartment") {
            setLabDepartment((prevState) => ({
                ...prevState,
                [name]: value?.toUpperCase()?.trim(),
            }));
        } else if (PageType === "LabSubDepartment") {
            if (name === "departmentName") {
                const selectedDept = maindepartmentdata.find(
                    (row) => row.Department_Name === value
                );
                setLabSubDepartment((prevState) => ({
                    ...prevState,
                    departmentName: value?.toUpperCase()?.trim(),
                    department: selectedDept?.Department_Code || "" // Set department code
                }));
            } else {
                setLabSubDepartment((prevState) => ({
                    ...prevState,
                    [name]: value?.toUpperCase()?.trim(),
                }));
            }
        } else if (PageType === "ContainerMaster") {
            setContainerData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else if (PageType === "SpecimenMaster") {
            setSpecimenData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else if (PageType === "UnitMaster") {
            setUnitMasterdata((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else if (PageType === "Microscopytype") {
            setMicroscopy((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
        
        else if (PageType === "MethodsMaster") {
            setMethodsMasterData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else if (PageType === "AntibioticMaster") {
            setAntibioticMasterdata((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }
        else if (PageType === "OrganismMaster") {
            setOrganismMasterdata((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        } else if (PageType === "RemarksMaster") {
            setRemarksMasterData((prevState) => ({
                ...prevState,
                [name]: value,
            }));
        }


    };


    const clearFormData = (pageType) => {
        if (pageType === "LabDepartment") {
            setLabDepartment({
                Department_Code: '',
                Department_Name: '',
                created_by: userRecord?.username,
                isEdit: false,
                Status: "Active",
                Type: "MainDepartment",
                ResponseMsg: "New Department Created"
            });
        } else if (pageType === "LabSubDepartment") {
            setLabSubDepartment({
                SubDepartment_Code: '',
                SubDepartment_Name: '',
                created_by: userRecord?.username,
                isEdit: false,
                Status: "Active",
                Type: "SubMainDepartment",
                department: '',
                departmentName: '',
                ResponseMsg: "New Sub Department Created"
            });
        } else if (pageType === "ContainerMaster") {
            setContainerData({
                Container_Name: '',
                Container_Code: '',
                created_by: userRecord?.username,
                isEdit: false,
                Type: "SubMainDepartment",
                ColorFlag: '',
                ResponseMsg: "New Container Created"
            });
        } else if (pageType === "SpecimenMaster") {
            setSpecimenData({
                Specimen_Code: '',
                Specimen_Name: '',
                created_by: userRecord?.username,
                isEdit: false,
                Type: "SpecimenMaster",
                ResponseMsg: "New Specimen Created"
            });
        } else if (pageType === "UnitMaster") {
            setUnitMasterdata({
                Unit_Code: '',
                Unit_Name: '',
                created_by: userRecord?.username,
                isEdit: false,
                Type: "UnitMaster",
                ResponseMsg: "New Unit Created"
            });
        }else if (pageType === "Microscopytype") {
            setMicroscopy({
                microscopy_Code: '',
                microscopy_Name: '',
                created_by: userRecord?.username,
                isEdit: false,
                Type: "Microscopytype",
                ResponseMsg: "New Microscopy Type Created"
            });
        }
        
        else if (pageType === "MethodsMaster") {
            setMethodsMasterData({
                Method_Code: '',
                Method_Name: '',
                created_by: userRecord?.username,
                isEdit: false,
                Type: "MethodsMaster",
                ResponseMsg: "New Method Created"
            });
        } else if (pageType === "AntibioticMaster") {
            setAntibioticMasterdata({
                anti_biotic_group_code: '',
                anti_biotic_code: '',
                captureorganism : '',
                anti_biotic: '',
                sensitive:'',
                intermediate:'',
                resistant:'',
                created_by: userRecord?.username,
                isEdit: false,
                Type: "AntibioticMaster",
                ResponseMsg: "New Antibiotic Created",
                RangeType:"",
                Specimen:"",
            });
        } else if (pageType === "OrganismMaster") {
            setOrganismMasterdata({
                Organism_Code: '',
                Organism_Name: '',
                created_by: userRecord?.username,
                isEdit: false,
                Type: "OrganismMaster",
                ResponseMsg: "New Organism Created"
            });
        } else if (pageType === "RemarksMaster") {
            setRemarksMasterData({
                Remark_Id: '',
                Remarks: '',
                created_by: userRecord?.username,
                isEdit: false,
                Type: "RemarksMaster",
                ResponseMsg: "New Remark Created"
            });
        }
    };

    // Submit function
    const handleDepartmentsubmit = () => {
        let senddata;

        if (PageType === "LabDepartment") {
            senddata = LabDepartment;
        } else if (PageType === "LabSubDepartment") {
            senddata = LabSubDepartment;
        } else if (PageType === "ContainerMaster") {
            senddata = ContainerData;
        } else if (PageType === "SpecimenMaster") {
            senddata = SpecimenData;
        } else if (PageType === "UnitMaster") {
            senddata = UnitMasterdata;
        } else if (PageType === "Microscopytype") {
            senddata = microscopy;
        } 
        else if (PageType === "MethodsMaster") {
            senddata = MethodsMasterData
        } else if (PageType === "AntibioticMaster") {
            senddata = AntibioticMasterdata
        } else if (PageType === "OrganismMaster") {
            senddata = OrganismMasterdata
        } else if (PageType === "RemarksMaster") {
            senddata = RemarksMasterData
        }

        console.log(AntibioticMasterdata)

        axios.post(`${UrlLink}Masters/All_Other_Lab_Masters_POST_AND_GET`, senddata)
            .then((res) => {
                const resData = res.data;
                const mess = Object.values(resData)[0];
                const typp = Object.keys(resData)[0];

                const tdata = {
                    message: mess,
                    type: typp,
                };
                dispatchvalue({ type: 'toast', value: tdata });

                // Clear form data and fetch updated codes
                clearFormData(PageType);
                fetchCodeData(); // Fetch new codes after insert
                fetchDepartmentData(); // Fetch department data
            })
            .catch((err) => {
                console.log(err);
            });
    };

    // Fetch updated codes
    const fetchCodeData = useCallback(() => {
        axios
            .get(
                `${UrlLink}Masters/Get_All_Other_Masters_PrimaryCodes?Type=${PageType}`
            )
            .then((res) => {
                console.log(res)
                if (PageType === "LabDepartment") {
                    setLabDepartment((prev) => ({
                        ...prev,
                        Department_Code: res.data.department_code,
                    }));
                } else if (PageType === "LabSubDepartment") {
                    setLabSubDepartment((prev) => ({
                        ...prev,
                        SubDepartment_Code: res.data.Subdepartment_code,
                    }));
                } else if (PageType === "ContainerMaster") {
                    setContainerData((prev) => ({
                        ...prev,
                        Container_Code: res.data.container_code,
                    }));
                } else if (PageType === "SpecimenMaster") {
                    setSpecimenData((prev) => ({
                        ...prev,
                        Specimen_Code: res.data.Specimen_Code,
                    }));
                } else if (PageType === "UnitMaster") {
                    setUnitMasterdata((prev) => ({
                        ...prev,
                        Unit_Code: res.data.unitCode,
                    }));
                } else if (PageType === "Microscopytype") {
                    setMicroscopy((prev) => ({
                        ...prev,
                        microscopy_Code: res.data.microcode,
                    }));
                } 
                else if (PageType === "MethodsMaster") {
                    setMethodsMasterData((prev) => ({
                        ...prev,
                        Method_Code: res.data.method_code,
                    }));
                } else if (PageType === "AntibioticMaster") {
                    setAntibioticMasterdata((prev) => ({
                        ...prev,
                        anti_biotic_group_code: res.data.data.anti_biotic_group_code,
                        anti_biotic_code: res.data.data.anti_biotic_code
                    }));
                } else if (PageType === "OrganismMaster") {
                    setOrganismMasterdata((prev) => ({
                        ...prev,
                        Organism_Code: res.data.Organism_Code,
                    }));
                } else if (PageType === "RemarksMaster") {
                    setRemarksMasterData((prev) => ({
                        ...prev,
                        Remark_Id: res.data.Remark_Id,
                    }));
                }
            })
            .catch((err) => {
                console.error(err);
            });
    }, [PageType, UrlLink]);

    // Effect hook




    const fetchDepartmentData = useCallback(() => {
        axios
            .get(`${UrlLink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=${PageType}`)
            .then((response) => {
                console.log(response)
                const data = Array.isArray(response.data) ? response.data : [];
                setCommonData(data);
            })
            .catch((error) => {
                console.error("Error fetching Department data:", error);
            });
    }, [UrlLink, PageType]);

    useEffect(() => {
        axios
            .get(`${UrlLink}Masters/All_Other_Lab_Masters_POST_AND_GET?Type=LabDepartment`)
            .then((response) => {
                console.log(response)
                const data = response.data;
                setmaindepartmentdata(data);
            })
            .catch((error) => {
                console.error("Error fetching Department data:", error);
            })
    }, [UrlLink])
    useEffect(() => {
        axios
            .get(`${UrlLink}Masters/getorganismdetails`)
            .then((response) => {
                console.log(response)
                const data = response.data;
                setCaptureorganism(data);
            })
            .catch((error) => {
                console.error("Error fetching Department data:", error);
            })
    }, [UrlLink])

    const handleEdit = (row, DataEditType) => {
        console.log(row)
        if (DataEditType === 'LabDepartment') {
            setLabDepartment((prev) => ({
                Department_Code: row.Department_Code,
                Department_Name: row.Department_Name,
                isEdit: true,
                Status: row.Status,
                Type: "MainDepartment",
                ResponseMsg: "Department Update"
            }))
        } else if (DataEditType === "SubMainDepartment") {
            setLabSubDepartment((prev) => ({
                SubDepartment_Code: row.SubDepartment_Code,
                SubDepartment_Name: row.SubDepartment_Name,
                isEdit: true,
                Status: row.Status,
                Type: "SubMainDepartment",
                departmentName: row.MainDepartment_Name,
                department: row.department,
                ResponseMsg: "Sub Department Update"
            }))
        } else if (DataEditType === "ContainerMaster") {
            setContainerData((prev) => ({
                Container_Code: row.Container_Code,
                Container_Name: row.Container_Name,
                isEdit: true,
                ColorFlag: row.ColorFlag,
                Type: "ContainerMaster",
                ResponseMsg: "Container Data Update"
            }))
        } else if (DataEditType === "SpecimenMaster") {
            setSpecimenData((prev) => ({
                Specimen_Code: row.Specimen_Code,
                Specimen_Name: row.Specimen_Name,
                isEdit: true,
                Type: "SpecimenMaster",
                ResponseMsg: "Specimen Data Update"
            }))
        } else if (DataEditType === "UnitMaster") {
            setUnitMasterdata((prev) => ({
                Unit_Code: row.Unit_Code,
                Unit_Name: row.Unit_Name,
                isEdit: true,
                Type: "UnitMaster",
                ResponseMsg: "Unit Data Update"
            }))
        }else if (DataEditType === "Microscopytype") {
            setMicroscopy((prev) => ({
                microscopy_Code: row.microscopy_Code,
                microscopy_Name: row.microscopy_Name,
                isEdit: true,
                Type: "Microscopytype",
                ResponseMsg: "Microscopy Data Update"
            }))
        }
        
        else if (DataEditType === "MethodsMaster") {
            setMethodsMasterData((prev) => ({
                Method_Code: row.Method_Code,
                Method_Name: row.Method_Name,
                isEdit: true,
                Type: "MethodsMaster",
                ResponseMsg: "Method Data Update"
            }))
        } else if (DataEditType === "AntibioticMaster") {
            setAntibioticMasterdata((prev) => ({
                anti_biotic_group_code: row.anti_biotic_group_code,
                anti_biotic_code: row.anti_biotic_code,
                anti_biotic: row.anti_biotic,
                sensitive:row.sensitive,
                intermediate:row.intermediate,
                resistant:row.resistant,
                isEdit: true,
                Type: "AntibioticMaster",
                ResponseMsg: "Antibiotic Data Update",
                RangeType:row.RangeType,
                Specimen:row.Specimen,
               
            }))
        } else if (DataEditType === "OrganismMaster") {
            setOrganismMasterdata((prev) => ({
                Organism_Code: row.Organism_Code,
                Organism_Name: row.Organism_Name,
                isEdit: true,
                Type: "OrganismMaster",
                ResponseMsg: "Organism Data Update"
            }))
        } else if (DataEditType === "RemarksMaster") {
            setRemarksMasterData((prev) => ({
                Remark_Id: row.Remark_Id,
                Remarks: row.Remarks,
                isEdit: true,
                Type: "RemarksMaster",
                ResponseMsg: "Remarks Data Update"
            }))
        }
    };


    const hadleeditstatus = (params, EditType) => {
        console.log(params);
        console.log(EditType)

        let Department_Code;
        let SubDepartment_Code;
        let Type;


        let dynamicCodeKey;
        let dynamicCodeValue;


        if (EditType === "LabDepartment") {
            Department_Code = params.Department_Code;
            Type = "MainDepartment"
        } else if (EditType === "SubMainDepartment") {
            SubDepartment_Code = params.SubDepartment_Code;
            Type = "SubMainDepartment"
        }

        switch (EditType) {
            case "LabDepartment":
                dynamicCodeKey = "Department_Code";
                dynamicCodeValue = Department_Code;
                break;
            case "SubMainDepartment":
                dynamicCodeKey = "SubDepartment_Code";
                dynamicCodeValue = SubDepartment_Code;
                break;
        }


        let newstatus;
        if (params.Status === "Active") {
            newstatus = "Inactive";
        } else if (params.Status === "Inactive") {
            newstatus = "Active";
        }


        const datasend = {
            isEdit: true,
            Status: newstatus,
            [dynamicCodeKey]: dynamicCodeValue, // Dynamically assign the key and value
            Type: Type,
            ResponseMsg: `${newstatus}`
        };

        console.log(datasend)

        axios
            .post(
                `${UrlLink}Masters/All_Other_Lab_Masters_POST_AND_GET`,
                datasend
            )
            .then((res) => {
                console.log(res);
                const mess = Object.values(res.data)[0];
                const typp = Object.keys(res.data)[0];

                const tdata = {
                    message: mess,
                    type: typp,
                }
                console.log(tdata)
                dispatchvalue({ type: 'toast', value: tdata })

                fetchDepartmentData();
            })

            .catch((err) => {
                console.error();
            });
    };

    console.log(PageType)

    React.useEffect(() => {
        fetchCodeData();
        fetchDepartmentData();
    }, [fetchCodeData, fetchDepartmentData]);


    const LabDepartmentColumns = [
        {
            key: "id",
            name: "Location Id",
            frozen: true
        },
        {
            key: "created_by",
            name: "Created By ",
            frozen: true
        },
        {
            key: "Department_Name",
            name: "Department Name",
        },

        {
            key: "Status",
            name: "Status",
            width: 150,
            renderCell: (params) =>
                params.row.Status === "Inactive" ? (
                    <Button onClick={() => hadleeditstatus(params.row, "LabDepartment")}>
                        <span style={{ color: "red" }}>{params.row.Status}</span>
                    </Button>
                ) : (
                    <Button onClick={() => hadleeditstatus(params.row, "LabDepartment")}>
                        <span style={{ color: "black" }}>{params.row.Status}</span>
                    </Button>
                ),
        },
        {
            key: "EditAction",
            name: "Action",
            width: 150,
            renderCell: (params) => (
                <Button
                    onClick={() => handleEdit(params.row, "LabDepartment")}
                    style={{ width: "130px", textAlign: "center", cursor: "pointer" }}
                >
                    <EditIcon />
                </Button>
            ),
        },


    ]

    const LabSubDepartmentColumns = [
        {
            key: "id",
            name: "S.No",
            width: 70,
        },
        {
            key: "MainDepartment_Name",
            name: "Main Department",
            width: 200,
        },
        {
            key: "SubDepartment_Name",
            name: "Department",
            width: 350,
        },
        {
            key: "Status",
            name: "Status",
            renderCell: (params) =>
                params.row.Status === "Inactive" ? (
                    <Button onClick={() => hadleeditstatus(params.row, "SubMainDepartment")}>
                        <span style={{ color: "red" }}>{params.row.Status}</span>
                    </Button>
                ) : (
                    <Button onClick={() => hadleeditstatus(params.row, "SubMainDepartment")}>
                        <span style={{ color: "black" }}>{params.row.Status}</span>
                    </Button>
                ),
        },
        {
            key: "EditAction",
            name: "Action",
            renderCell: (params) => (
                <Button
                    size="small"
                    onClick={() => handleEdit(params.row, "SubMainDepartment")}
                    startIcon={<EditIcon />}
                ></Button>
            ),
        },
    ];


    const ContainerColumn = [
        {
            key: "id",
            name: "S.No",
            width: 70,
        },
        {
            key: "Container_Name",
            name: "Container Name",
            width: 280,
        },
        {
            key: "ColorFlag",
            name: "Color Flag",
            renderCell: (params) => (
                <span
                    style={{
                        height: "20px",
                        width: "20px",
                        backgroundColor: params.row.ColorFlag,
                    }}
                ></span>
            ),
        },
        {
            key: "EditAction",
            name: "Action",
            renderCell: (params) => (
                <Button
                    style={{ width: "130px", textAlign: "center", cursor: "pointer" }}
                    onClick={() => handleEdit(params.row, "ContainerMaster")}
                >
                    <EditIcon />
                </Button>
            ),
        },
    ];

    const SpecimenColumn = [
        {
            key: "id",
            name: "S.No",
            width: 70,
        },
        {
            key: "Specimen_Name",
            name: "Specimen Name",
        },
        {
            key: "EditAction",
            name: "Action",
            width: 280,
            renderCell: (params) => (
                <Button
                    style={{ width: "130px", textAlign: "center", cursor: "pointer" }}
                    onClick={() => handleEdit(params.row, "SpecimenMaster")}
                >
                    <EditIcon />
                </Button>
            ),
        },
    ];

    const UnitColumn = [
        {
            key: "id",
            name: "S.No",
            width: 70,
        },
        {
            key: "Unit_Code",
            name: "Unit Code",
            width: 250,
        },
        {
            key: "Unit_Name",
            name: "Unit Name",
        },
        {
            key: "EditAction",
            name: "Action",
            width: 70,
            renderCell: (params) => (
                <Button
                    onClick={() => handleEdit(params.row, "UnitMaster")}
                    style={{ width: "130px", textAlign: "center", cursor: "pointer" }}
                >
                    <EditIcon />
                </Button>
            ),
        },
    ];

    const Microcolumn = [
        {
            key: "id",
            name: "S.No",
            width: 70,
        },
        {
            key: "microscopy_Code",
            name: "Microscopy Code",
            width: 250,
        },
        {
            key: "microscopy_Name",
            name: "Microscopy Name",
        },
        {
            key: "EditAction",
            name: "Action",
            width: 70,
            renderCell: (params) => (
                <Button
                    onClick={() => handleEdit(params.row, "Microscopytype")}
                    style={{ width: "130px", textAlign: "center", cursor: "pointer" }}
                >
                    <EditIcon />
                </Button>
            ),
        },
    ];

    const MethodsColumn = [
        {
            key: "id",
            name: "S.No",
            width: 70,
        },
        {
            key: "Method_Name",
            name: "Method Name",
            width: 500,
        },
        {
            key: "EditAction",
            name: "Action",
            renderCell: (params) => (
                <Button
                    onClick={() => handleEdit(params.row, "MethodsMaster")}
                    style={{ width: "130px", textAlign: "center", cursor: "pointer" }}
                >
                    <EditIcon />
                </Button>
            ),
        },
    ];


    const AntibioticMasterColumn = [
        {
            key: "id",
            name: "S.No",
            width: 70,
        },
        {
            key: "captureorganism",
            name: "Organism Name",
            width: 400,
        },
        {
            key: "Specimen",
            name: "Specimen",
            width: 400,
        },
        {
            key: "RangeType",
            name: "Type",
            width: 400,
        },
        {
            key: "anti_biotic",
            name: "Antibiotic",
            width: 400,
        },
        {
            key:"sensitive",
            name:"Sensitive",
            width:100,
        },
        {
            key:"intermediate",
            name:"Intermediate",
            width:100,
        },
        {
            key:"resistant",
            name:"Resistant",
            width:100,
        },
        {
            key: "EditAction",
            name: "Action",
            renderCell: (params) => (
                <Button
                    onClick={() => handleEdit(params.row, "AntibioticMaster")}
                    style={{ width: "130px", textAlign: "center", cursor: "pointer" }}
                >
                    <EditIcon />
                </Button>
            ),
        },
    ];


    const OrganismMasterColumn = [
        {
            key: "id",
            name: "S.No",
            width: 70,
        },
        {
            key: "Organism_Name",
            name: "Organism Name",
            width: 280,
        },
        {
            key: "EditAction",
            name: "Action",
            renderCell: (params) => (
                <Button
                    onClick={() => handleEdit(params.row, "OrganismMaster")}
                    style={{ width: "130px", textAlign: "center", cursor: "pointer" }}

                >
                    <EditIcon />
                </Button>
            ),
        },
    ];


    const RemarksMasterColumn = [
        {
            key: "id",
            name: "S.No",
            width: 70,
        },
        {
            key: "Remarks",
            name: "Remarks",
            width: 280,
        },
        {
            key: "EditAction",
            name: "Action",
            renderCell: (params) => (
                <Button
                    onClick={() => handleEdit(params.row, "RemarksMaster")}
                    style={{ width: "130px", textAlign: "center", cursor: "pointer" }}
                >
                    <EditIcon />
                </Button>
            ),
        },
    ];

    const filteredData = CommonData?.filter(item => {
        const matchesOrganism = organismFilter === '' || item.captureorganism?.toLowerCase().includes(organismFilter.toLowerCase());
        const matchesAntibiotic = antibioticFilter === '' || item.anti_biotic?.toLowerCase().includes(antibioticFilter.toLowerCase());
        const matchesuom =  uomFilter === ''|| item.Unit_Name?.toLowerCase().includes(uomFilter.toLowerCase());
        
        return matchesOrganism && matchesAntibiotic && matchesuom;
      });
      
      

    return (
        <>
            <div className="Main_container_app">
                <h3>All Other Masters</h3>
                <div className="RegisterTypecon">
                    <div className="RegisterType eced_p00">
                        {PageTypes.map((page, ind) => (
                            <div className="registertypeval" key={ind}>
                                <input
                                    type="radio"
                                    id={page.key}
                                    name="appointment_type"
                                    checked={PageType === page.key}
                                    onChange={(e) => setPageType(e.target.value)}
                                    value={page.key}
                                />
                                <label htmlFor={page.key}>
                                    {page.name} {/* Display only the name */}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>
                {PageType === 'LabDepartment' && <>
                    <div className="common_center_tag">
                        <span> Lab Department</span>
                    </div>
                    <br />
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label> Departmnent Code <span>:</span> </label>
                            <input
                                value={LabDepartment.Department_Code}
                                disabled
                            />
                        </div>
                        <div className="RegisForm_1">
                            <label> Department Name<span>:</span> </label>
                            <input
                                type="text"
                                placeholder='Enter Department Name'
                                name='Department_Name'
                                required
                                value={LabDepartment.Department_Name}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <br />
                    <div className="Main_container_Btn">
                        <button onClick={handleDepartmentsubmit}>
                            {LabDepartment.isEdit ? 'Update' : 'Save'}
                        </button>
                    </div>
                    <br />
                    {CommonData.length > 0 &&
                        <ReactGrid columns={LabDepartmentColumns} RowData={CommonData} />}
                </>}

                {PageType === 'LabSubDepartment' && <>
                    <div className="common_center_tag">
                        <span> Lab Department</span>
                    </div>
                    <br />
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label> SubDepartment Code <span>:</span> </label>
                            <input
                                value={LabSubDepartment.SubDepartment_Code}
                                disabled
                            />
                        </div>
                        <div className="RegisForm_1">
                            <label> Department Name<span>:</span> </label>
                            <input
                                type="text"
                                placeholder='Select Department Name'
                                name='departmentName'
                                required
                                value={LabSubDepartment.departmentName}
                                onChange={handleInputChange}
                                list='department-list'
                                autoComplete='off'
                            />
                            <datalist id="department-list">
                                {maindepartmentdata.map((dept) => (
                                    <option key={dept.Department_Code} value={dept.Department_Name} />
                                ))}
                            </datalist>
                        </div>
                        <div className="RegisForm_1">
                            <label> Sub Department Name<span>:</span> </label>
                            <input
                                type="text"
                                placeholder='Enter Sub Department Name'
                                name='SubDepartment_Name'
                                required
                                value={LabSubDepartment.SubDepartment_Name}
                                onChange={handleInputChange}
                            />
                            <datalist>

                            </datalist>
                        </div>
                    </div>
                    <br />
                    <div className="Main_container_Btn">
                        <button onClick={handleDepartmentsubmit}>
                            {LabSubDepartment.isEdit ? 'Update' : 'Save'}
                        </button>
                    </div>
                    <br />
                    {CommonData.length > 0 &&
                        <ReactGrid columns={LabSubDepartmentColumns} RowData={CommonData} />}
                </>}

                {PageType === 'ContainerMaster' && <>
                    <div className="common_center_tag">
                        <span> Container Master</span>
                    </div>
                    <br />
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label> Container Code <span>:</span> </label>
                            <input
                                value={ContainerData.Container_Code}
                                disabled
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label> Container Name<span>:</span> </label>
                            <input
                                type="text"
                                placeholder='Enter Container Name'
                                name='Container_Name'
                                required
                                value={ContainerData.Container_Name}
                                onChange={handleInputChange}
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label>Flagg Color<span>:</span> </label>
                            <input
                                style={{ border: "0px", padding: "0px", width: "50px" }}
                                type="color"
                                name='ColorFlag'
                                required
                                value={ContainerData.ColorFlag}
                                onChange={handleInputChange}
                            />
                        </div>

                    </div>
                    <br />
                    <div className="Main_container_Btn">
                        <button onClick={handleDepartmentsubmit}>
                            {ContainerData.isEdit ? 'Update' : 'Save'}
                        </button>
                    </div>
                    <br />
                    {CommonData.length > 0 &&
                        <ReactGrid columns={ContainerColumn} RowData={CommonData} />}
                </>}

                {PageType === 'SpecimenMaster' && <>
                    <div className="common_center_tag">
                        <span> Specimen Master</span>
                    </div>
                    <br />
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label> Specimen Code <span>:</span> </label>
                            <input
                                value={SpecimenData.Specimen_Code}
                                disabled
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label> Container Name<span>:</span> </label>
                            <input
                                type="text"
                                placeholder='Enter Specimen Name'
                                name='Specimen_Name'
                                required
                                value={SpecimenData.Specimen_Name}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <br />
                    <div className="Main_container_Btn">
                        <button onClick={handleDepartmentsubmit}>
                            {SpecimenData.isEdit ? 'Update' : 'Save'}
                        </button>
                    </div>
                    <br />
                    {CommonData.length > 0 &&
                        <ReactGrid columns={SpecimenColumn} RowData={CommonData} />}
                </>}

                {PageType === 'UnitMaster' && <>
                    <div className="common_center_tag">
                        <span> Unit Master</span>
                    </div>
                    <br />
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label> Unit Code <span>:</span> </label>
                            <input
                                value={UnitMasterdata.Unit_Code}
                                disabled
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label> Unit Name<span>:</span> </label>
                            <input
                                type="text"
                                placeholder='Enter Unit Name'
                                name='Unit_Name'
                                required
                                value={UnitMasterdata.Unit_Name}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <br />
                    <div className="Main_container_Btn">
                        <button onClick={handleDepartmentsubmit}>
                            {UnitMasterdata.isEdit ? 'Update' : 'Save'}
                        </button>
                    </div>
                    <div className="RegisFormcon_1">
  <div className="RegisForm_1">
    <label>Filter UOM:</label>
    <input
      type="text"
      value={uomFilter}
      onChange={(e) => setuomFilter(e.target.value)}
      placeholder="Enter organism name"
    />
  </div>
  </div>
                    <br />
                    {CommonData.length > 0 &&
                        <ReactGrid columns={UnitColumn} RowData={filteredData} />}
                </>}
                

                {PageType === 'Microscopytype' && <>
                    <div className="common_center_tag">
                        <span> Microscopy Type</span>
                    </div>
                    <br />
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label> Type Code <span>:</span> </label>
                            <input
                                value={microscopy.microscopy_Code}
                                disabled
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label> Microscopy Name<span>:</span> </label>
                            <input
                                type="text"
                                placeholder='Enter Name'
                                name='microscopy_Name'
                                required
                                value={microscopy.microscopy_Name}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <br />
                    <div className="Main_container_Btn">
                        <button onClick={handleDepartmentsubmit}>
                            {microscopy.isEdit ? 'Update' : 'Save'}
                        </button>
                    </div>
                    <br />
                    {CommonData.length > 0 &&
                        <ReactGrid columns={Microcolumn} RowData={CommonData} />}
                </>}

                {PageType === 'MethodsMaster' && <>
                    <div className="common_center_tag">
                        <span> Unit Master</span>
                    </div>
                    <br />
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label> Method Code <span>:</span> </label>
                            <input
                                value={MethodsMasterData.Method_Code}
                                disabled
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label> Method Name<span>:</span> </label>
                            <input
                                type="text"
                                placeholder='Enter Method Name'
                                name='Method_Name'
                                required
                                value={MethodsMasterData.Method_Name}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <br />
                    <div className="Main_container_Btn">
                        <button onClick={handleDepartmentsubmit}>
                            {MethodsMasterData.isEdit ? 'Update' : 'Save'}
                        </button>
                    </div>
                    <br />
                    {CommonData.length > 0 &&
                        <ReactGrid columns={MethodsColumn} RowData={CommonData} />}
                </>}

                {PageType === 'AntibioticMaster' && <>
                    <div className="common_center_tag">
                        <span> Antibiotic Master</span>
                    </div>
                    <br />
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label> AntiBiotic Group Code <span>:</span> </label>
                            <input
                                value={AntibioticMasterdata.anti_biotic_group_code}
                                disabled
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label> AntiBiotic Code <span>:</span> </label>
                            <input
                                value={AntibioticMasterdata.anti_biotic_code}
                                disabled
                            />
                        </div>
                        <div className="RegisForm_1">
                            <label> Specimen <span>:</span> </label>
                            <input
                                name='Specimen'
                                value={AntibioticMasterdata.Specimen}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="RegisForm_1">
  <label>Range Type <span>:</span></label>
  <select
  name='RangeType'
    value={AntibioticMasterdata.RangeType}
    onChange={handleInputChange}
  >
    <option value="">Select Range Type</option>
    <option value="MIC">MIC</option>
    <option value="DISK Diffusion">DISK Diffusion</option>
  </select>
</div>

                        <div className="RegisForm_1">
  <label>Organism Name <span>:</span></label>
  <input
    type="text"
    list="organismlist"
    name="captureorganism"
    value={AntibioticMasterdata.captureorganism}
    onChange={handleInputChange}
  />
  <datalist id="organismlist">
    {captureorganism.map((p, i) => (
      <option key={i} value={p.Organism_Name}>
        {p.Organism_Name}
      </option>
    ))}
  </datalist>
</div>

                        

                        <div className="RegisForm_1">
                            <label> Antibiotic Name<span>:</span> </label>
                            <input
                                type="text"
                                placeholder='Enter Antibiotic Name'
                                name='anti_biotic'
                                required
                                value={AntibioticMasterdata.anti_biotic}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="RegisForm_1">
                            <label>Senstive<span>:</span> </label>
                            <input
                                type="text"
                                placeholder='Enter sensitive range'
                                name='sensitive'
                                required
                                value={AntibioticMasterdata.sensitive}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="RegisForm_1">
                            <label>Intermediate<span>:</span> </label>
                            <input
                                type="text"
                                placeholder='Enter intermediate range'
                                name='intermediate'
                                required
                                value={AntibioticMasterdata.intermediate}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="RegisForm_1">
                            <label>Resistant<span>:</span> </label>
                            <input
                                type="text"
                                placeholder='Enter resistant range'
                                name='resistant'
                                required
                                value={AntibioticMasterdata.resistant}
                                onChange={handleInputChange}
                            />
                        </div>


                    </div>
                    <br />
                    <div className="Main_container_Btn">
                        <button onClick={handleDepartmentsubmit}>
                            {AntibioticMasterdata.isEdit ? 'Update' : 'Save'}
                        </button>
                    </div>

                    <div className="RegisFormcon_1">
  <div className="RegisForm_1">
    <label>Filter by Organism:</label>
    <input
      type="text"
      value={organismFilter}
      onChange={(e) => setOrganismFilter(e.target.value)}
      placeholder="Enter organism name"
    />
  </div>
  <div className="RegisForm_1">
    <label>Filter by Antibiotic:</label>
    <input
      type="text"
      value={antibioticFilter}
      onChange={(e) => setAntibioticFilter(e.target.value)}
      placeholder="Enter antibiotic name"
    />
  </div>
</div>


                    <br />
                    {CommonData.length > 0 &&
                        <ReactGrid columns={AntibioticMasterColumn} RowData={filteredData} />}
                </>}

                {PageType === 'OrganismMaster' && <>
                    <div className="common_center_tag">
                        <span> Organism Master</span>
                    </div>
                    <br />
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label> Organism Code <span>:</span> </label>
                            <input
                                value={OrganismMasterdata.Organism_Code}
                                disabled
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label> Organism Name<span>:</span> </label>
                            <input
                                type="text"
                                placeholder='Enter Organism Name'
                                name='Organism_Name'
                                required
                                value={OrganismMasterdata.Organism_Name}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <br />
                    <div className="Main_container_Btn">
                        <button onClick={handleDepartmentsubmit}>
                            {OrganismMasterdata.isEdit ? 'Update' : 'Save'}
                        </button>
                    </div>
                    <br />
                    {CommonData.length > 0 &&
                        <ReactGrid columns={OrganismMasterColumn} RowData={CommonData} />}
                </>}

                {PageType === 'RemarksMaster' && <>
                    <div className="common_center_tag">
                        <span> Remarks Master</span>
                    </div>
                    <br />
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label> Remarks Code <span>:</span> </label>
                            <input
                                value={RemarksMasterData.Remark_Id}
                                disabled
                            />
                        </div>

                        <div className="RegisForm_1">
                            <label> Remarks Name<span>:</span> </label>
                            <input
                                type="text"
                                placeholder='Enter Remarks'
                                name='Remarks'
                                required
                                value={RemarksMasterData.Remarks}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <br />
                    <div className="Main_container_Btn">
                        <button onClick={handleDepartmentsubmit}>
                            {RemarksMasterData.isEdit ? 'Update' : 'Save'}
                        </button>
                    </div>
                    <br />
                    {CommonData.length > 0 &&
                        <ReactGrid columns={RemarksMasterColumn} RowData={CommonData} />}
                </>}

            </div>
            <ToastAlert Message={toast.message} Type={toast.type} />
        </>
    )
}

export default NewNavigationMasters;

