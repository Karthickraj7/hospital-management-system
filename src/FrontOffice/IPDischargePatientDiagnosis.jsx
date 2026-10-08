import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import CancelIcon from "@mui/icons-material/Cancel";
import EditIcon from "@mui/icons-material/Edit";
import LoupeIcon from "@mui/icons-material/Loupe";
import ClearIcon from "@mui/icons-material/Clear";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import DeleteIcon from "@mui/icons-material/Delete";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Trash2 } from 'lucide-react';



const IPDischargePatientDiagnosis = () => {
   const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
     const userRecord = useSelector((state) => state.userRecord?.UserData);
     const toast = useSelector(state => state.UserData?.toast);
   
   const dispatch = useDispatch();

    const [searchOPParams, setsearchOPParams] = useState({
        query: "",
        status: "Pending",
      });


      const formatDate = (date) => {
    const d = new Date(date);
    const month = (d.getMonth() + 1).toString().padStart(2, "0");
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();
    return `${year}-${month}-${day}`;
  };

      const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
    

    const [searchOptions, setSearchOptions] = useState({
        DateType: "Current",
        CurrentDate: formatDate(new Date()),
        FromDate: "",
        ToDate: "",
        ParticularDate : "",
        SearchbyFirstName: "",

        
      });


        const [SearchICDCode, setSearchICDCode] = useState("");
        const [SearchDescription, setSearchDescription] = useState("");
        const [SearchDiagnosis, setSearchDiagnosis] = useState("");

    const [DiagnosisData,setDiagnosisData] = useState([]);

    console.log(DiagnosisData,'DiagnosisData')

      const [Stockdata, setStockdata] = useState([]);
   useEffect(() => {
  const controller = new AbortController(); // ✅ create abort controller
  const { signal } = controller;
 
  axios
    .get(`${UrlLink}Masters/ICDCode_Master_MRDGetLink`, {
      params: {
        SearchICDCode: SearchICDCode,
        SearchDescription: SearchDescription,
        SearchDiagnosis: SearchDiagnosis,
      },
      signal,
    })
    .then((res) => {
      console.log(res.data);
 
      const data = res?.data;
      if (Array.isArray(data) && data.length > 0) {
        setStockdata(data);
      } else {
        setStockdata([]);
      }
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        console.log("Request cancelled:", err.message);
      } else {
        console.error("Request error:", err);
      }
    });
 
  return () => {
    controller.abort("New request triggered or component unmounted");
  };
}, [UrlLink, SearchICDCode, SearchDescription, SearchDiagnosis]);
 
      
const ClearIcdcode = () => {
    setSearchICDCode("");
    setSearchDescription("");
    setSearchDiagnosis("");
  };


  const handleICDData = async () => {
  if (SearchDiagnosis.trim() !== "") {
    const addeddata = {
      SearchICDCode,
      SearchDescription,
      SearchDiagnosis,
    };

    console.log(addeddata, "addeddata");

    setDiagnosisData((prev) => [...prev, addeddata]);

    setSearchDiagnosis("");
    setSearchICDCode("");
    setSearchDescription("");
  }
};

  
  const GetSingleIcdcode = () => {
    if (!SearchICDCode && !SearchDescription && !SearchDiagnosis) {
      dispatch({
        type: "toast",
        value: {
          message: "Please enter a search criteria to view results.",
          type: "warn",
        },
      });
      return;
    }

    const finddata =
      Stockdata.find((ele) => ele.ICDCode === SearchICDCode) ||
      Stockdata.find((ele) => ele.ICDCode_Description === SearchDescription) ||
      Stockdata.find((ele) => ele.Diagnosis === SearchDiagnosis);

    if (finddata) {
      setSearchICDCode(finddata.ICDCode);
      setSearchDescription(finddata.ICDCode_Description);
      setSearchDiagnosis(finddata.Diagnosis);
    }
  };

     const  [DiagnosisModal,setDiagnosisModal] = useState(false);
     const [Patientdata,setPatientdata] =useState({

     })

    const [PatientRegisterData, setPatientRegisterData] = useState([]);

    console.log(PatientRegisterData,'PatientRegisterData')
    

    const HandleOnchangeSearch = (e) => {
    const { name, value } = e.target;
    if (name === "SearchbyPhoneNumber") {
      if (value.length <= 10) {
        setSearchOptions((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (name === "DateType") {
      if (value === "Current") {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: TodayDate,
          FromDate: "",
          ToDate: "",
        }));
      }
       else if (value === "Customize") {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: "",
        }));
      }

      else if (value === "Particular") {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: "",
          FromDate: "",
          ToDate: "",
        }));
      }
      
      else if (value === "All") {
        setSearchOptions((prev) => ({
          ...prev,
          DateType: value,
          CurrentDate: "",
          FromDate: "",
          ToDate: "",
        }));
      }
    } 
    
     else {
      setSearchOptions((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };


  const handleICD10Code = (params) => {

    console.log(params,'paramsssss')
    setPatientdata({
        ...params
    })
    setDiagnosisModal(true)

  }


  const [ViewDiagnosisData,setViewDiagnosisData] = useState([])
  const [ViewDiagnosisModal,setViewDiagnosisModal] = useState(false);
  const [load,setload] = useState(true);

  console.log(ViewDiagnosisData,'ViewDiagnosisData')

  const handleView = async (params) => {
  console.log(params, 'paramsssss');

  try {
    const res = await axios.get(`${UrlLink}Frontoffice/IP_Discharged_Patient_For_Diagnosis_Post`, {
      params: {
        IPNo: params.IPNo,
      },
    });

    console.log(res.data);

    const data = res?.data;
    if (Array.isArray(data) && data.length !== 0) {
      setViewDiagnosisData(data);
    } else {
      setViewDiagnosisData([]);
    }
  } catch (err) {
    console.error(err);
  }

  setViewDiagnosisModal(true);
  };

  const handleSave = () => {

    const payload = {

        DiagnosisData : DiagnosisData,
        ...Patientdata,
        created_by : userRecord.username
    }

    console.log(payload,'payload')


    axios.post(`${UrlLink}Frontoffice/IP_Discharged_Patient_For_Diagnosis_Post`, payload)
                .then((res) => {
                    const response = res.data;
                    const messageType = Object.keys(response)[0];
                    const messageContent = Object.values(response)[0];

                    console.log(messageType,'messageType',messageContent,'messageContent')
                    // dispatch({
                    //     type: 'toast',
                    //     value: { message: messageContent, type: messageType },
                    // });

                    alert(messageContent)
                    setDiagnosisData([]);
                    setPatientdata({});
                    
                })
                .catch((err) => {
                    console.log(err);
                    dispatch({
                        type: 'toast',
                        value: { message: 'An error occurred while saving the discount.', type: 'error' },
                    });
                });

  } 

  const handleEditItems = (row) => {

    console.log(row,'rowwwwwwwwww')
  }


  const handleEraseItems = (row) => {

    console.log(row,'rowwwwwwwwww')

     const payload = {

        ...row,
        created_by : userRecord.username
    }

    console.log(payload,'payload')


    axios.post(`${UrlLink}Frontoffice/IP_Discharged_Patient_For_Diagnosis_Delete`, payload)
                .then((res) => {
                    const response = res.data;
                    const messageType = Object.keys(response)[0];
                    const messageContent = Object.values(response)[0];

                    console.log(messageType,'messageType',messageContent,'messageContent')
                    // dispatch({
                    //     type: 'toast',
                    //     value: { message: messageContent, type: messageType },
                    // });

                    alert(messageContent)
                    setDiagnosisData([]);
                    setPatientdata({});
                    
                })
                .catch((err) => {
                    console.log(err);
                    dispatch({
                        type: 'toast',
                        value: { message: 'An error occurred while saving the discount.', type: 'error' },
                    });
                });

    
  // try {
  //   const res = await axios.get(`${UrlLink}Frontoffice/IP_Discharged_Patient_For_Diagnosis_Post`, {
  //     params: {
  //       IPNo: params.IPNo,
  //     },
  //   });

  //   console.log(res.data);

  //   const data = res?.data;
  //   if (Array.isArray(data) && data.length !== 0) {
  //     setViewDiagnosisData(data);
  //   } else {
  //     setViewDiagnosisData([]);
  //   }
  // } catch (err) {
  //   console.error(err);
  // }


  }

  const handleRemoveItems = (code) => {
    console.log(code.SearchICDCode,'SearchICDCode')
  setDiagnosisData((prev) => prev.filter(item => item.SearchICDCode !== code.SearchICDCode));
};





    const RegisterColumn = [
    {
      key: "Sno",
      name: "S.No",
    },
    {
      key:"IPNo",
      name:"IPno"
    },
    {
      key: "PatientId",
      name: "Patient Id",
    },
    {
      key: "PatientName",
      name: "Patient Name",
      width: 150,
    },
    {
  key: "Action",
  name: "Action",
  renderCell: (params) => (
    <>
      <Button
        className="cell_btn"
        onClick={() => handleICD10Code(params.row)}  
      >
        <EditIcon className="check_box_clrr_cancell" />
      </Button>
    </>
  ),
    },
     {
  key: "Action",
  name: "View",
  renderCell: (params) => (
    <>
      <Button
        className="cell_btn"
        onClick={() => handleView(params.row)}  
      >
        <VisibilityIcon className="check_box_clrr_cancell" />
      </Button>
    </>
  ),
    }


  ];


  const DiagnosisColumn = [

    {
      key:"SearchICDCode",
      name:"ICDCode"
    },
    {
      key:"SearchDescription",
      name:"Diagnosis"
    },
    {
      key:"SearchDiagnosis",
      name:"Description"
    },

    {
  key: "Action",
  name: "Delete",
  renderCell: (params) => (
    <>
      <Button
        className="cell_btn"
        onClick={() => handleRemoveItems(params.row)}  
      >
        <DeleteIcon className="check_box_clrr_cancell" />
      </Button>
    </>
  ),
    }

  ]

   const ViewDiagnosisColumn = [

    {
      key:"ICDCode",
      name:"ICDCode"
    },
    {
      key:"Code_Description",
      name:"Diagnosis"
    },
    {
      key:"Diagnosis",
      name:"Description"
    },

  //   {
  // key: "Action",
  // name: "Edit",
  // renderCell: (params) => (
  //   <>
  //     <Button
  //       className="cell_btn"
  //       onClick={() => handleEditItems(params.row)}  
  //     >
  //       <EditIcon className="check_box_clrr_cancell" />
  //     </Button>
  //   </>
  // ),
  //   },

    {
  key: "Action",
  name: "Delete",
  renderCell: (params) => (
    <>
      <Button
        className="cell_btn"
        onClick={() => handleEraseItems(params.row)}  
      >
        <DeleteIcon className="check_box_clrr_cancell" />
      </Button>
    </>
  ),
    }

    

  ]

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setsearchOPParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  useEffect(() => {
  const controller = new AbortController();
  const { signal } = controller;
 
  axios
    .get(`${UrlLink}Frontoffice/IP_Discharged_Patient_For_Diagnosis`, {
      params: searchOptions,
      signal,
    })
    .then((res) => {
      const ress = res.data;
      console.log(ress, "ressssssssss");
 
      if (Array.isArray(ress)) {
        setPatientRegisterData(ress);
      } else {
        setPatientRegisterData([]);
      }
    })
    .catch((err) => {
      if (axios.isCancel(err)) {
        console.log("Request cancelled:", err.message);
      } else {
        console.error("Request error:", err);
      }
    });
 
  return () => {
    controller.abort("New request triggered or component unmounted");
  };
}, [UrlLink, searchOptions]);
 


  return (
    <>

        <div className="Main_container_app">
        <h3>IP Discharge Pending List</h3>
        <br />

        <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
            <div className="RegisForm_1">
              <label>
                Date Type<span>:</span>
              </label>
              <select
                name="DateType"
                value={searchOptions.DateType}
                onChange={HandleOnchangeSearch}
              >
                <option value="Current">Current Date</option>
                <option value="Customize">Customize</option>
                <option value="Particular">Particular</option>
              </select>
            </div>

            {searchOptions.DateType === "Current" && (
              <div className="RegisForm_1">
                <label>
                  Current Date<span>:</span>
                </label>
                <input
                  type="date"
                  name="CurrentDate"
                  value={searchOptions.CurrentDate}
                  onChange={HandleOnchangeSearch}
                  readOnly
                />
              </div>
            )}

            {searchOptions.DateType === "Customize" && (
              <>
                <div className="RegisForm_1">
                  <label>
                    From Date<span>:</span>
                  </label>
                  <input
                    type="date"
                    name="FromDate"
                    value={searchOptions.FromDate}
                    onChange={HandleOnchangeSearch}
                  />
                </div>
                <div className="RegisForm_1">
                  <label>
                    To Date<span>:</span>
                  </label>
                  <input
                    type="date"
                    name="ToDate"
                    value={searchOptions.ToDate}
                    onChange={HandleOnchangeSearch}
                    min={searchOptions.FromDate}
                  />
                </div>
              </>
            )}

            {searchOptions.DateType === "Particular" && (
              <>
                <div className="RegisForm_1">
                  <label>
                    Particular Date<span>:</span>
                  </label>
                  <input
                    type="date"
                    name="ParticularDate"
                    value={searchOptions.ParticularDate}
                    onChange={HandleOnchangeSearch}
                  />
                </div>
                
              </>
            )}


            <div className="RegisForm_1">
              <label>
                Search <span>:</span>
              </label>
              <input
                type='text'
                name="SearchbyFirstName"
                value={searchOptions.SearchbyFirstName}
                onChange={HandleOnchangeSearch}
              >
                
              </input>
            </div>

        </div> 
        <br />

        <ReactGrid columns={RegisterColumn} RowData={PatientRegisterData} />

      </div>


      {DiagnosisModal && (
        <>
            <div
            className="sideopen_showcamera_profile"
            onClick={() => setDiagnosisModal(false)}
            >
            <div
                className="newwProfiles newwPopupforreason"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="RegisFormcon_1" style={{ justifyContent: "center", gap: '15px' }}>
                <div className="RegisForm_1" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                    <label style={{ fontSize: '16px', fontWeight: '500', minWidth: '140px', whiteSpace: 'nowrap' }}>
                        ICD 10 Code<span>: </span>
                    </label>
                    <div className="Search_patient_icons" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <input
                        type="text"
                        value={SearchICDCode}
                        placeholder="Search ICD Code"
                        onChange={(e) => setSearchICDCode(e.target.value)}
                        list="SearchICDCodelist"
                        style={{
                        flex: 1,
                        minWidth: '250px',
                        padding: '12px 15px',
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        boxSizing: 'border-box'
                        }}
                    />
                    <datalist id="SearchICDCodelist">
                      {Stockdata.map((ele, ind) => (
                        <option
                          key={`${ind}-ind`}
                          value={ele.ICDCode}
                        >
                          {ele.ICDCode_Description || ele.ICDCode}
                        </option>
                      ))}
                    </datalist>

                    <span style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <ManageSearchIcon 
                            onClick={GetSingleIcdcode} 
                            style={{ fontSize: '28px' }}
                        />
                    </span>
                    </div>
                </div>

                <div className="RegisForm_1" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                    <label style={{ fontSize: '16px', fontWeight: '500', minWidth: '140px', whiteSpace: 'nowrap' }}>
                        Diagnosis<span>:</span>
                    </label>
                    <div className="Search_patient_icons" style={{ display: 'flex', alignItems: 'center', gap: '8px', flex: 1 }}>
                    <input
                        type="text"
                        value={SearchDescription}
                        placeholder="Search Description"
                        onChange={(e) => setSearchDescription(e.target.value)}
                        list="SearchDescriptionlist"
                        style={{
                        flex: 1,
                        minWidth: '250px',
                        padding: '12px 15px',
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        boxSizing: 'border-box'
                        }}
                    />
                    <datalist id="SearchDescriptionlist">

                      {Stockdata.map((ele, ind) => (
                        <option key={`${ind}-desc`} value={ele.ICDCode_Description}>
                          {ele.ICDCode ||  ele.Diagnosis}
                        </option>
                      ))}
                  
                    </datalist>

                    <span style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                        <ManageSearchIcon 
                            onClick={GetSingleIcdcode} 
                            style={{ fontSize: '28px' }}
                        />
                    </span>
                    </div>
                </div>

                <div className="RegisForm_1" style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%' }}>
                    <label style={{ fontSize: '16px', fontWeight: '500', minWidth: '140px', whiteSpace: 'nowrap' }}>
                    Code Description<span>:</span>
                    </label>
                    <input
                    type="text"
                    value={SearchDiagnosis}
                    placeholder="Search Diagnosis"
                    onChange={(e) => setSearchDiagnosis(e.target.value)}
                    style={{
                        flex: 1,
                        minWidth: '250px',
                        padding: '12px 15px',
                        fontSize: '16px',
                        border: '1px solid #ccc',
                        borderRadius: '6px',
                        boxSizing: 'border-box'
                    }}
                    />
                </div>

                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
                    <button
                        className="RegisterForm_1_btns choose_file_update"
                        onClick={ClearIcdcode}
                        style={{ padding: '10px 20px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                        <ClearIcon style={{ fontSize: '22px' }} />
                    </button>

                    <button
                        className="RegisterForm_1_btns choose_file_update"
                        onClick={handleICDData}
                        style={{ padding: '10px 20px', fontSize: '16px', display: 'flex', alignItems: 'center', gap: '5px' }}
                    >
                        <LoupeIcon style={{ fontSize: '22px' }} />
                    </button>
                </div>
                </div>

                {/* <ReactGrid columns={DiagnosisColumn} RowData={DiagnosisData} /> */}
<div style={{ 
      padding: '30px',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        <h2 style={{
          fontSize: '28px',
          fontWeight: '700',
          color: '#1a202c',
          marginBottom: '24px',
          letterSpacing: '-0.5px'
        }}>
          Diagnosis Records
        </h2>
        
        <div style={{ 
          overflowX: 'auto', 
          borderRadius: '12px', 
          boxShadow: '0 4px 6px rgba(0,0,0,0.07), 0 1px 3px rgba(0,0,0,0.06)',
          backgroundColor: 'white'
        }}>
          <table style={{ 
            width: '100%',
            minWidth: '900px',
            borderCollapse: 'collapse',
            backgroundColor: 'white',
            fontSize: '15px'
          }}>
            <thead>
              <tr style={{ backgroundColor: '#2d3748' }}>
                <th style={{ 
                  padding: '18px 20px', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  fontSize: '14px',
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  width: '15%'
                }}>
                  ICD Code
                </th>
                <th style={{ 
                  padding: '18px 20px', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  fontSize: '14px',
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  width: '30%'
                }}>
                  Diagnosis
                </th>
                <th style={{ 
                  padding: '18px 20px', 
                  textAlign: 'left', 
                  fontWeight: '600',
                  fontSize: '14px',
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  width: '45%'
                }}>
                  Description
                </th>
                <th style={{ 
                  padding: '18px 20px', 
                  textAlign: 'center', 
                  fontWeight: '600',
                  fontSize: '14px',
                  color: 'white',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  width: '10%'
                }}>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {DiagnosisData && DiagnosisData.length > 0 ? (
                DiagnosisData.map((row, index) => (
                  <tr 
                    key={index} 
                    style={{ 
                      borderBottom: '1px solid #e2e8f0',
                      backgroundColor: index % 2 === 0 ? '#ffffff' : '#f7fafc',
                      transition: 'background-color 0.2s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#edf2f7'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? '#ffffff' : '#f7fafc'}
                  >
                    <td style={{ 
                      padding: '16px 20px',
                      fontWeight: '600',
                      color: '#2d3748',
                      fontSize: '15px'
                    }}>
                      {row.SearchICDCode}
                    </td>
                    <td style={{ 
                      padding: '16px 20px',
                      color: '#4a5568',
                      fontWeight: '500'
                    }}>
                      {row.SearchDescription}
                    </td>
                    <td style={{ 
                      padding: '16px 20px',
                      color: '#718096',
                      lineHeight: '1.6'
                    }}>
                      {row.SearchDiagnosis}
                    </td>
                    <td style={{ 
                      padding: '16px 20px',
                      textAlign: 'center'
                    }}>
                      <button
                        onClick={() => handleRemoveItems(row)}
                        style={{ 
                          background: '#fff5f5', 
                          border: '1px solid #feb2b2',
                          cursor: 'pointer', 
                          color: '#e53e3e',
                          padding: '8px 12px',
                          borderRadius: '6px',
                          transition: 'all 0.2s ease',
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: '500'
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = '#e53e3e';
                          e.target.style.color = 'white';
                          e.target.style.borderColor = '#e53e3e';
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = '#fff5f5';
                          e.target.style.color = '#e53e3e';
                          e.target.style.borderColor = '#feb2b2';
                        }}
                        title="Delete Record"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ 
                    padding: '60px 20px',
                    textAlign: 'center',
                    color: '#a0aec0',
                    fontSize: '16px',
                    fontWeight: '500'
                  }}>
                    No diagnosis data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        <div style={{
          marginTop: '20px',
          padding: '16px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          fontSize: '14px',
          color: '#718096'
        }}>
          <strong style={{ color: '#2d3748' }}>Total Records:</strong> {DiagnosisData.length}
        </div>
      </div>
    </div>

                <div className="Main_container_Btn">
                <button onClick={() => handleSave()} style={{ padding: '12px 30px', fontSize: '16px' }}>
                    Save
                </button>
                </div>
                <br />
                <div className="Main_container_Btn">
                <button onClick={() => setDiagnosisModal(false)} style={{ padding: '12px 30px', fontSize: '16px' }}>
                    Close
                </button>
                </div>
            </div>
            </div>

            <ToastAlert Message={toast?.message} Type={toast?.type} />

        </>
        )}

        {/* Enhanced Table Version */}
        


        {ViewDiagnosisModal && (
        <>
            <div
            className="sideopen_showcamera_profile"
            onClick={() => setViewDiagnosisModal(false)}
            >
            <div
                className="newwProfiles newwPopupforreason"
                onClick={(e) => e.stopPropagation()}
            >
                

                <ReactGrid columns={ViewDiagnosisColumn} RowData={ViewDiagnosisData} />

               
                <br />
                <div className="Main_container_Btn">
                <button onClick={() => setViewDiagnosisModal(false)} style={{ padding: '12px 30px', fontSize: '16px' }}>
                    Close
                </button>
                </div>
            </div>
            </div>

            <ToastAlert Message={toast?.message} Type={toast?.type} />

        </>
        )}





    </>
  )
}

export default IPDischargePatientDiagnosis
