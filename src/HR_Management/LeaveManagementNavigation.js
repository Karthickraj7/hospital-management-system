
import React, { useState, useEffect } from 'react';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import { useSelector } from 'react-redux';
import LeaveMangement from './LeaveMangement';
import LeaveApproval from './LeaveApproval';

function LeaveManagementNavigation() {

    const userRecord = useSelector(state => state.userRecord?.UserData)

    const [activeTab, setActiveTab] = useState('LeaveRequstList');
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
                            <button onClick={() => handleTabChange('LeaveRequstList')}>Leave Request List</button>
                            |
                            <button onClick={() => handleTabChange('LeaveConsumedList')}>Leave Consumed List</button>
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
                                        <button onClick={() => handleTabChange('LeaveRequstList')}>Leave Request List</button>
                                        |
                                        <button onClick={() => handleTabChange('LeaveConsumedList')}>Leave Consumed List</button>
                                    </h2>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {activeTab === 'LeaveRequstList' && <LeaveApproval userRecord={userRecord} />}
            {activeTab === 'LeaveConsumedList' && <LeaveMangement userRecord={userRecord} />}
           

        </>
    );
}

export default LeaveManagementNavigation;




