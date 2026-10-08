import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid"
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';



const OtRequest = () => {

  const DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.DoctorWorkbenchNavigation);
  console.log("DoctorWorkbenchNavigation", DoctorWorkbenchNavigation)
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log("userRecord", userRecord)
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const dispatchvalue = useDispatch();



  const [OtRequest, setOtRequest] = useState({
    Speciality: "",
    PrimaryDr: "",
    SurgeryName: "",
    SurgeryRequestedDate: "",
    SurgeryRequestedTime: "",
    DurationNumber: "",
    DurationUnit: "",
    RequestedBy: "",
    Remarks: "",
    
  });

  const [OtRequestGridData, setOtRequestOtRequestGridData] = useState([])
  const [IsOtRequestGetData, setIsOtRequestGetData] = useState(false)
  const [IsOtRequestViewMode, setIsOtRequestViewMode] = useState(false)


  const [DoctorData, setDoctorData] = useState([]);
  const [SpecializationData, setSpecializationData] = useState([]);


  useEffect(() => {
    if (OtRequest.Speciality) {
        
    
    axios.get(`${UrlLink}Masters/get_Doctor_by_Speciality_Detials?Speciality=${OtRequest.Speciality}`)
        .then((res) => {
            const ress = res.data
            console.log(ress)
            setDoctorData(ress)

        })
        .catch((err) => {
            console.log(err);
        })
    }
    }, [UrlLink,OtRequest.Speciality])


    useEffect(() => {
        axios.get(`${UrlLink}Masters/Doctors_Speciality_Detials_link`)
            .then((res) => {
                const ress = res.data
                console.log(ress)
                setSpecializationData(ress)
    
            })
            .catch((err) => {
                console.log(err);
            })
    }, [UrlLink])


  const OtRequestColumns = [
    {
        key: 'id',
        name: 'S.No',
        frozen: true
    },
    { key: 'PrimaryDoctorName', name: 'Doctor Name', frozen: true },

    {
        key: 'CurrDate',
        name: 'Date',
        frozen: true
    },
    {
        key: 'CurrTime',
        name: 'Time',
        frozen: true
    },



    {
        key: 'view',
        frozen: true,
        name: 'View',
        renderCell: (params) => (
            <IconButton onClick={() => handleOtRequestView(params.row)}>
                <VisibilityIcon />
            </IconButton>
        ),
    },
    


    ]

    useEffect(() => {
        axios.get(`${UrlLink}Workbench/Workbench_OtRequest_Details`, { params: { RegistrationId: DoctorWorkbenchNavigation?.pk } })
          .then((res) => {
            const ress = res.data
            console.log(res);
            setOtRequestOtRequestGridData(ress)
          })
          .catch((err) => {
            console.log(err);
          })
    }, [IsOtRequestGetData, UrlLink, DoctorWorkbenchNavigation])


    const handleOtRequestView = (data) => {
        setOtRequest({
            Speciality: data.Speciality || '',
            PrimaryDr: data.PrimaryDr || '',
            SurgeryName: data.SurgeryName || '',
            SurgeryRequestedDate: data.SurgeryRequestedDate || '',
            SurgeryRequestedTime: data.SurgeryRequestedTime || '',
            DurationNumber: data.DurationNumber || '',
            DurationUnit: data.DurationUnit || '',
            RequestedBy: data.RequestedBy || '',
            Remarks: data.Remarks || '',
        });
        setIsOtRequestViewMode(true);
    };


    const handleOtRequestClear = () => {
        setOtRequest({
            Speciality: '',
            PrimaryDr: '',
            SurgeryName: '',
            SurgeryRequestedDate: '',
            SurgeryRequestedTime: '',
            DurationNumber: '',
            DurationUnit: '',
            RequestedBy: '',
            Remarks: '',
            
        });
        setIsOtRequestViewMode(false);
    };

    const handleOtRequestInputChange = (event) => {
        const { name, value } = event.target;
        setOtRequest((prevData) => ({
          ...prevData,
          [name]: value
        }));
      };

     
      const handleOtRequestSubmit = () => {
        const postdata = {
          Patient_id: DoctorWorkbenchNavigation?.PatientId,
          RegistrationId: DoctorWorkbenchNavigation?.pk,
          ...OtRequest,
          Created_by: userRecord?.username
        };
    
        axios.post(`${UrlLink}Workbench/Workbench_OtRequest_Details`, postdata)
          .then(response => {
            const resData = response.data;
            const mess = Object.values(resData)[0];
            const typp = Object.keys(resData)[0];
            const tdata = {
              message: mess,
              type: typp,
            };
    
            dispatchvalue({ type: 'toast', value: tdata });
            handleOtRequestClear();  // Reset the form
            setIsOtRequestGetData(!IsOtRequestGetData);  // Trigger a data refresh
          })
          .catch((err) => {
            console.log(err);
            dispatchvalue({ type: 'toast', value: { message: 'Error submitting data', type: 'error' } });
          });
      };





  return (
    <>
    <div className="RegisFormcon_1">
        <br />
        <div className="common_center_tag">
          <span>OT Request </span>
        </div>

        <div className="RegisFormcon">
            <div className="RegisForm_1">
              <label>
                Speciality <span>:</span>
              </label>
              <select
                name="Speciality"
                value={OtRequest.Speciality}
                onChange={handleOtRequestInputChange}
              >
                <option value="">Select</option>
                {SpecializationData.map((spl, index) => (
                    <option key={index} value={spl.id}>
                    {spl.SpecialityName}
                    </option>
                ))}
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
                Doctor Name <span>:</span>
              </label>
              <select
                name="PrimaryDr"
                value={OtRequest.PrimaryDr}
                onChange={handleOtRequestInputChange}
              >
                <option value="">Select</option>
                {DoctorData.map((doctor, index) => (
                    <option key={index} value={doctor.id}>
                    {doctor.Name}
                    </option>
                ))}
              </select>
            </div>
            <div className="RegisForm_1">
              <label>
              Surgery Name <span>:</span>
              </label>
              <textarea
                name="SurgeryName"
                value={OtRequest.SurgeryName}
                onChange={handleOtRequestInputChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
              Surgery Requested Date <span>:</span>
              </label>
              <input
                name="SurgeryRequestedDate"
                type='date'
                value={OtRequest.SurgeryRequestedDate}
                onChange={handleOtRequestInputChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
              Surgery Requested Time <span>:</span>
              </label>
              <input
                name="SurgeryRequestedTime"
                type='time'
                value={OtRequest.SurgeryRequestedTime}
                onChange={handleOtRequestInputChange}
              />
            </div>
            <div className="RegisForm_1">
                <label htmlFor="duration">
                    Duration<span>:</span>
                </label>
                <input
                    type="number"
                    name="DurationNumber"
                    className="dura_with1"
                    value={OtRequest.DurationNumber}
                    onKeyDown={(e) =>
                        ["e", "E", "+", "-"].includes(e.key) && e.preventDefault()
                    }
                    onChange={handleOtRequestInputChange}
                />
                <select
                    name="DurationUnit"
                    className="dura_with"
                    value={OtRequest.DurationUnit}
                    onChange={handleOtRequestInputChange}
                >
                    <option value="Hours">Hours</option>
                    <option value="Minutes">Minutes</option> {/* Example of adding more options */}
                </select>
            </div>

            <div className="RegisForm_1">
              <label>
              Requested By <span>:</span>
              </label>
              <textarea
                name="RequestedBy"
                type='time'
                value={OtRequest.RequestedBy}
                onChange={handleOtRequestInputChange}
              />
            </div>
            <div className="RegisForm_1">
              <label>
              Remarks<span>:</span>
              </label>
              <textarea
                name="Remarks"
                value={OtRequest.Remarks}
                onChange={handleOtRequestInputChange}
              />
            </div>
          </div>
       
      

      <div className="Main_container_Btn">
        {IsOtRequestViewMode && (
          <button onClick={handleOtRequestClear}>Clear</button>
        )}
        {!IsOtRequestViewMode && (
          <button onClick={handleOtRequestSubmit}>Submit</button>
        )}
      </div>

      {OtRequestGridData.length >= 0 &&
        <ReactGrid columns={OtRequestColumns} RowData={OtRequestGridData} />
      }

      <ToastAlert Message={toast.message} Type={toast.type} />

    </div>
</>
  )
}

export default OtRequest;