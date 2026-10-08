import React, { useState, useEffect } from 'react';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { useSelector } from 'react-redux';
import Complaint from './Complaint';
import Complainthistory from './Complainthistory';
const ComplaintManagement = () => {
      const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
        const userRecord = useSelector((state) => state.userRecord?.UserData);
        console.log("userRecord",userRecord);
        const toast = useSelector((state) => state.userRecord?.toast);
        const [activeTab, setActiveTab] = useState('Complaint');  
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
            <button onClick={() => handleTabChange('Complaint')}>Complaint Request Form</button>
            |
            <button onClick={() => handleTabChange('Complainthistory')}>Complaint History</button>

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
              <button onClick={() => handleTabChange('Complaint')}>Complaint</button>
            |
            <button onClick={() => handleTabChange('Complainthistory')}>Complaint History</button>

              </h2>
            </div>
          )}
        </div>
        </div>
      </div>
    </div>

    {activeTab === 'Complaint' && <Complaint userRecord={userRecord} />}
    {activeTab === 'Complainthistory' && <Complainthistory userRecord={userRecord} />}

    
   
  </>
  )
}

export default ComplaintManagement