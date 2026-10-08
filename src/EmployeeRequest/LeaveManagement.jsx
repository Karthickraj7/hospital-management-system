import React, { useState, useEffect } from 'react';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import EmployeeLeave from './Leave';
import LeaveStatus from './LeaveStatus';
import LeaveConsume from './LeaveConsume';
import PermissionStatus from './PermissionStatus';
import { useSelector } from 'react-redux';
const LeaveManagement = () => {
    const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
    const userRecord = useSelector((state) => state.userRecord?.UserData);
    console.log("userRecord",userRecord);
    const toast = useSelector((state) => state.userRecord?.toast);
    const [activeTab, setActiveTab] = useState('LeaveForm');  
    const [isToggled, setIsToggled] = useState(false);
    const toggle = () => setIsToggled(!isToggled);

    const handleTabChange = (tab) => {
      setActiveTab(tab);
      closeToggle();
    };
    const closeToggle = () => {
        setIsToggled(false);
      };
    
      useEffect(() => {
        const handleBodyClick = (event) => {
          if (!event.target.closest('.new-kit')) {
            closeToggle();
          }
        };
        
    document.body.addEventListener('click', handleBodyClick);

    return () => {
      document.body.removeEventListener('click', handleBodyClick);
    };
  });

  return (
    <>
        
      <div className="new-patient-registration-form">
       
        <br />
        <div className="new-patient-registration-form1">
          <div className="new-navigation">
            <h2>
              <button onClick={() => handleTabChange('LeaveForm')}>Leave Request Form</button>
              |
              <button onClick={() => handleTabChange('LeaveStatus')}>Leave Status</button>
              |
              <button onClick={() => handleTabChange('PermissionStatus')}>Permission Status</button>
              |
              <button onClick={() => handleTabChange('LeaveConsumed')}>Leave Consumed</button>
            </h2>
          </div>

          <div className='new-kit '>
            <button className="new-tog" onClick={toggle}>
              {isToggled ? <ToggleOffIcon /> : <ToggleOnIcon />}
            </button>
         
          <div>
            {isToggled && (
              <div className="new-navigation-toggle">
                <h2>
                <button onClick={() => handleTabChange('LeaveForm')}>Leave Request Form</button>
              |
              <button onClick={() => handleTabChange('LeaveStatus')}>Leave Status</button>
              |
              <button onClick={() => handleTabChange('PermissionStatus')}>Permission Status</button>
              |
              <button onClick={() => handleTabChange('LeaveConsumed')}>Leave Consumed</button>
                </h2>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>

      {activeTab === 'LeaveForm' && <EmployeeLeave userRecord={userRecord} />}
      {activeTab === 'LeaveStatus' && <LeaveStatus userRecord={userRecord} />}
      {activeTab === 'PermissionStatus' && <PermissionStatus userRecord={userRecord} />}

      {activeTab === 'LeaveConsumed' && <LeaveConsume  userRecord={userRecord} />}
      
     
    </>
  )
}

export default LeaveManagement
