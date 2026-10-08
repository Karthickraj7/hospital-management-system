import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import PrintIcon from '@mui/icons-material/Print';
import { useReactToPrint } from "react-to-print";
import Select, { useStateManager } from 'react-select';

const MCIPatientReports = () => {

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
  const [viewType, setViewType] = useState("OPCensus");


  const [SpecialityData, setSpecialityData] = useState([]);
  const [WardData, setWardData] = useState([]);
  const [Insurance, setInsurance] = useState([]);

  const [AllDocData, setAllDocData] = useState([]);
  const [SelectedDocs, setSelectedDocs] = useState([]);

  const [OpenModal, setOpenModal] = useState(false);
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


    axios.get(`${UrlLink}Masters/Ward_Master_Detials_link`)
      .then((res) => {
        const ress = res.data
        setWardData(ress)
      })
      .catch((err) => {
        console.log(err);
      })


    axios.get(`${UrlLink}Masters/get_All_doctor_Name_Detials_for_reports`)
      .then((res) => {
        const ress = res.data
        setAllDocData(ress)
      })
      .catch((err) => {
        console.log(err);
      })
  }, [UrlLink])






  useEffect(() => {
    axios.get(`${UrlLink}Masters/Insurance_Client_Master_Detials_link?MasterType=Insurance&Type=&SearchBy=
`)
      .then((res) => {
        const ress = res.data
        setInsurance(ress)
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
    Servicename: '',
  });

  const [SelectedSpecialities, setSelectedSpecialities] = useState([]);
  const [printBySpeciality, setPrintBySpeciality] = useState(false);
  const [printByWard, setPrintByWard] = useState(false);

  console.log(printByWard,'printByWard mciiiiii')

  const [SelectedWards, setSelectedWards] = useState([]);
  console.log(SelectedSpecialities, 'SelectedSpecialities');

  useEffect(() => {
    setPrintBySpeciality(SelectedSpecialities.length > 0);
  }, [SelectedSpecialities]);

  useEffect(() => {
    setPrintByWard(SelectedWards.length > 0);
  }, [SelectedWards]);

  const handleCheckboxChangeSpeciality = (event, speciality) => {
    const { checked } = event.target;

    setSelectedSpecialities((prev) => {
      if (checked) {
        if (!prev.some(p => p.Speciality_Id === speciality.Speciality_Id)) {
          return [...prev, speciality];
        }
        return prev;
      } else {
        return prev.filter(p => p.Speciality_Id !== speciality.Speciality_Id);
      }
    });
  };

  const handleSelectAllSpecialities = (event) => {
    const { checked } = event.target;

    if (checked) {
      setSelectedSpecialities(
        Array.isArray(SpecialityData) ? SpecialityData.slice() : []
      );
    } else {
      setSelectedSpecialities([]);
    }
  };

  const handleSelectAllGenders = (event) => {
    const { checked } = event.target;

    if (checked) {
      setSelectedGenders(['Male', 'MaleChild', 'Female', 'FemaleChild']);
    } else {
      setSelectedGenders([]);
    }
  };

  const handleSelectAllCategories = (event) => {
    const { checked } = event.target;

    if (checked) {
      setSelectedCategories([
        'General',
        'Student',
        'FreeAll',
        'Camp',
        'KRCL',
        'Insurance',
        'Employee',
        'EmployeeRelation',
        'Doctor',
        'DoctorRelation',
      ]);
    } else {
      setSelectedCategories([]);
    }
  };

  const handleSelectAllInsurance = (event) => {
    const { checked } = event.target;

    if (checked) {
      setSelectedInsurance(Insurance.map((insurance) => insurance.id));
    } else {
      setSelectedInsurance([]);
    }
  };

  const handleCheckboxChangeward = (event, ward) => {
    const { checked } = event.target;

    setSelectedWards((prev) => {
      if (checked) {
        if (!prev.some(w => w.id === ward.id)) {
          return [...prev, {
            WardName: ward.WardName,
            id: ward.id
          }];
        }
        return prev;
      } else {
        return prev.filter(w => w.id !== ward.id);
      }
    });
  };


  const handleCheckboxChangeDoc = (event, doc) => {
    const { checked } = event.target;

    setSelectedDocs((prev) => {
      if (checked) {
        if (!prev.some(d => d.id === doc.id)) {
          return [...prev, {
            DocName: doc.Name,
            id: doc.id
          }];
        }
        return prev;
      } else {
        return prev.filter(d => d.id !== doc.id);
      }
    });
  };

  const handleSelectAll = (event) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedWards(Array.isArray(WardData) ? WardData.map(ward => ({
        WardName: ward.WardName,
        id: ward.id
      })) : []);
    } else {
      setSelectedWards([]);
    }
  };

  const handleSelectAllDocs = (event) => {
    const { checked } = event.target;
    if (checked) {
      setSelectedDocs(Array.isArray(AllDocData) ? AllDocData.map(doc => ({
        DocName: doc.Name,
        id: doc.id
      })) : []);
    } else {
      setSelectedDocs([]);
    }
  };
  const isSpecialityChecked = (speciality) => {
    return SelectedSpecialities.some(
      (item) => `${item.SpecialityName} | ${item.Speciality_Id}` === `${speciality.SpecialityName} | ${speciality.Speciality_Id}`
    );
  };

  const isWardChecked = (ward) => {
    return SelectedWards.some(
      (item) => `${item.WardName} | ${item.id}` === `${ward.WardName} | ${ward.id}`
    );
  };


  const isDoctorChecked = (doc) => {
    return SelectedDocs.some(
      (item) => `${item.DocName} | ${item.id}` === `${doc.Name} | ${doc.id}`
    );
  };

  const [selectedGenders, setSelectedGenders] = useState([]);
  const isGenderChecked = (gender) => selectedGenders.includes(gender);
  const handleCheckboxChangeGender = (e, gender) => {
    if (e.target.checked) {
      setSelectedGenders((prev) => [...prev, gender]);
    } else {
      setSelectedGenders((prev) => prev.filter((g) => g !== gender));
    }
  };


  const [selectedCategories, setSelectedCategories] = useState([]);
  const [printBycategory, setPrintBycategory] = useState(false);

  console.log(printBycategory, 'printBycategory')


  useEffect(() => {
    setPrintBycategory(selectedCategories.length > 0);
  }, [selectedCategories]);

  const isCategoryChecked = (category) => selectedCategories.includes(category);
  const handleCheckboxChangeCategory = (e, category) => {
    if (e.target.checked) {
      setSelectedCategories((prev) => [...prev, category]);
    } else {
      setSelectedCategories((prev) => prev.filter((g) => g !== category));
    }
  };


  const [selectedInsurance, setSelectedInsurance] = useState([]);

  const handleInsuranceChange = (e, insuranceName) => {
    if (e.target.checked) {
      setSelectedInsurance([...selectedInsurance, insuranceName]);
    } else {
      setSelectedInsurance(
        selectedInsurance.filter((id) => id !== insuranceName)
      );
    }
  };


  console.log(searchOptions, 'searchOptions')

  const [OPCensus, setOPcensus] = useState({
    New: [],
    Old: []
  });


  const [NewPatientList, setNewPatientList] = useState([]);
  const [RevisitPatientList, setRevisitPatientList] = useState([]);
  const [RevisitandPatientList, setRevisitandPatientList] = useState({
    New: [],
    Old: [],
  });
  const [InPatientList, setInPatientList] = useState([]);
  const [DischargeList, setDischargeList] = useState([]);

  const [OPRegFee, setOPRegFee] = useState([]);
  const [AdmissionList, setAdmissionList] = useState([]);

  const [IPDoctorReportData, setIPDoctorReportData] = useState([]);

  const [IPCensusdata, setIPCensusdata] = useState([]);
  const [IPCensusDisdata, setIPCensusDisdata] = useState([]);
  const [InPatientcount,setInPatientcount] = useState([]);
  const [PrevInPatientcount,setPrevInPatientcount] = useState([]);


  console.log(OPRegFee, 'OPRegFee')

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const searchparams = {
      searchOptions,
      selectedGenders,
      SelectedSpecialityIds: SelectedSpecialities.map(s => s.Speciality_Id),
      selectedCategories,
      selectedInsurance,
      SelectedWards: SelectedWards.map(s => s.id),
      SelectedDocs: SelectedDocs.map(d => d.id)
    };

    console.log("searchparams", searchparams);

    const fetchData = async () => {
      try {
        if (viewType === "OPCensus") {
          const res = await axios.get(
            `${UrlLink}MCI/Mci_Patient_Fake_Reports_OP`,
            { params: searchparams, signal }
          );

          const ress = res.data;
          setOPcensus({
            New: Array.isArray(ress.New) ? ress.New : [],
            Old: Array.isArray(ress.Old) ? ress.Old : []
          });

          return;
        }

        if (viewType === "NewPatientList") {
          const res = await axios.get(
            `${UrlLink}MCI/MCI_New_Patient_List`,
            { params: searchparams, signal }
          );
          setNewPatientList(res.data);
          return;
        }

        if (viewType === "RevisitPatientList") {
          const res = await axios.get(
            `${UrlLink}MCI/MCI_Revisit_Patient_List`,
            { params: searchparams, signal }
          );
          setRevisitPatientList(res.data);
          return;
        }

        if (viewType === "New&RevisitList") {
          const res = await axios.get(
            `${UrlLink}MCI/MCI_Overall_Patient_List`,
            { params: searchparams, signal }
          );
          setRevisitandPatientList({
            New: res.data.New,
            Old: res.data.Revisit
          });
          return;
        }

        if (viewType === "InPatientList") {
          const res = await axios.get(
            `${UrlLink}MCI/MCI_InPatient_List`,
            { params: searchparams, signal }
          );
          setInPatientList(res.data);
          return;
        }

        if (viewType === "DischargeList") {
          const res = await axios.get(
            `${UrlLink}MCI/MCI_Discharge_Patient_List`,
            { params: searchparams, signal }
          );
          setDischargeList(res.data);
          return;
        }

        if (viewType === "OPRegFee") {
          const res = await axios.get(
            `${UrlLink}MCI/Original_OP_Registration_Fee`,
            { params: searchparams, signal }
          );
          setOPRegFee(res.data);
          return;
        }

        if (viewType === "AdmissionList") {
          const res = await axios.get(
            `${UrlLink}MCI/MCI_Patient_IPAdmission_List`,
            { params: searchparams, signal }
          );
          setAdmissionList(res.data);
          return;
        }

        if (viewType === "IPDoctorReports") {
          const res = await axios.get(
            `${UrlLink}MCI/MCI_IP_DoctorWise_report`,
            { params: searchparams, signal }
          );
          setIPDoctorReportData(res.data);
          return;
        }

        // In your useEffect, add debugging:
          if (viewType === "IPCensus") {
          const [censusRes, disRes,inpatientcount,yespatcount] = await Promise.all([
            axios.get(`${UrlLink}MCI/MCI_IP_Census_Patient_Combined_Reports`, {
              params: searchparams, signal
            }),
            axios.get(`${UrlLink}MCI/MCI_IP_CENSUS_Discharge_Count_Reports`, {
              params: searchparams, signal
            }),
           axios.get(`${UrlLink}MCI/MCI_IP_Census_INPatient_Count_Reports`, { params: searchparams, signal }),
           axios.get(`${UrlLink}MCI/MCI_IP_Census_Prev_INPatient_Count_Reports`, { params: searchparams, signal }),
            
          ]);

          console.log("Census Response:", censusRes.data);
          console.log("Discharge Response:", disRes.data);

          setIPCensusdata(censusRes.data);
          setIPCensusDisdata(disRes.data);
          setInPatientcount(inpatientcount.data);
          setPrevInPatientcount(yespatcount.data);

        }



      } catch (err) {
        if (axios.isCancel(err)) {
          console.log("Request cancelled");
        } else {
          console.log(err);
        }
      }
    };

    fetchData();

    return () => controller.abort();

  }, [
    UrlLink,
    searchOptions,
    selectedGenders,
    SelectedSpecialities,
    viewType,
    selectedInsurance,
    selectedCategories,
    SelectedWards,
    SelectedDocs
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




  const OPCensusPrint = () => {
    const renderTableSection = (newData, oldData, title) => {
      if ((!newData || newData.length === 0) && (!oldData || oldData.length === 0)) return null;

      // Aggregate data by department
      const aggregateData = (data) => {
        return data.reduce((acc, row) => {
          const dept = row.Department || 'Unknown';
          if (!acc[dept]) {
            acc[dept] = { Male: 0, Female: 0, MCh: 0, FCh: 0 };
          }
          acc[dept].Male += parseInt(row.Male || 0);
          acc[dept].Female += parseInt(row.Female || 0);
          acc[dept].MCh += parseInt(row.MCh || 0);
          acc[dept].FCh += parseInt(row.FCh || 0);
          return acc;
        }, {});
      };

      const newAggregated = aggregateData(newData || []);
      const oldAggregated = aggregateData(oldData || []);

      // Calculate totals for New Patients
      const newMaleTotal = Object.values(newAggregated).reduce((sum, row) => sum + row.Male, 0);
      const newFemaleTotal = Object.values(newAggregated).reduce((sum, row) => sum + row.Female, 0);
      const newMChildTotal = Object.values(newAggregated).reduce((sum, row) => sum + row.MCh, 0);
      const newFChildTotal = Object.values(newAggregated).reduce((sum, row) => sum + row.FCh, 0);
      const newOverTotal = newMaleTotal + newFemaleTotal + newMChildTotal + newFChildTotal;

      // Calculate totals for Follow-up Patients
      const oldMaleTotal = Object.values(oldAggregated).reduce((sum, row) => sum + row.Male, 0);
      const oldFemaleTotal = Object.values(oldAggregated).reduce((sum, row) => sum + row.Female, 0);
      const oldMChildTotal = Object.values(oldAggregated).reduce((sum, row) => sum + row.MCh, 0);
      const oldFChildTotal = Object.values(oldAggregated).reduce((sum, row) => sum + row.FCh, 0);
      const oldOverTotal = oldMaleTotal + oldFemaleTotal + oldMChildTotal + oldFChildTotal;

      // Get unique departments
      const allDepartments = [...new Set([
        ...Object.keys(newAggregated),
        ...Object.keys(oldAggregated),
      ])].sort();

      return (
        <>
          {(newData?.length > 0 || oldData?.length > 0) && (
            <tr>
              <td
                colSpan="12"
                style={{
                  border: 'none',
                  padding: '12px 0 6px',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  textAlign: 'left',
                  color: '#2c3e50',
                  borderBottom: '2px solid #3498db',
                }}
              >
                {title}
              </td>
            </tr>
          )}
          {allDepartments.map((department, index) => {
            const newRow = newAggregated[department] || { Male: 0, Female: 0, MCh: 0, FCh: 0 };
            const oldRow = oldAggregated[department] || { Male: 0, Female: 0, MCh: 0, FCh: 0 };

            // Calculate totals for the row
            const newTotal = newRow.Male + newRow.Female + newRow.MCh + newRow.FCh;
            const oldTotal = oldRow.Male + oldRow.Female + oldRow.MCh + oldRow.FCh;
            const combinedTotal = newTotal + oldTotal;

            return (
              <tr
                key={`row-${department}-${index}`}
                style={{
                  fontSize: '11px',
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                }}
              >
                <td
                  style={{
                    padding: '6px',
                    textAlign: 'left',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  {department || '-'}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {newRow.Male}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {newRow.Female}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {newRow.MCh}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {newRow.FCh}
                </td>
                <td
                  style={{
                    padding: '6px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                    backgroundColor: '#2E91C3',
                    color: 'black',

                  }}
                >
                  {newTotal}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {oldRow.Male}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {oldRow.Female}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {oldRow.MCh}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {oldRow.FCh}
                </td>
                <td
                  style={{
                    padding: '6px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                    color: 'black',
                    backgroundColor: '#2E91C3',

                  }}
                >
                  {oldTotal}
                </td>
                <td
                  style={{
                    padding: '6px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: 'bold',
                    backgroundColor: '#e9f7fe',
                  }}
                >
                  {combinedTotal}
                </td>
              </tr>
            );
          })}
          <tr style={{ fontWeight: 'bold', fontSize: '12px', backgroundColor: '#e3f2fd' }}>
            <td
              style={{
                padding: '8px',
                border: '1px solid #dee2e6',
                borderTop: '2px solid #3498db',
                textAlign: 'left',
              }}
            >
              Subtotal
            </td>
            <td
              style={{
                padding: '8px',
                border: '1px solid #dee2e6',
                borderTop: '2px solid #3498db',
                textAlign: 'center',
              }}
            >
              {newMaleTotal}
            </td>
            <td
              style={{
                padding: '8px',
                border: '1px solid #dee2e6',
                borderTop: '2px solid #3498db',
                textAlign: 'center',
              }}
            >
              {newFemaleTotal}
            </td>
            <td
              style={{
                padding: '8px',
                border: '1px solid #dee2e6',
                borderTop: '2px solid #3498db',
                textAlign: 'center',
              }}
            >
              {newMChildTotal}
            </td>
            <td
              style={{
                padding: '8px',
                border: '1px solid #dee2e6',
                borderTop: '2px solid #3498db',
                textAlign: 'center',
              }}
            >
              {newFChildTotal}
            </td>
            <td
              style={{
                padding: '8px',
                border: '1px solid #dee2e6',
                borderTop: '2px solid #3498db',
                textAlign: 'center',
                color: '#2c3e50',
              }}
            >
              {newOverTotal}
            </td>
            <td
              style={{
                padding: '8px',
                border: '1px solid #dee2e6',
                borderTop: '2px solid #3498db',
                textAlign: 'center',
              }}
            >
              {oldMaleTotal}
            </td>
            <td
              style={{
                padding: '8px',
                border: '1px solid #dee2e6',
                borderTop: '2px solid #3498db',
                textAlign: 'center',
              }}
            >
              {oldFemaleTotal}
            </td>
            <td
              style={{
                padding: '8px',
                border: '1px solid #dee2e6',
                borderTop: '2px solid #3498db',
                textAlign: 'center',
              }}
            >
              {oldMChildTotal}
            </td>
            <td
              style={{
                padding: '8px',
                border: '1px solid #dee2e6',
                borderTop: '2px solid #3498db',
                textAlign: 'center',
              }}
            >
              {oldFChildTotal}
            </td>
            <td
              style={{
                padding: '8px',
                border: '1px solid #dee2e6',
                borderTop: '2px solid #3498db',
                textAlign: 'center',
                color: '#2c3e50',
              }}
            >
              {oldOverTotal}
            </td>
            <td
              style={{
                padding: '8px',
                border: '1px solid #dee2e6',
                borderTop: '2px solid #3498db',
                textAlign: 'center',
                backgroundColor: '#bbdefb',
              }}
            >
              {newOverTotal + oldOverTotal}
            </td>
          </tr>
        </>
      );
    };

    // Sample data structure matching the image


    const grandTotal = [
      ...(OPCensus.New || []),
      ...(OPCensus.Old || []),
    ].reduce((sum, row) => {
      const rowTotal = parseInt(row.Male || 0) + parseInt(row.Female || 0) + parseInt(row.MCh || 0) + parseInt(row.FCh || 0);
      return sum + rowTotal;
    }, 0);

    return (
      <div
        ref={componentRef}
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
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
            onClick={handlePrint2}
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

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: 'white',
            boxShadow: '0 0 20px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
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
                  colSpan="12"
                  style={{
                    border: 'none',
                    textAlign: 'center',
                    padding: '15px 0',
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  <div>
                    <h2
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
                    <p
                      style={{
                        margin: '10px 0 0',
                        fontSize: '14px',
                        color: '#34495e',
                        fontWeight: '500',
                      }}
                    >
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
                      ): (
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
                    </p>
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
                <th
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '600',
                  }}
                >
                  Department
                </th>
                <th
                  colSpan="5"
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '600',
                  }}
                >
                  New Patients
                </th>
                <th
                  colSpan="5"
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '600',
                  }}
                >
                  Follow-up Patients
                </th>
                <th
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '600',
                  }}
                >
                  Total
                </th>
              </tr>
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '12px',
                  backgroundColor: '#e3f2fd',
                }}
              >
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                ></th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  Male
                </th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  Female
                </th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  M Child
                </th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  F Child
                </th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  Total
                </th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  Male
                </th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  Female
                </th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  M Child
                </th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  F Child
                </th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  Total
                </th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                    backgroundColor: '#bbdefb',
                  }}
                ></th>
              </tr>
            </thead>
            <tbody>{renderTableSection(OPCensus.New, OPCensus.Old, 'OP CENSUS REPORT')}</tbody>
            <tfoot>
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                }}
              >
                <td
                  colSpan="11"
                  style={{
                    padding: '10px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL
                </td>
                <td
                  style={{
                    padding: '10px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#3498db',
                    fontSize: '14px',
                  }}
                >
                  {grandTotal}
                </td>
              </tr>
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
            <p
              style={{
                margin: '0',
                fontSize: '12px',
                color: '#7f8c8d',
                lineHeight: '1.5',
              }}
            >
              <strong>Note:</strong> This report includes both new and follow-up patient visits categorized by department and gender (Male, Female, Male Child, Female Child).
            </p>
          </div>
        </div>
      </div>
    );
  };



  const IPCensusPrint = () => {
    // Helper function to safely get array data
    const getArrayData = (data) => {
      if (Array.isArray(data)) return data;
      if (data && typeof data === 'object') {
        // Check for common property names
        if (data.New && Array.isArray(data.New)) return data.New;
        if (data.Discharge && Array.isArray(data.Discharge)) return data.Discharge;
        if (data.data && Array.isArray(data.data)) return data.data;
        
        // Find any array property
        const arrayKey = Object.keys(data).find(key => Array.isArray(data[key]));
        return arrayKey ? data[arrayKey] : [];
      }
      return [];
    };
  
    // const renderTableSection = (censusData, dischargeData, inpatientCountData, PrevInPatientcount, title) => {
    //   // Safely get arrays from data
    //   const censusArray = getArrayData(censusData);
    //   const dischargeArray = getArrayData(dischargeData);
    //   const inpatientArray = getArrayData(inpatientCountData);
    //   const PrevInPatientArray = getArrayData(PrevInPatientcount);
      
    //   if (censusArray.length === 0 && dischargeArray.length === 0 && inpatientArray.length === 0 && PrevInPatientArray.length === 0) return null;

    //   // Aggregate data by department (for census and discharge)
    //   const aggregateData = (data) => {
    //     if (!Array.isArray(data)) return {};
        
    //     return data.reduce((acc, row) => {
    //       const dept = row?.Department || 'Unknown';
    //       if (!acc[dept]) {
    //         acc[dept] = { Male: 0, Female: 0, MCh: 0, FCh: 0 };
    //       }
    //       acc[dept].Male += parseInt(row.Male || 0);
    //       acc[dept].Female += parseInt(row.Female || 0);
    //       acc[dept].MCh += parseInt(row.MCh || 0);
    //       acc[dept].FCh += parseInt(row.FCh || 0);
    //       return acc;
    //     }, {});
    //   };
  
    //   // Aggregate InPatientCount data by department - simplified for new backend format
    //   const aggregateInPatientData = (data) => {
    //     if (!Array.isArray(data)) return {};
        
    //     return data.reduce((acc, row) => {
    //       const dept = row?.Department || 'Unknown';
    //       if (!acc[dept]) {
    //         acc[dept] = { total: 0 };
    //       }
    //       // Use Count field from new backend response
    //       if (row.Count !== undefined) {
    //         acc[dept].total += parseInt(row.Count || 0);
    //       } else if (row.total !== undefined) {
    //         acc[dept].total += parseInt(row.total || 0);
    //       } else {
    //         // Fallback for old format
    //         acc[dept].total += parseInt(row.Male || 0) + parseInt(row.Female || 0) + 
    //                           parseInt(row.MCh || 0) + parseInt(row.FCh || 0);
    //       }
    //       return acc;
    //     }, {});
    //   };

    //   // Aggregate Previous InPatient data by department
    //   const aggregatePrevPatientData = (data) => {
    //     if (!Array.isArray(data)) return {};
        
    //     return data.reduce((acc, row) => {
    //       const dept = row?.Department || 'Unknown';
    //       if (!acc[dept]) {
    //         acc[dept] = { total: 0 };
    //       }
    //       // Use Count field from new backend response
    //       if (row.Count !== undefined) {
    //         acc[dept].total += parseInt(row.Count || 0);
    //       } else if (row.total !== undefined) {
    //         acc[dept].total += parseInt(row.total || 0);
    //       } else {
    //         // Fallback for old format
    //         acc[dept].total += parseInt(row.Male || 0) + parseInt(row.Female || 0) + 
    //                           parseInt(row.MCh || 0) + parseInt(row.FCh || 0);
    //       }
    //       return acc;
    //     }, {});
    //   };
  
    //   const censusAggregated = aggregateData(censusArray);
    //   const dischargeAggregated = aggregateData(dischargeArray);
    //   const inpatientAggregated = aggregateInPatientData(inpatientArray);
    //   const previnpatientAggregated = aggregatePrevPatientData(PrevInPatientArray);
  
    //   // Calculate totals for Opening (Previous InPatient Count)
    //   const prevInpatientOverTotal = Object.values(previnpatientAggregated).reduce((sum, row) => sum + (row?.total || 0), 0);
      
    //   // Calculate totals for Census Patients
    //   const censusMaleTotal = Object.values(censusAggregated).reduce((sum, row) => sum + (row?.Male || 0), 0);
    //   const censusFemaleTotal = Object.values(censusAggregated).reduce((sum, row) => sum + (row?.Female || 0), 0);
    //   const censusMChildTotal = Object.values(censusAggregated).reduce((sum, row) => sum + (row?.MCh || 0), 0);
    //   const censusFChildTotal = Object.values(censusAggregated).reduce((sum, row) => sum + (row?.FCh || 0), 0);
    //   const censusOverTotal = censusMaleTotal + censusFemaleTotal + censusMChildTotal + censusFChildTotal;
  
    //   // Calculate totals for Discharge Patients
    //   const dischargeMaleTotal = Object.values(dischargeAggregated).reduce((sum, row) => sum + (row?.Male || 0), 0);
    //   const dischargeFemaleTotal = Object.values(dischargeAggregated).reduce((sum, row) => sum + (row?.Female || 0), 0);
    //   const dischargeMChildTotal = Object.values(dischargeAggregated).reduce((sum, row) => sum + (row?.MCh || 0), 0);
    //   const dischargeFChildTotal = Object.values(dischargeAggregated).reduce((sum, row) => sum + (row?.FCh || 0), 0);
    //   const dischargeOverTotal = dischargeMaleTotal + dischargeFemaleTotal + dischargeMChildTotal + dischargeFChildTotal;
  
    //   // Calculate totals for InPatient Count
    //   const inpatientOverTotal = Object.values(inpatientAggregated).reduce((sum, row) => sum + (row?.total || 0), 0);
  
    //   // Get unique departments
    //   const allDepartments = [...new Set([
    //     ...Object.keys(censusAggregated),
    //     ...Object.keys(dischargeAggregated),
    //     ...Object.keys(inpatientAggregated),
    //     ...Object.keys(previnpatientAggregated),
    //   ])].sort();
  
    //   return (
    //     <>
    //       {(censusArray.length > 0 || dischargeArray.length > 0 || inpatientArray.length > 0 || PrevInPatientArray.length > 0) && (
    //         <tr>
    //           <td
    //             colSpan="13"
    //             style={{
    //               border: 'none',
    //               padding: '12px 0 6px',
    //               fontSize: '14px',
    //               fontWeight: 'bold',
    //               textAlign: 'left',
    //               color: '#2c3e50',
    //               borderBottom: '2px solid #3498db',
    //             }}
    //           >
    //             {title}
    //           </td>
    //         </tr>
    //       )}
    //       {allDepartments.map((department, index) => {
    //         const prevInpatientRow = previnpatientAggregated[department] || { total: 0 };
    //         const censusRow = censusAggregated[department] || { Male: 0, Female: 0, MCh: 0, FCh: 0 };
    //         const dischargeRow = dischargeAggregated[department] || { Male: 0, Female: 0, MCh: 0, FCh: 0 };
    //         const inpatientRow = inpatientAggregated[department] || { total: 0 };
            
    //         // Calculate totals for each row
    //         const prevInpatientTotal = prevInpatientRow.total;
    //         const censusTotal = censusRow.Male + censusRow.Female + censusRow.MCh + censusRow.FCh;
    //         const dischargeTotal = dischargeRow.Male + dischargeRow.Female + dischargeRow.MCh + dischargeRow.FCh;
    //         const inpatientTotal = inpatientRow.total;
            
    //         // Calculate combined total (Opening + Census + Discharge + InPatient Count)
    //         const combinedTotal = prevInpatientTotal + censusTotal + dischargeTotal + inpatientTotal;
  
    //         return (
    //           <tr
    //             key={`row-${department}-${index}`}
    //             style={{
    //               fontSize: '11px',
    //               backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
    //             }}
    //           >
    //             <td
    //               style={{
    //                 padding: '6px',
    //                 textAlign: 'left',
    //                 border: '1px solid #dee2e6',
    //                 fontWeight: '500',
    //               }}
    //             >
    //               {department || '-'}
    //             </td>
    //             {/* Opening Column */}
    //             <td
    //               style={{
    //                 padding: '6px',
    //                 textAlign: 'center',
    //                 border: '1px solid #dee2e6',
    //                 fontWeight: '500',
    //                 backgroundColor: '#e3f2fd',
    //               }}
    //             >
    //               {prevInpatientTotal}
    //             </td>
    //             {/* IP Census Patients Columns */}
    //             <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
    //               {censusRow.Male}
    //             </td>
    //             <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
    //               {censusRow.Female}
    //             </td>
    //             <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
    //               {censusRow.MCh}
    //             </td>
    //             <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
    //               {censusRow.FCh}
    //             </td>
    //             <td
    //               style={{
    //                 padding: '6px',
    //                 textAlign: 'center',
    //                 border: '1px solid #dee2e6',
    //                 fontWeight: '500',
    //                 backgroundColor: '#2E91C3',
    //                 color:'black',
    //               }}
    //             >
    //               {censusTotal}
    //             </td>
    //             {/* Discharge Patients Columns */}
    //             <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
    //               {dischargeRow.Male}
    //             </td>
    //             <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
    //               {dischargeRow.Female}
    //             </td>
    //             <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
    //               {dischargeRow.MCh}
    //             </td>
    //             <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
    //               {dischargeRow.FCh}
    //             </td>
    //             <td
    //               style={{
    //                 padding: '6px',
    //                 textAlign: 'center',
    //                 border: '1px solid #dee2e6',
    //                 fontWeight: '500',
    //                 color:'black',
    //                 backgroundColor: '#2E91C3',
    //               }}
    //             >
    //               {dischargeTotal}
    //             </td>
    //             {/* InPatient Count Column */}
    //             <td
    //               style={{
    //                 padding: '6px',
    //                 textAlign: 'center',
    //                 border: '1px solid #dee2e6',
    //                 fontWeight: '500',
    //                 color:'black',
    //                 backgroundColor: '#2E91C3',
    //               }}
    //             >
    //               {inpatientTotal}
    //             </td>
    //             {/* Total Column */}
    //             {/* <td
    //               style={{
    //                 padding: '6px',
    //                 textAlign: 'center',
    //                 border: '1px solid #dee2e6',
    //                 fontWeight: 'bold',
    //                 backgroundColor: '#e9f7fe',
    //               }}
    //             >
    //               {combinedTotal}
    //             </td> */}
    //           </tr>
    //         );
    //       })}
    //       <tr style={{ fontWeight: 'bold', fontSize: '12px', backgroundColor: '#e3f2fd' }}>
    //         <td
    //           style={{
    //             padding: '8px',
    //             border: '1px solid #dee2e6',
    //             borderTop: '2px solid #3498db',
    //             textAlign: 'left',
    //           }}
    //         >
    //           Subtotal
    //         </td>
    //         {/* Opening Subtotal */}
    //         <td
    //           style={{
    //             padding: '8px',
    //             border: '1px solid #dee2e6',
    //             borderTop: '2px solid #3498db',
    //             textAlign: 'center',
    //             backgroundColor: '#e3f2fd',
    //           }}
    //         >
    //           {prevInpatientOverTotal}
    //         </td>
    //         {/* Census Subtotals */}
    //         <td
    //           style={{
    //             padding: '8px',
    //             border: '1px solid #dee2e6',
    //             borderTop: '2px solid #3498db',
    //             textAlign: 'center',
    //           }}
    //         >
    //           {censusMaleTotal}
    //         </td>
    //         <td
    //           style={{
    //             padding: '8px',
    //             border: '1px solid #dee2e6',
    //             borderTop: '2px solid #3498db',
    //             textAlign: 'center',
    //           }}
    //         >
    //           {censusFemaleTotal}
    //         </td>
    //         <td
    //           style={{
    //             padding: '8px',
    //             border: '1px solid #dee2e6',
    //             borderTop: '2px solid #3498db',
    //             textAlign: 'center',
    //           }}
    //         >
    //           {censusMChildTotal}
    //         </td>
    //         <td
    //           style={{
    //             padding: '8px',
    //             border: '1px solid #dee2e6',
    //             borderTop: '2px solid #3498db',
    //             textAlign: 'center',
    //           }}
    //         >
    //           {censusFChildTotal}
    //         </td>
    //         <td
    //           style={{
    //             padding: '8px',
    //             border: '1px solid #dee2e6',
    //             borderTop: '2px solid #3498db',
    //             textAlign: 'center',
    //             color: '#2c3e50',
    //           }}
    //         >
    //           {censusOverTotal}
    //         </td>
    //         {/* Discharge Subtotals */}
    //         <td
    //           style={{
    //             padding: '8px',
    //             border: '1px solid #dee2e6',
    //             borderTop: '2px solid #3498db',
    //             textAlign: 'center',
    //           }}
    //         >
    //           {dischargeMaleTotal}
    //         </td>
    //         <td
    //           style={{
    //             padding: '8px',
    //             border: '1px solid #dee2e6',
    //             borderTop: '2px solid #3498db',
    //             textAlign: 'center',
    //           }}
    //         >
    //           {dischargeFemaleTotal}
    //         </td>
    //         <td
    //           style={{
    //             padding: '8px',
    //             border: '1px solid #dee2e6',
    //             borderTop: '2px solid #3498db',
    //             textAlign: 'center',
    //           }}
    //         >
    //           {dischargeMChildTotal}
    //         </td>
    //         <td
    //           style={{
    //             padding: '8px',
    //             border: '1px solid #dee2e6',
    //             borderTop: '2px solid #3498db',
    //             textAlign: 'center',
    //           }}
    //         >
    //           {dischargeFChildTotal}
    //         </td>
    //         <td
    //           style={{
    //             padding: '8px',
    //             border: '1px solid #dee2e6',
    //             borderTop: '2px solid #3498db',
    //             textAlign: 'center',
    //             color: '#2c3e50',
    //           }}
    //         >
    //           {dischargeOverTotal}
    //         </td>
    //         {/* InPatient Count Subtotal */}
    //         <td
    //           style={{
    //             padding: '8px',
    //             border: '1px solid #dee2e6',
    //             borderTop: '2px solid #3498db',
    //             textAlign: 'center',
    //             color: '#2c3e50',
    //           }}
    //         >
    //           {inpatientOverTotal}
    //         </td>
    //         {/* Total Column Subtotal */}
    //         {/* <td
    //           style={{
    //             padding: '8px',
    //             border: '1px solid #dee2e6',
    //             borderTop: '2px solid #3498db',
    //             textAlign: 'center',
    //             backgroundColor: '#bbdefb',
    //           }}
    //         >
    //           {prevInpatientOverTotal + censusOverTotal + dischargeOverTotal + inpatientOverTotal}
    //         </td> */}
    //       </tr>
    //     </>
    //   );
    // };
  
    // Calculate grand total from all datasets
    
    const renderTableSection = (censusData, dischargeData, inpatientCountData, PrevInPatientcount, title) => {
  // Safely get arrays from data
  const censusArray = getArrayData(censusData);
  const dischargeArray = getArrayData(dischargeData);
  const inpatientArray = getArrayData(inpatientCountData);
  const PrevInPatientArray = getArrayData(PrevInPatientcount);
  
  if (censusArray.length === 0 && dischargeArray.length === 0 && inpatientArray.length === 0 && PrevInPatientArray.length === 0) return null;

  // Aggregate data by department (for census and discharge)
  const aggregateData = (data) => {
    if (!Array.isArray(data)) return {};
    
    return data.reduce((acc, row) => {
      const dept = row?.Department || 'Unknown';
      if (!acc[dept]) {
        acc[dept] = { Male: 0, Female: 0, MCh: 0, FCh: 0 };
      }
      acc[dept].Male += parseInt(row.Male || 0);
      acc[dept].Female += parseInt(row.Female || 0);
      acc[dept].MCh += parseInt(row.MCh || 0);
      acc[dept].FCh += parseInt(row.FCh || 0);
      return acc;
    }, {});
  };

  // Aggregate InPatientCount data by department - simplified for new backend format
  const aggregateInPatientData = (data) => {
    if (!Array.isArray(data)) return {};
    
    return data.reduce((acc, row) => {
      const dept = row?.Department || 'Unknown';
      if (!acc[dept]) {
        acc[dept] = { total: 0 };
      }
      // Use Count field from new backend response
      if (row.Count !== undefined) {
        acc[dept].total += parseInt(row.Count || 0);
      } else if (row.total !== undefined) {
        acc[dept].total += parseInt(row.total || 0);
      } else {
        // Fallback for old format
        acc[dept].total += parseInt(row.Male || 0) + parseInt(row.Female || 0) + 
                          parseInt(row.MCh || 0) + parseInt(row.FCh || 0);
      }
      return acc;
    }, {});
  };

  // Aggregate Previous InPatient data by department
  const aggregatePrevPatientData = (data) => {
    if (!Array.isArray(data)) return {};
    
    return data.reduce((acc, row) => {
      const dept = row?.Department || 'Unknown';
      if (!acc[dept]) {
        acc[dept] = { total: 0 };
      }
      // Use Count field from new backend response
      if (row.Count !== undefined) {
        acc[dept].total += parseInt(row.Count || 0);
      } else if (row.total !== undefined) {
        acc[dept].total += parseInt(row.total || 0);
      } else {
        // Fallback for old format
        acc[dept].total += parseInt(row.Male || 0) + parseInt(row.Female || 0) + 
                          parseInt(row.MCh || 0) + parseInt(row.FCh || 0);
      }
      return acc;
    }, {});
  };

  const censusAggregated = aggregateData(censusArray);
  const dischargeAggregated = aggregateData(dischargeArray);
  const inpatientAggregated = aggregateInPatientData(inpatientArray);
  const previnpatientAggregated = aggregatePrevPatientData(PrevInPatientArray);

  // Calculate totals for Opening (Previous InPatient Count)
  const prevInpatientOverTotal = Object.values(previnpatientAggregated).reduce((sum, row) => sum + (row?.total || 0), 0);
  
  // Calculate totals for Census Patients
  const censusMaleTotal = Object.values(censusAggregated).reduce((sum, row) => sum + (row?.Male || 0), 0);
  const censusFemaleTotal = Object.values(censusAggregated).reduce((sum, row) => sum + (row?.Female || 0), 0);
  const censusMChildTotal = Object.values(censusAggregated).reduce((sum, row) => sum + (row?.MCh || 0), 0);
  const censusFChildTotal = Object.values(censusAggregated).reduce((sum, row) => sum + (row?.FCh || 0), 0);
  const censusOverTotal = censusMaleTotal + censusFemaleTotal + censusMChildTotal + censusFChildTotal;

  // Calculate totals for Discharge Patients
  const dischargeMaleTotal = Object.values(dischargeAggregated).reduce((sum, row) => sum + (row?.Male || 0), 0);
  const dischargeFemaleTotal = Object.values(dischargeAggregated).reduce((sum, row) => sum + (row?.Female || 0), 0);
  const dischargeMChildTotal = Object.values(dischargeAggregated).reduce((sum, row) => sum + (row?.MCh || 0), 0);
  const dischargeFChildTotal = Object.values(dischargeAggregated).reduce((sum, row) => sum + (row?.FCh || 0), 0);
  const dischargeOverTotal = dischargeMaleTotal + dischargeFemaleTotal + dischargeMChildTotal + dischargeFChildTotal;

  // Calculate totals for InPatient Count
  const inpatientOverTotal = Object.values(inpatientAggregated).reduce((sum, row) => sum + (row?.total || 0), 0);

  // Get unique departments
  const allDepartments = [...new Set([
    ...Object.keys(censusAggregated),
    ...Object.keys(dischargeAggregated),
    ...Object.keys(inpatientAggregated),
    ...Object.keys(previnpatientAggregated),
  ])].sort();

  return (
    <>
      {(censusArray.length > 0 || dischargeArray.length > 0 || inpatientArray.length > 0 || PrevInPatientArray.length > 0) && (
        <tr>
          <td
            colSpan="13"
            style={{
              border: 'none',
              padding: '12px 0 6px',
              fontSize: '16px', // Increased from 14px
              fontWeight: '900', // Increased from bold (700) to 900
              textAlign: 'left',
              color: '#2c3e50',
              borderBottom: '2px solid #3498db',
            }}
          >
            {title}
          </td>
        </tr>
      )}
      {allDepartments.map((department, index) => {
        const prevInpatientRow = previnpatientAggregated[department] || { total: 0 };
        const censusRow = censusAggregated[department] || { Male: 0, Female: 0, MCh: 0, FCh: 0 };
        const dischargeRow = dischargeAggregated[department] || { Male: 0, Female: 0, MCh: 0, FCh: 0 };
        const inpatientRow = inpatientAggregated[department] || { total: 0 };
        
        // Calculate totals for each row
        const prevInpatientTotal = prevInpatientRow.total;
        const censusTotal = censusRow.Male + censusRow.Female + censusRow.MCh + censusRow.FCh;
        const dischargeTotal = dischargeRow.Male + dischargeRow.Female + dischargeRow.MCh + dischargeRow.FCh;
        const inpatientTotal = inpatientRow.total;
        
        // Calculate combined total (Opening + Census + Discharge + InPatient Count)
        const combinedTotal = prevInpatientTotal + censusTotal + dischargeTotal + inpatientTotal;

        return (
          <tr
            key={`row-${department}-${index}`}
            style={{
              fontSize: '12px', // Increased from 11px
              backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
            }}
          >
            <td
              style={{
                padding: '6px',
                textAlign: 'left',
                border: '1px solid #dee2e6',
                fontWeight: '700', // Increased from 500 to 700
              }}
            >
              {department || '-'}
            </td>
            {/* Opening Column */}
            <td
              style={{
                padding: '6px',
                textAlign: 'center',
                border: '1px solid #dee2e6',
                fontWeight: '700', // Increased from 500 to 700
                backgroundColor: '#e3f2fd',
              }}
            >
              {prevInpatientTotal}
            </td>
            {/* IP Census Patients Columns */}
            <td style={{ 
              padding: '6px', 
              textAlign: 'center', 
              border: '1px solid #dee2e6',
              fontWeight: '600' // Added boldness to regular cells
            }}>
              {censusRow.Male}
            </td>
            <td style={{ 
              padding: '6px', 
              textAlign: 'center', 
              border: '1px solid #dee2e6',
              fontWeight: '600' // Added boldness to regular cells
            }}>
              {censusRow.Female}
            </td>
            <td style={{ 
              padding: '6px', 
              textAlign: 'center', 
              border: '1px solid #dee2e6',
              fontWeight: '600' // Added boldness to regular cells
            }}>
              {censusRow.MCh}
            </td>
            <td style={{ 
              padding: '6px', 
              textAlign: 'center', 
              border: '1px solid #dee2e6',
              fontWeight: '600' // Added boldness to regular cells
            }}>
              {censusRow.FCh}
            </td>
            <td
              style={{
                padding: '6px',
                textAlign: 'center',
                border: '1px solid #dee2e6',
                fontWeight: '800', // Increased from 500 to 800
                backgroundColor: '#e3f2fd',
                color:'black',
              }}
            >
              {censusTotal}
            </td>
            {/* Discharge Patients Columns */}
            <td style={{ 
              padding: '6px', 
              textAlign: 'center', 
              border: '1px solid #dee2e6',
              fontWeight: '600' // Added boldness to regular cells
            }}>
              {dischargeRow.Male}
            </td>
            <td style={{ 
              padding: '6px', 
              textAlign: 'center', 
              border: '1px solid #dee2e6',
              fontWeight: '600' // Added boldness to regular cells
            }}>
              {dischargeRow.Female}
            </td>
            <td style={{ 
              padding: '6px', 
              textAlign: 'center', 
              border: '1px solid #dee2e6',
              fontWeight: '600' // Added boldness to regular cells
            }}>
              {dischargeRow.MCh}
            </td>
            <td style={{ 
              padding: '6px', 
              textAlign: 'center', 
              border: '1px solid #dee2e6',
              fontWeight: '600' // Added boldness to regular cells
            }}>
              {dischargeRow.FCh}
            </td>
            <td
              style={{
                padding: '6px',
                textAlign: 'center',
                border: '1px solid #dee2e6',
                fontWeight: '800', // Increased from 500 to 800
                color:'black',
                backgroundColor: '#e3f2fd',
              }}
            >
              {dischargeTotal}
            </td>
            {/* InPatient Count Column */}
            <td
              style={{
                padding: '6px',
                textAlign: 'center',
                border: '1px solid #dee2e6',
                fontWeight: '800', // Increased from 500 to 800
                color:'black',
                backgroundColor: '#e3f2fd',
              }}
            >
              {inpatientTotal}
            </td>
          </tr>
        );
      })}
      <tr style={{ 
        fontWeight: '900', // Increased from bold to 900
        fontSize: '13px', // Increased from 12px
        backgroundColor: '#e3f2fd' 
      }}>
        <td
          style={{
            padding: '8px',
            border: '1px solid #dee2e6',
            borderTop: '2px solid #3498db',
            textAlign: 'left',
            fontWeight: '900', // Added explicit weight
          }}
        >
          Subtotal
        </td>
        {/* Opening Subtotal */}
        <td
          style={{
            padding: '8px',
            border: '1px solid #dee2e6',
            borderTop: '2px solid #3498db',
            textAlign: 'center',
            backgroundColor: '#e3f2fd',
            fontWeight: '900', // Increased boldness
          }}
        >
          {prevInpatientOverTotal}
        </td>
        {/* Census Subtotals */}
        <td
          style={{
            padding: '8px',
            border: '1px solid #dee2e6',
            borderTop: '2px solid #3498db',
            textAlign: 'center',
            fontWeight: '800', // Added boldness
          }}
        >
          {censusMaleTotal}
        </td>
        <td
          style={{
            padding: '8px',
            border: '1px solid #dee2e6',
            borderTop: '2px solid #3498db',
            textAlign: 'center',
            fontWeight: '800', // Added boldness
          }}
        >
          {censusFemaleTotal}
        </td>
        <td
          style={{
            padding: '8px',
            border: '1px solid #dee2e6',
            borderTop: '2px solid #3498db',
            textAlign: 'center',
            fontWeight: '800', // Added boldness
          }}
        >
          {censusMChildTotal}
        </td>
        <td
          style={{
            padding: '8px',
            border: '1px solid #dee2e6',
            borderTop: '2px solid #3498db',
            textAlign: 'center',
            fontWeight: '800', // Added boldness
          }}
        >
          {censusFChildTotal}
        </td>
        <td
          style={{
            padding: '8px',
            border: '1px solid #dee2e6',
            borderTop: '2px solid #3498db',
            textAlign: 'center',
            color: '#2c3e50',
            fontWeight: '900', // Increased boldness
          }}
        >
          {censusOverTotal}
        </td>
        {/* Discharge Subtotals */}
        <td
          style={{
            padding: '8px',
            border: '1px solid #dee2e6',
            borderTop: '2px solid #3498db',
            textAlign: 'center',
            fontWeight: '800', // Added boldness
          }}
        >
          {dischargeMaleTotal}
        </td>
        <td
          style={{
            padding: '8px',
            border: '1px solid #dee2e6',
            borderTop: '2px solid #3498db',
            textAlign: 'center',
            fontWeight: '800', // Added boldness
          }}
        >
          {dischargeFemaleTotal}
        </td>
        <td
          style={{
            padding: '8px',
            border: '1px solid #dee2e6',
            borderTop: '2px solid #3498db',
            textAlign: 'center',
            fontWeight: '800', // Added boldness
          }}
        >
          {dischargeMChildTotal}
        </td>
        <td
          style={{
            padding: '8px',
            border: '1px solid #dee2e6',
            borderTop: '2px solid #3498db',
            textAlign: 'center',
            fontWeight: '800', // Added boldness
          }}
        >
          {dischargeFChildTotal}
        </td>
        <td
          style={{
            padding: '8px',
            border: '1px solid #dee2e6',
            borderTop: '2px solid #3498db',
            textAlign: 'center',
            color: '#2c3e50',
            fontWeight: '900', // Increased boldness
          }}
        >
          {dischargeOverTotal}
        </td>
        {/* InPatient Count Subtotal */}
        <td
          style={{
            padding: '8px',
            border: '1px solid #dee2e6',
            borderTop: '2px solid #3498db',
            textAlign: 'center',
            color: '#2c3e50',
            fontWeight: '900', // Increased boldness
          }}
        >
          {inpatientOverTotal}
        </td>
      </tr>
    </>
  );
    };
    
    const calculateGrandTotal = () => {
      const censusArray = getArrayData(IPCensusdata);
      const dischargeArray = getArrayData(IPCensusDisdata);
      const inpatientArray = getArrayData(InPatientcount);
      const prevInpatientArray = getArrayData(PrevInPatientcount);
      
      const calculateCensusDischargeTotal = (arr) => {
        if (!Array.isArray(arr)) return 0;
        return arr.reduce((sum, row) => {
          const rowTotal = parseInt(row?.Male || 0) + 
                           parseInt(row?.Female || 0) + 
                           parseInt(row?.MCh || 0) + 
                           parseInt(row?.FCh || 0);
          return sum + rowTotal;
        }, 0);
      };
      
      const calculateInpatientTotal = (arr) => {
        if (!Array.isArray(arr)) return 0;
        return arr.reduce((sum, row) => {
          // Use Count field from new backend response
          if (row.Count !== undefined) {
            return sum + parseInt(row?.Count || 0);
          } else if (row.total !== undefined) {
            return sum + parseInt(row?.total || 0);
          } else {
            // Fallback for old format
            return sum + parseInt(row?.Male || 0) + parseInt(row?.Female || 0) + 
                   parseInt(row?.MCh || 0) + parseInt(row?.FCh || 0);
          }
        }, 0);
      };
      
      return calculateInpatientTotal(prevInpatientArray) + 
             calculateCensusDischargeTotal(censusArray) + 
             calculateCensusDischargeTotal(dischargeArray) + 
             calculateInpatientTotal(inpatientArray);
    };
  
    const grandTotal = calculateGrandTotal();
  
    return (
      <div
        ref={componentRef}
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
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
            onClick={handlePrint2}
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
  
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
            backgroundColor: 'white',
            boxShadow: '0 0 20px rgba(0,0,0,0.1)',
            borderRadius: '8px',
            padding: '20px',
          }}
        >
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
                  colSpan="14"
                  style={{
                    border: 'none',
                    textAlign: 'center',
                    padding: '15px 0',
                    backgroundColor: '#f8f9fa',
                  }}
                >
                  <div>
                    <h2
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
                    <p
                      style={{
                        margin: '10px 0 0',
                        fontSize: '14px',
                        color: '#34495e',
                        fontWeight: '500',
                      }}
                    >
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
                    </p>
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
                <th
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '600',
                  }}
                >
                  Department
                </th>
                <th
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '600',
                  }}
                >
                  Opening
                </th>
                <th
                  colSpan="5"
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '600',
                  }}
                >
                  IP Census Patients
                </th>
                <th
                  colSpan="5"
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '600',
                  }}
                >
                  Discharge Patients
                </th>
                <th
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '600',
                  }}
                >
                  InPatient Count
                </th>
                {/* <th
                  style={{
                    padding: '10px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '600',
                  }}
                >
                  Total
                </th> */}
              </tr>
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '12px',
                  backgroundColor: '#e3f2fd',
                }}
              >
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                ></th>
                {/* Opening Header */}
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  Count
                </th>
                {/* IP Census Patients Headers */}
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  Male
                </th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  Female
                </th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  M Child
                </th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  F Child
                </th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  Total
                </th>
                {/* Discharge Patients Headers */}
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  Male
                </th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  Female
                </th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  M Child
                </th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  F Child
                </th>
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  Total
                </th>
                {/* InPatient Count Header */}
                <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                  }}
                >
                  Count
                </th>
                {/* Total Header */}
                {/* <th
                  style={{
                    padding: '8px',
                    textAlign: 'center',
                    border: '1px solid #dee2e6',
                    fontWeight: '500',
                    backgroundColor: '#bbdefb',
                  }}
                >
                  Total
                </th> */}
              </tr>
            </thead>
            <tbody>
              {renderTableSection(
                IPCensusdata,
                IPCensusDisdata,
                InPatientcount,
                PrevInPatientcount,
                'IP CENSUS REPORT'
              )}
            </tbody>
            {/* <tfoot>
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                }}
              >
                <td
                  colSpan="13"
                  style={{
                    padding: '10px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL
                </td>
                <td
                  style={{
                    padding: '10px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#3498db',
                    fontSize: '14px',
                  }}
                >
                  {grandTotal}
                </td>
              </tr>
            </tfoot> */}
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
            <p
              style={{
                margin: '0',
                fontSize: '12px',
                color: '#7f8c8d',
                lineHeight: '1.5',
              }}
            >
              <strong>Note:</strong> This report includes Opening counts, IP census, discharge patient counts, and total inpatient counts categorized by department.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const RevisitPatientListPrint = () => {
    const componentRef = React.useRef();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filteredData, setFilteredData] = React.useState(RevisitPatientList);

    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle: 'Revisit_Patient_List_Report',
    });

    // Handle search
    React.useEffect(() => {
      if (searchTerm.trim() === '') {
        setFilteredData(RevisitPatientList);
      } else {
        const filtered = RevisitPatientList.filter(row =>
          Object.values(row).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        setFilteredData(filtered);
      }
    }, [searchTerm, RevisitPatientList]);

    // Calculate grand total based on filtered data
    const grandTotal = filteredData.length || 0;

    const renderTableSection = (newData, title) => {
      if (!newData || newData.length === 0) return null;

      return (
        <>
          {newData.length > 0 && (
            <>
              <tr>
                <td
                  colSpan="6"
                  style={{
                    border: 'none',
                    padding: '12px 0 6px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    color: '#2c3e50',
                    borderBottom: '2px solid #3498db',
                  }}
                >
                  RevisitPatient List
                </td>
              </tr>
              {newData.map((patient, index) => (
                <tr
                  key={`patient-${index}`}
                  style={{
                    fontSize: '11px',
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                  }}
                >
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.OPDate}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.PatientId}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                    {patient.PatientName}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.Sex}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.Age}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.DeptName}
                  </td>
                </tr>
              ))}
            </>
          )}
        </>
      );
    };

    // Format date range
    const reportDateRange =
  searchOptions.DateType === 'Current'
    ? `Report Date: ${new Date(searchOptions.CurrentDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}`
    : searchOptions.DateType === 'Particular'
    ? `Report Date: ${new Date(searchOptions.ParticularDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}`
    : `Report From: ${new Date(searchOptions.FromDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}

       To: ${new Date(searchOptions.ToDate || new Date())
         .toLocaleDateString('en-GB', {
           day: '2-digit',
           month: '2-digit',
           year: '2-digit',
         })
         .replace(/\//g, '-')}`;


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
        `}
        </style>

        {/* Search Container */}
        <div className="search-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="patientSearch" style={{ fontWeight: '600', color: '#374151' }}>
              Search Patient:
            </label>
            <input
              id="patientSearch"
              type="text"
              className="search-input"
              placeholder="Search by Date, Patient ID, Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="results-info">
            Showing {filteredData.length} of {RevisitPatientList.length} records
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
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Date
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  PatientId
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Patient Name
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Gender
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Age
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Dept Name
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                renderTableSection(filteredData, 'REVISIT PATIENT REPORT')
              ) : (
                <tr>
                  <td colSpan="6" style={{ border: '1px solid #dee2e6', padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                    No records found for "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
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
                    colSpan="5"
                    style={{
                      padding: '10px',
                      border: '1px solid #dee2e6',
                      borderTop: '2px solid #3498db',
                      textAlign: 'right',
                    }}
                  >
                    GRAND TOTAL ({filteredData.length} records)
                  </td>
                  <td
                    style={{
                      padding: '10px',
                      border: '1px solid #dee2e6',
                      borderTop: '2px solid #3498db',
                      textAlign: 'center',
                      backgroundColor: '#3498db',
                      fontSize: '14px',
                    }}
                  >
                    {grandTotal}
                  </td>
                </tr>
              )}
            </tfoot>
          </table>

          <div
            className="footer-text"
            style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderLeft: '4px solid #3498db',
              borderRadius: '4px',
            }}
          >
            <p
              style={{
                margin: '0',
                fontSize: '12px',
                color: '#7f8c8d',
                lineHeight: '1.5',
              }}
            >
              <strong>Note:</strong> This report includes revisit patient visits with details of date, OP number, patient name, gender, age, and department.
            </p>
          </div>
        </div>
      </div>
    );
  };


  const NewPatientListPrint = () => {
    const componentRef = React.useRef();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filteredData, setFilteredData] = React.useState(NewPatientList);

    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle: 'New_Patient_List_Report',
    });

    // Handle search
    React.useEffect(() => {
      if (searchTerm.trim() === '') {
        setFilteredData(NewPatientList);
      } else {
        const filtered = NewPatientList.filter(row =>
          Object.values(row).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        setFilteredData(filtered);
      }
    }, [searchTerm, NewPatientList]);

    // Calculate grand total based on filtered data
    const grandTotal = filteredData.length || 0;

    const renderTableSection = (newData, title) => {
      if (!newData || newData.length === 0) return null;

      return (
        <>
          {newData.length > 0 && (
            <>
              <tr>
                <td
                  colSpan="6"
                  style={{
                    border: 'none',
                    padding: '12px 0 6px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    textAlign: 'left',
                    color: '#2c3e50',
                    borderBottom: '2px solid #3498db',
                  }}
                >
                  NewPatient List
                </td>
              </tr>
              {newData.map((patient, index) => (
                <tr
                  key={`patient-${index}`}
                  style={{
                    fontSize: '11px',
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                  }}
                >
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.OPDate}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.PatientId}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                    {patient.PatientName}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.Sex}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.Age}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.DeptName}
                  </td>
                </tr>
              ))}
            </>
          )}
        </>
      );
    };

    // Format date range
    const reportDateRange =
  searchOptions.DateType === 'Current'
    ? `Report Date: ${new Date(searchOptions.CurrentDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}`
    : searchOptions.DateType === 'Particular'
    ? `Report Date: ${new Date(searchOptions.ParticularDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}`
    : `Report From: ${new Date(searchOptions.FromDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}

       To: ${new Date(searchOptions.ToDate || new Date())
         .toLocaleDateString('en-GB', {
           day: '2-digit',
           month: '2-digit',
           year: '2-digit',
         })
         .replace(/\//g, '-')}`;


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
        `}
        </style>

        {/* Search Container */}
        <div className="search-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="patientSearch" style={{ fontWeight: '600', color: '#374151' }}>
              Search Patient:
            </label>
            <input
              id="patientSearch"
              type="text"
              className="search-input"
              placeholder="Search by Date, Patient ID, Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="results-info">
            Showing {filteredData.length} of {NewPatientList.length} records
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
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Date
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  PatientId
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Patient Name
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Gender
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Age
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Dept Name
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                renderTableSection(filteredData, 'NEW PATIENT REPORT')
              ) : (
                <tr>
                  <td colSpan="6" style={{ border: '1px solid #dee2e6', padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                    No records found for "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
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
                    colSpan="5"
                    style={{
                      padding: '10px',
                      border: '1px solid #dee2e6',
                      borderTop: '2px solid #3498db',
                      textAlign: 'right',
                    }}
                  >
                    GRAND TOTAL ({filteredData.length} records)
                  </td>
                  <td
                    style={{
                      padding: '10px',
                      border: '1px solid #dee2e6',
                      borderTop: '2px solid #3498db',
                      textAlign: 'center',
                      backgroundColor: '#3498db',
                      fontSize: '14px',
                    }}
                  >
                    {grandTotal}
                  </td>
                </tr>
              )}
            </tfoot>
          </table>

          <div
            className="footer-text"
            style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderLeft: '4px solid #3498db',
              borderRadius: '4px',
            }}
          >
            <p
              style={{
                margin: '0',
                fontSize: '12px',
                color: '#7f8c8d',
                lineHeight: '1.5',
              }}
            >
              <strong>Note:</strong> This report includes new patient visits with details of date, OP number, patient name, gender, age, and department.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const NewandRevisitListPrint = () => {
    const componentRef = React.useRef();
    const [searchTerm, setSearchTerm] = React.useState('');

    // Filter New and Old lists separately
    const filteredNew = (RevisitandPatientList.New || []).filter(row =>
      Object.values(row).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    const filteredOld = (RevisitandPatientList.Old || []).filter(row =>
      Object.values(row).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    const grandTotal = filteredNew.length + filteredOld.length;

    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle: 'New_and_Revisit_List_Report',
    });

    const renderTableSection = (data, title) => {
      if (!data || data.length === 0) return null;

      const subtotal = data.length;

      return (
        <>
          <tr>
            <td
              colSpan="7"
              style={{
                border: 'none',
                padding: '10px 0',
                fontSize: '12px',
                fontWeight: 'bold',
                textAlign: 'left',
                color: '#2c3e50',
                borderBottom: '2px solid #3498db',
              }}
            >
              {title}
            </td>
          </tr>
          {data.map((row, index) => (
            <tr
              key={`${title}-${index}`}
              style={{
                fontSize: '10px',
                backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
              }}
            >
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {index + 1}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {row.PatientId || '-'}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {row.OPDate || '-'}
              </td>
              <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                {row.PatientName || '-'}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {row.Sex || '-'}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {row.Age || '-'}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {row.DeptName || '-'}
              </td>
            </tr>
          ))}
          <tr style={{ fontWeight: 'bold', fontSize: '12px' }}>
            <td
              colSpan="6"
              style={{
                borderTop: '1px solid #dee2e6',
                padding: '6px',
                textAlign: 'right',
              }}
            >
              Subtotal
            </td>
            <td
              style={{
                borderTop: '1px solid #dee2e6',
                padding: '6px',
                textAlign: 'center',
                backgroundColor: '#e9f7fe',
              }}
            >
              {subtotal}
            </td>
          </tr>
        </>
      );
    };

    // Format date range
    const reportDateRange =
  searchOptions.DateType === 'Current'
    ? `Report Date: ${new Date(searchOptions.CurrentDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}`
    : searchOptions.DateType === 'Particular'
    ? `Report Date: ${new Date(searchOptions.ParticularDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}`
    : `Report From: ${new Date(searchOptions.FromDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}

       To: ${new Date(searchOptions.ToDate || new Date())
         .toLocaleDateString('en-GB', {
           day: '2-digit',
           month: '2-digit',
           year: '2-digit',
         })
         .replace(/\//g, '-')}`;


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
        `}
        </style>

        {/* Search Container */}
        <div className="search-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="patientSearch" style={{ fontWeight: '600', color: '#374151' }}>
              Search Patient:
            </label>
            <input
              id="patientSearch"
              type="text"
              className="search-input"
              placeholder="Search by Patient ID, Name, Department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="results-info">
            Showing {grandTotal} of {(RevisitandPatientList.New?.length || 0) + (RevisitandPatientList.Old?.length || 0)} records
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
                  colSpan="7"
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
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  S.No
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  PatientId
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Date
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Patient Name
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Gender
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Age
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Dept Name
                </th>
              </tr>
            </thead>
            <tbody>
              {renderTableSection(filteredNew, 'New Patient List')}
              {renderTableSection(filteredOld, 'Revisit Patient List')}
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                }}
              >
                <td
                  colSpan="6"
                  style={{
                    padding: '10px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL ({grandTotal} records)
                </td>
                <td
                  style={{
                    padding: '10px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#3498db',
                    fontSize: '14px',
                  }}
                >
                  {grandTotal}
                </td>
              </tr>
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
            }}
          >
            <p
              style={{
                margin: '0',
                fontSize: '12px',
                color: '#7f8c8d',
                lineHeight: '1.5',
              }}
            >
              <strong>Note:</strong> This report includes new and revisit patient visits with details of date, OP number, patient name, gender, age, and department.
            </p>
          </div>
        </div>
      </div>
    );
  };


  const InPatientListPrint = () => {
    const componentRef = React.useRef();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filteredData, setFilteredData] = React.useState(InPatientList);

    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle: 'In_Patient_List_Report',
    });

    // Handle search
    React.useEffect(() => {
      if (searchTerm.trim() === '') {
        setFilteredData(InPatientList);
      } else {
        const filtered = InPatientList.filter(row =>
          Object.values(row).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        setFilteredData(filtered);
      }
    }, [searchTerm, InPatientList]);

    // Calculate grand total based on filtered data
    const grandTotal = filteredData.length || 0;

    const renderTableSection = (newData, title) => {
      if (!newData || newData.length === 0) return null;

      return (
        <>
          {newData.length > 0 && (
            <>
              {newData.map((patient, index) => (
                <tr
                  key={`patient-${index}`}
                  style={{
                    fontSize: '11px',
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                  }}
                >
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.IPNo}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.PatientId}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                    <div>{patient.PatientName}</div>
                    <div>{patient.prefix}</div>
                    <div>{patient.Address}</div>
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.Dept || 'N/A'}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.gender}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.Age}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.AdmissionDate}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.AdmissionTime}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.WardName || 'N/A'}
                  </td>
                  {/* <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.Floor || 'N/A'}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.Bedno || 'N/A'}
                  </td> */}
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.Createdby || 'N/A'}
                  </td>
                </tr>
              ))}
            </>
          )}
        </>
      );
    };

    // Format date range
    const reportDateRange =
  searchOptions.DateType === 'Current'
    ? `Report Date: ${new Date(searchOptions.CurrentDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}`
    : searchOptions.DateType === 'Particular'
    ? `Report Date: ${new Date(searchOptions.ParticularDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}`
    : `Report From: ${new Date(searchOptions.FromDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}

       To: ${new Date(searchOptions.ToDate || new Date())
         .toLocaleDateString('en-GB', {
           day: '2-digit',
           month: '2-digit',
           year: '2-digit',
         })
         .replace(/\//g, '-')}`;


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
        `}
        </style>

        {/* Search Container */}
        <div className="search-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="patientSearch" style={{ fontWeight: '600', color: '#374151' }}>
              Search Patient:
            </label>
            <input
              id="patientSearch"
              type="text"
              className="search-input"
              placeholder="Search by IP No, Patient ID, Name, Address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="results-info">
            Showing {filteredData.length} of {InPatientList.length} records
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

        <div className="print-container report-container">
          <div ref={componentRef}>
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
                    colSpan="11"
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
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    IPNo
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    PatientId
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Patient Details
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Department
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Gender
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Age
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Admission Date
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Admission Time
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Ward Name
                  </th>
                  {/* <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Floor Name
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Bed No
                  </th> */}
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Prepared
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  renderTableSection(filteredData, 'IN-PATIENT REPORT')
                ) : (
                  <tr>
                    <td colSpan="11" style={{ border: '1px solid #dee2e6', padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                      No records found for "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
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
                      colSpan="9"
                      style={{
                        padding: '10px',
                        border: '1px solid #dee2e6',
                        borderTop: '2px solid #3498db',
                        textAlign: 'right',
                      }}
                    >
                      GRAND TOTAL ({filteredData.length} records)
                    </td>
                    <td
                      style={{
                        padding: '10px',
                        border: '1px solid #dee2e6',
                        borderTop: '2px solid #3498db',
                        textAlign: 'center',
                        backgroundColor: '#3498db',
                        fontSize: '14px',
                      }}
                    >
                      {grandTotal}
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>

            <div
              className="footer-text"
              style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderLeft: '4px solid #3498db',
                borderRadius: '4px',
              }}
            >
              <p
                style={{
                  margin: '0',
                  fontSize: '12px',
                  color: '#7f8c8d',
                  lineHeight: '1.5',
                }}
              >
                <strong>Note:</strong> This report includes in-patient details with IP number, patient name, prefix, address, department, gender, age, admission date, and ward.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AdmissionListPrint = () => {
    const componentRef = React.useRef();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filteredData, setFilteredData] = React.useState(AdmissionList);

    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle: 'Admission_List_Report',
    });

    // Handle search
    React.useEffect(() => {
      if (searchTerm.trim() === '') {
        setFilteredData(AdmissionList);
      } else {
        const filtered = AdmissionList.filter(row =>
          Object.values(row).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        setFilteredData(filtered);
      }
    }, [searchTerm, AdmissionList]);

    // Calculate grand total based on filtered data
    const grandTotal = filteredData.length || 0;

    const renderTableSection = (newData, title) => {
      if (!newData || newData.length === 0) return null;

      return (
        <>
          <tr>
            <td
              colSpan="9"
              style={{
                border: 'none',
                padding: '12px 0 6px',
                fontSize: '14px',
                fontWeight: 'bold',
                textAlign: 'left',
                color: '#2c3e50',
                borderBottom: '2px solid #3498db',
              }}
            >
              Admission List
            </td>
          </tr>
          {newData.length > 0 && (
            <>
              {newData.map((patient, index) => (
                <tr
                  key={`patient-${index}`}
                  style={{
                    fontSize: '11px',
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                  }}
                >
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.IPNo}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.PatientId}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                    <div>{patient.PatientName}</div>
                    <div>{patient.prefix}</div>
                    <div>{patient.Address}</div>
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.Dept || 'N/A'}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.gender}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.Age}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.AdmissionDate}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.AdmissionTime}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.WardName || 'N/A'}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.Createdby || 'N/A'}
                  </td>
                </tr>
              ))}
            </>
          )}
        </>
      );
    };

    // Format date range
    const reportDateRange =
  searchOptions.DateType === 'Current'
    ? `Report Date: ${new Date(searchOptions.CurrentDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}`
    : searchOptions.DateType === 'Particular'
    ? `Report Date: ${new Date(searchOptions.ParticularDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}`
    : `Report From: ${new Date(searchOptions.FromDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}

       To: ${new Date(searchOptions.ToDate || new Date())
         .toLocaleDateString('en-GB', {
           day: '2-digit',
           month: '2-digit',
           year: '2-digit',
         })
         .replace(/\//g, '-')}`;


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
        `}
        </style>

        {/* Search Container */}
        <div className="search-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="patientSearch" style={{ fontWeight: '600', color: '#374151' }}>
              Search Patient:
            </label>
            <input
              id="patientSearch"
              type="text"
              className="search-input"
              placeholder="Search by IP No, Patient ID, Name, Address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="results-info">
            Showing {filteredData.length} of {AdmissionList.length} records
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

        <div className="print-container report-container">
          <div ref={componentRef}>
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
                        Vilayodi, Chittur, Palakkad
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
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    IPNo
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    PatientId
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Patient Details
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Department
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Gender
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Age
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Admission Date
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Admission Time
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Ward Name
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Prepared
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  renderTableSection(filteredData, 'IN-PATIENT REPORT')
                ) : (
                  <tr>
                    <td colSpan="9" style={{ border: '1px solid #dee2e6', padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                      No records found for "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
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
                      colSpan="9"
                      style={{
                        padding: '10px',
                        border: '1px solid #dee2e6',
                        borderTop: '2px solid #3498db',
                        textAlign: 'right',
                      }}
                    >
                      GRAND TOTAL ({filteredData.length} records)
                    </td>
                    <td
                      style={{
                        padding: '10px',
                        border: '1px solid #dee2e6',
                        borderTop: '2px solid #3498db',
                        textAlign: 'center',
                        backgroundColor: '#3498db',
                        fontSize: '14px',
                      }}
                    >
                      {grandTotal}
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>

            <div
              className="footer-text"
              style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderLeft: '4px solid #3498db',
                borderRadius: '4px',
              }}
            >
              <p
                style={{
                  margin: '0',
                  fontSize: '12px',
                  color: '#7f8c8d',
                  lineHeight: '1.5',
                }}
              >
                <strong>Note:</strong> This report includes in-patient details with IP number, patient name, prefix, address, department, gender, age, admission date, and ward.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const DischargeListprint = () => {
    const componentRef = React.useRef();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filteredData, setFilteredData] = React.useState(DischargeList);

    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle: 'Discharge_List_Report',
    });

    // Handle search
    React.useEffect(() => {
      if (searchTerm.trim() === '') {
        setFilteredData(DischargeList);
      } else {
        const filtered = DischargeList.filter(row =>
          Object.values(row).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        setFilteredData(filtered);
      }
    }, [searchTerm, DischargeList]);

    // Calculate overall statistics
    const overallStats = filteredData.reduce((stats, patient) => {
      stats.totalPatients++;
      stats.totalDays += patient.NoOfDays || 0;
      return stats;
    }, { totalPatients: 0, totalDays: 0 });

    // Calculate average days
    const averageDays = overallStats.totalPatients > 0
      ? (overallStats.totalDays / overallStats.totalPatients).toFixed(1)
      : '0.0';

    const renderTableSection = (newData, title) => {
      if (!newData || newData.length === 0) return null;

      return (
        <>
          {newData.length > 0 && (
            <>
              {newData.map((patient, index) => (
                <tr
                  key={`patient-${index}`}
                  style={{
                    fontSize: '11px',
                    backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                  }}
                >
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.IPNo}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.PatientId}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                    <div>{patient.PatientName}</div>
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.Dept || 'N/A'}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.Gender}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.Age}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.WardName || 'N/A'}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.AdmissionDate}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.Discharge_Date}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.NoOfDays || 'N/A'}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.Discharge_Time}
                  </td>
                  <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                    {patient.Dischargedby}
                  </td>
                </tr>
              ))}
            </>
          )}
        </>
      );
    };

    // Format date range
    const reportDateRange =
  searchOptions.DateType === 'Current'
    ? `Report Date: ${new Date(searchOptions.CurrentDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}`
    : searchOptions.DateType === 'Particular'
    ? `Report Date: ${new Date(searchOptions.ParticularDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}`
    : `Report From: ${new Date(searchOptions.FromDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}

       To: ${new Date(searchOptions.ToDate || new Date())
         .toLocaleDateString('en-GB', {
           day: '2-digit',
           month: '2-digit',
           year: '2-digit',
         })
         .replace(/\//g, '-')}`;


    return (
      <div
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          padding: '20px',
          maxWidth: '1300px',
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
            .summary-container {
              display: block !important;
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
            color: '#6b7280';
            margin-left: auto;
          }
          .clear-search {
            background-color: #6b7280;
          }
          .clear-search:hover {
            background-color: #4b5563;
          }
          .summary-container {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            padding: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            color: white;
            font-weight: 600;
          }
          .summary-item {
            text-align: center;
          }
          .summary-value {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .summary-label {
            font-size: 14px;
            opacity: 0.9;
          }
        `}
        </style>

        {/* Search Container */}
        <div className="search-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="patientSearch" style={{ fontWeight: '600', color: '#374151' }}>
              Search Patient:
            </label>
            <input
              id="patientSearch"
              type="text"
              className="search-input"
              placeholder="Search by IP No, Patient ID, Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="results-info">
            Showing {filteredData.length} of {DischargeList.length} records
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

        {/* Overall Summary */}
        {filteredData.length > 0 && (
          <div className="summary-container">
            <div className="summary-item">
              <div className="summary-value">{overallStats.totalPatients}</div>
              <div className="summary-label">Total Discharges</div>
            </div>
            <div className="summary-item">
              <div className="summary-value">{overallStats.totalDays}</div>
              <div className="summary-label">Total Days</div>
            </div>
            <div className="summary-item">
              <div className="summary-value">{averageDays}</div>
              <div className="summary-label">Average Stay (Days)</div>
            </div>
            <div className="summary-item">
              <div className="summary-value">
                {[...new Set(filteredData.map(item => item.Dept))].length}
              </div>
              <div className="summary-label">Departments</div>
            </div>
          </div>
        )}

        <div className="print-container report-container">
          <div ref={componentRef}>
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
                    colSpan="12"
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
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    IPNo
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    PatientId
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Patient Details
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Department
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Gender
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Age
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Ward Name
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Admission Date
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Discharge Date
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    No of Days
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Discharge Time
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    DischargedBy
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  renderTableSection(filteredData, 'IN-PATIENT DISCHARGE REPORT')
                ) : (
                  <tr>
                    <td colSpan="12" style={{ border: '1px solid #dee2e6', padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                      No records found for "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
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
                      colSpan="9"
                      style={{
                        padding: '10px',
                        border: '1px solid #dee2e6',
                        borderTop: '2px solid #3498db',
                        textAlign: 'right',
                      }}
                    >
                      GRAND TOTAL
                    </td>
                    <td
                      style={{
                        padding: '10px',
                        border: '1px solid #dee2e6',
                        borderTop: '2px solid #3498db',
                        textAlign: 'center',
                        backgroundColor: '#27ae60',
                        fontSize: '14px',
                      }}
                    >
                      {overallStats.totalDays}
                    </td>
                    <td
                      colSpan="2"
                      style={{
                        padding: '10px',
                        border: '1px solid #dee2e6',
                        borderTop: '2px solid #3498db',
                        textAlign: 'right',
                      }}
                    >
                      Total Patients: {overallStats.totalPatients}
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>

            <div
              className="footer-text"
              style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderLeft: '4px solid #3498db',
                borderRadius: '4px',
              }}
            >
              <p
                style={{
                  margin: '0',
                  fontSize: '12px',
                  color: '#7f8c8d',
                  lineHeight: '1.5',
                }}
              >
                <strong>Note:</strong> This report includes in-patient discharge details with IP number, patient name, department, gender, age, ward, admission date, discharge date, length of stay, time, and discharged by.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

 const DischargeSpecialityPrint = () => {
  const componentRef = React.useRef();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showOnlyCount, setShowOnlyCount] = React.useState(false);
  const [filteredData, setFilteredData] = React.useState(DischargeList);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: showOnlyCount ? 'Discharge_Speciality_Count_Report' : 'Discharge_Speciality_Report',
  });

  // Handle search
  React.useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredData(DischargeList);
    } else {
      const filtered = DischargeList.filter(row =>
        Object.values(row).some(value =>
          value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, DischargeList]);

  // Group filtered discharges by Dept (speciality)
  const specialityGroups = filteredData.reduce((acc, patient) => {
    const speciality = patient.Dept || 'Unknown';
    if (!acc[speciality]) {
      acc[speciality] = [];
    }
    acc[speciality].push(patient);
    return acc;
  }, {});

  // Sort specialties alphabetically
  const sortedSpecialities = Object.entries(specialityGroups)
    .sort(([a], [b]) => a.localeCompare(b));

  // Calculate overall statistics
  const overallStats = filteredData.reduce((stats, patient) => {
    stats.totalPatients++;
    stats.totalDays += patient.NoOfDays || 0;
    return stats;
  }, { totalPatients: 0, totalDays: 0 });

  // Calculate average days
  const averageDays = overallStats.totalPatients > 0
    ? (overallStats.totalDays / overallStats.totalPatients).toFixed(1)
    : '0.0';

  const renderTableSection = (specialityData, specialityName, specIndex) => {
    if (!specialityData || specialityData.length === 0) return null;

    // Calculate speciality-specific statistics
    const specialityStats = specialityData.reduce((stats, patient) => {
      stats.totalPatients++;
      stats.totalDays += patient.NoOfDays || 0;
      return stats;
    }, { totalPatients: 0, totalDays: 0 });

    const specialityAverageDays = specialityStats.totalPatients > 0
      ? (specialityStats.totalDays / specialityStats.totalPatients).toFixed(1)
      : '0.0';

    if (showOnlyCount) {
      // Compact view showing only specialty totals
      return (
        <tr
          key={`specialty-${specIndex}`}
          style={{
            backgroundColor: specIndex % 2 === 0 ? '#f8f9fa' : 'white',
            fontSize: '12px',
          }}
        >
          <td style={{ 
            padding: '10px', 
            textAlign: 'center', 
            border: '1px solid #dee2e6',
            fontWeight: '600'
          }}>
            {specIndex + 1}
          </td>
          <td colSpan="3" style={{ 
            padding: '10px', 
            textAlign: 'left', 
            border: '1px solid #dee2e6',
            fontWeight: '600',
            color: '#1e40af'
          }}>
            {specialityName}
          </td>
          <td style={{ 
            padding: '10px', 
            textAlign: 'center', 
            border: '1px solid #dee2e6',
            color: '#059669',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {specialityStats.totalPatients}
          </td>
          <td style={{ 
            padding: '10px', 
            textAlign: 'center', 
            border: '1px solid #dee2e6',
            color: '#d97706',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {specialityStats.totalDays}
          </td>
          <td style={{ 
            padding: '10px', 
            textAlign: 'center', 
            border: '1px solid #dee2e6',
            color: '#dc2626',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {specialityAverageDays}
          </td>
          <td colSpan="2" style={{ 
            padding: '10px', 
            textAlign: 'center', 
            border: '1px solid #dee2e6',
            backgroundColor: '#dbeafe',
            fontWeight: 'bold'
          }}>
            {specialityStats.totalPatients} Patients
          </td>
        </tr>
      );
    }

    // Original detailed view with patient list
    return (
      <>
        <tr key={`header-${specIndex}`}>
          <td
            colSpan="12"
            style={{
              padding: '10px',
              textAlign: 'left',
              fontWeight: 'bold',
              fontSize: '14px',
              backgroundColor: '#e9ecef',
              border: '1px solid #dee2e6',
            }}
          >
            Speciality: {specialityName} | Total Discharges: {specialityStats.totalPatients} |
            Total Days: {specialityStats.totalDays} | Average Days: {specialityAverageDays}
          </td>
        </tr>
        {specialityData.map((patient, index) => (
          <tr
            key={`patient-${specialityName}-${index}`}
            style={{
              fontSize: '11px',
              backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
            }}
          >
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.IPNo}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.PatientId}
            </td>
            <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
              <div>{patient.PatientName}</div>
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.Dept || 'N/A'}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.Gender}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.Age}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.WardName || 'N/A'}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.AdmissionDate}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.Discharge_Date}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.NoOfDays || 'N/A'}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.Discharge_Time}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.Dischargedby}
            </td>
          </tr>
        ))}
      </>
    );
  };

  // Format date range
  const reportDateRange =
    searchOptions.DateType === 'Current'
      ? `Report Date: ${new Date(searchOptions.CurrentDate || new Date())
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })
          .replace(/\//g, '-')}`
      : searchOptions.DateType === 'Particular'
      ? `Report Date: ${new Date(searchOptions.ParticularDate || new Date())
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })
          .replace(/\//g, '-')}`
      : `Report From: ${new Date(searchOptions.FromDate || new Date())
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })
          .replace(/\//g, '-')}
         To: ${new Date(searchOptions.ToDate || new Date())
           .toLocaleDateString('en-GB', {
             day: '2-digit',
             month: '2-digit',
             year: '2-digit',
           })
           .replace(/\//g, '-')}`;

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        maxWidth: '1300px',
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
            .search-container, .toggle-container, .stats-container {
              display: none;
            }
            .report-container {
              font-size: 12px;
            }
            .summary-container {
              display: block !important;
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
            color: '#6b7280';
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
          .toggle-container {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #f8fafc;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
          }
          .toggle-label {
            font-weight: 500;
            color: #374151;
            font-size: 14px;
          }
          .toggle-switch {
            position: relative;
            display: inline-block;
            width: 48px;
            height: 24px;
          }
          .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
          }
          .toggle-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
          }
          input:checked + .toggle-slider {
            background-color: #2563eb;
          }
          input:checked + .toggle-slider:before {
            transform: translateX(24px);
          }
          .summary-container {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            padding: 15px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 8px;
            color: white;
            font-weight: 600;
          }
          .summary-item {
            text-align: center;
          }
          .summary-value {
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 5px;
          }
          .summary-label {
            font-size: 14px;
            opacity: 0.9;
          }
        `}
      </style>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="patientSearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search Patient:
          </label>
          <input
            id="patientSearch"
            type="text"
            className="search-input"
            placeholder="Search by IP No, Patient ID, Name, Department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Toggle for showing only specialty counts */}
          <div className="toggle-container">
            <span className="toggle-label">Specialty Count Only</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={showOnlyCount}
                onChange={(e) => setShowOnlyCount(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="results-info">
          Showing {filteredData.length} of {DischargeList.length} records
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
          {showOnlyCount && (
            <span style={{ color: '#2563eb', marginLeft: '8px' }}>
              • Showing only specialty totals
            </span>
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
            <div className="stat-value">{sortedSpecialities.length}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="stat-label">Total Discharges</div>
            <div className="stat-value">{overallStats.totalPatients}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
            <div className="stat-label">Total Days</div>
            <div className="stat-value">{overallStats.totalDays}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#dc2626' }}>
            <div className="stat-label">Average Days</div>
            <div className="stat-value">{averageDays}</div>
          </div>
        </div>
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

      {/* Overall Summary */}
      {filteredData.length > 0 && (
        <div className="summary-container">
          <div className="summary-item">
            <div className="summary-value">{overallStats.totalPatients}</div>
            <div className="summary-label">Total Discharges</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{overallStats.totalDays}</div>
            <div className="summary-label">Total Days</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{averageDays}</div>
            <div className="summary-label">Average Stay (Days)</div>
          </div>
          <div className="summary-item">
            <div className="summary-value">{sortedSpecialities.length}</div>
            <div className="summary-label">Departments</div>
          </div>
        </div>
      )}

      <div className="print-container report-container">
        <div ref={componentRef}>
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
                  colSpan={showOnlyCount ? "8" : "12"}
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
                    <p style={{ margin: '5px 0', fontSize: '14px', fontWeight: '500' }}>
                      {showOnlyCount ? 'DISCHARGE REPORT - SPECIALTY COUNT' : 'DISCHARGE REPORT - DETAILED VIEW'}
                    </p>
                    {searchTerm && (
                      <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                        Filtered results for: "{searchTerm}"
                      </p>
                    )}
                    {showOnlyCount && (
                      <p style={{ 
                        margin: '5px 0', 
                        fontSize: '14px', 
                        color: '#2563eb', 
                        fontWeight: '500',
                        backgroundColor: '#dbeafe',
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '4px'
                      }}>
                        Viewing Specialty Count Only
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
                {showOnlyCount ? (
                  <>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '8%' }}>
                      S.No
                    </th>
                    <th colSpan="3" style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '42%' }}>
                      Speciality
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '12%' }}>
                      Discharges
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '12%' }}>
                      Total Days
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '13%' }}>
                      Avg Days
                    </th>
                    <th colSpan="2" style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '13%' }}>
                      Specialty Total
                    </th>
                  </>
                ) : (
                  <>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      IPNo
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      PatientId
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      Patient Details
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      Department
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      Gender
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      Age
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      Ward Name
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      Admission Date
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      Discharge Date
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      No of Days
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      Discharge Time
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      DischargedBy
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {sortedSpecialities.length > 0 ? (
                sortedSpecialities.map(([specialityName, records], index) =>
                  renderTableSection(records, specialityName, index)
                )
              ) : (
                <tr>
                  <td 
                    colSpan={showOnlyCount ? "8" : "12"} 
                    style={{ border: '1px solid #dee2e6', padding: '20px', textAlign: 'center', color: '#6b7280' }}
                  >
                    No records found{searchTerm ? ` for "${searchTerm}"` : ''}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
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
                    colSpan={showOnlyCount ? "5" : "9"}
                    style={{
                      padding: '10px',
                      border: '1px solid #dee2e6',
                      borderTop: '2px solid #3498db',
                      textAlign: 'right',
                    }}
                  >
                    GRAND TOTAL ({sortedSpecialities.length} Specialties)
                  </td>
                  {showOnlyCount ? (
                    <>
                      <td
                        style={{
                          padding: '10px',
                          border: '1px solid #dee2e6',
                          borderTop: '2px solid #3498db',
                          textAlign: 'center',
                          backgroundColor: '#10b981',
                          fontSize: '14px',
                        }}
                      >
                        {overallStats.totalPatients}
                      </td>
                      <td
                        style={{
                          padding: '10px',
                          border: '1px solid #dee2e6',
                          borderTop: '2px solid #3498db',
                          textAlign: 'center',
                          backgroundColor: '#f59e0b',
                          fontSize: '14px',
                        }}
                      >
                        {overallStats.totalDays}
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          padding: '10px',
                          border: '1px solid #dee2e6',
                          borderTop: '2px solid #3498db',
                          textAlign: 'center',
                          backgroundColor: '#3498db',
                          fontSize: '14px',
                        }}
                      >
                        {averageDays}
                      </td>
                    </>
                  ) : (
                    <>
                      <td
                        style={{
                          padding: '10px',
                          border: '1px solid #dee2e6',
                          borderTop: '2px solid #3498db',
                          textAlign: 'center',
                          backgroundColor: '#27ae60',
                          fontSize: '14px',
                        }}
                      >
                        {overallStats.totalDays}
                      </td>
                      <td
                        colSpan="2"
                        style={{
                          padding: '10px',
                          border: '1px solid #dee2e6',
                          borderTop: '2px solid #3498db',
                          textAlign: 'right',
                        }}
                      >
                        Total Patients: {overallStats.totalPatients}
                      </td>
                    </>
                  )}
                </tr>
              )}
            </tfoot>
          </table>

          <div
            className="footer-text"
            style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderLeft: '4px solid #3498db',
              borderRadius: '4px',
            }}
          >
            <p
              style={{
                margin: '0',
                fontSize: '12px',
                color: '#7f8c8d',
                lineHeight: '1.5',
              }}
            >
              <strong>Note:</strong> 
              {showOnlyCount 
                ? ' This report shows specialty-wise discharge statistics only. For detailed patient information, disable the "Specialty Count Only" toggle.'
                : ' This report includes discharge details grouped by speciality with IP number, patient name, department, gender, age, ward, admission date, discharge date, length of stay, time, and discharged by.'
              }
            </p>
            {showOnlyCount && (
              <p style={{ margin: '5px 0 0', fontSize: '11px', color: '#2563eb', fontStyle: 'italic' }}>
                Generated in summary mode on {new Date().toLocaleString('en-IN', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

  const DischargeWardPrint = () => {
    const componentRef = React.useRef();
    const [searchTerm, setSearchTerm] = React.useState('');
    const [filteredData, setFilteredData] = React.useState(DischargeList);
  
    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle: 'Discharge_Ward_Report',
    });
  
    // Handle search
    React.useEffect(() => {
      if (searchTerm.trim() === '') {
        setFilteredData(DischargeList);
      } else {
        const filtered = DischargeList.filter(row =>
          Object.values(row).some(value =>
            value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
          )
        );
        setFilteredData(filtered);
      }
    }, [searchTerm, DischargeList]);
  
    // Group filtered discharges by WardName
    const wardGroups = filteredData.reduce((acc, patient) => {
      const ward = patient.WardName || 'Unknown';
      if (!acc[ward]) {
        acc[ward] = [];
      }
      acc[ward].push(patient);
      return acc;
    }, {});
  
    // Calculate overall statistics
    const overallStats = filteredData.reduce((stats, patient) => {
      stats.totalPatients++;
      stats.totalDays += patient.NoOfDays || 0;
      return stats;
    }, { totalPatients: 0, totalDays: 0 });
  
    // Calculate average days
    const averageDays = overallStats.totalPatients > 0 
      ? (overallStats.totalDays / overallStats.totalPatients).toFixed(1)
      : '0.0';
  
    const renderTableSection = (wardData, wardName) => {
      if (!wardData || wardData.length === 0) return null;
  
      // Calculate ward-specific statistics
      const wardStats = wardData.reduce((stats, patient) => {
        stats.totalPatients++;
        stats.totalDays += patient.NoOfDays || 0;
        return stats;
      }, { totalPatients: 0, totalDays: 0 });
  
      const wardAverageDays = wardStats.totalPatients > 0 
        ? (wardStats.totalDays / wardStats.totalPatients).toFixed(1)
        : '0.0';
  
      return (
        <>
          <tr>
            <td
              colSpan="12"
              style={{
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '14px',
                backgroundColor: '#e9ecef',
                border: '1px solid #dee2e6',
              }}
            >
              Ward: {wardName} | Total Discharges: {wardStats.totalPatients} | 
              Total Days: {wardStats.totalDays} | Average Days: {wardAverageDays}
            </td>
          </tr>
          {wardData.map((patient, index) => (
            <tr
              key={`patient-${wardName}-${index}`}
              style={{
                fontSize: '11px',
                backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
              }}
            >
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {patient.IPNo}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {patient.PatientId}
              </td>
              <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                <div>{patient.PatientName}</div>
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {patient.Dept || 'N/A'}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {patient.Gender}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {patient.Age}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {patient.WardName || 'N/A'}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {patient.AdmissionDate}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {patient.Discharge_Date}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {patient.NoOfDays || 'N/A'}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {patient.Discharge_Time}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {patient.Dischargedby}
              </td>
            </tr>
          ))}
        </>
      );
    };
  
    // Format date range
    const reportDateRange =
  searchOptions.DateType === 'Current'
    ? `Report Date: ${new Date(searchOptions.CurrentDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}`
    : searchOptions.DateType === 'Particular'
    ? `Report Date: ${new Date(searchOptions.ParticularDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}`
    : `Report From: ${new Date(searchOptions.FromDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}

       To: ${new Date(searchOptions.ToDate || new Date())
         .toLocaleDateString('en-GB', {
           day: '2-digit',
           month: '2-digit',
           year: '2-digit',
         })
         .replace(/\//g, '-')}`;

  
    return (
      <div
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          padding: '20px',
          maxWidth: '1300px',
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
              .summary-container {
                display: block !important;
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
              color: '#6b7280';
              margin-left: auto;
            }
            .clear-search {
              background-color: #6b7280;
            }
            .clear-search:hover {
              background-color: #4b5563;
            }
            .summary-container {
              display: flex;
              justify-content: space-around;
              margin: 20px 0;
              padding: 15px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              border-radius: 8px;
              color: white;
              font-weight: 600;
            }
            .summary-item {
              text-align: center;
            }
            .summary-value {
              font-size: 24px;
              font-weight: bold;
              margin-bottom: 5px;
            }
            .summary-label {
              font-size: 14px;
              opacity: 0.9;
            }
          `}
        </style>
  
        {/* Search Container */}
        <div className="search-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="patientSearch" style={{ fontWeight: '600', color: '#374151' }}>
              Search Patient:
            </label>
            <input
              id="patientSearch"
              type="text"
              className="search-input"
              placeholder="Search by IP No, Patient ID, Name, Ward..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
  
          <div className="results-info">
            Showing {filteredData.length} of {DischargeList.length} records
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
  
        {/* Overall Summary */}
        {filteredData.length > 0 && (
          <div className="summary-container">
            <div className="summary-item">
              <div className="summary-value">{overallStats.totalPatients}</div>
              <div className="summary-label">Total Discharges</div>
            </div>
            <div className="summary-item">
              <div className="summary-value">{overallStats.totalDays}</div>
              <div className="summary-label">Total Days</div>
            </div>
            <div className="summary-item">
              <div className="summary-value">{averageDays}</div>
              <div className="summary-label">Average Stay (Days)</div>
            </div>
            <div className="summary-item">
              <div className="summary-value">{Object.keys(wardGroups).length}</div>
              <div className="summary-label">Wards</div>
            </div>
          </div>
        )}
  
        <div className="print-container report-container">
          <div ref={componentRef}>
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
                    colSpan="12"
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
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    IPNo
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    PatientId
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Patient Details
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Department
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Gender
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Age
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Ward Name
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Admission Date
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Discharge Date
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    No of Days
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Discharge Time
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    DischargedBy
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(wardGroups).length > 0 ? (
                  Object.entries(wardGroups).map(([wardName, records]) =>
                    renderTableSection(records, wardName)
                  )
                ) : (
                  <tr>
                    <td colSpan="12" style={{ border: '1px solid #dee2e6', padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                      No records found for "{searchTerm}"
                    </td>
                  </tr>
                )}
              </tbody>
              <tfoot>
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
                      colSpan="9"
                      style={{
                        padding: '10px',
                        border: '1px solid #dee2e6',
                        borderTop: '2px solid #3498db',
                        textAlign: 'right',
                      }}
                    >
                      GRAND TOTAL
                    </td>
                    <td
                      style={{
                        padding: '10px',
                        border: '1px solid #dee2e6',
                        borderTop: '2px solid #3498db',
                        textAlign: 'center',
                        backgroundColor: '#27ae60',
                        fontSize: '14px',
                      }}
                    >
                      {overallStats.totalDays}
                    </td>
                    <td
                      colSpan="2"
                      style={{
                        padding: '10px',
                        border: '1px solid #dee2e6',
                        borderTop: '2px solid #3498db',
                        textAlign: 'right',
                      }}
                    >
                      Total Patients: {overallStats.totalPatients}
                    </td>
                  </tr>
                )}
              </tfoot>
            </table>
  
            <div
              className="footer-text"
              style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderLeft: '4px solid #3498db',
                borderRadius: '4px',
              }}
            >
              <p
                style={{
                  margin: '0',
                  fontSize: '12px',
                  color: '#7f8c8d',
                  lineHeight: '1.5',
                }}
              >
                <strong>Note:</strong> This report includes discharge details grouped by ward with IP number, patient name, department, gender, age, ward, admission date, discharge date, length of stay, time, and discharged by.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };




  const OPRegFeeprint = () => {

    const renderTableSection = (doctorData, doctorName) => {
      if (!doctorData || doctorData.length === 0) return null;

      const doctorTotal = doctorData.reduce((sum, record) => sum + parseFloat(record.Fees), 0).toFixed(2);

      return (
        <>
          <tr>
            <td
              colSpan="9"
              style={{
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '14px',
                backgroundColor: '#e9ecef',
                border: '1px solid #dee2e6',
              }}
            >
              Doctor: {doctorName}
            </td>
          </tr>
          {doctorData.map((record, index) => (
            <tr
              key={`record-${doctorName}-${index}`}
              style={{
                fontSize: '11px',
                backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
              }}
            >
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.sno}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.PatientId}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.OPDate}
              </td>
              <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                {record.PatientName}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.Dept || 'N/A'}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.OPType}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.Category}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {parseFloat(record.Fees).toFixed(2)}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.Prepared}
              </td>
            </tr>
          ))}
          <tr>
            <td
              colSpan="7"
              style={{
                padding: '8px',
                textAlign: 'right',
                fontWeight: 'bold',
                border: '1px solid #dee2e6',
                backgroundColor: '#f1f3f5',
              }}
            >
              Doctor Total
            </td>
            <td
              style={{
                padding: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
                border: '1px solid #dee2e6',
                backgroundColor: '#f1f3f5',
              }}
            >
              {doctorTotal}
            </td>
            <td style={{ border: '1px solid #dee2e6' }}></td>
          </tr>
        </>
      );
    };

    const grandTotal = Object.values(OPRegFee).reduce(
      (sum, records) => sum + records.reduce((subSum, record) => subSum + parseFloat(record.Fees), 0),
      0
    ).toFixed(2);

    return (
      <div
        style={{
          fontFamily: 'sans-serif',
          padding: '1.25rem',
          maxWidth: '72rem',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        {/* Buttons Container */}
        <div style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={handlePrint2}
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
        <div ref={componentRef}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #d1d5db',
            marginBottom: '1.25rem'
          }}>
            <thead>
              <tr>
                <td
                  colSpan="9"
                  style={{
                    border: 'none',
                    textAlign: 'center',
                    paddingTop: '1rem',
                    paddingBottom: '1rem',
                    backgroundColor: '#f3f4f6'
                  }}
                >
                  <div>
                    <h2 style={{
                      margin: 0,
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      letterSpacing: '0.025em'
                    }}>
                      KARUNA MEDICAL COLLEGE HOSPITAL
                    </h2>
                    <h1 style={{
                      marginTop: '0.25rem',
                      fontSize: '1.125rem',
                      fontWeight: 500,
                      color: '#6b7280',
                      letterSpacing: '-0.025em'
                    }}>
                      Vilayodi, Chittur, Palakkad
                    </h1>
                    <p style={{
                      marginTop: '0.625rem',
                      fontSize: '0.875rem',
                      color: '#4b5563',
                      fontWeight: 500
                    }}>
                      {/* Date display logic remains same */}
                    </p>
                  </div>
                </td>
              </tr>
              <tr style={{
                fontWeight: 'bold',
                fontSize: '0.75rem',
                backgroundColor: '#3b82f6',
                color: 'white'
              }}>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>S.No</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>Patient ID</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>OP Date</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>Patient Name</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>Department</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>OP Type</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>Category</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>Fees</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>Prepared</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(OPRegFee).map(([doctorName, records]) =>
                renderTableSection(records, doctorName)
              )}
            </tbody>

            <tfoot>
              <tr style={{
                fontWeight: 'bold',
                fontSize: '0.875rem',
                backgroundColor: '#1f2937',
                color: 'white'
              }}>
                <td
                  colSpan="7"
                  style={{
                    padding: '0.625rem',
                    border: '1px solid #d1d5db',
                    borderTop: '2px solid #3b82f6',
                    textAlign: 'right'
                  }}
                >
                  GRAND TOTAL
                </td>
                <td
                  style={{
                    padding: '0.625rem',
                    border: '1px solid #d1d5db',
                    borderTop: '2px solid #3b82f6',
                    textAlign: 'center',
                    backgroundColor: '#3b82f6',
                    fontSize: '0.875rem'
                  }}
                >
                  {grandTotal}
                </td>
                <td style={{ border: '1px solid #d1d5db', borderTop: '2px solid #3b82f6' }}></td>
              </tr>
            </tfoot>

          </table>

          <div style={{
            marginTop: '1.25rem',
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            borderLeft: '4px solid #3b82f6',
            borderRadius: '0.25rem'
          }}>
            <p style={{
              margin: 0,
              fontSize: '0.75rem',
              color: '#6b7280',
              lineHeight: 1.625
            }}>
              <strong>Note:</strong> This report includes OP registration fee details...
            </p>
          </div>
        </div>
      </div>
    );


  }

  const IPDoctorReportPrint = () => {
    const componentRef = useRef();

    const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle: 'IP Doctor Wise Report',
    });

    const handlePrintClose = () => {
      setOpenModal(false);
    };

    // Group data by doctor
    const groupedData = IPDoctorReportData.reduce((acc, record) => {
      const doctorKey = `${record.DoctorName}|${record.DoctorId}`;
      if (!acc[doctorKey]) {
        acc[doctorKey] = [];
      }
      acc[doctorKey].push({
        ...record,
        sno: acc[doctorKey].length + 1
      });
      return acc;
    }, {});

    const renderTableSection = (doctorData, doctorName) => {
      if (!doctorData || doctorData.length === 0) return null;

      const doctorPatientCount = doctorData.length;

      return (
        <>
          <tr>
            <td
              colSpan="6"
              style={{
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '14px',
                backgroundColor: '#e9ecef',
                border: '1px solid #dee2e6',
              }}
            >
              Doctor: {doctorName}
            </td>
          </tr>
          {doctorData.map((record, index) => (
            <tr
              key={`record-${doctorName}-${index}`}
              style={{
                fontSize: '11px',
                backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
              }}
            >
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.sno}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.Registration_Id}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.PatientId}
              </td>
              <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                {record.PatientName}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.DoctorName}
              </td>
              
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.Speciality}
              </td>
            </tr>
          ))}
          <tr>
            <td
              colSpan="5"
              style={{
                padding: '8px',
                textAlign: 'right',
                fontWeight: 'bold',
                border: '1px solid #dee2e6',
                backgroundColor: '#f1f3f5',
              }}
            >
              Total Patients
            </td>
            <td
              style={{
                padding: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
                border: '1px solid #dee2e6',
                backgroundColor: '#f1f3f5',
              }}
            >
              {doctorPatientCount}
            </td>
          </tr>
        </>
      );
    };

    const grandTotalPatients = Object.values(groupedData).reduce(
      (sum, records) => sum + records.length,
      0
    );

    // Get date range for display
    const getDateRangeText = () => {
      // Add your date range logic here based on your search options
      const fromDate = ''; // Get from your state
      const toDate = '';   // Get from your state
      const dateType = ''; // Get from your state

      if (dateType === 'Current') {
        return `Date: ${new Date().toLocaleDateString()}`;
      }

      else if (dateType === 'Particular'){
        return `Date: ${new Date(fromDate).toLocaleDateString()}`;
      }
      
      else if (fromDate && toDate) {
        return `Date Range: ${new Date(fromDate).toLocaleDateString()} to ${new Date(toDate).toLocaleDateString()}`;
      }
      return `Date: ${new Date().toLocaleDateString()}`;
    };

    return (
      <div
        style={{
          fontFamily: 'sans-serif',
          padding: '1.25rem',
          maxWidth: '72rem',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        {/* Buttons Container */}
        <div style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}>
          <button
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
        <div ref={componentRef}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #d1d5db',
            marginBottom: '1.25rem'
          }}>
            <thead>
              <tr>
                <td
                  colSpan="6"
                  style={{
                    border: 'none',
                    textAlign: 'center',
                    paddingTop: '1rem',
                    paddingBottom: '1rem',
                    backgroundColor: '#f3f4f6'
                  }}
                >
                  <div>
                    <h2 style={{
                      margin: 0,
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      letterSpacing: '0.025em'
                    }}>
                      KARUNA MEDICAL COLLEGE HOSPITAL
                    </h2>
                    <h1 style={{
                      marginTop: '0.25rem',
                      fontSize: '1.125rem',
                      fontWeight: 500,
                      color: '#6b7280',
                      letterSpacing: '-0.025em'
                    }}>
                      Vilayodi, Chittur, Palakkad
                    </h1>
                    <h3 style={{
                      marginTop: '0.625rem',
                      fontSize: '1rem',
                      color: '#4b5563',
                      fontWeight: 600
                    }}>
                      INPATIENT DOCTOR WISE REPORT
                    </h3>
                    <p style={{
                      marginTop: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#4b5563',
                      fontWeight: 500
                    }}>
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
                      ) :(
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
                    </p>
                  </div>
                </td>
              </tr>
              <tr style={{
                fontWeight: 'bold',
                fontSize: '0.75rem',
                backgroundColor: '#3b82f6',
                color: 'white'
              }}>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>S.No</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>Registration ID</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>Patient ID</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>Patient Name</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>Doctor Name</th>
            
                 <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>Speciality</th>
              </tr>
               
                 
            </thead>

            <tbody>
              {Object.entries(groupedData).map(([doctorKey, records]) => {
                const doctorName = doctorKey.split('|')[0];
                return renderTableSection(records, doctorName);
              })}
            </tbody>

            <tfoot>
              <tr style={{
                fontWeight: 'bold',
                fontSize: '0.875rem',
                backgroundColor: '#1f2937',
                color: 'white'
              }}>
                <td
                  colSpan="5"
                  style={{
                    padding: '0.625rem',
                    border: '1px solid #d1d5db',
                    borderTop: '2px solid #3b82f6',
                    textAlign: 'right'
                  }}
                >
                  GRAND TOTAL PATIENTS
                </td>
                <td
                  style={{
                    padding: '0.625rem',
                    border: '1px solid #d1d5db',
                    borderTop: '2px solid #3b82f6',
                    textAlign: 'center',
                    backgroundColor: '#3b82f6',
                    fontSize: '0.875rem'
                  }}
                >
                  {grandTotalPatients}
                </td>
              </tr>
            </tfoot>
          </table>

          <div style={{
            marginTop: '1.25rem',
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            borderLeft: '4px solid #3b82f6',
            borderRadius: '0.25rem'
          }}>
            <p style={{
              margin: 0,
              fontSize: '0.75rem',
              color: '#6b7280',
              lineHeight: 1.625
            }}>
              <strong>Note:</strong> This report shows inpatient details grouped by primary doctor.
              Only patients with status 'Pending', 'Admitted', or 'Completed' are included in this report.
            </p>
          </div>

          {/* Print footer */}
          <div style={{
            marginTop: '2rem',
            paddingTop: '1rem',
            borderTop: '1px solid #e5e7eb',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: '#6b7280'
          }}>
            <p>Generated on: {new Date().toLocaleString()}</p>
            <p>Page 1 of 1</p>
          </div>
        </div>
      </div>
    );
  };

  const SpecialityPrint = () => {
  const componentRef = React.useRef();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showOnlyCount, setShowOnlyCount] = React.useState(false);

  // Combine new and old patients
  const allPatients = [
    ...(RevisitandPatientList.New || []),
    ...(RevisitandPatientList.Old || [])
  ];

  // Filter patients based on search term
  const filteredPatients = allPatients.filter(patient =>
    Object.values(patient).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Group filtered patients by DeptName (speciality)
  const SpecialityFee = filteredPatients.reduce((acc, patient) => {
    const speciality = patient.DeptName || 'Unknown';
    if (!acc[speciality]) {
      acc[speciality] = [];
    }
    acc[speciality].push({
      sno: acc[speciality].length + 1,
      PatientId: patient.PatientId,
      OPDate: patient.OPDate,
      PatientName: patient.PatientName,
      Dept: patient.DeptName,
      OPType: patient.type || (RevisitandPatientList.New.includes(patient) ? 'New' : 'Follow Up'),
      Category: patient.PatientCategory,
      Fees: patient.PaidAmount,
      Prepared: patient.Billedby,
      Sex: patient.Sex,
      Age: patient.Age
    });
    return acc;
  }, {});

  // Sort specialties alphabetically
  const sortedSpecialities = Object.entries(SpecialityFee)
    .sort(([a], [b]) => a.localeCompare(b));

  const renderTableSection = (specialityData, specialityName, specIndex) => {
    if (!specialityData || specialityData.length === 0) return null;

    const specialityTotal = specialityData.reduce((sum, record) => sum + parseFloat(record.Fees), 0).toFixed(2);

    // Count NEW and FOLLOWUP patients
    const newCount = specialityData.filter(record => record.OPType === 'New').length;
    const followUpCount = specialityData.filter(record => record.OPType === 'Follow Up').length;

    // Calculate NEW and FOLLOWUP amounts
    const newAmount = specialityData
      .filter(record => record.OPType === 'New')
      .reduce((sum, record) => sum + parseFloat(record.Fees), 0)
      .toFixed(2);

    const followUpAmount = specialityData
      .filter(record => record.OPType === 'Follow Up')
      .reduce((sum, record) => sum + parseFloat(record.Fees), 0)
      .toFixed(2);

    if (showOnlyCount) {
      // Compact view showing only specialty totals
      return (
        <tr
          key={`specialty-${specIndex}`}
          style={{
            backgroundColor: specIndex % 2 === 0 ? '#f8f9fa' : 'white',
            fontSize: '12px',
          }}
        >
          <td style={{ 
            padding: '10px', 
            textAlign: 'center', 
            border: '1px solid #dee2e6',
            fontWeight: '600'
          }}>
            {specIndex + 1}
          </td>
          <td colSpan="2" style={{ 
            padding: '10px', 
            textAlign: 'left', 
            border: '1px solid #dee2e6',
            fontWeight: '600',
            color: '#1e40af'
          }}>
            {specialityName}
          </td>
          <td style={{ 
            padding: '10px', 
            textAlign: 'center', 
            border: '1px solid #dee2e6',
            color: '#10b981',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {specialityData.length}
          </td>
          <td style={{ 
            padding: '10px', 
            textAlign: 'center', 
            border: '1px solid #dee2e6',
            color: '#3b82f6',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {newCount}
          </td>
          <td style={{ 
            padding: '10px', 
            textAlign: 'center', 
            border: '1px solid #dee2e6',
            color: '#8b5cf6',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {followUpCount}
          </td>
          <td colSpan="3" style={{ 
            padding: '10px', 
            textAlign: 'center', 
            border: '1px solid #dee2e6',
            backgroundColor: '#dbeafe',
            fontWeight: 'bold'
          }}>
            Total: {specialityData.length} Patients
          </td>
        </tr>
      );
    }

    // Original detailed view with patient list
    return (
      <>
        <tr key={`header-${specIndex}`}>
          <td
            colSpan="8"
            style={{
              padding: '10px',
              textAlign: 'left',
              fontWeight: 'bold',
              fontSize: '14px',
              backgroundColor: '#e9ecef',
              border: '1px solid #dee2e6',
            }}
          >
            Speciality: {specialityName} | New: {newCount} | Follow Up: {followUpCount} | Total: {specialityData.length}
          </td>
        </tr>
        {specialityData.map((record, index) => (
          <tr
            key={`record-${specialityName}-${index}`}
            style={{
              fontSize: '11px',
              backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
            }}
          >
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {record.sno}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {record.PatientId}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {record.OPDate}
            </td>
            <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
              {record.PatientName}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {record.Dept || 'N/A'}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {record.OPType}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {record.Age}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {record.Sex}
            </td>
          </tr>
        ))}
      </>
    );
  };

  // Calculate overall NEW and FOLLOWUP counts and amounts
  const overallNewCount = Object.values(SpecialityFee).reduce(
    (total, records) => total + records.filter(record => record.OPType === 'New').length,
    0
  );

  const overallFollowUpCount = Object.values(SpecialityFee).reduce(
    (total, records) => total + records.filter(record => record.OPType === 'Follow Up').length,
    0
  );

  const overallNewAmount = Object.values(SpecialityFee).reduce(
    (total, records) => total + records
      .filter(record => record.OPType === 'New')
      .reduce((sum, record) => sum + parseFloat(record.Fees), 0),
    0
  ).toFixed(2);

  const overallFollowUpAmount = Object.values(SpecialityFee).reduce(
    (total, records) => total + records
      .filter(record => record.OPType === 'Follow Up')
      .reduce((sum, record) => sum + parseFloat(record.Fees), 0),
    0
  ).toFixed(2);

  const totalPatients = overallNewCount + overallFollowUpCount;

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: showOnlyCount ? 'Speciality_Count_Report' : 'Speciality_Report',
  });

  // Format date range
  const reportDateRange =
    searchOptions.DateType === 'Current'
      ? `Report Date: ${new Date(searchOptions.CurrentDate || new Date())
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })
          .replace(/\//g, '-')}`
      : searchOptions.DateType === 'Particular'
      ? `Report Date: ${new Date(searchOptions.ParticularDate || new Date())
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })
          .replace(/\//g, '-')}`
      : `Report From: ${new Date(searchOptions.FromDate || new Date())
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })
          .replace(/\//g, '-')}
         To: ${new Date(searchOptions.ToDate || new Date())
           .toLocaleDateString('en-GB', {
             day: '2-digit',
             month: '2-digit',
             year: '2-digit',
           })
           .replace(/\//g, '-')}`;

  return (
    <div
      style={{
        fontFamily: 'sans-serif',
        padding: '1.25rem',
        maxWidth: '72rem',
        marginLeft: 'auto',
        marginRight: 'auto'
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
            .search-container, .toggle-container, .stats-container {
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
          .toggle-container {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #f8fafc;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
          }
          .toggle-label {
            font-weight: 500;
            color: #374151;
            font-size: 14px;
          }
          .toggle-switch {
            position: relative;
            display: inline-block;
            width: 48px;
            height: 24px;
          }
          .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
          }
          .toggle-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
          }
          input:checked + .toggle-slider {
            background-color: #2563eb;
          }
          input:checked + .toggle-slider:before {
            transform: translateX(24px);
          }
        `}
      </style>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="patientSearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search Patient:
          </label>
          <input
            id="patientSearch"
            type="text"
            className="search-input"
            placeholder="Search by Patient ID, Name, Department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Toggle for showing only specialty counts */}
          <div className="toggle-container">
            <span className="toggle-label">Specialty Count Only</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={showOnlyCount}
                onChange={(e) => setShowOnlyCount(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="results-info">
          Showing {filteredPatients.length} of {allPatients.length} records
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
          {showOnlyCount && (
            <span style={{ color: '#2563eb', marginLeft: '8px' }}>
              • Showing only specialty totals
            </span>
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
            <div className="stat-value">{sortedSpecialities.length}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="stat-label">Total Patients</div>
            <div className="stat-value">{totalPatients}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
            <div className="stat-label">New Patients</div>
            <div className="stat-value">{overallNewCount}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#8b5cf6' }}>
            <div className="stat-label">Follow Up</div>
            <div className="stat-value">{overallFollowUpCount}</div>
          </div>
        </div>
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
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          border: '1px solid #d1d5db',
          marginBottom: '1.25rem'
        }}>
          <thead>
            <tr>
              <td
                colSpan={showOnlyCount ? "8" : "8"}
                style={{
                  border: 'none',
                  textAlign: 'center',
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  backgroundColor: '#f3f4f6'
                }}
              >
                <div>
                  <h2 style={{
                    margin: 0,
                    fontSize: '1.5rem',
                    fontWeight: 'bold',
                    color: '#1f2937',
                    letterSpacing: '0.025em'
                  }}>
                    KARUNA MEDICAL COLLEGE HOSPITAL
                  </h2>
                  <h1 style={{
                    marginTop: '0.25rem',
                    fontSize: '1.125rem',
                    fontWeight: 500,
                    color: '#6b7280',
                    letterSpacing: '-0.025em'
                  }}>
                    Vilayodi, Chittur, Palakkad
                  </h1>
                  <p style={{
                    marginTop: '0.625rem',
                    fontSize: '0.875rem',
                    color: '#4b5563',
                    fontWeight: 500
                  }}>
                    {reportDateRange}
                  </p>
                  <p style={{ margin: '5px 0', fontSize: '14px', fontWeight: '500' }}>
                    {showOnlyCount ? 'OP REGISTRATION REPORT - SPECIALTY COUNT' : 'OP REGISTRATION REPORT - DETAILED VIEW'}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                  {showOnlyCount && (
                    <p style={{ 
                      margin: '5px 0', 
                      fontSize: '14px', 
                      color: '#2563eb', 
                      fontWeight: '500',
                      backgroundColor: '#dbeafe',
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '4px'
                    }}>
                      Viewing Specialty Count Only
                    </p>
                  )}
                  <div style={{
                    marginTop: '0.5rem',
                    fontSize: '0.875rem',
                    color: '#1f2937',
                    fontWeight: 'bold',
                    padding: '0.5rem',
                    backgroundColor: '#e5f3ff',
                    borderRadius: '0.25rem',
                    border: '1px solid #3b82f6'
                  }}>
                    Total: {totalPatients} patients | New: {overallNewCount} | Follow Up: {overallFollowUpCount}
                  </div>
                </div>
              </td>
            </tr>
            <tr style={{
              fontWeight: 'bold',
              fontSize: '0.75rem',
              backgroundColor: '#3b82f6',
              color: 'white'
            }}>
              {showOnlyCount ? (
                <>
                  <th style={{ padding: '0.625rem', textAlign: 'center', border: '1px solid #d1d5db', fontWeight: 600, width: '8%' }}>
                    S.No
                  </th>
                  <th colSpan="2" style={{ padding: '0.625rem', textAlign: 'center', border: '1px solid #d1d5db', fontWeight: 600, width: '42%' }}>
                    Speciality
                  </th>
                  <th style={{ padding: '0.625rem', textAlign: 'center', border: '1px solid #d1d5db', fontWeight: 600, width: '12%' }}>
                    Total
                  </th>
                  <th style={{ padding: '0.625rem', textAlign: 'center', border: '1px solid #d1d5db', fontWeight: 600, width: '12%' }}>
                    New
                  </th>
                  <th style={{ padding: '0.625rem', textAlign: 'center', border: '1px solid #d1d5db', fontWeight: 600, width: '12%' }}>
                    Follow Up
                  </th>
                  <th colSpan="3" style={{ padding: '0.625rem', textAlign: 'center', border: '1px solid #d1d5db', fontWeight: 600, width: '14%' }}>
                    Specialty Total
                  </th>
                </>
              ) : (
                <>
                  <th style={{ padding: '0.625rem', textAlign: 'center', border: '1px solid #d1d5db', fontWeight: 600 }}>
                    S.No
                  </th>
                  <th style={{ padding: '0.625rem', textAlign: 'center', border: '1px solid #d1d5db', fontWeight: 600 }}>
                    PatientId
                  </th>
                  <th style={{ padding: '0.625rem', textAlign: 'center', border: '1px solid #d1d5db', fontWeight: 600 }}>
                    OP Date
                  </th>
                  <th style={{ padding: '0.625rem', textAlign: 'center', border: '1px solid #d1d5db', fontWeight: 600 }}>
                    Patient Name
                  </th>
                  <th style={{ padding: '0.625rem', textAlign: 'center', border: '1px solid #d1d5db', fontWeight: 600 }}>
                    Department
                  </th>
                  <th style={{ padding: '0.625rem', textAlign: 'center', border: '1px solid #d1d5db', fontWeight: 600 }}>
                    OP Type
                  </th>
                  <th style={{ padding: '0.625rem', textAlign: 'center', border: '1px solid #d1d5db', fontWeight: 600 }}>
                    Age
                  </th>
                  <th style={{ padding: '0.625rem', textAlign: 'center', border: '1px solid #d1d5db', fontWeight: 600 }}>
                    Gender
                  </th>
                </>
              )}
            </tr>
          </thead>

          <tbody>
            {sortedSpecialities.length > 0 ? (
              sortedSpecialities.map(([specialityName, records], index) =>
                renderTableSection(records, specialityName, index)
              )
            ) : (
              <tr>
                <td 
                  colSpan={showOnlyCount ? "8" : "8"} 
                  style={{ padding: '20px', textAlign: 'center', color: '#6b7280' }}
                >
                  No records found{searchTerm ? ` for "${searchTerm}"` : ''}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            {sortedSpecialities.length > 0 && (
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                }}
              >
                <td
                  colSpan={showOnlyCount ? "3" : "5"}
                  style={{
                    padding: '10px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3b82f6',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL ({sortedSpecialities.length} Specialties)
                </td>
                {showOnlyCount ? (
                  <>
                    <td
                      style={{
                        padding: '10px',
                        border: '1px solid #dee2e6',
                        borderTop: '2px solid #3b82f6',
                        textAlign: 'center',
                        backgroundColor: '#10b981',
                        fontSize: '14px',
                      }}
                    >
                      {totalPatients}
                    </td>
                    <td
                      style={{
                        padding: '10px',
                        border: '1px solid #dee2e6',
                        borderTop: '2px solid #3b82f6',
                        textAlign: 'center',
                        backgroundColor: '#3b82f6',
                        fontSize: '14px',
                      }}
                    >
                      {overallNewCount}
                    </td>
                    <td
                      style={{
                        padding: '10px',
                        border: '1px solid #dee2e6',
                        borderTop: '2px solid #3b82f6',
                        textAlign: 'center',
                        backgroundColor: '#8b5cf6',
                        fontSize: '14px',
                      }}
                    >
                      {overallFollowUpCount}
                    </td>
                    <td
                      colSpan="2"
                      style={{
                        padding: '10px',
                        border: '1px solid #dee2e6',
                        borderTop: '2px solid #3b82f6',
                        textAlign: 'center',
                        backgroundColor: '#dbeafe',
                        fontSize: '14px',
                        fontWeight: 'bold'
                      }}
                    >
                      {totalPatients}
                    </td>
                  </>
                ) : (
                  <>
                    <td
                      colSpan="3"
                      style={{
                        padding: '10px',
                        border: '1px solid #dee2e6',
                        borderTop: '2px solid #3b82f6',
                        textAlign: 'center',
                        backgroundColor: '#3b82f6',
                        fontSize: '14px',
                      }}
                    >
                      Total Patients: {totalPatients} | New: {overallNewCount} | Follow Up: {overallFollowUpCount}
                    </td>
                  </>
                )}
              </tr>
            )}
          </tfoot>
        </table>

        <div style={{
          marginTop: '1.25rem',
          padding: '1rem',
          backgroundColor: '#f3f4f6',
          borderLeft: '4px solid #3b82f6',
          borderRadius: '0.25rem'
        }}>
          <p style={{
            margin: 0,
            fontSize: '0.75rem',
            color: '#6b7280',
            lineHeight: 1.625
          }}>
            <strong>Note:</strong> 
            {showOnlyCount 
              ? ' This report shows specialty-wise patient counts with New vs Follow Up breakdown only. For detailed patient information, disable the "Specialty Count Only" toggle.'
              : ' This report includes OP registration details with separate calculations for New and Follow Up patients.'
            }
          </p>
          {showOnlyCount && (
            <p style={{ margin: '5px 0 0', fontSize: '11px', color: '#2563eb', fontStyle: 'italic' }}>
              Generated in summary mode on {new Date().toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

 const IPSpecialityPrint = () => {
  const componentRef = React.useRef();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [showOnlyCount, setShowOnlyCount] = React.useState(false);

  // Filter InPatientList based on search term
  const filteredPatients = InPatientList.filter(patient =>
    Object.values(patient).some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  // Group filtered patients by Dept (speciality)
  const SpecialityPatients = filteredPatients.reduce((acc, patient) => {
    const speciality = patient.Dept || 'Unknown';
    if (!acc[speciality]) {
      acc[speciality] = [];
    }
    acc[speciality].push({
      sno: acc[speciality].length + 1,
      IPNo: patient.IPNo,
      PatientId: patient.PatientId,
      PatientName: patient.PatientName,
      prefix: patient.prefix,
      Address: patient.Address,
      Dept: patient.Dept,
      gender: patient.gender,
      Age: patient.Age,
      AdmissionDate: patient.AdmissionDate,
      AdmissionTime: patient.AdmissionTime,
      WardName: patient.WardName,
      Floor: patient.Floor,
      Bedno: patient.Bedno,
      Createdby: patient.Createdby
    });
    return acc;
  }, {});

  // Get specialties sorted alphabetically
  const specialties = Object.entries(SpecialityPatients)
    .sort(([a], [b]) => a.localeCompare(b));

  const renderTableSection = (specialityData, specialityName, specIndex) => {
    if (!specialityData || specialityData.length === 0) return null;

    if (showOnlyCount) {
      // Compact view showing only specialty totals
      return (
        <tr
          key={`specialty-${specIndex}`}
          style={{
            backgroundColor: specIndex % 2 === 0 ? '#f8f9fa' : 'white',
            fontSize: '12px',
          }}
        >
          <td style={{ 
            padding: '10px', 
            textAlign: 'center', 
            border: '1px solid #dee2e6',
            fontWeight: '600'
          }}>
            {specIndex + 1}
          </td>
          <td colSpan="2" style={{ 
            padding: '10px', 
            textAlign: 'left', 
            border: '1px solid #dee2e6',
            fontWeight: '600',
            color: '#1e40af'
          }}>
            {specialityName}
          </td>
          <td style={{ 
            padding: '10px', 
            textAlign: 'center', 
            border: '1px solid #dee2e6',
            color: '#059669',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {specialityData.length}
          </td>
          <td colSpan="6" style={{ 
            padding: '10px', 
            textAlign: 'center', 
            border: '1px solid #dee2e6',
            backgroundColor: '#dbeafe',
            fontWeight: 'bold'
          }}>
            {specialityData.length} Patients
          </td>
        </tr>
      );
    }

    // Original detailed view with patient list
    return (
      <>
        <tr key={`header-${specIndex}`}>
          <td
            colSpan="11"
            style={{
              padding: '10px',
              textAlign: 'left',
              fontWeight: 'bold',
              fontSize: '14px',
              backgroundColor: '#e9ecef',
              border: '1px solid #dee2e6',
            }}
          >
            Speciality: {specialityName} | Total: {specialityData.length}
          </td>
        </tr>
        {specialityData.map((record, index) => (
          <tr
            key={`record-${specialityName}-${index}`}
            style={{
              fontSize: '11px',
              backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
            }}
          >
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {record.sno}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {record.IPNo}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {record.PatientId}
            </td>
            <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
              <div>{record.PatientName}</div>
              <div>{record.prefix}</div>
              <div>{record.Address}</div>
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {record.Dept || 'N/A'}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {record.gender}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {record.Age}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {record.AdmissionDate}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {record.AdmissionTime}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {record.WardName || 'N/A'}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {record.Createdby || 'N/A'}
            </td>
          </tr>
        ))}
      </>
    );
  };

  const grandTotal = filteredPatients.length || 0;

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: showOnlyCount ? 'IP_Speciality_Count_Report' : 'IP_Speciality_Report',
  });

  // Format date range
  const reportDateRange =
    searchOptions.DateType === 'Current'
      ? `Report Date: ${new Date(searchOptions.CurrentDate || new Date())
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })
          .replace(/\//g, '-')}`
      : searchOptions.DateType === 'Particular'
      ? `Report Date: ${new Date(searchOptions.ParticularDate || new Date())
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })
          .replace(/\//g, '-')}`
      : `Report From: ${new Date(searchOptions.FromDate || new Date())
          .toLocaleDateString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: '2-digit',
          })
          .replace(/\//g, '-')}
         To: ${new Date(searchOptions.ToDate || new Date())
           .toLocaleDateString('en-GB', {
             day: '2-digit',
             month: '2-digit',
             year: '2-digit',
           })
           .replace(/\//g, '-')}`;

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
            .search-container, .toggle-container, .stats-container {
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
          .toggle-container {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #f8fafc;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
          }
          .toggle-label {
            font-weight: 500;
            color: #374151;
            font-size: 14px;
          }
          .toggle-switch {
            position: relative;
            display: inline-block;
            width: 48px;
            height: 24px;
          }
          .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
          }
          .toggle-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
          }
          input:checked + .toggle-slider {
            background-color: #2563eb;
          }
          input:checked + .toggle-slider:before {
            transform: translateX(24px);
          }
        `}
      </style>

      {/* Search Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="patientSearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search Patient:
          </label>
          <input
            id="patientSearch"
            type="text"
            className="search-input"
            placeholder="Search by IPNo, Patient ID, Name, Department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Toggle for showing only specialty counts */}
          <div className="toggle-container">
            <span className="toggle-label">Specialty Count Only</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={showOnlyCount}
                onChange={(e) => setShowOnlyCount(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div className="results-info">
          Showing {filteredPatients.length} of {InPatientList.length} records
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
          {showOnlyCount && (
            <span style={{ color: '#2563eb', marginLeft: '8px' }}>
              • Showing only specialty totals
            </span>
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
            <div className="stat-value">{specialties.length}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="stat-label">Total Patients</div>
            <div className="stat-value">{filteredPatients.length}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#f59e0b' }}>
            <div className="stat-label">Average per Specialty</div>
            <div className="stat-value">
              {specialties.length > 0 ? Math.round(filteredPatients.length / specialties.length) : 0}
            </div>
          </div>
        </div>
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
                colSpan={showOnlyCount ? "5" : "11"}
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
                  <p style={{ margin: '5px 0', fontSize: '14px', fontWeight: '500' }}>
                    {showOnlyCount ? 'IP PATIENT REPORT - SPECIALTY COUNT' : 'IP PATIENT REPORT - DETAILED VIEW'}
                  </p>
                  {searchTerm && (
                    <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                      Filtered results for: "{searchTerm}"
                    </p>
                  )}
                  {showOnlyCount && (
                    <p style={{ 
                      margin: '5px 0', 
                      fontSize: '14px', 
                      color: '#2563eb', 
                      fontWeight: '500',
                      backgroundColor: '#dbeafe',
                      display: 'inline-block',
                      padding: '4px 12px',
                      borderRadius: '4px'
                    }}>
                      Viewing Specialty Count Only
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
              {showOnlyCount ? (
                <>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '8%' }}>
                    S.No
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '42%' }}>
                    Speciality
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '15%' }}>
                    Count
                  </th>
                  <th colSpan="2" style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '35%' }}>
                    Specialty Total
                  </th>
                </>
              ) : (
                <>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    S.No
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    IPNo
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    PatientId
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Patient Details
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Department
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Gender
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Age
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Admission Date
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Admission Time
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Ward Name
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Prepared
                  </th>
                </>
              )}
            </tr>
          </thead>
          <tbody>
            {specialties.length > 0 ? (
              specialties.map(([specialityName, records], index) =>
                renderTableSection(records, specialityName, index)
              )
            ) : (
              <tr>
                <td 
                  colSpan={showOnlyCount ? "5" : "11"} 
                  style={{ border: '1px solid #dee2e6', padding: '20px', textAlign: 'center', color: '#6b7280' }}
                >
                  No records found{searchTerm ? ` for "${searchTerm}"` : ''}
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            {filteredPatients.length > 0 && (
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                }}
              >
                <td
                  colSpan={showOnlyCount ? "3" : "10"}
                  style={{
                    padding: '10px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL ({specialties.length} Specialties)
                </td>
                <td
                  colSpan={showOnlyCount ? "2" : "1"}
                  style={{
                    padding: '10px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#3498db',
                    fontSize: '14px',
                  }}
                >
                  {grandTotal}
                </td>
              </tr>
            )}
          </tfoot>
        </table>

        <div
          className="footer-text"
          style={{
            marginTop: '20px',
            padding: '15px',
            backgroundColor: '#f8f9fa',
            borderLeft: '4px solid #3498db',
            borderRadius: '4px',
          }}
        >
          <p
            style={{
              margin: '0',
              fontSize: '12px',
              color: '#7f8c8d',
              lineHeight: '1.5',
            }}
          >
            <strong>Note:</strong> 
            {showOnlyCount 
              ? ' This report shows specialty-wise patient counts only. For detailed patient information, disable the "Specialty Count Only" toggle.'
              : ' This report includes in-patient details grouped by speciality with IP number, patient name, prefix, address, department, gender, age, admission date, ward, floor, bed, and prepared by.'
            }
          </p>
          {showOnlyCount && (
            <p style={{ margin: '5px 0 0', fontSize: '11px', color: '#2563eb', fontStyle: 'italic' }}>
              Generated in summary mode on {new Date().toLocaleString('en-IN', {
                day: '2-digit',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

  const IPWardPrint = () => {
    const componentRef = React.useRef();
    const [searchTerm, setSearchTerm] = React.useState('');
  
    // Filter InPatientList based on search term
    const filteredPatients = InPatientList.filter(patient =>
      Object.values(patient).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  
    // Group filtered patients by WardName
    const WardPatients = filteredPatients.reduce((acc, patient) => {
      const ward = patient.WardName || 'Unknown';
      if (!acc[ward]) {
        acc[ward] = [];
      }
      acc[ward].push({
        sno: acc[ward].length + 1,
        IPNo: patient.IPNo,
        PatientId: patient.PatientId,
        PatientName: patient.PatientName,
        prefix: patient.prefix,
        Address: patient.Address,
        Dept: patient.Dept,
        gender: patient.gender,
        Age: patient.Age,
        AdmissionDate: patient.AdmissionDate,
        AdmissionTime: patient.AdmissionTime,
        WardName: patient.WardName,
        Floor: patient.Floor,
        Bedno: patient.Bedno,
        Createdby: patient.Createdby
      });
      return acc;
    }, {});
  
    const renderTableSection = (wardData, wardName) => {
      if (!wardData || wardData.length === 0) return null;
  
      return (
        <>
          <tr>
            <td
              colSpan="13"
              style={{
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '14px',
                backgroundColor: '#e9ecef',
                border: '1px solid #dee2e6',
              }}
            >
              Ward: {wardName} | Total: {wardData.length}
            </td>
          </tr>
          {wardData.map((record, index) => (
            <tr
              key={`record-${wardName}-${index}`}
              style={{
                fontSize: '11px',
                backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
              }}
            >
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.sno}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.IPNo}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.PatientId}
              </td>
              <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                <div>{record.PatientName}</div>
                <div>{record.prefix}</div>
                <div>{record.Address}</div>
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.Dept || 'N/A'}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.gender}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.Age}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.AdmissionDate}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.AdmissionTime}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.WardName || 'N/A'}
              </td>
              {/* <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.Floor || 'N/A'}
              </td>
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.Bedno || 'N/A'}
              </td> */}
              <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                {record.Createdby || 'N/A'}
              </td>
            </tr>
          ))}
        </>
      );
    };
  
    const grandTotal = filteredPatients.length || 0;
  
    // Format date range
    const reportDateRange =
  searchOptions.DateType === 'Current'
    ? `Report Date: ${new Date(searchOptions.CurrentDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}`
    : searchOptions.DateType === 'Particular'
    ? `Report Date: ${new Date(searchOptions.ParticularDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}`
    : `Report From: ${new Date(searchOptions.FromDate || new Date())
        .toLocaleDateString('en-GB', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit',
        })
        .replace(/\//g, '-')}

       To: ${new Date(searchOptions.ToDate || new Date())
         .toLocaleDateString('en-GB', {
           day: '2-digit',
           month: '2-digit',
           year: '2-digit',
         })
         .replace(/\//g, '-')}`;
  
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
          `}
        </style>
  
        {/* Search Container */}
        <div className="search-container">
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <label htmlFor="patientSearch" style={{ fontWeight: '600', color: '#374151' }}>
              Search Patient:
            </label>
            <input
              id="patientSearch"
              type="text"
              className="search-input"
              placeholder="Search by IPNo, Patient ID, Name, Department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
  
          <div className="results-info">
            Showing {filteredPatients.length} of {InPatientList.length} records
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
            onClick={handlePrint2}
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
                  colSpan="13"
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
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  S.No
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  IPNo
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  PatientId
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Patient Details
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Department
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Gender
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Age
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Admission Date
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Admission Time
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Ward Name
                </th>
                {/* <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Floor Name
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Bed No
                </th> */}
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Prepared
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(WardPatients).length > 0 ? (
                Object.entries(WardPatients).map(([wardName, records]) =>
                  renderTableSection(records, wardName)
                )
              ) : (
                <tr>
                  <td colSpan="13" style={{ border: '1px solid #dee2e6', padding: '20px', textAlign: 'center', color: '#6b7280' }}>
                    No records found for "{searchTerm}"
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              {filteredPatients.length > 0 && (
                <tr
                  style={{
                    fontWeight: 'bold',
                    fontSize: '13px',
                    backgroundColor: '#2c3e50',
                    color: 'white',
                  }}
                >
                  <td
                    colSpan="10"
                    style={{
                      padding: '10px',
                      border: '1px solid #dee2e6',
                      borderTop: '2px solid #3498db',
                      textAlign: 'right',
                    }}
                  >
                    GRAND TOTAL ({filteredPatients.length} records)
                  </td>
                  <td
                    style={{
                      padding: '10px',
                      border: '1px solid #dee2e6',
                      borderTop: '2px solid #3498db',
                      textAlign: 'center',
                      backgroundColor: '#3498db',
                      fontSize: '14px',
                    }}
                  >
                    {grandTotal}
                  </td>
                </tr>
              )}
            </tfoot>
          </table>
  
          <div
            className="footer-text"
            style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderLeft: '4px solid #3498db',
              borderRadius: '4px',
            }}
          >
            <p
              style={{
                margin: '0',
                fontSize: '12px',
                color: '#7f8c8d',
                lineHeight: '1.5',
              }}
            >
              <strong>Note:</strong> This report includes in-patient details grouped by ward with IP number, patient name, prefix, address, department, gender, age, admission date, ward, floor, bed, and prepared by.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const AdmissionSpecialityPrint = () => {
  const componentRef = useRef();
  const [showOnlyCount, setShowOnlyCount] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Group by Dept (speciality)
  const SpecialityPatients = AdmissionList.reduce((acc, patient) => {
    const speciality = patient.Dept || 'Unknown';
    if (!acc[speciality]) {
      acc[speciality] = [];
    }
    acc[speciality].push({
      sno: acc[speciality].length + 1,
      IPNo: patient.IPNo,
      PatientId: patient.PatientId,
      PatientName: patient.PatientName,
      prefix: patient.prefix,
      Address: patient.Address,
      Dept: patient.Dept,
      gender: patient.gender,
      Age: patient.Age,
      AdmissionDate: patient.AdmissionDate,
      AdmissionTime: patient.AdmissionTime,
      WardName: patient.WardName,
      Floor: patient.Floor,
      Bedno: patient.Bedno,
      Createdby: patient.Createdby
    });
    return acc;
  }, {});

   const handlePrint = useReactToPrint({
      content: () => componentRef.current,
      documentTitle: `Specialty_MRI_Report_${new Date().toISOString().split('T')[0]}`,
    });

  // Get specialties for filtered view
  const specialties = Object.entries(SpecialityPatients)
    .filter(([specialityName]) => 
      !searchTerm || specialityName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort(([a], [b]) => a.localeCompare(b));

  // Filter patients within specialties if search term includes patient details
  const filteredSpecialties = specialties.map(([specialityName, patients]) => {
    if (!searchTerm) return [specialityName, patients];
    
    const lowerSearch = searchTerm.toLowerCase();
    const filteredPatients = patients.filter(patient =>
      patient.PatientName?.toLowerCase().includes(lowerSearch) ||
      patient.IPNo?.toLowerCase().includes(lowerSearch) ||
      patient.PatientId?.toLowerCase().includes(lowerSearch)
    );
    
    return [specialityName, filteredPatients];
  }).filter(([_, patients]) => patients.length > 0);

  const renderTableSection = (specialityData, specialityName, specIndex) => {
    if (!specialityData || specialityData.length === 0) return null;

    if (showOnlyCount) {
      // Compact view showing only specialty totals
      return (
        <tr
          key={`specialty-${specIndex}`}
          style={{
            backgroundColor: specIndex % 2 === 0 ? '#f8f9fa' : 'white',
            fontSize: '12px',
          }}
        >
          <td style={{ 
            padding: '10px', 
            textAlign: 'center', 
            border: '1px solid #dee2e6',
            fontWeight: '600'
          }}>
            {specIndex + 1}
          </td>
          <td colSpan="2" style={{ 
            padding: '10px', 
            textAlign: 'left', 
            border: '1px solid #dee2e6',
            fontWeight: '600',
            color: '#1e40af'
          }}>
            {specialityName}
          </td>
          <td style={{ 
            padding: '10px', 
            textAlign: 'center', 
            border: '1px solid #dee2e6',
            color: '#059669',
            fontWeight: '600',
            fontSize: '14px'
          }}>
            {specialityData.length}
          </td>
          <td colSpan="7" style={{ 
            padding: '10px', 
            textAlign: 'center', 
            border: '1px solid #dee2e6',
            backgroundColor: '#dbeafe',
            fontWeight: 'bold'
          }}>
            {specialityData.length} Patients
          </td>
        </tr>
      );
    }

    // Original detailed view with patient list
    return (
      <>
        <tr key={`header-${specIndex}`}>
          <td
            colSpan="11"
            style={{
              border: 'none',
              padding: '12px 0 6px',
              fontSize: '14px',
              fontWeight: 'bold',
              textAlign: 'left',
              color: '#2c3e50',
              borderBottom: '2px solid #3498db',
            }}
          >
            Speciality: {specialityName} | Total: {specialityData.length}
          </td>
        </tr>
        {specialityData.map((patient, index) => (
          <tr
            key={`patient-${specialityName}-${index}`}
            style={{
              fontSize: '11px',
              backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
            }}
          >
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.sno}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.IPNo}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.PatientId}
            </td>
            <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
              <div>{patient.PatientName}</div>
              <div>{patient.prefix}</div>
              <div>{patient.Address}</div>
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.Dept || 'N/A'}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.gender}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.Age}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.AdmissionDate}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.AdmissionTime}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.WardName || 'N/A'}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.Createdby || 'N/A'}
            </td>
          </tr>
        ))}
        {/* Specialty totals row for detailed view */}
        <tr
          style={{
            fontWeight: 'bold',
            fontSize: '12px',
            backgroundColor: '#e5e7eb',
            borderTop: '2px solid #9ca3af'
          }}
        >
          <td colSpan="10" style={{ 
            padding: '10px', 
            textAlign: 'right', 
            border: '1px solid #dee2e6',
            fontWeight: '600'
          }}>
            {specialityName} Total
          </td>
          <td style={{ 
            padding: '10px', 
            textAlign: 'center', 
            border: '1px solid #dee2e6',
            backgroundColor: '#dbeafe',
            fontWeight: 'bold',
            fontSize: '14px'
          }}>
            {specialityData.length}
          </td>
        </tr>
        {/* Empty row for spacing between specialties */}
        <tr>
          <td colSpan="11" style={{ padding: '5px', border: 'none' }}></td>
        </tr>
      </>
    );
  };

  const grandTotal = AdmissionList.length || 0;

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
            .search-container, .toggle-container, .stats-container {
              display: none !important;
            }
          }
          .toggle-container {
            display: flex;
            align-items: center;
            gap: 8px;
            background: #f8fafc;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid #e2e8f0;
          }
          .toggle-label {
            font-weight: 500;
            color: #374151;
            font-size: 14px;
          }
          .toggle-switch {
            position: relative;
            display: inline-block;
            width: 48px;
            height: 24px;
          }
          .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
          }
          .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            transition: .4s;
            border-radius: 24px;
          }
          .toggle-slider:before {
            position: absolute;
            content: "";
            height: 16px;
            width: 16px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            transition: .4s;
            border-radius: 50%;
          }
          input:checked + .toggle-slider {
            background-color: #2563eb;
          }
          input:checked + .toggle-slider:before {
            transform: translateX(24px);
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

      {/* Search and Toggle Container */}
      <div className="search-container">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label htmlFor="patientSearch" style={{ fontWeight: '600', color: '#374151' }}>
            Search:
          </label>
          <input
            id="patientSearch"
            type="text"
            className="search-input"
            placeholder="Search specialty or patient details..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          
          {/* Toggle for showing only specialty counts */}
          <div className="toggle-container">
            <span className="toggle-label">Specialty Count Only</span>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={showOnlyCount}
                onChange={(e) => setShowOnlyCount(e.target.checked)}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          Showing {filteredSpecialties.length} of {Object.keys(SpecialityPatients).length} specialties
          {searchTerm && (
            <span> for "<strong>{searchTerm}</strong>"</span>
          )}
          {showOnlyCount && (
            <span style={{ color: '#2563eb', marginLeft: '8px' }}>
              • Showing only specialty totals
            </span>
          )}
        </div>

        {searchTerm && (
          <button
            style={{
              padding: '8px 12px',
              backgroundColor: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
            onClick={() => setSearchTerm('')}
          >
            Clear Search
          </button>
        )}

        {/* Statistics Cards */}
        <div className="stats-container">
          <div className="stat-card" style={{ borderLeftColor: '#3b82f6' }}>
            <div className="stat-label">Specialties</div>
            <div className="stat-value">{filteredSpecialties.length}</div>
          </div>
          <div className="stat-card" style={{ borderLeftColor: '#10b981' }}>
            <div className="stat-label">Total Patients</div>
            <div className="stat-value">
              {filteredSpecialties.reduce((sum, [_, patients]) => sum + patients.length, 0)}
            </div>
          </div>
        </div>
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

      <div className="print-container">
        <div ref={componentRef}>
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
                  colSpan={showOnlyCount ? "5" : "11"}
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
                    <p
                      style={{
                        margin: '10px 0 0',
                        fontSize: '14px',
                        color: '#34495e',
                        fontWeight: '500',
                      }}
                    >
                      {searchOptions.DateType === 'Current' ? (
                        <>
                          Report Date:{' '}
                          {new Date(searchOptions.CurrentDate || new Date()).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          }).replace(/\//g, '-')}
                        </>
                      ) : searchOptions.DateType === 'Particular' ? (
                        <>
                          Report Date:{' '}
                          {new Date(searchOptions.ParticularDate || new Date()).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          }).replace(/\//g, '-')}
                        </>
                      ) :(
                        <>
                          Report From:{' '}
                          {new Date(searchOptions.FromDate || new Date()).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          }).replace(/\//g, '-')}
                          {' To: '}
                          {new Date(searchOptions.ToDate || new Date()).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          }).replace(/\//g, '-')}
                        </>
                      )}
                    </p>
                    <p style={{ margin: '5px 0', fontSize: '14px', fontWeight: '500' }}>
                      {showOnlyCount ? 'ADMISSION REPORT - SPECIALTY COUNT' : 'ADMISSION REPORT - PATIENT DETAILS'}
                    </p>
                    {searchTerm && (
                      <p style={{ margin: '5px 0', fontSize: '14px', color: '#ef4444', fontStyle: 'italic' }}>
                        Filtered results for: "{searchTerm}"
                      </p>
                    )}
                    {showOnlyCount && (
                      <p style={{ 
                        margin: '5px 0', 
                        fontSize: '14px', 
                        color: '#2563eb', 
                        fontWeight: '500',
                        backgroundColor: '#dbeafe',
                        display: 'inline-block',
                        padding: '4px 12px',
                        borderRadius: '4px'
                      }}>
                        Viewing Specialty Count Only
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
                {showOnlyCount ? (
                  <>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '8%' }}>
                      S.No
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '42%' }}>
                      Speciality
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '15%' }}>
                      Count
                    </th>
                    <th colSpan="2" style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600', width: '35%' }}>
                      Specialty Total
                    </th>
                  </>
                ) : (
                  <>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      S.No
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      IPNo
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      PatientId
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      Patient Details
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      Department
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      Gender
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      Age
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      Admission Date
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      Admission Time
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      Ward Name
                    </th>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                      Prepared
                    </th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {filteredSpecialties.length > 0 ? (
                filteredSpecialties.map(([specialityName, patients], index) =>
                  renderTableSection(patients, specialityName, index)
                )
              ) : (
                <tr>
                  <td
                    colSpan={showOnlyCount ? "5" : "11"}
                    style={{
                      padding: '40px 15px',
                      textAlign: 'center',
                      color: '#6b7280',
                      border: '1px solid #dee2e6',
                      fontStyle: 'italic',
                    }}
                  >
                    No admission data found{searchTerm ? ` for "${searchTerm}"` : ''}
                  </td>
                </tr>
              )}
            </tbody>
            <tfoot>
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                }}
              >
                <td
                  colSpan={showOnlyCount ? "3" : "10"}
                  style={{
                    padding: '10px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL ({filteredSpecialties.length} Specialties)
                </td>
                <td
                  colSpan={showOnlyCount ? "2" : "1"}
                  style={{
                    padding: '10px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#3498db',
                    fontSize: '14px',
                  }}
                >
                  {filteredSpecialties.reduce((sum, [_, patients]) => sum + patients.length, 0)}
                </td>
              </tr>
            </tfoot>
          </table>

          <div
            className="footer-text"
            style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderLeft: '4px solid #3498db',
              borderRadius: '4px',
            }}
          >
            <p
              style={{
                margin: '0',
                fontSize: '12px',
                color: '#7f8c8d',
                lineHeight: '1.5',
              }}
            >
              <strong>Note:</strong> 
              {showOnlyCount 
                ? ' This report shows specialty-wise patient counts only. For detailed patient information, disable the "Specialty Count Only" toggle.'
                : ' This report includes in-patient admission details grouped by speciality with serial number, IP number, patient name, prefix, address, department, gender, age, admission date, ward, floor, bed, and prepared by.'
              }
            </p>
            {showOnlyCount && (
              <p style={{ margin: '5px 0 0', fontSize: '11px', color: '#2563eb', fontStyle: 'italic' }}>
                Generated in summary mode on {new Date().toLocaleString()}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

  const AdmissionWardPrint = () => {
  // Group by WardName
  const WardPatients = AdmissionList.reduce((acc, patient) => {
    const ward = patient.WardName || 'Unknown';
    if (!acc[ward]) {
      acc[ward] = [];
    }
    acc[ward].push({
      sno: acc[ward].length + 1,
      IPNo: patient.IPNo,
      PatientId: patient.PatientId,
      PatientName: patient.PatientName,
      prefix: patient.prefix,
      Address: patient.Address,
      Dept: patient.Dept,
      gender: patient.gender,
      Age: patient.Age,
      AdmissionDate: patient.AdmissionDate,
      AdmissionTime: patient.AdmissionTime,
      WardName: patient.WardName,
      Floor: patient.Floor,
      Bedno: patient.Bedno,
      Createdby: patient.Createdby
    });
    return acc;
  }, {});

  const renderTableSection = (wardData, wardName) => {
    if (!wardData || wardData.length === 0) return null;

    return (
      <>
        <tr>
          <td
            colSpan="11"
            style={{
              border: 'none',
              padding: '12px 0 6px',
              fontSize: '14px',
              fontWeight: 'bold',
              textAlign: 'left',
              color: '#2c3e50',
              borderBottom: '2px solid #3498db',
            }}
          >
            Ward: {wardName} | Total: {wardData.length}
          </td>
        </tr>
        {wardData.map((patient, index) => (
          <tr
            key={`patient-${wardName}-${index}`}
            style={{
              fontSize: '11px',
              backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
            }}
          >
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.sno}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.IPNo}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.PatientId}
            </td>
            <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
              <div>{patient.PatientName}</div>
              <div>{patient.prefix}</div>
              <div>{patient.Address}</div>
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.Dept || 'N/A'}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.gender}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.Age}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.AdmissionDate}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.AdmissionTime}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.WardName || 'N/A'}
            </td>
            {/* <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.Floor || 'N/A'}
            </td>
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.Bedno || 'N/A'}
            </td> */}
            <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
              {patient.Createdby || 'N/A'}
            </td>
          </tr>
        ))}
      </>
    );
  };

  const grandTotal = AdmissionList.length || 0;

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto',
      }}
    >
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
          onClick={handlePrint2}
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

      <div className="print-container">
        <div ref={componentRef}>
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
                  colSpan="12"
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
                    <p
                      style={{
                        margin: '10px 0 0',
                        fontSize: '14px',
                        color: '#34495e',
                        fontWeight: '500',
                      }}
                    >
                      {searchOptions.DateType === 'Current' ? (
                        <>
                          Report Date:{' '}
                          {new Date(searchOptions.CurrentDate || new Date()).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          }).replace(/\//g, '-')}
                        </>
                      ) : searchOptions.DateType === 'Particular' ? (
                        <>
                          Report Date:{' '}
                          {new Date(searchOptions.ParticularDate || new Date()).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          }).replace(/\//g, '-')}
                        </>
                      ) :(
                        <>
                          Report From:{' '}
                          {new Date(searchOptions.FromDate || new Date()).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          }).replace(/\//g, '-')}
                          {' To: '}
                          {new Date(searchOptions.ToDate || new Date()).toLocaleDateString('en-GB', {
                            day: '2-digit',
                            month: '2-digit',
                            year: '2-digit',
                          }).replace(/\//g, '-')}
                        </>
                      )}
                    </p>
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
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  S.No
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  IPNo
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  PatientId
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Patient Details
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Department
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Gender
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Age
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Admission Date
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Admission Time
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Ward Name
                </th>
                {/* <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Floor Name
                </th>
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Bed No
                </th> */}
                <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                  Prepared
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(WardPatients).map(([wardName, records]) =>
                renderTableSection(records, wardName)
              )}
            </tbody>
            <tfoot>
              <tr
                style={{
                  fontWeight: 'bold',
                  fontSize: '13px',
                  backgroundColor: '#2c3e50',
                  color: 'white',
                }}
              >
                <td
                  colSpan="10"
                  style={{
                    padding: '10px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'right',
                  }}
                >
                  GRAND TOTAL
                </td>
                <td
                  style={{
                    padding: '10px',
                    border: '1px solid #dee2e6',
                    borderTop: '2px solid #3498db',
                    textAlign: 'center',
                    backgroundColor: '#3498db',
                    fontSize: '14px',
                  }}
                >
                  {grandTotal}
                </td>
              </tr>
            </tfoot>
          </table>

          <div
            className="footer-text"
            style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderLeft: '4px solid #3498db',
              borderRadius: '4px',
            }}
          >
            <p
              style={{
                margin: '0',
                fontSize: '12px',
                color: '#7f8c8d',
                lineHeight: '1.5',
              }}
            >
              <strong>Note:</strong> This report includes in-patient admission details grouped by ward with serial number, IP number, patient name, prefix, address, department, gender, age, admission date, ward, floor, bed, and prepared by.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};


  // const CategoryPrint = () => {
  //   // Combine new and old patients
  //   const allPatients = [
  //     ...RevisitandPatientList.New,
  //     ...RevisitandPatientList.Old
  //   ];

  //   // Group by PatientCategory
  //   const CategoryFee = allPatients.reduce((acc, patient) => {
  //     const category = patient.Category || 'Unknown';
  //     if (!acc[category]) {
  //       acc[category] = [];
  //     }
  //     acc[category].push({
  //       sno: acc[category].length + 1,
  //       PatientId: patient.PatientId,
  //       OPDate: patient.OPDate,
  //       PatientName: patient.PatientName,
  //       Dept: patient.DeptName || 'N/A',
  //       OPType: patient.type || (RevisitandPatientList.New.includes(patient) ? 'New' : 'Follow Up'),
  //       Category: patient.Category || 'N/A',
  //       Insurance: patient.Insurance || 'None',

  //     });
  //     return acc;
  //   }, {});

  //   const renderTableSection = (categoryData, categoryName) => {
  //     if (!categoryData || categoryData.length === 0) return null;

  //     const categoryTotal = categoryData.reduce((sum, record) => sum + parseFloat(record.Fees), 0).toFixed(2);

  //     // Count NEW and FOLLOWUP patients
  //     const newCount = categoryData.filter(record => record.OPType === 'New').length;
  //     const followUpCount = categoryData.filter(record => record.OPType === 'Follow Up').length;

  //     // Calculate NEW and FOLLOWUP amounts
  //     const newAmount = categoryData
  //       .filter(record => record.OPType === 'New')
  //       .reduce((sum, record) => sum + parseFloat(record.Fees), 0)
  //       .toFixed(2);

  //     const followUpAmount = categoryData
  //       .filter(record => record.OPType === 'Follow Up')
  //       .reduce((sum, record) => sum + parseFloat(record.Fees), 0)
  //       .toFixed(2);

  //     return (
  //       <>
  //         <tr>
  //           <td
  //             colSpan="10"
  //             style={{
  //               padding: '10px',
  //               textAlign: 'left',
  //               fontWeight: 'bold',
  //               fontSize: '14px',
  //               backgroundColor: '#e9ecef',
  //               border: '1px solid #dee2e6',
  //             }}
  //           >
  //             Category: {categoryName} | New: {newCount} | Follow Up: {followUpCount} | Total: {categoryData.length}
  //           </td>
  //         </tr>
  //         {categoryData.map((record, index) => (
  //           <tr
  //             key={`record-${categoryName}-${index}`}
  //             style={{
  //               fontSize: '11px',
  //               backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
  //             }}
  //           >
  //             <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
  //               {record.sno}
  //             </td>
  //             <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
  //               {record.PatientId}
  //             </td>
  //             <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
  //               {record.OPDate}
  //             </td>
  //             <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
  //               {record.PatientName}
  //             </td>
  //             <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
  //               {record.Dept}
  //             </td>
  //             <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
  //               {record.OPType}
  //             </td>
  //             <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
  //               {record.Category}
  //             </td>
  //             <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
  //               {record.Insurance}
  //             </td>

  //           </tr>
  //         ))}
  //         {/* <tr>
  //           <td
  //             colSpan="8"
  //             style={{
  //               padding: '8px',
  //               textAlign: 'right',
  //               fontWeight: 'bold',
  //               border: '1px solid #dee2e6',
  //               backgroundColor: '#f1f3f5',
  //             }}
  //           >
  //             Category Total - New: ₹{newAmount} | Follow Up: ₹{followUpAmount}
  //           </td>
  //           <td
  //             style={{
  //               padding: '8px',
  //               textAlign: 'center',
  //               fontWeight: 'bold',
  //               border: '1px solid #dee2e6',
  //               backgroundColor: '#f1f3f5',
  //             }}
  //           >
  //             {categoryTotal}
  //           </td>
  //           <td style={{ border: '1px solid #dee2e6' }}></td>
  //         </tr> */}
  //       </>
  //     );
  //   };

  //   const grandTotal = Object.values(CategoryFee).reduce(
  //     (sum, records) => sum + records.reduce((subSum, record) => subSum + parseFloat(record.Fees), 0),
  //     0
  //   ).toFixed(2);

  //   // Calculate overall NEW and FOLLOWUP counts and amounts
  //   const overallNewCount = Object.values(CategoryFee).reduce(
  //     (total, records) => total + records.filter(record => record.OPType === 'New').length,
  //     0
  //   );

  //   const overallFollowUpCount = Object.values(CategoryFee).reduce(
  //     (total, records) => total + records.filter(record => record.OPType === 'Follow Up').length,
  //     0
  //   );

  //   const overallNewAmount = Object.values(CategoryFee).reduce(
  //     (total, records) => total + records
  //       .filter(record => record.OPType === 'New')
  //       .reduce((sum, record) => sum + parseFloat(record.Fees), 0),
  //     0
  //   ).toFixed(2);

  //   const overallFollowUpAmount = Object.values(CategoryFee).reduce(
  //     (total, records) => total + records
  //       .filter(record => record.OPType === 'Follow Up')
  //       .reduce((sum, record) => sum + parseFloat(record.Fees), 0),
  //     0
  //   ).toFixed(2);

  //   const totalPatients = overallNewCount + overallFollowUpCount;

  //   return (
  //     <div
  //       style={{
  //         fontFamily: 'sans-serif',
  //         padding: '1.25rem',
  //         maxWidth: '72rem',
  //         marginLeft: 'auto',
  //         marginRight: 'auto'
  //       }}
  //     >
  //       {/* Buttons Container */}
  //       <div style={{
  //         marginBottom: '20px',
  //         display: 'flex',
  //         gap: '10px',
  //         justifyContent: 'flex-end',
  //       }}>
  //         <button
  //           onClick={handlePrint2}
  //           style={{
  //             padding: '8px 16px',
  //             backgroundColor: '#3498db',
  //             color: 'white',
  //             border: 'none',
  //             borderRadius: '4px',
  //             cursor: 'pointer',
  //             fontWeight: '500',
  //             transition: 'background-color 0.3s',
  //           }}
  //         >
  //           Print Report
  //         </button>
  //         <button
  //           onClick={handlePrintClose}
  //           style={{
  //             padding: '8px 16px',
  //             backgroundColor: '#e74c3c',
  //             color: 'white',
  //             border: 'none',
  //             borderRadius: '4px',
  //             cursor: 'pointer',
  //             fontWeight: '500',
  //             transition: 'background-color 0.3s',
  //           }}
  //         >
  //           Close
  //         </button>
  //       </div>

  //       {/* Print Container */}
  //       <div ref={componentRef}>
  //         <table style={{
  //           width: '100%',
  //           borderCollapse: 'collapse',
  //           border: '1px solid #d1d5db',
  //           marginBottom: '1.25rem'
  //         }}>
  //           <thead>
  //             <tr>
  //               <td
  //                 colSpan="10"
  //                 style={{
  //                   border: 'none',
  //                   textAlign: 'center',
  //                   paddingTop: '1rem',
  //                   paddingBottom: '1rem',
  //                   backgroundColor: '#f3f4f6'
  //                 }}
  //               >
  //                 <div>
  //                   <h2 style={{
  //                     margin: 0,
  //                     fontSize: '1.5rem',
  //                     fontWeight: 'bold',
  //                     color: '#1f2937',
  //                     letterSpacing: '0.025em'
  //                   }}>
  //                     KARUNA MEDICAL COLLEGE HOSPITAL
  //                   </h2>
  //                   <h1 style={{
  //                     marginTop: '0.25rem',
  //                     fontSize: '1.125rem',
  //                     fontWeight: 500,
  //                     color: '#6b7280',
  //                     letterSpacing: '-0.025em'
  //                   }}>
  //                     Vilayodi, Chittur, Palakkad
  //                   </h1>
  //                   <p style={{
  //                     marginTop: '0.625rem',
  //                     fontSize: '0.875rem',
  //                     color: '#4b5563',
  //                     fontWeight: 500
  //                   }}>
  //                     {/* Date display logic remains same */}
  //                   </p>
  //                   <div style={{
  //                     marginTop: '0.5rem',
  //                     fontSize: '0.875rem',
  //                     color: '#1f2937',
  //                     fontWeight: 'bold',
  //                     padding: '0.5rem',
  //                     backgroundColor: '#e5f3ff',
  //                     borderRadius: '0.25rem',
  //                     border: '1px solid #3b82f6'
  //                   }}>
  //                     Total: {totalPatients} patients | New: {overallNewCount} | Follow Up: {overallFollowUpCount}
  //                   </div>
  //                 </div>
  //               </td>
  //             </tr>
  //             <tr style={{
  //               fontWeight: 'bold',
  //               fontSize: '0.75rem',
  //               backgroundColor: '#3b82f6',
  //               color: 'white'
  //             }}>
  //               <th style={{
  //                 padding: '0.625rem',
  //                 textAlign: 'center',
  //                 border: '1px solid #d1d5db',
  //                 fontWeight: 600
  //               }}>S.No</th>
  //               <th style={{
  //                 padding: '0.625rem',
  //                 textAlign: 'center',
  //                 border: '1px solid #d1d5db',
  //                 fontWeight: 600
  //               }}>PatientId</th>
  //               <th style={{
  //                 padding: '0.625rem',
  //                 textAlign: 'center',
  //                 border: '1px solid #d1d5db',
  //                 fontWeight: 600
  //               }}>OP Date</th>
  //               <th style={{
  //                 padding: '0.625rem',
  //                 textAlign: 'center',
  //                 border: '1px solid #d1d5db',
  //                 fontWeight: 600
  //               }}>Patient Name</th>
  //               <th style={{
  //                 padding: '0.625rem',
  //                 textAlign: 'center',
  //                 border: '1px solid #d1d5db',
  //                 fontWeight: 600
  //               }}>Department</th>
  //               <th style={{
  //                 padding: '0.625rem',
  //                 textAlign: 'center',
  //                 border: '1px solid #d1d5db',
  //                 fontWeight: 600
  //               }}>OP Type</th>
  //               <th style={{
  //                 padding: '0.625rem',
  //                 textAlign: 'center',
  //                 border: '1px solid #d1d5db',
  //                 fontWeight: 600
  //               }}>Category</th>
  //               <th style={{
  //                 padding: '0.625rem',
  //                 textAlign: 'center',
  //                 border: '1px solid #d1d5db',
  //                 fontWeight: 600
  //               }}>Insurance</th>

  //             </tr>
  //           </thead>

  //           <tbody>
  //             {Object.entries(CategoryFee).map(([categoryName, records]) =>
  //               renderTableSection(records, categoryName)
  //             )}
  //           </tbody>

  //           {/* <tfoot>
  //             <tr style={{
  //               fontWeight: 'bold',
  //               fontSize: '0.875rem',
  //               backgroundColor: '#1f2937',
  //               color: 'white'
  //             }}>
  //               <td
  //                 colSpan="8"
  //                 style={{
  //                   padding: '0.625rem',
  //                   border: '1px solid #d1d5db',
  //                   borderTop: '2px solid #3b82f6',
  //                   textAlign: 'right'
  //                 }}
  //               >
  //                 GRAND TOTAL - New: ₹{overallNewAmount} | Follow Up: ₹{overallFollowUpAmount}
  //               </td>
  //               <td
  //                 style={{
  //                   padding: '0.625rem',
  //                   border: '1px solid #d1d5db',
  //                   borderTop: '2px solid #3b82f6',
  //                   textAlign: 'center',
  //                   backgroundColor: '#3b82f6',
  //                   fontSize: '0.875rem'
  //                 }}
  //               >
  //                 {grandTotal}
  //               </td>
  //               <td style={{ border: '1px solid #d1d5db', borderTop: '2px solid #3b82f6' }}></td>
  //             </tr>
  //           </tfoot> */}
  //         </table>

  //         <div style={{
  //           marginTop: '1.25rem',
  //           padding: '1rem',
  //           backgroundColor: '#f3f4f6',
  //           borderLeft: '4px solid #3b82f6',
  //           borderRadius: '0.25rem'
  //         }}>
  //           <p style={{
  //             margin: 0,
  //             fontSize: '0.75rem',
  //             color: '#6b7280',
  //             lineHeight: 1.625
  //           }}>
  //             <strong>Note:</strong> This report includes OP registration fee details with separate calculations for New and Follow Up patients, grouped by Patient Category.
  //           </p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // };



  const CategoryPrint = () => {
    // Combine new and old patients
    const allPatients = [
      ...RevisitandPatientList.New,
      ...RevisitandPatientList.Old
    ];

    // Group by PatientCategory
    const CategoryFee = allPatients.reduce((acc, patient) => {
      const category = patient.Category || 'Unknown';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        sno: acc[category].length + 1,
        PatientId: patient.PatientId,
        OPDate: patient.OPDate,
        PatientName: patient.PatientName,
        Dept: patient.DeptName || 'N/A',
        OPType: patient.type || (RevisitandPatientList.New.includes(patient) ? 'New' : 'Follow Up'),
        Category: patient.Category || 'N/A',
        Insurance: patient.Insurance || 'None',
        Fees: patient.Fees || 0,  // Added this; adjust field name if different
      });
      return acc;
    }, {});

    const renderTableSection = (categoryData, categoryName) => {
      if (!categoryData || categoryData.length === 0) return null;

      const categoryTotal = categoryData.reduce((sum, record) => sum + parseFloat(record.Fees), 0).toFixed(2);

      // Count NEW and FOLLOWUP patients for the whole category
      const newCount = categoryData.filter(record => record.OPType === 'New').length;
      const followUpCount = categoryData.filter(record => record.OPType === 'Follow Up').length;

      // Calculate NEW and FOLLOWUP amounts for the whole category
      const newAmount = categoryData
        .filter(record => record.OPType === 'New')
        .reduce((sum, record) => sum + parseFloat(record.Fees), 0)
        .toFixed(2);

      const followUpAmount = categoryData
        .filter(record => record.OPType === 'Follow Up')
        .reduce((sum, record) => sum + parseFloat(record.Fees), 0)
        .toFixed(2);

      // If not 'Insurance' category, render as before
      if (categoryName !== 'Insurance') {
        return (
          <>
            <tr>
              <td
                colSpan="10"
                style={{
                  padding: '10px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  backgroundColor: '#e9ecef',
                  border: '1px solid #dee2e6',
                }}
              >
                Category: {categoryName} | New: {newCount} | Follow Up: {followUpCount} | Total: {categoryData.length}
              </td>
            </tr>
            {categoryData.map((record, index) => (
              <tr
                key={`record-${categoryName}-${index}`}
                style={{
                  fontSize: '11px',
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                }}
              >
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.sno}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.PatientId}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.OPDate}
                </td>
                <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                  {record.PatientName}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.Dept}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.OPType}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.Category}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.Insurance}
                </td>
              </tr>
            ))}
            {/* <tr>
            <td
              colSpan="8"
              style={{
                padding: '8px',
                textAlign: 'right',
                fontWeight: 'bold',
                border: '1px solid #dee2e6',
                backgroundColor: '#f1f3f5',
              }}
            >
              Category Total - New: ₹{newAmount} | Follow Up: ₹{followUpAmount}
            </td>
            <td
              style={{
                padding: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
                border: '1px solid #dee2e6',
                backgroundColor: '#f1f3f5',
              }}
            >
              {categoryTotal}
            </td>
            <td style={{ border: '1px solid #dee2e6' }}></td>
          </tr> */}
          </>
        );
      }

      // For 'Insurance' category: Group by Insurance and render sub-sections
      const insuranceGroups = categoryData.reduce((acc, record) => {
        const ins = record.Insurance || 'None';
        if (!acc[ins]) {
          acc[ins] = [];
        }
        acc[ins].push(record);
        return acc;
      }, {});

      return (
        <>
          <tr>
            <td
              colSpan="10"
              style={{
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '14px',
                backgroundColor: '#e9ecef',
                border: '1px solid #dee2e6',
              }}
            >
              Category: {categoryName} | New: {newCount} | Follow Up: {followUpCount} | Total: {categoryData.length}
            </td>
          </tr>
          {Object.entries(insuranceGroups).map(([insuranceName, insData]) => {
            // Counts for this insurance sub-group
            const insNewCount = insData.filter(r => r.OPType === 'New').length;
            const insFollowUpCount = insData.filter(r => r.OPType === 'Follow Up').length;
            const insTotal = insData.length;

            // Amounts for this insurance sub-group (if needed)
            const insNewAmount = insData
              .filter(r => r.OPType === 'New')
              .reduce((sum, r) => sum + parseFloat(r.Fees), 0)
              .toFixed(2);
            const insFollowUpAmount = insData
              .filter(r => r.OPType === 'Follow Up')
              .reduce((sum, r) => sum + parseFloat(r.Fees), 0)
              .toFixed(2);
            const insTotalAmount = insData.reduce((sum, r) => sum + parseFloat(r.Fees), 0).toFixed(2);

            return (
              <React.Fragment key={`ins-group-${insuranceName}`}>
                <tr>
                  <td
                    colSpan="10"
                    style={{
                      padding: '8px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      backgroundColor: '#f1f3f5',
                      border: '1px solid #dee2e6',
                    }}
                  >
                    Insurance: {insuranceName} | New: {insNewCount} | Follow Up: {insFollowUpCount} | Total: {insTotal}
                  </td>
                </tr>
                {insData.map((record, index) => (
                  <tr
                    key={`record-${categoryName}-${insuranceName}-${index}`}
                    style={{
                      fontSize: '11px',
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                    }}
                  >
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.sno}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.PatientId}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.OPDate}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                      {record.PatientName}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.Dept}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.OPType}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.Category}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.Insurance}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan="8"
                    style={{
                      padding: '8px',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      border: '1px solid #dee2e6',
                      backgroundColor: '#f8f9fa',
                    }}
                  >
                    Sub-Total - New: ₹{insNewAmount} | Follow Up: ₹{insFollowUpAmount}
                  </td>
                  <td
                    style={{
                      padding: '8px',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      border: '1px solid #dee2e6',
                      backgroundColor: '#f8f9fa',
                    }}
                  >
                    {insTotalAmount}
                  </td>
                  <td style={{ border: '1px solid #dee2e6' }}></td>
                </tr>
              </React.Fragment>
            );
          })}
          <tr>
            <td
              colSpan="8"
              style={{
                padding: '8px',
                textAlign: 'right',
                fontWeight: 'bold',
                border: '1px solid #dee2e6',
                backgroundColor: '#f1f3f5',
              }}
            >
              Category Total - New: ₹{newAmount} | Follow Up: ₹{followUpAmount}
            </td>
            <td
              style={{
                padding: '8px',
                textAlign: 'center',
                fontWeight: 'bold',
                border: '1px solid #dee2e6',
                backgroundColor: '#f1f3f5',
              }}
            >
              {categoryTotal}
            </td>
            <td style={{ border: '1px solid #dee2e6' }}></td>
          </tr>
        </>
      );
    };

    const grandTotal = Object.values(CategoryFee).reduce(
      (sum, records) => sum + records.reduce((subSum, record) => subSum + parseFloat(record.Fees), 0),
      0
    ).toFixed(2);

    // Calculate overall NEW and FOLLOWUP counts and amounts
    const overallNewCount = Object.values(CategoryFee).reduce(
      (total, records) => total + records.filter(record => record.OPType === 'New').length,
      0
    );

    const overallFollowUpCount = Object.values(CategoryFee).reduce(
      (total, records) => total + records.filter(record => record.OPType === 'Follow Up').length,
      0
    );

    const overallNewAmount = Object.values(CategoryFee).reduce(
      (total, records) => total + records
        .filter(record => record.OPType === 'New')
        .reduce((sum, record) => sum + parseFloat(record.Fees), 0),
      0
    ).toFixed(2);

    const overallFollowUpAmount = Object.values(CategoryFee).reduce(
      (total, records) => total + records
        .filter(record => record.OPType === 'Follow Up')
        .reduce((sum, record) => sum + parseFloat(record.Fees), 0),
      0
    ).toFixed(2);

    const totalPatients = overallNewCount + overallFollowUpCount;

    return (
      <div
        style={{
          fontFamily: 'sans-serif',
          padding: '1.25rem',
          maxWidth: '72rem',
          marginLeft: 'auto',
          marginRight: 'auto'
        }}
      >
        {/* Buttons Container */}
        <div style={{
          marginBottom: '20px',
          display: 'flex',
          gap: '10px',
          justifyContent: 'flex-end',
        }}>
          <button
            onClick={handlePrint2}
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
        <div ref={componentRef}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            border: '1px solid #d1d5db',
            marginBottom: '1.25rem'
          }}>
            <thead>
              <tr>
                <td
                  colSpan="10"
                  style={{
                    border: 'none',
                    textAlign: 'center',
                    paddingTop: '1rem',
                    paddingBottom: '1rem',
                    backgroundColor: '#f3f4f6'
                  }}
                >
                  <div>
                    <h2 style={{
                      margin: 0,
                      fontSize: '1.5rem',
                      fontWeight: 'bold',
                      color: '#1f2937',
                      letterSpacing: '0.025em'
                    }}>
                      KARUNA MEDICAL COLLEGE HOSPITAL
                    </h2>
                    <h1 style={{
                      marginTop: '0.25rem',
                      fontSize: '1.125rem',
                      fontWeight: 500,
                      color: '#6b7280',
                      letterSpacing: '-0.025em'
                    }}>
                      Vilayodi, Chittur, Palakkad
                    </h1>
                    <p style={{
                      marginTop: '0.625rem',
                      fontSize: '0.875rem',
                      color: '#4b5563',
                      fontWeight: 500
                    }}>
                      {/* Date display logic remains same */}
                    </p>
                    <div style={{
                      marginTop: '0.5rem',
                      fontSize: '0.875rem',
                      color: '#1f2937',
                      fontWeight: 'bold',
                      padding: '0.5rem',
                      backgroundColor: '#e5f3ff',
                      borderRadius: '0.25rem',
                      border: '1px solid #3b82f6'
                    }}>
                      Total: {totalPatients} patients | New: {overallNewCount} | Follow Up: {overallFollowUpCount}
                    </div>
                  </div>
                </td>
              </tr>
              <tr style={{
                fontWeight: 'bold',
                fontSize: '0.75rem',
                backgroundColor: '#3b82f6',
                color: 'white'
              }}>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>S.No</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>PatientId</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>OP Date</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>Patient Name</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>Department</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>OP Type</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>Category</th>
                <th style={{
                  padding: '0.625rem',
                  textAlign: 'center',
                  border: '1px solid #d1d5db',
                  fontWeight: 600
                }}>Insurance</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(CategoryFee).map(([categoryName, records]) =>
                renderTableSection(records, categoryName)
              )}
            </tbody>

            {/* <tfoot>
            <tr style={{
              fontWeight: 'bold',
              fontSize: '0.875rem',
              backgroundColor: '#1f2937',
              color: 'white'
            }}>
              <td
                colSpan="8"
                style={{
                  padding: '0.625rem',
                  border: '1px solid #d1d5db',
                  borderTop: '2px solid #3b82f6',
                  textAlign: 'right'
                }}
              >
                GRAND TOTAL - New: ₹{overallNewAmount} | Follow Up: ₹{overallFollowUpAmount}
              </td>
              <td
                style={{
                  padding: '0.625rem',
                  border: '1px solid #d1d5db',
                  borderTop: '2px solid #3b82f6',
                  textAlign: 'center',
                  backgroundColor: '#3b82f6',
                  fontSize: '0.875rem'
                }}
              >
                {grandTotal}
              </td>
              <td style={{ border: '1px solid #d1d5db', borderTop: '2px solid #3b82f6' }}></td>
            </tr>
          </tfoot> */}
          </table>

          <div style={{
            marginTop: '1.25rem',
            padding: '1rem',
            backgroundColor: '#f3f4f6',
            borderLeft: '4px solid #3b82f6',
            borderRadius: '0.25rem'
          }}>
            <p style={{
              margin: 0,
              fontSize: '0.75rem',
              color: '#6b7280',
              lineHeight: 1.625
            }}>
              <strong>Note:</strong> This report includes OP registration fee details with separate calculations for New and Follow Up patients, grouped by Patient Category.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const IPCategoryPrint = () => {
    // Group by PatientCategory
    const CategoryPatients = InPatientList.reduce((acc, patient) => {
      const category = patient.Patientcategory || 'Unknown';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push({
        sno: acc[category].length + 1,
        IPNo: patient.IPNo,
        PatientId: patient.PatientId,
        PatientName: patient.PatientName,
        prefix: patient.prefix,
        Address: patient.Address,
        Dept: patient.Dept,
        gender: patient.gender,
        Age: patient.Age,
        AdmissionDate: patient.AdmissionDate,
        WardName: patient.WardName,
        Floor: patient.Floor,
        Bedno: patient.Bedno,
        Createdby: patient.Createdby,
        Category: patient.Patientcategory || 'N/A',
        Insurance: patient.Insurance || 'None'
      });
      return acc;
    }, {});

    const renderTableSection = (categoryData, categoryName) => {
      if (!categoryData || categoryData.length === 0) return null;

      // If not 'Insurance' category, render as before
      if (categoryName !== 'Insurance') {
        return (
          <>
            <tr>
              <td
                colSpan="14"
                style={{
                  padding: '10px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  fontSize: '14px',
                  backgroundColor: '#e9ecef',
                  border: '1px solid #dee2e6',
                }}
              >
                Category: {categoryName} | Total: {categoryData.length}
              </td>
            </tr>
            {categoryData.map((record, index) => (
              <tr
                key={`record-${categoryName}-${index}`}
                style={{
                  fontSize: '11px',
                  backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                }}
              >
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.sno}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.IPNo}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.PatientId}
                </td>
                <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                  <div>{record.PatientName}</div>
                  <div>{record.prefix}</div>
                  <div>{record.Address}</div>
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.Dept || 'N/A'}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.gender}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.Age}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.AdmissionDate}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.Category}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.Insurance}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.WardName || 'N/A'}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.Floor || 'N/A'}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.Bedno || 'N/A'}
                </td>
                <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                  {record.Createdby || 'N/A'}
                </td>
              </tr>
            ))}
          </>
        );
      }

      // For 'Insurance' category: Group by Insurance and render sub-sections
      const insuranceGroups = categoryData.reduce((acc, record) => {
        const ins = record.Insurance || 'None';
        if (!acc[ins]) {
          acc[ins] = [];
        }
        acc[ins].push(record);
        return acc;
      }, {});

      return (
        <>
          <tr>
            <td
              colSpan="14"
              style={{
                padding: '10px',
                textAlign: 'left',
                fontWeight: 'bold',
                fontSize: '14px',
                backgroundColor: '#e9ecef',
                border: '1px solid #dee2e6',
              }}
            >
              Category: {categoryName} | Total: {categoryData.length}
            </td>
          </tr>
          {Object.entries(insuranceGroups).map(([insuranceName, insData]) => {
            const insTotal = insData.length;

            return (
              <React.Fragment key={`ins-group-${insuranceName}`}>
                <tr>
                  <td
                    colSpan="14"
                    style={{
                      padding: '8px',
                      textAlign: 'left',
                      fontWeight: 'bold',
                      fontSize: '12px',
                      backgroundColor: '#f1f3f5',
                      border: '1px solid #dee2e6',
                    }}
                  >
                    Insurance: {insuranceName} | Total: {insTotal}
                  </td>
                </tr>
                {insData.map((record, index) => (
                  <tr
                    key={`record-${categoryName}-${insuranceName}-${index}`}
                    style={{
                      fontSize: '11px',
                      backgroundColor: index % 2 === 0 ? '#f8f9fa' : 'white',
                    }}
                  >
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.sno}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.IPNo}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.PatientId}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'left', border: '1px solid #dee2e6' }}>
                      <div>{record.PatientName}</div>
                      <div>{record.prefix}</div>
                      <div>{record.Address}</div>
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.Dept || 'N/A'}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.gender}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.Age}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.AdmissionDate}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.Category}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.Insurance}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.WardName || 'N/A'}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.Floor || 'N/A'}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.Bedno || 'N/A'}
                    </td>
                    <td style={{ padding: '6px', textAlign: 'center', border: '1px solid #dee2e6' }}>
                      {record.Createdby || 'N/A'}
                    </td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan="13"
                    style={{
                      padding: '8px',
                      textAlign: 'right',
                      fontWeight: 'bold',
                      border: '1px solid #dee2e6',
                      backgroundColor: '#f8f9fa',
                    }}
                  >
                    Sub-Total Patients: {insTotal}
                  </td>
                  <td style={{ border: '1px solid #dee2e6' }}></td>
                </tr>
              </React.Fragment>
            );
          })}
          <tr>
            <td
              colSpan="13"
              style={{
                padding: '8px',
                textAlign: 'right',
                fontWeight: 'bold',
                border: '1px solid #dee2e6',
                backgroundColor: '#f1f3f5',
              }}
            >
              Category Total Patients: {categoryData.length}
            </td>
            <td style={{ border: '1px solid #dee2e6' }}></td>
          </tr>
        </>
      );
    };

    const grandTotal = InPatientList.length || 0;

    return (
      <div
        style={{
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
          padding: '20px',
          maxWidth: '1200px',
          margin: '0 auto',
        }}
      >
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
            onClick={handlePrint2}
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

        <div className="print-container">
          <div ref={componentRef}>
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
                    colSpan="14"
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
                      <p
                        style={{
                          margin: '10px 0 0',
                          fontSize: '14px',
                          color: '#34495e',
                          fontWeight: '500',
                        }}
                      >
                        {searchOptions.DateType === 'Current' ? (
                          <>
                            Report Date:{' '}
                            {new Date(searchOptions.CurrentDate || new Date()).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: '2-digit',
                            }).replace(/\//g, '-')}
                          </>
                        ) : (
                          <>
                            Report From:{' '}
                            {new Date(searchOptions.FromDate || new Date()).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: '2-digit',
                            }).replace(/\//g, '-')}
                            {' To: '}
                            {new Date(searchOptions.ToDate || new Date()).toLocaleDateString('en-GB', {
                              day: '2-digit',
                              month: '2-digit',
                              year: '2-digit',
                            }).replace(/\//g, '-')}
                          </>
                        )}
                      </p>
                      <div style={{
                        marginTop: '0.5rem',
                        fontSize: '0.875rem',
                        color: '#1f2937',
                        fontWeight: 'bold',
                        padding: '0.5rem',
                        backgroundColor: '#e5f3ff',
                        borderRadius: '0.25rem',
                        border: '1px solid #3b82f6'
                      }}>
                        Total: {grandTotal} patients
                      </div>
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
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    S.No
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    IPNo
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    PatientId
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Patient Details
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Department
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Gender
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Age
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Admission Date
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Category
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Insurance
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Ward Name
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Floor Name
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Bed No
                  </th>
                  <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #dee2e6', fontWeight: '600' }}>
                    Prepared
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(CategoryPatients).map(([categoryName, records]) =>
                  renderTableSection(records, categoryName)
                )}
              </tbody>
              <tfoot>
                <tr
                  style={{
                    fontWeight: 'bold',
                    fontSize: '13px',
                    backgroundColor: '#2c3e50',
                    color: 'white',
                  }}
                >
                  <td
                    colSpan="13"
                    style={{
                      padding: '10px',
                      border: '1px solid #dee2e6',
                      borderTop: '2px solid #3498db',
                      textAlign: 'right',
                    }}
                  >
                    GRAND TOTAL
                  </td>
                  <td
                    style={{
                      padding: '10px',
                      border: '1px solid #dee2e6',
                      borderTop: '2px solid #3498db',
                      textAlign: 'center',
                      backgroundColor: '#3498db',
                      fontSize: '14px',
                    }}
                  >
                    {grandTotal}
                  </td>
                </tr>
              </tfoot>
            </table>

            <div
              className="footer-text"
              style={{
                marginTop: '20px',
                padding: '15px',
                backgroundColor: '#f8f9fa',
                borderLeft: '4px solid #3498db',
                borderRadius: '4px',
              }}
            >
              <p
                style={{
                  margin: '0',
                  fontSize: '12px',
                  color: '#7f8c8d',
                  lineHeight: '1.5',
                }}
              >
                <strong>Note:</strong> This report includes in-patient details grouped by patient category, with special handling for insurance categories including sub-grouping by insurance provider.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const [doctorSearchTerm, setDoctorSearchTerm] = useState("");






  return (
    <>
      <div className="Main_container_app">
        <h3>Patient Report</h3>

        {/* ---------- View Type Radio Buttons ---------- */}
        <div className="RegisterTypecon">
          <div className="RegisterType">
            {[
              "NewPatientList",
              "RevisitPatientList",
              "New&RevisitList",
              "OPRegFee",
              "OPCensus",
              "InPatientList",
              "DischargeList",
              "AdmissionList",
              "IPDoctorReports",
              "IPCensus",
              // "Casuality",
              // "MLC",
              // "DeathCensus"


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

        {/* ---------- Search Options (Date) ---------- */}
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

        {/* ---------- Conditional Filters ---------- */}
        {[
          "InPatientList",
          "DischargeList",
          "AdmissionList",
          "NewPatientList",
          "RevisitPatientList",
          "New&RevisitList",
          "OPRegFee",
          "OPCensus",
          "IPCensus"
        ].includes(viewType) && (
            <>
              {/* ---- Department / Speciality ---- */}
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

                  {Array.isArray(SpecialityData) && SpecialityData.length > 0 ? (
                    SpecialityData.map((speciality, index) => (
                      <div key={index}>
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
                            onChange={(e) => handleCheckboxChangeSpeciality(e, speciality)}
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

              {/* ---- Ward (only for IP-related views) ---- */}
              {["InPatientList", "DischargeList", "AdmissionList", "IPCensus"].includes(viewType) && (
                <div className="Main_container_app">
                  <h3>Ward</h3>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      alignItems: "center",
                      gap: "15px",
                      padding: "0px 15px",
                    }}
                  >
                    <div>
                      <label style={{ gap: "15px", padding: "10px" }}>
                        <input
                          type="checkbox"
                          checked={SelectedWards.length === WardData.length}
                          onChange={handleSelectAll}
                        />
                        Select All
                      </label>
                    </div>

                    {Array.isArray(WardData) && WardData.length > 0 ? (
                      WardData.map((ward, index) => (
                        <div key={index}>
                          <label
                            htmlFor={`ward-${index}`}
                            style={{ gap: "15px", padding: "10px" }}
                          >
                            <input
                              type="checkbox"
                              name="wardArray"
                              id={`ward-${index}`}
                              value={`${ward.WardName} | ${ward.id}`}
                              checked={isWardChecked(ward)}
                              onChange={(e) => handleCheckboxChangeward(e, ward)}
                            />
                            {ward.WardName}
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="Add_items_Purchase_Master">
                        <span>No Ward Found</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* ---- Gender ---- */}
              <div className="Main_container_app">
                <h3>Gender</h3>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                    gap: "15px",
                    padding: "0px 15px",
                  }}
                >
                  <div>
                    <label style={{ gap: "15px", padding: "10px" }}>
                      <input
                        type="checkbox"
                        id="select-all-genders"
                        checked={selectedGenders.length === 4}
                        onChange={handleSelectAllGenders}
                      />
                      Select All
                    </label>
                  </div>

                  {["Male", "MaleChild", "Female", "FemaleChild"].map((gender, index) => (
                    <div key={index}>
                      <label
                        htmlFor={`gender-${index}`}
                        style={{ gap: "15px", padding: "10px" }}
                      >
                        <input
                          type="checkbox"
                          name="genderArray"
                          id={`gender-${index}`}
                          value={gender}
                          checked={isGenderChecked(gender)}
                          onChange={(e) => handleCheckboxChangeGender(e, gender)}
                        />
                        {gender}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* ---- Category ---- */}
              <div className="Main_container_app">
                <h3>Category</h3>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "flex-start",
                    gap: "15px",
                    padding: "0px 15px",
                  }}
                >
                  <div>
                    <label style={{ gap: "15px", padding: "10px" }}>
                      <input
                        type="checkbox"
                        id="select-all-categories"
                        checked={selectedCategories.length === 10}
                        onChange={handleSelectAllCategories}
                      />
                      Select All
                    </label>
                  </div>

                  {[
                    "General",
                    "Student",
                    "FreeAll",
                    "Camp",
                    "KRCL",
                    "Insurance",
                    "Employee",
                    "EmployeeRelation",
                    "Doctor",
                    "DoctorRelation",
                  ].map((category, index) => (
                    <div key={index}>
                      <label
                        htmlFor={`category-${index}`}
                        style={{ gap: "15px", padding: "10px" }}
                      >
                        <input
                          type="checkbox"
                          name="categoryArray"
                          id={`category-${index}`}
                          value={category}
                          checked={isCategoryChecked(category)}
                          onChange={(e) => handleCheckboxChangeCategory(e, category)}
                        />
                        {category}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* ---- Insurance (only when Insurance is selected) ---- */}
              {selectedCategories.includes("Insurance") && (
                <div style={{ marginTop: "20px", padding: "0px 15px" }}>
                  <h4>Select Insurance Providers</h4>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "15px" }}>
                    <div>
                      <label style={{ gap: "15px", padding: "10px" }}>
                        <input
                          type="checkbox"
                          id="select-all-insurance"
                          checked={
                            Array.isArray(Insurance) &&
                            Insurance.length > 0 &&
                            selectedInsurance.length === Insurance.length
                          }
                          onChange={handleSelectAllInsurance}
                        />
                        Select All
                      </label>
                    </div>

                    {Array.isArray(Insurance) && Insurance.length > 0 ? (
                      Insurance.map((insurance, index) => (
                        <div key={index}>
                          <label
                            htmlFor={`insurance-${index}`}
                            style={{ gap: "15px", padding: "10px" }}
                          >
                            <input
                              type="checkbox"
                              id={`insurance-${index}`}
                              value={insurance.id}
                              checked={selectedInsurance.includes(insurance.id)}
                              onChange={(e) => handleInsuranceChange(e, insurance.id)}
                            />
                            {insurance.Name}
                          </label>
                        </div>
                      ))
                    ) : (
                      <div className="Add_items_Purchase_Master">
                        <span>No Insurance Found</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </>
          )}


        {["IPDoctorReports"].includes(viewType) && (
          <div className="Main_container_app">
            <h3>Doctor</h3>

            {/* 🔍 Search Box */}
            <div style={{ padding: "10px 15px" }}>
              <input
                type="text"
                placeholder="Search Doctor..."
                value={doctorSearchTerm}
                onChange={(e) => setDoctorSearchTerm(e.target.value)}
                style={{
                  padding: "8px 12px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                  width: "100%",
                  maxWidth: "300px",
                }}
              />
            </div>

            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: "15px",
                padding: "0px 15px",
              }}
            >
              {/* ✅ Select All */}
              <div>
                <label style={{ gap: "15px", padding: "10px" }}>
                  <input
                    type="checkbox"
                    checked={SelectedDocs.length === AllDocData.length}
                    onChange={handleSelectAllDocs}
                  />
                  Select All
                </label>
              </div>

              {/* ✅ Filtered Doctor List */}
              {Array.isArray(AllDocData) && AllDocData.length > 0 ? (
                AllDocData.filter((doc) =>
                  doc.Name.toLowerCase().includes(doctorSearchTerm.toLowerCase())
                ).length > 0 ? (
                  AllDocData.filter((doc) =>
                    doc.Name.toLowerCase().includes(doctorSearchTerm.toLowerCase())
                  ).map((doc, index) => (
                    <div key={index}>
                      <label
                        htmlFor={`doc-${index}`}
                        style={{ gap: "15px", padding: "10px" }}
                      >
                        <input
                          type="checkbox"
                          name="docArray"
                          id={`doc-${index}`}
                          value={`${doc.Name} | ${doc.id}`}
                          checked={isDoctorChecked(doc)}
                          onChange={(e) => handleCheckboxChangeDoc(e, doc)}
                        />
                        {doc.Name}
                      </label>
                    </div>
                  ))
                ) : (
                  <div className="Add_items_Purchase_Master">
                    <span>No matching doctor found</span>
                  </div>
                )
              ) : (
                <div className="Add_items_Purchase_Master">
                  <span>No Doctor Found</span>
                </div>
              )}
            </div>
          </div>
        )}


        <br />
      </div>

      {/* ---------- Print Modal ---------- */}
      {OpenModal && (
        <div className="loader" onClick={closeModal}>
          <div className="cardModel" onClick={(e) => e.stopPropagation()}>
            {viewType === "OPCensus" ? (
              <OPCensusPrint />
            ) : viewType === "NewPatientList" ? (
              printBySpeciality ? (
                <SpecialityPrint />
              ) : printBycategory ? (
                <CategoryPrint />
              ) : (
                <NewPatientListPrint />
              )
            ) : viewType === "RevisitPatientList" ? (
              printBySpeciality ? (
                <SpecialityPrint />
              ) : printBycategory ? (
                <CategoryPrint />
              ) : (
                <RevisitPatientListPrint />
              )
            ) : viewType === "New&RevisitList" ? (
              printBySpeciality ? (
                <SpecialityPrint />
              ) : printBycategory ? (
                <CategoryPrint />
              ) : (
                <NewandRevisitListPrint />
              )
            ) : viewType === "InPatientList" ? (
              printBySpeciality ? (
                <IPSpecialityPrint />
              ) : printBycategory ? (
                <IPCategoryPrint />
              ) : printByWard ? (
                <IPWardPrint />
              ) : (
                <InPatientListPrint />
              )
            ) : viewType === "DischargeList" ? (
              printBySpeciality ? (
                <DischargeSpecialityPrint />
              ) : printByWard ? (
                <DischargeWardPrint />
              ) : (
                <DischargeListprint />
              )
            ) : viewType === "OPRegFee" ? (
              <OPRegFeeprint />
            ) : viewType === "IPDoctorReports" ? (
              <IPDoctorReportPrint />
            )
              : viewType === "AdmissionList" ? (
                printBySpeciality ? (
                  <AdmissionSpecialityPrint />
                ) : printByWard ? (
                  <AdmissionWardPrint />
                ) : (
                  <AdmissionListPrint />
                )
              ) : viewType === "IPCensus" ? <IPCensusPrint /> : null}
          </div>
        </div>
      )}
    </>
  );





}

export default MCIPatientReports