import React from 'react';
import { useLocation } from 'react-router-dom';
import ApplicationForm from './ApplicationForm';
import GeneralStaffUndertaking from './GeneralStaffPrint';
import IDCardPage from './IDCardPage';
import StaffPersonalRecCheckList from './StaffPersonalRecCheckList';
// import TransferReferral from './TransferReferral';

function Documents() {
  const location = useLocation();
  const employeeId = location.state?.EmployeeId || null; 
  console.log('Documents - employeeId:', employeeId);

  return (
    <>
      <div>Documents</div>
      <ApplicationForm employeeId={employeeId} />
      <br />
      <GeneralStaffUndertaking />
      <br />
      <IDCardPage employeeId={employeeId} />
      <br />
      <StaffPersonalRecCheckList />
      <br />
      {/* <TransferReferral /> */}
      <br />
    </>
  );
}

export default Documents;