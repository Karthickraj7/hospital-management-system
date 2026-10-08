import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import ToastAlert from '../../OtherComponent/ToastContainer/ToastAlert';
import Select, { components } from 'react-select';

const GeneralEvaluationMaster = () => {


    const userRecord = useSelector((state) => state.userRecord?.UserData);
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const toast = useSelector(state => state.userRecord?.toast);
    

    const customSelectStyles = {
        control: (provided) => ({
            ...provided,
            border: '1px solid #ccc',
            borderRadius: '4px',
            boxShadow: 'none',
            backgroundColor: 'white',
            width: '200px',
            fontSize: '14px',
            color: '#333',
            padding: '0 5px',
            '&:hover': {
                borderColor: '#999',
            },
        }),
        valueContainer: (provided) => ({
            ...provided,
            padding: '0 5px',
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: '#e6f0fa',
            borderRadius: '3px',
            padding: '1px 3px',
            fontSize: '12px',
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#2a6db0',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: '#2a6db0',
            '&:hover': {
                backgroundColor: '#4a90e2',
                color: 'white',
            },
        }),
        placeholder: (provided) => ({
            ...provided,
            color: '#999',
            fontSize: '14px',
        }),
        menu: (provided) => ({
            ...provided,
            width: '200px',
            borderRadius: '4px',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            marginTop: '2px',
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected ? '#e6f0fa' : state.isFocused ? '#f0f5ff' : 'white',
            color: '#333',
            padding: '5px 10px',
            fontSize: '14px',
            '&:hover': {
                backgroundColor: '#f0f5ff',
            },
        }),
        indicatorsContainer: (provided) => ({
            ...provided,
            padding: '0 5px',
        }),
        dropdownIndicator: (provided) => ({
            ...provided,
            color: '#666',
            '&:hover': {
                color: '#333',
            },
        }),
        clearIndicator: (provided) => ({
            ...provided,
            color: '#666',
            '&:hover': {
                color: '#333',
            },
        }),
    };

    const CustomOption = (props) => {
        return (
            <components.Option {...props}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <input
                        type="checkbox"
                        checked={props.isSelected}
                        onChange={() => null}
                        style={{ marginRight: '8px', width: '14px', height: '14px' }}
                    />
                    <label style={{ fontSize: '14px', color: '#333' }}>{props.label}</label>
                </div>
            </components.Option>
        );
    };

    const [GeneralEvaluationPage, setGeneralEvaluationPage] = useState('DiseaseName');
    const dispatchvalue = useDispatch();

    // DiseaseName State
    const [DiseaseName, setDiseaseName] = useState({
        DiseaseNameId: '',
        DiseaseName: '',
        IsChronicle: 'No',
        IsCommunicable: 'No',
        SpecialityNames: [],
    });

    const [DiseaseNameGet, setDiseaseNameGet] = useState([]);
    const [isDiseaseName, setIsDiseaseName] = useState(false);
    const [SpecialityData, setSpecialityData] = useState([]);
    const [selectedSpecialities, setSelectedSpecialities] = useState([]);

    // console.log(isDiseaseName,'isDiseaseName');
    

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
            .then(response => {
                const specialities = response.data;

                console.log(specialities,'specialities');
                
                setSpecialityData(specialities.map(item => ({
                    value: item.Speciality_Id,
                    label: item.SpecialityName
                })));
            })
            .catch(error => {
                console.error('Error fetching specialities:', error);
            });
    }, []);


    // const handleSpecialityChange = (selectedOptions) => {
    //     const selectedValues = selectedOptions ? selectedOptions.map(option => option.value).join(',') : '';
    //     setDiseaseName((prevState) => ({
    //         ...prevState,
    //         SpecialityNames: selectedValues,
    //     }));
    // };


    const handleSpecialityChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setDiseaseName((prevState) => ({
            ...prevState,
            SpecialityNames: selectedValues, // ✅ Now this is an array of IDs
        }));
    };
    
    

    // const selectedSpecialities = DiseaseName.SpecialityNames
    //     ? SpecialityData.filter(option => DiseaseName.SpecialityNames.split(',').includes(option.value))
    //     : [];

    
    useEffect(() => {
        if (Array.isArray(DiseaseName?.SpecialityNames) && DiseaseName.SpecialityNames.length > 0) {
            const selected = SpecialityData.filter(option =>
                DiseaseName.SpecialityNames.includes(option.value)
            );
            setSelectedSpecialities(selected);
        } else {
            setSelectedSpecialities([]);
        }
    }, [DiseaseName?.SpecialityNames, SpecialityData]);
    
    // DiseaseName Columns
    const DiseaseNameColumn = [
        { key: 'id', name: 'ID' },
        { key: 'DiseaseName', name: 'Disease Name' },
        { key: 'IsChronicle', name: 'Chronic' },
        { key: 'IsCommunicable', name: 'Communicable' },
        { key: 'Speciality', name: 'Specialities' },
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <Button
                    className="cell_btn"
                    onClick={() => handleedit_DiseaseName_status(params.row)}
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
                    onClick={() => handleeditDiseaseName(params.row)}
                >
                    <EditIcon className="check_box_clrr_cancell" />
                </Button>
            ),
        }
    ];


    const handleeditDiseaseName = (params) => {
        const { id, ...rest } = params;
        setDiseaseName({
            DiseaseNameId: id,
            DiseaseName: rest.DiseaseName,
            IsChronicle: rest.IsChronicle,
            IsCommunicable: rest.IsCommunicable,
            SpecialityNames: rest.SpecialityNames || '',
        });
    };

    const handleedit_DiseaseName_status = (params) => {
        const data = { 
            DiseaseNameId: params.id, 
            Statusedit: true
         };
        axios.post(`${UrlLink}Masters/DiseaseName_Master_link`, data)
            .then((res) => {
                const resres = res.data
                let typp = Object.keys(resres)[0]
                let mess = Object.values(resres)[0]
                const tdata = {
                    message: mess,
                    type: typp,
                }
                dispatchvalue({ type: 'toast', value: tdata });
                setIsDiseaseName(prev => !prev)
            })
            .catch((err) => console.log(err));
    };

    const handleDiseaseNameChange = (e) => {
        const { name, type, value, checked } = e.target;
        setDiseaseName((prevState) => ({
            ...prevState,
            [name]: type === 'checkbox' ? (checked ? "Yes" : "No") : value,
        }));
    };
    


    useEffect(() => {
        axios.get(`${UrlLink}Masters/DiseaseName_Master_link`)
            .then(response => {
                setDiseaseNameGet(response.data);
            })
            .catch(error => {
                console.error('Error fetching disease names:', error);
            });
    }, [isDiseaseName]);


    const handleDiseaseNameSubmit = () => {

        if (DiseaseName.DiseaseName && DiseaseName.SpecialityNames) {
            const data = {
                ...DiseaseName,
                created_by: userRecord?.username || ''
            }
            console.log(data,'data---------');
            
            axios.post(`${UrlLink}Masters/DiseaseName_Master_link`, data)
                .then((res) => {
                    const resres = res.data
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsDiseaseName(prev => !prev)
                    setDiseaseName({
                        DiseaseNameId: '',
                        DiseaseName: '',
                        IsChronicle: 'No',
                        IsCommunicable: 'No',
                        SpecialityNames: ''
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide both DiseaseName and Speciality.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
    }


    //---------------------------------------------------------------------



    
    // PrimaryComplaint State
    const [PrimaryComplaint, setPrimaryComplaint] = useState({ 
        PrimaryComplaintId: '', 
        PrimaryComplaintName: '' 
    });
    const [PrimaryComplaintGet, setPrimaryComplaintGet] = useState([]);
    const [isPrimaryComplaint, setIsPrimaryComplaint] = useState(false);

    // console.log(isPrimaryComplaint,'isPrimaryComplaint');
    // console.log(PrimaryComplaintGet,'PrimaryComplaintGet');
    

    const PrimaryComplaintColumn = [
        { key: 'id', name: 'ID' },
        { key: 'PrimaryComplaintName', 
            name: 'PrimaryComplaintName' 
        },
       
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <Button
                    className="cell_btn"
                    onClick={() => handleedit_PrimaryComplaint_status(params.row)}
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
                    onClick={() => handleeditPrimaryComplaint(params.row)}
                >
                    <EditIcon className="check_box_clrr_cancell" />
                </Button>
            ),
        }
    ];

    const handleeditPrimaryComplaint = (params) => {
        // console.log(params,'handleeditPrimaryComplaint---------');
        
        const { id, ...rest } = params;
        setPrimaryComplaint({
            PrimaryComplaintId: id,
            PrimaryComplaintName: rest.PrimaryComplaintName,
           
        });
    };


    const handleedit_PrimaryComplaint_status = (params) => {
        console.log(params,'params--------')
        const data = { 
            PrimaryComplaintId: params.id, 
            Statusedit: true
         };
        axios.post(`${UrlLink}Masters/PrimaryComplaint_Master_link`, data)
            .then((res) => {
                const resres = res.data
                let typp = Object.keys(resres)[0]
                let mess = Object.values(resres)[0]
                const tdata = {
                    message: mess,
                    type: typp,
                }
                dispatchvalue({ type: 'toast', value: tdata });
                setIsPrimaryComplaint(prev => !prev)
            })
            .catch((err) => console.log(err));
    };


    // const handleChange = (e) => {
    //     const { name, value, } = e.target;
    //     setPrimaryComplaint((prevState) => ({
    //         ...prevState,
    //         [name]:  value,
    //     }));
    // };


    
    useEffect(() => {
        axios.get(`${UrlLink}Masters/PrimaryComplaint_Master_link`)
            .then(response => {
                const ressss = response.data;
                // console.log(ressss,'ressss-----------');
                
                setPrimaryComplaintGet(ressss);
            })
            .catch(error => {
                console.error('Error fetching PrimaryComplaint names:', error);
            });
    }, [isPrimaryComplaint,UrlLink]);


    
      
    const handleSubmitPrimaryComplaint = () => {

        if (PrimaryComplaint.PrimaryComplaintName) {
            const data = {
                ...PrimaryComplaint,
                created_by: userRecord?.username || ''
            }
            // console.log(data,'data=----------');
            
            axios.post(`${UrlLink}Masters/PrimaryComplaint_Master_link`, data)
                .then((res) => {
                    const resres = res.data
                    // console.log(resres,'resres-------');
                    
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsPrimaryComplaint(prev => !prev)
                    setPrimaryComplaint({
                        PrimaryComplaintId: '',
                        PrimaryComplaintName: '',
                        
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide PrimaryComplaint.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
    }

    //-----------------------------------------------------------------

    // ChiefComplaint State
    const [ChiefComplaint, setChiefComplaint] = useState({ 
        ChiefComplaintId: '', 
        ChiefComplaintName: '',
        PrimaryComplaints:'',
    });
    const [ChiefComplaintGet, setChiefComplaintGet] = useState([]);
    const [isChiefComplaint, setIsChiefComplaint] = useState(false);
    const [primaryComplaintNameInput, setPrimaryComplaintNameInput] = useState("");

    console.log(ChiefComplaintGet,'ChiefComplaintGet');
    
    useEffect(() => {
        const matched = PrimaryComplaintGet.find(
          (item) => item.id === ChiefComplaint.PrimaryComplaints
        );
        if (matched) {
          setPrimaryComplaintNameInput(matched.PrimaryComplaintName);
        } else {
          setPrimaryComplaintNameInput(""); // Clear if not matched
        }
      }, [ChiefComplaint.PrimaryComplaints, PrimaryComplaintGet]);
      
    const ChiefComplaintColumn = [
        { key: 'id', name: 'ID' },
        { key: 'S.No', name: 'Idx' },
        { key: 'PrimaryComplaintName', 
          name: 'PrimaryComplaintName' 
        },
        { key: 'ChiefComplaintName', 
          name: 'ChiefComplaintName' 
        },
       
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <Button
                    className="cell_btn"
                    onClick={() => handleedit_ChiefComplaint_status(params.row)}
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
                    onClick={() => handleeditChiefComplaint(params.row)}
                >
                    <EditIcon className="check_box_clrr_cancell" />
                </Button>
            ),
        }
    ];


    const handleeditChiefComplaint = (params) => {
        console.log(params,'params---------');
        
        const { id, ...rest } = params;
        setChiefComplaint({
            ChiefComplaintId: id,
            PrimaryComplaints: rest.PrimaryComplaintId,
            ChiefComplaintName: rest.ChiefComplaintName,
           
        });
    };


    const handleedit_ChiefComplaint_status = (params) => {
        const data = { 
            ChiefComplaintId: params.id, 
            Statusedit: true
         };
        axios.post(`${UrlLink}Masters/ChiefComplaint_Master_link`, data)
            .then((res) => {
                const resres = res.data
                let typp = Object.keys(resres)[0]
                let mess = Object.values(resres)[0]
                const tdata = {
                    message: mess,
                    type: typp,
                }
                dispatchvalue({ type: 'toast', value: tdata });
                setIsChiefComplaint(prev => !prev)
            })
            .catch((err) => console.log(err));
    };


  
    
    
    useEffect(() => {
        axios.get(`${UrlLink}Masters/ChiefComplaint_Master_link`)
            .then(response => {

                const ressss = response.data;
                setChiefComplaintGet(ressss);
            })
            .catch(error => {
                console.error('Error fetching PrimaryComplaint names:', error);
            });
    }, [isChiefComplaint,UrlLink]);


    
    const handleSubmitChiefComplaint = () => {

        if (ChiefComplaint.ChiefComplaintName && ChiefComplaint.PrimaryComplaints) {
            const data = {
                ...ChiefComplaint,
                created_by: userRecord?.username || ''
            }
            console.log(data,'data=----------');

            axios.post(`${UrlLink}Masters/ChiefComplaint_Master_link`, data)
                .then((res) => {
                    const resres = res.data
                    console.log(resres,'resres-------');

                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsChiefComplaint(prev => !prev)
                    setChiefComplaint({
                        ChiefComplaintId: '', 
                        ChiefComplaintName: '',
                        PrimaryComplaints: '',
                        
                    });
                    setPrimaryComplaintNameInput('')
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide ChiefComplaint.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
    }


    //-----------------------------------------------------------------

    // History State
    const [History, setHistory] = useState({ 
        HistoryId: '',
        HistoryName: '',
        PrimaryComplaint:'',
        ChiefComplaint:'',
    });
    const [HistoryGet, setHistoryGet] = useState([]);
    const [isHistory, setIsHistory] = useState(false);
    const [PrimaryComp, setPrimaryComp] = useState("");
    const [ChiefComp, setChiefComp] = useState("");

    useEffect(() => {
        if (ChiefComplaintGet.length > 0) {
            const uniquePrimary = [];
    
            ChiefComplaintGet.forEach(item => {
                if (!uniquePrimary.some(p => p.id === item.PrimaryComplaintId)) {
                    uniquePrimary.push({
                        id: item.PrimaryComplaintId,
                        PrimaryComplaintName: item.PrimaryComplaintName
                    });
                }
            });
    
            setPrimaryComplaintGet(uniquePrimary);
        }
    }, [ChiefComplaintGet]);
    
    
    useEffect(() => {
        const matchedChief = ChiefComplaintGet.find(
            (item) => item.id === History.ChiefComplaint
        );
        const matchedPrimary = PrimaryComplaintGet.find(
            (item) => item.id === History.PrimaryComplaint
        );
    
        setChiefComp(matchedChief ? matchedChief.ChiefComplaintName : "");
        setPrimaryComp(matchedPrimary ? matchedPrimary.PrimaryComplaintName : "");
    }, [History.PrimaryComplaint, History.ChiefComplaint, PrimaryComplaintGet, ChiefComplaintGet]);
    

    const HistoryColumn = [
        { key: 'id', name: 'ID' },
        { key: 'PrimaryComplaintName', 
            name: 'PrimaryComplaintName' 
        },
        { key: 'ChiefComplaintName', 
        name: 'ChiefComplaintName' 
        },
        { key: 'HistoryName', 
          name: 'HistoryName' 
        },
       
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <Button
                    className="cell_btn"
                    onClick={() => handleedit_History_status(params.row)}
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
                    onClick={() => handleeditHistory(params.row)}
                >
                    <EditIcon className="check_box_clrr_cancell" />
                </Button>
            ),
        }
    ];

    const handleeditHistory = (params) => {
        const { id, ...rest } = params;
        setHistory({
            HistoryId: id,
            HistoryName: rest.HistoryName,
            PrimaryComplaint: rest.PrimaryComplaintId,
            ChiefComplaint: rest.ChiefComplaintId,
           
        });
    };


    const handleedit_History_status = (params) => {

        console.log(params,'params--------');
        
        const data = { 
            HistoryId: params.id, 
            Statusedit: true
        };

        axios.post(`${UrlLink}Masters/History_Master_link`, data)
            .then((res) => {
                const resres = res.data
                let typp = Object.keys(resres)[0]
                let mess = Object.values(resres)[0]
                const tdata = {
                    message: mess,
                    type: typp,
                }
                dispatchvalue({ type: 'toast', value: tdata });
                setIsHistory(prev => !prev)
            })
            .catch((err) => console.log(err));
    };


    // const handleChange = (e) => {
    //     const { name, type, value, checked } = e.target;
    //     const finalValue = type === 'checkbox' ? (checked ? "Yes" : "No") : value;
    
    //     setPrimaryComplaint((prevState) => ({
    //         ...prevState,
    //         [name]: finalValue,
    //     }));
    
    //     setChiefComplaint((prevState) => ({
    //         ...prevState,
    //         [name]: value,
    //     }));
    //     setHistory((prevState) => ({
    //         ...prevState,
    //         [name]: value,
    //     }));
    // };


    useEffect(() => {
        axios.get(`${UrlLink}Masters/History_Master_link`)
            .then(response => {
                const resData = response.data
                setHistoryGet(resData);
            })
            .catch(error => {
                console.error('Error fetching PrimaryComplaint names:', error);
            });
    }, [isHistory,UrlLink]);


    
    const handleSubmitHistory = () => {

        if (  History.PrimaryComplaint && History.ChiefComplaint && History.HistoryName) {
            const data = {
                ...History,
                created_by: userRecord?.username || ''
            }

            console.log(data,'data-------');
            
            axios.post(`${UrlLink}Masters/History_Master_link`, data)
                .then((res) => {
                    const resres = res.data
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsHistory(prev => !prev)
                    setHistory({
                        HistoryId: '',
                        HistoryName: '',
                        PrimaryComplaint:'',
                        ChiefComplaint:'',
                        
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide HistoryName.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
    }



    //-----------------------------------------------------------------

    // Examination State
    const [Examination, setExamination] = useState({ 
        ExaminationId: '',
        ExaminationName: '' 
    });
    const [ExaminationGet, setExaminationGet] = useState([]);
    const [isExamination, setIsExamination] = useState(false);

    console.log(isExamination,'isExamination');
    console.log(ExaminationGet,'ExaminationGet');
    
    
    const ExaminationColumn = [
        { key: 'id', name: 'ID' },
        { key: 'ExaminationName', 
          name: 'ExaminationName' 
        },
       
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <Button
                    className="cell_btn"
                    onClick={() => handleedit_Examination_status(params.row)}
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
                    onClick={() => handleeditExamination(params.row)}
                >
                    <EditIcon className="check_box_clrr_cancell" />
                </Button>
            ),
        }
    ];

    const handleeditExamination = (params) => {
        console.log(params,'params------');
        
        const { id, ...rest } = params;
        setExamination({
            ExaminationId: id,
            ExaminationName: rest.ExaminationName,
           
        });
    };


    const handleedit_Examination_status = (params) => {
        const data = { 
            ExaminationId: params.id, 
            Statusedit: true
         };
        axios.post(`${UrlLink}Masters/Examination_Master_link`, data)
            .then((res) => {
                const resres = res.data
                let typp = Object.keys(resres)[0]
                let mess = Object.values(resres)[0]
                const tdata = {
                    message: mess,
                    type: typp,
                }
                dispatchvalue({ type: 'toast', value: tdata });
                setIsExamination(prev => !prev)
            })
            .catch((err) => console.log(err));
    };



    const handleChange = (e) => {
        const { name, type, value, checked } = e.target;
        const finalValue = type === "checkbox" ? (checked ? "Yes" : "No") : value;
      
        console.log(name, "name-----");
      
        // Update the local input value for the Primary Complaint field
        if (name === "PrimaryComplaints") {
          setPrimaryComplaintNameInput(finalValue);
      
          const matchedComplaint = PrimaryComplaintGet.find(
            (item) => item.PrimaryComplaintName === finalValue
          );
      
          setChiefComplaint((prev) => ({
            ...prev,
            PrimaryComplaints: matchedComplaint ? matchedComplaint.id : "",
          }));
        } else {
          // For other fields, update ChiefComplaint directly
          setChiefComplaint((prevState) => ({
            ...prevState,
            [name]: finalValue,
          }));
        }

        // Update for PrimaryComplaint
        if (name === "PrimaryComplaint") {
            setPrimaryComp(value);

            const matchedPrimary = PrimaryComplaintGet.find(
                (item) => item.PrimaryComplaintName === value
            );

            setHistory((prev) => ({
                ...prev,
                PrimaryComplaint: matchedPrimary ? matchedPrimary.id : "",
                ChiefComplaint: "", // Clear ChiefComplaint when Primary changes
            }));

            setChiefComp(""); // Clear ChiefComplaint input
            return; // Exit to prevent double-setting below
        }

        // Update for ChiefComplaint
        if (name === "ChiefComplaint") {
            setChiefComp(value);

            const matchedChief = ChiefComplaintGet.find(
                (item) =>
                    item.ChiefComplaintName === value &&
                    item.PrimaryComplaintId === History.PrimaryComplaint
            );

            setHistory((prev) => ({
                ...prev,
                ChiefComplaint: matchedChief ? matchedChief.id : "",
            }));
            return;
        }

      
        // Update all other related states (regardless of field)
        setPrimaryComplaint((prevState) => ({
          ...prevState,
          [name]: finalValue,
        }));
      
        setHistory((prevState) => ({
          ...prevState,
          [name]: finalValue,
        }));
      
        setExamination((prevState) => ({
          ...prevState,
          [name]: finalValue,
        }));
      };
      

    useEffect(() => {
        axios.get(`${UrlLink}Masters/Examination_Master_link`)
            .then(response => {
                const resData = response.data
                console.log(resData,'resData');
                setExaminationGet(resData);
            })
            .catch(error => {
                console.error('Error fetching PrimaryComplaint names:', error);
            });
    }, [isExamination,UrlLink]);


    
    const handleSubmitExamination = () => {

        if (Examination.ExaminationName) {
            const data = {
                ...Examination,
                created_by: userRecord?.username || ''
            }
            axios.post(`${UrlLink}Masters/Examination_Master_link`, data)
                .then((res) => {
                    const resres = res.data
                    let typp = Object.keys(resres)[0]
                    let mess = Object.values(resres)[0]
                    const tdata = {
                        message: mess,
                        type: typp,
                    }

                    dispatchvalue({ type: 'toast', value: tdata });
                    setIsExamination(prev => !prev)
                    setExamination({
                        ExaminationId: '',
                        ExaminationName: '' 
                        
                    });
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            const tdata = {
                message: `Please provide Examination.`,
                type: 'warn'
            }
            dispatchvalue({ type: 'toast', value: tdata });
        }
    }




    //-----------------------------------------------------------------


    const resetAllFields = () => {
        setDiseaseName({
            DiseaseName: '',
            IsChronicle: '',
            IsCommunicable: '',
            DiseaseNameId: null
        });
    
        setSelectedSpecialities([]);
    
        setPrimaryComplaint({
            PrimaryComplaintName: '',
            PrimaryComplaintId: null
        });
    
        setChiefComplaint({
            ChiefComplaintName: '',
            PrimaryComplaints: '',
            ChiefComplaintId: null
        });
    
        setPrimaryComplaintNameInput('');
    
        setHistory({
            HistoryName: '',
            PrimaryComplaint: '',
            ChiefComplaint: '',
            HistoryId: null
        });
    
        setPrimaryComp('');
        setChiefComp('');
    
        setExamination({
            ExaminationName: '',
            ExaminationId: null
        });
    };



    const handlePageChange = (event) => {
        const selectedPage = event.target.value;
        resetAllFields(); // Reset everything
        setGeneralEvaluationPage(selectedPage); // Set the selected tab/page
    };
    
    



  return (
    <div className="Main_container_app">
        <h3>General Evaluation Master</h3>
        <div className="RegisterTypecon">
            <div className="RegisterType eced_p00">
                {["DiseaseName", "PrimaryComplaint", "ChiefComplaint", "History", "Examination"].map((p, ind) => (
                    <div className="registertypeval registertypeval_222" key={ind}>
                        <input
                            type="radio"
                            id={p}
                            name="appointment_type"
                            checked={GeneralEvaluationPage === p}
                            onChange={handlePageChange}
                            value={p}
                        />
                        <label htmlFor={p}>{p}</label>
                    </div>
                ))}
            </div>
        </div>
        <br />

        {/* DiseaseName Section */}
        {GeneralEvaluationPage === 'DiseaseName' && (
            <>
                <div className="RegisFormcon_1">
                    <div className="RegisForm_1">
                        <label>Disease Name <span>:</span></label>
                        <input
                            type="text"
                            name="DiseaseName"
                            required
                            value={DiseaseName.DiseaseName}
                            onChange={handleDiseaseNameChange}
                        />
                    </div>
                    <div className="RegisForm_1">
                        <label>Is Chronicle</label>
                        <span style={{ width: "120px", display: "flex", gap: "5px", alignItems: "center", textAlign: "left", fontSize: "11px", color: "black" }}>
                            <input
                                id="chronicleYes"
                                type="checkbox"
                                name="IsChronicle"
                                value="Yes"
                                style={{ width: "15px" }}
                                checked={DiseaseName.IsChronicle === "Yes"}
                                onChange={handleDiseaseNameChange}
                            />
                            Yes
                        </span>
                    </div>
                    <div className="RegisForm_1">
                        <label>Is Communicable</label>
                        <span style={{ width: "120px", display: "flex", gap: "5px", alignItems: "center", textAlign: "left", fontSize: "11px", color: "black" }}>
                            <input
                                id="commYes"
                                type="checkbox"
                                name="IsCommunicable"
                                value="Yes"
                                style={{ width: "15px" }}
                                checked={DiseaseName.IsCommunicable === "Yes"}
                                onChange={handleDiseaseNameChange}
                            />
                            Yes
                        </span>
                    </div>
                    <div className="RegisForm_1">
                        <label>Speciality Names</label>
                        <Select
                            isMulti
                            options={SpecialityData}
                            value={selectedSpecialities}
                            onChange={handleSpecialityChange}
                            placeholder="Select Specialities"
                            styles={customSelectStyles}
                            components={{ Option: CustomOption }}
                            closeMenuOnSelect={false}
                            hideSelectedOptions={false}
                        />
                    </div>
                </div>
                <div className="Main_container_Btn">
                    <button onClick={handleDiseaseNameSubmit}>
                        {DiseaseName.DiseaseNameId ? "Update" : "Add"}
                    </button>
                </div>
                {DiseaseNameGet.length > 0 && (
                    <ReactGrid
                        columns={DiseaseNameColumn}
                        RowData={DiseaseNameGet}
                    />
                )}
            </>
        )}

        {/* PrimaryComplaint Section */}
        {GeneralEvaluationPage === 'PrimaryComplaint' && (
            <>
                <div className="RegisFormcon_1">
                    <div className="RegisForm_1">
                        <label>Primary Complaint <span>:</span></label>
                        <input
                            type="text"
                            name="PrimaryComplaintName"
                            required
                            value={PrimaryComplaint.PrimaryComplaintName}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="Main_container_Btn">
                    <button onClick={handleSubmitPrimaryComplaint}>
                        {PrimaryComplaint.PrimaryComplaintId ? "Update" : "Add"}
                    </button>
                </div>
                {PrimaryComplaintGet.length > 0 && (
                    <ReactGrid
                        columns={PrimaryComplaintColumn}
                        RowData={PrimaryComplaintGet}
                    />
                )}
            </>
        )}


        {/* ChiefComplaint Section */}
        {GeneralEvaluationPage === 'ChiefComplaint' && (
            <>
              


                <div className="RegisFormcon_1">

                    <div className="RegisForm_1">
                        <label>Primary Complaint <span>:</span></label>
                        <input 
                        list="primaryComplaints" 
                        placeholder="Select or type a complaint" 
                        name="PrimaryComplaints"
                        required
                        // value={
                        //     PrimaryComplaintGet.find(
                        //       (item) => item.id === ChiefComplaint.PrimaryComplaints
                        //     )?.PrimaryComplaintName || ""
                        //   }
                        // value={ChiefComplaint.PrimaryComplaints}
                        value={primaryComplaintNameInput}
                        onChange={handleChange}
                        />
                        <datalist id="primaryComplaints">
                            {PrimaryComplaintGet.map((complaint) => (
                            <option key={complaint.id} value={complaint.PrimaryComplaintName} />
                            ))}
                        </datalist>
                    </div>

                    <div className="RegisForm_1">
                        <label>Chief Complaint <span>:</span></label>
                        <input
                            type="text"
                            name="ChiefComplaintName"
                            required
                            value={ChiefComplaint.ChiefComplaintName}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="Main_container_Btn">
                    <button onClick={handleSubmitChiefComplaint}>
                        {ChiefComplaint.ChiefComplaintId ? "Update" : "Add"}
                    </button>
                </div>
                {ChiefComplaintGet.length > 0 && (
                    <ReactGrid
                        columns={ChiefComplaintColumn}
                        RowData={ChiefComplaintGet}
                    />
                )}
            </>
        )}

         {/* History Section */}
        {GeneralEvaluationPage === 'History' && (
            <>
                <div className="RegisFormcon_1">

                    <div className="RegisForm_1">
                        <label>Primary Complaint <span>:</span></label>
                        <input
                            list="PrimaryComplaintList"
                            placeholder="Select or type a complaint"
                            name="PrimaryComplaint"
                            required
                            value={PrimaryComp}
                            onChange={handleChange}
                        />
                        <datalist id="PrimaryComplaintList">
                            {PrimaryComplaintGet.map((complaint) => (
                                <option key={complaint.id} value={complaint.PrimaryComplaintName} />
                            ))}
                        </datalist>
                    </div>

                    <div className="RegisForm_1">
                        <label>Chief Complaint <span>:</span></label>
                        <input
                            list="ChiefComplaintList"
                            placeholder="Select or type a complaint"
                            name="ChiefComplaint"
                            required
                            value={ChiefComp}
                            onChange={handleChange}
                        />
                        <datalist id="ChiefComplaintList">
                            {ChiefComplaintGet
                                .filter((item) => item.PrimaryComplaintId === History.PrimaryComplaint)
                                .map((complaint) => (
                                    <option key={complaint.id} value={complaint.ChiefComplaintName} />
                                ))}
                        </datalist>
                    </div>



                    <div className="RegisForm_1">
                        <label>History <span>:</span></label>
                        <input
                            type="text"
                            name="HistoryName"
                            required
                            value={History.HistoryName}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="Main_container_Btn">
                    <button onClick={handleSubmitHistory}>
                        {History.HistoryId ? "Update" : "Add"}
                    </button>
                </div>
                {HistoryGet.length > 0 && (
                    <ReactGrid
                        columns={HistoryColumn}
                        RowData={HistoryGet}
                    />
                )}
            </>
        )}

        {/* Examination Section */}
        {GeneralEvaluationPage === 'Examination' && (
            <>
                <div className="RegisFormcon_1">
                    <div className="RegisForm_1">
                        <label>Examination <span>:</span></label>
                        <input
                            type="text"
                            name="ExaminationName"
                            required
                            value={Examination.ExaminationName}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="Main_container_Btn">
                    <button onClick={handleSubmitExamination}>
                        {Examination.ExaminationId ? "Update" : "Add"}
                    </button>
                </div>
                {ExaminationGet.length > 0 && (
                    <ReactGrid
                        columns={ExaminationColumn}
                        RowData={ExaminationGet}
                    />
                )}
            </>
        )}



        <ToastAlert Message={toast.message} Type={toast.type} />


    </div>
    
  )
}

export default GeneralEvaluationMaster
