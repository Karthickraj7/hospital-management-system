import React, { useState, useEffect } from "react";
import { useSelector } from 'react-redux';
import ReactGrid from "../../OtherComponent/ReactGrid/ReactGrid";
import Button from "@mui/material/Button";
import EditIcon from "@mui/icons-material/Edit";
import axios from "axios";
import Select, { components } from 'react-select';

const DiseaseNameMaster = () => {
    const UrlLink = useSelector(state => state.userRecord?.UrlLink);
    const [GeneralEvaluationPage, setGeneralEvaluationPage] = useState('DiseaseName');

    // DiseaseName State
    const [DiseaseName, setDiseaseName] = useState({
        DiseaseNameId: '',
        DiseaseName: '',
        IsChronicle: 'No',
        IsCommunicable: 'No',
        SpecialityNames: '',
    });
    const [DiseaseNameArr, setDiseaseNameArr] = useState([]);
    const [isDiseaseNameArr, setIsDiseaseNameArr] = useState(false);
    const [SpecialityData, setSpecialityData] = useState([]);

    // PrimaryComplaint State
    const [PrimaryComplaint, setPrimaryComplaint] = useState({ id: '', name: '' });
    const [PrimaryComplaintArr, setPrimaryComplaintArr] = useState([]);
    const [isPrimaryComplaintArr, setIsPrimaryComplaintArr] = useState(false);

    // ChiefComplaint State
    const [ChiefComplaint, setChiefComplaint] = useState({ id: '', name: '' });
    const [ChiefComplaintArr, setChiefComplaintArr] = useState([]);
    const [isChiefComplaintArr, setIsChiefComplaintArr] = useState(false);

    // History State
    const [History, setHistory] = useState({ id: '', name: '' });
    const [HistoryArr, setHistoryArr] = useState([]);
    const [isHistoryArr, setIsHistoryArr] = useState(false);

    // Examination State
    const [Examination, setExamination] = useState({ id: '', name: '' });
    const [ExaminationArr, setExaminationArr] = useState([]);
    const [isExaminationArr, setIsExaminationArr] = useState(false);

    // DiseaseName Columns
    const DiseaseNameColumn = [
        { key: 'id', name: 'ID' },
        { key: 'DiseaseName', name: 'Disease Name' },
        { key: 'IsChronicle', name: 'Chronic' },
        { key: 'IsCommunicable', name: 'Communicable' },
        { key: 'SpecialityNames', name: 'Specialities' },
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <Button
                    className="cell_btn"
                    onClick={() => handleedite_DiseaseName_status(params.row)}
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

    // Common Columns for new sections
    const commonColumns = (handleEdit, handleStatus) => [
        { key: 'id', name: 'ID' },
        { key: 'name', name: 'Name' },
        {
            key: "Status",
            name: "Status",
            renderCell: (params) => (
                <Button className="cell_btn" onClick={() => handleStatus(params.row)}>
                    {params.row.Status}
                </Button>
            ),
        },
        {
            key: "Action",
            name: "Action",
            renderCell: (params) => (
                <Button className="cell_btn" onClick={() => handleEdit(params.row)}>
                    <EditIcon className="check_box_clrr_cancell" />
                </Button>
            ),
        }
    ];

    // DiseaseName Handlers
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

    const handleedite_DiseaseName_status = (params) => {
        const data = { DiseaseNameId: +params.id, Statusedit: true };
        axios.post(`${UrlLink}Masters/DiseaseName_Master_link`, data)
            .then(() => setIsDiseaseNameArr(prev => !prev))
            .catch((err) => console.log(err));
    };

    const handleDiseaseNameChange = (e) => {
        const { name, value } = e.target;
        setDiseaseName((prevState) => ({
            ...prevState,
            [name]: value?.toUpperCase()?.trim(),
        }));
    };

    const fetchDiseaseNames = async () => {
        try {
            const response = await axios.get(`${UrlLink}Masters/DiseaseName_Master_link`);
            setDiseaseNameArr(response.data);
        } catch (error) {
            console.error('Error fetching disease names:', error);
        }
    };

    const fetchSpecialities = async () => {
        try {
            const response = await axios.get(`${UrlLink}Masters/Speciality_Detials_link`);
            const specialities = response.data;
            setSpecialityData(specialities.map(item => ({
                value: item.SpecialityName,
                label: item.SpecialityName
            })));
        } catch (error) {
            console.error('Error fetching specialities:', error);
        }
    };

    const handleSpecialityChange = (selectedOptions) => {
        const selectedValues = selectedOptions ? selectedOptions.map(option => option.value).join(',') : '';
        setDiseaseName((prevState) => ({
            ...prevState,
            SpecialityNames: selectedValues,
        }));
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

    const handleDiseaseNameSubmit = async () => {
        try {
            const payload = {
                DiseaseNameId: DiseaseName.DiseaseNameId,
                DiseaseName: DiseaseName.DiseaseName,
                IsChronicle: DiseaseName.IsChronicle,
                IsCommunicable: DiseaseName.IsCommunicable,
                SpecialityNames: DiseaseName.SpecialityNames,
            };

            const response = await axios.post(`${UrlLink}Masters/DiseaseName_Master_link`, payload);
            if (response.data.success) {
                setDiseaseName({
                    DiseaseNameId: '',
                    DiseaseName: '',
                    IsChronicle: 'No',
                    IsCommunicable: 'No',
                    SpecialityNames: ''
                });
                fetchDiseaseNames();
            } else if (response.data.warn) {
                alert(response.data.warn);
            }
        } catch (error) {
            console.error('Error submitting disease name:', error);
            alert('An error occurred while submitting');
        }
    };

    // Common Handlers for new sections
    const handleEdit = (setState) => (params) => {
        const { id, name } = params;
        setState({ id, name });
    };

    const handleStatus = (endpoint, setIsArr) => (params) => {
        const data = { id: +params.id, Statusedit: true };
        axios.post(`${UrlLink}Masters/${endpoint}`, data)
            .then(() => setIsArr(prev => !prev))
            .catch((err) => console.log(err));
    };

    const handleChange = (setState) => (e) => {
        const { name, value } = e.target;
        setState(prev => ({ ...prev, [name]: value?.toUpperCase()?.trim() }));
    };

    const handleSubmit = (endpoint, state, setState, fetchFunc) => async () => {
        try {
            const response = await axios.post(`${UrlLink}Masters/${endpoint}`, state);
            if (response.data.success) {
                setState({ id: '', name: '' });
                fetchFunc();
            } else if (response.data.warn) {
                alert(response.data.warn);
            }
        } catch (error) {
            console.error(`Error submitting ${endpoint}:`, error);
            alert('An error occurred while submitting');
        }
    };

    // Fetch Functions
    const fetchData = (endpoint, setArr) => async () => {
        try {
            const response = await axios.get(`${UrlLink}Masters/${endpoint}`);
            setArr(response.data);
        } catch (error) {
            console.error(`Error fetching ${endpoint}:`, error);
        }
    };

    useEffect(() => {
        fetchDiseaseNames();
        fetchSpecialities();
        fetchData('PrimaryComplaint_Master_link', setPrimaryComplaintArr)();
        fetchData('ChiefComplaint_Master_link', setChiefComplaintArr)();
        fetchData('History_Master_link', setHistoryArr)();
        fetchData('Examination_Master_link', setExaminationArr)();
    }, [isDiseaseNameArr, isPrimaryComplaintArr, isChiefComplaintArr, isHistoryArr, isExaminationArr]);

    // Fix for react-select value prop
    const selectedSpecialities = DiseaseName.SpecialityNames
        ? SpecialityData.filter(option => DiseaseName.SpecialityNames.split(',').includes(option.value))
        : [];

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
                                onChange={() => setGeneralEvaluationPage(p)}
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
                                    value="Yes"
                                    style={{ width: "15px" }}
                                    checked={DiseaseName.IsChronicle === "Yes"}
                                    onChange={(e) =>
                                        setDiseaseName((prevState) => ({
                                            ...prevState,
                                            IsChronicle: e.target.checked ? "Yes" : "No",
                                        }))
                                    }
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
                                    value="Yes"
                                    style={{ width: "15px" }}
                                    checked={DiseaseName.IsCommunicable === "Yes"}
                                    onChange={(e) =>
                                        setDiseaseName((prevState) => ({
                                            ...prevState,
                                            IsCommunicable: e.target.checked ? "Yes" : "No",
                                        }))
                                    }
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
                    {DiseaseNameArr.length > 0 && (
                        <ReactGrid
                            columns={DiseaseNameColumn}
                            RowData={DiseaseNameArr}
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
                                name="name"
                                required
                                value={PrimaryComplaint.name}
                                onChange={handleChange(setPrimaryComplaint)}
                            />
                        </div>
                    </div>
                    <div className="Main_container_Btn">
                        <button onClick={handleSubmit('PrimaryComplaint_Master_link', PrimaryComplaint, setPrimaryComplaint, fetchData('PrimaryComplaint_Master_link', setPrimaryComplaintArr))}>
                            {PrimaryComplaint.id ? "Update" : "Add"}
                        </button>
                    </div>
                    {PrimaryComplaintArr.length > 0 && (
                        <ReactGrid
                            columns={commonColumns(handleEdit(setPrimaryComplaint), handleStatus('PrimaryComplaint_Master_link', setIsPrimaryComplaintArr))}
                            RowData={PrimaryComplaintArr}
                        />
                    )}
                </>
            )}

            {/* ChiefComplaint Section */}
            {GeneralEvaluationPage === 'ChiefComplaint' && (
                <>
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label>Chief Complaint <span>:</span></label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={ChiefComplaint.name}
                                onChange={handleChange(setChiefComplaint)}
                            />
                        </div>
                    </div>
                    <div className="Main_container_Btn">
                        <button onClick={handleSubmit('ChiefComplaint_Master_link', ChiefComplaint, setChiefComplaint, fetchData('ChiefComplaint_Master_link', setChiefComplaintArr))}>
                            {ChiefComplaint.id ? "Update" : "Add"}
                        </button>
                    </div>
                    {ChiefComplaintArr.length > 0 && (
                        <ReactGrid
                            columns={commonColumns(handleEdit(setChiefComplaint), handleStatus('ChiefComplaint_Master_link', setIsChiefComplaintArr))}
                            RowData={ChiefComplaintArr}
                        />
                    )}
                </>
            )}

            {/* History Section */}
            {GeneralEvaluationPage === 'History' && (
                <>
                    <div className="RegisFormcon_1">
                        <div className="RegisForm_1">
                            <label>History <span>:</span></label>
                            <input
                                type="text"
                                name="name"
                                required
                                value={History.name}
                                onChange={handleChange(setHistory)}
                            />
                        </div>
                    </div>
                    <div className="Main_container_Btn">
                        <button onClick={handleSubmit('History_Master_link', History, setHistory, fetchData('History_Master_link', setHistoryArr))}>
                            {History.id ? "Update" : "Add"}
                        </button>
                    </div>
                    {HistoryArr.length > 0 && (
                        <ReactGrid
                            columns={commonColumns(handleEdit(setHistory), handleStatus('History_Master_link', setIsHistoryArr))}
                            RowData={HistoryArr}
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
                                name="name"
                                required
                                value={Examination.name}
                                onChange={handleChange(setExamination)}
                            />
                        </div>
                    </div>
                    <div className="Main_container_Btn">
                        <button onClick={handleSubmit('Examination_Master_link', Examination, setExamination, fetchData('Examination_Master_link', setExaminationArr))}>
                            {Examination.id ? "Update" : "Add"}
                        </button>
                    </div>
                    {ExaminationArr.length > 0 && (
                        <ReactGrid
                            columns={commonColumns(handleEdit(setExamination), handleStatus('Examination_Master_link', setIsExaminationArr))}
                            RowData={ExaminationArr}
                        />
                    )}
                </>
            )}
        </div>
    );
};

export default DiseaseNameMaster;