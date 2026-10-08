import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import ToastAlert from "../OtherComponent/ToastContainer/ToastAlert";
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';

const OP_Sheet = () => {

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const toast = useSelector((state) => state.userRecord?.toast);
  // const UsercreatePatientdata = useSelector(state => state.userRecord?.UsercreatePatientdata);
  const DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.DoctorWorkbenchNavigation);
  const IP_DoctorWorkbenchNavigation = useSelector((state) => state.Frontoffice?.IP_DoctorWorkbenchNavigation);

  const dispatch = useDispatch();


  const [OpSheet, setOpSheet] = useState({
    PrimaryComplaint: "",
    PresentComplaints: "",
    PastHistory: "",
    Allergies: "",
    Diagnosis: "",
    Treatment: "",
  });

  console.log("opshett", OpSheet);


  const [gridData, setGridData] = useState([]);
  const [IsGetData, setIsGetData] = useState(false)
  const [IsViewMode, setIsViewMode] = useState(false)

  const [PrimaryComplaintList, setPrimaryComplaintList] = useState([]);


  const OPSheetcolumns = [
    { key: 'id', name: 'S.No', frozen: true },
    // { key: 'VisitId', name: 'VisitId', frozen: true },
    // { key: 'PrimaryDoctorId', name: 'Doctor Id', frozen: true },
    // { key: 'PrimaryDoctorName', name: 'Doctor Name', frozen: true },
    { key: 'Date', name: 'Date', frozen: true },
    { key: 'Time', name: 'Time', frozen: true },
    // { key: 'PresentComplaints', name: 'Present Complaints' },
    // { key: 'PastHistory', name: 'Past History' },
    // { key: 'Allergies', name: 'Allergies' },
    // { key: 'Diagnosis', name: 'Diagnosis' },
    // { key: 'Treatment', name: 'Treatment' },
    {
      key: 'view',
      name: 'View',
      frozen: true,
      renderCell: (params) => (
        <IconButton onClick={() => handleView(params.row)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];




  useEffect(() => {
    const RegistrationId = DoctorWorkbenchNavigation?.RegistrationId || IP_DoctorWorkbenchNavigation?.RegistrationId;

    axios.get(`${UrlLink}Workbench/Workbench_OP_Sheet_Details`, { params: { RegistrationId} })
      .then((res) => {
        const ress = res.data
        console.log(res);
        setGridData(ress)
      })
      .catch((err) => {
        console.log(err);
      })
  }, [IsGetData, UrlLink,DoctorWorkbenchNavigation,IP_DoctorWorkbenchNavigation])


  
  useEffect(() => {

    axios.get(`${UrlLink}Workbench/Get_Priarycomplaint`, {
      params: {
        PrimaryComplaint: OpSheet.PrimaryComplaint,
      }
    })
      .then((res) => {
        const ress = res.data

        console.log(ress);
        setPrimaryComplaintList(ress)
      })
      .catch((err) => {
        console.log(err);
      })

  }, [IsGetData, UrlLink, OpSheet.PrimaryComplaint])

  
  const handleNeuroSurgeryChange = (e) => {
    const { name, value } = e.target;

    if (name === 'PrimaryComplaint') {
      const findData = PrimaryComplaintList.find(p => p.PrimaryComplaint === value)
      if (findData) {
        setOpSheet(prevState => ({
          ...prevState,
          [name]: value,
          PresentComplaints:findData?.PresentComplaints,
          PastHistory:findData?.PastHistory,
          Allergies:findData?.Allergies,
          Diagnosis:findData?.Diagnosis,
          Treatment:findData?.Treatment,

        }));
      } else {
        setOpSheet(prevState => ({
          ...prevState,
          [name]: value,
          PresentComplaints:'',
          PastHistory:'',
          Allergies:'',
          Diagnosis:'',
          Treatment:'',

        }));
      }
    } else {
      setOpSheet((prev) => ({
        ...prev,
        [name]: value,
      }));
    }


    if (e.target.name === 'PresentComplaints' || e.target.name === 'PastHistory' || e.target.name === 'Allergies' || e.target.name === 'Treatment' || e.target.name === 'Diagnosis') {
      adjustHeight(e);
    }
    
  };
  const adjustHeight = (e) => {
    e.target.style.height = "auto"; // Reset height to calculate scrollHeight
    e.target.style.height = `${e.target.scrollHeight}px`; // Set height to scrollHeight
  };


  const handleView = (data) => {
    setOpSheet({
      PrimaryComplaint: data.PrimaryComplaint || '',
      PresentComplaints: data.PresentComplaints || '',
      PastHistory: data.PastHistory || '',
      Allergies: data.Allergies || '',
      Diagnosis: data.Diagnosis || '',
      Treatment: data.Treatment || '',
    });
    setIsViewMode(true);
  };

  const handleClear = () => {
    setOpSheet({
      PrimaryComplaint: '',
      PresentComplaints: '',
      PastHistory: '',
      Allergies: '',
      Diagnosis: '',
      Treatment: '',
    });
    setIsViewMode(false);
  };



  const handleSubmit = () => {
    const filledFormData = Object.fromEntries(
      Object.entries(OpSheet).filter(([_, value]) => value.trim() !== '')
    );

    if (Object.keys(filledFormData).length === 0) {
      dispatch({
        type: 'toast',
        value: { message: 'Please provide at least one field.', type: 'warn' },
      });
      return; // Exit the function early if no fields are filled
    }

    const data = {
      ...filledFormData,
      RegistrationId: DoctorWorkbenchNavigation?.RegistrationId  || IP_DoctorWorkbenchNavigation?.RegistrationId,


      // PatientId: UsercreatePatientdata?.PatientId?.id,
      // PatientName: `${UsercreatePatientdata?.PatientId?.FirstName || ''} ${UsercreatePatientdata?.PatientId?.MiddleName || ''} ${UsercreatePatientdata?.PatientId?.SurName || ''}`,
      created_by: userRecord?.username || '',
    };

    console.log(data, 'data ');

    axios
      .post(`${UrlLink}Workbench/Workbench_OP_Sheet_Details`, data)
      .then((res) => {
        const [type, message] = [Object.keys(res.data)[0], Object.values(res.data)[0]];
        dispatch({ type: 'toast', value: { message, type } });
        setIsGetData(prev => !prev);
        handleClear();
      })
      .catch((err) => console.log(err));
  };




  return (
    <>
      <div className="form-section5">
        <div className="common_center_tag">
          <h3>Dr Shree Vijay Phadke - OP</h3>
        </div>
        <br />
        
        <div className="Otdoctor_intra_Con">
          <div className="treatcon_body_1 RegisForm_1">
            <label>
              Primary Complaint <span>:</span>
            </label>
            <input
              id='PrimaryComplaint'
              name='PrimaryComplaint'
              value={OpSheet.PrimaryComplaint}
              onChange={handleNeuroSurgeryChange}
              list ="PrimaryComplaintList"
              readOnly={IsViewMode}

            />

          <datalist id='PrimaryComplaintList'>
            {PrimaryComplaintList.map((f,i)=>(
              <option key={i} value={f.PrimaryComplaint}></option>
            ))}
          </datalist>

            
          </div>
          {[
            { id: "PresentComplaints", label: "Present Complaints" },
            { id: "PastHistory", label: "Past History" },
            { id: "Allergies", label: "Allergies" },
            { id: "Diagnosis", label: "Diagnosis" },
            { id: "Treatment", label: "Treatment" },
          ].map((field, indx) => (
            <div className="text_adjust_mt_Ot" key={indx}>
              <label htmlFor={field.id}>
                {field.label} <span>:</span>
              </label>
              <textarea
                id={field.id}
                name={field.id}
                value={OpSheet[field.id]}
                onChange={handleNeuroSurgeryChange}
                readOnly={IsViewMode}

              ></textarea>
            </div>
          ))}
        </div>
      </div>
      <br />

      <div className="Main_container_Btn">

        {IsViewMode && (
          <button onClick={handleClear}>Clear</button>
        )}
        {!IsViewMode && (
          <button onClick={handleSubmit}>Submit</button>
        )}
      </div>
      <div className='RegisFormcon_1 jjxjx_'>
              {gridData.length > 0 &&
        <ReactGrid columns={OPSheetcolumns} RowData={gridData} />
      }
      </div>

      <ToastAlert Message={toast.message} Type={toast.type} />



    </>
  );
};

export default OP_Sheet;
