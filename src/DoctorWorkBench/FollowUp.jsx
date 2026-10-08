import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import ReactGrid from "../OtherComponent/ReactGrid/ReactGrid";
import { IconButton } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';

const FollowUp = () => {
  const DoctorWorkbenchNavigation = useSelector(state => state.Frontoffice?.DoctorWorkbenchNavigation);
  const toast = useSelector((state) => state.userRecord?.toast);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);

  const dispatchvalue = useDispatch();

  const [Followup, setFollowup] = useState({
    NoOfDays: "",
    Date: '',
  });

  const [FollowupGridData, setFollowupFollowupGridData] = useState([]);
  const [IsFollowupGetData, setIsFollowupGetData] = useState(false);
  const [IsFollowupViewMode, setIsFollowupViewMode] = useState(false);

  const FollowupColumns = [
    { key: 'id', name: 'S.No', frozen: true },
    { key: 'PrimaryDoctorName', name: 'Doctor Name', frozen: true },
    { key: 'CurrDate', name: 'Date', frozen: true },
    { key: 'CurrTime', name: 'Time', frozen: true },
    {
      key: 'view',
      frozen: true,
      name: 'View',
      renderCell: (params) => (
        <IconButton onClick={() => handleFollowupView(params.row)}>
          <VisibilityIcon />
        </IconButton>
      ),
    },
  ];

  useEffect(() => {
    axios.get(`${UrlLink}Workbench/Workbench_FollowUp_Details`, { params: { RegistrationId: DoctorWorkbenchNavigation?.pk } })
      .then((res) => {
        const ress = res.data;
        setFollowupFollowupGridData(ress);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [IsFollowupGetData, UrlLink, DoctorWorkbenchNavigation]);

  const handleFollowupView = (data) => {
    setFollowup({
      NoOfDays: data.NoOfDays || '',
      Date: data.Date || '',
    });
    setIsFollowupViewMode(true);
  };

  const handleFollowupClear = () => {
    setFollowup({
      NoOfDays: '',
      Date: '',
    });
    setIsFollowupViewMode(false);
  };

  const handleFollowupInputChange = (event) => {
    const { name, value } = event.target;

    if (name === "NoOfDays") {
      const numberOfDays = parseInt(value, 10);
      if (!isNaN(numberOfDays)) {
        const newDate = new Date();
        newDate.setDate(newDate.getDate() + numberOfDays);
        const formattedDate = newDate.toISOString().split('T')[0];

        setFollowup((prevData) => ({
          ...prevData,
          NoOfDays: value,
          Date: formattedDate,
        }));
      } else {
        setFollowup((prevData) => ({
          ...prevData,
          NoOfDays: value,
          Date: '',
        }));
      }
    } else if (name === "Date") {
      const selectedDate = new Date(value);
      const currentDate = new Date();
      const timeDiff = selectedDate - currentDate;

      if (timeDiff >= 0) {
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
        setFollowup((prevData) => ({
          ...prevData,
          NoOfDays: daysDiff.toString(),
          Date: value,
        }));
      } else {
        setFollowup((prevData) => ({
          ...prevData,
          NoOfDays: '',
          Date: value,
        }));
      }
    } else {
      setFollowup((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleFollowupSubmit = () => {
    const postdata = {
      Patient_id: DoctorWorkbenchNavigation?.PatientId,
      RegistrationId: DoctorWorkbenchNavigation?.pk,
      NoOfDays: Followup.NoOfDays,
      Date: Followup.Date,
      Created_by: userRecord?.username
    };

    axios.post(`${UrlLink}Workbench/Workbench_FollowUp_Details`, postdata)
      .then(response => {
        const resData = response.data;
        const mess = Object.values(resData)[0];
        const typp = Object.keys(resData)[0];
        const tdata = {
          message: mess,
          type: typp,
        };

        dispatchvalue({ type: 'toast', value: tdata });
        setFollowup({ NoOfDays: '', Date: '' });  // Reset the form
        setIsFollowupGetData(!IsFollowupGetData);  // Trigger a data refresh
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
          <span>Follow Up </span>
        </div>
        {
          Object.keys(Followup).map((p, index) => (
            <div className='RegisForm_1' key={p}>
              {p === 'NoOfDays' ? (
                <>
                  <label htmlFor={`${p}_${index}`}>No Of Days<span>:</span></label>
                  <input
                    id={`${p}_${index}`}
                    type='number'
                    name={p}
                    readOnly={IsFollowupViewMode}
                    value={Followup[p]}
                    onChange={handleFollowupInputChange}
                  />
                </>
              ) : p === 'Date' ? (
                <>
                  <label htmlFor={`${p}_${index}`}>Date<span>:</span></label>
                  <input
                    id={`${p}_${index}`}
                    type='date'
                    name={p}
                    readOnly={false}
                    value={Followup[p]}
                    onChange={handleFollowupInputChange}
                  />
                </>
              ) : null}
            </div>
          ))
        }
      </div>

      <div className="Main_container_Btn">
        {IsFollowupViewMode && (
          <button onClick={handleFollowupClear}>Clear</button>
        )}
        {!IsFollowupViewMode && (
          <button onClick={handleFollowupSubmit}>Submit</button>
        )}
      </div>

      {FollowupGridData.length >= 0 &&
        <ReactGrid columns={FollowupColumns} RowData={FollowupGridData} />
      }

      <ToastAlert Message={toast.message} Type={toast.type} />
    
    
    </>
  );
};

export default FollowUp;
