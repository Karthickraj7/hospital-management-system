
import React, { useState, useEffect } from 'react';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import AdvanceRequest from './AdvanceRequest';
import AddvaceStatus from './AdvanceStatus';
import AddvaceConsume from './AdvanceConsume';
import { useSelector } from 'react-redux';

function AdvanceNavigation( ) {

  const UrlLink = useSelector((state) => state.userRecord?.UrlLink);
  const userRecord = useSelector((state) => state.userRecord?.UserData);
  console.log("userRecord",userRecord);
  const [activeTab, setActiveTab] = useState('AdvanceForm');  
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
              <button onClick={() => handleTabChange('AdvanceForm')}>Advance Request Form</button>
              |
              <button onClick={() => handleTabChange('AdvanceStatus')}>Advance Status</button>
              |
              <button onClick={() => handleTabChange('AdvanceConsumed')}>Advance Consumed</button>
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
                <button onClick={() => handleTabChange('AdvanceForm')}>Advance Request Form</button>
              |
              <button onClick={() => handleTabChange('AdvanceStatus')}>Advance Status</button>
              |
              <button onClick={() => handleTabChange('AdvanceConsumed')}>Advance Consumed</button>
                </h2>
              </div>
            )}
          </div>
          </div>
        </div>
      </div>

      {activeTab === 'AdvanceForm' && <AdvanceRequest userRecord={userRecord} />}
      {activeTab === 'AdvanceStatus' && <AddvaceStatus userRecord={userRecord} />}
      {activeTab === 'AdvanceConsumed' && <AddvaceConsume userRecord={userRecord} />}

      
     
    </>
  );
}

export default AdvanceNavigation;


