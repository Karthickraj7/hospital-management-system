import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from "react-to-print";
import Select, { useStateManager } from 'react-select';


const RadiologyReportsMIS = () => {



     const UrlLink = useSelector(state => state.userRecord?.UrlLink);
          const UserData = useSelector((state) => state.userRecord?.UserData);
          const dispatchvalue = useDispatch();
          const navigate = useNavigate();
          const componentRef = useRef();
        
          const formatDate = (date) => {
            const d = new Date(date);
            const month = (d.getMonth() + 1).toString().padStart(2, "0");
            const day = d.getDate().toString().padStart(2, "0");
            const year = d.getFullYear();
            return `${year}-${month}-${day}`;
          };
    
        const [TodayDate, setTodayDate] = useState(formatDate(new Date()));
        const [viewType, setViewType] = useState("CTWise");
        
    
        const [SpecialityData, setSpecialityData] = useState([]);
        const [WardData,setWardData] = useState([]);
        const [Insurance,setInsurance] = useState([]);
    
        const [AllDocData,setAllDocData] = useState([]);
        const [SelectedDocs,setSelectedDocs] = useState([]);
    
        const [OpenModal, setOpenModal] = useState(false);

        console.log(OpenModal,'OpenModalllll')
        const openModal = () => setOpenModal(true);
        const closeModal = () => setOpenModal(false);
    
        useEffect(() => {
            axios.get(`${UrlLink}Masters/Speciality_Detials_link`)
                .then((res) => {
                    const ress = res.data
                    setSpecialityData(ress)
                })
                .catch((err) => {
                    console.log(err);
                })
            
        }, [UrlLink])


        const [searchOptions, setSearchOptions] = useState({
                DateType: 'Current',
                CurrentDate: formatDate(new Date()),
                FromDate: '',
                ToDate: '',
                ParticularDate : '',
                SearchbyFirstName: '',
                SearchbySpeciality: '',
                SearchbyDoctor: '',
                SearchTimeOrderby: '',
                userid: UserData?.username,
                Specialityid: '',
                Servicename:'',
              });

        const [PatientWiseList,setPatientWiseList] = useState([]);
        const [CodeWiseList,setCodeWiseList] = useState([]);
        const [DWiseList,setDWiseList] = useState([]);
        const [SelectedSpecialities,setSelectedSpecialities] = useState([]);
        const [printBySpeciality, setPrintBySpeciality] = useState(false);

         useEffect(() => {
                 setPrintBySpeciality(SelectedSpecialities.length > 0);
               }, [SelectedSpecialities]);

    const handleCheckboxChangeSpeciality = (event, speciality) => {
  const { checked, value } = event.target;

  setSelectedSpecialities((prev) => {
    if (checked) {
      // Add the speciality to the selected list if checked
      return [...prev, { 
        SpecialityName: speciality.SpecialityName, 
        Speciality_Id: speciality.Speciality_Id 
      }];
    } else {
      // Remove the speciality from the selected list if unchecked
      return prev.filter(
        (item) => `${item.SpecialityName} | ${item.Speciality_Id}` !== value
      );
    }
  });
    };

    const handleSelectAllSpecialities = (event) => {
  const { checked } = event.target;
  
  if (checked) {
    setSelectedSpecialities(
      SpecialityData.map((speciality) => ({
        SpecialityName: speciality.SpecialityName,
        Speciality_Id: speciality.Speciality_Id
      }))
    );
  } else {
    setSelectedSpecialities([]);
  }
    };


    const isSpecialityChecked = (speciality) => {
      return SelectedSpecialities.some(
        (item) => `${item.SpecialityName} | ${item.Speciality_Id}` === `${speciality.SpecialityName} | ${speciality.Speciality_Id}`
      );
    };


    const [SearchICDCode, setSearchICDCode] = useState("");
    const [SearchDescription, setSearchDescription] = useState("");
    const [SearchDiagnosis, setSearchDiagnosis] = useState("");
    
    const [DiagnosisData,setDiagnosisData] = useState([]);

    const [Stockdata, setStockdata] = useState([]);

    const [selectedStockIds, setSelectedStockIds] = useState([]);
    const [selectedDiagnosisIds,setselectedDiagnosisIds] = useState([]);

    console.log(selectedStockIds,'selectedStockIds');
const [stockSearch, setStockSearch] = useState("");
const [DiagnosisSearch,setDiagnosisSearch] = useState("");

const handleSelectAllStock = (e) => {
  if (e.target.checked) {
    const allIds = filteredStockData.map(item => item.ICDCode);
    setSelectedStockIds(allIds);
  } else {
    setSelectedStockIds([]);
  }
};

const handleSelectAllDiagnosis = (e) => {
  if (e.target.checked) {
    const allIds = filteredStockData.map(item => item.ICDCode_Description);
    setselectedDiagnosisIds(allIds);
  } else {
    setselectedDiagnosisIds([]);
  }
};


const handleStockCheckboxChange = (e, id) => {
  if (e.target.checked) {
    setSelectedStockIds(prev => [...prev, id]);
  } else {
    setSelectedStockIds(prev =>
      prev.filter(itemId => itemId !== id)
    );
  }
};


const handleDiagnosisCheckboxChange = (e, id) => {
  if (e.target.checked) {
    setselectedDiagnosisIds(prev => [...prev, id]);
  } else {
    setselectedDiagnosisIds(prev =>
      prev.filter(itemId => itemId !== id)
    );
  }
};

const isStockChecked = (id) => selectedStockIds.includes(id);
const isDiagnosisChecked = (id) => selectedDiagnosisIds.includes(id);

const filteredStockData = Stockdata.filter(item =>
  item.ICDCode.toLowerCase().includes(stockSearch.toLowerCase()) ||
  item.ICDCode_Description.toLowerCase().includes(stockSearch.toLowerCase()) ||
  item.Diagnosis.toLowerCase().includes(stockSearch.toLowerCase())
);



const filteredStockDatadig = Stockdata.filter(item =>
  item.ICDCode.toLowerCase().includes(DiagnosisSearch.toLowerCase()) ||
  item.ICDCode_Description.toLowerCase().includes(DiagnosisSearch.toLowerCase()) ||
  item.Diagnosis.toLowerCase().includes(DiagnosisSearch.toLowerCase())
);


    console.log(Stockdata,'Stockdata')


     const alphabetData = Array.from({ length: 26 }, (_, i) => ({
      code: String.fromCharCode(65 + i), // A-Z
    }));

    const [selectedLetters, setSelectedLetters] = useState([]);
    const [selectedDiagnosisLetters, setselectedDiagnosisLetters] = useState([]);



const handleSelectAllLetters = (e) => {
  if (e.target.checked) {
    // Select A to Z
    const allLetters = alphabetData.map(item => item.code);
    setSelectedLetters(allLetters);
  } else {
    // Unselect all
    setSelectedLetters([]);
  }
};


const handleSelectAllLettersdig = (e) => {
  if (e.target.checked) {
    // Select A to Z
    const allLetters = alphabetData.map(item => item.code);
    setselectedDiagnosisLetters(allLetters);
  } else {
    // Unselect all
    setselectedDiagnosisLetters([]);
  }
};


const handleLetterChange = (e, letter) => {
  if (e.target.checked) {
    setSelectedLetters(prev => [...prev, letter]);
  } else {
    setSelectedLetters(prev =>
      prev.filter(item => item !== letter)
    );
  }
};

const handleLetterChangedig = (e, letter) => {
  if (e.target.checked) {
    setselectedDiagnosisLetters(prev => [...prev, letter]);
  } else {
    setselectedDiagnosisLetters(prev =>
      prev.filter(item => item !== letter)
    );
  }
};

const isLetterChecked = (letter) => {
  return selectedLetters.includes(letter);
};

const isLetterCheckeddig = (letter) => {
  return selectedDiagnosisLetters.includes(letter);
};

const [alphabetSearch, setAlphabetSearch] = useState("");
const [alphabetSearchdiag, setAlphabetSearchdiag] = useState("");

const filteredAlphabetData = alphabetData.filter(item =>
  item.code.toLowerCase().includes(alphabetSearch.toLowerCase())
);

const filteredAlphabetDatadig = alphabetData.filter(item =>
  item.code.toLowerCase().includes(alphabetSearchdiag.toLowerCase())
);

useEffect(() => {
  if (alphabetSearch.length === 1) {
    const letter = alphabetSearch.toUpperCase();
    if (alphabetData.some(item => item.code === letter)) {
      setSelectedLetters([letter]);
    }
  }
}, [alphabetSearch]);


useEffect(() => {
  if (alphabetSearchdiag.length === 1) {
    const letter = alphabetSearchdiag.toUpperCase();
    if (alphabetData.some(item => item.code === letter)) {
      setselectedDiagnosisLetters([letter]);
    }
  }
}, [alphabetSearchdiag]);
    

    const [OriginalCt,setOriginalCt] = useState([]);
    const [DummyCt,setDummyCt] = useState([]);


    // useEffect(() => {


    //   if (viewType !== 'CTWise') return 

    //   setStockdata([]);
    //   const controller = new AbortController(); // ✅ create abort controller
    //   const { signal } = controller;

    //   const searchparams = {
    //     searchOptions,
    //     SelectedSpecialityIds: SelectedSpecialities.map(s => s.Speciality_Id),

        
    //   };
     
    //   axios
    //     .get(`${UrlLink}MCI/CT_Original_Reports`, {
    //       params: searchparams,
    //       signal,
    //     })
    //     .then((res) => {
    //       console.log(res.data);
     
    //       const data = res?.data;
    //       if (Array.isArray(data) && data.length > 0) {
    //         setOriginalCt(data);
    //       } else {
    //         setOriginalCt([]);
    //       }
    //     })
    //     .catch((err) => {
    //       if (axios.isCancel(err)) {
    //         console.log("Request cancelled:", err.message);
    //       } else {
    //         console.error("Request error:", err);
    //       }
    //     });
     
    //   return () => {
    //     controller.abort("New request triggered or component unmounted");
    //   };
    // }, [viewType,searchOptions,SelectedSpecialities]);

    useEffect(() => {


      if (viewType !== 'CTWise') return 

      setStockdata([]);
      const controller = new AbortController(); // ✅ create abort controller
      const { signal } = controller;

      const searchparams = {
        searchOptions,
        SelectedSpecialityIds: SelectedSpecialities.map(s => s.Speciality_Id),
      };
     
      axios
        .get(`${UrlLink}MCI/CT_Dummy_Reports`, {
          params: searchparams,
          signal,
        })
        .then((res) => {
          console.log(res.data);
     
          const data = res?.data;
          if (Array.isArray(data) && data.length > 0) {
            setDummyCt(data);
          } else {
            setDummyCt([]);
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
    }, [viewType,searchOptions,SelectedSpecialities]);




    const [Originalmri,setOriginalmri] = useState([]);
    const [Dummymri,setDummymri] = useState([]);
    // useEffect(() => {


    //   if (viewType !== 'MRIWise') return 

    //   setStockdata([]);
    //   const controller = new AbortController(); // ✅ create abort controller
    //   const { signal } = controller;

    //   const searchparams = {
    //     searchOptions,
    //     SelectedSpecialityIds: SelectedSpecialities.map(s => s.Speciality_Id),
    //   };
     
    //   axios
    //     .get(`${UrlLink}MCI/MRI_Original_Reports`, {
    //       params: searchparams,
    //       signal,
    //     })
    //     .then((res) => {
    //       console.log(res.data);
     
    //       const data = res?.data;
    //       if (Array.isArray(data) && data.length > 0) {
    //         setOriginalmri(data);
    //       } else {
    //         setOriginalmri([]);
    //       }
    //     })
    //     .catch((err) => {
    //       if (axios.isCancel(err)) {
    //         console.log("Request cancelled:", err.message);
    //       } else {
    //         console.error("Request error:", err);
    //       }
    //     });
     
    //   return () => {
    //     controller.abort("New request triggered or component unmounted");
    //   };
    // }, [viewType,searchOptions,SelectedSpecialities]);

    useEffect(() => {


      if (viewType !== 'MRIWise') return 

      setStockdata([]);
      const controller = new AbortController(); // ✅ create abort controller
      const { signal } = controller;

      const searchparams = {
        searchOptions,
        SelectedSpecialityIds: SelectedSpecialities.map(s => s.Speciality_Id),
      };
     
      axios
        .get(`${UrlLink}MCI/MRI_Dummy_Reports`, {
          params: searchparams,
          signal,
        })
        .then((res) => {
          console.log(res.data);
     
          const data = res?.data;
          if (Array.isArray(data) && data.length > 0) {
            setDummymri(data);
          } else {
            setDummymri([]);
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
    }, [viewType,searchOptions,SelectedSpecialities]);



    const [Originalxray,setOriginalxray] = useState([]);
    const [Dummyxray,setDummyxray] = useState([]);
    // useEffect(() => {


    //   if (viewType !== 'XRAYWise') return 

    //   setStockdata([]);
    //   const controller = new AbortController(); // ✅ create abort controller
    //   const { signal } = controller;

    //   const searchparams = {
    //     searchOptions,
    //     SelectedSpecialityIds: SelectedSpecialities.map(s => s.Speciality_Id),
    //   };
     
    //   axios
    //     .get(`${UrlLink}MCI/XRAY_Original_Reports`, {
    //       params: searchparams,
    //       signal,
    //     })
    //     .then((res) => {
    //       console.log(res.data);
     
    //       const data = res?.data;
    //       if (Array.isArray(data) && data.length > 0) {
    //         setOriginalxray(data);
    //       } else {
    //         setOriginalxray([]);
    //       }
    //     })
    //     .catch((err) => {
    //       if (axios.isCancel(err)) {
    //         console.log("Request cancelled:", err.message);
    //       } else {
    //         console.error("Request error:", err);
    //       }
    //     });
     
    //   return () => {
    //     controller.abort("New request triggered or component unmounted");
    //   };
    // }, [viewType,searchOptions,SelectedSpecialities]);

    useEffect(() => {


      if (viewType !== 'XRAYWise') return 

      setStockdata([]);
      const controller = new AbortController(); // ✅ create abort controller
      const { signal } = controller;

      const searchparams = {
        searchOptions,
        SelectedSpecialityIds: SelectedSpecialities.map(s => s.Speciality_Id),
      };
     
      axios
        .get(`${UrlLink}MCI/XRAY_Dummy_Reports`, {
          params: searchparams,
          signal,
        })
        .then((res) => {
          console.log(res.data);
     
          const data = res?.data;
          if (Array.isArray(data) && data.length > 0) {
            setDummyxray(data);
          } else {
            setDummyxray([]);
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
    }, [viewType,searchOptions,SelectedSpecialities]);


    const [Originalusg,setOriginalusg] = useState([]);
    const [Dummyusg,setDummyusg] = useState([]);
    // useEffect(() => {


    //   if (viewType !== 'USGWise') return 

    //   setStockdata([]);
    //   const controller = new AbortController(); // ✅ create abort controller
    //   const { signal } = controller;

    //   const searchparams = {
    //     searchOptions,
    //     SelectedSpecialityIds: SelectedSpecialities.map(s => s.Speciality_Id),
    //   };
     
    //   axios
    //     .get(`${UrlLink}MCI/USG_Original_Reports`, {
    //       params: searchparams,
    //       signal,
    //     })
    //     .then((res) => {
    //       console.log(res.data);
     
    //       const data = res?.data;
    //       if (Array.isArray(data) && data.length > 0) {
    //         setOriginalusg(data);
    //       } else {
    //         setOriginalusg([]);
    //       }
    //     })
    //     .catch((err) => {
    //       if (axios.isCancel(err)) {
    //         console.log("Request cancelled:", err.message);
    //       } else {
    //         console.error("Request error:", err);
    //       }
    //     });
     
    //   return () => {
    //     controller.abort("New request triggered or component unmounted");
    //   };
    // }, [viewType,searchOptions,SelectedSpecialities]);

    useEffect(() => {


      if (viewType !== 'USGWise') return 

      setStockdata([]);
      const controller = new AbortController(); // ✅ create abort controller
      const { signal } = controller;

      const searchparams = {
        searchOptions,
        SelectedSpecialityIds: SelectedSpecialities.map(s => s.Speciality_Id),
      };
     
      axios
        .get(`${UrlLink}MCI/USG_Dummy_Reports`, {
          params: searchparams,
          signal,
        })
        .then((res) => {
          console.log(res.data);
     
          const data = res?.data;
          if (Array.isArray(data) && data.length > 0) {
            setDummyusg(data);
          } else {
            setDummyusg([]);
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
    }, [viewType,searchOptions,SelectedSpecialities]);


    const [Originalmammogram,setOriginalmammogram] = useState([]);
    const [Dummymammogram,setDummymammogram] = useState([]);
    // useEffect(() => {


    //   if (viewType !== 'MAMMOGRAMWise') return 

    //   setStockdata([]);
    //   const controller = new AbortController(); // ✅ create abort controller
    //   const { signal } = controller;

    //   const searchparams = {
    //     searchOptions,
    //     SelectedSpecialityIds: SelectedSpecialities.map(s => s.Speciality_Id),
    //   };
     
    //   axios
    //     .get(`${UrlLink}MCI/MAMMOGRAM_Original_Reports`, {
    //       params: searchparams,
    //       signal,
    //     })
    //     .then((res) => {
    //       console.log(res.data);
     
    //       const data = res?.data;
    //       if (Array.isArray(data) && data.length > 0) {
    //         setOriginalmammogram(data);
    //       } else {
    //         setOriginalmammogram([]);
    //       }
    //     })
    //     .catch((err) => {
    //       if (axios.isCancel(err)) {
    //         console.log("Request cancelled:", err.message);
    //       } else {
    //         console.error("Request error:", err);
    //       }
    //     });
     
    //   return () => {
    //     controller.abort("New request triggered or component unmounted");
    //   };
    // }, [viewType,searchOptions,SelectedSpecialities]);

    useEffect(() => {


      if (viewType !== 'MAMMOGRAMWise') return 

      setStockdata([]);
      const controller = new AbortController(); // ✅ create abort controller
      const { signal } = controller;

      const searchparams = {
        searchOptions,
        SelectedSpecialityIds: SelectedSpecialities.map(s => s.Speciality_Id),
      };
     
      axios
        .get(`${UrlLink}MCI/MAMMOGRAM_Dummy_Reports`, {
          params: searchparams,
          signal,
        })
        .then((res) => {
          console.log(res.data);
     
          const data = res?.data;
          if (Array.isArray(data) && data.length > 0) {
            setDummymammogram(data);
          } else {
            setDummymammogram([]);
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
    }, [viewType,searchOptions,SelectedSpecialities]);




const [opDummyData, setOpDummyData] = useState([]);
const [opOriginalData, setOpOriginalData] = useState([]);
const [ipDummyData, setIpDummyData] = useState([]);
const [ipOriginalData, setIpOriginalData] = useState([]);




useEffect(() => {
  if (viewType !== 'OP/IPWise') {
    setOpDummyData([]);
    setOpOriginalData([]);
    setIpDummyData([]);
    setIpOriginalData([]);
    return;
  }

  setOpDummyData([]);
  setOpOriginalData([]);
  setIpDummyData([]);
  setIpOriginalData([]);

  const controller = new AbortController();
  const { signal } = controller;

  const searchparams = {
    searchOptions,
    SelectedSpecialityIds: SelectedSpecialities.map(s => s.Speciality_Id),
  };

  const endpoints = [
    'MCI/Dummy_OP_Wise_Radiology_Test',
    // 'MCI/Original_OP_Wise_Radiology_Test',
    'MCI/Dummy_IP_Wise_Radiology_Test',
    // 'MCI/Original_IP_Wise_Radiology_Test',
  ];

  const requests = endpoints.map(endpoint =>
    axios.get(`${UrlLink}${endpoint}`, {
      params: searchparams,
      signal,
    })
  );

  Promise.all(requests)
    .then(responses => {
      const [opDummyRes, ipDummyRes] = responses;

      setOpDummyData(Array.isArray(opDummyRes.data) ? opDummyRes.data : []);
    //   setOpOriginalData(Array.isArray(opOriginalRes.data) ? opOriginalRes.data : []);
      setIpDummyData(Array.isArray(ipDummyRes.data) ? ipDummyRes.data : []);
    //   setIpOriginalData(Array.isArray(ipOriginalRes.data) ? ipOriginalRes.data : []);
    })
    .catch(err => {
      if (axios.isCancel(err)) {
        console.log('Requests cancelled:', err.message);
      } else {
        console.error('Error fetching radiology data:', err);
        setOpDummyData([]);
        // setOpOriginalData([]);
        setIpDummyData([]);
        // setIpOriginalData([]);
      }
    });

  return () => {
    controller.abort('New request triggered or component unmounted');
  };
}, [viewType, searchOptions, SelectedSpecialities]);



  const PatientWiseDiagnosisPrint = () => {
  const componentRef = React.useRef();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filteredData, setFilteredData] = React.useState(PatientWiseList);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Patient-Wise_Diagnosis_Report',
  });

  // Handle search
  React.useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(PatientWiseList);
    } else {
      const filtered = PatientWiseList.filter(patient =>
        patient.PatientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.PatientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.Speciality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.Gender?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.Age?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.Medicalrecords?.some(record => 
          record.ICDCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.Code_Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          record.Diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, PatientWiseList]);

  // Calculate totals
  const totalPatients = filteredData.length;
  const totalMedicalRecords = filteredData.reduce((total, patient) => {
    return total + (patient.Medicalrecords?.length || 0);
  }, 0);

  // Format date range based on search options
  const reportDateRange = searchOptions.DateType === 'Current'
    ? `Report Date: ${new Date(searchOptions.CurrentDate || new Date()).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-')}`
    : `Report From: ${new Date(searchOptions.FromDate || new Date()).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-')} To: ${new Date(searchOptions.ToDate || new Date()).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-')}`;

  // Helper function to render diagnosis rows
  const renderDiagnosisRows = (medicalRecords, patientIndex) => {
    if (!medicalRecords || medicalRecords.length === 0) {
      return (
        <tr style={{ fontSize: '11px', backgroundColor: patientIndex % 2 === 0 ? '#f8f9fa' : 'white' }}>
          <td colSpan="3" style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6', color: '#6c757d', fontStyle: 'italic' }}>
            No diagnosis records
          </td>
        </tr>
      );
    }

    return medicalRecords.map((record, recordIndex) => (
      <tr key={recordIndex} style={{ fontSize: '11px', backgroundColor: patientIndex % 2 === 0 ? '#f8f9fa' : 'white' }}>
        {recordIndex === 0 ? (
          <>
            <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              <span className="icd-badge">{record.ICDCode}</span>
            </td>
            <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>
              {record.Code_Description}
            </td>
            <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>
              {record.Diagnosis === "None" ? (
                <span style={{ color: '#6c757d', fontStyle: 'italic' }}>{record.Diagnosis}</span>
              ) : (
                record.Diagnosis
              )}
            </td>
          </>
        ) : (
          <>
            <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              <span className="icd-badge">{record.ICDCode}</span>
            </td>
            <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>
              {record.Code_Description}
            </td>
            <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>
              {record.Diagnosis === "None" ? (
                <span style={{ color: '#6c757d', fontStyle: 'italic' }}>{record.Diagnosis}</span>
              ) : (
                record.Diagnosis
              )}
            </td>
          </>
        )}
      </tr>
    ));
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .report-container {
              font-size: 12px;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 300px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: '#6b7280';
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
          .icd-badge {
            background-color: #3498db;
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            display: inline-block;
          }
        `}
      </style>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="diagnosisSearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search:
          </label>
          <input
            id="diagnosisSearch"
            type="text"
            className="search-input"
            placeholder="Search by Patient ID, Name, Speciality, ICD Code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="results-info">
          Showing {totalPatients} patients with {totalMedicalRecords} medical records
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>

        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}
      </div>

      <div
        className="Register_btn_con added_Register_btn_con"
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}
      >
        <button
          className="RegisterForm_1_btns jwedu6_99"
          onClick={handlePrint}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Print Report
        </button>
        <button
          className="RegisterForm_1_btns jwedu6_99"
          onClick={handlePrintClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Close
        </button>
      </div>

      <div className="print-container report-container" ref={componentRef}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #dee2e6',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr>
              <td
                colSpan="9"
                style={{
                  border: 'none',
                  textAlign: 'center',
                  padding: '15px 0',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <div>
                  <h2
                    className="header-text"
                    style={{
                      margin: '0',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      letterSpacing: '0.5px',
                    }}
                  >
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h1
                    className="subheader-text"
                    style={{
                      margin: '5px 0 0',
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#7f8c8d',
                      letterSpacing: '0.3px',
                    }}
                  >
                    PATIENT-WISE DIAGNOSIS REPORT
                  </h1>
                  <p
                    style={{
                      margin: '10px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    {reportDateRange}
                  </p>
                  
                  {searchTerm && (
                    <p style={{ margin: '10px 0 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                backgroundColor: '#3498db',
                color: 'white',
              }}
            >
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '5%' }}>
                S.No
              </th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '10%' }}>
                Patient ID
              </th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '15%' }}>
                Patient Name
              </th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '8%' }}>
                Age/Gender
              </th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '12%' }}>
                Speciality
              </th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '15%' }}>
                Admission/Discharge
              </th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '10%' }}>
                ICD Code
              </th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '15%' }}>
                Code Description
              </th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '10%' }}>
                Diagnosis
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((patient, index) => {
                const medicalRecords = patient.Medicalrecords || [];
                const diagnosisCount = medicalRecords.length;
                
                return (
                  <React.Fragment key={patient.PatientId}>
                    {diagnosisCount > 0 ? (
                      medicalRecords.map((record, recordIndex) => (
                        <tr key={`${patient.PatientId}-${recordIndex}`} style={{
                          fontSize: '11px',
                          backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                        }}>
                          {recordIndex === 0 ? (
                            <>
                              <td rowSpan={diagnosisCount} style={{ 
                                padding: '8px', 
                                textAlign: 'center', 
                                border: '1px solid #dee2e6',
                                verticalAlign: 'top',
                                fontWeight: 'bold'
                              }}>
                                {index + 1}
                              </td>
                              <td rowSpan={diagnosisCount} style={{ 
                                padding: '8px', 
                                textAlign: 'center', 
                                border: '1px solid #dee2e6',
                                verticalAlign: 'top',
                                fontWeight: 'bold'
                              }}>
                                {patient.PatientId}
                              </td>
                              <td rowSpan={diagnosisCount} style={{ 
                                padding: '8px', 
                                textAlign: 'left', 
                                border: '1px solid #dee2e6',
                                verticalAlign: 'top'
                              }}>
                                {patient.PatientName}
                              </td>
                              <td rowSpan={diagnosisCount} style={{ 
                                padding: '8px', 
                                textAlign: 'center', 
                                border: '1px solid #dee2e6',
                                verticalAlign: 'top'
                              }}>
                                {patient.Age} / {patient.Gender}
                              </td>
                              <td rowSpan={diagnosisCount} style={{ 
                                padding: '8px', 
                                textAlign: 'left', 
                                border: '1px solid #dee2e6',
                                verticalAlign: 'top'
                              }}>
                                {patient.Speciality}
                              </td>
                              <td rowSpan={diagnosisCount} style={{ 
                                padding: '8px', 
                                textAlign: 'center', 
                                border: '1px solid #dee2e6',
                                verticalAlign: 'top'
                              }}>
                                <div style={{ fontSize: '10px' }}>
                                  <div>Admission: {patient.AdmissionDate}</div>
                                  <div>Discharge: {patient.DischargeDate}</div>
                                </div>
                              </td>
                              <td style={{ 
                                padding: '8px', 
                                textAlign: 'center', 
                                border: '1px solid #dee2e6',
                                verticalAlign: 'top'
                              }}>
                                <span className="icd-badge">{record.ICDCode}</span>
                              </td>
                              <td style={{ 
                                padding: '8px', 
                                textAlign: 'left', 
                                border: '1px solid #dee2e6',
                                verticalAlign: 'top'
                              }}>
                                {record.Code_Description}
                              </td>
                              <td style={{ 
                                padding: '8px', 
                                textAlign: 'left', 
                                border: '1px solid #dee2e6',
                                verticalAlign: 'top'
                              }}>
                                {record.Diagnosis === "None" ? (
                                  <span style={{ color: '#6c757d', fontStyle: 'italic' }}>{record.Diagnosis}</span>
                                ) : (
                                  record.Diagnosis
                                )}
                              </td>
                            </>
                          ) : (
                            <>
                              <td style={{ 
                                padding: '8px', 
                                textAlign: 'center', 
                                border: '1px solid #dee2e6',
                                verticalAlign: 'top'
                              }}>
                                <span className="icd-badge">{record.ICDCode}</span>
                              </td>
                              <td style={{ 
                                padding: '8px', 
                                textAlign: 'left', 
                                border: '1px solid #dee2e6',
                                verticalAlign: 'top'
                              }}>
                                {record.Code_Description}
                              </td>
                              <td style={{ 
                                padding: '8px', 
                                textAlign: 'left', 
                                border: '1px solid #dee2e6',
                                verticalAlign: 'top'
                              }}>
                                {record.Diagnosis === "None" ? (
                                  <span style={{ color: '#6c757d', fontStyle: 'italic' }}>{record.Diagnosis}</span>
                                ) : (
                                  record.Diagnosis
                                )}
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    ) : (
                      <tr style={{
                        fontSize: '11px',
                        backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                      }}>
                        <td style={{ 
                          padding: '8px', 
                          textAlign: 'center', 
                          border: '1px solid #dee2e6',
                          verticalAlign: 'top',
                          fontWeight: 'bold'
                        }}>
                          {index + 1}
                        </td>
                        <td style={{ 
                          padding: '8px', 
                          textAlign: 'center', 
                          border: '1px solid #dee2e6',
                          verticalAlign: 'top',
                          fontWeight: 'bold'
                        }}>
                          {patient.PatientId}
                        </td>
                        <td style={{ 
                          padding: '8px', 
                          textAlign: 'left', 
                          border: '1px solid #dee2e6',
                          verticalAlign: 'top'
                        }}>
                          {patient.PatientName}
                        </td>
                        <td style={{ 
                          padding: '8px', 
                          textAlign: 'center', 
                          border: '1px solid #dee2e6',
                          verticalAlign: 'top'
                        }}>
                          {patient.Age} / {patient.Gender}
                        </td>
                        <td style={{ 
                          padding: '8px', 
                          textAlign: 'left', 
                          border: '1px solid #dee2e6',
                          verticalAlign: 'top'
                        }}>
                          {patient.Speciality}
                        </td>
                        <td style={{ 
                          padding: '8px', 
                          textAlign: 'center', 
                          border: '1px solid #dee2e6',
                          verticalAlign: 'top'
                        }}>
                          <div style={{ fontSize: '10px' }}>
                            <div><strong>Admission:</strong> {patient.AdmissionDate}</div>
                            <div><strong>Discharge:</strong> {patient.DischargeDate}</div>
                          </div>
                        </td>
                        <td colSpan="3" style={{ 
                          padding: '8px', 
                          textAlign: 'center', 
                          border: '1px solid #dee2e6',
                          verticalAlign: 'top',
                          color: '#6c757d',
                          fontStyle: 'italic'
                        }}>
                          No diagnosis records
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="9" style={{ 
                  border: '1px solid #dee2e6', 
                  padding: '30px', 
                  textAlign: 'center', 
                  color: '#6b7280'
                }}>
                  No patient records found for "{searchTerm}"
                </td>
              </tr>
            )}
          </tbody>
        
        </table>

       
      </div>
    </div>
  );
    };

const SpecialityDiagnosisPrint = () => {
  const componentRef = React.useRef();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedSpeciality, setSelectedSpeciality] = React.useState('');
  
  // Filter patients based on search term and selected speciality
  const filteredPatients = PatientWiseList.filter(patient => {
    const matchesSearch = searchTerm === '' || 
      patient.PatientId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.PatientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.Speciality?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patient.Medicalrecords?.some(record => 
        record.ICDCode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.Code_Description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.Diagnosis?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    
    const matchesSpeciality = selectedSpeciality === '' || 
      patient.Speciality === selectedSpeciality;
    
    return matchesSearch && matchesSpeciality;
  });

  // Get unique specialities for dropdown
  const allSpecialities = [...new Set(PatientWiseList.map(patient => patient.Speciality).filter(Boolean))].sort();

  // Group patients by Speciality
  const SpecialityWiseDiagnosis = filteredPatients.reduce((acc, patient, index) => {
    const speciality = patient.Speciality || 'Unknown Speciality';
    if (!acc[speciality]) {
      acc[speciality] = [];
    }
    // Calculate serial number within each speciality
    const serialNo = acc[speciality].length + 1;
    acc[speciality].push({
      sno: serialNo,
      PatientId: patient.PatientId,
      PatientName: patient.PatientName,
      Age: patient.Age,
      Gender: patient.Gender,
      Speciality: patient.Speciality,
      AdmissionDate: patient.AdmissionDate,
      DischargeDate: patient.DischargeDate,
      Medicalrecords: patient.Medicalrecords || []
    });
    return acc;
  }, {});

  // Calculate overall totals
  const totalPatients = filteredPatients.length;
  const totalDiagnoses = filteredPatients.reduce((sum, patient) => 
    sum + (patient.Medicalrecords?.length || 0), 0
  );

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Speciality-Wise_Diagnosis_Report',
  });

  // Format date range
  const reportDateRange = searchOptions.DateType === 'Current'
    ? `Report Date: ${new Date(searchOptions.CurrentDate || new Date()).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-')}`
    : `Report From: ${new Date(searchOptions.FromDate || new Date()).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-')} To: ${new Date(searchOptions.ToDate || new Date()).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-')}`;

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .filter-container {
              display: none;
            }
            .report-container {
              font-size: 12px;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .filter-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 300px;
          }
          .select-input {
            padding: 6px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 250px;
            background-color: white;
            cursor: pointer;
          }
          .search-input:focus,
          .select-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
          .speciality-header {
            background-color: #e3f2fd !important;
            font-weight: bold !important;
          }
          .icd-badge {
            background-color: #3498db;
            color: white;
            padding: 3px 8px;
            border-radius: 4px;
            font-size: 11px;
            font-weight: bold;
            display: inline-block;
          }
        `}
      </style>

      {/* Speciality Filter Container */}
      <div className="filter-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <label htmlFor="specialityFilter" style={{ fontWeight: '600', color: '#374151' }}>
              Filter by Speciality:
            </label>
            <select
              id="specialityFilter"
              className="select-input"
              value={selectedSpeciality}
              onChange={(e) => setSelectedSpeciality(e.target.value)}
              style={{ minWidth: '250px' }}
            >
              <option value="">All Specialities</option>
              {allSpecialities.map((speciality, index) => (
                <option key={index} value={speciality}>
                  {speciality}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="results-info">
          {selectedSpeciality && <span>Speciality: <strong>{selectedSpeciality}</strong> | </span>}
          <span>Showing {filteredPatients.length} of {PatientWiseList.length} patients</span>
        </div>

        {selectedSpeciality && (
          <button
            className="clear-search"
            onClick={() => setSelectedSpeciality('')}
          >
            Clear Filter
          </button>
        )}
      </div>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="diagnosisSearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search Patient/Diagnosis:
          </label>
          <input
            id="diagnosisSearch"
            type="text"
            className="search-input"
            placeholder="Search by Patient ID, Name, ICD Code, Diagnosis..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="results-info">
          Total Diagnoses: <strong>{totalDiagnoses}</strong>
          {searchTerm && (
            <span> | Filtered for: "<strong>{searchTerm}</strong>"</span>
          )}
        </div>

        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Buttons Container */}
      <div
        className="Register_btn_con added_Register_btn_con"
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}
      >
        <button
          className="RegisterForm_1_btns jwedu6_99"
          onClick={handlePrint}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Print Report
        </button>
        <button
          className="RegisterForm_1_btns jwedu6_99"
          onClick={handlePrintClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Close
        </button>
      </div>

      {/* Print Container */}
      <div className="print-container report-container" ref={componentRef}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #dee2e6',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr>
              <td
                colSpan="10"
                style={{
                  border: 'none',
                  textAlign: 'center',
                  padding: '15px 0',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <div>
                  <h2
                    className="header-text"
                    style={{
                      margin: '0',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      letterSpacing: '0.5px',
                    }}
                  >
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h1
                    className="subheader-text"
                    style={{
                      margin: '5px 0 0',
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#7f8c8d',
                      letterSpacing: '0.3px',
                    }}
                  >
                    SPECIALITY-WISE DIAGNOSIS REPORT
                  </h1>
                  <p
                    style={{
                      margin: '10px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    {reportDateRange}
                  </p>
                  <div style={{ 
                    marginTop: '10px',
                    display: 'flex', 
                    justifyContent: 'center', 
                    gap: '20px',
                    fontSize: '13px'
                  }}>
                    <span style={{ color: '#2c3e50' }}>
                      <strong>Total Patients:</strong> {totalPatients}
                    </span>
                    <span style={{ color: '#2c3e50' }}>
                      <strong>Total Diagnoses:</strong> {totalDiagnoses}
                    </span>
                    <span style={{ color: '#2c3e50' }}>
                      <strong>Specialities:</strong> {Object.keys(SpecialityWiseDiagnosis).length}
                    </span>
                  </div>
                  {selectedSpeciality && (
                    <p style={{ margin: '10px 0 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Showing only: <strong>{selectedSpeciality}</strong> Speciality
                    </p>
                  )}
                  {searchTerm && (
                    <p style={{ margin: '5px 0 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Search results for: "{searchTerm}"
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                backgroundColor: '#3498db',
                color: 'white',
              }}
            >
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '5%' }}>
                S.No
              </th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '10%' }}>
                Patient ID
              </th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '15%' }}>
                Patient Name
              </th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '8%' }}>
                Age/Gender
              </th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '12%' }}>
                Speciality
              </th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '10%' }}>
                Admission
              </th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '10%' }}>
                Discharge
              </th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '10%' }}>
                ICD Code
              </th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '10%' }}>
                Code Description
              </th>
              <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '10%' }}>
                Diagnosis
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.keys(SpecialityWiseDiagnosis).length > 0 ? (
              Object.entries(SpecialityWiseDiagnosis).map(([specialityName, patients], specialityIndex) => {
                let globalRowIndex = 0;
                return patients.map((patient, patientIndex) => {
                  const medicalRecords = patient.Medicalrecords || [];
                  const diagnosisCount = medicalRecords.length;
                  
                  // Calculate starting row index for this speciality
                  if (patientIndex === 0) {
                    globalRowIndex = Object.values(SpecialityWiseDiagnosis)
                      .slice(0, specialityIndex)
                      .reduce((sum, p) => sum + p.length, 0) + 1;
                  }

                  if (diagnosisCount > 0) {
                    return medicalRecords.map((record, recordIndex) => (
                      <tr key={`${patient.PatientId}-${recordIndex}`} style={{
                        fontSize: '11px',
                        backgroundColor: specialityIndex % 2 === 0 ? '#f8f9fa' : 'white',
                      }}>
                        {recordIndex === 0 ? (
                          <>
                            <td rowSpan={diagnosisCount} style={{ 
                              padding: '8px', 
                              textAlign: 'center', 
                              border: '1px solid #dee2e6',
                              verticalAlign: 'top',
                              fontWeight: 'bold',
                              backgroundColor: specialityIndex % 2 === 0 ? '#e8f4fc' : '#f0f8ff'
                            }}>
                              {globalRowIndex}
                            </td>
                            <td rowSpan={diagnosisCount} style={{ 
                              padding: '8px', 
                              textAlign: 'center', 
                              border: '1px solid #dee2e6',
                              verticalAlign: 'top',
                              fontWeight: 'bold'
                            }}>
                              {patient.PatientId}
                            </td>
                            <td rowSpan={diagnosisCount} style={{ 
                              padding: '8px', 
                              textAlign: 'left', 
                              border: '1px solid #dee2e6',
                              verticalAlign: 'top'
                            }}>
                              {patient.PatientName}
                            </td>
                            <td rowSpan={diagnosisCount} style={{ 
                              padding: '8px', 
                              textAlign: 'center', 
                              border: '1px solid #dee2e6',
                              verticalAlign: 'top'
                            }}>
                              {patient.Age} / {patient.Gender}
                            </td>
                            <td rowSpan={diagnosisCount} style={{ 
                              padding: '8px', 
                              textAlign: 'left', 
                              border: '1px solid #dee2e6',
                              verticalAlign: 'top',
                              backgroundColor: specialityIndex % 2 === 0 ? '#e8f4fc' : '#f0f8ff',
                              fontWeight: '500'
                            }}>
                              {specialityName}
                            </td>
                            <td rowSpan={diagnosisCount} style={{ 
                              padding: '8px', 
                              textAlign: 'center', 
                              border: '1px solid #dee2e6',
                              verticalAlign: 'top',
                              fontSize: '10px'
                            }}>
                              {patient.AdmissionDate}
                            </td>
                            <td rowSpan={diagnosisCount} style={{ 
                              padding: '8px', 
                              textAlign: 'center', 
                              border: '1px solid #dee2e6',
                              verticalAlign: 'top',
                              fontSize: '10px'
                            }}>
                              {patient.DischargeDate}
                            </td>
                            <td style={{ 
                              padding: '8px', 
                              textAlign: 'center', 
                              border: '1px solid #dee2e6',
                              verticalAlign: 'top'
                            }}>
                              <span className="icd-badge">{record.ICDCode}</span>
                            </td>
                            <td style={{ 
                              padding: '8px', 
                              textAlign: 'left', 
                              border: '1px solid #dee2e6',
                              verticalAlign: 'top'
                            }}>
                              {record.Code_Description}
                            </td>
                            <td style={{ 
                              padding: '8px', 
                              textAlign: 'left', 
                              border: '1px solid #dee2e6',
                              verticalAlign: 'top'
                            }}>
                              {record.Diagnosis === "None" ? (
                                <span style={{ color: '#6c757d', fontStyle: 'italic' }}>{record.Diagnosis}</span>
                              ) : (
                                record.Diagnosis
                              )}
                            </td>
                          </>
                        ) : (
                          <>
                            <td style={{ 
                              padding: '8px', 
                              textAlign: 'center', 
                              border: '1px solid #dee2e6',
                              verticalAlign: 'top'
                            }}>
                              <span className="icd-badge">{record.ICDCode}</span>
                            </td>
                            <td style={{ 
                              padding: '8px', 
                              textAlign: 'left', 
                              border: '1px solid #dee2e6',
                              verticalAlign: 'top'
                            }}>
                              {record.Code_Description}
                            </td>
                            <td style={{ 
                              padding: '8px', 
                              textAlign: 'left', 
                              border: '1px solid #dee2e6',
                              verticalAlign: 'top'
                            }}>
                              {record.Diagnosis === "None" ? (
                                <span style={{ color: '#6c757d', fontStyle: 'italic' }}>{record.Diagnosis}</span>
                              ) : (
                                record.Diagnosis
                              )}
                            </td>
                          </>
                        )}
                      </tr>
                    ));
                  } else {
                    return (
                      <tr key={patient.PatientId} style={{
                        fontSize: '11px',
                        backgroundColor: specialityIndex % 2 === 0 ? '#f8f9fa' : 'white',
                      }}>
                        <td style={{ 
                          padding: '8px', 
                          textAlign: 'center', 
                          border: '1px solid #dee2e6',
                          verticalAlign: 'top',
                          fontWeight: 'bold',
                          backgroundColor: specialityIndex % 2 === 0 ? '#e8f4fc' : '#f0f8ff'
                        }}>
                          {globalRowIndex}
                        </td>
                        <td style={{ 
                          padding: '8px', 
                          textAlign: 'center', 
                          border: '1px solid #dee2e6',
                          verticalAlign: 'top',
                          fontWeight: 'bold'
                        }}>
                          {patient.PatientId}
                        </td>
                        <td style={{ 
                          padding: '8px', 
                          textAlign: 'left', 
                          border: '1px solid #dee2e6',
                          verticalAlign: 'top'
                        }}>
                          {patient.PatientName}
                        </td>
                        <td style={{ 
                          padding: '8px', 
                          textAlign: 'center', 
                          border: '1px solid #dee2e6',
                          verticalAlign: 'top'
                        }}>
                          {patient.Age} / {patient.Gender}
                        </td>
                        <td style={{ 
                          padding: '8px', 
                          textAlign: 'left', 
                          border: '1px solid #dee2e6',
                          verticalAlign: 'top',
                          backgroundColor: specialityIndex % 2 === 0 ? '#e8f4fc' : '#f0f8ff',
                          fontWeight: '500'
                        }}>
                          {specialityName}
                        </td>
                        <td style={{ 
                          padding: '8px', 
                          textAlign: 'center', 
                          border: '1px solid #dee2e6',
                          verticalAlign: 'top',
                          fontSize: '10px'
                        }}>
                          {patient.AdmissionDate}
                        </td>
                        <td style={{ 
                          padding: '8px', 
                          textAlign: 'center', 
                          border: '1px solid #dee2e6',
                          verticalAlign: 'top',
                          fontSize: '10px'
                        }}>
                          {patient.DischargeDate}
                        </td>
                        <td colSpan="3" style={{ 
                          padding: '8px', 
                          textAlign: 'center', 
                          border: '1px solid #dee2e6',
                          verticalAlign: 'top',
                          color: '#6c757d',
                          fontStyle: 'italic'
                        }}>
                          No diagnosis records
                        </td>
                      </tr>
                    );
                  }
                });
              })
            ) : (
              <tr>
                <td colSpan="10" style={{ 
                  border: '1px solid #dee2e6', 
                  padding: '30px', 
                  textAlign: 'center', 
                  color: '#6b7280'
                }}>
                  {selectedSpeciality ? 
                    `No patients found in "${selectedSpeciality}" speciality${searchTerm ? ` for search "${searchTerm}"` : ''}` :
                    `No patient records found${searchTerm ? ` for search "${searchTerm}"` : ''}`
                  }
                </td>
              </tr>
            )}
          </tbody>
          
        </table>

        <div
          className="footer-text"
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderLeft: '4px solid #3498db',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#7f8c8d',
            lineHeight: '1.5',
          }}
        >
          
          <p style={{ margin: '10px 0 0 0', paddingTop: '10px', borderTop: '1px solid #ddd' }}>
            <strong>Note:</strong> This report displays diagnosis information grouped by medical speciality using rowspan for multiple diagnosis records per patient.
          </p>
        </div>
      </div>
    </div>
  );
};

const CodeWisePrint = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);

  // Group the flat list by ICDCode
  useEffect(() => {
    const grouped = filteredData.reduce((acc, patient) => {
      const code = patient.ICDCode || 'Unknown';
      const description = patient.Code_Description || 'No Description';

      if (!acc[code]) {
        acc[code] = {
          ICDCode: code,
          Code_Description: description,
          Patients: [],
          Count: 0,
        };
      }

      acc[code].Patients.push(patient);
      acc[code].Count += 1;

      return acc;
    }, {});

    // Convert to array and sort by ICDCode
    const groupedArray = Object.values(grouped).sort((a, b) =>
      a.ICDCode.localeCompare(b.ICDCode)
    );

    setGroupedData(groupedArray);
  }, [filteredData]);

  // Filter the flat list based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(CodeWiseList);
      return;
    }

    const searchLower = searchTerm.toLowerCase();

    const filtered = CodeWiseList.filter((patient) => {
      return (
        patient.ICDCode?.toLowerCase().includes(searchLower) ||
        patient.Code_Description?.toLowerCase().includes(searchLower) ||
        patient.PatientId?.toLowerCase().includes(searchLower) ||
        patient.PatientName?.toLowerCase().includes(searchLower) ||
        patient.Speciality?.toLowerCase().includes(searchLower) ||
        patient.Diagnosis?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredData(filtered);
  }, [searchTerm, CodeWiseList]);

  // Calculate totals
  const totalCodes = groupedData.length;
  const totalPatients = groupedData.reduce((sum, item) => sum + item.Count, 0);

  // Handle print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Code_Wise_Report',
  });

  // Format current date
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '-');

  // Render a single code section
  const renderCodeSection = (codeItem, codeIndex) => (
    <React.Fragment key={`code-${codeIndex}`}>
      {/* Code Header Row */}
      <tr style={{ backgroundColor: '#e3f2fd' }}>
        <td colSpan="8" style={{ padding: '8px', border: '1px solid #dee2e6', fontWeight: 'bold' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '13px', color: '#1565c0' }}>{codeItem.ICDCode}</span>
              <span style={{ marginLeft: '15px', fontSize: '12px', color: '#424242' }}>
                {codeItem.Code_Description}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#d32f2f', fontWeight: 'bold' }}>
              Patients: {codeItem.Count}
            </div>
          </div>
        </td>
      </tr>

      {/* Patient Table Header */}
      <tr style={{ backgroundColor: '#1976d2', color: 'white', fontSize: '12px' }}>
        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Patient ID</th>
        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Patient Name</th>
        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Gender</th>
        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Age</th>
        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Admission Date</th>
        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Discharge Date</th>
        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Speciality</th>
        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Diagnosis</th>
      </tr>

      {/* Patient Rows */}
      {codeItem.Patients.map((patient, patientIndex) => (
        <tr
          key={`patient-${codeIndex}-${patientIndex}`}
          style={{
            fontSize: '12px',
            backgroundColor: patientIndex % 2 === 0 ? '#f8f9fa' : 'white',
          }}
        >
          <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>
            {patient.PatientId || '-'}
          </td>
          <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>
            {patient.PatientName || '-'}
          </td>
          <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>
            {patient.Gender || '-'}
          </td>
          <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>
            {patient.Age || '-'}
          </td>
          <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>
            {patient.AdmissionDate || '-'}
          </td>
          <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>
            {patient.DischargeDate || '-'}
          </td>
          <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>
            {patient.Speciality || '-'}
          </td>
          <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>
            {patient.Diagnosis || '-'}
          </td>
        </tr>
      ))}

      {/* Subtotal */}
      <tr style={{ backgroundColor: '#f5f5f5', fontSize: '12px' }}>
        <td colSpan="7" style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'right', fontWeight: 'bold' }}>
          Subtotal for {codeItem.ICDCode}:
        </td>
        <td style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold', color: '#d32f2f' }}>
          {codeItem.Count}
        </td>
      </tr>

      {/* Spacer */}
      <tr>
        <td colSpan="8" style={{ padding: '10px', border: 'none' }}></td>
      </tr>
    </React.Fragment>
  );

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          table { page-break-inside: auto; width: 100%; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
          .search-container, .Register_btn_con { display: none !important; }
          .report-container { font-size: 11px; }
        }
        .search-container {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .search-input {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 14px;
          min-width: 250px;
        }
        .search-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        button {
          padding: 8px 16px;
          margin: 5px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        button:hover { background-color: #1e40af; }
        .clear-search { background-color: #6b7280; }
        .clear-search:hover { background-color: #4b5563; }
      `}</style>

      {/* Search & Controls */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="codeSearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search:
          </label>
          <input
            id="codeSearch"
            type="text"
            className="search-input"
            placeholder="Search by ICD Code, Description, Patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ marginLeft: 'auto', fontSize: '14px', color: '#6b7280' }}>
          Showing {totalCodes} codes, {totalPatients} patients
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>

        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm('')}>
            Clear Search
          </button>
        )}
      </div>

      <div
        className="Register_btn_con"
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}
      >
        <button onClick={handlePrint}>Print Report</button>
        <button
          style={{ backgroundColor: '#e74c3c' }}
          onClick={handlePrintClose}
        >
          Close
        </button>
      </div>

      {/* Printable Content */}
      <div className="print-container report-container" ref={componentRef}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #dee2e6',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr>
              <td
                colSpan="8"
                style={{
                  border: 'none',
                  textAlign: 'center',
                  padding: '15px 0',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <div>
                  <h2 style={{ margin: '0', fontSize: '24px', color: '#2c3e50' }}>
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h3 style={{ margin: '5px 0 0', fontSize: '18px', color: '#7f8c8d' }}>
                    Vilayodi, Chittur, Palakkad
                  </h3>
                  <h4 style={{ margin: '10px 0 0', fontSize: '16px', color: '#34495e' }}>
                    ICD CODE WISE PATIENT REPORT
                  </h4>
                  <p style={{ margin: '10px 0 0', fontSize: '14px', color: '#34495e' }}>
                    {searchOptions.DateType === 'Current' ? (
                        <>
                          Report Date:{' '}
                          {new Date(searchOptions.CurrentDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          }).replace(/\//g, '-')}
                        </>
                      ) : searchOptions.DateType === 'Particular' ? (
                        <>
                          Report Date:{' '}
                          {new Date(searchOptions.ParticularDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          }).replace(/\//g, '-')}
                        </>
                      ) : (
                        <>
                          Report From:{' '}
                          {new Date(searchOptions.FromDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          }).replace(/\//g, '-')}
                          {' To: '}
                          {new Date(searchOptions.ToDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          }).replace(/\//g, '-')}
                        </>
                      )}
                    {searchTerm && (
                      <span style={{ marginLeft: '20px', color: '#ef4444', fontStyle: 'italic' }}>
                        Filtered results for: "{searchTerm}"
                      </span>
                    )}
                  </p>
                </div>
              </td>
            </tr>
          </thead>

          <tbody>
            {groupedData.length > 0 ? (
              groupedData.map((codeItem, index) => renderCodeSection(codeItem, index))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#6b7280',
                    border: '1px solid #dee2e6',
                  }}
                >
                  No records found{searchTerm ? ` for "${searchTerm}"` : ''}
                </td>
              </tr>
            )}
          </tbody>

          <tfoot>
            {groupedData.length > 0 && (
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                }}
              >
                <td
                  colSpan="7"
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'right',
                    borderTop: '2px solid #3498db',
                  }}
                >
                  GRAND TOTAL (Codes: {totalCodes}, Patients: {totalPatients})
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#3498db',
                    fontSize: '14px',
                    borderTop: '2px solid #3498db',
                  }}
                >
                  {totalPatients}
                </td>
              </tr>
            )}
          </tfoot>
        </table>

        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderLeft: '4px solid #3498db',
            borderRadius: '4px',
          }}
        >
          <p style={{ margin: '0', fontSize: '12px', color: '#7f8c8d', lineHeight: '1.5' }}>
            <strong>Note:</strong> This report groups patients by ICD codes with details of patient
            information, admission/discharge dates, and speciality.
          </p>
        </div>
      </div>
    </div>
  );
};


const DiagnosisWisePrint = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [groupedData, setGroupedData] = useState([]);

  // Group the flat list by ICDCode
  useEffect(() => {
    const grouped = filteredData.reduce((acc, patient) => {
      const code = patient.ICDCode || 'Unknown';
      const description = patient.Code_Description || 'No Description';

      if (!acc[code]) {
        acc[code] = {
          ICDCode: code,
          Code_Description: description,
          Patients: [],
          Count: 0,
        };
      }

      acc[code].Patients.push(patient);
      acc[code].Count += 1;

      return acc;
    }, {});

    // Convert to array and sort by ICDCode
    const groupedArray = Object.values(grouped).sort((a, b) =>
      a.ICDCode.localeCompare(b.ICDCode)
    );

    setGroupedData(groupedArray);
  }, [filteredData]);

  // Filter the flat list based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(DWiseList);
      return;
    }

    const searchLower = searchTerm.toLowerCase();

    const filtered = CodeWiseList.filter((patient) => {
      return (
        patient.ICDCode?.toLowerCase().includes(searchLower) ||
        patient.Code_Description?.toLowerCase().includes(searchLower) ||
        patient.PatientId?.toLowerCase().includes(searchLower) ||
        patient.PatientName?.toLowerCase().includes(searchLower) ||
        patient.Speciality?.toLowerCase().includes(searchLower) ||
        patient.Diagnosis?.toLowerCase().includes(searchLower)
      );
    });

    setFilteredData(filtered);
  }, [searchTerm, DWiseList]);

  // Calculate totals
  const totalCodes = groupedData.length;
  const totalPatients = groupedData.reduce((sum, item) => sum + item.Count, 0);

  // Handle print
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: 'Code_Wise_Report',
  });

  // Format current date
  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).replace(/\//g, '-');

  // Render a single code section
  const renderCodeSection = (codeItem, codeIndex) => (
    <React.Fragment key={`code-${codeIndex}`}>
      {/* Code Header Row */}
      <tr style={{ backgroundColor: '#e3f2fd' }}>
        <td colSpan="8" style={{ padding: '8px', border: '1px solid #dee2e6', fontWeight: 'bold' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '13px', color: '#1565c0' }}>{codeItem.ICDCode}</span>
              <span style={{ marginLeft: '15px', fontSize: '12px', color: '#424242' }}>
                {codeItem.Code_Description}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#d32f2f', fontWeight: 'bold' }}>
              Patients: {codeItem.Count}
            </div>
          </div>
        </td>
      </tr>

      {/* Patient Table Header */}
      <tr style={{ backgroundColor: '#1976d2', color: 'white', fontSize: '12px' }}>
        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Patient ID</th>
        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Patient Name</th>
        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Gender</th>
        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Age</th>
        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Admission Date</th>
        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Discharge Date</th>
        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Speciality</th>
        <th style={{ padding: '8px', border: '1px solid #dee2e6' }}>Diagnosis</th>
      </tr>

      {/* Patient Rows */}
      {codeItem.Patients.map((patient, patientIndex) => (
        <tr
          key={`patient-${codeIndex}-${patientIndex}`}
          style={{
            fontSize: '12px',
            backgroundColor: patientIndex % 2 === 0 ? '#f8f9fa' : 'white',
          }}
        >
          <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>
            {patient.PatientId || '-'}
          </td>
          <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>
            {patient.PatientName || '-'}
          </td>
          <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>
            {patient.Gender || '-'}
          </td>
          <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>
            {patient.Age || '-'}
          </td>
          <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>
            {patient.AdmissionDate || '-'}
          </td>
          <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #dee2e6' }}>
            {patient.DischargeDate || '-'}
          </td>
          <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>
            {patient.Speciality || '-'}
          </td>
          <td style={{ padding: '8px', textAlign: 'left', border: '1px solid #dee2e6' }}>
            {patient.Diagnosis || '-'}
          </td>
        </tr>
      ))}

      {/* Subtotal */}
      <tr style={{ backgroundColor: '#f5f5f5', fontSize: '12px' }}>
        <td colSpan="7" style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'right', fontWeight: 'bold' }}>
          Subtotal for {codeItem.ICDCode}:
        </td>
        <td style={{ padding: '8px', border: '1px solid #dee2e6', textAlign: 'center', fontWeight: 'bold', color: '#d32f2f' }}>
          {codeItem.Count}
        </td>
      </tr>

      {/* Spacer */}
      <tr>
        <td colSpan="8" style={{ padding: '10px', border: 'none' }}></td>
      </tr>
    </React.Fragment>
  );

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <style>{`
        @media print {
          body { margin: 0; padding: 0; }
          table { page-break-inside: auto; width: 100%; }
          tr { page-break-inside: avoid; page-break-after: auto; }
          thead { display: table-header-group; }
          tfoot { display: table-footer-group; }
          .search-container, .Register_btn_con { display: none !important; }
          .report-container { font-size: 11px; }
        }
        .search-container {
          margin-bottom: 15px;
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .search-input {
          padding: 8px 12px;
          border: 1px solid #d1d5db;
          border-radius: 4px;
          font-size: 14px;
          min-width: 250px;
        }
        .search-input:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }
        button {
          padding: 8px 16px;
          margin: 5px;
          background-color: #2563eb;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
        button:hover { background-color: #1e40af; }
        .clear-search { background-color: #6b7280; }
        .clear-search:hover { background-color: #4b5563; }
      `}</style>

      {/* Search & Controls */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="codeSearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search:
          </label>
          <input
            id="codeSearch"
            type="text"
            className="search-input"
            placeholder="Search by ICD Code, Description, Patient..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div style={{ marginLeft: 'auto', fontSize: '14px', color: '#6b7280' }}>
          Showing {totalCodes} codes, {totalPatients} patients
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>

        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm('')}>
            Clear Search
          </button>
        )}
      </div>

      <div
        className="Register_btn_con"
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}
      >
        <button onClick={handlePrint}>Print Report</button>
        <button
          style={{ backgroundColor: '#e74c3c' }}
          onClick={handlePrintClose}
        >
          Close
        </button>
      </div>

      {/* Printable Content */}
      <div className="print-container report-container" ref={componentRef}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #dee2e6',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr>
              <td
                colSpan="8"
                style={{
                  border: 'none',
                  textAlign: 'center',
                  padding: '15px 0',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <div>
                  <h2 style={{ margin: '0', fontSize: '24px', color: '#2c3e50' }}>
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h3 style={{ margin: '5px 0 0', fontSize: '18px', color: '#7f8c8d' }}>
                    Vilayodi, Chittur, Palakkad
                  </h3>
                  <h4 style={{ margin: '10px 0 0', fontSize: '16px', color: '#34495e' }}>
                    ICD CODE WISE PATIENT REPORT
                  </h4>
                  <p style={{ margin: '10px 0 0', fontSize: '14px', color: '#34495e' }}>
                    {searchOptions.DateType === 'Current' ? (
                        <>
                          Report Date:{' '}
                          {new Date(searchOptions.CurrentDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          }).replace(/\//g, '-')}
                        </>
                      ) : searchOptions.DateType === 'Particular' ? (
                        <>
                          Report Date:{' '}
                          {new Date(searchOptions.ParticularDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          }).replace(/\//g, '-')}
                        </>
                      ) : (
                        <>
                          Report From:{' '}
                          {new Date(searchOptions.FromDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          }).replace(/\//g, '-')}
                          {' To: '}
                          {new Date(searchOptions.ToDate).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          }).replace(/\//g, '-')}
                        </>
                      )}
                    {searchTerm && (
                      <span style={{ marginLeft: '20px', color: '#ef4444', fontStyle: 'italic' }}>
                        Filtered results for: "{searchTerm}"
                      </span>
                    )}
                  </p>
                </div>
              </td>
            </tr>
          </thead>

          <tbody>
            {groupedData.length > 0 ? (
              groupedData.map((codeItem, index) => renderCodeSection(codeItem, index))
            ) : (
              <tr>
                <td
                  colSpan="8"
                  style={{
                    padding: '40px',
                    textAlign: 'center',
                    color: '#6b7280',
                    border: '1px solid #dee2e6',
                  }}
                >
                  No records found{searchTerm ? ` for "${searchTerm}"` : ''}
                </td>
              </tr>
            )}
          </tbody>

          <tfoot>
            {groupedData.length > 0 && (
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                }}
              >
                <td
                  colSpan="7"
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'right',
                    borderTop: '2px solid #3498db',
                  }}
                >
                  GRAND TOTAL (Codes: {totalCodes}, Patients: {totalPatients})
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#3498db',
                    fontSize: '14px',
                    borderTop: '2px solid #3498db',
                  }}
                >
                  {totalPatients}
                </td>
              </tr>
            )}
          </tfoot>
        </table>

        <div
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderLeft: '4px solid #3498db',
            borderRadius: '4px',
          }}
        >
          <p style={{ margin: '0', fontSize: '12px', color: '#7f8c8d', lineHeight: '1.5' }}>
            <strong>Note:</strong> This report groups patients by ICD codes with details of patient
            information, admission/discharge dates, and speciality.
          </p>
        </div>
      </div>
    </div>
  );
};

const CTReportPrint = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedTests, setGroupedTests] = useState([]);
  const [totals, setTotals] = useState({ ip: 0, op: 0, total: 0 });
  const [filteredTests, setFilteredTests] = useState([]);

  // Combine and process test data
  useEffect(() => {
    const allTests = [...OriginalCt, ...DummyCt];
    const testMap = {};
    
    allTests.forEach(item => {
      const testName = item.Test_Name || 'Unknown Test';
      const registerType = item.RegisterType || 'OP';
      
      if (!testMap[testName]) {
        testMap[testName] = {
          testName,
          ipCount: 0,
          opCount: 0,
          total: 0
        };
      }
      
      if (registerType === 'IP') {
        testMap[testName].ipCount += 1;
      } else {
        testMap[testName].opCount += 1;
      }
      
      testMap[testName].total = testMap[testName].ipCount + testMap[testName].opCount;
    });
    
    // Convert to array and sort by test name
    const testArray = Object.values(testMap).sort((a, b) => 
      a.testName.localeCompare(b.testName)
    );
    
    // Calculate totals
    const ipTotal = testArray.reduce((sum, test) => sum + test.ipCount, 0);
    const opTotal = testArray.reduce((sum, test) => sum + test.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setGroupedTests(testArray);
    setFilteredTests(testArray);
    setTotals({ ip: ipTotal, op: opTotal, total: grandTotal });
  }, [OriginalCt, DummyCt]);

  // Filter tests based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTests(groupedTests);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = groupedTests.filter(test =>
      test.testName.toLowerCase().includes(searchLower)
    );

    // Recalculate totals for filtered results
    const ipTotal = filtered.reduce((sum, test) => sum + test.ipCount, 0);
    const opTotal = filtered.reduce((sum, test) => sum + test.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setFilteredTests(filtered);
    setTotals({ ip: ipTotal, op: opTotal, total: grandTotal });
  }, [searchTerm, groupedTests]);

  // Format date based on search options
  const getDateRangeText = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (DateType === 'Particular' && ParticularDate) {
      return new Date(ParticularDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const to = new Date(ToDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return `${from} to ${to}`;
    }
    
    return new Date().toLocaleDateString('en-IN');
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `CT_Report_${new Date().toISOString().split('T')[0]}`,
  });

  // Get current date for display
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Format date range for report header
  const reportDateRange = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return `Report Date: ${
        searchOptions.CurrentDate
          ? new Date(searchOptions.CurrentDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            }).replace(/\//g, '-')
          : 'N/A'
      }`;
    } else if (DateType === 'Particular' && ParticularDate) {
      return `Report Date: ${
        new Date(ParticularDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')
      }`;
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      const to = new Date(ToDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      return `Report From: ${from} To: ${to}`;
    }
    
    return `Report Date: ${currentDate}`;
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .report-container {
              font-size: 12px;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 250px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
          .stats-container {
            display: flex;
            gap: 15px;
            margin-top: 10px;
            flex-wrap: wrap;
          }
          .stat-card {
            padding: 8px 15px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            min-width: 120px;
          }
          .stat-label {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 2px;
          }
          .stat-value {
            font-size: 16px;
            font-weight: bold;
          }
        `}
      </style>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="testSearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search Test:
          </label>
          <input
            id="testSearch"
            type="text"
            className="search-input"
            placeholder="Search CT test names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="results-info">
          Showing {filteredTests.length} of {groupedTests.length} CT tests
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>

        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
            <div className="stat-label">Total Tests</div>
            <div className="stat-value">{filteredTests.length}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="stat-label">IP Cases</div>
            <div className="stat-value">{totals.ip}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
            <div className="stat-label">OP Cases</div>
            <div className="stat-value">{totals.op}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#ef4444' }}>
            <div className="stat-label">Grand Total</div>
            <div className="stat-value">{totals.total}</div>
          </div>
        </div>
      </div>

      <div
        className="Register_btn_con"
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}
      >
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrint}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Print Report
        </button>
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrintClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Close
        </button>
      </div>

      <div className="print-container report-container" ref={componentRef}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #dee2e6',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr>
              <td
                colSpan="5"
                style={{
                  border: 'none',
                  textAlign: 'center',
                  padding: '15px 0',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <div>
                  <h2
                    className="header-text"
                    style={{
                      margin: '0',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      letterSpacing: '0.5px',
                    }}
                  >
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h1
                    className="subheader-text"
                    style={{
                      margin: '5px 0 0',
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#7f8c8d',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Vilayodi, Chittur, Palakkad
                  </h1>
                  <h4
                    style={{
                      margin: '10px 0 0',
                      fontSize: '16px',
                      color: '#34495e',
                      fontWeight: 'bold',
                    }}
                  >
                    CT SCAN REPORT
                  </h4>
                  <p
                    style={{
                      margin: '10px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    Clinical Material From {getDateRangeText()}
                  </p>
                  <p
                    style={{
                      margin: '5px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    {reportDateRange()}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                backgroundColor: '#3498db',
                color: 'white',
              }}
            >
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '10%'
              }}>
                S.No
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '50%'
              }}>
                Investigations
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '15%'
              }}>
                IP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '15%'
              }}>
                OP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '15%'
              }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.length > 0 ? (
              filteredTests.map((test, index) => (
                <tr
                  key={`test-${index}`}
                  style={{
                    fontSize: '12px',
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>
                    {index + 1}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'left', 
                    border: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>
                    {test.testName}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    color: '#059669',
                    fontWeight: '600'
                  }}>
                    {test.ipCount}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    color: '#d97706',
                    fontWeight: '600'
                  }}>
                    {test.opCount}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    color: '#dc2626',
                    fontWeight: 'bold',
                    backgroundColor: '#fef2f2'
                  }}>
                    {test.total}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    padding: '40px 15px',
                    textAlign: 'center',
                    color: '#6b7280',
                    border: '1px solid #dee2e6',
                    fontStyle: 'italic',
                  }}
                >
                  No CT scan data found{searchTerm ? ` for "${searchTerm}"` : ''}
                </td>
              </tr>
            )}
            
            {/* Empty row for spacing */}
            <tr>
              <td colSpan="5" style={{ padding: '10px', border: 'none' }}></td>
            </tr>
            
            {/* Totals row */}
            {filteredTests.length > 0 && (
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                }}
              >
                <td
                  colSpan="2"
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#059669',
                  }}
                >
                  {totals.ip}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#d97706',
                  }}
                >
                  {totals.op}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#dc2626',
                    fontSize: '14px',
                  }}
                >
                  {totals.total}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        

        
      </div>
    </div>
  );
};

const SpecialtyCTReportPrint = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedBySpecialty, setGroupedBySpecialty] = useState({});
  const [specialties, setSpecialties] = useState([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [totals, setTotals] = useState({ 
    ip: 0, 
    op: 0, 
    total: 0,
    specialtyCount: 0
  });

  // Combine and process test data by specialty
  useEffect(() => {
    const allTests = [...(OriginalCt || []), ...(DummyCt || [])];
    
    // Create a map to group by specialty
    const specialtyMap = {};
    const allTestTypes = new Set();
    
    allTests.forEach(item => {
      const specialty = item.Speciality || 'UNSPECIFIED';
      const testName = item.Test_Name || 'Unknown Test';
      const registerType = item.RegisterType || 'OP';
      
      // Initialize specialty if not exists
      if (!specialtyMap[specialty]) {
        specialtyMap[specialty] = {
          specialtyName: specialty,
          tests: {},
          ipCount: 0,
          opCount: 0,
          total: 0
        };
      }
      
      // Initialize test type if not exists
      if (!specialtyMap[specialty].tests[testName]) {
        specialtyMap[specialty].tests[testName] = {
          testName: testName,
          ipCount: 0,
          opCount: 0,
          total: 0
        };
      }
      
      // Add to test counts
      if (registerType === 'IP') {
        specialtyMap[specialty].tests[testName].ipCount += 1;
        specialtyMap[specialty].ipCount += 1;
      } else {
        specialtyMap[specialty].tests[testName].opCount += 1;
        specialtyMap[specialty].opCount += 1;
      }
      
      specialtyMap[specialty].tests[testName].total = 
        specialtyMap[specialty].tests[testName].ipCount + 
        specialtyMap[specialty].tests[testName].opCount;
      
      specialtyMap[specialty].total = 
        specialtyMap[specialty].ipCount + 
        specialtyMap[specialty].opCount;
      
      allTestTypes.add(testName);
    });
    
    // Convert tests objects to arrays and sort
    const specialtiesArray = Object.values(specialtyMap).map(specialty => ({
      ...specialty,
      tests: Object.values(specialty.tests).sort((a, b) => 
        a.testName.localeCompare(b.testName)
      )
    }));
    
    // Sort specialties by name
    specialtiesArray.sort((a, b) => a.specialtyName.localeCompare(b.specialtyName));
    
    // Calculate overall totals
    const ipTotal = specialtiesArray.reduce((sum, spec) => sum + spec.ipCount, 0);
    const opTotal = specialtiesArray.reduce((sum, spec) => sum + spec.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setGroupedBySpecialty(specialtyMap);
    setSpecialties(specialtiesArray);
    setFilteredSpecialties(specialtiesArray);
    setTotals({ 
      ip: ipTotal, 
      op: opTotal, 
      total: grandTotal,
      specialtyCount: specialtiesArray.length
    });
  }, [OriginalCt, DummyCt]);

  // Filter specialties and tests based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSpecialties(specialties);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    
    const filtered = specialties.map(specialty => {
      // Check if specialty name matches
      if (specialty.specialtyName.toLowerCase().includes(searchLower)) {
        return specialty;
      }
      
      // Filter tests within specialty
      const filteredTests = specialty.tests.filter(test =>
        test.testName.toLowerCase().includes(searchLower)
      );
      
      if (filteredTests.length > 0) {
        // Recalculate counts for filtered tests
        const ipCount = filteredTests.reduce((sum, test) => sum + test.ipCount, 0);
        const opCount = filteredTests.reduce((sum, test) => sum + test.opCount, 0);
        
        return {
          ...specialty,
          tests: filteredTests,
          ipCount,
          opCount,
          total: ipCount + opCount
        };
      }
      
      return null;
    }).filter(specialty => specialty !== null);

    // Recalculate overall totals for filtered results
    const ipTotal = filtered.reduce((sum, spec) => sum + spec.ipCount, 0);
    const opTotal = filtered.reduce((sum, spec) => sum + spec.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setFilteredSpecialties(filtered);
    setTotals({ 
      ip: ipTotal, 
      op: opTotal, 
      total: grandTotal,
      specialtyCount: filtered.length
    });
  }, [searchTerm, specialties]);

  // Format date based on search options
  const getDateRangeText = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (DateType === 'Particular' && ParticularDate) {
      return new Date(ParticularDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const to = new Date(ToDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return `${from} to ${to}`;
    }
    
    return new Date().toLocaleDateString('en-IN');
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Specialty_CT_Report_${new Date().toISOString().split('T')[0]}`,
  });

  // Format date range for report header
  const reportDateRange = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return `Report Date: ${
        searchOptions.CurrentDate
          ? new Date(searchOptions.CurrentDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            }).replace(/\//g, '-')
          : 'N/A'
      }`;
    } else if (DateType === 'Particular' && ParticularDate) {
      return `Report Date: ${
        new Date(ParticularDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')
      }`;
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      const to = new Date(ToDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      return `Report From: ${from} To: ${to}`;
    }
    
    return `Report Date: ${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}`;
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .specialty-section {
              page-break-inside: avoid;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .report-container {
              font-size: 11px;
            }
            .specialty-header {
              background-color: #f0f0f0 !important;
              -webkit-print-color-adjust: exact;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 300px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
          .stats-container {
            display: flex;
            gap: 15px;
            margin-top: 10px;
            flex-wrap: wrap;
          }
          .stat-card {
            padding: 8px 15px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            min-width: 120px;
          }
          .stat-label {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 2px;
          }
          .stat-value {
            font-size: 16px;
            font-weight: bold;
          }
          .specialty-header {
            background-color: #4f46e5;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          .specialty-header:hover {
            background-color: #4338ca;
          }
          .specialty-header td {
            position: relative;
            padding-right: 30px;
          }
          .specialty-header .arrow {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            transition: transform 0.3s;
          }
          .collapsed .arrow {
            transform: translateY(-50%) rotate(-90deg);
          }
        `}
      </style>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="specialtySearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search:
          </label>
          <input
            id="specialtySearch"
            type="text"
            className="search-input"
            placeholder="Search specialty or test name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="results-info">
          Showing {filteredSpecialties.length} of {specialties.length} specialties
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>

        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
            <div className="stat-label">Specialties</div>
            <div className="stat-value">{totals.specialtyCount}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="stat-label">IP Cases</div>
            <div className="stat-value">{totals.ip}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
            <div className="stat-label">OP Cases</div>
            <div className="stat-value">{totals.op}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#ef4444' }}>
            <div className="stat-label">Grand Total</div>
            <div className="stat-value">{totals.total}</div>
          </div>
        </div>
      </div>

      <div
        className="Register_btn_con"
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}
      >
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrint}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Print Report
        </button>
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrintClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Close
        </button>
      </div>

      <div className="print-container report-container" ref={componentRef}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #dee2e6',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr>
              <td
                colSpan="6"
                style={{
                  border: 'none',
                  textAlign: 'center',
                  padding: '15px 0',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <div>
                  <h2
                    className="header-text"
                    style={{
                      margin: '0',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      letterSpacing: '0.5px',
                    }}
                  >
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h1
                    className="subheader-text"
                    style={{
                      margin: '5px 0 0',
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#7f8c8d',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Vilayodi, Chittur, Palakkad
                  </h1>
                  <h4
                    style={{
                      margin: '10px 0 0',
                      fontSize: '16px',
                      color: '#34495e',
                      fontWeight: 'bold',
                    }}
                  >
                    CT SCAN REPORT - SPECIALTY WISE
                  </h4>
                  <p
                    style={{
                      margin: '10px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    Clinical Material From {getDateRangeText()}
                  </p>
                  <p
                    style={{
                      margin: '5px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    {reportDateRange()}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                backgroundColor: '#3498db',
                color: 'white',
              }}
            >
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '5%'
              }}>
                S.No
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '45%'
              }}>
                Investigations
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '12%'
              }}>
                IP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '12%'
              }}>
                OP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '12%'
              }}>
                Total
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '14%'
              }}>
                Specialty Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSpecialties.length > 0 ? (
              filteredSpecialties.map((specialty, specIndex) => (
                <React.Fragment key={`specialty-${specIndex}`}>
                  {/* Specialty Header Row */}
                  <tr className="specialty-header">
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      fontSize: '13px'
                    }}>
                      {specIndex + 1}
                    </td>
                    <td colSpan="4" style={{ 
                      padding: '10px', 
                      textAlign: 'left', 
                      border: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {specialty.specialtyName}
                      <span className="arrow">▼</span>
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      backgroundColor: '#4338ca'
                    }}>
                      {specialty.total}
                    </td>
                  </tr>
                  
                  {/* Tests within specialty */}
                  {specialty.tests.map((test, testIndex) => (
                    <tr
                      key={`test-${specIndex}-${testIndex}`}
                      style={{
                        fontSize: '11px',
                        backgroundColor: testIndex % 2 === 0 ? '#f8f9fa' : 'white',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        fontWeight: '500'
                      }}>
                        {specIndex + 1}.{testIndex + 1}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'left', 
                        border: '1px solid #dee2e6',
                        fontWeight: '500',
                        paddingLeft: '20px'
                      }}>
                        {test.testName}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#059669',
                        fontWeight: '600'
                      }}>
                        {test.ipCount}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#d97706',
                        fontWeight: '600'
                      }}>
                        {test.opCount}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#dc2626',
                        fontWeight: '600'
                      }}>
                        {test.total}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        backgroundColor: '#f3f4f6',
                        fontWeight: '500'
                      }}>
                        {/* Empty for test rows */}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Specialty Totals Row */}
                  <tr
                    style={{
                      fontWeight: 'bold',
                      fontSize: '12px',
                      backgroundColor: '#e5e7eb',
                      borderTop: '2px solid #9ca3af'
                    }}
                  >
                    <td colSpan="2" style={{ 
                      padding: '10px', 
                      textAlign: 'right', 
                      border: '1px solid #dee2e6',
                      fontWeight: '600'
                    }}>
                      {specialty.specialtyName} Total
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      color: '#059669',
                      backgroundColor: '#d1fae5'
                    }}>
                      {specialty.ipCount}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      color: '#d97706',
                      backgroundColor: '#fef3c7'
                    }}>
                      {specialty.opCount}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      color: '#dc2626',
                      backgroundColor: '#fee2e2',
                      fontWeight: 'bold'
                    }}>
                      {specialty.total}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      backgroundColor: '#dbeafe',
                      fontWeight: 'bold'
                    }}>
                      {specialty.total}
                    </td>
                  </tr>
                  
                  {/* Empty row for spacing between specialties */}
                  <tr>
                    <td colSpan="6" style={{ padding: '5px', border: 'none' }}></td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: '40px 15px',
                    textAlign: 'center',
                    color: '#6b7280',
                    border: '1px solid #dee2e6',
                    fontStyle: 'italic',
                  }}
                >
                  No CT scan data found{searchTerm ? ` for "${searchTerm}"` : ''}
                </td>
              </tr>
            )}
            
            {/* Grand Totals Row */}
            {filteredSpecialties.length > 0 && (
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                  borderTop: '3px solid #3498db'
                }}
              >
                <td
                  colSpan="2"
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL ({totals.specialtyCount} Specialties)
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#059669',
                  }}
                >
                  {totals.ip}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#d97706',
                  }}
                >
                  {totals.op}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#dc2626',
                    fontSize: '14px',
                  }}
                >
                  {totals.total}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#3b82f6',
                    fontSize: '14px',
                  }}
                >
                  {totals.total}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{
          marginTop: '30px',
          padding: '15px',
          textAlign: 'center',
          borderTop: '1px solid #e5e7eb',
          fontSize: '11px',
          color: '#6b7280'
        }}>
          <p>Generated on: {new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}</p>
          <p>This is a computer generated report. No signature required.</p>
        </div>
      </div>
    </div>
  );
};


const MRIReportPrint = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedTests, setGroupedTests] = useState([]);
  const [totals, setTotals] = useState({ ip: 0, op: 0, total: 0 });
  const [filteredTests, setFilteredTests] = useState([]);

  // Combine and process test data
  useEffect(() => {
    const allTests = [...Originalmri, ...Dummymri];
    const testMap = {};
    
    allTests.forEach(item => {
      const testName = item.Test_Name || 'Unknown Test';
      const registerType = item.RegisterType || 'OP';
      
      if (!testMap[testName]) {
        testMap[testName] = {
          testName,
          ipCount: 0,
          opCount: 0,
          total: 0
        };
      }
      
      if (registerType === 'IP') {
        testMap[testName].ipCount += 1;
      } else {
        testMap[testName].opCount += 1;
      }
      
      testMap[testName].total = testMap[testName].ipCount + testMap[testName].opCount;
    });
    
    // Convert to array and sort by test name
    const testArray = Object.values(testMap).sort((a, b) => 
      a.testName.localeCompare(b.testName)
    );
    
    // Calculate totals
    const ipTotal = testArray.reduce((sum, test) => sum + test.ipCount, 0);
    const opTotal = testArray.reduce((sum, test) => sum + test.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setGroupedTests(testArray);
    setFilteredTests(testArray);
    setTotals({ ip: ipTotal, op: opTotal, total: grandTotal });
  }, [Originalmri, Dummymri]);

  // Filter tests based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTests(groupedTests);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = groupedTests.filter(test =>
      test.testName.toLowerCase().includes(searchLower)
    );

    // Recalculate totals for filtered results
    const ipTotal = filtered.reduce((sum, test) => sum + test.ipCount, 0);
    const opTotal = filtered.reduce((sum, test) => sum + test.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setFilteredTests(filtered);
    setTotals({ ip: ipTotal, op: opTotal, total: grandTotal });
  }, [searchTerm, groupedTests]);

  // Format date based on search options
  const getDateRangeText = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (DateType === 'Particular' && ParticularDate) {
      return new Date(ParticularDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const to = new Date(ToDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return `${from} to ${to}`;
    }
    
    return new Date().toLocaleDateString('en-IN');
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `MRI_Report_${new Date().toISOString().split('T')[0]}`,
  });

  // Get current date for display
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Format date range for report header
  const reportDateRange = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return `Report Date: ${
        searchOptions.CurrentDate
          ? new Date(searchOptions.CurrentDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            }).replace(/\//g, '-')
          : 'N/A'
      }`;
    } else if (DateType === 'Particular' && ParticularDate) {
      return `Report Date: ${
        new Date(ParticularDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')
      }`;
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      const to = new Date(ToDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      return `Report From: ${from} To: ${to}`;
    }
    
    return `Report Date: ${currentDate}`;
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .report-container {
              font-size: 12px;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 250px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
          .stats-container {
            display: flex;
            gap: 15px;
            margin-top: 10px;
            flex-wrap: wrap;
          }
          .stat-card {
            padding: 8px 15px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            min-width: 120px;
          }
          .stat-label {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 2px;
          }
          .stat-value {
            font-size: 16px;
            font-weight: bold;
          }
        `}
      </style>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="testSearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search Test:
          </label>
          <input
            id="testSearch"
            type="text"
            className="search-input"
            placeholder="Search CT test names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="results-info">
          Showing {filteredTests.length} of {groupedTests.length} CT tests
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>

        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
            <div className="stat-label">Total Tests</div>
            <div className="stat-value">{filteredTests.length}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="stat-label">IP Cases</div>
            <div className="stat-value">{totals.ip}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
            <div className="stat-label">OP Cases</div>
            <div className="stat-value">{totals.op}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#ef4444' }}>
            <div className="stat-label">Grand Total</div>
            <div className="stat-value">{totals.total}</div>
          </div>
        </div>
      </div>

      <div
        className="Register_btn_con"
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}
      >
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrint}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Print Report
        </button>
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrintClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Close
        </button>
      </div>

      <div className="print-container report-container" ref={componentRef}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #dee2e6',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr>
              <td
                colSpan="5"
                style={{
                  border: 'none',
                  textAlign: 'center',
                  padding: '15px 0',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <div>
                  <h2
                    className="header-text"
                    style={{
                      margin: '0',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      letterSpacing: '0.5px',
                    }}
                  >
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h1
                    className="subheader-text"
                    style={{
                      margin: '5px 0 0',
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#7f8c8d',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Vilayodi, Chittur, Palakkad
                  </h1>
                  <h4
                    style={{
                      margin: '10px 0 0',
                      fontSize: '16px',
                      color: '#34495e',
                      fontWeight: 'bold',
                    }}
                  >
                    MRI SCAN REPORT
                  </h4>
                  <p
                    style={{
                      margin: '10px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    Clinical Material From {getDateRangeText()}
                  </p>
                  <p
                    style={{
                      margin: '5px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    {reportDateRange()}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                backgroundColor: '#3498db',
                color: 'white',
              }}
            >
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '10%'
              }}>
                S.No
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '50%'
              }}>
                Investigations
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '15%'
              }}>
                IP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '15%'
              }}>
                OP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '15%'
              }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.length > 0 ? (
              filteredTests.map((test, index) => (
                <tr
                  key={`test-${index}`}
                  style={{
                    fontSize: '12px',
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>
                    {index + 1}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'left', 
                    border: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>
                    {test.testName}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    color: '#059669',
                    fontWeight: '600'
                  }}>
                    {test.ipCount}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    color: '#d97706',
                    fontWeight: '600'
                  }}>
                    {test.opCount}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    color: '#dc2626',
                    fontWeight: 'bold',
                    backgroundColor: '#fef2f2'
                  }}>
                    {test.total}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    padding: '40px 15px',
                    textAlign: 'center',
                    color: '#6b7280',
                    border: '1px solid #dee2e6',
                    fontStyle: 'italic',
                  }}
                >
                  No MRI scan data found{searchTerm ? ` for "${searchTerm}"` : ''}
                </td>
              </tr>
            )}
            
            {/* Empty row for spacing */}
            <tr>
              <td colSpan="5" style={{ padding: '10px', border: 'none' }}></td>
            </tr>
            
            {/* Totals row */}
            {filteredTests.length > 0 && (
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                }}
              >
                <td
                  colSpan="2"
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#059669',
                  }}
                >
                  {totals.ip}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#d97706',
                  }}
                >
                  {totals.op}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#dc2626',
                    fontSize: '14px',
                  }}
                >
                  {totals.total}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        

        
      </div>
    </div>
  );
};

const SpecialtyMRIReportPrint = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedBySpecialty, setGroupedBySpecialty] = useState({});
  const [specialties, setSpecialties] = useState([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [totals, setTotals] = useState({ 
    ip: 0, 
    op: 0, 
    total: 0,
    specialtyCount: 0
  });

  // Combine and process test data by specialty
  useEffect(() => {
    const allTests = [...(Originalmri || []), ...(Dummymri || [])];
    
    // Create a map to group by specialty
    const specialtyMap = {};
    const allTestTypes = new Set();
    
    allTests.forEach(item => {
      const specialty = item.Speciality || 'UNSPECIFIED';
      const testName = item.Test_Name || 'Unknown Test';
      const registerType = item.RegisterType || 'OP';
      
      // Initialize specialty if not exists
      if (!specialtyMap[specialty]) {
        specialtyMap[specialty] = {
          specialtyName: specialty,
          tests: {},
          ipCount: 0,
          opCount: 0,
          total: 0
        };
      }
      
      // Initialize test type if not exists
      if (!specialtyMap[specialty].tests[testName]) {
        specialtyMap[specialty].tests[testName] = {
          testName: testName,
          ipCount: 0,
          opCount: 0,
          total: 0
        };
      }
      
      // Add to test counts
      if (registerType === 'IP') {
        specialtyMap[specialty].tests[testName].ipCount += 1;
        specialtyMap[specialty].ipCount += 1;
      } else {
        specialtyMap[specialty].tests[testName].opCount += 1;
        specialtyMap[specialty].opCount += 1;
      }
      
      specialtyMap[specialty].tests[testName].total = 
        specialtyMap[specialty].tests[testName].ipCount + 
        specialtyMap[specialty].tests[testName].opCount;
      
      specialtyMap[specialty].total = 
        specialtyMap[specialty].ipCount + 
        specialtyMap[specialty].opCount;
      
      allTestTypes.add(testName);
    });
    
    // Convert tests objects to arrays and sort
    const specialtiesArray = Object.values(specialtyMap).map(specialty => ({
      ...specialty,
      tests: Object.values(specialty.tests).sort((a, b) => 
        a.testName.localeCompare(b.testName)
      )
    }));
    
    // Sort specialties by name
    specialtiesArray.sort((a, b) => a.specialtyName.localeCompare(b.specialtyName));
    
    // Calculate overall totals
    const ipTotal = specialtiesArray.reduce((sum, spec) => sum + spec.ipCount, 0);
    const opTotal = specialtiesArray.reduce((sum, spec) => sum + spec.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setGroupedBySpecialty(specialtyMap);
    setSpecialties(specialtiesArray);
    setFilteredSpecialties(specialtiesArray);
    setTotals({ 
      ip: ipTotal, 
      op: opTotal, 
      total: grandTotal,
      specialtyCount: specialtiesArray.length
    });
  }, [Originalmri, Dummymri]);

  // Filter specialties and tests based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSpecialties(specialties);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    
    const filtered = specialties.map(specialty => {
      // Check if specialty name matches
      if (specialty.specialtyName.toLowerCase().includes(searchLower)) {
        return specialty;
      }
      
      // Filter tests within specialty
      const filteredTests = specialty.tests.filter(test =>
        test.testName.toLowerCase().includes(searchLower)
      );
      
      if (filteredTests.length > 0) {
        // Recalculate counts for filtered tests
        const ipCount = filteredTests.reduce((sum, test) => sum + test.ipCount, 0);
        const opCount = filteredTests.reduce((sum, test) => sum + test.opCount, 0);
        
        return {
          ...specialty,
          tests: filteredTests,
          ipCount,
          opCount,
          total: ipCount + opCount
        };
      }
      
      return null;
    }).filter(specialty => specialty !== null);

    // Recalculate overall totals for filtered results
    const ipTotal = filtered.reduce((sum, spec) => sum + spec.ipCount, 0);
    const opTotal = filtered.reduce((sum, spec) => sum + spec.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setFilteredSpecialties(filtered);
    setTotals({ 
      ip: ipTotal, 
      op: opTotal, 
      total: grandTotal,
      specialtyCount: filtered.length
    });
  }, [searchTerm, specialties]);

  // Format date based on search options
  const getDateRangeText = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (DateType === 'Particular' && ParticularDate) {
      return new Date(ParticularDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const to = new Date(ToDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return `${from} to ${to}`;
    }
    
    return new Date().toLocaleDateString('en-IN');
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Specialty_CT_Report_${new Date().toISOString().split('T')[0]}`,
  });

  // Format date range for report header
  const reportDateRange = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return `Report Date: ${
        searchOptions.CurrentDate
          ? new Date(searchOptions.CurrentDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            }).replace(/\//g, '-')
          : 'N/A'
      }`;
    } else if (DateType === 'Particular' && ParticularDate) {
      return `Report Date: ${
        new Date(ParticularDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')
      }`;
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      const to = new Date(ToDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      return `Report From: ${from} To: ${to}`;
    }
    
    return `Report Date: ${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}`;
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .specialty-section {
              page-break-inside: avoid;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .report-container {
              font-size: 11px;
            }
            .specialty-header {
              background-color: #f0f0f0 !important;
              -webkit-print-color-adjust: exact;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 300px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
          .stats-container {
            display: flex;
            gap: 15px;
            margin-top: 10px;
            flex-wrap: wrap;
          }
          .stat-card {
            padding: 8px 15px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            min-width: 120px;
          }
          .stat-label {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 2px;
          }
          .stat-value {
            font-size: 16px;
            font-weight: bold;
          }
          .specialty-header {
            background-color: #4f46e5;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          .specialty-header:hover {
            background-color: #4338ca;
          }
          .specialty-header td {
            position: relative;
            padding-right: 30px;
          }
          .specialty-header .arrow {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            transition: transform 0.3s;
          }
          .collapsed .arrow {
            transform: translateY(-50%) rotate(-90deg);
          }
        `}
      </style>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="specialtySearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search:
          </label>
          <input
            id="specialtySearch"
            type="text"
            className="search-input"
            placeholder="Search specialty or test name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="results-info">
          Showing {filteredSpecialties.length} of {specialties.length} specialties
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>

        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
            <div className="stat-label">Specialties</div>
            <div className="stat-value">{totals.specialtyCount}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="stat-label">IP Cases</div>
            <div className="stat-value">{totals.ip}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
            <div className="stat-label">OP Cases</div>
            <div className="stat-value">{totals.op}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#ef4444' }}>
            <div className="stat-label">Grand Total</div>
            <div className="stat-value">{totals.total}</div>
          </div>
        </div>
      </div>

      <div
        className="Register_btn_con"
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}
      >
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrint}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Print Report
        </button>
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrintClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Close
        </button>
      </div>

      <div className="print-container report-container" ref={componentRef}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #dee2e6',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr>
              <td
                colSpan="6"
                style={{
                  border: 'none',
                  textAlign: 'center',
                  padding: '15px 0',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <div>
                  <h2
                    className="header-text"
                    style={{
                      margin: '0',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      letterSpacing: '0.5px',
                    }}
                  >
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h1
                    className="subheader-text"
                    style={{
                      margin: '5px 0 0',
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#7f8c8d',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Vilayodi, Chittur, Palakkad
                  </h1>
                  <h4
                    style={{
                      margin: '10px 0 0',
                      fontSize: '16px',
                      color: '#34495e',
                      fontWeight: 'bold',
                    }}
                  >
                    MRI SCAN REPORT - SPECIALTY WISE
                  </h4>
                  <p
                    style={{
                      margin: '10px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    Clinical Material From {getDateRangeText()}
                  </p>
                  <p
                    style={{
                      margin: '5px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    {reportDateRange()}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                backgroundColor: '#3498db',
                color: 'white',
              }}
            >
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '5%'
              }}>
                S.No
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '45%'
              }}>
                Investigations
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '12%'
              }}>
                IP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '12%'
              }}>
                OP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '12%'
              }}>
                Total
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '14%'
              }}>
                Specialty Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSpecialties.length > 0 ? (
              filteredSpecialties.map((specialty, specIndex) => (
                <React.Fragment key={`specialty-${specIndex}`}>
                  {/* Specialty Header Row */}
                  <tr className="specialty-header">
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      fontSize: '13px'
                    }}>
                      {specIndex + 1}
                    </td>
                    <td colSpan="4" style={{ 
                      padding: '10px', 
                      textAlign: 'left', 
                      border: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {specialty.specialtyName}
                      <span className="arrow">▼</span>
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      backgroundColor: '#4338ca'
                    }}>
                      {specialty.total}
                    </td>
                  </tr>
                  
                  {/* Tests within specialty */}
                  {specialty.tests.map((test, testIndex) => (
                    <tr
                      key={`test-${specIndex}-${testIndex}`}
                      style={{
                        fontSize: '11px',
                        backgroundColor: testIndex % 2 === 0 ? '#f8f9fa' : 'white',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        fontWeight: '500'
                      }}>
                        {specIndex + 1}.{testIndex + 1}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'left', 
                        border: '1px solid #dee2e6',
                        fontWeight: '500',
                        paddingLeft: '20px'
                      }}>
                        {test.testName}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#059669',
                        fontWeight: '600'
                      }}>
                        {test.ipCount}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#d97706',
                        fontWeight: '600'
                      }}>
                        {test.opCount}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#dc2626',
                        fontWeight: '600'
                      }}>
                        {test.total}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        backgroundColor: '#f3f4f6',
                        fontWeight: '500'
                      }}>
                        {/* Empty for test rows */}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Specialty Totals Row */}
                  <tr
                    style={{
                      fontWeight: 'bold',
                      fontSize: '12px',
                      backgroundColor: '#e5e7eb',
                      borderTop: '2px solid #9ca3af'
                    }}
                  >
                    <td colSpan="2" style={{ 
                      padding: '10px', 
                      textAlign: 'right', 
                      border: '1px solid #dee2e6',
                      fontWeight: '600'
                    }}>
                      {specialty.specialtyName} Total
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      color: '#059669',
                      backgroundColor: '#d1fae5'
                    }}>
                      {specialty.ipCount}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      color: '#d97706',
                      backgroundColor: '#fef3c7'
                    }}>
                      {specialty.opCount}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      color: '#dc2626',
                      backgroundColor: '#fee2e2',
                      fontWeight: 'bold'
                    }}>
                      {specialty.total}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      backgroundColor: '#dbeafe',
                      fontWeight: 'bold'
                    }}>
                      {specialty.total}
                    </td>
                  </tr>
                  
                  {/* Empty row for spacing between specialties */}
                  <tr>
                    <td colSpan="6" style={{ padding: '5px', border: 'none' }}></td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: '40px 15px',
                    textAlign: 'center',
                    color: '#6b7280',
                    border: '1px solid #dee2e6',
                    fontStyle: 'italic',
                  }}
                >
                  No CT scan data found{searchTerm ? ` for "${searchTerm}"` : ''}
                </td>
              </tr>
            )}
            
            {/* Grand Totals Row */}
            {filteredSpecialties.length > 0 && (
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                  borderTop: '3px solid #3498db'
                }}
              >
                <td
                  colSpan="2"
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL ({totals.specialtyCount} Specialties)
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#059669',
                  }}
                >
                  {totals.ip}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#d97706',
                  }}
                >
                  {totals.op}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#dc2626',
                    fontSize: '14px',
                  }}
                >
                  {totals.total}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#3b82f6',
                    fontSize: '14px',
                  }}
                >
                  {totals.total}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{
          marginTop: '30px',
          padding: '15px',
          textAlign: 'center',
          borderTop: '1px solid #e5e7eb',
          fontSize: '11px',
          color: '#6b7280'
        }}>
          <p>Generated on: {new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}</p>
          <p>This is a computer generated report. No signature required.</p>
        </div>
      </div>
    </div>
  );
};

const USGReportPrint = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedTests, setGroupedTests] = useState([]);
  const [totals, setTotals] = useState({ ip: 0, op: 0, total: 0 });
  const [filteredTests, setFilteredTests] = useState([]);

  // Combine and process test data
  useEffect(() => {
    const allTests = [...Originalusg, ...Dummyusg];
    const testMap = {};
    
    allTests.forEach(item => {
      const testName = item.Test_Name || 'Unknown Test';
      const registerType = item.RegisterType || 'OP';
      
      if (!testMap[testName]) {
        testMap[testName] = {
          testName,
          ipCount: 0,
          opCount: 0,
          total: 0
        };
      }
      
      if (registerType === 'IP') {
        testMap[testName].ipCount += 1;
      } else {
        testMap[testName].opCount += 1;
      }
      
      testMap[testName].total = testMap[testName].ipCount + testMap[testName].opCount;
    });
    
    // Convert to array and sort by test name
    const testArray = Object.values(testMap).sort((a, b) => 
      a.testName.localeCompare(b.testName)
    );
    
    // Calculate totals
    const ipTotal = testArray.reduce((sum, test) => sum + test.ipCount, 0);
    const opTotal = testArray.reduce((sum, test) => sum + test.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setGroupedTests(testArray);
    setFilteredTests(testArray);
    setTotals({ ip: ipTotal, op: opTotal, total: grandTotal });
  }, [Originalusg, Dummyusg]);

  // Filter tests based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTests(groupedTests);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = groupedTests.filter(test =>
      test.testName.toLowerCase().includes(searchLower)
    );

    // Recalculate totals for filtered results
    const ipTotal = filtered.reduce((sum, test) => sum + test.ipCount, 0);
    const opTotal = filtered.reduce((sum, test) => sum + test.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setFilteredTests(filtered);
    setTotals({ ip: ipTotal, op: opTotal, total: grandTotal });
  }, [searchTerm, groupedTests]);

  // Format date based on search options
  const getDateRangeText = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (DateType === 'Particular' && ParticularDate) {
      return new Date(ParticularDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const to = new Date(ToDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return `${from} to ${to}`;
    }
    
    return new Date().toLocaleDateString('en-IN');
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `USG_Report_${new Date().toISOString().split('T')[0]}`,
  });

  // Get current date for display
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Format date range for report header
  const reportDateRange = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return `Report Date: ${
        searchOptions.CurrentDate
          ? new Date(searchOptions.CurrentDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            }).replace(/\//g, '-')
          : 'N/A'
      }`;
    } else if (DateType === 'Particular' && ParticularDate) {
      return `Report Date: ${
        new Date(ParticularDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')
      }`;
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      const to = new Date(ToDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      return `Report From: ${from} To: ${to}`;
    }
    
    return `Report Date: ${currentDate}`;
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .report-container {
              font-size: 12px;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 250px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
          .stats-container {
            display: flex;
            gap: 15px;
            margin-top: 10px;
            flex-wrap: wrap;
          }
          .stat-card {
            padding: 8px 15px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            min-width: 120px;
          }
          .stat-label {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 2px;
          }
          .stat-value {
            font-size: 16px;
            font-weight: bold;
          }
        `}
      </style>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="testSearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search Test:
          </label>
          <input
            id="testSearch"
            type="text"
            className="search-input"
            placeholder="Search CT test names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="results-info">
          Showing {filteredTests.length} of {groupedTests.length} CT tests
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>

        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
            <div className="stat-label">Total Tests</div>
            <div className="stat-value">{filteredTests.length}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="stat-label">IP Cases</div>
            <div className="stat-value">{totals.ip}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
            <div className="stat-label">OP Cases</div>
            <div className="stat-value">{totals.op}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#ef4444' }}>
            <div className="stat-label">Grand Total</div>
            <div className="stat-value">{totals.total}</div>
          </div>
        </div>
      </div>

      <div
        className="Register_btn_con"
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}
      >
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrint}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Print Report
        </button>
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrintClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Close
        </button>
      </div>

      <div className="print-container report-container" ref={componentRef}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #dee2e6',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr>
              <td
                colSpan="5"
                style={{
                  border: 'none',
                  textAlign: 'center',
                  padding: '15px 0',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <div>
                  <h2
                    className="header-text"
                    style={{
                      margin: '0',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      letterSpacing: '0.5px',
                    }}
                  >
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h1
                    className="subheader-text"
                    style={{
                      margin: '5px 0 0',
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#7f8c8d',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Vilayodi, Chittur, Palakkad
                  </h1>
                  <h4
                    style={{
                      margin: '10px 0 0',
                      fontSize: '16px',
                      color: '#34495e',
                      fontWeight: 'bold',
                    }}
                  >
                    USG SCAN REPORT
                  </h4>
                  <p
                    style={{
                      margin: '10px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    Clinical Material From {getDateRangeText()}
                  </p>
                  <p
                    style={{
                      margin: '5px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    {reportDateRange()}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                backgroundColor: '#3498db',
                color: 'white',
              }}
            >
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '10%'
              }}>
                S.No
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '50%'
              }}>
                Investigations
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '15%'
              }}>
                IP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '15%'
              }}>
                OP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '15%'
              }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.length > 0 ? (
              filteredTests.map((test, index) => (
                <tr
                  key={`test-${index}`}
                  style={{
                    fontSize: '12px',
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>
                    {index + 1}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'left', 
                    border: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>
                    {test.testName}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    color: '#059669',
                    fontWeight: '600'
                  }}>
                    {test.ipCount}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    color: '#d97706',
                    fontWeight: '600'
                  }}>
                    {test.opCount}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    color: '#dc2626',
                    fontWeight: 'bold',
                    backgroundColor: '#fef2f2'
                  }}>
                    {test.total}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    padding: '40px 15px',
                    textAlign: 'center',
                    color: '#6b7280',
                    border: '1px solid #dee2e6',
                    fontStyle: 'italic',
                  }}
                >
                  No USG scan data found{searchTerm ? ` for "${searchTerm}"` : ''}
                </td>
              </tr>
            )}
            
            {/* Empty row for spacing */}
            <tr>
              <td colSpan="5" style={{ padding: '10px', border: 'none' }}></td>
            </tr>
            
            {/* Totals row */}
            {filteredTests.length > 0 && (
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                }}
              >
                <td
                  colSpan="2"
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#059669',
                  }}
                >
                  {totals.ip}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#d97706',
                  }}
                >
                  {totals.op}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#dc2626',
                    fontSize: '14px',
                  }}
                >
                  {totals.total}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        

        
      </div>
    </div>
  );
};

const SpecialtyUSGReportPrint = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedBySpecialty, setGroupedBySpecialty] = useState({});
  const [specialties, setSpecialties] = useState([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [totals, setTotals] = useState({ 
    ip: 0, 
    op: 0, 
    total: 0,
    specialtyCount: 0
  });

  // Combine and process test data by specialty
  useEffect(() => {
    const allTests = [...(Originalusg || []), ...(Dummyusg || [])];
    
    // Create a map to group by specialty
    const specialtyMap = {};
    const allTestTypes = new Set();
    
    allTests.forEach(item => {
      const specialty = item.Speciality || 'UNSPECIFIED';
      const testName = item.Test_Name || 'Unknown Test';
      const registerType = item.RegisterType || 'OP';
      
      // Initialize specialty if not exists
      if (!specialtyMap[specialty]) {
        specialtyMap[specialty] = {
          specialtyName: specialty,
          tests: {},
          ipCount: 0,
          opCount: 0,
          total: 0
        };
      }
      
      // Initialize test type if not exists
      if (!specialtyMap[specialty].tests[testName]) {
        specialtyMap[specialty].tests[testName] = {
          testName: testName,
          ipCount: 0,
          opCount: 0,
          total: 0
        };
      }
      
      // Add to test counts
      if (registerType === 'IP') {
        specialtyMap[specialty].tests[testName].ipCount += 1;
        specialtyMap[specialty].ipCount += 1;
      } else {
        specialtyMap[specialty].tests[testName].opCount += 1;
        specialtyMap[specialty].opCount += 1;
      }
      
      specialtyMap[specialty].tests[testName].total = 
        specialtyMap[specialty].tests[testName].ipCount + 
        specialtyMap[specialty].tests[testName].opCount;
      
      specialtyMap[specialty].total = 
        specialtyMap[specialty].ipCount + 
        specialtyMap[specialty].opCount;
      
      allTestTypes.add(testName);
    });
    
    // Convert tests objects to arrays and sort
    const specialtiesArray = Object.values(specialtyMap).map(specialty => ({
      ...specialty,
      tests: Object.values(specialty.tests).sort((a, b) => 
        a.testName.localeCompare(b.testName)
      )
    }));
    
    // Sort specialties by name
    specialtiesArray.sort((a, b) => a.specialtyName.localeCompare(b.specialtyName));
    
    // Calculate overall totals
    const ipTotal = specialtiesArray.reduce((sum, spec) => sum + spec.ipCount, 0);
    const opTotal = specialtiesArray.reduce((sum, spec) => sum + spec.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setGroupedBySpecialty(specialtyMap);
    setSpecialties(specialtiesArray);
    setFilteredSpecialties(specialtiesArray);
    setTotals({ 
      ip: ipTotal, 
      op: opTotal, 
      total: grandTotal,
      specialtyCount: specialtiesArray.length
    });
  }, [Originalusg, Dummyusg]);

  // Filter specialties and tests based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSpecialties(specialties);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    
    const filtered = specialties.map(specialty => {
      // Check if specialty name matches
      if (specialty.specialtyName.toLowerCase().includes(searchLower)) {
        return specialty;
      }
      
      // Filter tests within specialty
      const filteredTests = specialty.tests.filter(test =>
        test.testName.toLowerCase().includes(searchLower)
      );
      
      if (filteredTests.length > 0) {
        // Recalculate counts for filtered tests
        const ipCount = filteredTests.reduce((sum, test) => sum + test.ipCount, 0);
        const opCount = filteredTests.reduce((sum, test) => sum + test.opCount, 0);
        
        return {
          ...specialty,
          tests: filteredTests,
          ipCount,
          opCount,
          total: ipCount + opCount
        };
      }
      
      return null;
    }).filter(specialty => specialty !== null);

    // Recalculate overall totals for filtered results
    const ipTotal = filtered.reduce((sum, spec) => sum + spec.ipCount, 0);
    const opTotal = filtered.reduce((sum, spec) => sum + spec.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setFilteredSpecialties(filtered);
    setTotals({ 
      ip: ipTotal, 
      op: opTotal, 
      total: grandTotal,
      specialtyCount: filtered.length
    });
  }, [searchTerm, specialties]);

  // Format date based on search options
  const getDateRangeText = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (DateType === 'Particular' && ParticularDate) {
      return new Date(ParticularDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const to = new Date(ToDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return `${from} to ${to}`;
    }
    
    return new Date().toLocaleDateString('en-IN');
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Specialty_CT_Report_${new Date().toISOString().split('T')[0]}`,
  });

  // Format date range for report header
  const reportDateRange = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return `Report Date: ${
        searchOptions.CurrentDate
          ? new Date(searchOptions.CurrentDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            }).replace(/\//g, '-')
          : 'N/A'
      }`;
    } else if (DateType === 'Particular' && ParticularDate) {
      return `Report Date: ${
        new Date(ParticularDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')
      }`;
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      const to = new Date(ToDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      return `Report From: ${from} To: ${to}`;
    }
    
    return `Report Date: ${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}`;
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .specialty-section {
              page-break-inside: avoid;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .report-container {
              font-size: 11px;
            }
            .specialty-header {
              background-color: #f0f0f0 !important;
              -webkit-print-color-adjust: exact;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 300px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
          .stats-container {
            display: flex;
            gap: 15px;
            margin-top: 10px;
            flex-wrap: wrap;
          }
          .stat-card {
            padding: 8px 15px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            min-width: 120px;
          }
          .stat-label {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 2px;
          }
          .stat-value {
            font-size: 16px;
            font-weight: bold;
          }
          .specialty-header {
            background-color: #4f46e5;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          .specialty-header:hover {
            background-color: #4338ca;
          }
          .specialty-header td {
            position: relative;
            padding-right: 30px;
          }
          .specialty-header .arrow {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            transition: transform 0.3s;
          }
          .collapsed .arrow {
            transform: translateY(-50%) rotate(-90deg);
          }
        `}
      </style>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="specialtySearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search:
          </label>
          <input
            id="specialtySearch"
            type="text"
            className="search-input"
            placeholder="Search specialty or test name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="results-info">
          Showing {filteredSpecialties.length} of {specialties.length} specialties
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>

        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
            <div className="stat-label">Specialties</div>
            <div className="stat-value">{totals.specialtyCount}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="stat-label">IP Cases</div>
            <div className="stat-value">{totals.ip}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
            <div className="stat-label">OP Cases</div>
            <div className="stat-value">{totals.op}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#ef4444' }}>
            <div className="stat-label">Grand Total</div>
            <div className="stat-value">{totals.total}</div>
          </div>
        </div>
      </div>

      <div
        className="Register_btn_con"
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}
      >
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrint}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Print Report
        </button>
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrintClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Close
        </button>
      </div>

      <div className="print-container report-container" ref={componentRef}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #dee2e6',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr>
              <td
                colSpan="6"
                style={{
                  border: 'none',
                  textAlign: 'center',
                  padding: '15px 0',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <div>
                  <h2
                    className="header-text"
                    style={{
                      margin: '0',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      letterSpacing: '0.5px',
                    }}
                  >
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h1
                    className="subheader-text"
                    style={{
                      margin: '5px 0 0',
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#7f8c8d',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Vilayodi, Chittur, Palakkad
                  </h1>
                  <h4
                    style={{
                      margin: '10px 0 0',
                      fontSize: '16px',
                      color: '#34495e',
                      fontWeight: 'bold',
                    }}
                  >
                    USG SCAN REPORT - SPECIALTY WISE
                  </h4>
                  <p
                    style={{
                      margin: '10px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    Clinical Material From {getDateRangeText()}
                  </p>
                  <p
                    style={{
                      margin: '5px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    {reportDateRange()}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                backgroundColor: '#3498db',
                color: 'white',
              }}
            >
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '5%'
              }}>
                S.No
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '45%'
              }}>
                Investigations
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '12%'
              }}>
                IP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '12%'
              }}>
                OP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '12%'
              }}>
                Total
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '14%'
              }}>
                Specialty Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSpecialties.length > 0 ? (
              filteredSpecialties.map((specialty, specIndex) => (
                <React.Fragment key={`specialty-${specIndex}`}>
                  {/* Specialty Header Row */}
                  <tr className="specialty-header">
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      fontSize: '13px'
                    }}>
                      {specIndex + 1}
                    </td>
                    <td colSpan="4" style={{ 
                      padding: '10px', 
                      textAlign: 'left', 
                      border: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {specialty.specialtyName}
                      <span className="arrow">▼</span>
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      backgroundColor: '#4338ca'
                    }}>
                      {specialty.total}
                    </td>
                  </tr>
                  
                  {/* Tests within specialty */}
                  {specialty.tests.map((test, testIndex) => (
                    <tr
                      key={`test-${specIndex}-${testIndex}`}
                      style={{
                        fontSize: '11px',
                        backgroundColor: testIndex % 2 === 0 ? '#f8f9fa' : 'white',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        fontWeight: '500'
                      }}>
                        {specIndex + 1}.{testIndex + 1}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'left', 
                        border: '1px solid #dee2e6',
                        fontWeight: '500',
                        paddingLeft: '20px'
                      }}>
                        {test.testName}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#059669',
                        fontWeight: '600'
                      }}>
                        {test.ipCount}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#d97706',
                        fontWeight: '600'
                      }}>
                        {test.opCount}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#dc2626',
                        fontWeight: '600'
                      }}>
                        {test.total}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        backgroundColor: '#f3f4f6',
                        fontWeight: '500'
                      }}>
                        {/* Empty for test rows */}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Specialty Totals Row */}
                  <tr
                    style={{
                      fontWeight: 'bold',
                      fontSize: '12px',
                      backgroundColor: '#e5e7eb',
                      borderTop: '2px solid #9ca3af'
                    }}
                  >
                    <td colSpan="2" style={{ 
                      padding: '10px', 
                      textAlign: 'right', 
                      border: '1px solid #dee2e6',
                      fontWeight: '600'
                    }}>
                      {specialty.specialtyName} Total
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      color: '#059669',
                      backgroundColor: '#d1fae5'
                    }}>
                      {specialty.ipCount}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      color: '#d97706',
                      backgroundColor: '#fef3c7'
                    }}>
                      {specialty.opCount}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      color: '#dc2626',
                      backgroundColor: '#fee2e2',
                      fontWeight: 'bold'
                    }}>
                      {specialty.total}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      backgroundColor: '#dbeafe',
                      fontWeight: 'bold'
                    }}>
                      {specialty.total}
                    </td>
                  </tr>
                  
                  {/* Empty row for spacing between specialties */}
                  <tr>
                    <td colSpan="6" style={{ padding: '5px', border: 'none' }}></td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: '40px 15px',
                    textAlign: 'center',
                    color: '#6b7280',
                    border: '1px solid #dee2e6',
                    fontStyle: 'italic',
                  }}
                >
                  No CT scan data found{searchTerm ? ` for "${searchTerm}"` : ''}
                </td>
              </tr>
            )}
            
            {/* Grand Totals Row */}
            {filteredSpecialties.length > 0 && (
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                  borderTop: '3px solid #3498db'
                }}
              >
                <td
                  colSpan="2"
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL ({totals.specialtyCount} Specialties)
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#059669',
                  }}
                >
                  {totals.ip}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#d97706',
                  }}
                >
                  {totals.op}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#dc2626',
                    fontSize: '14px',
                  }}
                >
                  {totals.total}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#3b82f6',
                    fontSize: '14px',
                  }}
                >
                  {totals.total}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{
          marginTop: '30px',
          padding: '15px',
          textAlign: 'center',
          borderTop: '1px solid #e5e7eb',
          fontSize: '11px',
          color: '#6b7280'
        }}>
          <p>Generated on: {new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}</p>
          <p>This is a computer generated report. No signature required.</p>
        </div>
      </div>
    </div>
  );
};

const XRAYReportPrint = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedTests, setGroupedTests] = useState([]);
  const [totals, setTotals] = useState({ ip: 0, op: 0, total: 0 });
  const [filteredTests, setFilteredTests] = useState([]);

  // Combine and process test data
  useEffect(() => {
    const allTests = [...Originalxray, ...Dummyxray];
    const testMap = {};
    
    allTests.forEach(item => {
      const testName = item.Test_Name || 'Unknown Test';
      const registerType = item.RegisterType || 'OP';
      
      if (!testMap[testName]) {
        testMap[testName] = {
          testName,
          ipCount: 0,
          opCount: 0,
          total: 0
        };
      }
      
      if (registerType === 'IP') {
        testMap[testName].ipCount += 1;
      } else {
        testMap[testName].opCount += 1;
      }
      
      testMap[testName].total = testMap[testName].ipCount + testMap[testName].opCount;
    });
    
    // Convert to array and sort by test name
    const testArray = Object.values(testMap).sort((a, b) => 
      a.testName.localeCompare(b.testName)
    );
    
    // Calculate totals
    const ipTotal = testArray.reduce((sum, test) => sum + test.ipCount, 0);
    const opTotal = testArray.reduce((sum, test) => sum + test.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setGroupedTests(testArray);
    setFilteredTests(testArray);
    setTotals({ ip: ipTotal, op: opTotal, total: grandTotal });
  }, [Originalxray, Dummyxray]);

  // Filter tests based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTests(groupedTests);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = groupedTests.filter(test =>
      test.testName.toLowerCase().includes(searchLower)
    );

    // Recalculate totals for filtered results
    const ipTotal = filtered.reduce((sum, test) => sum + test.ipCount, 0);
    const opTotal = filtered.reduce((sum, test) => sum + test.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setFilteredTests(filtered);
    setTotals({ ip: ipTotal, op: opTotal, total: grandTotal });
  }, [searchTerm, groupedTests]);

  // Format date based on search options
  const getDateRangeText = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (DateType === 'Particular' && ParticularDate) {
      return new Date(ParticularDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const to = new Date(ToDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return `${from} to ${to}`;
    }
    
    return new Date().toLocaleDateString('en-IN');
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `XRAY_Report_${new Date().toISOString().split('T')[0]}`,
  });

  // Get current date for display
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Format date range for report header
  const reportDateRange = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return `Report Date: ${
        searchOptions.CurrentDate
          ? new Date(searchOptions.CurrentDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            }).replace(/\//g, '-')
          : 'N/A'
      }`;
    } else if (DateType === 'Particular' && ParticularDate) {
      return `Report Date: ${
        new Date(ParticularDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')
      }`;
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      const to = new Date(ToDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      return `Report From: ${from} To: ${to}`;
    }
    
    return `Report Date: ${currentDate}`;
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .report-container {
              font-size: 12px;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 250px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
          .stats-container {
            display: flex;
            gap: 15px;
            margin-top: 10px;
            flex-wrap: wrap;
          }
          .stat-card {
            padding: 8px 15px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            min-width: 120px;
          }
          .stat-label {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 2px;
          }
          .stat-value {
            font-size: 16px;
            font-weight: bold;
          }
        `}
      </style>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="testSearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search Test:
          </label>
          <input
            id="testSearch"
            type="text"
            className="search-input"
            placeholder="Search CT test names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="results-info">
          Showing {filteredTests.length} of {groupedTests.length} CT tests
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>

        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
            <div className="stat-label">Total Tests</div>
            <div className="stat-value">{filteredTests.length}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="stat-label">IP Cases</div>
            <div className="stat-value">{totals.ip}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
            <div className="stat-label">OP Cases</div>
            <div className="stat-value">{totals.op}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#ef4444' }}>
            <div className="stat-label">Grand Total</div>
            <div className="stat-value">{totals.total}</div>
          </div>
        </div>
      </div>

      <div
        className="Register_btn_con"
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}
      >
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrint}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Print Report
        </button>
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrintClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Close
        </button>
      </div>

      <div className="print-container report-container" ref={componentRef}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #dee2e6',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr>
              <td
                colSpan="5"
                style={{
                  border: 'none',
                  textAlign: 'center',
                  padding: '15px 0',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <div>
                  <h2
                    className="header-text"
                    style={{
                      margin: '0',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      letterSpacing: '0.5px',
                    }}
                  >
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h1
                    className="subheader-text"
                    style={{
                      margin: '5px 0 0',
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#7f8c8d',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Vilayodi, Chittur, Palakkad
                  </h1>
                  <h4
                    style={{
                      margin: '10px 0 0',
                      fontSize: '16px',
                      color: '#34495e',
                      fontWeight: 'bold',
                    }}
                  >
                    XRAY SCAN REPORT
                  </h4>
                  <p
                    style={{
                      margin: '10px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    Clinical Material From {getDateRangeText()}
                  </p>
                  <p
                    style={{
                      margin: '5px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    {reportDateRange()}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                backgroundColor: '#3498db',
                color: 'white',
              }}
            >
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '10%'
              }}>
                S.No
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '50%'
              }}>
                Investigations
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '15%'
              }}>
                IP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '15%'
              }}>
                OP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '15%'
              }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.length > 0 ? (
              filteredTests.map((test, index) => (
                <tr
                  key={`test-${index}`}
                  style={{
                    fontSize: '12px',
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>
                    {index + 1}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'left', 
                    border: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>
                    {test.testName}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    color: '#059669',
                    fontWeight: '600'
                  }}>
                    {test.ipCount}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    color: '#d97706',
                    fontWeight: '600'
                  }}>
                    {test.opCount}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    color: '#dc2626',
                    fontWeight: 'bold',
                    backgroundColor: '#fef2f2'
                  }}>
                    {test.total}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    padding: '40px 15px',
                    textAlign: 'center',
                    color: '#6b7280',
                    border: '1px solid #dee2e6',
                    fontStyle: 'italic',
                  }}
                >
                  No XRAY scan data found{searchTerm ? ` for "${searchTerm}"` : ''}
                </td>
              </tr>
            )}
            
            {/* Empty row for spacing */}
            <tr>
              <td colSpan="5" style={{ padding: '10px', border: 'none' }}></td>
            </tr>
            
            {/* Totals row */}
            {filteredTests.length > 0 && (
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                }}
              >
                <td
                  colSpan="2"
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#059669',
                  }}
                >
                  {totals.ip}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#d97706',
                  }}
                >
                  {totals.op}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#dc2626',
                    fontSize: '14px',
                  }}
                >
                  {totals.total}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        

        
      </div>
    </div>
  );
};

const SpecialtyXRAYReportPrint = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedBySpecialty, setGroupedBySpecialty] = useState({});
  const [specialties, setSpecialties] = useState([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [totals, setTotals] = useState({ 
    ip: 0, 
    op: 0, 
    total: 0,
    specialtyCount: 0
  });

  useEffect(() => {
    const allTests = [...(Originalxray || []), ...(Dummyxray || [])];
    
    // Create a map to group by specialty
    const specialtyMap = {};
    const allTestTypes = new Set();
    
    allTests.forEach(item => {
      const specialty = item.Speciality || 'UNSPECIFIED';
      const testName = item.Test_Name || 'Unknown Test';
      const registerType = item.RegisterType || 'OP';
      
      // Initialize specialty if not exists
      if (!specialtyMap[specialty]) {
        specialtyMap[specialty] = {
          specialtyName: specialty,
          tests: {},
          ipCount: 0,
          opCount: 0,
          total: 0
        };
      }
      
      // Initialize test type if not exists
      if (!specialtyMap[specialty].tests[testName]) {
        specialtyMap[specialty].tests[testName] = {
          testName: testName,
          ipCount: 0,
          opCount: 0,
          total: 0
        };
      }
      
      // Add to test counts
      if (registerType === 'IP') {
        specialtyMap[specialty].tests[testName].ipCount += 1;
        specialtyMap[specialty].ipCount += 1;
      } else {
        specialtyMap[specialty].tests[testName].opCount += 1;
        specialtyMap[specialty].opCount += 1;
      }
      
      specialtyMap[specialty].tests[testName].total = 
        specialtyMap[specialty].tests[testName].ipCount + 
        specialtyMap[specialty].tests[testName].opCount;
      
      specialtyMap[specialty].total = 
        specialtyMap[specialty].ipCount + 
        specialtyMap[specialty].opCount;
      
      allTestTypes.add(testName);
    });
    
    // Convert tests objects to arrays and sort
    const specialtiesArray = Object.values(specialtyMap).map(specialty => ({
      ...specialty,
      tests: Object.values(specialty.tests).sort((a, b) => 
        a.testName.localeCompare(b.testName)
      )
    }));
    
    // Sort specialties by name
    specialtiesArray.sort((a, b) => a.specialtyName.localeCompare(b.specialtyName));
    
    // Calculate overall totals
    const ipTotal = specialtiesArray.reduce((sum, spec) => sum + spec.ipCount, 0);
    const opTotal = specialtiesArray.reduce((sum, spec) => sum + spec.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setGroupedBySpecialty(specialtyMap);
    setSpecialties(specialtiesArray);
    setFilteredSpecialties(specialtiesArray);
    setTotals({ 
      ip: ipTotal, 
      op: opTotal, 
      total: grandTotal,
      specialtyCount: specialtiesArray.length
    });
  }, [Originalxray, Dummyxray]);

  // Filter specialties and tests based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSpecialties(specialties);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    
    const filtered = specialties.map(specialty => {
      // Check if specialty name matches
      if (specialty.specialtyName.toLowerCase().includes(searchLower)) {
        return specialty;
      }
      
      // Filter tests within specialty
      const filteredTests = specialty.tests.filter(test =>
        test.testName.toLowerCase().includes(searchLower)
      );
      
      if (filteredTests.length > 0) {
        // Recalculate counts for filtered tests
        const ipCount = filteredTests.reduce((sum, test) => sum + test.ipCount, 0);
        const opCount = filteredTests.reduce((sum, test) => sum + test.opCount, 0);
        
        return {
          ...specialty,
          tests: filteredTests,
          ipCount,
          opCount,
          total: ipCount + opCount
        };
      }
      
      return null;
    }).filter(specialty => specialty !== null);

    // Recalculate overall totals for filtered results
    const ipTotal = filtered.reduce((sum, spec) => sum + spec.ipCount, 0);
    const opTotal = filtered.reduce((sum, spec) => sum + spec.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setFilteredSpecialties(filtered);
    setTotals({ 
      ip: ipTotal, 
      op: opTotal, 
      total: grandTotal,
      specialtyCount: filtered.length
    });
  }, [searchTerm, specialties]);

  // Format date based on search options
  const getDateRangeText = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (DateType === 'Particular' && ParticularDate) {
      return new Date(ParticularDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const to = new Date(ToDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return `${from} to ${to}`;
    }
    
    return new Date().toLocaleDateString('en-IN');
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Specialty_CT_Report_${new Date().toISOString().split('T')[0]}`,
  });

  // Format date range for report header
  const reportDateRange = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return `Report Date: ${
        searchOptions.CurrentDate
          ? new Date(searchOptions.CurrentDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            }).replace(/\//g, '-')
          : 'N/A'
      }`;
    } else if (DateType === 'Particular' && ParticularDate) {
      return `Report Date: ${
        new Date(ParticularDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')
      }`;
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      const to = new Date(ToDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      return `Report From: ${from} To: ${to}`;
    }
    
    return `Report Date: ${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}`;
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .specialty-section {
              page-break-inside: avoid;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .report-container {
              font-size: 11px;
            }
            .specialty-header {
              background-color: #f0f0f0 !important;
              -webkit-print-color-adjust: exact;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 300px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
          .stats-container {
            display: flex;
            gap: 15px;
            margin-top: 10px;
            flex-wrap: wrap;
          }
          .stat-card {
            padding: 8px 15px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            min-width: 120px;
          }
          .stat-label {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 2px;
          }
          .stat-value {
            font-size: 16px;
            font-weight: bold;
          }
          .specialty-header {
            background-color: #4f46e5;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          .specialty-header:hover {
            background-color: #4338ca;
          }
          .specialty-header td {
            position: relative;
            padding-right: 30px;
          }
          .specialty-header .arrow {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            transition: transform 0.3s;
          }
          .collapsed .arrow {
            transform: translateY(-50%) rotate(-90deg);
          }
        `}
      </style>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="specialtySearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search:
          </label>
          <input
            id="specialtySearch"
            type="text"
            className="search-input"
            placeholder="Search specialty or test name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="results-info">
          Showing {filteredSpecialties.length} of {specialties.length} specialties
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>

        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
            <div className="stat-label">Specialties</div>
            <div className="stat-value">{totals.specialtyCount}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="stat-label">IP Cases</div>
            <div className="stat-value">{totals.ip}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
            <div className="stat-label">OP Cases</div>
            <div className="stat-value">{totals.op}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#ef4444' }}>
            <div className="stat-label">Grand Total</div>
            <div className="stat-value">{totals.total}</div>
          </div>
        </div>
      </div>

      <div
        className="Register_btn_con"
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}
      >
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrint}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Print Report
        </button>
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrintClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Close
        </button>
      </div>

      <div className="print-container report-container" ref={componentRef}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #dee2e6',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr>
              <td
                colSpan="6"
                style={{
                  border: 'none',
                  textAlign: 'center',
                  padding: '15px 0',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <div>
                  <h2
                    className="header-text"
                    style={{
                      margin: '0',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      letterSpacing: '0.5px',
                    }}
                  >
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h1
                    className="subheader-text"
                    style={{
                      margin: '5px 0 0',
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#7f8c8d',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Vilayodi, Chittur, Palakkad
                  </h1>
                  <h4
                    style={{
                      margin: '10px 0 0',
                      fontSize: '16px',
                      color: '#34495e',
                      fontWeight: 'bold',
                    }}
                  >
                    XRAY SCAN REPORT - SPECIALTY WISE
                  </h4>
                  <p
                    style={{
                      margin: '10px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    Clinical Material From {getDateRangeText()}
                  </p>
                  <p
                    style={{
                      margin: '5px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    {reportDateRange()}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                backgroundColor: '#3498db',
                color: 'white',
              }}
            >
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '5%'
              }}>
                S.No
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '45%'
              }}>
                Investigations
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '12%'
              }}>
                IP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '12%'
              }}>
                OP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '12%'
              }}>
                Total
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '14%'
              }}>
                Specialty Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSpecialties.length > 0 ? (
              filteredSpecialties.map((specialty, specIndex) => (
                <React.Fragment key={`specialty-${specIndex}`}>
                  {/* Specialty Header Row */}
                  <tr className="specialty-header">
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      fontSize: '13px'
                    }}>
                      {specIndex + 1}
                    </td>
                    <td colSpan="4" style={{ 
                      padding: '10px', 
                      textAlign: 'left', 
                      border: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {specialty.specialtyName}
                      <span className="arrow">▼</span>
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      backgroundColor: '#4338ca'
                    }}>
                      {specialty.total}
                    </td>
                  </tr>
                  
                  {/* Tests within specialty */}
                  {specialty.tests.map((test, testIndex) => (
                    <tr
                      key={`test-${specIndex}-${testIndex}`}
                      style={{
                        fontSize: '11px',
                        backgroundColor: testIndex % 2 === 0 ? '#f8f9fa' : 'white',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        fontWeight: '500'
                      }}>
                        {specIndex + 1}.{testIndex + 1}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'left', 
                        border: '1px solid #dee2e6',
                        fontWeight: '500',
                        paddingLeft: '20px'
                      }}>
                        {test.testName}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#059669',
                        fontWeight: '600'
                      }}>
                        {test.ipCount}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#d97706',
                        fontWeight: '600'
                      }}>
                        {test.opCount}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#dc2626',
                        fontWeight: '600'
                      }}>
                        {test.total}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        backgroundColor: '#f3f4f6',
                        fontWeight: '500'
                      }}>
                        {/* Empty for test rows */}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Specialty Totals Row */}
                  <tr
                    style={{
                      fontWeight: 'bold',
                      fontSize: '12px',
                      backgroundColor: '#e5e7eb',
                      borderTop: '2px solid #9ca3af'
                    }}
                  >
                    <td colSpan="2" style={{ 
                      padding: '10px', 
                      textAlign: 'right', 
                      border: '1px solid #dee2e6',
                      fontWeight: '600'
                    }}>
                      {specialty.specialtyName} Total
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      color: '#059669',
                      backgroundColor: '#d1fae5'
                    }}>
                      {specialty.ipCount}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      color: '#d97706',
                      backgroundColor: '#fef3c7'
                    }}>
                      {specialty.opCount}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      color: '#dc2626',
                      backgroundColor: '#fee2e2',
                      fontWeight: 'bold'
                    }}>
                      {specialty.total}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      backgroundColor: '#dbeafe',
                      fontWeight: 'bold'
                    }}>
                      {specialty.total}
                    </td>
                  </tr>
                  
                  {/* Empty row for spacing between specialties */}
                  <tr>
                    <td colSpan="6" style={{ padding: '5px', border: 'none' }}></td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: '40px 15px',
                    textAlign: 'center',
                    color: '#6b7280',
                    border: '1px solid #dee2e6',
                    fontStyle: 'italic',
                  }}
                >
                  No CT scan data found{searchTerm ? ` for "${searchTerm}"` : ''}
                </td>
              </tr>
            )}
            
            {/* Grand Totals Row */}
            {filteredSpecialties.length > 0 && (
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                  borderTop: '3px solid #3498db'
                }}
              >
                <td
                  colSpan="2"
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL ({totals.specialtyCount} Specialties)
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#059669',
                  }}
                >
                  {totals.ip}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#d97706',
                  }}
                >
                  {totals.op}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#dc2626',
                    fontSize: '14px',
                  }}
                >
                  {totals.total}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#3b82f6',
                    fontSize: '14px',
                  }}
                >
                  {totals.total}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{
          marginTop: '30px',
          padding: '15px',
          textAlign: 'center',
          borderTop: '1px solid #e5e7eb',
          fontSize: '11px',
          color: '#6b7280'
        }}>
          <p>Generated on: {new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}</p>
          <p>This is a computer generated report. No signature required.</p>
        </div>
      </div>
    </div>
  );
};

const MAMMOGRAMReportPrint = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedTests, setGroupedTests] = useState([]);
  const [totals, setTotals] = useState({ ip: 0, op: 0, total: 0 });
  const [filteredTests, setFilteredTests] = useState([]);

  // Combine and process test data
  useEffect(() => {
    const allTests = [...Originalmammogram, ...Dummymammogram];
    const testMap = {};
    
    allTests.forEach(item => {
      const testName = item.Test_Name || 'Unknown Test';
      const registerType = item.RegisterType || 'OP';
      
      if (!testMap[testName]) {
        testMap[testName] = {
          testName,
          ipCount: 0,
          opCount: 0,
          total: 0
        };
      }
      
      if (registerType === 'IP') {
        testMap[testName].ipCount += 1;
      } else {
        testMap[testName].opCount += 1;
      }
      
      testMap[testName].total = testMap[testName].ipCount + testMap[testName].opCount;
    });
    
    // Convert to array and sort by test name
    const testArray = Object.values(testMap).sort((a, b) => 
      a.testName.localeCompare(b.testName)
    );
    
    // Calculate totals
    const ipTotal = testArray.reduce((sum, test) => sum + test.ipCount, 0);
    const opTotal = testArray.reduce((sum, test) => sum + test.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setGroupedTests(testArray);
    setFilteredTests(testArray);
    setTotals({ ip: ipTotal, op: opTotal, total: grandTotal });
  }, [Originalmammogram, Dummymammogram]);

  // Filter tests based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredTests(groupedTests);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = groupedTests.filter(test =>
      test.testName.toLowerCase().includes(searchLower)
    );

    // Recalculate totals for filtered results
    const ipTotal = filtered.reduce((sum, test) => sum + test.ipCount, 0);
    const opTotal = filtered.reduce((sum, test) => sum + test.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setFilteredTests(filtered);
    setTotals({ ip: ipTotal, op: opTotal, total: grandTotal });
  }, [searchTerm, groupedTests]);

  // Format date based on search options
  const getDateRangeText = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (DateType === 'Particular' && ParticularDate) {
      return new Date(ParticularDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const to = new Date(ToDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return `${from} to ${to}`;
    }
    
    return new Date().toLocaleDateString('en-IN');
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `MAMMOGRAM_Report_${new Date().toISOString().split('T')[0]}`,
  });

  // Get current date for display
  const currentDate = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });

  // Format date range for report header
  const reportDateRange = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return `Report Date: ${
        searchOptions.CurrentDate
          ? new Date(searchOptions.CurrentDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            }).replace(/\//g, '-')
          : 'N/A'
      }`;
    } else if (DateType === 'Particular' && ParticularDate) {
      return `Report Date: ${
        new Date(ParticularDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')
      }`;
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      const to = new Date(ToDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      return `Report From: ${from} To: ${to}`;
    }
    
    return `Report Date: ${currentDate}`;
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .report-container {
              font-size: 12px;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 250px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
          .stats-container {
            display: flex;
            gap: 15px;
            margin-top: 10px;
            flex-wrap: wrap;
          }
          .stat-card {
            padding: 8px 15px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            min-width: 120px;
          }
          .stat-label {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 2px;
          }
          .stat-value {
            font-size: 16px;
            font-weight: bold;
          }
        `}
      </style>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="testSearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search Test:
          </label>
          <input
            id="testSearch"
            type="text"
            className="search-input"
            placeholder="Search CT test names..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="results-info">
          Showing {filteredTests.length} of {groupedTests.length} CT tests
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>

        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
            <div className="stat-label">Total Tests</div>
            <div className="stat-value">{filteredTests.length}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="stat-label">IP Cases</div>
            <div className="stat-value">{totals.ip}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
            <div className="stat-label">OP Cases</div>
            <div className="stat-value">{totals.op}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#ef4444' }}>
            <div className="stat-label">Grand Total</div>
            <div className="stat-value">{totals.total}</div>
          </div>
        </div>
      </div>

      <div
        className="Register_btn_con"
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}
      >
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrint}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Print Report
        </button>
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrintClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Close
        </button>
      </div>

      <div className="print-container report-container" ref={componentRef}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #dee2e6',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr>
              <td
                colSpan="5"
                style={{
                  border: 'none',
                  textAlign: 'center',
                  padding: '15px 0',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <div>
                  <h2
                    className="header-text"
                    style={{
                      margin: '0',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      letterSpacing: '0.5px',
                    }}
                  >
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h1
                    className="subheader-text"
                    style={{
                      margin: '5px 0 0',
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#7f8c8d',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Vilayodi, Chittur, Palakkad
                  </h1>
                  <h4
                    style={{
                      margin: '10px 0 0',
                      fontSize: '16px',
                      color: '#34495e',
                      fontWeight: 'bold',
                    }}
                  >
                    MAMMOGRAM SCAN REPORT
                  </h4>
                  <p
                    style={{
                      margin: '10px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    Clinical Material From {getDateRangeText()}
                  </p>
                  <p
                    style={{
                      margin: '5px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    {reportDateRange()}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                backgroundColor: '#3498db',
                color: 'white',
              }}
            >
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '10%'
              }}>
                S.No
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '50%'
              }}>
                Investigations
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '15%'
              }}>
                IP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '15%'
              }}>
                OP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '15%'
              }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTests.length > 0 ? (
              filteredTests.map((test, index) => (
                <tr
                  key={`test-${index}`}
                  style={{
                    fontSize: '12px',
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>
                    {index + 1}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'left', 
                    border: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>
                    {test.testName}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    color: '#059669',
                    fontWeight: '600'
                  }}>
                    {test.ipCount}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    color: '#d97706',
                    fontWeight: '600'
                  }}>
                    {test.opCount}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    color: '#dc2626',
                    fontWeight: 'bold',
                    backgroundColor: '#fef2f2'
                  }}>
                    {test.total}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    padding: '40px 15px',
                    textAlign: 'center',
                    color: '#6b7280',
                    border: '1px solid #dee2e6',
                    fontStyle: 'italic',
                  }}
                >
                  No MAMMOGRAM scan data found{searchTerm ? ` for "${searchTerm}"` : ''}
                </td>
              </tr>
            )}
            
            {/* Empty row for spacing */}
            <tr>
              <td colSpan="5" style={{ padding: '10px', border: 'none' }}></td>
            </tr>
            
            {/* Totals row */}
            {filteredTests.length > 0 && (
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                }}
              >
                <td
                  colSpan="2"
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#059669',
                  }}
                >
                  {totals.ip}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#d97706',
                  }}
                >
                  {totals.op}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#dc2626',
                    fontSize: '14px',
                  }}
                >
                  {totals.total}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        

        
      </div>
    </div>
  );
};

const SpecialtyMAMMOGRAMReportPrint = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedBySpecialty, setGroupedBySpecialty] = useState({});
  const [specialties, setSpecialties] = useState([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [totals, setTotals] = useState({ 
    ip: 0, 
    op: 0, 
    total: 0,
    specialtyCount: 0
  });

  // Combine and process test data by specialty
  useEffect(() => {
    const allTests = [...(Originalusg || []), ...(Dummyusg || [])];
    
    // Create a map to group by specialty
    const specialtyMap = {};
    const allTestTypes = new Set();
    
    allTests.forEach(item => {
      const specialty = item.Speciality || 'UNSPECIFIED';
      const testName = item.Test_Name || 'Unknown Test';
      const registerType = item.RegisterType || 'OP';
      
      // Initialize specialty if not exists
      if (!specialtyMap[specialty]) {
        specialtyMap[specialty] = {
          specialtyName: specialty,
          tests: {},
          ipCount: 0,
          opCount: 0,
          total: 0
        };
      }
      
      // Initialize test type if not exists
      if (!specialtyMap[specialty].tests[testName]) {
        specialtyMap[specialty].tests[testName] = {
          testName: testName,
          ipCount: 0,
          opCount: 0,
          total: 0
        };
      }
      
      // Add to test counts
      if (registerType === 'IP') {
        specialtyMap[specialty].tests[testName].ipCount += 1;
        specialtyMap[specialty].ipCount += 1;
      } else {
        specialtyMap[specialty].tests[testName].opCount += 1;
        specialtyMap[specialty].opCount += 1;
      }
      
      specialtyMap[specialty].tests[testName].total = 
        specialtyMap[specialty].tests[testName].ipCount + 
        specialtyMap[specialty].tests[testName].opCount;
      
      specialtyMap[specialty].total = 
        specialtyMap[specialty].ipCount + 
        specialtyMap[specialty].opCount;
      
      allTestTypes.add(testName);
    });
    
    // Convert tests objects to arrays and sort
    const specialtiesArray = Object.values(specialtyMap).map(specialty => ({
      ...specialty,
      tests: Object.values(specialty.tests).sort((a, b) => 
        a.testName.localeCompare(b.testName)
      )
    }));
    
    // Sort specialties by name
    specialtiesArray.sort((a, b) => a.specialtyName.localeCompare(b.specialtyName));
    
    // Calculate overall totals
    const ipTotal = specialtiesArray.reduce((sum, spec) => sum + spec.ipCount, 0);
    const opTotal = specialtiesArray.reduce((sum, spec) => sum + spec.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setGroupedBySpecialty(specialtyMap);
    setSpecialties(specialtiesArray);
    setFilteredSpecialties(specialtiesArray);
    setTotals({ 
      ip: ipTotal, 
      op: opTotal, 
      total: grandTotal,
      specialtyCount: specialtiesArray.length
    });
  }, [Originalmammogram, Dummymammogram]);

  // Filter specialties and tests based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSpecialties(specialties);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    
    const filtered = specialties.map(specialty => {
      // Check if specialty name matches
      if (specialty.specialtyName.toLowerCase().includes(searchLower)) {
        return specialty;
      }
      
      // Filter tests within specialty
      const filteredTests = specialty.tests.filter(test =>
        test.testName.toLowerCase().includes(searchLower)
      );
      
      if (filteredTests.length > 0) {
        // Recalculate counts for filtered tests
        const ipCount = filteredTests.reduce((sum, test) => sum + test.ipCount, 0);
        const opCount = filteredTests.reduce((sum, test) => sum + test.opCount, 0);
        
        return {
          ...specialty,
          tests: filteredTests,
          ipCount,
          opCount,
          total: ipCount + opCount
        };
      }
      
      return null;
    }).filter(specialty => specialty !== null);

    // Recalculate overall totals for filtered results
    const ipTotal = filtered.reduce((sum, spec) => sum + spec.ipCount, 0);
    const opTotal = filtered.reduce((sum, spec) => sum + spec.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setFilteredSpecialties(filtered);
    setTotals({ 
      ip: ipTotal, 
      op: opTotal, 
      total: grandTotal,
      specialtyCount: filtered.length
    });
  }, [searchTerm, specialties]);

  // Format date based on search options
  const getDateRangeText = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (DateType === 'Particular' && ParticularDate) {
      return new Date(ParticularDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const to = new Date(ToDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return `${from} to ${to}`;
    }
    
    return new Date().toLocaleDateString('en-IN');
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Specialty_CT_Report_${new Date().toISOString().split('T')[0]}`,
  });

  // Format date range for report header
  const reportDateRange = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return `Report Date: ${
        searchOptions.CurrentDate
          ? new Date(searchOptions.CurrentDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            }).replace(/\//g, '-')
          : 'N/A'
      }`;
    } else if (DateType === 'Particular' && ParticularDate) {
      return `Report Date: ${
        new Date(ParticularDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')
      }`;
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      const to = new Date(ToDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      return `Report From: ${from} To: ${to}`;
    }
    
    return `Report Date: ${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}`;
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .specialty-section {
              page-break-inside: avoid;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .report-container {
              font-size: 11px;
            }
            .specialty-header {
              background-color: #f0f0f0 !important;
              -webkit-print-color-adjust: exact;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 300px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
          .stats-container {
            display: flex;
            gap: 15px;
            margin-top: 10px;
            flex-wrap: wrap;
          }
          .stat-card {
            padding: 8px 15px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            min-width: 120px;
          }
          .stat-label {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 2px;
          }
          .stat-value {
            font-size: 16px;
            font-weight: bold;
          }
          .specialty-header {
            background-color: #4f46e5;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          .specialty-header:hover {
            background-color: #4338ca;
          }
          .specialty-header td {
            position: relative;
            padding-right: 30px;
          }
          .specialty-header .arrow {
            position: absolute;
            right: 10px;
            top: 50%;
            transform: translateY(-50%);
            transition: transform 0.3s;
          }
          .collapsed .arrow {
            transform: translateY(-50%) rotate(-90deg);
          }
        `}
      </style>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="specialtySearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search:
          </label>
          <input
            id="specialtySearch"
            type="text"
            className="search-input"
            placeholder="Search specialty or test name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="results-info">
          Showing {filteredSpecialties.length} of {specialties.length} specialties
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>

        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
            <div className="stat-label">Specialties</div>
            <div className="stat-value">{totals.specialtyCount}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="stat-label">IP Cases</div>
            <div className="stat-value">{totals.ip}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
            <div className="stat-label">OP Cases</div>
            <div className="stat-value">{totals.op}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#ef4444' }}>
            <div className="stat-label">Grand Total</div>
            <div className="stat-value">{totals.total}</div>
          </div>
        </div>
      </div>

      <div
        className="Register_btn_con"
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}
      >
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrint}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Print Report
        </button>
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrintClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Close
        </button>
      </div>

      <div className="print-container report-container" ref={componentRef}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #dee2e6',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr>
              <td
                colSpan="6"
                style={{
                  border: 'none',
                  textAlign: 'center',
                  padding: '15px 0',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <div>
                  <h2
                    className="header-text"
                    style={{
                      margin: '0',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      letterSpacing: '0.5px',
                    }}
                  >
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h1
                    className="subheader-text"
                    style={{
                      margin: '5px 0 0',
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#7f8c8d',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Vilayodi, Chittur, Palakkad
                  </h1>
                  <h4
                    style={{
                      margin: '10px 0 0',
                      fontSize: '16px',
                      color: '#34495e',
                      fontWeight: 'bold',
                    }}
                  >
                    MAMMOGRAM SCAN REPORT - SPECIALTY WISE
                  </h4>
                  <p
                    style={{
                      margin: '10px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    Clinical Material From {getDateRangeText()}
                  </p>
                  <p
                    style={{
                      margin: '5px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    {reportDateRange()}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                backgroundColor: '#3498db',
                color: 'white',
              }}
            >
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '5%'
              }}>
                S.No
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '45%'
              }}>
                Investigations
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '12%'
              }}>
                IP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '12%'
              }}>
                OP
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '12%'
              }}>
                Total
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '14%'
              }}>
                Specialty Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSpecialties.length > 0 ? (
              filteredSpecialties.map((specialty, specIndex) => (
                <React.Fragment key={`specialty-${specIndex}`}>
                  {/* Specialty Header Row */}
                  <tr className="specialty-header">
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      fontSize: '13px'
                    }}>
                      {specIndex + 1}
                    </td>
                    <td colSpan="4" style={{ 
                      padding: '10px', 
                      textAlign: 'left', 
                      border: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {specialty.specialtyName}
                      <span className="arrow">▼</span>
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      backgroundColor: '#4338ca'
                    }}>
                      {specialty.total}
                    </td>
                  </tr>
                  
                  {/* Tests within specialty */}
                  {specialty.tests.map((test, testIndex) => (
                    <tr
                      key={`test-${specIndex}-${testIndex}`}
                      style={{
                        fontSize: '11px',
                        backgroundColor: testIndex % 2 === 0 ? '#f8f9fa' : 'white',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        fontWeight: '500'
                      }}>
                        {specIndex + 1}.{testIndex + 1}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'left', 
                        border: '1px solid #dee2e6',
                        fontWeight: '500',
                        paddingLeft: '20px'
                      }}>
                        {test.testName}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#059669',
                        fontWeight: '600'
                      }}>
                        {test.ipCount}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#d97706',
                        fontWeight: '600'
                      }}>
                        {test.opCount}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#dc2626',
                        fontWeight: '600'
                      }}>
                        {test.total}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        backgroundColor: '#f3f4f6',
                        fontWeight: '500'
                      }}>
                        {/* Empty for test rows */}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Specialty Totals Row */}
                  <tr
                    style={{
                      fontWeight: 'bold',
                      fontSize: '12px',
                      backgroundColor: '#e5e7eb',
                      borderTop: '2px solid #9ca3af'
                    }}
                  >
                    <td colSpan="2" style={{ 
                      padding: '10px', 
                      textAlign: 'right', 
                      border: '1px solid #dee2e6',
                      fontWeight: '600'
                    }}>
                      {specialty.specialtyName} Total
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      color: '#059669',
                      backgroundColor: '#d1fae5'
                    }}>
                      {specialty.ipCount}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      color: '#d97706',
                      backgroundColor: '#fef3c7'
                    }}>
                      {specialty.opCount}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      color: '#dc2626',
                      backgroundColor: '#fee2e2',
                      fontWeight: 'bold'
                    }}>
                      {specialty.total}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      backgroundColor: '#dbeafe',
                      fontWeight: 'bold'
                    }}>
                      {specialty.total}
                    </td>
                  </tr>
                  
                  {/* Empty row for spacing between specialties */}
                  <tr>
                    <td colSpan="6" style={{ padding: '5px', border: 'none' }}></td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: '40px 15px',
                    textAlign: 'center',
                    color: '#6b7280',
                    border: '1px solid #dee2e6',
                    fontStyle: 'italic',
                  }}
                >
                  No CT scan data found{searchTerm ? ` for "${searchTerm}"` : ''}
                </td>
              </tr>
            )}
            
            {/* Grand Totals Row */}
            {filteredSpecialties.length > 0 && (
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                  borderTop: '3px solid #3498db'
                }}
              >
                <td
                  colSpan="2"
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL ({totals.specialtyCount} Specialties)
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#059669',
                  }}
                >
                  {totals.ip}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#d97706',
                  }}
                >
                  {totals.op}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#dc2626',
                    fontSize: '14px',
                  }}
                >
                  {totals.total}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#3b82f6',
                    fontSize: '14px',
                  }}
                >
                  {totals.total}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{
          marginTop: '30px',
          padding: '15px',
          textAlign: 'center',
          borderTop: '1px solid #e5e7eb',
          fontSize: '11px',
          color: '#6b7280'
        }}>
          <p>Generated on: {new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}</p>
          <p>This is a computer generated report. No signature required.</p>
        </div>
      </div>
    </div>
  );
};



const OPIPWiseReportPrint = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedData, setGroupedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [totals, setTotals] = useState({ 
    ip: 0, 
    op: 0, 
    total: 0,
    grandTotalIP: 0,
    grandTotalOP: 0,
    grandTotal: 0
  });

  // Combine and process OP/IP data
  useEffect(() => {
    // Combine all OP data
    const allOPData = [...(opOriginalData || []), ...(opDummyData || [])];
    // Combine all IP data
    const allIPData = [...(ipOriginalData || []), ...(ipDummyData || [])];
    
    // Create a map to group by test/department/doctor (adjust based on your data structure)
    const dataMap = {};
    
    // Process OP Data
    allOPData.forEach(item => {
      const key = item.Test_Name || item.Department || item.DoctorName || 'UNKNOWN';
      if (!dataMap[key]) {
        dataMap[key] = {
          name: key,
          opCount: 0,
          ipCount: 0,
          total: 0
        };
      }
      dataMap[key].opCount += 1;
      dataMap[key].total = dataMap[key].opCount + dataMap[key].ipCount;
    });
    
    // Process IP Data
    allIPData.forEach(item => {
      const key = item.Test_Name || item.Department || item.DoctorName || 'UNKNOWN';
      if (!dataMap[key]) {
        dataMap[key] = {
          name: key,
          opCount: 0,
          ipCount: 0,
          total: 0
        };
      }
      dataMap[key].ipCount += 1;
      dataMap[key].total = dataMap[key].opCount + dataMap[key].ipCount;
    });
    
    // Convert to array and sort by name
    const dataArray = Object.values(dataMap).sort((a, b) => 
      a.name.localeCompare(b.name)
    );
    
    // Calculate totals
    const opTotal = dataArray.reduce((sum, item) => sum + item.opCount, 0);
    const ipTotal = dataArray.reduce((sum, item) => sum + item.ipCount, 0);
    const grandTotal = opTotal + ipTotal;
    
    setGroupedData(dataArray);
    setFilteredData(dataArray);
    setTotals({ 
      ip: ipTotal, 
      op: opTotal, 
      total: grandTotal,
      grandTotalIP: ipTotal,
      grandTotalOP: opTotal,
      grandTotal: grandTotal
    });
  }, [opDummyData, opOriginalData, ipDummyData, ipOriginalData]);

  // Filter data based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredData(groupedData);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    const filtered = groupedData.filter(item =>
      item.name.toLowerCase().includes(searchLower)
    );

    // Recalculate totals for filtered results
    const opTotal = filtered.reduce((sum, item) => sum + item.opCount, 0);
    const ipTotal = filtered.reduce((sum, item) => sum + item.ipCount, 0);
    const grandTotal = opTotal + ipTotal;
    
    setFilteredData(filtered);
    setTotals({ 
      ip: ipTotal, 
      op: opTotal, 
      total: grandTotal,
      grandTotalIP: ipTotal,
      grandTotalOP: opTotal,
      grandTotal: grandTotal
    });
  }, [searchTerm, groupedData]);

  // Format date based on search options
  const getDateRangeText = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (DateType === 'Particular' && ParticularDate) {
      return new Date(ParticularDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const to = new Date(ToDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return `${from} to ${to}`;
    }
    
    return new Date().toLocaleDateString('en-IN');
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `OP_IP_Report_${new Date().toISOString().split('T')[0]}`,
  });

  // Format date range for report header
  const reportDateRange = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return `Report Date: ${
        searchOptions.CurrentDate
          ? new Date(searchOptions.CurrentDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            }).replace(/\//g, '-')
          : 'N/A'
      }`;
    } else if (DateType === 'Particular' && ParticularDate) {
      return `Report Date: ${
        new Date(ParticularDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')
      }`;
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      const to = new Date(ToDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      return `Report From: ${from} To: ${to}`;
    }
    
    return `Report Date: ${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}`;
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .report-container {
              font-size: 12px;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 250px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
          .stats-container {
            display: flex;
            gap: 15px;
            margin-top: 10px;
            flex-wrap: wrap;
          }
          .stat-card {
            padding: 8px 15px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            min-width: 120px;
          }
          .stat-label {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 2px;
          }
          .stat-value {
            font-size: 16px;
            font-weight: bold;
          }
        `}
      </style>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="searchInput" style={{ fontWeight: '600', color: '#374151' }}>
            Search:
          </label>
          <input
            id="searchInput"
            type="text"
            className="search-input"
            placeholder="Search by name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="results-info">
          Showing {filteredData.length} of {groupedData.length} entries
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>

        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
            <div className="stat-label">Total Entries</div>
            <div className="stat-value">{filteredData.length}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="stat-label">IP Cases</div>
            <div className="stat-value">{totals.ip}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
            <div className="stat-label">OP Cases</div>
            <div className="stat-value">{totals.op}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#ef4444' }}>
            <div className="stat-label">Grand Total</div>
            <div className="stat-value">{totals.total}</div>
          </div>
        </div>
      </div>

      <div
        className="Register_btn_con"
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}
      >
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrint}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Print Report
        </button>
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrintClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Close
        </button>
      </div>

      <div className="print-container report-container" ref={componentRef}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #dee2e6',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr>
              <td
                colSpan="5"
                style={{
                  border: 'none',
                  textAlign: 'center',
                  padding: '15px 0',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <div>
                  <h2
                    className="header-text"
                    style={{
                      margin: '0',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      letterSpacing: '0.5px',
                    }}
                  >
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h1
                    className="subheader-text"
                    style={{
                      margin: '5px 0 0',
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#7f8c8d',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Vilayodi, Chittur, Palakkad
                  </h1>
                  <h4
                    style={{
                      margin: '10px 0 0',
                      fontSize: '16px',
                      color: '#34495e',
                      fontWeight: 'bold',
                    }}
                  >
                    OP/IP WISE REPORT
                  </h4>
                  <p
                    style={{
                      margin: '10px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    Clinical Material From {getDateRangeText()}
                  </p>
                  <p
                    style={{
                      margin: '5px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    {reportDateRange()}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                backgroundColor: '#3498db',
                color: 'white',
              }}
            >
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '10%'
              }}>
                S.No
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '50%'
              }}>
                Description
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '15%'
              }}>
                IP Count
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '15%'
              }}>
                OP Count
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '15%'
              }}>
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr
                  key={`item-${index}`}
                  style={{
                    fontSize: '12px',
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                    borderBottom: '1px solid #e5e7eb',
                  }}
                >
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>
                    {index + 1}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'left', 
                    border: '1px solid #dee2e6',
                    fontWeight: '500'
                  }}>
                    {item.name}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    color: '#059669',
                    fontWeight: '600'
                  }}>
                    {item.ipCount}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    color: '#d97706',
                    fontWeight: '600'
                  }}>
                    {item.opCount}
                  </td>
                  <td style={{ 
                    padding: '10px', 
                    textAlign: 'center', 
                    border: '1px solid #dee2e6',
                    color: '#dc2626',
                    fontWeight: 'bold',
                    backgroundColor: '#fef2f2'
                  }}>
                    {item.total}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="5"
                  style={{
                    padding: '40px 15px',
                    textAlign: 'center',
                    color: '#6b7280',
                    border: '1px solid #dee2e6',
                    fontStyle: 'italic',
                  }}
                >
                  No data found{searchTerm ? ` for "${searchTerm}"` : ''}
                </td>
              </tr>
            )}
            
            {/* Empty row for spacing */}
            <tr>
              <td colSpan="5" style={{ padding: '10px', border: 'none' }}></td>
            </tr>
            
            {/* Totals row */}
            {filteredData.length > 0 && (
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                }}
              >
                <td
                  colSpan="2"
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#059669',
                  }}
                >
                  {totals.ip}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#d97706',
                  }}
                >
                  {totals.op}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#dc2626',
                    fontSize: '14px',
                  }}
                >
                  {totals.total}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{
          marginTop: '30px',
          padding: '15px',
          textAlign: 'center',
          borderTop: '1px solid #e5e7eb',
          fontSize: '11px',
          color: '#6b7280'
        }}>
          <p>Generated on: {new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}</p>
          <p>This is a computer generated report. No signature required.</p>
        </div>
      </div>
    </div>
  );
};

const SpecialityOPIPWiseReportPrint = () => {
  const componentRef = useRef();
  const [searchTerm, setSearchTerm] = useState('');
  const [groupedBySpecialty, setGroupedBySpecialty] = useState({});
  const [specialties, setSpecialties] = useState([]);
  const [filteredSpecialties, setFilteredSpecialties] = useState([]);
  const [totals, setTotals] = useState({ 
    ip: 0, 
    op: 0, 
    total: 0,
    specialtyCount: 0
  });

  // Combine and process OP/IP data by specialty
  useEffect(() => {
    // Combine all data
    const allData = [
      ...(opOriginalData || []),
      ...(opDummyData || []),
      ...(ipOriginalData || []),
      ...(ipDummyData || [])
    ];
    
    // Create a map to group by specialty
    const specialtyMap = {};
    
    allData.forEach(item => {
      const specialty = item.Speciality || item.Department || 'UNSPECIFIED';
      const itemName = item.Test_Name || item.DoctorName || item.PatientName || 'Unknown';
      const isIP = item.RegisterType === 'IP' || item.PatientType === 'IP' || 
                   (item.OP_IP && item.OP_IP === 'IP') || false;
      
      // Initialize specialty if not exists
      if (!specialtyMap[specialty]) {
        specialtyMap[specialty] = {
          specialtyName: specialty,
          items: {},
          ipCount: 0,
          opCount: 0,
          total: 0
        };
      }
      
      // Initialize item if not exists
      if (!specialtyMap[specialty].items[itemName]) {
        specialtyMap[specialty].items[itemName] = {
          itemName: itemName,
          ipCount: 0,
          opCount: 0,
          total: 0
        };
      }
      
      // Add to counts
      if (isIP) {
        specialtyMap[specialty].items[itemName].ipCount += 1;
        specialtyMap[specialty].ipCount += 1;
      } else {
        specialtyMap[specialty].items[itemName].opCount += 1;
        specialtyMap[specialty].opCount += 1;
      }
      
      specialtyMap[specialty].items[itemName].total = 
        specialtyMap[specialty].items[itemName].ipCount + 
        specialtyMap[specialty].items[itemName].opCount;
      
      specialtyMap[specialty].total = 
        specialtyMap[specialty].ipCount + 
        specialtyMap[specialty].opCount;
    });
    
    // Convert items objects to arrays and sort
    const specialtiesArray = Object.values(specialtyMap).map(specialty => ({
      ...specialty,
      items: Object.values(specialty.items).sort((a, b) => 
        a.itemName.localeCompare(b.itemName)
      )
    }));
    
    // Sort specialties by name
    specialtiesArray.sort((a, b) => a.specialtyName.localeCompare(b.specialtyName));
    
    // Calculate overall totals
    const ipTotal = specialtiesArray.reduce((sum, spec) => sum + spec.ipCount, 0);
    const opTotal = specialtiesArray.reduce((sum, spec) => sum + spec.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setGroupedBySpecialty(specialtyMap);
    setSpecialties(specialtiesArray);
    setFilteredSpecialties(specialtiesArray);
    setTotals({ 
      ip: ipTotal, 
      op: opTotal, 
      total: grandTotal,
      specialtyCount: specialtiesArray.length
    });
  }, [opDummyData, opOriginalData, ipDummyData, ipOriginalData]);

  // Filter specialties and items based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredSpecialties(specialties);
      return;
    }

    const searchLower = searchTerm.toLowerCase();
    
    const filtered = specialties.map(specialty => {
      // Check if specialty name matches
      if (specialty.specialtyName.toLowerCase().includes(searchLower)) {
        return specialty;
      }
      
      // Filter items within specialty
      const filteredItems = specialty.items.filter(item =>
        item.itemName.toLowerCase().includes(searchLower)
      );
      
      if (filteredItems.length > 0) {
        // Recalculate counts for filtered items
        const ipCount = filteredItems.reduce((sum, item) => sum + item.ipCount, 0);
        const opCount = filteredItems.reduce((sum, item) => sum + item.opCount, 0);
        
        return {
          ...specialty,
          items: filteredItems,
          ipCount,
          opCount,
          total: ipCount + opCount
        };
      }
      
      return null;
    }).filter(specialty => specialty !== null);

    // Recalculate overall totals for filtered results
    const ipTotal = filtered.reduce((sum, spec) => sum + spec.ipCount, 0);
    const opTotal = filtered.reduce((sum, spec) => sum + spec.opCount, 0);
    const grandTotal = ipTotal + opTotal;
    
    setFilteredSpecialties(filtered);
    setTotals({ 
      ip: ipTotal, 
      op: opTotal, 
      total: grandTotal,
      specialtyCount: filtered.length
    });
  }, [searchTerm, specialties]);

  // Format date based on search options
  const getDateRangeText = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return new Date().toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (DateType === 'Particular' && ParticularDate) {
      return new Date(ParticularDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      const to = new Date(ToDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
      return `${from} to ${to}`;
    }
    
    return new Date().toLocaleDateString('en-IN');
  };

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Specialty_OP_IP_Report_${new Date().toISOString().split('T')[0]}`,
  });

  // Format date range for report header
  const reportDateRange = () => {
    const { DateType, FromDate, ToDate, ParticularDate } = searchOptions || {};
    
    if (DateType === 'Current') {
      return `Report Date: ${
        searchOptions.CurrentDate
          ? new Date(searchOptions.CurrentDate).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: '2-digit',
              year: '2-digit',
            }).replace(/\//g, '-')
          : 'N/A'
      }`;
    } else if (DateType === 'Particular' && ParticularDate) {
      return `Report Date: ${
        new Date(ParticularDate).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        }).replace(/\//g, '-')
      }`;
    } else if (FromDate && ToDate) {
      const from = new Date(FromDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      const to = new Date(ToDate).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit',
      }).replace(/\//g, '-');
      return `Report From: ${from} To: ${to}`;
    }
    
    return `Report Date: ${new Date().toLocaleDateString('en-GB').replace(/\//g, '-')}`;
  };

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        maxWidth: '1400px',
        margin: '0 auto',
      }}
    >
      <style>
        {`
          @media print {
            body {
              margin: 0;
              padding: 0;
            }
            .specialty-section {
              page-break-inside: avoid;
            }
            table {
              page-break-inside: auto;
              width: 100%;
            }
            tr {
              page-break-inside: avoid;
              page-break-after: auto;
            }
            thead {
              display: table-header-group;
            }
            tfoot {
              display: table-footer-group;
            }
            .Register_btn_con {
              display: none;
            }
            .search-container {
              display: none;
            }
            .report-container {
              font-size: 11px;
            }
            .specialty-header {
              background-color: #f0f0f0 !important;
              -webkit-print-color-adjust: exact;
            }
          }
          .report-container {
            border: 1px solid #d1d5db;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          }
          button {
            padding: 8px 16px;
            margin: 5px;
            background-color: #2563eb;
            color: white;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            font-size: 14px;
          }
          button:hover {
            background-color: #1e40af;
          }
          .search-container {
            margin-bottom: 15px;
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
          }
          .search-input {
            padding: 8px 12px;
            border: 1px solid #d1d5db;
            border-radius: 4px;
            font-size: 14px;
            min-width: 300px;
          }
          .search-input:focus {
            outline: none;
            border-color: #2563eb;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
          }
          .results-info {
            font-size: 14px;
            color: #6b7280;
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
          .stats-container {
            display: flex;
            gap: 15px;
            margin-top: 10px;
            flex-wrap: wrap;
          }
          .stat-card {
            padding: 8px 15px;
            background: white;
            border-radius: 6px;
            border-left: 4px solid;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            min-width: 120px;
          }
          .stat-label {
            font-size: 11px;
            color: #6b7280;
            margin-bottom: 2px;
          }
          .stat-value {
            font-size: 16px;
            font-weight: bold;
          }
          .specialty-header {
            background-color: #4f46e5;
            color: white;
            font-weight: bold;
            cursor: pointer;
            transition: background-color 0.3s;
          }
          .specialty-header:hover {
            background-color: #4338ca;
          }
          .specialty-header td {
            position: relative;
            padding-right: 30px;
          }
        `}
      </style>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="specialtySearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search:
          </label>
          <input
            id="specialtySearch"
            type="text"
            className="search-input"
            placeholder="Search specialty or item name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="results-info">
          Showing {filteredSpecialties.length} of {specialties.length} specialties
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
        </div>

        {searchTerm && (
          <button
            className="clear-search"
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
            <div className="stat-label">Specialties</div>
            <div className="stat-value">{totals.specialtyCount}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="stat-label">IP Cases</div>
            <div className="stat-value">{totals.ip}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
            <div className="stat-label">OP Cases</div>
            <div className="stat-value">{totals.op}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#ef4444' }}>
            <div className="stat-label">Grand Total</div>
            <div className="stat-value">{totals.total}</div>
          </div>
        </div>
      </div>

      <div
        className="Register_btn_con"
        style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}
      >
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrint}
          style={{
            padding: '8px 16px',
            backgroundColor: '#3498db',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Print Report
        </button>
        <button
          className="RegisterForm_1_btns"
          onClick={handlePrintClose}
          style={{
            padding: '8px 16px',
            backgroundColor: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: '500',
            transition: 'background-color 0.3s',
          }}
        >
          Close
        </button>
      </div>

      <div className="print-container report-container" ref={componentRef}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #dee2e6',
            marginBottom: '20px',
          }}
        >
          <thead>
            <tr>
              <td
                colSpan="6"
                style={{
                  border: 'none',
                  textAlign: 'center',
                  padding: '15px 0',
                  backgroundColor: '#f8f9fa',
                }}
              >
                <div>
                  <h2
                    className="header-text"
                    style={{
                      margin: '0',
                      fontSize: '24px',
                      fontWeight: 'bold',
                      color: '#2c3e50',
                      letterSpacing: '0.5px',
                    }}
                  >
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h1
                    className="subheader-text"
                    style={{
                      margin: '5px 0 0',
                      fontSize: '18px',
                      fontWeight: '500',
                      color: '#7f8c8d',
                      letterSpacing: '0.3px',
                    }}
                  >
                    Vilayodi, Chittur, Palakkad
                  </h1>
                  <h4
                    style={{
                      margin: '10px 0 0',
                      fontSize: '16px',
                      color: '#34495e',
                      fontWeight: 'bold',
                    }}
                  >
                    SPECIALTY WISE OP/IP REPORT
                  </h4>
                  <p
                    style={{
                      margin: '10px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    Clinical Material From {getDateRangeText()}
                  </p>
                  <p
                    style={{
                      margin: '5px 0 0',
                      fontSize: '14px',
                      color: '#34495e',
                      fontWeight: '500',
                    }}
                  >
                    {reportDateRange()}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                </div>
              </td>
            </tr>
            <tr
              style={{
                fontWeight: 'bold',
                fontSize: '12px',
                backgroundColor: '#3498db',
                color: 'white',
              }}
            >
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '5%'
              }}>
                S.No
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'left', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '45%'
              }}>
                Item Description
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '12%'
              }}>
                IP Count
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '12%'
              }}>
                OP Count
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '12%'
              }}>
                Item Total
              </th>
              <th style={{ 
                padding: '12px', 
                textAlign: 'center', 
                border: '1px solid #dee2e6', 
                fontWeight: '600',
                width: '14%'
              }}>
                Specialty Total
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredSpecialties.length > 0 ? (
              filteredSpecialties.map((specialty, specIndex) => (
                <React.Fragment key={`specialty-${specIndex}`}>
                  {/* Specialty Header Row */}
                  <tr className="specialty-header">
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      fontSize: '13px'
                    }}>
                      {specIndex + 1}
                    </td>
                    <td colSpan="4" style={{ 
                      padding: '10px', 
                      textAlign: 'left', 
                      border: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      fontSize: '14px'
                    }}>
                      {specialty.specialtyName}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      fontWeight: 'bold',
                      fontSize: '14px',
                      backgroundColor: '#4338ca'
                    }}>
                      {specialty.total}
                    </td>
                  </tr>
                  
                  {/* Items within specialty */}
                  {specialty.items.map((item, itemIndex) => (
                    <tr
                      key={`item-${specIndex}-${itemIndex}`}
                      style={{
                        fontSize: '11px',
                        backgroundColor: itemIndex % 2 === 0 ? '#f8f9fa' : 'white',
                        borderBottom: '1px solid #e5e7eb',
                      }}
                    >
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        fontWeight: '500'
                      }}>
                        {specIndex + 1}.{itemIndex + 1}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'left', 
                        border: '1px solid #dee2e6',
                        fontWeight: '500',
                        paddingLeft: '20px'
                      }}>
                        {item.itemName}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#059669',
                        fontWeight: '600'
                      }}>
                        {item.ipCount}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#d97706',
                        fontWeight: '600'
                      }}>
                        {item.opCount}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        color: '#dc2626',
                        fontWeight: '600'
                      }}>
                        {item.total}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'center', 
                        border: '1px solid #dee2e6',
                        backgroundColor: '#f3f4f6',
                        fontWeight: '500'
                      }}>
                        {/* Empty for item rows */}
                      </td>
                    </tr>
                  ))}
                  
                  {/* Specialty Totals Row */}
                  <tr
                    style={{
                      fontWeight: 'bold',
                      fontSize: '12px',
                      backgroundColor: '#e5e7eb',
                      borderTop: '2px solid #9ca3af'
                    }}
                  >
                    <td colSpan="2" style={{ 
                      padding: '10px', 
                      textAlign: 'right', 
                      border: '1px solid #dee2e6',
                      fontWeight: '600'
                    }}>
                      {specialty.specialtyName} Total
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      color: '#059669',
                      backgroundColor: '#d1fae5'
                    }}>
                      {specialty.ipCount}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      color: '#d97706',
                      backgroundColor: '#fef3c7'
                    }}>
                      {specialty.opCount}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      color: '#dc2626',
                      backgroundColor: '#fee2e2',
                      fontWeight: 'bold'
                    }}>
                      {specialty.total}
                    </td>
                    <td style={{ 
                      padding: '10px', 
                      textAlign: 'center', 
                      border: '1px solid #dee2e6',
                      backgroundColor: '#dbeafe',
                      fontWeight: 'bold'
                    }}>
                      {specialty.total}
                    </td>
                  </tr>
                  
                  {/* Empty row for spacing between specialties */}
                  <tr>
                    <td colSpan="6" style={{ padding: '5px', border: 'none' }}></td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  style={{
                    padding: '40px 15px',
                    textAlign: 'center',
                    color: '#6b7280',
                    border: '1px solid #dee2e6',
                    fontStyle: 'italic',
                  }}
                >
                  No data found{searchTerm ? ` for "${searchTerm}"` : ''}
                </td>
              </tr>
            )}
            
            {/* Grand Totals Row */}
            {filteredSpecialties.length > 0 && (
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                  borderTop: '3px solid #3498db'
                }}
              >
                <td
                  colSpan="2"
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL ({totals.specialtyCount} Specialties)
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#059669',
                  }}
                >
                  {totals.ip}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#d97706',
                  }}
                >
                  {totals.op}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#dc2626',
                    fontSize: '14px',
                  }}
                >
                  {totals.total}
                </td>
                <td
                  style={{
                    padding: '12px',
                    border: '1px solid #dee2e6',
                    textAlign: 'center',
                    backgroundColor: '#3b82f6',
                    fontSize: '14px',
                  }}
                >
                  {totals.total}
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{
          marginTop: '30px',
          padding: '15px',
          textAlign: 'center',
          borderTop: '1px solid #e5e7eb',
          fontSize: '11px',
          color: '#6b7280'
        }}>
          <p>Generated on: {new Date().toLocaleString('en-IN', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}</p>
          <p>This is a computer generated report. No signature required.</p>
        </div>
      </div>
    </div>
  );
};



    useEffect(() => {
    
      const controller = new AbortController();
      const { signal } = controller;
    
      const searchparams = {
        searchOptions,
        SelectedSpecialityIds: SelectedSpecialities.map(s => s.Speciality_Id),
        SelectedDocs: SelectedDocs.map(d => d.id),
        selectedStockIds : selectedStockIds,
        selectedDiagnosisIds : selectedDiagnosisIds
      };
    
      console.log(searchparams, "searchparams");
    
      const fetchData = async () => {
    
        switch (viewType) {
          
    
          case "PatientWise":
            try {
              const [patres] = await Promise.all([
                axios.get(`${UrlLink}MCI/MRD_patient_Wise_Diagnosis_Link`, { params: searchparams, signal }),                
              ]);
    
              setPatientWiseList(patres.data);
              
            } 
            catch (err) {
              if (axios.isCancel(err)) {
                console.log("IPCensus request cancelled");
              } else {
                console.log(err);
              }
            }
            return;

          case "CodeWise":

            try {
                const [patres] = await Promise.all([
                  axios.get(`${UrlLink}MCI/MRD_Code_Wise_Diagnosis_Link`, { params: searchparams, signal }),                
                ]);
      
                setCodeWiseList(patres.data);
                
              } 
            catch (err) {
              if (axios.isCancel(err)) {
                console.log("IPCensus request cancelled");
              } else {
                console.log(err);
              }
            }
            return;


          case "DiagnosisWise":

            try {
                const [patres] = await Promise.all([
                  axios.get(`${UrlLink}MCI/MRD_Diagnosis_Wise_Diagnosis_Link`, { params: searchparams, signal }),                
                ]);
      
                setDWiseList(patres.data);
                
              } 
            catch (err) {
              if (axios.isCancel(err)) {
                console.log("IPCensus request cancelled");
              } else {
                console.log(err);
              }
            }
            return;






        }
       
      };
    
      fetchData();
    
      return () => {
        controller.abort(); // cancel previous requests
      };
    
    }, [
      UrlLink,
      searchOptions,
      SelectedSpecialities,
      viewType, 
      SelectedDocs,
      selectedStockIds,
      selectedDiagnosisIds
          ]);

    const HandleOnchangeSearch = (e) => {
        const { name, value } = e.target;
        if (name === 'SearchbyPhoneNumber') {
        if (value.length <= 10) {
            setSearchOptions((prev) => ({
            ...prev,
            [name]: value,
            }));
        }
        }
        else if (name === 'DateType') {
        if (value === 'Current') {
            setSearchOptions((prev) => ({
            ...prev,
            DateType: value,
            CurrentDate: TodayDate,
            FromDate: '',
            ToDate: '',
            }));
        }
        else if (value === 'Customize') {
            setSearchOptions((prev) => ({
            ...prev,
            DateType: value,
            CurrentDate: '',
            }));
        } 

        else if (value === 'Particular') {
            setSearchOptions((prev) => ({
            ...prev,
            DateType: value,
            CurrentDate: "",
            FromDate: "",
            ToDate: "",
            }));
        }
        else if (value === 'All') {
            setSearchOptions((prev) => ({
            ...prev,
            DateType: value,
            CurrentDate: '',
            FromDate: '',
            ToDate: '',
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


    const handlePrintClose = () => {
        setOpenModal(false);
       };
    
      const handlePrint2 = useReactToPrint({
          content: () => componentRef.current,
          // onAfterPrint: async () => {
          //   navigate("/Home/MRDFolder");
          //   dispatchvalue({ type: "HrFolder", value: "PatientReports" });
          //   dispatchvalue({ type: "setPreviousFolder", value: null });
          //   dispatchvalue({ type: "showMenu", value: true });
          // },
       });


      

console.log(selectedLetters,'selectedLetters')





  return (
    <>

    <div className="Main_container_app">

        <h3>Radiology Report</h3>

        <div className="RegisterTypecon">
        <div className="RegisterType">
          {[
            "CTWise",
            "MRIWise",
            "USGWise",
            "XRAYWise",
            "MAMMOGRAMWise",
            "OP/IPWise"
          ].map((p, ind) => (
            <div className="registertypeval" key={ind + "key"}>
              <input
                type="radio"
                id={p}
                name="view_type"
                checked={viewType === p}
                onChange={() => setViewType(p)}
                value={p}
              />
              <label htmlFor={p}>{p || "None"}</label>
            </div>
          ))}
        </div>
        </div>

      <br />


      <div className="search_div_bar" style={{ width: "100%" }}>
              <div className="RegisFormcon_1" style={{ marginTop: "10px" }}>
                {/* Date Type */}
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
                      <option value="Particular">Particular Date</option>
                  </select>
                </div>
      
                {/* Current Date (read-only) */}
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
      
                {searchOptions.DateType === "Particular" && (
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
                  )}
      
                {/* Custom Date Range */}
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
      
                <div className="RegisForm_1" style={{ justifyContent: "space-evenly" }}>
                  <label htmlFor="printBtn">Print<span>:</span></label>
                  <button
                    id="printBtn"
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                    }}
                    onClick={openModal}
                  >
                    <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                  </button>
                </div>
      
                {/* Fixed Print Button */}
                <div className="RegisForm_1" style={{ justifyContent: "space-evenly" }}>
                  <button
                    style={{
                      width: "60px",
                      height: "60px",
                      border: "1px solid #ccc",
                      borderRadius: "8px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#f5f5f5",
                      cursor: "pointer",
                      position: "fixed",
                      bottom: "420px",
                      right: "20px",
                      zIndex: 1000,
                    }}
                    onClick={openModal}
                  >
                    <PrintIcon style={{ fontSize: "32px", color: "#333" }} />
                  </button>
                </div>
              </div>
      </div>


      {(viewType === 'CTWise' || viewType === 'MRIWise' || viewType === 'XRAYWise' || viewType === 'USGWise' || viewType === 'MAMMOGRAMWise'|| viewType === "OP/IPWise") && (
        <>
          <div className="Main_container_app">
            <h3>Department</h3>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "15px",
                padding: "0px 15px",
              }}
            >
              {/* Select All */}
              <div>
                <label style={{ gap: "15px", padding: "10px" }}>
                  <input
                    type="checkbox"
                    id="select-all-specialities"
                    checked={
                      Array.isArray(SpecialityData) &&
                      SpecialityData.length > 0 &&
                      SelectedSpecialities.length === SpecialityData.length
                    }
                    onChange={handleSelectAllSpecialities}
                  />
                  Select All
                </label>
              </div>

              {/* Speciality List */}
              {Array.isArray(SpecialityData) && SpecialityData.length > 0 ? (
                SpecialityData.map((speciality, index) => (
                  <div key={speciality.Speciality_Id}>
                    <label
                      htmlFor={`speciality-${index}`}
                      style={{ gap: "15px", padding: "10px" }}
                    >
                      <input
                        type="checkbox"
                        name="specialityArray"
                        id={`speciality-${index}`}
                        value={`${speciality.SpecialityName} | ${speciality.Speciality_Id}`}
                        checked={isSpecialityChecked(speciality)}
                        onChange={(e) =>
                          handleCheckboxChangeSpeciality(e, speciality)
                        }
                      />
                      {speciality.SpecialityName}
                    </label>
                  </div>
                ))
              ) : (
                <div className="Add_items_Purchase_Master">
                  <span>No Department Found</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}


      


      




      


    </div>


    {OpenModal && (
      <div className="loader" onClick={closeModal}>
        <div className="cardModel" onClick={(e) => e.stopPropagation()}>
          {viewType === "PatientWise" ? (
            printBySpeciality ? (
              <SpecialityDiagnosisPrint />
            ) : (
              <PatientWiseDiagnosisPrint />
            )
          ) : viewType === "CodeWise" ? (
            <CodeWisePrint />
          ) : viewType === "CTWise" ? (
            printBySpeciality ? (
                <SpecialtyCTReportPrint />
            ) : <CTReportPrint />
          ) : viewType === "MRIWise" ? (
            printBySpeciality ? (
                <SpecialtyMRIReportPrint />
            ) :
            <MRIReportPrint />
          ): viewType === "XRAYWise" ? (
            printBySpeciality ? (
                <SpecialtyXRAYReportPrint />
            ) :
            <XRAYReportPrint />
          ): viewType === "USGWise" ? (
            printBySpeciality ? (
                <SpecialtyUSGReportPrint />
            ) :
            <USGReportPrint />
          ): viewType === "MAMMOGRAMWise" ? (
            printBySpeciality ? (
                <SpecialtyMAMMOGRAMReportPrint />
            ) :
            <MAMMOGRAMReportPrint />
          ): viewType === "OP/IPWise" ? (
            printBySpeciality ? (
                <SpecialityOPIPWiseReportPrint />
            ) :
            <OPIPWiseReportPrint />
          ): null}
        </div>

      </div>
    )}




    </>
  )
}

export default RadiologyReportsMIS














