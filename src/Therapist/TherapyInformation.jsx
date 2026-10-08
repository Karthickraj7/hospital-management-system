import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ToastAlert from '../OtherComponent/ToastContainer/ToastAlert';
import ReactGrid from '../OtherComponent/ReactGrid/ReactGrid';

const TherapistSessionTracking = () => {
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const toast = useSelector((state) => state.userRecord?.toast);
  const dispatchvalue = useDispatch();

  const [sessionData, setSessionData] = useState([]);
  const [sessiondetails, setsessiondetails] = useState([]);
  const [formData, setFormData] = useState({});
const TherapyWorkbenchNavigation = useSelector(state => state.Frontoffice?.TherapistWorkbenchNavigation);
console.log('therapy',TherapyWorkbenchNavigation);


 const TherapyDetails = async () => {
  const payload = {
    Request_Id: TherapyWorkbenchNavigation.Request_Id,
    OP_Register_Id: TherapyWorkbenchNavigation.OP_Register_Id,
  };

  try {
    const response = await axios.get(`${UrlLink}OP/get_therapy_datas_for_therapist`, {
      params: payload,
    });
    setSessionData(response.data.results); // Use response.data.results based on your sample JSON
  } catch (error) {
    console.error('Error fetching therapy data:', error);
  }
};

const sessiondetail = async () => {
  const res = await axios.get(`${UrlLink}OP/Session_Tracking_get`, {
    params: {
      request_id: TherapyWorkbenchNavigation.Request_Id
    }
  });
  setsessiondetails(res.data);
}




  useEffect(()=>{
    TherapyDetails();
    sessiondetail();
  },[]);


  const columns = [
    { key: 'Request_Id', name: 'Req ID' },
    { key: 'PatientName', name: 'Patient' },
    { key: 'Gender', name: 'Gender' },
    { key: 'Age', name: 'Age' },
    { key: 'Therapy_Name', name: 'Therapy' },
    { key: 'Doctor_Id', name: 'Doctor' },
    { key: 'total_sessions', name: 'Total Sessions' },
    { key: 'Sessions_Balance', name: 'Sessions Balance' },
    {
      key: 'Sessions_Completed',
      name: 'Sessions Completed',
     
    },
   
   
   
  ];

  const columns1 = [
    { key: 'session_id', name: 'Session ID' },
    { key: 'remarks', name: 'Remarks' },
    { key: 'Status', name: 'Status' },
    { key: 'next_review_date', name: 'Review date' },
    { key: 'created_at', name: 'Date and Time' },
    { key: 'created_by', name: 'Issued by' },
    
   
   
   
  ];

  return (
  <>
  <br />
  <br />
  <br />
    <div className="Main_container_app">
      {/* <h2>Therapist Workbench - Session Tracking</h2> */}
      <ReactGrid columns={columns} RowData={sessionData} />
      <ToastAlert Message={toast.message} Type={toast.type} />
      <ReactGrid columns={columns1} RowData={sessiondetails} />
    </div>
    </>
  );
};

export default TherapistSessionTracking;
